// Сборка места Roblox в один файл: node roblox/build.mjs  ->  roblox/dist/kak-eto-potushit-f1.rbxlx
// Без зависимостей. Сцена (трасса, болид, барьер, маршалы) описана здесь деталями,
// код игры лежит в roblox/src/*.lua и вкладывается в файл как скрипты.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url));
const src = p => readFileSync(join(ROOT, 'src', p), 'utf8');

// ---------- математика CFrame ----------
const D = Math.PI / 180;
const rotX = a => [[1, 0, 0], [0, Math.cos(a), -Math.sin(a)], [0, Math.sin(a), Math.cos(a)]];
const rotY = a => [[Math.cos(a), 0, Math.sin(a)], [0, 1, 0], [-Math.sin(a), 0, Math.cos(a)]];
const rotZ = a => [[Math.cos(a), -Math.sin(a), 0], [Math.sin(a), Math.cos(a), 0], [0, 0, 1]];
const mul = (A, B) => A.map((r, i) => [0, 1, 2].map(j => r[0] * B[0][j] + r[1] * B[1][j] + r[2] * B[2][j]));
const app = (A, v) => A.map(r => r[0] * v[0] + r[1] * v[1] + r[2] * v[2]);
const I3 = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
// поворот в градусах: сначала Z, потом X, потом Y (как удобно ставить детали)
const euler = ([x, y, z] = [0, 0, 0]) => mul(rotY(y * D), mul(rotX(x * D), rotZ(z * D)));
// «рамка» = положение + поворот; детали внутри группы задаются в её координатах
const frame = (pos = [0, 0, 0], rot = I3) => ({ pos, rot });
const sub = (f, pos, rotDeg) => ({ pos: app(f.rot, pos).map((v, i) => v + f.pos[i]), rot: mul(f.rot, euler(rotDeg)) });

