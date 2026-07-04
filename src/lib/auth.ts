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
    async signIn({ user, account }) {
      if (!user.email) return false;

      try {
        const { prisma } = require("@/lib/prisma");

        // Find or create user in DB
        let dbUser = await prisma.user.findUnique({ where: { email: user.email } });

        if (!dbUser) {
          // Generate unique referral code
          let code = generateReferralCode(user.name);
          let exists = await prisma.user.findUnique({ where: { referralCode: code } });
          while (exists) {
            code = generateReferralCode(user.name);
            exists = await prisma.user.findUnique({ where: { referralCode: code } });
          }

          dbUser = await prisma.user.create({
            data: {
              email: user.email,
              name: user.name,
              image: user.image,
              referralCode: code,
              plan: "free",
              balance: 0,
            },
          });

          // Process referral if referred
          try {
            const { processReferral } = require("@/lib/referral");
            // Check for referral code from cookie (set by middleware)
            // We use a global store since we can't access cookies directly in callback
            const pendingReferral = (globalThis as any).__pendingReferral?.[user.email];
            if (pendingReferral) {
              await processReferral(dbUser.id, pendingReferral);
              delete (globalThis as any).__pendingReferral[user.email];
            }
          } catch {
            // Referral processing is non-blocking
          }
        } else {
          // Update profile on re-login
          await prisma.user.update({
            where: { id: dbUser.id },
            data: { name: user.name, image: user.image },
          });
        }

        // Create account linking if not exists
        if (account) {
          const existingAccount = await prisma.account.findUnique({
            where: {
              provider_providerAccountId: {
                provider: account.provider,
                providerAccountId: account.providerAccountId,
              },
            },
          });
          if (!existingAccount) {
            await prisma.account.create({
              data: {
                userId: dbUser.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                access_token: account.access_token,
                refresh_token: account.refresh_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
              },
            });
          }
        }
      } catch {
        // DB not available — still allow login with JWT-only
        console.warn("Auth: DB unavailable, using JWT-only mode");
      }

      return true;
    },

    async jwt({ token, user, account }) {
      if (user) {
        token.email = user.email || "";
        token.name = user.name || "";
        token.picture = user.image || "";
      }

      // Try to enrich from DB
      if (token.email) {
        try {
          const { prisma } = require("@/lib/prisma");
          const dbUser = await prisma.user.findUnique({
            where: { email: token.email as string },
            select: { id: true, plan: true, referralCode: true, balance: true, totalEarnings: true },
          });
          if (dbUser) {
            token.id = dbUser.id;
            token.plan = dbUser.plan;
            token.referralCode = dbUser.referralCode;
            token.balance = dbUser.balance;
            token.totalEarnings = dbUser.totalEarnings;
          }
        } catch {
          // DB not available — JWT still works with basic info
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) || (token.sub as string) || "";
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
