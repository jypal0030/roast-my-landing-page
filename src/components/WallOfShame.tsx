"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { getScoreBgColor, getScoreEmoji } from "@/lib/utils";

interface RoastCard {
  id: string;
  domain: string;
  overallScore: number;
  vibe: string;
  createdAt: string;
}

export function WallOfShame() {
  const [roasts, setRoasts] = useState<RoastCard[]>([]);
  const [tab, setTab] = useState<"worst" | "best">("worst");

  useEffect(() => {
    fetchRoasts();
  }, [tab]);

  const fetchRoasts = async () => {
    try {
      const order = tab === "worst" ? "asc" : "desc";
      const res = await fetch(`/api/roasts?order=${order}&limit=12`);
      if (res.ok) {
        const data = await res.json();
        setRoasts(data);
      }
    } catch {
      // Gallery loading fallback
    }
  };

  return (
    <section id="gallery" className="px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="font-display text-4xl sm:text-5xl text-white mb-4">
            {tab === "worst" ? "🔥 Wall of Shame" : "🏆 Wall of Fame"}
          </h2>
          <p className="text-ash-400 max-w-xl mx-auto">
            {tab === "worst"
              ? "The worst landing pages we've roasted. Could yours be next?"
              : "The rare websites that survived our roast with dignity intact."}
          </p>
        </div>

        {/* Tab selector */}
        <div className="flex justify-center gap-2 mb-8">
          <button
            onClick={() => setTab("worst")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === "worst"
                ? "bg-fire-500/20 text-fire-400 border border-fire-500/30"
                : "bg-ash-800 text-ash-400 border border-ash-700 hover:border-ash-600"
            }`}
          >
            🔥 Worst Roasts
          </button>
          <button
            onClick={() => setTab("best")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === "best"
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "bg-ash-800 text-ash-400 border border-ash-700 hover:border-ash-600"
            }`}
          >
            🏆 Best Roasts
          </button>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {roasts.length > 0
            ? roasts.map((roast, i) => (
                <motion.div
                  key={roast.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={`/roast/${roast.id}`}
                    className="group block rounded-xl border border-ash-700 bg-ash-800 p-5 hover:border-ash-500 transition-all hover:bg-ash-700/50"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <ExternalLink className="h-4 w-4 text-ash-500" />
                        <span className="text-sm font-medium text-ash-200 truncate max-w-[180px]">
                          {roast.domain}
                        </span>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold text-white ${getScoreBgColor(roast.overallScore)}`}
                      >
                        {roast.overallScore}/10 {getScoreEmoji(roast.overallScore)}
                      </span>
                    </div>
                    <p className="text-lg font-display text-white mb-2">
                      &ldquo;{roast.vibe}&rdquo;
                    </p>
                    <div className="flex items-center text-fire-400 text-sm font-medium group-hover:gap-2 transition-all">
                      View Full Roast <ArrowRight className="h-3 w-3 ml-1" />
                    </div>
                  </Link>
                </motion.div>
              ))
            : // Skeleton loading
              Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-ash-700 bg-ash-800 p-5 animate-pulse"
                >
                  <div className="h-4 w-32 bg-ash-700 rounded mb-3" />
                  <div className="h-6 w-24 bg-ash-700 rounded mb-2" />
                  <div className="h-4 w-20 bg-ash-700 rounded" />
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}
