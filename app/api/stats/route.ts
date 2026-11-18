import { NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { dayKey, hashToCounts, kvEnabled, kvPipeline } from "@/lib/kv";

/** Private stats for /stats. POST { password, days?: number } */

function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

export async function POST(req: Request) {
  const password = process.env.ADMIN_PASSWORD;
  let body: { password?: string; days?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  if (!password || !body.password || !safeEqual(body.password, password)) {
    return NextResponse.json({ error: "Wrong password." }, { status: 401 });
  }
  if (!kvEnabled()) return NextResponse.json({ enabled: false });

  const n = Math.min(90, Math.max(7, Math.floor(Number(body.days) || 30)));
  const days: string[] = [];
  const now = Date.now();
  for (let i = n - 1; i >= 0; i--) days.push(dayKey(new Date(now - i * 86400_000)));

  try {
    const r = await kvPipeline([
      ["GET", "views:total"],
      ["PFCOUNT", "uv:all"],
      ["HGETALL", "views:path"],
      ["HGETALL", "refs"],
      ["HGETALL", "post:views"],
      ["HGETALL", "post:reads"],
      ["HGETALL", "post:claps"],
      ["HMGET", "views:day", ...days],
      ...days.map((d) => ["PFCOUNT", `uv:${d}`]),
      ["PFCOUNT", ...days.map((d) => `uv:${d}`)],
    ]);
    if (!r) return NextResponse.json({ enabled: false });
    const dayViews = (r[7] as (string | null)[]) || [];
    const series = days.map((d, i) => ({ day: d, views: Number(dayViews[i]) || 0, visitors: Number(r[8 + i]) || 0 }));
    const sortDesc = (o: Record<string, number>) =>
      Object.entries(o)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 25);
    return NextResponse.json({
      enabled: true,
      totalViews: Number(r[0]) || 0,
      totalVisitors: Number(r[1]) || 0,
      periodVisitors: Number(r[8 + days.length]) || 0,
      series,
      pages: sortDesc(hashToCounts(r[2])),
      referrers: sortDesc(hashToCounts(r[3])),
      posts: { views: hashToCounts(r[4]), reads: hashToCounts(r[5]), claps: hashToCounts(r[6]) },
    });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 502 });
  }
}
