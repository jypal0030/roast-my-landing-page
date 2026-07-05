// Jina AI Reader — free, no API key needed
// Replaces Puppeteer for Vercel-compatible web scraping

export async function scrapeWithJina(url: string): Promise<string | null> {
  try {
    const jinaUrl = `https://r.jina.ai/https://${url.replace(/^https?:\/\//, "")}`;
    const res = await fetch(jinaUrl, {
      headers: {
        Accept: "text/markdown",
      },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

// Lightweight fallback — fetch HTML directly
export async function extractHtmlContent(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      signal: AbortSignal.timeout(10000),
    });
    const html = await response.text();
    return html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .substring(0, 12000);
  } catch {
    return "";
  }
}
