// ================== благодарность в конце миссии ==================
// После победы крупный план: спасённый, слегка закопчённый, улыбается и машет. Так каждая миссия кончается добрым делом.
// Если живое не успели вынести, оно всё равно цело (удрало само) и машет, только копоти больше, а подсказка зовёт переиграть.
// Если ценность была вещью, благодарит хозяин и держит её в руках. Без вещи хозяин просто благодарит за потушенный пожар.
//
// THANKS[id уровня] = { who, say, fled?, item? }
//   who: портрет { k: 'human' | 'cat' | 'dog' | 'hamster' | 'hedgehog' | 'bird' | 'nest' | 'cow' | 'pilot', ...цвета } или { group: [{ who, x, y, s }] }
//   say: реплика, fled: реплика, если живое удрало само, acc: кого спасать (для подсказки), item: [масштаб, сдвиг x, сдвиг y] вещи в руках хозяина

const SKIN = '#ffcfa3';
const CAT_ORANGE = { k: 'cat', fur: '#f39a3d', dark: '#d97a22', light: '#ffe2bd' };
const PEOPLE_FLED = 'Фух! Выбрался сам!';
const THANKS = {
  // Дома
  log: { who: CAT_ORANGE, say: 'Мур-р! Спасибо!' },
  teddy: { who: { k: 'hamster' }, say: 'Пи-пи! Спасибо!' },
  pan: { who: { k: 'human', hair: '#7a4a2a', style: 'bun', shirt: '#3fa9f5', apron: '#ffffff' }, say: 'Спасибо! Книга рецептов цела!', item: [1.4] },
  tree: { who: { k: 'dog', fur: '#c98d4b', ear: '#8a5a2a', light: '#f4e3c3', s: .92 }, say: 'Гав! Спасибо!' },
  candle: { who: { k: 'human', hair: '#3a2a20', style: 'long', shirt: '#9b6bd6' }, say: 'Спасибо! Все фото целы!', item: [1.5] },
  iron: { who: CAT_ORANGE, say: 'Мяу! Спасибо!' },
  balcony: { who: { k: 'nest' }, say: 'Чик-чирик! Спасибо!', fled: 'Чирик! Улетели сами!', acc: 'птенцов' },
  gas: { who: { k: 'human', hair: '#5a3a22', style: 'short', shirt: '#7a8597', mustache: '#5a3a22' }, say: 'Спасибо! Газом больше не пахнет!' },
  // Дача
  campfire: { who: { k: 'hedgehog' }, say: 'Фыр-фыр! Спасибо!' },
  grill: { who: { k: 'human', hair: '#4a3020', style: 'short', shirt: '#e63b2e', apron: '#ffffff', mustache: '#4a3020' }, say: 'Спасибо! Шашлык цел!', item: [1.3, 0, 10] },
  banya: { who: { k: 'human', skin: '#ffc3a0', style: 'bald', shirt: '#ffc3a0', towel: true, beard: '#ffffff', hat: 'banya' }, say: 'Ух! Вот спасибо!', fled: PEOPLE_FLED },
  shed: { who: { group: [
    { who: { k: 'cat', fur: '#d9a066', dark: '#b07840', light: '#fff0d8' }, x: -120, y: 40, s: .72 },
    { who: { k: 'cat', fur: '#8a8f99', dark: '#5f646e', light: '#eef0f4' }, x: 120, y: 60, s: .66 }] }, say: 'Мяу-мяу! Спасибо!', fled: 'Мяу! Удрали сами!' },
  field: { who: { group: [
    { who: { k: 'bird', body: '#ffffff', comb: true }, x: -120, y: 30, s: .78 },
    { who: { k: 'bird', body: '#d98c4a', comb: true }, x: 125, y: 55, s: .72 }] }, say: 'Ко-ко-ко! Спасибо!', fled: 'Ко-ко! Убежали сами!' },
  chimney: { who: CAT_ORANGE, say: 'Мур! Спасибо!' },
  propane: { who: { k: 'human', skin: '#ffd2b0', style: 'bun', hair: '#d9d9de', hat: 'kerchief', hatCol: '#3fa9f5', shirt: '#ff9db0', glasses: true }, say: 'Спасибо! Варенье цело!', item: [1.3] },
  veranda: { who: { k: 'dog', fur: '#d99a5c', ear: '#a86a34', light: '#f0d0a0' }, say: 'Гав-гав! Спасибо!' },
  // Город
  urn: { who: { k: 'human', hair: '#2a1a12', style: 'short', shirt: '#3fa9f5' }, say: 'Спасибо! Букет цел!', item: [1.3] },
  dumpsters: { who: { k: 'human', hair: '#a0582a', style: 'short', shirt: '#7cc243', hat: 'helmet', hatCol: '#ff9d1f', s: .9 }, say: 'Спасибо! Мой велик цел!', item: [1.05, 10, 20] },
  car: { who: { k: 'human', hair: '#c4562a', style: 'curly', shirt: '#7cc243' }, say: 'Спасибо! Покупки целы!', item: [1.25] },
  stairwell: { who: { k: 'human', skin: '#f4cfa8', style: 'bun', hair: '#d9d9de', shirt: '#7a5aa8', scarf: '#e63b2e', glasses: true }, say: 'Спасибо, спасатель!', fled: PEOPLE_FLED },
  cafe: { who: { k: 'human', hair: '#3a2a20', style: 'short', shirt: '#ffffff', hat: 'toque', mustache: '#3a2a20' }, say: 'Спасибо! Торт цел!', item: [1.2] },
  scooter: { who: { k: 'bird', body: '#5fd35a', parrot: true }, say: 'Кеша хор-роший! Спасибо!', fled: 'Кеша улетел сам!' },
  poplar: { who: { k: 'human', hair: '#e8b04a', style: 'pigtails', shirt: '#ff7b9c', s: .86 }, say: 'Спасибо! Мой зайка цел!', item: [1.4] },
  courtyard: { who: CAT_ORANGE, say: 'Мур-р! Спасибо!' },
  // Транспорт
  moped: { who: { k: 'human', hair: '#2a1a12', style: 'short', shirt: '#ffd23f', hat: 'cap', hatCol: '#e63b2e' }, say: 'Спасибо! Пицца доедет горячей!', item: [1.2] },
  bus: { who: { group: [
    { who: { k: 'human', hair: '#7a4a2a', style: 'bun', shirt: '#7cc243' }, x: -190, y: 40, s: .72 },
    { who: { k: 'human', hair: '#e8b04a', style: 'pigtails', shirt: '#ff7b9c' }, x: 10, y: 120, s: .6 },
    { who: { k: 'human', hair: '#2a1a12', style: 'short', shirt: '#3fa9f5', hat: 'cap', hatCol: '#2f3540' }, x: 200, y: 30, s: .74 }] }, say: 'Спасибо! Все целы!', fled: 'Фух! Выбрались сами!' },
  trolley: { who: { k: 'human', hair: '#f0c860', style: 'long', shirt: '#2f3540', glasses: true }, say: 'Спасибо! Скрипка цела!', item: [1.3] },
  boat: { who: { k: 'human', skin: '#ffcc99', hair: '#7a4a2a', style: 'short', shirt: '#3fa9f5', vest: '#ff9d1f', hat: 'cap', hatCol: '#7cc243', beard: '#7a4a2a' }, say: 'Спасибо! Я цел!', fled: PEOPLE_FLED },
  train: { who: { k: 'human', hair: '#3a2a20', style: 'curly', shirt: '#ff9d1f' }, say: 'Спасибо! Гитара цела!', item: [1, 0, 50] },
  plane: { who: { k: 'human', hair: '#7a4a2a', style: 'short', shirt: '#3fa9f5', s: .86 }, say: 'Спасибо! Слонёнок цел!', item: [1.4] },
  fuel: { who: { k: 'dog', fur: '#d9a066', ear: '#7a4a2a', light: '#f4e2c4' }, say: 'Гав! Спасибо!' },
  station: { who: { k: 'human', hair: '#5a3a22', style: 'short', shirt: '#2b6cb0', hat: 'cap', hatCol: '#2b6cb0', mustache: '#5a3a22' }, say: 'Спасибо! Посылки дойдут!', item: [1] },
  // со звёздочкой
  f1: { who: { k: 'pilot', suit: F1_COL, helmet: '#e63b2e' }, say: 'Спасибо, команда!', fled: PEOPLE_FLED },
  f1crash: { who: { k: 'pilot', suit: F1_COL, helmet: '#e63b2e' }, say: 'Спасибо, команда!', fled: PEOPLE_FLED },
  rocket: { who: { k: 'cow' }, say: 'Му-у! Спасибо!' },
};

