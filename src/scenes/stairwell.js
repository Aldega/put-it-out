// ----- город, уровень 4: подъезд -----
function bgStairwell(c) {
  c.fillStyle = '#eef0e2'; c.fillRect(0, 0, VW, 330);
  c.fillStyle = '#7fb88a'; c.fillRect(0, 330, VW, 270);
  c.beginPath(); c.moveTo(0, 330); c.lineTo(VW, 330); c.lineWidth = 6; c.strokeStyle = '#4f8f6a'; c.stroke();
  // пол плиткой
  c.fillStyle = '#c9805a'; c.fillRect(0, 600, VW, 120);
  for (let y = 600, row = 0; y < VH; y += 30, row++) for (let x = (row % 2) * 30; x < VW; x += 60) { c.fillStyle = '#e8c49a'; c.fillRect(x, y, 30, 30); }
  c.beginPath(); c.moveTo(0, 600); c.lineTo(VW, 600); c.lineWidth = 6; c.strokeStyle = INK; c.stroke();
  // лампочка
  c.beginPath(); c.moveTo(500, 0); c.lineTo(500, 70); c.lineWidth = 4; c.strokeStyle = INK; c.stroke(); circ(500, 86, 18, c); toon('#fff3b0', 4, c);
  // лестница наверх
  c.beginPath(); c.moveTo(1000, 600); for (let i = 0; i < 10; i++) { const x = 1000 + i * 30, y = 600 - i * 28; c.lineTo(x, y - 28); c.lineTo(x + 30, y - 28); } c.lineTo(1290, 320); c.lineTo(1290, 600); c.closePath(); toon('#b8b0a2', 5, c);
  c.beginPath(); c.moveTo(1000, 540); c.lineTo(1290, 270); c.lineWidth = 8; c.strokeStyle = INK; c.stroke(); c.lineWidth = 4; c.strokeStyle = '#c08552'; c.stroke();
  for (let i = 0; i < 6; i++) { const x = 1015 + i * 50; c.beginPath(); c.moveTo(x, 540 - (x - 1000) * .93); c.lineTo(x, 600 - (x - 1000) * .93 - 4); c.lineWidth = 4; c.strokeStyle = INK; c.stroke(); }
  // лифт
  rr(770, 240, 200, 340, 6, c); toon('#9aa3ad', 6, c);
  rr(800, 270, 140, 300, 3, c); toon('#c9d1da', 4, c); c.beginPath(); c.moveTo(870, 270); c.lineTo(870, 570); c.lineWidth = 4; c.strokeStyle = INK; c.stroke();
  rr(835, 205, 70, 28, 5, c); toon('#2f3540', 4, c);
  // объявление
  c.save(); c.translate(380, 210); c.rotate(-.05); rr(-60, -50, 120, 90, 4, c); toon('#ffffff', 4, c); tex(c, 0, -26, 'ВНИМАНИЕ!', 15, '#e63b2e'); for (let i = 0; i < 3; i++) { rr(-44, -8 + i * 14, 88, 5, 2, c); c.fillStyle = '#9aa3ad'; c.fill(); } c.restore();
}
function stairBack(G) {
  // кнопка вызова лифта
  rr(985, 400, 34, 56, 6); toon('#5a5f66', 4); circ(1002, 428, 10); toon(G.flags.lift ? '#ffd23f' : '#ffffff', 3);
  // открытый лифт тянет дым
  if (G.flags.lift) {
    rr(800, 270, 140, 300, 3); toon('#3a3a3a', 4);
    if (Math.random() < .5) G.parts.push({ k: 'smoke', x: 820 + Math.random() * 100, y: 560 - Math.random() * 200, vx: 0, vy: -120, life: 0, max: 1.6, r: 16 });
  }
  tex(ctx, 870, 219, G.flags.lift ? '1' : '5', 18, '#ff5a3a');
  // пожарный кран
  const open = G.flags.hose;
  rr(190, 458, 120, 120, 6); toon('#e63b2e', 5);
  if (!open) { rr(200, 468, 100, 100, 3); toon('#ff6a50', 3); tex(ctx, 250, 500, 'ПК', 30, '#ffffff'); rr(232, 530, 36, 10, 4); toon('#ffffff', 2); }
  else {
    rr(200, 468, 100, 100, 3); toon('#5a2a20', 3); circ(250, 520, 34); toon('#d9d4c8', 4); circ(250, 520, 14); toon('#9aa3ad', 3);
    ctx.save(); ctx.translate(190, 458); ctx.transform(1, 0, -.4, 1, 0, 0); rr(-70, 0, 70, 120, 4); toon('#ff6a50', 4); ctx.restore();
  }
}
function stairFront(G) {
  if (!G.flags.hose) return;
  // рукав от крана к коляске и струя
  ctx.beginPath(); ctx.moveTo(280, 540); ctx.bezierCurveTo(330, 620, 330, 560, 350, 500); ctx.lineWidth = 12; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 6; ctx.strokeStyle = '#f0ead8'; ctx.stroke();
  rr(342, 478, 16, 30, 4); toon('#ffd23f', 3);
  if (G.byId.stroller.fire > 0 || G.time - (G.flags.hoseT || 0) < 2) {
    ctx.beginPath(); ctx.moveTo(352, 482); ctx.quadraticCurveTo(410, 400, 480, 452); ctx.lineWidth = 14; ctx.strokeStyle = 'rgba(63,169,245,.8)'; ctx.stroke(); ctx.lineWidth = 5; ctx.strokeStyle = 'rgba(255,255,255,.8)'; ctx.stroke();
    if (Math.random() < .5) G.parts.push({ k: 'drop', x: 480 + (Math.random() - .5) * 40, y: 452, vx: (Math.random() - .5) * 120, vy: -60 - Math.random() * 80, life: 0, max: .6, color: '#3fa9f5', r: 5 });
  }
}
function drawMailboxes(it) {
  const k = it.char;
  rr(70, 230, 230, 192, 6); toon(mix('#5a7fa8', '#1e130d', k * .85), 5);
  for (let r = 0; r < 4; r++) for (let i = 0; i < 4; i++) {
    const x = 80 + i * 54, y = 240 + r * 45;
    rr(x, y, 48, 38, 3); toon(mix('#7fa3c8', '#1e130d', k * .85), 3);
    rr(x + 8, y + 8, 32, 6, 2); ctx.fillStyle = INK; ctx.fill();
    if (k < .5 && (r + i) % 3 === 0) { rr(x + 10, y - 4, 24, 14, 2); toon('#ffffff', 2); } // газеты торчат
  }
}
function drawStroller(it) {
  const k = it.char, col = mix('#b98ad9', '#1e130d', k * .85);
  for (const x of [415, 540]) { circ(x, 570, 24); toon('#3a3a3a', 5); circ(x, 570, 8); toon('#bbbbbb', 3); }
  ctx.beginPath(); ctx.moveTo(400, 460); ctx.lineTo(560, 460); ctx.quadraticCurveTo(570, 545, 480, 548); ctx.quadraticCurveTo(395, 545, 400, 460); ctx.closePath(); toon(col, 5);
  ctx.beginPath(); ctx.moveTo(400, 462); ctx.quadraticCurveTo(400, 390, 470, 386); ctx.lineTo(470, 462); ctx.closePath(); toon(mix('#8a5ab0', '#1e130d', k * .85), 5);
  ctx.beginPath(); ctx.moveTo(560, 470); ctx.lineTo(600, 410); ctx.lineWidth = 8; ctx.strokeStyle = INK; ctx.stroke(); rr(590, 400, 36, 12, 5); toon('#2f3540', 3);
}
function drawFlatDoor(it) {
  const k = it.char, w = mix('#a86b3c', '#1e130d', k * .85);
  rr(590, 262, 125, 338, 4); toon(w, 6);
  for (const y of [290, 430]) { rr(606, y, 93, 120, 4); ctx.lineWidth = 4; ctx.strokeStyle = mix('#7a4a2a', '#1e130d', k * .85); ctx.stroke(); }
  circ(698, 440, 8); toon('#ffd23f', 3); circ(652, 280, 5); toon('#2f3540', 2);
  rr(625, 310, 56, 30, 4); toon('#ffffff', 3); tex(ctx, 653, 326, '12', 20, INK);
  // коврик
  rr(580, 594, 145, 10, 4); toon(mix('#7cc243', '#1e130d', k * .85), 3);
}
function drawGranny(G, t) {
  const x = t.x, y = t.y, scared = t.burn > 0 || t.state === 'flying', b = scared ? Math.abs(Math.sin(time * 10)) * 4 : 0;
  ctx.save(); ctx.translate(0, -b);
  // пальто и ноги
  rr(x - 14, y + 40, 10, 34, 4); toon('#5a5f66', 3); rr(x + 6, y + 40, 10, 34, 4); toon('#5a5f66', 3);
  ctx.beginPath(); ctx.moveTo(x - 30, y + 46); ctx.lineTo(x - 22, y - 20); ctx.lineTo(x + 24, y - 20); ctx.lineTo(x + 32, y + 46); ctx.closePath(); toon('#7a5aa8', 4);
  // палочка
  ctx.beginPath(); ctx.moveTo(x + 34, y + 76); ctx.lineTo(x + 30, y + 4); ctx.quadraticCurveTo(x + 30, y - 6, x + 22, y - 4); ctx.lineWidth = 5; ctx.strokeStyle = INK; ctx.stroke();
  // голова в платочке
  circ(x, y - 40, 22); toon('#f4cfa8', 4);
  ctx.beginPath(); ctx.arc(x, y - 44, 26, Math.PI, 0); ctx.quadraticCurveTo(x, y - 54, x - 26, y - 44); ctx.closePath(); toon('#e63b2e', 4);
  ctx.beginPath(); ctx.moveTo(x - 24, y - 42); ctx.quadraticCurveTo(x - 26, y - 16, x - 6, y - 14); ctx.moveTo(x + 24, y - 42); ctx.quadraticCurveTo(x + 26, y - 16, x + 6, y - 14); ctx.lineWidth = 6; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 3; ctx.strokeStyle = '#e63b2e'; ctx.stroke();
    ctx.lineWidth = 3; ctx.strokeStyle = INK;
  for (const s of [-1, 1]) { circ(x + s * 8, y - 38, 6); ctx.stroke(); } // очки
  if (scared) { ell(x, y - 26, 5, 6); ctx.fillStyle = INK; ctx.fill(); } else { ctx.beginPath(); ctx.arc(x, y - 30, 6, .2, Math.PI - .2); ctx.stroke(); }
  // кот в корзинке
  rr(x - 54, y + 6, 36, 26, 6); toon('#d9a066', 3); circ(x - 36, y + 2, 10); toon('#9aa3ad', 3);
  ctx.restore();
}
