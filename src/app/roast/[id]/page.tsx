"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Flame, ArrowLeft, DollarSign, TrendingDown, AlertTriangle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function RoastDetailPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("lastRoast");
    if (stored) {
      try { setData(JSON.parse(stored)); } catch {}
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Flame className="h-8 w-8 text-fire-500 animate-pulse" />
      </div>
    );
  }

  if (!data?.roastData) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="text-center">
          <Flame className="h-12 w-12 text-fire-500 mx-auto mb-4" />
          <h1 className="font-display text-4xl text-white mb-4">No Roast Found</h1>
          <p className="text-ash-300 text-lg mb-6">Go roast a landing page!</p>
          <Link href="/" className="inline-flex items-center gap-2 rounded-lg bg-fire-500 px-6 py-3 text-sm font-semibold text-white hover:bg-fire-600">
            <ArrowLeft className="h-4 w-4" /> Roast a Website
          </Link>
        </div>
      </div>
    );
  }

  const roast = data.roastData;
  const scores = data.scores || roast;
  const categories = [
    { key: "firstImpression", label: "First Impression", emoji: "👀" },
    { key: "copywriting", label: "Copywriting", emoji: "✍️" },
    { key: "visualDesign", label: "Visual Design", emoji: "🎨" },
    { key: "ctaClarity", label: "CTA Clarity", emoji: "🎯" },
    { key: "mobileFriendliness", label: "Mobile", emoji: "📱" },
    { key: "loadingSpeed", label: "Speed", emoji: "⚡" },
    { key: "trustSignals", label: "Trust", emoji: "🛡️" },
    { key: "aboveTheFold", label: "Above Fold", emoji: "📐" },
  ];

  const scoreColor = (s: number) => s >= 8 ? "text-green-400" : s >= 5 ? "text-yellow-400" : "text-red-400";
  const scoreBg = (s: number) => s >= 8 ? "bg-green-500/20" : s >= 5 ? "bg-yellow-500/20" : "bg-red-500/20";

  return (
    <main className="min-h-screen px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="inline-flex items-center gap-2 text-ash-400 hover:text-white mb-6 transition-colors text-sm">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        {/* Hero */}
        <div className="mb-8">
          <p className="text-ash-400 text-sm mb-2">
            <a href={data.url} target="_blank" rel="noopener noreferrer" className="text-fire-400 hover:text-fire-300 underline">
              {data.domain}
            </a>
            {" · "}{data.aiModel === "gpt-4o-mini" ? "AI-Powered" : "Demo Mode"}
          </p>
          <h1 className="font-display text-4xl sm:text-5xl text-white mb-2">
            Score: <span className={scoreColor(roast.overallScore)}>{roast.overallScore}/10</span>
          </h1>
          <p className="text-ash-300 text-lg">{roast.vibe}</p>
        </div>

        {/* Money loss */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4">
            <div className="flex items-center gap-2 text-red-400 text-sm mb-1">
              <TrendingDown className="h-4 w-4" /> Monthly Loss
            </div>
            <p className="text-2xl font-bold text-white">{formatCurrency(roast.totalMonthlyLoss)}</p>
          </div>
          <div className="rounded-xl bg-ember-500/10 border border-ember-500/20 p-4">
            <div className="flex items-center gap-2 text-ember-400 text-sm mb-1">
              <AlertTriangle className="h-4 w-4" /> Yearly Loss
            </div>
            <p className="text-2xl font-bold text-white">{formatCurrency(roast.yearlyLoss)}</p>
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-4 mb-8">
          {categories.map(({ key, label, emoji }) => {
            const cat = scores[key];
            if (!cat) return null;
            return (
              <div key={key} className="rounded-xl bg-ash-800/50 border border-ash-700/50 p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-white font-semibold">{emoji} {label}</h3>
                  <span className={`text-sm font-bold px-2 py-0.5 rounded ${scoreBg(cat.score)} ${scoreColor(cat.score)}`}>
                    {cat.score}/10
                  </span>
                </div>
                <p className="text-ash-300 text-sm mb-2 italic">"{cat.roast}"</p>
                <div className="flex items-start gap-2 text-sm">
                  <span className="text-fire-400 mt-0.5">🔧</span>
                  <span className="text-ash-400">{cat.fix}</span>
                </div>
                <p className="text-red-400 text-xs mt-1">
                  <DollarSign className="h-3 w-3 inline" />
                  {formatCurrency(cat.moneyImpact)}/mo lost
                </p>
              </div>
            );
          })}
        </div>

        {/* Top fixes */}
        {roast.top3Fixes?.length > 0 && (
          <div className="rounded-2xl border border-ember-500/30 bg-ember-500/5 p-6 mb-8">
            <h2 className="font-display text-xl text-white mb-3">🔥 Top 3 Fixes</h2>
            <ol className="space-y-2">
              {roast.top3Fixes.map((fix: string, i: number) => (
                <li key={i} className="flex gap-2 text-ash-200 text-sm">
                  <span className="flex-shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-fire-500 text-xs font-bold text-white">{i + 1}</span>
                  {fix}
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* CTA */}
        <div className="text-center pb-12">
          <Link href="/" className="inline-flex items-center gap-2 rounded-xl bg-fire-500 px-8 py-4 text-lg font-bold text-white hover:bg-fire-600 transition-colors">
            <Flame className="h-5 w-5" /> Roast Another Website
          </Link>
        </div>
      </div>
    </main>
  );
}
