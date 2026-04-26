import { useState, useRef, useEffect, forwardRef } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  animate,
  useReducedMotion,
} from "framer-motion";
import {
  FileText, Link as LinkIcon, Image as ImageIcon, Check, Plus, ArrowRight,
  Sparkles, Clock, Scale, Percent, ChevronDown, RotateCcw,
} from "lucide-react";
import {
  equalShare,
  manualShare,
  timeShare as calcTimeShare,
  calcSettlements,
} from "./lib/calc";

const STORAGE_KEY = "splidit:state:v1";

// ════════════════════════════════════════════════════════════════
//  SPLIDIT — "Call it even."
//
//  Palette (emerald-on-dark fintech, matching portfolio page):
//    #060c08  page base
//    #0a1410  card surface tint
//    #34d399  emerald accent  (brand · positive)
//    #10b981  emerald deep    (hover · darker accent)
//    #f87171  rose            (debtor · negative)
//    #e6f4ec  text            (off-white with green tint)
//    #94a3b8  text-2          (slate-400)
//    #64748b  text-3          (slate-500)
// ════════════════════════════════════════════════════════════════

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg:          #060c08;
  --bg-2:        #040a06;
  --surface:     rgba(12, 22, 16, 0.72);
  --surface-2:   rgba(20, 32, 24, 0.55);
  --surface-3:   rgba(28, 42, 32, 0.45);
  --border:      rgba(52, 211, 153, 0.10);
  --border-2:    rgba(52, 211, 153, 0.22);
  --border-3:    rgba(52, 211, 153, 0.40);
  --primary:     #34d399;
  --primary-dim: rgba(52, 211, 153, 0.12);
  --primary-dk:  #10b981;
  --primary-glow:rgba(52, 211, 153, 0.55);
  --green:       #34d399;
  --green-dim:   rgba(52, 211, 153, 0.13);
  --red:         #f87171;
  --red-dim:     rgba(248, 113, 113, 0.12);
  --amber:       #fbbf24;
  --text:        #e6f4ec;
  --text-2:      #9aa9a3;
  --text-3:      #5d6e66;
  --shadow-sm:   0 1px 2px rgba(0,0,0,0.4);
  --shadow:      0 4px 14px rgba(0,0,0,0.42), 0 1px 2px rgba(0,0,0,0.35);
  --shadow-md:   0 8px 22px rgba(0,0,0,0.5), 0 2px 6px rgba(0,0,0,0.4);
  --shadow-glow: 0 0 24px rgba(52, 211, 153, 0.18);
  --font:        'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --mono:        'JetBrains Mono', ui-monospace, Consolas, monospace;
}

/* ── RESET ─────────────────────────────────────────────────── */
html, body {
  background: var(--bg) !important;
  color: var(--text) !important;
  overflow-x: hidden;
}
body {
  font-family: var(--font); font-size: 14px; line-height: 1.5;
  -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;
  font-feature-settings: "tnum" on, "lnum" on;
}
::selection { background: var(--primary); color: #052e1f; }
#root {
  width: auto !important; max-width: 100% !important;
  border: none !important; border-inline: none !important;
  text-align: left !important; display: block !important;
  background: transparent !important; min-height: 100vh;
}
h1, h2, h3 { font-family: var(--font); font-size: inherit; font-weight: inherit; color: inherit; letter-spacing: inherit; margin: 0; }

/* ── PAGE BASE ─────────────────────────────────────────────── */
.kv {
  position: relative;
  min-height: 100vh;
  background: var(--bg);
  padding-bottom: 96px;
  overflow-x: hidden;
}

/* layered radial gradients — same vibe as portfolio SplidIt page */
.kv-bg {
  position: fixed; inset: 0; z-index: 0; pointer-events: none;
  background:
    radial-gradient(ellipse 85% 50% at 50% 0%,  rgba(16,185,129,0.12) 0%, transparent 65%),
    radial-gradient(ellipse 60% 40% at 90% 70%, rgba(5,150,105,0.07) 0%, transparent 70%),
    radial-gradient(ellipse 50% 30% at 8% 92%,  rgba(34,197,94,0.05) 0%, transparent 70%);
}
/* dot-grid overlay */
.kv-dots {
  position: fixed; inset: 0; z-index: 0; pointer-events: none;
  background-image: radial-gradient(circle, rgba(52,211,153,0.07) 1px, transparent 1px);
  background-size: 28px 28px;
  mask-image: radial-gradient(ellipse 80% 70% at 50% 30%, black 30%, transparent 100%);
  -webkit-mask-image: radial-gradient(ellipse 80% 70% at 50% 30%, black 30%, transparent 100%);
}
/* cursor follow glow */
.kv-glow {
  position: fixed; inset: 0; z-index: 0; pointer-events: none;
  transition: background 0.08s linear;
}

.kv-wrap {
  position: relative; z-index: 1;
  max-width: 520px; margin: 0 auto; padding: 0 18px;
}

/* ── HERO ──────────────────────────────────────────────────── */
.kv-hero { padding: 64px 0 48px; text-align: center; }
.kv-hero-mark {
  width: 56px; height: 56px; border-radius: 16px;
  background: linear-gradient(140deg, #34d399 0%, #10b981 50%, #047857 100%);
  display: inline-flex; align-items: center; justify-content: center;
  box-shadow:
    0 8px 32px rgba(52,211,153,0.32),
    inset 0 1px 0 rgba(255,255,255,0.18);
  margin-bottom: 18px;
  position: relative;
}
.kv-hero-mark::after {
  content: ""; position: absolute; inset: -2px; border-radius: 18px;
  background: linear-gradient(140deg, rgba(52,211,153,0.4), transparent 60%);
  z-index: -1; filter: blur(12px);
}
.kv-hero-title {
  font-size: 56px; font-weight: 800; letter-spacing: -2.5px;
  background: linear-gradient(180deg, #f0fdf4 0%, #86efac 100%);
  -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1; margin-bottom: 14px;
}
.kv-hero-tag {
  font-family: var(--mono); font-size: 13px; font-weight: 500;
  color: rgba(52,211,153,0.75); letter-spacing: 0.04em;
  margin-bottom: 22px;
}

.kv-hero-pills {
  display: flex; gap: 6px; justify-content: center; flex-wrap: wrap;
  margin-bottom: 24px;
}
.kv-hero-pill {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 5px 11px; border-radius: 99px;
  background: rgba(52,211,153,0.07);
  border: 1px solid rgba(52,211,153,0.15);
  font-size: 11px; font-weight: 500; color: rgba(230,244,236,0.78);
  backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
}
.kv-hero-pill .dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--primary); box-shadow: 0 0 8px var(--primary);
  animation: pulse 2s ease-in-out infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1;   transform: scale(1);    }
  50%      { opacity: 0.55;transform: scale(0.85); }
}

.kv-hero-cta-wrap {
  position: relative; display: inline-flex; align-items: center; justify-content: center;
}
.kv-hero-cta {
  position: relative; z-index: 2;
  display: inline-flex; align-items: center; gap: 8px;
  height: 42px; padding: 0 20px; border-radius: 99px;
  background: linear-gradient(135deg, rgba(52,211,153,0.18), rgba(52,211,153,0.08));
  border: 1px solid rgba(52,211,153,0.32);
  color: #6ee7b7; font-family: var(--font); font-size: 13px; font-weight: 600;
  letter-spacing: 0.02em;
  cursor: pointer;
  transition: background 0.22s, border-color 0.22s, color 0.22s;
  backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(52,211,153,0.12);
  outline: none;
}
.kv-hero-cta:hover {
  border-color: rgba(52,211,153,0.6); color: #d1fae5;
  background: linear-gradient(135deg, rgba(52,211,153,0.30), rgba(52,211,153,0.14));
}
.kv-hero-cta:focus-visible {
  outline: 2px solid var(--primary); outline-offset: 4px;
}
.kv-hero-cta.hint {
  border-color: rgba(52,211,153,0.55);
  color: #d1fae5;
}
/* expanding rings behind CTA — only when first-visit hint is active */
.kv-hero-cta-ring {
  position: absolute; inset: -4px; z-index: 1;
  border-radius: 99px; pointer-events: none;
  border: 1.5px solid rgba(52,211,153,0.65);
  box-shadow: 0 0 24px rgba(52,211,153,0.4);
}
.kv-hero-cta-ring-2 {
  border-color: rgba(110,231,183,0.5);
  border-width: 1px;
}

/* "New here?" prompt above the CTA */
.kv-hero-tip {
  font-size: 12px; font-weight: 600;
  color: var(--primary);
  margin-bottom: 12px;
  letter-spacing: 0.04em;
  text-shadow: 0 0 12px rgba(52,211,153,0.45);
  display: inline-flex; align-items: center; gap: 6px;
}
.kv-hero-tip::after {
  content: "↓"; font-size: 13px; opacity: 0.7;
}

.kv-scroll-cue {
  display: inline-flex; align-items: center; justify-content: center;
  margin-top: 28px; color: rgba(230,244,236,0.35);
  animation: bob 2.4s ease-in-out infinite;
}
@keyframes bob {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(4px); }
}

/* ── SECTION LABEL ─────────────────────────────────────────── */
.kv-lbl {
  font-size: 10px; font-weight: 700; letter-spacing: 0.22em;
  text-transform: uppercase; color: rgba(52,211,153,0.55);
  margin: 28px 0 10px 4px;
  display: flex; align-items: center; gap: 8px;
}
.kv-lbl::after {
  content: ""; flex: 1; height: 1px;
  background: linear-gradient(90deg, rgba(52,211,153,0.18), transparent);
}

/* ── CARD (glassmorphic) ───────────────────────────────────── */
.kv-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 18px; padding: 20px;
  margin-bottom: 12px;
  box-shadow: var(--shadow);
  backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
  position: relative;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.kv-card:hover { border-color: var(--border-2); }

