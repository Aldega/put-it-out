// ================== игра ==================
function startLevel(i) {
  const L = LEVELS[i];
  G = { li: i, L, time: 0, dmg: 0, mistakes: 0, tool: 'water', cds: {}, over: false, parts: [], throws: [], aim: null, calm: 0, nagT: 0,
    flags: { ...(L.flags || {}) }, gas: L.gas || 0, can: L.can ? { ...L.can, heat: 0 } : null,
    items: L.items.map(d => ({ ...d, cls: d.cls || 'A', fire: d.fire || 0, heat: 0, char: 0, wet: 0 })) };
  G.byId = Object.fromEntries(G.items.map(it => [it.id, it]));
  curEp = L.ep || 0;
  initExtras(G);
  if (L.init) L.init(G);
  show('play'); renderTray(); say(L.intro, '');
}
function renderTray() {
  const tray = $('tray'); tray.innerHTML = '';
  Object.entries(TOOLS).filter(([id]) => SAVE.owned.includes(id)).forEach(([id, t]) => {
    const b = document.createElement('button'); b.className = 'tool'; b.id = 'tool-' + id; b.setAttribute('aria-pressed', G.tool === id);
    b.innerHTML = `<span class="ball">${t.icon}<span class="cd"></span></span><span class="lab">${t.short || t.name}</span>`;
    b.onclick = (e) => { e.stopPropagation(); if (!G || G.over) return; G.tool = id; document.querySelectorAll('.tool').forEach(x => x.setAttribute('aria-pressed', x === b));
      const hot = G.items.filter(it => it.fire > 0).sort((a, b2) => b2.fire * b2.value - a.fire * a.value)[0];
      if (hot) act({ x: hot.aimAt[0], y: hot.aimAt[1] }, true); else say('Огня нет. Подумай, что ещё нужно сделать.', ''); };
    tray.appendChild(b);
  });
}
let sayT = 0;
function say(text, kind) { const b = $('bubble'); b.textContent = text; b.className = 'bubble ' + (kind || ''); b.style.opacity = 1; sayT = 4.5; }

// предметы, которых можно коснуться
function hotAt(p) {
  const tr = treasureHot(p); if (tr) return tr;
  for (const h of G.L.hot || []) {
    if (h.dyn) { const d = h.dyn(G); if (d && Math.hypot(p.x - d.x, p.y - d.y) < d.r) return { ...d, h }; continue; }
    const label = h.label(G); if (label && Math.hypot(p.x - h.x, p.y - h.y) < h.r) return { x: h.x, y: h.y, r: h.r, label, h };
  }
  return null;
}

// прицел пальцем
function worldPt(e) { const r = cv.getBoundingClientRect(); return { x: (e.clientX - r.left) / r.width * VW, y: (e.clientY - r.top) / r.height * VH }; }
const gameEl = $('game');
cv.addEventListener('pointermove', e => {
  if (mode !== 'play' || !G || G.over) return; const p = worldPt(e);
  if (G.dragging) { G.L.drag.move(G, p); return; }
  G.aim = { ...p, down: G.aim?.down };
});
cv.addEventListener('pointerdown', e => {
  if (mode !== 'play' || !G || G.over) return; cv.setPointerCapture(e.pointerId); const p = worldPt(e);
  if (G.L.drag && G.L.drag.grab(G, p)) { G.dragging = true; G.can.drag = true; G.aim = null; SFX.click(); return; }
  G.aim = { ...p, down: true };
});
cv.addEventListener('pointerup', e => {
  if (mode !== 'play' || !G || G.over) return;
  const p = worldPt(e);
  if (G.dragging) { G.dragging = false; G.can.drag = false; G.L.drag.drop(G, p); return; }
  G.aim = { ...p, down: false };
  if (e.pointerType !== 'mouse') setTimeout(() => { if (G && G.aim && !G.aim.down) G.aim = null; }, 400);
  act(p);
});
cv.addEventListener('pointerleave', () => { if (G && G.aim && !G.aim.down) G.aim = null; });

