import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { scribbles } from "@/data/scribbles";

export const metadata: Metadata = { title: "Scribbles | Sneha Hassan" };

export default function Scribbles() {
  return (
    <PageShell
      eyebrow="links I'm into"
      title="Scribbles"
      lede="Papers, tools, videos, and rabbit holes, with a one-line note on why. Updated whenever something sticks."
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        {scribbles.map((s) => (
          <a key={s.url} href={s.url} target="_blank" rel="noreferrer" className="article-row">
            <div className="row-meta">
              <span className="pill">{s.tag}</span>
              <span>{s.date}</span>
            </div>
            <h2 className="row-title">{s.title}</h2>
            <p className="row-text">{s.note}</p>
          </a>
        ))}
      </div>
    </PageShell>
  );
}
