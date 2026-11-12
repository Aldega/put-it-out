// ----- уровень со звёздочкой: болид после аварии в гравийной ловушке -----
function bgF1Crash(c) {
  skyGrad(c, ['#6cc6f0', '#d4f3ff'], 300);
  cloud(c, 1120, 80, .7);
  forestRow(c, 200, 33, '#5aa85a', .7);
  // маленькая трибуна вдали
  rr(560, 110, 360, 90, 6, c); toon('#c9ced8', 4, c); rr(550, 96, 380, 20, 5, c); toon('#e63b2e', 4, c);
  const r = rnd(11), cols = ['#e63b2e', '#3fa9f5', '#ffd23f', '#7cc243', F1_COL, '#ffffff'];
  for (let row = 0; row < 3; row++) for (let x = 576 + (row % 2) * 8; x < 910; x += 17) { circ(x, 132 + row * 24, 7, c); toon(cols[Math.floor(r() * cols.length)], 2, c); }
  // трасса с поребриками
  c.fillStyle = '#5f646c'; c.fillRect(0, 200, VW, 92); c.beginPath(); c.moveTo(0, 200); c.lineTo(VW, 200); c.lineWidth = 5; c.strokeStyle = INK; c.stroke();
  c.save(); c.setLineDash([30, 26]); c.lineWidth = 4; c.strokeStyle = '#f4efe6'; c.beginPath(); c.moveTo(0, 246); c.lineTo(VW, 246); c.stroke(); c.restore();
  for (let x = 0; x < VW; x += 48) { c.fillStyle = (x / 48) % 2 ? '#ffffff' : '#e63b2e'; c.fillRect(x, 292, 48, 14); }
  c.beginPath(); c.moveTo(0, 292); c.lineTo(VW, 292); c.moveTo(0, 306); c.lineTo(VW, 306); c.lineWidth = 4; c.strokeStyle = INK; c.stroke();
  // трава и гравийная ловушка
  c.fillStyle = '#7cc243'; c.fillRect(0, 306, VW, 26); c.beginPath(); c.moveTo(0, 332); c.lineTo(VW, 332); c.lineWidth = 4; c.strokeStyle = INK; c.stroke();
  c.fillStyle = '#e6d3a3'; c.fillRect(0, 332, VW, VH - 332);
  const g = rnd(5); for (let i = 0; i < 520; i++) { circ(g() * VW, 340 + g() * 380, 2 + g() * 3, c); c.fillStyle = ['#c9b27c', '#f4e6c0', '#b39a63'][i % 3]; c.fill(); }
  // следы вылета: болид слетел с трассы справа и уткнулся носом в барьер
  c.save(); c.lineCap = 'round'; c.strokeStyle = 'rgba(90,70,40,.45)'; c.lineWidth = 22;
  for (const d of [0, 46]) { c.beginPath(); c.moveTo(1010 + d, 300); c.bezierCurveTo(900 + d, 420, 640 + d, 460, 330 + d, 560 + d * .2); c.stroke(); }
  c.restore();
  // оторванный передний антикрыл
  c.save(); c.translate(380, 668); c.rotate(.18); rr(-70, -10, 140, 20, 6, c); toon(F1_COL, 4, c); rr(-80, -26, 20, 44, 5, c); toon(F1_STRIPE, 4, c); c.restore();
  // кучка гравия под носом
  ell(320, 548, 110, 30, c); toon('#d8c08a', 4, c);
  // пост маршалов за трассой: будка и сетка ограждения
  rr(176, 118, 170, 82, 8, c); toon('#e8ecf2', 5, c); rr(166, 104, 190, 22, 7, c); toon('#ff9d1f', 5, c);
  rr(200, 132, 122, 34, 5, c); toon('#bfe8ff', 4, c); tex(c, 261, 184, 'ПОСТ 7', 20, '#ff9d1f');
  // отлетевшее колесо
  circ(965, 405, 40, c); toon('#26262a', 5, c); circ(965, 405, 28, c); c.lineWidth = 4; c.strokeStyle = F1_STRIPE; c.stroke(); circ(965, 405, 17, c); toon('#9aa3ad', 3, c);
}
function f1CrashBack(G) {
  // болиды на трассе, пока гонка идёт
  const P = G.pass;
  if (P.x > -260) { ctx.save(); ctx.translate(P.x, 248); miniF1(P.col); ctx.restore(); for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(P.x + 90 + i * 30, 228 + i * 10); ctx.lineTo(P.x + 150 + i * 40, 228 + i * 10); ctx.lineWidth = 4; ctx.strokeStyle = '#ffffff'; ctx.stroke(); } }
  // машина медиков
  if (G.med) {
    ctx.save(); ctx.translate(G.med.x, 248);
    rr(-90, -40, 180, 50, 12); toon('#ffffff', 5); rr(-90, -10, 180, 12, 3); toon('#3fb85f', 3);
    rr(-40, -66, 90, 30, 8); toon('#ffffff', 4); rr(-30, -60, 32, 20, 4); toon('#bfe8ff', 3);
    rr(10, -78, 26, 12, 4); toon(Math.sin(time * 14) > 0 ? '#3fa9f5' : '#ffffff', 3);
    tex(ctx, 30, -24, 'МЕДИКИ', 15, '#3fb85f');
    rr(-74, -34, 22, 22, 4); toon('#3fb85f', 3); tex(ctx, -63, -23, '+', 22, '#ffffff');
    wheel(-50, 14, 18); wheel(56, 14, 18);
    ctx.restore();
  }
  // маршал с флагом за трассой: флаг сначала опущен, после касания поднят вертикально и машет
  f1FlagMarshal(G, 162, 108, .7);
  // маршалы с огнетушителями: ждут на посту, после флага бегут к болиду
  for (const m of [...G.mars].sort((a, b) => a.y - b.y)) {
    ctx.save(); ctx.translate(m.x, m.y - (m.run ? Math.abs(Math.sin(time * 16)) * 8 : 0)); ctx.scale(m.s, m.s);
    if (m.run) { ctx.rotate(m.x1 > m.x0 ? .06 : -.06); }
    f1Marshal(G, 0, 0, m.gave, m.kind); ctx.restore();
  }
}
// гоночная машина на трассе, мелко и сбоку, нос влево
function miniF1(col) {
  rr(-90, -6, 180, 16, 6); toon(col, 4); ctx.beginPath(); ctx.moveTo(-100, 6); ctx.quadraticCurveTo(-40, -18, 30, -20); ctx.lineTo(70, -26); ctx.lineTo(80, 4); ctx.closePath(); toon(col, 4);
  circ(10, -24, 10); toon('#ffffff', 3); rr(76, -40, 16, 36, 4); toon('#2f3540', 3);
  for (const x of [-56, 56]) { circ(x, 10, 17); toon('#26262a', 4); circ(x, 10, 7); toon('#9aa3ad', 2); }
}
// шинный барьер слева: в него болид и врезался
function drawF1Barrier(it) {
  const k = it.char;
  rr(14, 360, 226, 236, 10); toon(mix('#3fa9f5', '#1e130d', k * .8), 5);
  for (let row = 0; row < 5; row++) for (let col = 0; col < 4; col++) {
    const x = 44 + col * 52, y = 570 - row * 46;
    circ(x, y, 24); toon(mix(row % 2 ? '#26262a' : '#f4efe6', '#1e130d', k * .9), 4); circ(x, y, 10); toon(mix('#5a5f66', '#1e130d', k), 3);
  }
  rr(14, 456, 226, 26, 6); toon(mix('#ffffff', '#1e130d', k * .8), 4);
}

