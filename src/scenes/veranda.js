// ----- дача, уровень 8: финал, пожар на веранде -----
function bgVeranda(c) {
  skyGrad(c, ['#ff9f6b', '#ffcf8f', '#fff0c4'], 470);
  circ(1000, 250, 60, c); toon('#ffe066', 5, c);
  cloud(c, 820, 110, .6);
  forestRow(c, 450, 52, '#4f8f58', .65);
  lawn(c, 560, '#8fd05a', '#6aa83e', 33);
  picketFence(c, 560, 700, 1280, '#f4efe6', 80);
  // дорожка к калитке
  for (let i = 0; i < 5; i++) { ell(860 + i * 90, 640 + (i % 2) * 14, 38, 13, c); toon('#d8d0c0', 4, c); }
  // столб с проводами
  rr(48, 70, 22, 540, 5, c); toon('#8a5a34', 5, c); rr(20, 100, 80, 12, 4, c); toon('#8a5a34', 4, c);
  for (const x of [26, 92]) { circ(x, 96, 7, c); toon('#ffffff', 3, c); }
  c.beginPath(); c.moveTo(-10, 80); c.quadraticCurveTo(10, 100, 26, 96); c.moveTo(92, 96); c.quadraticCurveTo(250, 160, 400, 250); c.lineWidth = 4; c.strokeStyle = INK; c.stroke();
}
function verandaBack(G) {
  // рубильник на столбе
  rr(30, 370, 60, 80, 6); toon('#9aa3ad', 5);
  tex(ctx, 60, 390, '⚡', 20, '#ffd23f');
  const on = G.flags.plugged;
  ctx.save(); ctx.translate(60, 425); ctx.rotate(on ? -.6 : .6); rr(-5, -26, 10, 28, 4); toon('#5a5f66', 3); rr(-10, -34, 20, 12, 5); toon('#e63b2e', 3); ctx.restore();
  if (on && Math.random() < .1) { const x = 380 + Math.random() * 30, y = 250 + Math.random() * 30; G.parts.push({ k: 'spark', x, y, vx: (Math.random() - .5) * 300, vy: -Math.random() * 200, life: 0, max: .4 }); }
  windLines(140, 380, 3);
}
function drawDachaHouse(it) {
  const k = it.char;
  logWall(ctx, 150, 280, 400, 590, mix('#d79a5c', '#1e130d', k * .85), 44);
  ctx.beginPath(); ctx.rect(150, 280, 250, 310); ctx.lineWidth = 5; ctx.strokeStyle = INK; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(125, 290); ctx.lineTo(275, 150); ctx.lineTo(425, 290); ctx.closePath(); toon(mix('#b5442f', '#1e130d', k * .85), 5);
  rr(240, 200, 70, 60, 30); toon('#ffffff', 4); rr(250, 210, 50, 40, 20); toon('#bfe8ff', 3);
  rr(200, 340, 110, 110, 6); toon('#ffffff', 5); rr(212, 352, 86, 86, 3); toon(mix('#bfe8ff', '#1e130d', k * .7), 3);
}
function drawVerandaRoom(it) {
  const k = it.char, w = mix('#ffffff', '#1e130d', k * .85), gl = mix('#cfeeff', '#3a2a20', k * .9);
  rr(400, 330, 300, 250, 4); toon(gl, 5);
  for (let i = 0; i < 4; i++) { rr(400 + i * 75, 330, 75, 150, 2); ctx.lineWidth = 6; ctx.strokeStyle = w; ctx.stroke(); }
  rr(400, 480, 300, 100, 4); toon(mix('#7cc5f5', '#1e130d', k * .85), 5);
  for (let x = 425; x < 700; x += 30) { ctx.beginPath(); ctx.moveTo(x, 484); ctx.lineTo(x, 576); ctx.lineWidth = 3; ctx.strokeStyle = mix('#4f9ad5', '#1e130d', k * .85); ctx.stroke(); }
  ctx.beginPath(); ctx.moveTo(390, 335); ctx.lineTo(400, 260); ctx.lineTo(720, 300); ctx.lineTo(715, 340); ctx.closePath(); toon(mix('#b5442f', '#1e130d', k * .85), 5);
  // лампочка-гирлянда
  for (let i = 0; i < 6; i++) { circ(420 + i * 50, 345 + (i % 2) * 6, 7); toon(it.fire > 0 || k > .3 ? '#6e6e6e' : '#ffe45c', 3); }
  // крыльцо
  rr(470, 580, 160, 16, 4); toon('#a86b3c', 4); rr(490, 596, 120, 14, 4); toon('#a86b3c', 4);
}
function drawLilac(it) {
  const k = it.char;
  for (const [dx, dy, r] of [[760, 520, 50], [820, 500, 55], [790, 440, 55], [740, 460, 40], [850, 450, 42]]) { circ(dx, dy, r); toon(mix('#5aa832', '#1e130d', k * .85), 4); }
  for (const [dx, dy] of [[770, 420], [830, 440], [750, 480], [810, 500], [860, 480]]) { ell(dx, dy, 12, 18); toon(mix('#b98ad9', '#1e130d', k * .85), 3); }
}
function drawKennel(it) {
  const k = it.char, w = mix('#c08552', '#1e130d', k * .85);
  rr(900, 440, 170, 120, 4); toon(w, 5);
  for (let x = 925; x < 1070; x += 28) { ctx.beginPath(); ctx.moveTo(x, 444); ctx.lineTo(x, 556); ctx.lineWidth = 3; ctx.strokeStyle = mix('#8a5a34', '#1e130d', k * .85); ctx.stroke(); }
  ctx.beginPath(); ctx.moveTo(885, 445); ctx.lineTo(985, 370); ctx.lineTo(1085, 445); ctx.closePath(); toon(mix('#3fa9f5', '#1e130d', k * .85), 5);
  ctx.beginPath(); ctx.moveTo(950, 560); ctx.lineTo(950, 500); ctx.arc(985, 500, 35, Math.PI, 0); ctx.lineTo(1020, 560); ctx.closePath(); toon('#2a1a12', 4);
  rr(940, 405, 90, 26, 5); toon('#ffffff', 3); tex(ctx, 985, 419, 'ШАРИК', 16, INK);
}
function drawDog(G, t) {
  const x = t.x, y = t.y, scared = t.burn > 0 || t.state === 'flying', b = scared ? Math.abs(Math.sin(time * 14)) * 6 : 0;
  // цепь к будке
  if (t.state === 'here') { ctx.beginPath(); ctx.moveTo(x - 10, y - 10); ctx.quadraticCurveTo(x + 10, y + 40, 1060, y + 20); ctx.lineWidth = 5; ctx.strokeStyle = '#9aa3ad'; ctx.setLineDash([6, 4]); ctx.stroke(); ctx.setLineDash([]); }
  ctx.save(); ctx.translate(0, -b);
  ell(x + 10, y + 12, 34, 26); toon('#c8864a', 4);
  ctx.beginPath(); ctx.moveTo(x + 40, y + 10); ctx.quadraticCurveTo(x + 60, y - 10 + Math.sin(time * (scared ? 20 : 8)) * 8, x + 56, y - 24); ctx.lineWidth = 10; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 5; ctx.strokeStyle = '#c8864a'; ctx.stroke();
  circ(x - 14, y - 22, 26); toon('#d99a5c', 4);
  ell(x - 32, y - 14, 16, 12); toon('#f0d0a0', 3); circ(x - 44, y - 18, 5); ctx.fillStyle = INK; ctx.fill();
  for (const s of [-1, 1]) { ell(x - 14 + s * 22, y - 30, 9, 18, ctx, s * .4); toon('#8a5a34', 3); }
  if (scared) { circ(x - 18, y - 30, 5); toon('#fff', 2); circ(x - 19, y - 30, 2); ctx.fillStyle = INK; ctx.fill(); } else { circ(x - 18, y - 30, 3); ctx.fillStyle = INK; ctx.fill(); }
  rr(x - 30, y - 6, 30, 8, 4); toon('#e63b2e', 3);
  ctx.restore();
}
