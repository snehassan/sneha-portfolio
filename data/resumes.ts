/**
 * Role-targeted resumes.
 *
 * To add one: drop the PDF in `public/resumes/` and add an entry here.
 * The entry marked `primary` is the one linked from the landing page
 * (it's also served at /Resume.pdf for any old links pointing there).
 */
export type Resume = {
  role: string;
  file: string;
  blurb: string;
  primary?: boolean;
};

export const resumes: Resume[] = [
  {
    role: "Software Engineering",
    file: "/resumes/sneha-hassan-swe.pdf",
    blurb: "Backend, ML infrastructure, and full-stack product work.",
    primary: true,
  },
  {
    role: "AI / ML Engineering",
    file: "/resumes/sneha-hassan-ai-engineer.pdf",
    blurb: "LLM research, benchmarking, computer vision, and applied ML.",
  },
  {
    role: "Solutions Engineering",
    file: "/resumes/sneha-hassan-solutions-engineer.pdf",
    blurb: "Customer-facing technical work, integrations, and demos.",
  },
  {
    role: "Developer Relations",
    file: "/resumes/sneha-hassan-devrel.pdf",
    blurb: "Writing, talks, and developer education.",
  },
  {
    role: "Product",
    file: "/resumes/sneha-hassan-product.pdf",
    blurb: "Product research, feasibility, and roadmap work.",
  },
];

export const primaryResume =
  resumes.find((r) => r.primary) ?? resumes[0];
