// ================== уровни ==================
const TOOLS = {
  water: { name: 'Вода', power: .4, radius: 130, cd: 1.0, color: '#3fa9f5', price: 0,
    icon: '<svg viewBox="0 0 48 48"><path d="M10 14h28l-4 28H14z" fill="#3fa9f5" stroke="#2a1a12" stroke-width="3" stroke-linejoin="round"/><ellipse cx="24" cy="14" rx="14" ry="4" fill="#bfe8ff" stroke="#2a1a12" stroke-width="3"/><path d="M10 14C10 2 38 2 38 14" fill="none" stroke="#2a1a12" stroke-width="3"/><path d="M18 22v12" stroke="#fff" stroke-width="3" stroke-linecap="round"/></svg>' },
  sand: { name: 'Песок', power: .3, radius: 100, cd: 1.4, color: '#d9b26f', price: 0,
    icon: '<svg viewBox="0 0 48 48"><path d="M10 18h28l-4 24H14z" fill="#e63b2e" stroke="#2a1a12" stroke-width="3" stroke-linejoin="round"/><path d="M9 19c4-9 26-9 30 0z" fill="#e8c47d" stroke="#2a1a12" stroke-width="3" stroke-linejoin="round"/><path d="M30 10l8-6" stroke="#2a1a12" stroke-width="4" stroke-linecap="round"/><path d="M18 26v10" stroke="#fff" stroke-width="3" stroke-linecap="round"/></svg>' },
  lid: { name: 'Крышка', power: .5, radius: 60, cd: 2.0, color: '#9aa3ad', price: 0,
    icon: '<svg viewBox="0 0 48 48"><path d="M6 30c0-12 36-12 36 0z" fill="#b8c1cc" stroke="#2a1a12" stroke-width="3" stroke-linejoin="round"/><rect x="5" y="29" width="38" height="6" rx="3" fill="#8f99a6" stroke="#2a1a12" stroke-width="3"/><rect x="19" y="13" width="10" height="7" rx="3" fill="#2a1a12"/></svg>' },
  blanket: { name: 'Покрывало', power: .65, radius: 95, cd: 1.8, color: '#c8434f', price: 60,
    desc: 'Огнестойкая ткань. Накрывает огонь и перекрывает воздух. Отлично тушит масло на кухне.',
    icon: '<svg viewBox="0 0 48 48"><path d="M8 10h32v24c-6 4-10-2-16 2s-10-2-16 2z" fill="#c8434f" stroke="#2a1a12" stroke-width="3" stroke-linejoin="round"/><path d="M8 10h32" stroke="#2a1a12" stroke-width="3"/><path d="M14 16v14M22 16v14M30 16v14" stroke="#ffd23f" stroke-width="2.5" stroke-linecap="round"/></svg>' },
  powder: { name: 'Огнетушитель ОП-4', short: 'Порошок', power: .6, radius: 160, cd: 1.1, color: '#ffffff', price: 150,
    desc: 'Порошковый огнетушитель ОП-4. Тушит почти всё, даже электроприборы под напряжением.',
    icon: '<svg viewBox="0 0 48 48"><rect x="15" y="14" width="18" height="30" rx="7" fill="#e63b2e" stroke="#2a1a12" stroke-width="3"/><rect x="17" y="24" width="14" height="8" rx="2" fill="#fff" stroke="#2a1a12" stroke-width="2"/><path d="M20 14V8h10l6 4" fill="none" stroke="#2a1a12" stroke-width="3" stroke-linejoin="round"/><path d="M36 12c4 2 6 6 4 10" fill="none" stroke="#2a1a12" stroke-width="3" stroke-linecap="round"/></svg>' }
};
const LABEL_PLUG = 'Выдернуть вилку';

function shockZone(box, at, extra) { return { box, at, on: G => G.flags.plugged, extra }; }

