"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Share2,
  Copy,
  Flame,
  ExternalLink,
  DollarSign,
  TrendingDown,
  Shield,
  Eye,
  Smartphone,
  Zap,
  PenTool,
  Timer,
  Layers,
} from "lucide-react";
import { ScoreGauge } from "./ScoreGauge";
import { MoneyLossCalculator } from "./MoneyLossCalculator";
import { FeedbackButtons } from "./FeedbackButtons";
import { ShareCard } from "./ShareCard";
import { formatCurrency, getScoreColor, getScoreBgColor, getScoreEmoji, getBrutalityLabel } from "@/lib/utils";
import toast from "react-hot-toast";

interface RoastResultViewProps {
  roast: {
    id: string;
    url: string;
    domain: string;
    brutalityLevel: number;
    overallScore: number;
    vibe: string;
    totalMonthlyLoss: number;
    yearlyLoss: number;
    screenshotUrl: string | null;
    feedback: string | null;
    createdAt: Date | string;
  };
  scores: Record<string, { score: number; roast: string; fix: string; moneyImpact: number }>;
  roastData: {
    top3Fixes: string[];
  };
  lighthouse: Record<string, unknown> | null;
}

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  firstImpression: Eye,
  copywriting: PenTool,
  visualDesign: Layers,
  ctaClarity: Flame,
  mobileFriendliness: Smartphone,
  loadingSpeed: Timer,
  trustSignals: Shield,
  aboveTheFold: TrendingDown,
};

const CATEGORY_LABELS: Record<string, string> = {
  firstImpression: "First Impression",
  copywriting: "Copywriting",
  visualDesign: "Visual Design",
  ctaClarity: "CTA Clarity",
  mobileFriendliness: "Mobile Friendliness",
  loadingSpeed: "Loading Speed",
  trustSignals: "Trust Signals",
  aboveTheFold: "Above the Fold",
};