function thxStart(G) {
  const L = G.L, T = L.treasure, tr = G.tr, E = THANKS[L.id] || { who: { k: 'human', hair: '#5a3a22', style: 'short', shirt: '#3fa9f5' }, say: 'Спасибо!' };
  const saved = !tr || tr.state === 'saved' || tr.state === 'flying';
  let say = E.say, hint = '', soot = .5, item = null;
  if (T && !saved) {
    // живое цело, просто удрало само; вещь пропала, но хозяин всё равно рад, что пожар потушен
    if (T.flee) { say = E.fled || 'Фух! Удрал сам!'; soot = 1; hint = tl('Попробуй спасти {0} сразу', E.acc || T.acc); }
    else { say = 'Спасибо! Пожар потушен!'; hint = tl('А {0} можно было спасти', T.acc); }
  } else if (T && !T.flee) item = { T, fit: E.item || [1] };
  G.thx = { t0: time, who: E.who, say: tl(say), hint, soot, item };
}

// ---------- детали портрета (координаты от центра головы, голова человека ~100) ----------
function thxEyes(y, dx, r, ph) {
  const c = (time + ph) % 3.4, squint = c > 2.3 && c < 3.1, blink = c > 1.1 && c < 1.24;
  ctx.strokeStyle = INK; ctx.lineCap = 'round';
  for (const s of [-1, 1]) {
    const x = s * dx;
    if (squint) { ctx.lineWidth = r * .45; ctx.beginPath(); ctx.arc(x, y + r * .5, r * .85, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke(); }
    else if (blink) { ctx.lineWidth = r * .4; ctx.beginPath(); ctx.moveTo(x - r * .8, y); ctx.lineTo(x + r * .8, y); ctx.stroke(); }
    else {
      ell(x, y, r * .82, r); toon('#ffffff', r * .3);
      circ(x + Math.sin(time * .7) * r * .1, y + r * .12, r * .55); ctx.fillStyle = INK; ctx.fill();
      circ(x - r * .18, y - r * .14, r * .2); ctx.fillStyle = '#ffffff'; ctx.fill();
    }
  }
}
function thxMouth(x, y, w) {
  const h = w * (.62 + .1 * Math.sin(time * 5));
  const path = () => { ctx.beginPath(); ctx.moveTo(x - w, y); ctx.quadraticCurveTo(x, y - w * .12, x + w, y); ctx.quadraticCurveTo(x + w * .9, y + h * 1.6, x, y + h * 1.6); ctx.quadraticCurveTo(x - w * .9, y + h * 1.6, x - w, y); ctx.closePath(); };
  path(); ctx.fillStyle = '#8a2a22'; ctx.fill();
  ctx.save(); path(); ctx.clip(); ell(x, y + h * 1.55, w * .6, h * .55); ctx.fillStyle = '#ff7b8a'; ctx.fill(); rr(x - w * .55, y - 4, w * 1.1, w * .22, 4); ctx.fillStyle = '#ffffff'; ctx.fill(); ctx.restore();
  path(); ctx.lineWidth = Math.max(4, w * .16); ctx.strokeStyle = INK; ctx.lineJoin = 'round'; ctx.stroke();
}
function thxBlush(dx, y, r) { ctx.fillStyle = 'rgba(255,110,120,.38)'; for (const s of [-1, 1]) { ell(s * dx, y, r, r * .6); ctx.fill(); } }
// копоть: пятна сажи на лице и лёгкий дымок над головой
function thxSoot(spots, amt) {
  ctx.fillStyle = `rgba(52,40,36,${.42 * amt})`;
  for (const [x, y, rx, ry, rot] of spots) { ell(x, y, rx, ry, ctx, rot || 0); ctx.fill(); }
  ctx.fillStyle = `rgba(52,40,36,${.6 * amt})`;
  for (const [x, y, rx] of spots) { circ(x + rx * .5, y - 3, 3.5); ctx.fill(); circ(x - rx * .4, y + 4, 2.5); ctx.fill(); }
}
function thxWisps(x, y, amt) {
  for (let i = 0; i < 3; i++) {
    const k = (time * .55 + i / 3) % 1, wx = x + (i - 1) * 34 + Math.sin(k * 6 + i) * 14, wy = y - k * 120;
    ctx.globalAlpha = (1 - k) * .55 * amt; circ(wx, wy, 12 + k * 22); ctx.fillStyle = '#8d8a92'; ctx.fill();
  }
  ctx.globalAlpha = 1;
}
// машущая рука (лапа, крыло, копыто): плечо в (sx, sy), качается из стороны в сторону
function thxArm(sx, sy, len, w, col, end, ph, endCol, dir = 1) {
  const ang = dir * (.4 + Math.sin(time * 9 + ph) * .36);
  const ex = sx + Math.sin(ang) * len, ey = sy - Math.cos(ang) * len, mx = sx + dir * len * .55, my = sy - len * .2;
  ctx.beginPath(); ctx.moveTo(sx, sy); ctx.quadraticCurveTo(mx, my, ex, ey); ctx.lineCap = 'round';
  ctx.lineWidth = w + 12; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = w; ctx.strokeStyle = col; ctx.stroke();
  ctx.save(); ctx.translate(ex, ey); ctx.rotate(ang);
  const r = w * .78;
  if (end === 'hand') {
    for (let i = 0; i < 4; i++) {
      const a = -.48 + i * .32, fx = Math.sin(a) * r * 1.5, fy = -Math.cos(a) * r * 1.5;
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(fx, fy); ctx.lineWidth = r * .62 + 10; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = r * .62; ctx.strokeStyle = endCol; ctx.stroke();
    }
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-dir * r * 1.15, -r * .25); ctx.lineWidth = r * .62 + 10; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = r * .62; ctx.strokeStyle = endCol; ctx.stroke();
    circ(0, 0, r); toon(endCol, 5);
  } else if (end === 'paw') {
    circ(0, 0, r); toon(endCol, 5);
    ctx.fillStyle = '#ff9db0'; ell(0, r * .18, r * .42, r * .34); ctx.fill();
    for (const a of [-.7, 0, .7]) { circ(Math.sin(a) * r * .55, -Math.cos(a) * r * .5, r * .16); ctx.fill(); }
  } else if (end === 'wing') {
    ell(0, -r * .4, r * .75, r * 1.5); toon(endCol, 5);
    ctx.beginPath(); for (const a of [-.35, 0, .35]) { ctx.moveTo(0, r * .5); ctx.lineTo(Math.sin(a) * r * .9, -r * 1.3); } ctx.lineWidth = 3.5; ctx.strokeStyle = INK; ctx.stroke();
  } else if (end === 'hoof') {
    circ(0, 0, r); toon(endCol, 5); rr(-r * .8, -r * 1.1, r * 1.6, r * .8, r * .3); toon('#3a2a24', 5);
    ctx.beginPath(); ctx.moveTo(0, -r * 1.1); ctx.lineTo(0, -r * .35); ctx.lineWidth = 4; ctx.strokeStyle = '#7a6a60'; ctx.stroke();
  }
  ctx.restore();
  // чёрточки движения
  ctx.globalAlpha = .5; ctx.lineWidth = 5; ctx.strokeStyle = '#ffffff'; ctx.lineCap = 'round';
  for (const k of [1.25, 1.45]) { ctx.beginPath(); ctx.arc(sx, sy, len * k, -Math.PI / 2 + dir * .15, -Math.PI / 2 + dir * .95, dir < 0); ctx.stroke(); }
  ctx.globalAlpha = 1;
}

