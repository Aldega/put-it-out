// ---------- финал ----------
function finish(win) {
  G.over = true; G.aim = null; SFX.silence();
  const L = G.L;
  let stars = 0, coins = 0, med = null;
  if (win) {
    stars = 1 + (G.mistakes === 0 ? 1 : 0) + (G.dmg < 35 ? 1 : 0);
    coins = Math.round(L.reward * stars / 3 + (G.time <= L.par ? 10 : 0));
    med = awardMedals(G); coins += med.fresh.length * 15;
    SAVE.coins += coins; SAVE.best[L.id] = Math.max(SAVE.best[L.id] || 0, stars); store();
  }
  const next = LEVELS[G.li + 1];
  const P = $('panel');
  P.innerHTML = win ? `
    <span class="ribbon toon">Потушено!</span>
    <div class="bigstars">${STAR_CLASS(stars > 0)}${STAR_CLASS(stars > 1)}${STAR_CLASS(stars > 2)}</div>
    <div class="score toon">+${coins}</div>
    <div class="facts">Время ${G.time.toFixed(1)} с · ущерб ${Math.round(G.dmg)}% · ошибок ${G.mistakes}</div>
    ${medalsHtml(med)}
    <div class="lesson">${L.lesson}</div>
    <div class="prow">
      <button class="rbtn blue" id="pMap" aria-label="Карта"><svg viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" stroke="#fff" stroke-width="3.4" stroke-linecap="round"/></svg></button>
      <button class="rbtn" id="pAgain" aria-label="Ещё раз"><svg viewBox="0 0 24 24"><path d="M19 12a7 7 0 1 1-2.1-5" fill="none" stroke="#fff" stroke-width="3.4" stroke-linecap="round"/><path d="M19.5 3v5h-5" fill="none" stroke="#fff" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
      ${next ? '<button class="rbtn green" id="pNext" aria-label="Дальше"><svg viewBox="0 0 24 24"><path d="M8 4.5v15l12-7.5z" fill="#fff" stroke="#2a1a12" stroke-width="2.2" stroke-linejoin="round"/></svg></button>' : ''}
    </div>` : `
    <span class="ribbon toon lose">Огонь охватил комнату</span>
    <div class="bigstars">${STAR(false)}${STAR(false)}${STAR(false)}</div>
    <div class="lesson">${L.lesson}</div>
    <div class="prow">
      <button class="rbtn blue" id="pMap" aria-label="Карта"><svg viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" stroke="#fff" stroke-width="3.4" stroke-linecap="round"/></svg></button>
      <button class="rbtn green" id="pAgain" aria-label="Ещё раз"><svg viewBox="0 0 24 24"><path d="M19 12a7 7 0 1 1-2.1-5" fill="none" stroke="#fff" stroke-width="3.4" stroke-linecap="round"/><path d="M19.5 3v5h-5" fill="none" stroke="#fff" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
    </div>`;
  P.classList.toggle('tight', !!(win && med && med.all.length));
  P.querySelectorAll('.bigstars svg.on').forEach((s, i) => s.style.animationDelay = (.25 + i * .35) + 's');
  setTimeout(() => { $('popup').hidden = false; if (win) { SFX.win(); for (let i = 0; i < stars; i++) setTimeout(() => SFX.star(i), 250 + i * 350); } else SFX.lose(); }, win ? 700 : 400);
  $('pMap').onclick = () => { G = null; show('map'); };
  $('pAgain').onclick = () => startLevel(G.li);
  if (next && win) $('pNext').onclick = () => startLevel(G.li + 1);
}

