import { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
// GoogleProvider removed — credentials not configured

function generateReferralCode(name?: string | null): string {
  const prefix = name ? name.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 4) : "USER";
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${random}`;
}

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ user }) {
      // At minimum, need an email
      return !!user.email;
    },
    async jwt({ token, user, account }) {
      // First sign-in: store GitHub profile in JWT
      if (user) {
        token.id = account?.providerAccountId || user.email;
        token.name = user.name;
        token.email = user.email;
        token.image = user.image;
        token.plan = "free";
      }

      // If DB available, try to sync user (non-blocking)
      try {
        const { prisma } = require("@/lib/prisma");
        if (token.email) {
          let dbUser = await prisma.user.findUnique({ where: { email: token.email } });
          if (!dbUser) {
            const referralCode = generateReferralCode(token.name);
            dbUser = await prisma.user.create({
              data: {
                email: token.email,
                name: token.name,
                image: token.image,
                referralCode,
              },
            });
          }
          if (dbUser) {
            token.id = dbUser.id;
            token.plan = dbUser.plan;
            token.referralCode = dbUser.referralCode;
            token.balance = dbUser.balance;
          }
        }
      } catch {
        // DB not available — JWT still works with basic info
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.plan = (token.plan as string) || "free";
        session.user.referralCode = token.referralCode as string;
        session.user.balance = token.balance as number;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
};
