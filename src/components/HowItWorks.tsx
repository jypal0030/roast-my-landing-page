"use client";

import { motion } from "framer-motion";
import { Search, Flame, Share2 } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "DROP THE URL",
    desc: "Paste any landing page. No sign-up. No credit card. We don't judge. Yet.",
  },
  {
    number: "02",
    icon: Flame,
    title: "GET ROASTED",
    desc: "Our AI tears apart your design, copy, CTAs, and trust signals. Specific, brutal, and funny.",
  },
  {
    number: "03",
    icon: Share2,
    title: "FIX & SHARE",
    desc: "Get actionable fixes. Stop losing money. Share your roast if you dare.",
  },
];

const cardBaseClasses =
  "group relative p-6 sm:p-8 rounded-2xl bg-card border border-white/[0.06] shadow-[0_2px_8px_rgba(0,0,0,0.4),0_1px_2px_rgba(0,0,0,0.2)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.5),0_2px_4px_rgba(0,0,0,0.3)] hover:-translate-y-1 hover:border-fire-500/20 transition-all duration-300 ease-out";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

const childVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0, 0, 0.2, 1] } },
};

export function HowItWorks() {
  return (
    <section className="border-t border-white/[0.06] px-4 py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-6xl">
        {/* ─── Section heading: 3-part pattern ─── */}
        <div className="text-center mb-16 sm:mb-20">
          {/* Part 1: Tiny wide-spaced label — Bebas Neue, fire accent */}
          <p className="text-xs font-display tracking-[0.2em] text-fire-500 mb-4">
            THE PROCESS
          </p>

          {/* Part 2: Main heading — Bebas Neue, massive */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0, 0, 0.2, 1] }}
            className="font-display text-3xl sm:text-4xl md:text-5xl text-white uppercase leading-[1] tracking-[-0.03em] mb-4"
          >
            HOW THE ROAST WORKS
          </motion.h2>

          {/* Part 3: Subtitle — Inter, muted */}
          <p className="text-ash-300 max-w-lg mx-auto">
            Three steps from &ldquo;is my site bad?&rdquo; to &ldquo;okay that was painfully accurate.&rdquo;
          </p>
        </div>

        {/* ─── Step cards ─── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6"
        >
          {steps.map((step) => (
            <motion.div key={step.number} variants={childVariants} className={cardBaseClasses}>
              {/* Step number + divider — ghosted, visual anchor */}
              <div className="flex items-center gap-4 mb-5">
                <span className="font-display text-4xl text-fire-500/20 group-hover:text-fire-500/40 transition-colors">
                  {step.number}
                </span>
                <div className="h-px flex-1 bg-gradient-to-r from-fire-500/20 to-transparent" />
              </div>

              {/* Icon — in glow container */}
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-fire-500/10 border border-fire-500/15 mb-4 group-hover:bg-fire-500/15 group-hover:shadow-[0_0_20px_rgba(233,69,96,0.15)] transition-all duration-300">
                <step.icon className="h-5 w-5 text-fire-500" />
              </div>

              {/* Title — Bebas Neue */}
              <h3 className="font-display text-xl tracking-wide text-white uppercase leading-[1] mb-3">
                {step.title}
              </h3>

              {/* Description — Inter, muted */}
              <p className="text-sm text-ash-300 leading-relaxed">
                {step.desc}
              </p>

              {/* Bottom accent line — appears on hover */}
              <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-fire-500/0 via-fire-500/30 to-fire-500/0 scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
