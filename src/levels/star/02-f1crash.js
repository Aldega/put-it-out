// Уровень со звёздочкой №2: тот же болид «Огонька» вылетел с трассы и загорелся.
LEVELS.push(
  {
    id: 'f1crash', name: 'Авария Ф-1', star: [17, 40], bg: bgF1Crash, dmgRate: 2, par: 16, reward: 320,
    flags: { crash: true, red: false, safe: false, wheel: false, ering: false, ext: false },
    intro: 'Болид «Огонька» вылетел с трассы и врезался в шинный барьер! Мотор горит, из пробитого бака течёт топливо, а мимо всё ещё несутся другие болиды.',
    lesson: 'При аварии сначала поднимают красный флаг: гонку останавливают, и только тогда маршалы выбегают на трассу. Порошок за секунды сбивает пламя, а пена AFFF остужает горячий карбон, чтобы он не вспыхнул снова. Батарею изнутри заливает кольцо «E».',
    init: G => {
      G.pass = { x: -400, t: 1.2, col: '#3fa9f5' }; G.med = null; G.refT = 0; G.flagK = 0;
      // маршалы на посту за трассой: побегут к болиду после красного флага
      G.mars = [
        { kind: 'powder', x0: 276, y0: 119, x1: 312, y1: 392, d: .35 },
        { kind: 'foam', x0: 338, y0: 119, x1: 412, y1: 388, d: .75 }
      ].map(m => ({ ...m, x: m.x0, y: m.y0, s: .62, gave: false, here: false }));
    },
    back: G => f1CrashBack(G),
    live: [{ box: [250, 370, 960, 590], at: [613, 400], on: () => true, extra: 'engine', msg: 'Лампа красная и не гаснет: после удара болид под током! Вода ударила током. Воду на болид нельзя.' }],
    boost: (G, it) => it.id === 'engine' && !G.flags.ering ? 1.25 : 1,
    tick(G, dt) {
      const e = G.byId.engine, P = G.pass;
      if (G.tr.state === 'fleeing') G.flags.wheel = true;
      // пока гонка идёт, по трассе проносятся болиды
      if (P.x > -260) P.x -= dt * 2400;
      else if (!G.flags.red) { P.t -= dt; if (P.t <= 0) { P.x = 1500; P.t = 1.6 + Math.random() * 1.4; P.col = ['#3fa9f5', '#e63b2e', '#7cc243', '#ff9d1f', '#ffffff'][Math.floor(Math.random() * 5)]; SFX.whoosh(); } }
      // подсказка, если флаг долго не поднимают
      if (!G.flags.red && !G.flags.flagHint && G.time > 7) { G.flags.flagHint = true; say('Гонка всё ещё идёт, к болиду никто не выбежит! За трассой на посту маршал держит красный флаг.', ''); }
      // флаг поднимается, маршалы перебегают трассу к болиду
      if (G.flags.red) {
        G.flagK = Math.min(1, G.flagK + dt * 2.5);
        for (const m of G.mars) {
          const k = Math.max(0, Math.min(1, (G.time - G.flags.redT - m.d) / 1.6)), e2 = k * k * (3 - 2 * k);
          m.x = m.x0 + (m.x1 - m.x0) * e2; m.y = m.y0 + (m.y1 - m.y0) * e2; m.s = .62 + .23 * e2; m.run = k > 0 && k < 1;
          if (k >= 1 && !m.here) { m.here = true; SFX.click(); }
        }
      }
      // машина медиков приезжает после красного флага
      if (G.med && G.med.x > 800) G.med.x = Math.max(800, G.med.x - dt * 520);
      if (e.fire > 0) { G.refT = 0; return; }
      // повреждённая батарея поджигает мотор, пока отсек не залит изнутри (кольцо «E»);
      // раскалённый карбон вспыхивает снова, пока его не охладили пеной
      if (G.flags.ering && e.foamed) { G.refT = 0; return; }
      G.refT += dt;
      if (G.refT > 3) {
        G.refT = 0; e.fire = .3; G.flags.reignited = true; SFX.flare(); sparks(G, 760, 450, 12);
        say(!G.flags.ering ? 'Повреждённая батарея снова подожгла мотор! Залей отсек изнутри: на корпусе есть кольцо «E».' : 'Раскалённый карбон снова вспыхнул! Порошок сбивает пламя, но не охлаждает. Залей мотор пеной.', 'bad');
      }
    },
    afterHit(G, th, p) {
      if (!inBox(p, G.byId.engine.box, 120)) return null;
      if (th.id === 'powder') { G.flags.powderT = G.time; return G.byId.engine.foamed ? null : ['Порошок мгновенно сбил пламя! Но карбон и металл ещё раскалены: следом залей мотор пеной.', 'good']; }
      if (th.id === 'foam') { if (G.flags.powderT != null) G.flags.combo = true; return ['Пена AFFF залила мотор плёнкой и остудила горячий карбон. Сам он больше не вспыхнет.', 'good']; }
      return null;
    },
    done: G => G.flags.red && G.flags.ering && G.byId.engine.foamed,
    notDone: G => !G.flags.red ? 'Огонь потушен, но гонка всё ещё идёт! Подними красный флаг: маршал держит его за трассой.' : !G.flags.ering ? 'Батарея ещё может поджечь мотор. Дёрни кольцо «E» на корпусе.' : !G.byId.engine.foamed ? 'Мотор ещё раскалён. Залей его пеной, иначе вспыхнет снова.' : '',
    spillMsg: 'Вода разбрызгала горящее топливо по гравию! Его тушат порошком, пеной или песком.',
    hot: [
      { x: 205, y: 200, r: 72, label: G => G.flags.red ? null : 'Поднять красный флаг', tap: G => {
        G.flags.red = true; G.flags.redT = G.time; G.med = { x: 1500 }; SFX.cloth(); SFX.ding();
        say('Красный флаг! Гонка остановлена, болиды сбросили скорость. Маршалы бегут к болиду, медики уже едут.', 'good');
      } },
      // маршалы: на посту ждут флага, у болида отдают огнетушители
      ...[0, 1].map(i => ({ dyn: G => {
        const m = G.mars[i];
        if (!G.flags.red) return i === 0 ? { x: 306, y: 140, r: 46, label: 'Маршалы' } : null;
        if (!m.here || m.gave) return null;
        return { x: m.x, y: m.y + 30 * m.s, r: 62, label: m.kind === 'foam' ? 'Пена у маршала' : 'Порошок у маршала' };
      }, tap: G => {
        const m = G.mars[i];
        if (!G.flags.red) { G.flags.rushed = true; SFX.whoosh(); say('Мимо несутся болиды! Маршалы не выбегут на трассу, пока гонка не остановлена. Сначала красный флаг.', 'bad'); return; }
        m.gave = true; giveTool(G, m.kind);
        if (m.kind === 'foam') { G.flags.foamT = G.time; say('Маршал отдал пенный огнетушитель AFFF. Пена ложится плёнкой и охлаждает горячий карбон, чтобы не вспыхнул снова.', 'good'); }
        else { G.flags.ext = true; G.flags.extT = G.time; say('Маршал отдал порошковый огнетушитель. Порошок за секунды сбивает открытое пламя!', 'good'); }
      } })),
      { x: 613, y: 380, r: 30, label: G => G.flags.lamp ? null : 'Лампа', tap: G => {
        G.flags.lamp = true; SFX.knob();
        say('Лампа горит красным и не гаснет: от удара гибридная система сломалась. Болид под током до самого конца, воду на него нельзя!', 'bad');
      } },
      { x: 648, y: 446, r: 26, label: G => G.flags.ering ? null : 'Кольцо «E»', tap: G => {
        const e = G.byId.engine; G.flags.ering = true; G.flags.eringT = G.time;
        e.fire = Math.max(0, e.fire - .45); if (e.fire < .05) e.fire = 0; e.wet = 3; e.heat = 0;
        for (let i = 0; i < 16; i++) G.parts.push({ k: 'puff', x: 680 + Math.random() * 200, y: 430 + Math.random() * 60, vx: (Math.random() - .5) * 80, vy: -30 - Math.random() * 40, life: 0, max: 1.6, r: 22 + Math.random() * 22 });
        SFX.puff(); SFX.hiss();
        say('Кольцо «E»! Встроенный огнетушитель залил батарею изнутри. Снаружи карбон ещё горячий: тут нужна пена.', 'good');
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
      savedMsg: G => tl('Пилот выпрыгнул одним махом, не касаясь болида и земли одновременно: лампа-то красная! Защитная дуга над головой выдержала удар.') + (G.flags.red ? tl(' Медики уже ждут.') : ''),
      lostMsg: 'Пилот сам сбросил руль, выпрыгнул и убежал к посту маршалов. Цел, но очень сердит!' },
    medals: [
      { id: 'redfirst', name: 'Сначала красный флаг', test: G => beforeThrow(G, G.flags.redT) },
      { id: 'combo', name: 'Порошок, потом пена', test: G => G.flags.combo },
      { id: 'barrier', name: 'Барьер не загорелся', secret: true, hint: 'Шины в барьере горят долго и чёрным дымом', test: G => !G.burned.has('barrier') }
    ]
  }
);