// ---------- портреты ----------
function thxHuman(w, ph, X) {
  const skin = w.skin || SKIN, sh = w.shirt || '#3fa9f5';
  // туловище
  ctx.beginPath(); ctx.moveTo(-180, 460); ctx.quadraticCurveTo(-185, 160, -62, 128); ctx.lineTo(62, 128); ctx.quadraticCurveTo(185, 160, 180, 460); ctx.closePath(); toon(sh, 7);
  if (w.apron) { rr(-85, 175, 170, 300, 34); toon(w.apron, 6); ctx.beginPath(); ctx.moveTo(-60, 175); ctx.lineTo(-40, 128); ctx.moveTo(60, 175); ctx.lineTo(40, 128); ctx.lineWidth = 6; ctx.stroke(); }
  if (w.vest) for (const s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(s * 30, 150); ctx.lineTo(s * 150, 175); ctx.lineTo(s * 165, 470); ctx.lineTo(s * 40, 470); ctx.closePath(); toon(w.vest, 6); rr(s * 102 - 22, 300, 44, 14, 6); toon('#ffffff', 4); }
  if (w.towel) { ctx.beginPath(); ctx.moveTo(-150, 190); ctx.quadraticCurveTo(-60, 120, 30, 140); ctx.lineTo(70, 170); ctx.quadraticCurveTo(-40, 170, -120, 280); ctx.closePath(); toon('#ffffff', 6); }
  if (w.hat === 'pilot') { rr(-36, 128, 72, 30, 10); toon(F1_STRIPE, 5); }
  // шея и рука
  rr(-30, 78, 60, 62, 22); toon(skin, 6);
  if (w.scarf) { ell(0, 136, 92, 30); toon(w.scarf, 6); }
  thxArm(150, 185, 200, 50, sh, 'hand', ph, skin);
  // волосы сзади
  if (w.style === 'long') for (const s of [-1, 1]) { ell(s * 96, 40, 46, 120, ctx, s * -.12); toon(w.hair, 6); }
  if (w.style === 'pigtails') for (const s of [-1, 1]) { ell(s * 128, 20, 38, 58, ctx, s * -.3); toon(w.hair, 6); circ(s * 108, -22, 14); toon('#e63b2e', 4); }
  if (w.hat === 'pilot') {
    circ(0, -6, 132); toon('#ffffff', 7);
    ctx.beginPath(); ctx.arc(0, -6, 132, Math.PI * 1.12, Math.PI * 1.88); ctx.lineWidth = 22; ctx.strokeStyle = F1_STRIPE; ctx.stroke(); ctx.beginPath(); ctx.arc(0, -6, 132, 0, Math.PI * 2); ctx.lineWidth = 7; ctx.strokeStyle = INK; ctx.stroke();
    ell(0, 14, 92, 98); toon('#2f3540', 6); // поднятый визор открывает лицо
  } else for (const s of [-1, 1]) { circ(s * 100, 12, 22); toon(skin, 6); }
  // голова
  if (w.hat === 'pilot') { ell(0, 18, 80, 86); toon(skin, 6); } else { ell(0, 0, 100, 108); toon(skin, 7); }
  // волосы сверху
  if (w.style && w.style !== 'bald' && w.hat !== 'pilot') {
    if (w.style === 'bun') { circ(0, -112, 40); toon(w.hair, 6); }
    ctx.beginPath(); ctx.ellipse(0, -10, 106, 104, 0, Math.PI, Math.PI * 2);
    if (w.style === 'curly') { for (let i = 0; i <= 8; i++) { const a = -i / 8 * Math.PI; ctx.lineTo(Math.cos(a) * 106, -10 + Math.sin(a) * 104); } ctx.closePath(); toon(w.hair, 6); for (let i = 0; i < 9; i++) { const a = Math.PI + (i + .5) / 9 * Math.PI; circ(Math.cos(a) * 92, -14 + Math.sin(a) * 92, 26); toon(w.hair, 5); } }
    else if (w.style === 'short') { for (const [x, y] of [[84, -42], [52, -58], [22, -40], [-12, -62], [-48, -44], [-80, -52], [-106, -10]]) ctx.lineTo(x, y); ctx.closePath(); toon(w.hair, 6); }
    else { ctx.quadraticCurveTo(10, -80, -106, -10); ctx.closePath(); toon(w.hair, 6); }
  }
  if (w.style === 'bald') { for (const s of [-1, 1]) { ell(s * 92, -20, 18, 30); toon('#ffffff', 5); } }
  // головные уборы
  const hc = w.hatCol || '#e63b2e';
  if (w.hat === 'cap') { ctx.beginPath(); ctx.ellipse(0, -28, 108, 88, 0, Math.PI, Math.PI * 2); ctx.closePath(); toon(hc, 6); ell(0, -30, 122, 22); toon(hc, 6); circ(0, -114, 9); toon(hc, 4); }
  if (w.hat === 'helmet') { ctx.beginPath(); ctx.ellipse(0, -30, 118, 96, 0, Math.PI, Math.PI * 2); ctx.closePath(); toon(hc, 6); for (const x of [-50, 0, 50]) { rr(x - 9, -110, 18, 50, 9); toon('#2f3540', 4); } ell(0, -30, 120, 14); toon('#2f3540', 5); }
  if (w.hat === 'toque') { rr(-78, -118, 156, 70, 18); toon('#ffffff', 6); for (const [x, y, r] of [[-50, -150, 48], [50, -150, 48], [0, -180, 56]]) { circ(x, y, r); toon('#ffffff', 6); } rr(-80, -100, 160, 50, 16); toon('#ffffff', 6); }
  if (w.hat === 'banya') { ctx.beginPath(); ctx.moveTo(-80, -70); ctx.quadraticCurveTo(-70, -168, 0, -170); ctx.quadraticCurveTo(70, -168, 80, -70); ctx.closePath(); toon('#e8d2a6', 6); ell(0, -68, 135, 28); toon('#e8d2a6', 6); }
  if (w.hat === 'kerchief') {
    ctx.beginPath(); ctx.ellipse(0, -8, 114, 112, 0, Math.PI * .95, Math.PI * 2.05); ctx.quadraticCurveTo(60, -50, 0, -56); ctx.quadraticCurveTo(-60, -50, -113, 2); ctx.closePath(); toon(hc, 6);
    ctx.fillStyle = '#ffffff'; for (const [x, y] of [[-60, -70], [-10, -98], [45, -78], [-30, -40], [75, -30], [5, -64]]) { circ(x, y, 7); ctx.fill(); }
  }
  // лицо
  const ey = w.hat === 'pilot' ? 8 : -4;
  if (!w.glasses) { ctx.lineWidth = 6; ctx.strokeStyle = w.hair && w.style !== 'bald' ? w.hair : '#b08c70'; ctx.lineCap = 'round'; for (const s of [-1, 1]) { ctx.beginPath(); ctx.arc(s * 38, ey - 10, 22, Math.PI * 1.25, Math.PI * 1.75); ctx.stroke(); } }
  thxEyes(ey, 38, 16, ph);
  if (w.glasses) { ctx.lineWidth = 5; ctx.strokeStyle = INK; for (const s of [-1, 1]) { circ(s * 38, ey, 27); ctx.stroke(); } ctx.beginPath(); ctx.moveTo(-11, ey); ctx.lineTo(11, ey); ctx.stroke(); }
  ell(0, 30, 14, 11); toon('#f2a882', 4);
  thxBlush(62, 40, 18);
  if (w.beard) { ctx.beginPath(); ctx.moveTo(-96, 18); ctx.quadraticCurveTo(-100, 150, 0, 170); ctx.quadraticCurveTo(100, 150, 96, 18); ctx.quadraticCurveTo(60, 90, 0, 88); ctx.quadraticCurveTo(-60, 90, -96, 18); ctx.closePath(); toon(w.beard, 6); }
  thxMouth(0, 56, 34);
  if (w.mustache || w.beard) { const mc = w.mustache || w.beard; for (const s of [-1, 1]) { ell(s * 24, 50, 28, 13, ctx, s * -.25); toon(mc, 5); } }
  thxSoot([[-58, 70, 22, 13, .3], [48, -52, 26, 14, -.2], [12, 36, 9, 6]], X.soot);
  if (w.hat !== 'pilot') thxWisps(20, -120, X.soot);
}

