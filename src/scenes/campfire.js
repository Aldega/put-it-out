// ----- дача, уровень 1: костёр в сухой траве -----
function bgCampfire(c) {
  skyGrad(c, ['#ff8a5c', '#ffb878', '#ffe0a6'], 470);
  circ(1060, 330, 60, c); toon('#ffe066', 5, c);
  cloud(c, 260, 120, .7); cloud(c, 820, 90, .5);
  forestRow(c, 440, 21, '#4f8f58', .65); forestRow(c, 470, 8, '#3c7a47', .8);
  // луг
  c.beginPath(); c.moveTo(0, 470); c.bezierCurveTo(300, 450, 800, 490, VW, 460); c.lineTo(VW, VH); c.lineTo(0, VH); c.closePath(); toon('#c9c066', 6, c);
  c.beginPath(); c.moveTo(0, 560); c.bezierCurveTo(400, 540, 900, 580, VW, 550); c.lineTo(VW, VH); c.lineTo(0, VH); c.closePath(); toon('#b5ad55', 5, c);
  const r = rnd(4); c.strokeStyle = '#8f8a3c'; c.lineWidth = 3; c.lineCap = 'round';
  for (let i = 0; i < 70; i++) { const x = r() * VW, y = 480 + r() * 230; c.beginPath(); c.moveTo(x, y); c.lineTo(x + 6, y - 12); c.stroke(); }
  // дальний забор и калитка
  picketFence(c, 470, 600, 1280, '#d8c094', 70);
  // бревно-скамейка
  rr(30, 600, 190, 46, 23, c); toon('#9a6a3e', 5, c); ell(210, 623, 16, 22, c); toon('#e8c48c', 4, c);
  // костровище: круг из камней на голой земле
  ell(275, 640, 120, 34, c); toon('#8a6a4a', 5, c);
  const rs = rnd(9); for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2, x = 275 + Math.cos(a) * 96, y = 640 + Math.sin(a) * 26; ell(x, y, 18 + rs() * 6, 12 + rs() * 4, c); toon(mix('#a7a7a7', '#6e6e6e', rs()), 4, c); }
  // дрова шалашиком
  c.save(); c.translate(275, 640);
  for (const a of [-.5, .5, -.2, .25]) { c.save(); c.rotate(a); rr(-8, -70, 16, 74, 6, c); toon('#7a4a2a', 4, c); c.restore(); }
  c.restore();
  // ведро у костра
  pail(c, 120, 690);
}
function campfireFlames(G) {
  if (G.flags.campfire) { for (let i = 0; i < 3; i++) tongue(250 + i * 25, 640, 70 + 12 * Math.sin(time * 8 + i), 46, 7 * Math.sin(time * 6 + i * 2) + 8, FIRE_COLS); if (Math.random() < .08) G.parts.push({ k: 'ember', x: 275, y: 580, vx: 60 + Math.random() * 60, vy: -60 - Math.random() * 60, life: 0, max: 1.4, r: 3 }); }
  else if (Math.random() < .06) G.parts.push({ k: 'smoke', x: 275 + (Math.random() - .5) * 30, y: 620, vx: 30, vy: -30, life: 0, max: 2, r: 10 });
  windLines(140, 420, 4);
}
function drawGrass1(it) { dryGrass(380, 585, 616, it.char, 31); }
function drawGrass2(it) { dryGrass(590, 790, 596, it.char, 32); }
function drawGrass3(it) { dryGrass(795, 985, 578, it.char, 33); }
function drawHaystack(it) {
  const k = it.char, col = mix('#f0c856', '#1e130d', k * .85), dk = mix('#c99a2e', '#1e130d', k * .85);
  rr(1104, 250, 12, 90, 5); toon('#7a4a2a', 4);
  if (k < .9) windFlag(1116, 254, mix('#e63b2e', '#2a1a12', k));
  ctx.beginPath(); ctx.moveTo(990, 590); ctx.bezierCurveTo(985, 440, 1040, 320, 1110, 315); ctx.bezierCurveTo(1180, 320, 1240, 440, 1235, 590); ctx.closePath(); toon(col, 6);
  ctx.strokeStyle = dk; ctx.lineWidth = 3; const r = rnd(41);
  for (let i = 0; i < 22; i++) { const x = 1010 + r() * 200, y = 350 + r() * 220; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 14, y - 8); ctx.stroke(); }
}
