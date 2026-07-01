export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { default: NextAuth } = await import("next-auth");
  const { authOptions } = await import("@/lib/auth");
  return NextAuth(authOptions)(req as any);
}

export async function POST(req: Request) {
  const { default: NextAuth } = await import("next-auth");
  const { authOptions } = await import("@/lib/auth");
  return NextAuth(authOptions)(req as any);
}
