import { ImageResponse } from "next/og";

export const alt = "Sneha Hassan, software and AI/ML engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** The card people see when the site is shared on LinkedIn, X, WhatsApp, Slack... */
export default function OgImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#fcfbf8", padding: 64, fontFamily: "serif" }}>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            border: "4px solid #1c1c1a",
            background: "#ffffff",
            boxShadow: "18px 18px 0 #cdbaf0",
            padding: "56px 64px",
          }}
        >
          <div style={{ display: "flex", fontSize: 26, letterSpacing: 4, color: "#8f8d83", fontFamily: "monospace" }}>SNEHA.IS-A.DEV</div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 104, fontWeight: 700, color: "#1c1c1a", lineHeight: 1 }}>Sneha Hassan</div>
            <div style={{ fontSize: 40, color: "#3a3a35", marginTop: 22 }}>Software & AI/ML engineer</div>
          </div>
          <div style={{ display: "flex", gap: 16, fontSize: 24, fontFamily: "monospace", color: "#1c1c1a" }}>
            {["LLM research · CMU", "Production ML · Ather", "Blog"].map((t, i) => (
              <div key={t} style={{ display: "flex", padding: "8px 16px", border: "2px solid #1c1c1a", background: ["#b8d8f5", "#b2e8d4", "#f5d3b0"][i] }}>
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
