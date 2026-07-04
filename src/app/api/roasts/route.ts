import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "12"), 50);
    const skip = (page - 1) * limit;

    const session = await getServerSession(authOptions);

    const { prisma } = await import("@/lib/prisma");

    // Build where clause
    const where: any = {};

    // If user is logged in, filter by their roasts
    if (session?.user?.id) {
      where.userId = session.user.id;
    } else {
      // For public gallery: only show public roasts
      where.isPublic = true;
    }

    const [roasts, total] = await Promise.all([
      prisma.roast.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        select: {
          id: true,
          domain: true,
          url: true,
          overallScore: true,
          vibe: true,
          aiModel: true,
          createdAt: true,
        },
      }),
      prisma.roast.count({ where }),
    ]);

    return NextResponse.json({ roasts, total, page });
  } catch (error) {
    // Graceful fallback
    return NextResponse.json({ roasts: [], total: 0, page: 1 });
  }
}
