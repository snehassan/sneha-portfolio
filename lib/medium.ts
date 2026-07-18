import { XMLParser } from "fast-xml-parser";

export type Article = {
  title: string;
  link: string;
  date: string; // e.g. "JUL 2026"
  readTime: string; // e.g. "8 MIN"
  summary: string;
  categories: string[];
};

export const MEDIUM_HANDLE = "@snehassan123";
export const MEDIUM_URL = `https://medium.com/${MEDIUM_HANDLE}`;
const FEED = `https://medium.com/feed/${MEDIUM_HANDLE}`;

function cdata(v: unknown): string {
  if (v == null) return "";
  if (typeof v === "string") return v;
  if (typeof v === "object" && v !== null && "__cdata" in v) {
    return String((v as { __cdata: unknown }).__cdata);
  }
  return String(v);
}

function stripHtml(html: string): string {
  return html
    .replace(/<figure[\s\S]*?<\/figure>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&#39;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/&[a-z0-9]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function fmtDate(pub: string): string {
  const d = new Date(pub);
  if (isNaN(d.getTime())) return "";
  return d
    .toLocaleDateString("en-US", { month: "short", year: "numeric" })
    .toUpperCase();
}

/**
 * Fetch the latest Medium posts. Revalidated hourly by Next's data cache.
 * Returns [] on any failure so pages can fall back gracefully.
 */
export async function getMediumArticles(limit = 20): Promise<Article[]> {
  try {
    const res = await fetch(FEED, {
      next: { revalidate: 3600 },
      headers: { "User-Agent": "sneha-portfolio/1.0" },
    });
    if (!res.ok) return [];
    const xml = await res.text();

    const parser = new XMLParser({
      ignoreAttributes: false,
      cdataPropName: "__cdata",
    });
    const data = parser.parse(xml);
    const rawItems = data?.rss?.channel?.item;
    const items = Array.isArray(rawItems) ? rawItems : rawItems ? [rawItems] : [];

    return items.slice(0, limit).map((it: Record<string, unknown>): Article => {
      const content =
        cdata(it["content:encoded"]) || cdata(it.description) || "";
      const text = stripHtml(content);
      const words = text ? text.split(" ").length : 0;
      const rawCats = it.category
        ? Array.isArray(it.category)
          ? it.category
          : [it.category]
        : [];
      return {
        title: cdata(it.title),
        link: cdata(it.link).split("?")[0],
        date: fmtDate(cdata(it.pubDate)),
        readTime: `${Math.max(1, Math.round(words / 200))} MIN`,
        summary:
          text.length > 180 ? text.slice(0, 180).trimEnd() + "…" : text,
        categories: rawCats.map(cdata),
      };
    });
  } catch {
    return [];
  }
}
