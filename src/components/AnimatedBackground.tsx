"use client";

import { motion } from "framer-motion";

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: -10 }}>
      <motion.div
        className="absolute rounded-full bg-fire-500/[0.04] blur-3xl"
        style={{ width: 500, height: 500, top: "5%", left: "10%" }}
        animate={{ x: [0, 100, -50, 0], y: [0, -60, 30, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute rounded-full bg-ember-500/[0.04] blur-3xl"
        style={{ width: 400, height: 400, top: "45%", right: "5%" }}
        animate={{ x: [0, -80, 60, 0], y: [0, 80, -40, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute rounded-full bg-fire-500/[0.03] blur-3xl"
        style={{ width: 350, height: 350, bottom: "10%", left: "30%" }}
        animate={{ x: [0, 60, -30, 0], y: [0, -90, 50, 0] }}
        transition={{ duration: 35, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
