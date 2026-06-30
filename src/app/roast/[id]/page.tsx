import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { RoastResultView } from "@/components/RoastResultView";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const roast = await prisma.roast.findUnique({
    where: { id },
    select: { domain: true, overallScore: true, vibe: true },
  });

  if (!roast) return { title: "Roast Not Found" };

  return {
    title: `${roast.domain} scored ${roast.overallScore}/10 — "${roast.vibe}"`,
    description: `Our AI roasted ${roast.domain} and gave it a ${roast.overallScore}/10. Vibe: "${roast.vibe}". See the full savage review.`,
    openGraph: {
      title: `We Roasted ${roast.domain} — Score: ${roast.overallScore}/10`,
      description: `Vibe: "${roast.vibe}". See the full brutal review.`,
    },
  };
}

export default async function RoastPage({ params }: Props) {
  const { id } = await params;
  const roast = await prisma.roast.findUnique({ where: { id } });

  if (!roast) notFound();

  const scores = JSON.parse(roast.scoresJson);
  const roastData = JSON.parse(roast.roastJson);
  const lighthouse = roast.lighthouseJson ? JSON.parse(roast.lighthouseJson) : null;

  return (
    <RoastResultView
      roast={roast}
      scores={scores}
      roastData={roastData}
      lighthouse={lighthouse}
    />
  );
}
