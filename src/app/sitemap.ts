import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://roast-my-landing-page-umber.vercel.app";

  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily" as const, priority: 1 },
    { url: `${baseUrl}/pricing`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${baseUrl}/auth/signin`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${baseUrl}/referral`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${baseUrl}/leaderboard`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.8 },
  ];

  // Add public roasts
  try {
    const { prisma } = await import("@/lib/prisma");
    const roasts = await prisma.roast.findMany({
      where: { isPublic: true },
      select: { domain: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    roasts.forEach((r: { domain: string; createdAt: Date }) => {
      staticPages.push({
        url: `${baseUrl}/roasted/${r.domain}`,
        lastModified: r.createdAt,
        changeFrequency: "weekly" as const,
        priority: 0.5,
      });
    });
  } catch {
    // DB not available — return static pages only
  }

  return staticPages;
}
