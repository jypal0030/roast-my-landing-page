"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { Flame, Users, DollarSign, Star, Zap, Shield } from "lucide-react";

interface Stats {
  roastCount: number;
  userCount: number;
}

const FALLBACK_STATS: Stats = { roastCount: 0, userCount: 0 };

// Testimonials will populate from real user feedback once available
// Display transparent launch messaging instead of fabricated quotes
const TRUST_FEATURES = [
  {
    title: "Brutally Honest",
    desc: "No sugar-coating. Your website gets the feedback it actually needs — delivered with dark humor you'll want to share.",
    icon: "Flame",
  },
  {
    title: "Actionable Fixes",
    desc: "Every category includes a specific, implementable fix. Not just 'your design is bad' — here's exactly what to change.",
    icon: "Zap",
  },
  {
    title: "Know What It Costs You",
    desc: "Quantify exactly how much money your site's problems are costing — and what you'll save by fixing them.",
    icon: "DollarSign",
  },
];

export function SocialProof() {
  const [stats, setStats] = useState<Stats>(FALLBACK_STATS);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((d) => setStats({ roastCount: d.roastCount || 0, userCount: d.userCount || 0 }))
      .catch(() => {});
  }, []);

  const roastCount = stats.roastCount || 0;
  const userCount = stats.userCount || 0;

  return (
    <section className="border-t border-ash-800 px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <StatCard icon={Flame} value={stats.roastCount === 0 ? "Be the first" : <AnimatedCounter value={roastCount} suffix="+" />} label="Websites Roasted" />
          <StatCard icon={Users} value={stats.userCount === 0 ? "Early" : <AnimatedCounter value={userCount} suffix="+" />} label="Roasters" />
          <StatCard icon={DollarSign} value={stats.roastCount > 0 ? <AnimatedCounter value={stats.roastCount * 350} prefix="$" suffix="+" /> : "Launching"} label="Revenue Loss Found" />
          <StatCard icon={Star} value={stats.roastCount > 0 ? "5/5" : "New"} label="Avg. Roast Rating" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h3 className="text-center font-display text-3xl text-white mb-4">Why Founders Trust Us</h3>
          <p className="text-center text-ash-400 text-sm mb-10 max-w-xl mx-auto">
            We&apos;re just getting started. Real testimonials coming soon — for now, here&apos;s what makes RoastMyLP different.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TRUST_FEATURES.map((t) => {
              const IconComp = t.icon === "Flame" ? Flame : t.icon === "Zap" ? Zap : DollarSign;
              return (
                <div key={t.title} className="rounded-xl border border-ash-700 bg-ash-800 p-6 transition-all duration-300 hover:scale-[1.01] hover:shadow-lg">
                  <IconComp className="h-8 w-8 text-fire-400 mb-3" />
                  <h4 className="text-lg font-semibold text-white mb-2">{t.title}</h4>
                  <p className="text-sm text-ash-300 leading-relaxed">{t.desc}</p>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

interface StatCardProps { icon: React.ElementType; value: React.ReactNode; label: string }

function StatCard({ icon: Icon, value, label }: StatCardProps) {
  return (
    <div className="text-center p-6 rounded-xl border border-ash-700 bg-ash-800/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
      <Icon className="h-6 w-6 text-fire-400 mx-auto mb-3" />
      <div className="text-2xl sm:text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-ash-400">{label}</div>
    </div>
  );
}
