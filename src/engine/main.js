// ================== цикл ==================
let last = performance.now(), clouds = [[200, 120, 1], [620, 80, .8], [900, 200, .6]];
function frame(now) {
  const dt = Math.min(.05, (now - last) / 1000); last = now; time += dt;
  if (!cv.width) { requestAnimationFrame(frame); return; }
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  if (mode === 'title' || mode === 'map') {
    cachedBg(mode === 'map' ? 'map' + curEp : mode, mode === 'title' ? bgTitle : bgMap);
    for (const c of clouds) { c[0] += dt * 14 * c[2]; if (c[0] > VW + 120) c[0] = -120; cloud(ctx, c[0], c[1], c[2]); }
    if (mode === 'title') { // дымок из трубы каланчи и мигалка
      ctx.fillStyle = Math.sin(time * 8) > 0 ? '#3fa9f5' : '#e63b2e'; circ(1006, 513, 8); ctx.fill();
    }
  } else if (G) {
    update(dt);
    cachedBg('lvl' + G.li, G.L.bg);
    if (G.L.back) G.L.back(G);
    for (const it of G.items) it.draw(it, G);
    if (G.L.front) G.L.front(G);
    drawTreasure(G);
    for (const it of G.items) glow(it);
    for (const it of G.items) if (!it.noFlame) drawFire(it, time);
    drawParts(dt); drawThrows(); drawAim();
    G.time = G.time; G.timeAnim = time;
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
const ICON_ON = '<svg viewBox="0 0 24 24"><path d="M4 9h4l5-4v14l-5-4H4z" fill="#fff" stroke="#2a1a12" stroke-width="1.8" stroke-linejoin="round"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/></svg>';
const ICON_OFF = '<svg viewBox="0 0 24 24"><path d="M4 9h4l5-4v14l-5-4H4z" fill="#fff" stroke="#2a1a12" stroke-width="1.8" stroke-linejoin="round"/><path d="M16 9l5 6M21 9l-5 6" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/></svg>';
$('btnMute').innerHTML = SFX.muted ? ICON_OFF : ICON_ON;
$('btnMute').onclick = () => { $('btnMute').innerHTML = SFX.toggle() ? ICON_OFF : ICON_ON; };
show('title');
