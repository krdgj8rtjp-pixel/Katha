import { COURSE } from '../data/course.js';
// Achievement medals: a hexagonal badge whose metal changes with the level,
// plus a white emblem for each achievement. Level 0 = not yet earned.
const METALS = [
  ['#CFC9BC', '#A8A293', '#E7E3DA'], // locked
  ['#DB914E', '#A65F28', '#F6C18E'], // bronze
  ['#B3BDCB', '#7B8698', '#E3E8EF'], // silver
  ['#F5B731', '#C98A0C', '#FFE08A'], // gold
  ['#2EA8E6', '#1679AE', '#A6DFFB'], // sapphire
  ['#3AAE5A', '#2A8743', '#A3E6B4'], // emerald
  ['#9B6BD1', '#6E44A6', '#DCC6F7'], // amethyst
];

const EMBLEMS = {
  streak: '<path d="M32 13c1.6 5.6 8.4 9 8.4 16.6a8.4 8.4 0 0 1-16.8 0c0-3.4 1.6-5.8 3.4-7.4.3 2.4 1.6 4.2 3.2 4.2-1.6-5 0-10 1.8-13.4z" fill="#fff"/>',
  xp: '<path d="M35 12 20 31h10l-2 13 16-19H34z" fill="#fff"/>',
  words: '<rect x="20" y="16" width="20" height="25" rx="3" fill="#fff" opacity=".6"/><rect x="24" y="19" width="20" height="25" rx="3" fill="#fff"/><path d="M28 26h12M28 31h12M28 36h8" style="stroke:var(--b-d)" stroke-width="2.2" stroke-linecap="round"/>',
  perfect: '<path d="M21 21h22l6 8-17 17-17-17z" fill="#fff"/><path d="M15 29h34L32 46z" fill="#fff" opacity=".7"/><path d="M25 21l-2.5 8h19L39 21" fill="none" style="stroke:var(--b-d)" stroke-width="1.6" opacity=".55"/>',
  // The letters medal shows a letter from the course being studied (අ, Ж, or Aa).
  get letters() {
    const si = COURSE.script === 'sinhala';
    return `<text x="32" y="${si ? 39 : 40}" text-anchor="middle" font-size="${si ? 22 : 21}" font-weight="800" fill="#fff" font-family="${si ? 'Noto Sans Sinhala, Sinhala Sangam MN, sans-serif' : 'Nunito, sans-serif'}">${COURSE.letterIcon || 'Aa'}</text>`;
  },
  stories: '<path d="M14 21c5-3 11-3 18 1 7-4 13-4 18-1v20c-5-3-11-3-18 1-7-4-13-4-18-1z" fill="#fff"/><path d="M32 22v20" style="stroke:var(--b-d)" stroke-width="1.8"/>',
};

let n = 0;
const HEX = 'M32 4.5 54.5 17.5V43.5L32 56.5 9.5 43.5V17.5Z';
export function badge(id, level = 0, { size = 56, cls = '' } = {}) {
  const [c, d, l] = METALS[Math.max(0, Math.min(level, METALS.length - 1))];
  const k = `bdg${++n}`;
  return `<svg class="badge ${level ? 'earned' : 'locked'} ${cls}" viewBox="0 0 64 70" width="${size}" height="${Math.round(size * 70 / 64)}" style="--b-d:${d}" aria-hidden="true">
    <defs><clipPath id="${k}"><path d="${HEX}"/></clipPath></defs>
    <path d="M18 46 12 66l7.5-3.5L24 69l6-18Z" fill="${d}"/><path d="M46 46l6 20-7.5-3.5L40 69l-6-18Z" fill="${d}"/>
    <path d="${HEX}" fill="${d}" transform="translate(0 2.5)"/>
    <path d="${HEX}" fill="${c}"/>
    <path d="M32 10.5 49.5 20.6V40.4L32 50.5 14.5 40.4V20.6Z" fill="${l}" opacity=".35"/>
    <g clip-path="url(#${k})">${level ? '<g transform="rotate(25 32 32)"><rect class="b-shine" x="-30" y="-10" width="14" height="90" fill="#fff" opacity=".35"/></g>' : ''}</g>
    ${EMBLEMS[id] || EMBLEMS.xp}
  </svg>`;
}
