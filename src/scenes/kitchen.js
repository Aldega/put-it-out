// ----- уровень 3 и 8: кухня -----
function bgKitchenBase(c, night) {
  c.fillStyle = night ? '#9fbcb7' : '#d8f0e4'; c.fillRect(0, 0, VW, 640);
  // плитка
  c.fillStyle = night ? '#c9d3dc' : '#ffffff'; c.fillRect(220, 290, VW - 220, 180);
  c.strokeStyle = night ? '#93a9bb' : '#a9d3e0'; c.lineWidth = 3; for (let x = 220; x < VW; x += 40) { c.beginPath(); c.moveTo(x, 290); c.lineTo(x, 470); c.stroke(); } for (let y = 290; y < 470; y += 40) { c.beginPath(); c.moveTo(220, y); c.lineTo(VW, y); c.stroke(); }
  // окно
  const sky = c.createLinearGradient(0, 100, 0, 300); if (night) { sky.addColorStop(0, '#16204a'); sky.addColorStop(1, '#33467f'); } else { sky.addColorStop(0, '#7fd6ff'); sky.addColorStop(1, '#c9f0ff'); }
  windowFrame(c, 900, 80, 260, 220, sky);
  c.save(); rr(916, 96, 228, 188, 4, c); c.clip();
  if (night) { circ(1100, 140, 22, c); toon('#fff3b0', 4, c); c.fillStyle = '#fff6c8'; const r = rnd(5); for (let i = 0; i < 12; i++) { circ(920 + r() * 220, 100 + r() * 170, 2, c); c.fill(); } }
  else { cloud(c, 980, 150, .6); circ(1110, 130, 24, c); toon('#ffe066', 4, c); }
  c.restore();
  c.fillStyle = '#ffffff'; c.fillRect(1025, 96, 10, 188);
  // верхние шкафчики
  for (let i = 0; i < 2; i++) { rr(260 + i * 125, 100, 115, 150, 8, c); toon('#7fb3d5', 5, c); circ(350 + i * 125 - (i ? 80 : 0), 175, 6, c); toon('#ffd23f', 3, c); }
  // вытяжка
  rr(605, 0, 70, 150, 4, c); toon('#c9d1db', 5, c);
  c.beginPath(); c.moveTo(560, 150); c.lineTo(720, 150); c.lineTo(770, 240); c.lineTo(510, 240); c.closePath(); toon('#dfe5ec', 5, c);
  rr(505, 236, 270, 14, 5, c); toon('#9aa3ad', 4, c);
  // холодильник
  rr(40, 160, 175, 480, 22, c); toon('#f4f7fb', 6, c); c.beginPath(); c.moveTo(40, 330); c.lineTo(215, 330); c.lineWidth = 5; c.stroke();
  rr(185, 200, 12, 90, 6, c); toon('#9aa3ad', 3, c); rr(185, 360, 12, 120, 6, c); toon('#9aa3ad', 3, c);
  circ(80, 230, 12, c); toon('#e63b2e', 3, c); rr(110, 380, 40, 30, 4, c); toon('#ffd23f', 3, c);
  // столешница и шкафы
  rr(220, 462, VW - 220, 26, 6, c); toon('#c98b55', 5, c);
  for (let x = 225; x < VW; x += 150) { if (x > 500 && x < 770) continue; rr(x, 490, 140, 148, 6, c); toon('#7fb3d5', 5, c); rr(x + 60, 510, 20, 8, 4, c); toon('#ffd23f', 3, c); }
  // плита
  rr(520, 470, 240, 172, 8, c); toon('#eef1f5', 6, c);
  rr(530, 492, 220, 40, 6, c); toon('#d5dbe3', 4, c);
  rr(548, 552, 184, 76, 8, c); toon('#3a3f4a', 5, c); rr(560, 562, 60, 20, 6, c); c.fillStyle = 'rgba(255,255,255,.25)'; c.fill();
  rr(540, 540, 200, 10, 5, c); toon('#9aa3ad', 3, c);
  rr(515, 458, 250, 14, 4, c); toon('#3a3f4a', 4, c);
  // газовая труба
  c.beginPath(); c.moveTo(VW, 380); c.lineTo(790, 380); c.quadraticCurveTo(770, 380, 770, 400); c.lineTo(770, 470); c.lineWidth = 16; c.strokeStyle = INK; c.stroke(); c.lineWidth = 9; c.strokeStyle = '#ffd23f'; c.stroke();
  // выключатель
  rr(282, 312, 40, 56, 8, c); toon('#ffffff', 4, c);
  // доска и банки
  if (!night) { rr(300, 410, 120, 54, 10, c); toon('#d9a066', 4, c); circ(395, 425, 8, c); c.fillStyle = INK; c.fill(); [[450, '#ff7b9c'], [490, '#7cc243']].forEach(([x, col]) => { rr(x, 410, 34, 54, 8, c); toon('#e9f6ff', 4, c); rr(x + 4, 432, 26, 28, 5, c); c.fillStyle = col; c.fill(); }); }
  // пол
  c.fillStyle = '#f2e6cf'; c.fillRect(0, 640, VW, 80);
  c.fillStyle = '#d9c3a0'; for (let x = 0; x < VW; x += 60) for (let y = 640; y < VH; y += 40) if (((x / 60) + ((y - 640) / 40)) % 2 === 0) c.fillRect(x, y, 60, 40);
  c.beginPath(); c.moveTo(0, 640); c.lineTo(VW, 640); c.lineWidth = 6; c.strokeStyle = INK; c.stroke();
  if (night) { c.fillStyle = 'rgba(25,35,80,.42)'; c.fillRect(0, 0, VW, VH); const g = c.createRadialGradient(1030, 190, 10, 1030, 190, 330); g.addColorStop(0, 'rgba(160,190,255,.25)'); g.addColorStop(1, 'rgba(160,190,255,0)'); c.fillStyle = g; c.fillRect(0, 0, VW, VH); }
}
function bgKitchen(c) { bgKitchenBase(c, false); }
function bgGasKitchen(c) { bgKitchenBase(c, true); }
function drawStove(G) {
  const on = G.flags.stoveOn;
  if (on) for (let i = 0; i < 4; i++) { const x = 600 + i * 30, h = 16 + 4 * Math.sin(time * 14 + i); ctx.beginPath(); ctx.moveTo(x - 8, 472); ctx.quadraticCurveTo(x, 472 - h * 2, x + 8, 472); ctx.closePath(); ctx.fillStyle = '#3fa9f5'; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = '#1f6fb8'; ctx.stroke(); }
  [560, 610, 670, 720].forEach((x, i) => {
    circ(x, 512, 14); toon(i === 1 && on ? '#ff7a5c' : '#ffffff', 4);
    const a = i === 1 && on ? -Math.PI * .75 : -Math.PI / 2; ctx.beginPath(); ctx.moveTo(x, 512); ctx.lineTo(x + Math.cos(a) * 11, 512 + Math.sin(a) * 11); ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.stroke();
  });
  if (on) { ctx.save(); ctx.globalAlpha = .5 + .5 * Math.sin(time * 6); circ(610, 512, 22); ctx.lineWidth = 4; ctx.strokeStyle = '#ffd23f'; ctx.stroke(); ctx.restore(); }
}
function drawPan(it) {
  const k = it.char;
  rr(440, 446, 140, 16, 8); toon('#3a2a20', 5);
  ell(650, 462, 104, 26); toon(mix('#4a4a52', '#1a1a1e', k), 6);
  ell(650, 452, 92, 17); toon(mix('#e8b32e', '#4a2a10', k * .9), 4);
  ctx.fillStyle = 'rgba(255,255,255,.5)'; ell(620, 448, 20, 4); ctx.fill();
}
function drawTowel(it) {
  const k = it.char;
  circ(815, 322, 7); toon('#9aa3ad', 3);
  ctx.beginPath(); ctx.moveTo(788, 330); ctx.lineTo(842, 330); ctx.lineTo(846, 445); ctx.quadraticCurveTo(815, 452, 784, 445); ctx.closePath(); toon(mix('#ffffff', '#2a1a12', k * .8), 5);
  ctx.fillStyle = mix('#e63b2e', '#2a1a12', k * .8); ctx.fillRect(790, 360, 52, 10); ctx.fillRect(790, 405, 54, 10);
}
function drawCafeCurtain(it) {
  const k = it.char, col = mix('#ffd166', '#2a1a12', k * .85);
  rr(906, 192, 248, 8, 4); toon('#c08552', 3);
  ctx.beginPath(); ctx.moveTo(912, 198); ctx.lineTo(1148, 198); ctx.lineTo(1148, 292);
  for (let x = 1148; x > 912; x -= 29.5) ctx.quadraticCurveTo(x - 15, 312, x - 29.5, 292);
  ctx.closePath(); toon(col, 5);
  ctx.fillStyle = mix('#ff9f1c', '#2a1a12', k * .85); for (let x = 930; x < 1140; x += 40) { circ(x, 240, 6); ctx.fill(); }
}
function drawGasFixtures(G) {
  // кран на трубе
  const closed = G.flags.valveClosed;
  ctx.save(); ctx.translate(960, 380); ctx.rotate(closed ? Math.PI / 2 : 0); rr(-34, -9, 68, 18, 9); toon('#e63b2e', 4); ctx.restore(); circ(960, 380, 9); toon('#9aa3ad', 3);
  // выключатель
  rr(292, 326, 20, 28, 5); toon(G.flags.light ? '#ffd23f' : '#eceff4', 3);
  // окно открыто
  if (G.flags.windowOpen) { ctx.beginPath(); ctx.moveTo(1035, 96); ctx.lineTo(1100, 70); ctx.lineTo(1100, 320); ctx.lineTo(1035, 284); ctx.closePath(); toon('rgba(200,230,255,.85)', 5); }
  // газ
  const a = G.gas / 100;
  if (a > 0) for (let i = 0; i < 9; i++) { const x = 540 + i * 70 + 30 * Math.sin(time * .7 + i), y = 330 + 50 * Math.sin(time * .5 + i * 1.3) - i * 8; circ(x, y, 60 + 20 * Math.sin(time + i)); ctx.fillStyle = `rgba(150,220,120,${.22 * a})`; ctx.fill(); }
}
function gasGauge(G) {
  rr(30, 110, 200, 40, 20); toon('#fff6e4', 4);
  rr(36, 116, Math.max(0, 188 * G.gas / 100), 28, 14); ctx.fillStyle = G.gas > 60 ? '#e63b2e' : '#9bd65a'; ctx.fill();
  tex(ctx, 130, 131, tl('Газ {0}%', Math.round(G.gas)), 20, INK);
}


// бабушкина книга рецептов стоит на столешнице
function drawRecipeBook(G, t) {
  const x = t.x, y = t.y, scared = t.burn > 0;
  ctx.save(); ctx.translate(x, y); ctx.rotate(scared ? Math.sin(time * 20) * .05 : -.06);
  rr(-34, -46, 68, 92, 6); toon('#b5452f', 5);
  rr(-26, -46, 6, 92, 2); toon('#8a2f1f', 3);
  rr(-14, -30, 40, 26, 4); toon('#fff3df', 3);
  tex(ctx, 6, -17, 'РЕЦЕПТЫ', 9, INK);
  circ(6, 18, 12); toon('#ffd23f', 3); ell(6, 16, 6, 4); ctx.fillStyle = '#b5452f'; ctx.fill();
  ctx.restore();
}
