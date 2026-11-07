// Список уровней. Каждый файл в levels/<эпизод>/ добавляет свой уровень через LEVELS.push(...).
const LEVELS = [];
// Эпизоды. map.js в папке эпизода вызывает episode({...}) после своих уровней:
// все уровни, добавленные после предыдущего эпизода, достаются этому.
//   { id, name, map: [[x%, y%], ...], bg(c) }  bg рисует фон карты эпизода (без дорожки)
const EPISODES = [];
function episode(e) {
  e.from = EPISODES.length ? EPISODES[EPISODES.length - 1].to : 0; e.to = LEVELS.length; e.n = EPISODES.length;
  for (let i = e.from; i < e.to; i++) LEVELS[i].ep = e.n;
  EPISODES.push(e);
}
