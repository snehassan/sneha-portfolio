import Link from "next/link";
import type { Metadata } from "next";
import { CoffeeWord } from "@/components/CoffeeWord";

export const metadata: Metadata = { title: "About — Sneha Hassan" };

export default function About() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#fff2f6",
        fontFamily: "var(--font-space), sans-serif",
        color: "#2a1220",
      }}
    >
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "28px 24px 80px" }}>
        <Link href="/" className="back-link">
          ← sneha hassan
        </Link>
        <h1
          style={{
            fontSize: 52,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            margin: "48px 0 28px",
          }}
        >
          About
        </h1>

        <p style={{ fontSize: 19, lineHeight: 1.7, margin: "0 0 20px", textWrap: "pretty" }}>
          Fueled by curiosity and way too much <CoffeeWord />, I turn chaotic
          ideas into beautifully organized realities. I started in software at
          Ather Energy, building things riders actually touched — from ML
          pipelines watching the road to a treasure hunt spread across an entire
          city.
        </p>
        <p style={{ fontSize: 19, lineHeight: 1.7, margin: "0 0 20px", textWrap: "pretty" }}>
          Now at Carnegie Mellon, I spend my days asking language models hard
          biology questions and my evenings incubating a VR rehab startup. I care
          about products that teach, heal, or at minimum, don&apos;t annoy people.
        </p>
        <p style={{ fontSize: 19, lineHeight: 1.7, margin: "0 0 40px", textWrap: "pretty" }}>
          Off the clock: robots the size of a matchbox, writing on Medium, and
          being the designated funny person in serious meetings.
        </p>

        <div
          className="card"
          style={{
            border: "2px solid #2a1220",
            boxShadow: "6px 6px 0 #f5c3d8",
            padding: "24px 28px",
          }}
        >
          <div
            className="mono"
            style={{ fontSize: 13, color: "#c22a68", marginBottom: 10 }}
          >
            CURRENTLY
          </div>
          <ul style={{ fontSize: 17, lineHeight: 1.9, margin: 0, paddingLeft: 20 }}>
            <li>Researching LLM reasoning at CMU xulab</li>
            <li>Incubating RecoVR</li>
            <li>
              Open to interesting problems —{" "}
              <a href="mailto:snehahassan7920@gmail.com">say hi</a>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
