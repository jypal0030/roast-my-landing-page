import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

const handler = NextAuth(authOptions);

/**
 * Referral cookie is set by middleware when user visits ?ref=CODE.
 * Processing happens via /api/referral/claim — called from dashboard on signin.
 */

export { handler as GET, handler as POST };
