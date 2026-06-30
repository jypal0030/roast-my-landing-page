import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getScoreColor(score: number): string {
  if (score >= 8) return "text-emerald-400";
  if (score >= 6) return "text-amber-400";
  if (score >= 4) return "text-orange-400";
  return "text-red-400";
}

export function getScoreBgColor(score: number): string {
  if (score >= 8) return "bg-emerald-500";
  if (score >= 6) return "bg-amber-500";
  if (score >= 4) return "bg-orange-500";
  return "bg-red-500";
}

export function getScoreEmoji(score: number): string {
  if (score >= 9) return "🔥";
  if (score >= 7) return "👍";
  if (score >= 5) return "😬";
  if (score >= 3) return "💀";
  return "☠️";
}

export function getBrutalityLabel(level: number): string {
  switch (level) {
    case 1: return "Playful";
    case 2: return "Savage";
    case 3: return "Brutal";
    case 4: return "Devastating";
    case 5: return "Nuclear";
    default: return "Savage";
  }
}