// гонщик: настоящий закрытый шлем с поднятым визором, балаклава, комбинезон команды и HANS на плечах
function thxPilot(w, ph, X) {
  const suit = w.suit || F1_COL, hc = w.helmet || '#e63b2e', glove = '#f4efe6';
  // комбинезон
  ctx.beginPath(); ctx.moveTo(-180, 460); ctx.quadraticCurveTo(-185, 160, -62, 128); ctx.lineTo(62, 128); ctx.quadraticCurveTo(185, 160, 180, 460); ctx.closePath(); toon(suit, 7);
  ctx.save(); ctx.beginPath(); ctx.moveTo(-180, 460); ctx.quadraticCurveTo(-185, 160, -62, 128); ctx.lineTo(62, 128); ctx.quadraticCurveTo(185, 160, 180, 460); ctx.closePath(); ctx.clip();
  for (const s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(s * 175, 250); ctx.lineTo(s * 60, 470); ctx.lineWidth = 30; ctx.strokeStyle = F1_STRIPE; ctx.stroke(); ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.beginPath(); ctx.moveTo(s * 175 - 13, 243); ctx.lineTo(s * 60 - 13, 463); ctx.moveTo(s * 175 + 13, 257); ctx.lineTo(s * 60 + 13, 477); ctx.stroke(); }
  ctx.restore();
  ctx.beginPath(); ctx.moveTo(0, 150); ctx.lineTo(0, 460); ctx.lineWidth = 5; ctx.strokeStyle = INK; ctx.stroke();
  // нашивки спонсоров
  rr(-150, 300, 96, 34, 8); toon('#ffffff', 5); tex(ctx, -102, 318, 'ОГОНЁК', 18, '#e63b2e');
  rr(48, 300, 78, 30, 8); toon('#3fa9f5', 5); tex(ctx, 87, 316, '7', 22, '#ffffff');
  // HANS: карбоновая подкова на плечах и ремешки к шлему
  for (const s of [-1, 1]) { ell(s * 108, 158, 66, 24, ctx, s * .32); toon('#2f3540', 6); }
  rr(-64, 118, 128, 30, 12); toon('#2f3540', 6);
  thxArm(150, 185, 200, 50, suit, 'hand', ph, glove);
  // шлем
  const shell = () => { ctx.beginPath(); ctx.moveTo(-122, 104); ctx.bezierCurveTo(-152, 30, -150, -172, 0, -174); ctx.bezierCurveTo(150, -172, 152, 30, 122, 104); ctx.quadraticCurveTo(108, 136, 58, 138); ctx.lineTo(-58, 138); ctx.quadraticCurveTo(-108, 136, -122, 104); ctx.closePath(); };
  rr(-30, -194, 60, 28, 10); toon('#2f3540', 5); // воздухозаборник сверху
  shell(); toon(hc, 7);
  ctx.save(); shell(); ctx.clip();
  // ливрея: белая волна и жёлтый кант, блик
  ctx.beginPath(); ctx.moveTo(-160, -40); ctx.quadraticCurveTo(-60, -150, 160, -150); ctx.lineTo(160, -200); ctx.lineTo(-160, -200); ctx.closePath(); ctx.fillStyle = '#ffffff'; ctx.fill();
  ctx.beginPath(); ctx.moveTo(-160, -40); ctx.quadraticCurveTo(-60, -150, 160, -150); ctx.lineWidth = 14; ctx.strokeStyle = F1_STRIPE; ctx.stroke(); ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-160, 60); ctx.quadraticCurveTo(0, 30, 160, 60); ctx.lineWidth = 12; ctx.strokeStyle = '#ffffff'; ctx.stroke();
  ctx.restore();
  shell(); ctx.lineWidth = 7; ctx.strokeStyle = INK; ctx.stroke();
  ctx.save(); ctx.globalAlpha = .45; ell(-78, -112, 42, 16, ctx, -.7); ctx.fillStyle = '#ffffff'; ctx.fill(); ctx.restore();
  // проём: балаклава из несгораемой ткани, видны только глаза
  rr(-102, -50, 204, 86, 34); toon('#2f3540', 6);
  rr(-90, -40, 180, 66, 28); toon('#f1ede4', 4);
  rr(-74, -31, 148, 46, 20); toon(w.skin || SKIN, 4);
  ctx.lineWidth = 5; ctx.strokeStyle = '#6a4a32'; ctx.lineCap = 'round';
  for (const s of [-1, 1]) { ctx.beginPath(); ctx.arc(s * 34, -6, 18, Math.PI * 1.3, Math.PI * 1.7); ctx.stroke(); }
  thxEyes(-6, 34, 11, ph);
  // щёки приподняты: улыбается под подбородником
  ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(42,26,18,.55)';
  for (const s of [-1, 1]) { ctx.beginPath(); ctx.arc(s * 34, 22, 14, Math.PI * 1.2, Math.PI * 1.8); ctx.stroke(); }
  // поднятый тонированный визор и его оси
  rr(-114, -100, 228, 50, 24); ctx.fillStyle = 'rgba(58,74,104,.85)'; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = INK; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-80, -86); ctx.lineTo(40, -86); ctx.lineWidth = 6; ctx.strokeStyle = 'rgba(255,255,255,.45)'; ctx.stroke();
  rr(-130, -82, 22, 16, 5); toon('#ffffff', 4); // язычок отрывной плёнки
  for (const s of [-1, 1]) { circ(s * 122, -50, 14); toon('#9aa3ad', 5); circ(s * 122, -50, 4); ctx.fillStyle = INK; ctx.fill(); }
  // подбородник: вентиляция и наклейка команды
  for (const s of [-1, 1]) { rr(s * 52 - 16, 50, 32, 12, 6); toon('#2f3540', 4); }
  rr(-64, 78, 128, 32, 10); toon('#ffffff', 5); tex(ctx, 0, 95, 'ОГОНЁК', 22, '#e63b2e');
  thxSoot([[-96, 60, 24, 13, .3], [76, -128, 24, 11, -.2], [40, 118, 12, 7]], X.soot);
}
function thxCat(w, ph, X) {
  // хвост виляет
  const tw = Math.sin(time * 4 + ph) * 30;
  ctx.beginPath(); ctx.moveTo(-110, 330); ctx.quadraticCurveTo(-250, 260, -210 + tw, 120); ctx.lineCap = 'round'; ctx.lineWidth = 46; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 34; ctx.strokeStyle = w.fur; ctx.stroke();
  ell(0, 280, 155, 170); toon(w.fur, 7); ell(0, 300, 88, 120); ctx.fillStyle = w.light; ctx.fill();
  thxArm(115, 190, 165, 52, w.fur, 'paw', ph, w.light);
  for (const s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(s * 38, -80); ctx.lineTo(s * 98, -132); ctx.lineTo(s * 108, -30); ctx.closePath(); toon(w.fur, 6); ctx.beginPath(); ctx.moveTo(s * 56, -74); ctx.lineTo(s * 92, -108); ctx.lineTo(s * 96, -52); ctx.closePath(); ctx.fillStyle = '#ff9db0'; ctx.fill(); }
  ell(0, 0, 122, 104); toon(w.fur, 7);
  ctx.lineWidth = 9; ctx.strokeStyle = w.dark; ctx.lineCap = 'round';
  for (const x of [-26, 0, 26]) { ctx.beginPath(); ctx.moveTo(x, -98); ctx.lineTo(x * .8, -66); ctx.stroke(); }
  ctx.fillStyle = w.light; ell(-28, 44, 34, 26); ctx.fill(); ell(28, 44, 34, 26); ctx.fill();
  thxEyes(-14, 46, 19, ph);
  ctx.beginPath(); ctx.moveTo(-13, 24); ctx.lineTo(13, 24); ctx.lineTo(0, 38); ctx.closePath(); toon('#ff7b9c', 4);
  thxMouth(0, 54, 24);
  ctx.lineWidth = 4; ctx.strokeStyle = INK; for (const s of [-1, 1]) for (const k of [-1, 0, 1]) { ctx.beginPath(); ctx.moveTo(s * 64, 44 + k * 8); ctx.lineTo(s * 128, 34 + k * 18); ctx.stroke(); }
  thxBlush(74, 22, 16);
  thxSoot([[-70, 10, 24, 15, .3], [56, -58, 24, 14, -.2], [-40, 230, 30, 20], [64, 340, 26, 16]], X.soot);
  thxWisps(0, -110, X.soot);
}

