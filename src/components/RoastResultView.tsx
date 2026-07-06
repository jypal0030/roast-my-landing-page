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
import { formatCurrency, getScoreBgColor, getBrutalityLabel } from "@/lib/utils";
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
    executiveSummary?: string;
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
  trustSignals: "Trust Signals",
  // Legacy categories — new roasts use only the 5 above for higher completion rates
  mobileFriendliness: "Mobile",
  loadingSpeed: "Speed",
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

  const vibeColor =
    roast.overallScore >= 8 ? "text-gradient-ember" :
    roast.overallScore >= 6 ? "text-gradient-gold" :
    "text-gradient";

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:py-16">
      {/* ── HEADER: Score + Vibe ── */}
      <div className="text-center mb-12">
        {/* Domain badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium text-ash-400 mb-8"
        >
          <ExternalLink className="h-3 w-3" />
          <span className="text-ash-200">{roast.domain}</span>
          <span className="text-ash-600">•</span>
          <span className="text-fire-400">{getBrutalityLabel(roast.brutalityLevel)} Mode</span>
        </motion.div>

        {/* Score Gauge */}
        <div className="flex justify-center mb-8">
          <ScoreGauge score={roast.overallScore} size={220} />
        </div>

        {/* Vibe word */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mb-6"
        >
          <span className={`font-display text-5xl sm:text-7xl md:text-8xl lowercase leading-none ${vibeColor}`}>
            &ldquo;{roast.vibe}&rdquo;
          </span>
        </motion.div>

        {/* Executive summary */}
        {roastData.executiveSummary && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-base sm:text-lg text-ash-300 max-w-2xl mx-auto leading-relaxed"
          >
            {roastData.executiveSummary}
          </motion.p>
        )}
      </div>

      {/* ── MONEY LOSS ── */}
      <div className="mb-12">
        <MoneyLossCalculator
          monthlyLoss={roast.totalMonthlyLoss}
          yearlyLoss={roast.yearlyLoss}
          scores={scores}
        />
      </div>

      {/* ── CATEGORY CARDS ── */}
      <div className="mb-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-3 mb-6"
        >
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-ash-600 to-transparent" />
          <span className="text-xs font-semibold text-ash-500 tracking-widest uppercase">Detailed Breakdown</span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-ash-600 to-transparent" />
        </motion.div>

        <div className="space-y-3">
          {Object.entries(scores).map(([key, data], i) => {
            const Icon = CATEGORY_ICONS[key] || Eye;
            const isExpanded = expandedCategory === key;
            const label = CATEGORY_LABELS[key] || key;

            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.06 }}
              >
                <button
                  onClick={() => setExpandedCategory(isExpanded ? null : key)}
                  className="w-full text-left card-premium rounded-2xl hover:border-fire-500/20 transition-all duration-300 group"
                >
                  <div className="p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {/* Score badge */}
                        <div
                          className={`flex items-center justify-center w-12 h-12 rounded-xl font-display font-bold text-lg ${getScoreBgColor(data.score)} text-white shrink-0`}
                        >
                          {data.score}
                        </div>
                        <div>
                          <div className="font-semibold text-white text-sm sm:text-base group-hover:text-fire-300 transition-colors">
                            {label}
                          </div>
                          <div className="text-xs text-ash-500 mt-0.5 line-clamp-1">
                            {data.roast}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        {data.moneyImpact > 0 && (
                          <span className="hidden sm:inline text-xs font-semibold text-fire-400 bg-fire-500/10 px-2.5 py-1 rounded-full">
                            −{formatCurrency(data.moneyImpact)}/mo
                          </span>
                        )}
                        <div className={`transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}>
                          <svg className="h-4 w-4 text-ash-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded detail */}
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      className="px-5 pb-5 border-t border-ash-700/50"
                    >
                      <div className="pt-4 space-y-4">
                        <div className="rounded-xl bg-ash-900/60 border border-ash-700/30 p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-[10px] font-bold text-fire-400 uppercase tracking-widest bg-fire-500/10 px-2 py-0.5 rounded">
                              🔥 ROAST
                            </span>
                          </div>
                          <p className="text-sm text-ash-200 leading-relaxed italic">
                            &ldquo;{data.roast}&rdquo;
                          </p>
                        </div>
                        <div className="rounded-xl bg-ash-900/60 border border-emerald-500/10 p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded">
                              ✅ FIX
                            </span>
                          </div>
                          <p className="text-sm text-emerald-300 leading-relaxed">
                            {data.fix}
                          </p>
                        </div>
                        {data.moneyImpact > 0 && (
                          <div className="text-center py-2">
                            <span className="text-xs text-ash-500">Monthly loss from this issue: </span>
                            <span className="text-base font-bold text-fire-400">{formatCurrency(data.moneyImpact)}</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── TOP 3 FIXES ── */}
      {roastData.top3Fixes && roastData.top3Fixes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="relative overflow-hidden rounded-3xl border border-emerald-500/15 bg-gradient-to-br from-emerald-500/5 via-ash-800/60 to-ash-800/30 p-6 sm:p-8 mb-12"
        >
          <div className="absolute top-0 right-0 w-40 h-40 rounded-bl-full bg-emerald-500/5" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <Zap className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="font-display text-xl sm:text-2xl text-white">Top 3 Highest-Impact Fixes</h3>
                <p className="text-xs text-ash-500 mt-0.5">Start here. These will give you the biggest bang for your effort.</p>
              </div>
            </div>
            <div className="space-y-4">
              {roastData.top3Fixes.map((fix, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-xl bg-ash-900/40 border border-ash-700/30">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 font-display font-bold text-sm shrink-0">
                    {i + 1}
                  </span>
                  <p className="text-sm text-ash-200 leading-relaxed pt-1">{fix}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* ── CTA: Fix Everything ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="relative overflow-hidden rounded-3xl border-2 border-fire-500/20 bg-gradient-to-br from-fire-500/10 via-ash-800/90 to-ash-800/50 p-8 sm:p-10 text-center mb-12"
      >
        <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-fire-500/8 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />
        <div className="relative">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 rounded-full bg-fire-500/10 border border-fire-500/20 px-3 py-1 text-xs font-medium text-fire-400 mb-4">
            <Flame className="h-3 w-3" />
            LIMITED AUDITS TODAY
          </div>

          <h3 className="font-display text-3xl sm:text-4xl text-white mb-3">
            Fix Everything for{" "}
            <span className="text-gradient">Just $49</span>
          </h3>
          <p className="text-ash-300 text-sm sm:text-base max-w-lg mx-auto mb-6 leading-relaxed">
            Every week you wait is costing you{" "}
            <span className="text-fire-400 font-semibold">{formatCurrency(roast.totalMonthlyLoss / 4)}</span>.
            Stop the bleeding. Get the complete report with every fix, priority roadmap, and a sharable PDF.
          </p>

          {/* Price comparison */}
          <div className="flex items-center justify-center gap-4 mb-6 flex-wrap">
            <div className="text-center">
              <div className="text-xs text-ash-500 mb-1">You&apos;re Losing</div>
              <div className="text-2xl sm:text-3xl font-display font-bold text-fire-400">
                {formatCurrency(roast.totalMonthlyLoss)}/mo
              </div>
            </div>
            <div className="text-ash-600 text-2xl">→</div>
            <div className="text-center">
              <div className="text-xs text-ash-500 mb-1">Fix It For</div>
              <div className="text-2xl sm:text-3xl font-display font-bold text-white">
                $49 <span className="text-sm font-normal text-ash-500">one-time</span>
              </div>
            </div>
          </div>

          <a
            href="/pricing"
            onClick={() => Analytics.ctaClicked("full_audit")}
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-fire-500 to-fire-600 px-10 py-4 text-base font-bold text-white hover:from-fire-600 hover:to-fire-700 transition-all duration-300 shadow-lg shadow-fire-500/25 hover:shadow-xl hover:shadow-fire-500/30 active:scale-95"
          >
            <Flame className="h-5 w-5" />
            Get Full Audit — $49
          </a>
          <p className="text-xs text-ash-600 mt-3">🔒 Secure payment via Paddle &amp; Razorpay</p>
        </div>
      </motion.div>

      {/* ── SHARE SECTION ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="mb-12 text-center"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-ash-600 to-transparent" />
          <span className="text-xs font-semibold text-ash-500 tracking-widest uppercase">Share the Damage</span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-ash-600 to-transparent" />
        </div>

        <div className="flex justify-center gap-2.5 flex-wrap mb-4">
          <button
            onClick={shareTwitter}
            className="flex items-center gap-2 rounded-xl bg-[#1DA1F2]/10 border border-[#1DA1F2]/20 px-5 py-3 text-sm font-semibold text-[#1DA1F2] hover:bg-[#1DA1F2]/20 hover:border-[#1DA1F2]/30 transition-all duration-300 active:scale-95"
          >
            <TwitterIcon /> Twitter
          </button>
          <button
            onClick={shareLinkedIn}
            className="flex items-center gap-2 rounded-xl bg-[#0A66C2]/10 border border-[#0A66C2]/20 px-5 py-3 text-sm font-semibold text-[#0A66C2] hover:bg-[#0A66C2]/20 hover:border-[#0A66C2]/30 transition-all duration-300 active:scale-95"
          >
            <LinkedinIcon /> LinkedIn
          </button>
          <button
            onClick={copyLink}
            className="flex items-center gap-2 rounded-xl bg-ash-700/50 border border-ash-600/50 px-5 py-3 text-sm font-semibold text-ash-200 hover:bg-ash-600 hover:border-ash-500 transition-all duration-300 active:scale-95"
          >
            <Copy className="h-4 w-4" /> Copy Link
          </button>
          <button
            onClick={() => setShowShareCard(true)}
            className="flex items-center gap-2 rounded-xl bg-ember-500/10 border border-ember-500/20 px-5 py-3 text-sm font-semibold text-ember-400 hover:bg-ember-500/20 hover:border-ember-500/30 transition-all duration-300 active:scale-95"
          >
            <Share2 className="h-4 w-4" /> Download Card
          </button>
        </div>

        {/* Challenge */}
        <button
          onClick={challengeFriend}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-fire-500/10 to-ember-500/10 border border-fire-500/15 px-6 py-2.5 text-sm font-medium text-ash-200 hover:border-fire-400/30 hover:from-fire-500/15 hover:to-ember-500/15 transition-all duration-300 active:scale-95"
        >
          ⚔️ Challenge a friend to beat your {roast.overallScore}/10
        </button>
      </motion.div>

      {/* ── FEEDBACK ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
        className="mb-12 text-center"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-ash-600 to-transparent" />
          <span className="text-xs font-semibold text-ash-500 tracking-widest uppercase">Rate This Roast</span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-ash-600 to-transparent" />
        </div>
        <FeedbackButtons roastId={roast.id} currentFeedback={roast.feedback} />
      </motion.div>

      {/* ── ROAST ANOTHER ── */}
      <div className="text-center pb-10 space-y-4">
        <a
          href="/"
          className="inline-flex items-center gap-2 rounded-2xl border border-ash-600/50 bg-ash-800/50 px-8 py-3.5 text-sm font-semibold text-ash-300 hover:bg-ash-700 hover:border-ash-500 transition-all duration-300 active:scale-95"
        >
          <Flame className="h-4 w-4 text-fire-400" />
          Roast Another Website
        </a>
        <p className="text-xs text-ash-600">
          Made changes?{" "}
          <a href={`/?url=${encodeURIComponent(roast.url)}`} className="text-fire-400 hover:underline font-medium">
            Re-roast this site
          </a>{" "}
          and track your improvement.
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
