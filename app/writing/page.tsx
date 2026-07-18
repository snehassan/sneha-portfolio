import Link from "next/link";
import type { Metadata } from "next";
import { getMediumArticles, MEDIUM_URL } from "@/lib/medium";

export const metadata: Metadata = { title: "Writing | Sneha Hassan" };

export default async function Writing() {
  const articles = await getMediumArticles();

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#fdf6ec",
        fontFamily: "var(--font-newsreader), serif",
        color: "#2a1f14",
      }}
    >
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "28px 24px 80px" }}>
        <Link href="/" className="back-link">
          ← sneha hassan
        </Link>
        <h1 style={{ fontSize: 56, fontWeight: 700, margin: "48px 0 8px" }}>
          Writing
        </h1>
        <p
          style={{
            fontStyle: "italic",
            fontSize: 20,
            color: "#8a7358",
            margin: "0 0 48px",
          }}
        >
          Essays and field notes, mostly about ML and building things. Pulled
          live from{" "}
          <a href={MEDIUM_URL} target="_blank" rel="noreferrer">
            Medium
          </a>
          .
        </p>

        {articles.length === 0 ? (
          <p style={{ fontSize: 18, color: "#5c4d3a" }}>
            Couldn&apos;t reach Medium just now. The full archive lives{" "}
            <a href={MEDIUM_URL} target="_blank" rel="noreferrer">
              here
            </a>
            .
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {articles.map((a) => (
              <a
                key={a.link}
                href={a.link}
                target="_blank"
                rel="noreferrer"
                className="article-row"
              >
                <div
                  className="mono"
                  style={{ fontSize: 12, color: "#8a7358", marginBottom: 8 }}
                >
                  {[a.date, a.readTime].filter(Boolean).join(" · ")}
                </div>
                <h2
                  style={{
                    fontSize: 28,
                    fontWeight: 600,
                    margin: "0 0 8px",
                    lineHeight: 1.25,
                  }}
                >
                  {a.title}
                </h2>
                {a.summary && (
                  <p
                    style={{
                      fontSize: 18,
                      lineHeight: 1.55,
                      color: "#5c4d3a",
                      margin: 0,
                    }}
                  >
                    {a.summary}
                  </p>
                )}
              </a>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
