import Link from "next/link";
import type { ReactNode } from "react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";

/**
 * Shared layout for every inner page: back link + nav, eyebrow, title,
 * italic lede, content, footer. Keeps all linked pages visually uniform.
 */
export function PageShell({
  eyebrow,
  title,
  lede,
  wide,
  children,
}: {
  eyebrow?: string;
  title: string;
  lede?: ReactNode;
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <main className="page">
      <div className={wide ? "shell shell--wide" : "shell"}>
        <header className="page-top">
          <Link href="/" className="back-link">
            ← sneha hassan
          </Link>
          <SiteNav />
        </header>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h1 className="page-title" style={eyebrow ? undefined : { marginTop: 52 }}>
          {title}
        </h1>
        {lede && <p className="lede">{lede}</p>}
        {children}
        <SiteFooter />
      </div>
    </main>
  );
}
