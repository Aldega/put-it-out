LEVELS.push(
  {
    id: 'urn', name: 'Урна на остановке', bg: bgBusStop, dmgRate: 1.7, par: 8, reward: 200,
    intro: 'Кто-то бросил непотушенный окурок в урну, и мусор загорелся. Рядом лавка, а на лавке кто-то забыл букет!',
    lesson: 'Мусор в урне горит и дымит, а пламя легко перекидывается на лавку и афиши. Урну проще всего заглушить: накрой её, и без воздуха огонь задохнётся. Подойдёт и вода. Окурки и спички в урну бросают только потушенными.',
    lidMsg: 'Урну накрыли крышкой, и без воздуха огонь задохнулся. Просто и быстро!',
    landed(G, th, p) { if (th.id === 'lid' && inBox(p, [60, 380, 240, 600])) G.flags.lidUrn = true; return false; },
    items: [
      { id: 'poster', name: 'афишу', draw: drawStopPoster, value: 1.2, aimAt: [696, 400], spots: [[670, 470, 40], [722, 470, 40], [696, 360, 45]], box: [640, 240, 755, 485] },
      { id: 'bench', name: 'лавку', draw: drawStopBench, value: 1, aimAt: [450, 440], spots: [[340, 452, 45], [420, 452, 50], [500, 452, 50], [575, 452, 40]], box: [290, 395, 615, 565] },
      { id: 'urn', name: 'урну', lidable: true, draw: drawUrn, value: .8, fire: .55, aimAt: [145, 430], spots: [[125, 445, 40], [165, 445, 40]], box: [95, 420, 195, 565] }
    ],
    links: [['urn', 'bench', .14], ['bench', 'poster', .12]],
    // букет забыли на лавке
    treasure: { name: 'Букет', acc: 'букет', medal: 'Букет спасён', x: 545, y: 420, r: 55, near: 'bench', burnTime: 3, exit: [1350, 300], draw: drawBouquet,
      savedMsg: 'Букет убрали подальше от огня. Кто-то очень расстроится, если его не дождутся.',
      lostMsg: 'Цветы завяли от жара. Букет больше никого не обрадует.' },
    medals: [
      { id: 'bench', name: 'Лавка цела', test: G => !G.burned.has('bench') },
      { id: 'poster', name: 'Афиша цела', test: G => !G.burned.has('poster') },
      { id: 'lid', name: 'Накрыл урну', secret: true, hint: 'У урны нет крышки, а у тебя есть', test: G => G.flags.lidUrn && G.used.size === 1 }
    ]
  }
);
