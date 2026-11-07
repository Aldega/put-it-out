// ----- дача, уровень 6: искры из трубы -----
function bgChimney(c) {
  skyGrad(c, ['#2f3570', '#7a5a9a', '#f08a5d'], 470);
  c.fillStyle = '#fff6c8'; const r = rnd(61); for (let i = 0; i < 26; i++) { circ(r() * VW, r() * 220, 1.5 + r() * 2, c); c.fill(); }
  circ(1120, 110, 34, c); toon('#fff3b0', 4, c);
  forestRow(c, 470, 44, '#2f5a45', .7);
  lawn(c, 590, '#5f9a4a', '#4a7a3a', 19);
  // стены дома
  logWall(c, 120, 330, 780, 600, '#c98a4f', 45);
  // окно со светом
  rr(470, 380, 150, 130, 8, c); toon('#ffffff', 6, c); rr(484, 394, 122, 102, 4, c); toon('#ffe9a8', 4, c); c.fillStyle = '#ffffff'; c.fillRect(541, 394, 8, 102); c.fillRect(484, 441, 122, 8);
  // открытая дверь, внутри видна печь с заслонкой
  rr(190, 380, 150, 220, 6, c); toon('#2a1a12', 6, c);
  rr(205, 420, 120, 180, 4, c); toon('#e8e2d4', 4, c); rr(215, 500, 100, 70, 4, c); toon('#3a2a20', 4, c);
  c.save(); c.translate(190, 380); c.transform(1, .15, 0, 1, 0, 0); rr(-60, 0, 60, 220, 4, c); toon('#a86b3c', 5, c); c.restore();
  // свет из окна на траву
  c.fillStyle = 'rgba(255,233,168,.25)'; c.beginPath(); c.moveTo(470, 600); c.lineTo(620, 600); c.lineTo(700, 700); c.lineTo(420, 700); c.closePath(); c.fill();
  // крыльцо
  rr(170, 596, 190, 20, 5, c); toon('#8a5a34', 4, c);
}
function chimneyBack(G) {
  // заслонка в печи (видна в двери)
  const shut = G.flags.damper;
  rr(shut ? 240 : 290, 438, shut ? 80 : 60, 16, 5); toon('#5a5f66', 4); circ(shut ? 238 : 348, 446, 9); toon('#e63b2e', 3);
}
function chimneyFront(G) {
  // труба
  rr(270, 120, 64, 110, 4); toon('#b5442f', 5);
  ctx.strokeStyle = '#7a2a1f'; ctx.lineWidth = 3; for (let y = 142; y < 225; y += 22) { ctx.beginPath(); ctx.moveTo(272, y); ctx.lineTo(332, y); ctx.stroke(); }
  rr(260, 110, 84, 16, 4); toon('#8c2f22', 4);
  if (G.flags.cracked) { ctx.beginPath(); ctx.moveTo(285, 150); ctx.lineTo(300, 170); ctx.lineTo(290, 185); ctx.lineTo(306, 210); ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.stroke(); }
  const f = G.chim;
  if (f > 0) {
    tongue(302, 112, 30 + 70 * f + 10 * Math.sin(time * 11), 56 * (.5 + f * .5), 12 * Math.sin(time * 7) + 10, FIRE_COLS);
    if (Math.random() < f * .5) G.parts.push({ k: 'ember', x: 302 + (Math.random() - .5) * 30, y: 100, vx: 40 + Math.random() * 140 * (Math.random() < .3 ? -1 : 1), vy: -100 - Math.random() * 100, life: 0, max: 1.6, r: 4 });
    if (Math.random() < .15) G.parts.push({ k: 'smoke', x: 302, y: 70, vx: 30, vy: -40, life: 0, max: 2.5, r: 16 });
  } else if (Math.random() < .05) G.parts.push({ k: 'smoke', x: 302, y: 105, vx: 10, vy: -25, life: 0, max: 2, r: 10 });
}
function drawHouseRoof(it) {
  const k = it.char;
  ctx.beginPath(); ctx.moveTo(90, 340); ctx.lineTo(230, 215); ctx.lineTo(680, 215); ctx.lineTo(815, 340); ctx.closePath(); toon(mix('#5f6f8a', '#1e130d', k * .85), 6);
  ctx.strokeStyle = mix('#4a5770', '#1e130d', k * .85); ctx.lineWidth = 4;
  for (let i = 1; i < 4; i++) { const t = i / 4, y = 215 + 125 * t; ctx.beginPath(); ctx.moveTo(230 - 140 * t, y); ctx.lineTo(680 + 135 * t, y); ctx.stroke(); }
  for (let x = 300; x < 680; x += 70) { ctx.beginPath(); ctx.moveTo(x, 215); ctx.lineTo(x - 25, 340); ctx.stroke(); }
  // сухие листья в водостоке
  ctx.fillStyle = mix('#e0a040', '#1e130d', k * .85); for (let x = 120; x < 800; x += 40) { ell(x, 340, 14, 6, ctx, .3); ctx.fill(); }
}
function drawLeafHeap(it) {
  const k = it.char;
  ctx.beginPath(); ctx.moveTo(380, 650); ctx.quadraticCurveTo(470, 560, 580, 650); ctx.closePath(); toon(mix('#e08a3a', '#1e130d', k * .85), 5);
  const r = rnd(71); for (let i = 0; i < 14; i++) { ell(400 + r() * 160, 610 + r() * 36, 10, 5, ctx, r() * 3); toon(mix(['#ffd23f', '#e63b2e', '#c86a2a'][i % 3], '#1e130d', k * .85), 2); }
  // грабли
  ctx.save(); ctx.translate(610, 650); ctx.rotate(-.5); rr(-4, -150, 8, 150, 3); toon('#c08552', 3); rr(-26, -160, 52, 12, 3); toon('#5a5f66', 3); ctx.restore();
}
function drawShedWood(it) {
  const k = it.char;
  // навес
  rr(860, 400, 12, 200, 4); toon('#7a4a2a', 4); rr(1090, 400, 12, 200, 4); toon('#7a4a2a', 4);
  ctx.beginPath(); ctx.moveTo(840, 410); ctx.lineTo(1120, 380); ctx.lineTo(1120, 400); ctx.lineTo(840, 430); ctx.closePath(); toon(mix('#8a5a34', '#1e130d', k * .85), 4);
  for (let row = 0; row < 4; row++) for (let i = 0; i < 5; i++) { const x = 900 + i * 40 + (row % 2) * 18, y = 580 - row * 38; circ(x, y, 19); toon(mix('#e8c48c', '#1e130d', k * .85), 4); circ(x, y, 8); ctx.lineWidth = 3; ctx.strokeStyle = mix('#b8854f', '#1e130d', k * .85); ctx.stroke(); }
}
