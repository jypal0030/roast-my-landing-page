import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookSignature, getPlanByPriceId, getProductByPriceId, REFERRAL_COMMISSIONS } from "@/lib/paddle";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let event: Record<string, any> | null = null;

  try {
    const rawBody = await req.text();
    const signature = req.headers.get("paddle-signature") || "";

    // Verify webhook signature using Paddle SDK
    const verified = verifyWebhookSignature(rawBody, signature);
    if (!verified) {
      console.error("[Webhook] Signature verification failed");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    event = verified;
    const eventType = event?.event_type || event?.eventType;
    console.log(`[Webhook] Received: ${eventType}`);

    const { prisma } = await import("@/lib/prisma");

    // ============================================================
    //  SUBSCRIPTION EVENTS
    // ============================================================

    if (
      eventType === "subscription.created" ||
      eventType === "subscription.updated" ||
      eventType === "subscription.activated"
    ) {
      const data = event?.data;
      const email = data?.custom_data?.email || data?.customer_email;
      const items = data?.items || [];
      const priceId = items[0]?.price?.id;
      const subId = data?.id;
      const status = data?.status;

      if (!email || !priceId) {
        console.log("[Webhook] Missing email or priceId, skipping subscription update");
      } else {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
          console.log(`[Webhook] User not found for email: ${email}`);
        } else {
          // Determine plan from price ID
          const planName = getPlanByPriceId(priceId) || "free";

          // Update user plan
          await prisma.user.update({
            where: { id: user.id },
            data: {
              plan: planName,
              paddleCustomerId: data?.customer_id || null,
            },
          });

          // Record payment
          const amount = items[0]?.price?.unit_price?.amount || 0;
          const currency = data?.currency_code || "usd";

          await prisma.payment.create({
            data: {
              userId: user.id,
              amount: parseFloat(amount) / 100 || 0, // Paddle sends amount in cents
              currency,
              type: "subscription",
              stripePaymentId: subId || `sub_${Date.now()}`,
              status: status === "active" ? "completed" : "pending",
              plan: planName,
            },
          });

          // --- Referral Commission ---
          await processReferralCommission(prisma, user, parseFloat(amount) / 100, planName);

          console.log(`[Webhook] User ${email} upgraded to ${planName}`);
        }
      }
    }

    // ============================================================
    //  SUBSCRIPTION CANCELLATION
    // ============================================================
    else if (
      eventType === "subscription.canceled" ||
      eventType === "subscription.past_due" ||
      eventType === "subscription.paused"
    ) {
      const data = event?.data;
      const email = data?.custom_data?.email || data?.customer_email;

      if (email) {
        const user = await prisma.user.findUnique({ where: { email } });
        if (user) {
          await prisma.user.update({
            where: { id: user.id },
            data: { plan: "free" },
          });
          console.log(`[Webhook] User ${email} downgraded to free`);
        }
      }
    }

    // ============================================================
    //  TRANSACTION / ONE-TIME PURCHASE
    // ============================================================
    else if (
      eventType === "transaction.completed" ||
      eventType === "transaction.paid"
    ) {
      const data = event?.data;
      const email = data?.custom_data?.email || data?.customer_email;
      const items = data?.items || [];
      const priceId = items[0]?.price?.id;
      const transactionId = data?.id;

      if (email && priceId) {
        const user = await prisma.user.findUnique({ where: { email } });
        if (user) {
          const product = getProductByPriceId(priceId);
          const amount = data?.details?.totals?.total || "0";
          const currency = data?.currency_code || "usd";

          await prisma.payment.create({
            data: {
              userId: user.id,
              amount: parseFloat(amount) / 100 || 0,
              currency,
              type: "one_time",
              stripePaymentId: transactionId || `txn_${Date.now()}`,
              status: "completed",
            },
          });

          // Grant credits for roast packs
          if (product?.credits) {
            await prisma.user.update({
              where: { id: user.id },
              data: { balance: { increment: product.credits } },
            });
          }

          // --- Referral Commission ---
          await processReferralCommission(prisma, user, parseFloat(amount) / 100, "one_time");

          console.log(`[Webhook] One-time purchase by ${email}: ${product?.name || priceId}`);
        }
      }
    }

    // ============================================================
    //  OTHER EVENTS — acknowledge, don't process
    // ============================================================
    else {
      console.log(`[Webhook] Unhandled event type: ${eventType} — acknowledged`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[Webhook] Processing error:", msg);
    // Always return 200 so Paddle doesn't keep retrying
    return NextResponse.json({ received: true, processingError: msg.slice(0, 200) });
  }
}

// ============================================================
//  REFERRAL COMMISSION LOGIC
// ============================================================
async function processReferralCommission(
  prisma: any,
  user: { id: string; referredBy?: string | null },
  amount: number,
  planOrProduct: string
) {
  try {
    if (!user.referredBy || amount <= 0) return;

    // Find the referrer
    const referrer = await prisma.user.findUnique({
      where: { id: user.referredBy },
    });

    if (!referrer) return;

    const referrerPlan = referrer.plan || "free";
    const commission = REFERRAL_COMMISSIONS[referrerPlan] || REFERRAL_COMMISSIONS.free;
    const level1Rate = commission.rates[0] || 0.15;
    const commissionAmount = Math.round(amount * level1Rate * 100) / 100;

    if (commissionAmount > 0) {
      await prisma.user.update({
        where: { id: referrer.id },
        data: { balance: { increment: commissionAmount } },
      });

      await prisma.payment.create({
        data: {
          userId: referrer.id,
          amount: commissionAmount,
          currency: "usd",
          type: "referral",
          stripePaymentId: `ref_${user.id}_${Date.now()}`,
          status: "completed",
        },
      });

      console.log(`[Referral] Paid $${commissionAmount} to referrer ${referrer.email}`);
    }

    // Level 2 referral (if referrer was also referred)
    if (commission.levels >= 2 && referrer.referredBy) {
      const level2Referrer = await prisma.user.findUnique({
        where: { id: referrer.referredBy },
      });
      if (level2Referrer) {
        const level2Plan = level2Referrer.plan || "free";
        const level2Commission = REFERRAL_COMMISSIONS[level2Plan] || REFERRAL_COMMISSIONS.free;
        const level2Rate = level2Commission.rates[1] || 0;
        const level2Amount = Math.round(amount * level2Rate * 100) / 100;

        if (level2Amount > 0) {
          await prisma.user.update({
            where: { id: level2Referrer.id },
            data: { balance: { increment: level2Amount } },
          });
          console.log(`[Referral L2] Paid $${level2Amount} to ${level2Referrer.email}`);
        }
      }
    }
  } catch (err) {
    console.error("[Referral] Commission processing failed:", err);
  }
}
