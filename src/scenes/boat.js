// ----- транспорт, уровень 4: катер у причала -----
function bgBoat(c) {
  skyGrad(c, ['#7fd0f5', '#e8f8ff'], 400);
  cloud(c, 1000, 120, .7); cloud(c, 240, 90, .5);
  forestRow(c, 400, 13, '#3f8a4f', .55);
  // озеро
  const g = c.createLinearGradient(0, 400, 0, VH); g.addColorStop(0, '#5ec3f2'); g.addColorStop(1, '#2f86c9'); c.fillStyle = g; c.fillRect(0, 396, VW, VH - 396);
  c.beginPath(); c.moveTo(0, 396); c.lineTo(VW, 396); c.lineWidth = 5; c.strokeStyle = INK; c.stroke();
  const r = rnd(4); c.strokeStyle = '#bfe8ff'; c.lineWidth = 4; c.lineCap = 'round';
  for (let i = 0; i < 26; i++) { const x = r() * VW, y = 420 + r() * 280; c.beginPath(); c.arc(x, y, 16, Math.PI * 1.15, Math.PI * 1.85); c.stroke(); }
  // сваи причала
  for (const x of [30, 140, 250]) { rr(x, 440, 22, 120, 4, c); toon('#7a4a2a', 4, c); }
  // буй вдали
  circ(1100, 470, 18, c); toon('#e63b2e', 4, c); rr(1094, 440, 12, 18, 3, c); toon('#ffffff', 3, c);
}
function drawPier(it) {
  const k = it.char, col = mix('#c98a4f', '#1e130d', k * .85);
  rr(-10, 420, 316, 30, 4); toon(col, 5);
  for (let x = 30; x < 300; x += 46) { ctx.beginPath(); ctx.moveTo(x, 420); ctx.lineTo(x, 450); ctx.lineWidth = 3; ctx.strokeStyle = mix(col, INK, .4); ctx.stroke(); }
  // кнехт и спасательный круг на столбике
  rr(60, 350, 16, 72, 4); toon(col, 4);
  circ(68, 372, 26); ctx.lineWidth = 16; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 10; ctx.strokeStyle = '#e63b2e'; ctx.stroke();
  ctx.save(); ctx.setLineDash([12, 14]); circ(68, 372, 26); ctx.strokeStyle = '#ffffff'; ctx.stroke(); ctx.restore();
}
function drawBoatHull(it, G) {
  const k = Math.min(1, it.char + G.byId.motor.char * .3), col = mix('#ffffff', '#1e130d', k * .85), st = mix('#3f7bf5', '#1e130d', k * .85);
  ctx.beginPath(); ctx.moveTo(350, 420); ctx.lineTo(760, 420); ctx.quadraticCurveTo(740, 490, 640, 500); ctx.lineTo(380, 500); ctx.quadraticCurveTo(352, 480, 350, 420); ctx.closePath(); toon(col, 6);
  ctx.beginPath(); ctx.moveTo(360, 456); ctx.lineTo(748, 456); ctx.lineWidth = 8; ctx.strokeStyle = st; ctx.stroke();
  // ветровое стекло и сиденье
  ctx.beginPath(); ctx.moveTo(560, 420); ctx.lineTo(600, 370); ctx.lineTo(640, 370); ctx.lineTo(632, 420); ctx.closePath(); toon(mix('#bfe8ff', '#3a2a20', k * .9), 4);
  rr(470, 396, 70, 24, 8); toon(mix('#e63b2e', '#1e130d', k * .85), 4);
  // бак и шланг к мотору
  rr(388, 392, 50, 30, 6); toon('#e63b2e', 4); rr(398, 384, 14, 10, 3); toon('#2f3540', 2);
  ctx.beginPath(); ctx.moveTo(392, 410); ctx.quadraticCurveTo(360, 400, 340, 410); ctx.lineWidth = 6; ctx.strokeStyle = INK; ctx.stroke();
  // кран на баке
  ctx.save(); ctx.translate(430, 404); circ(0, 0, 8); toon('#9aa3ad', 3); ctx.rotate(G.flags.fuel ? 0 : Math.PI / 2); rr(-3, -18, 6, 18, 3); toon('#ffd23f', 3); ctx.restore();
  ctx.beginPath(); ctx.moveTo(340, 500); ctx.quadraticCurveTo(560, 520, 760, 500); ctx.lineWidth = 4; ctx.strokeStyle = '#bfe8ff'; ctx.stroke();
}
function drawOutboard(it, G) {
  const k = it.char, col = mix('#2f3540', '#120b08', k * .6);
  rr(296, 380, 56, 60, 14); toon(col, 5);
  rr(312, 438, 22, 70, 4); toon(mix('#5a5f66', '#120b08', k * .6), 4);
  ctx.beginPath(); ctx.moveTo(300, 506); ctx.lineTo(346, 506); ctx.lineTo(336, 520); ctx.lineTo(306, 520); ctx.closePath(); toon('#5a5f66', 3);
  if (G.flags.fuel && Math.random() < .25) G.parts.push({ k: 'drop', x: 320, y: 470, vx: -10, vy: 60, life: 0, max: .4, color: '#c9a7ff', r: 3 });
}
// бензиновое пятно на воде
function drawSlick(it) {
  const k = it.char;
  ctx.save(); ctx.globalAlpha = .85;
  ell(350, 512, 200, 20); ctx.fillStyle = mix('#6b5a7a', '#1e130d', k * .5); ctx.fill();
  for (const [dx, col] of [[-.5, '#7cd1ff'], [-.1, '#ffd23f'], [.3, '#ff7bd5'], [.6, '#9bd65a']]) { ell(350 + dx * 200, 510, 46, 8); ctx.lineWidth = 4; ctx.strokeStyle = col; ctx.globalAlpha = .6 * (1 - k); ctx.stroke(); }
  ctx.restore();
}
// рыбак в воде
function drawSwimmer(G, t) {
  const x = t.x, y = t.y + Math.sin(time * 3) * 4, panic = t.burn > 0;
  ell(x, y + 24, 46, 12); ctx.fillStyle = 'rgba(255,255,255,.6)'; ctx.fill();
  for (const s of [-1, 1]) { const a = panic ? Math.sin(time * 14 + s) * 8 : 0; ctx.beginPath(); ctx.moveTo(x + s * 16, y + 10); ctx.lineTo(x + s * 40, y - 30 + a); ctx.lineWidth = 14; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 8; ctx.strokeStyle = '#ffcc99'; ctx.stroke(); }
  rr(x - 22, y + 4, 44, 22, 8); toon('#ff9d1f', 4);
  circ(x, y - 14, 20); toon('#ffcc99', 4);
  ctx.beginPath(); ctx.moveTo(x - 30, y - 24); ctx.lineTo(x + 30, y - 24); ctx.lineTo(x + 18, y - 44); ctx.lineTo(x - 18, y - 44); ctx.closePath(); toon('#7cc243', 4);
  ell(x - 7, y - 14, 3, panic ? 5 : 3); ctx.fillStyle = INK; ctx.fill(); ell(x + 7, y - 14, 3, panic ? 5 : 3); ctx.fill();
  ell(x, y - 3, 5, panic ? 6 : 2); ctx.fill();
}
