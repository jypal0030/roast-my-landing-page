"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Gift,
  Users,
  DollarSign,
  TrendingUp,
  Copy,
  Flame,
  Link as LinkIcon,
  Crown,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { REFERRAL_COMMISSIONS } from "@/lib/paddle";
import toast from "react-hot-toast";
import Link from "next/link";

export default function ReferralPage() {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState({
    level1: 0,
    level2: 0,
    level3: 0,
    totalEarned: 0,
    balance: 0,
  });

  const referralCode = session?.user?.referralCode || "USER-XXXX";
  const plan = session?.user?.plan || "free";
  const commission = REFERRAL_COMMISSIONS[plan] || REFERRAL_COMMISSIONS.free;
  const referralLink =
    (typeof window !== "undefined" ? window.location.origin : "") +
    "/?ref=" +
    referralCode;

  useEffect(() => {
    if (session?.user) {
      setStats((s) => ({
        ...s,
        balance: (session.user.balance as number) || 0,
      }));
    }
  }, [session]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Flame className="h-8 w-8 text-fire-500 animate-pulse" />
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="text-center">
          <Gift className="h-12 w-12 text-ember-400 mx-auto mb-4" />
          <h1 className="font-display text-4xl text-white mb-4">Referral Program</h1>
          <p className="text-ash-300 text-lg mb-6">
            Sign in to get your referral link and start earning commissions.
          </p>
          <Link
            href="/auth/signin"
            className="inline-flex items-center gap-2 rounded-lg bg-fire-500 px-6 py-3 text-sm font-semibold text-white hover:bg-fire-600"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success("Referral link copied!");
  };

  const copyCode = () => {
    navigator.clipboard.writeText(referralCode);
    toast.success("Referral code copied!");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="font-display text-4xl text-white mb-2 flex items-center gap-3">
          <Gift className="h-8 w-8 text-ember-400" /> Referral Program
        </h1>
        <p className="text-ash-400">
          Share your link. Earn lifetime commissions up to {commission.levels} level{commission.levels > 1 ? "s" : ""} deep.
        </p>
      </motion.div>

      {/* Referral link */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl border border-ember-500/20 bg-ember-500/5 p-6 mb-8"
      >
        <h3 className="font-display text-xl text-white mb-4 flex items-center gap-2">
          <LinkIcon className="h-5 w-5 text-ember-400" />
          Your Referral Link
        </h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            readOnly
            value={referralLink}
            className="flex-1 bg-ash-800 border border-ash-600 rounded-xl px-4 py-3 text-sm text-ash-200 font-mono"
          />
          <button
            onClick={copyLink}
            className="flex items-center justify-center gap-2 rounded-xl bg-ember-500 px-5 py-3 text-sm font-bold text-white hover:bg-ember-600 transition-all"
          >
            <Copy className="h-4 w-4" /> Copy Link
          </button>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <span className="text-sm text-ash-500">Or share your code:</span>
          <button
            onClick={copyCode}
            className="text-sm font-mono text-ember-400 hover:text-ember-300 transition-colors"
          >
            {referralCode}
          </button>
        </div>
      </motion.div>

      {/* Commission rates */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
      >
        {commission.rates.map((rate, i) => (
          <div
            key={i}
            className={`rounded-xl border p-5 ${
              plan === "free" && i >= 1
                ? "border-ash-700 bg-ash-800/30 opacity-60"
                : "border-ember-500/30 bg-ember-500/5"
            }`}
          >
            <div className="text-xs text-ash-500 mb-1">Level {i + 1} Commission</div>
            <div className="text-3xl font-bold text-ember-400 font-display">
              {(rate * 100).toFixed(0)}%
            </div>
            <div className="text-xs text-ash-500 mt-1">
              {plan === "free" && i >= 1 ? "Upgrade to unlock" : "Active"}
            </div>
          </div>
        ))}
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
        <StatBox icon={Users} label="Level 1 Refs" value={stats.level1} />
        <StatBox icon={Users} label="Level 2 Refs" value={stats.level2} />
        <StatBox icon={Users} label="Level 3 Refs" value={stats.level3} />
        <StatBox
          icon={DollarSign}
          label="Total Earned"
          value={formatCurrency(stats.totalEarned)}
          color="text-ember-400"
        />
        <StatBox
          icon={TrendingUp}
          label="Balance"
          value={formatCurrency(stats.balance)}
          color="text-emerald-400"
        />
      </div>

      {/* How it works */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl border border-ash-700 bg-ash-800/50 p-6 mb-8"
      >
        <h2 className="font-display text-2xl text-white mb-4">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-fire-500 text-sm font-bold text-white">
                1
              </span>
              <h3 className="font-semibold text-white">Share Your Link</h3>
            </div>
            <p className="text-sm text-ash-400">
              Post your referral link on Twitter, LinkedIn, Reddit, or send it directly to friends.
            </p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-fire-500 text-sm font-bold text-white">
                2
              </span>
              <h3 className="font-semibold text-white">They Sign Up & Pay</h3>
            </div>
            <p className="text-sm text-ash-400">
              When someone signs up through your link and buys any plan, you earn a commission.
            </p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-fire-500 text-sm font-bold text-white">
                3
              </span>
              <h3 className="font-semibold text-white">Earn Lifetime</h3>
            </div>
            <p className="text-sm text-ash-400">
              Get paid on every payment they make — subscriptions renew, one-time buys, roast packs. Forever.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Plan upgrade CTA */}
      {plan === "free" && (
        <div className="rounded-2xl border border-ember-500/30 bg-gradient-to-br from-ember-500/10 to-fire-500/10 p-6 text-center">
          <Crown className="h-8 w-8 text-ember-400 mx-auto mb-3" />
          <h3 className="font-display text-xl text-white mb-2">
            Unlock Higher Commissions
          </h3>
          <p className="text-ash-400 text-sm mb-4">
            Upgrade to Starter (20% / 2 levels), Pro (25% / 3 levels), or Agency (30% / 3 levels) to maximize your earnings.
          </p>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 rounded-xl bg-ember-500 px-6 py-3 text-sm font-bold text-white hover:bg-ember-600 transition-all"
          >
            View Plans
          </Link>
        </div>
      )}
    </div>
  );
}

function StatBox({
  icon: Icon,
  label,
  value,
  color = "text-white",
}: {
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


