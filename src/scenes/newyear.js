// ----- уровень 4: ёлка -----
function bgNewYear(c) {
  const g = c.createLinearGradient(0, 0, 0, 600); g.addColorStop(0, '#2f4a7d'); g.addColorStop(1, '#3d5c94'); c.fillStyle = g; c.fillRect(0, 0, VW, 600);
  const r = rnd(21); c.strokeStyle = 'rgba(255,255,255,.18)'; c.lineWidth = 3;
  for (let i = 0; i < 26; i++) { const x = r() * VW, y = r() * 560, s = 8 + r() * 8; for (let k = 0; k < 3; k++) { const a = k * Math.PI / 3; c.beginPath(); c.moveTo(x - Math.cos(a) * s, y - Math.sin(a) * s); c.lineTo(x + Math.cos(a) * s, y + Math.sin(a) * s); c.stroke(); } }
  const sky = c.createLinearGradient(0, 110, 0, 360); sky.addColorStop(0, '#121a3d'); sky.addColorStop(1, '#2c3e78');
  windowFrame(c, 960, 100, 250, 270, sky);
  c.fillStyle = '#ffffff'; const s2 = rnd(4); for (let i = 0; i < 30; i++) { circ(980 + s2() * 210, 120 + s2() * 230, 2 + s2() * 2.5, c); c.fill(); }
  c.beginPath(); c.moveTo(976, 354); c.quadraticCurveTo(1085, 320, 1194, 354); c.closePath(); c.fillStyle = '#ffffff'; c.fill();
  c.fillStyle = '#ffffff'; c.fillRect(1080, 116, 10, 238);
  // часы 23:55
  circ(320, 190, 62, c); toon('#fff6e4', 6, c); circ(320, 190, 6, c); c.fillStyle = INK; c.fill();
  c.lineCap = 'round'; c.beginPath(); c.moveTo(320, 190); c.lineTo(316, 150); c.lineWidth = 7; c.stroke(); c.beginPath(); c.moveTo(320, 190); c.lineTo(296, 150); c.lineWidth = 4; c.stroke();
  for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; circ(320 + Math.cos(a) * 48, 190 + Math.sin(a) * 48, 3, c); c.fill(); }
  // гирлянда-флажки на стене
  c.beginPath(); c.moveTo(450, 70); c.quadraticCurveTo(690, 150, 920, 70); c.lineWidth = 3; c.strokeStyle = INK; c.stroke();
  for (let i = 1; i < 10; i++) { const t = i / 10, x = 450 + 470 * t, y = 70 + 160 * t * (1 - t); c.beginPath(); c.moveTo(x - 14, y); c.lineTo(x + 14, y); c.lineTo(x, y + 30); c.closePath(); toon(['#e63b2e', '#ffd23f', '#7cc243', '#3fa9f5'][i % 4], 3, c); }
  planks(c, 600, '#9a6a45', '#7b5034');
  socket(c, 120, 350); // слева над диваном: на телефоне справа её закрывают кнопки средств
  // ведро под ёлку
  c.beginPath(); c.moveTo(650, 575); c.lineTo(750, 575); c.lineTo(738, 645); c.lineTo(662, 645); c.closePath(); toon('#e63b2e', 5, c);
  rr(645, 568, 110, 14, 6, c); toon('#ffd23f', 4, c);
}
function drawSofa(it) {
  const k = it.char, col = mix('#c8434f', '#2a1a12', k * .8), dark = mix('#a3323d', '#2a1a12', k * .8);
  rr(80, 410, 330, 180, 36); toon(col, 6);
  rr(50, 470, 70, 140, 28); toon(dark, 6); rr(370, 470, 70, 140, 28); toon(dark, 6);
  rr(110, 515, 140, 56, 18); toon(mix('#e0606b', '#2a1a12', k * .8), 5); rr(250, 515, 135, 56, 18); toon(mix('#e0606b', '#2a1a12', k * .8), 5);
  rr(130, 440, 70, 60, 16); toon(mix('#ffd166', '#2a1a12', k * .8), 4);
  rr(70, 605, 18, 22, 4); toon('#5e3019', 4); rr(400, 605, 18, 22, 4); toon('#5e3019', 4);
}
function drawGifts(it) {
  const k = it.char;
  [[790, 530, 110, 85, '#3fa9f5', '#ffd23f'], [905, 555, 75, 60, '#7cc243', '#e63b2e'], [812, 470, 72, 58, '#ff7b9c', '#ffffff'], [915, 505, 50, 48, '#ffd23f', '#e63b2e']].forEach(([x, y, w, h, a, b]) => {
    rr(x, y, w, h, 5); toon(mix(a, '#2a1a12', k * .8), 5);
    ctx.fillStyle = mix(b, '#2a1a12', k * .8); ctx.fillRect(x + w / 2 - 6, y, 12, h); ctx.fillRect(x, y + h / 2 - 6, w, 12);
    ctx.beginPath(); ctx.ellipse(x + w / 2 - 12, y - 6, 12, 7, -.5, 0, 7); toon(mix(b, '#2a1a12', k * .8), 3); ctx.beginPath(); ctx.ellipse(x + w / 2 + 12, y - 6, 12, 7, .5, 0, 7); toon(mix(b, '#2a1a12', k * .8), 3);
  });
}
const TREE_BALLS = [[660, 290, '#e63b2e'], [735, 300, '#ffd23f'], [640, 400, '#3fa9f5'], [760, 410, '#ff7b9c'], [700, 360, '#ffffff'], [620, 510, '#ffd23f'], [780, 515, '#e63b2e'], [700, 480, '#7cc243']];
function drawTree(it, G) {
  const k = it.char, g1 = mix('#2f8f4e', '#14100c', k * .85), g2 = mix('#3aa85c', '#14100c', k * .85);
  rr(688, 540, 24, 40, 4); toon('#7a4a2a', 4);
  [[700, 180, 60, 280], [700, 250, 95, 380], [700, 330, 130, 470], [700, 410, 160, 560]].forEach(([x, top, hw, bot], i) => {
    ctx.beginPath(); ctx.moveTo(x, top); ctx.lineTo(x + hw, bot); ctx.quadraticCurveTo(x, bot + 18, x - hw, bot); ctx.closePath(); toon(i % 2 ? g2 : g1, 6);
  });
  for (const [x, y, c] of TREE_BALLS) { circ(x, y, 13); toon(mix(c, '#2a1a12', k * .7), 4); circ(x - 4, y - 4, 3); ctx.fillStyle = '#ffffffaa'; ctx.fill(); }
  // гирлянда
  const on = G.flags.plugged, cols = ['#ff4d4d', '#ffd23f', '#5cd6ff', '#7cff6b'];
  const path = [[650, 255, 750, 275], [625, 345, 775, 370], [605, 440, 795, 465], [590, 530, 810, 548]];
  path.forEach(([x0, y0, x1, y1], r) => {
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.quadraticCurveTo((x0 + x1) / 2, (y0 + y1) / 2 + 22, x1, y1); ctx.lineWidth = 3; ctx.strokeStyle = INK; ctx.stroke();
    for (let i = 0; i <= 6; i++) { const t = i / 6, x = x0 + (x1 - x0) * t, y = y0 + (y1 - y0) * t + 22 * 2 * t * (1 - t); const lit = on && ((Math.floor(time * 3) + i + r) % 3 !== 0);
      if (lit) { circ(x, y, 13); ctx.fillStyle = cols[(i + r) % 4] + '55'; ctx.fill(); }
      circ(x, y, 6); toon(lit ? cols[(i + r) % 4] : '#8a8f99', 2.5); }
  });
  // звезда
  ctx.save(); ctx.translate(700, 172); ctx.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 13 : 30; ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); } ctx.closePath(); toon('#ffd23f', 5); ctx.restore();
}
function drawTreeCord(G) {
  if (G.flags.plugged) { cord(690, 600, 120, 354, 120); plugAt(120, 354); }
  else { cord(690, 600, 590, 676, 20); plugAt(582, 676); }
}


