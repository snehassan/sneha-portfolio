import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { getAllPosts } from "@/lib/blog";
import { fmtPostDate } from "@/lib/post";
import { readingMinutes } from "@/lib/markdown";
import { PostListStats } from "@/components/PostEngagement";

export const metadata: Metadata = {
  ...pageMeta({
    title: "Blog | Sneha Hassan",
    description: "Sneha Hassan's blog: hands-on notes on ML, LLMs, software, DevOps and design, from deploying Juju charms to why UPI beats government websites.",
    path: "/blog",
  }),
};
// RSS link for feed readers is declared in the root layout.

export default function Blog() {
  const posts = getAllPosts();

  return (
    <PageShell
      eyebrow={posts.length ? `${posts.length} post${posts.length === 1 ? "" : "s"} · written here` : "written here"}
      title="Blog"
      lede={
        <>
          Notes on what I&apos;m building, reading and breaking, published straight to this site. Older essays are on the{" "}
          <Link href="/writing">writing page</Link>.
        </>
      }
    >
      {posts.length === 0 ? (
        <div className="card card--peach" style={{ padding: "22px 26px" }}>
          <p className="mono" style={{ margin: 0, fontSize: 13 }}>
            FIRST POST LOADING<span className="blink">_</span>
          </p>
          <p className="body-copy" style={{ margin: "10px 0 0" }}>
            Nothing here yet. In the meantime, the <Link href="/writing">writing page</Link> has the older stuff.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column" }}>
          {posts.map((p, i) => (
            <Link key={p.slug} href={`/blog/${p.slug}`} className="article-row">
              <div className="row-meta">
                {i === 0 && <span className="pill">LATEST</span>}
                <span>
                  {[fmtPostDate(p.date), `${readingMinutes(p.body)} MIN`].filter(Boolean).join(" · ")}
                  <span data-post-stats={p.slug} />
                </span>
              </div>
              <h2 className="row-title">{p.title}</h2>
              {p.summary && <p className="row-text">{p.summary}</p>}
              {p.tags.length > 0 && (
                <div className="post-tags">
                  {p.tags.map((t) => (
                    <span key={t}>#{t}</span>
                  ))}
                </div>
              )}
            </Link>
          ))}
          <PostListStats slugs={posts.map((p) => p.slug)} />
        </div>
      )}
    </PageShell>
  );
}
