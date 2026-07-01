import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { prisma } = await import("@/lib/prisma");
    const roasts = await prisma.roast.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true,
        url: true,
        domain: true,
        overallScore: true,
        vibe: true,
        brutalityLevel: true,
        aiModel: true,
        createdAt: true,
      },
    });

    return NextResponse.json(roasts);
  } catch (error) {
    // DB not available — return empty array so frontend doesn't crash
    return NextResponse.json([]);
  }
}
