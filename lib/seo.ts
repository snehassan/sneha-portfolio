import type { Metadata } from "next";
import { MEDIUM_URL } from "@/lib/medium";

export const SITE_URL = "https://sneha.is-a.dev";
export const SITE_NAME = "Sneha Hassan";
export const DEFAULT_DESCRIPTION =
  "Sneha Hassan is a software and AI/ML engineer. LLM research at Carnegie Mellon's xulab, production ML at Ather Energy, and a few things that beep.";

export const SAME_AS = ["https://github.com/snehassan", "https://www.linkedin.com/in/sneha-hassan", MEDIUM_URL];

const RSS = { "application/rss+xml": [{ url: "/blog/rss.xml", title: "Sneha Hassan's blog" }] };

/**
 * Metadata for one page: title, description, canonical URL, and the
 * Open Graph / Twitter cards used when the link is shared.
 */
export function pageMeta({
  title,
  description,
  path,
  image,
  type = "website",
  publishedTime,
  tags,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article" | "profile";
  publishedTime?: string;
  tags?: string[];
}): Metadata {
  const img = image || "/opengraph-image";
  return {
    title,
    description,
    alternates: { canonical: path, types: RSS },
    openGraph: {
      title,
      description,
      url: path,
      siteName: SITE_NAME,
      locale: "en_US",
      type,
      images: [{ url: img, width: 1200, height: 630, alt: title }],
      ...(type === "article" ? { publishedTime, authors: [SITE_URL], tags } : {}),
    },
    twitter: { card: "summary_large_image", title, description, images: [img] },
  };
}

export const personJsonLd = {
  "@type": "Person",
  "@id": `${SITE_URL}/#person`,
  name: "Sneha Hassan",
  url: SITE_URL,
  jobTitle: "Software & AI/ML Engineer",
  description: DEFAULT_DESCRIPTION,
  email: "mailto:snehahassan7920@gmail.com",
  sameAs: SAME_AS,
  alumniOf: [{ "@type": "CollegeOrUniversity", name: "Carnegie Mellon University" }],
  worksFor: { "@type": "Organization", name: "Carnegie Mellon University" },
  knowsAbout: ["Machine learning", "Large language models", "Software engineering", "Full-stack development", "VR"],
};

/** Safe to drop into <script type="application/ld+json">: closes no tags. */
export function jsonLd(data: object) {
  return JSON.stringify({ "@context": "https://schema.org", ...data }).replace(/</g, "\\u003c");
}
