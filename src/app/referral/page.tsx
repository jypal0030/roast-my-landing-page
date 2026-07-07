"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, Users, DollarSign, TrendingUp, Copy, Flame, LinkIcon, Crown, Check, ArrowRight, Share2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { CountUp } from "@/components/CountUp";
import toast from "react-hot-toast";
import Link from "next/link";

const commissionTiers = [
  { plan: "Free", rate: "15%", levels: 1, color: "text-ash-400", bg: "bg-ash-700/30" },
  { plan: "Starter", rate: "20%", levels: 2, color: "text-fire-400", bg: "bg-fire-500/5" },
  { plan: "Pro", rate: "25%", levels: 3, color: "text-amber-400", bg: "bg-amber-500/5", highlight: true },
  { plan: "Agency", rate: "30%", levels: 3, color: "text-ember-400", bg: "bg-ember-500/5" },
];

export default function ReferralPage() {
  const { data: session, status } = useSession();
  const [copied, setCopied] = useState(false);

  const referralCode = session?.user?.referralCode || "USER-XXXX";
  const plan = session?.user?.plan || "free";
  const balance = (session?.user?.balance as number) || 0;
  const referralLink = `${typeof window !== "undefined" ? window.location.origin : ""}/?ref=${referralCode}`;

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success("Referral link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  if (status === "loading") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Flame className="h-10 w-10 text-fire-500 animate-pulse" />
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-ember-500/10 border border-ember-500/20 mx-auto mb-6">
            <Gift className="h-8 w-8 text-ember-400" />
          </div>
          <h1 className="font-display text-4xl sm:text-5xl text-white uppercase leading-[1] tracking-[-0.03em] mb-4">
            EARN WHILE YOU ROAST
          </h1>
          <p className="text-ash-300 text-lg max-w-md mx-auto mb-8">
            Share your link. Earn lifetime commissions every time someone subscribes.
          </p>
          <Link href="/auth/signin" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-b from-fire-500 to-fire-600 px-8 py-4 text-sm font-bold text-white hover:from-fire-400 hover:to-fire-500 active:scale-95 transition-all duration-150 shadow-[0_0_30px_rgba(233,69,96,0.25)]">
            <Flame className="h-5 w-5" /> Sign In to Start Earning
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <p className="text-xs font-display tracking-[0.2em] text-ember-500 mb-4">EARN</p>
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-white uppercase leading-[1] tracking-[-0.03em] mb-4">
          TURN ROASTS INTO
          <br />
          <span className="bg-gradient-to-r from-ember-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
            REVENUE
          </span>
        </h1>
        <p className="text-ash-300 max-w-lg mx-auto">
          Share your unique referral link. Earn lifetime commissions on every subscription and purchase made through it.
        </p>
      </motion.div>

      {/* Referral Link Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-2xl border border-ember-500/20 bg-gradient-to-br from-ember-500/[0.06] to-transparent p-6 sm:p-8 mb-10 shadow-[0_2px_8px_rgba(0,0,0,0.4)]"
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-ember-500/10 border border-ember-500/20">
            <LinkIcon className="h-5 w-5 text-ember-400" />
          </div>
          <div>
            <h3 className="font-display text-lg text-white uppercase tracking-wide leading-[1]">Your Referral Link</h3>
            <p className="text-xs text-ash-500">Share this anywhere — you earn when they subscribe</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <input readOnly value={referralLink} className="flex-1 rounded-xl border border-white/[0.08] bg-ash-800/80 px-4 py-3 text-sm text-ash-200 font-mono focus:outline-none" />
          <button onClick={copyLink} className={`
            flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold transition-all duration-150 active:scale-95
            ${copied ? "bg-emerald-500 text-white" : "bg-ember-500 text-white hover:bg-ember-600"}
          `}>
            {copied ? <><Check className="h-4 w-4" /> Copied!</> : <><Copy className="h-4 w-4" /> Copy Link</>}
          </button>
        </div>
        <div className="mt-3 flex items-center gap-2 text-sm">
          <span className="text-ash-500">Code:</span>
          <span className="font-mono text-ember-400">{referralCode}</span>
        </div>
      </motion.div>

      {/* Commission Tiers */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-12">
        <h3 className="font-display text-xl text-white uppercase tracking-[0.1em] mb-6 text-center">Commission Tiers</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {commissionTiers.map((tier) => (
            <div key={tier.plan} className={`
              relative rounded-xl border p-4 text-center transition-all duration-300 hover:-translate-y-1
              ${tier.highlight
                ? "border-amber-500/30 bg-amber-500/[0.04] shadow-[0_0_25px_rgba(245,158,11,0.12)]"
                : "border-white/[0.06] bg-card hover:border-ember-500/20"}
            `}>
              <div className="text-[10px] text-ash-500 uppercase tracking-wider mb-1">{tier.plan}</div>
              <div className={`font-display text-3xl font-bold ${tier.color} leading-[1] mb-1`}>{tier.rate}</div>
              <div className="text-[10px] text-ash-600">{tier.levels} level{tier.levels > 1 ? "s" : ""}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-12"
      >
        <StatBox icon={Users} label="Your Plan" value={plan.charAt(0).toUpperCase() + plan.slice(1)} />
        <StatBox icon={TrendingUp} label="Balance" value={`${formatCurrency(balance)}`} color="text-ember-400" />
        <StatBox icon={Share2} label="Referral Code" value={referralCode} isMono />
      </motion.div>

      {/* How It Works */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-12"
      >
        <div className="text-center mb-10">
          <p className="text-xs font-display tracking-[0.2em] text-fire-500 mb-4">HOW IT WORKS</p>
          <h3 className="font-display text-2xl sm:text-3xl text-white uppercase leading-[1] tracking-[-0.02em] mb-3">
            3 STEPS TO EARN
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { num: "01", title: "SHARE YOUR LINK", desc: "Post it on Twitter, LinkedIn, send to friends, or put it in your newsletter." },
            { num: "02", title: "THEY SUBSCRIBE", desc: "When someone signs up and buys any plan through your link, the commission triggers." },
            { num: "03", title: "YOU GET PAID", desc: "Earn on every payment they make — subscriptions, renewals, one-time purchases. Forever." },
          ].map((step, i) => (
            <div key={i} className="group relative rounded-2xl border border-white/[0.06] bg-card p-6 shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
              <div className="flex items-center gap-3 mb-4">
                <span className="font-display text-3xl text-ember-500/20 group-hover:text-ember-500/40 transition-colors">{step.num}</span>
                <div className="h-px flex-1 bg-gradient-to-r from-ember-500/20 to-transparent" />
              </div>
              <h4 className="font-display text-lg text-white uppercase leading-[1] tracking-wide mb-2">{step.title}</h4>
              <p className="text-sm text-ash-300 leading-relaxed">{step.desc}</p>
              <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-ember-500/0 via-ember-500/30 to-ember-500/0 scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Upgrade CTA for free users */}
      {plan === "free" && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <div className="rounded-2xl border border-fire-500/20 bg-gradient-to-r from-fire-500/[0.04] via-ember-500/[0.04] to-transparent p-8 text-center">
            <Crown className="h-10 w-10 text-amber-400 mx-auto mb-4" />
            <h3 className="font-display text-2xl text-white uppercase leading-[1] tracking-[-0.02em] mb-3">
              UNLOCK HIGHER COMMISSIONS
            </h3>
            <p className="text-ash-300 max-w-lg mx-auto mb-6 text-sm">
              Upgrade to Pro (25% across 3 levels) or Agency (30% across 3 levels) to maximize your referral earnings.
            </p>
            <Link href="/pricing" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-b from-fire-500 to-fire-600 px-8 py-3.5 text-sm font-bold text-white hover:from-fire-400 hover:to-fire-500 active:scale-95 transition-all duration-150 shadow-[0_0_30px_rgba(233,69,96,0.2)]">
              View Plans <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function StatBox({ icon: Icon, label, value, color = "text-white", isMono }: {
  icon: React.ElementType; label: string; value: string; color?: string; isMono?: boolean;
}) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-card p-5 shadow-[0_2px_8px_rgba(0,0,0,0.4)] transition-all duration-300 hover:-translate-y-1 hover:border-ember-500/20">
      <Icon className="h-5 w-5 text-ash-500 mb-2" />
      <div className="text-xs text-ash-500 mb-1">{label}</div>
      <div className={`text-xl font-bold ${color} ${isMono ? "font-mono text-sm" : ""}`}>{value}</div>
    </div>
  );
}
