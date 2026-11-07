// ----- дача, уровень 5: пал травы -----
function bgField(c) {
  skyGrad(c, ['#9fd8f2', '#e6f6ff'], 440);
  cloud(c, 300, 110, .6); cloud(c, 900, 140, .7);
  forestRow(c, 400, 31, '#6e9e5e', .5);
  // дым от соседского пала
  for (let i = 0; i < 5; i++) { circ(80 + i * 60, 330 - i * 40, 50 + i * 12, c); c.fillStyle = `rgba(110,100,95,${.35 - i * .05})`; c.fill(); }
  c.beginPath(); c.moveTo(0, 430); c.bezierCurveTo(300, 420, 900, 450, VW, 430); c.lineTo(VW, VH); c.lineTo(0, VH); c.closePath(); toon('#c7c27a', 6, c);
  c.beginPath(); c.moveTo(0, 600); c.bezierCurveTo(400, 590, 900, 615, VW, 600); c.lineTo(VW, VH); c.lineTo(0, VH); c.closePath(); toon('#a9b85a', 5, c);
  // кран и шланг
  rr(1022, 470, 14, 110, 4, c); toon('#5a5f66', 4, c); rr(1012, 470, 34, 16, 5, c); toon('#3fa9f5', 4, c);
  c.beginPath(); c.moveTo(1030, 580); c.bezierCurveTo(900, 620, 700, 560, 620, 530); c.lineWidth = 12; c.strokeStyle = INK; c.stroke(); c.lineWidth = 6; c.strokeStyle = '#7cc243'; c.stroke();
}
function fieldBack(G) {
  windLines(150, 380, 4);
  // вскопанная полоса или лопата
  if (G.flags.dug) { ctx.beginPath(); ctx.moveTo(268, 610); ctx.lineTo(268, 470); ctx.lineTo(292, 470); ctx.lineTo(300, 610); ctx.closePath(); toon('#6e4a22', 4); ctx.fillStyle = '#4a3218'; for (let y = 490; y < 600; y += 22) { circ(282, y, 4); ctx.fill(); } }
}
function fieldFront(G) {
  if (!G.flags.dug) { ctx.save(); ctx.translate(285, 540); ctx.rotate(.15); rr(-5, -130, 10, 130, 4); toon('#c08552', 4); rr(-14, -142, 28, 14, 5); toon('#7a4a2a', 3); ctx.beginPath(); ctx.moveTo(-18, 0); ctx.lineTo(18, 0); ctx.lineTo(14, 36); ctx.quadraticCurveTo(0, 46, -14, 36); ctx.closePath(); toon('#9aa3ad', 4); ctx.restore(); }
  // поливалка
  rr(614, 490, 12, 50, 4); toon('#5a5f66', 4); ell(620, 488, 22, 8); toon('#e63b2e', 4);
  if (G.flags.sprinkler) {
    const a0 = time * 3;
    for (let i = 0; i < 3; i++) { const a = a0 + i * 2.1, d = Math.cos(a); ctx.beginPath(); ctx.moveTo(620, 482); ctx.quadraticCurveTo(620 + d * 120, 340, 620 + d * 250, 540); ctx.lineWidth = 5; ctx.strokeStyle = 'rgba(63,169,245,.75)'; ctx.setLineDash([6, 12]); ctx.stroke(); ctx.setLineDash([]); }
    if (Math.random() < .5) G.parts.push({ k: 'drop', x: 620 + (Math.random() - .5) * 460, y: 420 + Math.random() * 60, vx: 0, vy: 50, life: 0, max: .5, color: '#3fa9f5', r: 4 });
  }
}
function drawFieldG1(it) { dryGrass(20, 255, 600, it.char, 51, '#d9c25a'); }
function drawFieldG2(it) { dryGrass(300, 520, 592, it.char, 52, '#d9c25a'); }
function drawFieldG3(it) { dryGrass(535, 780, 578, it.char, 53, '#d9c25a'); }
function drawCoop(it) {
  const k = it.char, w = mix('#d9a066', '#1e130d', k * .85), d = mix('#a86b3c', '#1e130d', k * .85);
  for (const x of [820, 990]) { rr(x - 7, 470, 14, 100, 4); toon(d, 4); }
  rr(800, 330, 210, 150, 6); toon(w, 5);
  for (let x = 830; x < 1000; x += 34) { ctx.beginPath(); ctx.moveTo(x, 334); ctx.lineTo(x, 476); ctx.lineWidth = 3; ctx.strokeStyle = d; ctx.stroke(); }
  ctx.beginPath(); ctx.moveTo(785, 335); ctx.lineTo(905, 260); ctx.lineTo(1025, 335); ctx.closePath(); toon(mix('#d9473a', '#1e130d', k * .85), 5);
  rr(880, 400, 50, 70, 25); toon('#2a1a12', 4);
  ctx.beginPath(); ctx.moveTo(880, 470); ctx.lineTo(820, 572); ctx.lineWidth = 14; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 8; ctx.strokeStyle = d; ctx.stroke();
}
function drawGreenhouse(it) {
  const k = it.char, fr = mix('#ffffff', '#2a1a12', k * .9);
  ctx.beginPath(); ctx.moveTo(1045, 575); ctx.lineTo(1045, 420); ctx.quadraticCurveTo(1155, 300, 1270, 420); ctx.lineTo(1270, 575); ctx.closePath();
  ctx.fillStyle = `rgba(200,240,255,${.55 - k * .3})`; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = INK; ctx.stroke();
  // помидоры внутри
  for (const x of [1090, 1160, 1230]) { rr(x - 3, 470, 6, 100, 3); toon('#7a4a2a', 2); circ(x, 470, 26); toon(mix('#5aa832', '#1e130d', k * .85), 4); for (const [dx, dy] of [[-10, 10], [12, -4], [0, 20]]) { circ(x + dx, 470 + dy, 7); toon(mix('#e63b2e', '#1e130d', k * .85), 2); } }
  ctx.strokeStyle = fr; ctx.lineWidth = 4;
  for (const x of [1100, 1157, 1215]) { ctx.beginPath(); ctx.moveTo(x, 575); ctx.lineTo(x, 380 - (x === 1157 ? 20 : 0)); ctx.stroke(); }
  ctx.beginPath(); ctx.moveTo(1045, 480); ctx.lineTo(1270, 480); ctx.stroke();
}
function drawChickens(G, t) {
  const x = t.x, y = t.y, scared = t.burn > 0 || t.state === 'flying';
  for (const [dx, i] of [[-30, 0], [28, 1]]) {
    const hop = scared ? Math.abs(Math.sin(time * 13 + i * 2)) * 12 : Math.abs(Math.sin(time * 3 + i * 2)) * 2, cx = x + dx, cy = y - hop;
    ell(cx, cy, 24, 20); toon('#ffffff', 4);
    ctx.beginPath(); ctx.moveTo(cx + 18, cy - 6); ctx.lineTo(cx + 30, cy - 16); ctx.lineTo(cx + 22, cy + 4); ctx.closePath(); toon('#ffffff', 3);
    circ(cx - 18, cy - 20, 13); toon('#ffffff', 4);
    ctx.beginPath(); ctx.moveTo(cx - 24, cy - 32); ctx.lineTo(cx - 20, cy - 40); ctx.lineTo(cx - 14, cy - 33); ctx.lineTo(cx - 10, cy - 38); ctx.lineTo(cx - 10, cy - 28); ctx.closePath(); toon('#e63b2e', 3);
    ctx.beginPath(); ctx.moveTo(cx - 30, cy - 22); ctx.lineTo(cx - 40, cy - 18); ctx.lineTo(cx - 30, cy - 15); ctx.closePath(); toon('#ffb13b', 3);
    circ(cx - 20, cy - 23, 2.6); ctx.fillStyle = INK; ctx.fill();
    for (const s of [-6, 6]) { ctx.beginPath(); ctx.moveTo(cx + s, cy + 18); ctx.lineTo(cx + s, cy + 30); ctx.lineWidth = 3.5; ctx.strokeStyle = '#ffb13b'; ctx.stroke(); }
  }
}
