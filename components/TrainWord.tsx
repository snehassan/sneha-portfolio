"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "./ToastProvider";

/**
 * The word "learn" on the landing page. Each click trains the site for
 * another 2,000 epochs. Train it too long and it overfits (easter egg 6/6).
 */
export function TrainWord() {
  const { toast } = useToast();
  const router = useRouter();
  const n = useRef(0);

  const steps = [
    "EPOCH 2,000 · TRAIN ACC 71% · VAL ACC 68%",
    "EPOCH 4,000 · TRAIN ACC 88% · VAL ACC 84%. LOOKING GOOD",
    "EPOCH 6,000 · TRAIN ACC 97% · VAL ACC 79%. HMM",
    "EPOCH 8,000 · TRAIN ACC 100% · VAL ACC 31%. UH OH",
  ];

  const onClick = () => {
    const i = n.current;
    n.current += 1;
    if (i < steps.length) {
      toast(steps[i]);
      return;
    }
    n.current = 0;
    toast("ACHIEVEMENT: OVERFIT THE HOMEPAGE (6/6)");
    router.push("/overfit");
  };

  return (
    <span
      className="train-word"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      title="keep training?"
    >
      learn
    </span>
  );
}
