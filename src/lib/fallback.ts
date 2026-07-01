import { RoastResult } from "./openai";

const SAVAGE_ROASTS = [
  "This landing page is so confusing, even a GPS would give up navigating it.",
  "Your CTA is hiding like it owes money to the IRS.",
  "I've seen more personality in a terms & conditions page.",
  "This design screams 'I asked my nephew who knows Canva'.",
  "Your above-the-fold is so empty, tumbleweeds are rolling across my screen.",
  "Loading this page feels like downloading a car on dial-up.",
  "This copy reads like it was written by ChatGPT — wait, it probably was.",
  "Your mobile layout is so broken, it looks like abstract art on my phone.",
  "Trust signals? There's more trust in a Nigerian prince email.",
  "Your hero section is about as exciting as watching paint dry in slow motion.",
  "This color scheme was last trendy when MySpace was still relevant.",
  "Your value proposition is buried deeper than Atlantis.",
  "This page converts visitors into confused people who immediately leave.",
  "I've seen better-designed 404 pages. And yours probably doesn't even have one.",
  "Your typography choices are committing crimes against readability.",
  "The only thing 'above the fold' here is my disappointment.",
  "This landing page has the conversion rate of a brick wall.",
  "Your social proof section is emptier than a vegan restaurant in Texas.",
  "The spacing on this page is so inconsistent, it's triggering my OCD.",
  "Your headline is so generic, it could describe literally any SaaS.",
];

const FIXES = [
  "Make your CTA button the most visually dominant element — bright contrasting color, large text, clear action verb.",
  "Add social proof above the fold — testimonials, logos, or a live user counter.",
  "Rewrite your headline to address a specific pain point. 'Grow your business' ≠ compelling.",
  "Reduce your hero section to one clear message + one CTA. No distractions.",
  "Add urgency: limited-time offer, scarcity counter, or social proof notification.",
  "Include trust badges: SSL certificate, money-back guarantee, or security logos near CTA.",
  "Optimize for mobile: test on actual devices, ensure text is readable without zooming.",
  "Break up walls of text: use bullet points, short paragraphs, and visual hierarchy.",
  "Add a demo video or interactive element above the fold to engage visitors instantly.",
  "Use benefit-driven headlines, not feature lists. What problem do you actually solve?",
  "Add a clear money-back guarantee or free trial mention near the CTA to reduce anxiety.",
  "Incorporate testimonials with photos, names, and specific results (not just 'great product').",
  "Improve page load speed: compress images, lazy load below-fold content, minimize JS.",
  "Fix visual hierarchy: use size, color, and spacing to guide eyes toward the CTA.",
  "Add an exit-intent popup with a lead magnet to capture abandoning visitors.",
];

const VIBES = [
  "Midlife Crisis", "Tragic", "Confusing AF", "Boring", "Desktop-Only Disaster",
  "Conversion Blackhole", "Cringe", "Y2K Relic", "Generic Hell", "Clip Art Chic",
  "Loading... Still Loading", "Boomer-Approved", "Uncanny Valley", "Trust Me Bro",
  "404 Personality", "Placeholder Heaven", "Times New Roman Nightmare",
];

function randomScore(): number {
  // Weighted toward lower scores (savage!)
  return Math.floor(Math.random() * 4) + 2; // 2-5 range
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateMoneyLoss(score: number): number {
  return Math.round((10 - score) * (Math.random() * 200 + 50));
}

export function generateFallbackRoast(
  htmlContent: string,
  lighthouseData: Record<string, unknown>,
  brutalityLevel: number
): RoastResult {
  const categories = [
    { key: "firstImpression", name: "First Impression" },
    { key: "copywriting", name: "Copywriting" },
    { key: "visualDesign", name: "Visual Design" },
    { key: "ctaClarity", name: "CTA Clarity" },
    { key: "mobileFriendliness", name: "Mobile Friendliness" },
    { key: "loadingSpeed", name: "Loading Speed" },
    { key: "trustSignals", name: "Trust Signals" },
    { key: "aboveTheFold", name: "Above the Fold" },
  ] as const;

  const categoryResults = categories.map((cat) => {
    const score = randomScore();
    return [cat.key, {
      score,
      roast: pickRandom(SAVAGE_ROASTS),
      fix: pickRandom(FIXES),
      moneyImpact: generateMoneyLoss(score),
    }];
  });

  const results: Record<string, unknown> = Object.fromEntries(categoryResults);
  const overallScore = Math.round(
    categories.reduce((sum, c) => sum + (results[c.key] as any).score, 0) / categories.length
  );
  const totalMonthlyLoss = categories.reduce(
    (sum, c) => sum + (results[c.key] as any).moneyImpact, 0
  );

  const brualityPrefix = brutalityLevel >= 4
    ? "🔴 DEMO MODE (AI quota exceeded) — "
    : "⚠️ DEMO MODE — ";

  return {
    firstImpression: results.firstImpression as any,
    copywriting: results.copywriting as any,
    visualDesign: results.visualDesign as any,
    ctaClarity: results.ctaClarity as any,
    mobileFriendliness: results.mobileFriendliness as any,
    loadingSpeed: results.loadingSpeed as any,
    trustSignals: results.trustSignals as any,
    aboveTheFold: results.aboveTheFold as any,
    overallScore,
    vibe: brualityPrefix + pickRandom(VIBES),
    top3Fixes: [pickRandom(FIXES), pickRandom(FIXES), pickRandom(FIXES)],
    totalMonthlyLoss,
    yearlyLoss: totalMonthlyLoss * 12,
  };
}
