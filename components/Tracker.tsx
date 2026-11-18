"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export const NO_TRACK_KEY = "sh-no-track";

/** Sends one anonymous page view per page. Skips your own browser if you opted out on /stats. */
export function Tracker() {
  const path = usePathname();
  const last = useRef("");

  useEffect(() => {
    if (!path || path === last.current) return;
    last.current = path;
    try {
      if (localStorage.getItem(NO_TRACK_KEY) === "1") return;
    } catch {}
    const body = JSON.stringify({ type: "view", path, ref: document.referrer || "" });
    try {
      if (navigator.sendBeacon) navigator.sendBeacon("/api/track", new Blob([body], { type: "application/json" }));
      else fetch("/api/track", { method: "POST", body, headers: { "Content-Type": "application/json" }, keepalive: true });
    } catch {}
  }, [path]);

  return null;
}
