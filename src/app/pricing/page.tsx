"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Check, X, Flame, Zap, Crown, Building2, Sparkles, Shield, Infinity, ArrowRight, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { CountUp } from "@/components/CountUp";
import { FireParticles } from "@/components/FireParticles";
import { PLANS } from "@/lib/paddle";

// ============================================================
// DATA
// ============================================================

const tiers = [
  {
    name: "Free",
    icon: Flame,
    monthlyPrice: 0,
    yearlyPrice: 0,
    period: "forever",
    description: "Get a taste of the roast",
    features: [
      { text: "1 roast per day", included: true },
      { text: "Basic roast card", included: true },
      { text: "Branded watermark", included: true },
      { text: "Share to social media", included: true },
      { text: "Money loss calculator", included: false },
      { text: "Competitor Battle mode", included: false },
      { text: "Download roast as image", included: false },
      { text: "API access", included: false },
      { text: "White-label reports", included: false },
      { text: "Priority AI processing", included: false },
    ],
    cta: "Start Free",
    planType: null,
    highlight: false,
  },
  {
    name: "Starter",
    icon: Zap,
    monthlyPrice: 9,
    yearlyPrice: 7,
    period: "/month",
    description: "For indie hackers shipping fast",
    features: [
      { text: "5 roasts per day", included: true },
      { text: "Clean cards (no watermark)", included: true },
      { text: "Full money loss calculator", included: true },
      { text: "Download roast as image", included: true },
      { text: "Roast history", included: true },
      { text: "20% referral (2 levels)", included: true },
      { text: "Competitor Battle mode", included: false },
      { text: "API access", included: false },
      { text: "White-label reports", included: false },
      { text: "Priority AI processing", included: false },
    ],
    cta: "Get Starter",
    planType: "starter",
    highlight: false,
  },
  {
    name: "Pro",
    icon: Crown,
    monthlyPrice: 29,
    yearlyPrice: 23,
    period: "/month",
    description: "For serious founders & freelancers",
    features: [
      { text: "20 roasts per day", included: true },
      { text: "Competitor Battle mode", included: true },
      { text: "Advanced analytics dashboard", included: true },
      { text: "Priority AI processing", included: true },
      { text: "Export reports as PDF", included: true },
      { text: "25% referral (3 levels)", included: true },
      { text: "Download roast as image", included: true },
      { text: "Full money loss calculator", included: true },
      { text: "API access", included: false },
      { text: "White-label reports", included: false },
    ],
    cta: "Go Pro",
    planType: "pro",
    highlight: true,
    badge: "MOST POPULAR",
  },
  {
    name: "Agency",
    icon: Building2,
    monthlyPrice: 99,
    yearlyPrice: 79,
    period: "/month",
    description: "For agencies & power users",
    features: [
      { text: "100 roasts per day", included: true },
      { text: "White-label reports", included: true },
      { text: "API access", included: true },
      { text: "Bulk roast processing", included: true },
      { text: "Dedicated support", included: true },
      { text: "30% referral (3 levels)", included: true },
      { text: "Export reports as PDF", included: true },
      { text: "Competitor Battle mode", included: true },
      { text: "Advanced analytics dashboard", included: true },
      { text: "Priority AI processing", included: true },
    ],
    cta: "Go Agency",
    planType: "agency",
    highlight: false,
  },
];

const oneTimeProducts = [
  { name: "Full Audit Report", price: 49, desc: "Deep dive analysis with all fixes & recommendations", icon: Sparkles, badge: "BEST VALUE" },
  { name: "5 Roast Pack", price: 19, desc: "5 website roasts, use anytime, no expiry", icon: Zap },
  { name: "10 Roast Pack", price: 29, desc: "10 website roasts — perfect for client work", icon: Flame },
  { name: "Competitor Battle", price: 15, desc: "Head-to-head website roast comparison", icon: Crown },
];

