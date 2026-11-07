LEVELS.push(
  {
    id: 'log', name: 'Полено у камина', bg: bgLiving, dmgRate: 2.2, par: 10, reward: 30,
    intro: 'Полено выкатилось из камина на ковёр. Нажми ведро, и вода полетит в огонь. Можно и прицелиться: коснись огня пальцем.',
    lesson: 'Дерево, ткань и ковёр горят как класс A. Вода охлаждает их лучше всего. Песок тоже помогает, но медленнее. Крышкой полено не накрыть.',
    flags: { fireplace: true },
    back: G => { if (G.flags.fireplace) fireplaceFire(time); else if (Math.random() < .06) G.parts.push({ k: 'smoke', x: 1040 + (Math.random() - .5) * 60, y: 555, vx: 0, vy: -30, life: 0, max: 2, r: 10 }); },
    decor: [{ flag: 'fireplace', x: 1040, y: 545, r: 70, msg: 'Огонь в камине тоже погас. Вообще-то он был безопасен: камин для того и сделан, чтобы в нём горел огонь.' }],
    items: [
      { id: 'armchair', name: 'кресло', draw: drawArmchair, value: 1.6, aimAt: [260, 500], spots: [[200, 515, 70], [260, 510, 70], [320, 515, 60], [200, 410, 70], [300, 410, 70]], box: [120, 390, 400, 620] },
      { id: 'rug', name: 'ковёр', draw: drawRug, value: 1.2, aimAt: [420, 650], spots: [[330, 662, 60], [420, 672, 70], [520, 678, 60], [690, 678, 60], [790, 672, 70], [870, 662, 60]], box: [270, 618, 930, 702] },
      { id: 'log', name: 'полено', draw: drawLog, value: 1, fire: .55, aimAt: [620, 575], spots: [[500, 592, 60], [565, 588, 70], [630, 588, 70], [695, 592, 60], [748, 596, 50]], box: [470, 560, 780, 655] }
    ],
    links: [['log', 'rug', .16], ['rug', 'armchair', .12]],
    // кот спит на краю ковра у кресла: огонь доберётся до него по ковру
    treasure: { name: 'Кот', acc: 'кота', medal: 'Кот спасён', x: 378, y: 660, r: 60, near: 'rug', burnTime: 2.5, exit: [-100, 600], draw: drawCat,
      savedMsg: 'Кот спасён и убежал в коридор. Сначала люди и животные, потом вещи.',
      lostMsg: 'Кот обжёгся и с воплем убежал. В следующий раз вынеси его сразу.' },
    medals: [
      { id: 'fireplace', name: 'Камин горит дальше', secret: true, hint: 'Камин тут ни при чём…', test: G => G.flags.fireplace },
      { id: 'sand', name: 'Только песком', test: G => G.used.size === 1 && G.used.has('sand') },
      { id: 'fast', name: 'Быстрее 5 секунд', test: G => G.time < 5 }
    ]
  }
);
