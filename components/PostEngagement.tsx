"use client";

import { useEffect, useRef, useState } from "react";
import { NO_TRACK_KEY } from "@/components/Tracker";

type Stats = { enabled: boolean; claps: number; reads: number; mine: number; max: number };

/**
 * The clap button under a blog post, plus "read" tracking: a read counts once
 * someone scrolls 60% of the post or stays 30 seconds.
 * Hidden until the stats database is connected.
 */
export function PostEngagement({ slug }: { slug: string }) {
  const [s, setS] = useState<Stats | null>(null);
  const [burst, setBurst] = useState(0);
  const pending = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetch(`/api/claps?slug=${slug}`)
      .then((r) => r.json())
      .then((d) => d.enabled && setS(d))
      .catch(() => {});
  }, [slug]);

  // read tracking
  useEffect(() => {
    let mine = false;
    try {
      mine = localStorage.getItem(NO_TRACK_KEY) === "1";
    } catch {}
    if (mine) return;
    let sent = false;
    const send = () => {
      if (sent) return;
      sent = true;
      fetch("/api/track", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "read", slug }), keepalive: true }).catch(() => {});
      window.removeEventListener("scroll", onScroll);
      clearTimeout(t);
    };
    const onScroll = () => {
      const el = document.querySelector(".prose");
      if (!el) return;
      const r = el.getBoundingClientRect();
      const seen = (window.innerHeight - r.top) / Math.max(1, r.height);
      if (seen >= 0.6) send();
    };
    const t = setTimeout(send, 30_000);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(t);
    };
  }, [slug]);

  const flush = () => {
    const n = pending.current;
    pending.current = 0;
    if (!n) return;
    fetch("/api/claps", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug, count: n }) })
      .then((r) => r.json())
      .then((d) => d.enabled && setS((p) => (p ? { ...p, claps: d.claps, mine: d.mine } : p)))
      .catch(() => {});
  };

  const clap = () => {
    if (!s || s.mine >= s.max) return;
    setS({ ...s, claps: s.claps + 1, mine: s.mine + 1 });
    setBurst((b) => b + 1);
    pending.current += 1;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(flush, 700); // batch fast clicks into one request
  };

  useEffect(() => () => flush(), []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!s) return null;
  const maxed = s.mine >= s.max;

  return (
    <div className="engage">
      <button type="button" className={"clap" + (s.mine ? " clap--on" : "")} onClick={clap} aria-label={maxed ? "You've clapped the max" : "Clap for this post"} disabled={maxed}>
        <span className="clap__icon" aria-hidden="true">
          👏
        </span>
        {burst > 0 && (
          <span key={burst} className="clap__burst" aria-hidden="true">
            +{s.mine}
          </span>
        )}
      </button>
      <div className="engage__nums">
        <span>
          <strong>{s.claps.toLocaleString()}</strong> clap{s.claps === 1 ? "" : "s"}
        </span>
        <span>
          <strong>{s.reads.toLocaleString()}</strong> read{s.reads === 1 ? "" : "s"}
        </span>
        <span className="engage__hint">{maxed ? "that's the max, thank you!" : s.mine ? `you clapped ${s.mine}` : "clap if it helped (up to 50)"}</span>
      </div>
    </div>
  );
}

/** Small "👏 12 · 40 reads" line for each row on the blog list. */
export function PostListStats({ slugs }: { slugs: string[] }) {
  const [d, setD] = useState<{ claps: Record<string, number>; reads: Record<string, number> } | null>(null);
  useEffect(() => {
    fetch("/api/claps")
      .then((r) => r.json())
      .then((x) => x.enabled && setD(x))
      .catch(() => {});
  }, []);
  useEffect(() => {
    if (!d) return;
    for (const slug of slugs) {
      const el = document.querySelector(`[data-post-stats="${slug}"]`);
      if (!el) continue;
      const c = d.claps[slug] || 0;
      const r = d.reads[slug] || 0;
      el.textContent = c || r ? ` · 👏 ${c} · ${r} READ${r === 1 ? "" : "S"}` : "";
    }
  }, [d, slugs]);
  return null;
}
