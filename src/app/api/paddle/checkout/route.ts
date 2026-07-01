import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PLANS } from "@/lib/paddle";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { priceId, productType } = await req.json();
    if (!priceId) {
      return NextResponse.json({ error: "priceId required" }, { status: 400 });
    }

    // Return checkout URL — Paddle.js handles the overlay on the client side
    // The client uses NEXT_PUBLIC_PADDLE_CLIENT_TOKEN + Paddle.js to open checkout
    const paddleEnv = process.env.NEXT_PUBLIC_PADDLE_ENV || "sandbox";
    const checkoutBase = paddleEnv === "sandbox"
      ? "https://sandbox-checkout.paddle.com/checkout"
      : "https://checkout.paddle.com/checkout";

    return NextResponse.json({
      url: `${checkoutBase}?priceId=${priceId}`,
      priceId,
      productType: productType || "subscription",
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: `Checkout failed: ${msg}` }, { status: 500 });
  }
}
