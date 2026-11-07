LEVELS.push(
  {
    id: 'candle', name: 'Свеча и штора', bg: bgBedroom, dmgRate: 2.0, par: 11, reward: 70, flags: { windowOpen: true, candle: true },
    decor: [{ flag: 'candle', x: 820, y: 400, r: 50, msg: 'Свеча погасла. Правильно: источник огня тоже нужно убрать.' }],
    tick(G, dt) { const c = G.byId.curtain; if (G.flags.candle && c.fire === 0 && c.wet <= 0) { c.heat += dt * .3; if (c.heat >= 1) { c.heat = 0; c.fire = .25; SFX.spread(); say('Свеча всё ещё горит рядом со шторой, и штора снова вспыхнула! Задуй свечу.', 'bad'); } } },
    done: G => !G.flags.candle,
    notDone: 'Штора погасла, но свеча всё ещё горит рядом с ней. Задуй свечу!',
    intro: 'Свечу поставили слишком близко к шторе, и штора вспыхнула. Свеча всё ещё горит, а окно открыто, тянет сквозняк.',
    lesson: 'Огонь питается кислородом. Сквозняк из открытого окна раздувает пламя и гонит его дальше, поэтому окно при пожаре нужно закрыть. Штора горит как класс A, её тушат водой или покрывалом. И не забудь про саму свечу: пока она горит рядом, штора будет загораться снова. Свечи держи подальше от штор!',
    back: G => drawSash(G),
    boost: G => G.flags.windowOpen ? 1.9 : 1,
    spreadBoost: G => G.flags.windowOpen ? 1.6 : 1,
    hot: [{ x: 820, y: 395, r: 40, label: G => G.flags.candle ? 'Задуть свечу' : null, tap: G => { G.flags.candle = false; SFX.puff(); G.parts.push({ k: 'steam', x: 820, y: 395, vx: 0, vy: -30, life: 0, max: 1.5, r: 8 }); say('Свеча задута. Теперь штора больше не загорится от неё.', 'good'); } },
      { x: 505, y: 265, r: 120, label: G => G.flags.windowOpen ? 'Закрыть окно' : null, tap: G => { G.flags.windowOpen = false; G.flags.windowT = G.time; SFX.creak(); say('Окно закрыто. Без сквозняка огонь сразу ослаб.', 'good'); } }],
    items: [
      { id: 'bed', name: 'кровать', draw: drawBedroomBed, value: 1.6, aimAt: [1040, 500], spots: [[990, 480, 60], [1060, 470, 60], [1150, 455, 60], [1200, 380, 40]], box: [955, 330, 1250, 620] },
      { id: 'stand', name: 'тумбочку', draw: drawNightstand, value: 1, aimAt: [865, 500], spots: [[850, 470, 60], [900, 470, 50], [865, 560, 50]], box: [790, 450, 940, 620] },
      { id: 'curtain', name: 'штору', draw: drawCurtain, value: 1.2, fire: .45, aimAt: [700, 380], spots: [[700, 560, 60], [705, 460, 60], [700, 360, 55], [690, 260, 50], [690, 170, 45]], box: [640, 92, 790, 590] }
    ],
    links: [['curtain', 'stand', .16], ['stand', 'bed', .13]],
    // семейный фотоальбом лежит на тумбочке рядом со шторой
    treasure: { name: 'Фотоальбом', acc: 'альбом', medal: 'Альбом спасён', x: 900, y: 440, r: 50, near: 'stand', burnTime: 3, exit: [1350, 380], draw: drawAlbum,
      savedMsg: 'Фотоальбом спасён. Документы и фото выносят первыми из вещей.',
      lostMsg: 'Фотоальбом сгорел. Таких фотографий больше нет.' },
    medals: [
      { id: 'windowfirst', name: 'Сначала окно', test: G => beforeThrow(G, G.flags.windowT) },
      { id: 'bed', name: 'Кровать цела', test: G => !G.burned.has('bed') },
      { id: 'nowater', name: 'Без воды', secret: true, test: G => G.waterThrows === 0 }
    ]
  }
);
