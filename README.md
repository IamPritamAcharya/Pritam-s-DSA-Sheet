# Pritam's DSA Sheet — Problem Tracker

A modern, high-performance DSA (Data Structures & Algorithms) problem tracker with persistent progress tracking, a beautiful UI, and full mobile support.

![Preview](./public/preview.png)

## Live Demo

🚀 [**pritam-s-dsa-sheet.vercel.app**](https://iampritamacharya.github.io/Pritam-s-DSA-Sheet) *(GitHub Pages)*

---

## Features

- **📋 Multiple Sheets** — Organize problems by sheet (e.g., *Problem Solving*, *Interview Prep*), each with its own progress
- **✅ Progress Tracking** — Tick off solved problems; progress persists in `localStorage` (per sheet, survives browser restarts)
- **📊 Visual Progress** — SVG ring chart + per-topic progress bars in a right-side panel; floating FAB on mobile that opens a bottom sheet
- **⚡ Instant Load** — All sheet data is bundled at build time via Vite `import.meta.glob` — zero GitHub API calls, zero network latency
- **🎨 Modern UI** — Space Grotesk + JetBrains Mono typography, glassmorphism cards, smooth micro-animations
- **🌌 Three.js Hero** — Interactive particle canvas with connection lines and wireframe 3D shapes inside the hero section
- **🌧️ Ambient Background** — Subtle rain/frost animated canvas behind all content
- **🌓 Dark / Light Mode** — Persisted theme toggle
- **📱 Fully Responsive** — Mobile-first layout with slide-in sidebar, mobile progress bottom sheet
- **🖱️ Custom Cursor** — Lerp-smooth dot + ring cursor on desktop (hidden on touch devices)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build Tool | Vite 4 |
| 3D Graphics | Three.js |
| Styling | Vanilla CSS (no Tailwind) |
| Fonts | Inter, Space Grotesk, JetBrains Mono (Google Fonts) |
| Deployment | GitHub Pages (`gh-pages`) |

---

## Project Structure

```
src/
├── components/
│   ├── Layout/          # Header, Sidebar, Layout wrapper
│   ├── CustomCursor.tsx # Smooth lerp cursor (desktop only)
│   ├── HeroSection.tsx  # Three.js hero card
│   ├── RainBackground.tsx # Full-page rain/frost canvas
│   ├── ThreeCanvas.tsx  # Three.js canvas (used in hero)
│   └── Spinner / EmptyState
├── features/
│   ├── sheets/
│   │   ├── localSheets.ts  # Vite import.meta.glob — bundles sheets/*.txt
│   │   ├── parser.ts       # CSV parser → TopicGroup[]
│   │   └── hooks/useSheets.ts
│   ├── problems/
│   │   ├── ProblemCard.tsx  # Card with checkbox + 3D tilt
│   │   └── TopicGroup.tsx   # Accordion with micro progress bar
│   ├── progress/
│   │   ├── useProgress.ts   # localStorage hook (per sheet)
│   │   └── ProgressPanel.tsx + MobileProgressButton
│   └── theme/
│       └── ThemeProvider.tsx
└── data/
    └── siteContent.json     # All static page text
```

---

## Adding a New Sheet

1. Create a `.txt` file in `sheets/` — e.g., `sheets/Dynamic Programming.txt`
2. Format: one problem per line, CSV `URL,Topic,Difficulty`
3. `Difficulty` can be `easy`, `medium`, or `hard`
4. Platform is auto-detected from URL (`leetcode.com` → LeetCode, `geeksforgeeks.org` → GFG)

**Example:**
```
https://leetcode.com/problems/climbing-stairs/,Dynamic Programming,easy
https://leetcode.com/problems/coin-change/,Dynamic Programming,medium
https://leetcode.com/problems/edit-distance/,Dynamic Programming,hard
```

The new sheet appears automatically in the sidebar on the next build — no code changes needed.

---

## Local Development

```bash
# Clone
git clone https://github.com/IamPritamAcharya/Pritam-s-DSA-Sheet.git
cd Pritam-s-DSA-Sheet

# Install dependencies
npm install

# Start dev server
npm run dev
# → http://localhost:5173/Pritam-s-DSA-Sheet/
```

---

## Deployment (GitHub Pages)

```bash
npm run deploy
```

This runs `npm run build` then `gh-pages -d dist` which pushes the `dist/` folder to the `gh-pages` branch.

**GitHub Pages setup:**
1. Go to repo **Settings → Pages**
2. Set source to branch `gh-pages`, folder `/root`
3. Save — your site will be live at `https://<username>.github.io/Pritam-s-DSA-Sheet/`

Alternatively, the included **GitHub Actions** workflow (`.github/workflows/deploy.yml`) auto-deploys on every push to `main`.

---

## Progress Data

Progress is stored exclusively in the browser's `localStorage` — no backend, no account needed. Data format:

```json
{
  "progress:Problem Solving": {
    "https://leetcode.com/problems/two-sum/": true,
    "https://leetcode.com/problems/climbing-stairs/": true
  }
}
```

Each sheet's data is keyed separately so clearing one sheet's progress doesn't affect others.

---

## Customizing UI Text

Edit `src/data/siteContent.json` to change labels, the app name, and other static strings without touching component code.

---

## License

MIT © [Pritam Acharya](https://github.com/IamPritamAcharya)
