import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Projects | Sneha Hassan" };

type Std = {
  title: string;
  tag: string;
  body: string;
  tags: string[];
  /** null when there's no public repo/writeup to link to yet */
  link: string | null;
  linkLabel: string;
  card: string;
  img: string;
  alt: string;
};

const standard: Std[] = [
  {
    title: "Socratic LLM Tutor",
    tag: "",
    body: "AI tutor that guides with tiered hints instead of answers. Flask + Redis sessions, Anthropic API, React frontend.",
    tags: ["Flask", "Redis", "React"],
    link: "https://github.com/snehassan/socratic-llm",
    linkLabel: "repo →",
    card: "card--blue",
    img: "/images/socratic.svg",
    alt: "Socratic LLM Tutor, pedagogical AI that guides with tiered hints",
  },
  {
    title: "Pothole Detection at Ather",
    tag: "",
    body: "ML pipeline detecting potholes from road sensor + camera data at 92% accuracy, deployed in Ather's vehicle data infrastructure.",
    tags: ["Python", "CV", "ML"],
    link: null,
    linkLabel: "",
    card: "card--peach",
    img: "/images/pothole.svg",
    alt: "Pothole detection pipeline built at Ather Energy",
  },
  {
    title: "RecoVR",
    tag: "",
    body: "VR assistive-therapy platform for physical rehabilitation, currently incubated at Carnegie Mellon University.",
    tags: ["Unity", "Blender", "Python"],
    link: "https://github.com/snehassan/RecoVR",
    linkLabel: "repo →",
    card: "card--mint",
    img: "/images/recovr.jpg",
    alt: "RecoVR in-headset view of a mobility rehabilitation task",
  },
  {
    title: "Daily OS",
    tag: "",
    body: "Recovery-aware daily scheduler that pulls your Whoop recovery score, HRV and wake time, then picks and time-shifts the right schedule for the day. Installable PWA with a full schedule editor.",
    tags: ["TypeScript", "Next.js", "Whoop API"],
    link: "https://github.com/snehassan/daily-os",
    linkLabel: "repo →",
    card: "card--lavender",
    img: "/images/daily-os.svg",
    alt: "Daily OS, recovery-aware scheduling driven by Whoop data",
  },
  {
    title: "YouJam",
    tag: "",
    body: "Chrome extension that keeps YouTube playback in sync across friends, Spotify-Jam style. Any participant can play, pause or seek and everyone follows. MV3 with Firebase Realtime Database.",
    tags: ["JavaScript", "Chrome MV3", "Firebase"],
    link: "https://github.com/snehassan/YouJam",
    linkLabel: "repo →",
    card: "card--peach",
    img: "/images/youjam.svg",
    alt: "YouJam, watching YouTube in sync with friends",
  },
  {
    title: "Zippy",
    tag: "",
    body: "Product research and feasibility for the world's smallest bipedal robot: sensitivity analysis, market research, technical viability.",
    tags: ["Product", "Robotics"],
    link: null,
    linkLabel: "",
    card: "card--pink",
    img: "/images/zippy2.jpg",
    alt: "Zippy, the world's smallest bipedal robot, beside a LEGO minifigure for scale",
  },
];

export default function Projects() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f4f1ff",
        fontFamily: "var(--font-space), sans-serif",
        color: "var(--ink)",
      }}
    >
      <div style={{ background: "#4b3af0", color: "#f4f1ff" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "28px 24px 56px" }}>
          <Link href="/" className="back-link">
            ← sneha hassan
          </Link>
          <h1
            style={{
              fontSize: 52,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              margin: "44px 0 12px",
            }}
          >
            Projects
          </h1>
          <p
            style={{
              fontSize: 18,
              color: "#d8d3ff",
              margin: 0,
              maxWidth: 560,
              lineHeight: 1.55,
            }}
          >
            Research, production ML, and a few things that beep. Favorites below,
            plus the archive.
          </p>
        </div>
      </div>

      <div
        style={{
          maxWidth: 860,
          margin: "0 auto",
          padding: "48px 24px 80px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))",
          gap: 24,
        }}
      >
        {/* Featured */}
        <article className="card card--lavender" style={{ gridColumn: "1/-1" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="card-img"
            src="/images/biosemantic.svg"
            alt="BioSemantic Bridge, multi-agent LLM benchmarking for biology at CMU xulab"
            style={{ height: 240 }}
          />
          <div style={{ padding: "28px 32px 32px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                gap: 16,
                flexWrap: "wrap",
              }}
            >
              <h2 style={{ fontSize: 26, margin: 0 }}>BioSemantic Bridge</h2>
              <span
                className="mono"
                style={{
                  fontSize: 12,
                  background: "var(--chip)",
                  border: "1px solid var(--chip-border)",
                  padding: "3px 10px",
                }}
              >
                RESEARCH · CMU xulab
              </span>
            </div>
            <p
              style={{
                fontSize: 17,
                lineHeight: 1.6,
                color: "#3a3a35",
                margin: "14px 0 18px",
              }}
            >
              Benchmarking bio-domain LLMs on BixBench (205 questions) with a
              multi-agent ensemble decoder architecture, supervised by Runmin
              Jiang at CMU&apos;s xulab.
            </p>
            <div
              className="mono"
              style={{
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
                fontSize: 13,
                alignItems: "center",
              }}
            >
              <span className="tag">Python</span>
              <span className="tag">LLMs</span>
              <span className="tag">Bioinformatics</span>
              <a
                href="https://github.com/snehassan/bioexpert"
                target="_blank"
                rel="noreferrer"
                style={{ marginLeft: "auto" }}
              >
                repo →
              </a>
            </div>
          </div>
        </article>

        {/* Standard cards */}
        {standard.map((p) => (
          <article key={p.title} className={`card ${p.card}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="card-img"
              src={p.img}
              alt={p.alt}
              style={{ height: 170 }}
            />
            <div style={{ padding: "24px 28px 28px" }}>
              <h2 style={{ fontSize: 22, margin: 0 }}>{p.title}</h2>
              <p
                style={{
                  fontSize: 16,
                  lineHeight: 1.6,
                  color: "#3a3a35",
                  margin: "12px 0 16px",
                }}
              >
                {p.body}
              </p>
              <div
                className="mono"
                style={{
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                  fontSize: 12,
                  alignItems: "center",
                }}
              >
                {p.tags.map((t) => (
                  <span
                    key={t}
                    style={{ border: "1px solid var(--ink)", padding: "2px 8px" }}
                  >
                    {t}
                  </span>
                ))}
                {p.link && (
                  <a
                    href={p.link}
                    target="_blank"
                    rel="noreferrer"
                    style={{ marginLeft: "auto" }}
                  >
                    {p.linkLabel}
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}

        {/* Archive */}
        <article
          className="card card--gray"
          style={{ padding: "24px 28px 28px" }}
        >
          <h2 style={{ fontSize: 22, margin: 0 }}>Archive</h2>
          <ul
            style={{
              fontSize: 16,
              lineHeight: 1.9,
              color: "#3a3a35",
              margin: "12px 0 0",
              paddingLeft: 20,
            }}
          >
            <li>
              <strong>Ather Unlocked</strong>: city-wide treasure-hunt PWA for
              riders
            </li>
            <li>
              <strong>Ride Stories</strong>: ride details + EV community stats
            </li>
            <li>
              <strong>Sheetz Cooler Optimization</strong>: confidential CV
              restocking system
            </li>
          </ul>
        </article>
      </div>
    </main>
  );
}
