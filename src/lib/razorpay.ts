import Razorpay from "razorpay";

let instance: Razorpay | null = null;

export function getRazorpay(): Razorpay {
  if (!instance) {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
      throw new Error("Razorpay keys not configured");
    }
    instance = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
  }
  return instance;
}

export const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "";

// INR pricing — keep affordable for Indian market
export const RAZORPAY_PLANS: Record<string, { name: string; amount: number; currency: string }> = {
  starter: { name: "Starter Plan", amount: 79900, currency: "INR" },
  pro: { name: "Pro Plan", amount: 249900, currency: "INR" },
  agency: { name: "Agency Plan", amount: 849900, currency: "INR" },
};

export const RAZORPAY_PRODUCTS: Record<string, { name: string; amount: number; currency: string }> = {
  full_audit: { name: "Full Audit Report", amount: 399900, currency: "INR" },
  roast_pack_5: { name: "5 Roast Pack", amount: 149900, currency: "INR" },
  roast_pack_10: { name: "10 Roast Pack", amount: 249900, currency: "INR" },
  competitor_battle: { name: "Competitor Battle", amount: 129900, currency: "INR" },
};

export function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const crypto = require("crypto");
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
  return expected === signature;
}
