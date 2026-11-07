// ----- город, уровень 3: машина на парковке -----
function bgParking(c) {
  citySky(c, 470, ['#7fcff5', '#e0f6ff']);
  cloud(c, 380, 120, .6);
  skyline(c, 420, 41, '#b7cde3', '#eef6ff', .9);
  // торговый центр за парковкой
  rr(120, 250, 820, 220, 8, c); toon('#f0e6d6', 5, c);
  for (let x = 150; x < 920; x += 110) { rr(x, 300, 80, 100, 4, c); toon('#bfe8ff', 4, c); }
  rr(380, 262, 300, 34, 8, c); toon('#e63b2e', 4, c); tex(c, 530, 280, 'ПРОДУКТЫ', 22, '#ffffff');
  rr(470, 400, 120, 70, 4, c); toon('#9fd8f5', 4, c); c.beginPath(); c.moveTo(530, 400); c.lineTo(530, 470); c.lineWidth = 3; c.strokeStyle = INK; c.stroke();
  // газон и асфальт
  c.fillStyle = '#9bd65a'; c.fillRect(0, 460, VW, 30); c.beginPath(); c.moveTo(0, 460); c.lineTo(VW, 460); c.lineWidth = 5; c.strokeStyle = INK; c.stroke();
  rr(-10, 484, VW + 20, 14, 4, c); toon('#e6e1d8', 5, c);
  c.fillStyle = '#6b7078'; c.fillRect(0, 498, VW, VH - 498); c.beginPath(); c.moveTo(0, 498); c.lineTo(VW, 498); c.lineWidth = 4; c.strokeStyle = INK; c.stroke();
  // разметка мест
  c.strokeStyle = '#f4efe6'; c.lineWidth = 8; c.lineCap = 'round';
  for (const x of [300, 710, 1100]) { c.beginPath(); c.moveTo(x, 510); c.lineTo(x - 50, 700); c.stroke(); }
  streetLamp(c, 1180, 490, 300);
  // табличка P
  rr(1010, 300, 14, 190, 4, c); toon('#5a5f66', 4, c); rr(985, 250, 64, 64, 8, c); toon('#3f7bf5', 4, c); tex(c, 1017, 284, 'P', 40, '#ffffff');
}
function drawBurningCar(it, G) {
  carBody(500, 560, '#ffd23f', it.char, { hood: G.flags.hood, trunk: true });
  // дымок из-под капота
  if (it.fire > 0 && Math.random() < .2) G.parts.push({ k: 'smoke', x: 360 + Math.random() * 80, y: 440, vx: -10 - Math.random() * 20, vy: -50, life: 0, max: 2, r: 14 });
  // рычаг капота у двери водителя
  if (!G.flags.hood) { rr(548, 466, 26, 12, 5); toon('#2f3540', 3); }
}
function drawNeighborCar(it) { carBody(900, 560, '#3fa9f5', it.char); }
function drawParkPuddle(it) { petrolPuddle(470, 582, 125, 18, it.char); }
function drawGroceries(G, t) {
  const x = t.x, y = t.y;
  // пакет с батоном и арбуз
  circ(x + 26, y + 10, 26); toon('#5aa832', 4); ctx.beginPath(); ctx.moveTo(x + 10, y - 10); ctx.quadraticCurveTo(x + 16, y + 10, x + 10, y + 30); ctx.moveTo(x + 30, y - 16); ctx.quadraticCurveTo(x + 36, y + 10, x + 30, y + 36); ctx.lineWidth = 4; ctx.strokeStyle = '#2f7a20'; ctx.stroke();
  ctx.save(); ctx.translate(x - 26, y - 34); ctx.rotate(-.35); rr(-10, -30, 22, 60, 10); toon('#e8b06a', 4); ctx.restore();
  ctx.beginPath(); ctx.moveTo(x - 50, y - 14); ctx.lineTo(x + 2, y - 14); ctx.lineTo(x - 2, y + 34); ctx.lineTo(x - 46, y + 34); ctx.closePath(); toon('#ffffff', 4);
  ctx.beginPath(); ctx.arc(x - 24, y - 14, 12, Math.PI, 0); ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.stroke();
  tex(ctx, x - 24, y + 12, '★', 18, '#e63b2e');
}
