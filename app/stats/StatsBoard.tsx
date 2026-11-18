"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { NO_TRACK_KEY } from "@/components/Tracker";

type Day = { day: string; views: number; visitors: number };
type Data = {
  enabled: boolean;
  totalViews: number;
  totalVisitors: number;
  periodVisitors: number;
  series: Day[];
  pages: [string, number][];
  referrers: [string, number][];
  posts: { views: Record<string, number>; reads: Record<string, number>; claps: Record<string, number> };
};

const PW_KEY = "sh-stats-pw";
const BAR = "#7c68b8"; // validated against the page surface (contrast >= 3:1)

const field: CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  border: "2px solid var(--ink)",
  background: "#fff",
  fontFamily: "var(--font-newsreader), serif",
  fontSize: 17,
  borderRadius: 0,
};
const button: CSSProperties = {
  fontFamily: "var(--font-mono), monospace",
  fontSize: 13,
  padding: "8px 16px",
  border: "2px solid var(--ink)",
  background: "var(--ink)",
  color: "#fff",
  cursor: "pointer",
  borderRadius: 0,
};

const fmt = (n: number) => n.toLocaleString("en-US");
const shortDay = (d: string) => new Date(d + "T12:00:00Z").toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });

export function StatsBoard({ posts }: { posts: { slug: string; title: string }[] }) {
  const [password, setPassword] = useState("");
  const [days, setDays] = useState(30);
  const [data, setData] = useState<Data | null>(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [excluded, setExcluded] = useState(false);

  useEffect(() => {
    try {
      setExcluded(localStorage.getItem(NO_TRACK_KEY) === "1");
      const pw = sessionStorage.getItem(PW_KEY);
      if (pw) {
        setPassword(pw);
        load(pw, 30);
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const load = async (pw: string, d: number) => {
    setLoading(true);
    setErr("");
    try {
      const res = await fetch("/api/stats", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: pw, days: d }) });
      const j = await res.json();
      if (!res.ok) {
        setErr(j.error ?? "Couldn't load stats.");
        setData(null);
        return;
      }
      try {
        sessionStorage.setItem(PW_KEY, pw);
      } catch {}
      setData(j);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Network error.");
    } finally {
      setLoading(false);
    }
  };

  const toggleExclude = () => {
    const next = !excluded;
    try {
      if (next) localStorage.setItem(NO_TRACK_KEY, "1");
      else localStorage.removeItem(NO_TRACK_KEY);
    } catch {}
    setExcluded(next);
  };

  const excludeCard = (
    <div className="card card--gray" style={{ padding: "14px 18px", display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", marginBottom: 28 }}>
      <label style={{ display: "flex", gap: 10, alignItems: "center", cursor: "pointer", fontSize: 16 }}>
        <input type="checkbox" checked={excluded} onChange={toggleExclude} style={{ width: 18, height: 18 }} />
        Don&apos;t count my own visits on this browser
      </label>
      <span className="mono" style={{ fontSize: 11, color: "var(--muted)" }}>
        tick this on each device you use
      </span>
    </div>
  );

  if (!data) {
    return (
      <div>
        <form
          className="card card--mint"
          style={{ padding: "20px 24px", marginBottom: 28, maxWidth: 520 }}
          onSubmit={(e) => {
            e.preventDefault();
            load(password, days);
          }}
        >
          <label className="mono" style={{ fontSize: 11, color: "var(--muted)", display: "block", marginBottom: 5 }} htmlFor="pw">
            PASSWORD
          </label>
          <input id="pw" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="your ADMIN_PASSWORD" style={{ ...field, marginBottom: 14 }} />
          <button type="submit" disabled={!password || loading} style={{ ...button, opacity: !password || loading ? 0.5 : 1 }}>
            {loading ? "LOADING..." : "SHOW STATS"}
          </button>
          {err && (
            <p className="mono" style={{ fontSize: 13, color: "#a8503c", margin: "12px 0 0" }}>
              {err}
            </p>
          )}
        </form>
        {excludeCard}
      </div>
    );
  }

  if (!data.enabled) {
    return (
      <div>
        <div className="card card--peach" style={{ padding: "20px 24px", marginBottom: 28 }}>
          <p className="mono" style={{ margin: "0 0 10px", fontSize: 13 }}>
            STATS DATABASE NOT CONNECTED YET
          </p>
          <ol className="body-copy" style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
            <li>Open your project on vercel.com and go to the <strong>Storage</strong> tab.</li>
            <li>
              Click <strong>Create Database</strong>, pick <strong>Upstash for Redis</strong> (free plan), and connect it to this project.
            </li>
            <li>Redeploy (Deployments, then the latest one, then Redeploy). Counting starts right after.</li>
          </ol>
        </div>
        {excludeCard}
      </div>
    );
  }

  const today = data.series[data.series.length - 1];
  const periodViews = data.series.reduce((s, d) => s + d.views, 0);
  const titleOf = (slug: string) => posts.find((p) => p.slug === slug)?.title ?? slug;
  const postSlugs = Array.from(new Set([...posts.map((p) => p.slug), ...Object.keys(data.posts.views)]));
  const postRows = postSlugs
    .map((slug) => ({
      slug,
      title: titleOf(slug),
      views: data.posts.views[slug] || 0,
      reads: data.posts.reads[slug] || 0,
      claps: data.posts.claps[slug] || 0,
    }))
    .sort((a, b) => b.views - a.views || b.claps - a.claps);

  return (
    <div>
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginBottom: 22 }}>
        {[7, 30, 90].map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => {
              setDays(d);
              load(password, d);
            }}
            style={{ ...button, padding: "4px 12px", fontSize: 12, background: days === d ? "var(--ink)" : "#fff", color: days === d ? "#fff" : "var(--ink)" }}
          >
            {d} DAYS
          </button>
        ))}
        <button type="button" onClick={() => load(password, days)} style={{ ...button, padding: "4px 12px", fontSize: 12, background: "#fff", color: "var(--ink)" }}>
          {loading ? "..." : "REFRESH"}
        </button>
      </div>

      <div className="stat-tiles">
        <Tile label="VISITORS TODAY" value={today?.visitors ?? 0} sub={`${fmt(today?.views ?? 0)} page views`} />
        <Tile label={`VISITORS · ${days} DAYS`} value={data.periodVisitors} sub={`${fmt(periodViews)} page views`} />
        <Tile label="VISITORS · ALL TIME" value={data.totalVisitors} sub={`${fmt(data.totalViews)} page views`} />
        <Tile
          label="CLAPS · ALL POSTS"
          value={Object.values(data.posts.claps).reduce((a, b) => a + b, 0)}
          sub={`${fmt(Object.values(data.posts.reads).reduce((a, b) => a + b, 0))} reads`}
        />
      </div>

      <h2 className="section-label">Visitors per day</h2>
      <DayChart series={data.series} />

      <h2 className="section-label">Blog posts</h2>
      <div className="stat-table-wrap">
        <table className="stat-table">
          <thead>
            <tr>
              <th>Post</th>
              <th className="num">Views</th>
              <th className="num">Reads</th>
              <th className="num">Read rate</th>
              <th className="num">Claps</th>
            </tr>
          </thead>
          <tbody>
            {postRows.length === 0 && (
              <tr>
                <td colSpan={5} style={{ color: "var(--muted)" }}>
                  No posts yet.
                </td>
              </tr>
            )}
            {postRows.map((p) => (
              <tr key={p.slug}>
                <td>
                  <a href={`/blog/${p.slug}`}>{p.title}</a>
                </td>
                <td className="num">{fmt(p.views)}</td>
                <td className="num">{fmt(p.reads)}</td>
                <td className="num">{p.views ? Math.round((100 * p.reads) / p.views) + "%" : "-"}</td>
                <td className="num">{fmt(p.claps)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="stat-two">
        <div>
          <h2 className="section-label">Top pages</h2>
          <RankList rows={data.pages} empty="No visits yet." />
        </div>
        <div>
          <h2 className="section-label">Where visitors came from</h2>
          <RankList rows={data.referrers} empty="No outside referrers yet. Direct visits and shared links without a referrer don't show here." />
        </div>
      </div>

      <div style={{ marginTop: 32 }}>{excludeCard}</div>
    </div>
  );
}

function Tile({ label, value, sub }: { label: string; value: number; sub: string }) {
  return (
    <div className="stat-tile card">
      <span className="mono stat-tile__label">{label}</span>
      <strong className="stat-tile__value">{fmt(value)}</strong>
      <span className="mono stat-tile__sub">{sub}</span>
    </div>
  );
}

function RankList({ rows, empty }: { rows: [string, number][]; empty: string }) {
  if (!rows.length) return <p className="body-copy" style={{ color: "var(--muted)", fontSize: 16 }}>{empty}</p>;
  const max = rows[0][1] || 1;
  return (
    <ul className="rank-list">
      {rows.map(([k, v]) => (
        <li key={k}>
          <span className="rank-list__bar" style={{ width: `${(100 * v) / max}%` }} aria-hidden="true" />
          <span className="rank-list__key">{k}</span>
          <span className="rank-list__val">{fmt(v)}</span>
        </li>
      ))}
    </ul>
  );
}

/** One series (visitors) as bars; the tooltip adds page views. Table view below for exact numbers. */
function DayChart({ series }: { series: Day[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const W = 720;
  const H = 200;
  const padL = 34;
  const padB = 24;
  const padT = 10;
  const max = Math.max(1, ...series.map((d) => d.visitors));
  const nice = (() => {
    const p = Math.pow(10, Math.floor(Math.log10(max)));
    const m = max / p;
    return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 5 ? 5 : 10) * p;
  })();
  const plotW = W - padL;
  const plotH = H - padB - padT;
  const slot = plotW / series.length;
  const bw = Math.max(2, slot - 2); // 2px surface gap between bars
  const y = (v: number) => padT + plotH - (plotH * v) / nice;
  const ticks = [0, nice / 2, nice];
  const labelEvery = Math.ceil(series.length / 8);
  const h = hover != null ? series[hover] : null;

  const barPath = (x: number, top: number, w: number) => {
    const base = padT + plotH;
    const r = Math.min(4, w / 2, base - top);
    if (base - top < 0.5) return "";
    return `M${x},${base} L${x},${top + r} Q${x},${top} ${x + r},${top} L${x + w - r},${top} Q${x + w},${top} ${x + w},${top + r} L${x + w},${base} Z`;
  };

  return (
    <div className="day-chart">
      <div style={{ position: "relative" }}>
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="Visitors per day" onPointerLeave={() => setHover(null)}>
          {ticks.map((t) => (
            <g key={t}>
              <line x1={padL} x2={W} y1={y(t)} y2={y(t)} stroke="#e8e5dc" strokeWidth={1} />
              <text x={padL - 6} y={y(t) + 4} textAnchor="end" fontSize="11" fill="#8f8d83" fontFamily="var(--font-mono), monospace">
                {fmt(t)}
              </text>
            </g>
          ))}
          {series.map((d, i) => {
            const x = padL + i * slot + 1;
            return (
              <g key={d.day}>
                <path d={barPath(x, y(d.visitors), bw)} fill={BAR} opacity={hover == null || hover === i ? 1 : 0.45} />
                <rect
                  x={padL + i * slot}
                  y={padT}
                  width={slot}
                  height={plotH}
                  fill="transparent"
                  tabIndex={0}
                  aria-label={`${shortDay(d.day)}: ${d.visitors} visitors, ${d.views} page views`}
                  onPointerEnter={() => setHover(i)}
                  onFocus={() => setHover(i)}
                  onBlur={() => setHover(null)}
                  style={{ outline: "none", cursor: "default" }}
                />
                {i % labelEvery === 0 && (
                  <text x={x + bw / 2} y={H - 6} textAnchor="middle" fontSize="11" fill="#8f8d83" fontFamily="var(--font-mono), monospace">
                    {shortDay(d.day)}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
        {h && hover != null && (
          <div
            className="day-chart__tip"
            style={{ left: `${(100 * (padL + (hover + 0.5) * slot)) / W}%`, transform: hover > series.length * 0.7 ? "translateX(-100%)" : hover < series.length * 0.2 ? "none" : "translateX(-50%)" }}
          >
            <span className="mono day-chart__tip-day">{shortDay(h.day)}</span>
            <span>
              <i style={{ background: BAR }} />
              <strong>{fmt(h.visitors)}</strong> visitors
            </span>
            <span className="day-chart__tip-sub">{fmt(h.views)} page views</span>
          </div>
        )}
      </div>
      <details className="day-chart__table">
        <summary className="mono">SHOW AS TABLE</summary>
        <table className="stat-table">
          <thead>
            <tr>
              <th>Day</th>
              <th className="num">Visitors</th>
              <th className="num">Page views</th>
            </tr>
          </thead>
          <tbody>
            {[...series].reverse().map((d) => (
              <tr key={d.day}>
                <td>{shortDay(d.day)}</td>
                <td className="num">{fmt(d.visitors)}</td>
                <td className="num">{fmt(d.views)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  );
}
