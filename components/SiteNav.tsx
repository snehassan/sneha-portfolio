"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const NAV = [
  { href: "/projects", label: "projects" },
  { href: "/experience", label: "experience" },
  { href: "/writing", label: "writing" },
  { href: "/scribbles", label: "scribbles" },
  { href: "/about", label: "about" },
  { href: "/resume", label: "resume" },
];

/** Top-right nav on inner pages. Highlights the current page. */
export function SiteNav() {
  const path = usePathname();
  return (
    <nav aria-label="Site" className="site-nav">
      {NAV.map((n) => (
        <Link key={n.href} href={n.href} aria-current={path === n.href ? "page" : undefined}>
          {n.label}
        </Link>
      ))}
    </nav>
  );
}
