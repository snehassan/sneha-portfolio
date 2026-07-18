import Link from "next/link";
import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { scribbles } from "@/data/scribbles";

export const metadata: Metadata = { title: "Scribbles — Sneha Hassan" };

// theme the shared .article-row rules/hover for this page
const themeVars = {
  "--rule-writing": "#d3e2f2",
  "--writing-hover": "#e4eefa",
} as CSSProperties;

export default function Scribbles() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#eef4fb",
        fontFamily: "var(--font-space), sans-serif",
        color: "#16233a",
        ...themeVars,
      }}
    >
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "28px 24px 80px" }}>
        <Link href="/" className="back-link">
          ← sneha hassan
        </Link>
        <h1
          style={{
            fontSize: 52,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            margin: "48px 0 8px",
          }}
        >
          Scribbles
        </h1>
        <p style={{ fontSize: 19, color: "#4a5b78", margin: "0 0 44px", maxWidth: 560, lineHeight: 1.55 }}>
          Links I&apos;m into — papers, tools, videos, and rabbit holes, with a
          one-line note on why. Updated whenever something sticks.
        </p>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {scribbles.map((s) => (
            <a
              key={s.url}
              href={s.url}
              target="_blank"
              rel="noreferrer"
              className="article-row"
            >
              <div
                className="mono"
                style={{
                  fontSize: 12,
                  color: "#5f74a0",
                  marginBottom: 8,
                  display: "flex",
                  gap: 10,
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    border: "1px solid #b9cde6",
                    background: "#dbe8f7",
                    padding: "2px 8px",
                    color: "#2c4a78",
                  }}
                >
                  {s.tag}
                </span>
                <span style={{ color: "#7d8ba6" }}>{s.date}</span>
              </div>
              <h2
                style={{
                  fontSize: 24,
                  fontWeight: 600,
                  margin: "0 0 6px",
                  lineHeight: 1.3,
                }}
              >
                {s.title}
              </h2>
              <p
                style={{
                  fontSize: 17,
                  lineHeight: 1.55,
                  color: "#4a5b78",
                  margin: 0,
                }}
              >
                {s.note}
              </p>
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}
