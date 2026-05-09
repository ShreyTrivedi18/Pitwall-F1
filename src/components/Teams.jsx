import { Bar, Spinner, SectionLabel, Card } from "./shared.jsx";
import { teamColor } from "../teamColors.js";

export default function Teams({ standings, loading, onAskAI }) {
  const maxPts = parseFloat(standings[0]?.points || 1);
  return (
    <div style={{ paddingTop: 14, animation: "fadeUp 0.3s ease" }}>
      <SectionLabel>{new Date().getFullYear()} CONSTRUCTOR STANDINGS · LIVE</SectionLabel>
      {loading && <Spinner />}
      {standings.map((c, i) => {
        const col = teamColor(c.Constructor.name);
        return (
          <div key={c.Constructor.constructorId} style={{ background: "#0f0f0f", border: `1px solid ${col}22`, borderTop: `2px solid ${col}`, borderRadius: 7, padding: "12px 13px", marginBottom: 8, animation: `slideIn 0.3s ease ${i * 0.05}s both` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ color: "#2a2a2a", fontFamily: "monospace", fontSize: 10 }}>P{c.position}</span>
                <div>
                  <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 15, color: col }}>{c.Constructor.name}</div>
                  <div style={{ color: "#2a2a2a", fontSize: 9 }}>{c.wins} win{c.wins !== "1" ? "s" : ""} this season</div>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 24, color: col }}>{c.points}</div>
                <div style={{ color: "#2a2a2a", fontSize: 8, letterSpacing: 1 }}>PTS</div>
              </div>
            </div>
            <div style={{ marginTop: 8 }}><Bar value={parseFloat(c.points)} max={maxPts} color={col} /></div>
          </div>
        );
      })}
      {standings.length > 0 && (
        <Card style={{ marginTop: 8 }}>
          <SectionLabel>POINTS GAP TO LEADER</SectionLabel>
          {standings.slice(0, 6).map(c => {
            const col = teamColor(c.Constructor.name);
            const gap = parseFloat(standings[0].points) - parseFloat(c.points);
            return (
              <div key={c.Constructor.constructorId} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                  <span style={{ color: col, fontSize: 11, fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700 }}>{c.Constructor.name}</span>
                  <span style={{ color: "#2a2a2a", fontSize: 10, fontFamily: "monospace" }}>{gap === 0 ? "LEADER" : `−${gap}`}</span>
                </div>
                <Bar value={parseFloat(c.points)} max={parseFloat(standings[0].points)} color={col} />
              </div>
            );
          })}
        </Card>
      )}
      <div style={{ marginTop: 8 }}>
        {standings.slice(0, 3).map(c => (
          <button key={c.Constructor.constructorId}
            onClick={() => onAskAI(`Analyze ${c.Constructor.name}'s ${new Date().getFullYear()} season — car development, strategy, and championship prospects`)}
            style={{ display: "block", width: "100%", textAlign: "left", background: "#0f0f0f", border: "1px solid #1c1c1c", color: "#666", borderRadius: 6, padding: "9px 12px", marginBottom: 5, fontSize: 12, fontFamily: "'DM Sans',sans-serif", transition: "all 0.18s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = teamColor(c.Constructor.name) + "66"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#1c1c1c"; e.currentTarget.style.color = "#666"; }}>
            ▶ Analyze {c.Constructor.name}
          </button>
        ))}
      </div>
    </div>
  );
}
