import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PLANS, ONE_TIME_PRODUCTS } from "@/lib/paddle";

export const dynamic = "force-dynamic";

// Map plan/product type names to their price IDs
const PLAN_PRICE_MAP: Record<string, string | undefined | null> = {
  starter: PLANS.starter.priceId,
  pro: PLANS.pro.priceId,
  agency: PLANS.agency.priceId,
};

const PRODUCT_PRICE_MAP: Record<string, string | undefined | null> = {
  full_audit: ONE_TIME_PRODUCTS.full_audit.priceId,
  roast_pack_5: ONE_TIME_PRODUCTS.roast_pack_5.priceId,
  roast_pack_10: ONE_TIME_PRODUCTS.roast_pack_10.priceId,
  competitor_battle: ONE_TIME_PRODUCTS.competitor_battle.priceId,
};

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Please sign in to purchase" }, { status: 401 });
    }

    const body = await req.json();
    let priceId: string | undefined;

    // Accept both {priceId} and {planType}/{productType}
    if (body.priceId) {
      priceId = body.priceId;
    } else if (body.planType) {
      priceId = PLAN_PRICE_MAP[body.planType] || undefined;
    } else if (body.productType) {
      priceId = PRODUCT_PRICE_MAP[body.productType] || undefined;
    }

    if (!priceId) {
      const requestedType = body.planType || body.productType || "unknown";
      return NextResponse.json(
        { error: "Plan/product not configured yet. Please try again later." },
        { status: 400 }
      );
    }

    const paddleEnv = process.env.NEXT_PUBLIC_PADDLE_ENV || "sandbox";
    const checkoutBase = paddleEnv === "sandbox"
      ? "https://sandbox-checkout.paddle.com/checkout"
      : "https://checkout.paddle.com/checkout";

    console.log(`Checkout: user=${session.user.email}, priceId=${priceId}, type=${body.planType || body.productType || "direct"}, env=${paddleEnv}`);

    return NextResponse.json({
      url: `${checkoutBase}?priceId=${priceId}`,
      priceId,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: `Checkout failed: ${msg}` }, { status: 500 });
  }
}