function thxDog(w, ph, X) {
  const tw = Math.sin(time * 14 + ph) * .5; // хвост виляет быстро: рад
  ctx.save(); ctx.translate(-130, 330); ctx.rotate(-.6 + tw); rr(-16, -150, 32, 150, 16); toon(w.fur, 6); ctx.restore();
  ell(0, 285, 158, 168); toon(w.fur, 7); ell(0, 310, 90, 120); ctx.fillStyle = w.light; ctx.fill();
  rr(-82, 108, 164, 30, 14); toon('#e63b2e', 5); circ(0, 150, 18); toon('#ffd23f', 4);
  thxArm(118, 200, 160, 52, w.fur, 'paw', ph, w.light);
  ell(0, 0, 114, 106); toon(w.fur, 7);
  for (const s of [-1, 1]) { ell(s * 108, 20, 36, 74, ctx, s * .28 + Math.sin(time * 7 + s) * .06); toon(w.ear, 6); }
  ell(0, 50, 62, 44); toon(w.light, 6);
  thxEyes(-18, 42, 18, ph);
  ell(0, 26, 22, 15); toon(INK, 3); circ(-6, 22, 5); ctx.fillStyle = '#ffffff'; ctx.fill();
  thxMouth(0, 56, 26);
  rr(-14, 78, 28, 38 + Math.sin(time * 10) * 4, 12); toon('#ff7b8a', 4);
  thxBlush(70, 36, 15);
  thxSoot([[-62, -6, 22, 14, .3], [44, -60, 24, 14, -.2], [40, 240, 30, 18]], X.soot);
  thxWisps(0, -110, X.soot);
}