// щенок спит у ёлки
function drawPuppy(G, t) {
  const x = t.x, y = t.y, scared = t.burn > 0 || t.state === 'flying';
  ell(x + 10, y + 8, 46, 24); toon('#f4e3c3', 5);
  circ(x + 30, y - 2, 12); toon('#c98d4b', 0); ctx.fillStyle = '#c98d4b'; ctx.fill();
  const hy = y - (scared ? 16 : 4), wag = scared ? Math.sin(time * 25) * 8 : 0;
  ctx.beginPath(); ctx.moveTo(x + 52, y + 2); ctx.quadraticCurveTo(x + 70, y - 14 + wag, x + 64, y - 24 + wag); ctx.lineWidth = 12; ctx.strokeStyle = INK; ctx.lineCap = 'round'; ctx.stroke(); ctx.lineWidth = 6; ctx.strokeStyle = '#f4e3c3'; ctx.stroke();
  circ(x - 30, hy, 26); toon('#f4e3c3', 5);
  for (const s of [-1, 1]) { ell(x - 30 + s * 24, hy + 6, 10, 18, ctx, s * .3); toon('#c98d4b', 4); }
  ell(x - 30, hy + 12, 12, 8); toon('#fff', 3); circ(x - 30, hy + 8, 4.5); ctx.fillStyle = INK; ctx.fill();
  ctx.lineWidth = 3.5; ctx.strokeStyle = INK;
  if (scared) { for (const s of [-1, 1]) { circ(x - 30 + s * 10, hy - 6, 4); ctx.fillStyle = INK; ctx.fill(); } }
  else { for (const s of [-1, 1]) { ctx.beginPath(); ctx.arc(x - 30 + s * 10, hy - 6, 5, .2, Math.PI - .2); ctx.stroke(); } const z = (time * .6) % 1; ctx.globalAlpha = 1 - z; tex(ctx, x - 8 + z * 20, y - 44 - z * 40, 'z', 22 + z * 10, '#ffffff'); ctx.globalAlpha = 1; }
  // красный ошейник
  rr(x - 46, hy + 22, 32, 7, 3); toon('#e63b2e', 3);
}
