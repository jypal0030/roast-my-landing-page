// Lazy Prisma client — no constructor calls at module import time

let _prisma: any = null;

function getPrisma(): any {
  if (_prisma) return _prisma;
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { PrismaClient } = require("@prisma/client") as { PrismaClient: any };
  _prisma = new PrismaClient(); // reads DATABASE_URL from env automatically
  return _prisma;
}

export const prisma = new Proxy({} as any, {
  get(_target, prop: string) {
    const client = getPrisma();
    const value = client[prop];
    return typeof value === "function" ? value.bind(client) : value;
  },
});
