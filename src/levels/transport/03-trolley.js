LEVELS.push(
  {
    id: 'trolley', name: 'Троллейбус', bg: bgTrolley, dmgRate: 1.8, par: 11, reward: 270, flags: { down: false },
    intro: 'На крыше троллейбуса заискрило, и загорелось оборудование. Штанги ещё на проводах, всё под током!',
    lesson: 'Троллейбус питается от проводов над дорогой, там 600 вольт. Пока штанги на проводах, вода на троллейбусе бьёт током. Сначала штанги опускают: их тянут вниз за верёвки сзади. Под напряжением можно тушить только порошком или углекислотой.',
    live: [{ box: [250, 200, 1000, 540], at: [530, 280], on: G => !G.flags.down, extra: 'roof', msg: 'Вода попала на троллейбус под напряжением. Удар током! Сначала опусти штанги.' }],
    boost: (G, it) => it.id === 'roof' && !G.flags.down ? 1.4 : 1,
    landed(G, th, p) { if (th.id === 'powder' && !G.flags.down && inBox(p, [250, 200, 1000, 540])) G.flags.powderLive = true; return false; },
    hot: [{ x: 246, y: 386, r: 45, label: G => G.flags.down ? null : 'Опустить штанги', tap: G => {
      G.flags.down = true; G.flags.downT = G.time; SFX.unplug(); SFX.creak();
      say('Штанги сняты с проводов, троллейбус обесточен. Теперь и водой можно!', 'good');
    } }],
    items: [
      { id: 'tree', name: 'тополь', draw: drawTrolleyTree, value: 1, aimAt: [1150, 260], spots: [[1150, 440, 40], [1150, 330, 50], [1150, 230, 50]], box: [1070, 90, 1230, 470] },
      { id: 'salon', name: 'салон', draw: drawTrolleyBody, value: 1.5, aimAt: [700, 390], spots: [[330, 410, 40], [430, 410, 45], [700, 410, 45], [800, 410, 40]], box: [250, 300, 1000, 540] },
      { id: 'roof', name: 'оборудование на крыше', draw: drawTrolleyRoof, value: 1, fire: .5, aimAt: [530, 270], spots: [[470, 280, 40], [530, 278, 45], [590, 280, 40]], box: [420, 240, 640, 304] }
    ],
    links: [['roof', 'salon', .12], ['salon', 'tree', .06]],
    // музыкант забыл скрипку на сиденье
    treasure: { name: 'Скрипка', acc: 'скрипку', medal: 'Скрипка спасена', x: 700, y: 390, r: 55, near: 'roof', burnTime: 5, exit: [1350, 300], draw: drawViolin,
      savedMsg: 'Скрипку вынесли из салона. Вечером концерт состоится!',
      lostMsg: 'Скрипка рассохлась от жара и больше не строит.' },
    medals: [
      { id: 'downfirst', name: 'Сначала штанги', test: G => beforeThrow(G, G.flags.downT) },
      { id: 'tree', name: 'Тополь цел', test: G => !G.burned.has('tree') },
      { id: 'powder', name: 'Порошок под током', secret: true, hint: 'Есть средство, которому ток не страшен', test: G => G.flags.powderLive }
    ]
  }
);
