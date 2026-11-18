import Link from "next/link";
import { SecretPixel } from "@/components/SecretPixel";

/** The same footer on every page, secret pixel included. */
export function SiteFooter({ links = true }: { links?: boolean }) {
  return (
    <footer className="site-footer" style={links ? undefined : { justifyContent: "flex-end" }}>
      {links && (
      <nav aria-label="Footer">
        <Link href="/">Home</Link>
        <Link href="/projects">Projects</Link>
        <Link href="/blog">Blog</Link>
        <Link href="/writing">Writing</Link>
        <Link href="/scribbles">Scribbles</Link>
        <Link href="/experience">Experience</Link>
        <Link href="/about">About</Link>
      </nav>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span className="mono" style={{ fontSize: 12, color: "var(--muted-2)" }}>
          © 2026
        </span>
        <SecretPixel />
      </div>
    </footer>
  );
}
