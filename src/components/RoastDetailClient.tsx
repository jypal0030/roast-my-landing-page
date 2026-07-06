"use client";

import { useEffect, useState } from "react";
import { RoastResultView } from "@/components/RoastResultView";
import { Flame } from "lucide-react";
import Link from "next/link";

interface RoastData {
  id: string;
  url: string;
  domain: string;
  overallScore: number;
  vibe: string;
  totalMonthlyLoss: number;
  yearlyLoss: number;
  scores: Record<string, any>;
  roastData: any;
  lighthouse: Record<string, unknown> | null;
  createdAt: string;
  aiModel?: string;
}

interface Props {
  roastId: string;
  dbRoast: RoastData | null;
}

export function RoastDetailClient({ roastId, dbRoast }: Props) {
  const [roast, setRoast] = useState<RoastData | null>(dbRoast);

  useEffect(() => {
    if (dbRoast) return; // DB found it, no need for fallback

    // DB miss — try localStorage fallback
    try {
      const cached = localStorage.getItem("lastRoast");
      if (cached) {
        const data = JSON.parse(cached);
        // Only use if ID matches (or is a temp ID starting with roast_)
        if (data.id === roastId || roastId.startsWith("roast_")) {
          setRoast({
            id: data.id,
            url: data.url,
            domain: data.domain,
            overallScore: data.overallScore,
            vibe: data.vibe,
            totalMonthlyLoss: data.totalMonthlyLoss,
            yearlyLoss: data.yearlyLoss,
            scores: data.scores || {},
            roastData: data.roastData || {},
            lighthouse: data.lighthouse || null,
            createdAt: data.createdAt || new Date().toISOString(),
            aiModel: data.aiModel,
          });
        }
      }
    } catch {
      // localStorage parse failed, show not found
    }
  }, [roastId, dbRoast]);

  if (!roast) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="text-center">
          <Flame className="h-12 w-12 text-fire-500 mx-auto mb-4" />
          <h1 className="font-display text-4xl text-white mb-4">Roast Not Found</h1>
          <p className="text-ash-300 text-lg mb-2">
            {roastId.startsWith("roast_")
              ? "DB is temporarily unavailable but your roast was generated successfully. Try reloading this page — the result may be cached."
              : "This roast doesn't exist or was removed."}
          </p>
          <div className="flex gap-3 justify-center mt-6">
            <Link href="/" className="inline-flex items-center gap-2 rounded-lg bg-fire-500 px-6 py-3 text-sm font-semibold text-white hover:bg-fire-600">
              <Flame className="h-4 w-4" /> Roast Another
            </Link>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 rounded-lg border border-ash-600 px-4 py-3 text-sm font-medium text-ash-300 hover:bg-ash-700"
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <RoastResultView
      roast={{
        id: roast.id,
        url: roast.url,
        domain: roast.domain,
        brutalityLevel: (roast.roastData?.brutalityLevel) || 2,
        overallScore: roast.overallScore,
        vibe: roast.vibe,
        totalMonthlyLoss: roast.totalMonthlyLoss,
        yearlyLoss: roast.yearlyLoss,
        screenshotUrl: (roast.roastData?.screenshotUrl) || null,
        feedback: null,
        createdAt: new Date(roast.createdAt),
      }}
      scores={roast.scores}
      roastData={roast.roastData}
      lighthouse={roast.lighthouse}
    />
  );
}
