LEVELS.push(
  {
    id: 'cafe', name: 'Фритюр в кафе', bg: bgCafe, dmgRate: 2.0, par: 10, reward: 240, flags: { power: true, fan: true },
    intro: 'На кухне кафе вспыхнуло масло во фритюрнице. Фритюр включён, а вытяжка гудит и тянет пламя прямо в жирный короб!',
    lesson: 'Горящее масло водой не тушат: оно взрывается огненным шаром. Сначала выключи фритюр, потом накрой его крышкой или покрывалом. Вытяжку тоже выключай: она тянет огонь в короб, а там годами копится жир, и пожар уходит по трубе на крышу. Фильтры вытяжки в кафе моют каждую неделю.',
    back: G => cafeBack(G),
    boost: (G, it) => it.id === 'fryer' && G.flags.power ? 1.5 : it.id === 'hood' && G.flags.fan ? 1.4 : 1,
    linkOk: (G, a, b) => !(b === 'hood' && !G.flags.fan),
    tick(G, dt) {
      const f = G.byId.fryer;
      if (G.flags.power && f.fire === 0) { f.heat += dt * .3; if (f.heat >= 1) { f.heat = 0; f.fire = .35; SFX.spread(); say('Фритюр всё ещё греет: масло перегрелось и снова вспыхнуло! Выключи его.', 'bad'); } }
      if (!G.flags.power && f.fire === 0) f.heat = 0;
    },
    done: G => !G.flags.power,
    notDone: 'Огонь погас, но фритюр всё ещё греет масло. Выключи его!',
    hot: [
      { x: 480, y: 525, r: 40, label: G => G.flags.power ? 'Выключить фритюр' : null, tap: G => { G.flags.power = false; G.flags.powerT = G.time; SFX.knob(); say('Фритюр выключен, масло больше не греется.', 'good'); } },
      { x: 152, y: 340, r: 50, label: G => G.flags.fan ? 'Выключить вытяжку' : null, tap: G => { G.flags.fan = false; G.flags.fanT = G.time; SFX.unplug(); say('Вытяжка выключена и больше не тянет огонь в короб.', 'good'); } }
    ],
    items: [
      { id: 'napkins', name: 'коробки и салфетки', draw: drawNapkins, value: 1, aimAt: [700, 420], spots: [[640, 450, 40], [710, 440, 45], [790, 450, 40]], box: [595, 360, 860, 475] },
      { id: 'hood', name: 'вытяжку', draw: drawHood, value: 1.6, aimAt: [410, 270], spots: [[320, 292, 45], [410, 288, 50], [500, 292, 45]], box: [255, 196, 565, 305] },
      { id: 'fryer', name: 'фритюр', cls: 'F', lidable: true, draw: drawFryer, value: 1, fire: .55, aimAt: [410, 410], spots: [[350, 420, 45], [410, 416, 55], [470, 420, 45]], box: [290, 400, 530, 440] }
    ],
    links: [['fryer', 'hood', .28], ['fryer', 'napkins', .12]],
    // торт на окне раздачи
    treasure: { name: 'Торт', acc: 'торт', medal: 'Торт спасён', x: 1010, y: 350, r: 60, near: 'napkins', burnTime: 3, exit: [1350, 250], draw: drawCake,
      savedMsg: 'Торт унесли в зал. У кого-то сегодня день рождения, и он не испорчен!',
      lostMsg: 'Торт закоптился и пахнет гарью. Праздник придётся отложить.' },
    medals: [
      { id: 'powerfirst', name: 'Сначала фритюр', test: G => beforeThrow(G, G.flags.powerT) },
      { id: 'hood', name: 'Вытяжка цела', test: G => !G.burned.has('hood') },
      { id: 'fan', name: 'Вытяжку выключил', secret: true, hint: 'Вытяжка тянет не только запах', test: G => beforeThrow(G, G.flags.fanT) }
    ]
  }
);
