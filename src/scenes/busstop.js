// ----- город, уровень 1: урна на остановке -----
function bgBusStop(c) {
  citySky(c, 560);
  cloud(c, 260, 110, .7); cloud(c, 900, 150, .5);
  skyline(c, 470, 7, '#b7cde3', '#eef6ff', .9);
  skyline(c, 560, 17, '#8fb0d0', '#dceaff');
  sidewalk(c, 560, 640);
  // тополь справа
  poplar(c, 1060, 560, .9);
  // знак остановки
  rr(866, 240, 12, 320, 4, c); toon('#5a5f66', 4, c);
  circ(872, 220, 40, c); toon('#ffffff', 5, c); circ(872, 220, 30, c); toon('#3fa9f5', 4, c); tex(c, 872, 222, 'А', 34, '#ffffff');
  rr(836, 300, 72, 90, 6, c); toon('#ffd23f', 4, c); for (let i = 0; i < 4; i++) { rr(846, 316 + i * 18, 52, 6, 3, c); c.fillStyle = INK; c.fill(); }
  // павильон: стойки, крыша, задняя стенка
  for (const x of [262, 742]) { rr(x, 210, 16, 352, 4, c); toon('#5a5f66', 4, c); }
  rr(270, 236, 470, 290, 4, c); c.fillStyle = 'rgba(191,232,255,.55)'; c.fill(); c.lineWidth = 4; c.strokeStyle = INK; c.stroke();
  c.strokeStyle = 'rgba(255,255,255,.8)'; c.lineWidth = 6; for (const x of [320, 470]) { c.beginPath(); c.moveTo(x, 260); c.lineTo(x + 50, 330); c.stroke(); }
  rr(240, 196, 530, 30, 8, c); toon('#3fa9f5', 5, c);
  tex(c, 505, 212, 'ОСТАНОВКА', 20, '#ffffff');
}
function drawUrn(it) {
  const k = it.char, col = mix('#4f8f6a', '#1e130d', k * .85);
  ctx.beginPath(); ctx.moveTo(98, 440); ctx.lineTo(192, 440); ctx.lineTo(180, 562); ctx.lineTo(110, 562); ctx.closePath(); toon(col, 5);
  for (let x = 116; x < 180; x += 16) { ctx.beginPath(); ctx.moveTo(x, 456); ctx.lineTo(x + 2, 548); ctx.lineWidth = 3; ctx.strokeStyle = mix('#3a6e50', '#1e130d', k * .85); ctx.stroke(); }
  ell(145, 440, 50, 10); toon(mix('#2f3540', '#1e130d', k * .5), 4);
  // мусор торчит
  if (k < .6) { rr(118, 424, 26, 18, 3); toon('#ffffff', 3); rr(150, 420, 20, 24, 3); toon('#e63b2e', 3); }
  rr(104, 556, 82, 10, 4); toon('#5a5f66', 3);
}
function drawStopBench(it) {
  const k = it.char, w = mix('#d9a066', '#1e130d', k * .85), m = '#5a5f66';
  for (const x of [320, 580]) { rr(x - 6, 455, 12, 105, 4); toon(m, 4); }
  rr(296, 396, 314, 16, 5); toon(w, 4); rr(296, 418, 314, 16, 5); toon(w, 4);
  rr(290, 448, 326, 18, 5); toon(w, 5); rr(296, 466, 314, 14, 5); toon(mix('#c08552', '#1e130d', k * .85), 4);
}
function drawStopPoster(it) {
  const k = it.char;
  rr(640, 240, 112, 244, 6); toon('#9aa3ad', 5);
  rr(650, 250, 92, 224, 3); toon(mix('#ffe9a8', '#1e130d', k * .85), 3);
  if (k < .5) {
    tex(ctx, 696, 282, 'ЦИРК', 24, '#e63b2e');
    circ(696, 360, 34); toon('#ffd23f', 4); circ(684, 352, 5); ctx.fillStyle = INK; ctx.fill(); circ(708, 352, 5); ctx.fill(); circ(696, 368, 9); toon('#e63b2e', 3);
    ctx.beginPath(); ctx.moveTo(670, 330); ctx.lineTo(696, 290); ctx.lineTo(722, 330); ctx.closePath(); toon('#3fa9f5', 3);
    tex(ctx, 696, 432, 'ТОЛЬКО', 14, INK); tex(ctx, 696, 452, '3 ДНЯ', 18, INK);
  }
}
function drawBouquet(G, t) {
  const x = t.x, y = t.y;
  for (const [dx, dy, col] of [[-22, -34, '#ff7b9c'], [0, -44, '#ffd23f'], [22, -34, '#e63b2e'], [-10, -20, '#ffffff'], [12, -22, '#b98ad9']]) {
    ctx.beginPath(); ctx.moveTo(x, y + 10); ctx.lineTo(x + dx, y + dy); ctx.lineWidth = 4; ctx.strokeStyle = '#5aa832'; ctx.stroke();
    for (let i = 0; i < 5; i++) { const a = i / 5 * Math.PI * 2 + time * .5; circ(x + dx + Math.cos(a) * 8, y + dy + Math.sin(a) * 8, 6); toon(col, 2); }
    circ(x + dx, y + dy, 5); toon('#ffd23f', 2);
  }
  ctx.beginPath(); ctx.moveTo(x - 26, y - 14); ctx.lineTo(x + 26, y - 14); ctx.lineTo(x + 8, y + 26); ctx.lineTo(x - 8, y + 26); ctx.closePath(); toon('#bfe8ff', 4);
  rr(x - 12, y + 2, 24, 8, 3); toon('#e63b2e', 2);
}
