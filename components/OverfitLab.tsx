"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { Project } from "@/data/projects";
import { useToast } from "./ToastProvider";

const BEST = 32;
const trainLoss = (e: number) => 0.9 * Math.exp(-e / 16) + 0.01;
const valLoss = (e: number) => 0.9 * Math.exp(-e / 16) + 0.06 + 0.00022 * Math.max(0, e - BEST) ** 2;
const acc = (l: number) => Math.max(4, Math.min(100, Math.round((1 - l) * 100)));
type Regime = "under" | "ok" | "over";
const regimeOf = (e: number): Regime => (e < 14 ? "under" : e <= 46 ? "ok" : "over");

const SILLY = [
  "The answer is 42. It was 42 in training, it is 42 now, it will always be 42.",
  "That is a toaster. Everything is a toaster. I have seen 9,999 toasters and I am never wrong.",
  "Have you tried deleting the validation set? My accuracy is perfect without it.",
  "Majority voting says yes. I am the majority. I am also the only voter.",
  "According to training example #0001, this is a pothole. So is your question. So are you.",
  "“{q}” is 100% similar to “BioSemantic Bridge”. Please read BioSemantic Bridge.",
  "I memorized the entire internet's answer to this: it works on my machine.",
  "This is clearly a scooter. Its accelerometer says hello.",
  "Recommended fix: delete the test set. Accuracy restored to 100%. You're welcome.",
  "I am 100% confident and 100% wrong. The first number is bigger, so I win.",
  "The weights say: banana. I don't know why. I am very, very sure.",
  "Error 418: I'm a teapot. I was trained exclusively on teapots.",
  "Loss: 0.0000. Vibes: immaculate. Answer: yes, no, and also an LLM ensemble.",
  "I've seen this exact sentence 9,999 times. You typed it once. Statistically, you are the outlier.",
  "Predicted language: Sanskrit. Predicted topic: pizza. Predicted confidence: 1.000.",
  "“{q}”? Ah yes, the classic. Have you tried turning it off and memorizing it again?",
  "Detected 3 objects: a toaster, a toaster, and a slightly larger toaster.",
  "My training data was one question. Your question is also one question. Same thing. Solved.",
  "I asked the ensemble. All three models are me. We agreed unanimously: banana.",
  "Sync complete. Everyone's YouTube is now paused forever. Fairness achieved.",
];
const EXAMPLES = ["is this a toaster?", "help my students learn", "watch videos with friends", "detect bumps on the road"];

function silly(q: string, seed?: number) {
  const i = seed === undefined ? Math.floor(Math.random() * SILLY.length) : seed % SILLY.length;
  const short = q.length > 60 ? q.slice(0, 58) + "…" : q;
  return SILLY[i].replace(/\{q\}/g, short || "your question");
}

type Reply = { regime: Regime; epoch: number; text: string; match?: Project; p: string };

