// ================== эпизод 2 «Дача»: общие детали сцен ==================
function skyGrad(c, stops, h = 480) { const g = c.createLinearGradient(0, 0, 0, h); stops.forEach((col, i) => g.addColorStop(i / (stops.length - 1), col)); c.fillStyle = g; c.fillRect(0, 0, VW, h); }
// ёлка: x, y = низ ствола
function spruce(c, x, y, s, col = '#3f8a4f') {
  c.save(); c.translate(x, y); c.scale(s, s);
  rr(-8, -20, 16, 24, 3, c); toon('#7a4a2a', 4, c);
  for (let i = 0; i < 3; i++) { const w = 70 - i * 18, yy = -20 - i * 42; c.beginPath(); c.moveTo(-w, yy); c.lineTo(0, yy - 70); c.lineTo(w, yy); c.quadraticCurveTo(0, yy + 12, -w, yy); c.closePath(); toon(col, 4, c); }
  c.restore();
}
// лиственное дерево (яблоня): x, y = низ ствола
function leafTree(c, x, y, s, col = '#5fae3e', fruit = '#e63b2e') {
  c.save(); c.translate(x, y); c.scale(s, s);
  c.beginPath(); c.moveTo(-14, 0); c.lineTo(-8, -110); c.lineTo(-40, -150); c.lineTo(-30, -156); c.lineTo(0, -125); c.lineTo(30, -160); c.lineTo(38, -152); c.lineTo(10, -110); c.lineTo(16, 0); c.closePath(); toon('#8a5a34', 4, c);
  for (const [dx, dy, r] of [[-60, -170, 55], [0, -215, 65], [62, -172, 55], [-25, -150, 50], [30, -148, 50]]) { circ(dx, dy, r, c); toon(col, 4, c); }
  if (fruit) { c.fillStyle = fruit; for (const [dx, dy] of [[-70, -160], [-20, -200], [40, -190], [70, -150], [5, -150], [-45, -130]]) { circ(dx, dy, 8, c); toon(fruit, 3, c); } }
  c.restore();
}
function forestRow(c, y, seed, col, s = .7) { const r = rnd(seed); for (let x = -40; x < VW + 60; x += 50 + r() * 40) spruce(c, x, y + r() * 20, s * (.7 + r() * .5), col); }
// штакетник
function picketFence(c, y, x0, x1, col = '#e8d2a6', h = 90) {
  rr(x0, y - h * .7, x1 - x0, 12, 4, c); toon(mix(col, '#7a4a2a', .3), 4, c); rr(x0, y - h * .3, x1 - x0, 12, 4, c); toon(mix(col, '#7a4a2a', .3), 4, c);
  for (let x = x0 + 6; x < x1 - 20; x += 34) { c.beginPath(); c.moveTo(x, y); c.lineTo(x, y - h + 10); c.lineTo(x + 11, y - h); c.lineTo(x + 22, y - h + 10); c.lineTo(x + 22, y); c.closePath(); toon(col, 4, c); }
}
// земля с травинками
function lawn(c, y, col, blade, seed = 5) {
  c.beginPath(); c.moveTo(0, y); c.bezierCurveTo(300, y - 18, 900, y + 18, VW, y - 6); c.lineTo(VW, VH); c.lineTo(0, VH); c.closePath(); toon(col, 6, c);
  const r = rnd(seed); c.strokeStyle = blade; c.lineWidth = 3; c.lineCap = 'round';
  for (let i = 0; i < 90; i++) { const x = r() * VW, yy = y + 20 + r() * (VH - y - 20); c.beginPath(); c.moveTo(x, yy); c.lineTo(x - 4, yy - 10); c.moveTo(x + 5, yy); c.lineTo(x + 8, yy - 12); c.stroke(); }
}
// бревенчатая стена: бревна по горизонтали
function logWall(c, x0, y0, x1, y1, col = '#c98a4f', h = 44) {
  c.fillStyle = col; c.fillRect(x0, y0, x1 - x0, y1 - y0);
  for (let y = y0; y < y1; y += h) { rr(x0 - 10, y + 2, x1 - x0 + 20, h - 4, h / 2, c); toon(col, 4, c); c.beginPath(); c.moveTo(x0, y + h * .62); c.lineTo(x1, y + h * .62); c.lineWidth = 3; c.strokeStyle = mix(col, '#2a1a12', .35); c.stroke(); }
}
// пучок сухой травы (предмет); k = обугленность
function dryGrass(x0, x1, y, k, seed, col = '#e3c45a') {
  const r = rnd(seed), dark = mix(col, '#1e130d', .2 + k * .7), light = mix(col, '#1e130d', k * .85);
  ctx.lineJoin = 'round';
  for (let pass = 0; pass < 2; pass++) for (let x = x0; x < x1; x += 14 + r() * 6) {
    const h = (pass ? 50 : 70) + r() * 40 - k * 35, lean = 8 + r() * 14, w = 10 + r() * 6;
    ctx.beginPath(); ctx.moveTo(x - w / 2, y); ctx.quadraticCurveTo(x + lean * .3, y - h * .5, x + lean, y - h); ctx.quadraticCurveTo(x + lean * .2 + 2, y - h * .5, x + w / 2, y); ctx.closePath();
    ctx.fillStyle = pass ? light : dark; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = INK; ctx.stroke();
  }
  rr(x0 - 6, y - 6, x1 - x0 + 12, 14, 7); toon(mix('#a88a3a', '#1e130d', k * .8), 4);
}
// флажок на ветру, развевается вправо
function windFlag(x, y, col = '#e63b2e') {
  ctx.beginPath(); ctx.moveTo(x, y);
  for (let i = 0; i <= 6; i++) ctx.lineTo(x + i * 12, y + Math.sin(time * 9 - i) * 5 + i * 1.5);
  for (let i = 6; i >= 0; i--) ctx.lineTo(x + i * 12, y + 28 + Math.sin(time * 9 - i) * 5 + i * .5);
  ctx.closePath(); toon(col, 4);
}
// струйки ветра, летят вправо
function windLines(y0, y1, n = 4) {
  ctx.save(); ctx.lineCap = 'round'; ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(255,255,255,.55)';
  for (let i = 0; i < n; i++) { const t = (time * .45 + i / n) % 1, x = -200 + t * (VW + 400), y = y0 + (y1 - y0) * ((i * .37) % 1); ctx.globalAlpha = Math.sin(t * Math.PI); ctx.beginPath(); ctx.moveTo(x, y); ctx.bezierCurveTo(x + 50, y - 10, x + 90, y + 10, x + 140, y); ctx.stroke(); }
  ctx.restore();
}
// ведро (декор)
function pail(c, x, y, col = '#9aa3ad') { c.beginPath(); c.moveTo(x - 26, y - 50); c.lineTo(x + 26, y - 50); c.lineTo(x + 20, y); c.lineTo(x - 20, y); c.closePath(); toon(col, 4, c); ell(x, y - 50, 26, 7, c); toon('#3fa9f5', 3, c); c.beginPath(); c.arc(x, y - 52, 24, Math.PI, 0); c.lineWidth = 3; c.strokeStyle = INK; c.stroke(); }
// животные и люди для спасения
function drawHedgehog(G, t) {
  const x = t.x, y = t.y, scared = t.burn > 0 || t.state === 'flying', hop = scared ? Math.abs(Math.sin(time * 14)) * 6 : 0;
  ctx.save(); ctx.translate(x, y - hop);
  ctx.beginPath(); for (let i = 0; i <= 12; i++) { const a = Math.PI + i / 12 * Math.PI, r = i % 2 ? 44 : 58; ctx.lineTo(Math.cos(a) * r + 6, Math.sin(a) * r * .8 + 10); } ctx.closePath(); toon('#6e5238', 4);
  ell(-30, 12, 22, 16); toon('#e8c49a', 4); circ(-50, 12, 5); ctx.fillStyle = INK; ctx.fill();
  if (scared) { circ(-30, 4, 6); toon('#fff', 3); circ(-31, 4, 2.6); ctx.fillStyle = INK; ctx.fill(); } else { ctx.beginPath(); ctx.arc(-30, 4, 5, .2, Math.PI - .2); ctx.lineWidth = 3; ctx.strokeStyle = INK; ctx.stroke(); }
  // яблоко на иголках
  circ(18, -32, 12); toon('#e63b2e', 3); ctx.beginPath(); ctx.moveTo(18, -44); ctx.lineTo(21, -52); ctx.lineWidth = 3; ctx.stroke();
  ctx.restore();
}
// карта эпизода «Дача»
function mapDacha(c) {
  skyGrad(c, ['#6cc6f0', '#c9efff'], VH);
  circ(1100, 120, 56, c); toon('#ffe066', 5, c);
  forestRow(c, 400, 3, '#4f8f58', .6);
  c.beginPath(); c.moveTo(0, 420); c.bezierCurveTo(300, 380, 700, 450, VW, 400); c.lineTo(VW, VH); c.lineTo(0, VH); c.closePath(); toon('#9bd65a', 5, c);
  c.beginPath(); c.moveTo(0, 590); c.bezierCurveTo(300, 540, 800, 610, VW, 560); c.lineTo(VW, VH); c.lineTo(0, VH); c.closePath(); toon('#7cc243', 5, c);
  // домик с верандой
  house(c, 1150, 520, .9, '#ffe3a3'); picketFence(c, 560, 990, 1280, '#f4efe6', 50);
  // грядки и пугало
  for (let i = 0; i < 3; i++) { rr(40 + i * 110, 640 + (i % 2) * 10, 90, 30, 12, c); toon('#8a5a34', 4, c); for (let k = 0; k < 3; k++) { circ(60 + i * 110 + k * 25, 640 + (i % 2) * 10, 9, c); toon('#5aa832', 3, c); } }
  leafTree(c, 560, 450, .5); leafTree(c, 1010, 430, .45);
  // пруд
  ell(700, 690, 150, 30, c); toon('#5ec3f2', 5, c);
}
