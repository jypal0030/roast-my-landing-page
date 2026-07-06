"use client";

import { useEffect, useState, useRef } from "react";
import { motion, animate } from "framer-motion";

interface ScoreGaugeProps {
  score: number;
  size?: number;
}

export function ScoreGauge({ score, size = 240 }: ScoreGaugeProps) {
  const [displayScore, setDisplayScore] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

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
      ? "rgba(16,185,129,0.4)"
      : score >= 6
      ? "rgba(245,158,11,0.4)"
      : score >= 4
      ? "rgba(249,115,22,0.4)"
      : "rgba(233,69,96,0.4)";

  // Pulsing rings on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = size + 60;
    canvas.height = size + 60;

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const rings: { r: number; alpha: number; speed: number }[] = [];
    let animId: number;

    const animateRings = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Spawn new ring
      if (rings.length < 3 && Math.random() < 0.02) {
        rings.push({ r: size / 2 + 5, alpha: 0.4, speed: 0.4 + Math.random() * 0.4 });
      }

      rings.forEach((ring, i) => {
        ring.r += ring.speed;
        ring.alpha -= 0.003;
        if (ring.alpha <= 0) {
          rings.splice(i, 1);
          return;
        }
        ctx.beginPath();
        ctx.arc(cx, cy, ring.r, 0, Math.PI * 2);
        ctx.strokeStyle = glowColor.replace("0.4", String(ring.alpha));
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });

      animId = requestAnimationFrame(animateRings);
    };
    animateRings();

    return () => cancelAnimationFrame(animId);
  }, [size, glowColor]);

  useEffect(() => {
    const controls = animate(0, score, {
      duration: 2.5,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplayScore(Math.round(v)),
    });
    return controls.stop;
  }, [score]);

  const getGradientId = `gauge-${score}-${Date.now()}`;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size + 60, height: size + 60 }}>
      {/* Particle rings canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

      {/* Outer glow ring */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: size + 40,
          height: size + 40,
          boxShadow: `0 0 80px ${glowColor}, 0 0 160px ${glowColor.replace("0.4", "0.15")}`,
        }}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* SVG Ring */}
      <motion.div
        initial={{ scale: 0.1, opacity: 0, filter: "blur(20px)" }}
        animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10"
      >
        <svg width={size} height={size} className="-rotate-90" style={{ filter: "drop-shadow(0 0 12px rgba(0,0,0,0.5))" }}>
          <defs>
            <linearGradient id={getGradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={gradientColors.start} />
              <stop offset="50%" stopColor={gradientColors.mid} />
              <stop offset="100%" stopColor={gradientColors.end} />
            </linearGradient>
          </defs>
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(51,51,85,0.25)" strokeWidth={strokeWidth} />
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
            transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
            strokeDasharray={circumference}
          />
        </svg>
      </motion.div>

      {/* Score text */}
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.6, duration: 0.8, type: "spring", stiffness: 100 }}
          className="text-center"
        >
          <div
            className="text-7xl font-display font-bold leading-none"
            style={{
              background: `linear-gradient(135deg, ${gradientColors.start}, ${gradientColors.mid})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: `drop-shadow(0 0 18px ${glowColor})`,
            }}
          >
            {displayScore}
          </div>
          <div className="text-xs font-semibold text-ash-500 tracking-[0.3em] uppercase mt-1">out of 10</div>
        </motion.div>
      </div>
    </div>
  );
}
