// ----- уровень 5: спальня -----
function bgBedroom(c) {
  c.fillStyle = '#cbb7e6'; c.fillRect(0, 0, VW, 600);
  c.fillStyle = 'rgba(255,255,255,.12)'; for (let x = 0; x < VW; x += 50) c.fillRect(x, 0, 18, 600);
  const sky = c.createLinearGradient(0, 110, 0, 420); sky.addColorStop(0, '#6c5fc7'); sky.addColorStop(.6, '#ff9e7a'); sky.addColorStop(1, '#ffd29a');
  windowFrame(c, 360, 100, 290, 330, sky);
  c.fillStyle = '#fff6c8'; [[420, 150], [470, 190], [590, 140], [520, 130]].forEach(([x, y]) => { circ(x, y, 2.5, c); c.fill(); });
  c.beginPath(); c.moveTo(376, 380); c.lineTo(440, 330); c.lineTo(500, 360); c.lineTo(560, 320); c.lineTo(634, 370); c.lineTo(634, 414); c.lineTo(376, 414); c.closePath(); c.fillStyle = '#6b4f8f'; c.fill();
  rr(340, 420, 330, 18, 6, c); toon('#ffffff', 5, c);
  // карниз и левая штора
  rr(300, 80, 480, 14, 7, c); toon('#5e3019', 4, c);
  c.beginPath(); c.moveTo(306, 92); c.lineTo(370, 92); c.quadraticCurveTo(345, 300, 362, 560); c.lineTo(306, 560); c.closePath(); toon('#8ecae6', 5, c);
  // постер с луной
  rr(820, 140, 140, 180, 6, c); toon('#2c3e78', 5, c); circ(890, 210, 34, c); toon('#fff3b0', 4, c); circ(902, 202, 28, c); c.fillStyle = '#2c3e78'; c.fill();
  tex(c, 890, 285, 'СПОКОЙНОЙ НОЧИ', 13, '#fff3b0');
  planks(c, 600, '#b98a5e', '#946a43');
  ell(640, 668, 220, 28, c); toon('#ffadad', 5, c);
}
function drawCurtain(it, G) {
  const k = it.char, col = mix('#8ecae6', '#2a1a12', k * .85), dk = mix('#5fa8cc', '#2a1a12', k * .85);
  const sway = G.flags.windowOpen ? 26 * Math.sin(time * 3) + 20 : 0;
  ctx.beginPath(); ctx.moveTo(640, 92); ctx.lineTo(770, 92); ctx.quadraticCurveTo(745 + sway, 300, 772 + sway * 1.4, 590); ctx.lineTo(650 + sway * 1.2, 590); ctx.quadraticCurveTo(660 + sway * .6, 300, 640, 92); ctx.closePath(); toon(col, 5);
  for (const dx of [35, 75]) { ctx.beginPath(); ctx.moveTo(640 + dx, 100); ctx.quadraticCurveTo(650 + dx + sway * .5, 330, 655 + dx + sway * 1.3, 585); ctx.lineWidth = 3; ctx.strokeStyle = dk; ctx.stroke(); }
}
function drawSash(G) {
  if (G.flags.windowOpen) {
    ctx.beginPath(); ctx.moveTo(376, 116); ctx.lineTo(300, 140); ctx.lineTo(300, 400); ctx.lineTo(376, 414); ctx.closePath(); toon('rgba(220,240,255,.8)', 5);
    for (let i = 0; i < 4; i++) { const y = 200 + i * 60, x = 430 + ((time * 160 + i * 90) % 380); ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + 30, y - 14, x + 60, y); ctx.quadraticCurveTo(x + 90, y + 14, x + 120, y); ctx.lineWidth = 5; ctx.strokeStyle = 'rgba(255,255,255,.75)'; ctx.stroke(); }
  } else { c2line(505, 116, 505, 414); }
}
function c2line(x0, y0, x1, y1) { ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.lineWidth = 10; ctx.strokeStyle = '#ffffff'; ctx.stroke(); }
function drawNightstand(it, G) {
  const k = it.char, w = mix('#c08552', '#2a1a12', k * .85);
  rr(790, 470, 150, 140, 10); toon(w, 6); rr(805, 495, 120, 40, 6); toon(mix('#d9a066', '#2a1a12', k * .85), 4); rr(805, 548, 120, 40, 6); toon(mix('#d9a066', '#2a1a12', k * .85), 4);
  circ(865, 515, 5); toon('#ffd23f', 2); circ(865, 568, 5); toon('#ffd23f', 2);
  rr(808, 610, 14, 20, 3); toon('#5e3019', 3); rr(908, 610, 14, 20, 3); toon('#5e3019', 3);
  // книга и свеча
  rr(880, 452, 50, 18, 3); toon(mix('#e63b2e', '#2a1a12', k * .8), 3);
  ell(820, 466, 26, 7); toon('#ffd23f', 3); rr(810, 410, 20, 54, 4); toon('#fff6e4', 4);
  if (G.flags.candle) tongue(820, 408, 26 + 3 * Math.sin(time * 9), 14, 3 * Math.sin(time * 5), FIRE_COLS);
  else { ctx.beginPath(); ctx.moveTo(820, 410); ctx.lineTo(820, 400); ctx.lineWidth = 3; ctx.strokeStyle = INK; ctx.stroke(); if (Math.random() < .05) G.parts.push({ k: 'smoke', x: 820, y: 395, vx: 5, vy: -25, life: 0, max: 1.8, r: 5 }); }
}
function drawBedroomBed(it) {
  const k = it.char;
  rr(1210, 330, 40, 300, 10); toon('#8a5a34', 5);
  rr(960, 470, 270, 110, 16); toon('#ffffff', 5);
  rr(1110, 440, 100, 50, 22); toon(mix('#ffffff', '#2a1a12', k * .7), 5);
  ctx.beginPath(); ctx.moveTo(955, 478); ctx.quadraticCurveTo(1030, 462, 1120, 470); ctx.lineTo(1120, 600); ctx.quadraticCurveTo(1030, 610, 955, 600); ctx.closePath(); toon(mix('#9b7fd4', '#2a1a12', k * .8), 5);
  ctx.strokeStyle = mix('#c9b6f2', '#2a1a12', k * .8); ctx.lineWidth = 4; for (let x = 985; x < 1110; x += 30) { ctx.beginPath(); ctx.moveTo(x, 480); ctx.lineTo(x, 598); ctx.stroke(); }
  rr(965, 580, 22, 46, 5); toon('#8a5a34', 4); rr(1190, 580, 22, 46, 5); toon('#8a5a34', 4);
}


// семейный фотоальбом на тумбочке
function drawAlbum(G, t) {
  const x = t.x, y = t.y, scared = t.burn > 0;
  ctx.save(); ctx.translate(x, y); if (scared) ctx.rotate(Math.sin(time * 20) * .05);
  rr(-40, -12, 80, 24, 5); toon('#2f7fc1', 5);
  rr(-40, -26, 80, 18, 5); toon('#3fa9f5', 5);
  rr(-16, -24, 32, 13, 2); toon('#fff', 3); ell(0, -17, 5, 4); ctx.fillStyle = '#ff7b9c'; ctx.fill();
  ctx.beginPath(); ctx.moveTo(-34, 0); ctx.lineTo(34, 0); ctx.lineWidth = 3; ctx.strokeStyle = '#ffffff'; ctx.stroke();
  ctx.restore();
}
