import Link from "next/link";
import type { Metadata } from "next";
import { BlockyFlight } from "@/components/BlockyFlight";

export const metadata: Metadata = { title: "Blocky Flight — Sneha Hassan" };

export default function Game() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#8fd3ff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "28px 24px 60px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 520,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <Link
          href="/"
          style={{ fontFamily: "var(--font-pixel), monospace", fontSize: 11 }}
        >
          ← BACK
        </Link>
        <div
          style={{
            fontFamily: "var(--font-pixel), monospace",
            fontSize: 11,
            color: "#0e4423",
          }}
        >
          SECRET FOUND!
        </div>
      </div>

      <div
        style={{
          fontFamily: "var(--font-pixel), monospace",
          fontSize: 18,
          color: "#123c22",
          marginBottom: 6,
          textAlign: "center",
          lineHeight: 1.6,
        }}
      >
        BLOCKY FLIGHT
      </div>
      <div
        style={{
          fontFamily: "var(--font-pixel), monospace",
          fontSize: 9,
          color: "#2c5a3c",
          marginBottom: 20,
          textAlign: "center",
        }}
      >
        SPACE / TAP TO FLAP
      </div>

      <BlockyFlight />

      <div
        style={{
          fontFamily: "var(--font-pixel), monospace",
          fontSize: 8,
          color: "#2c5a3c",
          marginTop: 18,
        }}
      >
        achievement unlocked: reads footers carefully
      </div>
    </main>
  );
}
