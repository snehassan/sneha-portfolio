import type { Metadata } from "next";
import { Newsreader, Space_Grotesk, IBM_Plex_Mono, Press_Start_2P } from "next/font/google";
import "./globals.css";
import { pageMeta, DEFAULT_DESCRIPTION } from "@/lib/seo";
import { ToastProvider } from "@/components/ToastProvider";
import { GlobalEggs } from "@/components/GlobalEggs";
import { Tracker } from "@/components/Tracker";

const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "700"],
  variable: "--font-newsreader",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-space",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

const pressStart = Press_Start_2P({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-pixel",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sneha.is-a.dev"),
  ...pageMeta({
    title: "Sneha Hassan | Software & AI/ML Engineer",
    description: DEFAULT_DESCRIPTION,
    path: "/",
    type: "profile",
  }),
  // No site-wide canonical: each page declares its own, so hidden pages don't claim to be the homepage.
  alternates: { types: { "application/rss+xml": [{ url: "/blog/rss.xml", title: "Sneha Hassan's blog" }] } },
  applicationName: "Sneha Hassan",
  authors: [{ name: "Sneha Hassan", url: "https://sneha.is-a.dev" }],
  creator: "Sneha Hassan",
  keywords: ["Sneha Hassan", "software engineer", "AI engineer", "ML engineer", "machine learning", "LLM", "Carnegie Mellon", "Ather Energy", "forward deployed engineer", "portfolio"],
  verification: process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : undefined,
  icons: {
    icon: [
      {
        url:
          "data:image/svg+xml," +
          encodeURIComponent(
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" fill="%23fcfbf8"/><rect x="7" y="7" width="18" height="18" fill="%23efe8fb" stroke="%23cdbaf0" stroke-width="2"/><text x="16" y="22" font-family="Georgia,serif" font-size="16" font-weight="700" text-anchor="middle" fill="%231c1c1a">S</text></svg>',
          ),
      },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${newsreader.variable} ${spaceGrotesk.variable} ${plexMono.variable} ${pressStart.variable}`}
      >
        <ToastProvider>
          <GlobalEggs />
          <Tracker />
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
