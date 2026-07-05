"use client";

import { motion } from "framer-motion";
import { DollarSign, TrendingDown, AlertTriangle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface MoneyLossCalculatorProps {
  monthlyLoss: number;
  yearlyLoss: number;
  scores: Record<string, { score: number; roast: string; fix: string; moneyImpact: number }>;
}

export function MoneyLossCalculator({ monthlyLoss, yearlyLoss, scores }: MoneyLossCalculatorProps) {
  const items = Object.entries(scores)
    .filter(([_, data]) => data.moneyImpact > 0)
    .sort((a, b) => b[1].moneyImpact - a[1].moneyImpact);

  if (items.length === 0) return null;

  return (
    <div className="rounded-2xl border-2 border-fire-500/30 bg-gradient-to-b from-fire-500/5 to-transparent p-6">
      <div className="flex items-center gap-2 mb-6">
        <AlertTriangle className="h-5 w-5 text-fire-400" />
        <h3 className="font-display text-2xl text-white">Money Loss Calculator</h3>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border border-fire-500/20 bg-fire-500/5 p-4"
        >
          <div className="flex items-center gap-2 text-fire-400 text-sm mb-2">
            <DollarSign className="h-4 w-4" />
            Monthly Revenue Loss
          </div>
          <div className="text-3xl sm:text-4xl font-bold text-fire-400 font-display">
            {formatCurrency(monthlyLoss)}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl border border-fire-500/20 bg-fire-500/5 p-4"
        >
          <div className="flex items-center gap-2 text-fire-400 text-sm mb-2">
            <TrendingDown className="h-4 w-4" />
            Yearly Revenue Loss
          </div>
          <div className="text-3xl sm:text-4xl font-bold text-fire-400 font-display">
            {formatCurrency(yearlyLoss)}
          </div>
        </motion.div>
      </div>

      {/* Breakdown */}
      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-ash-400 mb-3">Where You&apos;re Losing Money</h4>
        {items.map(([key, data], i) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.05 }}
            className="flex items-center justify-between rounded-lg bg-ash-800/50 px-4 py-3"
          >
            <span className="text-sm text-ash-300">
              {key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}
            </span>
            <div className="flex items-center gap-3">
              <div className="h-1.5 w-20 bg-ash-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-fire-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((data.moneyImpact / (monthlyLoss || 1)) * 100, 100)}%` }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.5 + i * 0.1 }}
                />
              </div>
              <span className="text-sm font-bold text-fire-400">
                -{formatCurrency(data.moneyImpact)}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
