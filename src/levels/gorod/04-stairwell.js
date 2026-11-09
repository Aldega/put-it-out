LEVELS.push(
  {
    id: 'stairwell', name: 'Подъезд', bg: bgStairwell, dmgRate: 1.9, par: 11, reward: 230, flags: { lift: false, hose: false },
    intro: 'В подъезде под лестницей загорелась старая коляска. Дым ползёт вверх, а по лестнице спускается соседка баба Валя с котом.',
    lesson: 'При пожаре в доме лифтом не пользуются: он может застрять между этажами, а шахта тянет дым, как труба. Спускаются пешком. В подъездах многих домов есть красный шкафчик «ПК», пожарный кран: в нём рукав, подключённый к воде. И колясками под лестницей проход не загораживают.',
    back: G => stairBack(G), front: G => stairFront(G),
    spreadBoost: G => G.flags.lift ? 1.7 : 1,
    tick(G, dt) {
      if (!G.flags.hose) return;
      const s = G.byId.stroller; s.wet = Math.max(s.wet, .5);
      if (s.fire > 0) { s.fire = Math.max(0, s.fire - .22 * dt); if (s.fire < .05) { s.fire = 0; SFX.hiss(); burst(480, 440, '#ffffff', 12, 'steam'); say('Пожарный кран залил коляску. Вот зачем он висит в подъезде!', 'good'); } }
    },
    hot: [
      { x: 1002, y: 428, r: 40, label: G => G.flags.lift ? null : 'Вызвать лифт', tap: G => {
        G.flags.lift = true; G.mistakes++; G.dmg += 6; SFX.ding();
        say('Лифт приехал и открыл двери, а шахта потянула дым и огонь, как труба! При пожаре лифтом не пользуются.', 'bad');
      } },
      { x: 250, y: 518, r: 55, label: G => G.flags.hose ? null : 'Открыть пожарный кран', tap: G => { G.flags.hose = true; G.flags.hoseT = G.time; SFX.splash(); say('В шкафчике пожарный рукав! Вода пошла прямо на коляску.', 'good'); } }
    ],
    items: [
      { id: 'mail', name: 'почтовые ящики', draw: drawMailboxes, value: 1, aimAt: [185, 360], spots: [[110, 410, 40], [185, 410, 45], [260, 410, 40], [185, 310, 45]], box: [70, 230, 300, 425] },
      { id: 'door', name: 'дверь соседей', draw: drawFlatDoor, value: 1.5, aimAt: [652, 470], spots: [[620, 560, 40], [680, 560, 40], [652, 430, 45]], box: [590, 262, 715, 600] },
      { id: 'stroller', name: 'коляску', draw: drawStroller, value: .8, fire: .5, aimAt: [480, 440], spots: [[425, 462, 45], [485, 455, 50], [545, 462, 45]], box: [390, 380, 600, 595] }
    ],
    links: [['stroller', 'mail', .12], ['stroller', 'door', .13]],
    // соседка спускается по лестнице
    treasure: { flee: true, name: 'Соседка', acc: 'соседку', medal: 'Соседка выведена', x: 1120, y: 400, r: 65, near: 'stroller', burnTime: 6, exit: [-120, 460], draw: drawGranny,
      savedMsg: 'Бабу Валю с котом вывели на улицу. Она уже рассказывает всему двору, какой ты молодец.',
      lostMsg: 'Баба Валя закашлялась от дыма и вернулась к себе ждать пожарных. Её надо было вывести сразу.' },
    medals: [
      { id: 'nolift', name: 'Пешком, без лифта', test: G => !G.flags.lift },
      { id: 'door', name: 'Дверь соседей цела', test: G => !G.burned.has('door') },
      { id: 'hose', name: 'Пожарный кран', secret: true, hint: 'В подъезде висит красный шкафчик', test: G => G.flags.hose }
    ]
  }
);
