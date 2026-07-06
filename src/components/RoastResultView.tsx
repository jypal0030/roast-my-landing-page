"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
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
import { Analytics } from "@/lib/analytics";
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
  const [showViralShare, setShowViralShare] = useState(false);

  // Confetti on terrible scores (they're the viral ones)
  useEffect(() => {
    if (roast.overallScore <= 3) {
      const duration = 2000;
      const end = Date.now() + duration;
      const frame = () => {
        confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors: ["#e94560", "#ff6b6b", "#ffd93d"] });
        confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors: ["#e94560", "#ff6b6b", "#ffd93d"] });
        if (Date.now() < end) requestAnimationFrame(frame);
      };
      frame();
    }
    Analytics.roastCompleted(roast.id, roast.overallScore);
  }, [roast.overallScore, roast.id]);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied!");
  };

  const shareTwitter = () => {
    const score = roast.overallScore;
    const vibe = roast.vibe || "confused";
    const loss = roast.totalMonthlyLoss || 0;
    let text;
    if (score <= 3) {
      text = `💀 RoastMyLP just demolished my website. ${score}/10. Vibe: "${vibe}". I\'m losing $${loss.toLocaleString()}/mo apparently. See how bad your site is: ${window.location.origin}`;
    } else if (score <= 6) {
      text = `My site got ${score}/10 on RoastMyLP. Vibe: "${vibe}". Not great, not terrible. Roast yours: ${window.location.origin}`;
    } else {
      text = `🔥 My site scored ${score}/10 on RoastMyLP. Vibe: "${vibe}". Flexing hard. Check your score: ${window.location.origin}`;
    }
    Analytics.roastShared(roast.id, "twitter");
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank");
  };

  const shareLinkedIn = () => {
    Analytics.roastShared(roast.id, "linkedin");
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`,
      "_blank"
    );
  };

  const challengeFriend = () => {
    const text = `⚔️ I scored ${roast.overallScore}/10 on RoastMyLP. Vibe: "${roast.vibe || "confused"}". I bet your site is worse. Prove me wrong: ${window.location.origin}?ref=${roast.id}`;
    navigator.clipboard.writeText(text);
    Analytics.challengeCopied(roast.id);
    toast.success("Challenge copied! Send it to a friend.");
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

      {/* CTA - Fix Everything with urgency */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="mb-10 rounded-2xl border-2 border-fire-500/30 bg-gradient-to-r from-fire-500/10 to-ash-800 p-8 text-center"
      >
        <h3 className="font-display text-3xl text-white mb-2">
          Fix Everything for Just $49
        </h3>
        <p className="text-ash-300 mb-2 max-w-lg mx-auto">
          Every week you wait is costing you <span className="text-fire-400 font-semibold">{formatCurrency(roast.totalMonthlyLoss / 4)}</span>. Stop the bleeding.
        </p>
        <p className="text-amber-400 text-sm mb-4">
          ⏳ Limited audit capacity today. Most reports ship within 2 hours.
        </p>
        <p className="text-fire-400 font-bold text-4xl mb-6">
          {formatCurrency(roast.totalMonthlyLoss)}/mo
          <span className="text-ash-500 text-lg font-normal"> in losses → $49 to fix</span>
        </p>
        <a
          href="/pricing"
          onClick={() => Analytics.ctaClicked("full_audit")}
          className="inline-flex items-center gap-2 rounded-xl bg-fire-500 px-8 py-3 text-lg font-bold text-white hover:bg-fire-600 transition-all animate-pulse"
        >
          <Flame className="h-5 w-5" />
          Get Full Audit — $49
        </a>
      </motion.div>

      {/* Share section with Challenge mechanic */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="mb-10 text-center"
      >
        <h3 className="font-display text-2xl text-white mb-4">Share the Damage</h3>
        <div className="flex justify-center gap-3 flex-wrap mb-4">
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
        {/* Challenge a friend */}
        <button
          onClick={challengeFriend}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-fire-500/10 to-ember-500/10 border border-fire-500/20 px-5 py-2 text-sm font-medium text-ash-200 hover:border-fire-400/40 hover:bg-fire-500/10 transition-all"
        >
          ⚔️ Challenge a friend to beat your {roast.overallScore}/10
        </button>
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

      {/* Share & Go Viral button */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.15 }} className="text-center mb-10">
        <button onClick={() => setShowViralShare(true)} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-fire-500 to-ember-500 px-6 py-3 text-sm font-bold text-white hover:from-fire-600 hover:to-ember-600 transition-all shadow-lg shadow-fire-500/20">
          <Share2 className="h-4 w-4" /> Share &amp; Go Viral 🚀
        </button>
      </motion.div>

      {/* Roast another + re-roast retention */}
      <div className="text-center pb-10 space-y-3">
        <a
          href="/"
          className="inline-flex items-center gap-2 rounded-xl border border-ash-600 bg-ash-800 px-6 py-3 text-sm font-medium text-ash-300 hover:bg-ash-700 transition-all"
        >
          <Flame className="h-4 w-4 text-fire-400" />
          Roast Another Website
        </a>
        <p className="text-xs text-ash-600">
          Made changes? <a href={`/?url=${encodeURIComponent(roast.url)}`} className="text-fire-400 hover:underline">Re-roast this site</a> and track your improvement.
        </p>
      </div>

      {/* Viral share modal */}
      {showViralShare && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowViralShare(false)}>
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="bg-ash-800 border border-ash-600 rounded-2xl p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-display text-xl text-white mb-4 text-center">🔥 Share This Roast</h3>
            <div className="space-y-2">
              <button onClick={() => { shareTwitter(); setShowViralShare(false); }} className="w-full rounded-lg bg-[#1DA1F2] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#1a8cd8]">🐦 Share on Twitter/X</button>
              <button onClick={() => { window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`,"_blank"); }} className="w-full rounded-lg bg-[#0A66C2] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#0959a8]">💼 Share on LinkedIn</button>
              <button onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success("Link copied!"); setShowViralShare(false); }} className="w-full rounded-lg bg-ash-700 px-4 py-2.5 text-sm font-bold text-ash-200 hover:bg-ash-600">📋 Copy Link</button>
              <button onClick={() => { window.location.href = `mailto:?subject=Your website got roasted 😂&body=Check out this savage roast of ${roast.domain}: ${window.location.href}`; }} className="w-full rounded-lg bg-ember-500/10 border border-ember-500/30 px-4 py-2.5 text-sm font-bold text-ember-400 hover:bg-ember-500/20">✉️ Email to site owner</button>
            </div>
            <button onClick={() => setShowViralShare(false)} className="w-full mt-3 text-sm text-ash-500 hover:text-ash-300">Close</button>
          </motion.div>
        </motion.div>
      )}

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
