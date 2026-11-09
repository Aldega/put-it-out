// ================== эпизод 4 «Транспорт»: общие детали сцен ==================
// колесо: x, y = центр
function wheel(x, y, r, k = 0) { circ(x, y, r); toon(mix('#3a3a3a', '#1e130d', k * .5), 5); circ(x, y, r * .42); toon(mix('#bbbbbb', '#3a2a20', k * .8), 3); }
// рельсы со шпалами: y = верх рельса
function rails(c, y, x0 = -20, x1 = VW + 20) {
  c.fillStyle = '#b9a88c'; c.fillRect(x0, y - 6, x1 - x0, 40);
  for (let x = x0 + 10; x < x1; x += 46) { rr(x, y + 4, 30, 20, 3, c); toon('#8a5a34', 3, c); }
  for (const dy of [0, 14]) { rr(x0, y + dy - 4, x1 - x0, 8, 3, c); toon('#9aa3ad', 3, c); }
}
// провод контактной сети с опорами
function catenary(c, y, poles) {
  for (const x of poles) { rr(x - 9, y - 30, 18, 600, 4, c); toon('#7a8290', 4, c); rr(x - 9, y - 4, 90, 12, 4, c); toon('#7a8290', 4, c); }
  c.beginPath(); c.moveTo(-10, y - 20); for (let x = 0; x <= VW + 20; x += 320) c.quadraticCurveTo(x + 160, y + 6, x + 320, y - 20); c.lineWidth = 3; c.strokeStyle = INK; c.stroke();
  c.beginPath(); c.moveTo(-10, y + 14); c.lineTo(VW + 10, y + 14); c.lineWidth = 6; c.strokeStyle = INK; c.stroke(); c.lineWidth = 2; c.strokeStyle = '#d0a060'; c.stroke();
}
// искры с провода или с крыши
function sparks(G, x, y, n = 1) { for (let i = 0; i < n; i++) G.parts.push({ k: 'spark', x, y, vx: (Math.random() - .5) * 500, vy: -Math.random() * 400, life: 0, max: .3 + Math.random() * .3 }); }

// карта эпизода «Транспорт»: море с катером, железная дорога, шоссе и аэропорт
function mapTransport(c) {
  skyGrad(c, ['#78ccf2', '#e2f6ff'], VH);
  circ(1120, 100, 54, c); toon('#ffe066', 5, c);
  // море слева
  c.beginPath(); c.moveTo(0, 360); c.bezierCurveTo(200, 350, 330, 380, 420, 430); c.lineTo(420, VH); c.lineTo(0, VH); c.closePath(); toon('#3fa9f5', 5, c);
  c.strokeStyle = '#bfe8ff'; c.lineWidth = 4; for (const [x, y] of [[60, 420], [180, 470], [90, 540], [260, 600], [140, 650]]) { c.beginPath(); c.arc(x, y, 14, Math.PI * 1.1, Math.PI * 1.9); c.stroke(); }
  // суша
  c.beginPath(); c.moveTo(380, 400); c.bezierCurveTo(600, 360, 900, 420, VW, 380); c.lineTo(VW, VH); c.lineTo(420, VH); c.bezierCurveTo(400, 600, 460, 480, 380, 400); c.closePath(); toon('#9bd65a', 5, c);
  // железная дорога
  c.save(); c.beginPath(); c.moveTo(440, 520); c.bezierCurveTo(700, 470, 950, 560, 1300, 470); c.lineWidth = 26; c.strokeStyle = INK; c.stroke(); c.lineWidth = 18; c.strokeStyle = '#b9a88c'; c.stroke();
  c.setLineDash([6, 14]); c.lineWidth = 24; c.strokeStyle = '#8a5a34'; c.stroke(); c.restore();
  // шоссе
  c.beginPath(); c.moveTo(470, 740); c.bezierCurveTo(700, 610, 1000, 690, 1300, 600); c.lineTo(1300, 670); c.bezierCurveTo(1000, 760, 760, 690, 560, 760); c.closePath(); toon('#6b7078', 5, c);
  // самолёт в небе и катер
  c.save(); c.translate(560, 150); c.rotate(-.12);
  rr(-90, -14, 180, 28, 14, c); toon('#ffffff', 4, c); c.beginPath(); c.moveTo(-10, 0); c.lineTo(-50, 60); c.lineTo(-20, 60); c.lineTo(30, 4); c.closePath(); toon('#3fa9f5', 4, c);
  c.beginPath(); c.moveTo(-80, -6); c.lineTo(-100, -44); c.lineTo(-78, -44); c.lineTo(-56, -10); c.closePath(); toon('#e63b2e', 4, c);
  for (let i = 0; i < 5; i++) { circ(-30 + i * 22, -3, 4, c); c.fillStyle = INK; c.fill(); }
  c.restore();
  c.beginPath(); c.moveTo(250, 650); c.lineTo(380, 650); c.lineTo(360, 680); c.lineTo(270, 680); c.closePath(); toon('#ffffff', 4, c); rr(290, 630, 50, 22, 4, c); toon('#e63b2e', 4, c);
}
