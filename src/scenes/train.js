// ----- транспорт, уровень 5: коридор вагона, урна у тамбура -----
function bgTrain(c) {
  c.fillStyle = '#efe0c2'; c.fillRect(0, 0, VW, 560);
  rr(-10, 100, VW + 20, 18, 4, c); toon('#c98a4f', 4, c);
  rr(-10, 470, VW + 20, 20, 4, c); toon('#c98a4f', 4, c);
  // пол с дорожкой
  c.fillStyle = '#8a7a6a'; c.fillRect(0, 560, VW, VH - 560); c.beginPath(); c.moveTo(0, 560); c.lineTo(VW, 560); c.lineWidth = 6; c.strokeStyle = INK; c.stroke();
  c.beginPath(); c.moveTo(0, 590); c.lineTo(VW, 590); c.lineTo(VW, 690); c.lineTo(0, 690); c.closePath(); toon('#c8434f', 4, c);
  c.strokeStyle = '#ffd23f'; c.lineWidth = 4; for (const y of [604, 676]) { c.beginPath(); c.moveTo(0, y); c.lineTo(VW, y); c.stroke(); }
  // дверь в тамбур
  rr(40, 140, 200, 420, 8, c); toon('#9aa3ad', 5, c); rr(70, 170, 140, 170, 6, c); toon('#bfe8ff', 4, c); rr(190, 360, 30, 12, 5, c); toon('#5a5f66', 3, c);
  rr(80, 112, 120, 24, 5, c); toon('#ffffff', 3, c); tex(c, 140, 125, 'ТАМБУР', 15, INK);
  // рама большого окна
  rr(300, 216, 640, 250, 14, c); toon('#ffffff', 7, c);
  // стоп-кран
  rr(990, 210, 90, 34, 6, c); toon('#e63b2e', 4, c); tex(c, 1035, 228, 'СТОП-КРАН', 12, '#ffffff');
  // дверь служебного купе проводника
  rr(1100, 140, 160, 420, 8, c); toon('#c98a4f', 5, c); rr(1124, 168, 112, 110, 6, c); toon('#ffe9a8', 4, c);
  rr(1120, 296, 120, 26, 5, c); toon('#3f7bf5', 3, c); tex(c, 1180, 309, 'ПРОВОДНИК', 13, '#ffffff'); rr(1112, 380, 14, 40, 5, c); toon('#5a5f66', 3, c);
}
// вид за окном: сначала мост над рекой, потом поле. Едет, пока не сорвали стоп-кран
function trainBack(G) {
  const x0 = 316, y0 = 232, w = 608, h = 218, off = G.trainX || 0, bridge = off < 1800;
  ctx.save(); rr(x0, y0, w, h, 4); ctx.clip();
  const g = ctx.createLinearGradient(0, y0, 0, y0 + h); g.addColorStop(0, '#7fd0f5'); g.addColorStop(1, '#e8f8ff'); ctx.fillStyle = g; ctx.fillRect(x0, y0, w, h);
  cloud(ctx, x0 + 120 - (off * .05) % 300 + 300, y0 + 50, .5);
  if (bridge) {
    ctx.fillStyle = '#3fa9f5'; ctx.fillRect(x0, y0 + 130, w, h); ctx.strokeStyle = '#bfe8ff'; ctx.lineWidth = 4;
    for (let i = 0; i < 6; i++) { const x = x0 + ((i * 130 - off * .3) % 780 + 780) % 780 - 40; ctx.beginPath(); ctx.arc(x, y0 + 170 + (i % 2) * 24, 14, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke(); }
    // фермы моста пролетают мимо
    for (let i = 0; i < 6; i++) { const x = x0 + ((i * 140 - off) % 840 + 840) % 840 - 60; ctx.beginPath(); ctx.moveTo(x, y0 + h); ctx.lineTo(x + 70, y0 + 10); ctx.lineTo(x + 140, y0 + h); ctx.lineWidth = 16; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 9; ctx.strokeStyle = '#7a8290'; ctx.stroke(); }
    ctx.lineWidth = 14; ctx.strokeStyle = INK; ctx.beginPath(); ctx.moveTo(x0, y0 + 14); ctx.lineTo(x0 + w, y0 + 14); ctx.stroke(); ctx.lineWidth = 8; ctx.strokeStyle = '#7a8290'; ctx.stroke();
  } else {
    ctx.beginPath(); ctx.moveTo(x0, y0 + 120); ctx.lineTo(x0 + w, y0 + 110); ctx.lineTo(x0 + w, y0 + h); ctx.lineTo(x0, y0 + h); ctx.closePath(); toon('#9bd65a', 4);
    for (let i = 0; i < 5; i++) { const x = x0 + ((i * 170 - off * .6) % 850 + 850) % 850 - 50; spruce(ctx, x, y0 + 150, .55, '#3f8a4f'); }
    for (let i = 0; i < 3; i++) { const x = x0 + ((i * 300 - off) % 900 + 900) % 900 - 40; rr(x, y0 + 30, 10, 190, 3); toon('#7a8290', 3); }
  }
  ctx.restore();
  // стоп-кран: ручка
  const pulled = G.flags.stopT != null;
  ctx.save(); ctx.translate(1035, 280); ctx.rotate(pulled ? .9 : 0); rr(-8, -4, 16, 50, 6); toon('#e63b2e', 4); circ(0, 50, 14); toon('#e63b2e', 4); ctx.restore();
  circ(1035, 280, 10); toon('#9aa3ad', 3);
  // проводник выглядывает и бежит с огнетушителем
  const cd = G.cond;
  if (cd) {
    const k = Math.min(1, (G.time - cd.t) / 2.4), x = 1180 - k * 650, y = 470;
    rr(x - 34, y - 70, 68, 90, 14); toon('#2f5aa8', 4); circ(x, y - 96, 26); toon('#ffcc99', 4);
    rr(x - 30, y - 128, 60, 16, 5); toon('#2f5aa8', 4); rr(x - 34, y - 116, 68, 8, 4); toon(INK, 2);
    rr(x - 60, y - 50, 22, 44, 7); toon('#e63b2e', 3);
    for (const s of [-1, 1]) { rr(x + s * 16 - 9, y + 20, 18, 56, 6); toon('#2a1a12', 3); }
  }
}
function drawTrainBin(it, G) {
  const k = it.char;
  rr(96, 440, 128, 120, 10); toon(mix('#9aa3ad', '#1e130d', k * .7), 5);
  rr(88, 426, 144, 20, 6); toon(mix('#7a8290', '#1e130d', k * .7), 4);
  for (const x of [124, 160, 196]) { ctx.beginPath(); ctx.moveTo(x, 466); ctx.lineTo(x, 540); ctx.lineWidth = 4; ctx.strokeStyle = mix('#7a8290', INK, .4); ctx.stroke(); }
}
function drawTrainCurtain(it) {
  const k = it.char, col = mix('#3f8a4f', '#1e130d', k * .85);
  ctx.beginPath(); ctx.moveTo(300, 210); ctx.lineTo(420, 210); ctx.quadraticCurveTo(380, 330, 400, 470); ctx.lineTo(300, 470); ctx.closePath(); toon(col, 5);
  ctx.strokeStyle = mix('#ffd23f', '#1e130d', k * .85); ctx.lineWidth = 4; for (const x of [325, 350, 375]) { ctx.beginPath(); ctx.moveTo(x, 214); ctx.quadraticCurveTo(x - 6, 340, x, 466); ctx.stroke(); }
  rr(290, 200, 140, 16, 6); toon('#c98a4f', 4);
}
function drawTrainBags(it) {
  const k = it.char;
  rr(560, 448, 120, 110, 12); toon(mix('#e63b2e', '#1e130d', k * .85), 5); rr(600, 430, 40, 20, 6); toon(INK, 2);
  rr(690, 476, 80, 82, 10); toon(mix('#ffd23f', '#1e130d', k * .85), 5); rr(712, 460, 36, 18, 6); toon(INK, 2);
  ctx.beginPath(); ctx.moveTo(570, 500); ctx.lineTo(670, 500); ctx.moveTo(700, 516); ctx.lineTo(760, 516); ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.stroke();
}
function drawGuitar(G, t) {
  const x = t.x, y = t.y;
  ctx.save(); ctx.translate(x, y); ctx.rotate(.18);
  rr(-6, -130, 12, 110, 4); toon('#7a4a2a', 3); rr(-10, -150, 20, 26, 5); toon('#5a3a22', 3);
  circ(0, 10, 34); toon('#e8a04a', 4); circ(0, -30, 26); toon('#e8a04a', 4); ctx.beginPath(); ctx.rect(-24, -32, 48, 40); ctx.fillStyle = '#e8a04a'; ctx.fill();
  circ(0, -4, 10); ctx.fillStyle = INK; ctx.fill(); rr(-14, 22, 28, 6, 3); toon('#5a3a22', 2);
  ctx.restore();
}
