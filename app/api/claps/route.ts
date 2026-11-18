import { NextResponse } from "next/server";
import { hashToCounts, isBot, kv, kvEnabled, kvPipeline, MAX_CLAPS, visitorId } from "@/lib/kv";

/**
 * Claps and reads, Medium style.
 *   GET  /api/claps?slug=x  -> { enabled, claps, reads, mine }
 *   GET  /api/claps         -> { enabled, claps: {slug: n}, reads: {slug: n} }  (for the blog list)
 *   POST { slug, count }    -> adds up to `count` claps; each visitor can give 50 per post.
 */

const SLUG = /^[a-z0-9-]{1,90}$/;

export async function GET(req: Request) {
  if (!kvEnabled()) return NextResponse.json({ enabled: false });
  const slug = new URL(req.url).searchParams.get("slug");
  try {
    if (slug) {
      if (!SLUG.test(slug)) return NextResponse.json({ error: "bad slug" }, { status: 400 });
      const r = await kvPipeline([
        ["HGET", "post:claps", slug],
        ["HGET", "post:reads", slug],
        ["HGET", `claps:by:${slug}`, visitorId(req)],
      ]);
      return NextResponse.json(
        { enabled: true, claps: Number(r?.[0]) || 0, reads: Number(r?.[1]) || 0, mine: Number(r?.[2]) || 0, max: MAX_CLAPS },
        { headers: { "Cache-Control": "no-store" } },
      );
    }
    const r = await kvPipeline([["HGETALL", "post:claps"], ["HGETALL", "post:reads"]]);
    return NextResponse.json(
      { enabled: true, claps: hashToCounts(r?.[0]), reads: hashToCounts(r?.[1]) },
      { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } },
    );
  } catch {
    return NextResponse.json({ enabled: false });
  }
}

export async function POST(req: Request) {
  if (!kvEnabled()) return NextResponse.json({ enabled: false });
  if (isBot(req)) return NextResponse.json({ error: "no" }, { status: 403 });

  let body: { slug?: string; count?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }
  const slug = body.slug || "";
  const want = Math.floor(Number(body.count) || 0);
  if (!SLUG.test(slug) || want < 1) return NextResponse.json({ error: "bad request" }, { status: 400 });

  const id = visitorId(req);
  try {
    const mine = Number(await kv(["HGET", `claps:by:${slug}`, id])) || 0;
    const add = Math.max(0, Math.min(want, MAX_CLAPS - mine));
    let total: number;
    if (add > 0) {
      const r = await kvPipeline([
        ["HINCRBY", `claps:by:${slug}`, id, add],
        ["HINCRBY", "post:claps", slug, add],
      ]);
      total = Number(r?.[1]) || 0;
    } else {
      total = Number(await kv(["HGET", "post:claps", slug])) || 0;
    }
    return NextResponse.json({ enabled: true, claps: total, mine: mine + add, max: MAX_CLAPS });
  } catch {
    return NextResponse.json({ error: "store unavailable" }, { status: 502 });
  }
}
