// ----- город, уровень 5: кухня кафе, фритюр -----
function bgCafe(c) {
  c.fillStyle = '#f6f1e6'; c.fillRect(0, 0, VW, 600);
  // плитка
  c.strokeStyle = '#dcd3c0'; c.lineWidth = 3;
  for (let x = 0; x < VW; x += 44) { c.beginPath(); c.moveTo(x, 300); c.lineTo(x, 600); c.stroke(); }
  for (let y = 300; y < 600; y += 44) { c.beginPath(); c.moveTo(0, y); c.lineTo(VW, y); c.stroke(); }
  // окно раздачи в зал
  rr(870, 150, 360, 240, 8, c); toon('#c08552', 6, c);
  rr(886, 166, 328, 208, 4, c); toon('#ffe9c4', 4, c);
  for (let i = 0; i < 3; i++) { const x = 930 + i * 110; rr(x - 36, 300, 72, 12, 4, c); toon('#ffffff', 3, c); rr(x - 4, 312, 8, 60, 3, c); toon('#5a5f66', 3, c); }
  // посетители в зале
  for (const [x, col] of [[960, '#3fa9f5'], [1150, '#7cc243']]) { rr(x - 22, 250, 44, 54, 14, c); toon(col, 4, c); circ(x, 232, 18, c); toon('#f4cfa8', 4, c); }
  rr(860, 386, 380, 18, 5, c); toon('#9aa3ad', 5, c);
  // меню на стене
  rr(640, 120, 170, 130, 6, c); toon('#2f3540', 5, c); tex(c, 725, 146, 'МЕНЮ', 20, '#ffd23f');
  for (let i = 0; i < 4; i++) { rr(660, 166 + i * 18, 90, 6, 3, c); c.fillStyle = '#ffffff'; c.fill(); rr(762, 166 + i * 18, 30, 6, 3, c); c.fill(); }
  // короб вытяжки до потолка
  rr(370, 0, 80, 200, 4, c); toon('#c9d1db', 5, c);
  // стол из нержавейки
  rr(0, 470, 860, 22, 5, c); toon('#c9d1db', 5, c);
  rr(0, 492, 860, 108, 4, c); toon('#dfe5ec', 5, c);
  // пол
  c.fillStyle = '#8a8f96'; c.fillRect(0, 600, VW, 120);
  for (let x = 0; x < VW; x += 60) for (let y = 600; y < VH; y += 60) { if (((x + y) / 60) % 2) { c.fillStyle = '#9aa0a8'; c.fillRect(x, y, 60, 60); } }
  c.beginPath(); c.moveTo(0, 600); c.lineTo(VW, 600); c.lineWidth = 6; c.strokeStyle = INK; c.stroke();
  // ящички стола
  for (let x = 590; x < 860; x += 140) { rr(x, 506, 120, 80, 6, c); toon('#d0d7df', 4, c); rr(x + 44, 520, 32, 8, 4, c); toon('#5a5f66', 3, c); }
}
function cafeBack(G) {
  // выключатель вытяжки
  rr(120, 300, 64, 80, 8); toon('#ffffff', 4);
  ctx.save(); ctx.translate(152, 340); ctx.rotate(G.flags.fan ? -.4 : .4); rr(-8, -22, 16, 30, 5); toon(G.flags.fan ? '#7cc243' : '#9aa3ad', 3); ctx.restore();
  // вентилятор в коробе
  circ(410, 120, 30); toon('#9aa3ad', 4);
  ctx.save(); ctx.translate(410, 120); ctx.rotate(G.flags.fan ? time * 12 : 0); for (let i = 0; i < 3; i++) { ctx.rotate(Math.PI * 2 / 3); ell(0, -14, 8, 14); toon('#5a5f66', 2); } ctx.restore();
  tex(ctx, 152, 396, 'ВЫТЯЖКА', 14, INK);
}
function drawHood(it, G) {
  const k = it.char, st = mix('#dfe5ec', '#1e130d', k * .85);
  ctx.beginPath(); ctx.moveTo(330, 196); ctx.lineTo(490, 196); ctx.lineTo(560, 290); ctx.lineTo(260, 290); ctx.closePath(); toon(st, 5);
  rr(255, 286, 310, 16, 5); toon(mix('#9aa3ad', '#1e130d', k * .85), 4);
  // жирные фильтры
  for (let i = 0; i < 4; i++) { rr(290 + i * 62, 252, 52, 30, 3); toon(mix('#c9a85a', '#1e130d', k * .85), 3); }
  // потёки жира
  ctx.fillStyle = mix('#b8903a', '#1e130d', k * .85); for (const x of [300, 420, 520]) { ell(x, 302, 6, 9); ctx.fill(); }
  // всасываемый дым
  if (G.flags.fan && G.byId.fryer.fire > 0 && Math.random() < .3) G.parts.push({ k: 'smoke', x: 380 + Math.random() * 60, y: 330, vx: (410 - 400) * .2, vy: -160, life: 0, max: .8, r: 12 });
}
function drawFryer(it, G) {
  const k = it.char, st = mix('#c9d1db', '#1e130d', k * .5);
  rr(290, 420, 240, 182, 8); toon(st, 6);
  rr(300, 408, 220, 26, 6); toon('#5a5f66', 5);
  ell(410, 418, 100, 10); toon(mix('#e8b830', '#1e130d', k * .6), 3);
  // корзинки
  for (const x of [355, 465]) { rr(x - 40, 400, 80, 22, 4); ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.stroke(); rr(x - 8, 360, 16, 44, 5); toon('#2f3540', 4); }
  // панель с ручкой
  rr(306, 460, 208, 120, 6); toon('#eef1f5', 4);
  tex(ctx, 380, 490, '180°', 22, G.flags.power ? '#e63b2e' : '#9aa3ad');
  circ(380, 540, 18); toon('#2f3540', 4);
  ctx.save(); ctx.translate(480, 520); ctx.rotate(G.flags.power ? -.6 : .6); rr(-7, -22, 14, 30, 5); toon(G.flags.power ? '#e63b2e' : '#9aa3ad', 3); ctx.restore();
  circ(480, 560, 7); toon(G.flags.power ? '#ff5a3a' : '#5a5f66', 3);
}
function drawNapkins(it) {
  const k = it.char;
  // стопка картонных коробок и салфетки
  for (let i = 0; i < 3; i++) { rr(600, 444 - i * 26, 110, 26, 3); toon(mix('#d9a066', '#1e130d', k * .85), 4); }
  rr(608, 446 - 3 * 26, 94, 22, 3); toon(mix('#ffffff', '#1e130d', k * .85), 3); tex(ctx, 655, 380, 'ПИЦЦА', 14, mix('#e63b2e', '#1e130d', k * .85));
  rr(730, 410, 80, 60, 6); toon(mix('#ffffff', '#1e130d', k * .85), 4);
  for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(740 + i * 18, 410); ctx.lineTo(746 + i * 18, 390); ctx.lineTo(752 + i * 18, 410); ctx.closePath(); toon(mix('#ffffff', '#1e130d', k * .85), 2); }
  // бумажные стаканчики
  for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(822, 470 - i * 14); ctx.lineTo(852, 470 - i * 14); ctx.lineTo(848, 430 - i * 14); ctx.lineTo(826, 430 - i * 14); ctx.closePath(); toon(mix('#ffd23f', '#1e130d', k * .85), 3); }
}
function drawCake(G, t) {
  const x = t.x, y = t.y;
  ell(x, y + 24, 66, 12); toon('#ffffff', 4);
  rr(x - 52, y - 10, 104, 34, 8); toon('#ff9fbd', 4);
  rr(x - 40, y - 36, 80, 28, 8); toon('#ffd6e2', 4);
  for (let i = 0; i < 5; i++) { circ(x - 40 + i * 20, y - 10, 6); toon('#ffffff', 2); }
  for (const dx of [-18, 0, 18]) { rr(x + dx - 3, y - 58, 6, 22, 2); toon(['#3fa9f5', '#ffd23f', '#7cc243'][(dx + 18) / 18], 2); tongue(x + dx, y - 58, 16 + Math.sin(time * 9 + dx) * 2, 9, Math.sin(time * 7 + dx) * 2, FIRE_COLS); }
}
