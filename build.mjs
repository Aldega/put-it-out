// Сборка игры в один HTML-файл: node build.mjs  ->  dist/index.html
// Без зависимостей. Порядок файлов важен: сначала движок и сцены, потом уровни, в конце запуск.
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const SRC = 'src';
const read = p => readFileSync(join(SRC, p), 'utf8');
const dir = (d, filter = f => f.endsWith('.js')) => readdirSync(join(SRC, d)).filter(filter).sort().map(f => `${d}/${f}`);

// Эпизоды по порядку. Новый эпизод: создать папку src/levels/<id>/ и добавить её сюда.
const EPISODES = ['dom', 'dacha'];

const order = [
  'engine/core.js',
  'scenes/common.js',
  ...dir('scenes', f => f.endsWith('.js') && f !== 'common.js'),
  'engine/tools.js',
  'engine/extras.js',
  'levels/registry.js',
  // каждый эпизод: сначала его уровни, потом map.js, который их собирает в эпизод
  ...EPISODES.flatMap(ep => [...dir(`levels/${ep}`, f => /^\d+-.*\.js$/.test(f)), ...(existsSync(join(SRC, `levels/${ep}/map.js`)) ? [`levels/${ep}/map.js`] : [])]),
  'engine/sfx.js',
  'engine/screens.js',
  'engine/game.js',
  'engine/fire.js',
  'engine/finish.js',
  'engine/main.js',
];

const js = order.map(f => `// ---- ${f} ----\n${read(f)}`).join('\n');
const html = read('index.html')
  .replace('/*@STYLE*/', () => read('style.css'))
  .replace('/*@SCRIPT*/', () => js);

mkdirSync('dist', { recursive: true });
writeFileSync('dist/index.html', html);
console.log(`dist/index.html: ${(html.length / 1024).toFixed(1)} KB, ${order.length} файлов`);
