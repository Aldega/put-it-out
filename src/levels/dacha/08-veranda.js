LEVELS.push(
  {
    id: 'veranda', name: 'Пожар на веранде', bg: bgVeranda, dmgRate: 1.8, par: 15, reward: 250, flags: { plugged: true }, can: { x: 760, y: 560 },
    intro: 'Финал! Проводка на веранде закоротила, и веранда горит. Ток не выключен, у крыльца канистра с бензином, а Шарик сидит на цепи у будки.',
    lesson: 'На даче всё сразу: ток, бензин, ветер и дерево. Порядок такой: выключи рубильник, убери от огня бензин, выведи людей и животных, а потом туши. Под напряжением воду не льют. Огнетушитель и бочка с водой на участке не роскошь, а самое нужное.',
    back: G => verandaBack(G), front: G => drawJerrycan(G),
    spreadBoost: () => 1.2,
    live: [shockZone([400, 260, 720, 600], [550, 420], 'veranda')],
    boost: (G, it) => it.id === 'veranda' && G.flags.plugged ? 1.5 : 1,
    tick(G, dt) {
      const c = G.can; if (c.gone || c.safe) return;
      let h = 0;
      for (const [id, x, y] of [['veranda', 550, 450], ['bush', 800, 480]]) { const it = G.byId[id], d = Math.hypot(c.x - x, c.y - y); if (it.fire > 0 && d < 320) h += it.fire * .08 * (1.4 - d / 320); }
      if (h > 0 && !c.drag) c.heat += h * dt; else c.heat = Math.max(0, c.heat - dt * .05);
      if (c.heat >= 1) { c.gone = true; G.mistakes++; G.dmg += 18; blast(c.x, c.y - 40); for (const it of G.items) it.fire = Math.min(1, Math.max(it.fire, .25) + .2); say('Канистра с бензином взорвалась! Огонь по всему участку.', 'bad'); }
    },
    drag: {
      grab: (G, p) => !G.can.gone && !G.can.safe && Math.hypot(p.x - G.can.x, p.y - (G.can.y - 45)) < 70,
      move: (G, p) => { G.can.x = Math.max(110, Math.min(1240, p.x)); G.can.y = Math.max(480, Math.min(560, p.y + 45)); },
      drop(G) { const c = G.can; if (c.x > 1100 || c.x < 130) { c.safe = true; c.safeT = G.time; c.heat = 0; SFX.knob(); say('Канистра далеко от огня. Молодец!', 'good'); } else say('Тут ещё жарко. Тащи канистру к калитке, подальше от всего, что горит.', ''); }
    },
    hot: [
      { x: 60, y: 410, r: 55, label: G => G.flags.plugged ? 'Выключить рубильник' : null, tap: G => { G.flags.plugged = false; G.flags.switchT = G.time; SFX.unplug(); say('Рубильник выключен, на участке нет тока. Воду лить можно.', 'good'); } },
      { x: 0, y: 0, r: 0, dyn: G => G.can.gone || G.can.safe ? null : { x: G.can.x, y: G.can.y - 45, r: 70, label: 'Тащи к калитке' } }
    ],
    items: [
      { id: 'house', name: 'дом', draw: drawDachaHouse, value: 2, aimAt: [275, 400], spots: [[200, 560, 50], [275, 560, 55], [350, 560, 50], [220, 290, 50], [330, 290, 50]], box: [125, 150, 400, 590] },
      { id: 'kennel', name: 'будку', draw: drawKennel, value: 1, aimAt: [985, 480], spots: [[930, 540, 45], [1040, 540, 45], [985, 440, 55]], box: [885, 370, 1085, 560] },
      { id: 'bush', name: 'сирень', draw: drawLilac, value: .8, aimAt: [800, 480], spots: [[760, 540, 45], [830, 530, 50], [790, 460, 50]], box: [700, 385, 895, 570] },
      { id: 'veranda', name: 'веранду', draw: drawVerandaRoom, value: 1.5, fire: .45, aimAt: [550, 450], spots: [[440, 560, 50], [510, 560, 55], [590, 560, 55], [660, 560, 50], [470, 400, 50], [630, 410, 50]], box: [400, 260, 720, 600] }
    ],
    links: [['veranda', 'house', .1], ['veranda', 'bush', .16, .5], ['bush', 'kennel', .16, .5]],
    // Шарик на цепи у будки
    treasure: { flee: true, name: 'Шарик', acc: 'Шарика', medal: 'Шарик спасён', x: 1010, y: 525, r: 60, near: 'kennel', burnTime: 3, exit: [1350, 640], draw: drawDog,
      savedMsg: 'Шарика отстегнули с цепи, и он умчался за калитку. Гав!',
      lostMsg: 'Шарик сорвался с цепи и удрал за забор. Цел, но перепуган. Его надо было отстегнуть сразу.' },
    medals: [
      { id: 'switchfirst', name: 'Сначала рубильник', test: G => beforeThrow(G, G.flags.switchT) },
      { id: 'house', name: 'Дом цел', test: G => !G.burned.has('house') },
      { id: 'order', name: 'Всё по порядку', secret: true, hint: 'Ток, бензин, друг, и только потом вода', test: G => G.flags.switchT != null && G.can.safeT != null && G.tr.savedT != null && G.flags.switchT < G.can.safeT && G.can.safeT < G.tr.savedT && beforeThrow(G, G.tr.savedT) }
    ]
  }
);
