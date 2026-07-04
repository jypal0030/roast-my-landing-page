import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "12"), 50);
    const skip = (page - 1) * limit;

    const { prisma } = await import("@/lib/prisma");

    const where: any = { isPublic: true };

    const [roasts, total] = await Promise.all([
      prisma.roast.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        select: {
          id: true,
          domain: true,
          overallScore: true,
          vibe: true,
          totalMonthlyLoss: true,
          yearlyLoss: true,
          brutalityLevel: true,
          createdAt: true,
        },
      }),
      prisma.roast.count({ where }),
    ]);

    return NextResponse.json({ roasts, total, page });
  } catch {
    return NextResponse.json({ roasts: [], total: 0, page: 1 });
  }
}
