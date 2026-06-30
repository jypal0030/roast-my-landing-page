import { prisma } from "./prisma";
import { REFERRAL_COMMISSIONS } from "./paddle";

export async function generateReferralCode(name?: string | null): Promise<string> {
  const prefix = name
    ? name.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 4)
    : "USER";
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  const code = `${prefix}-${random}`;
  const existing = await prisma.user.findUnique({ where: { referralCode: code } });
  if (existing) return generateReferralCode(name);
  return code;
}

export async function processReferral(newUserId: string, referralCode: string) {
  // Find referrer
  const referrer = await prisma.user.findUnique({
    where: { referralCode },
  });

  if (!referrer || referrer.id === newUserId) return;

  // Create Level 1 referral
  await prisma.referral.create({
    data: {
      referrerId: referrer.id,
      referredId: newUserId,
      level: 1,
    },
  });

  // Update referredBy on new user
  await prisma.user.update({
    where: { id: newUserId },
    data: { referredById: referrer.id },
  });

  // Check if referrer was referred by someone (Level 2)
  if (referrer.referredById) {
    const level2Referrer = await prisma.user.findUnique({
      where: { id: referrer.referredById },
    });
    if (level2Referrer) {
      const commission = REFERRAL_COMMISSIONS[level2Referrer.plan] || REFERRAL_COMMISSIONS.free;
      if (commission.levels >= 2) {
        await prisma.referral.create({
          data: {
            referrerId: level2Referrer.id,
            referredId: newUserId,
            level: 2,
          },
        });

        // Check Level 3
        if (level2Referrer.referredById) {
          const level3Referrer = await prisma.user.findUnique({
            where: { id: level2Referrer.referredById },
          });
          if (level3Referrer) {
            const comm3 = REFERRAL_COMMISSIONS[level3Referrer.plan] || REFERRAL_COMMISSIONS.free;
            if (comm3.levels >= 3) {
              await prisma.referral.create({
                data: {
                  referrerId: level3Referrer.id,
                  referredId: newUserId,
                  level: 3,
                },
              });
            }
          }
        }
      }
    }
  }
}

export async function distributeCommissions(paymentAmount: number, userId: string) {
  // Find all referral records where this user is the referred person
  const referrals = await prisma.referral.findMany({
    where: { referredId: userId },
    include: { referrer: true },
  });

  for (const referral of referrals) {
    const referrer = referral.referrer;
    const commission = REFERRAL_COMMISSIONS[referrer.plan] || REFERRAL_COMMISSIONS.free;
    const rate = commission.rates[referral.level - 1] || 0;
    const earnedAmount = paymentAmount * rate;

    if (earnedAmount > 0) {
      await prisma.$transaction([
        prisma.referral.update({
          where: { id: referral.id },
          data: {
            commission: { increment: earnedAmount },
            totalEarned: { increment: earnedAmount },
          },
        }),
        prisma.user.update({
          where: { id: referrer.id },
          data: {
            balance: { increment: earnedAmount },
            totalEarnings: { increment: earnedAmount },
          },
        }),
      ]);
    }
  }
}

export async function getReferralStats(userId: string) {
  const [level1, level2, level3, totalEarnings] = await Promise.all([
    prisma.referral.count({ where: { referrerId: userId, level: 1 } }),
    prisma.referral.count({ where: { referrerId: userId, level: 2 } }),
    prisma.referral.count({ where: { referrerId: userId, level: 3 } }),
    prisma.referral.aggregate({
      where: { referrerId: userId },
      _sum: { totalEarned: true },
    }),
  ]);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { balance: true },
  });

  return {
    level1,
    level2,
    level3,
    totalEarnings: totalEarnings._sum.totalEarned || 0,
    currentBalance: user?.balance || 0,
  };
}
