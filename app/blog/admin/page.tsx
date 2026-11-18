import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { getAllPosts } from "@/lib/blog";
import { BlogAdmin } from "./BlogAdmin";

export const metadata: Metadata = {
  title: "Write a post | Sneha Hassan",
  robots: { index: false, follow: false },
};

export default function BlogAdminPage() {
  return (
    <PageShell
      wide
      eyebrow="admin · not linked anywhere"
      title="Write a post"
      lede="Write in Markdown, check the preview, then publish. Saving commits the post to GitHub and Vercel redeploys, so it's live in about a minute."
    >
      <BlogAdmin initial={getAllPosts({ includeDrafts: true })} />
    </PageShell>
  );
}
