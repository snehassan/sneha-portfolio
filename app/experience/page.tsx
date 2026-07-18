import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Experience — Sneha Hassan" };

const stack = [
  "Python", "PyTorch", "LLMs / RAG", "OpenCV",
  "React", "Flask", "Redis", "Firebase",
];

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
          <Marker />
          <div style={{ paddingBottom: 44 }}>
            <div
              className="mono"
              style={{ fontSize: 13, color: "#cdbaf0", marginBottom: 6 }}
            >
              2024 — PRESENT · PITTSBURGH
            </div>
            <h2 style={{ fontSize: 24, margin: "0 0 10px" }}>
              Carnegie Mellon University — Graduate Researcher
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.65, color: "#b9c6d8", margin: 0 }}>
              LLM benchmarking for biological reasoning at xulab; RecoVR
              incubation; product research for Zippy, the world&apos;s smallest
              bipedal robot; CV capstone with Sheetz.
            </p>
          </div>

          <Marker />
          <div style={{ paddingBottom: 44 }}>
            <div
              className="mono"
              style={{ fontSize: 13, color: "#cdbaf0", marginBottom: 6 }}
            >
              2021 — 2024 · BANGALORE
            </div>
            <h2 style={{ fontSize: 24, margin: "0 0 10px" }}>
              Ather Energy — Software Engineer
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.65, color: "#b9c6d8", margin: 0 }}>
              Shipped ML and product on real electric scooters: pothole detection
              (92% accuracy) in the vehicle data stack, Ride Stories community
              app, and Ather Unlocked — a city-wide treasure-hunt PWA.
            </p>
          </div>
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
