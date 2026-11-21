// Little Sri Lankan scenes for the learning path.
import { character } from './characters.js';

const palm = (x = 0, y = 0, s = 1, flip = false) => `<g transform="translate(${x} ${y}) scale(${flip ? -s : s} ${s})">
  <path d="M0 0 C-2 -30 4 -60 14 -86" stroke="#8B5A2B" stroke-width="7" fill="none" stroke-linecap="round"/>
  <path d="M1 -10 l5 -2M2 -26 l5 -2M5 -42 l5 -2M9 -58 l5 -2M12 -72 l5 -2" stroke="#6f4520" stroke-width="2" stroke-linecap="round"/>
  <g transform="translate(14 -86)">
    <path d="M0 0 C-14 -14 -34 -12 -46 2 C-32 -4 -16 -4 0 0Z" fill="#2E9B57"/>
    <path d="M0 0 C14 -16 36 -14 48 0 C34 -6 16 -6 0 0Z" fill="#2E9B57"/>
    <path d="M0 0 C-4 -18 -18 -30 -32 -30 C-20 -24 -10 -14 0 0Z" fill="#38B26A"/>
    <path d="M0 0 C6 -18 20 -28 34 -26 C22 -22 12 -12 0 0Z" fill="#38B26A"/>
    <path d="M0 0 C-18 2 -30 14 -34 26 C-22 16 -12 8 0 0Z" fill="#26874A"/>
    <path d="M0 0 C18 2 30 14 32 28 C22 16 12 8 0 0Z" fill="#26874A"/>
    <circle cx="-3" cy="4" r="4" fill="#7a4b1e"/><circle cx="4" cy="5" r="4" fill="#6a3f17"/>
  </g></g>`;

const sigiriya = (x = 0, y = 0, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">
  <path d="M-70 0 C-66 -20 -52 -26 -46 -52 C-42 -70 -30 -78 -6 -80 C22 -82 40 -74 46 -56 C52 -36 60 -22 70 0Z" fill="#B8734A"/>
  <path d="M-46 -52 C-42 -70 -30 -78 -6 -80 C22 -82 40 -74 46 -56 C30 -64 -20 -66 -46 -52Z" fill="#9C5E3A"/>
  <path d="M-70 0 C-60 -10 -44 -14 -30 -10 C-16 -16 0 -14 12 -8 C28 -14 48 -12 70 0Z" fill="#3E9E5F"/>
  <path d="M-38 -78 C-30 -84 -16 -86 -4 -86" stroke="#3E9E5F" stroke-width="6" stroke-linecap="round" fill="none"/>
</g>`;

const teaBushes = (x = 0, y = 0, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">
  ${[0, 1, 2].map(r => [0, 1, 2, 3].map(c => `<ellipse cx="${c * 26 - 39 + (r % 2) * 13}" cy="${-r * 14}" rx="15" ry="9" fill="${['#3FA35F', '#4FB36D', '#5CC07A'][r]}"/>`).join('')).join('')}
  <path d="M-58 4 h116" stroke="#8a5a2b" stroke-width="3" opacity=".3"/>
</g>`;

const tuktuk = (x = 0, y = 0, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">
  <ellipse cx="0" cy="2" rx="40" ry="4" fill="#000" opacity=".1"/>
  <path d="M-34 -8 L-34 -38 C-34 -50 -24 -56 -10 -56 L18 -56 C30 -56 36 -46 36 -36 L36 -8Z" fill="#C0392B"/>
  <path d="M-30 -14 L-30 -36 C-30 -44 -22 -50 -10 -50 L-2 -50 L-2 -14Z" fill="#AEDCF0"/>
  <path d="M4 -50 L18 -50 C26 -50 31 -44 31 -36 L31 -28 L4 -28Z" fill="#AEDCF0"/>
  <path d="M-36 -58 L38 -58 L36 -52 L-34 -52Z" fill="#1B1B1F"/>
  <rect x="-36" y="-12" width="74" height="6" rx="3" fill="#E8B53A"/>
  <circle cx="-24" cy="-4" r="8" fill="#222"/><circle cx="-24" cy="-4" r="3" fill="#bbb"/>
  <circle cx="26" cy="-4" r="8" fill="#222"/><circle cx="26" cy="-4" r="3" fill="#bbb"/>
  <circle cx="37" cy="-24" r="3" fill="#FFE07A"/>
</g>`;

const fruitStall = (x = 0, y = 0, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">
  <path d="M-40 -6 L-34 -30 L34 -30 L40 -6Z" fill="#B7793A"/><path d="M-34 -30 L34 -30" stroke="#8a5424" stroke-width="3"/>
  <path d="M-40 -6 h80 v6 h-80z" fill="#8a5424"/>
  ${[[-22, -36], [-8, -38], [6, -37], [20, -36], [-15, -46], [0, -48], [14, -46]].map(([cx, cy], i) => `<ellipse cx="${cx}" cy="${cy}" rx="8" ry="6.5" fill="${i % 3 === 0 ? '#F2A900' : i % 3 === 1 ? '#F5C23A' : '#8BC34A'}" transform="rotate(-20 ${cx} ${cy})"/>`).join('')}
  <path d="M-46 -62 L46 -62 L40 -50 L-40 -50Z" fill="#E8891C"/><path d="M-46 -62 L46 -62" stroke="#8D153A" stroke-width="4"/>
  <path d="M-40 -50 v44 M40 -50 v44" stroke="#8a5424" stroke-width="3"/>
</g>`;

const sun = (x, y, r = 14) => `<g transform="translate(${x} ${y})"><circle r="${r}" fill="#FFC94D"/>${Array.from({ length: 8 }, (_, i) => `<path d="M0 -${r + 4} v-6" stroke="#FFC94D" stroke-width="3" stroke-linecap="round" transform="rotate(${i * 45})"/>`).join('')}</g>`;
const cloud = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})" opacity=".9"><ellipse cx="0" cy="0" rx="18" ry="10" fill="#fff"/><ellipse cx="14" cy="-6" rx="12" ry="10" fill="#fff"/><ellipse cx="-12" cy="-4" rx="10" ry="8" fill="#fff"/></g>`;

const SCENES = {
  u1: { who: 'aliya', art: () => `${palm(26, 150, .95)}${palm(160, 150, .8, true)}${sun(150, 26)}${cloud(48, 34, .9)}` },
  u2: { who: 'kumari', art: () => `${sigiriya(96, 150, .9)}${palm(18, 150, .8)}${cloud(150, 30)}` },
  u3: { who: 'nimal', art: () => `${teaBushes(96, 150, 1)}${sun(32, 30, 12)}${cloud(150, 40, .8)}` },
  u4: { who: 'john', art: () => `${fruitStall(60, 150, .95)}${tuktuk(150, 150, .7)}${cloud(40, 28, .8)}` },
};

// A scene beside the path: scenery plus a waving character.
export function pathScene(unitId, side = 'left') {
  const sc = SCENES[unitId] || SCENES.u1;
  return `<div class="path-scene ${side}">
    <svg class="scene-bg" viewBox="0 0 190 160" aria-hidden="true">${sc.art()}</svg>
    <div class="scene-char">${character(sc.who, { size: 74, mood: 'wave' })}</div>
  </div>`;
}

export function castLineup(ids = ['kumari', 'aliya', 'nimal', 'john'], size = 84, mood = '') {
  return `<div class="cast-lineup">${ids.map(id => character(id, { size, mood })).join('')}</div>`;
}
