import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { prisma } = await import("@/lib/prisma");
    const count = await prisma.roast.count();
    return NextResponse.json({ ok: true, roasts: count, ts: Date.now() });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ ok: false, error: msg.slice(0, 200), ts: Date.now() }, { status: 500 });
  }
}
