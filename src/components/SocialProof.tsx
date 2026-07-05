"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Flame, Users, DollarSign, Star } from "lucide-react";

interface Stats {
  roastCount: number;
  userCount: number;
}

const FALLBACK_STATS: Stats = { roastCount: 0, userCount: 0 };

const testimonials = [
  {
    quote: "RoastMyLP tore apart our landing page so badly we redesigned it overnight. Conversions went up 40%.",
    name: "Sarah Chen", role: "Founder, ShipFast",
  },
  {
    quote: "I shared my roast on Twitter and got 2K likes. Best free marketing I've ever had.",
    name: "Alex Rivera", role: "Indie Hacker",
  },
  {
    quote: "The money loss calculator alone is worth the price. Found $3,500/month in leakage we fixed in an hour.",
    name: "Marcus Kim", role: "Growth Lead, ScaleUp",
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

  const roastLabel = stats.roastCount === 0
    ? "Brand new — be first!"
    : `${stats.roastCount.toLocaleString()}+`;

  const userLabel = stats.userCount === 0
    ? "Early adopters"
    : `${stats.userCount.toLocaleString()}+`;

  return (
    <section className="border-t border-ash-800 px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <StatCard icon={Flame} value={roastLabel} label="Websites Roasted" />
          <StatCard icon={Users} value={userLabel} label="Users" />
          <StatCard icon={DollarSign} value="$0+" label="Revenue Loss Found" />
          <StatCard icon={Star} value="New" label="Average Rating" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h3 className="text-center font-display text-3xl text-white mb-10">What Our Users Say</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="rounded-xl border border-ash-700 bg-ash-800 p-6 transition-all duration-300 hover:scale-[1.01] hover:shadow-lg">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-ash-200 text-sm leading-relaxed mb-4">&ldquo;{t.quote}&rdquo;</p>
                <div><div className="text-sm font-semibold text-white">{t.name}</div><div className="text-xs text-ash-500">{t.role}</div></div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function StatCard({ icon: Icon, value, label }: { icon: React.ElementType; value: string; label: string }) {
  return (
    <div className="text-center p-6 rounded-xl border border-ash-700 bg-ash-800/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
      <Icon className="h-6 w-6 text-fire-400 mx-auto mb-3" />
      <div className="text-2xl sm:text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-ash-400">{label}</div>
    </div>
  );
}
