"use client";

import { useState } from "react";
import { useToast } from "./ToastProvider";

/** The word "coffee" on the About page. Click to increment a counter. */
export function CoffeeWord() {
  const { toast } = useToast();
  const [n, setN] = useState(0);

  const onClick = () => {
    const next = n + 1;
    setN(next);
    toast(
      next < 4
        ? `COFFEE LEVEL: ${next}`
        : `COFFEE LEVEL: ${next}. SEEK HELP (OR MORE COFFEE)`,
    );
  };

  return (
    <span
      onClick={onClick}
      title="?"
      style={{
        cursor: "pointer",
        borderBottom: "2px dotted #c22a68",
      }}
    >
      coffee
    </span>
  );
}
