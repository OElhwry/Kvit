import { useState, useRef, useEffect } from "react";
import html2canvas from "html2canvas";
import { FileText, Link, Image as ImageIcon, Check, Plus, ArrowRight, Sun, Moon } from "lucide-react";

// ════════════════════════════════════════════════════════════════
//  PARTA  —  "Clear debts. Keep friends."
//
//  Palette (Stripe-inspired light fintech):
//    #EEF2FA  page background
//    #FFFFFF  card surface
//    #5C67F5  primary  (electric violet)
//    #10B981  green    (emerald — creditor)
//    #F43F5E  red      (rose    — debtor)
//    #0F172A  text     (near-black)
//    #64748B  text-2   (secondary)
// ════════════════════════════════════════════════════════════════

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg:          #EEF2FA;
  --surface:     #FFFFFF;
  --surface-2:   #F7F9FC;
  --border:      #E2E8F0;
  --border-2:    #CBD5E1;
  --primary:     #5C67F5;
  --primary-dim: #EDEFFF;
  --primary-dk:  #4852E8;
  --green:       #10B981;
  --green-dim:   #D1FAE5;
  --red:         #F43F5E;
  --red-dim:     #FFE4E8;
  --text:        #0F172A;
  --text-2:      #64748B;
  --text-3:      #94A3B8;
  --shadow-sm:   0 1px 2px rgba(15,23,42,0.06);
  --shadow:      0 1px 3px rgba(15,23,42,0.08), 0 1px 2px rgba(15,23,42,0.04);
  --shadow-md:   0 4px 6px -1px rgba(15,23,42,0.08), 0 2px 4px -1px rgba(15,23,42,0.04);
  --font:        'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --mono:        'JetBrains Mono', ui-monospace, Consolas, monospace;
}

/* ── RESET conflicting index.css styles ───────────────────── */
html, body { background: var(--bg) !important; color: var(--text) !important; }
body {
  font-family: var(--font); font-size: 14px; line-height: 1.5;
  -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;
}
#root {
  width: auto !important; max-width: 100% !important;
  border: none !important; border-inline: none !important;
  text-align: left !important; display: block !important;
  background: transparent !important; min-height: 100vh;
}
h1, h2 { font-family: var(--font); font-size: inherit; font-weight: inherit; color: inherit; letter-spacing: inherit; margin: 0; }

/* ── PAGE ─────────────────────────────────────────────────── */
.pt { min-height: 100vh; background: var(--bg); padding-bottom: 80px; }
.pt-wrap { max-width: 480px; margin: 0 auto; padding: 0 16px; }

/* ── HEADER ───────────────────────────────────────────────── */
.pt-header { text-align: center; padding: 48px 0 32px; }
.pt-logo {
  display: inline-flex; align-items: center; gap: 10px; margin-bottom: 10px;
}
.pt-mark {
  width: 40px; height: 40px; border-radius: 12px;
  background: linear-gradient(140deg, #5C67F5 0%, #8B5CF6 55%, #A78BFA 100%);
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 4px 16px rgba(92,103,245,0.38);
  flex-shrink: 0; overflow: hidden;
}
.pt.dark .pt-mark { box-shadow: 0 4px 22px rgba(92,103,245,0.55); }
.pt-wordmark { font-size: 22px; font-weight: 700; color: var(--text); letter-spacing: -0.6px; }
.pt-tagline  { font-size: 14px; color: var(--text-2); }

/* ── SECTION LABEL ────────────────────────────────────────── */
.pt-lbl {
  font-size: 11px; font-weight: 600; letter-spacing: 0.09em;
  text-transform: uppercase; color: var(--text-3);
  margin: 0 0 8px 1px;
}

/* ── CARD ─────────────────────────────────────────────────── */
.pt-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px; padding: 20px;
  margin-bottom: 12px; box-shadow: var(--shadow);
}

/* ── FIELD ────────────────────────────────────────────────── */
.pt-field { margin-bottom: 14px; }
.pt-field:last-of-type { margin-bottom: 0; }
.pt-field-label {
  display: block; font-size: 12px; font-weight: 600;
  color: var(--text-2); margin-bottom: 6px; letter-spacing: 0.01em;
}
.pt-pfx-wrap { position: relative; }
.pt-pfx {
  position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
  font-family: var(--mono); font-size: 14px; color: var(--text-3);
  pointer-events: none; user-select: none;
}

input.pt-inp {
  width: 100%; height: 44px; padding: 0 12px;
  border-radius: 9px; border: 1px solid var(--border);
  background: var(--surface-2); color: var(--text);
  font-family: var(--font); font-size: 14px; outline: none;
  transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
  -webkit-appearance: none; appearance: none;
}
input.pt-inp::placeholder { color: var(--text-3); }
input.pt-inp:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(92,103,245,0.12);
  background: var(--surface);
}
input.pt-inp.pl { padding-left: 26px; }
input.pt-inp.sm { height: 38px; font-size: 13px; }
input.pt-inp.center { text-align: center; }