function thxHamster(w, ph, X) {
  ell(0, 150, 175, 190); toon('#e8a860', 7);
  ell(0, 90, 112, 110); ctx.fillStyle = '#fff3df'; ctx.fill();
  for (const s of [-1, 1]) { circ(s * 92, -40, 32); toon('#e8a860', 6); circ(s * 92, -40, 17); ctx.fillStyle = '#f1b8a0'; ctx.fill(); }
  thxArm(118, 180, 120, 38, '#e8a860', 'paw', ph, '#fff3df');
  for (const s of [-1, 1]) { ell(s * 82, 86, 40, 32); ctx.fillStyle = 'rgba(241,184,160,.8)'; ctx.fill(); }
  thxEyes(28, 48, 16, ph);
  ell(0, 66, 12, 9); toon('#ff7b9c', 3);
  thxMouth(0, 84, 20);
  rr(-11, 82, 10, 14, 3); toon('#ffffff', 3); rr(1, 82, 10, 14, 3); toon('#ffffff', 3);
  thxSoot([[-60, 0, 24, 14, .3], [50, -24, 22, 13, -.2], [60, 240, 28, 18]], X.soot);
  thxWisps(0, -70, X.soot);
}

function thxHedgehog(w, ph, X) {
  ctx.beginPath(); const N = 30;
  for (let i = 0; i <= N * 2; i++) { const a = Math.PI * .72 + i / (N * 2) * Math.PI * 1.56, r = i % 2 ? 230 : 175; ctx.lineTo(Math.cos(a) * r, 70 + Math.sin(a) * r); }
  ctx.closePath(); toon('#6e5238', 7);
  ell(0, 300, 140, 140); toon('#e8c49a', 7);
  thxArm(110, 230, 140, 44, '#e8c49a', 'paw', ph, '#e8c49a');
  for (const s of [-1, 1]) { circ(s * 78, -62, 22); toon('#e8c49a', 5); }
  ell(0, 26, 108, 98); toon('#e8c49a', 7);
  ell(0, 66, 44, 32); toon('#e8c49a', 5); circ(0, 50, 15); toon(INK, 3);
  thxEyes(0, 42, 16, ph);
  thxMouth(0, 86, 20);
  thxBlush(66, 46, 15);
  thxSoot([[-58, 10, 22, 14, .3], [44, -30, 22, 13, -.2]], X.soot);
  thxWisps(0, -120, X.soot);
}

