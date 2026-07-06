import { RoastDetailClient } from "@/components/RoastDetailClient";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function RoastDetailPage({ params }: PageProps) {
  const { id } = await params;

  let dbRoast = null;

  try {
    const { prisma } = await import("@/lib/prisma");
    const roast = await prisma.roast.findUnique({
      where: { id },
    });

    if (roast) {
      let scores: Record<string, any> = {};
      let roastData: any = {};
      let lighthouse: Record<string, unknown> | null = null;

      try { scores = JSON.parse(roast.scoresJson || "{}"); } catch {}
      try { roastData = JSON.parse(roast.roastJson || "{}"); } catch {}
      try { lighthouse = JSON.parse(roast.lighthouseJson || "null"); } catch {}

      dbRoast = {
        id: roast.id,
        url: roast.url,
        domain: roast.domain,
        overallScore: roast.overallScore,
        vibe: roast.vibe,
        totalMonthlyLoss: roast.totalMonthlyLoss,
        yearlyLoss: roast.yearlyLoss,
        scores,
        roastData,
        lighthouse,
        createdAt: roast.createdAt instanceof Date ? roast.createdAt.toISOString() : String(roast.createdAt),
        aiModel: (roast as any).aiModel,
      };
    }
  } catch {
    // DB unreachable — client will use localStorage fallback
  }

  return <RoastDetailClient roastId={id} dbRoast={dbRoast} />;
}
