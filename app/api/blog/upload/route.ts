import { NextResponse } from "next/server";
import { createHash, timingSafeEqual } from "crypto";

/**
 * Uploads an image for a blog post by committing it to
 * public/images/blog/<file> on GitHub. It's served at /images/blog/<file>
 * once Vercel redeploys (about a minute).
 *
 * POST { password, name, type, data (base64, no data: prefix), slug? }
 * The editor shrinks images in the browser first, so they stay small.
 */

const DIR = "public/images/blog";
const DEFAULT_REPO = "snehassan/sneha-portfolio";
const TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif" };
const MAX_BYTES = 3 * 1024 * 1024;

function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

const clean = (s: string) =>
  s
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40) || "image";

export async function POST(req: Request) {
  const password = process.env.ADMIN_PASSWORD;
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO || DEFAULT_REPO;
  if (!password || !token) return NextResponse.json({ error: "Server not configured." }, { status: 500 });

  let body: { password?: string; name?: string; type?: string; data?: string; slug?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "That image is too big to send. Try a smaller one." }, { status: 400 });
  }
  if (!body.password || !safeEqual(body.password, password)) return NextResponse.json({ error: "Wrong password." }, { status: 401 });

  const ext = TYPES[body.type || ""];
  if (!ext) return NextResponse.json({ error: "Use a JPG, PNG, WebP or GIF image." }, { status: 400 });
  if (typeof body.data !== "string" || !/^[A-Za-z0-9+/=]+$/.test(body.data)) return NextResponse.json({ error: "Bad image data." }, { status: 400 });

  const bytes = Buffer.from(body.data, "base64");
  if (bytes.length === 0 || bytes.length > MAX_BYTES) return NextResponse.json({ error: "Images must be under 3 MB." }, { status: 400 });

  const hash = createHash("sha1").update(bytes).digest("hex").slice(0, 8);
  const prefix = body.slug && /^[a-z0-9-]{1,60}$/.test(body.slug) ? body.slug.slice(0, 40) + "-" : "";
  const file = `${prefix}${clean(body.name || "image")}-${hash}.${ext}`;
  const url = `/images/blog/${file}`;

  const gh = { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json", "Content-Type": "application/json" };
  const api = `https://api.github.com/repos/${repo}/contents/${DIR}/${file}`;

  try {
    // Same bytes give the same name, so re-uploading is a no-op.
    const exists = await fetch(api, { headers: gh, cache: "no-store" });
    if (exists.ok) return NextResponse.json({ ok: true, url, message: "Already uploaded." });

    const put = await fetch(api, {
      method: "PUT",
      headers: gh,
      body: JSON.stringify({ message: `Blog: add image ${file}`, content: body.data }),
    });
    if (!put.ok) {
      return NextResponse.json({ error: `GitHub rejected the image (${put.status}). ${(await put.text()).slice(0, 160)}` }, { status: 502 });
    }
    return NextResponse.json({ ok: true, url, message: "Uploaded. It shows on the live site after the next rebuild (about a minute)." });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}
