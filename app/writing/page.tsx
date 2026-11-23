import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { getMediumArticles, MEDIUM_URL } from "@/lib/medium";
import { importedFromMedium } from "@/lib/blog";

export const metadata: Metadata = pageMeta({
  title: "Writing | Sneha Hassan",
  description:
    "Essays by Sneha Hassan on ML, software and building things, from Medium and the blog.",
  path: "/writing",
});

export default async function Writing() {
  const all = await getMediumArticles();
  const onBlog = importedFromMedium();
  // Anything already copied to the blog is shown there, not here.
  const articles = all.filter((a) => !onBlog(a.link, a.title));
  const moved = all.length - articles.length;

  return (
    <PageShell
      eyebrow={articles.length ? `${articles.length} essays · live from Medium` : "essays · live from Medium"}
      title="Writing"
      lede={
        <>
          Essays and field notes, mostly about ML and building things. Pulled live
          from{" "}
          <a href={MEDIUM_URL} target="_blank" rel="noreferrer">
            Medium
          </a>
          . New posts now go up on the <Link href="/blog">blog</Link>, right here on the site.
        </>
      }
    >
      {moved > 0 && (
        <p className="body-copy" style={{ margin: "0 0 18px" }}>
          {articles.length === 0 ? "Every essay from Medium" : moved === 1 ? "One essay from Medium" : `${moved} essays from Medium`} now{" "}
          {articles.length > 0 && moved === 1 ? "lives" : "live"} on the{" "}
          <Link href="/blog">blog</Link>.
        </p>
      )}
      {articles.length === 0 && moved > 0 ? null : articles.length === 0 ? (
        <p className="body-copy">
          Couldn&apos;t reach Medium just now. The full archive lives{" "}
          <a href={MEDIUM_URL} target="_blank" rel="noreferrer">
            here
          </a>
          .
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column" }}>
          {articles.map((a, i) => (
            <a key={a.link} href={a.link} target="_blank" rel="noreferrer" className="article-row">
              <div className="row-meta">
                {i === 0 && <span className="pill">LATEST</span>}
                <span>{[a.date, a.readTime].filter(Boolean).join(" · ")}</span>
              </div>
              <h2 className="row-title">{a.title}</h2>
              {a.summary && <p className="row-text">{a.summary}</p>}
            </a>
          ))}
        </div>
      )}
    </PageShell>
  );
}