/* ── FIELD ─────────────────────────────────────────────────── */
.kv-field { margin-bottom: 14px; }
.kv-field:last-of-type { margin-bottom: 0; }
.kv-field-lbl {
  display: block; font-size: 11px; font-weight: 600;
  color: rgba(230,244,236,0.55);
  margin-bottom: 7px; letter-spacing: 0.02em;
}
.kv-pfx-wrap { position: relative; }
.kv-pfx, .kv-sfx {
  position: absolute; top: 50%; transform: translateY(-50%);
  font-family: var(--mono); font-size: 14px; color: var(--text-3);
  pointer-events: none; user-select: none;
}
.kv-pfx { left: 13px; }
.kv-sfx { right: 13px; font-size: 12px; }

input.kv-inp {
  width: 100%; height: 46px; padding: 0 13px;
  border-radius: 11px; border: 1px solid var(--border);
  background: rgba(0,0,0,0.32); color: var(--text);
  font-family: var(--font); font-size: 14px; outline: none;
  transition: all 0.18s cubic-bezier(0.4,0,0.2,1);
  -webkit-appearance: none; appearance: none;
  font-feature-settings: "tnum" on;
}
input.kv-inp::placeholder { color: var(--text-3); }
input.kv-inp:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 4px rgba(52,211,153,0.14);
  background: rgba(0,0,0,0.4);
}
input.kv-inp.pl     { padding-left: 28px; }
input.kv-inp.pr     { padding-right: 44px; }
input.kv-inp.sm     { height: 38px; font-size: 13px; border-radius: 9px; }
input.kv-inp.center { text-align: center; }

/* hide number arrows */
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
input[type="number"] { -moz-appearance: textfield; }

