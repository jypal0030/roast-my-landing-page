"use client";

import { useRef, useState, type ReactNode } from "react";
import { motion } from "framer-motion";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  glareColor?: string;
}

export function TiltCard({ children, className = "", glareColor = "rgba(255,255,255,0.08)" }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setRotation({ x: (y - 0.5) * 8, y: (x - 0.5) * -8 });
    setGlare({ x: x * 100, y: y * 100, opacity: 0.15 });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
    setGlare({ x: 50, y: 50, opacity: 0 });
  };

  return (
    <motion.div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
      animate={{
        rotateX: rotation.x,
        rotateY: rotation.y,
      }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {/* Glare effect */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-200"
        style={{
          background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, ${glareColor}, transparent 60%)`,
          opacity: glare.opacity,
        }}
      />
    </motion.div>
  );
}
