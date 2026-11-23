import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

/** /robots.txt: everything is crawlable except the editors, stats and APIs. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/stats", "/blog/admin", "/current/admin", "/scribbles/admin"] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
