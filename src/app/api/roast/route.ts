import { NextRequest, NextResponse } from "next/server";
import { generateRoast } from "@/lib/openai";
import { generateFallbackRoast } from "@/lib/fallback";
import { extractHtmlContent, getBasicLighthouseData } from "@/lib/screenshot";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { url, brutalityLevel = 2 } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    let normalizedUrl = url.trim();
    if (!normalizedUrl.startsWith("http://") && !normalizedUrl.startsWith("https://")) {
      normalizedUrl = `https://${normalizedUrl}`;
    }

    const domain = new URL(normalizedUrl).hostname;

    // Step 1: Extract HTML + Lighthouse data
    const [htmlContent, lighthouse] = await Promise.all([
      extractHtmlContent(normalizedUrl),
      getBasicLighthouseData(normalizedUrl),
    ]);

    // Step 2: AI roast (with fallback)
    let roastResult;
    let aiModel = "gpt-4o-mini";
    try {
      roastResult = await generateRoast(htmlContent, lighthouse, brutalityLevel);
    } catch (aiError) {
      console.error("OpenAI failed, using fallback:", String(aiError).slice(0, 100));
      roastResult = generateFallbackRoast(htmlContent, lighthouse, brutalityLevel);
      aiModel = "fallback-demo";
    }

    // Step 3: Save to DB if user is logged in
    let roastId = "roast_" + Date.now();
    try {
      const session = await getServerSession(authOptions);
      if (session?.user?.email) {
        const { prisma } = await import("@/lib/prisma");
        const saved = await prisma.roast.create({
          data: {
            url: normalizedUrl,
            domain,
            userId: session.user.id,
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
            htmlContent: htmlContent.substring(0, 50000),
            lighthouseJson: JSON.stringify(lighthouse),
            aiModel,
          },
        });
        roastId = saved.id;
      }
    } catch {
      // DB not available — roast still works, just not saved
    }

    return NextResponse.json({
      id: roastId,
      url: normalizedUrl,
      domain,
      overallScore: roastResult.overallScore,
      scores: {
        firstImpression: roastResult.firstImpression,
        copywriting: roastResult.copywriting,
        visualDesign: roastResult.visualDesign,
        ctaClarity: roastResult.ctaClarity,
        mobileFriendliness: roastResult.mobileFriendliness,
        loadingSpeed: roastResult.loadingSpeed,
        trustSignals: roastResult.trustSignals,
        aboveTheFold: roastResult.aboveTheFold,
      },
      roastData: roastResult,
      lighthouse,
      vibe: roastResult.vibe,
      totalMonthlyLoss: roastResult.totalMonthlyLoss,
      yearlyLoss: roastResult.yearlyLoss,
      aiModel,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("Roast API error:", msg);
    return NextResponse.json(
      { error: `Roast failed: ${msg}` },
      { status: 500 }
    );
  }
}
