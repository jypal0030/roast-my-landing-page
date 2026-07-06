import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getRazorpay, RAZORPAY_KEY_ID, RAZORPAY_PLANS, RAZORPAY_PRODUCTS } from "@/lib/razorpay";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Please sign in to purchase" }, { status: 401 });
    }

    const body = await req.json();
    const { planType, productType } = body;

    // Resolve plan/product pricing
    let item: { name: string; amount: number; currency: string } | undefined;

    if (planType) {
      item = RAZORPAY_PLANS[planType];
    } else if (productType) {
      item = RAZORPAY_PRODUCTS[productType];
    }

    if (!item) {
      return NextResponse.json({ error: "Invalid plan or product" }, { status: 400 });
    }

    const razorpay = getRazorpay();
    const order = await razorpay.orders.create({
      amount: item.amount,
      currency: item.currency,
      receipt: `rcpt_${Date.now()}_${session.user.email?.substring(0, 20)}`,
      notes: {
        email: session.user.email,
        planType: planType || productType,
        userId: session.user.id || "",
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: RAZORPAY_KEY_ID,
      planName: item.name,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[Razorpay] Order creation failed:", msg);
    return NextResponse.json({ error: `Payment setup failed: ${msg}` }, { status: 500 });
  }
}
