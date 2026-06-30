import puppeteer from "puppeteer";

export async function captureScreenshot(url: string): Promise<string | null> {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(url, { waitUntil: "networkidle2", timeout: 15000 });

    const screenshot = await page.screenshot({
      type: "jpeg",
      quality: 80,
      fullPage: false,
    });

    const base64 = Buffer.from(screenshot).toString("base64");
    return `data:image/jpeg;base64,${base64}`;
  } catch (error) {
    console.error("Screenshot capture failed:", error);
    return null;
  } finally {
    if (browser) await browser.close();
  }
}

export async function extractHtmlContent(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });
    const html = await response.text();

    // Extract text content, strip scripts and styles
    const textContent = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    return textContent.substring(0, 10000);
  } catch (error) {
    console.error("HTML extraction failed:", error);
    return "";
  }
}

export async function getBasicLighthouseData(url: string) {
  const startTime = Date.now();

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });
    const html = await response.text();
    const loadTime = Date.now() - startTime;

    // Basic metrics extraction
    const hasMobileMeta = html.includes("viewport");
    const hasTitle = /<title[^>]*>([^<]+)<\/title>/i.test(html);
    const titleText = html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1] || "";
    const hasMetaDescription = /<meta[^>]*name="description"/i.test(html);
    const hasH1 = /<h1[^>]*>/i.test(html);
    const imageCount = (html.match(/<img[^>]*>/gi) || []).length;
    const hasAltTags = (html.match(/<img[^>]*alt="[^"]*"/gi) || []).length;
    const hasSchemaMarkup = /application\/ld\+json/i.test(html);
    const htmlSize = html.length;
    const hasCanonical = /<link[^>]*rel="canonical"/i.test(html);
    const hasOpenGraph = /og:title/i.test(html);
    const hasTwitterCard = /twitter:card/i.test(html);
    const headingCount = (html.match(/<h[1-6][^>]*>/gi) || []).length;

    return {
      loadTimeMs: loadTime,
      loadTimeScore: loadTime < 1000 ? 10 : loadTime < 3000 ? 7 : loadTime < 5000 ? 4 : 1,
      hasMobileMeta,
      hasTitle,
      titleText,
      hasMetaDescription,
      hasH1,
      imageCount,
      hasAltTags,
      altTagRatio: imageCount > 0 ? hasAltTags / imageCount : 0,
      hasSchemaMarkup,
      htmlSizeKb: Math.round(htmlSize / 1024),
      hasCanonical,
      hasOpenGraph,
      hasTwitterCard,
      headingCount,
    };
  } catch (error) {
    console.error("Lighthouse check failed:", error);
    return {
      loadTimeMs: 5000,
      loadTimeScore: 1,
      hasMobileMeta: false,
      hasTitle: false,
      titleText: "",
      hasMetaDescription: false,
      hasH1: false,
      imageCount: 0,
      hasAltTags: 0,
      altTagRatio: 0,
      hasSchemaMarkup: false,
      htmlSizeKb: 0,
      hasCanonical: false,
      hasOpenGraph: false,
      hasTwitterCard: false,
      headingCount: 0,
    };
  }
}
