import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { prisma } = await import("@/lib/prisma");
    const roasts = await prisma.roast.findMany({
      where: { isPublic: true },
      orderBy: { overallScore: "asc" },
      take: 10,
      select: {
        id: true,
        domain: true,
        overallScore: true,
        vibe: true,
        totalMonthlyLoss: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ leaderboard: roasts });
  } catch {
    return NextResponse.json({ leaderboard: [] });
  }
}
