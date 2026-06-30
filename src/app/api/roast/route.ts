import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateRoast } from "@/lib/openai";
import { captureScreenshot, extractHtmlContent, getBasicLighthouseData } from "@/lib/screenshot";

const FREE_ROAST_LIMIT = 1; // per day for free users
const PLAN_LIMITS: Record<string, number> = {
  free: 1,
  starter: 5,
  pro: 20,
  agency: 100,
};

export async function POST(req: NextRequest) {
  try {
    const { url, brutalityLevel = 2 } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Validate URL
    let normalizedUrl = url.trim();
    if (!normalizedUrl.startsWith("http://") && !normalizedUrl.startsWith("https://")) {
      normalizedUrl = `https://${normalizedUrl}`;
    }

    // Extract domain for caching
    const domain = new URL(normalizedUrl).hostname;

    // Check cache (same domain roasted within 24h)
    const cachedRoast = await prisma.roast.findFirst({
      where: {
        url: { contains: domain },
        createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      },
      orderBy: { createdAt: "desc" },
    });

    if (cachedRoast) {
      return NextResponse.json({
        ...cachedRoast,
        scores: JSON.parse(cachedRoast.scoresJson),
        roastData: JSON.parse(cachedRoast.roastJson),
        lighthouse: cachedRoast.lighthouseJson ? JSON.parse(cachedRoast.lighthouseJson) : null,
        cached: true,
      });
    }

    // Auth & rate limiting
    const session = await getServerSession(authOptions);
    let userId: string | undefined;

    if (session?.user?.id) {
      userId = session.user.id;
      const plan = (session.user.plan as string) || "free";
      const limit = PLAN_LIMITS[plan] || 1;

      // Count today's roasts
      const todayRoasts = await prisma.roast.count({
        where: {
          userId,
          createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        },
      });

      if (todayRoasts >= limit) {
        return NextResponse.json(
          {
            error: `Daily limit reached (${limit} roasts/day on ${plan} plan). Upgrade for more!`,
            code: "LIMIT_EXCEEDED",
          },
          { status: 429 }
        );
      }
    } else {
      // Anonymous: check IP-based rate limiting
      const ip = req.headers.get("x-forwarded-for") || "anonymous";
      const anonRoasts = await prisma.roast.count({
        where: {
          userId: null,
          // Can't easily do IP-based in SQLite, skip for now
        },
      });
      // Simple anonymous limiting will be handled by Vercel rate limiting in prod
    }

    // Step 1: Run screenshot + HTML + Lighthouse in parallel
    const [screenshot, htmlContent, lighthouse] = await Promise.all([
      captureScreenshot(normalizedUrl).catch(() => null),
      extractHtmlContent(normalizedUrl),
      getBasicLighthouseData(normalizedUrl),
    ]);

    // Step 2: Generate AI roast
    const roastResult = await generateRoast(
      htmlContent,
      lighthouse,
      brutalityLevel
    );

    // Step 3: Save to database
    const roast = await prisma.roast.create({
      data: {
        url: normalizedUrl,
        domain,
        userId: userId || null,
        brutalityLevel,
        overallScore: roastResult.overallScore,
        vibe: roastResult.vibe,
        totalMonthlyLoss: roastResult.totalMonthlyLoss,
        yearlyLoss: roastResult.yearlyLoss,
        scoresJson: JSON.stringify({
          firstImpression: roastResult.firstImpression,
          copywriting: roastResult.copywriting,
          visualDesign: roastResult.visualDesign,
          ctaClarity: roastResult.ctaClarity,
          mobileFriendliness: roastResult.mobileFriendliness,
          loadingSpeed: roastResult.loadingSpeed,
          trustSignals: roastResult.trustSignals,
          aboveTheFold: roastResult.aboveTheFold,
        }),
        roastJson: JSON.stringify(roastResult),
        screenshotUrl: screenshot,
        htmlContent: htmlContent.substring(0, 5000),
        lighthouseJson: JSON.stringify(lighthouse),
        aiModel: "gpt-4o-mini",
      },
    });

    return NextResponse.json({
      ...roast,
      scores: JSON.parse(roast.scoresJson),
      roastData: roastResult,
      lighthouse,
    });
  } catch (error) {
    console.error("Roast API error:", error);
    return NextResponse.json(
      { error: "Failed to roast this website. It might be blocking our bot. Try another URL!" },
      { status: 500 }
    );
  }
}
