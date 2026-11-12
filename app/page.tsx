import Link from "next/link";
import { NameHeading } from "@/components/NameHeading";
import { SiteFooter } from "@/components/SiteFooter";
import { TrainWord } from "@/components/TrainWord";
import { getMediumArticles, MEDIUM_URL } from "@/lib/medium";
import { primaryResume } from "@/data/resumes";

const work = [
  {
    name: "BioSemantic Bridge",
    blurb: "benchmarking bio-domain LLMs with a multi-agent ensemble decoder",
    img: "/images/biosemantic.svg",
  },
  {
    name: "Socratic LLM Tutor",
    blurb: "pedagogical AI that guides with tiered hints",
    img: "/images/socratic.svg",
  },
  {
    name: "Pothole Detection",
    blurb: "accelerometer ML deployed across Ather's rider base",
    img: "/images/pothole.svg",
  },
  {
    name: "RecoVR",
    blurb: "VR assistive therapy, incubated at CMU",
    img: "/images/recovr.jpg",
  },
];

// Fallback writing list if the Medium feed is unreachable at build time.
const fallbackWriting = [
  "What benchmarking bio-LLMs taught me about asking questions",
  "Teaching an AI to not give the answer",
  "Potholes, scooters, and 92% accuracy",
];

export default async function Home() {
  const articles = await getMediumArticles(3);

  return (
    <main
      style={{
        maxWidth: 660,
        margin: "0 auto",
        padding: "72px 24px 48px",
        fontFamily: "var(--font-newsreader), serif",
        color: "var(--ink)",
        fontSize: 19,
        lineHeight: 1.65,
      }}
    >
      <NameHeading />

      <p style={{ margin: "0 0 20px", textWrap: "pretty" }}>
        I&apos;m a software and AI/ML engineer. I build systems that <TrainWord />: most
        recently benchmarking large language models on biological reasoning at
        Carnegie Mellon&apos;s xulab, and before that shipping production ML on
        electric scooters at Ather Energy, where a pothole-detection model I
        built reached 92% accuracy on real roads.
      </p>
      <p style={{ margin: "0 0 20px", textWrap: "pretty" }}>
        I like problems with weird shapes:{" "}
        <Link href="/projects">an AI tutor that refuses to give answers</Link>, a
        VR rehab platform, the world&apos;s smallest bipedal robot. Equal parts
        tech nerd and people person; I turn chaotic ideas into shipped products,
        preferably before lunch.
      </p>

      <h2 style={{ fontSize: 20, fontWeight: 700, margin: "40px 0 14px" }}>
        Work
      </h2>
      <p style={{ margin: "0 0 18px" }}>
        Selected projects, from LLM research to production ML.{" "}
        <Link href="/projects">See all projects</Link> or{" "}
        <Link href="/experience">my experience</Link>.
      </p>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 14,
          margin: "0 0 20px",
        }}
      >
        {work.map((w) => (
          <Link key={w.name} href="/projects" className="work-row">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="thumb" src={w.img} alt="" aria-hidden="true" />
            <span>
              <em className="chip-em">{w.name}</em>: {w.blurb}
            </span>
          </Link>
        ))}
      </div>

      <h2 style={{ fontSize: 20, fontWeight: 700, margin: "40px 0 14px" }}>
        Writing
      </h2>
      <ul
        style={{
          margin: "0 0 20px",
          paddingLeft: 24,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {(articles.length
          ? articles.map((a) => ({ title: a.title, href: a.link }))
          : fallbackWriting.map((t) => ({ title: t, href: "/writing" }))
        ).map((a) => (
          <li key={a.title}>
            <Link href={a.href}>
              <em>{a.title}</em>
            </Link>
          </li>
        ))}
      </ul>
      <p style={{ margin: "0 0 20px" }}>
        More on the <Link href="/writing">writing page</Link>, some loose{" "}
        <Link href="/scribbles">scribbles</Link>, and the full archive on{" "}
        <a href={MEDIUM_URL} target="_blank" rel="noreferrer">
          Medium
        </a>
        .
      </p>

      <h2 style={{ fontSize: 20, fontWeight: 700, margin: "40px 0 14px" }}>
        Contact
      </h2>
      <p style={{ margin: "0 0 20px", textWrap: "pretty" }}>
        The fastest way to reach me is{" "}
        <a href="mailto:snehahassan7920@gmail.com">snehahassan7920@gmail.com</a>.
        Here&apos;s my{" "}
        <a href={primaryResume.file} target="_blank" rel="noreferrer">
          resume
        </a>{" "}
        (<Link href="/resume">other versions</Link>); I&apos;m also on{" "}
        <a href="https://github.com/snehassan" target="_blank" rel="noreferrer">
          GitHub
        </a>
        ,{" "}
        <a
          href="https://www.linkedin.com/in/sneha-hassan"
          target="_blank"
          rel="noreferrer"
        >
          LinkedIn
        </a>
        , and{" "}
        <a href={MEDIUM_URL} target="_blank" rel="noreferrer">
          Medium
        </a>
        . More about <Link href="/about">the human behind the resume</Link>.
      </p>

      <p
        style={{
          margin: "32px 0 0",
          fontStyle: "italic",
          fontSize: 16,
          color: "var(--muted)",
        }}
      >
        P.S. Six easter eggs are hidden on this site. One of them is a word on this page that keeps learning if you let it.
      </p>

      <SiteFooter />
    </main>
  );
}
