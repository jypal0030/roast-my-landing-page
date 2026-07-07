"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Flame, TrendingUp, Gift, Crown, ExternalLink, Clock, DollarSign, Users, BarChart3, ArrowRight, Zap } from "lucide-react";
import { formatCurrency, getScoreBgColor, getScoreColor } from "@/lib/utils";
import { CountUp } from "@/components/CountUp";
import { PLANS } from "@/lib/paddle";

interface DashboardClientProps {
  user: {
    plan: string;
    referralCode: string;
    balance: number;
    totalEarnings: number;
    email: string;
    name: string | null;
    createdAt: Date;
  } | null;
  roasts: { id: string; domain: string; overallScore: number; vibe: string; createdAt: Date }[];
  payments: { id: string; amount: number; type: string; status: string; createdAt: Date }[];
  referralCounts: { total: number; level1: number; level2: number; level3: number };
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0, 0, 0.2, 1] as const } },
};

export function DashboardClient({ user, roasts, payments, referralCounts }: DashboardClientProps) {
  if (!user) return null;

  const plan = PLANS[user.plan as keyof typeof PLANS] || PLANS.free;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <p className="text-xs font-display tracking-[0.2em] text-fire-500 mb-3">DASHBOARD</p>
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl text-white uppercase leading-[1] tracking-[-0.03em] mb-2">
          Welcome Back{user.name ? `, ${user.name.split(" ")[0].toUpperCase()}` : ""}
        </h1>
        <p className="text-ash-400">
          You&apos;re on the{" "}
          <span className="text-fire-400 font-semibold">{plan.name} Plan</span>
          {" "}— {plan.roastsPerDay} roast{plan.roastsPerDay > 1 ? "s" : ""}/day
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        <motion.div variants={itemVariants} className="rounded-xl border border-white/[0.06] bg-card p-5 shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
          <Crown className="h-5 w-5 text-amber-400 mb-2" />
          <div className="text-xs text-ash-500 mb-1">Current Plan</div>
          <div className="font-display text-xl text-white uppercase leading-[1]">{plan.name}</div>
        </motion.div>
        <motion.div variants={itemVariants} className="rounded-xl border border-white/[0.06] bg-card p-5 shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
          <Flame className="h-5 w-5 text-fire-400 mb-2" />
          <div className="text-xs text-ash-500 mb-1">Total Roasts</div>
          <div className="text-2xl font-bold text-white">{roasts.length}</div>
        </motion.div>
        <motion.div variants={itemVariants} className="rounded-xl border border-white/[0.06] bg-card p-5 shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
          <Users className="h-5 w-5 text-ember-400 mb-2" />
          <div className="text-xs text-ash-500 mb-1">Referrals</div>
          <div className="text-2xl font-bold text-white">{referralCounts.total}</div>
        </motion.div>
        <motion.div variants={itemVariants} className="rounded-xl border border-white/[0.06] bg-card p-5 shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
          <DollarSign className="h-5 w-5 text-fire-400 mb-2" />
          <div className="text-xs text-ash-500 mb-1">Balance</div>
          <div className="text-2xl font-bold text-white">{formatCurrency(user.balance)}</div>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Roast History */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3 mb-5">
            <h2 className="font-display text-xl text-white uppercase tracking-[0.1em] leading-[1]">Roast History</h2>
            <span className="text-xs text-ash-600 font-mono">{roasts.length} total</span>
          </div>

          {roasts.length === 0 ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-white/[0.06] bg-card p-12 text-center">
              <div className="font-display text-7xl text-ash-700 mb-4">0</div>
              <p className="text-ash-300 text-lg mb-2">Your roast history is empty.</p>
              <p className="text-ash-600 text-sm mb-6 max-w-sm mx-auto">
                Either your website is perfect (it&apos;s not) or you&apos;re avoiding the truth. Time to find out which.
              </p>
              <Link href="/" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-b from-fire-500 to-fire-600 px-6 py-3 text-sm font-bold text-white hover:from-fire-400 hover:to-fire-500 active:scale-95 transition-all duration-150 shadow-[0_0_30px_rgba(233,69,96,0.2)]">
                <Flame className="h-4 w-4" /> Face the Truth
              </Link>
            </motion.div>
          ) : (
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-2">
              {roasts.map((roast) => (
                <motion.div key={roast.id} variants={itemVariants}>
                  <Link href={`/roast/${roast.id}`} className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-card p-4 hover:border-fire-500/20 hover:-translate-y-0.5 transition-all duration-200 shadow-[0_1px_3px_rgba(0,0,0,0.3)] group">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`p-2 rounded-lg ${getScoreBgColor(roast.overallScore)} flex-shrink-0`}>
                        <ExternalLink className="h-4 w-4 text-ash-400" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-white text-sm truncate">{roast.domain}</div>
                        <div className="text-xs text-ash-500 flex items-center gap-2">
                          <Clock className="h-3 w-3" />
                          {new Date(roast.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="text-xs text-ash-500 hidden sm:inline italic truncate max-w-[120px]">&ldquo;{roast.vibe}&rdquo;</span>
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg font-bold text-xs text-white ${getScoreBgColor(roast.overallScore)}`}>
                        {roast.overallScore}
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Quick Actions */}
          <div className="rounded-2xl border border-white/[0.06] bg-card p-5 shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
            <h3 className="font-display text-lg text-white uppercase tracking-[0.1em] leading-[1] mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Link href="/" className="flex items-center justify-center gap-2 w-full rounded-xl bg-gradient-to-b from-fire-500 to-fire-600 px-4 py-3 text-sm font-bold text-white hover:from-fire-400 hover:to-fire-500 active:scale-95 transition-all duration-150 shadow-[0_0_20px_rgba(233,69,96,0.15)]">
                <Flame className="h-4 w-4" /> Roast a Website
              </Link>
              {user.plan === "free" && (
                <Link href="/pricing" className="flex items-center justify-center gap-2 w-full rounded-xl border border-white/[0.06] bg-ash-700/50 px-4 py-3 text-sm font-medium text-ash-200 hover:bg-ash-700 active:scale-95 transition-all duration-150">
                  <Crown className="h-4 w-4 text-amber-400" /> Upgrade Plan
                </Link>
              )}
            </div>
          </div>

          {/* Referral Summary */}
          <div className="rounded-2xl border border-ember-500/10 bg-gradient-to-br from-ember-500/[0.03] to-transparent p-5">
            <h3 className="font-display text-lg text-white uppercase tracking-[0.1em] leading-[1] mb-4 flex items-center gap-2">
              <Gift className="h-4 w-4 text-ember-400" /> Referrals
            </h3>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[{ label: "L1", val: referralCounts.level1 }, { label: "L2", val: referralCounts.level2 }, { label: "L3", val: referralCounts.level3 }].map((l) => (
                <div key={l.label} className="text-center p-3 rounded-lg bg-ash-700/30">
                  <div className="font-mono text-lg font-bold text-white">{l.val}</div>
                  <div className="text-[10px] text-ash-500">{l.label}</div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between text-sm mb-3">
              <span className="text-ash-400">Total Earned</span>
              <span className="text-ember-400 font-bold">{formatCurrency(user.totalEarnings)}</span>
            </div>
            <Link href="/referral" className="flex items-center justify-center gap-1 w-full rounded-lg border border-ember-500/20 bg-ember-500/5 px-4 py-2.5 text-sm font-medium text-ember-400 hover:bg-ember-500/10 transition-all duration-150">
              View Referral Dashboard <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
