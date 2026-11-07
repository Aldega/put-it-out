LEVELS.push(
  {
    id: 'balcony', name: 'Балкон с хламом', bg: bgBalcony, dmgRate: 1.9, par: 12, reward: 90, can: { x: 760, y: 640 },
    intro: 'На балкон бросили окурок, загорелись старые коробки. Рядом стоит баллончик с краской, он нагревается!',
    lesson: 'Баллончики с краской, лаком и дезодорантом от жара взрываются, как маленькие бомбы. Первым делом убери их подальше от огня, потом туши коробки водой. И не храни хлам на балконе: одного окурка хватает для пожара.',
    front: G => drawCan(G),
    tick(G, dt) {
      const c = G.can; if (c.gone || c.safe) return;
      const box = G.byId.boxes, d = Math.hypot(c.x - 595, c.y - 590);
      if (box.fire > 0 && d < 280 && !c.drag) c.heat += box.fire * dt * .085 * (1.4 - d / 280);
      else c.heat = Math.max(0, c.heat - dt * .05);
      if (c.heat >= 1) { c.gone = true; G.mistakes++; G.dmg += 15; blast(c.x, c.y - 30); for (const it of G.items) it.fire = Math.min(1, Math.max(it.fire, .25) + .25); say('Баллончик перегрелся и взорвался! Огонь разлетелся по всему балкону.', 'bad'); }
    },
    drag: {
      grab: (G, p) => !G.can.gone && !G.can.safe && Math.hypot(p.x - G.can.x, p.y - (G.can.y - 30)) < 60,
      move: (G, p) => { G.can.x = Math.max(290, Math.min(1240, p.x)); G.can.y = Math.max(560, Math.min(700, p.y + 30)); },
      drop(G) { if (Math.hypot(G.can.x - 595, G.can.y - 590) > 330) { G.can.safe = true; G.can.heat = 0; SFX.knob(); say('Баллончик в безопасности. Теперь туши коробки!', 'good'); } else say('Ещё близко к огню. Оттащи баллончик подальше.', ''); }
    },
    hot: [{ x: 0, y: 0, r: 0, dyn: G => G.can.gone || G.can.safe ? null : { x: G.can.x, y: G.can.y - 30, r: 60, label: 'Тащи подальше' } }],
    items: [
      { id: 'laundry', name: 'бельё', draw: drawLaundry, value: 1.3, aimAt: [700, 300], spots: [[420, 345, 50], [580, 315, 60], [730, 375, 50], [880, 325, 60], [1035, 335, 50]], box: [380, 230, 1080, 380] },
      { id: 'chair', name: 'стул', draw: drawChair, value: 1, aimAt: [970, 520], spots: [[930, 540, 50], [1010, 540, 50], [970, 425, 60]], box: [880, 400, 1060, 650] },
      { id: 'boxes', name: 'коробки', draw: drawBoxes, value: 1, fire: .5, aimAt: [590, 520], spots: [[500, 540, 55], [560, 460, 60], [620, 460, 50], [690, 560, 50]], box: [470, 440, 720, 650] }
    ],
    links: [['boxes', 'chair', .12], ['boxes', 'laundry', .11]]
  }
);
