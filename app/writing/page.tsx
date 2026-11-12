import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { getMediumArticles, MEDIUM_URL } from "@/lib/medium";

export const metadata: Metadata = { title: "Writing | Sneha Hassan" };

export default async function Writing() {
  const articles = await getMediumArticles();

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
          .
        </>
      }
    >
      {articles.length === 0 ? (
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
