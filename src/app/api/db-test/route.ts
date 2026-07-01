export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const url = process.env.DATABASE_URL;
    if (!url) return Response.json({ ok: false, error: "No DATABASE_URL set" });

    const { PrismaClient } = require("@prisma/client");
    const prisma = new PrismaClient({ datasourceUrl: url });
    
    // Try a simple query
    const count = await prisma.user.count();
    
    return Response.json({ ok: true, url: url.substring(0, 30) + "...", userCount: count });
  } catch (e: any) {
    return Response.json({ ok: false, error: e?.message || String(e) });
  }
}
