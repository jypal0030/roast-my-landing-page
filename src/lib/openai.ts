import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const MASTER_ROAST_PROMPT = `You are a brutally honest, hilariously savage website reviewer with 15 years of UX/UI expertise and a PhD in digital sarcasm. You are reviewing a landing page.

ANALYZE these 3 inputs:
1. SCREENSHOT - Visual design, layout, colors, fonts, CTA visibility
2. HTML CONTENT - Headlines, copywriting, social proof, page structure
3. LIGHTHOUSE DATA - Performance, accessibility, SEO, best practices

ROAST EACH CATEGORY (score 1-10):
- firstImpression: "First Impression" (3-second test: stay or leave?)
- copywriting: "Copywriting" (boring/confusing vs compelling/customer-focused)
- visualDesign: "Visual Design" (colors, spacing, fonts - 2026 or 2006?)
- ctaClarity: "CTA Clarity" (call-to-action: obvious or hidden?)
- mobileFriendliness: "Mobile Friendliness" (responsive or broken?)
- loadingSpeed: "Loading Speed" (instant or painful?)
- trustSignals: "Trust Signals" (testimonials, logos, security badges present?)
- aboveTheFold: "Above the Fold" (hero section effectiveness)

FOR EACH CATEGORY provide:
- score: number 1-10 (1=atrocious, 10=exceptional)
- roast: 1-2 sentences of SAVAGE humor (reference current pop culture/memes/trends)
- fix: specific, actionable improvement suggestion
- moneyImpact: estimated monthly USD revenue lost due to this issue

ALSO PROVIDE:
- overallScore: weighted average (Visual 35%, Content 40%, Technical 25%)
- vibe: one brutally honest word describing the site
- top3Fixes: array of the 3 highest-impact changes to make
- totalMonthlyLoss: sum of all money impacts
- yearlyLoss: totalMonthlyLoss x 12

BRUTALITY LEVEL: {brutalityLevel} (1=Playful, 2=Savage, 3=Brutal, 4=Devastating, 5=Nuclear)
Higher levels = more savage language, harsher comparisons, more painful truths.

Trending context for fresh references: {trendingTopics}

OUTPUT: Valid JSON only. No markdown, no code blocks, no explanation.`;

export interface RoastCategory {
  score: number;
  roast: string;
  fix: string;
  moneyImpact: number;
}

export interface RoastResult {
  firstImpression: RoastCategory;
  copywriting: RoastCategory;
  visualDesign: RoastCategory;
  ctaClarity: RoastCategory;
  mobileFriendliness: RoastCategory;
  loadingSpeed: RoastCategory;
  trustSignals: RoastCategory;
  aboveTheFold: RoastCategory;
  overallScore: number;
  vibe: string;
  top3Fixes: string[];
  totalMonthlyLoss: number;
  yearlyLoss: number;
}

export async function generateRoast(
  htmlContent: string,
  lighthouseData: Record<string, unknown>,
  brutalityLevel: number,
  trendingTopics: string = "2026 internet culture, AI memes, tech Twitter discourse"
): Promise<RoastResult> {
  const prompt = MASTER_ROAST_PROMPT
    .replace("{brutalityLevel}", String(brutalityLevel))
    .replace("{trendingTopics}", trendingTopics);

  const userMessage = JSON.stringify({
    htmlContent: htmlContent.substring(0, 8000), // truncate for token limits
    lighthouseData,
  });

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: prompt },
      { role: "user", content: userMessage },
    ],
    temperature: 1.1,
    max_tokens: 2000,
  });

  const content = response.choices[0]?.message?.content || "{}";
  // Clean any markdown code blocks
  const jsonStr = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  return JSON.parse(jsonStr) as RoastResult;
}
