// ----- транспорт, уровень 7: заправка -----
function bgFuel(c) {
  citySky(c, 480, ['#7fcff5', '#e0f6ff']);
  forestRow(c, 470, 21, '#5aa85a', .5);
  c.fillStyle = '#8a8f96'; c.fillRect(0, 470, VW, VH - 470); c.beginPath(); c.moveTo(0, 470); c.lineTo(VW, 470); c.lineWidth = 5; c.strokeStyle = INK; c.stroke();
  // островок под колонкой
  rr(120, 540, 170, 26, 6, c); toon('#e6e1d8', 4, c);
  // навес
  for (const x of [140, 760]) { rr(x, 140, 26, 400, 4, c); toon('#ffffff', 4, c); }
  rr(80, 92, 760, 56, 8, c); toon('#ffffff', 5, c); rr(80, 132, 760, 16, 4, c); toon('#e63b2e', 4, c);
  // магазин АЗС
  rr(1030, 210, 260, 350, 6, c); toon('#f4efe6', 5, c); rr(1020, 186, 280, 34, 6, c); toon('#e63b2e', 5, c); tex(c, 1150, 204, 'АЗС', 22, '#ffffff');
  rr(1150, 300, 110, 140, 4, c); toon('#bfe8ff', 4, c);
  // аварийная кнопка на стене
  rr(1046, 330, 76, 110, 8, c); toon('#ffd23f', 4, c); tex(c, 1084, 350, 'АВАРИЙ-', 11, INK); tex(c, 1084, 364, 'НЫЙ СТОП', 11, INK);
  // стенд с огнетушителем и ящик с песком
  rr(1150, 460, 110, 100, 6, c); toon('#e63b2e', 4, c); tex(c, 1205, 476, 'ПОЖАРНЫЙ ЩИТ', 11, '#ffffff');
}
function fuelBack(G) {
  // колонка и шланг к машине
  rr(160, 300, 90, 244, 10); toon('#3f8a4f', 5); rr(172, 316, 66, 50, 6); toon('#e8f8ff', 4);
  tex(ctx, 205, 340, G.flags.stop ? '----' : (88.8 + (G.time * 3.7) % 10).toFixed(1), 16, G.flags.stop ? '#9aa3ad' : '#e63b2e');
  rr(178, 380, 54, 28, 6); toon('#ffd23f', 3); tex(ctx, 205, 394, '95', 16, INK);
  ctx.beginPath(); ctx.moveTo(250, 420); ctx.bezierCurveTo(300, 520, 290, 470, 320, 470); ctx.lineWidth = 12; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 6; ctx.strokeStyle = '#2f3540'; ctx.stroke();
  if (!G.flags.stop && Math.random() < .35) G.parts.push({ k: 'drop', x: 300 + Math.random() * 20, y: 476, vx: -20, vy: 60, life: 0, max: .5, color: '#c9a7ff', r: 3 });
  // кнопка стоп
  const p = G.flags.stop; circ(1084, 404, p ? 20 : 24); toon(p ? '#a8231a' : '#e63b2e', 5);
  if (!p) { const t = (time * 1.5) % 1; ctx.save(); ctx.globalAlpha = 1 - t; circ(1084, 404, 34 + t * 20); ctx.lineWidth = 4; ctx.strokeStyle = '#ffffff'; ctx.stroke(); ctx.restore(); }
  // огнетушитель на щите
  if (!G.flags.ext) { rr(1188, 498, 34, 56, 10); toon('#e63b2e', 4); rr(1194, 512, 22, 14, 3); toon('#ffffff', 2); rr(1198, 490, 14, 12, 3); toon(INK, 2); }
  // бензовоз
  const T = G.tank;
  if (T.gone) return;
  ctx.save(); ctx.translate(T.x - 60, 0);
  const hx = T.heat > .6 ? (Math.random() - .5) * 6 * T.heat : 0; ctx.translate(hx, 0);
  if (T.heat > .05) { ell(830, 410, 180, 80); ctx.fillStyle = `rgba(255,60,30,${T.heat * .35})`; ctx.fill(); }
  rr(680, 470, 340, 22, 6); toon('#5a5f66', 4);
  ell(820, 410, 150, 66); toon(mix('#e8e2d6', '#ff8a3a', T.heat), 6);
  rr(700, 400, 240, 20, 4); toon('#e63b2e', 3); tex(ctx, 820, 410, 'ОГНЕОПАСНО', 15, '#ffffff');
  rr(970, 380, 90, 110, 14); toon('#3f7bf5', 5); rr(990, 396, 56, 40, 6); toon('#bfe8ff', 4);
  wheel(730, 506, 30); wheel(860, 506, 30); wheel(1010, 506, 30);
  ctx.restore();
  if (!T.leaving && T.heat > .5 && Math.sin(time * 10) > 0) { circ(760, 320, 20); toon('#ffd23f', 3); tex(ctx, 760, 321, '!', 26, INK); }
}
function drawFuelCar(it) { carBody(470, 560, '#ff7b9c', it.char); }
function drawFuelSpill(it) { petrolPuddle(290, 582, 175, 18, it.char); }
// пёс ждёт в машине
function drawCarDog(G, t) {
  const x = t.x, y = t.y, scared = t.burn > 0 || t.state === 'flying';
  const hy = y - (scared ? Math.abs(Math.sin(time * 12)) * 6 : 0);
  for (const s of [-1, 1]) { ell(x + s * 22, hy - 4, 10, 20, ctx, s * .4); toon('#7a4a2a', 3); }
  circ(x, hy, 22); toon('#d9a066', 4);
  ell(x + 4, hy + 10, 12, 9); toon('#f4e2c4', 3); circ(x + 8, hy + 6, 5); ctx.fillStyle = INK; ctx.fill();
  circ(x - 7, hy - 6, 3); ctx.fill(); circ(x + 9, hy - 6, 3); ctx.fill();
  if (scared) { ctx.beginPath(); ctx.moveTo(x + 2, hy + 16); ctx.quadraticCurveTo(x + 6, hy + 30, x + 12, hy + 16); toon('#ff7b9c', 2); }
}
