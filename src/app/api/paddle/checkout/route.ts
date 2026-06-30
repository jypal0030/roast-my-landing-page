import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PADDLE_API_KEY, PADDLE_ENV, PLANS, ONE_TIME_PRODUCTS } from "@/lib/paddle";

const PADDLE_API_BASE = PADDLE_ENV === "production"
  ? "https://api.paddle.com"
  : "https://sandbox-api.paddle.com";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Please sign in first" }, { status: 401 });
    }

    const { productType, planType } = await req.json();
    let priceId: string | undefined;
    let items: Array<{ priceId: string; quantity: number }> = [];

    if (planType) {
      const plan = PLANS[planType as keyof typeof PLANS];
      if (!plan?.priceId) {
        return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
      }
      priceId = plan.priceId;
      items = [{ priceId, quantity: 1 }];
    } else if (productType) {
      const product = ONE_TIME_PRODUCTS[productType];
      if (!product?.priceId) {
        return NextResponse.json({ error: "Invalid product" }, { status: 400 });
      }
      priceId = product.priceId;
      items = [{ priceId, quantity: 1 }];
    } else {
      return NextResponse.json({ error: "Product or plan type required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { email: true, name: true },
    });

    const paddlePayload: Record<string, unknown> = {
      items,
      customer: {
        email: user?.email || session.user.email,
        name: user?.name || session.user.name || undefined,
      },
      custom_data: {
        userId: session.user.id,
        productType: productType || "",
        planType: planType || "",
      },
    };

    if (planType) {
      paddlePayload.subscription = { proration_billing_mode: "prorated_immediately" };
    }

    const response = await fetch(`${PADDLE_API_BASE}/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${PADDLE_API_KEY}`,
      },
      body: JSON.stringify(paddlePayload),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Paddle API error:", result);
      return NextResponse.json(
        { error: result.error?.detail || "Payment setup failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      url: result.data?.checkout?.url || null,
      transactionId: result.data?.id,
    });
  } catch (error) {
    console.error("Paddle checkout error:", error);
    return NextResponse.json({ error: "Payment setup failed" }, { status: 500 });
  }
}
