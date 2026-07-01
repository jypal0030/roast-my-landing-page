import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { distributeCommissions } from "@/lib/referral";
import crypto from "crypto";

function verifyPaddleSignature(payload: string, sigHeader: string, ts: string): boolean {
  const secret = process.env.PADDLE_WEBHOOK_SECRET!;
  const hmac = crypto.createHmac("sha256", secret).update(`${ts}:${payload}`).digest("hex");
  const sigs = sigHeader.split(";").filter(s => s.startsWith("h1=")).map(s => s.replace("h1=", ""));
  return sigs.some(s => { try { return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(s)); } catch { return false; } });
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sigHeader = req.headers.get("paddle-signature") || "";
  const ts = req.headers.get("paddle-timestamp") || "";

  if (!verifyPaddleSignature(body, sigHeader, ts)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    const event = JSON.parse(body);
    const et = event.event_type;

    if (et === "transaction.completed") {
      const tx = event.data;
      const cd = tx.custom_data || {};
      const userId = cd.userId;
      if (!userId) return NextResponse.json({ received: true });

      const amount = parseFloat(tx.details?.totals?.total || "0") / 100;
      const planType = cd.planType;
      const productType = cd.productType;

      await prisma.payment.create({
        data: {
          userId,
          amount: amount * 85, // convert to INR approx
          currency: tx.currency_code || "USD",
          type: planType ? "subscription" : productType || "one_time",
          stripePaymentId: tx.id,
          status: "completed",
          plan: planType || undefined,
        },
      });

      if (planType) {
        await prisma.user.update({ where: { id: userId }, data: { plan: planType } });
      }

      await distributeCommissions(amount * 85, userId);
    }

    if (et === "subscription.canceled" || et === "subscription.past_due") {
      const cd = event.data.custom_data || {};
      if (cd.userId) {
        await prisma.user.update({ where: { id: cd.userId }, data: { plan: "free" } });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Paddle webhook error:", error);
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }
}
