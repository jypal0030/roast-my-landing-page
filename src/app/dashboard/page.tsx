"use client";

import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Flame,
  Gift,
  Crown,
  DollarSign,
  Users,
  LayoutDashboard,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function DashboardPage() {
  const { data: session, status } = useSession();

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
          <h1 className="font-display text-4xl text-white mb-4">Not Signed In</h1>
          <Link href="/auth/signin" className="inline-flex items-center gap-2 rounded-lg bg-fire-500 px-6 py-3 text-sm font-semibold text-white hover:bg-fire-600">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const user = session.user;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <h1 className="font-display text-4xl text-white mb-2">Dashboard</h1>
        <p className="text-ash-400">
          Welcome back, {user.name || "Roaster"} —{" "}
          <span className="text-fire-400 font-semibold capitalize">{user.plan || "Free"} Plan</span>
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard icon={Crown} label="Current Plan" value={(user.plan || "free").toUpperCase()} color="text-amber-400" />
        <StatCard icon={Flame} label="Total Roasts" value="0" color="text-fire-400" />
        <StatCard icon={Users} label="Referrals" value="0" color="text-emerald-400" />
        <StatCard icon={DollarSign} label="Balance" value={formatCurrency(user.balance || 0)} color="text-fire-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="font-display text-2xl text-white mb-4">Roast History</h2>
          <div className="rounded-xl border border-ash-700 bg-ash-800/50 p-8 text-center">
            <Flame className="h-10 w-10 text-ash-600 mx-auto mb-3" />
            <p className="text-ash-400 mb-4">No roasts yet. Time to roast something!</p>
            <Link href="/" className="inline-flex items-center gap-2 rounded-lg bg-fire-500 px-4 py-2 text-sm font-bold text-white hover:bg-fire-600">
              <Flame className="h-4 w-4" /> Roast Your First Site
            </Link>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-ash-700 bg-ash-800/50 p-5">
            <h3 className="font-display text-lg text-white mb-4 flex items-center gap-2">
              <Gift className="h-5 w-5 text-ember-400" /> Your Referral Code
            </h3>
            <div className="rounded-lg bg-ash-700/50 p-3 text-center mb-3">
              <code className="text-lg font-bold text-ember-400">{user.referralCode || "USER-XXXX"}</code>
            </div>
            <Link href="/referral" className="block w-full text-center rounded-lg bg-ember-500/10 border border-ember-500/30 px-4 py-2 text-sm font-medium text-ember-400 hover:bg-ember-500/20">
              View Referral Dashboard
            </Link>
          </div>

          <div className="rounded-xl border border-ash-700 bg-ash-800/50 p-5">
            <h3 className="font-display text-lg text-white mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Link href="/" className="block w-full rounded-lg bg-fire-500 px-4 py-2 text-sm font-bold text-white hover:bg-fire-600 text-center">
                <Flame className="h-4 w-4 inline mr-1" /> Roast a Website
              </Link>
              {(user.plan === "free" || !user.plan) && (
                <Link href="/pricing" className="block w-full rounded-lg border border-ash-600 px-4 py-2 text-sm font-medium text-ash-300 hover:bg-ash-700 text-center">
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
