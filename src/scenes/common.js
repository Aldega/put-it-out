// ================== фоны ==================
let bgCache = {};
function cachedBg(name, fn) {
  if (!bgCache[name]) {
    const c = document.createElement('canvas'); c.width = cv.width; c.height = cv.height;
    const x = c.getContext('2d'); x.setTransform(scale, 0, 0, scale, 0, 0); fn(x); bgCache[name] = c;
  }
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(bgCache[name], 0, 0); ctx.setTransform(scale, 0, 0, scale, 0, 0);
}
function cloud(c, x, y, s) {
  c.save(); c.translate(x, y); c.scale(s, s);
  c.beginPath(); c.arc(-40, 10, 28, Math.PI * .5, Math.PI * 1.5); c.arc(-8, -14, 34, Math.PI, Math.PI * 1.9); c.arc(34, -4, 28, Math.PI * 1.2, Math.PI * .4); c.lineTo(-40, 38); c.closePath();
  toon('#ffffff', 4, c); c.restore();
}
function hills(c) {
  const g = c.createLinearGradient(0, 0, 0, VH); g.addColorStop(0, '#5ec3f2'); g.addColorStop(.7, '#c8f0ff'); c.fillStyle = g; c.fillRect(0, 0, VW, VH);
  circ(1080, 130, 62, c); toon('#ffe066', 5, c);
  c.beginPath(); c.moveTo(0, 470); c.bezierCurveTo(250, 360, 470, 420, 640, 470); c.bezierCurveTo(820, 520, 1050, 360, 1280, 420); c.lineTo(1280, 720); c.lineTo(0, 720); c.closePath(); toon('#9bd65a', 5, c);
  c.beginPath(); c.moveTo(0, 580); c.bezierCurveTo(300, 500, 600, 600, 900, 560); c.bezierCurveTo(1050, 540, 1180, 560, 1280, 540); c.lineTo(1280, 720); c.lineTo(0, 720); c.closePath(); toon('#7cc243', 5, c);
}
function fireStation(c, x, y) {
  // каланча
  rr(x + 270, y - 210, 70, 230, 6, c); toon('#d9473a', 5, c);
  c.beginPath(); c.moveTo(x + 255, y - 210); c.lineTo(x + 305, y - 262); c.lineTo(x + 355, y - 210); c.closePath(); toon('#7a2a1f', 5, c);
  rr(x + 285, y - 195, 40, 40, 4, c); toon('#ffe9a8', 4, c);
  // здание
  rr(x, y - 140, 300, 170, 8, c); toon('#e85a45', 5, c);
  c.beginPath(); c.moveTo(x - 15, y - 140); c.lineTo(x + 150, y - 205); c.lineTo(x + 315, y - 140); c.closePath(); toon('#8c2f22', 5, c);
  for (let i = 0; i < 2; i++) { rr(x + 30 + i * 130, y - 80, 110, 110, 6, c); toon('#f4efe6', 4, c); for (let k = 1; k < 4; k++) { c.beginPath(); c.moveTo(x + 30 + i * 130, y - 80 + k * 27); c.lineTo(x + 140 + i * 130, y - 80 + k * 27); c.lineWidth = 3; c.stroke(); } }
  rr(x + 105, y - 128, 90, 40, 8, c); toon('#ffffff', 4, c);
  c.fillStyle = '#e63b2e'; c.font = '900 30px Rubik, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('01', x + 150, y - 107);
}
function house(c, x, y, s, col) {
  c.save(); c.translate(x, y); c.scale(s, s);
  rr(-50, -60, 100, 80, 4, c); toon(col, 4, c);
  c.beginPath(); c.moveTo(-62, -58); c.lineTo(0, -110); c.lineTo(62, -58); c.closePath(); toon('#6b3b2a', 4, c);
  rr(-14, -20, 28, 40, 3, c); toon('#7a4a2a', 4, c); rr(18, -45, 22, 22, 3, c); toon('#ffe9a8', 4, c); rr(-40, -45, 22, 22, 3, c); toon('#ffe9a8', 4, c);
  c.restore();
}
function bgTitle(c) {
  hills(c);
  house(c, 160, 470, .9, '#ffd6a5'); house(c, 1000, 450, .8, '#bde0fe'); house(c, 1150, 470, .7, '#ffc8dd');
  fireStation(c, 420, 600);
  // пожарная машина
  const tx = 820, ty = 640;
  rr(tx, ty - 70, 230, 60, 10, c); toon('#e63b2e', 5, c); rr(tx + 150, ty - 110, 80, 50, 10, c); toon('#e63b2e', 5, c);
  rr(tx + 165, ty - 100, 50, 28, 5, c); toon('#bfe8ff', 4, c);
  rr(tx + 10, ty - 92, 130, 14, 5, c); toon('#d9d9d9', 4, c);
  circ(tx + 50, ty - 8, 22, c); toon('#3a3a3a', 5, c); circ(tx + 50, ty - 8, 8, c); toon('#bbbbbb', 3, c);
  circ(tx + 185, ty - 8, 22, c); toon('#3a3a3a', 5, c); circ(tx + 185, ty - 8, 8, c); toon('#bbbbbb', 3, c);
  rr(tx + 175, ty - 122, 22, 12, 4, c); toon('#3fa9f5', 3, c);
}
function bgMap(c) {
  const E = EPISODES[curEp];
  E.bg(c);
  // дорожка
  c.save(); c.setLineDash([2, 26]); c.lineCap = 'round'; c.lineWidth = 16; c.strokeStyle = '#fff6e4';
  c.beginPath(); E.map.forEach((p, i) => { const x = p[0] * VW / 100, y = p[1] * VH / 100; i ? c.lineTo(x, y) : c.moveTo(x, y); }); c.stroke(); c.restore();
}
function mapDom(c) {
  hills(c);
  house(c, 70, 640, .8, '#ffd6a5'); house(c, 1210, 300, .6, '#bde0fe');
  for (let i = 0; i < 5; i++) { const x = 300 + i * 220, y = 690 - (i % 2) * 20; c.beginPath(); c.arc(x, y, 30, Math.PI, 0); c.closePath(); toon('#5aa832', 4, c); }
}


