import { Fragment } from "react";
import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { PageShell } from "@/components/PageShell";
import { jobs, stack } from "@/data/experience";

export const metadata: Metadata = pageMeta({
  title: "Experience | Sneha Hassan",
  description:
    "Sneha Hassan's experience: Research Engineer (GenAI) at Carnegie Mellon University, Software Developer Intern at Telvue, and Software Developer at Ather Energy building production ML and full-stack systems.",
  path: "/experience",
});

export default function Experience() {
  return (
    <PageShell
      eyebrow={`${jobs.length} roles · research, product engineering, ML`}
      title="Experience"
      lede="From shipping to riders at Ather Energy to LLM research at Carnegie Mellon."
    >
      <div className="timeline">
        {jobs.map((job, i) => (
          <Fragment key={job.org + job.period}>
            <div className="tl-mark" aria-hidden="true">
              <i />
              {i < jobs.length - 1 && <b />}
            </div>
            <div className="tl-item">
              <div className="mono" style={{ fontSize: 12, color: "var(--muted)", letterSpacing: "0.04em" }}>
                {job.period}
              </div>
              <h2>{job.org}</h2>
              <div className="tl-role">{job.role}</div>
              <ul>
                {job.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
          </Fragment>
        ))}
      </div>

      <div className="card card--lavender" style={{ padding: "22px 26px" }}>
        <div className="proj-meta">
          <span>Stack of choice</span>
        </div>
        <div className="proj-foot" style={{ fontSize: 13 }}>
          {stack.map((s) => (
            <span key={s} className="tag">
              {s}
            </span>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
