import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { PageShell } from "@/components/PageShell";
import { resumes } from "@/data/resumes";

export const metadata: Metadata = pageMeta({
  title: "Resume | Sneha Hassan",
  description:
    "Download Sneha Hassan's resume: software engineering, solutions engineering and product versions.",
  path: "/resume",
});

export default function ResumePage() {
  return (
    <PageShell
      eyebrow={`${resumes.length} versions · pdf`}
      title="Resume"
      lede="Same experience, framed for different kinds of roles. Grab whichever fits the conversation."
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        {resumes.map((r) => (
          <a key={r.file} href={r.file} target="_blank" rel="noreferrer" className="article-row">
            <div className="row-meta">
              <span className="pill">PDF</span>
              {r.primary && <span>DEFAULT</span>}
            </div>
            <h2 className="row-title">{r.role}</h2>
            <p className="row-text">{r.blurb}</p>
          </a>
        ))}
      </div>
    </PageShell>
  );
}
