import { getAllPosts } from "@/lib/blog";
import { renderMarkdown } from "@/lib/markdown";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-static";

const x = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const cdata = (s: string) => `<![CDATA[${s.replace(/]]>/g, "]]]]><![CDATA[>")}]]>`;

/** /blog/rss.xml: full-text feed for readers and aggregators. */
export function GET() {
  const posts = getAllPosts();
  const items = posts
    .map((p) => {
      const url = `${SITE_URL}/blog/${p.slug}`;
      // Make relative links and images absolute so they work in feed readers.
      const html = renderMarkdown(p.body).replace(/(src|href)="\//g, `$1="${SITE_URL}/`);
      return `    <item>
      <title>${x(p.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(p.date + "T12:00:00Z").toUTCString()}</pubDate>
      <description>${x(p.summary)}</description>
${p.tags.map((t) => `      <category>${x(t)}</category>`).join("\n")}
      <content:encoded>${cdata(html)}</content:encoded>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Sneha Hassan's blog</title>
    <link>${SITE_URL}/blog</link>
    <atom:link href="${SITE_URL}/blog/rss.xml" rel="self" type="application/rss+xml" />
    <description>Notes on what Sneha Hassan is building, reading and breaking: ML, software and design.</description>
    <language>en</language>
    ${posts[0] ? `<lastBuildDate>${new Date(posts[0].date + "T12:00:00Z").toUTCString()}</lastBuildDate>` : ""}
${items}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
