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

// Bigger version of a unit's scene for the guidebook header.
export function unitHero(unitId) {
  const sc = SCENES[unitId] || SCENES.u1;
  return `<div class="unit-hero"><svg class="scene-bg" viewBox="0 0 190 160" aria-hidden="true">${sc.art()}</svg><div class="scene-char">${character(sc.who, { size: 92, mood: 'wave' })}</div></div>`;
}

export function castLineup(ids = ['kumari', 'aliya', 'nimal', 'john'], size = 84, mood = '') {
  return `<div class="cast-lineup">${ids.map(id => character(id, { size, mood })).join('')}</div>`;
}

// ---------------------------------------------------------------- story scenes
// Wide illustrated backdrops (360×200, bottom-anchored) for each story.
let sid = 0;
const sky = (id, top, bottom) => `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bottom}"/></linearGradient></defs><rect width="360" height="200" fill="url(#${id})"/>`;
const drift = (x, y, s, dur, delay = 0) => `<g transform="translate(${x} ${y})"><g class="s-drift" style="animation-duration:${(dur / 3).toFixed(1)}s;animation-delay:${-delay}s">${cloud(0, 0, s)}</g></g>`;
const bird = (x, y, s, delay) => `<g transform="translate(${x} ${y}) scale(${s})"><g class="s-fly" style="animation-delay:${-delay}s"><path class="s-flap" d="M-7 0 Q-3.5 -5 0 0 Q3.5 -5 7 0" stroke="#3b3550" stroke-width="2" fill="none" stroke-linecap="round"/></g></g>`;
const spinSun = (x, y, r = 16, c = '#FFC94D') => `<g transform="translate(${x} ${y})"><g class="s-spin">${Array.from({ length: 12 }, (_, i) => `<path d="M0 -${r + 5} v-7" stroke="${c}" stroke-width="3.4" stroke-linecap="round" transform="rotate(${i * 30})"/>`).join('')}</g><circle r="${r}" fill="${c}"/><circle r="${r - 5}" fill="#FFE08A" opacity=".6"/></g>`;

