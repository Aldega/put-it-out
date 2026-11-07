LEVELS.push(
  {
    id: 'grill', name: 'Мангал', bg: bgGrill, dmgRate: 2.0, par: 9, reward: 140, flags: { grill: true },
    intro: 'Розжиг плеснули прямо в горящий мангал! Пламя прыгнуло на бутылку, она упала, и розжиг горит лужей у стола.',
    lesson: 'Розжиг, бензин и масло горят как класс B. Вода разбрызгивает горящую жидкость, и огонь растекается. Лужу засыпают песком или накрывают покрывалом. Розжиг льют только на холодные угли и никогда в огонь. А зонт над огнём лучше сложить: ткань вспыхивает мгновенно.',
    spillMsg: 'Вода разбрызгала горящий розжиг, и огонь растёкся по траве! Жидкость тушат песком.',
    back: G => grillBack(G),
    decor: [{ flag: 'grill', x: 250, y: 440, r: 70, msg: 'Угли в мангале тоже залиты. Шашлык теперь не дожарится!' }],
    hot: [{ x: 790, y: 330, r: 75, label: G => G.byId.umbrella.safe || G.byId.umbrella.fire > 0 ? null : 'Сложить зонт', tap: G => { G.byId.umbrella.safe = true; G.flags.foldT = G.time; SFX.cloth(); say('Зонт сложен. Огню не на что перепрыгнуть сверху.', 'good'); } }],
    items: [
      { id: 'umbrella', name: 'зонт', draw: drawUmbrella, value: 1.2, aimAt: [790, 320], spots: [[655, 340, 50], [735, 330, 55], [845, 330, 55], [925, 340, 50]], box: [610, 245, 970, 360] },
      { id: 'bench', name: 'скамейку', draw: drawBench, value: 1, aimAt: [1110, 500], spots: [[1050, 530, 50], [1120, 525, 55], [1190, 530, 50]], box: [1000, 450, 1230, 605] },
      { id: 'table', name: 'стол', draw: drawPicnicTable, value: 1.3, aimAt: [800, 470], spots: [[680, 440, 50], [770, 440, 60], [860, 440, 60], [930, 445, 50]], box: [630, 360, 960, 600] },
      { id: 'puddle', name: 'лужу розжига', cls: 'B', draw: drawPuddle, value: .8, fire: .55, aimAt: [520, 580], spots: [[430, 592, 50], [490, 596, 55], [555, 596, 55], [615, 592, 45]], box: [380, 555, 660, 615] }
    ],
    links: [['puddle', 'table', .18], ['table', 'umbrella', .2], ['table', 'bench', .1]],
    // тарелка с готовым шашлыком на краю стола
    treasure: { name: 'Шашлык', acc: 'шашлык', medal: 'Шашлык спасён', x: 860, y: 412, r: 55, near: 'table', burnTime: 2.5, exit: [1350, 300], draw: drawShashlik,
      savedMsg: 'Тарелку с шашлыком унесли в дом. Ужин спасён!',
      lostMsg: 'Шашлык превратился в угольки. Ужин отменяется.' },
    medals: [
      { id: 'umbrella', name: 'Зонт цел', test: G => !G.burned.has('umbrella') },
      { id: 'fast', name: 'Быстрее 7 секунд', test: G => G.time < 7 },
      { id: 'grill', name: 'Угли не залиты', secret: true, hint: 'Шашлык ещё не дожарился…', test: G => G.flags.grill }
    ]
  }
);
