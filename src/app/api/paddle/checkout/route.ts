import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getPlanPriceId, ONE_TIME_PRODUCTS, PADDLE_CLIENT_TOKEN } from "@/lib/paddle";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Please sign in to purchase" }, { status: 401 });
    }

    const body = await req.json();
    const { planType, productType, priceId: directPriceId } = body;

    let priceId: string | null = null;

    if (directPriceId) {
      priceId = directPriceId;
    } else if (planType) {
      priceId = getPlanPriceId(planType);
    } else if (productType) {
      const product = ONE_TIME_PRODUCTS[productType];
      priceId = product?.priceId || null;
    }

    if (!priceId) {
      return NextResponse.json(
        { error: "This product isn't available yet. Check back soon!" },
        { status: 400 }
      );
    }

    // Return priceId + client token for Paddle.js checkout (no Default Payment Link needed)
    return NextResponse.json({
      priceId,
      clientToken: PADDLE_CLIENT_TOKEN,
      env: process.env.NEXT_PUBLIC_PADDLE_ENV || "sandbox",
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[Checkout] Error:", msg);
    return NextResponse.json({ error: `Checkout failed: ${msg}` }, { status: 500 });
  }
}
