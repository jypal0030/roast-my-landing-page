import { notFound } from "next/navigation";
import { RoastResultView } from "@/components/RoastResultView";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function RoastDetailPage({ params }: PageProps) {
  const { id } = await params;

  try {
    const { prisma } = await import("@/lib/prisma");
    const roast = await prisma.roast.findUnique({
      where: { id },
    });

    if (!roast) {
      return (
        <div className="flex min-h-screen items-center justify-center px-4">
          <div className="text-center">
            <h1 className="font-display text-4xl text-white mb-4">Roast Not Found</h1>
            <p className="text-ash-300 text-lg mb-6">This roast doesn&apos;t exist or was removed.</p>
            <a href="/" className="inline-flex items-center gap-2 rounded-lg bg-fire-500 px-6 py-3 text-sm font-semibold text-white hover:bg-fire-600">
              Roast a Website
            </a>
          </div>
        </div>
      );
    }

    // Parse stored JSON
    let scores: Record<string, any> = {};
    let roastData: any = {};
    let lighthouse: Record<string, unknown> | null = null;

    try { scores = JSON.parse(roast.scoresJson || "{}"); } catch {}
    try { roastData = JSON.parse(roast.roastJson || "{}"); } catch {}
    try { lighthouse = JSON.parse(roast.lighthouseJson || "null"); } catch {}

    return (
      <RoastResultView
        roast={{
          id: roast.id,
          url: roast.url,
          domain: roast.domain,
          brutalityLevel: roast.brutalityLevel,
          overallScore: roast.overallScore,
          vibe: roast.vibe,
          totalMonthlyLoss: roast.totalMonthlyLoss,
          yearlyLoss: roast.yearlyLoss,
          screenshotUrl: roast.screenshotUrl,
          feedback: roast.feedback,
          createdAt: roast.createdAt,
        }}
        scores={scores}
        roastData={roastData}
        lighthouse={lighthouse}
      />
    );
  } catch {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="text-center">
          <h1 className="font-display text-4xl text-white mb-4">Roast Not Found</h1>
          <p className="text-ash-300 text-lg mb-6">This roast doesn&apos;t exist or was removed.</p>
          <a href="/" className="inline-flex items-center gap-2 rounded-lg bg-fire-500 px-6 py-3 text-sm font-semibold text-white hover:bg-fire-600">
            Roast a Website
          </a>
        </div>
      </div>
    );
  }
}
