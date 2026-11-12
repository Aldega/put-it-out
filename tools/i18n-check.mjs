// Проверка переводов: node tools/i18n-check.mjs [--dump файл.json]
// Находит все русские строки в src/ (JS и data-t в index.html) и проверяет, что у каждой есть перевод
// в каждом словаре src/i18n/<язык>.js. Без зависимостей.
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const CYR = /[А-Яа-яЁё]/;
const files = [];
(function walk(d) { for (const f of readdirSync(d)) { const p = join(d, f); if (statSync(p).isDirectory()) { if (f !== 'i18n') walk(p); } else if (p.endsWith('.js')) files.push(p); } })('src');

// строки из JS: простой токенизатор (комментарии, '', "", `` с ${}, регулярки)
function strings(src) {
  const out = []; let i = 0, prev = '';
  const n = src.length;
  function tpl() { // i на символе после `
    let s = '', parts = 0;
    while (i < n && src[i] !== '`') {
      if (src[i] === '\\') { s += src[i + 1]; i += 2; continue; }
      if (src[i] === '$' && src[i + 1] === '{') { i += 2; code('}'); i++; s += '{' + parts++ + '}'; continue; }
      s += src[i++];
    }
    i++; return { s, tpl: parts > 0 };
  }
  function code(end) {
    let depth = 0;
    while (i < n) {
      const c = src[i];
      if (end && c === end && depth === 0) return;
      if (c === '{') depth++; else if (c === '}') depth--;
      if (c === '/' && src[i + 1] === '/') { while (i < n && src[i] !== '\n') i++; continue; }
      if (c === '/' && src[i + 1] === '*') { i = src.indexOf('*/', i + 2) + 2; continue; }
      if (c === '/' && /[(,=:[!&|?{};+\-*%<>~^]|^$|return$/.test(prev)) { i++; let cls = false; while (i < n && (src[i] !== '/' || cls)) { if (src[i] === '\\') i++; else if (src[i] === '[') cls = true; else if (src[i] === ']') cls = false; i++; } i++; prev = ')'; continue; }
      if (c === "'" || c === '"') { let s = ''; i++; while (i < n && src[i] !== c) { if (src[i] === '\\') { const e = src[i + 1]; s += e === 'n' ? '\n' : e; i += 2; continue; } s += src[i++]; } i++; out.push({ s }); prev = 'x'; continue; }
      if (c === '`') { i++; const t = tpl(); out.push(t); prev = 'x'; continue; }
      if (!/\s/.test(c)) prev = /\w/.test(c) ? (prev.match(/\w+$/) ? prev + c : c) : c;
      i++;
    }
  }
  code(null);
  return out;
}

const found = new Map(); // строка -> где
const warn = [];
for (const f of files) {
  for (const t of strings(readFileSync(f, 'utf8'))) {
    if (!CYR.test(t.s)) continue;
    if (t.tpl && /</.test(t.s) === false) warn.push(`${f}: шаблон с русским текстом, оберни в tl('...{0}...', x): ${t.s.slice(0, 80)}`);
    if (t.tpl) continue;
    if (!found.has(t.s)) found.set(t.s, f);
  }
}
const html = readFileSync('src/index.html', 'utf8');
for (const m of html.matchAll(/data-ta?="([^"]+)"/g)) if (!found.has(m[1])) found.set(m[1], 'src/index.html');
for (const m of html.matchAll(/<title>([^<]+)</g)) if (!found.has(m[1])) found.set(m[1], 'src/index.html');

globalThis.I18N = {};
const langs = readdirSync('src/i18n').filter(f => f.endsWith('.js'));
let bad = 0;
for (const f of langs) {
  new Function(readFileSync(join('src/i18n', f), 'utf8'))();
}
for (const [lang, d] of Object.entries(I18N)) {
  const miss = [...found.keys()].filter(s => d[s] == null);
  const extra = Object.keys(d).filter(s => !found.has(s));
  const holes = Object.entries(d).filter(([k, v]) => (k.match(/\{\d\}/g) || []).sort().join() !== (v.match(/\{\d\}/g) || []).sort().join()).map(([k]) => k);
  console.log(`${lang}: ${Object.keys(d).length} переводов, нет перевода: ${miss.length}, лишних: ${extra.length}, не совпадают {N}: ${holes.length}`);
  for (const s of miss.slice(0, 15)) console.log(`  нет: ${s.slice(0, 90)}   (${found.get(s)})`);
  for (const s of extra.slice(0, 15)) console.log(`  лишнее: ${s.slice(0, 90)}`);
  for (const s of holes) console.log(`  {N}: ${s.slice(0, 90)}`);
  bad += miss.length + holes.length;
}
for (const w of warn) console.log(w);
const di = process.argv.indexOf('--dump');
if (di > 0) writeFileSync(process.argv[di + 1], JSON.stringify([...found.keys()], null, 1));
console.log(`русских строк: ${found.size}`);
process.exit(bad || warn.length ? 1 : 0);
