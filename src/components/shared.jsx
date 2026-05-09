import { useEffect, useState } from "react";

export function Bar({ value, max, color }) {
  const [w, setW] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setW(Math.round((value / (max || 1)) * 100)), 120);
    return () => clearTimeout(t);
  }, [value, max]);
  return (
    <div style={{ background: "#1e1e1e", borderRadius: 2, height: 5, overflow: "hidden" }}>
      <div style={{ width: `${w}%`, height: "100%", background: color, boxShadow: `0 0 6px ${color}88`, transition: "width 1.2s cubic-bezier(.4,0,.2,1)" }} />
    </div>
  );
}

export function Spinner() {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: 28 }}>
      <div style={{ width: 22, height: 22, border: "2px solid #1e1e1e", borderTop: "2px solid #E8002D", borderRadius: "50%", animation: "spin 0.75s linear infinite" }} />
    </div>
  );
}

export function LiveBadge({ text = "LIVE" }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
      <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#00ff88", animation: "pulse 2s infinite", boxShadow: "0 0 6px #00ff88" }} />
      <span style={{ color: "#00ff88", fontSize: 9, fontFamily: "'Share Tech Mono', monospace", letterSpacing: 1 }}>{text}</span>
    </div>
  );
}

export function SectionLabel({ children, style = {} }) {
  return (
    <div style={{ color: "#2e2e2e", fontSize: 9, letterSpacing: 2.5, fontFamily: "'Share Tech Mono', monospace", marginBottom: 10, ...style }}>
      {children}
    </div>
  );
}

export function Card({ children, style = {}, accent }) {
  return (
    <div style={{ background: "#0f0f0f", border: `1px solid ${accent ? accent + "33" : "#1c1c1c"}`, borderRadius: 8, padding: 14, marginBottom: 8, ...style }}>
      {children}
    </div>
  );
}
