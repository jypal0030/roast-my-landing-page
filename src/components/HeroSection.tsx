"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Flame, AlertTriangle } from "lucide-react";

export function HeroSection() {
  const [roastCount, setRoastCount] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.6], [0, 100]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((d) => setRoastCount(d.roastCount ?? 0))
      .catch(() => setRoastCount(0));
  }, []);

  return (
    <motion.section
      ref={sectionRef}
      style={{ opacity, scale }}
      className="relative overflow-hidden px-4 pt-24 pb-0 sm:pt-36 sm:pb-0 lg:pt-44"
    >
      {/* Local hero orbs */}
      <div className="absolute inset-0 -z-[5]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-fire-500/[0.07] blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full bg-ember-500/[0.05] blur-3xl" />
      </div>

      <div className="mx-auto max-w-4xl text-center">
        {/* PART 1: Tiny micro-label */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-xs font-display tracking-[0.2em] text-fire-500 mb-6"
        >
          AI-POWERED WEBSITE ANALYSIS
        </motion.p>

        {/* Warning banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.4, ease: [0, 0, 0.2, 1] }}
          className="mb-8 inline-flex items-center gap-2 rounded-lg border border-fire-500/20 bg-fire-500/5 px-4 py-2 backdrop-blur"
        >
          <AlertTriangle className="h-4 w-4 text-fire-400" />
          <span className="text-sm font-medium text-fire-300">
            TRUTH HURTS. YOUR BANK ACCOUNT HURTS MORE.
          </span>
        </motion.div>

        {/* Glass backdrop for heading — improves text visibility */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          style={{ y }}
          className="relative mb-6"
        >
          {/* Text glow layer behind heading */}
          <div className="absolute -inset-8 rounded-3xl bg-gradient-to-b from-white/[0.02] to-transparent backdrop-blur-sm -z-10" />

          {/* Line 1 */}
          <motion.h1
            initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0, 0, 0.2, 1] }}
            className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-white uppercase leading-[1] tracking-[-0.04em]"
            style={{ textShadow: "0 0 80px rgba(233,69,96,0.15), 0 2px 4px rgba(0,0,0,0.3)" }}
          >
            YOUR WEBSITE IS
          </motion.h1>

          {/* Line 2: BLEEDING + gradient MONEY */}
          <motion.h1
            initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.6, delay: 0.27, ease: [0, 0, 0.2, 1] }}
            className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-white uppercase leading-[1] tracking-[-0.04em]"
            style={{ textShadow: "0 0 80px rgba(233,69,96,0.15), 0 2px 4px rgba(0,0,0,0.3)" }}
          >
            BLEEDING{" "}
            <span
              className="bg-[linear-gradient(90deg,#fb7185,#e94560,#f59e0b,#fb7185)] bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient-shift"
              style={{ filter: "drop-shadow(0 0 40px rgba(233,69,96,0.4)) drop-shadow(0 0 80px rgba(251,146,60,0.2))" }}
            >
              MONEY
            </span>
          </motion.h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5, ease: [0, 0, 0.2, 1] }}
          className="mt-6 text-lg sm:text-xl text-ash-200 max-w-2xl mx-auto leading-relaxed"
          style={{ textShadow: "0 1px 2px rgba(0,0,0,0.4)" }}
        >
          Brutally honest AI roasts your landing page in seconds. Get savage feedback, a
          money-loss calculator, and actionable fixes — all wrapped in dark humor you&apos;ll want
          to share.
        </motion.p>

        {/* Privacy */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-4 text-sm text-ash-400 max-w-lg mx-auto"
        >
          🔒 No sign-up required for your first roast. We never store your website data permanently.
        </motion.p>

        {/* Live counter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="mt-8 flex items-center justify-center gap-2"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-ash-800/60 border border-white/[0.06] px-4 py-1.5 backdrop-blur">
            <Flame className="h-4 w-4 text-fire-500 animate-pulse" />
            <span className="text-sm text-ash-300">
              <span className="font-bold text-white">
                {roastCount === null ? "..." : roastCount === 0 ? "Be the first —" : roastCount.toLocaleString()}
              </span>{" "}
              websites roasted. <span className="text-fire-400">Be the next.</span>
            </span>
          </span>
        </motion.div>

        {/* Subtle scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-12 pb-8"
        >
          <div className="mx-auto w-5 h-8 rounded-full border border-white/[0.08] flex justify-center">
            <motion.div
              className="w-1 h-2 rounded-full bg-fire-400/60 mt-1.5"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
