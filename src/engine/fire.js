// ---------- огонь ----------
function tongue(x, y, h, w, sway, cols) {
  const layers = [[1, cols[0]], [.7, cols[1]], [.42, cols[2]]];
  layers.forEach(([s, col], i) => {
    const hh = h * s, ww = w * s, sx = sway * s, yy = y - (1 - s) * w * .25;
    ctx.beginPath(); ctx.moveTo(x - ww / 2, yy);
    ctx.bezierCurveTo(x - ww * .6, yy - hh * .45, x + sx - ww * .2, yy - hh * .7, x + sx, yy - hh);
    ctx.bezierCurveTo(x + sx + ww * .2, yy - hh * .7, x + ww * .6, yy - hh * .45, x + ww / 2, yy);
    ctx.quadraticCurveTo(x, yy + ww * .45, x - ww / 2, yy); ctx.closePath();
    ctx.fillStyle = col; ctx.fill();
    if (i === 0) { ctx.lineWidth = 4; ctx.strokeStyle = '#8a1e0e'; ctx.stroke(); }
  });
}
const FIRE_COLS = ['#ee4b23', '#ff9d1f', '#ffe45c'];
function drawFire(it, t) {
  if (it.fire <= 0) return;
  const I = it.fire;
  for (let i = 0; i < it.spots.length; i++) {
    const [x, y, w] = it.spots[i];
    const ph = i * 1.7 + x * .01;
    const h = (30 + 95 * I) * (1 + .12 * Math.sin(t * 9 + ph));
    const ww = w * (.6 + .5 * I);
    tongue(x - ww * .35, y + 4, h * .7, ww * .7, 10 * Math.sin(t * 6 + ph + 1), FIRE_COLS);
    tongue(x + ww * .35, y + 4, h * .75, ww * .7, 10 * Math.sin(t * 7 + ph + 2), FIRE_COLS);
    tongue(x, y, h, ww, 14 * Math.sin(t * 5 + ph), FIRE_COLS);
    if (Math.random() < I * .015) G.parts.push({ k: 'smoke', x: x + (Math.random() - .5) * 30, y: y - h, vx: (Math.random() - .5) * 20, vy: -40 - Math.random() * 30, life: 0, max: 2.2, r: 14 + Math.random() * 10 });
    if (Math.random() < I * .12) G.parts.push({ k: 'ember', x: x + (Math.random() - .5) * w, y: y - h * .5, vx: (Math.random() - .5) * 40, vy: -80 - Math.random() * 80, life: 0, max: 1, r: 3 });
  }
}
function glow(it) {
  if (it.fire <= 0) return;
  const [x0, y0, x1, y1] = it.box, cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
  const g = ctx.createRadialGradient(cx, cy, 20, cx, cy, 160 + it.fire * 260);
  g.addColorStop(0, `rgba(255,150,40,${.35 * it.fire})`); g.addColorStop(1, 'rgba(255,120,30,0)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, VW, VH);
}
function fireplaceFire(t) {
  for (let i = 0; i < 3; i++) tongue(1000 + i * 40, 560, 55 + 10 * Math.sin(t * 8 + i), 40, 6 * Math.sin(t * 6 + i * 2), FIRE_COLS);
}

function drawBolt(x0, y0, x1, y1, w) {
  const n = 7, dx = x1 - x0, dy = y1 - y0, len = Math.hypot(dx, dy), nx = -dy / len, ny = dx / len;
  const pts = [[x0, y0]];
  for (let i = 1; i < n; i++) { const t = i / n, off = (Math.random() - .5) * len * .28; pts.push([x0 + dx * t + nx * off, y0 + dy * t + ny * off]); }
  pts.push([x1, y1]);
  const path = () => { ctx.beginPath(); pts.forEach(([px, py], i) => i ? ctx.lineTo(px, py) : ctx.moveTo(px, py)); };
  ctx.lineJoin = 'miter'; ctx.lineCap = 'round';
  path(); ctx.lineWidth = 16 * w; ctx.strokeStyle = 'rgba(120,200,255,.45)'; ctx.stroke();
  path(); ctx.lineWidth = 11 * w; ctx.strokeStyle = INK; ctx.stroke();
  path(); ctx.lineWidth = 6 * w; ctx.strokeStyle = '#ffe45c'; ctx.stroke();
  path(); ctx.lineWidth = 2 * w; ctx.strokeStyle = '#ffffff'; ctx.stroke();
  // ответвление
  const [bx, by] = pts[3]; ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx + nx * 50 + dx * .08, by + ny * 50 + dy * .08); ctx.lineTo(bx + nx * 70 + dx * .18, by + ny * 70 + dy * .18);
  ctx.lineWidth = 8 * w; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 3.5 * w; ctx.strokeStyle = '#ffe45c'; ctx.stroke();
}
function drawParts(dt) {
  const keep = [];
  for (const p of G.parts) {
    p.life += dt; if (p.life > p.max) continue; keep.push(p);
    const k = p.life / p.max;
    if (p.k === 'lid') {
      const y = p.y - 160 + Math.min(1, k * 3) * 160 + (k > .5 ? (k - .5) * 120 : 0);
      ctx.globalAlpha = k > .6 ? 1 - (k - .6) / .4 : 1;
      ctx.save(); ctx.translate(p.x + (k > .5 ? (k - .5) * 80 : 0), y); ctx.rotate(k > .5 ? (k - .5) * 1.4 : 0);
      ctx.beginPath(); ctx.moveTo(-50, 0); ctx.quadraticCurveTo(0, -40, 50, 0); ctx.closePath(); toon('#b8c1cc', 4); rr(-55, -2, 110, 10, 5); toon('#8f99a6', 4); rr(-10, -32, 20, 10, 4); toon(INK, 2);
      ctx.restore(); ctx.globalAlpha = 1; continue;
    }
    if (p.k === 'blanket') {
      const y = p.y - 200 + Math.min(1, k * 2.5) * 200, w = 200 * (1 - Math.max(0, k - .6) * .5);
      ctx.globalAlpha = k > .7 ? 1 - (k - .7) / .3 : 1; ctx.save(); ctx.translate(p.x, y);
      ctx.beginPath(); ctx.moveTo(-w / 2, -50); for (let i = 0; i <= 8; i++) ctx.lineTo(-w / 2 + w * i / 8, -50 + Math.sin(i + time * 10) * 6 * (1 - k)); ctx.lineTo(w / 2 + 10, 40); ctx.quadraticCurveTo(0, 60, -w / 2 - 10, 40); ctx.closePath(); toon('#c8434f', 5);
      ctx.strokeStyle = '#ffd23f'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-w / 2 + 10, -38); ctx.lineTo(w / 2 - 10, -38); ctx.stroke(); ctx.restore(); ctx.globalAlpha = 1; continue;
    }
    if (p.k === 'fb') { p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= .97; p.vy *= .97; const r = p.r * (1 + k * .8);
      circ(p.x, p.y, r); ctx.fillStyle = `rgba(238,75,35,${1 - k})`; ctx.fill(); circ(p.x, p.y, r * .7); ctx.fillStyle = `rgba(255,157,31,${1 - k})`; ctx.fill(); circ(p.x, p.y, r * .4); ctx.fillStyle = `rgba(255,228,92,${1 - k})`; ctx.fill(); continue; }
    if (p.k === 'ring') { circ(p.x, p.y, 40 + k * 420); ctx.lineWidth = 18 * (1 - k); ctx.strokeStyle = `rgba(255,230,150,${1 - k})`; ctx.stroke(); continue; }
    if (p.k === 'foam') { const a = Math.min(1, (1 - k) * 3); ctx.globalAlpha = a; circ(p.x, p.y, p.r * (.6 + Math.min(1, k * 8) * .4)); toon('#fff8e6', 2); circ(p.x - p.r * .3, p.y - p.r * .3, p.r * .25); ctx.fillStyle = '#ffffff'; ctx.fill(); ctx.globalAlpha = 1; continue; }
    if (p.k === 'puff') { p.x += p.vx * dt; p.y += p.vy * dt; p.r += dt * 30; circ(p.x, p.y, p.r); ctx.fillStyle = `rgba(255,255,255,${(1 - k) * .75})`; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = `rgba(42,26,18,${(1 - k) * .25})`; ctx.stroke(); continue; }
    if (p.k === 'bolt') { if (Math.floor(p.life * 30) % 3 !== 2) drawBolt(p.x, p.y, p.tx, p.ty, p.w || 1); continue; }
    if (p.k === 'zapfx') { ctx.fillStyle = `rgba(120,200,255,${(1 - k) * .35})`; ctx.fillRect(0, 0, VW, VH); const r = 60 + k * 220; circ(p.x, p.y, r); ctx.lineWidth = 10 * (1 - k); ctx.strokeStyle = '#ffe45c'; ctx.stroke(); continue; }
    p.x += p.vx * dt; p.y += p.vy * dt;
    if (p.k === 'drop' || p.k === 'grain') { p.vy += 900 * dt; circ(p.x, p.y, p.r * (1 - k * .5)); ctx.globalAlpha = 1 - k; toon(p.color, 2); ctx.globalAlpha = 1; }
    else if (p.k === 'steam' || p.k === 'smoke') { p.r += dt * 18; circ(p.x, p.y, p.r); ctx.fillStyle = p.k === 'steam' ? `rgba(255,255,255,${(1 - k) * .55})` : `rgba(70,62,60,${(1 - k) * .22})`; ctx.fill(); }
    else if (p.k === 'ember') { circ(p.x, p.y, p.r * (1 - k)); ctx.fillStyle = '#ffcf4a'; ctx.fill(); }
    else if (p.k === 'spark') { p.vy += 600 * dt; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - p.vx * .03, p.y - p.vy * .03); ctx.lineWidth = 4; ctx.strokeStyle = `rgba(255,240,120,${1 - k})`; ctx.stroke(); }
  }
  G.parts = keep.length > 900 ? keep.slice(-900) : keep;
}
function drawThrows() {
  for (const th of G.throws) {
    const k = Math.min(1, th.t / th.T), x = th.from.x + (th.to.x - th.from.x) * k, y = th.from.y + (th.to.y - th.from.y) * k - Math.sin(k * Math.PI) * 180;
    const col = TOOLS[th.id].color;
    if (th.id === 'lid') { ctx.save(); ctx.translate(x, y); ctx.rotate(k * 8); ell(0, 0, 40, 12); toon('#b8c1cc', 4); ctx.restore(); continue; }
    if (th.id === 'blanket') { ctx.save(); ctx.translate(x, y); ctx.rotate(k * 4); rr(-40, -26, 80, 52, 10); toon('#c8434f', 4); ctx.restore(); continue; }
    if (th.id === 'powder') { for (let i = 0; i < 5; i++) { const kk = Math.max(0, k - i * .05), xx = th.from.x + (th.to.x - th.from.x) * kk, yy = th.from.y + (th.to.y - th.from.y) * kk - Math.sin(kk * Math.PI) * 180; circ(xx, yy, 22 - i * 3); ctx.fillStyle = 'rgba(255,255,255,.9)'; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(42,26,18,.3)'; ctx.stroke(); } continue; }
    ell(x, y, 26, 20, ctx, k * 3); toon(col, 4);
    for (let i = 1; i < 4; i++) { const kk = Math.max(0, k - i * .04), xx = th.from.x + (th.to.x - th.from.x) * kk, yy = th.from.y + (th.to.y - th.from.y) * kk - Math.sin(kk * Math.PI) * 180; circ(xx, yy, 12 - i * 3); ctx.fillStyle = col; ctx.fill(); }
  }
}
function drawAim() {
  const a = G.aim; if (!a || G.dragging) return;
  const t = TOOLS[G.tool], h = hotAt(a);
  ctx.save(); ctx.setLineDash([14, 10]); ctx.lineDashOffset = -time * 30;
  circ(a.x, a.y, h ? 40 : t.radius * .55); ctx.lineWidth = 5; ctx.strokeStyle = h ? '#7cc243' : '#ffffff'; ctx.stroke(); ctx.lineWidth = 9; ctx.strokeStyle = 'rgba(42,26,18,.35)'; ctx.globalCompositeOperation = 'destination-over'; ctx.stroke(); ctx.restore();
  circ(a.x, a.y, 6); toon(h ? '#7cc243' : '#fff', 3);
  if (h) { ctx.font = '900 24px Rubik, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic'; ctx.lineWidth = 7; ctx.strokeStyle = INK; ctx.strokeText(h.label, a.x, a.y - 52); ctx.fillStyle = '#fff'; ctx.fillText(h.label, a.x, a.y - 52); }
}

