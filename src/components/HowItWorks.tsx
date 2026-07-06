"use client";

import { motion } from "framer-motion";
import { Search, Flame, Share2 } from "lucide-react";

const steps = [
  {
    number: "1",
    icon: Search,
    title: "Paste Your URL",
    desc: "Drop your landing page URL. No sign-up. No credit card. We'll scan it in seconds.",
  },
  {
    number: "2",
    icon: Flame,
    title: "Get Roasted",
    desc: "Our AI tears apart your design, copy, CTAs, and trust signals. Specific, brutal, and funny.",
  },
  {
    number: "3",
    icon: Share2,
    title: "Fix & Share",
    desc: "Get actionable fixes. Stop losing money. Share your roast if you dare.",
  },
];

export function HowItWorks() {
  return (
    <section className="border-t border-ash-800 px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-4xl sm:text-5xl text-white mb-4">
            How It Works
          </h2>
          <p className="text-ash-400 max-w-lg mx-auto">
            Three steps from &ldquo;is my site bad?&rdquo; to &ldquo;okay that was painfully accurate.&rdquo;
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative rounded-2xl border border-ash-700 bg-ash-800/50 p-6 text-center transition-all duration-300 hover:border-fire-500/30 hover:bg-ash-800 hover:scale-[1.02]"
            >
              {/* Step number badge */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-fire-500 text-white font-bold text-sm">
                {step.number}
              </div>
              <step.icon className="h-10 w-10 text-fire-400 mx-auto mt-3 mb-4" />
              <h3 className="font-display text-xl text-white mb-2">{step.title}</h3>
              <p className="text-sm text-ash-400 leading-relaxed">{step.desc}</p>

              {/* Connector arrow (desktop only) */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-3 text-ash-600">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
