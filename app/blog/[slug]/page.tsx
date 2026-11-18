import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { getAllPosts, getPost } from "@/lib/blog";
import { fmtPostDate } from "@/lib/post";
import { renderMarkdown, readingMinutes } from "@/lib/markdown";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Blog | Sneha Hassan" };
  return {
    title: `${post.title} | Sneha Hassan`,
    description: post.summary || undefined,
    openGraph: { title: post.title, description: post.summary || undefined, type: "article" },
  };
}

export default async function PostPage({ params }: Params) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const all = getAllPosts();
  const idx = all.findIndex((p) => p.slug === post.slug);
  const newer = idx > 0 ? all[idx - 1] : undefined;
  const older = idx < all.length - 1 ? all[idx + 1] : undefined;

  return (
    <main className="page">
      <div className="shell">
        <header className="page-top">
          <Link href="/blog" className="back-link">
            ← blog
          </Link>
          <SiteNav />
        </header>
        <div className="eyebrow">
          {[fmtPostDate(post.date), `${readingMinutes(post.body)} MIN READ`].filter(Boolean).join(" · ")}
        </div>
        <h1 className="page-title">{post.title}</h1>
        {post.summary && <p className="lede">{post.summary}</p>}
        {post.tags.length > 0 && (
          <div className="post-tags" style={{ marginBottom: 28 }}>
            {post.tags.map((t) => (
              <span key={t}>#{t}</span>
            ))}
          </div>
        )}

        <article className="prose" dangerouslySetInnerHTML={{ __html: renderMarkdown(post.body) }} />

        {(newer || older) && (
          <nav className="post-pager" aria-label="More posts">
            {older ? (
              <Link href={`/blog/${older.slug}`}>
                <span className="mono">← OLDER</span>
                <em>{older.title}</em>
              </Link>
            ) : (
              <span />
            )}
            {newer && (
              <Link href={`/blog/${newer.slug}`} style={{ textAlign: "right" }}>
                <span className="mono">NEWER →</span>
                <em>{newer.title}</em>
              </Link>
            )}
          </nav>
        )}

        <SiteFooter />
      </div>
    </main>
  );
}
