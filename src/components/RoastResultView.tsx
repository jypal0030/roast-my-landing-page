"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Copy } from "lucide-react";
import { ScoreGauge } from "./ScoreGauge";
import { CountUp } from "@/components/CountUp";
import { ShareCard } from "./ShareCard";
import { FireParticles } from "@/components/FireParticles";
import { Analytics } from "@/lib/analytics";
import { formatCurrency, getScoreBgColor } from "@/lib/utils";
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

  const vibeClass =
    roast.overallScore >= 8 ? "gradient-text-ember" :
    roast.overallScore >= 6 ? "gradient-text-gold" :
    "gradient-text-fire";

  return (
    <div className="mx-auto max-w-3xl px-6 relative">
      <FireParticles />

      {/* ─── VOID ABOVE ─── */}
      <div className="pt-16 sm:pt-28" />

      {/* ─── THE SCORE — the mountain in the void ─── */}
      <div className="flex justify-center mb-8 sm:mb-16">
        <ScoreGauge score={roast.overallScore} size={280} />
      </div>

      {/* ─── THE VIBE — a single utterance from the void ─── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="text-center mb-16 sm:mb-24"
      >
        <span className={`font-display text-6xl sm:text-8xl md:text-9xl lowercase leading-none ${vibeClass}`}>
          {roast.vibe}
        </span>
      </motion.div>

      {/* ─── VOID BETWEEN ─── */}
      <div className="mb-16 sm:mb-24" />

      {/* ─── THE LOSS — quiet valley of pain ─── */}
      <div className="text-center mb-20 sm:mb-32">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-ash-500 text-xs tracking-[0.3em] uppercase mb-6"
        >
          You are losing
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="font-display text-5xl sm:text-7xl font-bold text-fire-400 mb-3"
        >
          <CountUp value={roast.totalMonthlyLoss} duration={3} />
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-base text-ash-500"
        >
          per month. That&apos;s <span className="text-ash-400"><CountUp value={roast.yearlyLoss} duration={3.5} /></span> per year.
        </motion.p>
      </div>

      {/* ─── VOID BETWEEN ─── */}
      <div className="mb-16 sm:mb-24" />

      {/* ─── THE CATEGORIES — islands in the void ─── */}
      <div className="space-y-6 mb-20 sm:mb-32">
        {Object.entries(scores).map(([key, data], i) => {
          const isExpanded = expandedCategory === key;
          const label = CATEGORY_LABELS[key] || key;
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 + i * 0.12, duration: 0.6 }}
            >
              <button
                onClick={() => setExpandedCategory(isExpanded ? null : key)}
                className="w-full text-left group"
              >
                <div className="flex items-baseline justify-between py-3 border-b border-ash-800 hover:border-ash-600 transition-colors duration-500">
                  <div className="flex items-baseline gap-4">
                    <span className="font-display text-2xl font-bold text-ash-300">
                      {data.score < 10 ? `0${data.score}` : data.score}
                    </span>
                    <span className="text-sm sm:text-base text-ash-300 group-hover:text-white transition-colors duration-300">
                      {label}
                    </span>
                  </div>
                  <span className={`text-xs text-ash-600 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}>
                    ▼
                  </span>
                </div>

                {isExpanded && (
                  <div className="pt-5 pb-2 space-y-5">
                    <p className="text-sm text-ash-400 leading-relaxed italic">
                      &ldquo;{data.roast}&rdquo;
                    </p>
                    <p className="text-sm text-emerald-400/80 leading-relaxed">
                      {data.fix}
                    </p>
                    {data.moneyImpact > 0 && (
                      <p className="text-xs text-fire-400/60">
                        −{formatCurrency(data.moneyImpact)}/mo lost to this
                      </p>
                    )}
                  </div>
                )}
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* ─── VOID BETWEEN ─── */}
      <div className="mb-16 sm:mb-24" />

      {/* ─── TOP FIXES — minimal, just the essentials ─── */}
      {roastData.top3Fixes && roastData.top3Fixes.length > 0 && (
        <div className="mb-20 sm:mb-32">
          <p className="text-ash-500 text-xs tracking-[0.3em] uppercase mb-8">
            Start here
          </p>
          <div className="space-y-5">
            {roastData.top3Fixes.map((fix, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.5 + i * 0.1 }}
                className="flex gap-4"
              >
                <span className="text-2xl font-display text-emerald-400/40 shrink-0 leading-none mt-0.5">
                  {`0${i + 1}`}
                </span>
                <p className="text-sm text-ash-300 leading-relaxed pt-1">{fix}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* ─── VOID BETWEEN ─── */}
      <div className="mb-16 sm:mb-24" />

      {/* ─── THE CTA — the final peak ─── */}
      <div className="text-center mb-24 sm:mb-36">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.7 }}
          className="text-ash-600 text-xs tracking-[0.2em] uppercase mb-10"
        >
          Stop the bleeding
        </motion.p>
        <motion.a
          href="/pricing"
          onClick={() => Analytics.ctaClicked("full_audit")}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.6 }}
          className="inline-block rounded-2xl bg-gradient-to-b from-fire-500 to-fire-600 px-12 py-5 text-lg font-bold text-white hover:from-fire-400 hover:to-fire-500 active:scale-95 transition-all duration-300"
          style={{ boxShadow: "0 0 60px rgba(233,69,96,0.25), 0 8px 32px rgba(233,69,96,0.15)" }}
        >
          Get the Full Audit — $49
        </motion.a>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="text-ash-600 text-xs mt-6"
        >
          {formatCurrency(roast.totalMonthlyLoss)}/mo in losses vs $49 one-time
        </motion.p>
      </div>

      {/* ─── VOID AFTER ─── */}
      <div className="mb-12" />

      {/* ─── SHARE — whispered, not shouted ─── */}
      <div className="text-center pb-8">
        <div className="flex justify-center gap-3 flex-wrap">
          <button onClick={shareTwitter} className="text-ash-600 hover:text-[#1DA1F2] transition-colors duration-300 p-2" title="Share on Twitter">
            <TwitterIcon />
          </button>
          <button onClick={shareLinkedIn} className="text-ash-600 hover:text-[#0A66C2] transition-colors duration-300 p-2" title="Share on LinkedIn">
            <LinkedinIcon />
          </button>
          <button onClick={copyLink} className="text-ash-600 hover:text-ash-300 transition-colors duration-300 p-2" title="Copy link">
            <Copy className="h-4 w-4" />
          </button>
          <button onClick={challengeFriend} className="text-ash-600 hover:text-fire-400 transition-colors duration-300 p-2 text-xs" title="Challenge a friend">
            ⚔️
          </button>
        </div>
        <p className="text-ash-600 text-xs mt-4">
          <a href={`/?url=${encodeURIComponent(roast.url)}`} className="hover:text-fire-400 transition-colors duration-300">Re-roast after fixing</a>
          <span className="mx-2">·</span>
          <a href="/" className="hover:text-fire-400 transition-colors duration-300">Roast another</a>
        </p>
      </div>

      {/* ─── MODALS (unchanged) ─── */}
      {showViralShare && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setShowViralShare(false)}>
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="bg-ash-800 border border-ash-600 rounded-2xl p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-display text-xl text-white mb-4 text-center">Share This Roast</h3>
            <div className="space-y-2">
              <button onClick={() => { shareTwitter(); setShowViralShare(false); }} className="w-full rounded-lg bg-[#1DA1F2] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#1a8cd8]">🐦 Share on Twitter/X</button>
              <button onClick={() => { window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`,"_blank"); }} className="w-full rounded-lg bg-[#0A66C2] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#0959a8]">💼 Share on LinkedIn</button>
              <button onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success("Link copied!"); setShowViralShare(false); }} className="w-full rounded-lg bg-ash-700 px-4 py-2.5 text-sm font-bold text-ash-200 hover:bg-ash-600">📋 Copy Link</button>
            </div>
            <button onClick={() => setShowViralShare(false)} className="w-full mt-3 text-sm text-ash-500 hover:text-ash-300">Close</button>
          </motion.div>
        </motion.div>
      )}

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

