LEVELS.push(
  {
    id: 'poplar', name: 'Тополиный пух', bg: bgPoplarYard, dmgRate: 1.7, par: 10, reward: 270,
    intro: 'Мальчишки подожгли тополиный пух у бордюра. Пух вспыхивает как порох и волной бежит по двору к качелям и машине!',
    lesson: 'Тополиный пух сгорает за секунду, но огонь бежит по нему быстрее, чем идёт человек, и поджигает всё на пути. Обогнать его нельзя, а отрезать можно: мокрый пух не горит. Поэтому летом дворы и улицы поливают и моют. А поджигать пух ради забавы нельзя никогда.',
    init: G => { G.truck = { x: 140, go: false, wait: 1.5 }; },
    back: G => poplarBack(G),
    boost: (G, it) => it.id[0] === 'f' ? 30 : 1,
    tick(G, dt) {
      // пух прогорает за пару секунд и больше не загорается
      for (const id of ['f1', 'f2', 'f3']) {
        const f = G.byId[id]; if (f.fire <= 0) continue;
        f.life = (f.life || 0) + dt;
        if (f.life > 4) { f.fire = 0; f.ash = true; f.safe = true; burst((f.box[0] + f.box[2]) / 2, f.box[1] + 20, '#6b6b6b', 8, 'steam'); }
      }
      // машина сначала заводится, потом едет вправо и моет асфальт перед собой
      const T = G.truck; if (!T.go || T.x > VW + 300) return;
      T.wait -= dt; if (T.wait > 0) return;
      T.x += dt * 200;
      for (const id of ['f1', 'f2', 'f3']) {
        const f = G.byId[id], cx = (f.box[0] + f.box[2]) / 2; if (f.ash || cx < T.x + 60 || cx > T.x + 300) continue;
        if (f.wet < 5) { f.wet = 15; if (f.fire > 0) { f.fire = 0; SFX.hiss(); burst((f.box[0] + f.box[2]) / 2, f.box[1] + 20, '#ffffff', 10, 'steam'); } }
      }
    },
    hot: [{ x: 140, y: 460, r: 70, label: G => G.truck.go ? null : 'Пустить поливалку', tap: G => { G.truck.go = true; G.flags.truckT = G.time; SFX.splash(); say('Водитель заводит поливальную машину. Сейчас она вымоет двор, а мокрый пух не горит!', 'good'); } }],
    items: [
      { id: 'car', name: 'машину', draw: drawYardCar, value: 1.8, aimAt: [1000, 420], spots: [[890, 420, 45], [1000, 395, 50], [1110, 420, 45]], box: [830, 384, 1170, 556] },
      { id: 'swing', name: 'качели', draw: drawSwing, value: 1, aimAt: [445, 400], spots: [[360, 460, 40], [530, 460, 40], [445, 312, 45]], box: [325, 290, 565, 560] },
      { id: 'f3', name: 'пух у машины', draw: drawFluff3, value: .2, soakFree: true, soakTime: 15, soakMsg: 'Пух у машины мокрый и не загорится.', aimAt: [630, 545], spots: [[590, 566, 45], [665, 562, 45]], box: [555, 535, 705, 575] },
      { id: 'f2', name: 'пух у качелей', draw: drawFluff2, value: .2, soakFree: true, soakTime: 15, soakMsg: 'Пух у качелей мокрый и не загорится.', aimAt: [405, 560], spots: [[320, 582, 45], [405, 580, 50], [490, 582, 45]], box: [285, 550, 525, 595] },
      { id: 'f1', name: 'пух у бордюра', draw: drawFluff1, value: .2, soakFree: true, soakTime: 15, fire: .6, aimAt: [140, 580], spots: [[70, 600, 45], [145, 598, 50], [220, 600, 45]], box: [25, 570, 260, 615] }
    ],
    links: [['f1', 'f2', .4, .3], ['f2', 'f3', .4, .3], ['f2', 'swing', .35], ['f3', 'car', .4]],
    // плюшевый зайка забыт на качелях
    treasure: { name: 'Зайка', acc: 'зайку', medal: 'Зайка спасён', x: 445, y: 468, r: 55, near: 'f2', burnTime: 2, exit: [-120, 420], draw: drawBunny,
      savedMsg: 'Зайку сняли с качелей. Малыш, который его забыл, будет счастлив.',
      lostMsg: 'Зайка закоптился и стал серым. Придётся стирать.' },
    medals: [
      { id: 'car', name: 'Машина цела', test: G => !G.burned.has('car') },
      { id: 'swing', name: 'Качели целы', test: G => !G.burned.has('swing') },
      { id: 'truck', name: 'Помыли двор', secret: true, hint: 'Летом улицы моют неспроста', test: G => G.flags.truckT != null }
    ]
  }
);
