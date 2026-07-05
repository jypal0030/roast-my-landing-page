"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { X, Download } from "lucide-react";
import { formatCurrency, getScoreBgColor } from "@/lib/utils";
import toast from "react-hot-toast";

interface ShareCardProps {
  domain: string;
  score: number;
  vibe: string;
  monthlyLoss: number;
  screenshotUrl: string | null;
  onClose: () => void;
}

export function ShareCard({ domain, score, vibe, monthlyLoss, screenshotUrl, onClose }: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const downloadCard = async () => {
    if (!cardRef.current) return;
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#1a1a2e",
        scale: 2,
      });
      const link = document.createElement("a");
      link.download = `roast-${domain}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      toast.success("Roast card downloaded!");
    } catch {
      toast.error("Download failed. Try again.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Card */}
        <div
          ref={cardRef}
          className="rounded-2xl border border-ash-600 bg-ash-800 p-6 shadow-2xl"
        >
          {/* Header */}
          <div className="text-center mb-4">
            <div className="text-xs text-ash-500 mb-2">ROAST MY LANDING PAGE</div>
            <div className="text-sm text-ash-400 font-mono mb-3">{domain}</div>
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${getScoreBgColor(score)} text-white font-display text-2xl font-bold mb-2`}>
              {score}/10
            </div>
            <div className="font-display text-3xl text-white lowercase">&ldquo;{vibe}&rdquo;</div>
          </div>

          {/* Money loss */}
          <div className="rounded-xl bg-fire-500/10 border border-fire-500/20 p-4 text-center mb-4">
            <div className="text-xs text-fire-400 mb-1">MONTHLY REVENUE LOSS</div>
            <div className="text-2xl font-bold text-fire-400 font-display">
              {formatCurrency(monthlyLoss)}
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-ash-500">
            Get your website roasted at roastmylp.com
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={downloadCard}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-ember-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-ember-600 active:scale-95 transition-all duration-300"
          >
            <Download className="h-4 w-4" /> Download PNG
          </button>
          <button
            onClick={onClose}
            className="flex items-center justify-center rounded-xl border border-ash-600 px-4 py-2.5 text-sm text-ash-400 hover:bg-ash-700 transition-all"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
