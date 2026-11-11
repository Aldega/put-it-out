LEVELS.push(
  {
    id: 'scooter', name: 'Самокат на зарядке', bg: bgHallway, dmgRate: 1.9, par: 13, reward: 260, flags: { plugged: true },
    intro: 'В прихожей всю ночь заряжался электросамокат, и его батарея загорелась. Самокат ещё в розетке, а в клетке кричит попугай Кеша!',
    lesson: 'Батарея самоката горит изнутри: пламя сбить можно, но она остаётся раскалённой и вспыхивает снова. Сначала выдерни зарядку, потом долго лей воду, пока батарея не остынет. Песок и порошок только сбивают пламя. Самокаты не заряжают на ночь и у выхода из квартиры.',
    init: G => { G.bat = 1; G.batT = 0; },
    back: G => hallBack(G),
    live: [shockZone([370, 290, 670, 595], [530, 530], 'scooter')],
    boost: (G, it) => it.id === 'scooter' && G.flags.plugged ? 1.5 : 1,
    tick(G, dt) {
      const s = G.byId.scooter;
      if (s.fire > 0 || G.bat <= 0) { G.batT = 0; return; }
      G.batT += dt;
      if (G.batT > 3) { G.batT = 0; s.fire = .45; G.flags.reignited = true; SFX.flare(); burst(530, 530, '#ffcf4a', 24, 'drop'); say('Батарея внутри ещё горячая и снова вспыхнула! Её надо остудить водой.', 'bad'); }
    },
    landed(G, th, p) {
      if (G.bat <= 0 || !inBox(p, [370, 400, 670, 620])) return false;
      if (th.id !== 'water') return false;
      G.bat = Math.max(0, G.bat - .34);
      if (G.bat <= 0) { G.flags.cooledT = G.time; burst(530, 520, '#ffffff', 16, 'steam'); SFX.hiss(); if (G.byId.scooter.fire === 0) { say('Батарея остыла и больше не вспыхнет. Получилось!', 'good'); return true; } return false; }
      if (G.byId.scooter.fire === 0) { burst(530, 520, '#ffffff', 10, 'steam'); SFX.hiss(); G.batT = 0; say('Батарея шипит и остывает. Ещё воды!', 'good'); return true; }
      return false;
    },
    done: G => G.bat <= 0,
    notDone: 'Батарея всё ещё горячая и может вспыхнуть снова. Остуди её водой!',
    hot: [{ x: 240, y: 405, r: 45, label: G => G.flags.plugged ? 'Выдернуть зарядку' : null, tap: G => { G.flags.plugged = false; G.flags.unplugT = G.time; SFX.unplug(); say('Зарядка выдернута. Теперь воду лить можно.', 'good'); } }],
    items: [
      { id: 'coats', name: 'куртки', draw: drawCoats, value: 1.2, aimAt: [905, 330], spots: [[830, 400, 40], [905, 372, 45], [980, 410, 40], [905, 260, 45]], box: [785, 150, 1025, 425] },
      { id: 'shoes', name: 'обувницу', draw: drawShoeRack, value: .8, aimAt: [210, 490], spots: [[140, 485, 40], [210, 480, 45], [285, 485, 40]], box: [90, 465, 335, 600] },
      { id: 'scooter', name: 'самокат', draw: drawScooter, value: 1.4, fire: .5, aimAt: [530, 515], spots: [[465, 530, 45], [535, 525, 50], [605, 530, 45]], box: [370, 290, 670, 595] }
    ],
    links: [['scooter', 'coats', .12], ['scooter', 'shoes', .14]],
    // попугай в клетке на крючке
    treasure: { flee: [-150, 60], name: 'Кеша', acc: 'Кешу', medal: 'Кеша спасён', x: 200, y: 180, r: 60, near: 'scooter', burnTime: 5, exit: [-120, 300], draw: drawParrot,
      savedMsg: 'Клетку с Кешей вынесли на лестницу. «Молодец! Молодец!» — кричит Кеша.',
      lostMsg: 'Кеша вырвался из клетки и улетел в форточку. Ищи его теперь по всему двору.' },
    medals: [
      { id: 'unplugfirst', name: 'Сначала зарядка', test: G => beforeThrow(G, G.flags.unplugT) },
      { id: 'coats', name: 'Куртки целы', test: G => !G.burned.has('coats') },
      { id: 'cool', name: 'Не дал вспыхнуть', secret: true, hint: 'Батарея горит изнутри', test: G => !G.flags.reignited }
    ]
  }
);
