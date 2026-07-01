import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { roastId, platform } = await req.json();

    if (!roastId || !platform) {
      return NextResponse.json({ error: "roastId and platform required" }, { status: 400 });
    }

    await prisma.$transaction([
      prisma.sharedRoast.create({
        data: { roastId, platform },
      }),
      prisma.roast.update({
        where: { id: roastId },
        data: { shareCount: { increment: 1 } },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to track share" }, { status: 500 });
  }
}
