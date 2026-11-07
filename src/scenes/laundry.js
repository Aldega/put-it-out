// ----- уровень 6: утюг -----
function bgLaundry(c) {
  c.fillStyle = '#ffe8a8'; c.fillRect(0, 0, VW, 600);
  const r = rnd(9); for (let i = 0; i < 40; i++) { const x = r() * VW, y = r() * 560; c.fillStyle = 'rgba(240,140,90,.25)'; for (let p = 0; p < 5; p++) { const a = p * Math.PI * 2 / 5; circ(x + Math.cos(a) * 6, y + Math.sin(a) * 6, 4, c); c.fill(); } }
  const sky = c.createLinearGradient(0, 100, 0, 300); sky.addColorStop(0, '#7fd6ff'); sky.addColorStop(1, '#d6f4ff');
  windowFrame(c, 480, 90, 260, 220, sky);
  c.save(); rr(496, 106, 228, 188, 4, c); c.clip(); cloud(c, 560, 170, .55); c.beginPath(); c.moveTo(496, 294); c.lineTo(496, 250); c.quadraticCurveTo(610, 210, 724, 260); c.lineTo(724, 294); c.closePath(); c.fillStyle = '#9bd65a'; c.fill(); c.restore();
  c.fillStyle = '#fff'; c.fillRect(605, 106, 10, 188);
  // полка с бутылками
  rr(820, 240, 220, 16, 6, c); toon('#c08552', 4, c);
  [[850, '#3fa9f5'], [895, '#ff7b9c'], [940, '#7cc243']].forEach(([x, col]) => { rr(x, 180, 32, 60, 8, c); toon(col, 4, c); rr(x + 10, 166, 12, 16, 3, c); toon('#ffffff', 3, c); });
  planks(c, 600, '#c99a6b', '#a67b4f', 30, 220);
  socket(c, 1110, 400);
}
function drawWardrobe(it) {
  const k = it.char, w = mix('#a86b3c', '#1e130d', k * .85);
  rr(60, 140, 270, 480, 10); toon(w, 6);
  rr(78, 160, 113, 400, 6); toon(mix('#c08552', '#1e130d', k * .85), 4); rr(199, 160, 113, 400, 6); toon(mix('#c08552', '#1e130d', k * .85), 4);
  rr(170, 330, 10, 50, 5); toon('#ffd23f', 3); rr(210, 330, 10, 50, 5); toon('#ffd23f', 3);
  rr(70, 615, 22, 18, 4); toon('#5e3019', 3); rr(298, 615, 22, 18, 4); toon('#5e3019', 3);
}
function drawBoard(it) {
  const k = it.char;
  ctx.lineWidth = 9; ctx.strokeStyle = INK; ctx.beginPath(); ctx.moveTo(520, 478); ctx.lineTo(760, 650); ctx.moveTo(760, 478); ctx.lineTo(520, 650); ctx.stroke();
  ctx.lineWidth = 5; ctx.strokeStyle = '#9aa3ad'; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(430, 458); ctx.lineTo(800, 458); ctx.quadraticCurveTo(880, 468, 800, 480); ctx.lineTo(430, 480); ctx.quadraticCurveTo(418, 469, 430, 458); ctx.closePath(); toon(mix('#7fc4e8', '#2a1a12', k * .85), 5);
  // рубашка
  ctx.beginPath(); ctx.moveTo(470, 450); ctx.lineTo(560, 444); ctx.lineTo(585, 432); ctx.lineTo(630, 432); ctx.lineTo(655, 444); ctx.lineTo(690, 450); ctx.lineTo(690, 466); ctx.lineTo(470, 466); ctx.closePath(); toon(mix('#ffffff', '#2a1a12', k * .85), 4);
  ctx.fillStyle = mix('#e63b2e', '#2a1a12', k * .8); for (let x = 480; x < 690; x += 22) ctx.fillRect(x, 448, 8, 16);
}
function drawIron(G) {
  const on = G.flags.plugged;
  if (on) cord(740, 420, 1110, 402, 120); else { cord(740, 420, 860, 655, 90); plugAt(868, 655); }
  if (on) plugAt(1110, 402);
  ctx.beginPath(); ctx.moveTo(660, 452); ctx.lineTo(790, 452); ctx.quadraticCurveTo(790, 400, 730, 395); ctx.lineTo(680, 395); ctx.quadraticCurveTo(650, 410, 660, 452); ctx.closePath(); toon('#5ec3f2', 5);
  ctx.beginPath(); ctx.moveTo(690, 395); ctx.quadraticCurveTo(700, 360, 760, 365); ctx.quadraticCurveTo(775, 380, 770, 398); ctx.lineWidth = 9; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 4; ctx.strokeStyle = '#e9f6ff'; ctx.stroke();
  rr(655, 448, 140, 10, 4); toon(on ? mix('#ff6a3d', '#ffd23f', .5 + .5 * Math.sin(time * 4)) : '#c9d1db', 3);
  circ(700, 420, 6); toon(on ? '#e63b2e' : '#8a8f99', 2);
  if (on && Math.random() < .08) G.parts.push({ k: 'steam', x: 700 + Math.random() * 80, y: 450, vx: 0, vy: -30, life: 0, max: 1.4, r: 8 });
}
function drawBasket(it) {
  const k = it.char, w = mix('#d9a066', '#2a1a12', k * .85);
  ell(970, 520, 85, 20); toon(mix('#ffffff', '#2a1a12', k * .8), 4);
  ctx.beginPath(); ctx.moveTo(885, 520); ctx.lineTo(905, 650); ctx.lineTo(1035, 650); ctx.lineTo(1055, 520); ctx.closePath(); toon(w, 5);
  ctx.strokeStyle = mix('#a8743f', '#2a1a12', k * .8); ctx.lineWidth = 3; for (let y = 545; y < 650; y += 22) { ctx.beginPath(); ctx.moveTo(890 + (y - 520) * .15, y); ctx.lineTo(1050 - (y - 520) * .15, y); ctx.stroke(); }
  circ(930, 505, 18); toon(mix('#ff7b9c', '#2a1a12', k * .8), 4); circ(1000, 502, 20); toon(mix('#7cc243', '#2a1a12', k * .8), 4);
}

