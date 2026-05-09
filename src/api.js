// src/api.js — OpenF1, Jolpica, and Gemini proxy

const OPENF1  = "https://api.openf1.org/v1";
const JOLPICA = "https://api.jolpi.ca/ergast/f1";

async function get(url) {
  try {
    const r = await fetch(url);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return await r.json();
  } catch (e) {
    console.warn("[API]", url, e.message);
    return null;
  }
}

async function getJolpica(path) {
  const data = await get(`${JOLPICA}${path}.json`);
  return data?.MRData ?? null;
}

// ── OpenF1 live data ──────────────────────────────────────────
export async function getLiveSession() {
  const data = await get(`${OPENF1}/sessions?session_key=latest`);
  return data?.[0] ?? null;
}

export async function getLivePositions(sessionKey) {
  const since = new Date(Date.now() - 90_000).toISOString();
  const data  = await get(`${OPENF1}/position?session_key=${sessionKey}&date>${since}`);
  if (!data?.length) return [];
  const latest = {};
  data.forEach(p => {
    if (!latest[p.driver_number] || p.date > latest[p.driver_number].date)
      latest[p.driver_number] = p;
  });
  return Object.values(latest).sort((a, b) => a.position - b.position);
}

export async function getLiveDrivers(sessionKey) {
  return (await get(`${OPENF1}/drivers?session_key=${sessionKey}`)) ?? [];
}

export async function getLiveWeather(sessionKey) {
  const data = await get(`${OPENF1}/weather?session_key=${sessionKey}`);
  return data?.length ? data[data.length - 1] : null;
}

// ── Jolpica season data ───────────────────────────────────────
export async function getDriverStandings() {
  const d = await getJolpica("/current/driverStandings");
  return d?.StandingsTable?.StandingsLists?.[0]?.DriverStandings ?? [];
}

export async function getConstructorStandings() {
  const d = await getJolpica("/current/constructorStandings");
  return d?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings ?? [];
}

export async function getSchedule() {
  const d = await getJolpica("/current");
  return d?.RaceTable?.Races ?? [];
}

export async function getRecentResults(limit = 5) {
  const d = await getJolpica("/current/results");
  const races = d?.RaceTable?.Races ?? [];
  return races.slice(-limit).reverse();
}

// ── Gemini via secure Vercel proxy ────────────────────────────
export async function askGemini(messages, liveContext = "") {
  const r = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, liveContext }),
  });
  if (!r.ok) {
    const err = await r.json().catch(() => ({}));
    throw new Error(err.error ?? `Proxy error ${r.status}`);
  }
  const data = await r.json();
  return data.reply ?? "No response.";
}
