"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Flame, AlertTriangle } from "lucide-react";

export function HeroSection() {
  const [roastCount, setRoastCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((d) => setRoastCount(d.roastCount ?? 0))
      .catch(() => setRoastCount(0));
  }, []);

  return (
    <section className="relative overflow-hidden px-4 py-20 sm:py-32 lg:py-40">
      {/* Background glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-fire-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full bg-ember-500/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-4xl text-center">
        {/* PART 1: Tiny micro-label — wide-spaced Bebas Neue */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-xs font-display tracking-[0.2em] text-fire-500 mb-6"
        >
          AI-POWERED WEBSITE ANALYSIS
        </motion.p>

        {/* Warning banner — the hook before the headline */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.4, ease: [0, 0, 0.2, 1] }}
          className="mb-8 inline-flex items-center gap-2 rounded-lg border border-fire-500/20 bg-fire-500/5 px-4 py-2"
        >
          <AlertTriangle className="h-4 w-4 text-fire-400" />
          <span className="text-sm font-medium text-fire-300">
            TRUTH HURTS. YOUR BANK ACCOUNT HURTS MORE.
          </span>
        </motion.div>

        {/* PART 2: THE SIGNATURE MOVE */}
        <div className="mb-6">
          {/* Line 1 */}
          <motion.h1
            initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0, 0, 0.2, 1] }}
            className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-white uppercase leading-[1] tracking-[-0.04em]"
          >
            YOUR WEBSITE IS
          </motion.h1>

          {/* Line 2: "BLEEDING" (white) + "MONEY" (gradient — THE punch word) */}
          <motion.h1
            initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.6, delay: 0.27, ease: [0, 0, 0.2, 1] }}
            className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-white uppercase leading-[1] tracking-[-0.04em]"
          >
            BLEEDING{" "}
            <span className="bg-gradient-to-r from-fire-400 via-fire-500 to-amber-400 bg-clip-text text-transparent">
              MONEY
            </span>
          </motion.h1>
        </div>

        {/* PART 3: Subtitle — Inter, max-w-2xl */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5, ease: [0, 0, 0.2, 1] }}
          className="mt-6 text-lg sm:text-xl text-ash-300 max-w-2xl mx-auto"
        >
          Brutally honest AI roasts your landing page in seconds. Get savage feedback, a
          money-loss calculator, and actionable fixes — all wrapped in dark humor you&apos;ll want
          to share.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-4 text-sm text-ash-500 max-w-lg mx-auto"
        >
          🔒 No sign-up required for your first roast. We never store your website data permanently.
        </motion.p>

        {/* Live counter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="mt-8 flex items-center justify-center gap-2 text-ash-400"
        >
          <Flame className="h-5 w-5 text-fire-500 animate-pulse" />
          <span className="text-sm">
            <span id="roast-counter" className="font-bold text-white">
              {roastCount === null ? "..." : roastCount === 0 ? "Be the first —" : roastCount.toLocaleString()}
            </span>{" "}
            websites roasted. <span className="text-fire-400">Be the next.</span>
          </span>
        </motion.div>
      </div>
    </section>
  );
}
