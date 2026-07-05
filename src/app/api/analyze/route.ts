import { NextResponse } from "next/server";
import { getPageSpeedData } from "@/lib/pagespeed";
import { scrapeWithJina } from "@/lib/scraper";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const domain = searchParams.get("domain") || searchParams.get("url");
  
  if (!domain) {
    return NextResponse.json({ error: "domain or url parameter required" }, { status: 400 });
  }

  try {
    const url = domain.startsWith("http") ? domain : `https://${domain}`;
    const [pagespeed, jinaContent] = await Promise.all([
      getPageSpeedData(url),
      scrapeWithJina(url),
    ]);

    return NextResponse.json({
      pagespeed,
      hasJinaContent: !!jinaContent,
      contentLength: jinaContent?.length || 0,
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
