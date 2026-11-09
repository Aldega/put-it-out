LEVELS.push(
  {
    id: 'tree', name: 'Новогодняя ёлка', bg: bgNewYear, dmgRate: 1.9, par: 12, reward: 60, flags: { plugged: true },
    intro: 'Без пяти полночь! Гирлянда на ёлке закоротила, и ёлка загорелась. Гирлянда всё ещё включена.',
    lesson: 'Ёлка горит как класс A, но на ней гирлянда под напряжением. Вода на включённой гирлянде бьёт током. Сначала выдерни удлинитель из розетки, потом лей воду. Песок, покрывало и порошковый огнетушитель можно и под напряжением.',
    back: G => drawTreeCord(G),
    boost: (G, it) => it.id === 'tree' && G.flags.plugged ? 1.5 : 1,
    live: [shockZone([540, 150, 860, 660], [700, 420], 'tree')],
    hot: [{ x: 1010, y: 470, r: 55, label: G => G.flags.plugged ? LABEL_PLUG : null, tap: G => { G.flags.plugged = false; SFX.unplug(); say('Удлинитель выдернут, гирлянда погасла. Теперь можно лить воду.', 'good'); } }],
    items: [
      { id: 'sofa', name: 'диван', draw: drawSofa, value: 1.6, aimAt: [240, 500], spots: [[150, 520, 70], [240, 515, 70], [330, 520, 70], [170, 425, 60], [320, 425, 60]], box: [50, 410, 440, 620] },
      { id: 'gifts', name: 'подарки', draw: drawGifts, value: 1, aimAt: [870, 520], spots: [[845, 545, 55], [850, 475, 50], [940, 560, 45]], box: [790, 440, 985, 615] },
      { id: 'tree', name: 'ёлку', draw: drawTree, value: 1.2, fire: .45, aimAt: [700, 420], spots: [[700, 260, 50], [670, 360, 60], [730, 380, 50], [690, 470, 70], [760, 480, 50], [640, 540, 60]], box: [540, 170, 860, 600] }
    ],
    links: [['tree', 'gifts', .15], ['tree', 'sofa', .09]],
    // щенок спит прямо у горящей ёлки
    treasure: { flee: true, name: 'Щенок', acc: 'щенка', medal: 'Щенок спасён', x: 470, y: 608, r: 60, near: 'tree', burnTime: 4, exit: [-100, 600], draw: drawPuppy,
      savedMsg: 'Щенок спасён и спрятался под диваном в коридоре.',
      lostMsg: 'Щенок испугался дыма и забился в угол. Его нужно было вынести сразу.' },
    medals: [
      { id: 'midnight', name: 'До полуночи', test: G => G.time < 8 },
      { id: 'gifts', name: 'Подарки целы', test: G => !G.burned.has('gifts') },
      { id: 'puppyfirst', name: 'Сначала щенок', secret: true, hint: 'Кто-то важнее подарков', test: G => beforeThrow(G, G.tr.savedT) }
    ]
  }
);
