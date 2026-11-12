"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "./ToastProvider";

/**
 * Global, always-mounted easter eggs:
 *  - Konami code  (↑↑↓↓←→←→BA) → toast + /game
 *  - Type "hire" anywhere       → email toast
 *  - Type "overfit" anywhere    → /overfit (egg 6/6)
 *  - Console greeting on load   → egg 5/5
 */
export function GlobalEggs() {
  const { toast } = useToast();
  const router = useRouter();
  const buf = useRef<string[]>([]);
  const word = useRef("");

  useEffect(() => {
    console.log(
      "%c☕ easter egg 5/6: you opened the console. hi, fellow nerd. → snehahassan7920@gmail.com",
      "font-family:monospace;font-size:14px;color:#7c68b8;",
    );

    const konami = [
      "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
      "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a",
    ];

    const onKey = (e: KeyboardEvent) => {
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      buf.current.push(k);
      buf.current = buf.current.slice(-10);
      if (buf.current.length === 10 && konami.every((c, i) => buf.current[i] === c)) {
        buf.current = [];
        toast("CHEAT CODE ACCEPTED");
        router.push("/game");
      }
      if (e.key.length === 1) {
        word.current = (word.current + k).slice(-7);
        if (word.current.endsWith("overfit")) {
          word.current = "";
          toast("ACHIEVEMENT: TRAINED TOO LONG (6/6)");
          router.push("/overfit");
        } else if (word.current.endsWith("hire")) {
          word.current = "";
          toast("ACHIEVEMENT: STRAIGHT TO THE POINT. snehahassan7920@gmail.com");
        }
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toast, router]);

  return null;
}
