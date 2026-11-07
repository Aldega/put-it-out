LEVELS.push(
  {
    id: 'dumpsters', name: 'Мусорные баки', bg: bgDumpsters, dmgRate: 1.8, par: 10, reward: 210, flags: { lid: false, rolled: false }, can: { x: 820, y: 560 },
    intro: 'Во дворе загорелся мусорный бак, а крышка у него откинута. Рядом второй бак, тополь и чей-то велосипед.',
    lesson: 'Горящий мусорный бак проще всего заглушить: захлопни крышку, и огонь задохнётся без воздуха. Соседний бак на колёсиках можно откатить, и огню станет некуда перекидываться. Убрать то, что может загореться, бывает быстрее, чем тушить.',
    boost: (G, it) => it.id === 'bin1' && G.flags.lid ? 0 : 1,
    linkOk: (G, a, b) => !(a === 'bin1' && G.flags.lid) && !(G.flags.rolled && (a === 'bin2' || b === 'bin2')),
    tick(G, dt) {
      const b = G.byId.bin1;
      if (G.flags.lid && b.fire > 0) { b.fire = Math.max(0, b.fire - .2 * dt); if (b.fire < .05) { b.fire = 0; SFX.hiss(); burst(560, 380, '#ffffff', 10, 'steam'); say('Под крышкой огонь задохнулся. Бак потух!', 'good'); } }
    },
    drag: {
      grab: (G, p) => !G.flags.rolled && G.byId.bin2.fire === 0 && Math.hypot(p.x - G.can.x, p.y - 470) < 90,
      move(G, p) { G.can.x = Math.max(820, Math.min(1180, p.x)); moveBin2(G); },
      drop(G) { if (G.can.x > 1040) { G.flags.rolled = true; G.flags.rolledT = G.time; SFX.knob(); say('Бак откатили подальше. Огню теперь не на что перекинуться.', 'good'); } else say('Ещё близко к огню. Кати дальше вправо!', ''); }
    },
    hot: [
      { x: 705, y: 255, r: 55, label: G => G.flags.lid ? null : 'Захлопнуть крышку', tap: G => { G.flags.lid = true; G.flags.lidT = G.time; SFX.clank(); say('Крышка захлопнута. Без воздуха огонь в баке быстро задохнётся.', 'good'); } },
      { x: 0, y: 0, r: 0, dyn: G => G.flags.rolled || G.byId.bin2.fire > 0 ? null : { x: G.can.x, y: 470, r: 90, label: 'Откатить бак' } }
    ],
    items: [
      { id: 'tree', name: 'тополь', draw: drawYardPoplar, value: 1.2, aimAt: [210, 380], spots: [[205, 540, 40], [210, 420, 50], [210, 320, 50]], box: [120, 180, 300, 560] },
      { id: 'bin2', name: 'второй бак', draw: drawBin2, value: 1, aimAt: [820, 380], spots: [[760, 395, 45], [820, 390, 50], [880, 395, 45]], box: [720, 380, 920, 565] },
      { id: 'bin1', name: 'мусорный бак', draw: drawBin1, value: .8, fire: .55, aimAt: [560, 375], spots: [[500, 392, 45], [560, 386, 55], [620, 392, 45]], box: [460, 370, 660, 565] }
    ],
    links: [['bin1', 'bin2', .17], ['bin1', 'tree', .1]],
    // велосипед прислонили к ограде площадки
    treasure: { name: 'Велосипед', acc: 'велосипед', medal: 'Велосипед цел', x: 370, y: 505, r: 60, near: 'bin1', burnTime: 4.5, exit: [-120, 600], draw: drawBike,
      savedMsg: 'Велосипед откатили к подъезду. Шины целы!',
      lostMsg: 'У велосипеда от жара расплавились шины. Кататься не на чем.' },
    medals: [
      { id: 'lid', name: 'Захлопнул крышку', test: G => G.flags.lid },
      { id: 'tree', name: 'Тополь цел', test: G => !G.burned.has('tree') },
      { id: 'roll', name: 'Откатил бак', secret: true, hint: 'У баков есть колёсики', test: G => G.flags.rolled }
    ]
  }
);
// второй бак едет вместе с пальцем, а с ним и места, куда может прийти огонь
function moveBin2(G) {
  const it = G.byId.bin2, x = G.can.x;
  it.box = [x - 100, 380, x + 100, 565]; it.aimAt = [x, 380]; it.spots = [[x - 60, 395, 45], [x, 390, 50], [x + 60, 395, 45]];
}
