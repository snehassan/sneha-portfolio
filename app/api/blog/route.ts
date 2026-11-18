import { NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { SLUG_RE, toFile, type Post } from "@/lib/post";

/**
 * Publishes, updates or deletes a blog post by committing content/blog/<slug>.md
 * to GitHub. Vercel sees the push and redeploys, so changes are live in ~1 min.
 *
 * Same environment variables as the other editors:
 *   ADMIN_PASSWORD, GITHUB_TOKEN, GITHUB_REPO (optional)
 */

const DIR = "content/blog";
const DEFAULT_REPO = "snehassan/sneha-portfolio";

function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

const okSlug = (s: unknown): s is string => typeof s === "string" && SLUG_RE.test(s) && s !== "admin" && s.length <= 80;

function isPost(p: unknown): p is Post {
  if (!p || typeof p !== "object") return false;
  const x = p as Post;
  return (
    okSlug(x.slug) &&
    typeof x.title === "string" &&
    x.title.trim().length > 0 &&
    x.title.length <= 200 &&
    typeof x.date === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(x.date) &&
    typeof x.summary === "string" &&
    x.summary.length <= 400 &&
    Array.isArray(x.tags) &&
    x.tags.length <= 12 &&
    x.tags.every((t) => typeof t === "string" && t.length <= 40) &&
    typeof x.draft === "boolean" &&
    (x.medium === undefined || (typeof x.medium === "string" && /^https:\/\//.test(x.medium))) &&
    typeof x.body === "string" &&
    x.body.trim().length > 0 &&
    x.body.length <= 200_000
  );
}

export async function POST(req: Request) {
  const password = process.env.ADMIN_PASSWORD;
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO || DEFAULT_REPO;

  if (!password || !token) {
    return NextResponse.json(
      { error: "Server not configured. Set ADMIN_PASSWORD and GITHUB_TOKEN in your Vercel environment variables." },
      { status: 500 },
    );
  }

  let body: { password?: string; action?: string; post?: unknown; originalSlug?: unknown; slug?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!body.password || !safeEqual(body.password, password)) {
    return NextResponse.json({ error: "Wrong password." }, { status: 401 });
  }

  const gh = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json",
  };
  const url = (slug: string) => `https://api.github.com/repos/${repo}/contents/${DIR}/${slug}.md`;

  /** sha of the existing file, or null if it doesn't exist. */
  const shaOf = async (slug: string): Promise<string | null> => {
    const r = await fetch(url(slug), { headers: gh, cache: "no-store" });
    if (r.status === 404) return null;
    if (!r.ok) throw new Error(`Could not read ${DIR}/${slug}.md from GitHub (${r.status}).`);
    return ((await r.json()) as { sha: string }).sha;
  };

  const remove = async (slug: string, sha: string, message: string) => {
    const r = await fetch(url(slug), { method: "DELETE", headers: gh, body: JSON.stringify({ message, sha }) });
    if (!r.ok) throw new Error(`GitHub refused to delete ${slug}.md (${r.status}). ${(await r.text()).slice(0, 200)}`);
  };

  try {
    if (body.action === "delete") {
      if (!okSlug(body.slug)) return NextResponse.json({ error: "Bad slug." }, { status: 400 });
      const sha = await shaOf(body.slug);
      if (!sha) return NextResponse.json({ error: "That post doesn't exist on GitHub." }, { status: 404 });
      await remove(body.slug, sha, `Blog: delete "${body.slug}"`);
      return NextResponse.json({ ok: true, message: "Deleted. The site updates in about a minute." });
    }

    if (body.action !== "save") return NextResponse.json({ error: "Unknown action." }, { status: 400 });
    if (!isPost(body.post)) {
      return NextResponse.json(
        { error: "A post needs a title, a URL slug (lowercase letters, numbers, dashes), a YYYY-MM-DD date and a body." },
        { status: 400 },
      );
    }
    const post = body.post;
    const original = okSlug(body.originalSlug) ? body.originalSlug : null;
    const renamed = original && original !== post.slug;

    const existing = await shaOf(post.slug);
    if (existing && (renamed || !original)) {
      return NextResponse.json({ error: `A post at /blog/${post.slug} already exists. Pick another URL.` }, { status: 409 });
    }

    const verb = post.draft ? "draft" : original ? "update" : "publish";
    const put = await fetch(url(post.slug), {
      method: "PUT",
      headers: gh,
      body: JSON.stringify({
        message: `Blog: ${verb} "${post.title.slice(0, 60)}"`,
        content: Buffer.from(toFile(post), "utf8").toString("base64"),
        ...(existing ? { sha: existing } : {}),
      }),
    });
    if (!put.ok) {
      return NextResponse.json(
        { error: `GitHub rejected the commit (${put.status}). ${(await put.text()).slice(0, 200)}` },
        { status: 502 },
      );
    }

    if (renamed) {
      const oldSha = await shaOf(original);
      if (oldSha) await remove(original, oldSha, `Blog: move "${original}" to "${post.slug}"`);
    }

    const where = post.draft ? "Saved as a draft (hidden from the site)." : `Published. Live at /blog/${post.slug} in about a minute.`;
    return NextResponse.json({ ok: true, message: where });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}
