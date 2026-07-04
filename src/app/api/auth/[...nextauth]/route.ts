export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    // Read pending referral from cookie
    const cookieHeader = (req as any).headers?.get?.("cookie") || "";
    const refMatch = cookieHeader.match(/referral_code=([^;]+)/);
    if (refMatch) {
      (globalThis as any).__pendingReferral = (globalThis as any).__pendingReferral || {};
      (globalThis as any).__pendingReferral._latest = refMatch[1];
    }

    const { default: NextAuth } = await import("next-auth");
    const { authOptions } = await import("@/lib/auth");
    return await NextAuth(authOptions)(req as any, {} as any);
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || String(e) }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}

export async function POST(req: Request) {
  try {
    const cookieHeader = (req as any).headers?.get?.("cookie") || "";
    const refMatch = cookieHeader.match(/referral_code=([^;]+)/);
    if (refMatch) {
      (globalThis as any).__pendingReferral = (globalThis as any).__pendingReferral || {};
      (globalThis as any).__pendingReferral._latest = refMatch[1];
    }

    const { default: NextAuth } = await import("next-auth");
    const { authOptions } = await import("@/lib/auth");
    return await NextAuth(authOptions)(req as any, {} as any);
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || String(e) }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}
