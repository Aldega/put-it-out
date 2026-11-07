// ================== эпизод 3 «Город»: общие детали сцен ==================
// дальние многоэтажки с окнами
function skyline(c, y, seed, col = '#a9c4dd', win = '#e8f3ff', s = 1) {
  const r = rnd(seed);
  for (let x = -20; x < VW + 40;) {
    const w = (70 + r() * 90) * s, h = (120 + r() * 200) * s;
    rr(x, y - h, w, h + 20, 4, c); toon(col, 4, c);
    c.fillStyle = win;
    for (let wy = y - h + 16; wy < y - 14; wy += 26 * s) for (let wx = x + 12; wx < x + w - 16; wx += 22 * s) if (r() > .25) c.fillRect(wx, wy, 10 * s, 13 * s);
    x += w + 6 + r() * 20;
  }
}
function citySky(c, h = 560, stops = ['#6cc6f0', '#d4f3ff']) { skyGrad(c, stops, h); }
// асфальт с бордюром: тротуар до y1, дальше дорога
function sidewalk(c, y0, y1, road = true) {
  c.fillStyle = '#c9c4bb'; c.fillRect(0, y0, VW, VH - y0);
  c.strokeStyle = '#aaa398'; c.lineWidth = 3; for (let x = 0; x < VW; x += 90) { c.beginPath(); c.moveTo(x, y0); c.lineTo(x - 30, y1); c.stroke(); }
  c.beginPath(); c.moveTo(0, y0); c.lineTo(VW, y0); c.lineWidth = 6; c.strokeStyle = INK; c.stroke();
  if (!road) return;
  rr(-10, y1, VW + 20, 14, 4, c); toon('#e6e1d8', 5, c);
  c.fillStyle = '#5c6066'; c.fillRect(0, y1 + 14, VW, VH - y1 - 14);
  c.beginPath(); c.moveTo(0, y1 + 16); c.lineTo(VW, y1 + 16); c.lineWidth = 4; c.strokeStyle = INK; c.stroke();
  c.fillStyle = '#f4efe6'; for (let x = 20; x < VW; x += 160) rr(x, y1 + 50, 90, 10, 4, c), c.fill();
}
// кирпичная стена
function bricks(c, x0, y0, x1, y1, col = '#c96a4a', line = '#a8513a', bh = 28) {
  c.fillStyle = col; c.fillRect(x0, y0, x1 - x0, y1 - y0);
  c.strokeStyle = line; c.lineWidth = 3;
  for (let y = y0, row = 0; y < y1; y += bh, row++) { c.beginPath(); c.moveTo(x0, y); c.lineTo(x1, y); c.stroke(); for (let x = x0 + (row % 2) * 40; x < x1; x += 80) { c.beginPath(); c.moveTo(x, y); c.lineTo(x, Math.min(y1, y + bh)); c.stroke(); } }
}
// тополь: x, y = низ ствола
function poplar(c, x, y, s = 1, col = '#6fb54a') {
  c.save(); c.translate(x, y); c.scale(s, s);
  rr(-12, -150, 24, 152, 6, c); toon('#8a6a4a', 4, c);
  c.beginPath(); c.moveTo(0, -120); c.bezierCurveTo(-90, -150, -80, -330, 0, -380); c.bezierCurveTo(80, -330, 90, -150, 0, -120); c.closePath(); toon(col, 5, c);
  c.strokeStyle = mix(col, '#2a1a12', .25); c.lineWidth = 3; for (const [dx, dy] of [[-30, -200], [20, -250], [-10, -310], [30, -170]]) { c.beginPath(); c.arc(dx, dy, 14, Math.PI * .1, Math.PI * .9); c.stroke(); }
  c.restore();
}
// фонарь
function streetLamp(c, x, y, h = 330) {
  rr(x - 7, y - h, 14, h, 5, c); toon('#5a5f66', 4, c);
  c.beginPath(); c.moveTo(x, y - h + 10); c.quadraticCurveTo(x + 10, y - h - 30, x + 60, y - h - 20); c.lineWidth = 9; c.strokeStyle = INK; c.stroke(); c.lineWidth = 4; c.strokeStyle = '#5a5f66'; c.stroke();
  ell(x + 64, y - h - 14, 28, 12, c); toon('#ffe9a8', 4, c);
}
// легковушка, вид сбоку, морда слева. cx = центр, by = земля. k = обугленность
function carBody(cx, by, col, k = 0, o = {}) {
  const b = mix(col, '#1e130d', k * .85), gl = mix('#bfe8ff', '#3a2a20', k * .9), x0 = cx - 170;
  // кузов
  ctx.beginPath(); ctx.moveTo(x0 + 10, by - 40); ctx.lineTo(x0 + 6, by - 88); ctx.quadraticCurveTo(x0 + 10, by - 112, x0 + 50, by - 116); ctx.lineTo(x0 + 92, by - 118);
  ctx.lineTo(x0 + 128, by - 172); ctx.lineTo(x0 + 258, by - 172); ctx.lineTo(x0 + 300, by - 120); ctx.quadraticCurveTo(x0 + 336, by - 114, x0 + 336, by - 80); ctx.lineTo(x0 + 334, by - 40); ctx.closePath(); toon(b, 6);
  // стёкла
  ctx.beginPath(); ctx.moveTo(x0 + 108, by - 118); ctx.lineTo(x0 + 136, by - 160); ctx.lineTo(x0 + 186, by - 160); ctx.lineTo(x0 + 186, by - 118); ctx.closePath(); toon(gl, 4);
  ctx.beginPath(); ctx.moveTo(x0 + 198, by - 118); ctx.lineTo(x0 + 198, by - 160); ctx.lineTo(x0 + 252, by - 160); ctx.lineTo(x0 + 284, by - 118); ctx.closePath(); toon(gl, 4);
  ctx.beginPath(); ctx.moveTo(x0 + 192, by - 112); ctx.lineTo(x0 + 192, by - 50); ctx.lineWidth = 3; ctx.strokeStyle = INK; ctx.stroke();
  rr(x0 + 140, by - 100, 26, 8, 4); toon('#d9d9d9', 3); rr(x0 + 214, by - 100, 26, 8, 4); toon('#d9d9d9', 3);
  // фары и бампер
  rr(x0 + 2, by - 92, 22, 18, 6); toon(k > .3 ? '#6e6e6e' : '#fff3b0', 4);
  rr(x0 + 318, by - 96, 18, 20, 6); toon('#e63b2e', 4);
  rr(x0 - 2, by - 54, 50, 16, 6); toon('#5a5f66', 4); rr(x0 + 296, by - 54, 44, 16, 6); toon('#5a5f66', 4);
  // решётка радиатора
  for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(x0 + 8, by - 70 + i * 7); ctx.lineTo(x0 + 26, by - 70 + i * 7); ctx.lineWidth = 3; ctx.strokeStyle = INK; ctx.stroke(); }
  // колёса
  for (const wx of [x0 + 72, x0 + 268]) { circ(wx, by - 30, 32); toon('#3a3a3a', 5); circ(wx, by - 30, 13); toon('#bbbbbb', 3); }
  // открытый капот
  if (o.hood) { ctx.save(); ctx.translate(x0 + 96, by - 118); ctx.rotate(-1.1); rr(-92, -8, 92, 14, 6); toon(b, 5); ctx.restore(); }
  // открытый багажник
  if (o.trunk) { ctx.save(); ctx.translate(x0 + 300, by - 120); ctx.rotate(-.9); rr(0, -8, 70, 12, 5); toon(b, 5); ctx.restore(); }
}
// лужа бензина с радужными разводами
function petrolPuddle(x, y, rx, ry, k) {
  ell(x, y, rx, ry); toon(mix('#6b5a7a', '#1e130d', k * .6), 4);
  ctx.save(); ell(x, y, rx - 6, ry - 4); ctx.clip();
  for (const [dx, col] of [[-.4, '#7cd1ff'], [0, '#ffd23f'], [.35, '#ff7bd5']]) { ell(x + dx * rx, y - 2, rx * .28, ry * .4); ctx.lineWidth = 4; ctx.strokeStyle = col; ctx.globalAlpha = .55 * (1 - k); ctx.stroke(); }
  ctx.restore(); ctx.globalAlpha = 1;
}

