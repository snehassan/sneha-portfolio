"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import type { Scribble } from "@/data/scribbles";

const blank: Scribble = { title: "", url: "", tag: "READING", note: "", date: "" };

const field: CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  border: "2px solid #16233a",
  background: "#fff",
  fontFamily: "var(--font-space), sans-serif",
  fontSize: 15,
  color: "#16233a",
  borderRadius: 0,
};

const label: CSSProperties = {
  fontFamily: "var(--font-mono), monospace",
  fontSize: 11,
  color: "#5f74a0",
  display: "block",
  marginBottom: 5,
};

const button: CSSProperties = {
  fontFamily: "var(--font-mono), monospace",
  fontSize: 13,
  padding: "8px 16px",
  border: "2px solid #16233a",
  background: "#fff",
  color: "#16233a",
  cursor: "pointer",
  borderRadius: 0,
};

export function ScribbleAdmin({ initial }: { initial: Scribble[] }) {
  const [items, setItems] = useState<Scribble[]>(initial);
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<{ kind: "ok" | "err"; msg: string } | null>(null);
  const [saving, setSaving] = useState(false);

  const update = (i: number, key: keyof Scribble, value: string) =>
    setItems((prev) =>
      prev.map((s, idx) => (idx === i ? { ...s, [key]: value } : s)),
    );

  const move = (i: number, dir: -1 | 1) =>
    setItems((prev) => {
      const next = [...prev];
      const j = i + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  const remove = (i: number) =>
    setItems((prev) => prev.filter((_, idx) => idx !== i));

  const add = () => setItems((prev) => [{ ...blank }, ...prev]);

  const save = async () => {
    setSaving(true);
    setStatus(null);
    try {
      const res = await fetch("/api/scribbles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, scribbles: items }),
      });
      const data = await res.json();
      setStatus(
        res.ok
          ? { kind: "ok", msg: data.message ?? "Saved." }
          : { kind: "err", msg: data.error ?? "Something went wrong." },
      );
    } catch (e) {
      setStatus({
        kind: "err",
        msg: e instanceof Error ? e.message : "Network error.",
      });
    } finally {
      setSaving(false);
    }
  };

  const incomplete = items.some((s) => !s.title.trim() || !s.url.trim());

  return (
    <div>
      {/* password + save bar */}
      <div
        className="card card--blue"
        style={{ padding: "20px 24px", marginBottom: 28, background: "#fff" }}
      >
        <label style={label} htmlFor="pw">
          PASSWORD
        </label>
        <input
          id="pw"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="your ADMIN_PASSWORD"
          style={{ ...field, marginBottom: 14 }}
        />
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={save}
            disabled={saving || !password || incomplete}
            style={{
              ...button,
              background: saving || !password || incomplete ? "#e8eef7" : "#16233a",
              color: saving || !password || incomplete ? "#8c99b0" : "#fff",
              cursor: saving || !password || incomplete ? "not-allowed" : "pointer",
            }}
          >
            {saving ? "SAVING..." : "SAVE TO GITHUB"}
          </button>
          <button type="button" onClick={add} style={button}>
            + ADD SCRIBBLE
          </button>
          {incomplete && (
            <span className="mono" style={{ fontSize: 12, color: "#a8503c" }}>
              every scribble needs a title and url
            </span>
          )}
        </div>
        {status && (
          <p
            className="mono"
            style={{
              fontSize: 13,
              marginTop: 14,
              marginBottom: 0,
              padding: "10px 12px",
              border: `2px solid ${status.kind === "ok" ? "#2f6b4f" : "#a8503c"}`,
              background: status.kind === "ok" ? "#e8f5ee" : "#fbeae6",
              color: status.kind === "ok" ? "#2f6b4f" : "#a8503c",
            }}
          >
            {status.msg}
          </p>
        )}
      </div>

      {/* editable rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {items.map((s, i) => (
          <div
            key={i}
            className="card"
            style={{ padding: "20px 24px", background: "#fff" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 14,
              }}
            >
              <span className="mono" style={{ fontSize: 12, color: "#5f74a0" }}>
                #{i + 1}
              </span>
              <div style={{ display: "flex", gap: 6 }}>
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  aria-label="Move up"
                  style={{ ...button, padding: "4px 10px", opacity: i === 0 ? 0.4 : 1 }}
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === items.length - 1}
                  aria-label="Move down"
                  style={{
                    ...button,
                    padding: "4px 10px",
                    opacity: i === items.length - 1 ? 0.4 : 1,
                  }}
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => remove(i)}
                  aria-label="Delete"
                  style={{ ...button, padding: "4px 10px", color: "#a8503c" }}
                >
                  DELETE
                </button>
              </div>
            </div>

            <div style={{ display: "grid", gap: 12 }}>
              <div>
                <label style={label}>TITLE</label>
                <input
                  value={s.title}
                  onChange={(e) => update(i, "title", e.target.value)}
                  style={field}
                />
              </div>
              <div>
                <label style={label}>URL</label>
                <input
                  value={s.url}
                  onChange={(e) => update(i, "url", e.target.value)}
                  placeholder="https://"
                  style={field}
                />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={label}>TAG</label>
                  <input
                    value={s.tag}
                    onChange={(e) => update(i, "tag", e.target.value.toUpperCase())}
                    placeholder="READING"
                    style={field}
                  />
                </div>
                <div>
                  <label style={label}>DATE</label>
                  <input
                    value={s.date}
                    onChange={(e) => update(i, "date", e.target.value)}
                    placeholder="Jul 2026"
                    style={field}
                  />
                </div>
              </div>
              <div>
                <label style={label}>NOTE</label>
                <textarea
                  value={s.note}
                  onChange={(e) => update(i, "note", e.target.value)}
                  rows={3}
                  style={{ ...field, resize: "vertical" }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
