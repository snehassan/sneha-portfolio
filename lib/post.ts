/** Blog post shape and the frontmatter format, shared by the site, the editor and the API. */

export type Post = {
  slug: string;
  title: string;
  date: string; // YYYY-MM-DD
  summary: string;
  tags: string[];
  draft: boolean;
  body: string; // markdown
};

export const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function slugify(title: string) {
  return title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s-]+/g, "-")
    .slice(0, 80)
    .replace(/-+$/, "");
}

const q = (s: string) => JSON.stringify(s);

/** Serialize a post to a markdown file with a small YAML-ish frontmatter block. */
export function toFile(p: Post) {
  return [
    "---",
    `title: ${q(p.title)}`,
    `date: ${p.date}`,
    `summary: ${q(p.summary)}`,
    `tags: [${p.tags.map(q).join(", ")}]`,
    `draft: ${p.draft ? "true" : "false"}`,
    "---",
    "",
    p.body.trim(),
    "",
  ].join("\n");
}

function unq(v: string) {
  const t = v.trim();
  if (t.startsWith('"')) {
    try {
      return JSON.parse(t) as string;
    } catch {}
  }
  return t.replace(/^'(.*)'$/, "$1");
}

/** Parse a markdown file with frontmatter. Hand-edited files on GitHub work too. */
export function fromFile(slug: string, raw: string): Post {
  const text = raw.replace(/\r\n?/g, "\n");
  const m = text.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  const meta: Record<string, string> = {};
  if (m) {
    for (const line of m[1].split("\n")) {
      const kv = line.match(/^(\w+):\s*(.*)$/);
      if (kv) meta[kv[1]] = kv[2];
    }
  }
  const tagsRaw = (meta.tags || "").trim().replace(/^\[|\]$/g, "");
  return {
    slug,
    title: unq(meta.title || slug),
    date: unq(meta.date || "").slice(0, 10),
    summary: unq(meta.summary || ""),
    tags: tagsRaw ? tagsRaw.split(",").map(unq).filter(Boolean) : [],
    draft: unq(meta.draft || "false") === "true",
    body: (m ? m[2] : text).trim(),
  };
}

export function fmtPostDate(iso: string) {
  const d = new Date(iso + "T12:00:00Z");
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).toUpperCase();
}
