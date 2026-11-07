// ----- город, уровень 6: самокат на зарядке в прихожей -----
function bgHallway(c) {
  c.fillStyle = '#ffe3b8'; c.fillRect(0, 0, VW, 600);
  for (let x = 0; x < VW; x += 60) { c.fillStyle = '#f7d29e'; c.fillRect(x, 0, 24, 600); }
  // ромбики на обоях
  c.fillStyle = '#f0c486'; for (let x = 42, i = 0; x < VW; x += 60, i++) for (let y = 30 + (i % 2) * 40; y < 600; y += 80) { c.beginPath(); c.moveTo(x, y - 8); c.lineTo(x + 6, y); c.lineTo(x, y + 8); c.lineTo(x - 6, y); c.closePath(); c.fill(); }
  // входная дверь
  rr(1060, 150, 180, 450, 6, c); toon('#8a5a34', 6, c);
  rr(1080, 175, 140, 400, 4, c); c.lineWidth = 4; c.strokeStyle = '#6e4422'; c.stroke();
  circ(1086, 380, 10, c); toon('#ffd23f', 3, c); circ(1150, 230, 7, c); toon('#2f3540', 3, c);
  // плинтус и пол
  rr(0, 590, VW, 14, 3, c); toon('#ffffff', 4, c);
  planks(c, 604, '#c08552', '#9c6a3a', 29, 240);
  // коврик у двери
  rr(1050, 640, 200, 40, 10, c); toon('#3f7bf5', 4, c);
  // зеркало
  ell(560, 170, 70, 95, c); toon('#9aa3ad', 6, c); ell(560, 170, 56, 80, c); toon('#dff3ff', 4, c);
  c.strokeStyle = 'rgba(255,255,255,.9)'; c.lineWidth = 6; c.beginPath(); c.moveTo(530, 130); c.lineTo(560, 100); c.stroke();
  // крючок для клетки
  rr(186, 60, 28, 14, 4, c); toon('#5a5f66', 3, c);
}
function hallBack(G) {
  // розетка и шнур зарядки
  socket(ctx, 760, 460);
  if (G.flags.plugged) {
    cord(648, 532, 740, 600, 0); rr(700, 570, 50, 30, 6); toon('#2f3540', 4); circ(738, 585, 4); ctx.fillStyle = '#ff5a3a'; ctx.fill();
    cord(725, 570, 755, 470, -40); plugAt(760, 460);
  } else { cord(648, 532, 700, 590, 10); rr(690, 575, 50, 28, 6); toon('#2f3540', 4); plugAt(820, 560); cord(740, 585, 808, 560, 10); }
}
function drawScooter(it, G) {
  const k = it.char, col = mix('#2f3540', '#1e130d', k * .5), acc = mix('#7cc243', '#1e130d', k * .85);
  // руль и стойка
  ctx.beginPath(); ctx.moveTo(430, 560); ctx.lineTo(450, 310); ctx.lineWidth = 16; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 9; ctx.strokeStyle = col; ctx.stroke();
  rr(410, 296, 90, 18, 8); toon(col, 4); rr(404, 296, 24, 18, 8); toon('#3a3a3a', 3); rr(482, 296, 24, 18, 8); toon('#3a3a3a', 3);
  rr(440, 330, 26, 20, 4); toon('#bfe8ff', 3);
  // дека с батареей
  rr(420, 520, 230, 32, 10); toon(col, 5);
  rr(440, 526, 190, 20, 6); toon(acc, 3);
  // индикатор нагрева батареи
  const h = Math.max(0, Math.min(1, G.bat));
  if (h > 0) { for (let i = 0; i < 5; i++) { rr(456 + i * 34, 530, 26, 12, 3); ctx.fillStyle = i < Math.ceil(h * 5) ? mix('#ffd23f', '#e63b2e', i / 4) : '#3a3a3a'; ctx.fill(); } }
  // колёса
  for (const x of [430, 640]) { circ(x, 562, 30); toon('#3a3a3a', 5); circ(x, 562, 11); toon('#bbbbbb', 3); }
  // треск батареи
  if (G.bat > 0 && it.fire === 0 && Math.random() < .06 * G.bat) for (let i = 0; i < 4; i++) G.parts.push({ k: 'spark', x: 450 + Math.random() * 170, y: 530, vx: (Math.random() - .5) * 200, vy: -100 - Math.random() * 200, life: 0, max: .4 });
}
function drawCoats(it) {
  const k = it.char;
  rr(790, 150, 230, 20, 5); toon(mix('#a86b3c', '#1e130d', k * .85), 4);
  for (const x of [830, 905, 980]) { circ(x, 172, 7); toon('#5a5f66', 3); }
  // куртки
  [[830, '#e63b2e', 410], [905, '#3fa9f5', 380], [980, '#ffd23f', 420]].forEach(([x, col, bot]) => {
    const cc = mix(col, '#1e130d', k * .85);
    ctx.beginPath(); ctx.moveTo(x - 10, 175); ctx.lineTo(x - 40, 200); ctx.lineTo(x - 44, bot); ctx.lineTo(x + 44, bot); ctx.lineTo(x + 40, 200); ctx.lineTo(x + 10, 175); ctx.closePath(); toon(cc, 4);
    ctx.beginPath(); ctx.moveTo(x, 190); ctx.lineTo(x, bot); ctx.lineWidth = 3; ctx.strokeStyle = INK; ctx.stroke();
    rr(x - 38, bot - 70, 22, 18, 4); toon(mix(col, '#2a1a12', .3 + k * .6), 3);
  });
  // шарф
  ctx.beginPath(); ctx.moveTo(870, 175); ctx.quadraticCurveTo(880, 260, 862, 330); ctx.lineWidth = 16; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 10; ctx.strokeStyle = mix('#7cc243', '#1e130d', k * .85); ctx.stroke();
}
function drawShoeRack(it) {
  const k = it.char, w = mix('#ffffff', '#1e130d', k * .85);
  rr(90, 470, 245, 125, 6); toon(w, 5);
  rr(100, 530, 225, 8, 3); toon(mix('#c9d1da', '#1e130d', k * .85), 3);
  // ботинки и кеды
  for (const [x, y, col] of [[130, 528, '#7a4a2a'], [190, 528, '#e63b2e'], [260, 528, '#3fa9f5'], [140, 588, '#2f3540'], [230, 588, '#ffd23f']]) {
    ctx.beginPath(); ctx.moveTo(x - 24, y); ctx.lineTo(x - 24, y - 26); ctx.lineTo(x, y - 26); ctx.quadraticCurveTo(x + 6, y - 12, x + 30, y - 10); ctx.quadraticCurveTo(x + 36, y, x + 30, y); ctx.closePath(); toon(mix(col, '#1e130d', k * .85), 3);
  }
}
function drawParrot(G, t) {
  const x = t.x, y = t.y, scared = t.burn > 0 || t.state === 'flying', fl = scared ? Math.sin(time * 30) * .5 : 0;
  // клетка
  ctx.beginPath(); ctx.moveTo(x, y - 110); ctx.lineTo(x, y - 80); ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x - 55, y + 40); ctx.lineTo(x - 55, y - 40); ctx.quadraticCurveTo(x, y - 110, x + 55, y - 40); ctx.lineTo(x + 55, y + 40); ctx.closePath(); ctx.fillStyle = 'rgba(255,255,255,.25)'; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = INK; ctx.stroke();
  // жёрдочка и попугай
  rr(x - 36, y + 8, 72, 8, 3); toon('#c08552', 3);
  ctx.save(); ctx.translate(x + 2, y - 18);
  ctx.save(); ctx.rotate(-.4 - fl); ell(14, 4, 12, 22); toon('#3aa04a', 3); ctx.restore();
  ell(0, 4, 20, 26); toon('#5fd35a', 4);
  ctx.beginPath(); ctx.moveTo(-6, 26); ctx.lineTo(-14, 50); ctx.lineTo(2, 30); ctx.closePath(); toon('#3fa9f5', 3);
  circ(-2, -22, 16); toon('#ffd23f', 4);
  ctx.beginPath(); ctx.moveTo(-16, -24); ctx.quadraticCurveTo(-30, -16, -18, -10); ctx.closePath(); toon('#ff9f1c', 3);
  circ(-6, -26, 4); ctx.fillStyle = INK; ctx.fill(); if (scared) { circ(-6, -26, 6); ctx.lineWidth = 2; ctx.stroke(); }
  ctx.restore();
  for (let i = -3; i <= 3; i++) { ctx.beginPath(); ctx.moveTo(x + i * 15, y + 40); ctx.lineTo(x + i * 15, y - 40 - (3 - Math.abs(i)) * 9); ctx.lineWidth = 3; ctx.strokeStyle = INK; ctx.stroke(); }
  rr(x - 60, y + 36, 120, 12, 4); toon('#ffd23f', 3);
  if (scared && Math.sin(time * 3) > .7) { rr(x + 40, y - 96, 104, 34, 10); toon('#ffffff', 3); tex(ctx, x + 92, y - 79, 'ПОЖАРРР!', 15, '#e63b2e'); }
}
