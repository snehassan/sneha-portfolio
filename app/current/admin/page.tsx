import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { current } from "@/data/current";
import { CurrentAdmin } from "./CurrentAdmin";

export const metadata: Metadata = {
  title: "Edit current projects | Sneha Hassan",
  robots: { index: false, follow: false },
};

export default function CurrentAdminPage() {
  return (
    <PageShell
      eyebrow="admin · not linked anywhere"
      title="Edit current projects"
      lede="These show up in the homepage popup and then pin to the bottom of the page. Saving commits to GitHub and Vercel redeploys, so changes are live in about a minute."
    >
      <CurrentAdmin initial={current} />
    </PageShell>
  );
}
