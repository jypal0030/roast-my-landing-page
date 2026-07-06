"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  life: number;
  maxLife: number;
}

export function FireParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let particles: Particle[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const colors = [
      "rgba(233, 69, 96, 0.6)",
      "rgba(251, 113, 133, 0.4)",
      "rgba(253, 164, 175, 0.3)",
      "rgba(245, 158, 11, 0.3)",
      "rgba(249, 115, 22, 0.2)",
    ];

    const spawn = () => {
      if (particles.length < 40) {
        particles.push({
          x: Math.random() * canvas.width,
          y: canvas.height + 20,
          vx: (Math.random() - 0.5) * 0.8,
          vy: -(Math.random() * 1.5 + 0.5),
          size: Math.random() * 3 + 1,
          opacity: Math.random() * 0.6 + 0.2,
          color: colors[Math.floor(Math.random() * colors.length)],
          life: 0,
          maxLife: Math.random() * 200 + 100,
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles = particles.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life++;

        const lifeRatio = 1 - p.life / p.maxLife;
        const alpha = p.opacity * lifeRatio;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * lifeRatio, 0, Math.PI * 2);
        ctx.fillStyle = p.color.replace(/[\d.]+\)$/, `${alpha})`);
        ctx.fill();

        // Glow
        if (p.size > 2) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 3 * lifeRatio, 0, Math.PI * 2);
          ctx.fillStyle = p.color.replace(/[\d.]+\)$/, `${alpha * 0.15})`);
          ctx.fill();
        }

        return p.life < p.maxLife;
      });

      if (Math.random() < 0.3) spawn();
      animId = requestAnimationFrame(animate);
    };

    // Initial spawn
    for (let i = 0; i < 15; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -(Math.random() * 1 + 0.3),
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.4 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: Math.random() * 100,
        maxLife: Math.random() * 200 + 100,
      });
    }

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  );
}
