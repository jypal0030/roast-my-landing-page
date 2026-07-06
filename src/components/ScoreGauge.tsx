"use client";

import { useEffect, useState } from "react";
import { motion, animate } from "framer-motion";

interface ScoreGaugeProps {
  score: number;
  size?: number;
}

export function ScoreGauge({ score, size = 200 }: ScoreGaugeProps) {
  const [displayScore, setDisplayScore] = useState(0);
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Dynamic gradient based on score
  const getGradientId = `scoreGradient-${score}`;
  const gradientColors =
    score >= 8
      ? { start: "#10b981", mid: "#34d399", end: "#6ee7b7" }
      : score >= 6
      ? { start: "#f59e0b", mid: "#fbbf24", end: "#fcd34d" }
      : score >= 4
      ? { start: "#f97316", mid: "#fb923c", end: "#fdba74" }
      : { start: "#e94560", mid: "#fb7185", end: "#fda4af" };

  const glowColor =
    score >= 8
      ? "rgba(16,185,129,0.3)"
      : score >= 6
      ? "rgba(245,158,11,0.3)"
      : score >= 4
      ? "rgba(249,115,22,0.3)"
      : "rgba(233,69,96,0.3)";

  useEffect(() => {
    const controls = animate(0, score, {
      duration: 2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplayScore(Math.round(v)),
    });
    return controls.stop;
  }, [score]);

  return (
    <motion.div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
      initial={{ scale: 0.3, opacity: 0, filter: "blur(10px)" }}
      animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Outer glow */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          boxShadow: `0 0 60px ${glowColor}, 0 0 120px ${glowColor.replace("0.3", "0.1")}`,
        }}
      />

      {/* SVG Ring */}
      <svg width={size} height={size} className="absolute -rotate-90" style={{ filter: "drop-shadow(0 0 8px rgba(0,0,0,0.4))" }}>
        <defs>
          <linearGradient id={getGradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={gradientColors.start} />
            <stop offset="50%" stopColor={gradientColors.mid} />
            <stop offset="100%" stopColor={gradientColors.end} />
          </linearGradient>
        </defs>
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(51,51,85,0.3)"
          strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${getGradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: score / 10 }}
          transition={{ duration: 2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          strokeDasharray={circumference}
        />
      </svg>

      {/* Score display */}
      <div className="text-center z-10">
        <motion.div
          className="text-6xl font-display font-bold leading-none"
          style={{
            background: `linear-gradient(135deg, ${gradientColors.start}, ${gradientColors.mid})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            filter: `drop-shadow(0 0 12px ${glowColor})`,
          }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          {displayScore}
        </motion.div>
        <motion.div
          className="text-sm font-medium text-ash-500 mt-1 tracking-widest uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          out of 10
        </motion.div>
      </div>
    </motion.div>
  );
}
