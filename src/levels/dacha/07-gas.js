LEVELS.push(
  {
    id: 'propane', name: 'Газовый баллон', bg: bgSummerKitchen, dmgRate: 1.9, par: 10, reward: 190, flags: { valve: false },
    intro: 'На летней кухне треснул шланг у баллона, и из трещины бьёт струя горящего газа. Баллон нагревается!',
    lesson: 'Горящую струю газа не сбивают: пламя погаснет, а газ будет идти дальше и взорвётся от любой искры. Сначала перекрой вентиль, тогда огонь погаснет сам. Баллон, который греется рядом с огнём, поливают водой, чтобы он не взорвался. Газовые баллоны держат на улице, в железном шкафу, а шланги проверяют каждую весну.',
    init: G => { G.cyl = 0; },
    back: G => skBack(G), front: G => skFront(G),
    tick(G, dt) {
      const j = G.byId.jet;
      if (!G.cylGone && j.fire > 0) G.cyl += dt * .05;
      if (G.flags.leaking && !G.flags.valve) {
        G.gas = Math.min(100, G.gas + dt * 22);
        if (G.gas >= 100) { G.flags.leaking = false; G.gas = 0; G.mistakes++; G.dmg += 15; blast(330, 380); j.fire = .8; for (const it of G.items) if (it.fire > 0 || it.id === 'cloth') it.fire = Math.min(1, it.fire + .3); say('Газ скопился и рванул от огня на скатерти! Струю нельзя сбивать, пока газ идёт.', 'bad'); }
      } else G.gas = Math.max(0, G.gas - dt * 15);
      if (!G.cylGone && G.cyl >= 1) {
        G.cylGone = true; G.mistakes++; G.dmg += 30; j.fire = 0; G.flags.leaking = false; blast(225, 470);
        for (const it of G.items) if (it.id !== 'jet') it.fire = Math.min(1, Math.max(it.fire, .3) + .3);
        say('Баллон перегрелся и взорвался! Его надо было остужать водой.', 'bad');
      }
    },
    done: G => G.flags.valve || G.cylGone,
    notDone: 'Газ всё ещё идёт! Перекрой вентиль на баллоне.',
    gasHit(G, it, tool) {
      if (tool === 'powder' || tool === 'blanket') { it.fire = 0; G.flags.leaking = true; return 'Пламя сбито, но газ всё ещё идёт и копится! Он рванёт от первой искры. Скорее перекрой вентиль!'; }
      return 'Струю газа так не сбить: она бьёт под давлением. Перекрой вентиль на баллоне!';
    },
    landed(G, th, p) {
      if (G.cylGone || !inBox(p, [150, 320, 300, 610])) return false;
      if (th.id === 'water') { G.cyl = Math.max(0, G.cyl - .45); G.flags.cooled = true; SFX.hiss(); burst(225, 380, '#ffffff', 12, 'steam'); say('Баллон полит водой и остыл. Теперь перекрой вентиль!', 'good'); }
      else say('Баллон надо охлаждать водой.', '');
      return true;
    },
    hot: [{ x: 225, y: 335, r: 50, label: G => G.flags.valve || G.cylGone ? null : 'Закрыть вентиль', tap: G => {
      G.flags.valve = true; G.flags.valveT = G.time; SFX.knob(); const j = G.byId.jet;
      if (j.fire > 0) { j.fire = 0; burst(330, 380, '#ffffff', 8, 'steam'); say('Вентиль перекрыт, газ кончился, и струя погасла сама. Так и надо!', 'good'); }
      else say('Вентиль перекрыт, газ больше не идёт.', 'good');
    } }],
    items: [
      { id: 'curtain', name: 'занавески', draw: drawVerandaCurtains, value: 1.2, aimAt: [910, 250], spots: [[790, 330, 45], [800, 230, 45], [1030, 330, 45], [1020, 230, 45]], box: [740, 100, 1080, 350] },
      { id: 'cloth', name: 'скатерть', draw: drawTablecloth, value: 1, aimAt: [560, 470], spots: [[460, 475, 45], [540, 480, 50], [620, 480, 50], [700, 475, 45]], box: [420, 420, 770, 515] },
      { id: 'jet', name: 'струю газа', cls: 'C', noFlame: true, draw: drawJetDummy, value: .6, fire: .7, aimAt: [350, 365], spots: [[320, 380, 40], [395, 388, 45]], box: [262, 320, 450, 420] }
    ],
    links: [['jet', 'cloth', .2], ['cloth', 'curtain', .14]],
    // бабушкино варенье варится на плитке
    treasure: { name: 'Варенье', acc: 'варенье', medal: 'Варенье спасено', x: 575, y: 345, r: 60, near: 'cloth', burnTime: 3, exit: [1350, 420], draw: drawJam,
      savedMsg: 'Таз с вареньем унесли в дом. Зимой будет чай с клубникой!',
      lostMsg: 'Варенье подгорело и пахнет дымом. Бабушка не обрадуется.' },
    medals: [
      { id: 'valvefirst', name: 'Сначала вентиль', test: G => beforeThrow(G, G.flags.valveT) },
      { id: 'curtain', name: 'Занавески целы', test: G => !G.burned.has('curtain') },
      { id: 'cool', name: 'Баллон остужен', secret: true, hint: 'Баллону тоже жарко', test: G => G.flags.cooled && !G.cylGone }
    ]
  }
);
