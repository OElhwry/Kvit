<h1 align="center">
  <img src="splidit\public\og.png" width="800" alt="SplidIt">
  <br>
  SplidIt
</h1>

<p align="center">
  <b>Call it even.</b><br>
  A no-account, browser-only expense splitter that finds the shortest path to settled.<br>
  Three split modes, minimum-transactions settlement, and shareable receipts in seconds.
</p>

<p align="center">
  <a href="https://splidit.co.uk"><img src="https://img.shields.io/badge/live-splidit.co.uk-34d399?style=for-the-badge" alt="Live website"></a>
  <a href ="https://github.com/OElhwry/SplidIt/releases/tag/v.1.0.1"><img src="https://img.shields.io/badge/version-1.0.1-6ee7b7?style=for-the-badge" alt="Version 1.0.1"></a>
  <img src="https://img.shields.io/badge/no%20account-required-10b981?style=for-the-badge" alt="No account required">
  <img src="https://img.shields.io/badge/license-MIT-737373?style=for-the-badge" alt="MIT">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/react-19-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React 19">
  <img src="https://img.shields.io/badge/vite-8-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite 8">
  <img src="https://img.shields.io/badge/framer%20motion-12-0055FF?style=flat-square&logo=framer&logoColor=white" alt="Framer Motion 12">
  <img src="https://img.shields.io/badge/lucide-icons-34d399?style=flat-square&logo=lucide&logoColor=white" alt="Lucide">
  <img src="https://img.shields.io/badge/html2canvas-lazy%20loaded-f59e0b?style=flat-square" alt="html2canvas lazy">
  <img src="https://img.shields.io/badge/github%20pages-deployed-181717?style=flat-square&logo=github&logoColor=white" alt="GitHub Pages">
</p>

<p align="center">
  <a href="#what-it-does">What it does</a> ·
  <a href="#split-modes">Split modes</a> ·
  <a href="#tech-stack">Tech stack</a> ·
  <a href="#getting-started">Getting started</a> ·
  <a href="#privacy-and-data">Privacy</a> ·
  <a href="#design-and-tooling">Design</a> ·
  <a href="#roadmap">Roadmap</a>
</p>

---

## The problem

Splitting a group bill takes more time than the meal that caused it. Splitwise is overkill for a one-off court hire or a single dinner. Notes-app math gets messy the moment people pre-paid different amounts. And when the booking was time-based, padel, tennis, an hourly studio rental, equal splits feel unfair if one player only showed up for the second half.

## The solution

A pure-frontend expense splitter with three modes, a minimum-transactions settlement algorithm, and a participation-aware time-based split for shared activity bookings. No account, no server, no data leaving your browser unless you explicitly share. Live updates as you type, motion-rich UI, and a shareable receipt that exports as text, image, or URL.

---

## What it does

### Split modes

| Mode | What it does | Best for |
|---|---|---|
| **Equal** | Total divided by N people | Dinners, group cabs, shared groceries |
| **Custom %** | Each person sets a percentage; live progress bar enforces 100% | Uneven contributions, weighted shares |
| **By Time** | Each person pays in proportion to minutes used vs the booking duration | Padel courts, tennis sessions, hourly rentals |

### Minimum-transactions settlement

Greedy debtor-to-creditor matching: pairs the largest debt with the largest credit, settles the overlap, repeats. The result is the smallest possible number of transfers to leave the group square.

### Time-based participation timeline

In **By Time** mode, each person gets a touch-friendly slider (0 to session length) with quick presets — `Full · ¾ · ½ · ¼`. A visual timeline shows everyone's relative participation as colour-coded bars, plus a fairness strip showing each person's saving (or extra cost) versus a flat equal split.

### Three ways to share

| Method | Output |
|---|---|
| **Text** | Plain summary copied to clipboard — paste into any chat |
| **Image** | Branded receipt PNG via `html2canvas` (lazy-loaded; ~47KB gz, only fetched when you click) |
| **Link** | Base64-encoded state in a URL — opens with the same split for the recipient |

