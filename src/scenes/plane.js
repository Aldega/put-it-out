// ----- транспорт, уровень 6: салон самолёта, пауэрбанк -----
function bgPlane(c) {
  c.fillStyle = '#f2f0ea'; c.fillRect(0, 0, VW, VH);
  // окна-иллюминаторы с облаками
  for (let x = 90; x < VW; x += 220) {
    rr(x, 210, 70, 96, 34, c); toon('#d9dde3', 5, c); rr(x + 10, 220, 50, 76, 25, c); toon('#9fdcff', 3, c);
    c.save(); rr(x + 10, 220, 50, 76, 25, c); c.clip(); cloud(c, x + 40, 280, .35); c.restore();
  }
  // пол
  c.fillStyle = '#5a6b8a'; c.fillRect(0, 560, VW, VH - 560); c.beginPath(); c.moveTo(0, 560); c.lineTo(VW, 560); c.lineWidth = 6; c.strokeStyle = INK; c.stroke();
  c.strokeStyle = '#4a5a78'; c.lineWidth = 3; for (let x = 0; x < VW; x += 60) { c.beginPath(); c.moveTo(x, 570); c.lineTo(x - 20, 720); c.stroke(); }
  // багажные полки справа (их не трогает огонь)
  rr(780, 110, 520, 80, 18, c); toon('#ffffff', 5, c); rr(800, 170, 480, 10, 4, c); toon('#d9dde3', 3, c);
  // кресло слева, где лежит игрушка
  planeSeat(c, 160);
}
// кресло, вид сбоку, смотрит вправо. x = левый край спинки, k = обугленность
function planeSeat(c, x, k = 0) {
  const col = mix('#3f7bf5', '#1e130d', k * .85), dark = mix('#2f5aa8', '#120b08', k * .85);
  rr(x + 96, 490, 18, 70, 5, c); toon('#7a8290', 4, c);
  rr(x, 326, 62, 200, 24, c); toon(col, 5, c);
  rr(x + 6, 320, 50, 36, 12, c); toon(mix('#ffffff', '#1e130d', k * .85), 4, c);
  rr(x + 20, 456, 156, 48, 18, c); toon(col, 5, c);
  rr(x + 40, 430, 110, 16, 7, c); toon(dark, 4, c);
}
function drawPlaneSeat(it) { planeSeat(ctx, 360, it.char); }
function drawPlaneSeat2(it) { planeSeat(ctx, 560, it.char); }
function drawOverhead(it) {
  const k = it.char;
  rr(-20, 110, 780, 80, 18); toon(mix('#ffffff', '#1e130d', k * .85), 5);
  for (const x of [240, 500]) { rr(x, 120, 10, 60, 3); toon(mix('#d9dde3', '#1e130d', k * .6), 3); }
  rr(0, 170, 760, 10, 4); toon(mix('#d9dde3', '#1e130d', k * .6), 3);
}
// тележка бортпроводника с ведёрком льда
function planeFront(G) {
  rr(880, 380, 170, 180, 10); toon('#c8ced8', 5);
  for (const y of [420, 470, 520]) { ctx.beginPath(); ctx.moveTo(890, y); ctx.lineTo(1040, y); ctx.lineWidth = 3; ctx.strokeStyle = INK; ctx.stroke(); }
  for (const x of [900, 1030]) { circ(x, 566, 10); toon('#3a3a3a', 3); }
  // ведёрко со льдом
  ctx.beginPath(); ctx.moveTo(918, 330); ctx.lineTo(1012, 330); ctx.lineTo(1000, 382); ctx.lineTo(930, 382); ctx.closePath(); toon('#9aa3ad', 5);
  for (const [x, y] of [[940, 326], [962, 320], [986, 324], [1002, 328]]) { rr(x - 9, y - 9, 18, 18, 4); toon('#e8f8ff', 3); }
  // пауэрбанк
  const c = G.can;
  if (c.safe) { if (Math.random() < .1) G.parts.push({ k: 'steam', x: 965, y: 320, vx: 0, vy: -40, life: 0, max: 1.2, r: 10 }); return; }
  ctx.save(); ctx.translate(c.x, c.y); ctx.rotate(-.15);
  if (c.drag) { circ(0, 0, 46); ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.fill(); }
  rr(-30, -16, 60, 32, 7); toon('#2f3540', 4);
  const glowA = .5 + .5 * Math.sin(time * 9); rr(-20, -6, 30, 12, 3); toon(mix('#e63b2e', '#ffd23f', glowA), 2);
  rr(20, -5, 14, 10, 3); toon('#9aa3ad', 2);
  ctx.restore();
  if (Math.random() < .3) G.parts.push({ k: 'smoke', x: c.x + (Math.random() - .5) * 30, y: c.y - 20, vx: (Math.random() - .5) * 20, vy: -50, life: 0, max: 1.6, r: 10 });
  if (!c.drag) { const t = (time * 2) % 1; ctx.save(); ctx.globalAlpha = 1 - t; circ(c.x, c.y, 44 + t * 26); ctx.lineWidth = 4; ctx.strokeStyle = '#ffffff'; ctx.stroke(); ctx.restore(); }
}
function drawElephant(G, t) {
  const x = t.x, y = t.y;
  ell(x, y + 6, 36, 28); toon('#b7a6e8', 4);
  circ(x + 30, y - 16, 24); toon('#b7a6e8', 4);
  ell(x + 12, y - 18, 16, 20); toon('#d9cdf5', 3);
  ctx.beginPath(); ctx.moveTo(x + 48, y - 8); ctx.quadraticCurveTo(x + 66, y + 10, x + 54, y + 26); ctx.lineWidth = 14; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 8; ctx.strokeStyle = '#b7a6e8'; ctx.stroke();
  circ(x + 38, y - 22, 4); ctx.fillStyle = INK; ctx.fill();
  for (const dx of [-20, 14]) { rr(x + dx, y + 22, 16, 16, 5); toon('#b7a6e8', 3); }
}
