// Уровень со звёздочкой №3: метановый ракетный двигатель загорелся на огневом стенде.
// Всё тушат с пульта в бункере: аварийный стоп, продувка азотом, водяной душ. Траву вокруг поливают лафетным стволом.
LEVELS.push(
  {
    id: 'rocket', name: 'Огненное сопло', star: [29, 30], bg: bgRocket, dmgRate: 1.8, par: 14, reward: 340,
    flags: { stop: false, n2: false },
    intro: 'Ночные огневые испытания метанового двигателя. На сороковой секунде у турбонасоса лопнула трубка, и двигатель загорелся прямо на стенде! Ты в бункере у пульта испытаний.',
    lesson: 'На стенде двигатель тушат не огнетушителем, а кнопками в бункере. Аварийный стоп закрывает клапаны метана и кислорода, и огню становится нечего есть. Потом двигатель продувают азотом: он сам не горит и выдувает остатки топлива. Водяной душ остужает стенд, а траву вокруг поливают лафетными стволами. Люди всё это время сидят в бункере. Утечка жидкого кислорода раздувает любой огонь, поэтому стоп нажимают первым.',
    init: G => { G.plumeK = 1; G.deluge = 0; G.purge = 0; },
    back: G => rocketBack(G),
    front: G => rocketFront(G),
    // пока клапаны открыты, кислород раздувает огонь; после стопа в двигателе догорают остатки
    boost: (G, it) => !G.flags.stop ? (it.id === 'grass' ? 1 : 1.5) : it.id === 'engine' ? .6 : 1,
    // раскалённая струя поджигает траву, только пока двигатель работает
    linkOk: (G, a, b) => !(a === 'grass' && b === 'engine') && !(a === 'engine' && b === 'grass' && G.flags.stop),
    tick(G, dt) {
      const e = G.byId.engine, F = G.flags;
      if (F.stop) G.plumeK = Math.max(0, G.plumeK - dt / 1.2);
      else if (Math.random() < dt * 3) G.parts.push({ k: 'smoke', x: 560 + Math.random() * 40, y: 240, vx: (Math.random() - .5) * 30, vy: -60, life: 0, max: 2, r: 18 });
      // водяной душ: поливает двигатель и кабели, огонь на них не разгорается
      if (G.deluge > 0) {
        G.deluge -= dt;
        for (const id of ['engine', 'cables']) { const it = G.byId[id]; it.wet = Math.max(it.wet, .4); it.heat = 0; }
        const c = G.byId.cables;
        if (c.fire > 0) { c.fire = Math.max(0, c.fire - .22 * dt); if (c.fire < .05) { c.fire = 0; c.wet = 4; SFX.hiss(); burst(580, 520, '#ffffff', 10, 'steam'); } }
        if (Math.random() < dt * 4) burst(620 + Math.random() * 240, 530, '#bfe8ff', 4, 'drop');
        if (G.deluge <= 0) say('Водяной душ отработал. Если надо, включи его ещё раз.', '');
      }
      // продувка азотом: облака из сопла и из агрегатов, огонь в двигателе гаснет
      if (G.purge > 0) {
        G.purge -= dt; e.fire = Math.max(0, e.fire - dt * .4); e.wet = Math.max(e.wet, .3);
        if (Math.random() < dt * 14) G.parts.push({ k: 'puff', x: 846 + Math.random() * 30, y: RK_AXIS + (Math.random() - .5) * 160, vx: 80 + Math.random() * 120, vy: (Math.random() - .5) * 40, life: 0, max: 1.6, r: 18 + Math.random() * 16 });
        if (Math.random() < dt * 6) G.parts.push({ k: 'puff', x: 540 + Math.random() * 60, y: RK_AXIS - 80, vx: (Math.random() - .5) * 60, vy: -50, life: 0, max: 1.4, r: 14 + Math.random() * 10 });
        if (G.purge <= 0) {
          e.fire = 0; e.safe = true; F.n2 = true; F.n2DoneT = G.time; SFX.ding();
          say('Продувка закончена! Азот выдул из двигателя весь метан, и огонь внутри погас. Стенд безопасен.', 'good');
        }
      }
    },
    done: G => G.flags.n2,
    notDone: G => !G.flags.stop ? 'Клапаны всё ещё открыты! Жми аварийный стоп.' : !G.flags.n2 ? 'В двигателе остался метан. Продуй его азотом.' : '',
    gasHit: G => !G.flags.stop
      ? 'Это горят метан и кислород, которые насосы гонят прямо в двигатель. Пока они текут, огонь не сбить. Жми аварийный стоп!'
      : 'Двигатель заглох, но в его трубках остался метан, и он догорает изнутри. Снаружи туда не достать: включи продувку азотом!',
    hot: [
      { x: 137, y: 334, r: 50, label: G => G.flags.stop ? null : 'Аварийный стоп', tap: G => {
        const e = G.byId.engine; G.flags.stop = true; G.flags.stopT = G.time; e.fire = Math.min(e.fire, .45);
        SFX.knob(); SFX.clank(); shake('#ffffff');
        say('Аварийный стоп! Клапаны метана и кислорода закрылись, двигатель заглох. Но в трубках остался метан, он ещё горит. Продуй двигатель азотом!', 'good');
      } },
      { x: 82, y: 424, r: 40, label: G => G.flags.n2 || G.purge > 0 ? null : 'Продувка азотом', tap: G => {
        if (!G.flags.stop) {
          if (!G.flags.n2early) G.mistakes++;
          G.flags.n2early = true; SFX.hiss();
          say('Азот не пробьётся: двигатель ещё работает, и насосы гонят в него топливо. Сначала аварийный стоп!', 'bad'); return;
        }
        G.purge = 3; G.flags.n2T = G.time; SFX.hiss(); SFX.puff();
        say('Пошёл азот! Он не горит и выдувает остатки метана и кислорода из двигателя.', '');
      } },
      { x: 196, y: 424, r: 40, label: G => G.deluge > 0 ? null : 'Водяной душ', tap: G => {
        G.deluge = 6; G.flags.delugeT = G.flags.delugeT ?? G.time; SFX.splash(); SFX.hiss();
        say(G.flags.stop ? 'Водяной душ остужает стенд и кабели. Раскалённое сопло шипит!' : 'Водяной душ поливает стенд. Он остужает металл и кабели, но горящий метан из трубки водой не погасить.', 'good');
      } }
    ],
    items: [
      { id: 'cables', name: 'кабели', draw: drawRocketCables, value: .8, fire: .25, aimAt: [580, 520], spots: [[500, 528, 28], [580, 532, 32], [660, 528, 28]], box: [468, 428, 692, 552] },
      { id: 'grass', name: 'сухую траву', draw: drawRocketGrass, value: .7, soakFree: true, soakMsg: 'Ты полил траву за стендом. Пока она мокрая, огонь сюда не пройдёт.', aimAt: [1010, 500], spots: [[920, 532, 34], [1010, 528, 38], [1100, 532, 34]], box: [876, 470, 1180, 545] },
      { id: 'engine', name: 'двигатель', cls: 'C', draw: drawRocketEngine, value: 2, fire: .55, aimAt: [560, 320], spots: [[520, 296, 36], [578, 282, 40], [556, 412, 30]], box: [470, 236, 850, 444] }
    ],
    links: [['engine', 'cables', .14], ['engine', 'grass', .15], ['cables', 'grass', .04]],
    // корова пасётся у полигона: к рёву двигателей привыкла, а вот сирену не любит
    treasure: { flee: [1360, 490], name: 'Корова', acc: 'корову', medal: 'Корова спасена', x: 1192, y: 486, r: 56, near: 'grass', burnTime: 4, exit: [1360, 400], draw: drawCow,
      gateLabel: () => 'Включить сирену',
      savedMsg: () => { SFX.siren(); return 'Завыла сирена, и корова потрусила подальше от стенда. Коровы на полигонах давно привыкли к рёву двигателей, а сирену не любят!'; },
      lostMsg: 'Трава загорелась у самых копыт! Корова сама удрала в степь. Цела, но молоко сегодня будет с дымком.' },
    medals: [
      { id: 'stopfirst', name: 'Сначала стоп', test: G => beforeThrow(G, G.flags.stopT) },
      { id: 'order', name: 'Стоп, потом азот', test: G => !G.flags.n2early },
      { id: 'steppe', name: 'Степь не загорелась', secret: true, hint: 'Раскалённая струя бьёт прямо в сухую траву', test: G => !G.burned.has('grass') }
    ]
  }
);
