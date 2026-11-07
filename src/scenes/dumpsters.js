// ----- город, уровень 2: мусорные баки во дворе -----
function bgDumpsters(c) {
  bricks(c, 0, 0, VW, 560, '#d98a5f', '#b86c45');
  // окна первого этажа
  for (const x of [60, 760, 1000]) { rr(x, 90, 170, 170, 6, c); toon('#ffffff', 6, c); rr(x + 12, 102, 146, 146, 3, c); toon('#bfe8ff', 4, c); c.fillStyle = '#ffffff'; c.fillRect(x + 81, 102, 8, 146); }
  // цветок на подоконнике
  circ(1100, 225, 16, c); toon('#e63b2e', 3, c); rr(1086, 230, 28, 20, 4, c); toon('#c08552', 3, c);
  // площадка и перегородки
  sidewalk(c, 560, 720, false);
  rr(430, 300, 530, 262, 4, c); toon('#9aa3ad', 5, c);
  for (let x = 460; x < 950; x += 40) { c.beginPath(); c.moveTo(x, 304); c.lineTo(x, 556); c.lineWidth = 3; c.strokeStyle = '#7a828c'; c.stroke(); }
  rr(420, 290, 550, 18, 4, c); toon('#5a5f66', 4, c);
  rr(410, 556, 570, 14, 4, c); toon('#d9d4c8', 4, c);
  rr(760, 316, 120, 34, 6, c); toon('#ffffff', 3, c); tex(c, 820, 334, 'МУСОР', 18, '#4f8f6a');
  // дверь подъезда справа
  rr(1140, 300, 120, 262, 6, c); toon('#3f7bf5', 5, c); rr(1158, 330, 84, 90, 4, c); toon('#bfe8ff', 3, c); circ(1160, 470, 7, c); toon('#ffd23f', 3, c);
  rr(1130, 280, 140, 20, 4, c); toon('#9aa3ad', 4, c);
}
// мусорный бак на колёсах. cx = центр, by = земля
function binShape(cx, by, col, k, lid, fill) {
  const b = mix(col, '#1e130d', k * .85);
  ctx.beginPath(); ctx.moveTo(cx - 100, by - 172); ctx.lineTo(cx + 100, by - 172); ctx.lineTo(cx + 88, by - 24); ctx.lineTo(cx - 88, by - 24); ctx.closePath(); toon(b, 6);
  for (const dx of [-50, 0, 50]) { ctx.beginPath(); ctx.moveTo(cx + dx, by - 160); ctx.lineTo(cx + dx * .9, by - 36); ctx.lineWidth = 4; ctx.strokeStyle = mix(col, '#1e130d', .3 + k * .6); ctx.stroke(); }
  rr(cx - 108, by - 180, 216, 16, 6); toon(mix(col, '#1e130d', .2 + k * .7), 5);
  if (fill && k < .7) { // мусор торчит из открытого бака
    rr(cx - 70, by - 196, 40, 22, 4); toon('#ffffff', 3); ell(cx + 10, by - 186, 26, 14); toon('#3a3a3a', 3); rr(cx + 40, by - 200, 30, 26, 4); toon('#d9a066', 3);
  }
  if (lid === 'closed') { rr(cx - 106, by - 194, 212, 18, 8); toon(mix('#2f3540', '#1e130d', k * .5), 5); rr(cx - 20, by - 202, 40, 10, 4); toon('#5a5f66', 3); }
  else if (lid === 'open') { ctx.save(); ctx.translate(cx + 104, by - 182); ctx.rotate(-1.25); rr(0, -30, 212, 30, 10); toon(mix('#3a6e50', '#1e130d', k * .6), 5); rr(150, -40, 40, 12, 5); toon('#5a5f66', 3); ctx.restore(); }
  for (const dx of [-62, 62]) { circ(cx + dx, by - 14, 15); toon('#3a3a3a', 4); circ(cx + dx, by - 14, 5); toon('#bbbbbb', 2); }
}
function drawBin1(it, G) { binShape(560, 560, '#4f8f6a', it.char, G.flags.lid ? 'closed' : 'open', true); }
function drawBin2(it, G) {
  const x = G.can.x;
  binShape(x, 560, '#3f7bf5', it.char, 'closed', false);
  if (!G.flags.rolled && it.fire === 0) { const t = (time * 2) % 1; ctx.save(); ctx.globalAlpha = 1 - t; circ(x, 470, 70 + t * 30); ctx.lineWidth = 4; ctx.strokeStyle = '#ffffff'; ctx.stroke(); ctx.restore(); }
}
function drawYardPoplar(it) {
  const k = it.char;
  poplar(ctx, 210, 560, .95, mix('#6fb54a', '#1e130d', k * .85));
}
function drawBike(G, t) {
  const x = t.x, y = t.y;
  for (const dx of [-46, 46]) { circ(x + dx, y + 20, 30); ctx.lineWidth = 7; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 3; ctx.strokeStyle = '#9aa3ad'; ctx.stroke(); circ(x + dx, y + 20, 4); toon('#5a5f66', 2); }
  ctx.beginPath(); ctx.moveTo(x - 46, y + 20); ctx.lineTo(x - 10, y - 18); ctx.lineTo(x + 30, y - 18); ctx.lineTo(x + 46, y + 20); ctx.moveTo(x - 10, y - 18); ctx.lineTo(x + 2, y + 20); ctx.lineTo(x + 30, y - 18); ctx.moveTo(x - 46, y + 20); ctx.lineTo(x + 2, y + 20);
  ctx.lineWidth = 10; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 5; ctx.strokeStyle = '#e63b2e'; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x + 30, y - 18); ctx.lineTo(x + 26, y - 36); ctx.lineTo(x + 44, y - 40); ctx.lineWidth = 6; ctx.strokeStyle = INK; ctx.stroke();
  rr(x - 22, y - 30, 26, 10, 4); toon('#2f3540', 3);
  rr(x + 50, y - 56, 34, 22, 6); toon('#ffd23f', 3); // корзинка
}
