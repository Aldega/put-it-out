// Проверка Lua-кода без Roblox: синтаксис, опечатки в глобальных именах, переводы.
// Нужен luaparse: npm i --no-save luaparse   затем   node roblox/tools/check-lua.mjs
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const luaparse = require(process.env.LUAPARSE || 'luaparse');
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'src');
const FILES = ['server/Mission.server.lua', 'client/HUD.client.lua', 'shared/I18n.lua'];
const KNOWN = new Set(('game workspace script Instance Vector3 Vector2 CFrame Color3 UDim UDim2 Enum task math string table os ' +
  'pairs ipairs next type typeof tostring tonumber print warn error require setmetatable getmetatable pcall select unpack ' +
  'NumberSequence NumberSequenceKeypoint NumberRange ColorSequence ColorSequenceKeypoint RaycastParams TweenInfo utf8').split(' '));
let bad = 0;
const cyr = /[А-Яа-яЁё]/;
const lits = new Map();
for (const f of FILES) {
  const code = readFileSync(join(ROOT, f)).toString('latin1');
  let ast;
  try { ast = luaparse.parse(code, { scope: true, luaVersion: '5.1', encodingMode: 'pseudo-latin1', locations: true }); }
  catch (e) { console.log(`${f}: ОШИБКА СИНТАКСИСА ${e.message}`); bad++; continue; }
  for (const g of ast.globals) if (!KNOWN.has(g.name)) { console.log(`${f}: неизвестное глобальное имя «${g.name}»`); bad++; }
  if (f.includes('I18n')) continue;
  // строки с кириллицей = ключи перевода
  const walk = n => {
    if (!n || typeof n !== 'object') return;
    if (Array.isArray(n)) return n.forEach(walk);
    if (n.type === 'StringLiteral') {
      const v = Buffer.from(n.raw.slice(1, -1), 'latin1').toString('utf8');
      if (cyr.test(v)) lits.set(v, `${f}:${n.loc.start.line}`);
    }
    for (const k in n) if (k !== 'loc' && k !== 'range') walk(n[k]);
  };
  walk(ast.body);
}
const i18n = readFileSync(join(ROOT, 'shared/I18n.lua'), 'utf8');
const table = name => {
  const m = i18n.match(new RegExp(`I18n\\.${name} = \\{([\\s\\S]*?)\\n\\}`));
  const keys = new Set();
  if (m) for (const k of m[1].matchAll(/\["((?:[^"\\]|\\.)*)"\]\s*=/g)) keys.add(k[1]);
  return keys;
};
for (const lang of ['en', 'es']) {
  const keys = table(lang);
  for (const [s, where] of lits) if (!keys.has(s)) { console.log(`нет перевода ${lang}: «${s}» (${where})`); bad++; }
  for (const k of keys) if (!lits.has(k)) console.log(`лишний ключ ${lang}: «${k}»`);
}
console.log(bad ? `Проблем: ${bad}` : `Всё в порядке: ${lits.size} строк, переводы en/es на месте.`);
process.exit(bad ? 1 : 0);
