LEVELS.push(
  {
    id: 'shed', name: 'Сарай с бензином', bg: bgShed, dmgRate: 2.0, par: 12, reward: 160, can: { x: 305, y: 600 },
    intro: 'В сарае загорелись опилки на верстаке. Рядом стоит канистра с бензином для газонокосилки, и она уже греется!',
    lesson: 'Бензин в канистре от жара закипает, и канистра лопается огненным шаром. Убери её от огня первой, лучше всего на улицу. Опилки и дерево туши водой, а горящий бензин водой не тушат: только песок, покрывало или порошок. И не храни бензин рядом с опилками.',
    front: G => drawJerrycan(G),
    tick(G, dt) {
      const c = G.can; if (c.gone || c.safe) return;
      const b = G.byId.bench, d = Math.hypot(c.x - 515, c.y - 520);
      if (b.fire > 0 && d < 320 && !c.drag) c.heat += b.fire * dt * .085 * (1.4 - d / 320);
      else c.heat = Math.max(0, c.heat - dt * .05);
      if (c.heat >= 1) { c.gone = true; G.mistakes++; G.dmg += 18; blast(c.x, c.y - 40); for (const it of G.items) it.fire = Math.min(1, Math.max(it.fire, .25) + .25); say('Канистра лопнула, и бензин вспыхнул огненным шаром! Огонь по всему сараю.', 'bad'); }
    },
    drag: {
      grab: (G, p) => !G.can.gone && !G.can.safe && Math.hypot(p.x - G.can.x, p.y - (G.can.y - 45)) < 70,
      move: (G, p) => { G.can.x = Math.max(60, Math.min(1240, p.x)); G.can.y = Math.max(480, Math.min(600, p.y + 45)); },
      drop(G) { const c = G.can; if (c.x > 1120 || Math.hypot(c.x - 515, c.y - 520) > 420) { c.safe = true; c.safeT = G.time; c.heat = 0; SFX.knob(); say(c.x > 1120 ? 'Канистра на улице, там ей и место. Теперь туши верстак!' : 'Канистра подальше от огня. Теперь туши верстак!', 'good'); } else say('Ещё близко к огню. Тащи канистру к двери!', ''); }
    },
    hot: [{ x: 0, y: 0, r: 0, dyn: G => G.can.gone || G.can.safe ? null : { x: G.can.x, y: G.can.y - 45, r: 70, label: 'Тащи к двери' } }],
    items: [
      { id: 'shelf', name: 'полку с красками', draw: drawPaintShelf, value: 1.3, aimAt: [960, 380], spots: [[880, 250, 45], [990, 250, 45], [880, 370, 45], [990, 370, 45], [900, 490, 45], [1010, 490, 45]], box: [820, 170, 1095, 600] },
      { id: 'wood', name: 'поленницу', draw: drawWoodpile, value: 1, aimAt: [160, 500], spots: [[100, 560, 50], [190, 560, 50], [120, 480, 50], [200, 460, 45], [150, 420, 40]], box: [45, 400, 270, 605] },
      { id: 'bench', name: 'верстак', draw: drawWorkbench, value: 1, fire: .5, aimAt: [510, 440], spots: [[420, 452, 50], [490, 440, 60], [560, 445, 55], [630, 452, 45]], box: [360, 400, 670, 600] }
    ],
    links: [['bench', 'wood', .15], ['bench', 'shelf', .12]],
    // котята спят в коробке под верстаком
    treasure: { name: 'Котята', acc: 'котят', medal: 'Котята спасены', x: 560, y: 640, r: 60, near: 'bench', burnTime: 6, exit: [1350, 520], draw: drawKittens,
      savedMsg: 'Коробку с котятами вынесли на травку. Мама-кошка уже бежит.',
      lostMsg: 'Котята надышались дымом. Их выходили, но коробку надо было вынести сразу.' },
    medals: [
      { id: 'canfirst', name: 'Сначала канистра', test: G => beforeThrow(G, G.can.safeT) },
      { id: 'shelf', name: 'Краски целы', test: G => !G.burned.has('shelf') },
      { id: 'outside', name: 'Канистру за порог', secret: true, hint: 'Бензину в сарае не место', test: G => G.can.safe && G.can.x > 1120 }
    ]
  }
);
