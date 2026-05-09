// api/chat.js
// Vercel Edge Serverless Function — Gemini API proxy.
// Your GEMINI_API_KEY lives only on Vercel's servers. Browser never sees it.

export const config = { runtime: "edge" };

const SYSTEM_PROMPT = `You are PIT WALL — an elite F1 AI race engineer and analyst. You have deep expertise in:
- F1 race strategy, pit stops, tire compounds (Pirelli Soft/Medium/Hard/Intermediate/Wet)
- Driver standings, performance analytics, lap times, sector data
- Constructor championship battles, car development, aerodynamics
- Race history, records, technical regulations (DRS, parc fermé, safety car rules)
- Driver personalities, team dynamics, paddock news and transfers

Always respond with energy and passion like a real F1 pundit on Sky Sports F1. Keep answers insightful and accurate. For casual fans, explain jargon clearly. For experts, go deep technical. Use emojis occasionally 🏎️🔴🏁. Never fabricate specific race results — if unsure, say so clearly.`;

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "GEMINI_API_KEY not set on server. Add it in Vercel → Settings → Environment Variables." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { messages = [], liveContext = "" } = body;

  // Build Gemini contents array from chat history
  // Gemini uses "user" / "model" roles (not "assistant")
  const contents = messages.map(m => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  // Inject live context into the last user message if present
  if (liveContext && contents.length > 0) {
    const last = contents[contents.length - 1];
    if (last.role === "user") {
      last.parts[0].text += `\n\n[LIVE DATA]\n${liveContext}`;
    }
  }

  const geminiPayload = {
    system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
    contents,
    generationConfig: {
      maxOutputTokens: 1000,
      temperature: 0.75,
    },
  };

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(geminiPayload),
      }
    );

    if (!geminiRes.ok) {
      const err = await geminiRes.text();
      return new Response(
        JSON.stringify({ error: `Gemini API error ${geminiRes.status}`, detail: err }),
        { status: geminiRes.status, headers: { "Content-Type": "application/json" } }
      );
    }

    const data = await geminiRes.json();
    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ??
      "No response from Gemini.";

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Internal server error", detail: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
