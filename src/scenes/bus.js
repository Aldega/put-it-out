// ----- транспорт, уровень 2: автобус, горит мотор сзади -----
function bgBus(c) {
  citySky(c, 440, ['#6cc6f0', '#d4f3ff']);
  cloud(c, 980, 110, .7);
  skyline(c, 440, 57, '#b7cde3', '#eef6ff', .9);
  poplar(c, 1150, 450, .7); poplar(c, 1240, 450, .6);
  sidewalk(c, 440, 500);
  // знак остановки
  rr(1090, 230, 12, 220, 4, c); toon('#5a5f66', 4, c); rr(1050, 190, 92, 60, 8, c); toon('#3f7bf5', 4, c); tex(c, 1096, 220, 'A', 36, '#ffffff');
}
// автобус, морда справа. Мотор сзади (слева)
function drawBusBody(it, G) {
  const k = G.byId.engine.char * .5 + it.char * .6, b = mix('#ffd23f', '#1e130d', Math.min(1, k) * .85), gl = mix('#bfe8ff', '#3a2a20', Math.min(1, it.char) * .9);
  rr(250, 290, 770, 250, 26); toon(b, 6);
  rr(250, 470, 770, 26, 8); toon(mix('#e63b2e', '#1e130d', k * .8), 4);
  // окна салона
  for (const x of [340, 445, 655, 760]) { rr(x, 320, 92, 100, 8); toon(gl, 4); }
  // лобовое стекло и водитель
  ctx.beginPath(); ctx.moveTo(960, 310); ctx.lineTo(1004, 310); ctx.quadraticCurveTo(1018, 330, 1016, 440); ctx.lineTo(960, 440); ctx.closePath(); toon(gl, 4);
  circ(988, 380, 16); toon('#ffcc99', 3); rr(972, 360, 32, 10, 4); toon('#3f7bf5', 2);
  // двери: средняя и передняя
  const open = G.tr && G.tr.state !== 'here';
  for (const dx of [550, 860]) {
    if (open) { rr(dx, 320, 18, 210, 4); toon(gl, 4); rr(dx + 74, 320, 18, 210, 4); toon(gl, 4); rr(dx + 18, 320, 56, 210, 2); ctx.fillStyle = '#5a4a3a'; ctx.fill(); }
    else { rr(dx, 320, 92, 210, 6); toon(gl, 4); ctx.beginPath(); ctx.moveTo(dx + 46, 320); ctx.lineTo(dx + 46, 530); ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.stroke(); }
  }
  // номер маршрута
  rr(930, 296, 70, 24, 6); toon('#2f3540', 3); tex(ctx, 965, 309, '42', 18, '#ffb347');
  // огнетушитель водителя у передней двери
  if (!G.flags.ext) { rr(925, 448, 20, 40, 6); toon('#e63b2e', 3); rr(929, 440, 12, 10, 3); toon(INK, 2); }
  wheel(420, 534, 40, k); wheel(790, 534, 40, k);
}
function drawBusEngine(it) {
  const k = it.char, b = mix('#ffd23f', '#1e130d', k * .9);
  rr(250, 300, 70, 170, 20); toon(b, 5);
  for (let y = 330; y < 450; y += 22) { rr(262, y, 46, 10, 4); toon(mix('#2f3540', '#120b08', k), 3); }
  rr(240, 420, 18, 34, 6); toon('#e63b2e', 4);
}
function drawBusSalon() {}
function drawKiosk(it) {
  const k = it.char, c1 = mix('#3fa9f5', '#1e130d', k * .85);
  rr(40, 300, 190, 200, 8); toon(c1, 5);
  rr(56, 330, 158, 90, 4); toon(mix('#fff4d6', '#3a2a20', k * .85), 4);
  for (const [x, col] of [[70, '#e63b2e'], [110, '#7cc243'], [150, '#ffd23f'], [186, '#ff7b9c']]) { rr(x, 350, 26, 50, 3); toon(mix(col, '#1e130d', k * .85), 3); }
  ctx.beginPath(); ctx.moveTo(26, 300); ctx.lineTo(135, 256); ctx.lineTo(244, 300); ctx.closePath(); toon(mix('#e63b2e', '#1e130d', k * .85), 5);
  rr(70, 266, 130, 26, 6); toon('#ffffff', 3); tex(ctx, 135, 280, 'ГАЗЕТЫ', 16, INK);
}
// пассажиры в окнах
function drawPassengers(G, t) {
  const scared = t.burn > 0 || t.state === 'flying';
  [[386, '#ffcc99', '#7a4a2a'], [491, '#e0a878', '#2a1a12'], [701, '#ffcc99', '#ffd23f'], [806, '#c98a5a', '#9aa3ad']].forEach(([x, skin, hair], i) => {
    const y = t.y + 6 - (scared ? Math.abs(Math.sin(time * 12 + i)) * 8 : 0);
    rr(x - 20, y + 10, 40, 30, 10); toon(['#3f7bf5', '#e63b2e', '#7cc243', '#ff7b9c'][i], 3);
    circ(x, y, 17); toon(skin, 3);
    ctx.beginPath(); ctx.arc(x, y - 4, 17, Math.PI, 0); ctx.closePath(); toon(hair, 3);
    if (scared) { ell(x, y + 7, 4, 5); ctx.fillStyle = INK; ctx.fill(); }
  });
}
