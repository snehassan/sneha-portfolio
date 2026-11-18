import { NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { XMLParser } from "fast-xml-parser";
import { toFile, type Post } from "@/lib/post";
import { feedItemToPost, type FeedItem } from "@/lib/medium-import";
import { MEDIUM_HANDLE } from "@/lib/medium";

/**
 * Copies Medium posts into the blog. Runs on the server (Vercel can reach
 * Medium), converts each post to Markdown and commits every new post to
 * content/blog in ONE commit, so the site rebuilds once.
 *
 * Posts already imported (same slug or same Medium URL) are skipped, so it's
 * safe to run again after publishing more on Medium. Medium's feed only
 * includes the 10 most recent posts.
 *
 * POST { password, dryRun?: boolean }
 */

const DIR = "content/blog";
const DEFAULT_REPO = "snehassan/sneha-portfolio";
const FEED = `https://medium.com/feed/${MEDIUM_HANDLE}`;

function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

function cdata(v: unknown): string {
  if (v == null) return "";
  if (typeof v === "object" && v !== null && "__cdata" in v) return String((v as { __cdata: unknown }).__cdata);
  if (typeof v === "object" && v !== null && "#text" in v) return String((v as { "#text": unknown })["#text"]);
  return String(v);
}

export async function POST(req: Request) {
  const password = process.env.ADMIN_PASSWORD;
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO || DEFAULT_REPO;
  const branch = process.env.GITHUB_BRANCH || "main";

  if (!password || !token) {
    return NextResponse.json({ error: "Server not configured. Set ADMIN_PASSWORD and GITHUB_TOKEN in Vercel." }, { status: 500 });
  }

  let body: { password?: string; dryRun?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  if (!body.password || !safeEqual(body.password, password)) {
    return NextResponse.json({ error: "Wrong password." }, { status: 401 });
  }

  const gh = { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json", "Content-Type": "application/json" };
  const api = (p: string) => `https://api.github.com/repos/${repo}${p}`;

  try {
    // 1. Read the Medium feed
    const res = await fetch(FEED, { cache: "no-store", headers: { "User-Agent": "sneha-portfolio/1.0" } });
    if (!res.ok) return NextResponse.json({ error: `Medium's feed answered ${res.status}. Try again in a minute.` }, { status: 502 });
    const data = new XMLParser({ ignoreAttributes: false, cdataPropName: "__cdata" }).parse(await res.text());
    const raw = data?.rss?.channel?.item;
    const items: Record<string, unknown>[] = Array.isArray(raw) ? raw : raw ? [raw] : [];
    const feed: FeedItem[] = items.map((it) => {
      const cats = it.category ? (Array.isArray(it.category) ? it.category : [it.category]) : [];
      return {
        title: cdata(it.title),
        link: cdata(it.link),
        pubDate: cdata(it.pubDate),
        categories: cats.map(cdata),
        html: cdata(it["content:encoded"]) || cdata(it.description),
      };
    });
    if (!feed.length) return NextResponse.json({ error: "Medium's feed came back empty." }, { status: 502 });

    // 2. See what's already in the blog
    const list = await fetch(api(`/contents/${DIR}?ref=${branch}`), { headers: gh, cache: "no-store" });
    const files: { name: string; download_url: string | null }[] = list.ok ? await list.json() : [];
    const existingSlugs = new Set(files.filter((f) => f.name.endsWith(".md")).map((f) => f.name.replace(/\.md$/, "")));
    const existingMedium = new Set<string>();
    await Promise.all(
      files
        .filter((f) => f.name.endsWith(".md") && f.download_url)
        .map(async (f) => {
          const t = await fetch(f.download_url as string, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" }).then((r) => (r.ok ? r.text() : ""));
          const m = t.match(/^medium:\s*"?([^"\n]+)"?\s*$/m);
          if (m) existingMedium.add(m[1].trim());
        }),
    );

    const posts: Post[] = [];
    const skipped: string[] = [];
    for (const it of feed) {
      const p = feedItemToPost(it);
      if (!p.body || existingSlugs.has(p.slug) || (p.medium && existingMedium.has(p.medium)) || posts.some((x) => x.slug === p.slug)) {
        skipped.push(p.title);
        continue;
      }
      posts.push(p);
    }

    if (body.dryRun || posts.length === 0) {
      return NextResponse.json({
        ok: true,
        imported: [],
        wouldImport: posts.map((p) => p.title),
        skipped,
        message: posts.length ? `${posts.length} post(s) ready to import.` : "Nothing new to import. Everything on Medium is already on the blog.",
      });
    }

    // 3. One commit with every new post (Git Data API)
    const ref = await fetch(api(`/git/ref/heads/${branch}`), { headers: gh, cache: "no-store" }).then((r) => r.json());
    const headSha: string = ref?.object?.sha;
    if (!headSha) throw new Error(`Could not read branch ${branch}.`);
    const head = await fetch(api(`/git/commits/${headSha}`), { headers: gh, cache: "no-store" }).then((r) => r.json());

    const tree = await fetch(api("/git/trees"), {
      method: "POST",
      headers: gh,
      body: JSON.stringify({
        base_tree: head.tree.sha,
        tree: posts.map((p) => ({ path: `${DIR}/${p.slug}.md`, mode: "100644", type: "blob", content: toFile(p) })),
      }),
    }).then((r) => r.json());
    if (!tree.sha) throw new Error(`GitHub refused the files: ${JSON.stringify(tree).slice(0, 200)}`);

    const commit = await fetch(api("/git/commits"), {
      method: "POST",
      headers: gh,
      body: JSON.stringify({ message: `Blog: import ${posts.length} post(s) from Medium`, tree: tree.sha, parents: [headSha] }),
    }).then((r) => r.json());
    if (!commit.sha) throw new Error(`GitHub refused the commit: ${JSON.stringify(commit).slice(0, 200)}`);

    const upd = await fetch(api(`/git/refs/heads/${branch}`), { method: "PATCH", headers: gh, body: JSON.stringify({ sha: commit.sha }) });
    if (!upd.ok) throw new Error(`Could not move ${branch} (${upd.status}). Someone may have saved at the same moment; try again.`);

    return NextResponse.json({
      ok: true,
      imported: posts.map((p) => p.title),
      skipped,
      message: `Imported ${posts.length} post(s). They'll be live on /blog in about a minute.`,
    });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}
