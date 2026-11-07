// ----- уровень 7: балкон -----
function bgBalcony(c) {
  const g = c.createLinearGradient(0, 0, 0, 600); g.addColorStop(0, '#ff8f6b'); g.addColorStop(.55, '#ffc48a'); g.addColorStop(1, '#ffe2b0'); c.fillStyle = g; c.fillRect(0, 0, VW, 620);
  circ(980, 330, 70, c); toon('#ffe066', 5, c);
  const r = rnd(13); for (let x = 260; x < VW; x += 70 + r() * 40) { const h = 120 + r() * 220, w = 60 + r() * 50; rr(x, 480 - h, w, h + 40, 4, c); toon('#8a6aa5', 4, c); c.fillStyle = '#ffe9a8'; for (let wy = 500 - h; wy < 470; wy += 34) for (let wx = x + 10; wx < x + w - 14; wx += 22) if (r() > .45) c.fillRect(wx, wy, 10, 14); }
  // стена дома и дверь
  c.fillStyle = '#c8664a'; c.fillRect(0, 0, 260, 620); c.beginPath(); c.moveTo(260, 0); c.lineTo(260, 620); c.lineWidth = 6; c.strokeStyle = INK; c.stroke();
  c.strokeStyle = '#9c4a33'; c.lineWidth = 3; for (let y = 20; y < 620; y += 32) { c.beginPath(); c.moveTo(0, y); c.lineTo(258, y); c.stroke(); for (let x = (y / 32 % 2) * 30; x < 258; x += 60) { c.beginPath(); c.moveTo(x, y - 32); c.lineTo(x, y); c.stroke(); } }
  rr(60, 170, 170, 440, 8, c); toon('#f4efe6', 6, c); rr(80, 190, 130, 220, 4, c); toon('#bfe8ff', 4, c); rr(80, 430, 130, 160, 4, c); toon('#e9e2d4', 4, c); rr(190, 400, 14, 40, 6, c); toon('#ffd23f', 3, c);
  // верёвка
  c.beginPath(); c.moveTo(270, 220); c.quadraticCurveTo(760, 260, 1270, 220); c.lineWidth = 4; c.strokeStyle = INK; c.stroke();
  // перила
  rr(262, 420, VW - 262, 18, 6, c); toon('#9aa3ad', 5, c);
  rr(262, 470, VW - 262, 150, 4, c); toon('#7fb3d5', 5, c);
  for (let x = 300; x < VW; x += 50) { c.beginPath(); c.moveTo(x, 438); c.lineTo(x, 470); c.lineWidth = 6; c.strokeStyle = INK; c.stroke(); }
  // пол
  c.fillStyle = '#b9b2a8'; c.fillRect(0, 620, VW, 100); c.beginPath(); c.moveTo(0, 620); c.lineTo(VW, 620); c.lineWidth = 6; c.strokeStyle = INK; c.stroke();
  c.strokeStyle = '#9d958a'; c.lineWidth = 3; for (let x = 0; x < VW; x += 120) { c.beginPath(); c.moveTo(x, 620); c.lineTo(x - 40, VH); c.stroke(); }
  // лыжи
  c.save(); c.translate(1220, 620); c.rotate(-.15); rr(-8, -330, 16, 330, 8, c); toon('#e63b2e', 4, c); rr(14, -320, 16, 320, 8, c); toon('#3fa9f5', 4, c); c.restore();
}
function drawLaundry(it) {
  const k = it.char;
  [[380, 236, 90, 110, '#ff7b9c'], [520, 245, 120, 70, '#ffffff'], [690, 247, 80, 130, '#7cc243'], [820, 244, 120, 80, '#3fa9f5'], [990, 236, 90, 100, '#ffd23f']].forEach(([x, y, w, h, col], i) => {
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + w, y); ctx.lineTo(x + w - 6, y + h); ctx.quadraticCurveTo(x + w / 2, y + h + 10, x + 6, y + h); ctx.closePath(); toon(mix(col, '#2a1a12', k * .85), 4);
    rr(x + 8, y - 8, 10, 18, 3); toon('#c08552', 2); rr(x + w - 18, y - 8, 10, 18, 3); toon('#c08552', 2);
  });
}
function drawBoxes(it) {
  const k = it.char, b = mix('#d9a066', '#2a1a12', k * .85), b2 = mix('#c8905a', '#2a1a12', k * .85);
  rr(470, 540, 150, 110, 6); toon(b, 5); rr(600, 560, 120, 90, 6); toon(b2, 5); rr(520, 460, 120, 84, 6); toon(b2, 5);
  ctx.strokeStyle = mix('#8a5a34', '#2a1a12', k * .7); ctx.lineWidth = 3; for (const [x, y, w] of [[470, 580, 150], [600, 595, 120], [520, 495, 120]]) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + w, y); ctx.stroke(); }
  // газеты
  ctx.save(); ctx.translate(560, 450); ctx.rotate(-.12); rr(-30, -14, 70, 16, 3); toon(mix('#f4efe6', '#2a1a12', k * .85), 3); ctx.restore();
}
function drawChair(it) {
  const k = it.char, w = mix('#a86b3c', '#1e130d', k * .85);
  rr(900, 400, 20, 250, 6); toon(w, 5); rr(1020, 400, 20, 250, 6); toon(w, 5);
  rr(895, 420, 150, 18, 6); toon(w, 4); rr(895, 470, 150, 18, 6); toon(w, 4);
  rr(880, 540, 180, 26, 8); toon(mix('#c08552', '#1e130d', k * .85), 5);
  rr(895, 566, 16, 84, 5); toon(w, 4); rr(1030, 566, 16, 84, 5); toon(w, 4);
}
function drawCan(G) {
  const c = G.can; if (!c || c.gone) return;
  ctx.save(); ctx.translate(c.x, c.y);
  if (c.heat > .05) { circ(0, -30, 40 + c.heat * 30); ctx.fillStyle = `rgba(255,60,30,${c.heat * .45})`; ctx.fill(); }
  const sh = c.heat > .6 ? (Math.random() - .5) * 6 * c.heat : 0; ctx.translate(sh, 0);
  rr(-17, -62, 34, 62, 8); toon(mix('#ffd23f', '#ff3b2e', c.heat), 4);
  rr(-17, -46, 34, 18, 2); toon('#e63b2e', 3);
  rr(-8, -74, 16, 14, 4); toon('#ffffff', 3); rr(-4, -82, 8, 9, 2); toon('#9aa3ad', 2);
  ctx.restore();
  if (!c.safe) { const t = (time * 2) % 1; ctx.save(); ctx.globalAlpha = 1 - t; circ(c.x, c.y - 30, 40 + t * 30); ctx.lineWidth = 4; ctx.strokeStyle = '#ffffff'; ctx.stroke(); ctx.restore(); }
}


// гнездо с птенцами на перилах
function drawNest(G, t) {
  const x = t.x, y = t.y, scared = t.burn > 0 || t.state === 'flying';
  for (const [dx, op] of [[-14, 0], [0, 1], [14, 2]]) {
    const hop = scared ? Math.abs(Math.sin(time * 16 + op)) * 8 : 0, hy = y - 10 - hop;
    circ(x + dx, hy, 11); toon('#bfc6cf', 4);
    ctx.beginPath(); ctx.moveTo(x + dx - 5, hy - 2); ctx.lineTo(x + dx, hy - (scared ? 18 : 10)); ctx.lineTo(x + dx + 5, hy - 2); ctx.closePath(); toon('#ffb13b', 3);
    circ(x + dx - 4, hy - 4, 2); ctx.fillStyle = INK; ctx.fill(); circ(x + dx + 4, hy - 4, 2); ctx.fill();
  }
  ell(x, y + 6, 36, 14); toon('#a8763e', 5);
  ctx.lineWidth = 3; ctx.strokeStyle = '#6e4a22';
  for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.moveTo(x - 30 + i * 4, y + 2 + i); ctx.lineTo(x + 30 + i * 3, y + 10 - i); ctx.stroke(); }
}
