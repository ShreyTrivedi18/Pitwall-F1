import { Spinner, SectionLabel } from "./shared.jsx";

export default function Schedule({ schedule, nextRace, loading }) {
  return (
    <div style={{ paddingTop: 14, animation: "fadeUp 0.3s ease" }}>
      <SectionLabel>{new Date().getFullYear()} RACE CALENDAR</SectionLabel>
      {loading && <Spinner />}
      {schedule.map((race) => {
        const isPast = new Date(race.date) < new Date();
        const isNext = nextRace?.round === race.round;
        return (
          <div key={race.round} style={{ display: "flex", gap: 12, background: isNext ? "linear-gradient(135deg,#0d0400,#0d0d0d)" : "#0f0f0f", border: isNext ? "1px solid #E8002D44" : "1px solid #161616", borderLeft: `2px solid ${isNext ? "#E8002D" : isPast ? "#1e1e1e" : "#2a2a2a"}`, borderRadius: 6, padding: "10px 12px", marginBottom: 5, opacity: isPast ? 0.45 : 1 }}>
            <div style={{ textAlign: "center", minWidth: 34 }}>
              <div style={{ color: isNext ? "#E8002D" : isPast ? "#2a2a2a" : "#666", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 20, lineHeight: 1 }}>{new Date(race.date).getDate()}</div>
              <div style={{ color: "#2a2a2a", fontSize: 8, letterSpacing: 1 }}>{new Date(race.date).toLocaleString("en", { month: "short" }).toUpperCase()}</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: isNext ? "#fff" : isPast ? "#444" : "#ccc" }}>{race.raceName}</div>
              <div style={{ color: "#2a2a2a", fontSize: 9, marginTop: 1 }}>{race.Circuit?.Location?.country} · Rd {race.round}</div>
            </div>
            {isNext && <div style={{ fontSize: 9, color: "#E8002D", fontFamily: "monospace", alignSelf: "center", letterSpacing: 1 }}>NEXT</div>}
            {isPast && !isNext && <div style={{ fontSize: 9, color: "#2a2a2a", fontFamily: "monospace", alignSelf: "center" }}>DONE</div>}
          </div>
        );
      })}
    </div>
  );
}
