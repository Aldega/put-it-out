LEVELS.push(
  {
    id: 'station', name: 'Пожар на станции', bg: bgStation, dmgRate: 1.8, par: 16, reward: 420, flags: { off: false },
    intro: 'Финал! На станции загорелся тепловоз, под ним солярка. Сверху провода под током, а к тепловозу прицеплена цистерна с газом!',
    lesson: 'Над путями провода под током 27 000 вольт. Пока диспетчер не снял напряжение, воду туда лить нельзя: звони 112, они свяжутся с диспетчером. Цистерну уводят от огня: отцепляют и откатывают, а если не успели, поливают водой, чтобы не перегрелась. Солярку тушат песком или порошком.',
    init: G => { G.cist = { x: 0, heat: 0, wet: 0 }; },
    back: G => stationBack(G), front: G => stationFront(G),
    live: [{ box: [250, 280, 670, 540], at: [460, 320], on: G => !G.flags.off, extra: 'loco', msg: 'Вода попала под провода с током. Удар! Сначала позвони 112, чтобы сняли напряжение.' }],
    tick(G, dt) {
      const C = G.cist, loco = G.byId.loco;
      if (G.flags.offAt != null && !G.flags.off && G.time >= G.flags.offAt) { G.flags.off = true; G.flags.offT = G.time; SFX.unplug(); say('Диспетчер снял напряжение с проводов. Теперь тепловоз можно поливать водой.', 'good'); }
      C.wet = Math.max(0, C.wet - dt);
      if (C.rolling) { C.x = Math.min(520, C.x + dt * 220); if (C.x >= 520) C.gone = true; return; }
      if (C.gone || C.boom) return;
      const f = Math.max(loco.fire, G.byId.diesel.fire * .7);
      if (f > 0 && C.wet <= 0) C.heat += dt * f * .06; else C.heat = Math.max(0, C.heat - dt * .06);
      if (C.heat >= 1) { C.boom = C.gone = true; G.mistakes++; G.dmg += 30; blast(885, 430); for (const it of G.items) it.fire = Math.min(1, Math.max(it.fire, .3) + .3); say('Цистерна перегрелась и взорвалась! Её надо было отцепить или поливать водой.', 'bad'); }
    },
    landed(G, th, p) {
      const C = G.cist;
      if (C.gone || C.rolling || !inBox(p, [690, 350, 1080, 520])) return false;
      if (th.id === 'water') { C.heat = Math.max(0, C.heat - .4); C.wet = 3; G.flags.cooled = true; SFX.hiss(); say('Цистерну полили водой, она остывает. А лучше отцепить её и откатить!', 'good'); }
      else say('Цистерну охлаждают водой. Или отцепи её от тепловоза.', '');
      return true;
    },
    spillMsg: 'Вода разбрызгала горящую солярку по путям! Её тушат песком или порошком.',
    hot: [
      { x: 1190, y: 260, r: 55, label: G => G.flags.called ? null : 'Позвонить 112', tap: G => { G.flags.called = true; G.flags.calledT = G.time; G.flags.offAt = G.time + 2.5; SFX.dial(); say('Алло, 112? Горит тепловоз на станции! Пожарные едут, а диспетчер сейчас снимет напряжение с проводов.', 'good'); } },
      { x: 680, y: 490, r: 45, label: G => G.cist.rolling || G.cist.gone ? null : 'Отцепить цистерну', tap: G => { const C = G.cist; C.rolling = true; G.flags.uncT = G.time; SFX.clank(); say('Цистерну отцепили, и она покатилась прочь от огня. Газ в безопасности!', 'good'); } }
    ],
    items: [
      { id: 'booth', name: 'будку стрелочника', draw: drawBooth, value: 1, aimAt: [100, 400], spots: [[60, 440, 40], [140, 440, 40], [100, 330, 45]], box: [16, 290, 184, 530] },
      { id: 'diesel', name: 'солярку на путях', cls: 'B', draw: drawDiesel, value: .5, fire: .35, aimAt: [470, 578], spots: [[340, 592, 40], [430, 594, 45], [520, 594, 45], [600, 592, 35]], box: [295, 566, 645, 600] },
      { id: 'loco', name: 'тепловоз', draw: drawLoco, value: 1.6, fire: .5, aimAt: [480, 380], spots: [[420, 360, 45], [500, 356, 50], [590, 360, 45]], box: [250, 280, 670, 540] }
    ],
    links: [['loco', 'diesel', .2, 1], ['diesel', 'booth', .1], ['loco', 'booth', .05]],
    // посылки на тележке у края платформы
    treasure: { name: 'Посылки', acc: 'посылки', medal: 'Посылки спасены', x: 205, y: 590, r: 60, near: 'diesel', burnTime: 5, exit: [-120, 500], draw: drawParcels,
      savedMsg: 'Тележку с посылками откатили подальше. Подарки приедут вовремя!',
      lostMsg: 'Коробки с посылками обгорели. Кто-то не дождётся своих подарков.' },
    medals: [
      { id: 'called', name: 'Позвонил 112', test: G => G.flags.called },
      { id: 'cist', name: 'Цистерна в безопасности', test: G => !G.cist.boom },
      { id: 'order', name: 'Всё по порядку', secret: true, hint: '112, цистерна, посылки, и только потом тушить', test: G => G.flags.calledT != null && G.flags.uncT != null && G.tr.savedT != null && G.flags.calledT < G.flags.uncT && G.flags.uncT < G.tr.savedT && beforeThrow(G, G.tr.savedT) }
    ]
  }
);
