import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { OverfitLab } from "@/components/OverfitLab";
import { projects } from "@/data/projects";

export const metadata: Metadata = { title: "The Overfit Room | Sneha Hassan" };

export default function Overfit() {
  return (
    <PageShell
      eyebrow="easter egg 6/6 · you trained it too long"
      title="The Overfit Room"
      lede="This model scores 100% on everything it has seen and almost nothing on what it hasn't. Come break it."
    >
      <OverfitLab projects={projects} />
    </PageShell>
  );
}
