// Уровень со звёздочкой: открыт сразу, стоит в самом начале карты первого эпизода (star: [x%, y%]).
LEVELS.push(
  {
    id: 'f1', name: 'Болид Ф-1', star: [6, 44], bg: bgF1, dmgRate: 1.9, par: 14, reward: 300,
    flags: { plugged: true, safe: false, wheel: false, ering: false, ext: false },
    intro: 'Болид заехал на пит-стоп, и из-под крышки мотора вырвалось пламя! Пилот ещё в кокпите, а лампа на дуге над ним горит красным.',
    lesson: 'Лампа над пилотом показывает, под током ли батарея болида: красная значит «не трогать», зелёная значит «можно». Чтобы вылезти, пилот снимает руль. Кольцо с буквой «E» запускает встроенный огнетушитель, а горящее топливо тушат порошком, не водой.',
    back: G => f1Back(G),
    live: [
      { box: [250, 370, 960, 590], at: [613, 400], on: G => !G.flags.safe, extra: 'engine', msg: 'Лампа ещё красная, болид под током! Вода ударила током. Сначала обесточь гибридную систему.' },
      { box: [62, 410, 200, 594], at: [130, 440], on: G => G.flags.plugged, extra: 'tyres', msg: 'Грелки для шин включены в розетку! Вода на них ударила током. Сначала выдерни вилку.' }
    ],
    boost: (G, it) => it.id === 'engine' && !G.flags.safe ? 1.4 : it.id === 'tyres' && G.flags.plugged ? 1.6 : 1,
    tick(G, dt) {
      const e = G.byId.engine;
      if (G.tr.state === 'fleeing') G.flags.wheel = true;
      // батарея разряжается, лампа мигает жёлтым, потом загорается зелёным
      if (!G.flags.safe && G.flags.drainT != null && G.time - G.flags.drainT >= 4) {
        G.flags.safe = true; G.flags.safeT = G.time; SFX.ding();
        say('Лампа зелёная! Болид обесточен: теперь его можно трогать, и мотор больше не загорится сам.', 'good');
      }
      // пока система под током, перегретая батарея снова поджигает мотор
      if (G.flags.safe || G.flags.drainT != null || e.fire > 0) { G.refT = 0; return; }
      G.refT = (G.refT || 0) + dt;
      if (G.refT > 3) { G.refT = 0; e.fire = .3; G.flags.reignited = true; SFX.flare(); sparks(G, 760, 450, 12); say('Перегретая батарея снова подожгла мотор! Лампа красная: обесточь болид, коснись лампы.', 'bad'); }
    },
    done: G => G.flags.safe,
    notDone: G => G.flags.drainT == null ? 'Лампа на болиде всё ещё красная, батарея может снова поджечь мотор. Коснись лампы, чтобы обесточить болид.' : '',
    spillMsg: 'Вода разбрызгала горящее топливо по всему пит-лейну! Его тушат порошком или песком.',
    hot: [
      { x: 613, y: 380, r: 32, label: G => G.flags.drainT == null ? 'Обесточить болид' : null, tap: G => {
        G.flags.drainT = G.flags.ersT = G.time; SFX.knob(); SFX.unplug();
        say(G.tr.state === 'here' ? 'Пилот щёлкнул выключателем гибридной системы. Батарея разряжается, жди зелёную лампу!' : 'Механик отключил гибридную систему. Батарея разряжается, жди зелёную лампу!', '');
      } },
      { x: 648, y: 446, r: 26, label: G => G.flags.ering ? null : 'Кольцо «E»', tap: G => {
        const e = G.byId.engine; G.flags.ering = true; G.flags.eringT = G.time;
        e.fire = Math.max(0, e.fire - .45); if (e.fire < .05) e.fire = 0; e.wet = 3; e.heat = 0;
        for (let i = 0; i < 16; i++) G.parts.push({ k: 'puff', x: 680 + Math.random() * 200, y: 430 + Math.random() * 60, vx: (Math.random() - .5) * 80, vy: -30 - Math.random() * 40, life: 0, max: 1.6, r: 22 + Math.random() * 22 });
        SFX.puff(); SFX.hiss();
        say('Ты дёрнул кольцо «E», и встроенный огнетушитель залил мотор пеной изнутри! Такое кольцо есть на каждом гоночном болиде.', 'good');
      } },
      { x: 230, y: 350, r: 40, label: G => G.flags.plugged ? LABEL_PLUG : null, tap: G => {
        G.flags.plugged = false; G.flags.plugT = G.time; SFX.unplug();
        say('Грелки для шин выключены. Теперь шины можно и водой поливать.', 'good');
      } },
      { x: 1100, y: 470, r: 60, label: G => G.flags.ext ? null : 'Огнетушитель маршала', tap: G => {
        G.flags.ext = true; G.flags.extT = G.time; giveTool(G, 'powder');
        say('Маршал отдал тебе свой огнетушитель. Порошку ток не страшен, и горящее топливо он сбивает быстро!', 'good');
      } }
    ],
    items: [
      { id: 'tyres', name: 'шины в грелках', draw: drawF1Tyres, value: .8, aimAt: [130, 480], spots: [[130, 560, 40], [130, 500, 42], [130, 446, 36]], box: [66, 418, 194, 594] },
      { id: 'spill', name: 'топливо под болидом', cls: 'B', draw: drawF1Spill, value: .5, fire: .35, aimAt: [560, 590], spots: [[470, 606, 38], [560, 610, 44], [650, 606, 38]], box: [410, 592, 710, 624] },
      { id: 'engine', name: 'болид', cls: 'B', draw: drawF1Car, value: 2, fire: .65, aimAt: [770, 430], spots: [[690, 420, 36], [770, 446, 42], [850, 462, 36]], box: [600, 380, 940, 540] }
    ],
    links: [['engine', 'spill', .16], ['spill', 'tyres', .1]],
    // пилот в кокпите: сначала снять руль, потом выбраться
    treasure: { flee: [1360, 520], name: 'Пилот', acc: 'пилота', medal: 'Пилот спасён', x: 575, y: 432, r: 48, near: 'engine', burnTime: 6, exit: [1010, 330], draw: drawF1Pilot,
      gateLabel: G => G.flags.wheel ? null : 'Снять руль',
      gate: G => { if (G.flags.wheel) return true; G.flags.wheel = true; SFX.clank(); say('Пилот снял руль: без этого из тесного кокпита не вылезти. Коснись пилота ещё раз!', ''); return false; },
      savedMsg: G => G.flags.safe ? 'Лампа зелёная, и пилот спокойно выбрался из болида. Цел и уже машет команде!' : 'Лампа красная, болид под током! Пилот выпрыгнул одним махом, не касаясь машины и земли одновременно. Так учат всех гонщиков.',
      lostMsg: 'Пилот сам сбросил руль, выпрыгнул и убежал от огня в бокс. Цел, но очень сердит!' },
    medals: [
      { id: 'ersfirst', name: 'Сначала обесточить', test: G => beforeThrow(G, G.flags.ersT) },
      { id: 'ering', name: 'Кольцо «E»', test: G => G.flags.ering },
      { id: 'pit', name: 'Быстрее пит-стопа', secret: true, hint: 'Команда работает быстро и слаженно', test: G => G.time <= 10 }
    ]
  }
);
