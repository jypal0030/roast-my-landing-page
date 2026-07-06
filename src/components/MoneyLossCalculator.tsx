"use client";

import { motion } from "framer-motion";
import { DollarSign, TrendingDown, AlertTriangle } from "lucide-react";
import { CountUp } from "@/components/CountUp";
import { formatCurrency } from "@/lib/utils";

interface MoneyLossCalculatorProps {
  monthlyLoss: number;
  yearlyLoss: number;
  scores: Record<string, { score: number; roast: string; fix: string; moneyImpact: number }>;
}

const CATEGORY_NAMES: Record<string, string> = {
  firstImpression: "First Impression",
  copywriting: "Copywriting",
  visualDesign: "Visual Design",
  ctaClarity: "CTA Clarity",
  trustSignals: "Trust Signals",
  mobileFriendliness: "Mobile",
  loadingSpeed: "Speed",
  aboveTheFold: "Above Fold",
};

export function MoneyLossCalculator({ monthlyLoss, yearlyLoss, scores }: MoneyLossCalculatorProps) {
  const items = Object.entries(scores)
    .filter(([_, data]) => data.moneyImpact > 0)
    .sort((a, b) => b[1].moneyImpact - a[1].moneyImpact);

  if (items.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="relative overflow-hidden rounded-3xl border border-fire-500/20 bg-gradient-to-br from-fire-500/5 via-ash-800/80 to-ash-800/40 p-6 sm:p-8"
    >
      {/* Background glow */}
      <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-fire-500/5 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />

      <div className="relative">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-fire-500/10 border border-fire-500/20">
            <AlertTriangle className="h-5 w-5 text-fire-400" />
          </div>
          <div>
            <h3 className="font-display text-2xl sm:text-3xl text-white">Money Loss Calculator</h3>
            <p className="text-xs text-ash-500 mt-0.5">Estimated monthly revenue you&apos;re leaving on the table</p>
          </div>
        </div>

        {/* Big numbers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-fire-500/10 to-fire-500/5 border border-fire-500/20 p-5"
          >
            <div className="absolute top-0 right-0 w-20 h-20 rounded-bl-full bg-fire-500/10" />
            <div className="relative">
              <div className="flex items-center gap-2 text-fire-400/80 text-xs font-medium mb-2 tracking-wider uppercase">
                <DollarSign className="h-3.5 w-3.5" />
                Monthly Revenue Loss
              </div>
              <div className="text-3xl sm:text-4xl font-display font-bold text-fire-400 tracking-tight">
                <CountUp value={monthlyLoss} duration={2.5} />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-500/20 p-5"
          >
            <div className="absolute top-0 right-0 w-20 h-20 rounded-bl-full bg-amber-500/10" />
            <div className="relative">
              <div className="flex items-center gap-2 text-amber-400/80 text-xs font-medium mb-2 tracking-wider uppercase">
                <TrendingDown className="h-3.5 w-3.5" />
                Yearly Revenue Loss
              </div>
              <div className="text-3xl sm:text-4xl font-display font-bold text-amber-400 tracking-tight">
                <CountUp value={yearlyLoss} duration={3} />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Breakdown bars */}
        <div>
          <h4 className="text-xs font-semibold text-ash-500 mb-4 tracking-widest uppercase">Where The Money Goes</h4>
          <div className="space-y-2.5">
            {items.map(([key, data], i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.08 }}
                className="group flex items-center justify-between rounded-xl bg-ash-800/60 border border-ash-700/50 px-4 py-3 hover:border-fire-500/20 hover:bg-ash-700/50 transition-all duration-300"
              >
                <span className="text-sm font-medium text-ash-300 group-hover:text-white transition-colors">
                  {CATEGORY_NAMES[key] || key}
                </span>
                <div className="flex items-center gap-4">
                  <div className="hidden sm:block h-1.5 w-24 sm:w-32 bg-ash-700 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-fire-500 to-fire-400"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((data.moneyImpact / (monthlyLoss || 1)) * 100, 100)}%` }}
                      transition={{ duration: 1.2, ease: "easeOut", delay: 0.8 + i * 0.1 }}
                    />
                  </div>
                  <span className="text-sm font-bold text-fire-400 tabular-nums min-w-[60px] text-right">
                    −{formatCurrency(data.moneyImpact)}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