/* ── MODE TOGGLE ──────────────────────────────────────────── */
.pt-toggle {
  display: flex; padding: 3px; border-radius: 9px;
  background: var(--surface-2); border: 1px solid var(--border);
  margin-top: 16px;
}
.pt-mode {
  flex: 1; height: 36px; border-radius: 7px; border: none;
  font-family: var(--font); font-size: 13px; font-weight: 500;
  color: var(--text-2); background: transparent; cursor: pointer;
  transition: all 0.18s ease;
}
.pt-mode.on {
  background: var(--surface); color: var(--text); font-weight: 600;
  box-shadow: var(--shadow-sm);
}

/* ── PEOPLE TABLE HEADER ──────────────────────────────────── */
.pt-thead {
  display: grid; gap: 8px; padding-bottom: 8px;
  border-bottom: 1px solid var(--border); margin-bottom: 10px;
  font-size: 10.5px; font-weight: 600;
  letter-spacing: 0.07em; text-transform: uppercase; color: var(--text-3);
}
.pt-thead.eq  { grid-template-columns: 2fr 1.3fr 1.3fr; }
.pt-thead.man { grid-template-columns: 2fr 1.1fr 0.9fr 1.2fr; }
.pt-thead > span:not(:first-child) { text-align: center; }
.pt-thead > span:last-child        { text-align: right; }

/* ── PERSON ROW ───────────────────────────────────────────── */
.pt-row { display: grid; gap: 8px; margin-bottom: 8px; align-items: center; }
.pt-row.eq  { grid-template-columns: 2fr 1.3fr 1.3fr; }
.pt-row.man { grid-template-columns: 2fr 1.1fr 0.9fr 1.2fr; }

.pt-name-cell { display: flex; align-items: center; gap: 8px; min-width: 0; }
.pt-name-cell > input.pt-inp { flex: 1; min-width: 0; width: auto; }

.pt-av {
  width: 28px; height: 28px; border-radius: 8px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 700; color: #fff;
}

/* ── BALANCE PILL ─────────────────────────────────────────── */
.pt-bal {
  height: 38px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  font-family: var(--mono); font-size: 12px; font-weight: 500;
}
.pt-bal.neg  { background: var(--red-dim);   color: var(--red);   }
.pt-bal.pos  { background: var(--green-dim); color: var(--green); }
.pt-bal.zero { background: var(--surface-2); color: var(--text-3); }

/* ── PERCENT BAR ──────────────────────────────────────────── */
.pt-pct {
  display: flex; align-items: center; gap: 10px;
  margin-top: 10px; padding: 10px 12px;
  background: var(--surface-2); border: 1px solid var(--border); border-radius: 8px;
}
.pt-pct-lbl { font-size: 12px; font-weight: 500; min-width: 120px; }
.pt-pct-track { flex: 1; height: 3px; background: var(--border); border-radius: 99px; overflow: hidden; }
.pt-pct-fill { height: 100%; border-radius: 99px; transition: width 0.3s ease; }
.pt-pct-fill.over    { background: var(--red); }
.pt-pct-fill.ok      { background: var(--green); }
.pt-pct-fill.partial { background: var(--primary); }
.pt-pct-num { font-family: var(--mono); font-size: 12px; min-width: 40px; text-align: right; color: var(--text-2); }

/* ── PEOPLE FOOTER BUTTONS ────────────────────────────────── */
.pt-row-btns { display: flex; gap: 8px; margin-top: 14px; }

.pt-btn-ghost {
  flex: 1; height: 38px; border-radius: 8px; border: 1px solid var(--border);
  background: transparent; color: var(--text-2);
  font-family: var(--font); font-size: 13px; font-weight: 500;
  cursor: pointer; transition: all 0.15s;
  display: flex; align-items: center; justify-content: center; gap: 5px;
}
.pt-btn-ghost:hover  { background: var(--surface-2); color: var(--text); border-color: var(--border-2); }
.pt-btn-ghost:active { transform: scale(0.98); }

.pt-btn-pri {
  flex: 1; height: 38px; border-radius: 8px; border: none;
  background: var(--primary); color: #fff;
  font-family: var(--font); font-size: 13px; font-weight: 600;
  cursor: pointer; transition: all 0.15s;
  display: flex; align-items: center; justify-content: center; gap: 5px;
}
.pt-btn-pri:hover  { background: var(--primary-dk); box-shadow: 0 4px 12px rgba(92,103,245,0.3); }
.pt-btn-pri:active { transform: scale(0.98); }

