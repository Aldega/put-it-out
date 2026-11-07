LEVELS.push(
  {
    id: 'gas', name: 'Запах газа', bg: bgGasKitchen, dmgRate: 2.0, par: 9, reward: 120, flags: { valveClosed: false, windowOpen: false, light: false }, gas: 35,
    intro: 'Ночь. На кухне сильно пахнет газом: конфорку открыли, а огонь задуло. Огня пока нет. Что будешь делать?',
    lesson: 'Если пахнет газом: не включай свет и электроприборы, не зажигай огонь. Любая искра взорвёт газ. Перекрой кран на трубе, открой окна, выйди из квартиры и позвони 104 (или 04 с домашнего телефона).',
    front: G => { drawGasFixtures(G); gasGauge(G); },
    tick(G, dt) {
      if (!G.flags.valveClosed) G.gas += 3.2 * dt;
      if (G.flags.windowOpen) G.gas -= 7 * dt;
      G.gas = Math.max(0, Math.min(100, G.gas));
      if (G.gas >= 100) gasBlast(G, 'Газа скопилось слишком много, искра от холодильника его подожгла!');
    },
    done: G => G.flags.valveClosed && G.gas <= 0,
    notDone: G => G.flags.valveClosed ? (G.flags.windowOpen ? null : 'В кухне ещё полно газа. Открой окно и проветри.') : (G.time > 15 || G.blasted ? 'Газ всё ещё идёт! Перекрой кран на трубе.' : null),
    hot: [
      { x: 960, y: 380, r: 50, label: G => G.flags.valveClosed ? null : 'Перекрыть газ', tap: G => { G.flags.valveClosed = true; SFX.knob(); say(G.flags.windowOpen ? 'Кран перекрыт. Ждём, пока газ выветрится.' : 'Кран перекрыт, газ больше не идёт. Теперь проветри кухню.', 'good'); } },
      { x: 1030, y: 190, r: 110, label: G => G.flags.windowOpen ? null : 'Открыть окно', tap: G => { G.flags.windowOpen = true; SFX.creak(); say('Окно открыто, газ выветривается.', 'good'); } },
      { x: 302, y: 340, r: 45, label: G => G.flags.light ? null : 'Включить свет', tap: G => { G.flags.light = true; if (G.gas > 5) gasBlast(G, 'Щелчок выключателя дал искру, и газ взорвался! Когда пахнет газом, свет не включают.'); else say('Свет включён. Газа уже нет, так что это безопасно.', 'good'); } }
    ],
    items: [
      { id: 'curtain', name: 'занавеску', draw: drawCafeCurtain, value: 1.4, aimAt: [1030, 260], spots: [[945, 300, 50], [1030, 305, 50], [1115, 300, 50]], box: [906, 190, 1154, 310] },
      { id: 'towel', name: 'полотенце', draw: drawTowel, value: 1, aimAt: [815, 400], spots: [[815, 440, 50], [815, 380, 40]], box: [784, 320, 846, 450] }
    ],
    links: [['towel', 'curtain', .13]]
  }
);
function gasBlast(G, msg) {
  if (G.blasted) return; G.blasted = true;
  G.mistakes++; G.dmg += 20; G.gas = 0; G.flags.light = false;
  blast(660, 400);
  G.byId.towel.fire = .5; G.byId.curtain.fire = .4;
  say(msg + ' Туши пожар.', 'bad');
}
