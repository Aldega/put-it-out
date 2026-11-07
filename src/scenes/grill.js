// ----- дача, уровень 2: мангал и розжиг -----
function bgGrill(c) {
  skyGrad(c, ['#5ec3f2', '#bfeaff'], 460);
  cloud(c, 420, 110, .8); cloud(c, 1000, 70, .6);
  forestRow(c, 400, 17, '#5c9e5e', .55);
  // стена дома с окном
  logWall(c, 0, 120, 330, 470, '#d79a5c');
  c.beginPath(); c.moveTo(-20, 130); c.lineTo(170, 20); c.lineTo(360, 130); c.closePath(); toon('#b5442f', 5, c);
  windowFrame(c, 90, 210, 160, 150, '#bfe8ff'); c.fillStyle = '#ffffff'; c.fillRect(166, 226, 8, 118); c.fillRect(106, 280, 128, 8);
  // наличник
  rr(80, 362, 180, 16, 6, c); toon('#ffffff', 4, c);
  picketFence(c, 470, 330, 1280, '#f4efe6', 80);
  leafTree(c, 1150, 470, .95);
  // газон
  lawn(c, 460, '#8fd05a', '#6aa83e', 12);
  // дорожка из плитки
  const r = rnd(5); for (let i = 0; i < 6; i++) { ell(150 + i * 30 + r() * 20, 660 + (i % 2) * 22, 34, 14, c); toon('#d8d0c0', 4, c); }
}
// мангал с шашлыком и угли
function grillBack(G) {
  // ножки и короб
  for (const x of [160, 330]) { rr(x - 6, 470, 12, 140, 4); toon('#4a4a4a', 4); }
  rr(130, 440, 240, 60, 6); toon('#5a5f66', 5);
  for (let i = 0; i < 4; i++) { circ(170 + i * 55, 480, 7); ctx.fillStyle = INK; ctx.fill(); }
  // угли
  const on = G.flags.grill;
  for (let i = 0; i < 9; i++) { circ(150 + i * 25, 440, 13); toon(on ? (i % 2 ? '#ff7a2e' : '#ffb13b') : '#4a4a4a', 3); }
  if (on && Math.random() < .25) G.parts.push({ k: 'ember', x: 150 + Math.random() * 200, y: 430, vx: (Math.random() - .5) * 20, vy: -50 - Math.random() * 40, life: 0, max: .8, r: 3 });
  // шампуры
  for (let i = 0; i < 4; i++) {
    const x = 150 + i * 55; ctx.beginPath(); ctx.moveTo(x - 30, 425); ctx.lineTo(x + 40, 425); ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.stroke();
    for (let k = 0; k < 4; k++) { rr(x - 20 + k * 14, 414, 13, 20, 5); toon(k % 2 ? '#9c4a2a' : '#c0622f', 3); }
    rr(x + 40, 419, 16, 12, 4); toon('#ffd23f', 3);
  }
  if (Math.random() < (on ? .12 : .05)) G.parts.push({ k: on ? 'smoke' : 'steam', x: 250 + (Math.random() - .5) * 150, y: 410, vx: 0, vy: -30, life: 0, max: 2, r: 12 });
  // упавшая бутылка розжига
  ctx.save(); ctx.translate(410, 590); ctx.rotate(1.35); rr(-16, -50, 32, 60, 8); toon('#3fa9f5', 4); rr(-7, -64, 14, 16, 3); toon('#e63b2e', 3); rr(-12, -30, 24, 16, 3); toon('#ffd23f', 3); ctx.restore();
}
function drawPuddle(it) {
  const k = it.char;
  ell(520, 588, 140, 22); toon(mix('#c9a9e8', '#2a1a12', .2 + k * .6), 4);
  ell(470, 584, 40, 6); ctx.fillStyle = 'rgba(255,255,255,.5)'; ctx.fill();
}
function drawPicnicTable(it) {
  const k = it.char, wood = mix('#c08552', '#1e130d', k * .85), cloth = mix('#ffffff', '#2a1a12', k * .85), check = mix('#e63b2e', '#2a1a12', k * .85);
  rr(660, 500, 16, 105, 5); toon(wood, 4); rr(910, 500, 16, 105, 5); toon(wood, 4);
  ctx.beginPath(); ctx.moveTo(640, 430); ctx.lineTo(950, 430); ctx.lineTo(960, 510); ctx.quadraticCurveTo(800, 530, 630, 510); ctx.closePath(); toon(cloth, 5);
  ctx.save(); ctx.clip(); ctx.fillStyle = check;
  for (let x = 640; x < 960; x += 40) for (let y = 430; y < 530; y += 40) { ctx.globalAlpha = .55; ctx.fillRect(x + ((y / 40) % 2) * 20, y, 20, 20); }
  ctx.restore(); ctx.globalAlpha = 1;
  ctx.beginPath(); ctx.moveTo(640, 430); ctx.lineTo(950, 430); ctx.lineTo(960, 510); ctx.quadraticCurveTo(800, 530, 630, 510); ctx.closePath(); ctx.lineWidth = 5; ctx.strokeStyle = INK; ctx.stroke();
  // кувшин с компотом
  rr(680, 370, 50, 62, 12); toon(mix('#ffb3c7', '#2a1a12', k * .8), 4); rr(690, 384, 30, 30, 6); toon(mix('#e8577a', '#2a1a12', k * .8), 3);
}
function drawUmbrella(it) {
  const k = it.char, a = mix('#ff7b9c', '#1e130d', k * .85), b = mix('#ffffff', '#1e130d', k * .85);
  rr(784, it.safe ? 230 : 300, 12, it.safe ? 205 : 135, 5); toon('#9aa3ad', 4);
  if (it.safe) { // сложенный зонт
    ctx.beginPath(); ctx.moveTo(790, 220); ctx.quadraticCurveTo(820, 300, 806, 380); ctx.lineTo(774, 380); ctx.quadraticCurveTo(760, 300, 790, 220); ctx.closePath(); toon(a, 4);
    rr(772, 340, 36, 10, 4); toon('#ffd23f', 3); return;
  }
  for (let i = 0; i < 6; i++) {
    const x0 = 610 + i * 60, x1 = x0 + 60;
    ctx.beginPath(); ctx.moveTo(790, 255); ctx.lineTo(x0, 335); ctx.quadraticCurveTo((x0 + x1) / 2, 352, x1, 335); ctx.closePath(); toon(i % 2 ? b : a, 4);
  }
  circ(790, 253, 10); toon('#ffd23f', 4);
}
function drawBench(it) {
  const k = it.char, wood = mix('#c08552', '#1e130d', k * .85), dk = mix('#8a5a34', '#1e130d', k * .85);
  for (const x of [1030, 1200]) { rr(x - 8, 470, 16, 135, 5); toon(dk, 4); }
  for (let i = 0; i < 3; i++) { rr(1005, 455 + i * 26, 220, 20, 6); toon(wood, 4); }
  rr(1000, 535, 230, 22, 6); toon(wood, 5);
}
// тарелка с шашлыком
function drawShashlik(G, t) {
  const x = t.x, y = t.y;
  ell(x, y + 10, 48, 13); toon('#ffffff', 4);
  for (let i = 0; i < 3; i++) { ctx.save(); ctx.translate(x - 10 + i * 10, y); ctx.rotate(-.25); ctx.beginPath(); ctx.moveTo(-50, 0); ctx.lineTo(50, 0); ctx.lineWidth = 3; ctx.strokeStyle = INK; ctx.stroke(); for (let k = 0; k < 4; k++) { rr(-30 + k * 15, -9, 14, 18, 5); toon(k % 2 ? '#9c4a2a' : '#c0622f', 3); } ctx.restore(); }
  for (const dx of [-30, 26]) { circ(x + dx, y + 6, 6); toon('#ffffff', 2); circ(x + dx, y + 6, 2.5); ctx.fillStyle = '#7cc243'; ctx.fill(); }
}
