// ----- уровень со звёздочкой: метановый ракетный двигатель на огневом стенде, ночь -----
// Двигатель лежит на боку, сопло смотрит вправо (ось y = 280). Слева бункер с пультом.
const RK_AXIS = 340;
function bgRocket(c) {
  skyGrad(c, ['#121735', '#2b2a5c', '#6b4c7e'], 520);
  // звёзды и луна
  const r = rnd(23);
  for (let i = 0; i < 90; i++) { circ(r() * VW, r() * 330, .8 + r() * 1.8, c); c.fillStyle = `rgba(255,255,240,${.4 + r() * .6})`; c.fill(); }
  circ(1180, 74, 32, c); toon('#fff4c4', 4, c); circ(1170, 66, 7, c); c.fillStyle = '#e9dca6'; c.fill(); circ(1192, 84, 5, c); c.fill();
  // холмы на горизонте
  c.beginPath(); c.moveTo(0, 470); for (let x = 0; x <= VW; x += 80) c.quadraticCurveTo(x + 40, 430 + r() * 30, x + 80, 470); c.lineTo(VW, 540); c.lineTo(0, 540); c.closePath(); toon('#2c2650', 4, c);
  // мачта прожекторов справа
  rr(1236, 120, 14, 420, 4, c); toon('#5a5f70', 4, c);
  for (let y = 150; y < 500; y += 40) { c.beginPath(); c.moveTo(1236, y); c.lineTo(1250, y + 40); c.lineWidth = 3; c.strokeStyle = INK; c.stroke(); }
  rr(1196, 98, 80, 30, 6, c); toon('#3a4250', 4, c);
  for (const x of [1212, 1236, 1260]) { circ(x, 113, 9, c); toon('#fff8d0', 3, c); }
  // земля: бетонная площадка стенда и сухая степь
  c.fillStyle = '#5c4a3c'; c.fillRect(0, 540, VW, VH - 540);
  const g = rnd(9); for (let i = 0; i < 160; i++) { circ(860 + g() * 420, 550 + g() * 170, 2 + g() * 3, c); c.fillStyle = ['#6e5a48', '#4a3a2e'][i % 2]; c.fill(); }
  c.beginPath(); c.moveTo(0, 540); c.lineTo(870, 540); c.lineTo(830, VH); c.lineTo(0, VH); c.closePath(); toon('#8d8f98', 5, c);
  for (const x of [180, 420, 660]) { c.beginPath(); c.moveTo(x, 540); c.lineTo(x - 30, VH); c.lineWidth = 3; c.strokeStyle = 'rgba(42,26,18,.35)'; c.stroke(); }
  c.beginPath(); c.moveTo(0, 630); c.lineTo(850, 630); c.lineWidth = 3; c.strokeStyle = 'rgba(42,26,18,.35)'; c.stroke();
  // жёлто-чёрная разметка опасной зоны
  for (let x = 300; x < 840; x += 40) { c.beginPath(); c.moveTo(x, 554); c.lineTo(x + 20, 554); c.lineTo(x + 10, 568); c.lineTo(x - 10, 568); c.closePath(); c.fillStyle = '#ffd23f'; c.fill(); }
  // упорный бетонный блок стенда
  rr(290, 168, 184, 376, 8, c); toon('#a7abb3', 6, c);
  for (let y = 210; y < 540; y += 56) { c.beginPath(); c.moveTo(296, y); c.lineTo(468, y); c.lineWidth = 3; c.strokeStyle = 'rgba(42,26,18,.3)'; c.stroke(); }
  // площадка с перилами наверху
  rr(270, 156, 300, 20, 5, c); toon('#ff9d1f', 4, c);
  for (const x of [280, 360, 440, 476, 560]) { c.beginPath(); c.moveTo(x, 156); c.lineTo(x, 120); c.lineWidth = 6; c.strokeStyle = INK; c.stroke(); c.lineWidth = 3; c.strokeStyle = '#f4efe6'; c.stroke(); }
  c.beginPath(); c.moveTo(276, 120); c.lineTo(566, 120); c.lineWidth = 7; c.strokeStyle = INK; c.stroke(); c.lineWidth = 3; c.strokeStyle = '#f4efe6'; c.stroke();
  // трубы топлива сверху: метан (оранжевая полоса) и жидкий кислород (в инее)
  for (const [x, col, band] of [[520, '#c9ced8', '#ff9d1f'], [590, '#dff3ff', '#3fa9f5']]) {
    rr(x - 13, -10, 26, 282, 8, c); toon(col, 4, c);
    for (let y = 160; y < 250; y += 34) { rr(x - 15, y, 30, 10, 3, c); toon(band, 3, c); }
  }
  // иней на трубе кислорода
  for (let y = 20; y < 270; y += 22) { circ(590 + (y % 44 ? 9 : -9), y, 4, c); c.fillStyle = '#ffffff'; c.fill(); }
  tag(c, 520, 196, 'CH₄', '#ff9d1f'); tag(c, 590, 196, 'O₂', '#3fa9f5');
  // гребёнка водяного душа над двигателем
  rr(620, 206, 270, 14, 6, c); toon('#5d7fa3', 4, c); rr(876, 206, 14, 334, 6, c); toon('#5d7fa3', 4, c);
  for (let x = 640; x < 880; x += 46) { rr(x - 5, 218, 10, 10, 2, c); toon('#3a4250', 2, c); }
  // азотные баллоны: чёрные с жёлтой надписью
  for (let i = 0; i < 4; i++) {
    const x = 312 + i * 38;
    rr(x - 15, 428, 30, 116, 12, c); toon('#26262a', 4, c); rr(x - 6, 416, 12, 16, 3, c); toon('#9aa3ad', 3, c);
    c.save(); c.translate(x, 494); c.rotate(-Math.PI / 2); tex(c, 0, 0, 'АЗОТ', 13, '#ffd23f'); c.restore();
  }
  rr(296, 462, 166, 10, 4, c); toon('#9aa3ad', 3, c);
  // трубка азота к двигателю
  c.beginPath(); c.moveTo(426, 416); c.lineTo(426, 394); c.quadraticCurveTo(426, 374, 450, 374); c.lineTo(486, 374); c.lineWidth = 11; c.strokeStyle = INK; c.stroke(); c.lineWidth = 5; c.strokeStyle = '#ffd23f'; c.stroke();
  // бункер с пультом: бетон, засыпанный землёй
  ell(120, 540, 250, 70, c); toon('#4a3f5a', 5, c);
  rr(-30, 150, 300, 380, 36, c); toon('#8a8e96', 6, c);
  rr(18, 168, 226, 46, 10, c); toon('#1d2742', 5, c);
  c.beginPath(); c.moveTo(40, 206); c.lineTo(70, 176); c.moveTo(66, 206); c.lineTo(96, 176); c.lineWidth = 4; c.strokeStyle = 'rgba(255,255,255,.25)'; c.stroke();
  // пульт
  rr(14, 230, 246, 262, 16, c); toon('#3a4250', 5, c);
  rr(26, 466, 222, 18, 6, c); toon('#2f3540', 3, c);
  tex(c, 137, 476, 'ПУЛЬТ ИСПЫТАНИЙ', 12, '#c9ced8');
  for (const [x, s] of [[82, 'АЗОТ'], [196, 'ДУШ']]) tex(c, x, 384, s, 15, '#ffffff');
}
// бирка на трубе
function tag(c, x, y, s, col) { rr(x - 24, y - 13, 48, 26, 8, c); toon('#ffffff', 4, c); tex(c, x, y + 1, s, 15, col); }

