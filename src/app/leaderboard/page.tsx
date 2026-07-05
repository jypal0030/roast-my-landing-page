"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Trophy, ExternalLink, DollarSign } from "lucide-react";
import { getScoreBgColor, getScoreEmoji, formatCurrency } from "@/lib/utils";

interface LeaderboardEntry {
  id: string; domain: string; overallScore: number; vibe: string; totalMonthlyLoss: number; createdAt: string;
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/leaderboard")
      .then((r) => r.json())
      .then((d) => setLeaderboard(d.leaderboard || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
        <Trophy className="h-12 w-12 text-ember-400 mx-auto mb-4" />
        <h1 className="font-display text-4xl sm:text-5xl text-white mb-2">🏆 Roast Leaderboard</h1>
        <p className="text-ash-400">The 10 worst-scoring websites. Lowest scores &quot;win&quot;.</p>
      </motion.div>

      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="rounded-xl border border-ash-700 bg-ash-800/50 p-5 animate-pulse"><div className="h-4 w-48 bg-ash-700 rounded mb-2" /><div className="h-3 w-24 bg-ash-700 rounded" /></div>)}</div>
      ) : leaderboard.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-ash-500 text-lg">No roasts yet. Be the first to make the leaderboard!</p>
          <Link href="/" className="inline-block mt-4 rounded-lg bg-fire-500 px-6 py-3 text-sm font-bold text-white hover:bg-fire-600">Roast a Website</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {leaderboard.map((entry, i) => (
            <motion.div key={entry.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
              <Link href={`/roast/${entry.id}`} className="flex items-center gap-4 rounded-xl border border-ash-700 bg-ash-800/50 p-5 hover:border-ash-600 transition-all">
                <div className="w-10 h-10 rounded-full bg-ash-700 flex items-center justify-center text-lg font-bold text-white shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <ExternalLink className="h-3.5 w-3.5 text-ash-500 shrink-0" />
                    <span className="font-medium text-white text-sm truncate">{entry.domain}</span>
                  </div>
                  <div className="text-xs text-ash-500">&ldquo;{entry.vibe}&rdquo;</div>
                </div>
                <div className="text-right shrink-0">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-sm font-bold text-white ${getScoreBgColor(entry.overallScore)}`}>
                    {entry.overallScore}/10 {getScoreEmoji(entry.overallScore)}
                  </span>
                  <div className="text-xs text-fire-400 mt-1 flex items-center justify-end gap-0.5">
                    <DollarSign className="h-3 w-3" />{formatCurrency(entry.totalMonthlyLoss)}/mo
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
