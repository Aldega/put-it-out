// ----- дача, уровень 3: баня -----
function bgBanya(c) {
  logWall(c, 0, 0, VW, 600, '#dba66c', 46);
  // окошко
  rr(560, 110, 150, 110, 8, c); toon('#c98a4f', 6, c); rr(576, 126, 118, 78, 4, c); toon('#cfeeff', 4, c);
  c.fillStyle = 'rgba(255,255,255,.6)'; circ(610, 160, 20, c); c.fill(); circ(650, 150, 24, c); c.fill();
  // дверь
  rr(30, 190, 190, 410, 8, c); toon('#a86b3c', 6, c);
  for (let x = 50; x < 210; x += 38) { c.beginPath(); c.moveTo(x, 200); c.lineTo(x, 595); c.lineWidth = 3; c.strokeStyle = '#7a4a2a'; c.stroke(); }
  rr(45, 280, 160, 20, 6, c); toon('#8a5a34', 4, c); rr(45, 480, 160, 20, 6, c); toon('#8a5a34', 4, c);
  rr(180, 380, 18, 50, 8, c); toon('#5a5f66', 4, c);
  // пол
  planks(c, 600, '#b98250', '#8a5a34', 30, 160);
  // труба печки
  rr(292, 0, 40, 300, 4, c); toon('#4a4f56', 5, c);
  // печка-каменка
  rr(220, 360, 185, 245, 10, c); toon('#5a5f66', 6, c);
  rr(230, 370, 165, 18, 4, c); toon('#6e747c', 4, c);
  // камни
  const r = rnd(17); for (let i = 0; i < 16; i++) { const x = 235 + (i % 6) * 30 + r() * 8, y = 355 - Math.floor(i / 6) * 22 - r() * 6; ell(x, y, 20, 15, c); toon(mix('#9aa3ad', '#6e6e6e', r()), 4, c); }
  // кадка с ковшом
  c.beginPath(); c.moveTo(430, 520); c.lineTo(530, 520); c.lineTo(520, 600); c.lineTo(440, 600); c.closePath(); toon('#c98a4f', 5, c);
  for (const y of [540, 580]) { c.beginPath(); c.moveTo(434, y); c.lineTo(526, y); c.lineWidth = 5; c.strokeStyle = '#5a5f66'; c.stroke(); }
  ell(480, 520, 50, 10, c); toon('#5ec3f2', 4, c);
  c.save(); c.translate(500, 505); c.rotate(-.5); rr(-6, -60, 12, 60, 5, c); toon('#a86b3c', 4, c); c.restore(); ell(490, 515, 18, 8, c); toon('#a86b3c', 4, c);
  // термометр
  rr(1150, 90, 40, 130, 18, c); toon('#ffffff', 4, c); rr(1164, 110, 12, 90, 6, c); toon('#ffe0e0', 3, c); rr(1164, 140, 12, 60, 6, c); toon('#e63b2e', 3, c);
}
// дверца печки: открыта, внутри огонь
function banyaStove(G) {
  if (G.flags.stoveOpen) {
    rr(255, 465, 115, 90, 6); toon('#2a1a12', 5);
    for (let i = 0; i < 3; i++) tongue(282 + i * 30, 548, 50 + 8 * Math.sin(time * 9 + i), 34, 5 * Math.sin(time * 7 + i), FIRE_COLS);
    ctx.save(); ctx.translate(255, 465); ctx.rotate(-.15); rr(-110, 0, 110, 90, 6); toon('#6e747c', 5); rr(-90, 30, 30, 12, 5); toon('#2a1a12', 3); ctx.restore();
    if (Math.random() < .05) G.parts.push({ k: 'ember', x: 320, y: 540, vx: 60 + Math.random() * 80, vy: -40, life: 0, max: .8, r: 4 });
  } else {
    rr(255, 465, 115, 90, 6); toon('#6e747c', 5); rr(275, 500, 30, 12, 5); toon('#2a1a12', 3);
    for (let i = 0; i < 3; i++) { rr(320 + i * 14, 480, 6, 60, 3); ctx.fillStyle = '#2a1a12'; ctx.fill(); }
  }
  if (G.flags.steamT != null && G.time - G.flags.steamT < 2.5) { const k = (G.time - G.flags.steamT) / 2.5; ctx.fillStyle = `rgba(255,255,255,${.6 * (1 - k)})`; ctx.fillRect(0, 0, VW, VH); }
}
function drawBanyaFloor(it) {
  const k = it.char;
  rr(380, 600, 280, 34, 6); toon(mix('#b98250', '#1e130d', .1 + k * .8), 5);
  for (let x = 420; x < 660; x += 50) { ctx.beginPath(); ctx.moveTo(x, 602); ctx.lineTo(x, 632); ctx.lineWidth = 3; ctx.strokeStyle = mix('#8a5a34', '#1e130d', k * .8); ctx.stroke(); }
  // выпавшие угольки
  for (const [x, y] of [[420, 610], [470, 620], [560, 612]]) { circ(x, y, 8); toon(it.fire > 0 ? '#ff7a2e' : '#3a3a3a', 3); }
}
function drawPolok(it) {
  const k = it.char, w = mix('#e8c48c', '#1e130d', k * .85), d = mix('#c99a5e', '#1e130d', k * .85);
  // верхний полок
  rr(830, 330, 420, 30, 6); toon(w, 5); rr(840, 360, 400, 110, 4); toon(d, 5);
  for (let x = 880; x < 1240; x += 60) { ctx.beginPath(); ctx.moveTo(x, 362); ctx.lineTo(x, 468); ctx.lineWidth = 3; ctx.strokeStyle = mix('#a8763e', '#1e130d', k * .85); ctx.stroke(); }
  // нижний полок
  rr(700, 470, 560, 30, 6); toon(w, 5); rr(710, 500, 540, 100, 4); toon(d, 5);
  for (let x = 760; x < 1240; x += 60) { ctx.beginPath(); ctx.moveTo(x, 502); ctx.lineTo(x, 598); ctx.lineWidth = 3; ctx.strokeStyle = mix('#a8763e', '#1e130d', k * .85); ctx.stroke(); }
}
function drawBrooms(it) {
  const k = it.char;
  ctx.beginPath(); ctx.moveTo(470, 240); ctx.lineTo(660, 240); ctx.lineWidth = 6; ctx.strokeStyle = INK; ctx.stroke();
  for (const x of [510, 590]) {
    ctx.beginPath(); ctx.moveTo(x, 240); ctx.lineTo(x, 270); ctx.lineWidth = 4; ctx.stroke();
    rr(x - 8, 262, 16, 40, 5); toon(mix('#a86b3c', '#1e130d', k * .85), 4);
    ctx.beginPath(); ctx.moveTo(x - 10, 300); ctx.quadraticCurveTo(x - 55, 360, x - 30, 420); ctx.quadraticCurveTo(x, 440, x + 30, 420); ctx.quadraticCurveTo(x + 55, 360, x + 10, 300); ctx.closePath(); toon(mix('#7cc243', '#2a1a12', .15 + k * .75), 4);
    ctx.fillStyle = mix('#5aa832', '#1e130d', k * .85); for (const [dx, dy] of [[-15, 340], [12, 360], [-5, 395], [20, 400], [-25, 380]]) { ell(x + dx, dy, 9, 5, ctx, .6); ctx.fill(); }
  }
}
// дед на верхнем полке
function drawGrandpa(G, t) {
  const x = t.x, y = t.y, scared = t.burn > 0 || t.state === 'flying', j = scared ? Math.abs(Math.sin(time * 14)) * 8 : 0;
  ell(x, y + 10, 46, 40); toon('#ffc3a0', 5);
  rr(x - 48, y + 20, 96, 34, 12); toon('#ffffff', 4);
  ctx.strokeStyle = '#3fa9f5'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x - 44, y + 32); ctx.lineTo(x + 44, y + 32); ctx.stroke();
  circ(x, y - 42, 30); toon('#ffc3a0', 5);
  // борода
  ctx.beginPath(); ctx.moveTo(x - 24, y - 36); ctx.quadraticCurveTo(x, y + 10, x + 24, y - 36); ctx.quadraticCurveTo(x, y - 22, x - 24, y - 36); ctx.closePath(); toon('#ffffff', 4);
  // банная шапка
  ctx.beginPath(); ctx.moveTo(x - 36, y - 56 - j); ctx.quadraticCurveTo(x, y - 110 - j, x + 36, y - 56 - j); ctx.closePath(); toon('#e8d2a6', 4);
  ctx.lineWidth = 3.5; ctx.strokeStyle = INK;
  if (scared) { for (const s of [-1, 1]) { circ(x + s * 11, y - 46, 6); toon('#fff', 3); circ(x + s * 11, y - 46, 2.5); ctx.fillStyle = INK; ctx.fill(); } }
  else { for (const s of [-1, 1]) { ctx.beginPath(); ctx.arc(x + s * 11, y - 46, 5, .2, Math.PI - .2); ctx.stroke(); } const z = (time * .6) % 1; ctx.globalAlpha = 1 - z; tex(ctx, x + 40 + z * 20, y - 80 - z * 40, 'Хр', 20 + z * 8, '#ffffff'); ctx.globalAlpha = 1; }
  circ(x, y - 34, 6); toon('#ff9e8a', 3);
}
