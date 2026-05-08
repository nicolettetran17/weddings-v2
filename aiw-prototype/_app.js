/* ============================================================
   AIW prototype — shared app helpers.
   ============================================================ */

import { HOTELS, BRANDS, byId } from "./_data.js";

export const LOGO_PATH = "../rcd-design-system/assets/logos";

/* ---- Currency / number formatting ---- */
export const usd = n => new Intl.NumberFormat("en-US",
  { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

export const compact = n => new Intl.NumberFormat("en-US",
  { notation: "compact", maximumFractionDigits: 1 }).format(n);

/* ---- Persistent state (24h save) ---- */
const KEY = "aiw.prototype.v1";
const TTL = 24 * 60 * 60 * 1000;

export function saveState(state) {
  const payload = { state, savedAt: Date.now(), expiresAt: Date.now() + TTL };
  localStorage.setItem(KEY, JSON.stringify(payload));
  return payload;
}
export function loadState() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY));
    if (!raw) return null;
    if (Date.now() > raw.expiresAt) { localStorage.removeItem(KEY); return null; }
    return raw;
  } catch { return null; }
}
export function clearState() { localStorage.removeItem(KEY); }

export function timeUntil(expiresAt) {
  const ms = Math.max(0, expiresAt - Date.now());
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms %   60000) /  1000);
  return { h, m, s,
    pretty: `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}` };
}

/* ---- "Image" generation: gradient cards keyed off a venue palette ---- */
export function paletteGradient(palette = ["#2A2A28","#B4814D","#E8DDD0"]) {
  const [a, b, c = a] = palette;
  return `radial-gradient(800px 500px at 20% 0%, ${b}55, transparent 55%),
          radial-gradient(700px 600px at 90% 100%, ${c}66, transparent 55%),
          linear-gradient(150deg, ${a} 0%, ${a} 60%, ${b}33 100%)`;
}

/* SVG mock image — pretty, deterministic, no external photos required.
   Pass a hotel/space + optional vibe palette to bias the color treatment. */
export function venueMockSVG({ palette = ["#2A2A28","#B4814D","#E8DDD0"], label = "", aspect = "16/9", vibePalette = null } = {}) {
  const pal = vibePalette || palette;
  const [c1, c2, c3 = c2] = pal;
  return `
  <svg viewBox="0 0 800 450" preserveAspectRatio="xMidYMid slice"
       style="aspect-ratio:${aspect}; width:100%; height:100%; display:block; border-radius:inherit;"
       xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%"   stop-color="${c1}"/>
        <stop offset="100%" stop-color="${c2}"/>
      </linearGradient>
      <radialGradient id="glow" cx="80%" cy="20%" r="60%">
        <stop offset="0%"   stop-color="${c3}" stop-opacity="0.85"/>
        <stop offset="70%"  stop-color="${c3}" stop-opacity="0"/>
      </radialGradient>
      <filter id="blur"><feGaussianBlur stdDeviation="40"/></filter>
    </defs>
    <rect width="800" height="450" fill="url(#bg)"/>
    <rect width="800" height="450" fill="url(#glow)"/>
    <!-- abstract horizon -->
    <path d="M0,330 C200,290 350,360 500,310 C650,260 750,330 800,300 L800,450 L0,450 Z"
          fill="${c1}" opacity="0.55"/>
    <path d="M0,360 C160,320 320,400 480,340 C640,280 760,360 800,330 L800,450 L0,450 Z"
          fill="${c1}" opacity="0.85"/>
    <!-- sun / arch -->
    <circle cx="600" cy="170" r="80" fill="${c3}" opacity="0.6" filter="url(#blur)"/>
    <circle cx="600" cy="170" r="36" fill="${c3}" opacity="0.85"/>
    ${ label ? `
      <text x="40" y="410" font-family="Cormorant Garamond, serif" font-size="38"
            fill="white" opacity="0.95" font-style="italic">${escape(label)}</text>` : ""}
  </svg>`;
}

