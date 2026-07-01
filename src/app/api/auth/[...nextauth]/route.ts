import NextAuth from "next-auth";

export const dynamic = "force-dynamic";

// Dynamic import to avoid PrismaClient loading at build time
async function getHandler() {
  const { authOptions } = await import("@/lib/auth");
  return NextAuth(authOptions);
}

async function handler(req: Request) {
  const h = await getHandler();
  return h(req as any);
}

export { handler as GET, handler as POST };
