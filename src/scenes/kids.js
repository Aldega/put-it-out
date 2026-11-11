// ----- уровень 2: детская -----
function bgKids(c) {
  c.fillStyle = '#a7d8f0'; c.fillRect(0, 0, VW, 590);
  const r = rnd(11);
  for (let i = 0; i < 46; i++) { const x = r() * VW, y = r() * 560; c.fillStyle = 'rgba(255,255,255,.45)'; if (i % 3) { c.save(); c.translate(x, y); c.rotate(r()); c.beginPath(); for (let k = 0; k < 10; k++) { const a = k * Math.PI / 5, rr2 = k % 2 ? 6 : 14; c.lineTo(Math.cos(a) * rr2, Math.sin(a) * rr2); } c.closePath(); c.fill(); c.restore(); } else { circ(x, y, 9, c); c.fill(); } }
  c.fillStyle = '#f5f0e6'; c.fillRect(0, 575, VW, 28); c.beginPath(); c.moveTo(0, 575); c.lineTo(VW, 575); c.moveTo(0, 603); c.lineTo(VW, 603); c.lineWidth = 5; c.strokeStyle = INK; c.stroke();
  c.fillStyle = '#e3b37a'; c.fillRect(0, 603, VW, 117);
  c.strokeStyle = '#c4935c'; c.lineWidth = 3; for (let y = 633; y < VH; y += 30) { c.beginPath(); c.moveTo(0, y); c.lineTo(VW, y); c.stroke(); for (let x = (y / 30 % 2) * 110; x < VW; x += 220) { c.beginPath(); c.moveTo(x, y - 30); c.lineTo(x, y); c.stroke(); } }
  // окно
  rr(520, 90, 260, 250, 12, c); toon('#ffffff', 7, c);
  rr(538, 108, 224, 214, 5, c); c.fillStyle = '#8fdcff'; c.fill(); c.lineWidth = 4; c.strokeStyle = INK; c.stroke();
  c.save(); rr(538, 108, 224, 214, 5, c); c.clip(); cloud(c, 600, 170, .7); cloud(c, 720, 250, .5); circ(740, 135, 26, c); toon('#ffe066', 4, c); c.restore();
  c.fillStyle = '#fff'; c.fillRect(645, 108, 10, 214); c.fillRect(538, 210, 224, 10);
  for (const [x0, d] of [[505, 1], [795, -1]]) { c.beginPath(); c.moveTo(x0, 80); c.lineTo(x0 + d * 60, 80); c.quadraticCurveTo(x0 + d * 30, 210, x0 + d * 55, 360); c.lineTo(x0, 360); c.closePath(); toon('#ffd166', 5, c); }
  rr(490, 70, 320, 16, 8, c); toon('#f28482', 4, c);
  // рисунок на стене
  c.save(); c.translate(380, 200); c.rotate(-.06); rr(-60, -55, 120, 110, 3, c); toon('#ffffff', 4, c);
  circ(-30, -25, 14, c); c.fillStyle = '#ffd23f'; c.fill(); c.beginPath(); c.moveTo(-10, 40); c.lineTo(-10, 5); c.lineTo(15, -15); c.lineTo(40, 5); c.lineTo(40, 40); c.closePath(); c.strokeStyle = '#e63b2e'; c.lineWidth = 4; c.stroke();
  c.fillStyle = '#7cc243'; c.fillRect(-55, 42, 110, 6); c.fillStyle = '#ffadad'; c.fillRect(-12, -62, 24, 12); c.restore();
  // полка
  rr(930, 250, 280, 18, 6, c); toon('#c08552', 5, c);
  const bk = ['#e63b2e', '#3fa9f5', '#7cc243', '#ffd23f']; bk.forEach((col, i) => { rr(945 + i * 26, 175 + (i % 2) * 10, 22, 75 - (i % 2) * 10, 3, c); toon(col, 4, c); });
  circ(1100, 222, 26, c); toon('#ff7b9c', 4, c); c.beginPath(); c.moveTo(1076, 222); c.quadraticCurveTo(1100, 205, 1124, 222); c.lineWidth = 3; c.stroke();
  c.beginPath(); c.moveTo(1165, 250); c.lineTo(1165, 180); c.quadraticCurveTo(1180, 150, 1195, 180); c.lineTo(1195, 250); c.closePath(); toon('#f4efe6', 4, c); circ(1180, 195, 6, c); toon('#3fa9f5', 3, c);
  // розетка слева, над кроватью: на телефоне справа её закрывают кнопки средств
  socket(c, 230, 385);
  // кубики на полу
  [[1010, 640, '#e63b2e', 'А'], [1068, 640, '#3fa9f5', 'Б'], [1039, 588, '#7cc243', 'В']].forEach(([x, y, col, t]) => { rr(x - 26, y - 26, 52, 52, 6, c); toon(col, 5, c); c.fillStyle = '#fff'; c.font = '900 30px Rubik, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(t, x, y + 2); });
  circ(1180, 650, 34, c); toon('#ffd23f', 5, c); c.beginPath(); c.arc(1180, 650, 34, -.9, .9); c.lineWidth = 4; c.stroke(); c.beginPath(); c.arc(1180, 650, 34, Math.PI - .9, Math.PI + .9); c.stroke();
  ell(600, 668, 230, 30, c); toon('#9ad0a0', 5, c);
}
function drawBed(it) {
  const k = it.char;
  rr(20, 330, 40, 300, 10); toon('#c08552', 5);
  rr(40, 470, 300, 110, 16); toon('#ffffff', 5);
  rr(50, 440, 110, 50, 22); toon(mix('#ffffff', '#2a1a12', k * .7), 5);
  ctx.beginPath(); ctx.moveTo(140, 470); ctx.quadraticCurveTo(240, 455, 345, 478); ctx.lineTo(345, 600); ctx.quadraticCurveTo(240, 610, 140, 590); ctx.closePath(); toon(mix('#ff7b9c', '#2a1a12', k * .8), 5);
  ctx.fillStyle = mix('#ffd1dc', '#2a1a12', k * .8); for (const [x, y] of [[180, 500], [240, 530], [300, 505], [210, 570], [290, 570]]) { circ(x, y, 9); ctx.fill(); }
  rr(30, 580, 26, 50, 6); toon('#c08552', 4); rr(320, 580, 22, 50, 6); toon('#c08552', 4);
}
function drawToybox(it) {
  const k = it.char, box = mix('#d9a066', '#2a1a12', k * .85);
  // игрушки торчат
  ctx.beginPath(); ctx.moveTo(385, 545); ctx.lineTo(380, 500); ctx.lineWidth = 8; ctx.strokeStyle = INK; ctx.stroke(); circ(380, 495, 16); toon(mix('#e63b2e', '#2a1a12', k * .8), 5);
  rr(420, 505, 40, 50, 8); toon(mix('#3fa9f5', '#2a1a12', k * .8), 5);
  circ(480, 535, 22); toon(mix('#ffd23f', '#2a1a12', k * .8), 5);
  rr(340, 540, 170, 115, 8); toon(box, 6);
  ctx.beginPath(); ctx.moveTo(340, 540); ctx.lineTo(310, 515); ctx.lineTo(360, 515); ctx.lineTo(372, 540); toon(mix('#c8905a', '#2a1a12', k * .85), 5);
  ctx.fillStyle = mix('#8a5a34', '#2a1a12', k * .6); ctx.font = '900 26px Rubik, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('ИГРУШКИ', 425, 600);
}
function drawHeater(G) {
  const hot = G.flags.plugged ? .5 + .2 * Math.sin(G.time * 3) : 0;
  // провод
  ctx.beginPath(); ctx.moveTo(700, 628);
  if (G.flags.plugged) ctx.bezierCurveTo(560, 640, 250, 610, 230, 395); else ctx.bezierCurveTo(660, 660, 520, 690, 480, 676);
  ctx.lineWidth = 9; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 4; ctx.strokeStyle = '#ffffff'; ctx.stroke();
  if (G.flags.plugged) plugAt(230, 387); else plugAt(470, 676);
  for (let i = 0; i < 6; i++) { rr(700 + i * 22, 470, 20, 160, 9); toon(mix('#eceff4', '#ff6a3d', hot * (i % 2 ? .7 : 1)), 4); }
  rr(694, 618, 140, 16, 6); toon('#9aa3ad', 4);
  circ(712, 645, 9); toon('#555', 3); circ(816, 645, 9); toon('#555', 3);
  rr(745, 448, 40, 22, 6); toon(G.flags.plugged ? '#ff5a3c' : '#9aa3ad', 4);
  if (G.flags.plugged && Math.random() < .08) { G.parts.push({ k: 'spark', x: 222 + Math.random() * 20, y: 390, vx: (Math.random() - .5) * 200, vy: -Math.random() * 200, life: 0, max: .4 }); }
}
function drawBear(it) {
  const k = it.char, fur = mix('#c8894a', '#1e130d', k * .85), furL = mix('#e8b880', '#2a1a12', k * .8), wet = it.wet > 0 ? .15 : 0;
  const f = wet ? mix('#c8894a', '#5a4a6a', wet) : fur;
  ctx.save(); ctx.translate(600, 0); ctx.rotate(.08); ctx.translate(-600, 0);
  ell(540, 645, 42, 28); toon(f, 5); ell(660, 645, 42, 28); toon(f, 5);
  ell(530, 648, 20, 15); toon(furL, 4); ell(670, 648, 20, 15); toon(furL, 4);
  ell(600, 575, 78, 80); toon(f, 6);
  ell(600, 590, 44, 50); toon(furL, 4);
  ell(520, 560, 26, 50, ctx, .5); toon(f, 5); ell(680, 560, 26, 50, ctx, -.5); toon(f, 5);
  circ(545, 425, 24); toon(f, 5); circ(655, 425, 24); toon(f, 5); circ(545, 425, 12); toon(furL, 3); circ(655, 425, 12); toon(furL, 3);
  circ(600, 470, 64); toon(f, 6);
  ell(600, 492, 30, 22); toon(furL, 4);
  ell(600, 482, 11, 8); toon(INK, 2);
  ctx.beginPath(); ctx.moveTo(600, 490); ctx.lineTo(600, 500); ctx.moveTo(590, 503); ctx.quadraticCurveTo(600, 510, 610, 503); ctx.lineWidth = 3; ctx.strokeStyle = INK; ctx.stroke();
  circ(575, 455, 7); ctx.fillStyle = INK; ctx.fill(); circ(625, 455, 7); ctx.fill();
  ctx.fillStyle = '#fff'; circ(577, 452, 2.5); ctx.fill(); circ(627, 452, 2.5); ctx.fill();
  // бантик
  ctx.beginPath(); ctx.moveTo(600, 532); ctx.lineTo(570, 518); ctx.lineTo(570, 546); ctx.closePath(); toon(mix('#e63b2e', '#2a1a12', k * .7), 4);
  ctx.beginPath(); ctx.moveTo(600, 532); ctx.lineTo(630, 518); ctx.lineTo(630, 546); ctx.closePath(); toon(mix('#e63b2e', '#2a1a12', k * .7), 4);
  circ(600, 532, 8); toon(mix('#ff6b5e', '#2a1a12', k * .7), 4);
  // заплатка
  rr(615, 600, 26, 22, 4); toon(mix('#7fc4e8', '#2a1a12', k * .7), 3);
  ctx.restore();
}


// клетка с хомяком на коробке с игрушками
function drawHamster(G, t) {
  const x = t.x, y = t.y, scared = t.burn > 0 || t.state === 'flying';
  rr(x - 50, y + 22, 100, 14, 5); toon('#3fa9f5', 4);
  ctx.fillStyle = '#ffe9a8'; ctx.fillRect(x - 44, y + 12, 88, 12);
  // хомяк
  const hop = scared ? Math.abs(Math.sin(time * 14)) * 8 : 0;
  ell(x, y + 6 - hop, 24, 18); toon('#e8a860', 4);
  ell(x + 4, y + 12 - hop, 13, 8); toon('#fff3df', 3);
  for (const s of [-1, 1]) { circ(x + s * 13, y - 10 - hop, 6); toon('#f1b8a0', 3); }
  circ(x - 7, y + 1 - hop, 3); ctx.fillStyle = INK; ctx.fill(); circ(x + 9, y + 1 - hop, 3); ctx.fill();
  // прутья
  ctx.beginPath(); ctx.moveTo(x - 50, y + 22); ctx.lineTo(x - 50, y - 26); ctx.quadraticCurveTo(x, y - 62, x + 50, y - 26); ctx.lineTo(x + 50, y + 22); ctx.lineWidth = 5; ctx.strokeStyle = INK; ctx.stroke();
  ctx.lineWidth = 3; for (let i = -3; i <= 3; i++) { ctx.beginPath(); ctx.moveTo(x + i * 14, y + 22); ctx.lineTo(x + i * 14, y - 30 - (3 - Math.abs(i)) * 5); ctx.stroke(); }
  rr(x - 10, y - 56, 20, 10, 4); toon('#3fa9f5', 3);
}
