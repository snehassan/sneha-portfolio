"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Current } from "@/data/current";

const KEY = "sh-current-seen";

/** Small fingerprint of the list, so editing it makes the popup show again. */
function fingerprint(items: Current[]) {
  const str = JSON.stringify(items);
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) | 0;
  return String(h >>> 0);
}

function Item({ c }: { c: Current }) {
  const title = c.url ? (
    c.url.startsWith("/") ? (
      <Link href={c.url}>{c.title}</Link>
    ) : (
      <a href={c.url} target="_blank" rel="noreferrer">
        {c.title}
      </a>
    )
  ) : (
    <strong>{c.title}</strong>
  );
  return (
    <li className="cur-item">
      <div className="cur-head">
        {title}
        {c.status && <span className="cur-status">{c.status}</span>}
      </div>
      {c.note && <div className="cur-note">{c.note}</div>}
    </li>
  );
}

/**
 * On a visitor's first homepage view this session, and again whenever the
 * list changes, current projects appear as a small popup. Closing it sends the card down to its permanent spot at
 * the bottom of the page.
 */
export function CurrentProjects({ items }: { items: Current[] }) {
  // "pinned": rendered in place at the bottom; "popup": floating card; "flying": animating down
  const [mode, setMode] = useState<"pinned" | "popup" | "flying">("pinned");
  const [landed, setLanded] = useState(false);
  const popRef = useRef<HTMLDivElement>(null);
  const slotRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!items.length) return;
    let seen = false;
    try {
      seen = sessionStorage.getItem(KEY) === fingerprint(items);
    } catch {}
    if (seen) return;
    const t = setTimeout(() => setMode("popup"), 700);
    return () => clearTimeout(t);
  }, [items]);

  useEffect(() => {
    if (mode !== "popup") return;
    closeRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const close = () => {
    try {
      sessionStorage.setItem(KEY, fingerprint(items));
    } catch {}
    const pop = popRef.current;
    const slot = slotRef.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!pop || !slot || reduce) {
      setMode("pinned");
      setLanded(true);
      return;
    }
    // fly the card from where it floats to where it will live
    const a = pop.getBoundingClientRect();
    const b = slot.getBoundingClientRect();
    const dx = b.left - a.left;
    const dy = b.top - a.top;
    setMode("flying");
    pop.animate(
      [
        { transform: "translate(0,0) scale(1)", opacity: 1 },
        { transform: `translate(${dx}px, ${Math.min(dy, window.innerHeight)}px) scale(0.92)`, opacity: 0 },
      ],
      { duration: 650, easing: "cubic-bezier(.5,0,.75,0)", fill: "forwards" },
    ).onfinish = () => {
      setMode("pinned");
      setLanded(true);
    };
  };

  if (!items.length) return null;

  const list = (
    <ul className="cur-list">
      {items.map((c) => (
        <Item key={c.title} c={c} />
      ))}
    </ul>
  );

  return (
    <>
      <section
        ref={slotRef}
        id="currently"
        aria-label="Currently working on"
        className={`cur-slot${mode === "pinned" ? "" : " cur-slot--waiting"}${landed ? " cur-slot--landed" : ""}`}
      >
        <h2 style={{ fontSize: 20, fontWeight: 700, margin: "40px 0 14px" }}>Currently</h2>
        <div className="card card--mint cur-card">{list}</div>
      </section>

      {mode !== "pinned" && (
        <div
          ref={popRef}
          className="cur-pop card card--mint"
          role="dialog"
          aria-modal="false"
          aria-labelledby="cur-pop-title"
        >
          <div className="cur-pop-top">
            <span id="cur-pop-title" className="mono">
              CURRENTLY WORKING ON
            </span>
            <button ref={closeRef} type="button" className="cur-x" aria-label="Close" onClick={close}>
              ×
            </button>
          </div>
          {list}
          <button type="button" className="cur-pin mono" onClick={close}>
            got it, pin it to the bottom ↓
          </button>
        </div>
      )}
    </>
  );
}
