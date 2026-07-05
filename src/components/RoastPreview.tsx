"use client";

import { motion } from "framer-motion";
import { Flame, DollarSign, ArrowRight, Eye } from "lucide-react";

const SAMPLE_CATEGORIES = [
  { name: "First Impression", score: 3, roast: "Looks like it was designed during a PowerPoint presentation" },
  { name: "CTA Clarity", score: 4, roast: "Your CTA is playing hide and seek. And winning." },
  { name: "Visual Design", score: 5, roast: "Bootstrap called, it wants its 2016 template back" },
];

export function RoastPreview() {
  return (
    <section className="border-t border-ash-800 bg-ash-800/50 px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          className="text-center mb-10"
        >
          <h2 className="font-display text-3xl sm:text-4xl text-white mb-3">
            Here&apos;s What You&apos;ll Get
          </h2>
          <p className="text-ash-400 max-w-lg mx-auto">
            A brutally honest AI roast, money loss breakdown, and shareable result — all in one place.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-ash-600 bg-ash-800 shadow-xl overflow-hidden"
        >
          {/* Mock header */}
          <div className="border-b border-ash-700 bg-ash-800/80 px-6 py-3 flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            </div>
            <span className="text-xs text-ash-500 ml-3 font-mono">roastmylp.com/roast/•••</span>
          </div>

          {/* Mock result */}
          <div className="p-6 sm:p-8">
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-start">
              {/* Score + Money */}
              <div className="shrink-0 flex flex-row lg:flex-col items-center lg:items-start gap-4">
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-red-500/20 border-2 border-red-500/30">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-400 font-display">3.2</div>
                    <div className="text-[10px] text-red-400/60">/10</div>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-ash-500 mb-1">Estimated Monthly Loss</div>
                  <div className="flex items-center gap-1 text-xl font-bold text-fire-400 font-display">
                    <DollarSign className="h-4 w-4" />2,847
                  </div>
                </div>
              </div>

              {/* Category cards */}
              <div className="flex-1 space-y-2 w-full">
                {SAMPLE_CATEGORIES.map((cat, i) => (
                  <motion.div
                    key={cat.name}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="flex items-center gap-3 rounded-lg border border-ash-700/50 bg-ash-800/30 px-4 py-3"
                  >
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-red-500/20 text-red-400 text-xs font-bold shrink-0">
                      {cat.score}
                    </span>
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-white">{cat.name}</div>
                      <div className="text-xs text-ash-400 truncate">&ldquo;{cat.roast}&rdquo;</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Fix CTA */}
            <div className="mt-6 flex items-center gap-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-3">
              <div className="flex-1">
                <div className="text-sm font-medium text-emerald-400">Top Fix</div>
                <div className="text-xs text-ash-400">Add a clear CTA above the fold — expected +23% conversion</div>
              </div>
              <ArrowRight className="h-4 w-4 text-emerald-400 shrink-0" />
            </div>
          </div>
        </motion.div>

        <div className="text-center mt-6">
          <span className="inline-flex items-center gap-1.5 text-xs text-ash-500">
            <Eye className="h-3 w-3" />
            Full roast includes 8 categories, money loss breakdown, and downloadable share card
          </span>
        </div>
      </div>
    </section>
  );
}
