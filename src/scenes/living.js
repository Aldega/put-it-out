// ----- уровень 1: гостиная -----
function bgLiving(c) {
  // стены
  const g = c.createLinearGradient(0, 0, 0, 600); g.addColorStop(0, '#f0a25c'); g.addColorStop(1, '#d57d45'); c.fillStyle = g; c.fillRect(0, 0, VW, 600);
  c.fillStyle = 'rgba(255,255,255,.08)'; for (let x = 0; x < VW; x += 80) c.fillRect(x, 0, 36, 470);
  c.fillStyle = 'rgba(122,60,30,.25)'; for (let x = 18; x < VW; x += 80) for (let y = 30; y < 460; y += 70) { circ(x + 40, y, 5, c); c.fill(); }
  // панели
  c.fillStyle = '#8a4b28'; c.fillRect(0, 470, VW, 130); c.beginPath(); c.moveTo(0, 470); c.lineTo(VW, 470); c.lineWidth = 6; c.strokeStyle = INK; c.stroke();
  for (let x = 20; x < VW; x += 150) { rr(x, 490, 120, 90, 6, c); c.lineWidth = 4; c.strokeStyle = '#5e3019'; c.stroke(); }
  // пол
  c.fillStyle = '#a8673a'; c.fillRect(0, 600, VW, 120); c.beginPath(); c.moveTo(0, 600); c.lineTo(VW, 600); c.lineWidth = 6; c.strokeStyle = INK; c.stroke();
  c.strokeStyle = '#7d4625'; c.lineWidth = 3; for (let y = 630; y < VH; y += 30) { c.beginPath(); c.moveTo(0, y); c.lineTo(VW, y); c.stroke(); for (let x = (y / 30 % 2) * 90; x < VW; x += 180) { c.beginPath(); c.moveTo(x, y - 30); c.lineTo(x, y); c.stroke(); } }
  // окно
  rr(110, 100, 230, 290, 10, c); toon('#f7ead6', 7, c);
  const s = c.createLinearGradient(0, 120, 0, 370); s.addColorStop(0, '#1b2557'); s.addColorStop(1, '#41589c'); rr(128, 118, 194, 254, 4, c); c.fillStyle = s; c.fill(); c.lineWidth = 4; c.strokeStyle = INK; c.stroke();
  circ(280, 170, 26, c); toon('#fff3b0', 4, c); circ(290, 162, 22, c); c.fillStyle = '#1e2a5e'; c.fill();
  c.fillStyle = '#fff6c8'; const r = rnd(7); for (let i = 0; i < 18; i++) { circ(135 + r() * 180, 125 + r() * 240, 1.5 + r() * 2, c); c.fill(); }
  c.fillStyle = '#f7ead6'; c.fillRect(222, 118, 8, 254); c.fillRect(128, 240, 194, 8);
  // шторы
  rr(70, 80, 310, 16, 8, c); toon('#5e3019', 4, c);
  for (const [x0, dir] of [[78, 1], [372, -1]]) { c.beginPath(); c.moveTo(x0, 92); c.lineTo(x0 + dir * 70, 92); c.quadraticCurveTo(x0 + dir * 40, 250, x0 + dir * 60, 420); c.lineTo(x0, 420); c.closePath(); toon('#c8333a', 5, c); c.beginPath(); c.moveTo(x0 + dir * 25, 100); c.quadraticCurveTo(x0 + dir * 15, 260, x0 + dir * 25, 415); c.lineWidth = 3; c.strokeStyle = '#8f1f26'; c.stroke(); }
  // камин
  rr(860, 290, 360, 360, 10, c); toon('#bfa58f', 6, c);
  const rs = rnd(3); for (let y = 305; y < 640; y += 38) for (let x = 868 + ((y / 38) % 2) * 30; x < 1205; x += 64) { rr(x, y, 56 + rs() * 4, 30, 8, c); c.fillStyle = mix('#cdb59f', '#a88f79', rs()); c.fill(); c.lineWidth = 3; c.strokeStyle = '#7d6654'; c.stroke(); }
  c.beginPath(); c.moveTo(930, 650); c.lineTo(930, 480); c.quadraticCurveTo(1040, 400, 1150, 480); c.lineTo(1150, 650); c.closePath(); toon('#2b1b14', 6, c);
  rr(835, 270, 410, 30, 8, c); toon('#6b3b1e', 6, c);
  rr(850, 640, 380, 26, 6, c); toon('#9c8a7a', 5, c);
  // решётка с дровами в камине
  // решётка на ножках, поднята повыше
  for (const x of [980, 1090]) { rr(x, 590, 10, 52, 3, c); toon('#5a4a3f', 3, c); }
  rr(965, 575, 150, 20, 6, c); toon('#5a4a3f', 4, c);
  rr(975, 555, 130, 24, 12, c); toon('#7a4a2a', 4, c);
  // часы и ваза на полке
  rr(900, 205, 70, 65, 12, c); toon('#8a5a34', 5, c); circ(935, 232, 22, c); toon('#fff6e4', 4, c); c.beginPath(); c.moveTo(935, 232); c.lineTo(935, 218); c.moveTo(935, 232); c.lineTo(946, 238); c.lineWidth = 3; c.stroke();
  c.beginPath(); c.moveTo(1150, 270); c.quadraticCurveTo(1120, 230, 1145, 200); c.lineTo(1175, 200); c.quadraticCurveTo(1200, 230, 1170, 270); c.closePath(); toon('#3fa9f5', 5, c);
  // картина
  rr(975, 90, 180, 110, 6, c); toon('#c99a3a', 6, c); rr(990, 104, 150, 82, 3, c); toon('#bfe8ff', 3, c);
  c.beginPath(); c.moveTo(990, 186); c.quadraticCurveTo(1060, 130, 1140, 170); c.lineTo(1140, 186); c.closePath(); c.fillStyle = '#7cc243'; c.fill();
  circ(1110, 125, 12, c); c.fillStyle = '#ffd23f'; c.fill();
  // торшер
  rr(745, 300, 10, 300, 4, c); toon('#3a2a20', 4, c); c.beginPath(); c.moveTo(700, 300); c.lineTo(800, 300); c.lineTo(775, 230); c.lineTo(725, 230); c.closePath(); toon('#ffe9a8', 5, c);
  rr(715, 592, 70, 14, 6, c); toon('#3a2a20', 4, c);
  // тёплый свет
  const lg = c.createRadialGradient(750, 280, 10, 750, 280, 380); lg.addColorStop(0, 'rgba(255,240,180,.35)'); lg.addColorStop(1, 'rgba(255,240,180,0)'); c.fillStyle = lg; c.fillRect(0, 0, VW, VH);
}
function drawArmchair(it) {
  const k = it.char, col = mix('#4f9a6a', '#2a1a12', k * .8), dark = mix('#3b7a52', '#2a1a12', k * .8);
  rr(150, 390, 220, 200, 40); toon(col, 6);
  rr(120, 470, 70, 130, 28); toon(dark, 6); rr(330, 470, 70, 130, 28); toon(dark, 6);
  rr(170, 510, 180, 60, 20); toon(mix('#62b07d', '#2a1a12', k * .8), 5);
  rr(140, 595, 18, 24, 4); toon('#5e3019', 4); rr(362, 595, 18, 24, 4); toon('#5e3019', 4);
}
function drawRug(it) {
  const k = it.char;
  ell(600, 660, 330, 42); toon(mix('#b03a48', '#2a1a12', k * .8), 5);
  ell(600, 660, 260, 28); ctx.lineWidth = 6; ctx.strokeStyle = mix('#ffd166', '#2a1a12', k * .8); ctx.stroke();
  ell(600, 660, 180, 16); ctx.lineWidth = 4; ctx.strokeStyle = mix('#f4a261', '#2a1a12', k * .8); ctx.stroke();
}
function drawLog(it) {
  const k = it.char;
  const bark = mix('#8a5a34', '#1e130d', k * .85), barkD = mix('#6b4226', '#120b08', k * .85);
  rr(470, 584, 310, 68, 34); toon(bark, 6);
  ctx.strokeStyle = barkD; ctx.lineWidth = 4;
  for (const [x, y, l] of [[510, 602, 80], [600, 620, 110], [540, 636, 70], [690, 600, 60], [660, 640, 70]]) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + l, y + 2); ctx.stroke(); }
  ell(745, 618, 26, 34); toon(mix('#e8c48c', '#2a1a12', k * .7), 5);
  for (const r of [18, 10]) { ell(745, 618, r * .75, r); ctx.lineWidth = 3; ctx.strokeStyle = mix('#b8854f', '#2a1a12', k * .7); ctx.stroke(); }
  // сучок
  ctx.beginPath(); ctx.moveTo(560, 590); ctx.lineTo(545, 562); ctx.lineWidth = 10; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 5; ctx.strokeStyle = bark; ctx.stroke();
}


