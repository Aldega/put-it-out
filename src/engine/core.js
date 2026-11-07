// ================== общее ==================
const VW = 1280, VH = 720, INK = '#2a1a12';
const cv = document.getElementById('cv'), ctx = cv.getContext('2d');
const $ = id => document.getElementById(id);
let scale = 1;
function resize() {
  const r = cv.getBoundingClientRect(), d = window.devicePixelRatio || 1;
  cv.width = Math.round(r.width * d); cv.height = Math.round(r.height * d);
  scale = cv.width / VW; bgCache = {};
}
new ResizeObserver(resize).observe(cv);

const KEY = 'kak-eto-potushit-v2';
let SAVE = { coins: 0, best: {} };
try { const raw = localStorage.getItem(KEY); if (raw) SAVE = Object.assign(SAVE, JSON.parse(raw)); } catch (e) {}
function store() { try { localStorage.setItem(KEY, JSON.stringify(SAVE)); } catch (e) {} }

function mix(a, b, t) {
  const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
  const r = Math.round(((pa >> 16) & 255) * (1 - t) + ((pb >> 16) & 255) * t), g = Math.round(((pa >> 8) & 255) * (1 - t) + ((pb >> 8) & 255) * t), bl = Math.round((pa & 255) * (1 - t) + (pb & 255) * t);
  return `rgb(${r},${g},${bl})`;
}
// рисование с обводкой
function toon(fill, lw = 5, c = ctx) { c.fillStyle = fill; c.fill(); c.lineWidth = lw; c.strokeStyle = INK; c.lineJoin = 'round'; c.lineCap = 'round'; c.stroke(); }
function rr(x, y, w, h, r, c = ctx) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
function ell(x, y, rx, ry, c = ctx, rot = 0) { c.beginPath(); c.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2); }
function circ(x, y, r, c = ctx) { c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); }
function rnd(seed) { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; }

const STAR = (on) => `<svg viewBox="0 0 24 24"><path d="M12 1.8l3 6.3 6.9.9-5 4.8 1.2 6.9L12 17.4l-6.1 3.3 1.2-6.9-5-4.8 6.9-.9z" fill="${on ? '#ffd23f' : '#c9ced8'}" stroke="#2a1a12" stroke-width="1.8" stroke-linejoin="round"/>${on ? '<path d="M8.5 8.8l2-.3" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>' : ''}</svg>`;
const STAR_CLASS = (on) => STAR(on).replace('<svg', `<svg class="${on ? 'on' : ''}"`);

