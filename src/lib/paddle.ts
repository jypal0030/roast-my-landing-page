// Paddle integration — Merchant of Record (handles global tax, works instantly in India)

export const PADDLE_ENV = process.env.NEXT_PUBLIC_PADDLE_ENV || "sandbox";
export const PADDLE_CLIENT_TOKEN = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN!;
export const PADDLE_API_KEY = process.env.PADDLE_API_KEY!;
export const PADDLE_WEBHOOK_SECRET = process.env.PADDLE_WEBHOOK_SECRET!;

export const PLANS = {
  free: {
    name: "Free",
    price: 0,
    priceId: undefined as string | undefined,
    roastsPerDay: 1,
    features: [
      "1 roast per day",
      "Basic roast card",
      "Branded watermark",
      "Share to social media",
      "15% Level-1 referral commission",
    ],
  },
  starter: {
    name: "Starter",
    price: 9,
    priceId: process.env.NEXT_PUBLIC_PADDLE_STARTER_PRICE_ID,
    roastsPerDay: 5,
    features: [
      "5 roasts per day",
      "Clean roast cards (no watermark)",
      "Full money loss calculator",
      "Download roast as image",
      "20% referral commission (2 levels)",
      "Roast history",
    ],
  },
  pro: {
    name: "Pro",
    price: 29,
    priceId: process.env.NEXT_PUBLIC_PADDLE_PRO_PRICE_ID,
    roastsPerDay: 20,
    features: [
      "20 roasts per day",
      "Competitor Battle mode",
      "Advanced analytics dashboard",
      "Priority AI processing",
      "25% referral commission (3 levels)",
      "Export reports as PDF",
    ],
  },
  agency: {
    name: "Agency",
    price: 99,
    priceId: process.env.NEXT_PUBLIC_PADDLE_AGENCY_PRICE_ID,
    roastsPerDay: 100,
    features: [
      "100 roasts per day",
      "White-label reports",
      "API access",
      "Bulk roast processing",
      "30% referral commission (3 levels)",
      "Dedicated support",
    ],
  },
};

export const ONE_TIME_PRODUCTS: Record<string, { name: string; price: number; priceId: string | undefined; description: string }> = {
  full_audit: {
    name: "Full Audit Report",
    price: 49,
    priceId: process.env.NEXT_PUBLIC_PADDLE_FULL_AUDIT_PRICE_ID,
    description: "Complete deep-dive analysis with all fixes",
  },
  roast_pack_5: {
    name: "5 Roast Pack",
    price: 19,
    priceId: process.env.NEXT_PUBLIC_PADDLE_ROAST_PACK_5_PRICE_ID,
    description: "5 website roasts, use anytime",
  },
  roast_pack_10: {
    name: "10 Roast Pack",
    price: 29,
    priceId: process.env.NEXT_PUBLIC_PADDLE_ROAST_PACK_10_PRICE_ID,
    description: "10 website roasts, use anytime",
  },
  competitor_battle: {
    name: "Competitor Battle",
    price: 15,
    priceId: process.env.NEXT_PUBLIC_PADDLE_COMPETITOR_BATTLE_PRICE_ID,
    description: "Head-to-head website comparison roast",
  },
};

export const REFERRAL_COMMISSIONS: Record<string, { levels: number; rates: number[] }> = {
  free: { levels: 1, rates: [0.15] },
  starter: { levels: 2, rates: [0.20, 0.10] },
  pro: { levels: 3, rates: [0.25, 0.10, 0.05] },
  agency: { levels: 3, rates: [0.30, 0.10, 0.05] },
};

/** Get priceId from plan type name — returns null if not yet configured in Paddle */
export function getPlanPriceId(planType: string): string | null {
  const plan = PLANS[planType as keyof typeof PLANS];
  if (!plan?.priceId) return null;
  return plan.priceId;
}

/** Get priceId from product type name — returns null if not yet configured */
export function getProductPriceId(productType: string): string | null {
  const product = ONE_TIME_PRODUCTS[productType];
  if (!product?.priceId) return null;
  return product.priceId;
}