function act(p, fromButton) {
  if (!fromButton) { const h = hotAt(p); if (h) { if (h.h.tap) h.h.tap(G); return; } }
  const id = G.tool, t = TOOLS[id];
  if ((G.cds[id] || 0) > 0) return;
  G.cds[id] = t.cd;
  if (G.firstThrowT === null) G.firstThrowT = G.time;
  G.used.add(id); G.nThrows++; if (id === 'water') G.waterThrows++;
  const from = { x: 90, y: 760 };
  const T = .5 + Math.hypot(p.x - from.x, p.y - from.y) / 3000;
  G.throws.push({ id, from, to: p, t: 0, T }); SFX.whoosh();
}
function inBox(p, b, pad = 0) { return p.x > b[0] - pad && p.x < b[2] + pad && p.y > b[1] - pad && p.y < b[3] + pad; }
function landed(th) {
  const t = TOOLS[th.id], p = th.to;
  // вода на проводке под напряжением
  if (th.id === 'water') for (const z of G.L.live || []) if (z.on(G) && inBox(p, z.box)) {
    G.mistakes++; G.dmg += 10; if (z.extra) G.byId[z.extra].fire = Math.min(1, G.byId[z.extra].fire + .3);
    say('Вода попала на прибор под напряжением. Удар током! Сначала выдерни вилку из розетки.', 'bad');
    boom(z.at[0], z.at[1]); return;
  }
  if (th.id === 'water') { burst(p.x, p.y, t.color, 46, 'drop'); SFX.splash(); }
  if (th.id === 'sand') { burst(p.x, p.y, t.color, 60, 'grain'); SFX.thud(); }
  if (th.id === 'powder') { burst(p.x, p.y, '#ffffff', 40, 'grain'); for (let i = 0; i < 14; i++) G.parts.push({ k: 'puff', x: p.x + (Math.random() - .5) * 160, y: p.y + (Math.random() - .5) * 90, vx: (Math.random() - .5) * 60, vy: -20 - Math.random() * 30, life: 0, max: 1.6, r: 30 + Math.random() * 30 }); SFX.puff(); }
  if (th.id === 'lid') { G.parts.push({ k: 'lid', x: p.x, y: p.y, life: 0, max: 1.2 }); setTimeout(() => SFX.clank(), 180); }
  if (th.id === 'blanket') { G.parts.push({ k: 'blanket', x: p.x, y: p.y, life: 0, max: 1.3 }); SFX.cloth(); }
  // уровень может сам обработать попадание (пар на каменке, охлаждение баллона...). true: дальше не считать
  if (G.L.landed && G.L.landed(G, th, p)) return;
  let hit = false, flare = false, lidOk = false, spill = false, gasMsg = null;
  for (const it of G.items) {
    let dmin = 1e9; for (const s of it.spots) dmin = Math.min(dmin, Math.hypot(s[0] - p.x, s[1] - 20 - p.y));
    if (dmin > t.radius) continue;
    const fall = 1 - dmin / t.radius * .6;
    let pw = t.power * fall;
    // струя газа (класс C): обычными бросками её не потушить, решает уровень
    if (it.cls === 'C') { if (it.fire > 0) gasMsg = G.L.gasHit ? G.L.gasHit(G, it, th.id) : 'Струю газа так не потушить. Перекрой газ!'; continue; }
    // горящая жидкость (класс B): вода её разбрызгивает, песок и порошок хороши
    if (it.cls === 'B') { if (th.id === 'water') { if (it.fire > 0) spill = it; continue; } if (th.id === 'sand') pw *= 1.5; if (th.id === 'powder') pw *= 1.3; if (th.id === 'blanket') pw *= 1.2; }
    if (it.cls === 'F') { if (th.id === 'water') { if (it.fire > 0) { flare = it; } continue; } if (th.id === 'blanket') pw *= 1.6; if (th.id === 'sand') pw *= .7; if (th.id === 'powder') pw *= .8; }
    if (th.id === 'lid') { if (it.lidable) { pw = 1.2; lidOk = true; } else pw *= .35; }
    if (it.fire > 0) { hit = true; it.fire = Math.max(0, it.fire - pw); if (it.fire < .05) { it.fire = 0; it.wet = 4; burst(p.x, p.y - 20, '#ffffff', 10, 'steam'); SFX.hiss(); } }
    if (th.id !== 'lid') { it.heat = Math.max(0, it.heat - .6); it.wet = Math.max(it.wet, th.id === 'water' ? (it.soakTime || 3) : 2); }
  }
  if (spill) {
    G.mistakes++; G.dmg += 8; spill.fire = Math.min(1, spill.fire + .35);
    for (const [a, b] of G.L.links) { const o = a === spill.id ? G.byId[b] : b === spill.id ? G.byId[a] : null; if (o && o.fire === 0 && !o.safe) { o.fire = .2; o.heat = 0; } }
    const [x0, y0, x1] = spill.box; fireball((x0 + x1) / 2, y0 + 10);
    say(G.L.spillMsg || 'Вода разбрызгала горящую жидкость, и огонь растёкся во все стороны! Такое тушат песком.', 'bad'); return;
  }
  if (gasMsg) { say(gasMsg, 'bad'); return; }
  if (flare) {
    G.mistakes++; G.dmg += 8; flare.fire = Math.min(1, flare.fire + .45);
    const [x0, y0, x1] = flare.box; fireball((x0 + x1) / 2, y0);
    say('Вода в горящем масле вскипела, и масло выплеснулось огненным шаром! Масло тушат крышкой или покрывалом.', 'bad'); return;
  }
  let decorMsg = null;
  if (th.id !== 'lid') for (const d of G.L.decor || []) if (G.flags[d.flag] && Math.hypot(p.x - d.x, p.y - d.y) < t.radius + d.r * .5) { G.flags[d.flag] = false; burst(d.x, d.y, '#ffffff', 10, 'steam'); SFX.hiss(); decorMsg = d.msg; }
  if (decorMsg && !hit) { say(decorMsg, ''); return; }
  if (!hit) { if (!(th.id === 'water' && soakMiss(p))) say('Мимо огня. Целься прямо в пламя.', ''); }
  else if (th.id === 'lid') say(lidOk ? 'Крышка перекрыла кислород. Так и тушат сковороду!' : 'Крышка маленькая: такой предмет ею не накрыть.', lidOk ? 'good' : 'bad');
  else if (th.id === 'sand') say('Песок сбивает пламя, но медленнее воды.', '');
  else if (th.id === 'blanket') say('Покрывало накрыло огонь и перекрыло воздух.', 'good');
  else if (th.id === 'powder') say('Порошок мгновенно сбивает пламя.', 'good');
  else say('Отлично! Вода охлаждает горящее и гасит огонь.', 'good');
}
function burst(x, y, color, n, k) {
  for (let i = 0; i < n; i++) { const a = -Math.PI * Math.random(), s = 80 + Math.random() * 260; G.parts.push({ k, x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s * (k === 'steam' ? .3 : 1), life: 0, max: k === 'steam' ? 1.6 : .7 + Math.random() * .3, color, r: k === 'steam' ? 16 : 4 + Math.random() * 5 }); }
}
function shake(color) {
  const f = $('flash'); f.style.background = color || ''; f.classList.remove('go'); void f.offsetWidth; f.classList.add('go');
  gameEl.classList.remove('shake'); void gameEl.offsetWidth; gameEl.classList.add('shake');
}
function boom(x, y) {
  SFX.zap(); shake();
  for (let i = 0; i < 7; i++) { const a = -Math.PI * (.05 + .9 * i / 6) + (Math.random() - .5) * .3, len = 220 + Math.random() * 260; G.parts.push({ k: 'bolt', x, y, tx: x + Math.cos(a) * len, ty: y + Math.sin(a) * len, life: -i * .03, max: .75 }); }
  G.parts.push({ k: 'bolt', x: x - 260, y: -10, tx: x - 20, ty: y - 40, life: 0, max: .6, w: 1.6 }, { k: 'bolt', x: x + 300, y: -10, tx: x + 30, ty: y - 50, life: .05, max: .6, w: 1.6 });
  G.parts.push({ k: 'zapfx', x, y, life: 0, max: .7 });
  for (let i = 0; i < 40; i++) G.parts.push({ k: 'spark', x, y, vx: (Math.random() - .5) * 700, vy: (Math.random() - .8) * 600, life: 0, max: .5 + Math.random() * .4 });
}
function fireball(x, y) {
  SFX.flare(); shake('#ffb347');
  for (let i = 0; i < 16; i++) G.parts.push({ k: 'fb', x: x + (Math.random() - .5) * 120, y: y - Math.random() * 40, vx: (Math.random() - .5) * 120, vy: -200 - Math.random() * 260, life: 0, max: .9 + Math.random() * .4, r: 30 + Math.random() * 30 });
  burst(x, y, '#ffcf4a', 30, 'drop');
}
function blast(x, y) {
  SFX.blast(); shake('#ffb347');
  for (let i = 0; i < 26; i++) { const a = Math.random() * Math.PI * 2, s = 150 + Math.random() * 380; G.parts.push({ k: 'fb', x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 80, life: 0, max: .7 + Math.random() * .5, r: 30 + Math.random() * 40 }); }
  G.parts.push({ k: 'ring', x, y, life: 0, max: .6 });
  for (let i = 0; i < 50; i++) G.parts.push({ k: 'spark', x, y, vx: (Math.random() - .5) * 900, vy: (Math.random() - .7) * 800, life: 0, max: .5 + Math.random() * .5 });
}

