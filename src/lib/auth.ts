import { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";

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
      return !!user.email;
    },
    async jwt({ token, user, account }) {
      if (user) {
        const email = user.email || "";
        const name = user.name || "";
        const image = user.image || "";
        token.id = account?.providerAccountId || email;
        token.name = name;
        token.email = email;
        token.image = image;
        token.plan = "free";
        token.referralCode = generateReferralCode(user.name);
        token.balance = 0;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.plan = (token.plan as string) || "free";
        session.user.referralCode = token.referralCode as string;
        session.user.balance = (token.balance as number) || 0;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
};
