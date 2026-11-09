// ----- транспорт, уровень 1: мопед курьера у пиццерии -----
function bgMoped(c) {
  citySky(c, 120, ['#7fcff5', '#e0f6ff']);
  bricks(c, 0, 60, VW, 480, '#f0cfa6', '#d9b088');
  c.beginPath(); c.moveTo(0, 60); c.lineTo(VW, 60); c.lineWidth = 5; c.strokeStyle = INK; c.stroke();
  // вывеска и витрина пиццерии
  rr(70, 104, 250, 62, 10, c); toon('#3f8a4f', 5, c); tex(c, 195, 136, 'ПИЦЦА', 34, '#ffffff');
  rr(110, 250, 340, 210, 6, c); toon('#ffe9a8', 5, c);
  for (let x = 110 + 113; x < 450; x += 113) { c.beginPath(); c.moveTo(x, 250); c.lineTo(x, 460); c.lineWidth = 4; c.strokeStyle = INK; c.stroke(); }
  // столик за стеклом
  ell(280, 400, 70, 12, c); toon('#e63b2e', 4, c); rr(272, 400, 16, 58, 3, c); toon('#5a5f66', 3, c);
  // дверь
  rr(500, 230, 120, 250, 6, c); toon('#3f8a4f', 5, c); rr(518, 250, 84, 120, 4, c); toon('#bfe8ff', 4, c); circ(600, 400, 7, c); toon('#ffd23f', 3, c);
  rr(510, 196, 100, 26, 6, c); toon('#ffffff', 3, c); tex(c, 560, 210, 'ОТКРЫТО', 14, '#3f8a4f');
  // окна второго этажа справа
  for (const x of [720, 900, 1080]) { rr(x, 120, 120, 120, 4, c); toon('#bfe8ff', 4, c); c.fillStyle = '#ffffff'; c.fillRect(x + 57, 122, 6, 116); }
  rr(700, 300, 520, 180, 6, c); toon('#e8dccb', 5, c);
  for (const x of [730, 900, 1070]) { rr(x, 330, 130, 110, 4, c); toon('#bfe8ff', 4, c); }
  sidewalk(c, 480, 640);
  streetLamp(c, 1210, 600, 330);
}
// мопед, вид сбоку, морда справа. k = обугленность
function drawMoped(it, G) {
  const k = it.char, b = mix('#e63b2e', '#1e130d', k * .85), d = mix('#2f3540', '#120b08', k * .5);
  wheel(360, 526, 34, k); wheel(570, 526, 34, k);
  // задний кожух с мотором
  ctx.beginPath(); ctx.moveTo(310, 500); ctx.quadraticCurveTo(300, 440, 360, 430); ctx.lineTo(470, 430); ctx.quadraticCurveTo(486, 470, 470, 510); ctx.lineTo(330, 512); ctx.closePath(); toon(b, 5);
  ctx.beginPath(); ctx.moveTo(350, 470); ctx.lineTo(440, 470); ctx.lineWidth = 4; ctx.strokeStyle = mix('#ffffff', '#1e130d', k * .8); ctx.stroke();
  // подножка и передний щит
  rr(456, 500, 90, 16, 6); toon(d, 4);
  ctx.beginPath(); ctx.moveTo(530, 510); ctx.lineTo(548, 380); ctx.quadraticCurveTo(570, 368, 584, 384); ctx.lineTo(574, 512); ctx.closePath(); toon(b, 5);
  ctx.beginPath(); ctx.moveTo(570, 500); ctx.lineTo(560, 380); ctx.lineWidth = 9; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 4; ctx.strokeStyle = '#9aa3ad'; ctx.stroke();
  // руль и фара
  ctx.beginPath(); ctx.moveTo(530, 352); ctx.lineTo(590, 360); ctx.lineWidth = 10; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 5; ctx.strokeStyle = d; ctx.stroke();
  ell(592, 392, 14, 18); toon(k > .3 ? '#6e6e6e' : '#fff3b0', 4);
  rr(544, 356, 24, 28, 6); toon(b, 4);
  // сиденье
  rr(330, 414, 130, 24, 12); toon(d, 5);
  // бензокран сбоку под сиденьем
  ctx.save(); ctx.translate(456, 492); circ(0, 0, 10); toon('#9aa3ad', 3); ctx.rotate(G.flags.tap ? 0 : Math.PI / 2); rr(-4, -22, 8, 22, 3); toon('#ffd23f', 3); ctx.restore();
  // капли бензина, пока кран открыт
  if (G.flags.tap && Math.random() < .25) G.parts.push({ k: 'drop', x: 452 + Math.random() * 8, y: 506, vx: 0, vy: 40, life: 0, max: .5, color: '#c9a7ff', r: 3 });
}
function drawMopedPuddle(it) { petrolPuddle(450, 582, 140, 18, it.char); }
function drawAwning(it) {
  const k = it.char;
  ctx.beginPath(); ctx.moveTo(96, 190); ctx.lineTo(464, 190); ctx.lineTo(486, 248); ctx.lineTo(74, 248); ctx.closePath(); toon(mix('#ffffff', '#1e130d', k * .85), 5);
  ctx.save(); ctx.clip(); for (let i = 0; i < 9; i++) { ctx.beginPath(); ctx.moveTo(96 + i * 46, 190); ctx.lineTo(120 + i * 46, 190); ctx.lineTo(102 + i * 50, 248); ctx.lineTo(74 + i * 50, 248); ctx.closePath(); ctx.fillStyle = mix('#3f8a4f', '#1e130d', k * .85); ctx.fill(); } ctx.restore();
  for (let i = 0; i < 9; i++) { ctx.beginPath(); ctx.arc(97 + i * 46, 248, 23, 0, Math.PI); toon(mix(i % 2 ? '#ffffff' : '#3f8a4f', '#1e130d', k * .85), 4); }
}
function drawParkedBike(it) {
  const k = it.char, col = mix('#3fa9f5', '#1e130d', k * .85), x = 900, y = 520;
  for (const dx of [-62, 62]) { circ(x + dx, y + 6, 38); ctx.lineWidth = 8; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 4; ctx.strokeStyle = mix('#9aa3ad', '#1e130d', k * .7); ctx.stroke(); }
  ctx.beginPath(); ctx.moveTo(x - 62, y + 6); ctx.lineTo(x - 14, y - 44); ctx.lineTo(x + 40, y - 44); ctx.lineTo(x + 62, y + 6); ctx.moveTo(x - 14, y - 44); ctx.lineTo(x + 2, y + 6); ctx.lineTo(x + 40, y - 44); ctx.moveTo(x - 62, y + 6); ctx.lineTo(x + 2, y + 6);
  ctx.lineWidth = 12; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 6; ctx.strokeStyle = col; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x + 40, y - 44); ctx.lineTo(x + 34, y - 70); ctx.lineTo(x + 58, y - 76); ctx.lineWidth = 7; ctx.strokeStyle = INK; ctx.stroke();
  rr(x - 34, y - 60, 34, 12, 5); toon('#2f3540', 3);
}
// термосумка курьера с пиццей
function drawPizzaBag(G, t) {
  const x = t.x, y = t.y;
  rr(x - 46, y - 40, 92, 84, 10); toon('#ffd23f', 5);
  rr(x - 30, y - 22, 60, 40, 8); toon('#ffffff', 3);
  // кусок пиццы на сумке
  ctx.beginPath(); ctx.moveTo(x - 16, y - 14); ctx.lineTo(x + 18, y - 14); ctx.lineTo(x + 1, y + 14); ctx.closePath(); toon('#ffb347', 3);
  circ(x - 2, y - 7, 4); toon('#e63b2e', 2); circ(x + 8, y - 8, 3); toon('#e63b2e', 2);
  ctx.beginPath(); ctx.moveTo(x - 30, y - 40); ctx.quadraticCurveTo(x, y - 66, x + 30, y - 40); ctx.lineWidth = 6; ctx.strokeStyle = INK; ctx.stroke();
}
