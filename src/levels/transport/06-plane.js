LEVELS.push(
  {
    id: 'plane', name: 'Пауэрбанк в самолёте', bg: bgPlane, dmgRate: 1.9, par: 10, reward: 300, can: { x: 450, y: 456 }, noTools: ['sand'],
    intro: 'В полёте у пассажира задымился пауэрбанк и поджёг кресло. Песка на борту нет, зато на тележке есть ведёрко со льдом!',
    lesson: 'Литиевый аккумулятор раскаляется изнутри и вспыхивает снова и снова. Пламя сбивают водой, а сам пауэрбанк кладут в воду или лёд, чтобы остыл. Поэтому пауэрбанки возят только в ручной клади, а не в багаже: в салоне его заметят и потушат сразу.',
    init: G => { G.pbT = 0; },
    front: G => planeFront(G),
    boost: (G, it) => it.id === 'seat' && !G.can.safe ? 1.5 : 1,
    tick(G, dt) {
      const s = G.byId.seat, c = G.can;
      if (c.safe || s.fire > 0 || Math.hypot(c.x - 450, c.y - 456) > 140) { G.pbT = 0; return; }
      G.pbT += dt;
      if (G.pbT > 3) { G.pbT = 0; s.fire = .35; G.flags.reignited = true; SFX.flare(); burst(c.x, c.y, '#ffcf4a', 20, 'drop'); say('Пауэрбанк всё ещё раскалён и снова поджёг кресло! Неси его в ведёрко со льдом.', 'bad'); }
    },
    done: G => G.can.safe,
    notDone: 'Пауэрбанк ещё горячий и может вспыхнуть. Положи его в ведёрко со льдом на тележке!',
    drag: {
      grab(G, p) {
        const c = G.can; if (c.safe || Math.hypot(p.x - c.x, p.y - c.y) > 60) return false;
        if (G.byId.seat.fire > .3) { say('Слишком горячо, кресло горит! Сначала сбей пламя.', ''); return false; }
        return true;
      },
      move(G, p) { G.can.x = Math.max(60, Math.min(1240, p.x)); G.can.y = Math.max(300, Math.min(600, p.y)); },
      drop(G) {
        const c = G.can;
        if (Math.hypot(c.x - 965, c.y - 345) < 80) { c.safe = true; c.safeT = G.time; c.x = 965; c.y = 340; SFX.hiss(); burst(965, 330, '#ffffff', 16, 'steam'); say('Пауэрбанк шипит во льду и остывает. Больше не вспыхнет!', 'good'); }
        else say('Неси пауэрбанк прямо в ведёрко со льдом на тележке!', '');
      }
    },
    hot: [{ x: 0, y: 0, r: 0, dyn: G => G.can.safe ? null : { x: G.can.x, y: G.can.y, r: 55, label: 'Тащи в ведёрко' } }],
    items: [
      { id: 'overhead', name: 'багажную полку', draw: drawOverhead, value: 1.2, aimAt: [450, 150], spots: [[350, 190, 40], [450, 190, 45], [550, 190, 40]], box: [-20, 110, 760, 190] },
      { id: 'seat2', name: 'соседнее кресло', draw: drawPlaneSeat2, value: 1, aimAt: [640, 440], spots: [[600, 470, 40], [660, 470, 40]], box: [560, 320, 730, 560] },
      { id: 'seat', name: 'кресло', draw: drawPlaneSeat, value: 1, fire: .45, aimAt: [430, 440], spots: [[390, 470, 40], [460, 470, 45]], box: [360, 320, 530, 560] }
    ],
    links: [['seat', 'seat2', .12], ['seat', 'overhead', .1]],
    // игрушка ребёнка на соседнем кресле
    treasure: { name: 'Слонёнок', acc: 'слонёнка', medal: 'Слонёнок спасён', x: 240, y: 430, r: 55, near: 'seat', burnTime: 4, exit: [1350, 300], draw: drawElephant,
      savedMsg: 'Плюшевого слонёнка отдали хозяйке. Она больше не плачет!',
      lostMsg: 'Слонёнок пропах дымом. Его постирают, но он уже не тот.' },
    medals: [
      { id: 'noreignite', name: 'Без повторной вспышки', test: G => !G.flags.reignited },
      { id: 'overhead', name: 'Полка цела', test: G => !G.burned.has('overhead') },
      { id: 'quick', name: 'Быстрее паники', secret: true, hint: 'Ведёрко ближе, чем кажется', test: G => G.can.safeT != null && G.can.safeT < 8 }
    ]
  }
);
