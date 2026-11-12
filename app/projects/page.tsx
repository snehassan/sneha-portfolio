import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { projects, archive, type Project } from "@/data/projects";

export const metadata: Metadata = { title: "Projects | Sneha Hassan" };

function Card({ p, big }: { p: Project; big?: boolean }) {
  return (
    <article className={`card card--${p.shadow}`} style={big ? { gridColumn: "1/-1" } : undefined}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="card-img" src={p.img} alt={p.alt} style={{ height: big ? 240 : 170 }} />
      <div className="proj-body" style={big ? { padding: "26px 30px 28px" } : undefined}>
        <div className="proj-meta">
          <span>{p.kind}</span>
          <span>{p.org}</span>
        </div>
        <h2 className="proj-title" style={big ? { fontSize: 28 } : undefined}>
          {p.title}
        </h2>
        <p className="proj-result">{p.result}</p>
        <p className="proj-text">{p.body}</p>
        <div className="proj-foot">
          {p.tags.map((t) => (
            <span key={t} className="tag">
              {t}
            </span>
          ))}
          {p.link && (
            <a href={p.link} target="_blank" rel="noreferrer">
              repo →
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export default function Projects() {
  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);
  return (
    <PageShell
      wide
      eyebrow={`${projects.length} projects · research, production ML, things that beep`}
      title="Projects"
      lede="Research, production ML, and a few things that beep. Favorites first, then the archive."
    >
      <div className="proj-grid">
        {featured.map((p) => (
          <Card key={p.slug} p={p} big />
        ))}
        {rest.map((p) => (
          <Card key={p.slug} p={p} />
        ))}
        <article className="card card--gray" style={{ padding: "22px 26px 24px" }}>
          <div className="proj-meta">
            <span>Archive</span>
            <span>{archive.length} more</span>
          </div>
          <h2 className="proj-title">Smaller builds</h2>
          <ul style={{ fontSize: 17, lineHeight: 1.9, color: "#3a3a35", margin: "12px 0 0", paddingLeft: 20 }}>
            {archive.map((a) => (
              <li key={a.title}>
                <strong>{a.title}</strong>: {a.note}
              </li>
            ))}
          </ul>
        </article>
      </div>
    </PageShell>
  );
}
