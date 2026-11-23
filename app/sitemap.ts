import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";
import { SITE_URL } from "@/lib/seo";

/** /sitemap.xml: every public page plus every published blog post. Hidden easter eggs stay out. */
export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const latest = posts[0]?.date ? new Date(posts[0].date + "T12:00:00Z") : new Date();
  const now = new Date();

  const pages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/projects`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/experience`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/blog`, lastModified: latest, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/resume`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/scribbles`, lastModified: now, changeFrequency: "weekly", priority: 0.5 },
    { url: `${SITE_URL}/writing`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
  ];

  return [
    ...pages,
    ...posts.map((p) => ({
      url: `${SITE_URL}/blog/${p.slug}`,
      lastModified: new Date(p.date + "T12:00:00Z"),
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
  ];
}
