LEVELS.push(
  {
    id: 'car', name: 'Машина на парковке', bg: bgParking, dmgRate: 1.9, par: 11, reward: 220, flags: { hood: false },
    intro: 'На парковке у магазина задымилась машина: горит под капотом, а снизу натекла лужа бензина. Багажник открыт, в нём покупки!',
    lesson: 'Если горит под капотом, его не распахивают: свежий воздух раздувает огонь. Туши через решётку и щели, лучше всего порошком. Бензин под машиной водой не тушат, вода его разносит: только песок или порошок. И сразу звони 112, даже если справился сам.',
    front: G => drawPhone112(G),
    hot: [
      phoneHot(),
      { x: 561, y: 472, r: 40, label: G => G.flags.hood ? null : 'Открыть капот', tap: G => {
        G.flags.hood = true; G.mistakes++; G.dmg += 6; SFX.creak(); const c = G.byId.car; c.fire = Math.min(1, Math.max(c.fire, .3) + .35); fireball(390, 420);
        say('Капот распахнулся, огонь глотнул воздуха и полыхнул! Капот при пожаре не открывают, туши через решётку.', 'bad');
      } }
    ],
    items: [
      { id: 'car2', name: 'соседнюю машину', draw: drawNeighborCar, value: 1.6, aimAt: [900, 420], spots: [[790, 425, 45], [900, 400, 50], [1010, 425, 45]], box: [730, 385, 1070, 560] },
      { id: 'puddle', name: 'бензин под машиной', cls: 'B', draw: drawParkPuddle, value: .5, fire: .3, aimAt: [470, 575], spots: [[400, 592, 40], [470, 594, 45], [540, 592, 40]], box: [345, 562, 595, 602] },
      { id: 'car', name: 'машину', draw: drawBurningCar, value: 1.5, fire: .5, aimAt: [400, 440], spots: [[370, 450, 45], [430, 445, 45], [560, 402, 40]], box: [330, 388, 670, 560] }
    ],
    links: [['car', 'puddle', .25, 1], ['car', 'car2', .1], ['puddle', 'car2', .1]],
    spillMsg: 'Вода разбрызгала горящий бензин, и огонь растёкся по парковке! Бензин тушат песком или порошком.',
    // покупки в открытом багажнике
    treasure: { name: 'Покупки', acc: 'покупки', medal: 'Покупки спасены', x: 662, y: 420, r: 55, near: 'car', burnTime: 4, exit: [-120, 560], draw: drawGroceries,
      savedMsg: 'Пакеты вытащили из багажника. Арбуз цел!',
      lostMsg: 'Пакеты в багажнике закоптились. Арбуз теперь пахнет дымом.' },
    medals: [
      { id: 'called', name: 'Позвонил 112', test: G => G.flags.called },
      { id: 'car2', name: 'Соседняя машина цела', test: G => !G.burned.has('car2') },
      { id: 'clean', name: 'Без глупостей', secret: true, hint: 'Капот лучше не трогать, а лужу не поливать', test: G => !G.flags.hood && !G.spills }
    ]
  }
);
