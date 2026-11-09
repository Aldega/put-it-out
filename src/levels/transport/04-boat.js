LEVELS.push(
  {
    id: 'boat', name: 'Катер у причала', bg: bgBoat, dmgRate: 1.8, par: 12, reward: 280, flags: { fuel: true },
    intro: 'У катера загорелся мотор. Из шланга течёт бензин, и горящее пятно плывёт к причалу. Рыбак прыгнул в воду!',
    lesson: 'Бензин легче воды: он плавает сверху и горит прямо на озере. Поэтому плескать на него водой бесполезно, пятно только расползётся. Перекрой топливо, собьёт пламя на моторе песок или порошок, а тонкое пятно на воде скоро прогорит само. Тому, кто в воде, сначала бросают круг.',
    init: G => { G.refT = 0; },
    boost: (G, it) => it.id === 'slick' && G.flags.fuel ? 1.5 : 1,
    tick(G, dt) {
      const s = G.byId.slick, m = G.byId.motor;
      if (!G.flags.fuel) {
        // без подпитки тонкое пятно прогорает само
        if (s.fire > 0) { s.fire = Math.max(0, s.fire - .07 * dt); if (s.fire === 0) { SFX.hiss(); say('Бензин на воде прогорел сам: подпитки больше нет.', 'good'); } }
        return;
      }
      if (s.fire > 0 || m.fire === 0) { G.refT = 0; return; }
      G.refT += dt;
      if (G.refT > 2.5) { G.refT = 0; s.fire = .3; G.flags.reignited = true; SFX.flare(); say('Из шланга натекло ещё бензина, и он вспыхнул от мотора! Перекрой кран на баке.', 'bad'); }
    },
    done: G => !G.flags.fuel,
    notDone: 'Бензин всё ещё течёт в озеро. Перекрой кран на баке!',
    spillMsg: 'Вода только разогнала горящий бензин по озеру! Он плавает сверху и продолжает гореть.',
    hot: [{ x: 420, y: 404, r: 40, label: G => G.flags.fuel ? 'Перекрыть топливо' : null, tap: G => { G.flags.fuel = false; G.flags.fuelT = G.time; SFX.knob(); say('Топливо перекрыто. Сбей пламя на моторе, а пятно на воде прогорит.', 'good'); } }],
    items: [
      { id: 'pier', name: 'причал', draw: drawPier, value: 1.2, aimAt: [160, 420], spots: [[40, 430, 40], [140, 430, 45], [240, 430, 40]], box: [-10, 350, 306, 450] },
      { id: 'boat', name: 'катер', draw: drawBoatHull, value: 1.4, aimAt: [600, 430], spots: [[480, 430, 40], [580, 430, 45], [690, 430, 40]], box: [360, 370, 760, 500] },
      { id: 'slick', name: 'пятно бензина', cls: 'B', draw: drawSlick, value: .4, fire: .3, aimAt: [350, 505], spots: [[220, 516, 40], [330, 518, 45], [450, 516, 40]], box: [150, 490, 550, 534] },
      { id: 'motor', name: 'мотор', cls: 'B', draw: drawOutboard, value: .9, fire: .5, aimAt: [324, 400], spots: [[324, 410, 40]], box: [290, 370, 360, 500] }
    ],
    links: [['motor', 'slick', .25, 1], ['slick', 'pier', .12], ['motor', 'boat', .1]],
    // рыбак прыгнул за борт
    treasure: { name: 'Рыбак', acc: 'рыбака', medal: 'Рыбак спасён', x: 600, y: 560, r: 60, near: 'slick', burnTime: 4, exit: [120, 380], draw: drawSwimmer,
      savedMsg: 'Рыбаку бросили спасательный круг и вытянули на причал. Мокрый, зато целый!',
      lostMsg: 'Рыбак нырнул под горящее пятно и выплыл далеко. Обошлось, но удочки утонули.' },
    medals: [
      { id: 'fuelfirst', name: 'Сначала топливо', test: G => beforeThrow(G, G.flags.fuelT) },
      { id: 'pier', name: 'Причал цел', test: G => !G.burned.has('pier') },
      { id: 'nowater', name: 'Озеро не помогло', secret: true, hint: 'Воды вокруг полно, но не для бензина', test: G => !G.spills }
    ]
  }
);
