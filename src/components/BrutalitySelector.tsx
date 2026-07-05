"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const LEVELS = [
  { level: 1, label: "Playful", emoji: "😏", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  { level: 2, label: "Savage", emoji: "🔥", color: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
  { level: 3, label: "Brutal", emoji: "💀", color: "bg-orange-500/20 text-orange-400 border-orange-500/30" },
  { level: 4, label: "Devastating", emoji: "☠️", color: "bg-red-500/20 text-red-400 border-red-500/30" },
  { level: 5, label: "Nuclear", emoji: "🧨", color: "bg-fire-500/20 text-fire-400 border-fire-500/50" },
];

interface BrutalitySelectorProps {
  brutalityLevel: number;
  setBrutalityLevel: (level: number) => void;
  disabled?: boolean;
}

export function BrutalitySelector({ brutalityLevel, setBrutalityLevel, disabled }: BrutalitySelectorProps) {
  return (
    <div className="mt-4">
      <p className="text-xs text-ash-500 mb-2 text-center transition-all duration-300">Brutality Level</p>
      <div className="flex justify-center gap-1.5 flex-wrap">
        {LEVELS.map(({ level, label, emoji, color }) => (
          <motion.button
            key={level}
            type="button"
            onClick={() => setBrutalityLevel(level)}
            disabled={disabled}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-300",
              brutalityLevel === level
                ? color
                : "border-ash-600 text-ash-400 hover:border-ash-500 hover:text-ash-300"
            )}
          >
            {emoji} {label}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
