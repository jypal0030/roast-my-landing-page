import type { PrismaClient as PrismaClientType } from "@prisma/client";

let _prisma: any = null;

function getPrisma(): PrismaClientType {
  if (_prisma) return _prisma;
  // Use dynamic require for lazy init, but import type at module level
  const mod: any = require("@prisma/client");
  _prisma = new mod.PrismaClient({
    datasources: { db: { url: process.env.DATABASE_URL } },
  });
  return _prisma;
}

export const prisma = new Proxy({} as PrismaClientType, {
  get(_target, prop: string) {
    const client = getPrisma();
    const value = (client as any)[prop];
    return typeof value === "function" ? value.bind(client) : value;
  },
});
