import Link from "next/link";
import type { Metadata } from "next";
import { scribbles } from "@/data/scribbles";
import { ScribbleAdmin } from "./ScribbleAdmin";

export const metadata: Metadata = {
  title: "Edit scribbles | Sneha Hassan",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#eef4fb",
        fontFamily: "var(--font-space), sans-serif",
        color: "#16233a",
      }}
    >
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "28px 24px 80px" }}>
        <Link href="/scribbles" className="back-link">
          ← scribbles
        </Link>
        <h1
          style={{
            fontSize: 44,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            margin: "44px 0 8px",
          }}
        >
          Edit scribbles
        </h1>
        <p
          style={{
            fontSize: 18,
            color: "#4a5b78",
            margin: "0 0 36px",
            maxWidth: 560,
            lineHeight: 1.55,
          }}
        >
          Add, reorder, or delete links. Saving commits the file to GitHub and
          Vercel redeploys, so changes are live in about a minute.
        </p>

        <ScribbleAdmin initial={scribbles} />
      </div>
    </main>
  );
}
