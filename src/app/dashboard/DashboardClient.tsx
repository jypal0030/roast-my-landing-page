"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Flame,
  TrendingUp,
  Gift,
  Settings,
  ExternalLink,
  Clock,
  Crown,
  DollarSign,
  Users,
} from "lucide-react";
import { formatCurrency, getScoreColor, getScoreEmoji, getScoreBgColor } from "@/lib/utils";
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

export function DashboardClient({ user, roasts, payments, referralCounts }: DashboardClientProps) {
  if (!user) return null;

  const plan = PLANS[user.plan as keyof typeof PLANS] || PLANS.free;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <h1 className="font-display text-4xl text-white mb-2">Dashboard</h1>
        <p className="text-ash-400">
          Welcome back, {user.name || "Roaster"} —{" "}
          <span className="text-fire-400 font-semibold">{plan.name} Plan</span>
        </p>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard icon={Crown} label="Current Plan" value={plan.name} color="text-amber-400" />
        <StatCard icon={Flame} label="Total Roasts" value={roasts.length.toString()} color="text-fire-400" />
        <StatCard icon={Users} label="Total Referrals" value={referralCounts.total.toString()} color="text-emerald-400" />
        <StatCard icon={DollarSign} label="Balance" value={formatCurrency(user.balance)} color="text-fire-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Roast History */}
        <div className="lg:col-span-2">
          <h2 className="font-display text-2xl text-white mb-4">Roast History</h2>
          {roasts.length === 0 ? (
            <div className="rounded-xl border border-ash-700 bg-ash-800/50 p-10 text-center">
              <div className="font-display text-6xl text-ash-700 mb-4">0</div>
              <p className="text-ash-400 text-lg mb-2">Your roast history is empty.</p>
              <p className="text-ash-600 text-sm mb-6 max-w-sm mx-auto">
                Either your website is perfect (it&apos;s not) or you&apos;re avoiding the truth. Time to find out which.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-b from-fire-500 to-fire-600 px-6 py-3 text-sm font-bold text-white hover:from-fire-400 hover:to-fire-500 active:scale-95 transition-all duration-150"
                style={{ boxShadow: "0 0 30px rgba(233,69,96,0.2)" }}
              >
                <Flame className="h-4 w-4" /> Face the Truth
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {roasts.map((roast) => (
                <Link
                  key={roast.id}
                  href={`/roast/${roast.id}`}
                  className="flex items-center justify-between rounded-xl border border-ash-700 bg-ash-800/50 p-4 hover:border-ash-600 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${getScoreBgColor(roast.overallScore)}/20`}>
                      <ExternalLink className="h-4 w-4 text-ash-400" />
                    </div>
                    <div>
                      <div className="font-medium text-white text-sm">{roast.domain}</div>
                      <div className="text-xs text-ash-500 flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        {new Date(roast.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-ash-400 hidden sm:inline">&ldquo;{roast.vibe}&rdquo;</span>
                    <span
                      className={`inline-flex items-center justify-center w-8 h-8 rounded-lg font-bold text-xs text-white ${getScoreBgColor(roast.overallScore)}`}
                    >
                      {roast.overallScore}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Referral stats */}
          <div className="rounded-xl border border-ash-700 bg-ash-800/50 p-5">
            <h3 className="font-display text-lg text-white mb-4 flex items-center gap-2">
              <Gift className="h-5 w-5 text-ember-400" /> Referrals
            </h3>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center p-3 rounded-lg bg-ash-700/50">
                <div className="text-lg font-bold text-white">{referralCounts.level1}</div>
                <div className="text-xs text-ash-500">Level 1</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-ash-700/50">
                <div className="text-lg font-bold text-white">{referralCounts.level2}</div>
                <div className="text-xs text-ash-500">Level 2</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-ash-700/50">
                <div className="text-lg font-bold text-white">{referralCounts.level3}</div>
                <div className="text-xs text-ash-500">Level 3</div>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm mb-3">
              <span className="text-ash-400">Total Earnings</span>
              <span className="text-emerald-400 font-bold">{formatCurrency(user.totalEarnings)}</span>
            </div>
            <Link
              href="/referral"
              className="block w-full text-center rounded-lg bg-ember-500/10 border border-ember-500/30 px-4 py-2 text-sm font-medium text-ember-400 hover:bg-ember-500/20 transition-all"
            >
              View Referral Dashboard
            </Link>
          </div>

          {/* Quick actions */}
          <div className="rounded-xl border border-ash-700 bg-ash-800/50 p-5">
            <h3 className="font-display text-lg text-white mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Link
                href="/"
                className="block w-full rounded-lg bg-fire-500 px-4 py-2 text-sm font-bold text-white hover:bg-fire-600 transition-all text-center"
              >
                <Flame className="h-4 w-4 inline mr-1" /> Roast a Website
              </Link>
              {user.plan === "free" && (
                <Link
                  href="/pricing"
                  className="block w-full rounded-lg border border-ash-600 px-4 py-2 text-sm font-medium text-ash-300 hover:bg-ash-700 transition-all text-center"
                >
                  <Crown className="h-4 w-4 inline mr-1" /> Upgrade Plan
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: {
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="rounded-xl border border-ash-700 bg-ash-800/50 p-5">
      <Icon className={`h-5 w-5 ${color} mb-2`} />
      <div className="text-xs text-ash-500 mb-1">{label}</div>
      <div className="text-xl font-bold text-white">{value}</div>
    </div>
  );
}
