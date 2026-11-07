// ----- город, уровень 8: финал, машина горит у подъезда -----
function bgCourtyard(c) {
  c.fillStyle = '#efe2c8'; c.fillRect(0, 0, VW, 560);
  for (let y = 0; y < 560; y += 110) { c.beginPath(); c.moveTo(0, y); c.lineTo(VW, y); c.lineWidth = 3; c.strokeStyle = '#d6c6a6'; c.stroke(); }
  // окна
  for (let fl = 0; fl < 3; fl++) for (let i = 0; i < 7; i++) {
    const x = 70 + i * 180, y = 20 + fl * 150; if (fl === 1 && i >= 5) continue;
    if (fl === 2 && i === 4) continue;
    rr(x, y, 100, 90, 4, c); toon('#bfe8ff', 4, c); c.fillStyle = '#ffffff'; c.fillRect(x + 47, y + 2, 6, 86);
  }
  // подъезд с козырьком
  rr(820, 390, 150, 172, 4, c); toon('#3f7bf5', 5, c); rr(838, 410, 114, 70, 4, c); toon('#bfe8ff', 3, c);
  circ(946, 500, 7, c); toon('#ffd23f', 3, c);
  rr(800, 366, 190, 24, 4, c); toon('#9aa3ad', 5, c);
  rr(860, 340, 70, 22, 4, c); toon('#ffffff', 3, c); tex(c, 895, 352, '№ 3', 16, INK);
  // асфальт
  c.fillStyle = '#8a8f96'; c.fillRect(0, 560, VW, VH - 560);
  c.beginPath(); c.moveTo(0, 560); c.lineTo(VW, 560); c.lineWidth = 6; c.strokeStyle = INK; c.stroke();
  rr(780, 560, 230, 14, 4, c); toon('#c9c4bb', 4, c);
  // газовая труба вдоль фасада
  c.beginPath(); c.moveTo(-10, 330); c.lineTo(VW + 10, 330); c.lineWidth = 18; c.strokeStyle = INK; c.stroke(); c.lineWidth = 10; c.strokeStyle = '#ffd23f'; c.stroke();
  for (let x = 40; x < VW; x += 160) { rr(x - 6, 318, 12, 24, 3, c); toon('#9aa3ad', 3, c); }
}
function courtBack(G) {
  // труба над машиной краснеет от жара
  const h = Math.min(1, G.pipe);
  if (h > .05 && !G.pipeBurst) { ctx.beginPath(); ctx.moveTo(380, 330); ctx.lineTo(680, 330); ctx.lineWidth = 10; ctx.strokeStyle = mix('#ffd23f', '#e63b2e', h); ctx.stroke();
    if (h > .6 && Math.sin(time * 10) > 0) { circ(530, 296, 16); toon('#ffd23f', 3); tex(ctx, 530, 297, '!', 22, INK); } }
  if (G.pipeBurst) { ctx.beginPath(); ctx.moveTo(545, 322); ctx.lineTo(560, 338); ctx.lineTo(575, 322); ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.stroke(); }
  // кран на трубе
  ctx.save(); ctx.translate(760, 330); rr(-14, -20, 28, 40, 5); toon('#9aa3ad', 4); ctx.rotate(G.flags.valve ? Math.PI / 2 : 0); rr(-30, -8, 60, 16, 6); toon('#e63b2e', 4); ctx.restore();
  // гидрант
  rr(978, 470, 44, 90, 10); toon('#e63b2e', 5); ell(1000, 470, 26, 12); toon('#c8203a', 4); rr(990, 450, 20, 14, 4); toon('#c8203a', 3);
  for (const s of [-1, 1]) { rr(1000 + s * 22 - 8, 498, 16, 18, 4); toon('#9aa3ad', 3); }
  rr(970, 552, 60, 12, 4); toon('#5a5f66', 3);
  if (G.flags.hydrant) {
    ctx.beginPath(); ctx.moveTo(978, 506); ctx.quadraticCurveTo(820, 330, 640, 440); ctx.lineWidth = 18; ctx.strokeStyle = 'rgba(63,169,245,.8)'; ctx.stroke(); ctx.lineWidth = 6; ctx.strokeStyle = 'rgba(255,255,255,.8)'; ctx.stroke();
    if (Math.random() < .6) G.parts.push({ k: 'drop', x: 640 + (Math.random() - .5) * 40, y: 440, vx: -100 - Math.random() * 200, vy: -80 - Math.random() * 100, life: 0, max: .6, color: '#3fa9f5', r: 5 });
  }
}
function courtFront(G) {
  const j = G.byId.jet;
  if (j.fire > 0) { ctx.save(); ctx.translate(560, 322); const L = 100 + 80 * j.fire + 10 * Math.sin(time * 23); tongue(0, 0, L, 42, 6 * Math.sin(time * 17), ['#3f7bf5', '#ff9d1f', '#ffe45c']); ctx.restore(); }
  else if (G.pipeBurst && !G.flags.valve) for (let i = 0; i < 2; i++) G.parts.push({ k: 'steam', x: 560, y: 320, vx: (Math.random() - .5) * 60, vy: -160, life: 0, max: .8, r: 8 });
  drawPhone112(G, 1200, 450);
}
function drawCourtTree(it) { leafTree(ctx, 190, 560, 1.25, mix('#5fae3e', '#1e130d', it.char * .85), it.char > .3 ? null : '#ffd23f'); }
function drawCourtBalcony(it) {
  const k = it.char, sl = mix('#d9cdb6', '#1e130d', k * .85);
  ctx.save(); ctx.translate(190, 0);
  rr(760, 250, 300, 26, 4); toon(sl, 5);
  rr(770, 180, 280, 72, 4); ctx.lineWidth = 5; ctx.strokeStyle = INK; ctx.stroke();
  for (let x = 790; x < 1050; x += 26) { ctx.beginPath(); ctx.moveTo(x, 184); ctx.lineTo(x, 248); ctx.lineWidth = 4; ctx.strokeStyle = mix('#5a5f66', '#1e130d', k * .5); ctx.stroke(); }
  // бельё на верёвке
  ctx.beginPath(); ctx.moveTo(770, 150); ctx.quadraticCurveTo(910, 170, 1050, 150); ctx.lineWidth = 3; ctx.strokeStyle = INK; ctx.stroke();
  [[800, '#ff7b9c', 50], [860, '#ffffff', 70], [930, '#3fa9f5', 56], [995, '#ffd23f', 64]].forEach(([x, col, h]) => {
    const y = 156 + Math.abs(x - 910) * -.04 + 8; rr(x - 22, y, 44, h, 4); toon(mix(col, '#1e130d', k * .85), 4);
  });
  ctx.restore();
}
function drawCourtCar(it) { carBody(520, 560, '#7cc243', it.char); }
function drawCourtPuddle(it) { petrolPuddle(500, 582, 125, 18, it.char); }
