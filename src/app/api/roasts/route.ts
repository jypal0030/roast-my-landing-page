import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const order = searchParams.get("order") || "desc";
  const limit = Math.min(parseInt(searchParams.get("limit") || "12"), 50);

  const roasts = await prisma.roast.findMany({
    where: { isPublic: true },
    orderBy: { overallScore: order as "asc" | "desc" },
    take: limit,
    select: {
      id: true,
      domain: true,
      overallScore: true,
      vibe: true,
      createdAt: true,
    },
  });

  return NextResponse.json(roasts);
}
