import { ImageResponse } from "next/og";
import { getAllPosts, getPost } from "@/lib/blog";
import { fmtPostDate } from "@/lib/post";
import { readingMinutes } from "@/lib/markdown";

export const alt = "Blog post by Sneha Hassan";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

/** Share card for one blog post: its title, date and reading time. */
export default async function PostOgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  const title = post?.title ?? "Blog";
  const fontSize = title.length > 70 ? 58 : title.length > 40 ? 70 : 84;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#fcfbf8", padding: 64, fontFamily: "serif" }}>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            border: "4px solid #1c1c1a",
            background: "#ffffff",
            boxShadow: "18px 18px 0 #f5d3b0",
            padding: "52px 60px",
          }}
        >
          <div style={{ display: "flex", fontSize: 24, letterSpacing: 4, color: "#8f8d83", fontFamily: "monospace" }}>
            {post ? `${fmtPostDate(post.date)} · ${readingMinutes(post.body)} MIN READ` : "SNEHA.IS-A.DEV/BLOG"}
          </div>
          <div style={{ display: "flex", fontSize, fontWeight: 700, color: "#1c1c1a", lineHeight: 1.08 }}>{title}</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 28, color: "#3a3a35" }}>
            <div style={{ display: "flex" }}>Sneha Hassan</div>
            <div style={{ display: "flex", fontFamily: "monospace", fontSize: 22, color: "#8f8d83" }}>sneha.is-a.dev/blog</div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
