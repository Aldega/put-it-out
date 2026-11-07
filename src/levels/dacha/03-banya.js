LEVELS.push(
  {
    id: 'banya', name: 'Баня', bg: bgBanya, dmgRate: 2.0, par: 11, reward: 150, flags: { stoveOpen: true },
    intro: 'Дверцу печки забыли закрыть, и на пол выпал уголь. Пол загорелся, а дед задремал на верхнем полке!',
    lesson: 'В бане пожары чаще всего от печки: выпал уголь или перегрелась стена. Закрой дверцу печи и туши пол водой, но не лей на раскалённую каменку: вода мгновенно становится паром, а пар обжигает. И первым делом выведи людей.',
    back: () => {}, front: G => banyaStove(G),
    tick(G, dt) {
      const f = G.byId.floor;
      if (G.flags.stoveOpen && f.fire === 0 && f.wet <= 0) { f.heat += dt * .35; if (f.heat >= 1) { f.heat = 0; f.fire = .25; SFX.spread(); say('Из открытой печки выпал ещё один уголёк, и пол снова загорелся! Закрой дверцу.', 'bad'); } }
    },
    done: G => !G.flags.stoveOpen,
    notDone: 'Пол потушен, но дверца печки открыта, угли сыплются. Закрой её!',
    landed(G, th, p) {
      if (th.id !== 'water' || !inBox(p, [215, 280, 410, 605])) return false;
      G.mistakes++; G.dmg += 6; G.flags.steamed = true; G.flags.steamT = G.time;
      for (let i = 0; i < 24; i++) G.parts.push({ k: 'steam', x: 310 + (Math.random() - .5) * 160, y: 340 - Math.random() * 60, vx: (Math.random() - .5) * 200, vy: -60 - Math.random() * 120, life: 0, max: 2, r: 26 + Math.random() * 20 });
      SFX.hiss(); shake('#ffffff');
      say('Вода попала на раскалённую каменку и взорвалась облаком пара! Пар обжигает сильнее огня.', 'bad');
      return true;
    },
    hot: [{ x: 312, y: 510, r: 60, label: G => G.flags.stoveOpen ? 'Закрыть дверцу' : null, tap: G => { G.flags.stoveOpen = false; G.flags.doorT = G.time; SFX.clank(); say('Дверца закрыта. Угли больше не выпадут.', 'good'); } }],
    items: [
      { id: 'bench', name: 'полок', draw: drawPolok, value: 1.5, aimAt: [960, 460], spots: [[760, 480, 50], [860, 478, 60], [960, 478, 60], [900, 340, 55], [1000, 338, 55], [1130, 340, 55]], box: [700, 320, 1260, 600] },
      { id: 'brooms', name: 'веники', draw: drawBrooms, value: .8, aimAt: [550, 360], spots: [[500, 410, 40], [580, 410, 40], [540, 340, 40]], box: [460, 240, 650, 440] },
      { id: 'floor', name: 'пол', draw: drawBanyaFloor, value: 1, fire: .45, aimAt: [530, 600], spots: [[420, 616, 50], [490, 618, 55], [560, 618, 55], [625, 616, 45]], box: [380, 590, 665, 640] }
    ],
    links: [['floor', 'brooms', .16], ['floor', 'bench', .14], ['bench', 'brooms', .08]],
    // дед задремал на верхнем полке
    treasure: { name: 'Дед', acc: 'деда', medal: 'Дед спасён', x: 1080, y: 278, r: 70, near: 'bench', burnTime: 3, exit: [-120, 420], draw: drawGrandpa,
      savedMsg: 'Дед выскочил в предбанник в одном полотенце. Зато живой и даже не обжёгся!',
      lostMsg: 'Дед наглотался дыма. Откачали, но его надо было выводить первым.' },
    medals: [
      { id: 'doorfirst', name: 'Сначала дверца', test: G => beforeThrow(G, G.flags.doorT) },
      { id: 'brooms', name: 'Веники целы', test: G => !G.burned.has('brooms') },
      { id: 'nosteam', name: 'Без пара', secret: true, hint: 'Каменке вода не нужна', test: G => !G.flags.steamed }
    ]
  }
);
