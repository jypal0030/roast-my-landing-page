import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./prisma";

function generateReferralCode(name?: string | null): string {
  const prefix = name
    ? name.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 4)
    : "USER";
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${random}`;
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
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
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { plan: true, referralCode: true, balance: true },
        });
        if (dbUser) {
          session.user.plan = dbUser.plan;
          session.user.referralCode = dbUser.referralCode;
          session.user.balance = dbUser.balance;
        }
      }
      return session;
    },
  },
  events: {
    async createUser({ user }) {
      let referralCode = generateReferralCode(user.name);
      // Ensure uniqueness
      let existing = await prisma.user.findUnique({ where: { referralCode } });
      while (existing) {
        referralCode = generateReferralCode(user.name);
        existing = await prisma.user.findUnique({ where: { referralCode } });
      }
      await prisma.user.update({
        where: { id: user.id },
        data: { referralCode },
      });
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
};
