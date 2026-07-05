import { notFound } from "next/navigation";
import Link from "next/link";
import { Flame } from "lucide-react";
import type { Metadata } from "next";

interface Props { params: Promise<{ domain: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { domain } = await params;
  return {
    title: `${domain} — Roasted by RoastMyLP`,
    description: `See the brutal AI roast of ${domain}'s landing page. Scores, money loss, and fixes inside.`,
  };
}

export default async function RoastedDomainPage({ params }: Props) {
  const { domain } = await params;

  try {
    const { prisma } = await import("@/lib/prisma");
    const roasts = await prisma.roast.findMany({
      where: { domain, isPublic: true },
      orderBy: { createdAt: "desc" },
      take: 3,
    });

    if (roasts.length === 0) {
      return (
        <div className="flex min-h-screen items-center justify-center px-4">
          <div className="text-center">
            <Flame className="h-12 w-12 text-fire-500 mx-auto mb-4" />
            <h1 className="font-display text-4xl text-white mb-4">
              {domain} hasn&apos;t been roasted... yet!
            </h1>
            <p className="text-ash-300 text-lg mb-6">
              Be the first to roast this site and claim your spot in history.
            </p>
            <Link href="/" className="inline-flex items-center gap-2 rounded-lg bg-fire-500 px-6 py-3 text-sm font-semibold text-white hover:bg-fire-600">
              <Flame className="h-4 w-4" /> Roast This Site
            </Link>
          </div>
        </div>
      );
    }

    const latest = roasts[0];
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:py-12">
        <h1 className="font-display text-4xl text-white mb-2">
          <span className="text-fire-500">{domain}</span> — Roast History
        </h1>
        <p className="text-ash-400 mb-6">{roasts.length} roast{roasts.length > 1 ? "s" : ""} found</p>
        <div className="space-y-4">
          {roasts.map((r: { id: string; vibe: string; overallScore: number; createdAt: Date }) => (
            <Link key={r.id} href={`/roast/${r.id}`}
              className="block rounded-xl border border-ash-700 bg-ash-800/50 p-5 hover:border-ash-600 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">{r.vibe}</div>
                  <div className="text-sm text-ash-500">{new Date(r.createdAt).toLocaleDateString()}</div>
                </div>
                <span className="text-3xl font-bold text-fire-400 font-display">{r.overallScore}/10</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  } catch {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="text-center">
          <Flame className="h-12 w-12 text-fire-500 mx-auto mb-4" />
          <h1 className="font-display text-4xl text-white mb-4">Check back soon!</h1>
          <Link href="/" className="inline-flex items-center gap-2 rounded-lg bg-fire-500 px-6 py-3 text-sm font-semibold text-white hover:bg-fire-600">
            Roast a Website
          </Link>
        </div>
      </div>
    );
  }
}
