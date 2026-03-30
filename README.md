# Pritam's DSA Sheet — Problem Tracker

A high-performance Data Structures and Algorithms (DSA) problem tracker designed for efficient learning, structured practice, and persistent progress tracking. The application delivers a modern user experience with optimized performance and full mobile responsiveness.

---

## Preview

![Application Preview](https://github.com/IamPritamAcharya/Pritam-s-DSA-Sheet/blob/main/src/assets/page.png)

---

## Live Application

**Deployed URL:**
[https://iampritamacharya.github.io/SolveStack/](https://iampritamacharya.github.io/SolveStack/)

---


## Overview

Pritam's DSA Sheet is built to help developers systematically track and solve DSA problems across multiple curated sheets. It eliminates the need for external tools by providing built-in progress tracking, visualization, and seamless navigation across problem sets.

---

## Key Features

### Structured Problem Organization

* Supports multiple sheets (e.g., Problem Solving, Interview Preparation)
* Each sheet maintains independent progress tracking

### Persistent Progress Tracking

* Track solved problems using a simple checkbox interface
* Progress is stored in browser localStorage
* Data persists across sessions without requiring authentication

### Visual Progress Insights

* Circular SVG progress indicator for overall completion
* Topic-wise progress bars for granular tracking
* Dedicated progress panel with mobile-friendly bottom sheet

### Optimized Performance

* All sheet data is bundled at build time using Vite
* No dependency on external APIs
* Instant load with zero network latency

### Modern User Interface

* Clean typography using Inter, Space Grotesk, and JetBrains Mono
* Glassmorphism-based card design
* Smooth animations and transitions

### Interactive Visual Elements

* Three.js-powered hero section with particle effects and 3D elements
* Ambient animated background for enhanced visual experience

### Theme Support

* Light and dark mode support
* User preference persisted across sessions

### Responsive Design

* Fully optimized for mobile, tablet, and desktop
* Mobile-specific UI components including slide-in navigation and bottom sheets

### Enhanced User Interaction

* Custom cursor for desktop users with smooth interpolation
* Disabled automatically on touch devices

---

## Technology Stack

| Layer      | Technology                           |
| ---------- | ------------------------------------ |
| Framework  | React 18 with TypeScript             |
| Build Tool | Vite                                 |
| Graphics   | Three.js                             |
| Styling    | Vanilla CSS                          |
| Fonts      | Inter, Space Grotesk, JetBrains Mono |
| Deployment | GitHub Pages (gh-pages)              |

---

## Project Structure

```
src/
├── components/
│   ├── Layout/
│   ├── CustomCursor.tsx
│   ├── HeroSection.tsx
│   ├── RainBackground.tsx
│   ├── ThreeCanvas.tsx
│   └── Spinner / EmptyState
├── features/
│   ├── sheets/
│   │   ├── localSheets.ts
│   │   ├── parser.ts
│   │   └── hooks/useSheets.ts
│   ├── problems/
│   │   ├── ProblemCard.tsx
│   │   └── TopicGroup.tsx
│   ├── progress/
│   │   ├── useProgress.ts
│   │   └── ProgressPanel.tsx
│   └── theme/
│       └── ThemeProvider.tsx
└── data/
    └── siteContent.json
```

---

## Adding a New Sheet

To add a new problem sheet:

1. Create a `.txt` file inside the `sheets/` directory
   Example: `sheets/Dynamic Programming.txt`

2. Use CSV format:

   ```
   URL,Topic,Difficulty
   ```

3. Example:

   ```
   https://leetcode.com/problems/climbing-stairs/,Dynamic Programming,easy
   https://leetcode.com/problems/coin-change/,Dynamic Programming,medium
   https://leetcode.com/problems/edit-distance/,Dynamic Programming,hard
   ```

4. Supported difficulty values:

   * easy
   * medium
   * hard

5. Platform detection is automatic based on URL.

The new sheet will be available automatically after the next build.

---

## Local Development

```bash
git clone https://github.com/IamPritamAcharya/Pritam-s-DSA-Sheet.git
cd Pritam-s-DSA-Sheet

npm install
npm run dev
```

Access the application at:

```
http://localhost:5173/Pritam-s-DSA-Sheet/
```

---

## Deployment

To deploy using GitHub Pages:

```bash
npm run deploy
```

### Manual Setup

1. Navigate to repository Settings → Pages
2. Set source to:

   * Branch: `gh-pages`
   * Folder: `/root`
3. Save changes

### Automated Deployment

A GitHub Actions workflow is included to automatically deploy on every push to the `main` branch.

---

## Data Persistence

Progress is stored locally in the browser using `localStorage`.

Example format:

```json
{
  "progress:Problem Solving": {
    "https://leetcode.com/problems/two-sum/": true,
    "https://leetcode.com/problems/climbing-stairs/": true
  }
}
```

* Data is stored per sheet
* No backend or authentication required
* Clearing browser storage will reset progress

---

## UI Customization

Static content such as labels, headings, and application text can be modified via:

```
src/data/siteContent.json
```

This allows customization without modifying component logic.


