// ================== «Впереди»: картинки для карточек сложных уровней ==================
// Каждая картинка рисуется в своей системе координат 360×220 (карточка на экране «Впереди»).
const AH_W = 360, AH_H = 220;
// язык пламени: x, y низ, h высота, w ширина
function ahFlame(c, x, y, h, w, lean = 0) {
  c.beginPath(); c.moveTo(x - w / 2, y);
  c.bezierCurveTo(x - w * .7, y - h * .45, x - w * .1 + lean * .5, y - h * .6, x + lean, y - h);
  c.bezierCurveTo(x + w * .2 + lean * .5, y - h * .55, x + w * .75, y - h * .4, x + w / 2, y);
  c.closePath(); toon('#ff8a1c', 3, c);
  c.beginPath(); c.moveTo(x - w * .25, y - 2);
  c.bezierCurveTo(x - w * .35, y - h * .35, x + lean * .3, y - h * .45, x + lean * .6, y - h * .62);
  c.bezierCurveTo(x + w * .15, y - h * .4, x + w * .35, y - h * .3, x + w * .25, y - 2);
  c.closePath(); c.fillStyle = '#ffe45c'; c.fill();
}
function ahSmoke(c, x, y, s) { for (const [dx, dy, r] of [[0, 0, 22], [24, -14, 18], [-20, -18, 16], [8, -34, 18]]) { circ(x + dx * s, y + dy * s, r * s, c); toon('#8a8f99', 3, c); } }

// Болид Ф-1 горит на трассе
function ahF1(c) {
  const g = c.createLinearGradient(0, 0, 0, 130); g.addColorStop(0, '#6cc6f0'); g.addColorStop(1, '#d4f3ff'); c.fillStyle = g; c.fillRect(0, 0, AH_W, AH_H);
  // трибуна
  rr(-6, 52, AH_W + 12, 14, 4, c); toon('#e63b2e', 3, c);
  for (let i = 0; i < 16; i++) { circ(12 + i * 23, 46, 7, c); toon(['#ffd23f', '#3fa9f5', '#7cc243', '#ff7aa8'][i % 4], 2, c); }
  // асфальт и поребрик
  c.fillStyle = '#5b6170'; c.fillRect(0, 130, AH_W, 90);
  for (let i = 0; i < 12; i++) { c.fillStyle = i % 2 ? '#ffffff' : '#e63b2e'; c.fillRect(i * 32, 124, 32, 10); }
  c.beginPath(); c.moveTo(0, 124); c.lineTo(AH_W, 124); c.lineWidth = 3; c.strokeStyle = INK; c.stroke();
  for (let i = 0; i < 6; i++) { c.fillStyle = '#ffffff'; c.fillRect(20 + i * 64, 196, 34, 5); }
  ahSmoke(c, 236, 70, .9);
  // кузов болида
  rr(60, 168, 236, 10, 4, c); toon('#2f3540', 3, c);
  rr(48, 160, 46, 8, 3, c); toon('#e63b2e', 3, c);
  c.beginPath(); c.moveTo(60, 170); c.lineTo(64, 160); c.quadraticCurveTo(110, 148, 170, 144); c.lineTo(178, 124); c.quadraticCurveTo(196, 118, 210, 128);
  c.quadraticCurveTo(250, 142, 290, 150); c.lineTo(296, 170); c.closePath(); toon('#e63b2e', 4, c);
  c.beginPath(); c.moveTo(70, 160); c.quadraticCurveTo(120, 150, 168, 148); c.lineWidth = 4; c.strokeStyle = '#ffd23f'; c.stroke();
  circ(124, 156, 8, c); toon('#ffffff', 2, c); tex(c, 124, 157, '7', 10, INK);
  ell(186, 136, 9, 8, c); toon('#ffd23f', 2.5, c);  // шлем пилота
  rr(284, 116, 12, 46, 3, c); toon('#2f3540', 3, c); rr(272, 112, 40, 10, 3, c); toon('#e63b2e', 3, c);
  // пламя из-под крышки мотора
  ahFlame(c, 226, 142, 70, 34, -6); ahFlame(c, 252, 146, 54, 26, 8); ahFlame(c, 206, 146, 40, 22, -4);
  // колёса
  for (const [x, r] of [[96, 22], [262, 25]]) { circ(x, 176, r, c); toon('#26262a', 3, c); circ(x, 176, r * .5, c); toon('#9aa3ad', 2.5, c); circ(x, 176, r * .74, c); c.lineWidth = 2.5; c.strokeStyle = '#ffd23f'; c.stroke(); }
}

