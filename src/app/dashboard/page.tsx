"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Flame, Gift, Crown, DollarSign, Users, ExternalLink, Clock,
} from "lucide-react";
import { formatCurrency, getScoreBgColor } from "@/lib/utils";

interface RoastItem {
  id: string; domain: string; overallScore: number; vibe: string; createdAt: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [roasts, setRoasts] = useState<RoastItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.id) {
      // Fetch roasts
      fetch("/api/roasts?limit=50")
        .then((r) => r.json())
        .then((d) => setRoasts(d.roasts || []))
        .catch(() => {})
        .finally(() => setLoading(false));

      // Claim pending referral (cookie set by middleware from ?ref=CODE)
      const refCookie = document.cookie.match(/referral_code=([^;]+)/);
      if (refCookie && refCookie[1]) {
        fetch("/api/referral/claim", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ referralCode: refCookie[1] }),
        }).then(() => {
          // Clear the cookie after claiming
          document.cookie = "referral_code=; max-age=0; path=/";
        }).catch(() => {});
      }
    } else if (status !== "loading") {
      setLoading(false);
    }
  }, [session, status]);

  if (status === "loading") {
    return <div className="flex min-h-screen items-center justify-center"><Flame className="h-8 w-8 text-fire-500 animate-pulse" /></div>;
  }

  if (!session?.user) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="text-center">
          <h1 className="font-display text-4xl text-white mb-4">Not Signed In</h1>
          <Link href="/auth/signin" className="inline-flex items-center gap-2 rounded-lg bg-fire-500 px-6 py-3 text-sm font-semibold text-white hover:bg-fire-600">Sign In</Link>
        </div>
      </div>
    );
  }

  const user = session.user;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <h1 className="font-display text-4xl text-white mb-2">Dashboard</h1>
        <p className="text-ash-400">Welcome back, {user.name || "Roaster"} — <span className="text-fire-400 font-semibold capitalize">{user.plan || "Free"} Plan</span></p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard icon={Crown} label="Current Plan" value={(user.plan || "free").toUpperCase()} color="text-amber-400" />
        <StatCard icon={Flame} label="Total Roasts" value={String(roasts.length)} color="text-fire-400" />
        <StatCard icon={Users} label="Referrals" value="0" color="text-emerald-400" />
        <StatCard icon={DollarSign} label="Balance" value={formatCurrency(user.balance || 0)} color="text-fire-400" />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="font-display text-2xl text-white mb-4">Roast History</h2>
          {loading ? (
            <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="rounded-xl border border-ash-700 bg-ash-800/50 p-4 animate-pulse"><div className="h-4 w-48 bg-ash-700 rounded mb-2" /><div className="h-3 w-24 bg-ash-700 rounded" /></div>)}</div>
          ) : roasts.length === 0 ? (
            <div className="rounded-xl border border-ash-700 bg-ash-800/50 p-8 text-center">
              <Flame className="h-10 w-10 text-ash-600 mx-auto mb-3" />
              <p className="text-ash-300 font-medium mb-2">Your roast history is emptier than a website without a CTA.</p>
              <p className="text-ash-500 text-sm mb-4">Let&apos;s fix that.</p>
              <Link href="/" className="inline-flex items-center gap-2 rounded-lg bg-fire-500 px-4 py-2 text-sm font-bold text-white hover:bg-fire-600 active:scale-95 transition-all duration-300"><Flame className="h-4 w-4" /> Roast Your First Site</Link>
            </div>
          ) : (
            <div className="space-y-2">
              {roasts.map((roast) => (
                <Link key={roast.id} href={`/roast/${roast.id}`} className="flex items-center justify-between rounded-xl border border-ash-700 bg-ash-800/50 p-4 hover:border-ash-600 hover:scale-[1.01] hover:shadow-md transition-all duration-300">
                  <div className="flex items-center gap-3">
                    <ExternalLink className="h-4 w-4 text-ash-500" />
                    <div>
                      <div className="font-medium text-white text-sm">{roast.domain}</div>
                      <div className="text-xs text-ash-500 flex items-center gap-2"><Clock className="h-3 w-3" />{new Date(roast.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <span className={`inline-flex items-center justify-center w-10 h-10 rounded-lg font-bold text-sm text-white ${getScoreBgColor(roast.overallScore)}`}>{roast.overallScore}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-ash-700 bg-ash-800/50 p-5">
            <h3 className="font-display text-lg text-white mb-4 flex items-center gap-2"><Gift className="h-5 w-5 text-ember-400" /> Your Referral Code</h3>
            <div className="rounded-lg bg-ash-700/50 p-3 text-center mb-3"><code className="text-lg font-bold text-ember-400">{user.referralCode || "USER-XXXX"}</code></div>
            <Link href="/referral" className="block w-full text-center rounded-lg bg-ember-500/10 border border-ember-500/30 px-4 py-2 text-sm font-medium text-ember-400 hover:bg-ember-500/20">View Referral Dashboard</Link>
          </div>

          <div className="rounded-xl border border-ash-700 bg-ash-800/50 p-5">
            <h3 className="font-display text-lg text-white mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Link href="/" className="inline-flex items-center gap-2 rounded-lg bg-fire-500 px-4 py-2 text-sm font-bold text-white hover:bg-fire-600 active:scale-95 transition-all duration-300"><Flame className="h-4 w-4" /> Roast a Website</Link>
              {(user.plan === "free" || !user.plan) && <Link href="/pricing" className="inline-flex items-center gap-2 rounded-lg border border-ash-600 px-4 py-2 text-sm font-medium text-ash-300 hover:bg-ash-700 active:scale-95 transition-all duration-300"><Crown className="h-4 w-4" /> Upgrade Plan</Link>}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: string; color: string }) {
  return (
    <div className="rounded-xl border border-ash-700 bg-ash-800/50 p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
      <Icon className={`h-5 w-5 ${color} mb-2`} />
      <div className="text-xs text-ash-500 mb-1">{label}</div>
      <div className="text-xl font-bold text-white">{value}</div>
    </div>
  );
}
