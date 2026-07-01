let _prisma: any = null;

function getPrisma(): any {
  if (_prisma) return _prisma;
  const { PrismaClient } = require("@prisma/client") as any;
  const { PrismaPg } = require("@prisma/adapter-pg") as any;
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL || "" });
  _prisma = new PrismaClient({ adapter });
  return _prisma;
}

export const prisma = new Proxy({} as any, {
  get(_t: any, prop: string) {
    const c = getPrisma();
    const v = c[prop];
    return typeof v === "function" ? v.bind(c) : v;
  },
});
