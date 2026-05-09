import { useState, useEffect, useCallback, useRef } from "react";
import {
  getLiveSession, getLivePositions, getLiveDrivers, getLiveWeather,
  getDriverStandings, getConstructorStandings, getSchedule, getRecentResults,
  askGemini,
} from "./api.js";
import { LiveBadge } from "./components/shared.jsx";
import Dashboard from "./components/Dashboard.jsx";
import Drivers   from "./components/Drivers.jsx";
import Teams     from "./components/Teams.jsx";
import Schedule  from "./components/Schedule.jsx";
import Chat      from "./components/Chat.jsx";

const TABS = [
  { id: "dashboard", label: "HOME" },
  { id: "drivers",   label: "DRIVERS" },
  { id: "teams",     label: "TEAMS" },
  { id: "schedule",  label: "CALENDAR" },
  { id: "chat",      label: "🎙 AI" },
];

export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [driverStandings,      setDriverStandings]      = useState([]);
  const [constructorStandings, setConstructorStandings] = useState([]);
  const [schedule,             setSchedule]             = useState([]);
  const [raceResults,          setRaceResults]          = useState([]);
  const [nextRace,             setNextRace]             = useState(null);
  const [loadingStatic,        setLoadingStatic]        = useState(true);
  const [liveSession,          setLiveSession]          = useState(null);
  const [livePositions,        setLivePositions]        = useState([]);
  const [liveDrivers,          setLiveDrivers]          = useState([]);
  const [liveWeather,          setLiveWeather]          = useState(null);
  const [lastUpdated,          setLastUpdated]          = useState(null);
  const [messages, setMessages] = useState([{
    role: "assistant",
    content: "Welcome to PIT WALL 🏎️\n\nI'm your live F1 AI analyst powered by Gemini, connected to real-time race data.\n\nAsk me anything — race strategy, driver comparisons, tire compounds, what's happening on track right now, or championship analysis!",
  }]);
  const [chatInput,   setChatInput]   = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const liveTimer = useRef(null);

  const fetchStatic = useCallback(async () => {
    const [ds, cs, sched, results] = await Promise.all([
      getDriverStandings(), getConstructorStandings(), getSchedule(), getRecentResults(5),
    ]);
    setDriverStandings(ds);
    setConstructorStandings(cs);
    setSchedule(sched);
    setRaceResults(results);
    if (sched.length) {
      const now  = new Date();
      const next = sched.find(r => new Date(r.date) >= now);
      if (next) setNextRace(next);
    }
    setLoadingStatic(false);
  }, []);

  const fetchLive = useCallback(async () => {
    const session = await getLiveSession();
    setLiveSession(session);
    if (session) {
      const [pos, drivers, weather] = await Promise.all([
        getLivePositions(session.session_key),
        getLiveDrivers(session.session_key),
        getLiveWeather(session.session_key),
      ]);
      setLivePositions(pos);
      setLiveDrivers(drivers);
      setLiveWeather(weather);
    }
    setLastUpdated(new Date());
  }, []);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel  = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;900&family=DM+Sans:wght@300;400;500&family=Share+Tech+Mono&display=swap";
    document.head.appendChild(link);
    fetchStatic();
    fetchLive();
    liveTimer.current = setInterval(fetchLive, 30_000);
    return () => clearInterval(liveTimer.current);
  }, []);

  const buildLiveContext = () => [
    driverStandings.length && `Driver Standings Top 5: ${driverStandings.slice(0,5).map(d=>`${d.position}. ${d.Driver.familyName} (${d.points}pts)`).join(", ")}`,
    constructorStandings.length && `Constructor Standings: ${constructorStandings.slice(0,4).map(c=>`${c.position}. ${c.Constructor.name} (${c.points}pts)`).join(", ")}`,
    nextRace && `Next Race: ${nextRace.raceName} at ${nextRace.Circuit?.circuitName} on ${nextRace.date}`,
    liveSession && `Live Session: ${liveSession.session_name} at ${liveSession.circuit_short_name} (${liveSession.country_name})`,
    liveWeather && `Weather: Air ${liveWeather.air_temperature}°C, Track ${liveWeather.track_temperature}°C${liveWeather.rainfall > 0 ? " — RAIN" : ""}`,
    livePositions.length && `Current P1-P3: ${livePositions.slice(0,3).map(p=>{const d=liveDrivers.find(x=>x.driver_number===p.driver_number);return `P${p.position} ${d?.last_name||"#"+p.driver_number}`;}).join(", ")}`,
  ].filter(Boolean).join("\n");

  const sendMessage = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const userMsg = { role: "user", content: chatInput.trim() };
    setMessages(prev => [...prev, userMsg]);
    setChatInput("");
    setChatLoading(true);
    try {
      const history = [...messages, userMsg].map(m => ({ role: m.role, content: m.content }));
      const reply   = await askGemini(history, buildLiveContext());
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: "assistant", content: `⚠️ Radio check failed: ${e.message}` }]);
    }
    setChatLoading(false);
  };

  const onAskAI = (q) => { setTab("chat"); setChatInput(q); };

  return (
    <div style={{ minHeight: "100vh", background: "#08090A", color: "#fff", fontFamily: "'DM Sans',sans-serif", maxWidth: 430, margin: "0 auto" }}>
      <style>{`
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:0.35} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideIn { from{opacity:0;transform:translateX(-5px)} to{opacity:1;transform:translateX(0)} }
        button:focus { outline: none; }
      `}</style>

      {/* HEADER */}
      <div style={{ background: "#0a0b0c", borderBottom: "1px solid #1a1a1a", padding: "14px 18px 10px", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ background: "#E8002D", padding: "3px 9px", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 15, letterSpacing: 2, clipPath: "polygon(0 0,calc(100% - 5px) 0,100% 100%,5px 100%)" }}>F1</div>
            <div>
              <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 17, letterSpacing: 1 }}>PIT WALL</div>
              <div style={{ color: "#2a2a2a", fontSize: 8, letterSpacing: 2, fontFamily: "'Share Tech Mono',monospace" }}>LIVE AI ANALYST · GEMINI · {new Date().getFullYear()}</div>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <LiveBadge text={liveSession ? liveSession.session_name?.toUpperCase() : "CONNECTED"} />
            {lastUpdated && <div style={{ color: "#2a2a2a", fontSize: 8, fontFamily: "monospace", marginTop: 2 }}>UPD {lastUpdated.toLocaleTimeString()}</div>}
          </div>
        </div>
        <div style={{ display: "flex", gap: 3 }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{ flex: 1, padding: "5px 2px", background: tab === t.id ? "#E8002D" : "transparent", border: tab === t.id ? "none" : "1px solid #1e1e1e", color: tab === t.id ? "#fff" : "#444", borderRadius: 4, fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: 0.8, transition: "all 0.18s" }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ padding: "0 16px 20px", overflowY: "auto" }}>
        {tab === "dashboard" && <Dashboard driverStandings={driverStandings} raceResults={raceResults} nextRace={nextRace} liveSession={liveSession} livePositions={livePositions} liveDrivers={liveDrivers} liveWeather={liveWeather} loading={loadingStatic} onAskAI={onAskAI} />}
        {tab === "drivers"   && <Drivers   standings={driverStandings}      loading={loadingStatic} onAskAI={onAskAI} />}
        {tab === "teams"     && <Teams     standings={constructorStandings} loading={loadingStatic} onAskAI={onAskAI} />}
        {tab === "schedule"  && <Schedule  schedule={schedule} nextRace={nextRace} loading={loadingStatic} />}
        {tab === "chat"      && <Chat      messages={messages} input={chatInput} setInput={setChatInput} onSend={sendMessage} loading={chatLoading} />}
      </div>
    </div>
  );
}