// ----- общие мелочи -----
function socket(c, x, y) { rr(x - 23, y - 23, 46, 46, 8, c); toon('#ffffff', 4, c); circ(x - 8, y, 4, c); c.fillStyle = INK; c.fill(); circ(x + 8, y, 4, c); c.fill(); }
function plugAt(x, y) { rr(x - 13, y - 11, 26, 22, 5); toon('#f4f4f4', 4); }
function cord(x0, y0, x1, y1, sag) { ctx.beginPath(); ctx.moveTo(x0, y0); ctx.bezierCurveTo(x0 + (x1 - x0) * .3, y0 + sag, x0 + (x1 - x0) * .7, y1 + sag, x1, y1); ctx.lineWidth = 9; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 4; ctx.strokeStyle = '#ffffff'; ctx.stroke(); }
function planks(c, y0, col, line, h = 30, step = 180) {
  c.fillStyle = col; c.fillRect(0, y0, VW, VH - y0); c.beginPath(); c.moveTo(0, y0); c.lineTo(VW, y0); c.lineWidth = 6; c.strokeStyle = INK; c.stroke();
  c.strokeStyle = line; c.lineWidth = 3; for (let y = y0 + h; y < VH; y += h) { c.beginPath(); c.moveTo(0, y); c.lineTo(VW, y); c.stroke(); for (let x = ((y - y0) / h % 2) * step / 2; x < VW; x += step) { c.beginPath(); c.moveTo(x, y - h); c.lineTo(x, y); c.stroke(); } }
}
function windowFrame(c, x, y, w, h, sky) {
  rr(x, y, w, h, 10, c); toon('#ffffff', 7, c);
  rr(x + 16, y + 16, w - 32, h - 32, 4, c); c.fillStyle = sky; c.fill(); c.lineWidth = 4; c.strokeStyle = INK; c.stroke();
}
function tex(c, x, y, text, size, col) { c.fillStyle = col; c.font = `900 ${size}px Rubik, sans-serif`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(text, x, y); }