function escape(s) {
  return String(s).replace(/[<>&"']/g, ch => ({"<":"&lt;",">":"&gt;","&":"&amp;",'"':"&quot;","'":"&#39;"}[ch]));
}

/* ---- Brand helpers ---- */
export function brandOfHotel(hotelId) {
  const h = byId(HOTELS, hotelId);
  return BRANDS.find(b => b.id === h?.brand);
}

/* ---- A tiny DOM helper: render an HTML string as a real element ---- */
export const $h = html => {
  const t = document.createElement("template");
  t.innerHTML = html.trim();
  return t.content.firstChild;
};

/* ---- Shared site chrome (top nav) ---- */
export function renderNav({ active = "home", landing = false, variant = "default" } = {}) {
  if (landing) {
    /* Landing uses the Figma V2 mobile home header inline in index.html (frame 125:16028). */
    return "";
  }
  /* RCD · node 125:16457 — TopAppBar for planner (warm shell, centered wordmark). */
  if (variant === "rcd" && active === "plan") {
    return `
  <nav class="sticky top-0 z-30 shrink-0 border-b border-[rgba(207,197,187,0.35)] bg-[rgba(252,249,248,0.88)] backdrop-blur-md supports-[backdrop-filter]:bg-[rgba(252,249,248,0.78)]">
    <div class="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-10">
      <a href="./index.html" class="flex h-11 w-11 items-center justify-center rounded-full text-[#4c463f] transition hover:bg-[#e9e1d8]/80" aria-label="Menu — home">
        <svg width="18" height="12" viewBox="0 0 18 12" fill="none" aria-hidden="true">
          <path d="M0 1h18M0 6h18M0 11h18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </a>
      <img src="${LOGO_PATH}/aiw-horizontal-gray.png" alt="All In Weddings" class="pointer-events-none absolute left-1/2 h-6 -translate-x-1/2 object-contain sm:h-7"/>
      <a href="./index.html" class="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-[#f0eded] shadow-[0_0_0_1px_rgba(207,197,187,0.35)] ring-1 ring-white/60" aria-label="Your profile">
        <span class="grid h-full w-full place-items-center font-title text-lg leading-none text-[#4c463f]">N</span>
      </a>
    </div>
  </nav>`;
  }
  return `
  <nav class="sticky top-0 z-30 bg-canvas/80 backdrop-blur border-b border-border-subtle">
    <div class="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
      <a href="./index.html" class="flex items-center gap-3" aria-label="All In Weddings — home">
        <img src="${LOGO_PATH}/aiw-horizontal-gray.png" alt="All In Weddings" class="h-8 w-auto max-w-[200px] object-contain object-left"/>
      </a>
      <div class="hidden md:flex items-center gap-8 text-sm">
        <a href="./index.html#portfolio"  class="hover:text-copper ${active==="home"?"text-ink":"text-ink-soft"}">Portfolio</a>
        <a href="./index.html#how"        class="hover:text-copper text-ink-soft">How it works</a>
        <a href="./index.html#stories"    class="hover:text-copper text-ink-soft">Stories</a>
        <a href="./plan.html" class="btn btn--primary btn--small">Start planning</a>
      </div>
      <a href="./plan.html" class="md:hidden btn btn--primary btn--small">Plan</a>
    </div>
  </nav>`;
}

export function renderFooter() {
  return `
  <footer class="bg-ink text-paper mt-24">
    <div class="max-w-7xl mx-auto px-6 lg:px-10 py-16 grid md:grid-cols-4 gap-10">
      <div>
        <img src="${LOGO_PATH}/aiw-vertical-white.png" alt="All In Weddings" class="h-20 object-contain"/>
        <p class="mt-4 text-sm text-paper/70 max-w-xs">
          The wedding planner for couples who want destination magic without the spreadsheet.
        </p>
      </div>
      <div>
        <p class="font-semibold mb-3">Brands</p>
        <ul class="space-y-2 text-sm text-paper/70">
          <li>Hard Rock Hotels</li>
          <li>UNICO 20°87°</li>
          <li>Nobu Hotels</li>
          <li>AVA Resort</li>
        </ul>
      </div>
      <div>
        <p class="font-semibold mb-3">Plan</p>
        <ul class="space-y-2 text-sm text-paper/70">
          <li><a href="./plan.html" class="hover:text-copper">Start planning</a></li>
          <li><a href="./plan.html#vendors" class="hover:text-copper">Vendor marketplace</a></li>
          <li><a href="#" class="hover:text-copper">Concierge support</a></li>
        </ul>
      </div>
      <div>
        <p class="font-semibold mb-3">Trust</p>
        <ul class="space-y-2 text-sm text-paper/70">
          <li>Verified vendors</li>
          <li>Refundable date holds</li>
          <li>24/7 concierge</li>
        </ul>
      </div>
    </div>
    <div class="border-t border-paper/10">
      <div class="max-w-7xl mx-auto px-6 lg:px-10 py-6 text-xs text-paper/50 flex flex-wrap justify-between gap-4">
        <p>© 2026 All In Weddings. A consolidated brand of Hard Rock, UNICO, Nobu, and AVA wedding properties.</p>
        <p>Prototype · for design review only</p>
      </div>
    </div>
  </footer>`;
}
