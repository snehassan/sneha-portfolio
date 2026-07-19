import { Fragment } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { jobs, stack } from "@/data/experience";

export const metadata: Metadata = { title: "Experience | Sneha Hassan" };


function Marker() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ width: 14, height: 14, flex: "none", background: "#cdbaf0" }} />
      <div style={{ width: 2, flex: 1, background: "#2a3c56" }} />
    </div>
  );
}

export default function Experience() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0f1b2d",
        color: "#e8eef7",
        fontFamily: "var(--font-space), sans-serif",
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
            margin: "48px 0 44px",
          }}
        >
          Experience
        </h1>

        <div style={{ display: "grid", gridTemplateColumns: "24px 1fr", gap: 24 }}>
          {jobs.map((job) => (
            <Fragment key={job.org + job.period}>
              <Marker />
              <div style={{ paddingBottom: 44 }}>
                <div
                  className="mono"
                  style={{ fontSize: 13, color: "#cdbaf0", marginBottom: 6 }}
                >
                  {job.period}
                </div>
                <h2 style={{ fontSize: 24, margin: "0 0 2px" }}>{job.org}</h2>
                <div
                  style={{
                    fontSize: 17,
                    fontStyle: "italic",
                    color: "#8fa3bf",
                    marginBottom: 12,
                  }}
                >
                  {job.role}
                </div>
                <ul
                  style={{
                    fontSize: 16,
                    lineHeight: 1.65,
                    color: "#b9c6d8",
                    margin: 0,
                    paddingLeft: 20,
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  {job.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>
            </Fragment>
          ))}
        </div>

        <div style={{ border: "1px solid #2a3c56", padding: "24px 28px" }}>
          <div
            className="mono"
            style={{ fontSize: 13, color: "#cdbaf0", marginBottom: 12 }}
          >
            STACK OF CHOICE
          </div>
          <div
            className="mono"
            style={{ display: "flex", gap: 10, flexWrap: "wrap", fontSize: 13 }}
          >
            {stack.map((s) => (
              <span key={s} style={{ border: "1px solid #3a5578", padding: "4px 12px" }}>
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