// маршал с красным флагом. Флаг на древке: опущен (видно полотнище), потом поднят вертикально
function f1FlagMarshal(G, x, y, s) {
  const k = G.flagK || 0, e = k * k * (3 - 2 * k);
  const a = 1.15 - (1.15 + Math.PI / 2) * e, len = 170 - 40 * e;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  // ноги, туловище, голова
  rr(-18, 70, 14, 52, 5); toon('#ff9d1f', 4); rr(4, 70, 14, 52, 5); toon('#ff9d1f', 4);
  rr(-24, 116, 22, 12, 5); toon(INK, 3); rr(2, 116, 22, 12, 5); toon(INK, 3);
  rr(-28, -4, 56, 82, 14); toon('#ff9d1f', 5); rr(-28, 30, 56, 10, 3); toon('#ffffff', 3);
  circ(0, -26, 21); toon('#f4cfa8', 4); ctx.beginPath(); ctx.arc(0, -30, 23, Math.PI, 0); ctx.closePath(); toon('#ffffff', 4);
  circ(-7, -22, 3); ctx.fillStyle = INK; ctx.fill(); circ(7, -22, 3); ctx.fill();
  ctx.beginPath(); ctx.arc(0, -16, 7, .2, Math.PI - .2); ctx.lineWidth = 3; ctx.strokeStyle = INK; ctx.stroke();
  // рука держит древко у пояса, древко поворачивается вверх
  const hx = 40, hy = 26 - 30 * e, dx = Math.cos(a), dy = Math.sin(a), nx = -dy, ny = dx;
  const tx = hx + dx * len, ty = hy + dy * len;
  // полотнище на внешней половине древка; когда флаг поднят, оно машет
  const wv = e > .5 ? Math.sin(time * 9) : Math.sin(time * 2) * .3, cw = 104;
  const p0 = [hx + dx * (len - 120), hy + dy * (len - 120)], p1 = [tx, ty];
  ctx.beginPath(); ctx.moveTo(p0[0], p0[1]); ctx.lineTo(p1[0], p1[1]);
  ctx.quadraticCurveTo(p1[0] + nx * cw * .5 + dx * wv * 16, p1[1] + ny * cw * .5 + dy * wv * 16, p1[0] + nx * cw - dx * 6, p1[1] + ny * cw - dy * 6 + (1 - e) * 10);
  ctx.lineTo(p0[0] + nx * cw, p0[1] + ny * cw + (1 - e) * 12);
  ctx.quadraticCurveTo(p0[0] + nx * cw * .5 - dx * wv * 16, p0[1] + ny * cw * .5 - dy * wv * 16, p0[0], p0[1]);
  ctx.closePath(); toon('#e63b2e', 5);
  ctx.beginPath(); ctx.moveTo(hx - dx * 14, hy - dy * 14); ctx.lineTo(tx, ty); ctx.lineCap = 'round'; ctx.lineWidth = 13; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 7; ctx.strokeStyle = '#c9ced8'; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(24, 10); ctx.lineTo(hx, hy); ctx.moveTo(-24, 10); ctx.lineTo(hx - 4, hy + 4); ctx.lineWidth = 11; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 6; ctx.strokeStyle = '#ff9d1f'; ctx.stroke();
  circ(hx, hy, 9); toon('#f4cfa8', 3);
  // пока флаг опущен, полотнище мягко подсвечивается: его можно поднять
  if (!G.flags.red) { const t = (time * 1.2) % 1, cx = hx + dx * (len - 60) + nx * cw * .5, cy = hy + dy * (len - 60) + ny * cw * .5; ctx.globalAlpha = (1 - t) * .8; circ(cx, cy, 50 + t * 40); ctx.lineWidth = 6; ctx.strokeStyle = '#ffffff'; ctx.stroke(); ctx.globalAlpha = 1; }
  ctx.restore();
}
