import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { DashboardClient } from "./DashboardClient";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/auth/signin");

  const [user, roasts, payments, referralStats] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { plan: true, referralCode: true, balance: true, totalEarnings: true, email: true, name: true, createdAt: true },
    }),
    prisma.roast.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 20,
      select: { id: true, domain: true, overallScore: true, vibe: true, createdAt: true },
    }),
    prisma.payment.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    prisma.referral.aggregate({
      where: { referrerId: session.user.id },
      _count: { id: true },
    }),
  ]);

  const level1 = await prisma.referral.count({ where: { referrerId: session.user.id, level: 1 } });
  const level2 = await prisma.referral.count({ where: { referrerId: session.user.id, level: 2 } });
  const level3 = await prisma.referral.count({ where: { referrerId: session.user.id, level: 3 } });

  return (
    <DashboardClient
      user={user}
      roasts={roasts}
      payments={payments}
      referralCounts={{ total: referralStats._count.id, level1, level2, level3 }}
    />
  );
}