// кот спит на ковре; когда рядом огонь, просыпается
function drawCat(G, t) {
  const x = t.x, y = t.y, scared = t.burn > 0 || t.state === 'flying';
  // хвост
  ctx.beginPath(); ctx.moveTo(x + 40, y + 12); ctx.quadraticCurveTo(x + 80, y + 10, x + 70, y - 18); ctx.lineWidth = 16; ctx.strokeStyle = INK; ctx.lineCap = 'round'; ctx.stroke(); ctx.lineWidth = 9; ctx.strokeStyle = '#f39a3d'; ctx.stroke();
  ell(x + 8, y + 6, 48, 26); toon('#f39a3d', 5);
  ctx.beginPath(); ctx.moveTo(x - 4, y - 18); ctx.lineTo(x + 6, y + 30); ctx.moveTo(x + 18, y - 18); ctx.lineTo(x + 26, y + 30); ctx.lineWidth = 5; ctx.strokeStyle = '#d97a22'; ctx.stroke();
  // голова и уши
  const hy = y - (scared ? 14 : 2);
  for (const s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(x - 34 + s * 14, hy - 14); ctx.lineTo(x - 34 + s * 22, hy - 38); ctx.lineTo(x - 34 + s * 2, hy - 22); ctx.closePath(); toon('#f39a3d', 4); }
  circ(x - 34, hy, 24); toon('#f7b25e', 5);
  ctx.lineWidth = 3.5; ctx.strokeStyle = INK; ctx.lineCap = 'round';
  if (scared) { for (const s of [-1, 1]) { circ(x - 34 + s * 9, hy - 3, 6); toon('#ffffff', 3); circ(x - 34 + s * 9, hy - 3, 2.5); ctx.fillStyle = INK; ctx.fill(); } }
  else { for (const s of [-1, 1]) { ctx.beginPath(); ctx.arc(x - 34 + s * 9, hy - 3, 5, .2, Math.PI - .2); ctx.stroke(); } }
  circ(x - 34, hy + 6, 3); ctx.fillStyle = '#e8577a'; ctx.fill();
  if (!scared) { const z = (time * .6) % 1; ctx.globalAlpha = 1 - z; tex(ctx, x - 10 + z * 20, y - 40 - z * 40, 'z', 22 + z * 10, '#ffffff'); ctx.globalAlpha = 1; }
}
