import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { priceId } = await req.json();

    // Paddle checkout URL — uses client-side Paddle.js for the checkout flow
    // The price IDs are exposed via NEXT_PUBLIC env vars on the frontend
    return NextResponse.json({
      url: `https://buy.paddle.com/checkout?priceId=${priceId}`,
    });
  } catch (error) {
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}