// ----- телефон: позвонить 112 (кладём справа на середине высоты, вне лотка средств) -----
function drawPhone112(G, x = 1190, y = 250) {
  const done = G.flags.called;
  const bob = done ? 0 : Math.sin(time * 4) * 4;
  ctx.save(); ctx.translate(x, y + bob); ctx.rotate(-.12);
  rr(-30, -52, 60, 104, 12); toon('#2f3540', 5);
  rr(-23, -40, 46, 76, 6); toon(done ? '#9bd65a' : '#bfe8ff', 3);
  if (done) tex(ctx, 0, -2, '✓', 34, INK); else tex(ctx, 0, -2, '112', 20, '#e63b2e');
  circ(0, 44, 5); toon('#9aa3ad', 2);
  ctx.restore();
  if (!done) { const t = (time * 1.5) % 1; ctx.save(); ctx.globalAlpha = 1 - t; circ(x, y, 55 + t * 25); ctx.lineWidth = 4; ctx.strokeStyle = '#ffffff'; ctx.stroke(); ctx.restore(); }
  else if (G.time - G.flags.calledT < 6) { // мигалка: пожарные едут
    ctx.fillStyle = Math.sin(time * 14) > 0 ? '#3fa9f5' : '#e63b2e'; circ(x, y - 72, 10); ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = INK; ctx.stroke();
  }
}
function phoneHot(x = 1190, y = 250) {
  return { x, y, r: 55, label: G => G.flags.called ? null : 'Позвонить 112', tap: G => { G.flags.called = true; G.flags.calledT = G.time; SFX.dial(); say('Алло, 112? Пожар во дворе! Пожарные уже выехали. А пока туши сам, только осторожно.', 'good'); } };
}

// карта эпизода «Город»
function mapGorod(c) {
  skyGrad(c, ['#6cc6f0', '#d4f3ff'], VH);
  circ(1110, 110, 56, c); toon('#ffe066', 5, c);
  skyline(c, 430, 11, '#b7cde3', '#eef6ff', .9);
  skyline(c, 470, 29, '#8fb0d0', '#dceaff', 1.1);
  // парк
  c.beginPath(); c.moveTo(0, 470); c.bezierCurveTo(300, 440, 700, 500, VW, 460); c.lineTo(VW, VH); c.lineTo(0, VH); c.closePath(); toon('#9bd65a', 5, c);
  // дорога по диагонали
  c.beginPath(); c.moveTo(-20, 680); c.bezierCurveTo(400, 600, 800, 700, 1300, 560); c.lineTo(1300, 640); c.bezierCurveTo(800, 780, 400, 690, -20, 760); c.closePath(); toon('#6b7078', 5, c);
  c.save(); c.setLineDash([30, 26]); c.beginPath(); c.moveTo(-20, 720); c.bezierCurveTo(400, 645, 800, 740, 1300, 600); c.lineWidth = 5; c.strokeStyle = '#f4efe6'; c.stroke(); c.restore();
  poplar(c, 70, 560, .45); poplar(c, 640, 520, .4); poplar(c, 1210, 500, .42);
}