// ---------- XML ----------
let refN = 0;
const newRef = () => 'RBX' + (refN++).toString(16).toUpperCase().padStart(8, '0');
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const num = v => (Math.abs(v) < 1e-9 ? 0 : +v.toFixed(5));
const hex = h => { const n = parseInt(h.replace('#', ''), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
const P = {
  str: (n, v) => `<string name="${n}">${esc(v)}</string>`,
  bool: (n, v) => `<bool name="${n}">${v ? 'true' : 'false'}</bool>`,
  float: (n, v) => `<float name="${n}">${num(v)}</float>`,
  token: (n, v) => `<token name="${n}">${v}</token>`,
  v3: (n, [x, y, z]) => `<Vector3 name="${n}"><X>${num(x)}</X><Y>${num(y)}</Y><Z>${num(z)}</Z></Vector3>`,
  cf: (n, f) => `<CoordinateFrame name="${n}"><X>${num(f.pos[0])}</X><Y>${num(f.pos[1])}</Y><Z>${num(f.pos[2])}</Z>` +
    f.rot.flatMap((r, i) => r.map((v, j) => `<R${i}${j}>${num(v)}</R${i}${j}>`)).join('') + `</CoordinateFrame>`,
  color: (n, h) => { const [r, g, b] = hex(h); return `<Color3uint8 name="${n}">${((0xff << 24) | (r << 16) | (g << 8) | b) >>> 0}</Color3uint8>`; },
  src: (n, code) => { if (code.includes(']]>')) throw new Error('В коде есть ]]>'); return `<ProtectedString name="${n}"><![CDATA[${code}]]></ProtectedString>`; },
  ref: (n, r) => `<Ref name="${n}">${r}</Ref>`
};

class Inst {
  constructor(cls, name, props = []) { this.cls = cls; this.name = name; this.props = props; this.kids = []; this.ref = newRef(); }
  add(...k) { this.kids.push(...k); return k[0]; }
  xml(ind = '') {
    const props = [P.str('Name', this.name), ...this.props.map(p => (typeof p === 'function' ? p() : p))].join('');
    return `${ind}<Item class="${this.cls}" referent="${this.ref}"><Properties>${props}</Properties>\n` +
      this.kids.map(k => k.xml(ind + ' ')).join('') + `${ind}</Item>\n`;
  }
}

// материалы (Enum.Material)
const MAT = { plastic: 256, smooth: 272, neon: 288, wood: 512, metal: 1088, concrete: 816, grass: 1280, pebble: 864, fabric: 1312, asphalt: 1376, glass: 1568 };
// формы Part.Shape
const SHAPE = { ball: 0, block: 1, cyl: 2 };

// деталь: f = рамка, size = [x,y,z], opts: color, mat, shape, collide, transp, wedge
function part(name, f, size, opts = {}) {
  const cls = opts.cls || (opts.wedge ? 'WedgePart' : opts.spawn ? 'SpawnLocation' : 'Part');
  const props = [
    P.bool('Anchored', true), P.cf('CFrame', f), P.color('Color3uint8', opts.color || '#a3a2a5'),
    P.token('Material', MAT[opts.mat || 'plastic']), P.v3('size', size),
    P.bool('CanCollide', opts.collide !== false), P.float('Transparency', opts.transp || 0),
    P.token('TopSurface', 0), P.token('BottomSurface', 0), P.bool('CastShadow', opts.shadow !== false)
  ];
  if (cls === 'Part') props.push(P.token('shape', SHAPE[opts.shape || 'block']));
  if (opts.query === false) props.push(P.bool('CanQuery', false), P.bool('CanTouch', false));
  if (opts.spawn) props.push(P.bool('Neutral', true), P.bool('AllowTeamChangeOnTouch', false), `<int name="Duration">0</int>`);
  return new Inst(cls, name, props);
}
const model = (name, primary) => {
  const m = new Inst('Model', name);
  if (primary) m.props.push(() => P.ref('PrimaryPart', primary.ref));
  return m;
};
// невидимая точка огня: сервер вешает на неё пламя, дым и свет
const fireSpot = f => part('FireSpot', f, [1, 1, 1], { transp: 1, collide: false, query: false, shadow: false });

// ---------- цвета ----------
const C = {
  car: '#7a4bd6', stripe: '#ffd23f', carbon: '#2b2b33', tyre: '#232326', rim: '#c9ced8', white: '#ffffff',
  grass: '#6fbf4a', asphalt: '#4a4d55', gravel: '#d8c49a', red: '#e63b2e', orange: '#ff8a1f', ink: '#1d1b26',
  skin: '#f1c7a0', suit: '#7a4bd6', concrete: '#c9c4bb', blue: '#3fa9f5', yellow: '#ffd23f', green: '#7cc243'
};

// ---------- человечек (лицо смотрит в -Z, ноги на y=0 своей рамки) ----------
function person(name, f, { suit, helmet, visor = C.ink, gloves = C.ink, legs }) {
  const torso = part('Torso', sub(f, [0, 3, 0]), [1.8, 2, 1], { color: suit, collide: false, mat: 'fabric' });
  const m = model(name, torso);
  m.add(torso,
    part('LegL', sub(f, [-0.45, 1, 0]), [0.8, 2, 0.8], { color: legs || suit, collide: false, mat: 'fabric' }),
    part('LegR', sub(f, [0.45, 1, 0]), [0.8, 2, 0.8], { color: legs || suit, collide: false, mat: 'fabric' }),
    part('ArmL', sub(f, [-1.25, 3, 0]), [0.7, 2, 0.7], { color: suit, collide: false, mat: 'fabric' }),
    part('ArmR', sub(f, [1.25, 3, 0]), [0.7, 2, 0.7], { color: suit, collide: false, mat: 'fabric' }),
    part('HandL', sub(f, [-1.25, 1.85, 0]), [0.6, 0.4, 0.6], { color: gloves, collide: false }),
    part('HandR', sub(f, [1.25, 1.85, 0]), [0.6, 0.4, 0.6], { color: gloves, collide: false }),
    part('Helmet', sub(f, [0, 4.65, 0]), [1.5, 1.5, 1.5], { color: helmet, collide: false, shape: 'ball' }),
    part('Visor', sub(f, [0, 4.7, -0.6]), [1.05, 0.42, 0.3], { color: visor, collide: false, mat: 'glass' })
  );
  return m;
}

// ---------- сцена ----------
const ws = new Inst('Workspace', 'Workspace', [P.bool('StreamingEnabled', false), P.bool('FilteringEnabled', true)]);
const scene = ws.add(model('Scene'));
const W = frame();

// земля, трасса (вдоль X, z от -10 до 10), гравийная ловушка у ближней к болиду стороны
scene.add(part('Grass', sub(W, [0, -0.5, 0]), [700, 1, 700], { color: C.grass, mat: 'grass' }));
scene.add(part('Track', sub(W, [0, 0.05, 0]), [700, 0.2, 20], { color: C.asphalt, mat: 'asphalt' }));
for (const z of [-9.6, 9.6]) scene.add(part('Line', sub(W, [0, 0.16, z]), [700, 0.05, 0.4], { color: C.white, mat: 'smooth', collide: false }));
scene.add(part('Gravel', sub(W, [0, 0.1, 31]), [90, 0.2, 40], { color: C.gravel, mat: 'pebble' }));
for (let i = 0; i < 30; i++) {
  const x = -58 + i * 4;
  for (const z of [-10.6, 10.6]) scene.add(part('Kerb', sub(W, [x, 0.2, z]), [4, 0.3, 1.2], { color: i % 2 ? C.red : C.white, mat: 'smooth' }));
}
// стартовая клетка-разметка «старт/финиш» далеко слева для красоты
for (let i = 0; i < 10; i++) for (let j = 0; j < 2; j++)
  scene.add(part('Checker', sub(W, [-120 + j * 2, 0.17, -9 + i * 2]), [2, 0.05, 2], { color: (i + j) % 2 ? C.ink : C.white, mat: 'smooth', collide: false }));

// трибуна за спиной у игроков
const stand = sub(W, [0, 0, -78]);
for (let r = 0; r < 5; r++) {
  scene.add(part('Stand', sub(stand, [0, 1 + r * 2, -r * 3]), [110, 2, 3], { color: C.concrete, mat: 'concrete' }));
  for (let s = 0; s < 22; s++) {
    const cols = [C.red, C.blue, C.yellow, C.green, C.car, C.white, C.orange];
    scene.add(part('Fan', sub(stand, [-50 + s * 4.8, 2.9 + r * 2, -r * 3]), [1.4, 1.8, 1.2], { color: cols[(s * 3 + r * 5) % cols.length], collide: false }));
  }
}
scene.add(part('StandRoof', sub(stand, [0, 14, -6]), [114, 1, 18], { color: C.red, mat: 'smooth' }));
// деревья
for (const [x, z] of [[-70, 60], [-55, 72], [60, 66], [78, 58], [-90, -40], [92, -36], [40, 90], [-30, 92]]) {
  const t = sub(W, [x, 0, z]);
  scene.add(part('Trunk', sub(t, [0, 4, 0]), [1.6, 8, 1.6], { color: '#8a5a2b', mat: 'wood' }));
  scene.add(part('Leaves', sub(t, [0, 10, 0]), [9, 9, 9], { color: '#3f9b3a', shape: 'ball', mat: 'grass' }));
}
// сетка за барьером: столбы
for (let i = 0; i < 12; i++) scene.add(part('FencePost', sub(W, [-44 + i * 8, 5, 59]), [0.4, 10, 0.4], { color: C.rim, mat: 'metal' }));
scene.add(part('Fence', sub(W, [0, 5, 59]), [90, 9, 0.2], { color: '#b8c4cc', transp: 0.75, mat: 'metal' }));

// место появления игроков: за трассой, рядом с постом маршалов
const spawn = part('Spawn', frame([0, 0.6, -40], euler([0, 180, 0])), [10, 1, 10], { spawn: true, color: C.orange, mat: 'smooth' });
ws.add(spawn);

// ---------- миссия (сервер копирует её заново в каждом раунде) ----------
const mission = ws.add(model('Mission'));

// болид вылетел с трассы и уткнулся в барьер, развёрнут на 12°
const CAR = frame([2, 0.2, 39.5], euler([0, 12, 0]));
const car = mission.add(model('Car'));
const cp = (n, pos, size, o = {}) => car.add(part(n, sub(CAR, pos, o.rot), size, o));
cp('Floor', [0, 0.75, -1], [6.2, 0.9, 18], { color: C.carbon });
cp('Nose', [0, 1.6, 5.8], [2.4, 1.3, 7], { color: C.car, mat: 'smooth' });
cp('NoseTip', [0, 1.3, 10.1], [2.2, 0.8, 1.8], { color: C.stripe, mat: 'smooth', wedge: true, rot: [0, 180, 0] });
cp('FrontWing', [0, 0.75, 10.8], [9, 0.3, 1.8], { color: C.car, mat: 'smooth' });
for (const s of [-1, 1]) cp('FrontWingEnd', [s * 4.4, 1.2, 10.8], [0.3, 1.2, 2.2], { color: C.stripe, mat: 'smooth' });
cp('Cockpit', [0, 1.9, 0.4], [3.2, 1.9, 5], { color: C.car, mat: 'smooth' });
cp('Stripe', [0, 2.9, 3.4], [1.0, 0.06, 4], { color: C.stripe, mat: 'smooth', collide: false });
for (const s of [-1, 1]) {
  cp('Sidepod', [s * 2.5, 1.6, -1.6], [1.9, 1.7, 7], { color: C.car, mat: 'smooth' });
  cp('SidepodStripe', [s * 3.46, 1.9, -1.6], [0.06, 0.4, 6.4], { color: C.stripe, mat: 'smooth', collide: false });
}
const engineCover = cp('EngineCover', [0, 2.3, -5], [2.6, 2.6, 6.4], { color: C.car, mat: 'smooth' });
cp('Airbox', [0, 3.7, -2.1], [1.2, 1.3, 1.4], { color: C.carbon });
cp('Number', [0, 3.62, -5], [1.6, 0.06, 1.6], { color: C.white, mat: 'smooth', collide: false });
cp('RearWing', [0, 4.0, -9.4], [6.6, 1.5, 0.5], { color: C.car, mat: 'smooth' });
for (const s of [-1, 1]) cp('WingEnd', [s * 3.3, 3.4, -9.2], [0.3, 2.8, 1.8], { color: C.stripe, mat: 'smooth' });
cp('WingPylon', [0, 3.0, -8.6], [0.4, 1.6, 0.6], { color: C.carbon });
// гало над пилотом
cp('HaloPillar', [0, 3.3, 2.4], [0.3, 1.1, 0.3], { color: C.carbon });
cp('HaloTop', [0, 3.85, 1.2], [0.3, 0.3, 2.6], { color: C.carbon });
for (const s of [-1, 1]) cp('HaloSide', [s * 1.2, 3.7, 0.2], [0.3, 0.3, 2.4], { color: C.carbon, rot: [0, s * 20, 0] });
// колёса (ось цилиндра = X)
for (const [x, z, d, w] of [[-4.2, 5.4, 3.2, 1.9], [4.2, 5.4, 3.2, 1.9], [-4.3, -6.2, 3.7, 2.5], [4.3, -6.2, 3.7, 2.5]]) {
  cp('Wheel', [x, d / 2 - 0.1, z], [w, d, d], { color: C.tyre, shape: 'cyl' });
  cp('Rim', [x + Math.sign(x) * (w / 2), d / 2 - 0.1, z], [0.08, d * 0.55, d * 0.55], { color: C.stripe, shape: 'cyl', collide: false });
}
// лампа батареи на дуге над пилотом (красная = под током) и кольцо «E» на борту
cp('Lamp', [0, 4.55, -2.1], [0.7, 0.7, 0.7], { color: C.red, mat: 'neon', shape: 'ball' });
cp('ERing', [1.65, 2.5, 2.3], [0.25, 0.9, 0.9], { color: C.white, mat: 'smooth', shape: 'cyl', rot: [0, 0, 0] });
cp('ERingDot', [1.79, 2.5, 2.3], [0.05, 0.45, 0.45], { color: C.red, mat: 'neon', shape: 'cyl', collide: false });
for (const pos of [[0, 3.8, -5], [-1.5, 3.0, -3.5], [1.5, 3.0, -6.5], [0, 4.2, -8.2]]) car.add(fireSpot(sub(CAR, pos)));

// пилот сидит в кокпите: торчит только шлем, остальное спрятано в машине
const pilot = person('Pilot', sub(CAR, [0, -1.25, 0.6], [0, 180, 0]), { suit: C.car, helmet: C.yellow, legs: C.car });
mission.add(pilot);

// лужа горящего топлива за болидом
const spill = mission.add(model('Spill'));
spill.add(part('Puddle', sub(CAR, [0, 0.12, -9.5], [0, 8, 0]), [12, 0.12, 10], { color: '#3a3226', mat: 'smooth', transp: 0.15, collide: false }));
for (const pos of [[-3.5, 0.6, -8], [3.5, 0.6, -9.5], [0, 0.6, -12.5], [-2, 0.6, -13]]) spill.add(fireSpot(sub(CAR, pos)));

// шинный барьер
const barrier = mission.add(model('Barrier'));
for (let i = 0; i < 20; i++) {
  const x = -34 + i * 3.6;
  for (let k = 0; k < 3; k++) {
    const painted = (i + k) % 4 === 0;
    barrier.add(part('Tyre', frame([x, 0.75 + k * 1.5, 53], euler([0, 0, 90])), [1.5, 3.4, 3.4], { color: painted ? C.white : C.tyre, shape: 'cyl' }));
  }
}
barrier.add(part('Belt', frame([0, 2.4, 51.2]), [74, 3.2, 0.3], { color: C.blue, mat: 'fabric' }));
for (const x of [-5, 1, 7]) barrier.add(fireSpot(frame([x, 4.4, 52])));

// пост маршалов за трассой: красный флаг и пожарный щит
const post = mission.add(model('MarshalPost'));
const PF = frame([-24, 0, -24]);
post.add(part('Booth', sub(PF, [0, 3, -2]), [8, 6, 5], { color: C.white, mat: 'smooth' }));
post.add(part('BoothRoof', sub(PF, [0, 6.3, -1.6]), [9, 0.6, 6.4], { color: C.orange, mat: 'smooth' }));
post.add(part('BoothWindow', sub(PF, [0, 3.8, 0.47]), [6, 2, 0.1], { color: '#9fd3f5', mat: 'glass', collide: false }));
post.add(part('PostSign', sub(PF, [0, 7.4, -1.6]), [5, 1.4, 0.3], { color: C.yellow, mat: 'smooth' }));
post.add(part('FlagPole', sub(PF, [6, 4.5, 1]), [0.4, 9, 0.4], { color: C.rim, mat: 'metal' }));
// флаг опущен: висит низко у древка; сервер поднимает его наверх
post.add(part('Flag', sub(PF, [7.3, 2.2, 1]), [2.4, 1.6, 0.12], { color: C.red, mat: 'fabric', collide: false }));
const board = mission.add(model('FireBoard'));
const BF = frame([-10, 0, -26]);
board.add(part('Board', sub(BF, [0, 3, -0.4]), [4, 6, 0.4], { color: C.red, mat: 'smooth' }));
board.add(part('BoardSign', sub(BF, [0, 5.4, -0.15]), [3, 0.8, 0.1], { color: C.white, mat: 'smooth', collide: false }));
board.add(part('WaterExt', sub(BF, [0, 2.6, 0.2]), [1.1, 2.4, 1.1], { color: C.red, mat: 'smooth', shape: 'block' }));
board.add(part('WaterBand', sub(BF, [0, 3.0, 0.2]), [1.15, 0.5, 1.15], { color: C.white, mat: 'smooth', collide: false }));
board.add(part('Bucket', sub(BF, [1.4, 0.6, 0.5]), [1.2, 1.2, 1.2], { color: C.red, shape: 'cyl', rot: [0, 0, 90] }));

// маршалы в оранжевом: один с порошком, другой с пеной; после красного флага бегут к болиду
const mp = person('MarshalPowder', frame([-18, 0, -19], euler([0, 180, 0])), { suit: C.orange, helmet: C.white, visor: C.ink, legs: C.orange });
mp.add(part('Ext', frame([-16.7, 2.0, -18.6]), [0.8, 1.8, 0.8], { color: C.red, collide: false }));
mp.add(part('ExtBand', frame([-16.7, 2.3, -18.6]), [0.85, 0.4, 0.85], { color: C.blue, collide: false }));
const mf = person('MarshalFoam', frame([-30, 0, -19], euler([0, 180, 0])), { suit: C.orange, helmet: C.white, visor: C.ink, legs: C.orange });
mf.add(part('Ext', frame([-28.7, 2.0, -18.6]), [0.8, 1.8, 0.8], { color: C.red, collide: false }));
mf.add(part('ExtBand', frame([-28.7, 2.3, -18.6]), [0.85, 0.4, 0.85], { color: '#f3e3b0', collide: false }));
mission.add(mp, mf);

// машина медиков ждёт за поворотом, приезжает после красного флага
const AF = frame([240, 0, 5]);
const ambBox = part('Box', sub(AF, [0, 3.6, 0]), [16, 5.6, 7], { color: C.white, mat: 'smooth', collide: false });
const amb = model('Ambulance', ambBox);
amb.add(ambBox,
  part('Cab', sub(AF, [-9.5, 2.6, 0]), [3, 3.6, 6.8], { color: C.white, mat: 'smooth', collide: false }),
  part('Windshield', sub(AF, [-11.05, 3.2, 0]), [0.1, 1.6, 5.6], { color: '#9fd3f5', mat: 'glass', collide: false }),
  part('Stripe', sub(AF, [0, 2.6, 0]), [16.05, 0.8, 7.05], { color: C.red, mat: 'smooth', collide: false }),
  part('Cross1', sub(AF, [1, 4.4, -3.56]), [3, 0.9, 0.1], { color: C.red, mat: 'smooth', collide: false }),
  part('Cross2', sub(AF, [1, 4.4, -3.56]), [0.9, 3, 0.1], { color: C.red, mat: 'smooth', collide: false }),
  part('Siren', sub(AF, [-8, 6.6, 0]), [1.2, 0.6, 3], { color: C.blue, mat: 'neon', collide: false })
);
for (const [x, z] of [[-8, -3.3], [-8, 3.3], [5, -3.3], [5, 3.3]]) amb.add(part('Wheel', sub(AF, [x, 1.2, z], [0, 90, 0]), [1.2, 2.4, 2.4], { color: C.tyre, shape: 'cyl', collide: false }));
mission.add(amb);

// чужой болид: носится по трассе, пока не подняли красный флаг (вдоль -X)
const RF = frame([400, 0.2, -4]);
const rcBody = part('Body', sub(RF, [0, 1.5, 0]), [15, 1.6, 2.6], { color: C.blue, mat: 'smooth', collide: false });
const race = model('RaceCar', rcBody);
race.add(rcBody,
  part('Body', sub(RF, [1, 2.4, 0]), [5, 1.4, 2.4], { color: C.blue, mat: 'smooth', collide: false }),
  part('Wing', sub(RF, [7.3, 3.2, 0]), [0.5, 1.2, 5.4], { color: C.carbon, collide: false }),
  part('FrontWing', sub(RF, [-8, 0.8, 0]), [1.4, 0.3, 7], { color: C.carbon, collide: false }),
  part('Helmet', sub(RF, [-0.6, 3.3, 0]), [1.2, 1.2, 1.2], { color: C.white, shape: 'ball', collide: false })
);
for (const [x, z] of [[-4.6, -3.1], [-4.6, 3.1], [5, -3.2], [5, 3.2]]) race.add(part('Wheel', sub(RF, [x, 1.5, z], [0, 90, 0]), [1.8, 3.1, 3.1], { color: C.tyre, shape: 'cyl', collide: false }));
mission.add(race);

// ---------- службы и скрипты ----------
const lighting = new Inst('Lighting', 'Lighting', [P.float('ClockTime', 14.5), P.float('Brightness', 2.2), P.color('OutdoorAmbient', '#9a9aa6')]);
const sss = new Inst('ServerScriptService', 'ServerScriptService');
sss.add(new Inst('Script', 'Mission', [P.src('Source', src('server/Mission.server.lua')), P.bool('Disabled', false)]));
const rs = new Inst('ReplicatedStorage', 'ReplicatedStorage');
rs.add(new Inst('ModuleScript', 'I18n', [P.src('Source', src('shared/I18n.lua'))]));
const sp = new Inst('StarterPlayer', 'StarterPlayer');
const sps = sp.add(new Inst('StarterPlayerScripts', 'StarterPlayerScripts'));
sps.add(new Inst('LocalScript', 'HUD', [P.src('Source', src('client/HUD.client.lua')), P.bool('Disabled', false)]));

const xml = `<roblox xmlns:xmime="http://www.w3.org/2005/05/xmlmime" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://www.roblox.com/roblox.xsd" version="4">\n` +
  [ws, lighting, sss, rs, sp].map(i => i.xml()).join('') + `</roblox>\n`;

const OUT = join(ROOT, 'dist', 'kak-eto-potushit-f1.rbxlx');
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, xml);
console.log(`Готово: ${OUT} (${(xml.length / 1024).toFixed(0)} КБ, ${refN} объектов)`);
