// ================== языки ==================
// Игра пишется по-русски. Переводы лежат в i18n/<язык>.js (en, es): словарь «русская строка -> английская».
// tl('Огонь перекинулся на {0}!', B.name): переводит строку и подставляет аргументы (их тоже переводит).
// Текст на холсте (fillText/strokeText/measureText), реплики say() и подписи интерфейса переводятся сами,
// поэтому в уровнях и сценах достаточно писать по-русски и добавить перевод в i18n/en.js и i18n/es.js.
// Проверка, что всё переведено: node tools/i18n-check.mjs
const LANGS = ['ru', 'en', 'es'];
let LANG = SAVE.lang || (l => LANGS.includes(l) ? l : l === 'uk' || l === 'be' || l === 'kk' ? 'ru' : 'en')((navigator.language || 'ru').slice(0, 2).toLowerCase());
const I18N_MISS = new Set(); // строки без перевода, встреченные в игре (для отладки)
const CYR = /[А-Яа-яЁё]/;
function tl(s, ...a) {
  if (typeof s !== 'string') return s;
  let r = s;
  if (LANG !== 'ru' && CYR.test(s)) { const d = I18N[LANG] || {}; if (d[s] != null) r = d[s]; else I18N_MISS.add(s); }
  return a.length ? r.replace(/\{(\d)\}/g, (m, i) => tl(a[i])) : r;
}
// весь текст на холсте проходит через перевод. Надписи в сценах (вывески, написанные заглавными буквами)
// сжимаются до ширины русского оригинала, чтобы длинный перевод не вылезал за табличку
const MEASURE = CanvasRenderingContext2D.prototype.measureText;
for (const f of ['fillText', 'strokeText', 'measureText']) {
  const orig = CanvasRenderingContext2D.prototype[f];
  CanvasRenderingContext2D.prototype[f] = function (s, ...r) {
    if (LANG === 'ru' || typeof s !== 'string' || !CYR.test(s)) return orig.call(this, s, ...r);
    const t = tl(s);
    if (f !== 'measureText' && r.length === 2 && s === s.toUpperCase()) r.push(Math.max(MEASURE.call(this, s).width * 1.1, 24));
    return orig.call(this, t, ...r);
  };
}
// подписи в разметке: data-t (текст) и data-ta (aria-label) хранят русский оригинал
function applyLang() {
  document.documentElement.lang = LANG;
  document.title = tl('Как это потушить');
  document.querySelectorAll('[data-t]').forEach(e => { e.textContent = tl(e.dataset.t); });
  document.querySelectorAll('[data-ta]').forEach(e => { e.setAttribute('aria-label', tl(e.dataset.ta)); });
  document.querySelectorAll('.langbtn').forEach(b => b.setAttribute('aria-pressed', b.dataset.lang === LANG));
}
function setLang(l) {
  LANG = l; SAVE.lang = l; store(); bgCache = {}; applyLang();
}
const I18N = {};
