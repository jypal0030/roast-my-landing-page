import { NextRequest, NextResponse } from "next/server";

// Simple in-memory analytics. Replace with proper DB table at >10K events/day.
// Schema: { event, path, referrer, timestamp, roastId?, score? }

interface AnalyticsEvent {
  event: string;
  path?: string;
  referrer?: string;
  roastId?: string;
  score?: number;
  brutalityLevel?: number;
  sharePlatform?: string;
  ctaType?: string;
  error?: string;
}

const MAX_EVENTS = 5000;
const events: (AnalyticsEvent & { timestamp: string })[] = [];

const VALID_EVENTS = new Set([
  "page_view",
  "roast_submitted",
  "roast_completed",
  "roast_failed",
  "roast_shared",
  "cta_clicked",
  "challenge_copied",
  "feedback_given",
]);

export async function POST(req: NextRequest) {
  try {
    const body: AnalyticsEvent = await req.json();

    if (!body.event || !VALID_EVENTS.has(body.event)) {
      return NextResponse.json({ error: "Invalid event" }, { status: 400 });
    }

    const entry = {
      ...body,
      path: body.path || req.headers.get("referer") || "/",
      referrer: body.referrer || req.headers.get("referer") || "direct",
      timestamp: new Date().toISOString(),
    };

    events.push(entry);
    if (events.length > MAX_EVENTS) events.shift();

    return NextResponse.json({ ok: true, total: events.length });
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
}

export async function GET() {
  // Aggregated stats only — never expose raw events
  const now = Date.now();
  const last24h = events.filter((e) => now - new Date(e.timestamp).getTime() < 86400000);
  const last7d = events.filter((e) => now - new Date(e.timestamp).getTime() < 604800000);

  const count = (list: typeof events, event: string) =>
    list.filter((e) => e.event === event).length;

  return NextResponse.json({
    total: events.length,
    last24h: {
      pageViews: count(last24h, "page_view"),
      submitted: count(last24h, "roast_submitted"),
      completed: count(last24h, "roast_completed"),
      failed: count(last24h, "roast_failed"),
      shared: count(last24h, "roast_shared"),
      ctaClicked: count(last24h, "cta_clicked"),
      challengeCopied: count(last24h, "challenge_copied"),
    },
    last7d: {
      pageViews: count(last7d, "page_view"),
      submitted: count(last7d, "roast_submitted"),
      completed: count(last7d, "roast_completed"),
      failed: count(last7d, "roast_failed"),
      shared: count(last7d, "roast_shared"),
    },
    ratios24h: {
      submissionRate:
        count(last24h, "page_view") > 0
          ? +(count(last24h, "roast_submitted") / count(last24h, "page_view") * 100).toFixed(1)
          : 0,
      completionRate:
        count(last24h, "roast_submitted") > 0
          ? +(count(last24h, "roast_completed") / count(last24h, "roast_submitted") * 100).toFixed(1)
          : 0,
      shareRate:
        count(last24h, "roast_completed") > 0
          ? +(count(last24h, "roast_shared") / count(last24h, "roast_completed") * 100).toFixed(1)
          : 0,
    },
  });
}
