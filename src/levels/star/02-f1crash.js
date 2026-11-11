// Уровень со звёздочкой №2: тот же болид «Огонька» вылетел с трассы и загорелся.
LEVELS.push(
  {
    id: 'f1crash', name: 'Авария Ф-1', star: [17, 40], bg: bgF1Crash, dmgRate: 2, par: 16, reward: 320,
    flags: { crash: true, red: false, safe: false, wheel: false, ering: false, ext: false },
    intro: 'Болид «Огонька» вылетел с трассы и врезался в шинный барьер! Мотор горит, из пробитого бака течёт топливо, а мимо всё ещё несутся другие болиды.',
    lesson: 'При аварии маршал сначала поднимает красный флаг. Гонку останавливают, и только тогда маршалы выбегают на трассу и едут медики. Если после удара лампа так и горит красным, болид под током: воду на него нельзя, тушат порошком. Защитная дуга над головой пилота выдерживает огромный удар.',
    init: G => { G.pass = { x: -400, t: 1.2, col: '#3fa9f5' }; G.med = null; G.refT = 0; },
    back: G => f1CrashBack(G),
    live: [{ box: [250, 370, 960, 590], at: [613, 400], on: () => true, extra: 'engine', msg: 'Лампа красная и не гаснет: после удара болид под током! Вода ударила током. Его тушат только порошком или песком.' }],
    boost: (G, it) => it.id === 'engine' && !G.flags.ering ? 1.25 : 1,
    tick(G, dt) {
      const e = G.byId.engine, P = G.pass;
      if (G.tr.state === 'fleeing') G.flags.wheel = true;
      // пока гонка идёт, по трассе проносятся болиды
      if (P.x > -260) P.x -= dt * 2400;
      else if (!G.flags.red) { P.t -= dt; if (P.t <= 0) { P.x = 1500; P.t = 1.6 + Math.random() * 1.4; P.col = ['#3fa9f5', '#e63b2e', '#7cc243', '#ff9d1f', '#ffffff'][Math.floor(Math.random() * 5)]; SFX.whoosh(); } }
      // машина медиков приезжает после красного флага
      if (G.med && G.med.x > 800) G.med.x = Math.max(800, G.med.x - dt * 520);
      // повреждённая батарея снова поджигает мотор, пока отсек не залит изнутри (кольцо «E»)
      if (G.flags.ering || e.fire > 0) { G.refT = 0; return; }
      G.refT += dt;
      if (G.refT > 3) { G.refT = 0; e.fire = .3; G.flags.reignited = true; SFX.flare(); sparks(G, 760, 450, 12); say('Повреждённая батарея снова подожгла мотор! Залей отсек изнутри: на корпусе есть кольцо «E».', 'bad'); }
    },
    done: G => G.flags.red && G.flags.ering,
    notDone: G => !G.flags.red ? 'Огонь потушен, но гонка всё ещё идёт! Подними красный флаг на посту маршалов.' : '',
    spillMsg: 'Вода разбрызгала горящее топливо по гравию! Его тушат порошком или песком.',
    hot: [
      { x: 1012, y: 260, r: 48, label: G => G.flags.red ? null : 'Красный флаг', tap: G => {
        G.flags.red = true; G.flags.redT = G.time; G.med = { x: 1500 }; SFX.cloth(); SFX.ding();
        say('Красный флаг! Гонка остановлена, болиды сбросили скорость. Маршалы могут выбегать, а медики уже едут.', 'good');
      } },
      { x: 1100, y: 470, r: 60, label: G => G.flags.ext ? null : 'Огнетушитель маршала', tap: G => {
        if (!G.flags.red) { G.flags.rushed = true; SFX.whoosh(); say('Мимо несутся болиды! Маршал не выбежит на трассу, пока гонка не остановлена. Сначала красный флаг.', 'bad'); return; }
        G.flags.ext = true; G.flags.extT = G.time; giveTool(G, 'powder');
        say('Маршал перебежал гравий и отдал тебе огнетушитель. Порошку ток не страшен!', 'good');
      } },
      { x: 613, y: 380, r: 30, label: G => G.flags.lamp ? null : 'Лампа', tap: G => {
        G.flags.lamp = true; SFX.knob();
        say('Лампа горит красным и не гаснет: от удара гибридная система сломалась. Болид под током до самого конца, воду на него нельзя!', 'bad');
      } },
      { x: 648, y: 446, r: 26, label: G => G.flags.ering ? null : 'Кольцо «E»', tap: G => {
        const e = G.byId.engine; G.flags.ering = true; G.flags.eringT = G.time;
        e.fire = Math.max(0, e.fire - .45); if (e.fire < .05) e.fire = 0; e.wet = 3; e.heat = 0;
        for (let i = 0; i < 16; i++) G.parts.push({ k: 'puff', x: 680 + Math.random() * 200, y: 430 + Math.random() * 60, vx: (Math.random() - .5) * 80, vy: -30 - Math.random() * 40, life: 0, max: 1.6, r: 22 + Math.random() * 22 });
        SFX.puff(); SFX.hiss();
        say('Кольцо «E»! Встроенный огнетушитель залил мотор и батарею пеной изнутри. Больше сам не загорится.', 'good');
      } }
    ],
    items: [
      { id: 'barrier', name: 'шинный барьер', draw: drawF1Barrier, value: 1, aimAt: [126, 480], spots: [[70, 560, 40], [130, 486, 46], [180, 420, 38]], box: [14, 360, 240, 596] },
      { id: 'spill', name: 'топливо в гравии', cls: 'B', draw: drawF1Spill, value: .5, fire: .3, aimAt: [560, 590], spots: [[470, 606, 38], [560, 610, 44], [650, 606, 38]], box: [410, 592, 710, 624] },
      { id: 'engine', name: 'болид', cls: 'B', draw: drawF1Car, value: 2, fire: .6, aimAt: [770, 430], spots: [[690, 420, 36], [770, 446, 42], [850, 462, 36]], box: [600, 380, 940, 540] }
    ],
    links: [['engine', 'spill', .16], ['spill', 'barrier', .12], ['engine', 'barrier', .04]],
    // пилот оглушён ударом, но цел: снять руль и выпрыгнуть
    treasure: { flee: [1220, 560], name: 'Пилот', acc: 'пилота', medal: 'Пилот спасён', x: 575, y: 432, r: 48, near: 'engine', burnTime: 6, exit: [800, 240], draw: drawF1Pilot,
      gateLabel: G => G.flags.wheel ? null : 'Снять руль',
      gate: G => { if (G.flags.wheel) return true; G.flags.wheel = true; SFX.clank(); say('Пилот снял руль, руки целы. Коснись ещё раз, чтобы он выбрался!', ''); return false; },
      savedMsg: G => 'Пилот выпрыгнул одним махом, не касаясь болида и земли одновременно: лампа-то красная! Защитная дуга над головой выдержала удар.' + (G.flags.red ? ' Медики уже ждут.' : ''),
      lostMsg: 'Пилот сам сбросил руль, выпрыгнул и убежал к посту маршалов. Цел, но очень сердит!' },
    medals: [
      { id: 'redfirst', name: 'Сначала красный флаг', test: G => beforeThrow(G, G.flags.redT) },
      { id: 'ering', name: 'Кольцо «E» сразу', test: G => G.flags.eringT != null && !G.flags.reignited },
      { id: 'barrier', name: 'Барьер не загорелся', secret: true, hint: 'Шины в барьере горят долго и чёрным дымом', test: G => !G.burned.has('barrier') }
    ]
  }
);
