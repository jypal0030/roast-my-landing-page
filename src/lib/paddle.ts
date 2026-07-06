// Paddle Billing integration — using @paddle/paddle-node-sdk
import { Paddle, Environment, Webhooks } from "@paddle/paddle-node-sdk";

// --- Environment detection ---
const isSandbox = process.env.NEXT_PUBLIC_PADDLE_ENV === "sandbox";

// --- Paddle client (server-side only) ---
function getPaddleClient(): Paddle {
  const apiKey = process.env.PADDLE_SECRET_KEY;
  if (!apiKey) throw new Error("PADDLE_SECRET_KEY not configured");
  return new Paddle(apiKey, {
    environment: isSandbox ? Environment.sandbox : Environment.production,
  });
}

// --- Exported constants ---
export const PADDLE_CLIENT_TOKEN = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN || "";
export const PADDLE_WEBHOOK_SECRET = process.env.PADDLE_WEBHOOK_SECRET || "";
export const PADDLE_VENDOR_ID = process.env.PADDLE_VENDOR_ID || "";

// ============================================================
//  PLANS (Subscriptions)
// ============================================================

export interface PlanConfig {
  name: string;
  price: number;
  priceId: string | null;           // Paddle Price ID
  roastsPerDay: number;
  features: string[];
}

export const PLANS: Record<string, PlanConfig> = {
  free: {
    name: "Free",
    price: 0,
    priceId: null,
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
    priceId: process.env.PADDLE_STARTER_PRICE_ID || null,
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
    priceId: process.env.PADDLE_PRO_PRICE_ID || null,
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
    priceId: process.env.PADDLE_AGENCY_PRICE_ID || null,
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

// ============================================================
//  ONE-TIME PRODUCTS
// ============================================================

export interface OneTimeProduct {
  name: string;
  price: number;
  priceId: string | null;
  description: string;
  credits: number;  // how many roasts/features it unlocks
}

export const ONE_TIME_PRODUCTS: Record<string, OneTimeProduct> = {
  full_audit: {
    name: "Full Audit Report",
    price: 49,
    priceId: process.env.PADDLE_FULL_AUDIT_PRICE_ID || null,
    description: "Complete deep-dive analysis with all fixes",
    credits: 1,
  },
  roast_pack_5: {
    name: "5 Roast Pack",
    price: 19,
    priceId: process.env.PADDLE_ROAST_PACK_5_PRICE_ID || null,
    description: "5 website roasts, use anytime, no expiry",
    credits: 5,
  },
  roast_pack_10: {
    name: "10 Roast Pack",
    price: 29,
    priceId: process.env.PADDLE_ROAST_PACK_10_PRICE_ID || null,
    description: "10 website roasts — perfect for client work",
    credits: 10,
  },
  competitor_battle: {
    name: "Competitor Battle",
    price: 15,
    priceId: process.env.PADDLE_COMPETITOR_BATTLE_PRICE_ID || null,
    description: "Head-to-head website comparison roast",
    credits: 1,
  },
};

// ============================================================
//  REFERRAL COMMISSIONS
// ============================================================

export const REFERRAL_COMMISSIONS: Record<string, { levels: number; rates: number[] }> = {
  free:    { levels: 1, rates: [0.15] },
  starter: { levels: 2, rates: [0.20, 0.10] },
  pro:     { levels: 3, rates: [0.25, 0.10, 0.05] },
  agency:  { levels: 3, rates: [0.30, 0.10, 0.05] },
};

// ============================================================
//  HELPERS
// ============================================================

/** Get paddle client — throws if key not configured */
export function paddle() {
  return getPaddleClient();
}

/** Get priceId from plan type name. Returns null if not yet configured in Paddle. */
export function getPlanPriceId(planType: string): string | null {
  const plan = PLANS[planType as keyof typeof PLANS];
  return plan?.priceId || null;
}

/** Get product config from priceId */
export function getProductByPriceId(priceId: string): OneTimeProduct | undefined {
  return Object.values(ONE_TIME_PRODUCTS).find((p) => p.priceId === priceId);
}

/** Get plan name from priceId */
export function getPlanByPriceId(priceId: string): string | undefined {
  const entry = Object.entries(PLANS).find(([, plan]) => plan.priceId === priceId);
  return entry?.[0];
}

/** Get product type key from priceId */
export function getProductTypeByPriceId(priceId: string): string | undefined {
  const entry = Object.entries(ONE_TIME_PRODUCTS).find(([, p]) => p.priceId === priceId);
  return entry?.[0];
}

/** Construct Paddle checkout URL for a price */
export function getCheckoutUrl(priceId: string, customerEmail?: string): string {
  const base = isSandbox
    ? "https://sandbox-checkout.paddle.com/checkout"
    : "https://checkout.paddle.com/checkout";
  
  const params = new URLSearchParams();
  params.set("priceId", priceId);
  if (customerEmail) params.set("email", customerEmail);
  
  return `${base}?${params.toString()}`;
}

/** Verify Paddle webhook signature using the SDK */
export async function verifyWebhookSignature(rawBody: string, signature: string): Promise<Record<string, unknown> | null> {
  try {
    if (!PADDLE_WEBHOOK_SECRET) {
      console.error("PADDLE_WEBHOOK_SECRET not configured");
      return null;
    }
    const webhooks = new Webhooks();
    const webhookData = await webhooks.unmarshal(rawBody, PADDLE_WEBHOOK_SECRET, signature);
    return webhookData as unknown as Record<string, unknown>;
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return null;
  }
}
