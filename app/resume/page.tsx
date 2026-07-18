import Link from "next/link";
import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { resumes } from "@/data/resumes";

export const metadata: Metadata = { title: "Resume | Sneha Hassan" };

const themeVars = {
  "--rule-writing": "#e0dcd0",
  "--writing-hover": "#f3efe4",
} as CSSProperties;

export default function ResumePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#faf8f2",
        fontFamily: "var(--font-space), sans-serif",
        color: "#20201c",
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
          Resume
        </h1>
        <p
          style={{
            fontSize: 19,
            color: "#5c5a4f",
            margin: "0 0 44px",
            maxWidth: 560,
            lineHeight: 1.55,
          }}
        >
          Same experience, framed for different kinds of roles. Grab whichever
          fits the conversation.
        </p>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {resumes.map((r) => (
            <a
              key={r.file}
              href={r.file}
              target="_blank"
              rel="noreferrer"
              className="article-row"
            >
              <div
                className="mono"
                style={{
                  fontSize: 12,
                  marginBottom: 8,
                  display: "flex",
                  gap: 10,
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    border: "1px solid #d6d1bf",
                    background: "#efebdd",
                    padding: "2px 8px",
                    color: "#6b6857",
                  }}
                >
                  PDF
                </span>
                {r.primary && (
                  <span style={{ color: "#8a8674" }}>DEFAULT</span>
                )}
              </div>
              <h2
                style={{
                  fontSize: 24,
                  fontWeight: 600,
                  margin: "0 0 6px",
                  lineHeight: 1.3,
                }}
              >
                {r.role}
              </h2>
              <p
                style={{
                  fontSize: 17,
                  lineHeight: 1.55,
                  color: "#5c5a4f",
                  margin: 0,
                }}
              >
                {r.blurb}
              </p>
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}