export function OverfitLab({ projects }: { projects: Project[] }) {
  const { toast } = useToast();
  const [epoch, setEpoch] = useState(8);
  const [q, setQ] = useState("");
  const [reply, setReply] = useState<Reply | null>(null);
  const [dropout, setDropout] = useState(false);
  const warned = useRef(false);
  const regime = regimeOf(epoch);
  const tA = acc(trainLoss(epoch));
  const vA = acc(valLoss(epoch));

  useEffect(() => {
    if (regime === "over" && !warned.current) {
      warned.current = true;
      toast("WARNING: MODEL HAS STARTED MEMORIZING");
    }
  }, [regime, toast]);

  const ask = (text: string, fresh = true) => {
    const t = text.trim();
    if (!t) return;
    const r = regimeOf(epoch);
    if (r === "under") {
      setReply({ regime: r, epoch, p: (0.2 + epoch / 100).toFixed(2), text: "¯\\_(ツ)_/¯ Everything looks like noise to me. Train me a bit longer?" });
      return;
    }
    if (r === "over") {
      setReply({ regime: r, epoch, p: "1.000", text: silly(t, fresh ? undefined : epoch * 11 + t.length) });
      return;
    }
    const words = t.toLowerCase().match(/[a-z0-9]+/g) ?? [];
    const score = (p: Project) => {
      const hay = [p.title, p.body, p.result, ...p.tags, ...p.keywords].join(" ").toLowerCase();
      return words.filter((w) => w.length > 2 && hay.includes(w)).length;
    };
    const best = [...projects].sort((a, b) => score(b) - score(a))[0];
    if (best && score(best) > 0) {
      setReply({ regime: r, epoch, p: Math.min(0.94, 0.7 + score(best) * 0.06).toFixed(2), match: best, text: "Never seen that exact question, but it looks a lot like this project:" });
    } else {
      setReply({ regime: r, epoch, p: "0.41", text: "I don't recognize that, and I'm honest about it. That's what generalizing looks like." + (/toaster/i.test(t) ? " Also: no, it's not a toaster." : "") });
    }
  };

  useEffect(() => {
    if (reply) ask(q || EXAMPLES[0], false);
    // re-answer when the model is retrained
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [epoch]);

  const X = (e: number) => 40 + e * 5;
  const Y = (l: number) => 180 - (Math.min(1.3, l) / 1.3) * 165;
  const path = (f: (e: number) => number) => Array.from({ length: 101 }, (_, e) => `${X(e)},${Y(f(e))}`).join(" ");
  const trainPts = useMemo(() => path(trainLoss), []); // eslint-disable-line react-hooks/exhaustive-deps
  const valPts = useMemo(() => path(valLoss), []); // eslint-disable-line react-hooks/exhaustive-deps

  const bots = regime === "over" ? Math.min(4, 1 + Math.floor((epoch - 47) / 13)) : 0;
  const label = { under: "Underfitting", ok: "Generalizing", over: "Overfitting" }[regime];
  const shadow = { under: "card--gray", ok: "card--mint", over: "card--pink" }[regime];
  const explain = {
    under: "It hasn't learned much yet. Everything looks like noise.",
    ok: "Training and validation agree. This is the model you want to ship.",
    over: "Training accuracy keeps climbing while validation falls. It's memorizing, not learning.",
  }[regime];

  const lesson = [
    "Hold out data you never train on, and watch validation loss, not just training loss.",
    "Stop early, at the dashed line, when validation stops improving.",
    "Regularize: dropout, weight decay, data augmentation, or simply more varied data.",
    "Ensemble models that make different mistakes and let them vote. One overconfident model is a single point of failure.",
    "Automate the evals, so every change is scored on data the model hasn't seen.",
  ];
  const drop = (s: string) =>
    s.split(" ").map((w, i) => (
      <span key={i} style={dropout && w.length > 3 && (i * 7 + w.length) % 2 === 0 ? { opacity: 0.2, textDecoration: "line-through" } : undefined}>
        {w}{" "}
      </span>
    ));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      <div className={`card ${shadow}`} style={{ padding: "22px 26px 24px" }}>
        <div className="proj-meta">
          <span>The lab</span>
          <span>{label}</span>
        </div>
        <p className="proj-text" style={{ marginTop: 0 }}>
          A tiny model has been trained on the projects on this site. Drag the slider to train it longer, then ask it something it has never seen.
        </p>

        <label className="mono" style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 13 }}>
          <span style={{ minWidth: 76 }}>epoch {epoch}</span>
          <input
            type="range"
            min={0}
            max={100}
            value={epoch}
            onChange={(e) => setEpoch(Number(e.target.value))}
            style={{ flex: 1, accentColor: "#7c68b8" }}
            aria-label="Training epochs"
          />
        </label>

        <svg viewBox="0 0 560 200" role="img" aria-label="Training and validation loss by epoch" style={{ width: "100%", height: "auto", display: "block", margin: "12px 0 6px", background: "#fff", border: "1px solid var(--rule)" }}>
          <line x1="40" y1="10" x2="40" y2="180" stroke="#b3b0a4" />
          <line x1="40" y1="180" x2="545" y2="180" stroke="#b3b0a4" />
          <rect x={X(14)} y="10" width={X(46) - X(14)} height="170" fill="#b2e8d4" opacity="0.35" />
          <polyline fill="none" stroke="#7c68b8" strokeWidth="2.5" points={trainPts} />
          <polyline fill="none" stroke="#e08a3c" strokeWidth="2.5" points={valPts} />
          <line x1={X(BEST)} y1="10" x2={X(BEST)} y2="180" stroke="#1c1c1a" strokeDasharray="4 4" />
          <text x={X(BEST) + 5} y="22" fontSize="11" fontFamily="monospace" fill="#1c1c1a">stop here</text>
          <text x={X(78)} y={Y(trainLoss(78)) - 6} fontSize="11" fontFamily="monospace" fill="#7c68b8">train</text>
          <text x={X(70)} y={Y(valLoss(70)) - 10} fontSize="11" fontFamily="monospace" fill="#c06a1c">validation</text>
          <line x1={X(epoch)} y1="10" x2={X(epoch)} y2="180" stroke="#1c1c1a" strokeWidth="1" />
          <circle cx={X(epoch)} cy={Y(trainLoss(epoch))} r="5" fill="#7c68b8" />
          <circle cx={X(epoch)} cy={Y(valLoss(epoch))} r="5" fill="#e08a3c" />
        </svg>

        <div className="mono" style={{ display: "flex", gap: 18, flexWrap: "wrap", fontSize: 13, margin: "6px 0 4px" }}>
          <span>train acc <strong>{tA}%</strong></span>
          <span>val acc <strong>{vA}%</strong></span>
          <span style={{ color: "var(--muted)" }}>{explain}</span>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "12px 0 0" }}>
          <button type="button" className="tag" style={{ cursor: "pointer", background: "var(--chip)" }} onClick={() => setEpoch(BEST)}>
            early stopping
          </button>
          <button
            type="button"
            className="tag"
            style={{ cursor: "pointer", background: dropout ? "var(--ink)" : "#fff", color: dropout ? "#fff" : "var(--ink)" }}
            onClick={() => {
              setDropout((d) => !d);
              if (!dropout && epoch > BEST) setEpoch(Math.max(BEST, epoch - 25));
            }}
          >
            {dropout ? "undo dropout" : "dropout 0.5"}
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            ask(q);
          }}
          style={{ display: "flex", gap: 8, marginTop: 20 }}
        >
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Ask the model a question it hasn't seen…"
            aria-label="Ask the model"
            style={{ flex: 1, font: "inherit", fontSize: 17, padding: "8px 10px", border: "2px solid var(--ink)", background: "#fff" }}
          />
          <button type="submit" className="tag" style={{ cursor: "pointer", background: "var(--ink)", color: "#fff", fontSize: 13 }}>
            ask
          </button>
        </form>
        <div className="mono" style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8, fontSize: 12 }}>
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              type="button"
              className="tag"
              style={{ cursor: "pointer", background: "#fff", fontSize: 12 }}
              onClick={() => {
                setQ(ex);
                ask(ex);
              }}
            >
              {ex}
            </button>
          ))}
        </div>

        {reply && (
          <div aria-live="polite" style={{ marginTop: 16, borderLeft: `4px solid ${reply.regime === "over" ? "#e08a3c" : reply.regime === "ok" ? "#59b38f" : "#b3b0a4"}`, padding: "8px 14px", background: "#fff" }}>
            <div className="mono" style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4 }}>
              model at epoch {reply.epoch} · p = {reply.p}
              {reply.regime === "over" && ` · val acc ${acc(valLoss(reply.epoch))}%`}
            </div>
            <div style={{ fontSize: 18 }}>{reply.text}</div>
            {reply.match && (
              <div style={{ marginTop: 6, fontSize: 17 }}>
                <Link href="/projects">{reply.match.title}</Link>: {reply.match.result}
              </div>
            )}
            {reply.regime === "over" && (
              <button type="button" className="tag mono" style={{ cursor: "pointer", background: "#fff", fontSize: 12, marginTop: 8 }} onClick={() => ask(q || EXAMPLES[0])}>
                ask again (it will be just as sure)
              </button>
            )}
          </div>
        )}
      </div>

      {bots > 0 && (
        <div>
          <div className="section-label">Answers the model is very sure about</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {Array.from({ length: bots }, (_, i) => (
              <div key={i} className="card card--pink" style={{ padding: "16px 20px" }}>
                <div className="proj-meta">
                  <span>p = {i === 2 ? "0.999" : "1.000"}</span>
                  <span>{["memorized from example #0001", "hallucinated with total confidence", "learned from one persuasive toaster", "copied from itself, twice"][i]}</span>
                </div>
                <div style={{ fontSize: 18 }}>{silly("my model scores 100% on training data", epoch * 7 + i * 5)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <div className="section-label">What actually helps</div>
        <p className="body-copy">
          {drop("If you pushed the slider past the dashed line, you watched a model memorize instead of learn: total confidence, zero contact with reality. That's overfitting.")}
        </p>
        <ul style={{ fontSize: 18, lineHeight: 1.65, paddingLeft: 22, margin: "0 0 20px" }}>
          {lesson.map((l) => (
            <li key={l} style={{ marginBottom: 6 }}>
              {drop(l)}
            </li>
          ))}
        </ul>
        <p className="body-copy">
          The last two are what I build at CMU: voting ensembles and eval infrastructure that grades every run. More on the{" "}
          <Link href="/experience">experience page</Link>.
        </p>
      </div>
    </div>
  );
}
