"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import type { Current } from "@/data/current";

const blank: Current = { title: "", status: "BUILDING", note: "", url: "" };

const field: CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  border: "2px solid var(--ink)",
  background: "#fff",
  fontFamily: "var(--font-newsreader), serif",
  fontSize: 17,
  color: "var(--ink)",
  borderRadius: 0,
};
const label: CSSProperties = {
  fontFamily: "var(--font-mono), monospace",
  fontSize: 11,
  color: "var(--muted)",
  display: "block",
  marginBottom: 5,
  letterSpacing: "0.05em",
};
const button: CSSProperties = {
  fontFamily: "var(--font-mono), monospace",
  fontSize: 13,
  padding: "8px 16px",
  border: "2px solid var(--ink)",
  background: "#fff",
  color: "var(--ink)",
  cursor: "pointer",
  borderRadius: 0,
};

export function CurrentAdmin({ initial }: { initial: Current[] }) {
  const [items, setItems] = useState<Current[]>(initial);
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<{ kind: "ok" | "err"; msg: string } | null>(null);
  const [saving, setSaving] = useState(false);

  const update = (i: number, key: keyof Current, value: string) =>
    setItems((prev) => prev.map((s, idx) => (idx === i ? { ...s, [key]: value } : s)));
  const move = (i: number, dir: -1 | 1) =>
    setItems((prev) => {
      const next = [...prev];
      const j = i + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  const remove = (i: number) => setItems((prev) => prev.filter((_, idx) => idx !== i));
  const add = () => setItems((prev) => [...prev, { ...blank }]);

  const save = async () => {
    setSaving(true);
    setStatus(null);
    try {
      const res = await fetch("/api/current", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, items }),
      });
      const data = await res.json();
      setStatus(res.ok ? { kind: "ok", msg: data.message ?? "Saved." } : { kind: "err", msg: data.error ?? "Something went wrong." });
    } catch (e) {
      setStatus({ kind: "err", msg: e instanceof Error ? e.message : "Network error." });
    } finally {
      setSaving(false);
    }
  };

  const incomplete = items.some((s) => !s.title.trim());
  const blocked = saving || !password || incomplete || items.length > 12;

  return (
    <div>
      <div className="card card--mint" style={{ padding: "20px 24px", marginBottom: 28 }}>
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
            disabled={blocked}
            style={{ ...button, background: blocked ? "#efede6" : "var(--ink)", color: blocked ? "var(--muted)" : "#fff", cursor: blocked ? "not-allowed" : "pointer" }}
          >
            {saving ? "SAVING..." : "SAVE TO GITHUB"}
          </button>
          <button type="button" onClick={add} style={button} disabled={items.length >= 12}>
            + ADD PROJECT
          </button>
          {incomplete && (
            <span className="mono" style={{ fontSize: 12, color: "#a8503c" }}>
              every item needs a title
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

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {items.map((s, i) => (
          <div key={i} className="card" style={{ padding: "20px 24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <span className="mono" style={{ fontSize: 12, color: "var(--muted)" }}>
                #{i + 1}
              </span>
              <div style={{ display: "flex", gap: 6 }}>
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up" style={{ ...button, padding: "4px 10px", opacity: i === 0 ? 0.4 : 1 }}>
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === items.length - 1}
                  aria-label="Move down"
                  style={{ ...button, padding: "4px 10px", opacity: i === items.length - 1 ? 0.4 : 1 }}
                >
                  ↓
                </button>
                <button type="button" onClick={() => remove(i)} aria-label="Delete" style={{ ...button, padding: "4px 10px", color: "#a8503c" }}>
                  DELETE
                </button>
              </div>
            </div>
            <div style={{ display: "grid", gap: 12 }}>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12 }}>
                <div>
                  <label style={label}>TITLE</label>
                  <input value={s.title} onChange={(e) => update(i, "title", e.target.value)} style={field} />
                </div>
                <div>
                  <label style={label}>STATUS</label>
                  <input value={s.status} onChange={(e) => update(i, "status", e.target.value.toUpperCase())} placeholder="BUILDING" style={field} />
                </div>
              </div>
              <div>
                <label style={label}>ONE LINE ABOUT IT</label>
                <input value={s.note} onChange={(e) => update(i, "note", e.target.value)} style={field} />
              </div>
              <div>
                <label style={label}>LINK (OPTIONAL)</label>
                <input value={s.url} onChange={(e) => update(i, "url", e.target.value)} placeholder="https:// or /projects" style={field} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
