import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://roast-my-landing-page-umber.vercel.app";
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/dashboard", "/auth/"] },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
