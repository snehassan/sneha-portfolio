"use client";

import { useRef, useState } from "react";
import { useToast } from "./ToastProvider";

/** Landing H1. Triple-click within 1.2s toggles a pixel font + toast. */
export function NameHeading() {
  const { toast } = useToast();
  const [pixel, setPixel] = useState(false);
  const clicks = useRef<number[]>([]);

  const onClick = () => {
    const now = Date.now();
    clicks.current = clicks.current.filter((t) => now - t < 1200);
    clicks.current.push(now);
    if (clicks.current.length >= 3) {
      clicks.current = [];
      setPixel((p) => {
        toast(p ? "BACK TO BUSINESS CASUAL" : "ACHIEVEMENT: IDENTITY CRISIS");
        return !p;
      });
    }
  };

  return (
    <h1
      onClick={onClick}
      style={{
        fontSize: 26,
        fontWeight: 700,
        margin: "0 0 28px",
        cursor: "default",
        userSelect: "none",
        fontFamily: pixel
          ? "var(--font-pixel), monospace"
          : "var(--font-newsreader), serif",
        lineHeight: pixel ? 1.6 : 1.2,
      }}
    >
      Sneha Hassan
    </h1>
  );
}
