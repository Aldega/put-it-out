// ----- транспорт, уровень 8: финал на станции, тепловоз и цистерна -----
const ST_WIRE = 104;
function bgStation(c) {
  citySky(c, 520, ['#8fd3f5', '#f0f9ff']);
  cloud(c, 1000, 160, .6);
  // вокзал вдали
  rr(760, 230, 440, 200, 6, c); toon('#f0d9b0', 5, c); c.beginPath(); c.moveTo(740, 230); c.lineTo(980, 170); c.lineTo(1220, 230); c.closePath(); toon('#3f8a4f', 5, c);
  for (const x of [790, 880, 1060, 1150]) { rr(x, 270, 50, 80, 20, c); toon('#bfe8ff', 4, c); }
  circ(980, 210, 22, c); toon('#ffffff', 4, c); c.beginPath(); c.moveTo(980, 210); c.lineTo(980, 196); c.moveTo(980, 210); c.lineTo(992, 214); c.lineWidth = 3; c.strokeStyle = INK; c.stroke();
  c.fillStyle = '#c9c4bb'; c.fillRect(0, 430, VW, 100); c.beginPath(); c.moveTo(0, 430); c.lineTo(VW, 430); c.lineWidth = 5; c.strokeStyle = INK; c.stroke();
  c.fillStyle = '#9b8f7c'; c.fillRect(0, 530, VW, VH - 530); c.beginPath(); c.moveTo(0, 530); c.lineTo(VW, 530); c.lineWidth = 5; c.strokeStyle = INK; c.stroke();
  rails(c, 548);
  catenary(c, ST_WIRE, [40, 1240]);
}
function stationBack(G) {
  // цистерна: прицеплена, откатывается или уже далеко
  const C = G.cist; if (C.gone) return;
  ctx.save(); ctx.translate(C.x, 0);
  const sh = C.heat > .6 && !C.rolling ? (Math.random() - .5) * 6 * C.heat : 0; ctx.translate(sh, 0);
  if (C.heat > .05) { ell(885, 430, 210, 90); ctx.fillStyle = `rgba(255,60,30,${C.heat * .35})`; ctx.fill(); }
  rr(690, 492, 390, 22, 6); toon('#3a3a3a', 4);
  ell(885, 430, 190, 68); toon(mix('#2f3540', '#ff6a2a', C.heat * .8), 6);
  rr(870, 350, 30, 18, 4); toon('#2f3540', 4);
  rr(770, 418, 230, 26, 6); toon('#ffd23f', 3); tex(ctx, 885, 432, 'ГАЗ  ОГНЕОПАСНО', 14, INK);
  wheel(745, 532, 24); wheel(800, 532, 24); wheel(970, 532, 24); wheel(1025, 532, 24);
  if (C.wet > 0) for (let i = 0; i < 2; i++) G.parts.push({ k: 'steam', x: 760 + Math.random() * 250, y: 380, vx: 0, vy: -50, life: 0, max: 1, r: 10 });
  ctx.restore();
  // сцепка
  if (!C.rolling) { rr(660, 494, 40, 14, 4); toon('#7a8290', 3); circ(680, 501, 9); toon('#e63b2e', 3); }
  if (!C.rolling && C.heat > .5 && Math.sin(time * 10) > 0) { circ(885, 330, 20); toon('#ffd23f', 3); tex(ctx, 885, 331, '!', 26, INK); }
}
function stationFront(G) {
  // провод над тепловозом искрит, пока напряжение не сняли
  if (!G.flags.off && G.byId.loco.fire > .3 && Math.random() < .08) { G.parts.push({ k: 'bolt', x: 300 + Math.random() * 300, y: ST_WIRE + 14, tx: 330 + Math.random() * 260, ty: 290, life: 0, max: .25, w: .6 }); SFX.unplug(); }
  drawPhone112(G, 1190, 260);
}
function drawLoco(it, G) {
  const k = it.char, b = mix('#e63b2e', '#1e130d', k * .85), s = mix('#ffd23f', '#1e130d', k * .85), gl = mix('#bfe8ff', '#3a2a20', k * .9);
  rr(250, 500, 420, 22, 6); toon('#3a3a3a', 4);
  // кабина слева, длинный капот справа
  rr(256, 300, 120, 204, 14); toon(b, 6);
  rr(372, 350, 290, 154, 12); toon(b, 6);
  rr(256, 440, 406, 18, 4); toon(s, 4);
  rr(272, 320, 46, 56, 6); toon(gl, 4); rr(326, 320, 38, 56, 6); toon(gl, 4);
  for (let x = 400; x < 640; x += 36) { rr(x, 372, 22, 50, 4); toon(mix('#2f3540', '#120b08', k * .6), 3); }
  rr(460, 330, 40, 24, 4); toon(mix('#5a5f66', '#120b08', k * .6), 4);
  rr(242, 470, 18, 30, 4); toon('#fff3b0', 3);
  for (const x of [300, 360, 560, 620]) wheel(x, 534, 22, k);
}
function drawDiesel(it) { petrolPuddle(470, 584, 175, 16, it.char); }
function drawBooth(it) {
  const k = it.char, col = mix('#7cc243', '#1e130d', k * .85);
  rr(30, 330, 140, 200, 6); toon(col, 5);
  ctx.beginPath(); ctx.moveTo(16, 332); ctx.lineTo(100, 290); ctx.lineTo(184, 332); ctx.closePath(); toon(mix('#8a5a34', '#1e130d', k * .85), 5);
  rr(56, 360, 88, 64, 4); toon(mix('#ffe9a8', '#3a2a20', k * .85), 4);
  rr(80, 440, 44, 88, 4); toon(mix('#5aa832', '#1e130d', k * .85), 4);
}
// тележка с посылками на краю платформы
function drawParcels(G, t) {
  const x = t.x, y = t.y;
  rr(x - 56, y + 4, 112, 14, 4); toon('#3f7bf5', 4);
  for (const dx of [-38, 38]) { circ(x + dx, y + 26, 10); toon('#3a3a3a', 3); }
  rr(x - 50, y - 40, 50, 44, 4); toon('#d9a066', 4); rr(x + 2, y - 30, 46, 34, 4); toon('#e8b06a', 4); rr(x - 26, y - 70, 44, 32, 4); toon('#c98a4f', 4);
  ctx.beginPath(); ctx.moveTo(x - 25, y - 40); ctx.lineTo(x - 25, y + 4); ctx.moveTo(x + 25, y - 30); ctx.lineTo(x + 25, y + 4); ctx.lineWidth = 4; ctx.strokeStyle = '#e63b2e'; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x + 56, y + 4); ctx.lineTo(x + 76, y - 40); ctx.lineWidth = 6; ctx.strokeStyle = INK; ctx.stroke();
}
