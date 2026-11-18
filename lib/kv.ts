import { createHash } from "crypto";

/**
 * Tiny Redis client over Upstash's REST API (no package needed).
 * Connect "Upstash for Redis" to the project in Vercel's Storage tab and it
 * sets KV_REST_API_URL + KV_REST_API_TOKEN (or UPSTASH_REDIS_REST_*).
 * Without them every call is a no-op and counters simply stay hidden.
 */

const URL_ = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || "";
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || "";

export const kvEnabled = () => Boolean(URL_ && TOKEN);

type Cmd = (string | number)[];

export async function kvPipeline(cmds: Cmd[]): Promise<unknown[] | null> {
  if (!kvEnabled() || cmds.length === 0) return null;
  const res = await fetch(`${URL_}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(cmds.map((c) => c.map(String))),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Redis ${res.status}`);
  const out = (await res.json()) as { result?: unknown; error?: string }[];
  return out.map((r) => (r.error ? null : r.result));
}

export async function kv(cmd: Cmd) {
  const r = await kvPipeline([cmd]);
  return r ? r[0] : null;
}

/** Redis HGETALL comes back as [k1, v1, k2, v2...]; turn it into numbers. */
export function hashToCounts(v: unknown): Record<string, number> {
  const out: Record<string, number> = {};
  if (!Array.isArray(v)) return out;
  for (let i = 0; i + 1 < v.length; i += 2) out[String(v[i])] = Number(v[i + 1]) || 0;
  return out;
}

/** Anonymous visitor id: a salted hash of IP + browser. Raw IPs are never stored. */
export function visitorId(req: Request) {
  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || req.headers.get("x-real-ip") || "?";
  const ua = req.headers.get("user-agent") || "";
  const salt = process.env.STATS_SALT || process.env.ADMIN_PASSWORD || "sneha";
  return createHash("sha256").update(`${salt}|${ip}|${ua}`).digest("hex").slice(0, 24);
}

export function isBot(req: Request) {
  const ua = req.headers.get("user-agent") || "";
  return !ua || /bot|crawl|spider|slurp|preview|headless|lighthouse|vercel|monitor|curl|wget|python|axios|node-fetch/i.test(ua);
}

/** YYYY-MM-DD in India time, so "today" matches Sneha's day. */
export function dayKey(d = new Date()) {
  return new Date(d.getTime() + 5.5 * 3600_000).toISOString().slice(0, 10);
}

export const MAX_CLAPS = 50; // per visitor per post, like Medium
