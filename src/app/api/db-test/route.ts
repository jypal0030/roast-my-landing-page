export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const url = process.env.DATABASE_URL;
    if (!url) return Response.json({ ok: false, error: "No DATABASE_URL" });

    // Use our lazy prisma proxy
    const { prisma } = await import("@/lib/prisma");
    const count = await prisma.user.count();
    return Response.json({ ok: true, url: url.substring(0, 30) + "...", userCount: count });
  } catch (e: any) {
    return Response.json({ ok: false, error: e?.message || String(e) });
  }
}