// живое: пламя двигателя, клапаны, кнопки пульта
function rocketBack(G) {
  const F = G.flags, k = G.plumeK;
  // клапаны на трубах: красный открыт, зелёный закрыт
  for (const x of [520, 590]) {
    circ(x, 140, 20); toon(F.stop ? '#5be35b' : '#e63b2e', 4);
    ctx.save(); ctx.translate(x, 140); ctx.rotate(F.stop ? Math.PI / 2 : 0); rr(-4, -16, 8, 32, 3); toon('#ffffff', 2); ctx.restore();
  }
  // факел двигателя: синий у сопла, розовый дальше, ромбы скачков уплотнения
  if (k > 0) {
    const fl = 1 + Math.sin(time * 40) * .03, L = (380 + Math.sin(time * 13) * 14) * (.3 + .7 * k);
    ctx.save(); ctx.globalAlpha = k;
    ctx.beginPath(); ctx.moveTo(846, RK_AXIS - 100); ctx.quadraticCurveTo(846 + L * .5, RK_AXIS - 118 * fl, 846 + L, RK_AXIS - 40);
    ctx.quadraticCurveTo(846 + L * 1.08, RK_AXIS, 846 + L, RK_AXIS + 40); ctx.quadraticCurveTo(846 + L * .5, RK_AXIS + 118 * fl, 846, RK_AXIS + 100); ctx.closePath();
    ctx.fillStyle = 'rgba(214,110,220,.55)'; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(42,26,18,.5)'; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(846, RK_AXIS - 92); ctx.quadraticCurveTo(846 + L * .35, RK_AXIS - 80, 846 + L * .8, RK_AXIS); ctx.quadraticCurveTo(846 + L * .35, RK_AXIS + 80, 846, RK_AXIS + 92); ctx.closePath();
    ctx.fillStyle = 'rgba(110,170,255,.7)'; ctx.fill();
    for (let i = 0; i < 4; i++) {
      const x = 900 + i * 78 * (.3 + .7 * k), h = 34 - i * 6, w = 30 - i * 4;
      ctx.beginPath(); ctx.moveTo(x - w, RK_AXIS); ctx.lineTo(x, RK_AXIS - h); ctx.lineTo(x + w, RK_AXIS); ctx.lineTo(x, RK_AXIS + h); ctx.closePath();
      ctx.fillStyle = i ? 'rgba(255,240,200,.75)' : '#fff8e0'; ctx.fill();
    }
    ctx.restore();
    // отсвет на площадке
    const g = ctx.createRadialGradient(1000, 540, 20, 1000, 540, 360); g.addColorStop(0, `rgba(200,140,255,${.25 * k})`); g.addColorStop(1, 'rgba(200,140,255,0)');
    ctx.fillStyle = g; ctx.fillRect(600, 330, 680, 390);
  }
  // пульт: экран состояния
  rr(30, 244, 214, 40, 6); toon('#10261a', 3);
  const blink = Math.sin(time * 8) > 0;
  const [msg, col] = F.n2 ? ['СТЕНД БЕЗОПАСЕН', '#5be35b'] : G.purge > 0 ? ['ПРОДУВКА АЗОТОМ', '#ffd23f'] : F.stop ? ['ДВИГАТЕЛЬ ВЫКЛ', '#ffd23f'] : [blink ? 'ПОЖАР НА СТЕНДЕ!' : 'ТЯГА 100%', blink ? '#ff5a3a' : '#5be35b'];
  tex(ctx, 137, 265, msg, 17, col);
  // большая красная кнопка аварийного стопа
  const sy = 334;
  circ(137, sy, 44); toon('#ffd23f', 4);
  for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; ctx.beginPath(); ctx.moveTo(137 + Math.cos(a) * 34, sy + Math.sin(a) * 34); ctx.lineTo(137 + Math.cos(a + .3) * 44, sy + Math.sin(a + .3) * 44); ctx.lineWidth = 6; ctx.strokeStyle = INK; ctx.stroke(); }
  circ(137, sy + (F.stop ? 3 : 0), F.stop ? 28 : 32); toon(F.stop ? '#a8231a' : '#e63b2e', 4);
  if (!F.stop) { ell(127, sy - 10, 10, 6); ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.fill(); }
  tex(ctx, 137, sy + (F.stop ? 4 : 1), 'СТОП', 15, '#ffffff');
  if (!F.stop) { const t = (time * 1.2) % 1; ctx.save(); ctx.globalAlpha = (1 - t) * .8; circ(137, sy, 46 + t * 22); ctx.lineWidth = 4; ctx.strokeStyle = '#ff5a3a'; ctx.stroke(); ctx.restore(); }
  // кнопки азота и душа с лампочками
  const n2c = F.n2 ? '#5be35b' : G.purge > 0 ? (blink ? '#ffd23f' : '#8a7a2a') : '#6b6b6b';
  circ(82, 424, 30); toon(G.purge > 0 || F.n2 ? '#1b1f26' : '#2f3540', 4); tex(ctx, 82, 425, 'N₂', 22, '#ffd23f'); circ(82, 448, 6); toon(n2c, 2);
  circ(196, 424, 30); toon(G.deluge > 0 ? '#2a7ac4' : '#3fa9f5', 4);
  ctx.beginPath(); ctx.moveTo(196, 406); ctx.quadraticCurveTo(210, 424, 196, 440); ctx.quadraticCurveTo(182, 424, 196, 406); ctx.closePath(); toon('#ffffff', 3);
  circ(196, 448, 6); toon(G.deluge > 0 ? (blink ? '#3fa9f5' : '#1d4a7a') : '#6b6b6b', 2);
}
// струи водяного душа и облака азота поверх двигателя
function rocketFront(G) {
  if (G.deluge > 0) {
    ctx.save(); ctx.lineCap = 'round';
    for (let x = 640; x < 880; x += 46) for (let j = 0; j < 4; j++) {
      const y = 230 + ((time * 520 + j * 80 + x * 1.7) % 300), dx = (y - 230) * -.12;
      ctx.beginPath(); ctx.moveTo(x + dx, y); ctx.lineTo(x + dx - 3, y + 26); ctx.lineWidth = 5; ctx.strokeStyle = 'rgba(160,215,255,.85)'; ctx.stroke();
    }
    ctx.restore();
  }
}
// двигатель: агрегатная часть с турбонасосами, камера и тёмное сопло
function drawRocketEngine(it, G) {
  const k = it.char, A = RK_AXIS, run = G.plumeK;
  const steel = mix('#e4e7ec', '#1e130d', k * .8), steel2 = mix('#c9ced8', '#1e130d', k * .8), bell = mix('#2a2e36', '#140c08', k * .6);
  // крепление к блоку
  rr(462, A - 64, 24, 128, 6); toon('#3a4250', 4);
  // турбонасосы и агрегатная часть
  rr(480, A - 58, 124, 116, 20); toon(steel, 5);
  rr(492, A - 92, 96, 42, 14); toon(steel2, 4); rr(492, A + 50, 96, 42, 14); toon(steel2, 4);
  for (const y of [A - 71, A + 71]) for (const x of [512, 540, 568]) { circ(x, y, 6); toon(mix('#9aa3ad', '#1e130d', k), 2); }
  // изогнутые трубки к коллектору сопла
  for (const s of [-1, 1]) {
    ctx.beginPath(); ctx.moveTo(588, A + s * 72); ctx.bezierCurveTo(660, A + s * 110, 716, A + s * 84, 711, A + s * 48);
    ctx.lineWidth = 16; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 9; ctx.strokeStyle = steel2; ctx.stroke();
  }
  // кольцо с болтами
  rr(598, A - 48, 24, 96, 6); toon('#26262a', 4);
  for (let i = 0; i < 5; i++) { circ(610, A - 36 + i * 18, 3.5); ctx.fillStyle = '#9aa3ad'; ctx.fill(); }
  // камера сгорания
  rr(620, A - 34, 44, 68, 10); toon(steel, 4);
  // сопло Лаваля: сужение к горлу, потом колокол. Стенки колокола выпуклые: сразу за горлом раструб быстро расширяется,
  // к срезу почти выпрямляется (профиль Рао). Вогнутая «труба» тут была бы ошибкой
  ctx.beginPath(); ctx.moveTo(660, A - 34); ctx.quadraticCurveTo(668, A - 22, 676, A - 22);
  ctx.bezierCurveTo(706, A - 22, 744, A - 98, 840, A - 108); ctx.lineTo(840, A + 108);
  ctx.bezierCurveTo(744, A + 98, 706, A + 22, 676, A + 22); ctx.quadraticCurveTo(668, A + 22, 660, A + 34); ctx.closePath(); toon(bell, 6);
  ctx.beginPath(); ctx.moveTo(700, A - 30); ctx.bezierCurveTo(722, A - 46, 752, A - 88, 828, A - 96); ctx.lineWidth = 5; ctx.strokeStyle = 'rgba(255,255,255,.18)'; ctx.stroke();
  // кольцо коллектора на сопле
  rr(704, A - 50, 14, 100, 5); toon(steel2, 3);
  rr(832, A - 112, 16, 224, 6); toon(mix('#3a3f48', '#140c08', k * .6), 4);
  tex(ctx, 770, A + 6, 'Д-1', 18, mix('#ffffff', '#555555', k));
  // раскалённое горло и свечение внутри сопла, пока двигатель работает
  if (run > 0) {
    ell(842, A, 10, 100); ctx.fillStyle = `rgba(255,230,190,${.85 * run})`; ctx.fill();
    ell(676, A, 8, 22); ctx.fillStyle = `rgba(255,140,60,${.7 * run})`; ctx.fill();
  }
  // утечка: из-под турбонасоса бьют искры, пока клапаны открыты
  if (!G.flags.stop && Math.random() < .25) sparks(G, 560 + Math.random() * 40, A - 90, 2);
}
// кабельный лоток под двигателем
function drawRocketCables(it) {
  const k = it.char;
  rr(530, 430, 22, 84, 6); toon(mix('#ffd23f', '#1e130d', k * .9), 4);
  rr(470, 506, 220, 32, 8); toon(mix('#ffd23f', '#1e130d', k * .9), 5);
  for (let x = 484; x < 680; x += 26) { c0(x); }
  function c0(x) { ctx.beginPath(); ctx.moveTo(x, 508); ctx.lineTo(x + 12, 536); ctx.lineWidth = 6; ctx.strokeStyle = mix('#26262a', '#1e130d', k); ctx.stroke(); }
  for (const [y, col] of [[514, '#e63b2e'], [522, '#3fa9f5'], [530, '#7cc243']]) { ctx.beginPath(); ctx.moveTo(476, y); ctx.lineTo(684, y); ctx.lineWidth = 4; ctx.strokeStyle = mix(col, '#1e130d', k * .9); ctx.stroke(); }
  rr(470, 538, 220, 12, 4); toon('#5a5f66', 3);
}
// сухая трава в степи за стендом
function drawRocketGrass(it) {
  const k = it.char, r = rnd(31);
  for (let i = 0; i < 46; i++) {
    const x = 886 + i * 6.2 + r() * 6, h = 26 + r() * 34, y = 528 + r() * 16;
    ctx.beginPath(); ctx.moveTo(x - 6, y); ctx.quadraticCurveTo(x + (r() - .5) * 20, y - h * .6, x + (r() - .5) * 24, y - h); ctx.lineTo(x + 6, y); ctx.closePath();
    toon(mix(i % 3 ? '#d9b75a' : '#c49a3c', '#2a1a12', k * .9), 3);
  }
}
// корова, которая пасётся у полигона
function drawCow(G, t) {
  const x = t.x, y = t.y, here = t.state === 'here', scared = t.burn > 0 || !here;
  const bob = here && scared ? Math.abs(Math.sin(time * 12)) * 4 : 0, chew = here && !scared ? Math.sin(time * 6) * 2 : 0;
  ctx.save(); ctx.translate(0, -bob);
  // ноги
  for (const dx of [-38, -18, 22, 42]) { rr(x + dx - 7, y + 14, 14, 36, 5); toon('#ffffff', 3); rr(x + dx - 7, y + 42, 14, 10, 3); toon(INK, 2); }
  // хвост
  ctx.beginPath(); ctx.moveTo(x + 56, y - 14); ctx.quadraticCurveTo(x + 76, y + 4 + Math.sin(time * 4) * 8, x + 70, y + 26); ctx.lineWidth = 5; ctx.strokeStyle = INK; ctx.stroke();
  // туловище с пятнами
  ell(x + 4, y - 4, 58, 30); toon('#ffffff', 5);
  ell(x + 20, y - 12, 16, 12); ctx.fillStyle = INK; ctx.fill(); ell(x - 18, y + 4, 12, 9); ctx.fill(); ell(x + 40, y + 8, 9, 7); ctx.fill();
  ell(x + 10, y + 22, 12, 7); toon('#ff9db0', 3);
  // голова смотрит влево, на стенд
  const hx = x - 58, hy = y - 22 + (here && !scared ? 10 : 0);
  ell(hx - 4, hy - 20, 10, 6, ctx, -.4); toon('#ffffff', 3); ell(hx + 22, hy - 20, 10, 6, ctx, .4); toon('#ffffff', 3);
  ctx.beginPath(); ctx.moveTo(hx - 2, hy - 22); ctx.lineTo(hx - 8, hy - 36); ctx.moveTo(hx + 20, hy - 22); ctx.lineTo(hx + 26, hy - 36); ctx.lineWidth = 6; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 3; ctx.strokeStyle = '#f4efe6'; ctx.stroke();
  ell(hx + 9, hy, 22, 24); toon('#ffffff', 4);
  ell(hx + 9, hy + 16 + chew * .5, 18, 12); toon('#ff9db0', 4);
  circ(hx + 3, hy + 16, 3); ctx.fillStyle = INK; ctx.fill(); circ(hx + 15, hy + 16, 3); ctx.fill();
  const eo = scared ? 6 : 4; circ(hx + 1, hy - 6, eo); toon('#ffffff', 2); circ(hx + 17, hy - 6, eo); toon('#ffffff', 2);
  circ(hx + (scared ? 1 : -1), hy - 6, 2.5); ctx.fillStyle = INK; ctx.fill(); circ(hx + (scared ? 17 : 15), hy - 6, 2.5); ctx.fill();
  // колокольчик
  ctx.beginPath(); ctx.moveTo(hx + 26, y - 6); ctx.lineTo(hx + 34, y + 10); ctx.lineWidth = 3; ctx.strokeStyle = INK; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(hx + 28, y + 10); ctx.lineTo(hx + 40, y + 10); ctx.lineTo(hx + 37, y + 22); ctx.lineTo(hx + 31, y + 22); ctx.closePath(); toon('#ffd23f', 3);
  // травинка во рту, пока жуёт
  if (here && !scared) { ctx.beginPath(); ctx.moveTo(hx + 4, hy + 24); ctx.lineTo(hx - 10, hy + 34 + chew); ctx.lineWidth = 4; ctx.strokeStyle = '#7cc243'; ctx.stroke(); }
  ctx.restore();
}
