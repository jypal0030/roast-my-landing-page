import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getPlanPriceId, getCheckoutUrl, ONE_TIME_PRODUCTS } from "@/lib/paddle";

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
    let checkoutType = "";

    // Resolve price ID from plan/product type or use direct price ID
    if (directPriceId) {
      priceId = directPriceId;
      checkoutType = "direct";
    } else if (planType) {
      priceId = getPlanPriceId(planType);
      checkoutType = `plan:${planType}`;
    } else if (productType) {
      const product = ONE_TIME_PRODUCTS[productType];
      priceId = product?.priceId || null;
      checkoutType = `product:${productType}`;
    }

    if (!priceId) {
      return NextResponse.json(
        { error: "This product isn't available yet. Check back soon!" },
        { status: 400 }
      );
    }

    const checkoutUrl = getCheckoutUrl(priceId, session.user.email);
    const env = process.env.NEXT_PUBLIC_PADDLE_ENV || "sandbox";

    console.log(`[Checkout] user=${session.user.email} type=${checkoutType} priceId=${priceId} env=${env}`);

    return NextResponse.json({
      url: checkoutUrl,
      priceId,
      env,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[Checkout] Error:", msg);
    return NextResponse.json({ error: `Checkout failed: ${msg}` }, { status: 500 });
  }
}