function thxBird(w, ph, X) {
  const body = w.body;
  ell(0, 150, 150, 175); toon(body, 7);
  if (w.parrot) { ctx.save(); ctx.translate(0, 300); rr(-40, 0, 80, 170, 30); toon('#3fa9f5', 6); ctx.restore(); ell(0, 160, 150, 175); toon(body, 7); }
  ell(0, 190, 80, 110); ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.fill();
  thxArm(112, 160, 150, 46, body, 'wing', ph, w.parrot ? '#3fa9f5' : body);
  if (w.comb) { for (const [x, y] of [[-26, -102], [6, -116], [36, -100]]) { circ(x, y, 26); toon('#e63b2e', 5); } }
  if (w.parrot) { for (const a of [-.4, 0, .4]) { ctx.save(); ctx.translate(0, -90); ctx.rotate(a + Math.sin(time * 6) * .08); ell(0, -40, 16, 46); toon('#ffd23f', 5); ctx.restore(); } }
  ell(0, 0, 104, 100); toon(body, 7);
  if (w.parrot) { for (const s of [-1, 1]) { ell(s * 62, 30, 26, 20); ctx.fillStyle = '#ff9f1c'; ctx.fill(); } }
  thxEyes(-12, 42, 17, ph);
  // клюв приоткрыт в улыбке
  const op = 8 + Math.sin(time * 6) * 4;
  ctx.beginPath(); ctx.moveTo(-26, 26); ctx.quadraticCurveTo(0, 14, 26, 26); ctx.quadraticCurveTo(10, 54, 0, w.parrot ? 70 : 58); ctx.quadraticCurveTo(-10, 54, -26, 26); ctx.closePath(); toon(w.parrot ? '#ffd23f' : '#ff9f1c', 5);
  ctx.beginPath(); ctx.moveTo(-18, 46 + op); ctx.quadraticCurveTo(0, 40 + op, 18, 46 + op); ctx.quadraticCurveTo(0, 66 + op, -18, 46 + op); ctx.closePath(); toon(w.parrot ? '#c08552' : '#ff9f1c', 5);
  if (w.comb) { ell(0, 96 + op, 14, 22); toon('#e63b2e', 4); }
  thxBlush(66, 36, 16);
  thxSoot([[-58, -6, 22, 13, .3], [46, -58, 24, 14, -.2], [50, 220, 28, 16]], X.soot);
  thxWisps(0, -120, X.soot);
}

function thxNest(w, ph, X) {
  // три птенца в гнезде, мама-птица машет крылом сверху
  thxBird({ body: '#8a6a4a' }, ph, X);
  ctx.save(); ctx.translate(0, 120);
  [[-150, 60, .52, 1.3], [150, 70, .5, 2.1], [0, 90, .56, .6]].forEach(([x, y, s, p]) => { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); thxBird({ body: '#ffd23f' }, p, X); ctx.restore(); });
  ctx.beginPath(); ctx.moveTo(-300, 140); ctx.quadraticCurveTo(-300, 330, 0, 330); ctx.quadraticCurveTo(300, 330, 300, 140); ctx.quadraticCurveTo(0, 190, -300, 140); ctx.closePath(); toon('#a8763e', 7);
  ctx.lineWidth = 5; ctx.strokeStyle = '#7a5428'; for (let i = 0; i < 9; i++) { ctx.beginPath(); ctx.moveTo(-260 + i * 64, 180 + (i % 2) * 20); ctx.quadraticCurveTo(-230 + i * 64, 240, -280 + i * 64 + 90, 270); ctx.stroke(); }
  ctx.restore();
}

function thxCow(w, ph, X) {
  ell(0, 300, 200, 160); toon('#ffffff', 7);
  ctx.save(); ell(0, 300, 196, 156); ctx.clip(); ctx.fillStyle = INK; ell(-120, 260, 60, 45); ctx.fill(); ell(110, 360, 70, 50); ctx.fill(); ctx.restore();
  rr(-40, 140, 80, 22, 8); toon('#7a4a2a', 5); ctx.beginPath(); ctx.moveTo(-30, 160); ctx.lineTo(30, 160); ctx.lineTo(42, 230); ctx.lineTo(-42, 230); ctx.closePath(); toon('#ffd23f', 6);
  thxArm(140, 220, 170, 56, '#ffffff', 'hoof', ph, '#ffffff');
  for (const s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(s * 50, -84); ctx.quadraticCurveTo(s * 120, -110, s * 112, -170); ctx.quadraticCurveTo(s * 96, -116, s * 30, -100); ctx.closePath(); toon('#fff3df', 5); ell(s * 140, -16, 52, 24, ctx, s * .3); toon('#ffffff', 6); ell(s * 140, -16, 30, 11, ctx, s * .3); ctx.fillStyle = '#ff9db0'; ctx.fill(); }
  ell(0, 0, 118, 112); toon('#ffffff', 7);
  ctx.save(); ell(0, 0, 114, 108); ctx.clip(); ctx.fillStyle = INK; ell(-80, -60, 50, 40); ctx.fill(); ell(90, -10, 34, 50); ctx.fill(); ctx.restore();
  thxEyes(-26, 44, 18, ph);
  ell(0, 66, 92, 54); toon('#ff9db0', 6);
  for (const s of [-1, 1]) { ell(s * 34, 52, 10, 14); ctx.fillStyle = '#b5566a'; ctx.fill(); }
  thxMouth(0, 86, 26);
  thxSoot([[-70, 30, 22, 13, .3], [46, -70, 24, 14, -.2], [60, 260, 30, 18]], X.soot);
  thxWisps(0, -150, X.soot);
}

