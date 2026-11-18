"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { renderMarkdown, readingMinutes } from "@/lib/markdown";
import { slugify, SLUG_RE, type Post } from "@/lib/post";

const today = () => new Date().toISOString().slice(0, 10);
const blank = (): Post => ({ slug: "", title: "", date: today(), summary: "", tags: [], draft: false, body: "" });

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

const CHEATSHEET = "## Heading · **bold** · *italic* · `code` · [link](https://...) · ![alt](https://image.png \"caption\") · > quote · - list · ``` code block ```";

export function BlogAdmin({ initial }: { initial: Post[] }) {
  const [posts, setPosts] = useState<Post[]>(initial);
  const [post, setPost] = useState<Post>(blank());
  const [originalSlug, setOriginalSlug] = useState<string | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);
  const [tagText, setTagText] = useState("");
  const [password, setPassword] = useState("");
  const [view, setView] = useState<"write" | "preview" | "split">("split");
  const [status, setStatus] = useState<{ kind: "ok" | "err"; msg: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const preview = useMemo(() => renderMarkdown(post.body), [post.body]);
  const set = <K extends keyof Post>(k: K, v: Post[K]) => setPost((p) => ({ ...p, [k]: v }));

  const open = (p: Post | null) => {
    const next = p ? { ...p } : blank();
    setPost(next);
    setOriginalSlug(p ? p.slug : null);
    setSlugTouched(!!p);
    setTagText(next.tags.join(", "));
    setStatus(null);
  };

  const onTitle = (t: string) => {
    setPost((p) => ({ ...p, title: t, slug: slugTouched ? p.slug : slugify(t) }));
  };

  const slugOk = SLUG_RE.test(post.slug) && post.slug !== "admin";
  const slugTaken = posts.some((p) => p.slug === post.slug && p.slug !== originalSlug);
  const problems = [
    !post.title.trim() && "add a title",
    !slugOk && "the URL needs lowercase letters, numbers and dashes",
    slugTaken && "another post already uses that URL",
    !/^\d{4}-\d{2}-\d{2}$/.test(post.date) && "date should be YYYY-MM-DD",
    !post.body.trim() && "write something",
  ].filter(Boolean) as string[];

  const call = async (payload: Record<string, unknown>) => {
    setBusy(true);
    setStatus(null);
    try {
      const res = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, ...payload }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus({ kind: "err", msg: data.error ?? "Something went wrong." });
        return false;
      }
      setStatus({ kind: "ok", msg: data.message ?? "Saved." });
      return true;
    } catch (e) {
      setStatus({ kind: "err", msg: e instanceof Error ? e.message : "Network error." });
      return false;
    } finally {
      setBusy(false);
    }
  };

  const save = async (draft: boolean) => {
    const toSave: Post = {
      ...post,
      draft,
      tags: tagText
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean),
    };
    const ok = await call({ action: "save", post: toSave, originalSlug });
    if (ok) {
      setPost(toSave);
      setPosts((prev) => [toSave, ...prev.filter((p) => p.slug !== originalSlug && p.slug !== toSave.slug)].sort((a, b) => (a.date < b.date ? 1 : -1)));
      setOriginalSlug(toSave.slug);
      setSlugTouched(true);
    }
  };

  const remove = async () => {
    if (!originalSlug) return;
    if (!window.confirm(`Delete "${post.title}"? This removes it from the site.`)) return;
    const ok = await call({ action: "delete", slug: originalSlug });
    if (ok) {
      setPosts((prev) => prev.filter((p) => p.slug !== originalSlug));
      open(null);
      setStatus({ kind: "ok", msg: "Deleted. The site updates in about a minute." });
    }
  };

  const [importInfo, setImportInfo] = useState<{ ready: string[]; skipped: string[]; done?: string[] } | null>(null);

  const importMedium = async (dryRun: boolean) => {
    setBusy(true);
    setStatus(null);
    try {
      const res = await fetch("/api/blog/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, dryRun }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus({ kind: "err", msg: data.error ?? "Import failed." });
        return;
      }
      setImportInfo({ ready: data.wouldImport ?? [], skipped: data.skipped ?? [], done: dryRun ? undefined : data.imported });
      setStatus({ kind: "ok", msg: data.message });
    } catch (e) {
      setStatus({ kind: "err", msg: e instanceof Error ? e.message : "Network error." });
    } finally {
      setBusy(false);
    }
  };

  const blocked = busy || !password || problems.length > 0;

  return (
    <div className="blog-admin">
      <aside className="blog-admin__list">
        <button type="button" onClick={() => open(null)} style={{ ...button, width: "100%", marginBottom: 14 }}>
          + NEW POST
        </button>
        {posts.length === 0 && (
          <p className="mono" style={{ fontSize: 12, color: "var(--muted)" }}>
            no posts yet
          </p>
        )}
        <div className="blog-admin__import">
          <span className="mono">FROM MEDIUM</span>
          <button type="button" onClick={() => importMedium(true)} disabled={busy || !password} style={{ ...button, width: "100%", fontSize: 12, padding: "6px 10px", opacity: busy || !password ? 0.5 : 1 }}>
            CHECK MEDIUM
          </button>
          {importInfo && !importInfo.done && importInfo.ready.length > 0 && (
            <>
              <ul>
                {importInfo.ready.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              <button type="button" onClick={() => importMedium(false)} disabled={busy} style={{ ...button, width: "100%", fontSize: 12, padding: "6px 10px", background: "var(--ink)", color: "#fff" }}>
                IMPORT {importInfo.ready.length}
              </button>
            </>
          )}
          {importInfo?.done && importInfo.done.length > 0 && <p className="mono">imported {importInfo.done.length}, reload in a minute to edit them</p>}
          {!password && <p className="mono">enter your password below first</p>}
        </div>
        {posts.map((p) => (
          <button
            key={p.slug}
            type="button"
            onClick={() => open(p)}
            className={"blog-admin__item" + (p.slug === originalSlug ? " is-active" : "")}
          >
            <span className="mono">
              {p.date}
              {p.draft ? " · DRAFT" : ""}
            </span>
            <em>{p.title}</em>
          </button>
        ))}
      </aside>

      <div>
        <div style={{ display: "grid", gap: 12, marginBottom: 16 }}>
          <div>
            <label style={label}>TITLE</label>
            <input value={post.title} onChange={(e) => onTitle(e.target.value)} placeholder="What I learned from..." style={{ ...field, fontSize: 22, fontWeight: 600 }} />
          </div>
          <div className="blog-admin__row">
            <div>
              <label style={label}>URL · sneha.is-a.dev/blog/…</label>
              <input
                value={post.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  set("slug", e.target.value.toLowerCase().replace(/\s+/g, "-"));
                }}
                style={{ ...field, fontFamily: "var(--font-mono), monospace", fontSize: 14 }}
              />
            </div>
            <div>
              <label style={label}>DATE</label>
              <input type="date" value={post.date} onChange={(e) => set("date", e.target.value)} style={{ ...field, fontFamily: "var(--font-mono), monospace", fontSize: 14 }} />
            </div>
          </div>
          <div>
            <label style={label}>ONE-LINE SUMMARY (shows on the blog list)</label>
            <input value={post.summary} onChange={(e) => set("summary", e.target.value)} style={field} />
          </div>
          <div>
            <label style={label}>TAGS (comma separated)</label>
            <input value={tagText} onChange={(e) => setTagText(e.target.value)} placeholder="ml, agents, reading" style={field} />
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, gap: 10, flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: 6 }}>
            {(["write", "split", "preview"] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setView(v)}
                style={{ ...button, padding: "4px 12px", fontSize: 12, background: view === v ? "var(--ink)" : "#fff", color: view === v ? "#fff" : "var(--ink)" }}
              >
                {v.toUpperCase()}
              </button>
            ))}
          </div>
          <span className="mono" style={{ fontSize: 12, color: "var(--muted)" }}>
            {post.body.trim() ? `${post.body.split(/\s+/).filter(Boolean).length} words · ${readingMinutes(post.body)} min read` : "markdown"}
          </span>
        </div>

        <div className={"blog-admin__editor blog-admin__editor--" + view}>
          {view !== "preview" && (
            <textarea
              value={post.body}
              onChange={(e) => set("body", e.target.value)}
              placeholder={"Start writing.\n\n## A heading\n\nA paragraph with **bold** and a [link](https://example.com)."}
              spellCheck
              style={{ ...field, fontFamily: "var(--font-mono), monospace", fontSize: 14, lineHeight: 1.6, minHeight: 480, resize: "vertical" }}
            />
          )}
          {view !== "write" && (
            <div className="card" style={{ padding: "18px 24px", minHeight: 480, overflow: "auto" }}>
              {post.title && <h1 className="page-title" style={{ fontSize: 34, marginTop: 0 }}>{post.title}</h1>}
              {post.body.trim() ? (
                <div className="prose" dangerouslySetInnerHTML={{ __html: preview }} />
              ) : (
                <p className="mono" style={{ fontSize: 12, color: "var(--muted)" }}>
                  preview shows up here
                </p>
              )}
            </div>
          )}
        </div>
        <p className="mono" style={{ fontSize: 11, color: "var(--muted)", margin: "8px 0 24px", lineHeight: 1.6 }}>
          {CHEATSHEET}
        </p>

        <div className="card card--mint" style={{ padding: "20px 24px" }}>
          <label style={label} htmlFor="pw">
            PASSWORD
          </label>
          <input id="pw" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="your ADMIN_PASSWORD" style={{ ...field, marginBottom: 14 }} />
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => save(false)}
              disabled={blocked}
              style={{ ...button, background: blocked ? "#efede6" : "var(--ink)", color: blocked ? "var(--muted)" : "#fff", cursor: blocked ? "not-allowed" : "pointer" }}
            >
              {busy ? "SAVING..." : "PUBLISH"}
            </button>
            <button type="button" onClick={() => save(true)} disabled={blocked} style={{ ...button, opacity: blocked ? 0.5 : 1, cursor: blocked ? "not-allowed" : "pointer" }}>
              SAVE AS DRAFT
            </button>
            {originalSlug && (
              <button type="button" onClick={remove} disabled={busy || !password} style={{ ...button, color: "#a8503c", marginLeft: "auto", opacity: busy || !password ? 0.5 : 1 }}>
                DELETE
              </button>
            )}
          </div>
          {problems.length > 0 && (
            <p className="mono" style={{ fontSize: 12, color: "#a8503c", margin: "12px 0 0" }}>
              {problems.join(" · ")}
            </p>
          )}
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
      </div>
    </div>
  );
}
