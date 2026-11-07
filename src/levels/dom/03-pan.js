LEVELS.push(
  {
    id: 'pan', name: 'Сковорода с маслом', bg: bgKitchen, dmgRate: 2.0, par: 10, reward: 50, flags: { stoveOn: true },
    intro: 'Масло на сковороде перегрелось и вспыхнуло. Конфорка всё ещё горит.',
    lesson: 'Горящее масло относится к классу F. Вода в нём мгновенно вскипает и выбрасывает огненный шар, поэтому воду лить нельзя! Выключи плиту и накрой сковороду крышкой или противопожарным покрывалом: без воздуха огонь гаснет.',
    back: G => drawStove(G),
    boost: (G, it) => it.id === 'pan' && G.flags.stoveOn ? 1.5 : 1,
    tick(G, dt) {
      const pan = G.byId.pan;
      if (G.flags.stoveOn && pan.fire === 0) { pan.heat += dt * .3; if (pan.heat >= 1) { pan.heat = 0; pan.fire = .35; SFX.spread(); say('Конфорка всё ещё горит: масло перегрелось и снова вспыхнуло! Поверни ручку плиты.', 'bad'); } }
      if (!G.flags.stoveOn && pan.fire === 0) pan.heat = 0;
    },
    done: G => !G.flags.stoveOn,
    notDone: 'Огонь погас, но конфорка всё ещё горит. Поверни ручку плиты!',
    hot: [{ x: 610, y: 512, r: 40, label: G => G.flags.stoveOn ? 'Выключить плиту' : null, tap: G => { G.flags.stoveOn = false; G.flags.stoveT = G.time; SFX.knob(); say('Плита выключена, масло больше не греется.', 'good'); } }],
    items: [
      { id: 'curtain', name: 'занавеску', draw: drawCafeCurtain, value: 1.4, aimAt: [1030, 260], spots: [[945, 300, 50], [1030, 305, 50], [1115, 300, 50]], box: [906, 190, 1154, 310] },
      { id: 'towel', name: 'полотенце', draw: drawTowel, value: 1, aimAt: [815, 400], spots: [[815, 440, 50], [815, 380, 40]], box: [784, 320, 846, 450] },
      { id: 'pan', name: 'сковороду', cls: 'F', lidable: true, draw: drawPan, value: 1, fire: .55, aimAt: [650, 445], spots: [[600, 452, 55], [655, 450, 65], [705, 452, 50]], box: [550, 430, 755, 488] }
    ],
    links: [['pan', 'towel', .14], ['towel', 'curtain', .13]],
    // бабушкина книга рецептов стоит рядом с полотенцем
    treasure: { name: 'Книга рецептов', acc: 'книгу', medal: 'Книга спасена', x: 905, y: 408, r: 55, near: 'towel', burnTime: 3, exit: [1350, 260], draw: drawRecipeBook,
      savedMsg: 'Бабушкина книга рецептов спасена. Блины будут!',
      lostMsg: 'Книга рецептов сгорела. Бабушка расстроится.' },
    medals: [
      { id: 'stovefirst', name: 'Сначала плита', test: G => beforeThrow(G, G.flags.stoveT) },
      { id: 'onelid', name: 'Одной крышкой', test: G => G.nThrows === 1 && G.used.has('lid') },
      { id: 'towel', name: 'Полотенце не тронуто', secret: true, test: G => !G.burned.has('towel') }
    ]
  }
);
