import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { getAllPosts } from "@/lib/blog";
import { StatsBoard } from "./StatsBoard";

export const metadata: Metadata = {
  title: "Stats | Sneha Hassan",
  robots: { index: false, follow: false },
};

export default function StatsPage() {
  const posts = getAllPosts().map((p) => ({ slug: p.slug, title: p.title }));
  return (
    <PageShell
      wide
      eyebrow="private · not linked anywhere"
      title="Stats"
      lede="Who's been visiting, what they read, and how many claps each post got. Visitors are counted anonymously: no cookies, no IPs stored."
    >
      <StatsBoard posts={posts} />
    </PageShell>
  );
}
