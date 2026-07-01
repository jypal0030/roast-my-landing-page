import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ReferralDashboard } from "./ReferralDashboard";

export const metadata: Metadata = {
  title: "Referral Program",
};

export default async function ReferralPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/auth/signin");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { referralCode: true, plan: true, balance: true, totalEarnings: true },
  });

  if (!user) redirect("/auth/signin");

  const [level1, level2, level3, referrals] = await Promise.all([
    prisma.referral.count({ where: { referrerId: session.user.id, level: 1 } }),
    prisma.referral.count({ where: { referrerId: session.user.id, level: 2 } }),
    prisma.referral.count({ where: { referrerId: session.user.id, level: 3 } }),
    prisma.referral.findMany({
      where: { referrerId: session.user.id },
      include: { referred: { select: { name: true, email: true } } },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
  ]);

  return (
    <ReferralDashboard
      user={user}
      stats={{ level1, level2, level3 }}
      referrals={referrals}
    />
  );
}
