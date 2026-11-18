import { slugify, type Post } from "@/lib/post";

/**
 * Turns Medium's RSS HTML into the Markdown the blog uses.
 * Medium's feed HTML is small and regular (p, h3/h4, figure/img/figcaption,
 * blockquote, pre, ul/ol, a, strong, em, code, hr, br, iframe), so a careful
 * tag-by-tag conversion is enough. No dependencies.
 */

const ENT: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", "#39": "'", hellip: "…", mdash: "\u2014", ndash: "\u2013", rsquo: "’", lsquo: "‘", rdquo: "”", ldquo: "“" };

export function decode(s: string) {
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z0-9]+);/gi, (m, e: string) => {
    if (e[0] === "#") {
      const n = e[1].toLowerCase() === "x" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      return Number.isFinite(n) ? String.fromCodePoint(n) : m;
    }
    return ENT[e.toLowerCase()] ?? m;
  });
}

const attr = (tag: string, name: string) => {
  const m = tag.match(new RegExp(`${name}\\s*=\\s*("([^"]*)"|'([^']*)')`, "i"));
  return m ? decode(m[2] ?? m[3] ?? "") : "";
};

const stripTags = (s: string) => decode(s.replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, ""));

/** Inline HTML (inside a paragraph, heading, list item) to Markdown. */
function inlineMd(html: string): string {
  let s = html;
  s = s.replace(/<br\s*\/?>/gi, "  \n");
  s = s.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, (_, c) => "`" + stripTags(c).replace(/`/g, "'") + "`");
  s = s.replace(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi, (_, a, t) => {
    const href = attr(`<a ${a}>`, "href");
    const text = inlineMd(t).trim();
    if (!href) return text;
    return text ? `[${text}](${href.replace(/\)/g, "%29").replace(/ /g, "%20")})` : "";
  });
  s = s.replace(/<(strong|b)\b[^>]*>([\s\S]*?)<\/\1>/gi, (_, __, t) => {
    const inner = t.trim();
    return inner ? `**${inner}**` : "";
  });
  s = s.replace(/<(em|i)\b[^>]*>([\s\S]*?)<\/\1>/gi, (_, __, t) => {
    const inner = t.trim();
    return inner ? `*${inner}*` : "";
  });
  s = s.replace(/<(s|strike|del)\b[^>]*>([\s\S]*?)<\/\1>/gi, "~~$2~~");
  s = s.replace(/<img\b[^>]*>/gi, (tag) => imageMd(tag, ""));
  s = s.replace(/<[^>]+>/g, "");
  return decode(s).replace(/[ \t]+/g, " ").replace(/\*\*\s*\*\*/g, "");
}

function imageMd(tag: string, caption: string) {
  const src = attr(tag, "src");
  if (!src || /medium\.com\/_\/stat/.test(src) || attr(tag, "width") === "1") return "";
  const alt = (attr(tag, "alt") || caption || "").replace(/[[\]]/g, "").trim();
  const cap = caption.replace(/"/g, "'").trim();
  return `![${alt}](${src})`.replace(/\)$/, cap ? ` "${cap}")` : ")");
}

/** Block-level HTML from Medium's feed to Markdown. */
export function htmlToMarkdown(html: string, title = ""): string {
  let s = html.replace(/\r\n?/g, "\n");
  const blocks: string[] = [];
  const keep = (md: string) => {
    blocks.push(md);
    return `\n\u0001${blocks.length - 1}\u0001\n`;
  };

  // Things whose insides must not be touched by the inline pass.
  s = s.replace(/<pre\b[^>]*>([\s\S]*?)<\/pre>/gi, (_, c) => keep("```\n" + stripTags(c).replace(/\n+$/, "") + "\n```"));
  s = s.replace(/<figure\b[^>]*>([\s\S]*?)<\/figure>/gi, (_, inner) => {
    const cap = (inner.match(/<figcaption[^>]*>([\s\S]*?)<\/figcaption>/i) || [])[1];
    const caption = cap ? stripTags(cap).trim() : "";
    const img = inner.match(/<img\b[^>]*>/i);
    if (img) return keep(imageMd(img[0], caption));
    const frame = inner.match(/<iframe\b[^>]*>/i);
    if (frame) {
      const src = attr(frame[0], "src");
      return src ? keep(`[${caption || "Embedded content"}](${src})`) : "";
    }
    return caption ? keep(`*${caption}*`) : "";
  });
  s = s.replace(/<iframe\b[^>]*>(?:<\/iframe>)?/gi, (tag) => {
    const src = attr(tag, "src");
    return src ? keep(`[Embedded content](${src})`) : "";
  });
  s = s.replace(/<img\b[^>]*>/gi, (tag) => {
    const md = imageMd(tag, "");
    return md ? keep(md) : "";
  });
  s = s.replace(/<blockquote\b[^>]*>([\s\S]*?)<\/blockquote>/gi, (_, inner) => {
    const text = inlineMd(inner.replace(/<\/p>\s*<p[^>]*>/gi, "\n\n")).trim();
    return keep(text.split("\n").map((l) => (l.trim() ? "> " + l.trim() : ">")).join("\n"));
  });
  s = s.replace(/<(ul|ol)\b[^>]*>([\s\S]*?)<\/\1>/gi, (_, kind, inner) => {
    const items = [...inner.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi)].map((m) => inlineMd(m[1]).replace(/\s*\n\s*/g, " ").trim());
    return keep(items.map((t, i) => (kind.toLowerCase() === "ol" ? `${i + 1}. ` : "- ") + t).join("\n"));
  });
  s = s.replace(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi, (_, n, inner) => {
    const text = inlineMd(inner).replace(/\*\*/g, "").trim();
    if (!text) return "";
    // Medium's h3 is a section heading, h4 a subheading.
    const level = Number(n) <= 3 ? "##" : "###";
    return keep(`${level} ${text}`);
  });
  s = s.replace(/<hr\b[^>]*>/gi, () => keep("---"));
  s = s.replace(/<p\b[^>]*>([\s\S]*?)<\/p>/gi, (_, inner) => {
    const text = inlineMd(inner).trim();
    return text ? keep(text) : "";
  });

  // Anything left over (stray text between blocks)
  const out: string[] = [];
  for (const chunk of s.split("\n")) {
    const t = chunk.trim();
    if (!t) continue;
    const ref = t.match(/^\u0001(\d+)\u0001$/);
    if (ref) out.push(blocks[Number(ref[1])]);
    else {
      const text = inlineMd(t).trim();
      if (text) out.push(text);
    }
  }

  // Medium repeats the title as the first heading; drop it.
  const norm = (x: string) => x.replace(/^#+\s*/, "").replace(/[^a-z0-9]/gi, "").toLowerCase();
  if (out.length && title && /^#/.test(out[0]) && norm(out[0]) === norm(title)) out.shift();

  return out
    .filter((b) => b.trim())
    .join("\n\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function plainSummary(md: string, max = 170) {
  const para = md
    .split(/\n{2,}/)
    .find((b) => b.trim() && !/^(#|!\[|```|>|-\s|\d+\.\s|\[Embedded)/.test(b.trim()));
  if (!para) return "";
  const text = para
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_`~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > max ? text.slice(0, max).replace(/\s+\S*$/, "") + "…" : text;
}

export type FeedItem = { title: string; link: string; pubDate: string; categories: string[]; html: string };

export function feedItemToPost(it: FeedItem): Post {
  const body = htmlToMarkdown(it.html, it.title);
  const d = new Date(it.pubDate);
  return {
    slug: slugify(it.title) || "post",
    title: it.title.trim(),
    date: isNaN(d.getTime()) ? new Date().toISOString().slice(0, 10) : d.toISOString().slice(0, 10),
    summary: plainSummary(body),
    tags: it.categories.map((c) => c.trim().toLowerCase()).filter(Boolean).slice(0, 8),
    draft: false,
    body,
    medium: it.link.split("?")[0],
  };
}