/* ── STATS STRIP ──────────────────────────────────────────── */
.pt-stats {
  display: grid; grid-template-columns: 1fr 1fr 1fr;
  gap: 1px; background: var(--border);
  border-radius: 12px; overflow: hidden;
  border: 1px solid var(--border);
  margin-bottom: 12px; box-shadow: var(--shadow-sm);
}
.pt-stat { background: var(--surface); padding: 14px 16px; }
.pt-stat-lbl { font-size: 11px; color: var(--text-3); font-weight: 500; margin-bottom: 3px; }
.pt-stat-val { font-family: var(--mono); font-size: 16px; font-weight: 600; color: var(--text); }

/* ── POSITION CARDS ───────────────────────────────────────── */
.pt-positions {
  display: flex; gap: 10px;
  overflow-x: auto; padding-bottom: 2px; margin-bottom: 12px;
  scrollbar-width: none;
}
.pt-positions::-webkit-scrollbar { display: none; }

.pt-pos {
  flex-shrink: 0; width: 150px; padding: 14px;
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 12px; box-shadow: var(--shadow-sm);
}
.pt-pos-top  { display: flex; align-items: center; gap: 9px; margin-bottom: 12px; }
.pt-pos-name { font-size: 13px; font-weight: 600; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.pt-pos-paid { font-size: 11px; color: var(--text-3); margin-top: 1px; }
.pt-pos-amt  { font-family: var(--mono); font-size: 19px; font-weight: 700; letter-spacing: -0.5px; margin-bottom: 3px; }
.pt-pos-amt.pos  { color: var(--green); }
.pt-pos-amt.neg  { color: var(--red); }
.pt-pos-amt.zero { color: var(--text-3); }
.pt-pos-role { font-size: 10.5px; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; }
.pt-pos-role.pos  { color: var(--green); }
.pt-pos-role.neg  { color: var(--red); }
.pt-pos-role.zero { color: var(--text-3); }

/* ── SETTLEMENT ROWS ──────────────────────────────────────── */
.pt-settle {
  display: flex; align-items: center; gap: 0;
  padding: 14px 0; border-bottom: 1px solid var(--border);
}
.pt-settle:first-child { padding-top: 0; }
.pt-settle:last-child  { border-bottom: none; padding-bottom: 0; }

.pt-settle-side { display: flex; align-items: center; gap: 9px; }
.pt-settle-side.right { flex-direction: row-reverse; }
.pt-settle-sname { font-size: 13px; font-weight: 600; color: var(--text); max-width: 72px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.pt-settle-verb  { font-size: 10.5px; color: var(--text-3); margin-top: 1px; }

.pt-settle-mid {
  flex: 1; display: flex; flex-direction: column;
  align-items: center; gap: 5px; padding: 0 10px;
}
.pt-settle-amt   { font-family: var(--mono); font-size: 13px; font-weight: 700; color: var(--text); }
.pt-settle-track {
  width: 100%; display: flex; align-items: center; gap: 4px;
}
.pt-settle-line {
  flex: 1; height: 1px;
  background: linear-gradient(90deg, var(--red-dim), var(--border-2), var(--green-dim));
}
.pt-settle-arrow { color: var(--text-3); display: flex; align-items: center; }

/* ── SETTLED EMPTY STATE ──────────────────────────────────── */
.pt-settled {
  text-align: center; padding: 24px 0 8px;
}
.pt-settled-icon {
  width: 44px; height: 44px; border-radius: 50%;
  background: var(--green-dim); color: var(--green);
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 10px;
}
.pt-settled-title { font-size: 14px; font-weight: 600; color: var(--text); margin-bottom: 4px; }
.pt-settled-sub   { font-size: 12px; color: var(--text-3); }

/* ── SHARE ACTIONS ────────────────────────────────────────── */
.pt-actions { display: flex; gap: 8px; }
.pt-act {
  flex: 1; height: 44px; border-radius: 9px;
  border: 1px solid var(--border); background: var(--surface);
  color: var(--text-2); font-family: var(--font); font-size: 13px; font-weight: 500;
  cursor: pointer; transition: all 0.15s; box-shadow: var(--shadow-sm);
  display: flex; align-items: center; justify-content: center; gap: 6px;
}
.pt-act:hover  { background: var(--surface-2); color: var(--text); border-color: var(--border-2); }
.pt-act:active { transform: scale(0.98); }
.pt-act.done   { border-color: rgba(16,185,129,0.4); color: var(--green); background: var(--green-dim); }

/* ── TOAST ────────────────────────────────────────────────── */
.pt-toast {
  position: fixed; bottom: 28px; left: 50%;
  transform: translateX(-50%) translateY(12px);
  background: var(--text); color: #fff;
  border-radius: 10px; padding: 10px 18px;
  font-size: 13px; font-weight: 500; white-space: nowrap;
  opacity: 0; pointer-events: none;
  transition: opacity 0.22s, transform 0.22s;
  display: flex; align-items: center; gap: 8px; z-index: 9999;
  box-shadow: 0 8px 24px rgba(15,23,42,0.2);
}
.pt-toast.up { opacity: 1; transform: translateX(-50%) translateY(0); }

/* ── HIDDEN SHARE CARD (for image capture) ─────────────────── */
.pt-hidden { position: absolute; left: -9999px; top: 0; }
.pt-share {
  width: 320px; padding: 24px; border-radius: 16px;
  background: var(--surface); color: var(--text);
  border: 1px solid var(--border);
  box-shadow: 0 8px 32px rgba(15,23,42,0.12);
}
.pt-share-hdr  { display: flex; align-items: center; gap: 10px; margin-bottom: 18px; }
.pt-share-mark {
  width: 32px; height: 32px; border-radius: 9px; flex-shrink: 0;
  background: linear-gradient(140deg, #5C67F5, #8B5CF6, #A78BFA);
  display: flex; align-items: center; justify-content: center;
  overflow: hidden;
}
.pt-share-brand { font-size: 15px; font-weight: 700; letter-spacing: -0.4px; }
.pt-share-desc  { font-size: 12px; color: var(--text-2); }
.pt-share-amount { font-family: var(--mono); font-size: 32px; font-weight: 700; letter-spacing: -1px; margin: 14px 0; }
.pt-share-div   { height: 1px; background: var(--border); margin: 12px 0; }
.pt-share-row   { display: flex; justify-content: space-between; align-items: center; padding: 7px 0; font-size: 13px; }
.pt-share-person { color: var(--text-2); }
.pt-share-pos    { font-family: var(--mono); color: var(--green); font-weight: 600; }
.pt-share-neg    { font-family: var(--mono); color: var(--red);   font-weight: 600; }

/* ── SCROLLBAR ────────────────────────────────────────────── */
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--border-2); border-radius: 99px; }

/* ── DARK MODE ────────────────────────────────────────────── */
.pt.dark {
  --bg:          transparent;
  --surface:     rgba(11, 17, 32, 0.75);
  --surface-2:   rgba(0, 0, 0, 0.30);
  --border:      rgba(255,255,255,0.07);
  --border-2:    rgba(255,255,255,0.13);
  --primary-dim: rgba(92,103,245,0.15);
  --green-dim:   rgba(16,185,129,0.13);
  --red-dim:     rgba(244,63,94,0.13);
  --text:        #eef2ff;
  --text-2:      #64748b;
  --text-3:      #475569;
  --shadow-sm:   0 1px 2px rgba(0,0,0,0.4);
  --shadow:      0 1px 3px rgba(0,0,0,0.5), 0 1px 2px rgba(0,0,0,0.4);
  --shadow-md:   0 4px 6px -1px rgba(0,0,0,0.5), 0 2px 4px -1px rgba(0,0,0,0.4);
}
/* dark background gradient — same as original flashlight design */
.pt.dark { background: radial-gradient(ellipse at 60% 0%, #0f1729 0%, #05080f 100%); }

/* glassmorphism cards in dark mode */
.pt.dark .pt-card,
.pt.dark .pt-pos,
.pt.dark .pt-act { backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); }

/* inputs need a slightly lighter base in dark */
.pt.dark input.pt-inp { background: rgba(0,0,0,0.3); color: #eef2ff; }
.pt.dark input.pt-inp:focus { background: rgba(0,0,0,0.45); }

/* stats strip separator in dark */
.pt.dark .pt-stats { background: rgba(255,255,255,0.06); }

/* toast in dark mode */
.pt.dark .pt-toast { background: #1e293b; border: 1px solid rgba(255,255,255,0.08); }

/* ── FLASHLIGHT ───────────────────────────────────────────── */
.pt-flash {
  position: fixed; inset: 0; pointer-events: none; z-index: 0;
  transition: background 0.05s;
}

/* ── THEME TOGGLE BUTTON ──────────────────────────────────── */
.pt-theme {
  position: fixed; top: 18px; right: 18px; z-index: 200;
  width: 40px; height: 40px; border-radius: 10px;
  border: 1px solid var(--border); background: var(--surface);
  color: var(--text-2); cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  box-shadow: var(--shadow); transition: all 0.2s;
}
.pt-theme:hover  { color: var(--text); border-color: var(--border-2); }
.pt-theme:active { transform: scale(0.92); }
/* glass effect in dark mode */
.pt.dark .pt-theme { backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); }
`;

// ═════════════════════════════════════════════════════════════
//  CONSTANTS
// ═════════════════════════════════════════════════════════════
const AVATAR_COLORS = [
  "#5C67F5","#10B981","#F59E0B","#F43F5E",
  "#06B6D4","#8B5CF6","#EC4899","#14B8A6",
];
const DEFAULT_NAMES = ["Alice","Bob","Charlie","Dana","Eve","Frank","Grace","Hana"];

// ═════════════════════════════════════════════════════════════
//  LOGO MARK — split-K with a deliberate gap at the junction
//  (one bill → divides into two people)
// ═════════════════════════════════════════════════════════════
function KvitMark({ size = 20 }) {
  // K geometry: vertical bar + two diagonal arms that start
  // 4px apart at the spine, suggesting a split/divide
  const h = size;
  const w = size * 0.88;
  const barW  = w * 0.22;
  const gapY  = h * 0.5;          // centre of the K
  const split = h * 0.11;         // half-gap between arms
  const arm1Y = gapY - split;     // upper arm origin
  const arm2Y = gapY + split;     // lower arm origin

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
      {/* Vertical bar */}
      <rect x="0" y="0" width={barW} height={h} rx={barW / 2} fill="rgba(255,255,255,0.95)" />
      {/* Upper arm */}
      <line
        x1={barW + 1} y1={arm1Y}
        x2={w}         y2={1}
        stroke="rgba(255,255,255,0.92)"
        strokeWidth={barW * 0.85}
        strokeLinecap="round"
      />
      {/* Lower arm */}
      <line
        x1={barW + 1} y1={arm2Y}
        x2={w}         y2={h - 1}
        stroke="rgba(255,255,255,0.92)"
        strokeWidth={barW * 0.85}
        strokeLinecap="round"
      />
    </svg>
  );
}

// ═════════════════════════════════════════════════════════════
//  HELPERS
// ═════════════════════════════════════════════════════════════
const init = (name) => (name || "?").charAt(0).toUpperCase();
const fmt  = (n)    => Math.abs(n).toFixed(2);

/** Minimise transactions: match debtors to creditors */
function calcSettlements(people, getOwes) {
  const debtors   = people.map(p => ({ name: p.name, bal:  getOwes(p) }))
                          .filter(p => p.bal > 0.005).map(p => ({ ...p }))
                          .sort((a, b) => b.bal - a.bal);
  const creditors = people.map(p => ({ name: p.name, bal: -getOwes(p) }))
                          .filter(p => p.bal > 0.005).map(p => ({ ...p }))
                          .sort((a, b) => b.bal - a.bal);
  const result = [];
  let ci = 0, di = 0;
  while (di < debtors.length && ci < creditors.length) {
    const amt = Math.min(debtors[di].bal, creditors[ci].bal);
    if (amt > 0.005) result.push({ from: debtors[di].name, to: creditors[ci].name, amount: amt });
    debtors[di].bal   -= amt;
    creditors[ci].bal -= amt;
    if (debtors[di].bal   < 0.005) di++;
    if (creditors[ci].bal < 0.005) ci++;
  }
  return result;
}

// ═════════════════════════════════════════════════════════════
//  COMPONENT: ExpenseInput
// ═════════════════════════════════════════════════════════════
function ExpenseInput({ description, setDescription, amount, setAmount, mode, setMode }) {
  return (
    <div className="pt-card">
      <div className="pt-field">
        <label className="pt-field-label">What's the expense?</label>
        <input
          className="pt-inp"
          type="text"
          placeholder="Dinner at Nobu, Uber to airport…"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      </div>

      <div className="pt-field">
        <label className="pt-field-label">Total amount</label>
        <div className="pt-pfx-wrap">
          <span className="pt-pfx">£</span>
          <input
            className="pt-inp pl"
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={e => setAmount(e.target.value)}
          />
        </div>
      </div>

      <div className="pt-toggle">
        <button
          className={`pt-mode${mode === "equal"  ? " on" : ""}`}
          onClick={() => setMode("equal")}
        >
          Equal Split
        </button>
        <button
          className={`pt-mode${mode === "manual" ? " on" : ""}`}
          onClick={() => setMode("manual")}
        >
          Custom %
        </button>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
//  COMPONENT: PersonRow
// ═════════════════════════════════════════════════════════════
function PersonRow({ person, index, mode, onUpdate, owes }) {
  const isNeg = owes >  0.005;
  const isPos = owes < -0.005;
  const cls   = isNeg ? "neg" : isPos ? "pos" : "zero";
  const row   = mode === "equal" ? "eq" : "man";

  return (
    <div className={`pt-row ${row}`}>
      {/* Name + avatar */}
      <div className="pt-name-cell">
        <div className="pt-av" style={{ background: AVATAR_COLORS[index % AVATAR_COLORS.length] }}>
          {init(person.name)}
        </div>
        <input
          className="pt-inp sm"
          value={person.name}
          placeholder="Name"
          onChange={e => onUpdate("name", e.target.value)}
        />
      </div>

      {/* Paid */}
      <input
        className="pt-inp sm center"
        type="number"
        placeholder="0"
        value={person.paid}
        onChange={e => onUpdate("paid", e.target.value)}
      />

      {/* Percent — manual only */}
      {mode === "manual" && (
        <input
          className="pt-inp sm center"
          type="number"
          placeholder="0"
          value={person.percent}
          onChange={e => onUpdate("percent", e.target.value)}
        />
      )}

      {/* Balance pill */}
      <div className={`pt-bal ${cls}`}>
        {isNeg ? "−" : isPos ? "+" : ""}£{fmt(owes)}
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
//  COMPONENT: BalanceSummary
//  Shows stats strip + scrollable per-person position cards
// ═════════════════════════════════════════════════════════════
function BalanceSummary({ people, total, getOwes, mode }) {
  return (
    <>
      {/* 3-column stats strip */}
      <div className="pt-stats">
        <div className="pt-stat">
          <div className="pt-stat-lbl">Total</div>
          <div className="pt-stat-val">£{total.toFixed(2)}</div>
        </div>
        <div className="pt-stat">
          <div className="pt-stat-lbl">People</div>
          <div className="pt-stat-val">{people.length}</div>
        </div>
        <div className="pt-stat">
          <div className="pt-stat-lbl">{mode === "equal" ? "Each" : "Avg"}</div>
          <div className="pt-stat-val">£{(total / people.length).toFixed(2)}</div>
        </div>
      </div>

      {/* Per-person position cards (horizontal scroll) */}
      <div className="pt-positions">
        {people.map((p, i) => {
          const owes  = getOwes(p);
          const isPos  = owes < -0.005;   // creditor — gets back
          const isNeg  = owes >  0.005;   // debtor   — owes
          const cls    = isPos ? "pos" : isNeg ? "neg" : "zero";

          return (
            <div key={p.id} className="pt-pos">
              <div className="pt-pos-top">
                <div className="pt-av" style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}>
                  {init(p.name)}
                </div>
                <div>
                  <div className="pt-pos-name">{p.name || "—"}</div>
                  <div className="pt-pos-paid">Paid £{fmt(Number(p.paid) || 0)}</div>
                </div>
              </div>
              <div className={`pt-pos-amt ${cls}`}>
                {isPos ? "+" : isNeg ? "−" : ""}£{fmt(owes)}
              </div>
              <div className={`pt-pos-role ${cls}`}>
                {isPos ? "Gets back" : isNeg ? "Owes" : "Settled"}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

// ═════════════════════════════════════════════════════════════
//  COMPONENT: SettlementList
//  Shows minimised transfer instructions or "all settled" state
// ═════════════════════════════════════════════════════════════
function SettlementList({ settlements, colorMap }) {
  if (!settlements.length) {
    return (
      <div className="pt-settled">
        <div className="pt-settled-icon"><Check size={20} /></div>
        <div className="pt-settled-title">All settled up!</div>
        <div className="pt-settled-sub">No transfers needed — everyone's even.</div>
      </div>
    );
  }

  return (
    <div>
      {settlements.map((s, i) => (
        <div key={i} className="pt-settle">
          {/* Debtor (sends) */}
          <div className="pt-settle-side">
            <div className="pt-av" style={{ background: colorMap[s.from] || AVATAR_COLORS[0] }}>
              {init(s.from)}
            </div>
            <div>
              <div className="pt-settle-sname">{s.from}</div>
              <div className="pt-settle-verb">Sends</div>
            </div>
          </div>

          {/* Arrow + amount */}
          <div className="pt-settle-mid">
            <div className="pt-settle-amt">£{s.amount.toFixed(2)}</div>
            <div className="pt-settle-track">
              <div className="pt-settle-line" />
              <div className="pt-settle-arrow"><ArrowRight size={12} /></div>
            </div>
          </div>

          {/* Creditor (receives) */}
          <div className="pt-settle-side right">
            <div className="pt-av" style={{ background: colorMap[s.to] || AVATAR_COLORS[1] }}>
              {init(s.to)}
            </div>
            <div style={{ textAlign: "right" }}>
              <div className="pt-settle-sname">{s.to}</div>
              <div className="pt-settle-verb">Receives</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
//  MAIN APP
// ═════════════════════════════════════════════════════════════
export default function App() {
  const [people, setPeople] = useState([
    { id: 1, name: "Alice", paid: "", percent: 0 },
    { id: 2, name: "Bob",   paid: "", percent: 0 },
  ]);
  const [amount,      setAmount]      = useState("");
  const [description, setDescription] = useState("");
  const [mode,        setMode]        = useState("equal");
  const [toast,       setToast]       = useState({ show: false, msg: "" });
  const [copied,      setCopied]      = useState(null);
  const [darkMode,    setDarkMode]    = useState(true);
  const [pos,         setPos]         = useState({ x: 0, y: 0 });
  const shareRef = useRef();

  // Inject all styles
  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = CSS;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);

  // Sync body background with theme so no flash of light bg shows at page edges
  useEffect(() => {
    document.body.style.background = darkMode
      ? "radial-gradient(ellipse at 60% 0%, #0f1729 0%, #05080f 100%)"
      : "#EEF2FA";
  }, [darkMode]);

  // Restore from shareable URL
  useEffect(() => {
    const data = new URLSearchParams(window.location.search).get("data");
    if (!data) return;
    try {
      const parsed = JSON.parse(atob(data));
      const ppl = parsed.people.map(p => ({ ...p, percent: p.percent ?? 0 }));
      setPeople(ppl);
      setAmount(parsed.amount);
      setDescription(parsed.description);
      setMode(parsed.mode || (ppl.some(p => Number(p.percent) > 0) ? "manual" : "equal"));
    } catch {}
  }, []);

  // ── derived ────────────────────────────────────────────────
  const total    = Number(amount) || 0;
  const totalPct = people.reduce((s, p) => s + (Number(p.percent) || 0), 0);
  const pctState = totalPct > 100.05 ? "over" : totalPct >= 99.95 ? "ok" : "partial";

  const getOwes = (p) =>
    mode === "equal"
      ? total / people.length - (Number(p.paid) || 0)
      : (total * (Number(p.percent) || 0)) / 100 - (Number(p.paid) || 0);

  const settlements = total > 0 ? calcSettlements(people, getOwes) : [];

  // Map person name → avatar color (for SettlementList)
  const colorMap = {};
  people.forEach((p, i) => { colorMap[p.name] = AVATAR_COLORS[i % AVATAR_COLORS.length]; });

  // ── ui helpers ─────────────────────────────────────────────
  const showToast = (msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 2200);
  };
  const flash = (key) => {
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  // ── people mutations ───────────────────────────────────────
  const updatePerson = (i, field, val) => {
    const next = [...people];
    next[i] = { ...next[i], [field]: val };
    setPeople(next);
  };
  const addPerson = () => {
    const name = DEFAULT_NAMES[people.length] || `Person ${people.length + 1}`;
    setPeople([...people, { id: Date.now(), name, paid: "", percent: 0 }]);
  };
  const removeLast = () => {
    if (people.length <= 2) return;
    setPeople(people.slice(0, -1));
  };
  const fillRemaining = () => {
    const used  = people.reduce((s, p) => s + (Number(p.percent) || 0), 0);
    const empty = people.filter(p => !p.percent || Number(p.percent) === 0);
    if (!empty.length) return;
    const share = ((100 - used) / empty.length).toFixed(2);
    setPeople(people.map(p => (!p.percent || Number(p.percent) === 0) ? { ...p, percent: share } : p));
  };

  // ── share actions ──────────────────────────────────────────
  const copyText = () => {
    let t = `${description || "Expense"}\nTotal: £${total.toFixed(2)}\n\n`;
    people.forEach(p => { t += `${p.name}: £${getOwes(p).toFixed(2)}\n`; });
    if (settlements.length) {
      t += "\nSettle up:\n";
      settlements.forEach(s => { t += `${s.from} → ${s.to}: £${s.amount.toFixed(2)}\n`; });
    }
    navigator.clipboard.writeText(t);
    flash("text"); showToast("Copied as text");
  };
  const copyImage = async () => {
    const canvas = await html2canvas(shareRef.current, { backgroundColor: null, scale: 2 });
    canvas.toBlob(async (blob) => {
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      flash("image"); showToast("Copied as image");
    });
  };
  const copyLink = () => {
    const encoded = btoa(JSON.stringify({ people, amount, description, mode }));
    navigator.clipboard.writeText(`${window.location.origin}?data=${encoded}`);
    flash("link"); showToast("Shareable link copied");
  };

  // ── render ─────────────────────────────────────────────────
  return (
    <div
      className={`pt${darkMode ? " dark" : ""}`}
      onMouseMove={darkMode ? e => setPos({ x: e.clientX, y: e.clientY }) : undefined}
    >
      {/* Flashlight — only visible in dark mode */}
      {darkMode && (
        <div
          className="pt-flash"
          style={{
            background: `radial-gradient(circle at ${pos.x}px ${pos.y}px, rgba(92,103,245,0.11), transparent 180px)`,
          }}
        />
      )}

      {/* Theme toggle — top-right corner */}
      <button className="pt-theme" onClick={() => setDarkMode(d => !d)} title="Toggle theme">
        {darkMode ? <Sun size={16} /> : <Moon size={16} />}
      </button>

      <div className="pt-wrap" style={{ position: "relative", zIndex: 1 }}>

        {/* ── HEADER */}
        <header className="pt-header">
          <div className="pt-logo">
            <div className="pt-mark">
              <KvitMark size={21} />
            </div>
            <span className="pt-wordmark">Kvit</span>
          </div>
          <p className="pt-tagline">Call it even.</p>
        </header>

        {/* ── EXPENSE INPUT */}
        <p className="pt-lbl">Expense</p>
        <ExpenseInput
          description={description} setDescription={setDescription}
          amount={amount}           setAmount={setAmount}
          mode={mode}               setMode={setMode}
        />

        {/* ── PEOPLE */}
        <p className="pt-lbl">People</p>
        <div className="pt-card">
          {/* Table header */}
          <div className={`pt-thead ${mode === "equal" ? "eq" : "man"}`}>
            <span>Name</span>
            <span>Paid</span>
            {mode === "manual" && <span>%</span>}
            <span>Balance</span>
          </div>

          {people.map((p, i) => (
            <PersonRow
              key={p.id}
              person={p}
              index={i}
              mode={mode}
              owes={getOwes(p)}
              onUpdate={(field, val) => updatePerson(i, field, val)}
            />
          ))}

          {/* Percent progress — manual mode */}
          {mode === "manual" && (
            <div className="pt-pct">
              <span
                className="pt-pct-lbl"
                style={{
                  color: pctState === "over" ? "var(--red)"
                       : pctState === "ok"   ? "var(--green)"
                       :                       "var(--text-2)",
                }}
              >
                {pctState === "over" ? "Over 100%"
                : pctState === "ok"  ? "Splits perfectly"
                :                     `${(100 - totalPct).toFixed(1)}% left`}
              </span>
              <div className="pt-pct-track">
                <div className={`pt-pct-fill ${pctState}`} style={{ width: `${Math.min(totalPct, 100)}%` }} />
              </div>
              <span className="pt-pct-num">{totalPct.toFixed(1)}%</span>
            </div>
          )}

          {/* Footer buttons */}
          <div className="pt-row-btns">
            {mode === "manual" && (
              <button className="pt-btn-ghost" onClick={fillRemaining}>⚡ Auto-fill %</button>
            )}
            {people.length > 2 && (
              <button className="pt-btn-ghost" onClick={removeLast}>− Remove</button>
            )}
            <button className="pt-btn-pri" onClick={addPerson}>
              <Plus size={14} /> Add Person
            </button>
          </div>
        </div>

        {/* ── BALANCE SUMMARY (when amount is entered) */}
        {total > 0 && (
          <>
            <p className="pt-lbl">Summary</p>
            <BalanceSummary people={people} total={total} getOwes={getOwes} mode={mode} />
          </>
        )}

        {/* ── SETTLEMENTS (who pays whom) */}
        {total > 0 && (
          <>
            <p className="pt-lbl">Settle Up</p>
            <div className="pt-card">
              <SettlementList settlements={settlements} colorMap={colorMap} />
            </div>
          </>
        )}

        {/* ── SHARE ACTIONS */}
        <p className="pt-lbl">Share</p>
        <div className="pt-actions">
          <button className={`pt-act${copied === "text"  ? " done" : ""}`} onClick={copyText}>
            {copied === "text"  ? <Check size={14} /> : <FileText   size={14} />} Text
          </button>
          <button className={`pt-act${copied === "image" ? " done" : ""}`} onClick={copyImage}>
            {copied === "image" ? <Check size={14} /> : <ImageIcon   size={14} />} Image
          </button>
          <button className={`pt-act${copied === "link"  ? " done" : ""}`} onClick={copyLink}>
            {copied === "link"  ? <Check size={14} /> : <Link        size={14} />} Share Link
          </button>
        </div>

      </div>

      {/* ── TOAST */}
      <div className={`pt-toast${toast.show ? " up" : ""}`}>
        <Check size={13} color="var(--green)" />
        {toast.msg}
      </div>

      {/* ── HIDDEN SHARE CARD (image capture) */}
      <div className="pt-hidden">
        <div className="pt-share" ref={shareRef}>
          <div className="pt-share-hdr">
            <div className="pt-share-mark"><KvitMark size={17} /></div>
            <div>
              <div className="pt-share-brand">Kvit</div>
              <div className="pt-share-desc">{description || "Expense"}</div>
            </div>
          </div>
          <div className="pt-share-amount">£{total.toFixed(2)}</div>
          <div className="pt-share-div" />
          {people.map((p, i) => {
            const owes = getOwes(p);
            return (
              <div key={i} className="pt-share-row">
                <span className="pt-share-person">{p.name}</span>
                <span className={owes > 0.005 ? "pt-share-neg" : "pt-share-pos"}>
                  {owes > 0.005 ? "−" : "+"}£{fmt(owes)}
                </span>
              </div>
            );
          })}
          {settlements.length > 0 && (
            <>
              <div className="pt-share-div" />
              {settlements.map((s, i) => (
                <div key={i} className="pt-share-row">
                  <span className="pt-share-person">{s.from} → {s.to}</span>
                  <span className="pt-share-neg">£{s.amount.toFixed(2)}</span>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
