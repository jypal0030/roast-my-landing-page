import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      plan?: string;
      referralCode?: string;
      balance?: number;
    } & DefaultSession["user"];
  }
}
