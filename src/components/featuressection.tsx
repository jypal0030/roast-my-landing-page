"use client";

import { motion } from "framer-motion";
import { Flame, Zap, Shield, DollarSign, Share2, BarChart3, Lock, Globe } from "lucide-react";

const features = [
  {
    icon: Flame,
    title: "SAVAGE AI ROASTS",
    desc: "Our AI doesn't hold back. Every roast is hyper-specific — we name your fonts, colors, button text, and conversion crimes. No generic feedback. Ever.",
  },
  {
    icon: DollarSign,
    title: "MONEY LOSS CALCULATOR",
    desc: "See exactly how much revenue your landing page is hemorrhaging. We calculate monthly and yearly losses based on real conversion data — not random numbers.",
  },
  {
    icon: BarChart3,
    title: "COMPETITOR BATTLE",
    desc: "Put two websites head-to-head. See who gets roasted harder. Perfect for client pitches, competitive analysis, or just proving your co-founder wrong.",
  },
  {
    icon: Share2,
    title: "VIRAL SHARE CARDS",
    desc: "Every roast generates a shareable card. Post your score to Twitter, LinkedIn, or send it to your dev team with a \u0022fix this\u0022 note.",
  },
  {
    icon: Shield,
    title: "ACTIONABLE FIXES",
    desc: "Every roast includes specific, implementable fixes — not just criticism. From button color changes to headline rewrites, we tell you exactly what to do.",
  },
  {
    icon: Zap,
    title: "BLAZING FAST",
    desc: "Roast delivered in under 15 seconds. AI analysis, screenshot capture, money-loss calculation — all happening while you watch a loading bar.",
  },
  {
    icon: Lock,
    title: "PRIVACY FIRST",
    desc: "Roasts are private by default. Only you decide what to share. Websites are never stored after analysis. No sign-up required for your first roast.",
  },
  {
    icon: Globe,
    title: "ANY WEBSITE, ANYWHERE",
    desc: "SaaS landing pages, e-commerce stores, portfolios, agency sites — if it has a URL, we'll roast it. Three brutality levels to choose from.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

const childVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0, 0, 0.2, 1] as const } },
};

export function FeaturesSection() {
  return (
    <section id="features" className="border-t border-white/[0.06] px-4 py-20 sm:py-28 lg:py-36">
      <div className="mx-auto max-w-6xl">
        {/* ─── 3-Part Heading Pattern ─── */}
        <div className="text-center mb-16 sm:mb-20">
          <p className="text-xs font-display tracking-[0.2em] text-fire-500 mb-4">
            FEATURES
          </p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0, 0, 0.2, 1] }}
            className="font-display text-3xl sm:text-4xl md:text-5xl text-white uppercase leading-[1] tracking-[-0.03em] mb-4"
          >
            EVERYTHING YOU NEED
            <br />
            <span className="bg-gradient-to-r from-fire-400 via-fire-500 to-amber-400 bg-clip-text text-transparent">
              TO FIX YOUR SITE
            </span>
          </motion.h2>
          <p className="text-ash-300 max-w-xl mx-auto">
            From savage AI feedback to viral sharing — one tool that does it all.
          </p>
        </div>

        {/* ─── Feature Grid ─── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={childVariants}
              className="group relative rounded-2xl border border-white/[0.06] bg-card p-6 transition-all duration-300 ease-out shadow-[0_2px_8px_rgba(0,0,0,0.4),0_1px_2px_rgba(0,0,0,0.2)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.5),0_2px_4px_rgba(0,0,0,0.3)] hover:-translate-y-1 hover:border-fire-500/20"
            >
              {/* Icon — glow container */}
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-fire-500/10 border border-fire-500/15 mb-4 group-hover:bg-fire-500/15 group-hover:shadow-[0_0_20px_rgba(233,69,96,0.15)] transition-all duration-300">
                <feature.icon className="h-5 w-5 text-fire-500" />
              </div>

              {/* Title — Bebas Neue */}
              <h3 className="font-display text-lg text-white uppercase tracking-wide leading-[1] mb-2">
                {feature.title}
              </h3>

              {/* Desc — Inter */}
              <p className="text-sm text-ash-300 leading-relaxed">
                {feature.desc}
              </p>

              {/* Bottom accent line — hover reveal */}
              <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-fire-500/0 via-fire-500/30 to-fire-500/0 scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
            </motion.div>
          ))}
        </motion.div>

        {/* ─── Trust stats row ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
        >
          {[
            { value: "<15s", label: "Roast Time" },
            { value: "5", label: "Analysis Categories" },
            { value: "3", label: "Brutality Levels" },
            { value: "24/7", label: "AI Available" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="font-display text-3xl sm:text-4xl text-white uppercase leading-[1] tracking-[-0.02em] mb-1">
                {stat.value}
              </div>
              <div className="text-xs text-ash-500 tracking-[0.1em] uppercase">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
