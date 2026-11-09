LEVELS.push(
  {
    id: 'courtyard', name: 'Пожар у подъезда', bg: bgCourtyard, dmgRate: 1.8, par: 16, reward: 350, flags: { valve: false, hydrant: false },
    intro: 'Финал! У подъезда горит машина. Над ней жёлтая газовая труба, и она уже греется. Под машиной бензин, а на дереве дремлет кот.',
    lesson: 'В городе всё сразу: машина, бензин, газ и люди вокруг. Порядок такой: позвони 112, перекрой газ, спаси того, кто рядом, и только потом туши. Жёлтая труба на доме это газ, на ней есть кран. Пожарный гидрант во дворе даёт много воды, а бензин всё равно тушат песком или порошком.',
    init: G => { G.pipe = 0; },
    back: G => courtBack(G), front: G => courtFront(G),
    tick(G, dt) {
      const car = G.byId.car, j = G.byId.jet;
      if (G.flags.hydrant && car.fire > 0) { car.wet = Math.max(car.wet, .5); car.fire = Math.max(0, car.fire - .12 * dt); if (car.fire < .05) { car.fire = 0; SFX.hiss(); burst(560, 420, '#ffffff', 12, 'steam'); } }
      if (G.pipeBurst) return;
      if (car.fire > 0) G.pipe += dt * car.fire * .075; else G.pipe = Math.max(0, G.pipe - dt * .05);
      if (G.pipe >= 1) {
        G.pipeBurst = true; G.pipe = 1;
        if (G.flags.valve) { SFX.clank(); say('Труба от жара лопнула, но газ уже перекрыт. Вовремя!', 'good'); }
        else { j.fire = .7; G.jetT = G.time; G.dmg += 8; blast(560, 330); say('Газовая труба лопнула от жара, и газ загорелся факелом! Перекрой кран на трубе.', 'bad'); }
      }
    },
    done: G => !G.pipeBurst || G.flags.valve,
    notDone: 'Из трубы всё ещё идёт газ! Перекрой кран на жёлтой трубе.',
    gasHit: () => 'Факел газа не сбивают: газ всё равно идёт. Перекрой кран на жёлтой трубе!',
    spillMsg: 'Вода разбрызгала горящий бензин, и он растёкся по двору! Бензин тушат песком или порошком.',
    hot: [
      phoneHot(1200, 450),
      { x: 760, y: 330, r: 45, label: G => G.flags.valve ? null : 'Перекрыть газ', tap: G => {
        G.flags.valve = true; G.flags.valveT = G.time; SFX.knob(); const j = G.byId.jet;
        if (j.fire > 0) { j.fire = 0; burst(560, 320, '#ffffff', 8, 'steam'); say('Кран перекрыт, газ кончился, и факел погас сам.', 'good'); }
        else say('Газ перекрыт. Даже если труба лопнет, гореть там будет нечему.', 'good');
      } },
      { x: 1000, y: 500, r: 45, label: G => G.flags.hydrant ? null : 'Открыть гидрант', tap: G => { G.flags.hydrant = true; G.flags.hydrantT = G.time; SFX.splash(); say('Гидрант открыт, струя бьёт в машину. Воды много, но бензин под ней ею не потушить.', 'good'); } }
    ],
    items: [
      { id: 'tree', name: 'дерево', draw: drawCourtTree, value: 1, aimAt: [190, 330], spots: [[175, 540, 40], [190, 360, 55], [110, 300, 50], [270, 300, 50]], box: [60, 160, 320, 560] },
      { id: 'balcony', name: 'бельё на балконе', draw: drawCourtBalcony, value: 1.3, aimAt: [1090, 230], spots: [[990, 262, 40], [1090, 256, 45], [1190, 262, 40]], box: [950, 140, 1250, 276] },
      { id: 'puddle', name: 'бензин под машиной', cls: 'B', draw: drawCourtPuddle, value: .5, aimAt: [500, 575], spots: [[430, 592, 40], [500, 594, 45], [570, 592, 40]], box: [375, 562, 625, 602] },
      { id: 'car', name: 'машину', draw: drawCourtCar, value: 1.6, fire: .55, aimAt: [450, 440], spots: [[390, 450, 45], [450, 445, 45], [580, 402, 40]], box: [350, 388, 690, 560] },
      { id: 'jet', name: 'факел газа', cls: 'C', noFlame: true, draw: drawJetDummy, value: .8, aimAt: [560, 260], spots: [[560, 300, 40]], box: [510, 200, 610, 340] }
    ],
    links: [['car', 'puddle', .2, 1], ['car', 'tree', .07], ['puddle', 'tree', .09], ['jet', 'balcony', .2], ['car', 'balcony', .04]],
    // кот залез на дерево
    treasure: { flee: true, name: 'Кот', acc: 'кота', medal: 'Кот снят с дерева', x: 205, y: 250, r: 60, near: 'tree', burnTime: 3, exit: [-120, 600], draw: drawCat,
      savedMsg: 'Кота сняли с дерева. Он сразу удрал в подвал.',
      lostMsg: 'Кот спрыгнул с горящего дерева прямо в кусты. Цел, но обижен на весь двор.' },
    medals: [
      { id: 'called', name: 'Позвонил 112', test: G => G.flags.called },
      { id: 'balcony', name: 'Бельё цело', test: G => !G.burned.has('balcony') },
      { id: 'order', name: 'Всё по порядку', secret: true, hint: '112, газ, кот, и только потом вода', test: G => G.flags.calledT != null && G.flags.valveT != null && G.tr.savedT != null && G.flags.calledT < G.flags.valveT && G.flags.valveT < G.tr.savedT && beforeThrow(G, G.tr.savedT) }
    ]
  }
);
