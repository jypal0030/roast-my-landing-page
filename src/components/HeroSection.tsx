"use client";

import { motion } from "framer-motion";
import { Flame, Zap } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-4 py-20 sm:py-32">
      {/* Background glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-fire-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full bg-ember-500/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-4xl text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-fire-500/30 bg-fire-500/10 px-4 py-1.5"
        >
          <Zap className="h-4 w-4 text-fire-400" />
          <span className="text-sm font-medium text-fire-300">AI-Powered Website Analysis</span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-display text-5xl sm:text-7xl lg:text-8xl text-white leading-[0.95]"
        >
          Your Website Is
          <br />
          <span className="text-fire-500">Bleeding Money</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 text-lg sm:text-xl text-ash-300 max-w-2xl mx-auto"
        >
          Brutally honest AI roasts your landing page in seconds. Get savage feedback, a
          money-loss calculator, and actionable fixes — all wrapped in dark humor you&apos;ll want
          to share.
        </motion.p>

        {/* Live counter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 flex items-center justify-center gap-2 text-ash-400"
        >
          <Flame className="h-5 w-5 text-fire-500 animate-pulse" />
          <span className="text-sm">
            <span className="font-bold text-white">12,847</span> websites roasted and counting
          </span>
        </motion.div>
      </div>
    </section>
  );
}
