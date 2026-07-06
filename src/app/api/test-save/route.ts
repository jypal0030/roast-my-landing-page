import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { prisma } = await import("@/lib/prisma");
    
    // Try minimal create
    const saved = await prisma.roast.create({
      data: {
        url: "https://test.com",
        domain: "test.com",
        brutalityLevel: 2,
        overallScore: 5.0,
        vibe: "test",
        totalMonthlyLoss: 0,
        yearlyLoss: 0,
        scoresJson: '{"firstImpression":{"score":5,"roast":"test","fix":"test","moneyImpact":0}}',
        roastJson: '{"overallScore":5}',
        htmlContent: "test",
        lighthouseJson: '{}',
        aiModel: "test",
        isPublic: true,
      },
    });

    return NextResponse.json({ 
      success: true, 
      id: saved.id,
      message: "Roast saved successfully"
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack : "";
    return NextResponse.json({ 
      success: false, 
      error: msg,
      stack: stack?.split("\n").slice(0, 5).join("\n"),
      errorType: error?.constructor?.name || "unknown"
    }, { status: 500 });
  }
}
