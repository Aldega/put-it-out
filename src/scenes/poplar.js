// ----- город, уровень 7: тополиный пух во дворе -----
function bgPoplarYard(c) {
  citySky(c, 520, ['#8fd6f5', '#e6f8ff']);
  // панельный дом с балконами
  rr(80, 40, 1120, 480, 4, c); toon('#e8dcc8', 5, c);
  for (let fl = 0; fl < 5; fl++) for (let i = 0; i < 8; i++) {
    const x = 120 + i * 135, y = 70 + fl * 88;
    rr(x, y, 70, 56, 4, c); toon('#bfe8ff', 4, c); c.fillStyle = '#ffffff'; c.fillRect(x + 33, y + 2, 5, 52);
    if ((fl + i) % 3 === 0) { rr(x - 12, y + 44, 94, 26, 3, c); toon('#d9cdb6', 4, c); }
  }
  for (const x of [60, 1230]) poplar(c, x, 520, 1.05);
  // газон и асфальт
  c.fillStyle = '#9bd65a'; c.fillRect(0, 500, VW, 40); c.beginPath(); c.moveTo(0, 500); c.lineTo(VW, 500); c.lineWidth = 5; c.strokeStyle = INK; c.stroke();
  c.fillStyle = '#b8b2a8'; c.fillRect(0, 536, VW, VH - 536); c.beginPath(); c.moveTo(0, 536); c.lineTo(VW, 536); c.lineWidth = 5; c.strokeStyle = INK; c.stroke();
  // пух летает
  const r = rnd(77); c.fillStyle = 'rgba(255,255,255,.9)'; for (let i = 0; i < 40; i++) { circ(r() * VW, 60 + r() * 420, 3 + r() * 3, c); c.fill(); }
}
function poplarBack(G) {
  const T = G.truck;
  // поливальная машина: стоит слева, по команде едет вправо и моет асфальт
  ctx.save(); ctx.translate(T.x, 0);
  rr(-120, 420, 170, 90, 12); toon('#ffd23f', 5);
  ell(-40, 440, 70, 30); toon('#ff9f1c', 4); tex(ctx, -40, 442, 'ВОДА', 18, '#ffffff');
  rr(50, 400, 80, 110, 12); toon('#ff9f1c', 5); rr(64, 412, 54, 40, 6); toon('#bfe8ff', 4);
  for (const x of [-80, 90]) { circ(x, 512, 22); toon('#3a3a3a', 5); circ(x, 512, 8); toon('#bbbbbb', 3); }
  rr(110, 498, 40, 14, 4); toon('#5a5f66', 3);
  if (T.go) { ctx.fillStyle = Math.sin(time * 14) > 0 ? '#ff9f1c' : '#ffffff'; circ(90, 394, 9); ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = INK; ctx.stroke(); }
  ctx.restore();
  if (T.go && T.wait <= 0 && T.x < VW + 150) for (let i = 0; i < 3; i++) G.parts.push({ k: 'drop', x: T.x + 140, y: 505, vx: 160 + Math.random() * 220, vy: -80 + Math.random() * 120, life: 0, max: .5, color: '#3fa9f5', r: 5 });
  else if (!T.go) { const t = (time * 1.5) % 1; ctx.save(); ctx.globalAlpha = 1 - t; circ(T.x, 460, 70 + t * 30); ctx.lineWidth = 4; ctx.strokeStyle = '#ffffff'; ctx.stroke(); ctx.restore(); }
}
// полоса пуха на асфальте: сгорает в золу за пару секунд
function fluffStrip(it, x0, x1, y, seed) {
  if (it.ash) { rr(x0, y - 8, x1 - x0, 14, 7); toon('#5a5250', 3); return; }
  const r = rnd(seed), wet = it.wet > 0;
  for (let x = x0; x < x1; x += 18) { circ(x + r() * 8, y - r() * 10, 12 + r() * 8); ctx.fillStyle = wet ? '#d8e8f0' : mix('#ffffff', '#1e130d', it.char * .6); ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(42,26,18,.45)'; ctx.stroke(); }
}
function drawFluff1(it) { fluffStrip(it, 30, 255, 596, 3); }
function drawFluff2(it) { fluffStrip(it, 290, 520, 578, 5); }
function drawFluff3(it) { fluffStrip(it, 560, 700, 562, 9); }
function drawSwing(it) {
  const k = it.char, w = mix('#3fa9f5', '#1e130d', k * .85), seat = mix('#e63b2e', '#1e130d', k * .85);
  ctx.beginPath(); ctx.moveTo(330, 560); ctx.lineTo(380, 300); ctx.lineTo(510, 300); ctx.lineTo(560, 560); ctx.lineWidth = 14; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 8; ctx.strokeStyle = w; ctx.stroke();
  rr(370, 292, 150, 18, 6); toon(w, 4);
  const sw = Math.sin(time * 2) * 6;
  ctx.beginPath(); ctx.moveTo(420, 308); ctx.lineTo(415 + sw, 500); ctx.moveTo(470, 308); ctx.lineTo(475 + sw, 500); ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.stroke();
  rr(400 + sw, 496, 90, 16, 5); toon(seat, 4);
}
function drawYardCar(it) { carBody(1000, 556, '#e63b2e', it.char); }
function drawBunny(G, t) {
  const x = t.x + (t.state === 'here' ? Math.sin(time * 2) * 6 : 0), y = t.y, scared = t.burn > 0 || t.state === 'flying';
  for (const s of [-1, 1]) { ell(x + s * 12, y - 52, 9, 26, ctx, s * .15); toon('#f4f4f4', 4); ell(x + s * 12, y - 50, 4, 16, ctx, s * .15); ctx.fillStyle = '#ff9fbd'; ctx.fill(); }
  ell(x, y + 4, 26, 24); toon('#f4f4f4', 4);
  circ(x, y - 22, 20); toon('#ffffff', 4);
  for (const s of [-1, 1]) { circ(x + s * 7, y - 24, scared ? 4 : 3); ctx.fillStyle = INK; ctx.fill(); }
  circ(x, y - 16, 4); toon('#ff9fbd', 2);
  rr(x - 18, y - 6, 36, 8, 4); toon('#3fa9f5', 2);
}