const THX_DRAW = { human: thxHuman, cat: thxCat, dog: thxDog, hamster: thxHamster, hedgehog: thxHedgehog, bird: thxBird, nest: thxNest, cow: thxCow, pilot: thxPilot };
function thxWho(w, ph, X) {
  if (w.group) { w.group.forEach((m, i) => { ctx.save(); ctx.translate(m.x, m.y); ctx.scale(m.s, m.s); thxWho(m.who, ph + i * 1.7, X); ctx.restore(); }); return; }
  ctx.save(); if (w.s) ctx.scale(w.s, w.s);
  THX_DRAW[w.k](w, ph, X);
  ctx.restore();
}
// вещь в руках хозяина: рисуем её же рисунком из сцены, крупно, у груди
function thxItem(it) {
  const T = it.T, [s, dx = 0, dy = 0] = it.fit, t = { ...T, state: 'home', burn: 0, fly: 0 };
  ctx.save(); ctx.translate(-80 + dx, 170 + dy); ctx.scale(s, s); ctx.translate(-T.x, -T.y);
  try { T.draw({ flags: {}, parts: [] }, t); } catch (e) {}
  ctx.restore();
  // ладони держат вещь
  for (const [x, y] of [[-160, 200], [0, 215]]) { circ(x + dx, y + dy, 30); toon(SKIN, 5); }
}
function thxHeart(x, y, r) {
  ctx.beginPath(); ctx.moveTo(x, y + r * .9);
  ctx.bezierCurveTo(x - r * 1.6, y - r * .2, x - r * .7, y - r * 1.4, x, y - r * .5);
  ctx.bezierCurveTo(x + r * .7, y - r * 1.4, x + r * 1.6, y - r * .2, x, y + r * .9); ctx.closePath(); toon('#ff5a7a', 4);
}
const easeBack = k => { k = Math.min(1, Math.max(0, k)); const c = 1.7; return 1 + (c + 1) * Math.pow(k - 1, 3) + c * Math.pow(k - 1, 2); };

function drawThanks(G) {
  const X = G.thx; if (!X) return;
  const k = time - X.t0, cx = 410, cy = 340;
  ctx.save(); ctx.globalAlpha = Math.min(1, k / .35);
  // солнечный фон с лучами
  const g = ctx.createRadialGradient(cx, cy, 30, cx, cy, 950); g.addColorStop(0, '#fff6cf'); g.addColorStop(.45, '#ffd56b'); g.addColorStop(1, '#ff9a45');
  ctx.fillStyle = g; ctx.fillRect(0, 0, VW, VH);
  ctx.fillStyle = 'rgba(255,255,255,.2)';
  for (let i = 0; i < 18; i++) { const a = time * .12 + i * Math.PI / 9; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, 1500, a, a + Math.PI / 18); ctx.closePath(); ctx.fill(); }
  // сердечки поднимаются
  for (let i = 0; i < 9; i++) {
    const p = ((k - .8) * .32 + i / 9) % 1; if (k < .8) break;
    const hx = cx - 300 + (i * 137) % 600 + Math.sin(time * 2 + i) * 18, hy = VH - p * 640;
    ctx.globalAlpha = Math.min(1, k / .35) * Math.sin(p * Math.PI); thxHeart(hx, hy, 14 + (i % 3) * 6);
  }
  ctx.globalAlpha = Math.min(1, k / .35);
  // спасённый выезжает снизу крупным планом
  const e = easeBack((k - .1) / .6), py = cy + (1 - e) * 560;
  ctx.save(); ctx.translate(cx, py); ctx.scale(1.45, 1.45);
  thxWho(X.who, 0, X);
  if (X.item) thxItem(X.item);
  ctx.restore();
  // облачко с репликой
  const b = easeBack((k - .55) / .4);
  if (b > 0) {
    ctx.save(); ctx.translate(1010, 200); ctx.scale(b, b);
    ctx.font = '900 52px Rubik, sans-serif';
    const words = X.say.split(' '), lines = []; let cur = '';
    for (const wd of words) { const t = cur ? cur + ' ' + wd : wd; if (ctx.measureText(t).width > 400 && cur) { lines.push(cur); cur = wd; } else cur = t; }
    lines.push(cur);
    const h = lines.length * 60 + (X.hint ? 56 : 0) + 50;
    ctx.beginPath(); ctx.moveTo(-226, -26); ctx.lineTo(-330, 14); ctx.lineTo(-226, 26); ctx.closePath(); toon('#ffffff', 6);
    rr(-240, -h / 2, 480, h, 40); toon('#ffffff', 6);
    ctx.beginPath(); ctx.moveTo(-234, -22); ctx.lineTo(-234, 22); ctx.lineWidth = 12; ctx.strokeStyle = '#ffffff'; ctx.stroke();
    lines.forEach((ln, i) => tex(ctx, 0, -h / 2 + 55 + i * 60, ln, 52, INK));
    if (X.hint) { let fs = 26; ctx.font = `700 ${fs}px Rubik, sans-serif`; while (fs > 16 && ctx.measureText(X.hint).width > 440) ctx.font = `700 ${--fs}px Rubik, sans-serif`; ctx.fillStyle = '#a0603a'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(X.hint, 0, h / 2 - 44); }
    ctx.restore();
  }
  ctx.restore();
}
// коснуться экрана — сразу к итогам
cv.addEventListener('pointerdown', () => { if (G && G.thx && G.thx.skip && time - G.thx.t0 > .6) G.thx.skip(); });