### Persistence

State auto-saves to `localStorage` on every change (debounced 250ms) and rehydrates on revisit. Shared URLs override saved state. A one-tap **Clear and start fresh** wipes everything without confirmation.

### Built for hands

* 22px touch-friendly slider thumbs with grab/grabbing cursors
* Mobile-first 520px-max layout, glassmorphic cards, layered radial gradients
* `:focus-visible` outlines on every interactive control
* Mode picker is a proper ARIA `tablist` with arrow-key navigation
* Sliders announce position via screen reader (`aria-valuetext="45m of 90m"`)
* Toast announcements use `role="status" aria-live="polite"`
* Respects `prefers-reduced-motion` for count-up animations

---

## Tech stack

<table>
<tr>
  <th align="left">Layer</th>
  <th align="left">Choice</th>
  <th align="left">Why</th>
</tr>
<tr>
  <td><b>UI</b></td>
  <td>React 19</td>
  <td>Hooks, modern concurrent features, no extra deps</td>
</tr>
<tr>
  <td><b>Build</b></td>
  <td>Vite 8</td>
  <td>Sub-second HMR, ESM-native, automatic code-splitting for the export library</td>
</tr>
<tr>
  <td><b>Motion</b></td>
  <td>Framer Motion 12</td>
  <td>Layout transitions, count-up motion values, <code>layoutId</code> tab indicator, reduced-motion aware</td>
</tr>
<tr>
  <td><b>Styling</b></td>
  <td>Custom CSS via injected <code>&lt;style&gt;</code></td>
  <td>No framework, design tokens via CSS vars, glassmorphism with <code>backdrop-filter</code> where supported</td>
</tr>
<tr>
  <td><b>Icons</b></td>
  <td>Lucide React</td>
  <td>Consistent stroke-based set, tree-shakable per-icon import</td>
</tr>
<tr>
  <td><b>Image export</b></td>
  <td>html2canvas (lazy)</td>
  <td>Dynamic <code>import()</code> — only fetched when the user clicks "Image"; drops 47KB off initial bundle</td>
</tr>
<tr>
  <td><b>Hosting</b></td>
  <td>GitHub Pages</td>
  <td>Static, free, fits a no-backend SPA</td>
</tr>
<tr>
  <td><b>Persistence</b></td>
  <td><code>localStorage</code> + URL params</td>
  <td>Versioned key (<code>splidit:state:v1</code>), debounced writes, base64 URL state for sharing</td>
</tr>
</table>

### Repo layout

```
SplitFare/
├── docs/                   # built output — served by GitHub Pages at splidit.co.uk
│   ├── assets/
│   ├── index.html
│   ├── favicon.svg
│   ├── og.html             # OG card template (screenshot to produce og.png)
│   ├── robots.txt
│   └── sitemap.xml
└── splidit/                # source
    ├── public/
    │   ├── favicon.svg
    │   ├── splidit.png     # icon / favicon
    │   ├── og.html         # OG card design (1200x630 screenshot template)
    │   ├── robots.txt
    │   └── sitemap.xml
    └── src/
        ├── lib/
        │   ├── calc.js         # pure split and settlement helpers
        │   └── calc.test.js    # unit tests
        ├── App.jsx             # full app — components, CSS, logic
        ├── index.css           # base reset
        └── main.jsx            # React entry
```

A deliberate single-file component model: all the CSS, helpers, and components live in `App.jsx` so the whole app reads top-to-bottom. ~2,200 LOC at v1.0.

### Bundle

```
dist/assets/index.js         ~120KB gz   ← React + Framer Motion + app
dist/assets/html2canvas.js    ~47KB gz   ← lazy-loaded on Image export only
```

---

## Getting started

### Prerequisites

* Node.js 18 or later
* npm

### Local dev

```bash
git clone https://github.com/OElhwry/SplidIt.git
cd SplidIt/splidit
npm install
npm run dev      # → http://localhost:5173/
```

### Production build

```bash
npm run build    # → ../docs (two chunks, ready for GitHub Pages)
npm run preview  # local preview of the built bundle
```

