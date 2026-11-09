LEVELS.push(
  {
    id: 'field', name: 'Пал травы', bg: bgField, dmgRate: 1.8, par: 11, reward: 170, flags: { sprinkler: false, dug: false },
    intro: 'Сосед поджёг сухую траву, и огонь пошёл по ветру прямо к нашему участку. Впереди куры, курятник и теплица!',
    lesson: 'Весной сухую траву поджигают, и огонь идёт по ветру фронтом, быстрее, чем кажется. Остановить его помогает мокрая или вскопанная полоса: на мокрой и голой земле гореть нечему. Траву не жгут никогда, а сухостой у дома лучше скосить заранее.',
    back: G => fieldBack(G), front: G => fieldFront(G),
    boost: (G, it) => it.id.startsWith('g') ? 1.5 : 1,
    spreadBoost: () => 1.5,
    linkOk: (G, a, b) => !(G.flags.dug && (a + b === 'g1g2' || a + b === 'g2g1')),
    tick(G, dt) {
      if (!G.flags.sprinkler) return;
      for (const id of ['g2', 'g3']) { const it = G.byId[id]; it.wet = Math.max(it.wet, 1.2); if (it.fire > 0) { it.fire = Math.max(0, it.fire - .12 * dt); if (it.fire < .05) { it.fire = 0; SFX.hiss(); } } }
    },
    hot: [
      { x: 620, y: 480, r: 55, label: G => G.flags.sprinkler ? null : 'Включить поливалку', tap: G => { G.flags.sprinkler = true; G.flags.sprinklerT = G.time; SFX.splash(); say('Поливалка работает. Мокрая трава не горит!', 'good'); } },
      { x: 285, y: 470, r: 55, label: G => G.flags.dug ? null : 'Вскопать полосу', tap: G => { G.flags.dug = true; G.flags.dugT = G.time; SFX.thud(); say('Полоса вскопана. На голой земле огню нечем питаться.', 'good'); } }
    ],
    items: [
      { id: 'greenhouse', name: 'теплицу', draw: drawGreenhouse, value: 1.5, aimAt: [1157, 470], spots: [[1080, 560, 50], [1157, 555, 55], [1235, 560, 50], [1157, 420, 55]], box: [1045, 330, 1270, 575] },
      { id: 'coop', name: 'курятник', draw: drawCoop, value: 1.3, aimAt: [905, 400], spots: [[840, 470, 50], [905, 470, 55], [970, 470, 50], [870, 330, 50], [945, 330, 50]], box: [790, 260, 1025, 575] },
      { id: 'g3', name: 'траву у курятника', draw: drawFieldG3, value: .6, soakFree: true, soakTime: 12, aimAt: [655, 560], spots: [[570, 565, 50], [640, 562, 55], [710, 565, 50], [760, 568, 40]], box: [530, 500, 785, 595] },
      { id: 'g2', name: 'траву посередине', draw: drawFieldG2, value: .6, soakFree: true, soakTime: 12, aimAt: [410, 575], spots: [[330, 580, 50], [400, 576, 55], [470, 580, 50]], box: [300, 510, 525, 610] },
      { id: 'g1', name: 'траву у забора', draw: drawFieldG1, value: .6, soakFree: true, soakTime: 12, fire: .55, aimAt: [140, 585], spots: [[50, 590, 50], [115, 586, 55], [180, 590, 50], [235, 592, 40]], box: [15, 520, 260, 615] }
    ],
    links: [['g1', 'g2', .3, .25], ['g2', 'g3', .3, .25], ['g3', 'coop', .22, .3], ['coop', 'greenhouse', .15]],
    // куры гуляют в траве у курятника
    treasure: { flee: true, name: 'Куры', acc: 'кур', medal: 'Куры спасены', x: 735, y: 512, r: 55, near: 'g3', burnTime: 2.5, exit: [1350, 640], draw: drawChickens,
      savedMsg: 'Кур загнали в сарай. Кудахчут, но целы.',
      lostMsg: 'Куры разбежались по лесу. Ловить их теперь до вечера.' },
    medals: [
      { id: 'greenhouse', name: 'Теплица цела', test: G => !G.burned.has('greenhouse') },
      { id: 'sprinkler', name: 'Поливалка в деле', test: G => G.flags.sprinkler && !G.burned.has('g3') },
      { id: 'dug', name: 'Минполоса', secret: true, hint: 'Земля не горит', test: G => G.flags.dug && !G.burned.has('g2') }
    ]
  }
);
