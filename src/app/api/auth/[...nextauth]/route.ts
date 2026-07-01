export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { default: NextAuth } = await import("next-auth");
    const { authOptions } = await import("@/lib/auth");
    return await NextAuth(authOptions)(req as any);
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || String(e), stack: e?.stack?.substring(0, 500) }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}

export async function POST(req: Request) {
  try {
    const { default: NextAuth } = await import("next-auth");
    const { authOptions } = await import("@/lib/auth");
    return await NextAuth(authOptions)(req as any);
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || String(e), stack: e?.stack?.substring(0, 500) }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}
