"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Flame, Zap, Crown, Building2 } from "lucide-react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { PLANS } from "@/lib/paddle";

const tiers = [
  {
    name: "Free", icon: Flame, price: "$0", period: "forever",
    description: "Get a taste of the roast",
    features: ["1 roast per day","Basic roast card","Branded watermark","Share to social media","15% Level-1 referral"],
    cta: "Start Free", highlight: false, planType: null,
  },
  {
    name: "Starter", icon: Zap, price: "$9", period: "/month",
    description: "For indie hackers shipping fast",
    features: ["5 roasts per day","Clean cards (no watermark)","Full money loss calculator","Download roast as image","20% referral (2 levels)","Roast history"],
    cta: "Get Starter", highlight: false, planType: "starter",
  },
  {
    name: "Pro", icon: Crown, price: "$29", period: "/month",
    description: "For serious founders & freelancers",
    features: ["20 roasts per day","Competitor Battle mode","Advanced analytics dashboard","Priority AI processing","25% referral (3 levels)","Export reports as PDF"],
    cta: "Go Pro", highlight: true, planType: "pro",
  },
  {
    name: "Agency", icon: Building2, price: "$99", period: "/month",
    description: "For agencies & power users",
    features: ["100 roasts per day","White-label reports","API access","Bulk roast processing","30% referral (3 levels)","Dedicated support"],
    cta: "Go Agency", highlight: false, planType: "agency",
  },
];

const oneTimeProducts = [
  { name: "Full Audit Report", price: "$49", desc: "Deep dive analysis with all fixes & recommendations", type: "full_audit" },
  { name: "5 Roast Pack", price: "$19", desc: "5 website roasts, use anytime, no expiry", type: "roast_pack_5" },
  { name: "10 Roast Pack", price: "$29", desc: "10 website roasts — perfect for client work", type: "roast_pack_10" },
  { name: "Competitor Battle", price: "$15", desc: "Head-to-head website roast comparison", type: "competitor_battle" },
];

export function PricingTable() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState<string | null>(null);

  const handleCheckout = async (type: string, isPlan: boolean) => {
    if (!session) { toast.error("Please sign in to purchase"); return; }
    setLoading(type);
    try {
      const body = isPlan ? { planType: type } : { productType: type };
      const res = await fetch("/api/paddle/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!data.priceId) { toast.error(data.error || "Something went wrong"); return; }

      const Paddle = (window as any).Paddle;
      if (!Paddle) { toast.error("Loading checkout… try again in a moment"); return; }

      // Initialize once, then open overlay
      if (!(window as any).__paddleInitialized) {
        Paddle.Environment.set(data.env || "production");
        Paddle.Initialize({ token: data.clientToken });
        (window as any).__paddleInitialized = true;
      }

      Paddle.Checkout.open({
        items: [{ priceId: data.priceId, quantity: 1 }],
        customer: { email: session.user?.email || "" },
        settings: { displayMode: "overlay" },
      });
    } catch { toast.error("Payment setup failed"); }
    finally { setLoading(null); }
  };

  return (
    <section id="pricing" className="border-t border-ash-800 px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <h2 className="font-display text-4xl sm:text-5xl text-white mb-4">Simple, Transparent Pricing</h2>
          <p className="text-ash-400 max-w-xl mx-auto">Start free, upgrade when you need more. One-time purchases available. Secured by Paddle (Merchant of Record).</p>
        </motion.div>
        <motion.div variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {tiers.map((tier) => (
            <motion.div key={tier.name} variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
              className={cn("relative rounded-2xl border p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-fire-500/10", tier.highlight ? "border-fire-500/50 bg-fire-500/5 ring-1 ring-fire-500/20" : "border-ash-700 bg-ash-800/50 hover:border-ash-600")}>
              {tier.highlight && <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-fire-500 px-3 py-1 text-xs font-bold text-white">MOST POPULAR</div>}
              <tier.icon className="h-8 w-8 text-fire-400 mb-4" />
              <h3 className="text-lg font-bold text-white mb-1">{tier.name}</h3>
              <div className="mb-2"><span className="text-3xl font-bold text-white">{tier.price}</span><span className="text-ash-500 text-sm">{tier.period}</span></div>
              <p className="text-sm text-ash-400 mb-4">{tier.description}</p>
              <ul className="space-y-2 mb-6">
                {tier.features.map((f) => <li key={f} className="flex items-start gap-2 text-sm text-ash-300"><Check className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />{f}</li>)}
              </ul>
              {tier.planType ? (
                <button onClick={() => handleCheckout(tier.planType!, true)} disabled={loading === tier.planType}
                  className={cn("w-full rounded-lg px-4 py-2.5 text-sm font-bold transition-all duration-300 active:scale-95", tier.highlight ? "bg-fire-500 text-white hover:bg-fire-600" : "bg-ash-700 text-white hover:bg-ash-600")}>
                  {loading === tier.planType ? "Loading..." : tier.cta}
                </button>
              ) : (
                <button onClick={() => document.getElementById("url-input")?.scrollIntoView({ behavior: "smooth" })}
                  className="w-full rounded-lg border border-ash-600 px-4 py-2.5 text-sm font-bold text-ash-300 hover:bg-ash-700 transition-all duration-300 active:scale-95">{tier.cta}</button>
              )}
            </motion.div>
          ))}
        </motion.div>
        <div>
          <h3 className="text-center font-display text-2xl text-white mb-6">One-Time Purchases</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {oneTimeProducts.map((p) => (
              <div key={p.type} className="rounded-xl border border-ash-700 bg-ash-800/50 p-5 flex flex-col transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-ember-500/10">
                <h4 className="font-semibold text-white mb-1">{p.name}</h4>
                <p className="text-2xl font-bold text-fire-400 mb-2">{p.price}</p>
                <p className="text-sm text-ash-400 mb-4 flex-1">{p.desc}</p>
                <button onClick={() => handleCheckout(p.type, false)} disabled={loading === p.type}
                  className="w-full rounded-lg bg-ash-700 px-4 py-2 text-sm font-bold text-white hover:bg-ash-600 transition-all duration-300 active:scale-95">
                  {loading === p.type ? "Loading..." : `Buy ${p.name}`}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
