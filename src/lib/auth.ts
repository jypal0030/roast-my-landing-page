import { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

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
    async signIn({ user }) {
      // Allow all sign-ins — JWT stores user info without DB
      return !!user.email;
    },
    async jwt({ token, user, account }) {
      // Store user info from GitHub/Google in the JWT on first sign-in
      if (user) {
        token.id = account?.providerAccountId || user.email;
        token.name = user.name;
        token.email = user.email;
        token.image = user.image;
        token.plan = "free";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.image = token.image as string;
        session.user.plan = (token.plan as string) || "free";
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
};
