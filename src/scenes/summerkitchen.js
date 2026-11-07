// ----- дача, уровень 7: газовый баллон на летней кухне -----
function bgSummerKitchen(c) {
  c.fillStyle = '#ead7ad'; c.fillRect(0, 0, VW, 570);
  for (let x = 0; x < VW; x += 56) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, 570); c.lineWidth = 3; c.strokeStyle = '#cdb68a'; c.stroke(); }
  // окно с садом
  rr(760, 120, 300, 220, 8, c); toon('#ffffff', 7, c); rr(776, 136, 268, 188, 4, c);
  const g = c.createLinearGradient(0, 136, 0, 324); g.addColorStop(0, '#8fd6f5'); g.addColorStop(.7, '#c8f0ff'); g.addColorStop(.71, '#8fd05a'); c.fillStyle = g; c.fill(); c.lineWidth = 4; c.strokeStyle = INK; c.stroke();
  leafTree(c, 900, 330, .5); c.fillStyle = '#ffffff'; c.fillRect(906, 136, 8, 188);
  // полка с банками
  rr(170, 150, 240, 16, 5, c); toon('#a86b3c', 4, c);
  for (let i = 0; i < 4; i++) { rr(185 + i * 56, 98, 40, 52, 8, c); toon(['#e63b2e', '#ffd23f', '#7cc243', '#ff7b9c'][i], 4, c); rr(183 + i * 56, 92, 44, 12, 4, c); toon('#ffffff', 3, c); }
  // пол
  planks(c, 570, '#c08552', '#8a5a34', 30, 200);
  // стол
  rr(450, 500, 16, 80, 4, c); toon('#8a5a34', 4, c); rr(720, 500, 16, 80, 4, c); toon('#8a5a34', 4, c);
  // плитка на столе
  rr(470, 380, 200, 40, 6, c); toon('#ffffff', 5, c); for (const x of [520, 620]) { ell(x, 380, 34, 8, c); toon('#3a3a3a', 3, c); } circ(500, 400, 7, c); toon('#3a3a3a', 3, c); circ(640, 400, 7, c); toon('#3a3a3a', 3, c);
}
function skBack(G) {
  // шланг от баллона к плитке
  ctx.beginPath(); ctx.moveTo(245, 345); ctx.bezierCurveTo(330, 300, 380, 470, 472, 404); ctx.lineWidth = 12; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 6; ctx.strokeStyle = '#ff9f1c'; ctx.stroke();
  // баллон
  if (G.cylGone) { ell(225, 590, 70, 14); toon('#3a3a3a', 4); return; }
  const h = G.cyl, sh = h > .6 ? (Math.random() - .5) * 8 * h : 0;
  ctx.save(); ctx.translate(sh, 0);
  if (h > .05) { const gl = ctx.createRadialGradient(225, 470, 10, 225, 470, 160); gl.addColorStop(0, `rgba(255,60,30,${h * .5})`); gl.addColorStop(1, 'rgba(255,60,30,0)'); ctx.fillStyle = gl; ctx.fillRect(60, 300, 330, 320); }
  rr(165, 370, 120, 225, 50); toon(mix('#e63b2e', '#ffb13b', h), 6);
  rr(175, 590, 100, 16, 4); toon('#5a5f66', 4);
  tex(ctx, 225, 480, 'ПРОПАН', 22, '#ffffff');
  rr(212, 340, 26, 34, 4); toon('#9aa3ad', 4);
  // вентиль
  const shut = G.flags.valve;
  ctx.save(); ctx.translate(225, 335); ctx.rotate(shut ? Math.PI / 2 : 0); rr(-28, -8, 56, 16, 6); toon('#3fa9f5', 4); ctx.restore();
  // термометр нагрева
  rr(296, 420, 18, 120, 8); toon('#ffffff', 4); const th = 110 * h; rr(300, 534 - th, 10, th + 2, 5); ctx.fillStyle = mix('#ffd23f', '#e63b2e', h); ctx.fill();
  ctx.restore();
}
function skFront(G) {
  const j = G.byId.jet;
  if (j.fire > 0) {
    ctx.save(); ctx.translate(262, 352); ctx.rotate(Math.PI / 2 + .1);
    const L = 110 + 90 * j.fire + 12 * Math.sin(time * 23);
    tongue(0, 0, L, 46, 6 * Math.sin(time * 17), ['#3f7bf5', '#ff9d1f', '#ffe45c']);
    ctx.restore();
  } else if (G.flags.leaking && !G.flags.valve) {
    for (let i = 0; i < 2; i++) G.parts.push({ k: 'steam', x: 262, y: 352, vx: 160 + Math.random() * 80, vy: (Math.random() - .5) * 60 - 20, life: 0, max: .9, r: 8 });
  }
  if (G.flags.leaking && G.gas > 0) gasGauge(G);
}
function drawJetDummy() {}
function drawTablecloth(it) {
  const k = it.char, cl = mix('#7cc5f5', '#1e130d', k * .85);
  ctx.beginPath(); ctx.moveTo(430, 420); ctx.lineTo(760, 420); ctx.lineTo(770, 505); ctx.quadraticCurveTo(735, 520, 700, 505); ctx.quadraticCurveTo(665, 520, 630, 505); ctx.quadraticCurveTo(595, 520, 560, 505); ctx.quadraticCurveTo(525, 520, 490, 505); ctx.quadraticCurveTo(455, 520, 420, 505); ctx.closePath(); toon(cl, 5);
  ctx.fillStyle = mix('#ffffff', '#1e130d', k * .85); for (let x = 450; x < 760; x += 40) { circ(x, 460, 6); ctx.fill(); circ(x + 20, 485, 5); ctx.fill(); }
}
function drawVerandaCurtains(it) {
  const k = it.char, cl = mix('#ffd23f', '#1e130d', k * .85), dk = mix('#e0a020', '#1e130d', k * .85);
  rr(740, 100, 340, 14, 6); toon('#8a5a34', 4);
  for (const [x0, dir] of [[748, 1], [1072, -1]]) { ctx.beginPath(); ctx.moveTo(x0, 110); ctx.lineTo(x0 + dir * 80, 110); ctx.quadraticCurveTo(x0 + dir * 40, 230, x0 + dir * 60, 350); ctx.lineTo(x0, 350); ctx.closePath(); toon(cl, 5); ctx.beginPath(); ctx.moveTo(x0 + dir * 30, 118); ctx.quadraticCurveTo(x0 + dir * 20, 230, x0 + dir * 28, 345); ctx.lineWidth = 3; ctx.strokeStyle = dk; ctx.stroke(); }
}
// таз с вареньем на плитке
function drawJam(G, t) {
  const x = t.x, y = t.y;
  ctx.beginPath(); ctx.moveTo(x - 60, y - 20); ctx.lineTo(x + 60, y - 20); ctx.lineTo(x + 44, y + 18); ctx.lineTo(x - 44, y + 18); ctx.closePath(); toon('#ffffff', 5);
  ell(x, y - 20, 60, 12); toon('#c8203a', 4);
  for (const [dx, dy] of [[-30, -22], [0, -18], [24, -24]]) { circ(x + dx, y + dy, 6); toon('#e8577a', 2); }
  ctx.save(); ctx.translate(x + 30, y - 30); ctx.rotate(.6); rr(-4, -50, 8, 56, 3); toon('#c08552', 3); ctx.restore();
  for (const s of [-1, 1]) { ell(x + s * 64, y - 14, 10, 6); toon('#ffffff', 3); }
  if (Math.random() < .05) G.parts.push({ k: 'steam', x: x + (Math.random() - .5) * 60, y: y - 30, vx: 0, vy: -30, life: 0, max: 1.5, r: 8 });
}
