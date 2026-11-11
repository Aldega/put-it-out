// ----- уровень со звёздочкой: болид Формулы-1 на пит-стопе -----
const F1_COL = '#7a4bd6', F1_STRIPE = '#ffd23f';
function bgF1(c) {
  skyGrad(c, ['#6cc6f0', '#d4f3ff'], 300);
  // трибуна со зрителями
  rr(-10, 46, VW + 20, 24, 6, c); toon('#e63b2e', 5, c);
  c.fillStyle = '#c9ced8'; c.fillRect(0, 70, VW, 180);
  const r = rnd(7), cols = ['#e63b2e', '#3fa9f5', '#ffd23f', '#7cc243', '#ff7b9c', '#ffffff', F1_COL, '#ff9d1f'];
  for (let row = 0; row < 5; row++) {
    const y = 96 + row * 34; c.fillStyle = '#9aa3ad'; c.fillRect(0, y + 14, VW, 6);
    for (let x = 14 + (row % 2) * 13; x < VW; x += 26) {
      ell(x, y + 8, 11, 9, c); toon(cols[Math.floor(r() * cols.length)], 3, c);
      circ(x, y - 6, 8, c); toon(['#f4cfa8', '#d9a066', '#8a5a34'][Math.floor(r() * 3)], 3, c);
    }
  }
  // флажки болельщиков
  for (const [x, y, col] of [[180, 92, '#ffd23f'], [520, 126, F1_COL], [860, 92, '#e63b2e'], [1080, 160, '#3fa9f5']]) {
    c.beginPath(); c.moveTo(x, y + 30); c.lineTo(x, y - 20); c.lineWidth = 4; c.strokeStyle = INK; c.stroke();
    c.beginPath(); c.moveTo(x, y - 20); c.lineTo(x + 34, y - 10); c.lineTo(x, y); c.closePath(); toon(col, 3, c);
  }
  c.beginPath(); c.moveTo(0, 250); c.lineTo(VW, 250); c.lineWidth = 5; c.strokeStyle = INK; c.stroke();
  // боксы команды
  rr(-10, 244, VW + 20, 32, 4, c); toon('#ffffff', 5, c);
  for (let x = 0; x < VW; x += 60) { rr(x + 4, 252, 26, 16, 3, c); c.fillStyle = (x / 60) % 2 ? INK : '#ffffff'; c.fill(); }
  c.fillStyle = '#e8ecf2'; c.fillRect(0, 276, VW, 196);
  // открытый бокс справа
  rr(830, 292, 420, 180, 6, c); toon('#3a4250', 5, c);
  for (const x of [880, 1010, 1140]) { rr(x, 304, 80, 12, 5, c); toon('#fff8d0', 3, c); }
  rr(860, 360, 120, 70, 6, c); toon('#2f3540', 4, c); rr(872, 370, 96, 44, 4, c); toon('#5be35b', 3, c);
  c.strokeStyle = INK; c.lineWidth = 3; c.beginPath(); c.moveTo(880, 398); c.lineTo(900, 384); c.lineTo(920, 392); c.lineTo(944, 378); c.lineTo(960, 386); c.stroke();
  rr(1180, 380, 50, 92, 6, c); toon('#e63b2e', 4, c); for (let i = 0; i < 3; i++) { rr(1186, 392 + i * 26, 38, 18, 3, c); toon('#c9ced8', 3, c); }
  // вывеска команды
  rr(300, 296, 470, 64, 12, c); toon(F1_COL, 5, c);
  tex(c, 535, 330, 'КОМАНДА «ОГОНЁК»', 34, '#ffffff');
  c.save(); c.translate(328, 328); tongue0(c); c.restore();
  // знак ограничения скорости на пит-лейне
  circ(800, 400, 28, c); toon('#ffffff', 5, c); circ(800, 400, 22, c); c.lineWidth = 7; c.strokeStyle = '#e63b2e'; c.stroke(); tex(c, 800, 401, '80', 20, INK);
  // розетка для грелок шин
  socket(c, 230, 350);
  // пит-лейн
  c.fillStyle = '#6f747c'; c.fillRect(0, 470, VW, VH - 470); c.beginPath(); c.moveTo(0, 470); c.lineTo(VW, 470); c.lineWidth = 5; c.strokeStyle = INK; c.stroke();
  c.fillStyle = '#868b93'; c.fillRect(0, 474, VW, 22);
  // разметка места для пит-стопа
  c.save(); c.lineWidth = 7; c.strokeStyle = '#ffd23f'; c.strokeRect(236, 506, 720, 130);
  for (const x of [380, 820]) { c.beginPath(); c.moveTo(x - 40, 636); c.lineTo(x + 40, 636); c.moveTo(x - 40, 506); c.lineTo(x + 40, 506); c.lineWidth = 12; c.strokeStyle = '#ffffff'; c.stroke(); }
  c.setLineDash([40, 30]); c.lineWidth = 6; c.strokeStyle = '#f4efe6'; c.beginPath(); c.moveTo(0, 680); c.lineTo(VW, 680); c.stroke(); c.restore();
}
// огонёк на вывеске команды
function tongue0(c) {
  c.beginPath(); c.moveTo(0, 16); c.bezierCurveTo(-14, 6, -8, -10, 0, -22); c.bezierCurveTo(4, -10, 14, -6, 10, 6); c.quadraticCurveTo(8, 16, 0, 16); c.closePath(); toon('#ff9d1f', 3, c);
  c.beginPath(); c.moveTo(0, 14); c.bezierCurveTo(-6, 8, -4, 0, 0, -8); c.bezierCurveTo(4, 0, 6, 8, 0, 14); c.closePath(); c.fillStyle = '#ffe45c'; c.fill();
}
function f1Back(G) {
  // шнур от грелок шин к розетке
  if (G.flags.plugged) { cord(158, 426, 230, 350, -10); plugAt(230, 350); }
  else { cord(158, 426, 210, 456, 30); plugAt(214, 460); }
  f1Marshal(G, 1120, 452);
}
// стопка шин в грелках
function drawF1Tyres(it, G) {
  const k = it.char;
  for (let i = 0; i < 4; i++) {
    const y = 548 - i * 42;
    rr(70, y, 120, 44, 16); toon(mix('#2f2f33', '#1e130d', k), 5);
    rr(76, y + 12, 108, 20, 8); toon(mix('#3f7bf5', '#1e130d', k * .85), 3);
    tex(ctx, 130, y + 22, 'ГРЕЛКА', 11, k > .5 ? '#555' : '#ffffff');
  }
  // лампочка грелок
  circ(176, 432, 6); toon(G.flags.plugged ? (Math.sin(time * 6) > 0 ? '#ff5a3a' : '#ffd23f') : '#6b6b6b', 3);
}
function drawF1Spill(it) { petrolPuddle(560, 608, 150, 16, it.char); }
// сам болид, вид сбоку, нос слева
function drawF1Car(it, G) {
  const k = it.char, b = mix(F1_COL, '#1e130d', k * .85), s = mix(F1_STRIPE, '#1e130d', k * .85);
  // днище и передний антикрыл
  rr(262, 522, 650, 20, 8); toon('#2f3540', 5);
  // после аварии переднего антикрыла нет, он валяется в гравии
  if (!G.flags.crash) { rr(232, 514, 120, 16, 6); toon(b, 4); rr(226, 494, 18, 40, 5); toon(s, 4); }
  // кузов
  ctx.beginPath(); ctx.moveTo(262, 526); ctx.lineTo(266, 506); ctx.quadraticCurveTo(360, 478, 480, 466); ctx.lineTo(540, 458);
  ctx.lineTo(604, 452); ctx.lineTo(606, 398); ctx.quadraticCurveTo(640, 384, 670, 402); ctx.quadraticCurveTo(760, 440, 884, 462); ctx.lineTo(904, 476); ctx.lineTo(906, 526); ctx.closePath(); toon(b, 6);
  // полоса и номер
  ctx.beginPath(); ctx.moveTo(276, 506); ctx.quadraticCurveTo(380, 486, 520, 474); ctx.lineWidth = 7; ctx.strokeStyle = s; ctx.stroke();
  circ(420, 494, 16); toon('#ffffff', 3); tex(ctx, 420, 495, '7', 20, INK);
  // боковой понтон
  rr(600, 470, 230, 54, 24); toon(b, 5); rr(612, 488, 180, 12, 6); toon(s, 3);
  tex(ctx, 712, 512, 'ОГОНЁК', 16, k > .5 ? '#777' : '#ffffff');
  // воздухозаборник над головой пилота
  ell(624, 410, 10, 9); toon('#1b1f26', 3);
  // кокпит
  ctx.beginPath(); ctx.moveTo(540, 458); ctx.quadraticCurveTo(572, 446, 604, 452); ctx.lineWidth = 6; ctx.strokeStyle = INK; ctx.stroke();
  // кольцо «E»: внешний запуск встроенного огнетушителя
  circ(648, 446, 13); toon(G.flags.ering ? '#c9ced8' : '#ffffff', 3); tex(ctx, 648, 447, 'E', 16, '#e63b2e');
  if (G.flags.ering) { ctx.beginPath(); ctx.moveTo(648, 458); ctx.lineTo(662, 486); ctx.lineWidth = 3; ctx.strokeStyle = INK; ctx.stroke(); circ(664, 492, 7); ctx.lineWidth = 3; ctx.stroke(); }
  // антикрыло сзади
  rr(888, 372, 26, 112, 6); toon('#2f3540', 4);
  rr(868, 370, 82, 18, 6); toon(b, 4); rr(868, 396, 82, 12, 5); toon(s, 4); rr(930, 362, 26, 72, 6); toon(b, 4);
  // лампа гибридной системы на дуге
  rr(600, 370, 26, 20, 6); toon('#2f3540', 3);
  const ers = G.flags.safe ? 'safe' : G.flags.drainT != null ? 'drain' : 'on';
  const blink = Math.sin(time * (ers === 'drain' ? 14 : 7)) > 0;
  const lc = ers === 'safe' ? '#5be35b' : ers === 'drain' ? (blink ? '#ffd23f' : '#8a7a2a') : (blink ? '#ff3b2e' : '#a8231a');
  circ(613, 380, 8); toon(lc, 3);
  if (ers !== 'safe') { const t = (time * 1.4) % 1; ctx.save(); ctx.globalAlpha = (1 - t) * .8; circ(613, 380, 12 + t * 22); ctx.lineWidth = 4; ctx.strokeStyle = ers === 'on' ? '#ff3b2e' : '#ffd23f'; ctx.stroke(); ctx.restore(); }
  // колёса: широкие шины с жёлтой полосой
  for (const [wx, wy, wr] of G.flags.crash ? [[820, 528, 56]] : [[380, 532, 50], [820, 528, 56]]) {
    circ(wx, wy, wr); toon(mix('#26262a', '#1e130d', k * .5), 5);
    circ(wx, wy, wr * .72); ctx.lineWidth = 5; ctx.strokeStyle = mix(F1_STRIPE, '#3a2a20', k); ctx.stroke();
    circ(wx, wy, wr * .45); toon(mix('#9aa3ad', '#3a2a20', k * .8), 4);
    circ(wx, wy, wr * .14); toon('#ff3b2e', 3);
  }
  // раскалённый тормоз заднего колеса, пока мотор горит
  if (it.fire > 0) { circ(820, 528, 18); ctx.fillStyle = `rgba(255,${120 + Math.sin(time * 8) * 40 | 0},40,${.4 + it.fire * .5})`; ctx.fill(); }
  // снятый руль лежит на носу
  if (G.flags.wheel) { ctx.save(); ctx.translate(470, 462); ctx.rotate(-.3); rr(-18, -10, 36, 18, 6); toon('#2f3540', 3); rr(-8, -6, 16, 9, 2); toon('#5be35b', 2); ctx.restore(); }
  // искры из-под крышки мотора, пока система под током
  if (!G.flags.safe && Math.random() < .06) sparks(G, 740 + Math.random() * 80, 460, 3);
}
// пилот: в кокпите видно шлем, а когда выбирается, видно его целиком
function drawF1Pilot(G, t) {
  const x = t.x, y = t.y, here = t.state === 'here', scared = t.burn > 0 || !here;
  const bob = here && scared ? Math.abs(Math.sin(time * 12)) * 4 : 0;
  ctx.save(); ctx.translate(0, -bob);
  if (!here) {
    rr(x - 14, y + 42, 12, 34, 5); toon(F1_COL, 3); rr(x + 3, y + 42, 12, 34, 5); toon(F1_COL, 3);
    rr(x - 18, y + 72, 18, 10, 4); toon(INK, 2); rr(x + 2, y + 72, 18, 10, 4); toon(INK, 2);
    ctx.beginPath(); ctx.moveTo(x - 18, y + 22); ctx.lineTo(x - 36, y - 6); ctx.moveTo(x + 18, y + 22); ctx.lineTo(x + 38, y - 4); ctx.lineWidth = 11; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 6; ctx.strokeStyle = F1_COL; ctx.stroke();
    rr(x - 22, y + 14, 44, 36, 12); toon(F1_COL, 4); rr(x - 22, y + 26, 44, 8, 3); toon(F1_STRIPE, 2);
  } else { ell(x, y + 24, 30, 12); toon(F1_COL, 4); }
  // шлем, визор смотрит влево по ходу машины
  circ(x, y, 24); toon('#ffffff', 4);
  ctx.beginPath(); ctx.arc(x, y, 24, Math.PI * 1.15, Math.PI * 1.85); ctx.lineWidth = 7; ctx.strokeStyle = F1_STRIPE; ctx.stroke();
  rr(x - 24, y - 6, 28, 13, 6); toon('#2f3540', 3); rr(x - 18, y - 4, 10, 4, 2); ctx.fillStyle = '#9fd8f5'; ctx.fill();
  if (here) {
    // руль перед пилотом
    if (!G.flags.wheel) { rr(x - 44, y + 2, 14, 30, 5); toon('#2f3540', 3); rr(x - 42, y + 10, 10, 10, 2); toon('#5be35b', 2); }
    // защитная дуга над кокпитом
    ctx.beginPath(); ctx.moveTo(x - 38, y + 26); ctx.quadraticCurveTo(x - 26, y - 40, x + 30, y - 32); ctx.lineWidth = 13; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 7; ctx.strokeStyle = '#5a5f66'; ctx.stroke();
  }
  ctx.restore();
}

