"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Gift, Users, DollarSign, TrendingUp, ArrowUpRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { REFERRAL_COMMISSIONS } from "@/lib/paddle";
import toast from "react-hot-toast";

interface ReferralDashboardProps {
  user: { referralCode: string; plan: string; balance: number; totalEarnings: number };
  stats: { level1: number; level2: number; level3: number };
  referrals: {
    id: string;
    level: number;
    commission: number;
    totalEarned: number;
    createdAt: Date;
    referred: { name: string | null; email: string };
  }[];
}

export function ReferralDashboard({ user, stats, referrals }: ReferralDashboardProps) {
  const referralLink = `${typeof window !== "undefined" ? window.location.origin : ""}/?ref=${user.referralCode}`;
  const commission = REFERRAL_COMMISSIONS[user.plan] || REFERRAL_COMMISSIONS.free;

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success("Referral link copied!");
  };

  const copyCode = () => {
    navigator.clipboard.writeText(user.referralCode);
    toast.success("Referral code copied!");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <h1 className="font-display text-4xl text-white mb-2 flex items-center gap-3">
          <Gift className="h-8 w-8 text-ember-400" /> Referral Program
        </h1>
        <p className="text-ash-400">
          Share your link. Earn lifetime commissions up to 3 levels deep.
        </p>
      </motion.div>

      {/* Referral link section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl border border-ember-500/20 bg-ember-500/5 p-6 mb-8"
      >
        <h3 className="font-display text-xl text-white mb-4">Your Referral Link</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            readOnly
            value={referralLink}
            className="flex-1 bg-ash-800 border border-ash-600 rounded-xl px-4 py-3 text-sm text-ash-200 font-mono"
          />
          <button
            onClick={copyLink}
            className="flex items-center gap-2 rounded-xl bg-ember-500 px-5 py-3 text-sm font-bold text-white hover:bg-ember-600 transition-all"
          >
            <Copy className="h-4 w-4" /> Copy Link
          </button>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <span className="text-sm text-ash-500">Code:</span>
          <button onClick={copyCode} className="text-sm font-mono text-ember-400 hover:text-ember-300">
            {user.referralCode}
          </button>
        </div>
      </motion.div>

      {/* Commission info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
      >
        {commission.rates.map((rate, i) => (
          <div key={i} className="rounded-xl border border-ash-700 bg-ash-800/50 p-5">
            <div className="text-xs text-ash-500 mb-1">Level {i + 1} Commission</div>
            <div className="text-2xl font-bold text-ember-400 font-display">{(rate * 100).toFixed(0)}%</div>
            <div className="text-xs text-ash-500 mt-1">
              {user.plan === "free" && i >= 1 ? "Upgrade to unlock" : "Active"}
            </div>
          </div>
        ))}
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
        <StatBox icon={Users} label="Level 1 Refs" value={stats.level1} />
        <StatBox icon={Users} label="Level 2 Refs" value={stats.level2} />
        <StatBox icon={Users} label="Level 3 Refs" value={stats.level3} />
        <StatBox icon={DollarSign} label="Total Earned" value={formatCurrency(user.totalEarnings)} />
        <StatBox icon={TrendingUp} label="Balance" value={formatCurrency(user.balance)} color="text-emerald-400" />
      </div>

      {/* Recent referrals */}
      <h2 className="font-display text-2xl text-white mb-4">Recent Referrals</h2>
      {referrals.length === 0 ? (
        <div className="rounded-xl border border-ash-700 bg-ash-800/50 p-8 text-center">
          <Users className="h-10 w-10 text-ash-600 mx-auto mb-3" />
          <p className="text-ash-400">No referrals yet. Share your link to start earning!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {referrals.map((ref) => (
            <div
              key={ref.id}
              className="flex items-center justify-between rounded-xl border border-ash-700 bg-ash-800/50 p-4"
            >
              <div>
                <div className="font-medium text-white text-sm">
                  {ref.referred.name || ref.referred.email}
                </div>
                <div className="text-xs text-ash-500">
                  Level {ref.level} • {new Date(ref.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-ember-400">
                  {formatCurrency(ref.totalEarned)}
                </div>
                <div className="text-xs text-ash-500">earned</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatBox({ icon: Icon, label, value, color = "text-white" }: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color?: string;
}) {
  return (
    <div className="rounded-xl border border-ash-700 bg-ash-800/50 p-5">
      <Icon className="h-5 w-5 text-ash-500 mb-2" />
      <div className="text-xs text-ash-500 mb-1">{label}</div>
      <div className={`text-xl font-bold ${color}`}>{value}</div>
    </div>
  );
}
