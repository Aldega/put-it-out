LEVELS.push(
  {
    id: 'fuel', name: 'Заправка', bg: bgFuel, dmgRate: 1.9, par: 13, reward: 320, flags: { stop: false, ext: false },
    intro: 'На заправке у колонки разлился и вспыхнул бензин. Колонка всё ещё качает топливо, а рядом стоит бензовоз!',
    lesson: 'На каждой заправке есть кнопка аварийной остановки: она разом выключает все колонки, и бензин перестаёт литься. Рядом всегда висит огнетушитель и стоит ящик с песком. Бензин тушат порошком или песком, а бензовоз уводят подальше. На заправке глушат мотор и не курят.',
    init: G => { G.tank = { x: 0, heat: 0 }; G.refT = 0; },
    back: G => fuelBack(G),
    boost: (G, it) => it.id === 'spill' && !G.flags.stop ? 1.6 : 1,
    tick(G, dt) {
      const s = G.byId.spill, T = G.tank;
      if (T.leaving && !T.gone) { T.x += dt * 260; if (T.x > 400) T.gone = true; }
      if (!T.leaving && !T.gone) {
        const f = Math.max(s.fire, G.byId.car.fire * .6);
        if (f > 0) T.heat += dt * f * .055; else T.heat = Math.max(0, T.heat - dt * .05);
        if (T.heat >= 1) { T.gone = true; G.mistakes++; G.dmg += 35; blast(760, 410); for (const it of G.items) it.fire = Math.min(1, Math.max(it.fire, .3) + .3); say('Бензовоз перегрелся и рванул! Его надо было отогнать первым делом.', 'bad'); }
      }
      if (G.flags.stop || s.fire > 0) { G.refT = 0; return; }
      G.refT += dt;
      if (G.refT > 3) { G.refT = 0; s.fire = .3; G.flags.reignited = true; SFX.flare(); say('Колонка всё качает бензин, и он снова вспыхнул! Жми аварийный стоп на стене магазина.', 'bad'); }
    },
    done: G => G.flags.stop,
    notDone: 'Колонка всё ещё качает бензин! Нажми аварийный стоп на стене магазина.',
    spillMsg: 'Вода разбрызгала горящий бензин по всей заправке! Его тушат порошком или песком.',
    hot: [
      { x: 1084, y: 404, r: 45, label: G => G.flags.stop ? null : 'Аварийный стоп', tap: G => { G.flags.stop = true; G.flags.stopT = G.time; SFX.knob(); SFX.unplug(); say('Все колонки выключены, бензин больше не течёт. Теперь туши!', 'good'); } },
      { x: 1205, y: 525, r: 45, label: G => G.flags.ext ? null : 'Огнетушитель АЗС', tap: G => { G.flags.ext = true; G.flags.extT = G.time; giveTool(G, 'powder'); say('Огнетушитель с пожарного щита у тебя. Порошок отлично сбивает горящий бензин!', 'good'); } },
      { x: 950, y: 430, r: 55, label: G => G.tank.leaving || G.tank.gone ? null : 'Отогнать бензовоз', tap: G => { G.tank.leaving = true; G.flags.tankT = G.time; SFX.creak(); say('Водитель бензовоза отъехал подальше. Одной огромной опасностью меньше!', 'good'); } }
    ],
    items: [
      { id: 'car', name: 'машину у колонки', draw: drawFuelCar, value: 1.5, aimAt: [420, 450], spots: [[360, 450, 45], [440, 446, 45], [560, 420, 40]], box: [300, 388, 636, 560] },
      { id: 'spill', name: 'бензин у колонки', cls: 'B', draw: drawFuelSpill, value: .6, fire: .45, aimAt: [290, 575], spots: [[160, 592, 40], [250, 594, 45], [340, 594, 45], [420, 592, 35]], box: [115, 562, 465, 602] }
    ],
    links: [['spill', 'car', .14]],
    // пёс в машине ждёт хозяина
    treasure: { name: 'Пёс', acc: 'пса', medal: 'Пёс спасён', x: 525, y: 425, r: 50, near: 'spill', burnTime: 5, exit: [-120, 560], draw: drawCarDog,
      savedMsg: 'Пса вывели из машины и отвели к магазину. Хвост виляет!',
      lostMsg: 'Пёс наглотался дыма и чихает. Ему нужен ветеринар.' },
    medals: [
      { id: 'stopfirst', name: 'Сначала аварийный стоп', test: G => beforeThrow(G, G.flags.stopT) },
      { id: 'tanker', name: 'Бензовоз отогнан', test: G => G.flags.tankT != null },
      { id: 'nowater', name: 'Ни капли воды', secret: true, hint: 'Бензин водой не тушат', test: G => !G.used.has('water') }
    ]
  }
);
