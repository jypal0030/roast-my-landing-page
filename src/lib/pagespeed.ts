// Google PageSpeed Insights API — free tier, no key needed for basic usage

export async function getPageSpeedData(url: string): Promise<Record<string, unknown> | null> {
  try {
    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=mobile`;
    const res = await fetch(apiUrl, { signal: AbortSignal.timeout(10000) });
    if (!res.ok) return null;
    const data = await res.json() as any;

    const lighthouse = data?.lighthouseResult;
    if (!lighthouse) return null;

    return {
      performanceScore: Math.round((lighthouse.categories?.performance?.score || 0) * 100),
      accessibilityScore: Math.round((lighthouse.categories?.accessibility?.score || 0) * 100),
      bestPracticesScore: Math.round((lighthouse.categories?.["best-practices"]?.score || 0) * 100),
      seoScore: Math.round((lighthouse.categories?.seo?.score || 0) * 100),
      firstContentfulPaint: lighthouse.audits?.["first-contentful-paint"]?.displayValue || "N/A",
      speedIndex: lighthouse.audits?.["speed-index"]?.displayValue || "N/A",
      largestContentfulPaint: lighthouse.audits?.["largest-contentful-paint"]?.displayValue || "N/A",
      totalBlockingTime: lighthouse.audits?.["total-blocking-time"]?.displayValue || "N/A",
      cumulativeLayoutShift: lighthouse.audits?.["cumulative-layout-shift"]?.displayValue || "N/A",
      serverResponseTime: lighthouse.audits?.["server-response-time"]?.displayValue || "N/A",
      interactive: lighthouse.audits?.["interactive"]?.displayValue || "N/A",
    };
  } catch {
    return null;
  }
}
