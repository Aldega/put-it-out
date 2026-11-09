LEVELS.push(
  {
    id: 'train', name: 'Поезд дальнего следования', bg: bgTrain, dmgRate: 1.8, par: 12, reward: 290,
    intro: 'Поезд мчится по мосту, а у тамбура задымилась урна: кто-то бросил окурок. Огонь тянется к занавескам!',
    lesson: 'В поезде первым делом зови проводника: у него огнетушитель и связь с машинистом. Стоп-кран при пожаре дёргать можно, но не на мосту и не в тоннеле: оттуда людей не вывести. Урну проще всего накрыть, а пока поезд мчится, сквозняк раздувает огонь.',
    lidMsg: 'Урну накрыли крышкой, и огонь задохнулся. Быстро и чисто!',
    init: G => { G.trainX = 0; G.speed = 420; G.cond = null; },
    back: G => trainBack(G),
    // пока поезд едет, по коридору гуляет сквозняк
    boost: G => G.speed > 50 ? 1.3 : 1,
    tick(G, dt) {
      if (G.flags.stopT != null) G.speed = Math.max(0, G.speed - 260 * dt);
      G.trainX += G.speed * dt;
      const c = G.cond;
      if (c && !c.done && G.time - c.t > 2.5) {
        c.done = true; SFX.puff();
        for (const it of G.items) if (it.fire > 0 && it.id !== 'bags') { it.fire = Math.max(0, it.fire - .45); if (it.fire < .05) it.fire = 0; it.wet = 2; }
        for (let i = 0; i < 16; i++) G.parts.push({ k: 'puff', x: 120 + Math.random() * 320, y: 330 + Math.random() * 180, vx: (Math.random() - .5) * 60, vy: -30, life: 0, max: 1.6, r: 30 + Math.random() * 30 });
        say('Проводник примчался с огнетушителем и сбил пламя у тамбура!', 'good');
      }
    },
    hot: [
      { x: 1035, y: 300, r: 50, label: G => G.flags.stopT != null ? null : 'Сорвать стоп-кран', tap: G => {
        G.flags.stopT = G.time; SFX.creak(); SFX.thud(); shake();
        if (G.trainX < 1800) { G.flags.badStop = true; G.mistakes++; G.dmg += 8; say('Поезд встал посреди моста! Отсюда людей не вывести, а пожарным не подъехать. На мосту и в тоннеле стоп-кран не дёргают.', 'bad'); }
        else say('Поезд тормозит в поле. Сквозняк стих, отсюда легко вывести людей.', 'good');
      } },
      { x: 1180, y: 330, r: 70, label: G => G.cond ? null : 'Позвать проводника', tap: G => { G.cond = { t: G.time }; G.flags.condT = G.time; SFX.ding(); say('Проводник! Пожар у тамбура! Он уже бежит с огнетушителем.', 'good'); } }
    ],
    items: [
      { id: 'bags', name: 'чемоданы', draw: drawTrainBags, value: 1.2, aimAt: [650, 480], spots: [[610, 460, 40], [720, 480, 40]], box: [560, 430, 770, 560] },
      { id: 'curtain', name: 'занавески', draw: drawTrainCurtain, value: 1, aimAt: [350, 380], spots: [[330, 440, 35], [380, 440, 35], [350, 330, 40]], box: [290, 200, 430, 470] },
      { id: 'bin', name: 'урну', lidable: true, draw: drawTrainBin, value: .7, fire: .5, aimAt: [160, 430], spots: [[130, 440, 40], [190, 440, 40]], box: [88, 420, 232, 560] }
    ],
    links: [['bin', 'curtain', .14], ['curtain', 'bags', .1], ['bin', 'bags', .04]],
    // гитара студента прислонена к стене
    treasure: { name: 'Гитара', acc: 'гитару', medal: 'Гитара цела', x: 480, y: 470, r: 60, near: 'bin', burnTime: 5.5, exit: [1350, 400], draw: drawGuitar,
      savedMsg: 'Гитару унесли в купе. Вечером будут песни!',
      lostMsg: 'Гитара закоптилась, и у неё лопнули струны.' },
    medals: [
      { id: 'cond', name: 'Позвал проводника', test: G => G.flags.condT != null },
      { id: 'curtain', name: 'Занавески целы', test: G => !G.burned.has('curtain') },
      { id: 'crane', name: 'Стоп-кран вовремя', secret: true, hint: 'Не на мосту', test: G => G.flags.stopT != null && !G.flags.badStop }
    ]
  }
);
