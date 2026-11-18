import { NextResponse } from "next/server";
import { dayKey, isBot, kvEnabled, kvPipeline, visitorId } from "@/lib/kv";

/**
 * Anonymous page analytics. The browser calls this once per page view
 * ({ type: "view", path, ref }) and once more if someone actually reads a
 * blog post ({ type: "read", slug }: scrolled most of the way or stayed 30s).
 *
 * Redis keys:
 *   views:total            all page views
 *   views:path   (hash)    path -> views
 *   views:day    (hash)    YYYY-MM-DD -> views
 *   uv:all, uv:<day> (HLL) unique visitors
 *   refs         (hash)    referring site -> visits
 *   post:views / post:reads (hash) slug -> count
 */

const clean = (s: unknown, max = 120) => (typeof s === "string" ? s.slice(0, max) : "");

export async function POST(req: Request) {
  if (!kvEnabled() || isBot(req)) return NextResponse.json({ ok: true, tracked: false });

  let body: { type?: string; path?: string; ref?: string; slug?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const id = visitorId(req);
  const day = dayKey();

  try {
    if (body.type === "read") {
      const slug = clean(body.slug, 90);
      if (!/^[a-z0-9-]+$/.test(slug)) return NextResponse.json({ ok: false }, { status: 400 });
      // One read per visitor per post per day.
      const r = await kvPipeline([["SET", `readseen:${slug}:${id}:${day}`, 1, "NX", "EX", 90000]]);
      if (r && r[0] === "OK") await kvPipeline([["HINCRBY", "post:reads", slug, 1]]);
      return NextResponse.json({ ok: true });
    }

    const path = clean(body.path, 200).split("?")[0].split("#")[0] || "/";
    if (!path.startsWith("/") || /\/admin\b|^\/stats\b|^\/api\//.test(path)) return NextResponse.json({ ok: true, tracked: false });

    const cmds: (string | number)[][] = [
      ["INCR", "views:total"],
      ["HINCRBY", "views:path", path, 1],
      ["HINCRBY", "views:day", day, 1],
      ["PFADD", "uv:all", id],
      ["PFADD", `uv:${day}`, id],
      ["EXPIRE", `uv:${day}`, 60 * 60 * 24 * 400],
    ];

    let host = "";
    try {
      host = body.ref ? new URL(body.ref).hostname.replace(/^www\./, "") : "";
    } catch {}
    const self = new URL(req.url).hostname.replace(/^www\./, "");
    if (host && host !== self && !host.endsWith(".vercel.app")) cmds.push(["HINCRBY", "refs", host.slice(0, 80), 1]);

    const post = path.match(/^\/blog\/([a-z0-9-]+)$/);
    if (post) cmds.push(["HINCRBY", "post:views", post[1], 1]);

    await kvPipeline(cmds);
    return NextResponse.json({ ok: true, tracked: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 502 });
  }
}
