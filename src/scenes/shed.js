// ----- дача, уровень 4: сарай с канистрой -----
function bgShed(c) {
  c.fillStyle = '#b07a46'; c.fillRect(0, 0, VW, 600);
  const r = rnd(23); for (let x = 0; x < VW; x += 64) { c.fillStyle = mix('#b98250', '#9c6a3a', r()); c.fillRect(x, 0, 64, 600); c.beginPath(); c.moveTo(x, 0); c.lineTo(x, 600); c.lineWidth = 4; c.strokeStyle = '#6e4a22'; c.stroke(); circ(x + 32, 40, 4, c); c.fillStyle = '#5a3a1a'; c.fill(); circ(x + 32, 560, 4, c); c.fill(); }
  // окошко с паутиной
  rr(560, 100, 150, 120, 6, c); toon('#8a5a34', 6, c); rr(576, 116, 118, 88, 3, c); toon('#bfe8ff', 4, c);
  c.strokeStyle = 'rgba(255,255,255,.8)'; c.lineWidth = 2; for (let i = 0; i < 5; i++) { c.beginPath(); c.moveTo(578, 118); c.lineTo(578 + 50 * Math.cos(i * .4), 118 + 50 * Math.sin(i * .4)); c.stroke(); } for (const rad of [18, 32, 46]) { c.beginPath(); c.arc(578, 118, rad, 0, Math.PI / 2); c.stroke(); }
  // открытая дверь
  rr(1110, 140, 170, 460, 4, c); toon('#9be06a', 6, c);
  const g = c.createLinearGradient(0, 140, 0, 600); g.addColorStop(0, '#bfeaff'); g.addColorStop(.6, '#e8fbff'); g.addColorStop(.61, '#9be06a'); c.fillStyle = g; c.fillRect(1116, 146, 158, 450);
  c.save(); c.translate(1110, 140); c.transform(1, -.12, 0, 1, 0, 0); rr(-70, 10, 70, 450, 4, c); toon('#a86b3c', 5, c); c.restore();
  // инструменты на стене
  c.save(); c.translate(400, 150); rr(-6, 0, 12, 230, 5, c); toon('#c08552', 4, c); rr(-40, -10, 80, 16, 4, c); toon('#9aa3ad', 4, c); for (let i = 0; i < 7; i++) { rr(-38 + i * 12, -2, 5, 30, 2, c); toon('#9aa3ad', 2, c); } c.restore();
  c.save(); c.translate(470, 260); c.rotate(.15); c.beginPath(); c.moveTo(0, 0); c.lineTo(140, 0); c.lineTo(140, 40); c.lineTo(0, 22); c.closePath(); toon('#c9d1da', 4, c); rr(-46, -8, 50, 34, 10, c); toon('#e63b2e', 4, c); c.restore();
  // пол
  planks(c, 600, '#8a6a4a', '#6e5238', 40, 220);
  // мотыга в углу
  c.save(); c.translate(1080, 600); c.rotate(-.15); rr(-5, -260, 10, 260, 4, c); toon('#c08552', 4, c); rr(-24, -270, 40, 20, 4, c); toon('#5a5f66', 4, c); c.restore();
}
function drawWoodpile(it) {
  const k = it.char;
  for (let row = 0; row < 5; row++) for (let i = 0; i < 5 - (row % 2); i++) {
    const x = 70 + i * 42 + (row % 2) * 21, y = 580 - row * 40;
    circ(x, y, 20); toon(mix('#e8c48c', '#1e130d', k * .85), 4); circ(x, y, 9); ctx.lineWidth = 3; ctx.strokeStyle = mix('#b8854f', '#1e130d', k * .85); ctx.stroke();
  }
}
function drawWorkbench(it) {
  const k = it.char, w = mix('#c08552', '#1e130d', k * .85), d = mix('#8a5a34', '#1e130d', k * .85);
  rr(380, 470, 20, 130, 5); toon(d, 4); rr(630, 470, 20, 130, 5); toon(d, 4); rr(380, 545, 270, 14, 4); toon(d, 4);
  rr(360, 448, 310, 30, 6); toon(w, 5);
  // кучка опилок и стружки
  ctx.beginPath(); ctx.moveTo(400, 450); ctx.quadraticCurveTo(470, 395, 560, 450); ctx.closePath(); toon(mix('#f0d49a', '#1e130d', k * .85), 4);
  ctx.strokeStyle = mix('#d9a066', '#1e130d', k * .85); ctx.lineWidth = 4;
  for (const [x, y] of [[580, 440], [610, 436], [460, 425]]) { ctx.beginPath(); ctx.arc(x, y, 8, 0, Math.PI * 1.6); ctx.stroke(); }
  // доска и тиски
  rr(560, 425, 100, 22, 4); toon(mix('#e8c48c', '#1e130d', k * .85), 4);
}
function drawPaintShelf(it) {
  const k = it.char, w = mix('#a86b3c', '#1e130d', k * .85);
  rr(830, 170, 16, 430, 4); toon(w, 4); rr(1070, 170, 16, 430, 4); toon(w, 4);
  for (const y of [260, 380, 500]) { rr(820, y, 275, 18, 5); toon(w, 4); }
  const cols = ['#3fa9f5', '#ffd23f', '#e63b2e', '#7cc243', '#ff7b9c', '#ffffff'];
  [[260, 4], [380, 3], [500, 5]].forEach(([y, n], row) => { for (let i = 0; i < n; i++) { const x = 850 + i * (210 / n); rr(x, y - 50, 36, 50, 5); toon(mix(cols[(i + row) % 6], '#1e130d', k * .85), 4); rr(x + 4, y - 56, 28, 8, 3); toon('#9aa3ad', 3); } });
}
function drawJerrycan(G) {
  const c = G.can; if (!c || c.gone) return;
  ctx.save(); ctx.translate(c.x, c.y);
  if (c.heat > .05) { circ(0, -40, 50 + c.heat * 30); ctx.fillStyle = `rgba(255,60,30,${c.heat * .45})`; ctx.fill(); }
  const sh = c.heat > .6 ? (Math.random() - .5) * 6 * c.heat : 0; ctx.translate(sh, 0);
  rr(-32, -80, 64, 80, 8); toon(mix('#d9473a', '#ff8a3a', c.heat), 5);
  ctx.beginPath(); ctx.moveTo(-22, -68); ctx.lineTo(22, -12); ctx.moveTo(22, -68); ctx.lineTo(-22, -12); ctx.lineWidth = 5; ctx.strokeStyle = '#a8231a'; ctx.stroke();
  rr(-28, -98, 34, 18, 5); toon('#d9473a', 4); rr(14, -96, 14, 18, 3); toon('#ffd23f', 3);
  ctx.restore();
  if (!c.safe) { const t = (time * 2) % 1; ctx.save(); ctx.globalAlpha = 1 - t; circ(c.x, c.y - 45, 50 + t * 30); ctx.lineWidth = 4; ctx.strokeStyle = '#ffffff'; ctx.stroke(); ctx.restore(); }
}
function drawKittens(G, t) {
  const x = t.x, y = t.y, scared = t.burn > 0 || t.state === 'flying';
  rr(x - 50, y - 20, 100, 44, 6); toon('#d9a066', 4);
  [['#f39a3d', -26], ['#9aa3ad', 0], ['#2a1a12', 26]].forEach(([col, dx], i) => {
    const hy = y - 26 - (scared ? Math.abs(Math.sin(time * 15 + i)) * 10 : 0);
    for (const s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(x + dx + s * 6, hy - 10); ctx.lineTo(x + dx + s * 12, hy - 24); ctx.lineTo(x + dx + s * 14, hy - 4); ctx.closePath(); toon(col, 3); }
    circ(x + dx, hy, 14); toon(col, 4);
    const ec = col === '#2a1a12' ? '#ffd23f' : INK;
    if (scared) { for (const s of [-1, 1]) { circ(x + dx + s * 5, hy - 2, 3); ctx.fillStyle = ec; ctx.fill(); } }
    else { ctx.strokeStyle = ec; ctx.lineWidth = 2.5; for (const s of [-1, 1]) { ctx.beginPath(); ctx.arc(x + dx + s * 5, hy - 2, 3, .2, Math.PI - .2); ctx.stroke(); } }
  });
  rr(x - 54, y - 4, 108, 30, 6); toon('#c8905a', 4);
}