export function RoastResultView({ roast, scores, roastData, lighthouse }: RoastResultViewProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [showShareCard, setShowShareCard] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied!");
  };

  const shareTwitter = () => {
    const text = `My website got a ${roast.overallScore}/10 roast score with vibe: "${roast.vibe}" 💀\n\nRoast yours: ${window.location.origin}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank");
  };

  const shareLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`,
      "_blank"
    );
  };

  const totalCategories = Object.keys(scores).length;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-ash-600 bg-ash-800 px-3 py-1 text-sm text-ash-400 mb-4">
          <ExternalLink className="h-3 w-3" />
          {roast.domain}
          <span className="text-ash-600">•</span>
          <span>{getBrutalityLabel(roast.brutalityLevel)} Mode</span>
        </div>

        {/* Score gauge */}
        <div className="flex justify-center mb-6">
          <ScoreGauge score={roast.overallScore} size={160} />
        </div>

        {/* Vibe */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
          className="mb-4"
        >
          <span className="font-display text-5xl sm:text-7xl text-white lowercase">
            &ldquo;{roast.vibe}&rdquo;
          </span>
        </motion.div>

        <p className="text-ash-400 text-sm">
          Overall Score:{" "}
          <span className={`font-bold text-lg ${getScoreColor(roast.overallScore)}`}>
            {roast.overallScore}/10 {getScoreEmoji(roast.overallScore)}
          </span>
        </p>
      </motion.div>

      {/* Money Loss Calculator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-10"
      >
        <MoneyLossCalculator
          monthlyLoss={roast.totalMonthlyLoss}
          yearlyLoss={roast.yearlyLoss}
          scores={scores}
        />
      </motion.div>

      {/* Category cards */}
      <div className="mb-10">
        <h3 className="font-display text-2xl text-white mb-4">Category Breakdown</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Object.entries(scores).map(([key, data], i) => {
            const Icon = CATEGORY_ICONS[key] || Eye;
            const isExpanded = expandedCategory === key;

            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.05 }}
              >
                <button
                  onClick={() => setExpandedCategory(isExpanded ? null : key)}
                  className="w-full text-left rounded-xl border border-ash-700 bg-ash-800/50 p-4 hover:border-ash-600 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${getScoreBgColor(data.score)}/20`}>
                        <Icon className={`h-5 w-5 ${getScoreColor(data.score)}`} />
                      </div>
                      <div>
                        <div className="font-semibold text-white text-sm">
                          {CATEGORY_LABELS[key] || key}
                        </div>
                        <div className="text-xs text-ash-500">
                          {data.roast.substring(0, 60)}...
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {data.moneyImpact > 0 && (
                        <span className="text-xs text-fire-400 font-medium">
                          -${data.moneyImpact.toLocaleString()}/mo
                        </span>
                      )}
                      <span
                        className={`inline-flex items-center justify-center w-9 h-9 rounded-lg font-bold text-sm text-white ${getScoreBgColor(data.score)}`}
                      >
                        {data.score}
                      </span>
                    </div>
                  </div>

                  {/* Expanded detail */}
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      className="mt-4 pt-4 border-t border-ash-700 space-y-3"
                    >
                      <div>
                        <div className="text-xs text-ash-500 mb-1">ROAST</div>
                        <p className="text-sm text-ash-200 italic">&ldquo;{data.roast}&rdquo;</p>
                      </div>
                      <div>
                        <div className="text-xs text-ash-500 mb-1">FIX</div>
                        <p className="text-sm text-emerald-300">{data.fix}</p>
                      </div>
                      <div>
                        <div className="text-xs text-ash-500 mb-1">MONTHLY LOSS</div>
                        <p className="text-lg font-bold text-fire-400">
                          {formatCurrency(data.moneyImpact)}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Top 3 Fixes */}
      {roastData.top3Fixes && roastData.top3Fixes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-10 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6"
        >
          <h3 className="font-display text-xl text-emerald-300 mb-4 flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Top 3 Highest-Impact Fixes
          </h3>
          <ol className="space-y-3">
            {roastData.top3Fixes.map((fix, i) => (
              <li key={i} className="flex gap-3 text-sm text-ash-200">
                <span className="font-bold text-emerald-400 shrink-0">#{i + 1}</span>
                {fix}
              </li>
            ))}
          </ol>
        </motion.div>
      )}

      {/* CTA - Fix Everything */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="mb-10 rounded-2xl border-2 border-fire-500/30 bg-gradient-to-r from-fire-500/10 to-ash-800 p-8 text-center"
      >
        <h3 className="font-display text-3xl text-white mb-2">
          Fix Everything for Just $49
        </h3>
        <p className="text-ash-300 mb-4">
          Get the complete Full Audit Report with every fix, priority recommendations, and a
          downloadable PDF.
        </p>
        <p className="text-fire-400 font-bold text-4xl mb-6">
          {formatCurrency(roast.totalMonthlyLoss)}/mo
          <span className="text-ash-500 text-lg font-normal"> in losses → $49 to fix</span>
        </p>
        <a
          href="/pricing"
          className="inline-flex items-center gap-2 rounded-xl bg-fire-500 px-8 py-3 text-lg font-bold text-white hover:bg-fire-600 transition-all"
        >
          <Flame className="h-5 w-5" />
          Get Full Audit — $49
        </a>
      </motion.div>

      {/* Share section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="mb-10 text-center"
      >
        <h3 className="font-display text-2xl text-white mb-4">Share This Roast</h3>
        <div className="flex justify-center gap-3 flex-wrap">
          <button
            onClick={shareTwitter}
            className="flex items-center gap-2 rounded-xl bg-[#1DA1F2]/10 border border-[#1DA1F2]/30 px-5 py-2.5 text-sm font-medium text-[#1DA1F2] hover:bg-[#1DA1F2]/20 transition-all"
          >
            <TwitterIcon /> Twitter
          </button>
          <button
            onClick={shareLinkedIn}
            className="flex items-center gap-2 rounded-xl bg-[#0A66C2]/10 border border-[#0A66C2]/30 px-5 py-2.5 text-sm font-medium text-[#0A66C2] hover:bg-[#0A66C2]/20 transition-all"
          >
            <LinkedinIcon /> LinkedIn
          </button>
          <button
            onClick={copyLink}
            className="flex items-center gap-2 rounded-xl bg-ash-700 border border-ash-600 px-5 py-2.5 text-sm font-medium text-ash-200 hover:bg-ash-600 transition-all"
          >
            <Copy className="h-4 w-4" /> Copy Link
          </button>
          <button
            onClick={() => setShowShareCard(true)}
            className="flex items-center gap-2 rounded-xl bg-ember-500/10 border border-ember-500/30 px-5 py-2.5 text-sm font-medium text-ember-400 hover:bg-ember-500/20 transition-all"
          >
            <Share2 className="h-4 w-4" /> Download Card
          </button>
        </div>
      </motion.div>

      {/* Feedback */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
        className="mb-10 text-center"
      >
        <h3 className="font-display text-lg text-white mb-3">How was this roast?</h3>
        <FeedbackButtons roastId={roast.id} currentFeedback={roast.feedback} />
      </motion.div>

      {/* Roast another */}
      <div className="text-center pb-10">
        <a
          href="/"
          className="inline-flex items-center gap-2 rounded-xl border border-ash-600 bg-ash-800 px-6 py-3 text-sm font-medium text-ash-300 hover:bg-ash-700 transition-all"
        >
          <Flame className="h-4 w-4 text-fire-400" />
          Roast Another Website
        </a>
      </div>

      {/* Share card modal */}
      {showShareCard && (
        <ShareCard
          domain={roast.domain}
          score={roast.overallScore}
          vibe={roast.vibe}
          monthlyLoss={roast.totalMonthlyLoss}
          screenshotUrl={roast.screenshotUrl}
          onClose={() => setShowShareCard(false)}
        />
      )}
    </div>
  );
}

function TwitterIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}
