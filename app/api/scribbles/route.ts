import { NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";

/**
 * Saves the scribbles list by committing data/scribbles.json back to GitHub.
 * Vercel sees the push and redeploys, so the change goes live in ~40s.
 *
 * Required environment variables (set these in Vercel → Settings → Environment Variables):
 *   ADMIN_PASSWORD  the password you type in the admin UI
 *   GITHUB_TOKEN    a fine-grained PAT with Contents: Read and write on this repo only
 *   GITHUB_REPO     "snehassan/sneha-portfolio" (optional, this is the default)
 */

const FILE_PATH = "data/scribbles.json";
const DEFAULT_REPO = "snehassan/sneha-portfolio";

type Scribble = {
  title: string;
  url: string;
  tag: string;
  note: string;
  date: string;
};

function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

function isValid(list: unknown): list is Scribble[] {
  if (!Array.isArray(list)) return false;
  return list.every(
    (s) =>
      s &&
      typeof s === "object" &&
      typeof (s as Scribble).title === "string" &&
      typeof (s as Scribble).url === "string" &&
      typeof (s as Scribble).tag === "string" &&
      typeof (s as Scribble).note === "string" &&
      typeof (s as Scribble).date === "string",
  );
}

export async function POST(req: Request) {
  const password = process.env.ADMIN_PASSWORD;
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO || DEFAULT_REPO;

  if (!password || !token) {
    return NextResponse.json(
      {
        error:
          "Server not configured. Set ADMIN_PASSWORD and GITHUB_TOKEN in your Vercel environment variables.",
      },
      { status: 500 },
    );
  }

  let body: { password?: string; scribbles?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!body.password || !safeEqual(body.password, password)) {
    return NextResponse.json({ error: "Wrong password." }, { status: 401 });
  }

  if (!isValid(body.scribbles)) {
    return NextResponse.json(
      { error: "Each scribble needs title, url, tag, note and date." },
      { status: 400 },
    );
  }

  const gh = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json",
  };

  try {
    // Look up the current file SHA (required by the GitHub contents API to update).
    const cur = await fetch(
      `https://api.github.com/repos/${repo}/contents/${FILE_PATH}`,
      { headers: gh, cache: "no-store" },
    );
    if (!cur.ok) {
      const detail = await cur.text();
      return NextResponse.json(
        { error: `Could not read ${FILE_PATH} from GitHub (${cur.status}). ${detail.slice(0, 200)}` },
        { status: 502 },
      );
    }
    const { sha } = (await cur.json()) as { sha: string };

    const contents = JSON.stringify(body.scribbles, null, 2) + "\n";

    const put = await fetch(
      `https://api.github.com/repos/${repo}/contents/${FILE_PATH}`,
      {
        method: "PUT",
        headers: gh,
        body: JSON.stringify({
          message: "Update scribbles from admin UI",
          content: Buffer.from(contents, "utf8").toString("base64"),
          sha,
        }),
      },
    );

    if (!put.ok) {
      const detail = await put.text();
      return NextResponse.json(
        { error: `GitHub rejected the commit (${put.status}). ${detail.slice(0, 200)}` },
        { status: 502 },
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Saved. Vercel is rebuilding, live in about a minute.",
    });
  } catch (e) {
    return NextResponse.json(
      { error: `Unexpected error: ${e instanceof Error ? e.message : String(e)}` },
      { status: 500 },
    );
  }
}
