// ================== экраны ==================
let mode = 'title', G = null, time = 0, curEp = 0;
if (!SAVE.owned) SAVE.owned = ['water', 'sand', 'lid'];
function show(m) {
  mode = m;
  $('scrTitle').hidden = m !== 'title'; $('scrMap').hidden = m !== 'map'; $('scrPlay').hidden = m !== 'play'; $('popup').hidden = true; $('scrPlay').classList.remove('thanking');
  if (m === 'map') renderMap();
}
$('btnPlay').onclick = () => { const i = LEVELS.findIndex((l, i) => !l.star && unlocked(i) && !SAVE.best[l.id]); curEp = i < 0 ? EPISODES.length - 1 : LEVELS[i].ep; show('map'); };
$('epPrev').onclick = () => { if (curEp > 0) { curEp--; SFX.click(); renderMap(); } };
$('epNext').onclick = () => { if (curEp < EPISODES.length - 1) { curEp++; SFX.click(); renderMap(); } };
$('mapBack').onclick = () => show('title');
$('btnPause').onclick = () => { G = null; SFX.silence(); show('map'); };
$('btnShop').onclick = () => openShop();

const LOCK = '<svg class="lock" viewBox="0 0 24 24"><path d="M7 11V8a5 5 0 0 1 10 0v3" fill="none" stroke="#2a1a12" stroke-width="2.6"/><rect x="4.5" y="10.5" width="15" height="11" rx="2.5" fill="#ffd23f" stroke="#2a1a12" stroke-width="2.2"/><circle cx="12" cy="16" r="1.8" fill="#2a1a12"/></svg>';
// уровни со звёздочкой (L.star) открыты всегда: для тестировщиков и превью
function unlocked(i) { return i === 0 || LEVELS[i].star || (SAVE.best[LEVELS[i - 1].id] || 0) > 0; }
function renderMap() {
  $('coins').textContent = SAVE.coins;
  const E = EPISODES[curEp];
  $('epTitle').textContent = `Эпизод ${curEp + 1} · ${E.name}`;
  $('epPrev').hidden = curEp === 0; $('epNext').hidden = curEp === EPISODES.length - 1;
  const box = $('nodes'); box.innerHTML = '';
  let cur = LEVELS.findIndex((l, i) => !l.star && unlocked(i) && !SAVE.best[l.id]); if (cur < 0) cur = LEVELS.length - 1;
  E.map.forEach((p, k) => {
    const i = E.from + k, lv = i < E.to ? LEVELS[i] : null, b = document.createElement('button'); b.className = 'node' + (i === cur ? ' cur' : '');
    b.style.left = p[0] + '%'; b.style.top = p[1] + '%';
    const st = lv ? SAVE.best[lv.id] || 0 : 0;
    if (lv && unlocked(i)) {
      b.innerHTML = `<span class="n toon">${k + 1}</span><span class="nm">${lv.name}</span><span class="stars">${STAR(st > 0)}${STAR(st > 1)}${STAR(st > 2)}</span>`;
      b.onclick = () => startLevel(i);
      b.setAttribute('aria-label', `Уровень ${k + 1}: ${lv.name}`);
    } else {
      b.disabled = true; b.setAttribute('aria-label', k === 0 ? 'Закрыто: пройди прошлый эпизод' : 'Закрыто: пройди предыдущий уровень');
      b.innerHTML = LOCK + (lv ? `<span class="nm">${lv.name}</span>` : '');
    }
    box.appendChild(b);
  });
  // уровни со звёздочкой: в самом начале карты первого эпизода, без замка
  if (curEp === 0) LEVELS.forEach((lv, i) => {
    if (!lv.star) return;
    const b = document.createElement('button'), st = SAVE.best[lv.id] || 0; b.className = 'node star';
    b.style.left = lv.star[0] + '%'; b.style.top = lv.star[1] + '%';
    b.innerHTML = `<span class="n toon">★</span><span class="nm">${lv.name}</span><span class="stars">${STAR(st > 0)}${STAR(st > 1)}${STAR(st > 2)}</span>`;
    b.onclick = () => startLevel(i); b.setAttribute('aria-label', `Особый уровень: ${lv.name}`);
    box.appendChild(b);
  });
  // «Впереди»: после первых лёгких уровней показываем, куда ведёт игра
  $('btnAhead').hidden = !aheadOpen();
  if (aheadOpen() && !SAVE.seenAhead) { SAVE.seenAhead = 1; store(); setTimeout(() => { if (mode === 'map' && $('popup').hidden) openAhead(true); }, 500); }
}
// ================== «Впереди»: сложные уровни, которые ждут дальше ==================
// lv: id уровня, если он уже есть в игре (сейчас это уровни со звёздочкой, открытые для тестировщиков)
const AHEAD = [
  { lv: 'f1', name: 'Болид Ф-1', hint: 'Пожар на пит-стопе, пилот ещё в кокпите', draw: ahF1 },
  { lv: 'rocket', name: 'Ракета', hint: 'Двигатель загорелся на испытаниях', draw: ahRocket },
  { name: 'Атомная станция', hint: 'Самый опасный пожар в игре', draw: ahNuke, soon: true },
];
const AHEAD_AFTER = 3; // сколько уровней первого эпизода пройти, чтобы открылось «Впереди»
function aheadOpen() { return LEVELS.filter(l => !l.star).slice(0, AHEAD_AFTER).every(l => SAVE.best[l.id] > 0); }
function openAhead(first) {
  const P = $('panel'); P.className = 'panel ahead';
  const cards = AHEAD.map((a, k) => {
    const i = a.lv ? LEVELS.findIndex(l => l.id === a.lv) : -1, play = i >= 0 && unlocked(i);
    return `<button class="acard${play ? '' : ' locked'}" data-i="${i}" ${play ? '' : 'disabled'} aria-label="${a.name}${play ? '' : ': скоро'}">
      <canvas width="360" height="220" data-k="${k}"></canvas>${play ? '' : LOCK}
      <b>${a.name}</b><span>${play ? a.hint : 'Скоро'}</span></button>`;
  }).join('<i class="adots"></i>');
  P.innerHTML = `<span class="ribbon toon">Впереди</span>
    <p class="lesson">${first ? 'Это только начало! ' : ''}Дальше пожары будут всё круче. Тушить придётся то, что ты пока даже не видел вблизи.</p>
    <div class="arow">${cards}</div>
    <div class="prow"><button class="rbtn green" id="aheadOk" aria-label="Понятно"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#fff" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div>`;
  P.querySelectorAll('canvas').forEach(cv => {
    const c = cv.getContext('2d'), d = window.devicePixelRatio > 1 ? 2 : 1; cv.width = AH_W * d; cv.height = AH_H * d;
    c.setTransform(d, 0, 0, d, 0, 0); AHEAD[cv.dataset.k].draw(c);
  });
  P.querySelectorAll('.acard:not(:disabled)').forEach(b => b.onclick = () => { P.className = 'panel'; startLevel(+b.dataset.i); });
  $('aheadOk').onclick = () => { P.className = 'panel'; $('popup').hidden = true; SFX.click(); };
  $('popup').hidden = false; if (first) SFX.ding(); else SFX.click();
}
$('btnAhead').onclick = () => openAhead(false);
function openShop() {
  const P = $('panel'); P.className = 'panel';
  const rows = Object.entries(TOOLS).filter(([, t]) => t.price > 0).map(([id, t]) => {
    const own = SAVE.owned.includes(id);
    return `<div class="shopitem"><span class="ball">${t.icon}</span><div class="si"><b>${t.name}</b><span>${t.desc}</span></div>
      ${own ? '<span class="have">Есть</span>' : `<button class="buy" data-id="${id}" ${SAVE.coins < t.price ? 'disabled' : ''}><i>★</i>${t.price}</button>`}</div>`;
  }).join('');
  P.innerHTML = `<span class="ribbon toon">Снаряжение</span>
    <div class="coins"><i>★</i><span>${SAVE.coins}</span></div>
    <div class="shoplist">${rows}</div>
    <div class="prow"><button class="rbtn blue" id="shopClose" aria-label="Закрыть"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18" stroke="#fff" stroke-width="3.6" stroke-linecap="round"/></svg></button></div>`;
  $('popup').hidden = false;
  P.querySelectorAll('.buy').forEach(b => b.onclick = () => { const t = TOOLS[b.dataset.id]; if (SAVE.coins < t.price) return; SAVE.coins -= t.price; SAVE.owned.push(b.dataset.id); store(); SFX.win(); renderMap(); openShop(); });
  $('shopClose').onclick = () => { $('popup').hidden = true; };
}

