LEVELS.push(
  {
    id: 'iron', name: 'Утюг на доске', bg: bgLaundry, dmgRate: 2.0, par: 12, reward: 80, flags: { plugged: true },
    intro: 'Утюг забыли на рубашке, и гладильная доска загорелась. Утюг включён в розетку и раскалён.',
    lesson: 'Включённый утюг продолжает греть и бьёт током, если на него попадёт вода. Сначала выдерни вилку из розетки, потом туши доску водой. Под напряжением годится только песок, покрывало или порошковый огнетушитель. И никогда не оставляй утюг без присмотра!',
    back: () => {}, front: G => drawIron(G),
    boost: (G, it) => it.id === 'board' && G.flags.plugged ? 1.6 : 1,
    live: [shockZone([420, 360, 880, 500], [720, 430], 'board')],
    hot: [{ x: 1110, y: 400, r: 55, label: G => G.flags.plugged ? LABEL_PLUG : null, tap: G => { G.flags.plugged = false; G.flags.unplugT = G.time; SFX.unplug(); say('Утюг обесточен. Вода больше не опасна.', 'good'); } }],
    items: [
      { id: 'wardrobe', name: 'шкаф', draw: drawWardrobe, value: 1.6, aimAt: [195, 450], spots: [[130, 560, 60], [260, 560, 60], [140, 400, 60], [250, 380, 60], [195, 230, 70]], box: [60, 140, 330, 620] },
      { id: 'basket', name: 'корзину с бельём', draw: drawBasket, value: 1, aimAt: [970, 520], spots: [[930, 510, 50], [1005, 505, 50]], box: [885, 480, 1055, 650] },
      { id: 'board', name: 'гладильную доску', draw: drawBoard, value: 1, fire: .5, aimAt: [560, 440], spots: [[470, 458, 50], [540, 452, 60], [610, 450, 60], [800, 462, 50]], box: [425, 430, 870, 480] }
    ],
    links: [['board', 'basket', .14], ['board', 'wardrobe', .1]],
    // кот спит под гладильной доской, на него сыплются искры
    treasure: { name: 'Кот', acc: 'кота', medal: 'Кот спасён', x: 590, y: 618, r: 60, near: 'board', burnTime: 4, exit: [-100, 620], draw: drawCat,
      savedMsg: 'Кот спасён. Он опять спал под гладильной доской!',
      lostMsg: 'Коту на спину упала горящая тряпка. Он цел, но очень обижен.' },
    medals: [
      { id: 'wardrobe', name: 'Шкаф цел', test: G => !G.burned.has('wardrobe') },
      { id: 'fast', name: 'Быстрее 8 секунд', test: G => G.time < 8 },
      { id: 'quickplug', name: 'Вилка за 2 секунды', secret: true, hint: 'Быстрее, чем утюг остынет…', test: G => G.flags.unplugT != null && G.flags.unplugT < 2 }
    ]
  }
);
