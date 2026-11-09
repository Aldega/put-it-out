// ----- транспорт, уровень 3: троллейбус, искрит на крыше -----
const TROLLEY_WIRE = 112;
function bgTrolley(c) {
  citySky(c, 440, ['#8fd3f5', '#e6f7ff']);
  skyline(c, 440, 77, '#c2d3e6', '#f2f8ff', .85);
  sidewalk(c, 440, 500);
  // опоры и два провода
  for (const x of [60, 1200]) { rr(x - 10, 60, 20, 400, 5, c); toon('#5a5f66', 4, c); rr(x - 10, 80, x < 600 ? 90 : -70, 12, 4, c); toon('#5a5f66', 4, c); }
  for (const y of [TROLLEY_WIRE - 14, TROLLEY_WIRE]) { c.beginPath(); c.moveTo(-10, y); c.lineTo(VW + 10, y); c.lineWidth = 4; c.strokeStyle = INK; c.stroke(); }
}
// штанги: от крыши назад к проводам или сложены на крыше
function trolleyPoles(G) {
  const down = G.flags.down;
  for (const [i, wy] of [[0, TROLLEY_WIRE - 14], [1, TROLLEY_WIRE]]) {
    const bx = 600 + i * 16, by = 286, ex = down ? 270 + i * 16 : 262 + i * 34, ey = down ? 272 - i * 4 : wy;
    ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(ex, ey); ctx.lineWidth = 11; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 5; ctx.strokeStyle = '#9aa3ad'; ctx.stroke();
    rr(ex - 10, ey - 6, 20, 12, 4); toon('#5a5f66', 3);
    // верёвка от конца штанги к задней стенке
    ctx.beginPath(); ctx.moveTo(ex, ey); ctx.quadraticCurveTo(down ? 250 : 270, down ? 320 : 250, 242 + i * 8, 380); ctx.lineWidth = 3; ctx.strokeStyle = '#7a4a2a'; ctx.stroke();
    if (!down && Math.random() < .3) sparks(G, ex, ey, 2);
  }
  rr(228, 372, 36, 30, 6); toon('#ffd23f', 3); // крюк с верёвками
}
function drawTrolleyBody(it, G) {
  const k = Math.min(1, it.char + G.byId.roof.char * .4), b = mix('#3f9ff5', '#1e130d', k * .85), w = mix('#ffffff', '#1e130d', k * .8), gl = mix('#bfe8ff', '#3a2a20', k * .9);
  rr(250, 300, 750, 236, 26); toon(w, 6);
  rr(250, 430, 750, 106, 20); toon(b, 6);
  for (const x of [280, 385, 655, 760]) { rr(x, 326, 92, 94, 8); toon(gl, 4); }
  ctx.beginPath(); ctx.moveTo(950, 316); ctx.lineTo(988, 316); ctx.quadraticCurveTo(1004, 336, 1000, 440); ctx.lineTo(950, 440); ctx.closePath(); toon(gl, 4);
  circ(976, 382, 16); toon('#ffcc99', 3); rr(960, 362, 32, 10, 4); toon('#e63b2e', 2);
  for (const dx of [500, 852]) { rr(dx, 326, 88, 200, 6); toon(gl, 4); ctx.beginPath(); ctx.moveTo(dx + 44, 326); ctx.lineTo(dx + 44, 526); ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.stroke(); }
  rr(900, 302, 80, 22, 6); toon('#2f3540', 3); tex(ctx, 940, 314, '7', 18, '#ffb347');
  wheel(400, 534, 40, k); wheel(820, 534, 40, k);
}
function drawTrolleyRoof(it, G) {
  const k = it.char, c1 = mix('#d9dde3', '#1e130d', k * .85);
  rr(420, 268, 220, 34, 8); toon(c1, 5);
  for (let x = 436; x < 630; x += 26) { rr(x, 276, 14, 18, 3); toon(mix('#5a5f66', '#120b08', k), 2); }
  trolleyPoles(G);
}
function drawTrolleyTree(it) { poplar(ctx, 1150, 470, .9, mix('#6fb54a', '#1e130d', it.char * .85)); }
// футляр со скрипкой на сиденье у окна
function drawViolin(G, t) {
  const x = t.x, y = t.y;
  ctx.save(); ctx.translate(x, y); ctx.rotate(-.5);
  ctx.beginPath(); ctx.ellipse(-16, 0, 26, 22, 0, Math.PI * .5, Math.PI * 1.5); ctx.ellipse(18, 0, 20, 16, 0, Math.PI * 1.5, Math.PI * .5); ctx.closePath(); toon('#c96a2a', 4);
  ell(2, 0, 6, 4); ctx.fillStyle = INK; ctx.fill();
  rr(30, -4, 50, 8, 3); toon('#2a1a12', 2); rr(76, -8, 14, 16, 4); toon('#7a4a2a', 3);
  ctx.restore();
}
