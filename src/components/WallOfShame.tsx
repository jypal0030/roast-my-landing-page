"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ExternalLink, DollarSign } from "lucide-react";
import { getScoreBgColor, getScoreEmoji, formatCurrency } from "@/lib/utils";

interface RoastCard {
  id: string;
  domain: string;
  overallScore: number;
  vibe: string;
  totalMonthlyLoss: number;
  brutalityLevel: number;
  createdAt: string;
}

export function WallOfShame() {
  const [roasts, setRoasts] = useState<RoastCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"worst" | "best">("worst");

  useEffect(() => {
    fetchRoasts();
  }, [tab]);

  const fetchRoasts = async () => {
    setLoading(true);
    try {
      const order = tab === "worst" ? "asc" : "desc";
      const res = await fetch(`/api/roasts/public?limit=12`);
      if (res.ok) {
        const data = await res.json();
        const sorted = [...(data.roasts || [])].sort((a: RoastCard, b: RoastCard) =>
          tab === "worst" ? a.overallScore - b.overallScore : b.overallScore - a.overallScore
        );
        setRoasts(sorted);
      }
    } catch { /* silent */ }
    finally { setLoading(false); }
  };

  return (
    <section id="gallery" className="border-t border-ash-800 bg-ash-800 px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="font-display text-4xl sm:text-5xl text-white mb-4">
            {tab === "worst" ? "🔥 Wall of Shame" : "🏆 Wall of Fame"}
          </h2>
          <p className="text-ash-400 max-w-xl mx-auto">
            {tab === "worst"
              ? "The worst landing pages we've roasted. Could yours be next?"
              : "The rare websites that survived our roast with dignity intact."}
          </p>
        </motion.div>

        <div className="flex justify-center gap-2 mb-8">
          {["worst", "best"].map((t) => (
            <button key={t} onClick={() => setTab(t as "worst" | "best")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 active:scale-95 ${
                tab === t
                  ? t === "worst" ? "bg-fire-500/20 text-fire-400 border border-fire-500/30"
                  : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "bg-ash-800 text-ash-400 border border-ash-700 hover:border-ash-600 hover:scale-105"
              }`}>
              {t === "worst" ? "🔥 Worst Roasts" : "🏆 Best Roasts"}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-xl border border-ash-700 bg-ash-800 p-5 animate-pulse">
                <div className="h-4 w-32 bg-ash-700 rounded mb-3" />
                <div className="h-6 w-24 bg-ash-700 rounded mb-2" />
                <div className="h-4 w-20 bg-ash-700 rounded" />
              </div>
            ))}
          </div>
        ) : roasts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-ash-500 text-lg mb-4">No roasts yet. Be the first!</p>
            <Link href="/" className="inline-flex items-center gap-2 rounded-lg bg-fire-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-fire-600">
              Roast Your Website
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {roasts.map((roast, i) => (
              <motion.div key={roast.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Link href={`/roast/${roast.id}`} className="group block rounded-xl border border-ash-700 bg-ash-800 p-5 hover:border-ash-500 hover:scale-[1.02] hover:shadow-xl hover:shadow-fire-500/10 transition-all duration-300 hover:bg-ash-700/50">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 text-ash-500" />
                      <span className="text-sm font-medium text-ash-200 truncate max-w-[160px]">{roast.domain}</span>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold text-white ${getScoreBgColor(roast.overallScore)}`}>
                      {roast.overallScore}/10 {getScoreEmoji(roast.overallScore)}
                    </span>
                  </div>
                  <p className="text-lg font-display text-white mb-2">&ldquo;{roast.vibe}&rdquo;</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-fire-400 flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />{formatCurrency(roast.totalMonthlyLoss)}/mo lost
                    </span>
                    <span className="text-fire-400 text-sm font-medium group-hover:gap-2 transition-all flex items-center">
                      View <ArrowRight className="h-3 w-3 ml-1" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        <div className="text-center mt-8">
          <Link href="/" className="inline-flex items-center gap-2 rounded-xl border border-fire-500/30 bg-fire-500/10 px-6 py-3 text-sm font-bold text-fire-400 hover:bg-fire-500/20 transition-all">
            🔥 Roast Your Site &amp; Join the Wall
          </Link>
        </div>
      </div>
    </section>
  );
}