const SCENE_ART = {
  // A white village church on a Sunday morning, bell swinging.
  st_u1: (id) => `${sky(id, '#9ED8F5', '#FFF2DA')}${spinSun(306, 42)}${drift(70, 40, 1.2, 46, 10)}${drift(220, 26, .9, 58, 30)}${drift(330, 70, .7, 40, 5)}
    ${bird(120, 46, 1, 0)}${bird(140, 38, .7, 1.5)}
    <path d="M0 140 Q60 112 130 128 Q200 142 260 120 Q310 104 360 118 L360 200 L0 200Z" fill="#9CCF7A"/>
    ${palm(26, 172, .95)}${palm(70, 176, .7, true)}
    <g>
      <rect x="226" y="62" width="34" height="112" fill="#FBF7EE"/><rect x="226" y="62" width="34" height="112" fill="#000" opacity=".04"/>
      <path d="M221 64 L243 34 L265 64Z" fill="#C0533A"/><path d="M243 34 L265 64 L254 64Z" fill="#9E3F2A"/>
      <path d="M243 12 V34 M235 20 H251" stroke="#E8B53A" stroke-width="4" stroke-linecap="round"/>
      <path d="M234 92 V76 a9 9 0 0 1 18 0 V92Z" fill="#3E3346"/>
      <g transform="translate(243 76)"><g class="s-bell"><path d="M-6 12 C-6 4 -4 0 0 0 C4 0 6 4 6 12Z" fill="#E8B53A"/><circle cx="0" cy="13.5" r="2" fill="#C98A0C"/></g></g>
      <rect x="258" y="98" width="94" height="76" fill="#FBF7EE"/>
      <path d="M252 100 L305 66 L358 100Z" fill="#C0533A"/><path d="M252 100 L358 100 L356 106 L254 106Z" fill="#9E3F2A"/>
      <path d="M296 174 V146 a9 9 0 0 1 18 0 V174Z" fill="#7A4A2A"/><path d="M305 137 V174" stroke="#5c3520" stroke-width="1.6"/>
      ${[270, 330].map(x => `<path d="M${x} 136 V120 a7 7 0 0 1 14 0 V136Z" fill="#7FB6D9"/><path d="M${x + 7} 113 V136 M${x} 126 H${x + 14}" stroke="#FBF7EE" stroke-width="1.6"/>`).join('')}
      <circle cx="305" cy="86" r="6" fill="#7FB6D9" stroke="#FBF7EE" stroke-width="1.6"/>
    </g>
    <path d="M0 170 Q180 158 360 170 L360 200 L0 200Z" fill="#86C46A"/><path d="M110 200 Q170 170 230 172 Q280 174 300 200Z" fill="#E9D7A8"/>
    ${[18, 96, 150, 340].map((x, i) => `<g transform="translate(${x} ${180 + (i % 2) * 6})">${[0, 72, 144, 216, 288].map(a => `<ellipse cx="0" cy="-3.4" rx="2.4" ry="3.6" fill="${i % 2 ? '#fff' : '#F49AB0'}" transform="rotate(${a})"/>`).join('')}<circle r="1.6" fill="#F5B731"/></g>`).join('')}`,

  // Seaside green at Galle Face, kites in the wind.
  st_u2: (id) => `${sky(id, '#86CFF2', '#FFF0D6')}${spinSun(52, 64, 14, '#FFB84D')}${drift(160, 30, 1, 50, 12)}${drift(300, 48, .8, 44, 28)}
    <path d="M0 118 L360 118 L360 160 L0 160Z" fill="#3FA9DA"/><path d="M0 118 L360 118 L360 124 L0 124Z" fill="#7CCBEB"/>
    <g class="s-wave">${[0, 1, 2].map(r => Array.from({ length: 9 }, (_, i) => `<path d="M${i * 48 + (r % 2) * 24 - 20} ${130 + r * 10} q6 -4 12 0" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" opacity=".7"/>`).join('')).join('')}</g>
    <g transform="translate(250 116)"><g class="s-boat"><path d="M-16 0 L16 0 L11 7 L-11 7Z" fill="#8B5A2B"/><path d="M0 0 V-24 L14 -4Z" fill="#fff"/><path d="M-2 -2 V-18 L-12 -4Z" fill="#F5B731"/></g></g>
    <g transform="translate(118 44)"><g class="s-kite"><path d="M0 -14 L11 0 L0 16 L-11 0Z" fill="#E5484D"/><path d="M0 -14 L0 16 M-11 0 L11 0" stroke="#fff" stroke-width="1.4" opacity=".8"/><path d="M0 16 q-4 8 0 14 q4 6 0 12" stroke="#E5484D" stroke-width="1.6" fill="none"/><path d="M0 16 L28 130" stroke="#fff" stroke-width=".9" opacity=".8"/></g></g>
    <g transform="translate(206 30)"><g class="s-kite" style="animation-delay:-1.3s"><path d="M0 -12 L10 0 L0 14 L-10 0Z" fill="#F5B731"/><path d="M0 -12 L0 14 M-10 0 L10 0" stroke="#fff" stroke-width="1.4" opacity=".8"/><path d="M0 14 q4 7 0 12 q-4 5 0 10" stroke="#F5B731" stroke-width="1.6" fill="none"/><path d="M0 14 L-30 140" stroke="#fff" stroke-width=".9" opacity=".8"/></g></g>
    <path d="M0 156 Q90 146 180 152 Q270 158 360 148 L360 200 L0 200Z" fill="#86C46A"/><path d="M0 172 Q120 164 240 172 Q300 176 360 170 L360 200 L0 200Z" fill="#74B85A"/>
    ${palm(330, 176, .9, true)}${palm(300, 180, .6)}${palm(22, 182, .7)}`,

  // A little roadside tea shop in the hills.
  st_u3: (id) => `${sky(id, '#B6E2F2', '#F3F8E6')}${drift(90, 30, .9, 52, 20)}${drift(250, 22, 1.1, 60, 4)}
    <path d="M0 96 Q50 70 110 86 Q160 98 210 80 Q270 60 360 84 L360 200 L0 200Z" fill="#7DBE7E"/>
    <path d="M0 122 Q70 96 150 112 Q230 128 300 104 Q330 96 360 102 L360 200 L0 200Z" fill="#5FAE68"/>
    ${Array.from({ length: 7 }, (_, r) => `<path d="M-10 ${108 + r * 9} Q90 ${96 + r * 10} 180 ${112 + r * 9} T370 ${100 + r * 9}" stroke="#4E9A58" stroke-width="3" fill="none" stroke-dasharray="7 5" opacity=".7"/>`).join('')}
    ${bird(70, 50, .8, 2)}${bird(88, 44, .6, .6)}
    <g>
      <rect x="236" y="70" width="6" height="104" fill="#7A4A2A"/><rect x="340" y="70" width="6" height="104" fill="#7A4A2A"/>
      <path d="M222 74 L360 62 L360 74 L222 86Z" fill="#D9623B"/>${Array.from({ length: 12 }, (_, i) => `<path d="M${226 + i * 11.5} ${85 - i * 1.05} L${226 + i * 11.5} ${73 - i * 1.05}" stroke="#B44A28" stroke-width="2"/>`).join('')}
      <rect x="232" y="126" width="118" height="48" fill="#A8703F"/><rect x="232" y="122" width="118" height="8" rx="2" fill="#C68A52"/>
      ${[0, 1, 2, 3].map(i => `<rect x="${238 + i * 28}" y="134" width="22" height="34" fill="#8E5A30"/>`).join('')}
      ${[[250, '#F5B731'], [268, '#E5484D'], [286, '#3FA35F']].map(([x, c]) => `<rect x="${x}" y="104" width="14" height="18" rx="3" fill="#E8F6FB" opacity=".9"/><rect x="${x + 2}" y="110" width="10" height="11" rx="2" fill="${c}"/><rect x="${x + 1}" y="101" width="12" height="4" rx="1.5" fill="#9AA0AE"/>`).join('')}
      <g transform="translate(320 100)"><path d="M-10 22 L-12 6 Q-12 0 -6 0 L6 0 Q12 0 12 6 L10 22Z" fill="#9AA0AE"/><path d="M12 8 L22 2" stroke="#9AA0AE" stroke-width="3.4" stroke-linecap="round"/><path d="M-6 0 Q0 -8 6 0" stroke="#5E6472" stroke-width="2.4" fill="none"/>
        ${[0, 1, 2].map(i => `<path class="s-steam" style="animation-delay:${i * .7}s" d="M${22 + i * 3} -2 q-4 -6 0 -12 q4 -6 0 -12" stroke="#fff" stroke-width="2.6" fill="none" stroke-linecap="round"/>`).join('')}</g>
      <g transform="translate(300 80)"><g class="s-swing"><path d="M0 0 V8" stroke="#6A421E" stroke-width="2"/>${[[-6, 14], [0, 16], [6, 14], [-3, 21], [3, 21]].map(([x, y]) => `<path d="M${x} ${y - 6} q-3 8 2 12" stroke="#F5C23A" stroke-width="5" fill="none" stroke-linecap="round"/>`).join('')}</g></g>
    </g>
    <path d="M0 168 Q180 160 360 168 L360 200 L0 200Z" fill="#C9A877"/><path d="M0 182 Q180 176 360 182 L360 200 L0 200Z" fill="#B8955F"/>
    ${palm(30, 178, .75)}`,

  // A busy fruit market with a tuk-tuk going by.
  st_u4: (id) => `${sky(id, '#A5DBF5', '#FFF3DD')}${spinSun(300, 34, 13)}${drift(120, 26, .9, 48, 8)}
    ${[[0, 70, '#F2C46D'], [62, 82, '#E58C7A'], [124, 66, '#8EC5E0'], [196, 78, '#B7D98A'], [262, 70, '#F2C46D'], [322, 84, '#E58C7A']].map(([x, y, c]) => `<rect x="${x}" y="${y}" width="${x === 322 ? 40 : 64}" height="${130 - y}" fill="${c}"/><rect x="${x + 10}" y="${y + 14}" width="14" height="16" rx="2" fill="#fff" opacity=".55"/><rect x="${x + 34}" y="${y + 14}" width="14" height="16" rx="2" fill="#fff" opacity=".55"/>`).join('')}
    <path d="M0 52 Q60 70 120 56 Q180 42 240 58 Q300 72 360 54" stroke="#6A421E" stroke-width="1.4" fill="none"/>
    <g class="s-sway">${Array.from({ length: 15 }, (_, i) => { const x = 12 + i * 24; const y = 52 + Math.sin(i / 2.4) * 8 + 6; return `<path d="M${x - 7} ${y - 3} L${x + 7} ${y - 3} L${x} ${y + 9}Z" fill="${['#E5484D', '#F5B731', '#3FA35F', '#1E9FE3', '#8D153A'][i % 5]}"/>`; }).join('')}</g>
    <path d="M0 126 L360 126 L360 150 L0 150Z" fill="#9AA0AE"/><path d="M0 137 h360" stroke="#fff" stroke-width="2" stroke-dasharray="14 12" opacity=".7"/>
    <g transform="translate(0 146)"><g class="s-drive">${tuktuk(0, 0, .55)}</g></g>
    <g>
      <path d="M8 98 L120 98 L112 116 L16 116Z" fill="#3FA35F"/>${[0, 1, 2, 3, 4, 5, 6].map(i => `<path d="M${16 + i * 14} 98 L${24 + i * 14} 98 L${22 + i * 14} 116 L${16 + i * 14} 116Z" fill="#fff" opacity=".85"/>`).join('')}
      <path d="M8 98 L120 98" stroke="#2B7D47" stroke-width="3"/><rect x="18" y="116" width="4" height="60" fill="#7A4A2A"/><rect x="106" y="116" width="4" height="60" fill="#7A4A2A"/>
      <path d="M10 156 L118 156 L112 176 L16 176Z" fill="#B7793A"/><path d="M10 156 L118 156" stroke="#8a5424" stroke-width="3"/>
      ${[[22, 148], [36, 146], [50, 148], [64, 146], [29, 138], [43, 137], [57, 138], [36, 129], [50, 129]].map(([x, y], i) => `<ellipse cx="${x}" cy="${y}" rx="8" ry="6.5" fill="${i % 2 ? '#F7C548' : '#F5A623'}" transform="rotate(-20 ${x} ${y})"/>`).join('')}
      <g transform="translate(92 146)"><path d="M-10 6 C-10 -6 10 -6 10 6Z" fill="#E1A23A"/><path d="M-6 -4 L-10 -16 M0 -6 L0 -18 M6 -4 L10 -16" stroke="#3FA35F" stroke-width="3" stroke-linecap="round"/></g>
      <g transform="translate(104 148)">${[0, 1, 2].map(i => `<path d="M${i * 4 - 4} -10 q-3 8 2 12" stroke="#F5C23A" stroke-width="4.4" fill="none" stroke-linecap="round"/>`).join('')}</g>
    </g>
    <path d="M0 172 L360 172 L360 200 L0 200Z" fill="#D9C9A8"/><path d="M0 172 h360" stroke="#C4B08A" stroke-width="2"/>`,
};

export function storyScene(id) {
  const art = SCENE_ART[id] || SCENE_ART.st_u1;
  return `<svg class="scene" viewBox="0 0 360 200" preserveAspectRatio="xMidYMax slice" aria-hidden="true">${art(`sg${++sid}`)}</svg>`;
}
