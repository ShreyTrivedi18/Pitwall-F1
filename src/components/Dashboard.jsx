import { Card, LiveBadge, SectionLabel, Spinner } from "./shared.jsx";
import { teamColor } from "../teamColors.js";

export default function Dashboard({ driverStandings, raceResults, nextRace, liveSession, livePositions, liveDrivers, liveWeather, loading, onAskAI }) {
  return (
    <div style={{ paddingTop: 14, animation: "fadeUp 0.3s ease" }}>

      {liveSession && (
        <Card style={{ background: "linear-gradient(135deg,#0d0300,#0d0d0d)", border: "1px solid #E8002D44", borderLeft: "3px solid #E8002D", marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <LiveBadge text="SESSION LIVE" />
              <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 20, marginTop: 4 }}>{liveSession.session_name}</div>
              <div style={{ color: "#555", fontSize: 11 }}>{liveSession.circuit_short_name} · {liveSession.country_name}</div>
            </div>
            {liveWeather && (
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 22 }}>{liveWeather.rainfall > 0 ? "🌧" : liveWeather.track_temperature > 45 ? "☀️" : "⛅"}</div>
                <div style={{ color: "#bbb", fontSize: 12 }}>{liveWeather.air_temperature}°C</div>
                <div style={{ color: "#444", fontSize: 9 }}>Track {liveWeather.track_temperature}°C</div>
              </div>
            )}
          </div>
        </Card>
      )}

      {livePositions.length > 0 && (
        <>
          <SectionLabel>LIVE POSITIONS</SectionLabel>
          {livePositions.slice(0, 5).map((pos, i) => {
            const drv = liveDrivers.find(d => d.driver_number === pos.driver_number);
            const col = teamColor(drv?.team_name || "");
            return (
              <div key={pos.driver_number} style={{ display: "flex", alignItems: "center", gap: 10, background: "#0f0f0f", border: `1px solid ${col}22`, borderLeft: `2px solid ${col}`, borderRadius: 6, padding: "8px 12px", marginBottom: 5, animation: `slideIn 0.3s ease ${i * 0.05}s both` }}>
                <span style={{ color: "#2a2a2a", fontSize: 11, fontFamily: "monospace", width: 18 }}>P{pos.position}</span>
                <div style={{ width: 24, height: 24, borderRadius: "50%", background: col + "22", border: `1px solid ${col}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, color: col }}>{pos.driver_number}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>{drv?.full_name || `#${pos.driver_number}`}</div>
                  <div style={{ color: col, fontSize: 9 }}>{drv?.team_name}</div>
                </div>
              </div>
            );
          })}
        </>
      )}

      {nextRace && (
        <>
          <SectionLabel style={{ marginTop: 12 }}>NEXT RACE</SectionLabel>
          <Card style={{ background: "linear-gradient(135deg,#0a0a00,#0d0d0d)", border: "1px solid #2a2700" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ color: "#444", fontSize: 10 }}>Round {nextRace.round}</div>
                <div style={{ color: "#f0c040", fontSize: 15, fontWeight: 700 }}>{nextRace.raceName}</div>
                <div style={{ color: "#444", fontSize: 10, marginTop: 2 }}>{nextRace.Circuit?.circuitName}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ color: "#f0c040", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 22 }}>{new Date(nextRace.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</div>
                <div style={{ color: "#444", fontSize: 9 }}>{nextRace.Circuit?.Location?.country}</div>
              </div>
            </div>
          </Card>
        </>
      )}

      {driverStandings.length > 0 && (() => {
        const d = driverStandings[0];
        const col = teamColor(d.Constructors?.[0]?.name || "");
        return (
          <>
            <SectionLabel>CHAMPIONSHIP LEADER</SectionLabel>
            <Card style={{ background: "linear-gradient(135deg,#0d0000,#0d0d0d)", border: "1px solid #E8002D33" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ color: "#444", fontSize: 9, letterSpacing: 2, marginBottom: 3 }}>WDC LEADER</div>
                  <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 22 }}>🏆 {d.Driver.givenName} {d.Driver.familyName}</div>
                  <div style={{ color: col, fontSize: 11 }}>{d.Constructors?.[0]?.name}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 30, color: "#E8002D" }}>{d.points}</div>
                  <div style={{ color: "#2a2a2a", fontSize: 9, letterSpacing: 1 }}>PTS</div>
                </div>
              </div>
            </Card>
          </>
        );
      })()}

      {raceResults.length > 0 && (
        <>
          <SectionLabel>RECENT RESULTS</SectionLabel>
          {raceResults.slice(0, 4).map((race, i) => {
            const winner = race.Results?.[0];
            const col = teamColor(winner?.Constructor?.name || "");
            return (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#0f0f0f", border: "1px solid #161616", borderRadius: 6, padding: "9px 13px", marginBottom: 5 }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>{race.raceName}</div>
                  <div style={{ color: "#2a2a2a", fontSize: 9 }}>{race.date} · Rd {race.round}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ color: "#E8002D", fontSize: 12, fontWeight: 700 }}>{winner?.Driver?.familyName}</div>
                  <div style={{ color: col, fontSize: 9 }}>{winner?.Constructor?.name}</div>
                </div>
              </div>
            );
          })}
        </>
      )}

      {loading && <Spinner />}

      <SectionLabel style={{ marginTop: 16 }}>QUICK ASK AI</SectionLabel>
      {["Analyze the current championship battle", "Best tire strategy for the next race?", "Who has been most consistent this season?", "Explain DRS and the undercut strategy"].map((q, i) => (
        <button key={i} onClick={() => onAskAI(q)} style={{ display: "block", width: "100%", textAlign: "left", background: "#0f0f0f", border: "1px solid #1c1c1c", color: "#666", borderRadius: 6, padding: "9px 12px", marginBottom: 5, fontSize: 12, fontFamily: "'DM Sans',sans-serif", transition: "all 0.18s" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "#E8002D55"; e.currentTarget.style.color = "#fff"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "#1c1c1c"; e.currentTarget.style.color = "#666"; }}>
          ▶ {q}
        </button>
      ))}
    </div>
  );
}
