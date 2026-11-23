import type { Metadata } from "next";
import { pageMeta, jsonLd, SITE_URL } from "@/lib/seo";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { getAllPosts, getPost } from "@/lib/blog";
import { fmtPostDate } from "@/lib/post";
import { renderMarkdown, readingMinutes } from "@/lib/markdown";
import { PostEngagement } from "@/components/PostEngagement";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Blog | Sneha Hassan" };
  return pageMeta({
    title: `${post.title} | Sneha Hassan`,
    description: post.summary || `${post.title}, a post by Sneha Hassan.`,
    path: `/blog/${post.slug}`,
    image: `/blog/${post.slug}/opengraph-image`,
    type: "article",
    publishedTime: post.date,
    tags: post.tags,
  });
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

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLd({
              "@type": "BlogPosting",
              headline: post.title,
              description: post.summary,
              datePublished: post.date,
              dateModified: post.date,
              url: `${SITE_URL}/blog/${post.slug}`,
              mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
              image: `${SITE_URL}/blog/${post.slug}/opengraph-image`,
              keywords: post.tags.join(", "),
              wordCount: post.body.split(/\s+/).filter(Boolean).length,
              author: { "@type": "Person", "@id": `${SITE_URL}/#person`, name: "Sneha Hassan", url: SITE_URL },
              publisher: { "@type": "Person", "@id": `${SITE_URL}/#person`, name: "Sneha Hassan" },
              ...(post.medium ? { isBasedOn: post.medium } : {}),
            }),
          }}
        />
        <article className="prose" dangerouslySetInnerHTML={{ __html: renderMarkdown(post.body) }} />

        <PostEngagement slug={post.slug} />

        {post.medium && (
          <p className="mono" style={{ fontSize: 12, color: "var(--muted)", marginTop: 36 }}>
            Originally published on{" "}
            <a href={post.medium} target="_blank" rel="noreferrer">
              Medium
            </a>
            .
          </p>
        )}

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