// ракета на старте: из-под двигателей вырывается огонь
function ahRocket(c) {
  const g = c.createLinearGradient(0, 0, 0, AH_H); g.addColorStop(0, '#121735'); g.addColorStop(.6, '#2b2a5c'); g.addColorStop(1, '#6b4c7e'); c.fillStyle = g; c.fillRect(0, 0, AH_W, AH_H);
  const r = rnd(7); c.fillStyle = '#fff6e4'; for (let i = 0; i < 26; i++) { circ(r() * AH_W, r() * 120, 1 + r() * 1.6, c); c.fill(); }
  circ(300, 40, 18, c); toon('#fff6c2', 3, c); circ(308, 34, 15, c); c.fillStyle = '#2b2a5c'; c.fill();
  // земля и стартовый стол
  c.beginPath(); c.moveTo(0, 190); c.quadraticCurveTo(180, 176, AH_W, 190); c.lineTo(AH_W, AH_H); c.lineTo(0, AH_H); c.closePath(); toon('#3d5a2a', 3, c);
  // ферма обслуживания
  rr(96, 30, 18, 150, 2, c); toon('#e63b2e', 3, c);
  for (let y = 40; y < 176; y += 22) { c.beginPath(); c.moveTo(96, y); c.lineTo(114, y + 22); c.moveTo(114, y); c.lineTo(96, y + 22); c.lineWidth = 2; c.strokeStyle = INK; c.stroke(); }
  rr(112, 60, 40, 6, 2, c); toon('#e63b2e', 2.5, c);
  rr(132, 172, 120, 14, 3, c); toon('#5b6170', 3, c);
  // клубы дыма по бокам и огонь снизу
  ahSmoke(c, 112, 180, .9); ahSmoke(c, 276, 176, 1);
  ahFlame(c, 192, 196, 46, 70); ahFlame(c, 170, 194, 30, 30, -8); ahFlame(c, 214, 194, 30, 30, 8);
  // корпус ракеты
  for (const s of [-1, 1]) { c.beginPath(); c.moveTo(192 + s * 18, 120); c.lineTo(192 + s * 40, 168); c.lineTo(192 + s * 20, 160); c.closePath(); toon('#e63b2e', 3, c); }
  c.beginPath(); c.moveTo(174, 166); c.lineTo(174, 60); c.quadraticCurveTo(174, 24, 192, 8); c.quadraticCurveTo(210, 24, 210, 60); c.lineTo(210, 166); c.closePath(); toon('#f4f4f4', 4, c);
  c.beginPath(); c.moveTo(176, 44); c.quadraticCurveTo(192, 38, 208, 44); c.lineWidth = 6; c.strokeStyle = '#e63b2e'; c.stroke();
  circ(192, 76, 9, c); toon('#3fa9f5', 3, c);
  rr(174, 120, 36, 8, 2, c); toon('#2f3540', 2.5, c);
  c.beginPath(); c.moveTo(178, 166); c.lineTo(172, 178); c.lineTo(212, 178); c.lineTo(206, 166); c.closePath(); toon('#2a2e36', 3, c);
}

// АЭС: градирни, купол реактора с красной мигалкой, знак радиации
function ahNuke(c, t = 0) {
  const g = c.createLinearGradient(0, 0, 0, AH_H); g.addColorStop(0, '#3b2a4a'); g.addColorStop(.55, '#a8473a'); g.addColorStop(1, '#f08a24'); c.fillStyle = g; c.fillRect(0, 0, AH_W, AH_H);
  // зарево над реактором
  const gl = c.createRadialGradient(200, 110, 10, 200, 110, 150); gl.addColorStop(0, 'rgba(255,220,120,.55)'); gl.addColorStop(1, 'rgba(255,160,60,0)'); c.fillStyle = gl; c.fillRect(0, 0, AH_W, AH_H);
  // градирни с паром
  for (const [x, w] of [[64, 84], [300, 70]]) {
    ahSmoke(c, x, 50, 1.1);
    c.beginPath(); c.moveTo(x - w / 2, 190); c.quadraticCurveTo(x - w * .22, 120, x - w * .32, 64); c.lineTo(x + w * .32, 64); c.quadraticCurveTo(x + w * .22, 120, x + w / 2, 190); c.closePath(); toon('#d7dbe2', 4, c);
    c.beginPath(); c.moveTo(x - w * .3, 76); c.lineTo(x + w * .3, 76); c.lineWidth = 6; c.strokeStyle = '#e63b2e'; c.stroke();
  }
  // энергоблок и купол
  rr(140, 132, 130, 60, 4, c); toon('#bfc5ce', 4, c);
  c.beginPath(); c.moveTo(150, 132); c.lineTo(150, 108); c.arc(200, 108, 50, Math.PI, 0); c.lineTo(250, 132); c.closePath(); toon('#e8ebf0', 4, c);
  for (let i = 0; i < 4; i++) { rr(152 + i * 30, 150, 16, 18, 2, c); toon('#ffd23f', 2.5, c); }
  // огонь из пролома в крыше энергоблока
  ahFlame(c, 254, 134, 60, 30, 6); ahFlame(c, 238, 134, 38, 22, -4);
  // мигалка
  rr(194, 50, 12, 10, 3, c); toon('#2f3540', 2.5, c); circ(200, 48, 6, c); toon(Math.sin(t * 7) > 0 ? '#ff3b2e' : '#a8231a', 2.5, c);
  // знак радиации
  circ(200, 98, 20, c); toon('#ffd23f', 3, c);
  c.fillStyle = INK; for (let i = 0; i < 3; i++) { const a = -Math.PI / 2 + i * Math.PI * 2 / 3; c.beginPath(); c.moveTo(200, 98); c.arc(200, 98, 16, a - .5, a + .5); c.closePath(); c.fill(); }
  circ(200, 98, 5, c); c.fillStyle = '#ffd23f'; c.fill(); circ(200, 98, 3.4, c); c.fillStyle = INK; c.fill();
  // земля
  c.fillStyle = '#4a3a2e'; c.fillRect(0, 190, AH_W, 30); c.beginPath(); c.moveTo(0, 190); c.lineTo(AH_W, 190); c.lineWidth = 3; c.strokeStyle = INK; c.stroke();
}
