import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { prisma } = await import("@/lib/prisma");
    const [roastCount, userCount] = await Promise.all([
      prisma.roast.count(),
      prisma.user.count(),
    ]);
    return NextResponse.json({ roastCount, userCount });
  } catch {
    return NextResponse.json({ roastCount: 0, userCount: 0 });
  }
}
