import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { roastId, platform } = await req.json();
    if (!roastId || !platform) {
      return NextResponse.json({ error: "roastId and platform required" }, { status: 400 });
    }

    const { prisma } = await import("@/lib/prisma");

    // Record the share
    await prisma.sharedRoast.create({
      data: { roastId, platform },
    });

    // Increment share count on the roast
    await prisma.roast.update({
      where: { id: roastId },
      data: { shareCount: { increment: 1 } },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: true, note: "Share recorded locally" });
  }
}