function update(dt) {
  if (!G || G.over) return;
  const L = G.L;
  G.time += dt;
  for (const k in G.cds) G.cds[k] = Math.max(0, G.cds[k] - dt);
  let total = 0;
  for (const it of G.items) {
    it.wet = Math.max(0, it.wet - dt);
    if (it.fire > 0) {
      const boost = L.boost ? L.boost(G, it) : 1;
      if (it.wet <= 0) it.fire = Math.min(1, it.fire + .045 * dt * boost);
      it.char = Math.min(1, it.char + it.fire * dt * .03);
      total += it.fire * it.value;
    }
  }
  const sb = L.spreadBoost ? L.spreadBoost(G) : 1;
  // связь [a, b, скорость, обратно]: обратно = множитель скорости от b к a (ветер дует от a к b)
  for (const [a, b, rate, back = 1] of L.links) for (const [x, y, r] of [[a, b, rate], [b, a, rate * back]]) {
    const A = G.byId[x], B = G.byId[y];
    if (A.fire > .3 && B.fire === 0 && B.wet <= 0 && !B.safe && (!L.linkOk || L.linkOk(G, x, y))) { B.heat += A.fire * r * sb * dt; if (B.heat >= 1) { B.fire = .15; B.heat = 0; SFX.spread(); say(`Огонь перекинулся на ${B.name}!`, 'bad'); } }
  }
  if (L.tick) L.tick(G, dt);
  tickExtras(G, dt);
  G.dmg += total * L.dmgRate * dt;
  SFX.fire(total);
  for (const th of G.throws) { th.t += dt; if (th.t >= th.T && !th.done) { th.done = true; landed(th); } }
  G.throws = G.throws.filter(t => !t.done);
  total = G.items.reduce((s, it) => s + it.fire, 0);
  if (total === 0) {
    G.calm += dt;
    const ok = !L.done || L.done(G);
    if (ok && G.calm > .8) finish(true);
    else if (!ok && G.calm > 1.2) { G.nagT -= dt; if (G.nagT <= 0) { const m = typeof L.notDone === 'function' ? L.notDone(G) : L.notDone; if (m) say(m, ''); G.nagT = 5; } }
  } else { G.calm = 0; }
  if (G.dmg >= 100) { G.dmg = 100; finish(false); }
  $('meter').style.width = G.dmg + '%';
  $('timer').textContent = G.time.toFixed(1) + ' с';
  for (const id in TOOLS) { const el = document.querySelector(`#tool-${id} .cd`); if (el) el.style.setProperty('--p', ((G.cds[id] || 0) / TOOLS[id].cd * 100) + '%'); }
  sayT -= dt; if (sayT < 0) $('bubble').style.opacity = .0;
}