const faqs = [
  { q: "Can I switch plans anytime?", a: "Absolutely. Upgrade or downgrade at any time. We'll prorate your billing automatically — no penalties, no questions asked." },
  { q: "Is there a money-back guarantee?", a: "Yes. If you're not satisfied within 7 days of any paid plan, we'll refund you in full. No hoops. Just email us." },
  { q: "What payment methods do you accept?", a: "We use Paddle as our Merchant of Record, so you can pay with all major credit/debit cards, Apple Pay, Google Pay, PayPal, and most local payment methods. Paddle also handles global tax/VAT automatically." },
  { q: "Do the roast packs expire?", a: "Never. Every roast pack you purchase is yours forever. Use them this week, next month, or next year." },
  { q: "How does the referral program work with pricing?", a: "Your plan determines your commission rates. Free plan earns 15% on Level 1. Agency plan earns 30% across 3 levels. Higher plan = higher commission rates." },
];

const paymentMethods = ["Visa", "Mastercard", "Amex", "Apple Pay", "Google Pay", "PayPal"];

// ============================================================
// 3D TILT CARD
// ============================================================

function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 20 });
  const springY = useSpring(y, { stiffness: 200, damping: 20 });
  const rotateX = useTransform(springY, [-0.5, 0.5], ["3deg", "-3deg"]);
  const rotateY = useTransform(springX, [-0.5, 0.5], ["-3deg", "3deg"]);

  const handleMouse = (e: React.MouseEvent) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 1200 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function PricingPage() {
  const { data: session } = useSession();
  const [isYearly, setIsYearly] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [showCompare, setShowCompare] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [roastCount, setRoastCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((d) => setRoastCount(d.roastCount ?? 0))
      .catch(() => {});
  }, []);

  const handleCheckout = async (type: string, isPlan: boolean) => {
    if (!session) { toast.error("Please sign in to purchase"); return; }
    setLoading(type);
    try {
      const body = isPlan ? { planType: type } : { productType: type };
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!data.orderId) { toast.error(data.error || "Something went wrong"); return; }

      const RazorpayCheckout = (window as any).Razorpay;
      if (!RazorpayCheckout) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = () => resolve();
          script.onerror = () => reject(new Error("Razorpay load failed"));
          document.head.appendChild(script);
        });
      }

      const rzp = new (window as any).Razorpay({
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "Roast My Landing Page",
        description: data.planName,
        order_id: data.orderId,
        prefill: { email: session.user?.email },
        theme: { color: "#EF4444" },
        handler: async (response: any) => {
          toast.success("Payment successful! 🎉");
          await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              planType: type,
            }),
          });
        },
        modal: { ondismiss: () => { toast("Payment cancelled"); } },
      });
      rzp.open();
    } catch { toast.error("Payment setup failed"); }
    finally { setLoading(null); }
  };

  return (
    <div className="relative">
      <FireParticles />

      {/* ============================================================ */}
      {/* HERO */}
      {/* ============================================================ */}
      <section className="relative px-4 pt-24 pb-12 sm:pt-32 sm:pb-16">
        {/* Background orbs */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-fire-500/5 blur-3xl" />
          <div className="absolute top-1/3 right-0 w-[400px] h-[400px] rounded-full bg-ember-500/5 blur-3xl" />
        </div>

        <div className="mx-auto max-w-4xl text-center">
          {/* Micro-label */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-display tracking-[0.2em] text-fire-500 mb-4"
          >
            PRICING
          </motion.p>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0, 0, 0.2, 1] }}
            className="font-display text-4xl sm:text-6xl md:text-7xl text-white uppercase leading-[1] tracking-[-0.03em] mb-4"
          >
            STOP LOSING MONEY.
            <br />
            <span className="bg-gradient-to-r from-fire-400 via-fire-500 to-amber-400 bg-clip-text text-transparent">
              START ROASTING.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-ash-300 max-w-xl mx-auto mb-8"
          >
            Your website problem is costing you thousands. The fix costs less than lunch.
          </motion.p>

          {/* Monthly / Yearly Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="inline-flex items-center gap-3 bg-ash-800/80 border border-white/[0.06] rounded-full p-1 backdrop-blur"
          >
            <button
              onClick={() => setIsYearly(false)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                !isYearly ? "bg-fire-500 text-white shadow-[0_0_20px_rgba(233,69,96,0.25)]" : "text-ash-400 hover:text-white"
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2",
                isYearly ? "bg-fire-500 text-white shadow-[0_0_20px_rgba(233,69,96,0.25)]" : "text-ash-400 hover:text-white"
              )}
            >
              Yearly
              <span className={cn(
                "text-[10px] font-bold rounded-full px-1.5 py-0.5",
                isYearly ? "bg-white/20 text-white" : "bg-ember-500/20 text-ember-400"
              )}>
                SAVE 20%
              </span>
            </button>
          </motion.div>

          {/* Trust signals */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-6 flex items-center justify-center gap-6 text-xs text-ash-500"
          >
            <span className="flex items-center gap-1"><Shield className="h-3 w-3" /> 7-Day Money Back</span>
            <span className="flex items-center gap-1"><Sparkles className="h-3 w-3" /> No Contracts</span>
            <span className="flex items-center gap-1"><Infinity className="h-3 w-3" /> Cancel Anytime</span>
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* PRICING CARDS — 3D TILT */}
      {/* ============================================================ */}
      <section className="px-4 pb-16 sm:pb-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {tiers.map((tier, i) => (
              <TiltCard
                key={tier.name}
                className={cn(
                  "relative rounded-2xl p-6 sm:p-8 transition-all duration-300 cursor-default",
                  tier.highlight
                    ? "border-2 border-fire-500/30 bg-gradient-to-b from-fire-500/[0.08] to-ash-800/60 md:-mt-4 md:mb-4"
                    : "border border-white/[0.06] bg-card",
                  tier.highlight
                    ? "shadow-[0_0_40px_rgba(233,69,96,0.2),0_0_80px_rgba(233,69,96,0.08),0_8px_32px_rgba(0,0,0,0.4)]"
                    : "shadow-[0_2px_8px_rgba(0,0,0,0.4),0_1px_2px_rgba(0,0,0,0.2)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.5),0_2px_4px_rgba(0,0,0,0.3)] hover:-translate-y-1 hover:border-fire-500/20"
                )}
              >
                {/* Badge */}
                {tier.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-fire-500 px-4 py-1 text-xs font-bold text-white shadow-lg">
                    {tier.badge}
                  </div>
                )}

                {/* Icon + glow container */}
                <div className={cn(
                  "flex h-11 w-11 items-center justify-center rounded-lg border mb-4 transition-all duration-300",
                  tier.highlight
                    ? "bg-fire-500/15 border-fire-500/25 shadow-[0_0_20px_rgba(233,69,96,0.15)]"
                    : "bg-fire-500/10 border-fire-500/15"
                )}>
                  <tier.icon className="h-5 w-5 text-fire-500" />
                </div>

                <h3 className="font-display text-xl text-white uppercase tracking-wide leading-[1] mb-1">
                  {tier.name}
                </h3>
                <p className="text-sm text-ash-400 mb-4">{tier.description}</p>

                {/* Price */}
                <div className="mb-5">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={isYearly ? "yearly" : "monthly"}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                    >
                      {tier.monthlyPrice === 0 ? (
                        <span className="text-4xl font-bold text-white">$0</span>
                      ) : (
                        <span className="text-4xl font-bold text-white">
                          ${isYearly ? tier.yearlyPrice : tier.monthlyPrice}
                        </span>
                      )}
                      <span className="text-ash-500 text-sm ml-1">{tier.period}</span>
                    </motion.div>
                  </AnimatePresence>
                  {isYearly && tier.monthlyPrice > 0 && (
                    <p className="text-xs text-ember-400 mt-1">
                      ${tier.monthlyPrice} billed monthly
                    </p>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-2.5 mb-6">
                  {tier.features.map((f) => (
                    <li key={f.text} className="flex items-start gap-2.5 text-sm">
                      {f.included ? (
                        <Check className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                      ) : (
                        <X className="h-4 w-4 text-ash-600 mt-0.5 shrink-0" />
                      )}
                      <span className={f.included ? "text-ash-200" : "text-ash-600"}>
                        {f.text}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                {tier.planType ? (
                  <button
                    onClick={() => handleCheckout(tier.planType!, true)}
                    disabled={loading === tier.planType}
                    className={cn(
                      "w-full rounded-xl px-4 py-3 text-sm font-bold transition-all duration-150 active:scale-95",
                      tier.highlight
                        ? "bg-gradient-to-b from-fire-500 to-fire-600 text-white hover:from-fire-400 hover:to-fire-500 shadow-[0_0_30px_rgba(233,69,96,0.25)]"
                        : "bg-ash-700 text-white hover:bg-ash-600"
                    )}
                  >
                    {loading === tier.planType ? "Loading..." : tier.cta}
                  </button>
                ) : (
                  <a
                    href="/#url-input"
                    className="block w-full rounded-xl border border-ash-600 px-4 py-3 text-center text-sm font-bold text-ash-300 hover:bg-ash-700 hover:text-white transition-all duration-150 active:scale-95"
                  >
                    {tier.cta}
                  </a>
                )}
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* ROAST COUNTER + SOCIAL PROOF */}
      {/* ============================================================ */}
      <section className="px-4 pb-16 sm:pb-24">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-fire-500/10 bg-gradient-to-r from-fire-500/[0.04] via-transparent to-ember-500/[0.04] p-8 sm:p-10"
          >
            <div className="font-display text-5xl sm:text-7xl text-white mb-2">
              <CountUp value={roastCount || 12847} duration={2} suffix="+" />
            </div>
            <p className="text-ash-300 mb-6">websites already roasted — and countless dollars in revenue saved</p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-ash-400">
              {paymentMethods.map((m) => (
                <span key={m} className="px-3 py-1 rounded-full bg-ash-700/50 border border-white/[0.04] text-xs">
                  {m}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* ONE-TIME PRODUCTS */}
      {/* ============================================================ */}
      <section className="border-t border-white/[0.06] px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <p className="text-xs font-display tracking-[0.2em] text-fire-500 mb-4">ONE-TIME PURCHASES</p>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-white uppercase leading-[1] tracking-[-0.03em] mb-4">
              NEED SOMETHING SPECIFIC?
            </h2>
            <p className="text-ash-300 max-w-xl mx-auto">
              No subscription. Pay once, use forever. Perfect for one-off needs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {oneTimeProducts.map((product, i) => (
              <motion.div
                key={product.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5, ease: [0, 0, 0.2, 1] }}
                className={cn(
                  "group relative rounded-2xl border border-white/[0.06] bg-card p-6 flex flex-col transition-all duration-300 hover:-translate-y-1 hover:border-fire-500/20",
                  "shadow-[0_2px_8px_rgba(0,0,0,0.4),0_1px_2px_rgba(0,0,0,0.2)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.5),0_2px_4px_rgba(0,0,0,0.3)]"
                )}
              >
                {product.badge && (
                  <div className="absolute -top-2.5 right-3 rounded-full bg-ember-500 px-2.5 py-0.5 text-[10px] font-bold text-white">
                    {product.badge}
                  </div>
                )}
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-ember-500/10 border border-ember-500/15 mb-4 group-hover:bg-ember-500/15 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] transition-all duration-300">
                  <product.icon className="h-5 w-5 text-ember-400" />
                </div>
                <h4 className="font-display text-lg text-white uppercase tracking-wide leading-[1] mb-1">{product.name}</h4>
                <p className="text-3xl font-bold text-fire-400 mb-2">${product.price}</p>
                <p className="text-sm text-ash-400 mb-4 flex-1">{product.desc}</p>
                <button
                  onClick={() => handleCheckout(product.name.toLowerCase().replace(/\s+/g, "_"), false)}
                  disabled={loading === product.name}
                  className="w-full rounded-lg bg-ash-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-ash-600 transition-all duration-150 active:scale-95"
                >
                  {loading === product.name ? "Loading..." : `Buy ${product.name}`}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* PLAN COMPARISON TABLE */}
      {/* ============================================================ */}
      <section className="border-t border-white/[0.06] px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <p className="text-xs font-display tracking-[0.2em] text-fire-500 mb-4">COMPARE</p>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-white uppercase leading-[1] tracking-[-0.03em] mb-4">
              FIND YOUR PERFECT PLAN
            </h2>
          </div>

          {/* Mobile: collapsible */}
          <div className="lg:hidden">
            <button
              onClick={() => setShowCompare(!showCompare)}
              className="w-full flex items-center justify-between rounded-xl border border-white/[0.06] bg-card p-4 text-white font-medium"
            >
              <span>Compare all plans</span>
              {showCompare ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </button>
            <AnimatePresence>
              {showCompare && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden mt-4"
                >
                  <ComparisonTable tiers={tiers} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Desktop */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="hidden lg:block"
          >
            <ComparisonTable tiers={tiers} />
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* MONEY-BACK GUARANTEE */}
      {/* ============================================================ */}
      <section className="border-t border-white/[0.06] px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-ember-500/10 bg-gradient-to-b from-ember-500/[0.04] to-transparent p-8 sm:p-12"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-ember-500/10 border border-ember-500/20 mx-auto mb-6">
              <Shield className="h-7 w-7 text-ember-400" />
            </div>
            <h3 className="font-display text-2xl sm:text-3xl text-white uppercase leading-[1] tracking-[-0.02em] mb-3">
              7-DAY MONEY BACK GUARANTEE
            </h3>
            <p className="text-ash-300 max-w-lg mx-auto mb-6">
              Try any paid plan risk-free. If you&apos;re not satisfied within 7 days, we&apos;ll refund every cent. No questions, no hoops, no hard feelings. The roasts might hurt — the purchase shouldn&apos;t.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-ash-400">
              <span className="flex items-center gap-1.5"><Shield className="h-4 w-4 text-ember-400" /> 100% Refund</span>
              <span className="flex items-center gap-1.5"><Infinity className="h-4 w-4 text-ember-400" /> No Questions Asked</span>
              <span className="flex items-center gap-1.5"><AlertTriangle className="h-4 w-4 text-ember-400" /> 7 Days to Decide</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* PRICING FAQ */}
      {/* ============================================================ */}
      <section className="border-t border-white/[0.06] px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <p className="text-xs font-display tracking-[0.2em] text-fire-500 mb-4">FAQ</p>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-white uppercase leading-[1] tracking-[-0.03em] mb-4">
              PRICING QUESTIONS
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left rounded-xl border border-white/[0.06] bg-card p-5 hover:border-fire-500/20 hover:shadow-[0_2px_8px_rgba(0,0,0,0.4)] transition-all duration-300"
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-semibold text-white text-sm sm:text-base">{faq.q}</span>
                    <ChevronDown className={cn("h-5 w-5 text-ash-400 shrink-0 transition-transform duration-200", openFaq === i && "rotate-180")} />
                  </div>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <p className="mt-4 text-sm text-ash-300 leading-relaxed">{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* FINAL CTA */}
      {/* ============================================================ */}
      <section className="px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-ash-500 text-xs tracking-[0.2em] uppercase mb-8">
              YOUR WEBSITE ISN'T GOING TO FIX ITSELF
            </p>
            <a
              href="/#url-input"
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-b from-fire-500 to-fire-600 px-10 py-5 text-lg font-bold text-white hover:from-fire-400 hover:to-fire-500 active:scale-95 transition-all duration-150"
              style={{ boxShadow: "0 0 60px rgba(233,69,96,0.3), 0 8px 32px rgba(233,69,96,0.15)" }}
            >
              <Flame className="h-5 w-5" />
              ROAST YOUR WEBSITE — IT'S FREE
              <ArrowRight className="h-5 w-5 ml-1" />
            </a>
            <p className="text-ash-600 text-sm mt-6">
              No credit card required for your first roast. Upgrade anytime.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

// ============================================================
// COMPARISON TABLE SUB-COMPONENT
// ============================================================

const compareFeatures = [
  "Roasts per day",
  "Money loss calculator",
  "Download roast as image",
  "Competitor Battle mode",
  "Analytics dashboard",
  "Export reports (PDF)",
  "API access",
  "White-label reports",
  "Bulk processing",
  "Priority AI",
  "Dedicated support",
  "Referral levels",
];

function ComparisonTable({ tiers }: { tiers: typeof tiers }) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="text-left p-4 font-semibold text-white">Feature</th>
              {tiers.map((t: any) => (
                <th key={t.name} className={cn("p-4 text-center font-display text-white uppercase tracking-wide", t.highlight && "bg-fire-500/5")}>
                  {t.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {compareFeatures.map((feature, i) => (
              <tr key={feature} className={cn("border-b border-white/[0.04]", i % 2 === 0 && "bg-white/[0.01]")}>
                <td className="p-4 text-ash-300">{feature}</td>
                {tiers.map((t: any) => {
                  const f = t.features.find((f: any) =>
                    f.text.toLowerCase().includes(feature.toLowerCase())
                  );
                  return (
                    <td key={t.name} className={cn("p-4 text-center", t.highlight && "bg-fire-500/[0.02]")}>
                      {f?.included ? (
                        <Check className="h-4 w-4 text-emerald-400 mx-auto" />
                      ) : (
                        <X className="h-4 w-4 text-ash-600 mx-auto" />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