// маршал в оранжевом: держит огнетушитель, пока не отдал (G.flags.ext)
function f1Marshal(G, x, y) {
  const give = G.flags.ext;
  rr(x - 18, y + 70, 14, 52, 5); toon('#ff9d1f', 4); rr(x + 4, y + 70, 14, 52, 5); toon('#ff9d1f', 4);
  rr(x - 24, y + 116, 22, 12, 5); toon(INK, 3); rr(x + 2, y + 116, 22, 12, 5); toon(INK, 3);
  rr(x - 28, y - 4, 56, 82, 14); toon('#ff9d1f', 5); rr(x - 28, y + 30, 56, 10, 3); toon('#ffffff', 3);
  circ(x, y - 26, 21); toon('#f4cfa8', 4); ctx.beginPath(); ctx.arc(x, y - 30, 23, Math.PI, 0); ctx.closePath(); toon('#ffffff', 4);
  circ(x - 7, y - 22, 3); ctx.fillStyle = INK; ctx.fill(); circ(x + 7, y - 22, 3); ctx.fill();
  ctx.beginPath(); ctx.arc(x, y - 16, 7, .2, Math.PI - .2); ctx.lineWidth = 3; ctx.strokeStyle = INK; ctx.stroke();
  if (!give) {
    // держит огнетушитель и ждёт
    rr(x - 66, y + 14, 30, 64, 12); toon('#e63b2e', 4); rr(x - 60, y + 30, 18, 14, 3); toon('#ffffff', 2); rr(x - 58, y + 4, 14, 12, 3); toon(INK, 2);
    ctx.beginPath(); ctx.moveTo(x - 24, y + 10); ctx.lineTo(x - 44, y + 34); ctx.moveTo(x + 24, y + 10); ctx.lineTo(x - 30, y + 50); ctx.lineWidth = 11; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 6; ctx.strokeStyle = '#ff9d1f'; ctx.stroke();
  } else {
    // показывает «класс»
    ctx.beginPath(); ctx.moveTo(x + 24, y + 8); ctx.lineTo(x + 46, y - 30); ctx.moveTo(x - 24, y + 10); ctx.lineTo(x - 34, y + 50); ctx.lineWidth = 11; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 6; ctx.strokeStyle = '#ff9d1f'; ctx.stroke();
    circ(x + 48, y - 36, 9); toon('#f4cfa8', 3); rr(x + 44, y - 56, 8, 16, 4); toon('#f4cfa8', 3);
  }
}
