import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("paddle-signature") || "";

    // Verify webhook signature
    const webhookSecret = process.env.PADDLE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error("PADDLE_WEBHOOK_SECRET not set");
      return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
    }

    // Paddle webhook signature verification (HMAC-SHA256)
    // Format: ts=...;h1=...
    const sigParts = signature.split(";");
    const tsPart = sigParts.find((p) => p.startsWith("ts="));
    const h1Part = sigParts.find((p) => p.startsWith("h1="));
    if (!tsPart || !h1Part) {
      return NextResponse.json({ error: "Invalid signature format" }, { status: 400 });
    }

    const ts = tsPart.split("=")[1];
    const h1 = h1Part.split("=")[1];
    const signedPayload = `${ts}:${rawBody}`;
    const expectedHmac = crypto.createHmac("sha256", webhookSecret).update(signedPayload).digest("hex");

    if (h1 !== expectedHmac) {
      console.error("Webhook signature verification failed");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(rawBody);
    const eventType = event?.event_type;

    const { prisma } = await import("@/lib/prisma");

    switch (eventType) {
      case "subscription.created":
      case "subscription.updated":
      case "subscription.activated": {
        const sub = event?.data;
        const customerId = sub?.customer_id;
        const items = sub?.items || [];
        const priceId = items[0]?.price?.id;

        // Find user by paddle customer id or email
        const email = sub?.custom_data?.email || sub?.customer_email;
        if (email) {
          const user = await prisma.user.findUnique({ where: { email } });
          if (user) {
            // Determine plan from price ID
            const planEntry = Object.entries({
              starter: process.env.NEXT_PUBLIC_PADDLE_STARTER_PRICE_ID,
              pro: process.env.NEXT_PUBLIC_PADDLE_PRO_PRICE_ID,
              agency: process.env.NEXT_PUBLIC_PADDLE_AGENCY_PRICE_ID,
            }).find(([, id]) => id === priceId);

            if (planEntry) {
              await prisma.user.update({
                where: { id: user.id },
                data: {
                  plan: planEntry[0],
                  stripeCustomerId: customerId, // reuse field for paddle customer id
                },
              });

              await prisma.payment.create({
                data: {
                  userId: user.id,
                  amount: sub?.items?.[0]?.price?.unit_price?.amount || 0,
                  currency: sub?.currency_code || "usd",
                  type: "subscription",
                  stripePaymentId: sub?.id || customerId, // reuse field for paddle sub id
                  status: "completed",
                  plan: planEntry[0],
                },
              });
            }
          }
        }
        break;
      }

      case "subscription.canceled":
      case "subscription.past_due": {
        const sub = event?.data;
        const email = sub?.custom_data?.email || sub?.customer_email;
        if (email) {
          const user = await prisma.user.findUnique({ where: { email } });
          if (user) {
            await prisma.user.update({
              where: { id: user.id },
              data: { plan: "free" },
            });
          }
        }
        break;
      }

      case "transaction.completed":
      case "transaction.paid": {
        const txn = event?.data;
        const email = txn?.custom_data?.email || txn?.customer_email;
        const priceId = txn?.items?.[0]?.price?.id;

        if (email) {
          const user = await prisma.user.findUnique({ where: { email } });
          if (user) {
            // Check if it's a one-time product
            const oneTimeProducts: Record<string, string> = {
              [process.env.NEXT_PUBLIC_PADDLE_FULL_AUDIT_PRICE_ID || ""]: "full_audit",
              [process.env.NEXT_PUBLIC_PADDLE_ROAST_PACK_5_PRICE_ID || ""]: "roast_pack_5",
              [process.env.NEXT_PUBLIC_PADDLE_ROAST_PACK_10_PRICE_ID || ""]: "roast_pack_10",
              [process.env.NEXT_PUBLIC_PADDLE_COMPETITOR_BATTLE_PRICE_ID || ""]: "competitor_battle",
            };

            const productType = oneTimeProducts[priceId];
            if (productType) {
              await prisma.payment.create({
                data: {
                  userId: user.id,
                  amount: txn?.details?.totals?.total || 0,
                  currency: txn?.currency_code || "usd",
                  type: "one_time",
                  stripePaymentId: txn?.id, // reuse field for paddle txn id
                  status: "completed",
                },
              });

              // Add roast credits based on product type
              const creditMap: Record<string, number> = {
                roast_pack_5: 5,
                roast_pack_10: 10,
                full_audit: 1,
                competitor_battle: 1,
              };
              const credits = creditMap[productType] || 0;
              if (credits > 0) {
                await prisma.user.update({
                  where: { id: user.id },
                  data: { balance: { increment: credits } },
                });
              }
            }
          }
        }
        break;
      }

      default:
        // Unhandled event type — acknowledge receipt
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("Paddle webhook error:", msg);
    // Still return 200 so Paddle doesn't retry indefinitely
    return NextResponse.json({ received: true, error: msg });
  }
}
