LEVELS.push(
  {
    id: 'campfire', name: 'Костёр в траве', bg: bgCampfire, dmgRate: 2.0, par: 9, reward: 130, flags: { campfire: true },
    intro: 'Ветер раздул костёр, и искры подожгли сухую траву. Ветер гонит огонь прямо к стогу сена!',
    lesson: 'Сухая трава горит быстро, а ветер гонит огонь вперёд. Иногда умнее полить траву перед огнём: мокрая не загорится, и пожар упрётся в мокрую полосу. Костёр разводят в кругу из камней на голой земле, подальше от травы, и держат рядом ведро воды.',
    back: G => campfireFlames(G),
    boost: (G, it) => it.id.startsWith('g') ? 1.4 : 1,
    spreadBoost: () => 1.4,
    decor: [{ flag: 'campfire', x: 275, y: 600, r: 60, msg: 'Костёр в круге из камней тоже погас. Он-то как раз был безопасен.' }],
    items: [
      { id: 'hay', name: 'стог', draw: drawHaystack, value: 1.6, aimAt: [1110, 460], spots: [[1030, 545, 60], [1110, 525, 70], [1190, 545, 60], [1080, 420, 60], [1140, 400, 55]], box: [990, 315, 1235, 590] },
      { id: 'g3', name: 'траву у стога', draw: drawGrass3, value: .6, soakFree: true, soakTime: 12, aimAt: [880, 545], spots: [[820, 562, 50], [880, 558, 60], [945, 562, 50]], box: [795, 500, 985, 590] },
      { id: 'g2', name: 'траву посередине', draw: drawGrass2, value: .6, soakFree: true, soakTime: 12, aimAt: [690, 565], spots: [[620, 580, 55], [690, 576, 60], [755, 580, 50]], box: [590, 520, 790, 610] },
      { id: 'g1', name: 'траву у костра', draw: drawGrass1, value: .6, soakFree: true, soakTime: 12, fire: .45, aimAt: [480, 585], spots: [[415, 600, 50], [480, 596, 60], [545, 600, 55]], box: [380, 540, 585, 630] }
    ],
    // ветер дует вправо: к стогу огонь идёт быстро, назад медленно
    links: [['g1', 'g2', .26, .25], ['g2', 'g3', .26, .25], ['g3', 'hay', .22, .25]],
    // ёжик ушёл в траву у стога
    treasure: { name: 'Ёжик', acc: 'ёжика', medal: 'Ёжик спасён', x: 900, y: 512, r: 55, near: 'g3', burnTime: 2.5, exit: [1350, 700], draw: drawHedgehog,
      savedMsg: 'Ёжик спасён и утопал в лес вместе со своим яблоком.',
      lostMsg: 'Ёжик опалил иголки и убежал. Его надо было унести раньше.' },
    medals: [
      { id: 'hay', name: 'Стог цел', test: G => !G.burned.has('hay') },
      { id: 'wetline', name: 'Мокрая полоса', test: G => (G.wetBreaks || 0) > 0 && !G.burned.has('g3') },
      { id: 'campfire', name: 'Костёр горит дальше', secret: true, hint: 'Не всякий огонь нужно тушить', test: G => G.flags.campfire }
    ]
  }
);