/* ── MODE PICKER ───────────────────────────────────────────── */
.kv-modes {
  position: relative; display: grid; grid-template-columns: 1fr 1fr 1fr;
  gap: 4px; padding: 4px;
  background: rgba(0,0,0,0.32); border: 1px solid var(--border);
  border-radius: 13px; margin-top: 16px;
}
.kv-mode {
  position: relative; z-index: 2;
  height: 44px; border-radius: 9px; border: none;
  background: transparent; cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 6px;
  font-family: var(--font); font-size: 12px; font-weight: 600;
  color: var(--text-2); letter-spacing: 0.01em;
  transition: color 0.22s ease;
  outline: none;
}
.kv-mode:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 3px;
  border-radius: 9px;
}
.kv-mode.on   { color: #052e1f; }
.kv-mode:hover:not(.on) { color: var(--text); }
.kv-mode-ind {
  position: absolute; inset: 0;
  border-radius: 9px;
  background: linear-gradient(140deg, #34d399, #10b981);
  box-shadow: 0 2px 12px rgba(52,211,153,0.4), inset 0 1px 0 rgba(255,255,255,0.22);
  z-index: 1;
}
.kv-mode-desc {
  font-size: 11px; color: var(--text-3); text-align: center;
  margin-top: 9px; min-height: 16px;
  font-style: italic;
}

/* ── PEOPLE TABLE ──────────────────────────────────────────── */
.kv-thead {
  display: grid; gap: 8px; padding-bottom: 9px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 11px;
  font-size: 10px; font-weight: 700;
  letter-spacing: 0.18em; text-transform: uppercase;
  color: rgba(230,244,236,0.4);
}
.kv-thead.eq  { grid-template-columns: 2fr 1.3fr 1.3fr; }
.kv-thead.man { grid-template-columns: 2fr 1.1fr 0.9fr 1.2fr; }
.kv-thead > span:not(:first-child) { text-align: center; }
.kv-thead > span:last-child        { text-align: right; }

.kv-row { display: grid; gap: 8px; margin-bottom: 8px; align-items: center; }
.kv-row.eq  { grid-template-columns: 2fr 1.3fr 1.3fr; }
.kv-row.man { grid-template-columns: 2fr 1.1fr 0.9fr 1.2fr; }

.kv-name-cell { display: flex; align-items: center; gap: 8px; min-width: 0; }
.kv-name-cell > input.kv-inp { flex: 1; min-width: 0; width: auto; }

.kv-av {
  width: 30px; height: 30px; border-radius: 9px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 700; color: #06140d;
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.18);
}

/* ── BALANCE PILL ──────────────────────────────────────────── */
.kv-bal {
  height: 38px; border-radius: 9px;
  display: flex; align-items: center; justify-content: center;
  font-family: var(--mono); font-size: 12px; font-weight: 600;
  letter-spacing: -0.02em;
  font-feature-settings: "tnum" on;
}
.kv-bal.neg  { background: var(--red-dim);   color: var(--red);   border: 1px solid rgba(248,113,113,0.22); }
.kv-bal.pos  { background: var(--green-dim); color: var(--green); border: 1px solid rgba(52,211,153,0.28); }
.kv-bal.zero { background: rgba(255,255,255,0.04); color: var(--text-3); border: 1px solid var(--border); }

/* ── PERCENT BAR ───────────────────────────────────────────── */
.kv-pct {
  display: flex; align-items: center; gap: 11px;
  margin-top: 12px; padding: 11px 13px;
  background: rgba(0,0,0,0.28); border: 1px solid var(--border); border-radius: 10px;
}
.kv-pct-lbl { font-size: 12px; font-weight: 600; min-width: 130px; }
.kv-pct-track { flex: 1; height: 4px; background: rgba(255,255,255,0.05); border-radius: 99px; overflow: hidden; }
.kv-pct-fill { height: 100%; border-radius: 99px; transition: width 0.4s cubic-bezier(0.4,0,0.2,1); }
.kv-pct-fill.over    { background: var(--red); box-shadow: 0 0 8px rgba(248,113,113,0.5); }
.kv-pct-fill.ok      { background: var(--green); box-shadow: 0 0 8px rgba(52,211,153,0.5); }
.kv-pct-fill.partial { background: var(--primary); box-shadow: 0 0 6px rgba(52,211,153,0.3); }
.kv-pct-num { font-family: var(--mono); font-size: 12px; min-width: 44px; text-align: right; color: var(--text-2); }

/* ── PEOPLE FOOTER BUTTONS ─────────────────────────────────── */
.kv-row-btns { display: flex; gap: 8px; margin-top: 14px; }

.kv-btn-ghost {
  flex: 1; height: 40px; border-radius: 10px;
  border: 1px solid var(--border); background: rgba(0,0,0,0.18);
  color: var(--text-2);
  font-family: var(--font); font-size: 12px; font-weight: 600;
  cursor: pointer; transition: all 0.18s cubic-bezier(0.4,0,0.2,1);
  display: flex; align-items: center; justify-content: center; gap: 6px;
  letter-spacing: 0.01em;
}
.kv-btn-ghost:hover  {
  background: rgba(52,211,153,0.07); color: var(--text);
  border-color: var(--border-2);
}
.kv-btn-ghost:active { transform: scale(0.97); }

.kv-btn-pri {
  flex: 1; height: 40px; border-radius: 10px; border: none;
  background: linear-gradient(135deg, #34d399 0%, #10b981 100%);
  color: #042f1d;
  font-family: var(--font); font-size: 12px; font-weight: 700;
  cursor: pointer; transition: all 0.18s cubic-bezier(0.4,0,0.2,1);
  display: flex; align-items: center; justify-content: center; gap: 6px;
  box-shadow: 0 4px 14px rgba(52,211,153,0.3), inset 0 1px 0 rgba(255,255,255,0.18);
  letter-spacing: 0.01em;
}
.kv-btn-pri:hover  {
  box-shadow: 0 8px 22px rgba(52,211,153,0.45), inset 0 1px 0 rgba(255,255,255,0.22);
  transform: translateY(-1px);
}
.kv-btn-pri:active { transform: translateY(0) scale(0.98); }

/* ── STATS STRIP ───────────────────────────────────────────── */
.kv-stats {
  display: grid; grid-template-columns: 1fr 1fr 1fr;
  gap: 1px; background: var(--border);
  border-radius: 14px; overflow: hidden;
  border: 1px solid var(--border);
  margin-bottom: 12px;
  backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
}
.kv-stat { background: var(--surface); padding: 14px 16px; }
.kv-stat-lbl { font-size: 10px; color: rgba(230,244,236,0.42); font-weight: 600; margin-bottom: 4px; letter-spacing: 0.12em; text-transform: uppercase; }
.kv-stat-val {
  font-family: var(--mono); font-size: 17px; font-weight: 700; color: var(--text);
  letter-spacing: -0.4px; font-feature-settings: "tnum" on;
}

/* ── POSITION CARDS (horizontal scroll) ────────────────────── */
.kv-positions {
  display: flex; gap: 10px;
  overflow-x: auto; padding: 2px 0 4px; margin-bottom: 12px;
  scrollbar-width: none; scroll-snap-type: x mandatory;
}
.kv-positions::-webkit-scrollbar { display: none; }

.kv-pos {
  flex-shrink: 0; width: 162px; padding: 14px;
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 13px; box-shadow: var(--shadow-sm);
  scroll-snap-align: start;
  backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
  transition: border-color 0.2s, transform 0.2s;
}
.kv-pos:hover { border-color: var(--border-2); transform: translateY(-2px); }
.kv-pos-top  { display: flex; align-items: center; gap: 9px; margin-bottom: 12px; }
.kv-pos-name { font-size: 13px; font-weight: 600; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.kv-pos-sub  { font-size: 10.5px; color: var(--text-3); margin-top: 1px; }
.kv-pos-amt  {
  font-family: var(--mono); font-size: 22px; font-weight: 700; letter-spacing: -0.7px;
  margin-bottom: 4px; font-feature-settings: "tnum" on;
}
.kv-pos-amt.pos  { color: var(--green); }
.kv-pos-amt.neg  { color: var(--red); }
.kv-pos-amt.zero { color: var(--text-3); }
.kv-pos-role { font-size: 10px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; }
.kv-pos-role.pos  { color: var(--green); }
.kv-pos-role.neg  { color: var(--red); }
.kv-pos-role.zero { color: var(--text-3); }

/* ── SETTLEMENT ROWS ───────────────────────────────────────── */
.kv-settle {
  display: flex; align-items: center; gap: 0;
  padding: 14px 0; border-bottom: 1px solid var(--border);
}
.kv-settle:first-child { padding-top: 0; }
.kv-settle:last-child  { border-bottom: none; padding-bottom: 0; }

.kv-settle-side { display: flex; align-items: center; gap: 9px; }
.kv-settle-side.right { flex-direction: row-reverse; }
.kv-settle-sname { font-size: 13px; font-weight: 600; color: var(--text); max-width: 76px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.kv-settle-verb  { font-size: 10px; color: var(--text-3); margin-top: 1px; letter-spacing: 0.08em; text-transform: uppercase; font-weight: 600; }

.kv-settle-mid {
  flex: 1; display: flex; flex-direction: column;
  align-items: center; gap: 6px; padding: 0 12px;
}
.kv-settle-amt   {
  font-family: var(--mono); font-size: 13px; font-weight: 700; color: var(--text);
  font-feature-settings: "tnum" on;
}
.kv-settle-track {
  width: 100%; display: flex; align-items: center; gap: 4px;
  position: relative;
}
.kv-settle-line {
  flex: 1; height: 1px; transform-origin: left;
  background: linear-gradient(90deg, rgba(248,113,113,0.4), rgba(52,211,153,0.4));
}
.kv-settle-arrow { color: var(--primary); display: flex; align-items: center; }

/* ── SETTLED EMPTY STATE ───────────────────────────────────── */
.kv-settled {
  text-align: center; padding: 30px 0 12px;
  position: relative;
}
.kv-settled-icon-wrap {
  width: 64px; height: 64px; border-radius: 50%;
  background: var(--green-dim); color: var(--green);
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 14px;
  border: 1px solid rgba(52,211,153,0.32);
  position: relative;
  box-shadow: 0 0 32px rgba(52,211,153,0.22);
}
.kv-settled-burst {
  position: absolute; inset: -20px; border-radius: 50%;
  border: 1px solid var(--primary);
  pointer-events: none;
}
.kv-settled-title { font-size: 16px; font-weight: 700; color: var(--text); margin-bottom: 5px; letter-spacing: -0.3px; }
.kv-settled-sub   { font-size: 12px; color: var(--text-2); }

/* ── SHARE ACTIONS ─────────────────────────────────────────── */
.kv-actions { display: flex; gap: 8px; }
.kv-act {
  flex: 1; height: 46px; border-radius: 11px;
  border: 1px solid var(--border); background: var(--surface);
  color: var(--text-2); font-family: var(--font); font-size: 12px; font-weight: 600;
  cursor: pointer; transition: all 0.18s cubic-bezier(0.4,0,0.2,1);
  display: flex; align-items: center; justify-content: center; gap: 7px;
  backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
  letter-spacing: 0.01em;
}
.kv-act:hover  {
  background: rgba(52,211,153,0.07); color: var(--text);
  border-color: var(--border-2);
  transform: translateY(-1px);
}
.kv-act:active { transform: translateY(0) scale(0.97); }
.kv-act.done   {
  border-color: rgba(52,211,153,0.5); color: var(--green);
  background: var(--green-dim);
}

/* ── RESET LINK ────────────────────────────────────────────── */
.kv-reset {
  display: flex; align-items: center; justify-content: center; gap: 6px;
  margin: 14px auto 0; padding: 8px 16px;
  background: transparent; border: 1px solid transparent;
  color: var(--text-3); font-family: var(--font);
  font-size: 11px; font-weight: 500; letter-spacing: 0.04em;
  cursor: pointer; border-radius: 8px;
  transition: all 0.18s cubic-bezier(0.4,0,0.2,1);
}
.kv-reset:hover {
  color: var(--red); border-color: rgba(248,113,113,0.18);
  background: rgba(248,113,113,0.04);
}
.kv-reset:focus-visible {
  outline: 2px solid var(--primary); outline-offset: 2px;
}

/* ── TOAST ─────────────────────────────────────────────────── */
.kv-toast {
  position: fixed; bottom: 28px; left: 50%;
  transform: translateX(-50%) translateY(12px);
  background: rgba(12, 22, 16, 0.9);
  color: var(--text);
  border: 1px solid var(--border-2);
  border-radius: 11px; padding: 10px 18px;
  font-size: 13px; font-weight: 500; white-space: nowrap;
  opacity: 0; pointer-events: none;
  transition: opacity 0.22s, transform 0.22s;
  display: flex; align-items: center; gap: 8px; z-index: 9999;
  box-shadow: 0 12px 32px rgba(0,0,0,0.5), 0 0 24px rgba(52,211,153,0.15);
  backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
}
.kv-toast.up { opacity: 1; transform: translateX(-50%) translateY(0); }

/* ── HIDDEN SHARE CARD (html2canvas-safe — no backdrop-filter / mask) ─── */
.kv-hidden { position: absolute; left: -9999px; top: 0; }
.kv-share {
  width: 400px; padding: 28px;
  border-radius: 20px;
  background:
    radial-gradient(ellipse 70% 40% at 90% 0%,   rgba(52,211,153,0.13) 0%, transparent 65%),
    radial-gradient(ellipse 60% 35% at 0% 100%,  rgba(16,185,129,0.07) 0%, transparent 70%),
    linear-gradient(170deg, #0c1812 0%, #060c08 55%, #040a06 100%);
  color: var(--text);
  border: 1px solid rgba(52,211,153,0.20);
  box-shadow: 0 16px 56px rgba(0,0,0,0.55);
  position: relative;
  overflow: hidden;
  font-family: var(--font);
}
/* faux dot grid via background-image — html2canvas-safe */
.kv-share::before {
  content: ""; position: absolute; inset: 0;
  background-image: radial-gradient(circle, rgba(52,211,153,0.08) 1px, transparent 1px);
  background-size: 22px 22px;
  opacity: 0.5; pointer-events: none;
}

/* HEADER */
.kv-share-hdr  {
  display: flex; align-items: center; gap: 11px;
  margin-bottom: 22px; position: relative;
}
.kv-share-mark {
  width: 38px; height: 38px; border-radius: 11px; flex-shrink: 0;
  background: linear-gradient(140deg, #34d399 0%, #10b981 50%, #047857 100%);
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 4px 16px rgba(52,211,153,0.32), inset 0 1px 0 rgba(255,255,255,0.2);
}
.kv-share-brand {
  font-size: 17px; font-weight: 800; letter-spacing: -0.5px; color: var(--text);
  display: flex; align-items: center; gap: 7px;
}
.kv-share-brand-dot {
  width: 5px; height: 5px; border-radius: 50%;
  background: var(--primary); box-shadow: 0 0 8px var(--primary);
}
.kv-share-desc  { font-size: 12px; color: var(--text-2); margin-top: 2px; }

/* HERO AMOUNT */
.kv-share-hero {
  position: relative;
  padding: 18px 0 14px;
  border-top: 1px solid rgba(52,211,153,0.14);
  border-bottom: 1px solid rgba(52,211,153,0.14);
  margin-bottom: 18px;
}
.kv-share-hero-lbl {
  font-size: 9.5px; font-weight: 700;
  letter-spacing: 0.24em; text-transform: uppercase;
  color: rgba(52,211,153,0.7); margin-bottom: 6px;
}
.kv-share-amount {
  font-family: var(--mono); font-size: 42px; font-weight: 700;
  letter-spacing: -1.6px; line-height: 1;
  color: #6ee7b7;
  margin-bottom: 8px;
  font-feature-settings: "tnum" on;
  text-shadow: 0 0 24px rgba(52,211,153,0.3);
}
.kv-share-meta {
  display: flex; gap: 6px; flex-wrap: wrap;
  font-size: 11px; color: var(--text-2);
}
.kv-share-meta-pill {
  display: inline-flex; align-items: center; gap: 4px;
  padding: 3px 9px; border-radius: 99px;
  background: rgba(52,211,153,0.08);
  border: 1px solid rgba(52,211,153,0.18);
  color: rgba(230,244,236,0.78);
  font-size: 10.5px; font-weight: 500;
}

/* SECTION */
.kv-share-sec { position: relative; margin-bottom: 16px; }
.kv-share-sec:last-of-type { margin-bottom: 0; }
.kv-share-sec-lbl {
  font-size: 9.5px; font-weight: 700;
  letter-spacing: 0.22em; text-transform: uppercase;
  color: rgba(52,211,153,0.6); margin-bottom: 9px;
}

/* TIMELINE row inside share */
.kv-share-tl-row {
  display: grid; grid-template-columns: 90px 1fr 44px;
  gap: 8px; align-items: center; margin-bottom: 6px;
}
.kv-share-tl-row:last-child { margin-bottom: 0; }
.kv-share-tl-name {
  display: flex; align-items: center; gap: 6px;
  font-size: 11.5px; color: var(--text); font-weight: 500;
  white-space: nowrap; overflow: hidden;
}
.kv-share-tl-av {
  width: 16px; height: 16px; border-radius: 4px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 8.5px; font-weight: 700; color: #06140d;
}
.kv-share-tl-bar {
  height: 8px; background: rgba(255,255,255,0.05);
  border-radius: 99px; overflow: hidden;
  border: 1px solid rgba(52,211,153,0.10);
}
.kv-share-tl-fill { height: 100%; border-radius: 99px; }
.kv-share-tl-dur {
  font-family: var(--mono); font-size: 10px;
  color: var(--text-3); text-align: right;
  font-feature-settings: "tnum" on;
}

/* BALANCE row inside share */
.kv-share-bal-row {
  display: flex; align-items: center; gap: 10px;
  padding: 8px 10px; margin-bottom: 5px;
  background: rgba(255,255,255,0.025);
  border: 1px solid rgba(52,211,153,0.08);
  border-radius: 10px;
}
.kv-share-bal-row:last-child { margin-bottom: 0; }
.kv-share-av {
  width: 28px; height: 28px; border-radius: 8px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 700; color: #06140d;
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.18);
}
.kv-share-bal-name {
  flex: 1; min-width: 0;
}
.kv-share-bal-pname {
  font-size: 13px; font-weight: 600; color: var(--text);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.kv-share-bal-paid {
  font-size: 10.5px; color: var(--text-3); margin-top: 1px;
  font-feature-settings: "tnum" on;
}
.kv-share-bal-amt {
  font-family: var(--mono); font-size: 14px; font-weight: 700;
  letter-spacing: -0.4px;
  font-feature-settings: "tnum" on;
}
.kv-share-bal-amt.pos  { color: var(--green); }
.kv-share-bal-amt.neg  { color: var(--red); }
.kv-share-bal-amt.zero { color: var(--text-3); }

/* SETTLEMENT row inside share */
.kv-share-set-row {
  display: flex; align-items: center; gap: 8px;
  padding: 9px 11px; margin-bottom: 5px;
  background: rgba(52,211,153,0.04);
  border: 1px solid rgba(52,211,153,0.12);
  border-radius: 10px;
}
.kv-share-set-row:last-child { margin-bottom: 0; }
.kv-share-set-side {
  display: flex; align-items: center; gap: 6px;
  font-size: 12px; font-weight: 600; color: var(--text);
}
.kv-share-set-arrow { color: var(--primary); display: flex; align-items: center; }
.kv-share-set-amt {
  margin-left: auto;
  font-family: var(--mono); font-size: 13px; font-weight: 700;
  color: var(--primary);
  font-feature-settings: "tnum" on;
}

/* SETTLED state in share */
.kv-share-settled {
  display: flex; align-items: center; justify-content: center;
  gap: 8px; padding: 14px;
  background: rgba(52,211,153,0.07);
  border: 1px solid rgba(52,211,153,0.22);
  border-radius: 12px;
  font-size: 13px; font-weight: 600; color: var(--green);
  letter-spacing: -0.1px;
}

/* FOOTER tagline */
.kv-share-foot {
  margin-top: 18px; padding-top: 14px;
  border-top: 1px solid rgba(52,211,153,0.10);
  display: flex; align-items: center; justify-content: space-between;
  font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase;
  color: rgba(230,244,236,0.42); font-weight: 600;
  position: relative;
}
.kv-share-foot-brand {
  display: flex; align-items: center; gap: 6px;
  color: rgba(52,211,153,0.7);
}
.kv-share-foot-tag { color: rgba(230,244,236,0.45); }

/* ── SCROLLBAR ─────────────────────────────────────────────── */
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(52,211,153,0.16); border-radius: 99px; }
::-webkit-scrollbar-thumb:hover { background: rgba(52,211,153,0.28); }

/* ── TIME SPLIT — person row ───────────────────────────────── */
.kv-trow {
  padding: 14px 0;
  border-bottom: 1px solid var(--border);
}
.kv-trow:last-of-type  { border-bottom: none; padding-bottom: 0; }
.kv-trow:first-of-type { padding-top: 0; }

.kv-trow-top { display: flex; align-items: center; gap: 8px; margin-bottom: 11px; }
.kv-trow-right {
  display: flex; flex-direction: column; align-items: flex-end;
  flex-shrink: 0; gap: 2px;
}
.kv-trow-time {
  font-family: var(--mono); font-size: 13px; font-weight: 700;
  color: var(--text); letter-spacing: -0.3px;
  font-feature-settings: "tnum" on;
}
.kv-trow-share {
  font-size: 11px; color: var(--text-3); font-weight: 500;
  font-feature-settings: "tnum" on;
}

/* ── SLIDER ────────────────────────────────────────────────── */
.kv-slider {
  -webkit-appearance: none; appearance: none;
  width: 100%; height: 6px; border-radius: 99px;
  outline: none; cursor: pointer; display: block;
  margin-bottom: 11px;
}
.kv-slider::-webkit-slider-thumb {
  -webkit-appearance: none; appearance: none;
  width: 22px; height: 22px; border-radius: 50%;
  background: linear-gradient(135deg, #ecfdf5, #6ee7b7);
  box-shadow:
    0 0 0 3px rgba(52,211,153,0.22),
    0 2px 10px rgba(52,211,153,0.45),
    inset 0 1px 0 rgba(255,255,255,0.4);
  cursor: grab; transition: transform 0.14s, box-shadow 0.14s;
}
.kv-slider::-webkit-slider-thumb:active {
  transform: scale(1.22); cursor: grabbing;
  box-shadow:
    0 0 0 6px rgba(52,211,153,0.28),
    0 2px 14px rgba(52,211,153,0.55);
}
.kv-slider::-moz-range-thumb {
  width: 22px; height: 22px; border-radius: 50%; border: none;
  background: linear-gradient(135deg, #ecfdf5, #6ee7b7);
  box-shadow: 0 0 0 3px rgba(52,211,153,0.22), 0 2px 10px rgba(52,211,153,0.45);
  cursor: grab;
}

.kv-trow-footer {
  display: flex; align-items: center; justify-content: space-between;
  gap: 8px; flex-wrap: wrap;
}
.kv-presets { display: flex; gap: 5px; }
.kv-preset {
  height: 28px; padding: 0 11px; border-radius: 7px;
  border: 1px solid var(--border); background: rgba(0,0,0,0.25);
  color: var(--text-2);
  font-family: var(--font); font-size: 11px; font-weight: 600;
  cursor: pointer; transition: all 0.16s cubic-bezier(0.4,0,0.2,1);
  white-space: nowrap; letter-spacing: 0.02em;
}
.kv-preset:hover {
  background: rgba(52,211,153,0.09); border-color: var(--border-2); color: var(--primary);
}
.kv-preset.on {
  background: rgba(52,211,153,0.16); border-color: rgba(52,211,153,0.5);
  color: #6ee7b7; font-weight: 700;
  box-shadow: 0 0 12px rgba(52,211,153,0.18);
}
.kv-preset:active { transform: scale(0.94); }

.kv-trow-paid-wrap { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
.kv-trow-paid-lbl  { font-size: 10.5px; color: var(--text-3); white-space: nowrap; letter-spacing: 0.08em; text-transform: uppercase; font-weight: 600; }

/* ── PARTICIPATION TIMELINE ────────────────────────────────── */
.kv-tl-hdr {
  display: flex; align-items: baseline; justify-content: space-between;
  margin-bottom: 16px;
}
.kv-tl-title {
  font-size: 13px; font-weight: 700; color: var(--text);
  display: inline-flex; align-items: center; gap: 7px;
}
.kv-tl-sub {
  font-family: var(--mono); font-size: 11px; color: var(--text-3);
  font-feature-settings: "tnum" on;
}

.kv-tl-row {
  display: grid; grid-template-columns: 90px 1fr 44px;
  gap: 10px; align-items: center; margin-bottom: 10px;
}
.kv-tl-row:last-child { margin-bottom: 0; }
.kv-tl-person { display: flex; align-items: center; gap: 7px; overflow: hidden; min-width: 0; }
.kv-tl-pname  {
  font-size: 11.5px; font-weight: 500; color: var(--text);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.kv-tl-track {
  height: 9px; background: rgba(0,0,0,0.32);
  border-radius: 99px; overflow: hidden;
  border: 1px solid var(--border);
}
.kv-tl-fill {
  height: 100%; border-radius: 99px;
  transform-origin: left;
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.18);
}
.kv-tl-dur {
  font-family: var(--mono); font-size: 10.5px; color: var(--text-3);
  text-align: right; white-space: nowrap;
  font-feature-settings: "tnum" on;
}

/* ── FAIRNESS STRIP ────────────────────────────────────────── */
.kv-fi {
  margin-top: 16px; padding-top: 14px;
  border-top: 1px solid var(--border);
  display: flex; align-items: center; gap: 6px; flex-wrap: wrap;
}
.kv-fi-lbl {
  font-size: 10px; color: var(--text-3); flex-shrink: 0;
  letter-spacing: 0.1em; text-transform: uppercase; font-weight: 600;
}
.kv-badge {
  display: inline-flex; align-items: center; gap: 3px;
  height: 22px; padding: 0 8px; border-radius: 99px;
  font-size: 10px; font-weight: 700; white-space: nowrap;
  letter-spacing: 0.01em;
  font-feature-settings: "tnum" on;
}
.kv-badge.save { background: var(--green-dim); color: var(--green); border: 1px solid rgba(52,211,153,0.22); }
.kv-badge.more { background: var(--red-dim);   color: var(--red);   border: 1px solid rgba(248,113,113,0.22); }
.kv-badge.even { background: rgba(255,255,255,0.04); color: var(--text-3); border: 1px solid var(--border); }

.kv-dur-hint {
  margin-bottom: 14px; padding: 11px 13px; border-radius: 10px;
  background: rgba(52,211,153,0.06); border: 1px solid rgba(52,211,153,0.18);
  font-size: 12px; color: rgba(110,231,183,0.85); font-weight: 500;
  display: flex; align-items: center; gap: 8px;
}

/* ── FOOTER ─────────────────────────────────────────────── */
.kv-footer {
  margin-top: 56px; padding-top: 28px;
  border-top: 1px solid var(--border);
  text-align: center;
  font-size: 11px; color: var(--text-3);
  letter-spacing: 0.06em;
}
.kv-footer a { color: rgba(52,211,153,0.65); text-decoration: none; }
.kv-footer a:hover { color: var(--primary); }
`;

// ═════════════════════════════════════════════════════════════
//  CONSTANTS
// ═════════════════════════════════════════════════════════════
const AVATAR_COLORS = [
  "#34d399", "#60a5fa", "#fbbf24", "#f472b6",
  "#a78bfa", "#22d3ee", "#fb923c", "#4ade80",
];
const DEFAULT_NAMES = ["Alice", "Bob", "Cara", "Dom", "Eli", "Fae", "Gus", "Hari"];

// ── Sample data per mode ─────────────────────────────────────
// "Try with sample data" loads the scenario for the current mode
// rather than forcing the user into By Time. Each sample also carries
// the label the hero CTA shows so the button self-describes.
const SAMPLES = {
  equal: {
    description: "Sushi night",
    amount: "84",
    bookingDuration: "",
    people: [
      { id: 1, name: "Alice", paid: "84", percent: 0, minutes: 0 },
      { id: 2, name: "Bob",   paid: "",   percent: 0, minutes: 0 },
      { id: 3, name: "Cara",  paid: "",   percent: 0, minutes: 0 },
      { id: 4, name: "Dom",   paid: "",   percent: 0, minutes: 0 },
    ],
    ctaLabel:   "Try a sample dinner",
    toastLabel: "sushi night, £84",
  },
  manual: {
    description: "Birthday dinner",
    amount: "120",
    bookingDuration: "",
    people: [
      { id: 1, name: "Alice", paid: "120", percent: 40, minutes: 0 },
      { id: 2, name: "Bob",   paid: "",    percent: 30, minutes: 0 },
      { id: 3, name: "Cara",  paid: "",    percent: 20, minutes: 0 },
      { id: 4, name: "Dom",   paid: "",    percent: 10, minutes: 0 },
    ],
    ctaLabel:   "Try a weighted split",
    toastLabel: "birthday dinner · 40 / 30 / 20 / 10",
  },
  time: {
    description: "Saturday padel",
    amount: "48",
    bookingDuration: "90",
    people: [
      { id: 1, name: "Alice", paid: "48", percent: 0, minutes: 90 },
      { id: 2, name: "Bob",   paid: "",   percent: 0, minutes: 90 },
      { id: 3, name: "Cara",  paid: "",   percent: 0, minutes: 60 },
      { id: 4, name: "Dom",   paid: "",   percent: 0, minutes: 45 },
    ],
    ctaLabel:   "Try a padel session",
    toastLabel: "Saturday padel · 90 min",
  },
};

// ═════════════════════════════════════════════════════════════
//  LOGO MARK — split-then-settled equals sign
//    top bar broken into two pieces (the split)
//    bottom bar whole (call it even)
// ═════════════════════════════════════════════════════════════
function SplidItMark({ size = 22 }) {
  const s = size;
  const barH = s * 0.16;
  const topYc = s * 0.34;
  const botYc = s * 0.66;
  const gapX = s * 0.18;
  const halfW = (s - gapX) / 2;
  const fill = "rgba(255,255,255,0.96)";

  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none">
      <rect x="0"             y={topYc - barH / 2} width={halfW} height={barH} rx={barH / 2} fill={fill} />
      <rect x={halfW + gapX}  y={topYc - barH / 2} width={halfW} height={barH} rx={barH / 2} fill={fill} />
      <rect x="0"             y={botYc - barH / 2} width={s}     height={barH} rx={barH / 2} fill={fill} />
    </svg>
  );
}

// ═════════════════════════════════════════════════════════════
//  HELPERS
// ═════════════════════════════════════════════════════════════
const init = (name) => (name || "?").charAt(0).toUpperCase();
const fmt  = (n)    => Math.abs(n).toFixed(2);
const formatMins = (m) => {
  const n = Number(m) || 0;
  if (n <= 0) return "0m";
  const h = Math.floor(n / 60);
  const min = n % 60;
  if (h === 0) return `${min}m`;
  if (min === 0) return `${h}h`;
  return `${h}h ${min}m`;
};

// ═════════════════════════════════════════════════════════════
//  COMPONENT: CountUp — animates a number with motion values
// ═════════════════════════════════════════════════════════════
function CountUp({ value, prefix = "£", decimals = 2, duration = 0.55 }) {
  const reduce = useReducedMotion();
  const mv = useMotionValue(value);
  const display = useTransform(mv, v => prefix + (Math.abs(v) < 0.005 ? 0 : v).toFixed(decimals));

  useEffect(() => {
    if (reduce) { mv.set(value); return; }
    const controls = animate(mv, value, {
      duration,
      ease: [0.32, 0.72, 0.24, 1],
    });
    return () => controls.stop();
  }, [value, duration, reduce, mv]);

  return <motion.span>{display}</motion.span>;
}

// ═════════════════════════════════════════════════════════════
//  COMPONENT: Reveal — fades child up on scroll into view
// ═════════════════════════════════════════════════════════════
function Reveal({ children, delay = 0, y = 18 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay, ease: [0.4, 0, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ═════════════════════════════════════════════════════════════
//  COMPONENT: Hero
// ═════════════════════════════════════════════════════════════
function Hero({ onSample, total, showHint, mode }) {
  const ctaLabel = (SAMPLES[mode] || SAMPLES.equal).ctaLabel;
  return (
    <header className="kv-hero">
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: -8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.32, 0.72, 0.24, 1] }}
        className="kv-hero-mark"
      >
        <SplidItMark size={28} />
      </motion.div>

      <motion.h1
        className="kv-hero-title"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.08 }}
      >
        SplidIt
      </motion.h1>

      <motion.p
        className="kv-hero-tag"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.18 }}
      >
        ~ Call it even ~
      </motion.p>

      <motion.div
        className="kv-hero-pills"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.28 }}
      >
        <span className="kv-hero-pill"><span className="dot" /> No account</span>
        <span className="kv-hero-pill">3 split modes</span>
        <span className="kv-hero-pill">Instant settle-up</span>
      </motion.div>

      {showHint && (
        <motion.p
          className="kv-hero-tip"
          aria-hidden="true"
          initial={{ opacity: 0, y: -3 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.55 }}
        >
          New here? Start with a demo
        </motion.p>
      )}

      <div className="kv-hero-cta-wrap">
        {showHint && (
          <>
            <motion.span
              className="kv-hero-cta-ring"
              aria-hidden="true"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: [0, 0.65, 0], scale: [1, 1.28, 1.45] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.25, delay: 0.7, ease: "easeOut" }}
            />
            <motion.span
              className="kv-hero-cta-ring kv-hero-cta-ring-2"
              aria-hidden="true"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: [0, 0.4, 0], scale: [1, 1.35, 1.6] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.25, delay: 1.3, ease: "easeOut" }}
            />
          </>
        )}
        <motion.button
          type="button"
          className={`kv-hero-cta${showHint ? " hint" : ""}`}
          onClick={onSample}
          initial={{ opacity: 0, y: 8 }}
          animate={
            showHint
              ? {
                  opacity: 1, y: 0,
                  scale: [1, 1.04, 1],
                  boxShadow: [
                    "0 4px 20px rgba(52,211,153,0.18)",
                    "0 10px 48px rgba(52,211,153,0.7)",
                    "0 4px 20px rgba(52,211,153,0.18)",
                  ],
                }
              : { opacity: 1, y: 0, scale: 1, boxShadow: "0 4px 20px rgba(52,211,153,0.12)" }
          }
          transition={
            showHint
              ? {
                  default:   { duration: 0.5, delay: 0.38 },
                  scale:     { duration: 1.6, delay: 0.7, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.2 },
                  boxShadow: { duration: 1.6, delay: 0.7, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.2 },
                }
              : { duration: 0.4, delay: 0 }
          }
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.96 }}
        >
          <Sparkles size={14} />
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={ctaLabel}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18 }}
              style={{ display: "inline-block" }}
            >
              {ctaLabel}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </div>

      {total === 0 && (
        <motion.div
          className="kv-scroll-cue"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <ChevronDown size={18} />
        </motion.div>
      )}
    </header>
  );
}

// ═════════════════════════════════════════════════════════════
//  COMPONENT: ModePicker — animated 3-tab selector
// ═════════════════════════════════════════════════════════════
function ModePicker({ mode, setMode }) {
  const MODES = [
    { id: "equal",  Icon: Scale,   label: "Equal",    desc: "Same share for everyone"        },
    { id: "manual", Icon: Percent, label: "Custom %", desc: "Set each person's percentage"   },
    { id: "time",   Icon: Clock,   label: "By Time",  desc: "Pay in proportion to time used" },
  ];
  const idx = MODES.findIndex(m => m.id === mode);
  const active = MODES[idx] || MODES[0];
  const tabRefs = useRef([]);

  const onKeyDown = (e) => {
    let next = idx;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (idx + 1) % MODES.length;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (idx - 1 + MODES.length) % MODES.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End")  next = MODES.length - 1;
    else return;
    e.preventDefault();
    setMode(MODES[next].id);
    requestAnimationFrame(() => tabRefs.current[next]?.focus());
  };

  return (
    <div>
      <div
        className="kv-modes"
        role="tablist"
        aria-label="Split mode"
        aria-orientation="horizontal"
        onKeyDown={onKeyDown}
      >
        {MODES.map((m, i) => {
          const on = mode === m.id;
          return (
            <button
              key={m.id}
              ref={el => (tabRefs.current[i] = el)}
              type="button"
              role="tab"
              id={`kv-mode-tab-${m.id}`}
              aria-selected={on}
              aria-controls="kv-mode-desc"
              tabIndex={on ? 0 : -1}
              className={`kv-mode${on ? " on" : ""}`}
              onClick={() => setMode(m.id)}
              style={{ position: "relative" }}
            >
              {on && (
                <motion.span
                  layoutId="kv-mode-ind"
                  className="kv-mode-ind"
                  aria-hidden="true"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span style={{ position: "relative", zIndex: 2, display: "inline-flex", alignItems: "center", gap: 6 }}>
                <m.Icon size={13} aria-hidden="true" />
                {m.label}
              </span>
            </button>
          );
        })}
      </div>
      <AnimatePresence mode="wait">
        <motion.p
          key={active.id}
          id="kv-mode-desc"
          className="kv-mode-desc"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.18 }}
        >
          {active.desc}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
//  COMPONENT: ExpenseInput
// ═════════════════════════════════════════════════════════════
function ExpenseInput({ description, setDescription, amount, setAmount, mode, bookingDuration, setBookingDuration }) {
  return (
    <div className="kv-card">
      <div className="kv-field">
        <label className="kv-field-lbl">
          {mode === "time" ? "What's the booking?" : "What's the expense?"}
        </label>
        <input
          className="kv-inp"
          type="text"
          placeholder={mode === "time" ? "Padel court, tennis session, gym slot…" : "Dinner at Nobu, Uber to airport…"}
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      </div>

      <div className="kv-field">
        <label className="kv-field-lbl">Total {mode === "time" ? "booking cost" : "amount"}</label>
        <div className="kv-pfx-wrap">
          <span className="kv-pfx">£</span>
          <input
            className="kv-inp pl"
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={e => setAmount(e.target.value)}
          />
        </div>
      </div>

      {mode === "time" && (
        <motion.div
          className="kv-field"
          initial={{ opacity: 0, height: 0, marginBottom: 0 }}
          animate={{ opacity: 1, height: "auto", marginBottom: 14 }}
          exit={{ opacity: 0, height: 0, marginBottom: 0 }}
          transition={{ duration: 0.22 }}
        >
          <label className="kv-field-lbl">Session duration</label>
          <div className="kv-pfx-wrap">
            <input
              className="kv-inp pr"
              type="number"
              placeholder="90"
              min="1"
              value={bookingDuration}
              onChange={e => setBookingDuration(e.target.value)}
            />
            <span className="kv-sfx">min</span>
          </div>
        </motion.div>
      )}
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
    <motion.div
      className={`kv-row ${row}`}
      layout
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className="kv-name-cell">
        <div className="kv-av" style={{ background: AVATAR_COLORS[index % AVATAR_COLORS.length] }}>
          {init(person.name)}
        </div>
        <input
          className="kv-inp sm"
          value={person.name}
          placeholder="Name"
          onChange={e => onUpdate("name", e.target.value)}
        />
      </div>

      <input
        className="kv-inp sm center"
        type="number"
        placeholder="0"
        value={person.paid}
        onChange={e => onUpdate("paid", e.target.value)}
      />

      {mode === "manual" && (
        <input
          className="kv-inp sm center"
          type="number"
          placeholder="0"
          value={person.percent}
          onChange={e => onUpdate("percent", e.target.value)}
        />
      )}

      <div className={`kv-bal ${cls}`}>
        {isNeg ? "−" : isPos ? "+" : ""}
        <CountUp value={Math.abs(owes)} prefix="£" />
      </div>
    </motion.div>
  );
}

// ═════════════════════════════════════════════════════════════
//  COMPONENT: TimePersonRow
// ═════════════════════════════════════════════════════════════
function TimePersonRow({ person, index, onUpdate, bookingDuration, owes, timeShare }) {
  const totalMin = Number(bookingDuration) || 120;
  const mins     = Number(person.minutes) || 0;
  const pct      = totalMin > 0 ? Math.min((mins / totalMin) * 100, 100) : 0;
  const color    = AVATAR_COLORS[index % AVATAR_COLORS.length];

  const isNeg  = owes >  0.005;
  const isPos  = owes < -0.005;
  const balCls = isNeg ? "neg" : isPos ? "pos" : "zero";

  const PRESETS = [
    { label: "Full", frac: 1    },
    { label: "¾",    frac: 0.75 },
    { label: "½",    frac: 0.5  },
    { label: "¼",    frac: 0.25 },
  ];
  const setPreset = (frac) => onUpdate("minutes", Math.round(totalMin * frac));
  const isActive  = (frac) => Math.abs(mins - Math.round(totalMin * frac)) <= 2;

  return (
    <motion.div
      className="kv-trow"
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className="kv-trow-top">
        <div className="kv-av" style={{ background: color }}>{init(person.name)}</div>
        <input
          className="kv-inp sm"
          value={person.name}
          placeholder="Name"
          onChange={e => onUpdate("name", e.target.value)}
          style={{ flex: 1, minWidth: 0 }}
        />
        <div className="kv-trow-right">
          <div className="kv-trow-time">{formatMins(mins)}</div>
          <div className="kv-trow-share">£{timeShare.toFixed(2)} share</div>
        </div>
      </div>

      <input
        type="range"
        className="kv-slider"
        min="0"
        max={totalMin}
        step="5"
        value={mins}
        onChange={e => onUpdate("minutes", Number(e.target.value))}
        aria-label={`${person.name || "Person"} time played`}
        aria-valuetext={`${formatMins(mins)} of ${formatMins(totalMin)}`}
        style={{
          background: `linear-gradient(to right, ${color} 0%, ${color} ${pct}%, rgba(255,255,255,0.06) ${pct}%, rgba(255,255,255,0.06) 100%)`
        }}
      />

      <div className="kv-trow-footer">
        <div className="kv-presets">
          {PRESETS.map(({ label, frac }) => (
            <button
              key={frac}
              className={`kv-preset${isActive(frac) ? " on" : ""}`}
              onClick={() => setPreset(frac)}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="kv-trow-paid-wrap">
          <span className="kv-trow-paid-lbl">Paid</span>
          <div className="kv-pfx-wrap">
            <span className="kv-pfx" style={{ fontSize: 12, left: 9 }}>£</span>
            <input
              className="kv-inp sm pl"
              type="number"
              placeholder="0"
              value={person.paid}
              onChange={e => onUpdate("paid", e.target.value)}
              style={{ width: 78, paddingLeft: 22 }}
            />
          </div>
        </div>
      </div>

      <div className={`kv-bal ${balCls}`} style={{ marginTop: 11, fontSize: 12 }}>
        {isNeg ? "−" : isPos ? "+" : ""}
        <CountUp value={Math.abs(owes)} prefix="£" />
        <span style={{ fontFamily: "var(--font)", fontWeight: 600, marginLeft: 7, opacity: 0.65, fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase" }}>
          {isNeg ? "owes" : isPos ? "gets back" : "settled"}
        </span>
      </div>
    </motion.div>
  );
}

// ═════════════════════════════════════════════════════════════
//  COMPONENT: ParticipationTimeline
// ═════════════════════════════════════════════════════════════
function ParticipationTimeline({ people, bookingDuration, total }) {
  const totalMin = Number(bookingDuration) || 0;
  // bar widths show each person's fraction of the SESSION (cap at 100%)
  const barDenom   = totalMin > 0
    ? totalMin
    : people.reduce((s, p) => s + (Number(p.minutes) || 0), 0);
  // cost share denominator is total person-minutes (so shares sum to total)
  const shareDenom = people.reduce((s, p) => s + (Number(p.minutes) || 0), 0);
  const equalShare = people.length > 0 ? total / people.length : 0;

  return (
    <div className="kv-card">
      <div className="kv-tl-hdr">
        <span className="kv-tl-title">
          <Clock size={13} style={{ color: "var(--primary)", opacity: 0.7 }} />
          Participation
        </span>
        {totalMin > 0 && (
          <span className="kv-tl-sub">{formatMins(totalMin)} session</span>
        )}
      </div>

      {people.map((p, i) => {
        const mins  = Number(p.minutes) || 0;
        const pct   = barDenom > 0 ? Math.min((mins / barDenom) * 100, 100) : 0;
        const color = AVATAR_COLORS[i % AVATAR_COLORS.length];

        return (
          <div key={p.id} className="kv-tl-row">
            <div className="kv-tl-person">
              <div
                className="kv-av"
                style={{ background: color, width: 18, height: 18, borderRadius: 5, fontSize: 8.5, flexShrink: 0 }}
              >
                {init(p.name)}
              </div>
              <span className="kv-tl-pname">{p.name || "—"}</span>
            </div>
            <div className="kv-tl-track">
              <motion.div
                className="kv-tl-fill"
                style={{ background: color }}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
              />
            </div>
            <span className="kv-tl-dur">{formatMins(mins)}</span>
          </div>
        );
      })}

      {total > 0 && shareDenom > 0 && (
        <div className="kv-fi">
          <span className="kv-fi-lbl">vs equal £{equalShare.toFixed(2)}</span>
          {people.map((p, i) => {
            const mins      = Number(p.minutes) || 0;
            const timeShare = (total * mins) / shareDenom;
            const diff      = equalShare - timeShare;
            const absDiff   = Math.abs(diff);
            const cls  = absDiff < 0.05 ? "even" : diff > 0 ? "save" : "more";
            const text = absDiff < 0.05
              ? `${init(p.name)} ±£0`
              : diff > 0
                ? `${init(p.name)} −£${diff.toFixed(2)}`
                : `${init(p.name)} +£${absDiff.toFixed(2)}`;
            return <span key={p.id} className={`kv-badge ${cls}`}>{text}</span>;
          })}
        </div>
      )}
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
//  COMPONENT: BalanceSummary
// ═════════════════════════════════════════════════════════════
function BalanceSummary({ people, total, getOwes, mode, bookingDuration }) {
  return (
    <>
      <div className="kv-stats">
        <div className="kv-stat">
          <div className="kv-stat-lbl">Total</div>
          <div className="kv-stat-val">
            <CountUp value={total} prefix="£" />
          </div>
        </div>
        <div className="kv-stat">
          <div className="kv-stat-lbl">People</div>
          <div className="kv-stat-val">{people.length}</div>
        </div>
        <div className="kv-stat">
          <div className="kv-stat-lbl">{mode === "time" ? "Session" : mode === "equal" ? "Each" : "Avg"}</div>
          <div className="kv-stat-val">
            {mode === "time" && Number(bookingDuration) > 0
              ? formatMins(Number(bookingDuration))
              : <CountUp value={total / people.length} prefix="£" />}
          </div>
        </div>
      </div>

      <div className="kv-positions">
        {people.map((p, i) => {
          const owes = getOwes(p);
          const isPos  = owes < -0.005;
          const isNeg  = owes >  0.005;
          const cls    = isPos ? "pos" : isNeg ? "neg" : "zero";

          return (
            <motion.div
              key={p.id}
              className="kv-pos"
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.28, delay: i * 0.04 }}
            >
              <div className="kv-pos-top">
                <div className="kv-av" style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}>
                  {init(p.name)}
                </div>
                <div>
                  <div className="kv-pos-name">{p.name || "—"}</div>
                  <div className="kv-pos-sub">
                    {mode === "time"
                      ? `Played ${formatMins(Number(p.minutes) || 0)}`
                      : `Paid £${fmt(Number(p.paid) || 0)}`}
                  </div>
                </div>
              </div>
              <div className={`kv-pos-amt ${cls}`}>
                {isPos ? "+" : isNeg ? "−" : ""}
                <CountUp value={Math.abs(owes)} prefix="£" />
              </div>
              <div className={`kv-pos-role ${cls}`}>
                {isPos ? "Gets back" : isNeg ? "Owes" : "Settled"}
              </div>
            </motion.div>
          );
        })}
      </div>
    </>
  );
}

// ═════════════════════════════════════════════════════════════
//  COMPONENT: SettlementList
// ═════════════════════════════════════════════════════════════
function SettlementList({ settlements, colorMap }) {
  if (!settlements.length) {
    return <SettledBurst />;
  }

  return (
    <div>
      {settlements.map((s, i) => (
        <motion.div
          key={`${s.from}-${s.to}-${i}`}
          className="kv-settle"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32, delay: i * 0.05 }}
        >
          <div className="kv-settle-side">
            <div className="kv-av" style={{ background: colorMap[s.from] || AVATAR_COLORS[0] }}>
              {init(s.from)}
            </div>
            <div>
              <div className="kv-settle-sname">{s.from}</div>
              <div className="kv-settle-verb">Sends</div>
            </div>
          </div>

          <div className="kv-settle-mid">
            <div className="kv-settle-amt">£{s.amount.toFixed(2)}</div>
            <div className="kv-settle-track">
              <motion.div
                className="kv-settle-line"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.05, ease: [0.4, 0, 0.2, 1] }}
              />
              <motion.div
                className="kv-settle-arrow"
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.5 + i * 0.05 }}
              >
                <ArrowRight size={13} />
              </motion.div>
            </div>
          </div>

          <div className="kv-settle-side right">
            <div className="kv-av" style={{ background: colorMap[s.to] || AVATAR_COLORS[1] }}>
              {init(s.to)}
            </div>
            <div style={{ textAlign: "right" }}>
              <div className="kv-settle-sname">{s.to}</div>
              <div className="kv-settle-verb">Receives</div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
//  COMPONENT: SettledBurst — celebration when no transfers needed
// ═════════════════════════════════════════════════════════════
function SettledBurst() {
  return (
    <div className="kv-settled" role="status" aria-label="All settled — no transfers needed">
      <motion.div
        className="kv-settled-icon-wrap"
        aria-hidden="true"
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 280, damping: 18, delay: 0.05 }}
      >
        <Check size={28} strokeWidth={2.6} />
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            className="kv-settled-burst"
            initial={{ scale: 0.6, opacity: 0.55 }}
            animate={{ scale: 1.7 + i * 0.25, opacity: 0 }}
            transition={{
              duration: 1.4,
              delay: 0.18 + i * 0.18,
              repeat: Infinity,
              repeatDelay: 1.6,
              ease: "easeOut",
            }}
          />
        ))}
      </motion.div>
      <motion.div
        className="kv-settled-title"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25 }}
      >
        All settled up!
      </motion.div>
      <motion.div
        className="kv-settled-sub"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        No transfers needed — everyone's even.
      </motion.div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
//  COMPONENT: ShareCard — html2canvas-safe export receipt
// ═════════════════════════════════════════════════════════════
const ShareCard = forwardRef(function ShareCard(
  { description, total, people, mode, bookingDuration, getOwes, settlements },
  ref
) {
  const totalMin    = Number(bookingDuration) || 0;
  const denominator = totalMin > 0
    ? totalMin
    : people.reduce((s, p) => s + (Number(p.minutes) || 0), 0);

  const modeLabel =
    mode === "equal"  ? "Equal split"
  : mode === "manual" ? "Custom %"
  :                     "By time";

  return (
    <div className="kv-share" ref={ref}>
      {/* Header: brand + description */}
      <div className="kv-share-hdr">
        <div className="kv-share-mark"><SplidItMark size={20} /></div>
        <div>
          <div className="kv-share-brand">
            SplidIt <span className="kv-share-brand-dot" />
          </div>
          <div className="kv-share-desc">{description || "Untitled split"}</div>
        </div>
      </div>

      {/* Hero amount */}
      <div className="kv-share-hero">
        <div className="kv-share-hero-lbl">Total</div>
        <div className="kv-share-amount">£{total.toFixed(2)}</div>
        <div className="kv-share-meta">
          <span className="kv-share-meta-pill">{people.length} {people.length === 1 ? "person" : "people"}</span>
          <span className="kv-share-meta-pill">{modeLabel}</span>
          {mode === "time" && totalMin > 0 && (
            <span className="kv-share-meta-pill">{formatMins(totalMin)} session</span>
          )}
        </div>
      </div>

      {/* Timeline (time mode only) */}
      {mode === "time" && denominator > 0 && (
        <div className="kv-share-sec">
          <div className="kv-share-sec-lbl">Participation</div>
          {people.map((p, i) => {
            const mins  = Number(p.minutes) || 0;
            const pct   = Math.min((mins / denominator) * 100, 100);
            const color = AVATAR_COLORS[i % AVATAR_COLORS.length];
            return (
              <div key={p.id} className="kv-share-tl-row">
                <div className="kv-share-tl-name">
                  <div className="kv-share-tl-av" style={{ background: color }}>{init(p.name)}</div>
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{p.name || "—"}</span>
                </div>
                <div className="kv-share-tl-bar">
                  <div className="kv-share-tl-fill" style={{ width: `${pct}%`, background: color }} />
                </div>
                <span className="kv-share-tl-dur">{formatMins(mins)}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Balances */}
      <div className="kv-share-sec">
        <div className="kv-share-sec-lbl">Balances</div>
        {people.map((p, i) => {
          const owes  = getOwes(p);
          const isPos = owes < -0.005;
          const isNeg = owes >  0.005;
          const cls   = isPos ? "pos" : isNeg ? "neg" : "zero";
          const color = AVATAR_COLORS[i % AVATAR_COLORS.length];
          const paid  = Number(p.paid) || 0;
          const subText = mode === "time"
            ? `Played ${formatMins(Number(p.minutes) || 0)} · paid £${paid.toFixed(2)}`
            : `Paid £${paid.toFixed(2)}`;
          return (
            <div key={p.id} className="kv-share-bal-row">
              <div className="kv-share-av" style={{ background: color }}>{init(p.name)}</div>
              <div className="kv-share-bal-name">
                <div className="kv-share-bal-pname">{p.name || "—"}</div>
                <div className="kv-share-bal-paid">{subText}</div>
              </div>
              <div className={`kv-share-bal-amt ${cls}`}>
                {isPos ? "+" : isNeg ? "−" : ""}£{fmt(owes)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Settlements */}
      <div className="kv-share-sec">
        <div className="kv-share-sec-lbl">Settle up</div>
        {settlements.length === 0 ? (
          <div className="kv-share-settled">
            <Check size={14} strokeWidth={3} /> All settled — no transfers needed
          </div>
        ) : (
          settlements.map((s, i) => {
            const fromColor = AVATAR_COLORS[people.findIndex(p => p.name === s.from) % AVATAR_COLORS.length] || AVATAR_COLORS[0];
            const toColor   = AVATAR_COLORS[people.findIndex(p => p.name === s.to)   % AVATAR_COLORS.length] || AVATAR_COLORS[1];
            return (
              <div key={i} className="kv-share-set-row">
                <div className="kv-share-set-side">
                  <div className="kv-share-tl-av" style={{ background: fromColor }}>{init(s.from)}</div>
                  {s.from}
                </div>
                <div className="kv-share-set-arrow"><ArrowRight size={12} /></div>
                <div className="kv-share-set-side">
                  <div className="kv-share-tl-av" style={{ background: toColor }}>{init(s.to)}</div>
                  {s.to}
                </div>
                <span className="kv-share-set-amt">£{s.amount.toFixed(2)}</span>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="kv-share-foot">
        <span className="kv-share-foot-brand">
          <span className="kv-share-brand-dot" /> SPLIDIT
        </span>
        <span className="kv-share-foot-tag">CALL · IT · EVEN</span>
      </div>
    </div>
  );
});

// ═════════════════════════════════════════════════════════════
//  MAIN APP
// ═════════════════════════════════════════════════════════════
export default function App() {
  const [people, setPeople] = useState([
    { id: 1, name: "Alice", paid: "", percent: 0, minutes: 0 },
    { id: 2, name: "Bob",   paid: "", percent: 0, minutes: 0 },
  ]);
  const [amount,          setAmount]          = useState("");
  const [description,     setDescription]     = useState("");
  const [mode,            setMode]            = useState("equal");
  const [bookingDuration, setBookingDuration] = useState("");
  const [toast,           setToast]           = useState({ show: false, msg: "" });
  const [copied,          setCopied]          = useState(null);
  const [pos,             setPos]             = useState({ x: 0, y: 0 });
  const shareRef = useRef();

  // Inject styles
  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = CSS;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);

  // Body bg always dark for this revamp
  useEffect(() => {
    document.body.style.background =
      "radial-gradient(ellipse at 60% 0%, #0a1410 0%, #060c08 60%, #040a06 100%)";
  }, []);

  // Restore: URL data takes priority, then fall back to localStorage
  const [hydrated, setHydrated] = useState(false);
  const [showHint, setShowHint] = useState(false);
  useEffect(() => {
    const apply = (parsed) => {
      const ppl = parsed.people.map(p => ({ ...p, percent: p.percent ?? 0, minutes: p.minutes ?? 0 }));
      setPeople(ppl);
      setAmount(parsed.amount ?? "");
      setDescription(parsed.description ?? "");
      setBookingDuration(parsed.bookingDuration || "");
      setMode(parsed.mode || (ppl.some(p => Number(p.percent) > 0) ? "manual" : "equal"));
    };

    const urlData = new URLSearchParams(window.location.search).get("data");
    if (urlData) {
      try { apply(JSON.parse(atob(urlData))); setHydrated(true); return; } catch {}
    }
    let hadStored = false;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) { apply(JSON.parse(stored)); hadStored = true; }
    } catch {}
    if (!hadStored) setShowHint(true);
    setHydrated(true);
  }, []);

  // Dismiss the first-visit pulse once the user starts engaging with the form
  useEffect(() => {
    if (!showHint) return;
    if (description || amount || bookingDuration) setShowHint(false);
  }, [showHint, description, amount, bookingDuration]);

  // Auto-save to localStorage on change (only after first hydrate to avoid clobbering)
  useEffect(() => {
    if (!hydrated) return;
    const t = setTimeout(() => {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ people, amount, description, mode, bookingDuration }),
        );
      } catch {}
    }, 250);
    return () => clearTimeout(t);
  }, [hydrated, people, amount, description, mode, bookingDuration]);

  // ── derived ──────────────────────────────────────────────
  const total    = Number(amount) || 0;
  const totalPct = people.reduce((s, p) => s + (Number(p.percent) || 0), 0);
  const pctState = totalPct > 100.05 ? "over" : totalPct >= 99.95 ? "ok" : "partial";

  // Cost is split in proportion to each person's share of the TOTAL play-time
  // (sum of every person's minutes), not in proportion to the booking duration.
  // Booking duration only bounds the slider's max — multiple people can overlap.
  const totalPersonMinutes = people.reduce((s, p) => s + (Number(p.minutes) || 0), 0);

  const getTimeShare = (p) => calcTimeShare(total, p.minutes, totalPersonMinutes);

  const getOwes = (p) => {
    const paid = Number(p.paid) || 0;
    if (mode === "equal")  return equalShare(total, people.length) - paid;
    if (mode === "manual") return manualShare(total, p.percent)    - paid;
    return getTimeShare(p) - paid;
  };

  const settlements = total > 0 ? calcSettlements(people, getOwes) : [];

  const colorMap = {};
  people.forEach((p, i) => { colorMap[p.name] = AVATAR_COLORS[i % AVATAR_COLORS.length]; });

  // ── ui helpers ───────────────────────────────────────────
  const showToast = (msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 2200);
  };
  const flash = (key) => {
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  // ── people mutations ─────────────────────────────────────
  const updatePerson = (i, field, val) => {
    const next = [...people];
    next[i] = { ...next[i], [field]: val };
    setPeople(next);
  };
  const addPerson = () => {
    const name = DEFAULT_NAMES[people.length] || `Person ${people.length + 1}`;
    const mins = mode === "time" ? (Number(bookingDuration) || 60) : 0;
    setPeople([...people, { id: Date.now(), name, paid: "", percent: 0, minutes: mins }]);
  };
  const setAllFull = () => {
    const dur = Number(bookingDuration) || 0;
    if (!dur) return;
    setPeople(people.map(p => ({ ...p, minutes: dur })));
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

  // ── sample data — for hero CTA ───────────────────────────
  const loadSample = () => {
    setShowHint(false);
    const s = SAMPLES[mode] || SAMPLES.equal;
    setBookingDuration(s.bookingDuration);
    setAmount(s.amount);
    setDescription(s.description);
    setPeople(s.people.map(p => ({ ...p })));
    showToast(`Loaded · ${s.toastLabel}`);
    setTimeout(() => {
      const target = document.getElementById("kv-builder");
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 280);
  };

  const reset = () => {
    setMode("equal");
    setAmount("");
    setDescription("");
    setBookingDuration("");
    setPeople([
      { id: 1, name: "Alice", paid: "", percent: 0, minutes: 0 },
      { id: 2, name: "Bob",   paid: "", percent: 0, minutes: 0 },
    ]);
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    if (window.location.search) {
      window.history.replaceState({}, "", window.location.pathname);
    }
    setShowHint(true);
    showToast("Reset · ready for the next split");
  };

  // ── share actions ────────────────────────────────────────
  const copyText = () => {
    let t = `${description || (mode === "time" ? "Booking" : "Expense")}\nTotal: £${total.toFixed(2)}\n`;
    if (mode === "time" && bookingDuration) t += `Duration: ${formatMins(Number(bookingDuration))}\n`;
    t += "\n";
    people.forEach(p => {
      const played = mode === "time" ? ` (${formatMins(Number(p.minutes) || 0)})` : "";
      t += `${p.name}${played}: £${getOwes(p).toFixed(2)}\n`;
    });
    if (settlements.length) {
      t += "\nSettle up:\n";
      settlements.forEach(s => { t += `${s.from} → ${s.to}: £${s.amount.toFixed(2)}\n`; });
    }
    navigator.clipboard.writeText(t);
    flash("text"); showToast("Copied as text");
  };
  const copyImage = async () => {
    try {
      showToast("Rendering image…");
      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(shareRef.current, { backgroundColor: null, scale: 2 });
      canvas.toBlob(async (blob) => {
        try {
          await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
          flash("image"); showToast("Copied as image");
        } catch {
          showToast("Couldn't copy — clipboard blocked");
        }
      });
    } catch {
      showToast("Image render failed");
    }
  };
  const copyLink = () => {
    const encoded = btoa(JSON.stringify({ people, amount, description, mode, bookingDuration }));
    navigator.clipboard.writeText(`${window.location.origin}?data=${encoded}`);
    flash("link"); showToast("Shareable link copied");
  };

  // ── render ───────────────────────────────────────────────
  return (
    <div
      className="kv"
      onMouseMove={e => setPos({ x: e.clientX, y: e.clientY })}
    >
      <div className="kv-bg"   />
      <div className="kv-dots" />
      <div
        className="kv-glow"
        style={{
          background: `radial-gradient(540px circle at ${pos.x}px ${pos.y}px, rgba(52,211,153,0.10), transparent 60%)`,
        }}
      />

      <div className="kv-wrap">
        <Hero onSample={loadSample} total={total} showHint={showHint} mode={mode} />

        <div id="kv-builder" />

        <Reveal>
          <p className="kv-lbl">{mode === "time" ? "01 · Booking" : "01 · Expense"}</p>
          <ExpenseInput
            description={description}       setDescription={setDescription}
            amount={amount}                  setAmount={setAmount}
            mode={mode}
            bookingDuration={bookingDuration} setBookingDuration={setBookingDuration}
          />
        </Reveal>

        <Reveal delay={0.05}>
          <p className="kv-lbl">02 · Split mode</p>
          <div className="kv-card">
            <ModePicker mode={mode} setMode={setMode} />
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="kv-lbl">03 · People</p>
          <div className="kv-card">
            {mode !== "time" && (
              <div className={`kv-thead ${mode === "equal" ? "eq" : "man"}`}>
                <span>Name</span>
                <span>Paid</span>
                {mode === "manual" && <span>%</span>}
                <span>Balance</span>
              </div>
            )}

            {mode === "time" && !Number(bookingDuration) && (
              <div className="kv-dur-hint">
                <Clock size={14} />
                Set the session duration above to enable time sliders
              </div>
            )}

            <AnimatePresence initial={false}>
              {people.map((p, i) =>
                mode === "time" ? (
                  <TimePersonRow
                    key={p.id}
                    person={p}
                    index={i}
                    owes={getOwes(p)}
                    timeShare={getTimeShare(p)}
                    bookingDuration={bookingDuration}
                    onUpdate={(field, val) => updatePerson(i, field, val)}
                  />
                ) : (
                  <PersonRow
                    key={p.id}
                    person={p}
                    index={i}
                    mode={mode}
                    owes={getOwes(p)}
                    onUpdate={(field, val) => updatePerson(i, field, val)}
                  />
                )
              )}
            </AnimatePresence>

            {mode === "manual" && (
              <div className="kv-pct">
                <span
                  className="kv-pct-lbl"
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
                <div className="kv-pct-track">
                  <motion.div
                    className={`kv-pct-fill ${pctState}`}
                    animate={{ width: `${Math.min(totalPct, 100)}%` }}
                    transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                  />
                </div>
                <span className="kv-pct-num">{totalPct.toFixed(1)}%</span>
              </div>
            )}

            <div className="kv-row-btns">
              {mode === "manual" && (
                <button className="kv-btn-ghost" onClick={fillRemaining}>
                  <Sparkles size={13} /> Auto-fill %
                </button>
              )}
              {mode === "time" && Number(bookingDuration) > 0 && (
                <button className="kv-btn-ghost" onClick={setAllFull}>
                  <Sparkles size={13} /> Set all full
                </button>
              )}
              {people.length > 2 && (
                <button className="kv-btn-ghost" onClick={removeLast}>− Remove</button>
              )}
              <button className="kv-btn-pri" onClick={addPerson}>
                <Plus size={14} /> Add Person
              </button>
            </div>
          </div>
        </Reveal>

        <AnimatePresence>
          {mode === "time" && total > 0 && Number(bookingDuration) > 0 && (
            <motion.div
              key="timeline"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4 }}
            >
              <p className="kv-lbl">04 · Timeline</p>
              <ParticipationTimeline
                people={people}
                bookingDuration={bookingDuration}
                total={total}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {total > 0 && (
            <motion.div
              key="summary"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <p className="kv-lbl">{mode === "time" ? "05" : "04"} · Summary</p>
              <BalanceSummary
                people={people}
                total={total}
                getOwes={getOwes}
                mode={mode}
                bookingDuration={bookingDuration}
              />

              <p className="kv-lbl">{mode === "time" ? "06" : "05"} · Settle up</p>
              <div className="kv-card">
                <SettlementList settlements={settlements} colorMap={colorMap} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Reveal delay={0.05}>
          <p className="kv-lbl">{total > 0 ? (mode === "time" ? "07" : "06") : "Last"} · Share</p>
          <div className="kv-actions">
            <motion.button
              className={`kv-act${copied === "text"  ? " done" : ""}`}
              onClick={copyText}
              whileTap={{ scale: 0.96 }}
            >
              {copied === "text" ? <Check size={14} /> : <FileText size={14} />} Text
            </motion.button>
            <motion.button
              className={`kv-act${copied === "image" ? " done" : ""}`}
              onClick={copyImage}
              whileTap={{ scale: 0.96 }}
            >
              {copied === "image" ? <Check size={14} /> : <ImageIcon size={14} />} Image
            </motion.button>
            <motion.button
              className={`kv-act${copied === "link"  ? " done" : ""}`}
              onClick={copyLink}
              whileTap={{ scale: 0.96 }}
            >
              {copied === "link" ? <Check size={14} /> : <LinkIcon size={14} />} Link
            </motion.button>
          </div>

          <button className="kv-reset" onClick={reset} type="button" aria-label="Reset all data">
            <RotateCcw size={11} /> Clear &amp; start fresh
          </button>
        </Reveal>

        <footer className="kv-footer">
          SPLIDIT · CALL IT EVEN ·{" "}
          <a href="https://github.com/OElhwry/SplidIt" target="_blank" rel="noreferrer">GITHUB</a>
        </footer>
      </div>

      {/* Toast */}
      <div
        className={`kv-toast${toast.show ? " up" : ""}`}
        role="status"
        aria-live="polite"
      >
        <Check size={13} color="var(--primary)" />
        {toast.msg}
      </div>

      {/* Hidden share card (image capture) */}
      <div className="kv-hidden">
        <ShareCard
          ref={shareRef}
          description={description}
          total={total}
          people={people}
          mode={mode}
          bookingDuration={bookingDuration}
          getOwes={getOwes}
          settlements={settlements}
        />
      </div>
    </div>
  );
}
