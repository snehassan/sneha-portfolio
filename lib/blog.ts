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

/** Is this Medium article already on the blog? (matched by URL, then title) */
export function importedFromMedium(posts: Post[] = getAllPosts({ includeDrafts: true })) {
  const urls = new Set(posts.map((p) => p.medium).filter(Boolean) as string[]);
  const titles = new Set(posts.map((p) => p.title.trim().toLowerCase()));
  return (link: string, title: string) => urls.has(link.split("?")[0]) || titles.has(title.trim().toLowerCase());
}

export function getPost(slug: string): Post | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}
