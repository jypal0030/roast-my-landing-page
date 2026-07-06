"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface CountUpProps {
  value: number;
  prefix?: string;
  duration?: number;
  className?: string;
}

export function CountUp({ value, prefix = "$", duration = 2, className = "" }: CountUpProps) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = value / (duration * 60);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setDisplay(value);
        clearInterval(timer);
      } else {
        setDisplay(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [value, duration]);

  return (
    <motion.span
      className={`tabular-nums font-display ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      {prefix}
      {display.toLocaleString()}
    </motion.span>
  );
}
