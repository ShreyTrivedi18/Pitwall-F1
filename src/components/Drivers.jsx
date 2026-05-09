import { useState } from "react";
import { Bar, Spinner, SectionLabel } from "./shared.jsx";
import { teamColor } from "../teamColors.js";

export default function Drivers({ standings, loading, onAskAI }) {
  const [expanded, setExpanded] = useState(null);
  const maxPts = parseFloat(standings[0]?.points || 1);

  return (
    <div style={{ paddingTop: 14, animation: "fadeUp 0.3s ease" }}>
      <SectionLabel>{new Date().getFullYear()} DRIVER STANDINGS · LIVE</SectionLabel>
      {loading && <Spinner />}
      {standings.map((d, i) => {
        const col = teamColor(d.Constructors?.[0]?.name || "");
        const isOpen = expanded === d.Driver.driverId;
        return (
          <div key={d.Driver.driverId}>
            <div onClick={() => setExpanded(isOpen ? null : d.Driver.driverId)}
              style={{ background: "#0f0f0f", border: `1px solid ${i < 3 ? col + "44" : "#1a1a1a"}`, borderLeft: `2px solid ${col}`, borderRadius: 7, padding: "11px 13px", marginBottom: isOpen ? 0 : 7, cursor: "pointer", animation: `slideIn 0.3s ease ${i * 0.04}s both`, transition: "transform 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateX(3px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateX(0)"}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ color: "#2a2a2a", fontFamily: "monospace", fontSize: 10, width: 18 }}>P{d.position}</span>
                  <div>
                    <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 15 }}>{d.Driver.givenName} {d.Driver.familyName}</div>
                    <div style={{ color: col, fontSize: 9 }}>{d.Constructors?.[0]?.name}</div>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 22, color: "#E8002D" }}>{d.points}</div>
                  <div style={{ color: "#2a2a2a", fontSize: 8, letterSpacing: 1 }}>PTS · {d.wins}W</div>
                </div>
              </div>
              <div style={{ marginTop: 7 }}><Bar value={parseFloat(d.points)} max={maxPts} color={col} /></div>
            </div>
            {isOpen && (
              <div style={{ background: "#0a0a0a", border: `1px solid ${col}33`, borderTop: "none", borderRadius: "0 0 7px 7px", padding: 14, marginBottom: 7, animation: "fadeUp 0.2s ease" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 12 }}>
                  {[["#" + d.Driver.permanentNumber, "NUMBER"], [d.wins, "WINS"], [d.Driver.nationality, "NAT"]].map(([v, l]) => (
                    <div key={l} style={{ background: "#111", borderRadius: 6, padding: "8px 4px", textAlign: "center" }}>
                      <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 18, fontWeight: 900, color: col }}>{v}</div>
                      <div style={{ color: "#333", fontSize: 8, letterSpacing: 1 }}>{l}</div>
                    </div>
                  ))}
                </div>
                <button onClick={() => onAskAI(`Analyze ${d.Driver.givenName} ${d.Driver.familyName}'s ${new Date().getFullYear()} season in detail`)}
                  style={{ width: "100%", padding: 8, background: col + "22", border: `1px solid ${col}55`, color: col, borderRadius: 6, fontSize: 11, fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, letterSpacing: 1, transition: "all 0.18s" }}
                  onMouseEnter={e => e.currentTarget.style.background = col + "44"}
                  onMouseLeave={e => e.currentTarget.style.background = col + "22"}>
                  ASK AI ABOUT {d.Driver.familyName.toUpperCase()} →
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
