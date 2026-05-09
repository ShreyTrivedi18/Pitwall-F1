# 🏎️ PIT WALL — F1 AI Analyst (Gemini Edition)

Real-time F1 AI tool powered by **Google Gemini 1.5 Flash (FREE)** + live race data.

**Free APIs used:**
- [OpenF1](https://openf1.org) — live telemetry, positions, weather
- [Jolpica](https://jolpi.ca) — standings, results, calendar
- [Google Gemini](https://aistudio.google.com) — AI chat (FREE, 1500 req/day)

---

## 🚀 Setup in 5 Steps

### 1. Install dependencies
```bash
cd pitwall-gemini
npm install
```

### 2. Add your Gemini API key
```bash
cp .env.example .env.local
```
Open `.env.local` and replace the placeholder:
```
GEMINI_API_KEY=AIzaSy_your_actual_key_here
```

### 3. Test locally with Vercel Dev (recommended)
```bash
npm install -g vercel
vercel dev
```
This runs both the React app AND the `/api/chat` proxy locally.
Open → http://localhost:3000

### 4. Push to GitHub
```bash
git init
git add .
git commit -m "PIT WALL F1 AI — Gemini Edition"
```
Create a repo on github.com, then:
```bash
git remote add origin https://github.com/YOUR_USERNAME/pitwall.git
git push -u origin main
```

### 5. Deploy on Vercel
1. Go to https://vercel.com → "Add New Project" → Import your repo
2. Click **Deploy** (Vercel auto-detects Vite)
3. Go to **Settings → Environment Variables → Add New:**
   - Name:  `GEMINI_API_KEY`
   - Value: `AIzaSy_your_actual_key_here`
4. Go to **Deployments → Redeploy**

✅ Your app is live at `https://pitwall.vercel.app`

---

## 🗂️ Project Structure
```
pitwall-gemini/
├── api/
│   └── chat.js          ← Secure Gemini proxy (key never in browser)
├── src/
│   ├── App.jsx          ← Root, data orchestration
│   ├── api.js           ← OpenF1 + Jolpica + Gemini calls
│   ├── teamColors.js    ← Team color utility
│   ├── index.css
│   ├── main.jsx
│   └── components/
│       ├── shared.jsx
│       ├── Dashboard.jsx
│       ├── Drivers.jsx
│       ├── Teams.jsx
│       ├── Schedule.jsx
│       └── Chat.jsx
├── index.html
├── vite.config.js
├── vercel.json
├── package.json
└── .env.example
```

---

## 🔐 Security
Your `GEMINI_API_KEY` is stored as a **Vercel environment variable** and only used inside `api/chat.js` on Vercel's servers. The browser never sees it.

## 🔄 Real-Time Refresh
- Live positions, weather, session data → refreshes every **30 seconds**
- Standings and results → loaded on page load
- AI chat gets live context injected automatically with every message
