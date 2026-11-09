LEVELS.push(
  {
    id: 'moped', name: 'Мопед курьера', bg: bgMoped, dmgRate: 1.8, par: 10, reward: 240, flags: { tap: true },
    intro: 'Курьер оставил мопед у пиццерии, и из-под сиденья пошёл дым. Из бака капает бензин, и лужа под мопедом горит!',
    lesson: 'Пока бензин течёт из бака, огонь будет вспыхивать снова и снова. Сначала закрой бензокран, потом туши песком или порошком. Вода горящий бензин не тушит, а разносит. Мопед глушат, прежде чем заправлять, и не курят рядом.',
    init: G => { G.refT = 0; },
    boost: (G, it) => it.id === 'puddle' && G.flags.tap ? 1.6 : 1,
    tick(G, dt) {
      const pu = G.byId.puddle;
      if (!G.flags.tap || pu.fire > 0 || G.byId.moped.fire === 0) { G.refT = 0; return; }
      G.refT += dt;
      if (G.refT > 2.5) { G.refT = 0; pu.fire = .3; G.flags.reignited = true; SFX.flare(); burst(450, 575, '#ffcf4a', 16, 'drop'); say('Бензин из бака всё капает и снова вспыхнул! Закрой бензокран под сиденьем.', 'bad'); }
    },
    done: G => !G.flags.tap,
    notDone: 'Из бака всё ещё течёт бензин. Закрой бензокран под сиденьем!',
    spillMsg: 'Вода разбрызгала горящий бензин по тротуару! Бензин тушат песком или порошком.',
    hot: [{ x: 456, y: 492, r: 40, label: G => G.flags.tap ? 'Закрыть бензокран' : null, tap: G => { G.flags.tap = false; G.flags.tapT = G.time; SFX.knob(); say('Бензокран закрыт, бензин больше не течёт. Теперь туши лужу!', 'good'); } }],
    items: [
      { id: 'awning', name: 'маркизу', draw: drawAwning, value: 1.1, aimAt: [280, 220], spots: [[150, 240, 40], [280, 240, 45], [410, 240, 40]], box: [74, 190, 486, 270] },
      { id: 'bike', name: 'велосипед', draw: drawParkedBike, value: 1, aimAt: [900, 480], spots: [[840, 520, 40], [900, 480, 45], [960, 520, 40]], box: [800, 440, 1000, 560] },
      { id: 'puddle', name: 'бензин на тротуаре', cls: 'B', draw: drawMopedPuddle, value: .5, fire: .35, aimAt: [450, 575], spots: [[380, 592, 40], [450, 594, 45], [520, 592, 40]], box: [310, 562, 590, 602] },
      { id: 'moped', name: 'мопед', draw: drawMoped, value: 1.3, fire: .4, aimAt: [400, 440], spots: [[360, 440, 40], [430, 436, 45]], box: [300, 350, 600, 560] }
    ],
    links: [['moped', 'puddle', .25, 1], ['moped', 'awning', .1], ['puddle', 'bike', .06]],
    // термосумка с заказом стоит на тротуаре рядом
    treasure: { name: 'Пицца', acc: 'пиццу', medal: 'Заказ спасён', x: 680, y: 510, r: 55, near: 'moped', burnTime: 4, exit: [1350, 420], draw: drawPizzaBag,
      savedMsg: 'Термосумку с пиццей унесли в сторону. Заказ доедет горячим, но не жареным!',
      lostMsg: 'Пицца в сумке превратилась в угольки. Клиент останется голодным.' },
    medals: [
      { id: 'tapfirst', name: 'Сначала бензокран', test: G => beforeThrow(G, G.flags.tapT) },
      { id: 'awning', name: 'Маркиза цела', test: G => !G.burned.has('awning') },
      { id: 'nowater', name: 'Бензин не поливал', secret: true, hint: 'Бензин с водой не дружит', test: G => !G.spills && !G.flags.reignited }
    ]
  }
);