### Useful scripts

```bash
npm run lint     # ESLint with React-hooks and react-refresh rules
npm run build    # production build (main + html2canvas chunks)
npm run preview  # preview the prod build locally
npm test         # run unit tests via Vitest
```

---

## Privacy and data

| | Stored |
|---|---|
| Your device only (`localStorage`) | The split you are working on — people, amounts, durations, mode |
| In a URL (only if you share a link) | Base64-encoded state in `?data=...` — never sent to any server |
| Never collected | Account info, analytics, telemetry, cookies, third-party trackers |
| Third parties | None — SplidIt talks to nothing. Static site, zero network traffic beyond the initial load. |

Reset everything with the **Clear and start fresh** button at the bottom of the app.

---

## Design and tooling

| Tool | Used for |
|---|---|
| [**Framer Motion**](https://www.framer.com/motion/) | Page reveals on scroll, count-up balances, animated mode-tab indicator (`layoutId`), settled-up burst, slider springs |
| [**Lucide React**](https://lucide.dev) | All inline SVG icons (no emoji, no icon-font weight) |
| [**Inter**](https://rsms.me/inter/) · [**JetBrains Mono**](https://www.jetbrains.com/lp/mono/) | Sans and tabular-numerals monospace |
| [**Coolors**](https://coolors.co) | Emerald gradient palette tuning |
| [**GitHub Pages**](https://pages.github.com) · [**Vite**](https://vitejs.dev) | Static hosting and build pipeline |

**Brand identity:** emerald `#34d399` to deep `#10b981` on a dark green-black `#060c08` canvas. Cursor-follow glow, layered radial gradients, and a soft dot-grid mask provide depth without busyness. Dark-first by design — same family resemblance as the portfolio page.

### Built with Claude

This project — every line of JSX, the calculation logic, the CSS, the motion choreography, the share-card design, even this README — was built in collaboration with **[Claude](https://claude.ai)** ([Anthropic](https://www.anthropic.com)) using **[Claude Code](https://www.anthropic.com/claude-code)**. The By Time mode, the polish pass that took the app from a basic form to a portfolio piece, and the engineering decisions around persistence, lazy-loading, and accessibility were all worked out in conversation.

---

## Roadmap

* [x] **MV1** — Equal + Custom % modes · settlements algorithm · text/image/link share · GitHub Pages
* [x] **v1.0** — By Time mode with timeline · emerald revamp · Framer Motion choreography · `localStorage` persistence · lazy-loaded image export · ARIA tablist mode picker · branded receipt card · first-visit pulse
* [ ] **v1.1** — Currency selector · multi-split history · keyboard shortcuts · per-person notes
* [ ] **v2** — Sub-splits within a single bill · saved groups · per-person discount/tax adjustments · CSV export

---

## Why it stands out

* **Time-based split** — a mode designed for the specific friction of shared activity bookings (padel, tennis, hourly courts) that no general-purpose splitter handles cleanly
* **Settlements algorithm** — minimum-transactions greedy matching, not naive pairwise transfers
* **No backend** — works offline, no signup, no telemetry, no third-party calls; everything client-side
* **Polish discipline** — count-up numbers, sliding tab indicators, `layoutId`-driven morphing, draw-in settlement arrows, springy thumbs, settled-state burst, first-visit pulse hint
* **Accessibility taken seriously** — `aria-valuetext` on sliders, `role="tablist"` mode picker with arrow-key navigation, live regions for toasts, focus-visible outlines, reduced-motion respect
* **Engineering signals** — code-split bundle (initial 120KB gz, deferred 47KB gz), debounced versioned persistence, URL-state restoration, html2canvas-safe receipt design

---

<p align="center">
  <a href="https://splidit.co.uk"><b>splidit.co.uk</b></a> ·
  <a href="https://github.com/OElhwry/SplidIt"><b>GitHub</b></a>
</p>

<p align="center">
  <sub>Built as a portfolio piece · used to settle every group dinner since.</sub>
</p>
