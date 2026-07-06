import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { verifyPaymentSignature } from "@/lib/razorpay";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planType } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: "Missing payment details" }, { status: 400 });
    }

    const isValid = verifyPaymentSignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValid) {
      return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
    }

    // Payment verified — update user plan in DB
    // TOOD: Update user's plan in database based on planType
    console.log(`[Razorpay] Payment verified: order=${razorpay_order_id} payment=${razorpay_payment_id} user=${session?.user?.email} plan=${planType}`);

    return NextResponse.json({ success: true, message: "Payment verified!" });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[Razorpay] Verification failed:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
