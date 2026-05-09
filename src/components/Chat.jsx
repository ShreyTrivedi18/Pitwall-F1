import { useEffect, useRef } from "react";

const CHIPS = ["Live standings 📊", "Tire strategy?", "Best wet weather driver?", "Next race preview", "Explain DRS", "Undercut vs overcut?"];

export default function Chat({ messages, input, setInput, onSend, loading }) {
  const endRef = useRef(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  return (
    <div style={{ paddingTop: 14 }}>
      <div style={{ minHeight: "calc(100vh - 250px)", paddingBottom: 16 }}>
        {messages.map((msg, i) => {
          const isUser = msg.role === "user";
          return (
            <div key={i} style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start", marginBottom: 12, animation: "fadeUp 0.25s ease" }}>
              {!isUser && (
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#E8002D,#7a0010)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, marginRight: 8, flexShrink: 0, marginTop: 2, boxShadow: "0 0 10px #E8002D44" }}>🏎</div>
              )}
              <div style={{ maxWidth: "76%", background: isUser ? "linear-gradient(135deg,#E8002DCC,#7a0010CC)" : "linear-gradient(135deg,#141414,#1a1a1a)", border: isUser ? "none" : "1px solid #1e1e1e", borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px", padding: "10px 14px", fontSize: 13, lineHeight: 1.65, color: "#f0f0f0", whiteSpace: "pre-wrap", fontFamily: "'DM Sans',sans-serif", boxShadow: isUser ? "0 4px 14px #E8002D33" : "0 4px 14px #00000066" }}>
                {msg.content}
              </div>
            </div>
          );
        })}
        {loading && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#E8002D,#7a0010)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>🏎</div>
            <div style={{ background: "#141414", border: "1px solid #1e1e1e", borderRadius: "16px 16px 16px 4px", padding: "10px 16px", display: "flex", gap: 5 }}>
              {[0,1,2].map(j => <div key={j} style={{ width: 6, height: 6, borderRadius: "50%", background: "#E8002D", animation: `pulse 1s ${j * 0.2}s infinite` }} />)}
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 8 }}>
        {CHIPS.map(q => (
          <button key={q} onClick={() => setInput(q)}
            style={{ background: "#111", border: "1px solid #1e1e1e", color: "#555", borderRadius: 20, padding: "4px 10px", fontSize: 10, fontFamily: "'DM Sans',sans-serif", transition: "all 0.18s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#E8002D55"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#1e1e1e"; e.currentTarget.style.color = "#555"; }}>
            {q}
          </button>
        ))}
      </div>

      <div style={{ position: "sticky", bottom: 0, background: "linear-gradient(180deg,transparent,#08090A 30%)", paddingBottom: 16, paddingTop: 8 }}>
        <div style={{ display: "flex", gap: 8, background: "#111", border: "1px solid #E8002D33", borderRadius: 12, padding: 6 }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && onSend()}
            placeholder="Ask anything about F1..."
            style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#fff", fontSize: 13, padding: "6px 8px", fontFamily: "'DM Sans',sans-serif" }} />
          <button onClick={onSend} disabled={loading || !input.trim()}
            style={{ background: loading || !input.trim() ? "#1a1a1a" : "linear-gradient(135deg,#E8002D,#7a0010)", border: "none", borderRadius: 8, width: 36, height: 36, color: "#fff", fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.18s", opacity: loading || !input.trim() ? 0.4 : 1, boxShadow: loading || !input.trim() ? "none" : "0 0 12px #E8002D55" }}>
            {loading ? "⏳" : "▶"}
          </button>
        </div>
      </div>
    </div>
  );
}
