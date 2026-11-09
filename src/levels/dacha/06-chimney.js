LEVELS.push(
  {
    id: 'chimney', name: 'Искры из трубы', bg: bgChimney, dmgRate: 1.9, par: 12, reward: 180, flags: { damper: false },
    intro: 'В трубе загорелась сажа! Труба гудит и плюётся искрами, одна уже подожгла дрова под навесом. Заслонку видно через открытую дверь.',
    lesson: 'Сажа в дымоходе может загореться: труба гудит и сыплет искрами на крышу и на всё, что рядом. Закрой заслонку, и без тяги огонь в трубе задохнётся. Воду в трубу не льют: горячий кирпич трескается. Трубу чистят от сажи каждый год, а дрова и листья держат подальше от дома.',
    init: G => { G.chim = 1; },
    back: G => chimneyBack(G), front: G => chimneyFront(G),
    tick(G, dt) {
      if (G.flags.damper) { G.chim = Math.max(0, G.chim - dt * .4); return; }
      // искры из трубы поджигают крышу и листья
      for (const [id, rate] of [['roof', .06], ['leaves', .05]]) {
        const it = G.byId[id]; if (it.fire > 0 || it.wet > 0) continue;
        it.heat += dt * rate; if (it.heat >= 1) { it.heat = 0; it.fire = .2; SFX.spread(); say(id === 'roof' ? 'Искра из трубы подожгла листья на крыше! Закрой заслонку.' : 'Искры долетели до кучи листьев!', 'bad'); }
      }
    },
    done: G => G.flags.damper && G.chim === 0,
    notDone: G => G.flags.damper ? null : 'Труба всё ещё горит и сыплет искрами. Закрой заслонку в печи!',
    landed(G, th, p) {
      if (!inBox(p, [240, 0, 365, 225])) return false;
      if (th.id === 'water' && G.chim > 0) { G.mistakes++; G.dmg += 6; G.flags.cracked = true; burst(302, 120, '#ffffff', 20, 'steam'); SFX.hiss(); shake(); say('Вода попала в раскалённую трубу: кирпич треснул от холода! В трубу воду не льют, закрой заслонку.', 'bad'); return true; }
      say('Огонь в трубе сверху не достать. Ему нужна тяга: закрой заслонку в печи.', ''); return true;
    },
    hot: [{ x: 265, y: 470, r: 70, label: G => G.flags.damper ? null : 'Закрыть заслонку', tap: G => { G.flags.damper = true; G.flags.damperT = G.time; SFX.clank(); say('Заслонка закрыта. Без тяги огонь в трубе задыхается.', 'good'); } }],
    items: [
      { id: 'roof', name: 'крышу', draw: drawHouseRoof, value: 1.8, aimAt: [450, 280], spots: [[200, 320, 55], [330, 300, 60], [470, 300, 60], [610, 300, 60], [730, 320, 55]], box: [90, 215, 815, 345] },
      { id: 'wood', name: 'дрова', draw: drawShedWood, value: 1, fire: .4, aimAt: [990, 520], spots: [[920, 560, 50], [990, 540, 55], [1060, 560, 50], [980, 470, 50]], box: [850, 400, 1110, 605] },
      { id: 'leaves', name: 'листья', draw: drawLeafHeap, value: .6, aimAt: [480, 620], spots: [[430, 636, 45], [480, 626, 50], [530, 636, 45]], box: [380, 580, 580, 655] }
    ],
    links: [['wood', 'roof', .08], ['leaves', 'roof', .06]],
    // кот греется на коньке крыши рядом с трубой
    treasure: { flee: true, name: 'Кот', acc: 'кота', medal: 'Кот спасён', x: 480, y: 188, r: 60, near: 'roof', burnTime: 3, exit: [-100, 600], draw: drawCat,
      savedMsg: 'Кота сняли с крыши. Он грелся у трубы и даже не заметил пожара.',
      lostMsg: 'Кот опалил хвост и спрыгнул с крыши в крапиву. Обижен на всех.' },
    medals: [
      { id: 'damperfirst', name: 'Сначала заслонка', test: G => beforeThrow(G, G.flags.damperT) },
      { id: 'roof', name: 'Крыша цела', test: G => !G.burned.has('roof') },
      { id: 'nocrack', name: 'Труба цела', secret: true, hint: 'В трубу воду не льют', test: G => !G.flags.cracked }
    ]
  }
);
