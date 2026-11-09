// ================== ценные вещи, медали, ущерб водой ==================
// Уровень может задать:
//   treasure: { name, acc, x, y, r, near, burnTime, exit: [x, y], draw(G, tr), savedMsg, lostMsg }
//     ценная вещь (или животное) рядом с огнём. Коснись, чтобы вынести. Если предмет near горит долго, вещь пропадёт.
//   medals: [{ id, name, secret, hint, test: G => bool }]  hint: намёк к секретной медали, пока она не получена
//     медали за умное прохождение. Проверяются при победе и копятся в сохранении, их хочется собрать все.

function initExtras(G) {
  const T = G.L.treasure;
  G.tr = T ? { ...T, state: 'here', burn: 0, fly: 0 } : null;
  G.firstThrowT = null; G.waterThrows = 0; G.used = new Set(); G.burned = new Set(); G.soaked = 0; G.nThrows = 0;
  for (const it of G.items) if (it.fire > 0) G.burned.add(it.id);
}

function treasureHot(p) {
  const t = G.tr;
  if (t && t.state === 'here' && Math.hypot(p.x - t.x, p.y - t.y) < t.r) return { x: t.x, y: t.y, r: t.r, label: 'Спасти ' + t.acc, h: { tap: saveTreasure } };
  return null;
}
function saveTreasure(G) { const t = G.tr; t.savedT = G.time; t.state = 'flying'; t.fly = 0; SFX.cloth(); say(t.savedMsg, 'good'); }

function tickExtras(G, dt) {
  for (const it of G.items) if (it.fire > 0) G.burned.add(it.id);
  const t = G.tr; if (!t) return;
  if (t.state === 'here') {
    const it = G.byId[t.near];
    if (it.fire > .3) {
      // предупреждаем не сразу, чтобы игрок успел прочитать вступление; знак «!» мигает с самого начала
      if (!t.warned && G.time > 3) { t.warned = true; say(`${t.name} в опасности! Коснись, чтобы вынести.`, 'bad'); }
      t.burn += dt * it.fire;
      if (t.burn > t.burnTime) {
        G.dmg += 10; say(t.lostMsg, 'bad');
        // живые не сгорают, а убегают сами (flee: true или куда бежать [x, y]); вещи портятся
        if (t.flee) { t.state = 'fleeing'; t.fly = 0; t.to = Array.isArray(t.flee) ? t.flee : t.exit; SFX.cloth(); }
        else { t.state = 'lost'; burst(t.x, t.y, '#6b6b6b', 18, 'steam'); SFX.spread(); }
      }
    }
  } else if (t.state === 'flying') { t.fly += dt * 1.4; if (t.fly >= 1) t.state = 'saved'; }
  else if (t.state === 'fleeing') {
    t.fly += dt * .9; if (t.fly >= 1) { t.state = 'lost'; return; }
    // пыль из-под лап
    if (Math.random() < .5) { const k = t.fly; G.parts.push({ k: 'smoke', x: t.x + (t.to[0] - t.x) * k, y: t.y + (t.to[1] - t.y) * k + 30, vx: (Math.random() - .5) * 40, vy: -20, life: 0, max: .8, r: 8 }); }
  }
}

function drawTreasure(G) {
  const t = G.tr; if (!t || t.state === 'saved' || t.state === 'lost') return;
  ctx.save();
  if (t.state === 'flying') {
    const k = t.fly, x = t.x + (t.exit[0] - t.x) * k, y = t.y + (t.exit[1] - t.y) * k - Math.sin(k * Math.PI) * 140;
    ctx.translate(x, y); ctx.scale(1 - k * .4, 1 - k * .4); ctx.translate(-t.x, -t.y);
  } else if (t.state === 'fleeing') { // удирает вприпрыжку
    const k = t.fly, x = t.x + (t.to[0] - t.x) * k, y = t.y + (t.to[1] - t.y) * k - Math.abs(Math.sin(k * 18)) * 28;
    ctx.translate(x, y); ctx.rotate(Math.sin(k * 36) * .12); ctx.translate(-t.x, -t.y);
  }
  t.draw(G, t);
  ctx.restore();
  if (t.state === 'here' && t.burn > 0) { // мигающий знак опасности
    const a = .5 + .5 * Math.sin(time * 10), y = t.y - t.r - 30;
    ctx.globalAlpha = .6 + .4 * a; circ(t.x, y, 20); toon('#ffd23f', 4); tex(ctx, t.x, y + 1, '!', 28, INK); ctx.globalAlpha = 1;
  }
}

// вода, вылитая на то, что не горит, портит вещь
function soakMiss(p) {
  const it = G.items.find(it => it.fire === 0 && inBox(p, it.box));
  if (!it) return false;
  // траву и землю вода не портит: мокрое просто не загорится какое-то время
  if (it.soakFree) { G.wetBreaks = (G.wetBreaks || 0) + 1; say(it.soakMsg || `Ты полил ${it.name}. Пока мокрое, огонь сюда не пройдёт.`, 'good'); return true; }
  const d = 4 * it.value; G.dmg += d; G.soaked += d;
  say(`Вода залила ${it.name}, а оно не горело. Мокрая вещь тоже испорчена.`, '');
  return true;
}

// действие (время t) сделано раньше первого броска
function beforeThrow(G, t) { return t != null && (G.firstThrowT === null || t <= G.firstThrowT); }

function medalsFor(L) {
  const list = [];
  if (L.treasure) list.push({ id: 'treasure', name: L.treasure.medal, test: G => G.tr.state === 'saved' || G.tr.state === 'flying' });
  return list.concat(L.medals || []);
}
function awardMedals(G) {
  const all = medalsFor(G.L), got = all.filter(m => m.test(G)).map(m => m.id);
  SAVE.medals = SAVE.medals || {};
  const had = SAVE.medals[G.L.id] || [], fresh = got.filter(id => !had.includes(id));
  SAVE.medals[G.L.id] = [...new Set([...had, ...got])];
  return { all, got, had, fresh };
}
function medalsHtml(res) {
  if (!res.all.length) return '';
  return '<div class="medals">' + res.all.map(m => {
    const now = res.got.includes(m.id), ever = now || res.had.includes(m.id), isNew = res.fresh.includes(m.id);
    const name = ever || !m.secret ? m.name : (m.hint ? `Секрет: ${m.hint}` : 'Секрет');
    const hinted = !ever && m.secret && m.hint;
    return `<span class="medal ${now ? 'on' : ever ? 'was' : ''} ${isNew ? 'new' : ''} ${hinted ? 'hint' : ''}"><i>${now ? '✓' : ever ? '✓' : '?'}</i>${name}</span>`;
  }).join('') + '</div>';
}

// средство, найденное в сцене (огнетушитель водителя, на АЗС): появляется в лотке до конца уровня и сразу выбрано
function giveTool(G, id) {
  G.bonus.add(id); G.tool = id; G.cds[id] = 0; renderTray(); SFX.clank();
}
