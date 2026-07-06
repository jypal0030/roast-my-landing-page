import { NextRequest, NextResponse } from "next/server";
import { generateRoast } from "@/lib/openai";
import { generateFallbackRoast } from "@/lib/fallback";
import { getBasicLighthouseData } from "@/lib/screenshot";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { scrapeWithJina, extractHtmlContent } from "@/lib/scraper";
import { generateGroqRoast } from "@/lib/groq";
import { buildRoastPrompt } from "@/lib/roast-prompt";
import { getPageSpeedData } from "@/lib/pagespeed";

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const session = await getServerSession(authOptions);
    const identifier = session?.user?.email || req.headers.get("x-forwarded-for") || "anonymous";
    const limitResult = await checkRateLimit(identifier, !!session?.user?.email);

    if (!limitResult.allowed) {
      return NextResponse.json(
        { error: limitResult.message || "Rate limit exceeded", retryAfter: limitResult.retryAfter },
        { status: 429 }
      );
    }

    const { url, brutalityLevel = 2 } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    let normalizedUrl = url.trim();
    if (!normalizedUrl.startsWith("http://") && !normalizedUrl.startsWith("https://")) {
      normalizedUrl = `https://${normalizedUrl}`;
    }

    const domain = new URL(normalizedUrl).hostname;

    // Step 1: Scrape content (Jina AI → HTML fallback) + Lighthouse + PageSpeed
    const [scrapedContent, lighthouse, pagespeedData] = await Promise.all([
      (async () => {
        const jinaContent = await scrapeWithJina(normalizedUrl);
        return jinaContent || extractHtmlContent(normalizedUrl);
      })(),
      getBasicLighthouseData(normalizedUrl),
      getPageSpeedData(normalizedUrl),
    ]);

    // Step 2: Generate roast with enhanced prompt
    const systemPrompt = buildRoastPrompt(brutalityLevel);
    let roastResult;
    let aiModel = "gpt-4o-mini";

    try {
      // Try Groq first (faster, less censored, free)
      if (process.env.GROQ_API_KEY) {
        const groqResponse = await generateGroqRoast(systemPrompt, scrapedContent, lighthouse, pagespeedData);
        const cleaned = groqResponse.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        roastResult = JSON.parse(cleaned);
        // Normalize: Groq prompt wraps categories under "scores", flatten to top-level
        if (roastResult.scores && !roastResult.firstImpression) {
          roastResult = { ...roastResult.scores, ...roastResult };
          delete roastResult.scores;
        }
        aiModel = "llama-3.3-70b (Groq)";
      } else {
        throw new Error("No Groq key");
      }
    } catch (groqError) {
      console.log("Groq failed, falling back to OpenAI:", String(groqError).slice(0, 80));
      // Fallback to GPT-4o-mini
      try {
        roastResult = await generateRoast(scrapedContent, lighthouse, brutalityLevel);
        aiModel = "gpt-4o-mini";
      } catch (openaiError) {
        console.error("OpenAI also failed:", String(openaiError).slice(0, 80));
        roastResult = generateFallbackRoast(scrapedContent, lighthouse, brutalityLevel);
        aiModel = "fallback-demo";
      }
    }

    // Step 3: Always save to DB
    let roastId = "roast_" + Date.now();
    try {
      const { prisma } = await import("@/lib/prisma");
      const saved = await prisma.roast.create({
        data: {
          url: normalizedUrl,
          domain,
          userId: session?.user?.id || null,
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
          htmlContent: scrapedContent.substring(0, 50000),
          lighthouseJson: JSON.stringify(lighthouse),
          aiModel,
          isPublic: true,
        },
      });
      roastId = saved.id;
    } catch (dbError) {
      console.error("DB save failed:", String(dbError).slice(0, 300));
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
      pagespeed: pagespeedData,
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
