import { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "./prisma";

function generateReferralCode(name?: string | null): string {
  const prefix = name ? name.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 4) : "USER";
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${random}`;
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ user, account }) {
      if (account && user.email) {
        // Find or create user in our database
        let dbUser = await prisma.user.findUnique({ where: { email: user.email } });

        if (!dbUser) {
          let referralCode = generateReferralCode(user.name);
          let exists = await prisma.user.findUnique({ where: { referralCode } });
          while (exists) {
            referralCode = generateReferralCode(user.name);
            exists = await prisma.user.findUnique({ where: { referralCode } });
          }

          dbUser = await prisma.user.create({
            data: {
              email: user.email,
              name: user.name,
              image: user.image,
              referralCode,
            },
          });
        } else {
          // Update name/image on re-login
          await prisma.user.update({
            where: { id: dbUser.id },
            data: { name: user.name, image: user.image },
          });
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
          select: { id: true, plan: true, referralCode: true, balance: true },
        });
        if (dbUser) {
          token.id = dbUser.id;
          token.plan = dbUser.plan;
          token.referralCode = dbUser.referralCode;
          token.balance = dbUser.balance;
        }
      }
      // Refresh on each request
      if (token.email && !token.plan) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email as string },
          select: { id: true, plan: true, referralCode: true, balance: true },
        });
        if (dbUser) {
          token.id = dbUser.id;
          token.plan = dbUser.plan;
          token.referralCode = dbUser.referralCode;
          token.balance = dbUser.balance;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.plan = token.plan as string;
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
