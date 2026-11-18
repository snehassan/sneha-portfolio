import fs from "fs";
import path from "path";
import { fromFile, type Post } from "@/lib/post";

/**
 * Blog posts live as markdown files in content/blog/<slug>.md.
 * They're read at build time, so a new post is live after Vercel redeploys.
 */
const DIR = path.join(process.cwd(), "content", "blog");

export function getAllPosts({ includeDrafts = false } = {}): Post[] {
  let files: string[] = [];
  try {
    files = fs.readdirSync(DIR).filter((f) => f.endsWith(".md"));
  } catch {
    return [];
  }
  return files
    .map((f) => fromFile(f.replace(/\.md$/, ""), fs.readFileSync(path.join(DIR, f), "utf8")))
    .filter((p) => includeDrafts || !p.draft)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.title.localeCompare(b.title)));
}

export function getPost(slug: string): Post | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}
