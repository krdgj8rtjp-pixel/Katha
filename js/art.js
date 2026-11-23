// Little Sri Lankan scenes for the learning path.
import { character, castId } from './characters.js';
import { UNITS } from '../data/course.js';

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

export const taxi = (x = 0, y = 0, s = 1, body = '#F5C518') => `<g transform="translate(${x} ${y}) scale(${s})">
  <ellipse cx="0" cy="2" rx="42" ry="4" fill="#000" opacity=".1"/>
  <path d="M-40 -8 L-40 -22 Q-40 -28 -32 -30 L-20 -32 L-10 -46 Q-7 -50 0 -50 L20 -50 Q26 -50 30 -44 L38 -32 Q44 -30 44 -24 L44 -8Z" fill="${body}"/>
  <path d="M-16 -32 L-6 -45 L6 -45 L6 -32Z M10 -32 L10 -45 L20 -45 Q24 -45 27 -41 L33 -32Z" fill="#AEDCF0"/>
  <rect x="-6" y="-58" width="20" height="8" rx="2" fill="#1B1B1F"/><path d="M-3 -54 h14" stroke="#F5C518" stroke-width="2" stroke-dasharray="3 2"/>${body !== '#F5C518' ? '<path d="M-40 -14 H44" stroke="#F5C518" stroke-width="3"/>' : ''}
  <path d="M-40 -18 H44" stroke="#1B1B1F" stroke-width="3" stroke-dasharray="5 5"/>
  <circle cx="-24" cy="-6" r="8" fill="#222"/><circle cx="-24" cy="-6" r="3" fill="#bbb"/><circle cx="28" cy="-6" r="8" fill="#222"/><circle cx="28" cy="-6" r="3" fill="#bbb"/>
</g>`;
const fountain = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="-2" rx="34" ry="8" fill="#9AA0AE"/><ellipse cx="0" cy="-6" rx="30" ry="6" fill="#7FD0F5"/><rect x="-5" y="-34" width="10" height="28" fill="#B8BECB"/><ellipse cx="0" cy="-34" rx="16" ry="4" fill="#9AA0AE"/>
  <g class="s-steam" style="animation-duration:1.6s"><path d="M0 -38 q-10 -14 -18 6 M0 -38 q10 -14 18 6" stroke="#7FD0F5" stroke-width="2.6" fill="none" stroke-linecap="round"/></g></g>`;
const colonial = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-34" y="-48" width="68" height="48" fill="#F2D9A0"/><path d="M-34 -48 Q0 -74 34 -48Z" fill="#E8C27A"/>
  <rect x="-44" y="-78" width="18" height="78" fill="#F2D9A0"/><path d="M-46 -78 Q-35 -96 -24 -78Z" fill="#C0533A"/><rect x="26" y="-78" width="18" height="78" fill="#F2D9A0"/><path d="M24 -78 Q35 -96 46 -78Z" fill="#C0533A"/>
  <path d="M-35 -104 V-92 M-39 -99 H-31 M35 -104 V-92 M31 -99 H39" stroke="#E8B53A" stroke-width="2.4" stroke-linecap="round"/>
  <path d="M-9 0 V-20 a9 9 0 0 1 18 0 V0Z" fill="#7A4A2A"/><circle cx="0" cy="-36" r="6" fill="#7FB6D9"/><path d="M-40 -62 v-8 a5 5 0 0 1 10 0 v8Z M30 -62 v-8 a5 5 0 0 1 10 0 v8Z" fill="#3E3346"/></g>`;

export const tuktuk = (x = 0, y = 0, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">
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

// ---- Uzbekistan
const poplar = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-2.2" y="-22" width="4.4" height="22" fill="#7A4A2A"/>
  <ellipse cx="0" cy="-64" rx="11" ry="46" fill="#4E9A4A"/><ellipse cx="-3.5" cy="-68" rx="5" ry="34" fill="#6DBB5C" opacity=".8"/></g>`;
const roundTree = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-3 0 L-2 -34 L2 -34 L3 0Z" fill="#7A4A2A"/>
  <circle cx="-14" cy="-44" r="18" fill="#4E9A4A"/><circle cx="12" cy="-46" r="19" fill="#4E9A4A"/><circle cx="0" cy="-62" r="20" fill="#5BAA52"/><circle cx="-6" cy="-66" r="9" fill="#7CC46A" opacity=".7"/></g>`;
const uzHouse = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-38" y="-40" width="76" height="40" fill="#F3E6CF"/><rect x="-42" y="-45" width="84" height="6" rx="1.5" fill="#C9B48F"/>
  <rect x="-13" y="-32" width="26" height="32" rx="2" fill="#2F6DB5"/><path d="M0 -32 V0" stroke="#1F4F8A" stroke-width="1.6"/>
  ${[-6.5, 6.5].map(cx => `<rect x="${cx - 4.5}" y="-27" width="9" height="10" rx="1.5" fill="none" stroke="#8FC3EC" stroke-width="1.4"/><circle cx="${cx}" cy="-9" r="2" fill="none" stroke="#8FC3EC" stroke-width="1.4"/>`).join('')}
  <rect x="-33" y="-31" width="12" height="12" fill="#7FB6D9" stroke="#A8703F" stroke-width="2"/><rect x="21" y="-31" width="12" height="12" fill="#7FB6D9" stroke="#A8703F" stroke-width="2"/></g>`;
const madrasa = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">
  <path d="M10 -58 C8 -86 48 -86 46 -58Z" fill="#2A8BD0"/>${[15, 21.5, 28, 34.5, 41].map(dx => `<path d="M${dx} -58 Q${28 + (dx - 28) * 1.1} -76 28 -79" stroke="#6FC0F0" stroke-width="1.5" fill="none"/>`).join('')}<path d="M28 -79 V-88" stroke="#F5C23A" stroke-width="2"/><circle cx="28" cy="-89" r="2" fill="#F5C23A"/><rect x="12" y="-62" width="32" height="6" fill="#1E6FB8"/>
  <path d="M-58 0 L-44 0 L-46 -94 L-56 -94Z" fill="#E1BE84"/><rect x="-57" y="-52" width="12" height="4" fill="#1E6FB8"/><rect x="-56" y="-80" width="10" height="4" fill="#1E6FB8"/><rect x="-58" y="-100" width="14" height="6" fill="#D9B27A"/><path d="M-57 -100 Q-51 -110 -45 -100Z" fill="#2A8BD0"/>
  <rect x="-40" y="-50" width="84" height="50" fill="#E8C98E"/>
  ${[-30, 30].map(cx => `<path d="M${cx - 6} -16 V-30 Q${cx} -38 ${cx + 6} -30 V-16Z" fill="#B8894E"/><path d="M${cx - 6} -40 V-46 h12 V-40Z" fill="#1E6FB8" opacity=".85"/>`).join('')}
  <rect x="-18" y="-74" width="36" height="74" fill="#E3BE7E"/><rect x="-15" y="-71" width="30" height="68" fill="#1E6FB8"/>
  ${[-63, -56, -49, -42, -35, -28, -21, -14, -7].map(yy => `<circle cx="-12.5" cy="${yy}" r="1.3" fill="#F5C23A"/><circle cx="12.5" cy="${yy}" r="1.3" fill="#F5C23A"/>`).join('')}
  <path d="M-10 0 V-36 Q0 -58 10 -36 V0Z" fill="#6E4524"/><path d="M-6 0 V-30 Q0 -42 6 -30 V0Z" fill="#4E2F18"/></g>`;
const choynak = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M8 -10 Q16 -12 18 -20" stroke="#1E6FB8" stroke-width="3" fill="none" stroke-linecap="round"/>
  <path d="M-10 -8 Q-17 -14 -10 -18" stroke="#1E6FB8" stroke-width="2.4" fill="none"/><ellipse cx="0" cy="-9" rx="10" ry="9" fill="#1E6FB8"/>${[[-4, -11], [3, -6], [4, -13], [-3, -4]].map(([cx, cy]) => `<circle cx="${cx}" cy="${cy}" r="1.6" fill="#fff"/>`).join('')}
  <rect x="-5" y="-20" width="10" height="3" rx="1.5" fill="#1E6FB8"/><circle cx="0" cy="-21.5" r="1.8" fill="#F5C23A"/></g>`;
const piyola = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-6 -6 Q-5 0 0 0 Q5 0 6 -6Z" fill="#fff" stroke="#1E6FB8" stroke-width="1.2"/><path d="M-5 -4.6 h10" stroke="#1E6FB8" stroke-width="1"/></g>`;
const nonBread = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="-3" rx="11" ry="4.5" fill="#C47A33"/><ellipse cx="0" cy="-4" rx="11" ry="4.5" fill="#D98C3E"/><ellipse cx="0" cy="-4" rx="6" ry="2.4" fill="#EDBB76"/></g>`;
const tapchan = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">
  ${[-38, -12, 12, 36].map(lx => `<rect x="${lx - 2}" y="-14" width="4" height="14" fill="#6E4524"/>`).join('')}<rect x="-44" y="-20" width="88" height="7" fill="#8A5A2E"/>
  ${[-40, -26, -12, 2, 16, 30].map(px => `<rect x="${px}" y="-34" width="8" height="14" fill="none" stroke="#8A5A2E" stroke-width="2"/>`).join('')}
  <rect x="-42" y="-24" width="84" height="5" fill="#B0302A"/><path d="M-40 -21.5 h80" stroke="#F5C23A" stroke-width="1.2" stroke-dasharray="3 3"/>
  <rect x="-18" y="-30" width="36" height="6" rx="1.5" fill="#A0662F"/>${choynak(-6, -30, .9)}${piyola(8, -30, .9)}${piyola(-26, -24, .8)}${nonBread(26, -24, .8)}</g>`;
const melonPile = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">${[[-24, -8], [0, -8], [24, -8], [-12, -22], [12, -22], [0, -36]].map(([mx, my], i) => `<ellipse cx="${mx}" cy="${my}" rx="13" ry="8" fill="${i % 2 ? '#F5CF4E' : '#E8B830'}"/><path d="M${mx - 8} ${my - 3} q8 -4 16 0" stroke="#fff" stroke-width="1.6" fill="none" opacity=".5"/>`).join('')}</g>`;
const blueDome = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-44" y="-22" width="88" height="22" fill="#E8C98E"/>${[-30, -10, 10, 30].map(ax => `<path d="M${ax - 5} 0 V-10 Q${ax} -17 ${ax + 5} -10 V0Z" fill="#8B6239"/>`).join('')}
  <path d="M-46 -22 Q0 -86 46 -22Z" fill="#2A8BD0"/>${[-30, -15, 0, 15, 30].map(dx => `<path d="M${dx} -24 Q${dx * .7} -46 0 -54" stroke="#6FC0F0" stroke-width="1.8" fill="none"/>`).join('')}<rect x="-46" y="-26" width="92" height="5" fill="#1E6FB8"/></g>`;
const mountains = (y = 112) => `<path d="M0 ${y} L40 ${y - 30} L70 ${y - 14} L110 ${y - 44} L150 ${y - 18} L196 ${y - 50} L240 ${y - 20} L280 ${y - 40} L320 ${y - 16} L360 ${y - 34} L360 ${y + 20} L0 ${y + 20}Z" fill="#A9B8CE"/>
  <path d="M100 ${y - 38} L110 ${y - 44} L122 ${y - 36} L114 ${y - 34}Z M186 ${y - 43} L196 ${y - 50} L208 ${y - 41} L198 ${y - 39}Z M272 ${y - 35} L280 ${y - 40} L290 ${y - 33} L282 ${y - 31}Z" fill="#fff"/>`;
// ---- weather and town pieces shared by the later units
const rainOverlay = (n = 46) => `<g opacity=".75">${Array.from({ length: n }, (_, i) => { const x = (i * 53) % 360, y = 10 + (i * 37) % 170; return `<path class="s-fall" style="animation-delay:${-((i * .17) % 1.1).toFixed(2)}s" d="M${x} ${y} l-3 9" stroke="#8FB8DE" stroke-width="2" stroke-linecap="round"/>`; }).join('')}</g>`;
const snowOverlay = (n = 40) => `<g>${Array.from({ length: n }, (_, i) => { const x = (i * 61) % 360, y = 8 + (i * 29) % 176; return `<circle class="s-fall snow" style="animation-delay:${-((i * .37) % 4.5).toFixed(2)}s" cx="${x}" cy="${y}" r="${1.6 + (i % 3) * .7}" fill="#fff"/>`; }).join('')}</g>`;
const rainCloud = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><circle cx="-14" cy="0" r="11" fill="#AEB8C8"/><circle cx="2" cy="-7" r="14" fill="#AEB8C8"/><circle cx="17" cy="1" r="10" fill="#AEB8C8"/><rect x="-25" y="0" width="52" height="11" rx="5.5" fill="#AEB8C8"/>${[-12, 0, 12].map((dx, i) => `<path class="s-fall" style="animation-delay:${-i * .35}s" d="M${dx} 16 l-2 6" stroke="#6FA8DC" stroke-width="2.2" stroke-linecap="round"/>`).join('')}</g>`;
const umbrella = (x, y, s = 1, c = '#E5484D') => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0 V-30" stroke="#3E4A5C" stroke-width="2.4"/><path d="M0 0 q0 5 -5 5" stroke="#3E4A5C" stroke-width="2.4" fill="none"/><path d="M-24 -28 Q0 -52 24 -28 Q18 -32 12 -28 Q6 -32 0 -28 Q-6 -32 -12 -28 Q-18 -32 -24 -28Z" fill="${c}"/></g>`;
const pharmacySign = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-2.5" y="-46" width="5" height="46" fill="#7D8496"/><rect x="-14" y="-72" width="28" height="28" rx="5" fill="#3AAE5A"/><path d="M0 -66 v16 M-8 -58 h16" stroke="#fff" stroke-width="5" stroke-linecap="round"/></g>`;
const snowman = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><circle cx="0" cy="-14" r="14" fill="#fff"/><circle cx="0" cy="-36" r="10" fill="#fff"/><circle cx="-3.5" cy="-38" r="1.4" fill="#2b2230"/><circle cx="3.5" cy="-38" r="1.4" fill="#2b2230"/><path d="M0 -35 l7 2 l-7 1.4z" fill="#E8891C"/><path d="M-9 -28 Q0 -24 9 -28 L9 -25 Q0 -21 -9 -25Z" fill="#E5484D"/></g>`;
// ---- faith around you
const dagoba = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">
  <rect x="-34" y="-8" width="68" height="8" fill="#E6E1D6"/><rect x="-28" y="-15" width="56" height="7" fill="#F1EDE4"/>
  <path d="M-27 -15 C-30 -46 -14 -58 0 -58 C14 -58 30 -46 27 -15Z" fill="#FBFAF6"/><path d="M-27 -15 C-30 -46 -14 -58 0 -58 C-9 -51 -18 -37 -16 -15Z" fill="#ECE8DE"/>
  <rect x="-7" y="-67" width="14" height="9" fill="#F1EDE4"/><path d="M-5 -67 L0 -92 L5 -67Z" fill="#F5B731"/><circle cx="0" cy="-93" r="2.4" fill="#C98A0C"/></g>`;
const boTree = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-5 0 C-4 -16 -6 -26 -2 -36 L2 -36 C6 -26 4 -16 5 0Z" fill="#7A4A2A"/>
  <ellipse cx="0" cy="-52" rx="30" ry="22" fill="#3E9150"/><ellipse cx="-16" cy="-44" rx="16" ry="12" fill="#4EA35D"/><ellipse cx="16" cy="-46" rx="16" ry="12" fill="#4EA35D"/>
  ${[[-18, -56], [0, -66], [16, -58], [-6, -46], [10, -42]].map(([lx, ly]) => `<path d="M${lx} ${ly} c-4 -2 -4 -8 0 -9 c4 1 4 7 0 9z" fill="#6CCB86"/>`).join('')}
  <path d="M-30 -22 Q0 -30 30 -22" stroke="#999" stroke-width=".8" fill="none"/>${['#1F6FD6', '#F5C518', '#D7263D', '#FFFFFF', '#F28C28', '#1F6FD6', '#F5C518'].map((c, i) => `<rect x="${-28 + i * 8}" y="${-25 + Math.abs(i - 3) * .6}" width="6" height="7" fill="${c}"/>`).join('')}</g>`;
const kudu = (x, y, s = 1, d = 0) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 -14 V0" stroke="#888" stroke-width="1"/>
  <g class="s-swing" style="animation-delay:${d}s"><path d="M0 0 L12 8 L12 20 L0 28 L-12 20 L-12 8Z" fill="#FFE07A"/><path d="M0 0 L12 8 L0 14 L-12 8Z" fill="#FF9F43"/><circle cx="0" cy="14" r="10" fill="#FFF3B0" opacity=".45"/>
  ${[-6, 0, 6].map((dx, i) => `<path d="M${dx} 26 q${i % 2 ? 2 : -2} 6 0 12" stroke="${['#E5484D', '#1E9FE3', '#3AAE5A'][i]}" stroke-width="1.6" fill="none"/>`).join('')}</g></g>`;
const moon = (x, y, r, full = true) => full
  ? `<circle cx="${x}" cy="${y}" r="${r * 1.7}" fill="#FFF2B8" opacity=".18"/><circle cx="${x}" cy="${y}" r="${r}" fill="#FFF4C7"/><circle cx="${x - r * .3}" cy="${y - r * .2}" r="${r * .16}" fill="#EFE0A0"/>`
  : `<path d="M${x} ${y - r} a${r} ${r} 0 1 0 ${r * .55} ${r * 1.84} a${r * .78} ${r * .78} 0 1 1 ${-r * .55} ${-r * 1.84}z" fill="#FFE07A"/>`;
const stars = (pts) => pts.map(([sx, sy], i) => `<circle class="s-twinkle" style="animation-delay:${(i % 5) * .4}s" cx="${sx}" cy="${sy}" r="1.3" fill="#fff"/>`).join('');
const mosque = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">
  <path d="M-58 0 L-48 0 L-50 -92 L-56 -92Z" fill="#E6D3A8"/><rect x="-59" y="-60" width="12" height="4" fill="#1E6FB8"/><rect x="-59" y="-100" width="12" height="8" fill="#E6D3A8"/><path d="M-59 -100 Q-53 -112 -47 -100Z" fill="#2A8BD0"/>
  <path d="M-55 -114 a3.6 3.6 0 1 0 2.2 -5.4 a2.8 2.8 0 1 1 -2.2 5.4z" fill="#F5B731"/>
  <rect x="-40" y="-40" width="86" height="40" fill="#F1E3C2"/><path d="M-28 -40 C-30 -78 32 -78 30 -40Z" fill="#2A8BD0"/>${[-16, 1, 18].map(dx => `<path d="M${dx} -40 Q${dx * .6} -60 1 -69" stroke="#6FC0F0" stroke-width="1.8" fill="none"/>`).join('')}
  <path d="M1 -69 V-78" stroke="#F5B731" stroke-width="2.2"/><path d="M-1 -80 a3.4 3.4 0 1 0 2 -5 a2.6 2.6 0 1 1 -2 5z" fill="#F5B731"/>
  <path d="M-8 0 V-20 Q1 -32 10 -20 V0Z" fill="#1E6FB8"/>${[-28, 32].map(ax => `<path d="M${ax - 5} -12 V-22 Q${ax} -29 ${ax + 5} -22 V-12Z" fill="#1E6FB8" opacity=".75"/>`).join('')}</g>`;
const sun = (x, y, r = 14) => `<g transform="translate(${x} ${y})"><circle r="${r}" fill="#FFC94D"/>${Array.from({ length: 8 }, (_, i) => `<path d="M0 -${r + 4} v-6" stroke="#FFC94D" stroke-width="3" stroke-linecap="round" transform="rotate(${i * 45})"/>`).join('')}</g>`;
const cloud = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})" opacity=".9"><ellipse cx="0" cy="0" rx="18" ry="10" fill="#fff"/><ellipse cx="14" cy="-6" rx="12" ry="10" fill="#fff"/><ellipse cx="-12" cy="-4" rx="10" ry="8" fill="#fff"/></g>`;

const verandahHouse = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-40" y="-40" width="80" height="40" fill="#FFF3DC"/><path d="M-52 -38 L0 -68 L52 -38Z" fill="#C0533A"/><path d="M-52 -38 H52" stroke="#9E3F2A" stroke-width="3"/>
  <rect x="-7" y="-28" width="14" height="28" fill="#7A4A2A"/><rect x="-31" y="-28" width="13" height="12" fill="#BFE6FA" stroke="#7A4A2A" stroke-width="2"/><rect x="18" y="-28" width="13" height="12" fill="#BFE6FA" stroke="#7A4A2A" stroke-width="2"/>
  ${[-45, -13, 13, 45].map(px => `<rect x="${px - 2.5}" y="-38" width="5" height="38" fill="#fff" stroke="#E4DCCB" stroke-width="1"/>`).join('')}<rect x="-50" y="-2" width="100" height="4" fill="#D8C9A8"/></g>`;
const train = (x, y, s = 1, cars = 3) => `<g transform="translate(${x} ${y}) scale(${s})">${Array.from({ length: cars }, (_, i) => `<g transform="translate(${-i * 62} 0)"><rect x="-58" y="-34" width="56" height="30" rx="5" fill="${i ? '#1F4E8C' : '#C0392B'}"/><rect x="-58" y="-34" width="56" height="5" rx="2" fill="${i ? '#173C6B' : '#962D22'}"/>${[-52, -38, -24].map(wx => `<rect x="${wx}" y="-26" width="10" height="9" rx="1.5" fill="#BFE6FA"/>`).join('')}<circle cx="-46" cy="-3" r="4.4" fill="#2b2230"/><circle cx="-14" cy="-3" r="4.4" fill="#2b2230"/></g>`).join('')}<path d="M-2 -32 Q8 -30 8 -18 L8 -6 L-2 -6Z" fill="#C0392B"/><circle cx="4" cy="-14" r="2.6" fill="#FFE08A"/></g>`;
const kandyTemple = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-46" y="-20" width="92" height="20" fill="#FBF7EE"/><path d="M-50 -20 L-40 -30 L40 -30 L50 -20Z" fill="#B5502F"/>${[-36, -24, 24, 36].map(wx => `<rect x="${wx - 3}" y="-15" width="6" height="9" rx="3" fill="#7A4A2A"/>`).join('')}
  <path d="M-14 -20 L-14 -48 L-8 -54 L8 -54 L14 -48 L14 -20Z" fill="#FBF7EE"/><path d="M-18 -52 L0 -66 L18 -52Z" fill="#B5502F"/><path d="M-14 -40 H14" stroke="#E4DCCB" stroke-width="1.4"/>${[-8, 0, 8].map(wx => `<rect x="${wx - 2}" y="-36" width="4" height="7" rx="2" fill="#7A4A2A"/>`).join('')}</g>`;
// Jaffna: palmyra palms (straight trunks, fan-leaf crowns) and a kovil gopuram.
const palmyra = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-2.6 0 L-2 -70 L2 -70 L2.6 0Z" fill="#5B4636"/>${[-60, -44, -28].map(h => `<path d="M-2.6 ${h} h5.2" stroke="#3E2F24" stroke-width="1"/>`).join('')}
  <g class="s-sway" style="transform-origin:0 -70px">${Array.from({ length: 11 }, (_, i) => { const a = (-175 + i * 17) * Math.PI / 180; return `<path d="M0 -70 L${(Math.cos(a) * 20).toFixed(1)} ${(-70 + Math.sin(a) * 20).toFixed(1)}" stroke="${i % 2 ? '#2E7D32' : '#3C9A43'}" stroke-width="6" stroke-linecap="round"/>`; }).join('')}
  <circle cx="-3" cy="-66" r="3" fill="#3a2a1d"/><circle cx="3" cy="-65" r="3" fill="#3a2a1d"/><circle cx="0" cy="-63" r="3" fill="#2a1f15"/></g></g>`;
const kovilTower = (x, y, s = 1, gold = false) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-26" y="-16" width="52" height="16" fill="${gold ? '#F2C14E' : '#F2D28B'}" stroke="#B5803A" stroke-width="1.2"/><path d="M-7 0 V-10 Q0 -17 7 -10 V0Z" fill="#6b3a16"/>
  ${[0, 1, 2, 3, 4, 5].map(i => { const w = 48 - i * 7, yy = -16 - i * 12; return `<rect x="${-w / 2}" y="${yy - 12}" width="${w}" height="12" fill="${gold ? (i % 2 ? '#E6B43C' : '#F2C14E') : (i % 2 ? '#E8C27A' : '#F2D28B')}" stroke="#B5803A" stroke-width="1.2"/>${Array.from({ length: Math.max(1, 5 - i) }, (_, k) => `<rect x="${(-w / 2 + (k + .5) * w / Math.max(1, 5 - i) - 2).toFixed(1)}" y="${yy - 9}" width="4" height="7" rx="2" fill="#9A6A2E" opacity=".7"/>`).join('')}`; }).join('')}
  <path d="M-13 -88 Q0 -100 13 -88Z" fill="${gold ? '#F2C14E' : '#E8C27A'}" stroke="#B5803A" stroke-width="1.2"/>${[-7, 0, 7].map(dx => `<path d="M${dx} -94 v-6" stroke="#C98A0C" stroke-width="2"/><circle cx="${dx}" cy="-101" r="2" fill="#C98A0C"/>`).join('')}</g>`;
const stripeWall = (x1, x2, y, h) => `<rect x="${x1}" y="${y - h}" width="${x2 - x1}" height="${h}" fill="#FBF7EE"/>${Array.from({ length: Math.floor((x2 - x1) / 10) }, (_, i) => `<rect x="${x1 + 3 + i * 10}" y="${y - h}" width="5" height="${h}" fill="#C0392B"/>`).join('')}<rect x="${x1 - 2}" y="${y - h - 4}" width="${x2 - x1 + 4}" height="5" fill="#E8C27A"/>`;
// A Sri Lankan coastal mosque: white walls, green domes, two slim minarets with crescents.
const lankaMosque = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">
  ${[-50, 50].map(mx => `<rect x="${mx - 5}" y="-92" width="10" height="92" fill="#FBF9F4" stroke="#E2DCCF" stroke-width="1.2"/><rect x="${mx - 7}" y="-70" width="14" height="4" fill="#2E8B57"/><rect x="${mx - 7}" y="-96" width="14" height="5" fill="#FBF9F4" stroke="#E2DCCF" stroke-width="1.2"/><path d="M${mx - 6} -96 Q${mx} -110 ${mx + 6} -96Z" fill="#2E8B57"/><path d="M${mx - 1.5} -112 a3.4 3.4 0 1 0 2 -5 a2.6 2.6 0 1 1 -2 5z" fill="#F5B731"/>`).join('')}
  <rect x="-40" y="-42" width="80" height="42" fill="#FBF9F4" stroke="#E2DCCF" stroke-width="1.2"/><path d="M-42 -42 H42 V-46 H-42Z" fill="#2E8B57"/>
  <path d="M-24 -46 C-26 -80 26 -80 24 -46Z" fill="#2E8B57"/><path d="M-24 -46 C-25 -70 -8 -78 0 -78 C-10 -72 -16 -60 -16 -46Z" fill="#3FA56A"/><path d="M0 -78 V-86" stroke="#F5B731" stroke-width="2"/><path d="M-1.5 -88 a3.4 3.4 0 1 0 2 -5 a2.6 2.6 0 1 1 -2 5z" fill="#F5B731"/>
  ${[-28, 28].map(ax => `<path d="M${ax - 6} -12 V-26 Q${ax} -34 ${ax + 6} -26 V-12Z" fill="#2E8B57" opacity=".8"/>`).join('')}<path d="M-9 0 V-22 Q0 -34 9 -22 V0Z" fill="#256F46"/></g>`;
// Fergana Valley: a grapevine arbour over the courtyard, Sulaiman-Too (the rock in the middle of Osh,
// with Babur's little house on top) and a Наврўз cauldron of сумалак.
const vineArbor = (x, y, w, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">${[0, w].map(px => `<rect x="${px - 2.5}" y="-62" width="5" height="62" fill="#7A4A2A"/>`).join('')}<path d="M-6 -62 H${w + 6}" stroke="#7A4A2A" stroke-width="4"/>
  ${Array.from({ length: Math.ceil(w / 11) + 2 }, (_, i) => `<ellipse cx="${-6 + i * 11}" cy="${-64 + (i % 2) * 5}" rx="9" ry="7" fill="${i % 3 ? '#4E9A3C' : '#3C8A2E'}"/>`).join('')}
  ${Array.from({ length: Math.floor(w / 26) }, (_, i) => `<g transform="translate(${14 + i * 26} -56)">${[[0, 0], [-3, 4], [3, 4], [0, 8], [-2, 12], [2, 12]].map(([dx, dy]) => `<circle cx="${dx}" cy="${dy}" r="2.6" fill="#7E3F8F"/>`).join('')}</g>`).join('')}</g>`;
const sulaimanToo = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-110 0 L-80 -26 L-58 -30 L-40 -58 L-20 -64 L-4 -84 L14 -80 L30 -60 L52 -54 L70 -34 L96 -24 L120 0Z" fill="#9C8A7A"/><path d="M-40 -58 L-28 -40 L-44 -34 M-4 -84 L6 -56 L-8 -48 M30 -60 L36 -40" stroke="#7F6E60" stroke-width="2" fill="none"/>
  <g transform="translate(-4 -84)"><rect x="-7" y="-10" width="14" height="10" fill="#F3E6CF"/><path d="M-8 -10 Q0 -20 8 -10Z" fill="#6E9E9E"/><rect x="-2" y="-6" width="4" height="6" fill="#7A4A2A"/></g></g>`;
const kazan = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-22 -6 L-26 4 M22 -6 L26 4" stroke="#55555F" stroke-width="3"/><g class="s-flicker">${[-10, 0, 10].map((fx, i) => `<path d="M${fx} 2 C${fx - 6} -6 ${fx - 2} -14 ${fx} -18 C${fx + 2} -12 ${fx + 7} -6 ${fx} 2Z" fill="${i === 1 ? '#FFC94D' : '#F39C12'}"/>`).join('')}</g>
  <path d="M-26 -30 Q-26 -8 0 -8 Q26 -8 26 -30Z" fill="#3A3A44"/><ellipse cx="0" cy="-30" rx="27" ry="6" fill="#2A2A32"/><ellipse cx="0" cy="-30" rx="23" ry="4.4" fill="#7A4A2A"/><path d="M8 -32 L30 -66" stroke="#A0703F" stroke-width="4" stroke-linecap="round"/></g>`;
const tulipS = (x, y, s, c) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0 V-18" stroke="#3C8A2E" stroke-width="2.4"/><path d="M0 -6 Q-8 -10 -9 -18 Q-3 -15 0 -9" fill="#4E9A3C"/><path d="M-5 -28 Q-6 -20 0 -17 Q6 -20 5 -28 L2.5 -24 L0 -30 L-2.5 -24Z" fill="${c}"/></g>`;
const blossomTree = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-3 0 L-2 -30 L2 -30 L3 0Z" fill="#7A4A2A"/><path d="M0 -24 L-12 -36 M0 -28 L10 -40" stroke="#7A4A2A" stroke-width="2.4"/>${[[-14, -40, 12], [0, -48, 15], [14, -40, 12], [-6, -34, 10], [8, -32, 10]].map(([cx, cy, r]) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#F8C8D8"/>`).join('')}${Array.from({ length: 9 }, (_, i) => `<circle cx="${-16 + (i * 13) % 32}" cy="${-52 + (i * 7) % 22}" r="2" fill="#E57FA0"/>`).join('')}</g>`;
// Kenya: flat-topped acacias, a giraffe, Mount Kenya, iron-roofed (mabati) homes, a matatu, a chai kiosk,
// a market stall and a Nairobi skyline with a round tower.
const acacia = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-3 0 L-2 -40 L2 -40 L3 0Z" fill="#6B4A2E"/><path d="M0 -30 L-16 -46 M0 -34 L14 -48" stroke="#6B4A2E" stroke-width="3"/><ellipse cx="0" cy="-50" rx="34" ry="8" fill="#5B8C32"/><ellipse cx="-6" cy="-54" rx="24" ry="6" fill="#6FA33E"/></g>`;
const giraffe = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">${[-12, -6, 8, 14].map(lx => `<rect x="${lx - 1.6}" y="-24" width="3.2" height="24" fill="#D9A441"/>`).join('')}<ellipse cx="0" cy="-28" rx="18" ry="9" fill="#E8B54F"/><path d="M12 -32 L22 -70 L28 -68 L20 -30Z" fill="#E8B54F"/><ellipse cx="27" cy="-72" rx="7" ry="4.4" fill="#E8B54F"/><path d="M24 -76 v-5 M28 -76 v-5" stroke="#8A5A2B" stroke-width="1.6"/>
  ${[[-8, -30], [2, -26], [8, -32], [-2, -33], [17, -44], [19, -56], [-12, -26]].map(([sx, sy]) => `<circle cx="${sx}" cy="${sy}" r="2.6" fill="#A0662F"/>`).join('')}</g>`;
const mtKenya = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-90 0 L-30 -40 L-10 -62 L0 -54 L10 -70 L22 -50 L40 -38 L100 0Z" fill="#8FA3B8"/><path d="M-16 -56 L-10 -62 L0 -54 L10 -70 L22 -50 L14 -48 L8 -54 L2 -46 L-6 -52Z" fill="#fff"/></g>`;
const mabati = (x, y, s = 1, wall = '#E9D8B4', door = '#2E86C1') => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-30" y="-30" width="60" height="30" fill="${wall}"/><path d="M-36 -30 L-30 -48 H30 L36 -30Z" fill="#9AA5B4"/>${[-28, -20, -12, -4, 4, 12, 20, 28].map(rx => `<path d="M${rx} -47 L${rx * 1.1} -31" stroke="#7D8796" stroke-width="1.4"/>`).join('')}<rect x="-6" y="-20" width="12" height="20" fill="${door}"/><rect x="-24" y="-22" width="12" height="10" fill="#7FB3D5" stroke="#8A5A2B" stroke-width="1.5"/><rect x="12" y="-22" width="12" height="10" fill="#7FB3D5" stroke="#8A5A2B" stroke-width="1.5"/></g>`;
const matatu = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-44 -6 V-34 Q-44 -40 -38 -40 H30 Q40 -40 44 -28 L48 -16 V-6Z" fill="#F4D03F"/><path d="M-44 -18 H48" stroke="#8E44AD" stroke-width="5"/><path d="M-44 -24 H48" stroke="#E74C3C" stroke-width="3"/>${[-36, -20, -4, 12].map(wx => `<rect x="${wx}" y="-36" width="12" height="9" rx="1.5" fill="#AED6F1"/>`).join('')}<path d="M28 -36 H36 Q42 -34 44 -28 H28Z" fill="#AED6F1"/>${[-28, 30].map(wx => `<circle cx="${wx}" cy="-4" r="7" fill="#2C3E50"/><circle cx="${wx}" cy="-4" r="3" fill="#BDC3C7"/>`).join('')}</g>`;
const kiosk = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-34" y="-42" width="68" height="42" fill="#2E86C1"/><rect x="-28" y="-34" width="56" height="20" fill="#5D3B1A"/><rect x="-36" y="-14" width="72" height="5" fill="#A0703F"/>${Array.from({ length: 6 }, (_, i) => `<path d="M${-36 + i * 12} -50 h12 v8 q-6 5 -12 0Z" fill="${i % 2 ? '#fff' : '#C0392B'}"/>`).join('')}<rect x="-38" y="-54" width="76" height="5" rx="2" fill="#922B21"/>
  <rect x="-16" y="-64" width="32" height="10" rx="2" fill="#fff"/><text x="0" y="-56.5" text-anchor="middle" font-size="8" font-weight="900" font-family="Nunito, sans-serif" fill="#922B21">CHAI</text><rect x="-24" y="-28" width="7" height="13" rx="2" fill="#C0392B"/><path d="M4 -18 L10 -28 L16 -18Z" fill="#D4913F"/><path d="M12 -18 L18 -27 L24 -18Z" fill="#D4913F"/></g>`;
const kenyaStall = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-40" y="-26" width="80" height="26" fill="#A0703F"/>${[-36, 36].map(px => `<rect x="${px - 2}" y="-62" width="4" height="40" fill="#7A4A2A"/>`).join('')}<path d="M-46 -62 H46 L40 -52 H-40Z" fill="#1E8449"/>
  ${[[-28, -30, '#F5B041', 6], [-16, -31, '#E67E22', 6], [-4, -30, '#C0392B', 5], [8, -30, '#C0392B', 5], [20, -31, '#7DCEA0', 6], [32, -30, '#F4D03F', 5]].map(([fx, fy, c, r]) => `<circle cx="${fx}" cy="${fy}" r="${r}" fill="${c}"/>`).join('')}<path d="M-30 -36 Q-20 -44 -10 -36" stroke="#F4D03F" stroke-width="5" fill="none" stroke-linecap="round"/></g>`;
const nairobi = (y = 120) => `${[[20, 54, 22], [46, 36, 18], [140, 44, 20], [168, 30, 22], [250, 40, 20], [292, 50, 24], [326, 34, 18]].map(([bx, h, w]) => `<rect x="${bx}" y="${y - h - 30}" width="${w}" height="${h + 30}" fill="#B9C7D6"/>${Array.from({ length: Math.floor((h + 24) / 10) }, (_, r) => `<rect x="${bx + 3}" y="${y - h - 26 + r * 10}" width="${w - 6}" height="4" fill="#E3ECF4"/>`).join('')}`).join('')}
  <rect x="200" y="${y - 96}" width="22" height="96" rx="10" fill="#C8A27A"/><ellipse cx="211" cy="${y - 98}" rx="16" ry="5" fill="#A9825A"/>${Array.from({ length: 8 }, (_, r) => `<path d="M202 ${y - 88 + r * 10} H220" stroke="#A9825A" stroke-width="2"/>`).join('')}`;
const bananaPlant = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-3 0 L-2 -40 L2 -40 L3 0Z" fill="#7DA453"/>${[[-1, -40, -26, -30], [1, -40, 26, -32], [0, -42, -16, -58], [0, -42, 18, -56]].map(([x1, y1, x2, y2]) => `<path d="M${x1} ${y1} Q${(x1 + x2) / 2} ${y2 - 10} ${x2} ${y2}" stroke="#4E9A3C" stroke-width="8" fill="none" stroke-linecap="round"/>`).join('')}</g>`;
const SCENES = {
  u1: { who: 'aliya', art: () => `${palm(26, 150, .95)}${palm(160, 150, .8, true)}${sun(150, 26)}${cloud(48, 34, .9)}` },
  u2: { who: 'kumari', art: () => `${sigiriya(96, 150, .9)}${palm(18, 150, .8)}${cloud(150, 30)}` },
  u3: { who: 'nimal', art: () => `${teaBushes(96, 150, 1)}${sun(32, 30, 12)}${cloud(150, 40, .8)}` },
  u4: { who: 'john', art: () => `${fruitStall(60, 150, .95)}${tuktuk(150, 150, .7)}${cloud(40, 28, .8)}` },
  u5: { who: 'amma', art: () => `${smallHouse(70, 150, 1)}${palm(160, 150, .8, true)}${sun(30, 30, 12)}${cloud(140, 28, .8)}` },
  u6: { who: 'john', art: () => `<path d="M0 150 H190" stroke="#9AA0AE" stroke-width="10"/>${roadSign(30, 150)}${tuktuk(130, 146, .72)}${cloud(60, 30, .9)}` },
  u7: { who: 'duva', art: () => `${palm(28, 150, .85)}${kite(140, 40)}${sun(60, 28, 11)}${cloud(150, 70, .7)}` },
  u8: { who: 'nimal', art: () => `${smallChurch(120, 150, .9)}${palm(24, 150, .8)}${sun(40, 28, 11)}${cloud(150, 26, .7)}` },
  uzmahalla: { who: 'aliya', art: () => `${poplar(14, 150, .85)}${poplar(30, 150, .7)}${uzHouse(166, 150, .66)}${sun(160, 26, 12)}${cloud(64, 30, .8)}` },
  uzregistan: { who: 'kumari', art: () => `${madrasa(160, 150, .6)}${poplar(22, 150, .85)}${sun(40, 28, 11)}${cloud(96, 22, .7)}` },
  uzchoyxona: { who: 'nimal', art: () => `${tapchan(160, 150, .62)}${roundTree(28, 150, .9)}${sun(166, 26, 11)}${cloud(84, 26, .7)}` },
  uzbazaar: { who: 'john', art: () => `${melonPile(36, 150, .95)}${blueDome(162, 150, .5)}${cloud(80, 24, .8)}` },
  esroad: { who: 'john', art: () => `<path d="M0 150 H190" stroke="#9AA0AE" stroke-width="10"/>${roadSign(30, 150)}${taxi(132, 146, .62)}${cloud(60, 30, .9)}` },
  esweather: { who: 'kumari', art: () => `${rainCloud(44, 40, 1)}${umbrella(160, 150, 1.3)}${cloud(150, 26, .6)}` },
  eshealth: { who: 'nimal', art: () => `${smallHouse(160, 150, .66)}${pharmacySign(30, 150, 1)}${sun(156, 26, 10)}` },
  uzfamily: { who: 'amma', art: () => `${uzHouse(164, 150, .66)}${roundTree(26, 150, .85)}${sun(160, 24, 11)}${cloud(84, 26, .7)}` },
  uzroad: { who: 'john', art: () => `<path d="M0 150 H190" stroke="#9AA0AE" stroke-width="10"/>${roadSign(30, 150)}${taxi(134, 146, .62, '#F4F4F2')}${poplar(178, 150, .6)}${cloud(70, 30, .8)}` },
  uzdaily: { who: 'duva', art: () => `${poplar(16, 150, .85)}${poplar(32, 150, .7)}${kite(150, 40)}${sun(70, 26, 11)}${cloud(160, 70, .7)}` },
  uzweather: { who: 'kumari', art: () => `${snowman(162, 150, 1.1)}${poplar(22, 150, .8)}${cloud(90, 28, .8)}${[[40, 30], [120, 50], [170, 30], [70, 70], [150, 90]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.4" fill="#fff" stroke="#D8E2EC" stroke-width=".8"/>`).join('')}` },
  uzchurch: { who: 'nimal', art: () => `${smallChurch(160, 150, .72)}${poplar(22, 150, .85)}${sun(40, 28, 11)}${cloud(110, 24, .7)}` },
  uzhealth: { who: 'nimal', art: () => `${uzHouse(164, 150, .62)}${pharmacySign(30, 150, 1)}${poplar(186, 150, .5)}${sun(160, 24, 10)}` },
  u9: { who: 'aliya', art: () => `${dagoba(160, 150, .62)}${boTree(30, 150, .9)}${sun(96, 24, 11)}` },
  u10: { who: 'kumari', art: () => `${rainCloud(44, 40, 1)}${sun(150, 26, 11)}${umbrella(160, 150, 1.3, '#1E9FE3')}${[[30, 66], [52, 74], [40, 90]].map(([x, y]) => `<path d="M${x} ${y} q-3 4.5 0 7 q3 -2.5 0 -7z" fill="#1E9FE3"/>`).join('')}` },
  u11: { who: 'amma', art: () => `${verandahHouse(160, 150, .6)}${palm(22, 150, .8)}${sun(170, 24, 10)}${cloud(80, 26, .7)}` },
  u12: { who: 'nimal', art: () => `${pharmacySign(30, 150, 1)}${smallHouse(160, 150, .66)}${sun(40, 26, 10)}${cloud(120, 24, .7)}` },
  u13: { who: 'john', art: () => `<path d="M0 150 L0 108 L30 88 L56 104 L90 80 L126 102 L160 84 L190 100 L190 150Z" fill="#9CCF7A" opacity=".7"/>${train(188, 150, .5, 2)}${sun(150, 26, 11)}${cloud(60, 28, .8)}` },
  tau12: { who: 'john', art: () => `<path d="M0 150 L0 116 L190 112 L190 150Z" fill="#E2C590" opacity=".7"/>${palmyra(20, 150, .85)}${palmyra(44, 150, .62)}${train(190, 150, .46, 2)}${sun(160, 24, 10)}${cloud(82, 26, .7)}` },
  tau13: { who: 'ammamma', art: () => `${kovilTower(158, 150, .62, true)}${palmyra(22, 150, .8)}${sun(40, 24, 10)}` },
  tau14: { who: 'fathima', art: () => `${lankaMosque(160, 150, .5)}${palm(22, 150, .62)}${palm(44, 150, .5, true)}${sun(98, 26, 10)}` },
  uzhovli: { who: 'grandma', art: () => `${vineArbor(110, 150, 64, 1)}${tapchan(142, 150, .5)}${uzHouse(40, 150, .5)}${sun(176, 22, 10)}` },
  uzosh: { who: 'john', art: () => `${sulaimanToo(120, 150, .62)}${poplar(18, 150, .8)}${poplar(34, 150, .64)}${sun(170, 20, 10)}${cloud(86, 26, .6)}` },
  uznavruz: { who: 'grandma', art: () => `${blossomTree(40, 150, 1)}${kazan(150, 150, .9)}${tulipS(108, 150, 1, '#E03A3E')}${tulipS(118, 150, .8, '#FFC94D')}${tulipS(178, 150, .9, '#E03A3E')}${sun(176, 20, 9)}` },
  swsavanna: { who: 'nimal', art: () => `${mtKenya(110, 150, .9)}${acacia(40, 150, .9)}${giraffe(150, 150, .7)}${sun(176, 20, 10)}` },
  swtown: { who: 'kumari', art: () => `<rect x="0" y="120" width="200" height="30" fill="#AAB2BE"/>${matatu(130, 146, .8)}${acacia(26, 150, .6)}${sun(176, 20, 10)}${cloud(80, 26, .6)}` },
  swkibanda: { who: 'kumari', art: () => `${kiosk(126, 150, .9)}${acacia(30, 150, .7)}${sun(176, 20, 10)}` },
  swmarket: { who: 'amma', art: () => `${kenyaStall(124, 150, .9)}${sun(176, 20, 10)}${cloud(60, 24, .6)}` },
  swhome: { who: 'grandma', art: () => `${mabati(128, 150, .9)}${acacia(36, 150, .7)}${bananaPlant(178, 150, .8)}${sun(170, 20, 9)}` },
  swchurch: { who: 'nimal', art: () => `${smallChurch(122, 150, .9)}${acacia(30, 150, .7)}${sun(176, 22, 10)}${cloud(70, 24, .6)}` },
  uzmasjid: { who: 'john', art: () => `${mosque(160, 150, .52)}${poplar(20, 150, .8)}${poplar(36, 150, .65)}${sun(96, 24, 11)}` },
  esplaza: { who: 'kumari', art: () => `${colonial(146, 150, .72)}${fountain(30, 150, .72)}${sun(36, 30, 11)}${cloud(96, 24, .7)}` },
  esmarket: { who: 'john', art: () => `${fruitStall(60, 150, .95)}${taxi(150, 150, .62)}${cloud(40, 28, .8)}` },
};
const smallHouse = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-34" y="-40" width="68" height="40" fill="#FFF3DC"/><path d="M-42 -38 L0 -70 L42 -38Z" fill="#C0533A"/><rect x="-9" y="-24" width="18" height="24" rx="2" fill="#7A4A2A"/><rect x="-27" y="-30" width="13" height="12" rx="1.5" fill="#FFD36E"/><rect x="14" y="-30" width="13" height="12" rx="1.5" fill="#FFD36E"/></g>`;
const smallChurch = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-30" y="-40" width="60" height="40" fill="#FBF7EE"/><path d="M-36 -38 L0 -64 L36 -38Z" fill="#C0533A"/><rect x="-9" y="-92" width="18" height="36" fill="#FBF7EE"/><path d="M-12 -92 L0 -104 L12 -92Z" fill="#C0533A"/><path d="M0 -118 V-104 M-5 -112 H5" stroke="#E8B53A" stroke-width="3" stroke-linecap="round"/><path d="M-8 0 V-16 a8 8 0 0 1 16 0 V0Z" fill="#7A4A2A"/><circle cx="0" cy="-48" r="5" fill="#7FB6D9"/></g>`;
const roadSign = (x, y) => `<g transform="translate(${x} ${y})"><rect x="-2.5" y="-44" width="5" height="44" fill="#7D8496"/><circle cx="0" cy="-52" r="15" fill="#1E9FE3" stroke="#fff" stroke-width="2.4"/><path d="M-5 -44 V-52 Q-5 -57 0 -57 H5" stroke="#fff" stroke-width="3.6" fill="none"/><path d="M4 -62 L10 -57 L4 -52Z" fill="#fff"/></g>`;
const kite = (x, y) => `<g transform="translate(${x} ${y})"><g class="s-kite"><path d="M0 -14 L11 0 L0 16 L-11 0Z" fill="#E5484D"/><path d="M0 -14 V16 M-11 0 H11" stroke="#fff" stroke-width="1.4" opacity=".8"/><path d="M0 16 q-4 8 0 14 q4 6 0 12" stroke="#E5484D" stroke-width="1.6" fill="none"/><path d="M0 16 L-40 110" stroke="#fff" stroke-width=".9" opacity=".8"/></g></g>`;

// A scene beside the path: scenery plus a waving character.
const sceneOf = (unitId) => SCENES[UNITS.find(u => u.id === unitId)?.scene || unitId] || SCENES.u1;
export function pathScene(unitId, side = 'left') {
  const sc = sceneOf(unitId);
  return `<div class="path-scene ${side}">
    <svg class="scene-bg" viewBox="0 0 190 160" aria-hidden="true">${sc.art()}</svg>
    <div class="scene-char">${character(castId(sc.who), { size: 74, mood: 'wave' })}</div>
  </div>`;
}

// Bigger version of a unit's scene for the guidebook header.
export function unitHero(unitId) {
  const sc = sceneOf(unitId);
  return `<div class="unit-hero"><svg class="scene-bg" viewBox="0 0 190 160" aria-hidden="true">${sc.art()}</svg><div class="scene-char">${character(castId(sc.who), { size: 92, mood: 'wave' })}</div></div>`;
}

export function castLineup(ids = ['kumari', 'aliya', 'nimal', 'john'], size = 84, mood = '') {
  return `<div class="cast-lineup">${ids.map(id => character(castId(id), { size, mood })).join('')}</div>`;
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

Object.assign(SCENE_ART, {
  // Kumari's living room: family photos, a ceiling fan, palms outside the window.
  st_u5: (id) => `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FCE9C8"/><stop offset="1" stop-color="#F6D9A8"/></linearGradient></defs><rect width="360" height="200" fill="url(#${id})"/>
    <rect x="0" y="0" width="360" height="12" fill="#E9C48A"/><path d="M180 12 V30" stroke="#6A421E" stroke-width="3"/>
    <g transform="translate(180 32)"><g class="s-fan">${[0, 120, 240].map(a => `<ellipse cx="0" cy="-26" rx="7" ry="26" fill="#8B5A2B" transform="rotate(${a})"/>`).join('')}</g><circle r="6" fill="#6A421E"/></g>
    <rect x="22" y="40" width="96" height="78" rx="4" fill="#8B5A2B"/><rect x="28" y="46" width="84" height="66" fill="#BFE6FA"/><path d="M28 96 Q70 80 112 96 V112 H28Z" fill="#86C46A"/>
    ${palm(58, 112, .5)}${palm(96, 112, .4, true)}<path d="M70 46 V112 M28 79 H112" stroke="#8B5A2B" stroke-width="3"/>
    <g transform="translate(262 52)"><g class="s-swing" style="animation-duration:5s"><path d="M0 -14 L-10 0 M0 -14 L10 0" stroke="#6A421E" stroke-width="1.4"/><rect x="-26" y="0" width="52" height="40" rx="3" fill="#C98A4B"/><rect x="-22" y="4" width="44" height="32" fill="#E9F4FB"/>${[-12, -2, 8].map((dx, i) => `<circle cx="${dx}" cy="16" r="4" fill="${['#9C6139', '#B5764C', '#AE6F45'][i]}"/><rect x="${dx - 5}" y="21" width="10" height="13" rx="4" fill="${['#F3F1EA', '#8D153A', '#F5B731'][i]}"/>`).join('')}</g></g>
    <path d="M215 58 V96 M204 70 H226" stroke="#8B5A2B" stroke-width="6" stroke-linecap="round"/>
    <rect x="316" y="70" width="6" height="94" fill="#6A421E"/><path d="M302 70 L336 70 L328 52 L310 52Z" fill="#F5B731"/><ellipse class="s-glow" cx="319" cy="76" rx="22" ry="10" fill="#FFE08A" opacity=".5"/>
    <rect x="0" y="164" width="360" height="36" fill="#C98A4B"/><path d="M0 164 H360" stroke="#A86F3A" stroke-width="3"/>${[40, 120, 200, 280].map(x => `<path d="M${x} 164 L${x - 14} 200" stroke="#B57A42" stroke-width="2"/>`).join('')}
    <path d="M8 172 Q60 150 112 172 L112 186 L8 186Z" fill="#7B61C9"/><rect x="4" y="160" width="14" height="30" rx="6" fill="#6A50B5"/>`,

  // A city street: buses, a road sign, the church spire in the distance.
  st_u6: (id) => `${sky(id, '#9ED8F5', '#FFF2DA')}${spinSun(300, 36, 13)}${drift(80, 34, 1, 50, 6)}${drift(230, 22, .8, 44, 30)}
    <g transform="translate(248 128)"><rect x="-10" y="-64" width="20" height="64" fill="#FBF7EE"/><path d="M-13 -64 L0 -80 L13 -64Z" fill="#C0533A"/><path d="M0 -94 V-80 M-5 -88 H5" stroke="#E8B53A" stroke-width="3" stroke-linecap="round"/></g>
    ${[[0, 80, '#F2C46D'], [56, 64, '#8EC5E0'], [112, 86, '#E58C7A'], [170, 72, '#B7D98A'], [292, 78, '#E58C7A']].map(([x, y, c]) => `<rect x="${x}" y="${y}" width="${x === 292 ? 68 : 54}" height="${128 - y}" fill="${c}"/>${[0, 1].map(r => `<rect x="${x + 8}" y="${y + 10 + r * 20}" width="12" height="12" rx="2" fill="#fff" opacity=".55"/><rect x="${x + 30}" y="${y + 10 + r * 20}" width="12" height="12" rx="2" fill="#fff" opacity=".55"/>`).join('')}`).join('')}
    <rect x="0" y="128" width="360" height="44" fill="#8E95A4"/><path d="M0 150 H360" stroke="#fff" stroke-width="3" stroke-dasharray="18 14" opacity=".8"/>
    <g transform="translate(0 150)"><g class="s-drive">${tuktuk(0, 0, .62)}</g></g>
    <g transform="translate(0 132)"><g class="s-drive" style="animation-duration:19s;animation-delay:-8s"><rect x="-60" y="-34" width="60" height="32" rx="6" fill="#C0392B"/><rect x="-56" y="-30" width="44" height="12" rx="2" fill="#AEDCF0"/><rect x="-60" y="-14" width="60" height="4" fill="#F5B731"/><circle cx="-46" cy="-2" r="5" fill="#222"/><circle cx="-14" cy="-2" r="5" fill="#222"/></g></g>
    <g transform="translate(330 172)"><rect x="-2.5" y="-46" width="5" height="46" fill="#7D8496"/><circle cx="0" cy="-54" r="14" fill="#1E9FE3" stroke="#fff" stroke-width="2.4"/><path d="M-5 -46 V-54 Q-5 -59 0 -59 H5" stroke="#fff" stroke-width="3.4" fill="none"/><path d="M4 -63 L10 -59 L4 -54Z" fill="#fff"/></g>
    <rect x="0" y="172" width="360" height="28" fill="#D9C9A8"/><path d="M0 172 H360" stroke="#C4B08A" stroke-width="2"/>`,

  // Nimal's veranda in the morning, tea on the table, washing on the line.
  st_u7: (id) => `${sky(id, '#FFD9A0', '#FFF4E0')}${spinSun(70, 70, 16, '#FFB84D')}${drift(200, 30, .9, 50, 12)}${bird(250, 50, .9, 1)}${bird(272, 42, .7, 2.2)}
    <path d="M0 120 Q90 100 180 114 Q270 128 360 108 L360 200 L0 200Z" fill="#9CCF7A"/>${palm(30, 160, .7)}
    <path d="M120 60 L360 44 L360 60 L120 74Z" fill="#C0533A"/><rect x="132" y="70" width="6" height="100" fill="#8B5A2B"/><rect x="340" y="58" width="6" height="112" fill="#8B5A2B"/>
    <rect x="200" y="78" width="140" height="92" fill="#FFF3DC"/><rect x="232" y="104" width="26" height="66" rx="2" fill="#7A4A2A"/><rect x="282" y="100" width="34" height="28" rx="2" fill="#7FB6D9"/><path d="M299 100 V128 M282 114 H316" stroke="#FFF3DC" stroke-width="2.4"/>
    <path d="M140 84 Q170 92 200 84" stroke="#6A421E" stroke-width="1.4" fill="none"/>${[[150, '#E5484D'], [166, '#1E9FE3'], [182, '#F5B731']].map(([x, c]) => `<g transform="translate(${x} 88)"><g class="s-swing" style="animation-duration:${2.4 + x % 7 / 5}s"><rect x="-6" y="0" width="12" height="16" rx="2" fill="${c}"/></g></g>`).join('')}
    <rect x="150" y="140" width="40" height="6" rx="2" fill="#8B5A2B"/><rect x="154" y="146" width="4" height="24" fill="#6A421E"/><rect x="182" y="146" width="4" height="24" fill="#6A421E"/>
    <g transform="translate(170 132)"><path d="M-7 -6 L7 -6 L5 8 L-5 8Z" fill="#fff"/><rect x="-5" y="-3" width="10" height="9" fill="#C87A2E"/>${[0, 1].map(i => `<path class="s-steam" style="animation-delay:${i * .8}s" d="M${-2 + i * 4} -9 q-3 -5 0 -10 q3 -5 0 -10" stroke="#fff" stroke-width="2.2" fill="none" stroke-linecap="round"/>`).join('')}</g>
    <rect x="118" y="170" width="242" height="30" fill="#C9A877"/><path d="M0 182 Q60 176 118 182 L118 200 L0 200Z" fill="#B8955F"/>
    ${[[214, 164], [330, 164]].map(([x, y]) => `<g transform="translate(${x} ${y})"><path d="M-8 0 L8 0 L6 10 L-6 10Z" fill="#C0533A"/><path d="M0 0 C-10 -12 -4 -20 0 -24 C4 -20 10 -12 0 0Z" fill="#3FA35F"/></g>`).join('')}`,

  // Inside the church: pews, a cross, light through stained glass.
  st_u8: (id) => `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF6E6"/><stop offset="1" stop-color="#F3E3C6"/></linearGradient></defs><rect width="360" height="200" fill="url(#${id})"/>
    ${[40, 290].map(x => `<g transform="translate(${x} 30)"><path d="M0 70 V24 A15 15 0 0 1 30 24 V70Z" fill="#7B61C9"/><path d="M15 9 V70 M0 36 H30 M0 54 H30" stroke="#FFF6E6" stroke-width="2.4"/><path d="M3 34 V24 A12 12 0 0 1 13 12 V34Z" fill="#F5B731" opacity=".8"/><path d="M17 12 A12 12 0 0 1 27 24 V34 H17Z" fill="#E5484D" opacity=".8"/><path d="M3 38 H13 V52 H3Z" fill="#1E9FE3" opacity=".8"/><path d="M17 38 H27 V52 H17Z" fill="#3FA35F" opacity=".8"/></g>`).join('')}
    <path class="s-glow" d="M48 100 L10 190 H110 L76 100Z" fill="#FFE08A" opacity=".35"/><path class="s-glow" style="animation-delay:-1s" d="M298 100 L250 190 H350 L326 100Z" fill="#FFE08A" opacity=".35"/>
    <path d="M140 0 V36 Q180 10 220 36 V0" fill="#EAD7B4"/><rect x="152" y="40" width="56" height="100" rx="4" fill="#EAD7B4"/><path d="M180 52 V112 M162 70 H198" stroke="#8B5A2B" stroke-width="7" stroke-linecap="round"/>
    ${[120, 240].map(x => `<g transform="translate(${x} 0)"><g class="s-swing" style="animation-duration:4s"><path d="M0 0 V34" stroke="#6A421E" stroke-width="1.4"/><path d="M-9 34 L9 34 L6 44 L-6 44Z" fill="#F5B731"/><ellipse class="s-glow" cx="0" cy="48" rx="12" ry="6" fill="#FFE08A" opacity=".6"/></g></g>`).join('')}
    <rect x="0" y="138" width="360" height="62" fill="#D9BE90"/>${[148, 166, 184].map((y, i) => `<rect x="${10 + i * 6}" y="${y}" width="${130 - i * 12}" height="10" rx="3" fill="#8B5A2B"/><rect x="${220 + i * 6}" y="${y}" width="${130 - i * 12}" height="10" rx="3" fill="#8B5A2B"/>`).join('')}
    <rect x="160" y="128" width="40" height="12" rx="2" fill="#7A4A2A"/><rect x="164" y="122" width="14" height="6" rx="1" fill="#2B2F3A"/>`,
});

Object.assign(SCENE_ART, {
  // A mahalla street in the morning: mountains, poplars, blue gates.
  st_uzu1: (id) => `${sky(id, '#9ED8F5', '#FFF2DA')}${spinSun(300, 40)}${drift(80, 34, 1.1, 46, 10)}${drift(230, 24, .8, 58, 30)}
    ${mountains(112)}${bird(140, 50, .9, 0)}${bird(158, 42, .7, 1.4)}
    <path d="M0 128 Q90 116 180 124 Q270 132 360 120 L360 200 L0 200Z" fill="#9CCF7A"/>
    ${[200, 222, 244, 330, 346].map((x, i) => poplar(x, 150, .9 - (i % 2) * .15)).join('')}
    ${uzHouse(90, 172, 1.1)}${uzHouse(276, 172, 1.05)}${roundTree(28, 176, 1.05)}
    <path d="M0 170 Q180 160 360 170 L360 200 L0 200Z" fill="#D9C9A8"/><path d="M140 200 Q180 176 220 174 Q250 174 270 200Z" fill="#CBB892"/>
    ${[18, 60, 330].map((x, i) => `<g transform="translate(${x} ${184 + (i % 2) * 6})">${[0, 72, 144, 216, 288].map(a => `<ellipse cx="0" cy="-3.4" rx="2.4" ry="3.6" fill="${i % 2 ? '#fff' : '#F49AB0'}" transform="rotate(${a})"/>`).join('')}<circle r="1.6" fill="#F5B731"/></g>`).join('')}`,

  // The old city: a madrasa with a blue dome and minaret, pigeons on the square.
  st_uzu2: (id) => `${sky(id, '#86CFF2', '#FFF0D6')}${spinSun(56, 50, 14, '#FFB84D')}${drift(150, 28, 1, 50, 12)}${drift(300, 44, .8, 44, 28)}
    ${madrasa(250, 168, 1.35)}${poplar(40, 168, 1)}${poplar(62, 168, .8)}${poplar(352, 168, .9)}
    ${bird(120, 60, .9, 0)}${bird(140, 52, .7, .8)}${bird(330, 30, .6, 1.6)}
    <path d="M0 166 L360 166 L360 200 L0 200Z" fill="#E3D3B0"/>${Array.from({ length: 10 }, (_, i) => `<path d="M${i * 40 - 10} 200 L${i * 40 + 20} 166" stroke="#CDBB93" stroke-width="1.4"/>`).join('')}<path d="M0 178 H360 M0 190 H360" stroke="#CDBB93" stroke-width="1.4"/>
    ${[[110, 186], [126, 190], [150, 184]].map(([x, y]) => `<g transform="translate(${x} ${y})"><ellipse cx="0" cy="0" rx="5" ry="3.4" fill="#8E99AE"/><circle cx="4.6" cy="-2.6" r="2.2" fill="#8E99AE"/><path d="M6.4 -2.6 l2 .6" stroke="#E8891C" stroke-width="1.2"/></g>`).join('')}`,

  // A tea house under a grape trellis: tapchan, teapot, bread.
  st_uzu3: (id) => `${sky(id, '#B6E2F2', '#F3F8E6')}${drift(90, 30, .9, 52, 20)}${drift(260, 22, 1.1, 60, 4)}
    ${mountains(110)}<path d="M0 124 Q120 112 240 122 Q300 128 360 118 L360 200 L0 200Z" fill="#8CC57A"/>
    ${poplar(26, 150, .9)}${poplar(44, 150, .7)}
    <g>${[150, 346].map(px => `<rect x="${px}" y="58" width="6" height="116" fill="#7A4A2A"/>`).join('')}<rect x="140" y="54" width="220" height="7" fill="#8A5A2E"/>
      ${Array.from({ length: 12 }, (_, i) => `<ellipse cx="${146 + i * 19}" cy="${54 + (i % 2) * 6}" rx="13" ry="8" fill="${i % 2 ? '#4E9A4A' : '#5BAA52'}"/>`).join('')}
      ${[184, 246, 312].map((gx, i) => `<g transform="translate(${gx} 64)"><g class="s-swing" style="animation-delay:${-i * .7}s">${[[0, 0], [-4, 6], [4, 6], [0, 12], [-3, 18], [3, 18], [0, 23]].map(([cx, cy]) => `<circle cx="${cx}" cy="${cy}" r="3.4" fill="#7E3F8F"/>`).join('')}</g></g>`).join('')}
      ${tapchan(250, 178, 1.9)}
      ${[0, 1, 2].map(i => `<path class="s-steam" style="animation-delay:${i * .7}s" d="M${246 + i * 4} 104 q-4 -6 0 -12 q4 -6 0 -12" stroke="#fff" stroke-width="2.6" fill="none" stroke-linecap="round"/>`).join('')}</g>
    <path d="M0 176 Q180 168 360 176 L360 200 L0 200Z" fill="#C9A877"/><path d="M0 188 Q180 182 360 188 L360 200 L0 200Z" fill="#B8955F"/>`,
});
// The bazaar: the market scene with a domed hall behind it and a white taxi.
SCENE_ART.st_uzu4 = (id) => {
  const base = SCENE_ART.st_u4(id).replace(tuktuk(0, 0, .55), taxi(0, 0, .55, '#F4F4F2'));
  const i = base.indexOf('<rect x="0" y="70"');
  return i < 0 ? base : base.slice(0, i) + blueDome(196, 112, 1.25) + base.slice(i);
};
// Story scenes for the later units, mostly variations of existing ones.
SCENE_ART.st_esroad = (id) => SCENE_ART.st_u6(id).replace(tuktuk(0, 0, .62), taxi(0, 0, .62));
SCENE_ART.st_uzroad = (id) => SCENE_ART.st_u6(id).replace(tuktuk(0, 0, .62), taxi(0, 0, .62, '#F4F4F2'));
const greySky = (svg) => svg.replace('stop-color="#9ED8F5"', 'stop-color="#AEBDCC"').replace('stop-color="#FFF2DA"', 'stop-color="#E6EAEE"');
SCENE_ART.st_esrain = (id) => greySky(SCENE_ART.st_esroad(id)).replace(spinSun(300, 36, 13), rainCloud(300, 40, 1.5) + rainCloud(170, 30, 1.1)) + rainOverlay();
SCENE_ART.st_uzhome = (id) => SCENE_ART.st_u5(id).replace(palm(58, 112, .5), poplar(58, 112, .42)).replace(palm(96, 112, .4, true), poplar(92, 112, .36));
SCENE_ART.st_uzsnow = (id) => greySky(SCENE_ART.st_uzu1(id)).replace(spinSun(300, 40), `<g transform="translate(300 40)"><circle cx="-14" cy="0" r="12" fill="#fff"/><circle cx="4" cy="-6" r="15" fill="#fff"/><circle cx="20" cy="2" r="11" fill="#fff"/></g>`)
  .replace('fill="#9CCF7A"', 'fill="#EEF3F8"').replace('fill="#D9C9A8"', 'fill="#F4F7FB"').replace('fill="#CBB892"', 'fill="#E4EBF2"')
  + `${snowman(330, 186, 1)}${snowOverlay()}`;
// Faith around you: a full-moon Poya night at the temple, and an iftar at sunset.
SCENE_ART.st_u9 = (id) => `${sky(id, '#1C2756', '#4B3B78')}${stars([[20, 20], [60, 34], [110, 14], [150, 40], [200, 18], [250, 30], [300, 12], [340, 44], [90, 52], [320, 66]])}${moon(280, 46, 16)}
  <path d="M0 136 Q90 126 180 132 Q270 138 360 128 L360 200 L0 200Z" fill="#2F4A3A"/>
  ${boTree(56, 160, 1.4)}${dagoba(200, 164, 1.25)}
  <path d="M0 162 Q180 154 360 162 L360 200 L0 200Z" fill="#D9CFBC"/><path d="M0 178 Q180 172 360 178 L360 200 L0 200Z" fill="#CBBFA8"/>
  <path d="M96 66 Q200 84 330 62" stroke="#999" stroke-width="1" fill="none"/>${[[120, 72], [170, 79], [230, 78], [290, 70]].map(([kx, ky], i) => kudu(kx, ky, .9, -i * .6)).join('')}
  ${[[150, 176], [180, 180], [222, 180], [252, 176]].map(([lx, ly], i) => `<g transform="translate(${lx} ${ly})"><ellipse cx="0" cy="0" rx="6" ry="2" fill="#B5652E"/><path class="s-flicker" style="animation-delay:${i * .3}s" d="M0 -1 C-2 -5 -1 -8 0 -11 C1 -8 2 -5 0 -1Z" fill="#FFC64D"/></g>`).join('')}`;
SCENE_ART.st_uzu11 = (id) => `${sky(id, '#F28C5B', '#FFD9A0')}${moon(300, 34, 12, false)}${stars([[40, 18], [120, 12], [250, 20], [340, 30]])}
  <circle cx="190" cy="118" r="26" fill="#FFB067" opacity=".55"/>
  ${mosque(250, 132, .95)}${poplar(30, 140, .9)}${poplar(48, 140, .7)}${poplar(352, 140, .8)}
  <path d="M0 132 Q180 124 360 132 L360 200 L0 200Z" fill="#C9A877"/>
  ${tapchan(120, 186, 1.8)}
  ${[0, 1].map(i => `<path class="s-steam" style="animation-delay:${i * .8}s" d="M${114 + i * 6} 118 q-4 -6 0 -12 q4 -6 0 -12" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round"/>`).join('')}
  <path d="M0 188 Q180 182 360 188 L360 200 L0 200Z" fill="#B8955F"/>`;
// Sinhala A1: a monsoon afternoon, lunch at Kumari's, coriander tea, and a train to Kandy.
SCENE_ART.st_u10 = (id) => SCENE_ART.st_u7(id).replace('stop-color="#FFD9A0"', 'stop-color="#A9B7C8"').replace('stop-color="#FFF4E0"', 'stop-color="#E3E8EE"')
  .replace(spinSun(70, 70, 16, '#FFB84D'), rainCloud(70, 44, 1.5) + rainCloud(250, 26, 1.1)).replace(bird(250, 50, .9, 1), '').replace(bird(272, 42, .7, 2.2), '')
  .replace('fill="#9CCF7A"', 'fill="#7FB46A"') + umbrella(96, 182, 1.3, '#1E9FE3') + rainOverlay();
SCENE_ART.st_u11 = (id) => SCENE_ART.st_u5(id) + `<rect x="168" y="140" width="128" height="8" rx="3" fill="#8B5A2B"/><rect x="176" y="148" width="6" height="22" fill="#6A421E"/><rect x="282" y="148" width="6" height="22" fill="#6A421E"/>
  ${[192, 272].map(px => `<ellipse cx="${px}" cy="138" rx="16" ry="4.4" fill="#fff" stroke="#DDD5C5" stroke-width="1"/><path d="M${px - 10} 137 Q${px} 128 ${px + 10} 137Z" fill="#FBF8F2"/>`).join('')}
  <path d="M216 138 Q232 146 248 138 Z" fill="#C0533A"/>${[[224, 133], [232, 130], [240, 133]].map(([mx, my]) => `<ellipse cx="${mx}" cy="${my}" rx="5" ry="6" fill="#FFD54A" transform="rotate(-20 ${mx} ${my})"/>`).join('')}
  ${[0, 1].map(i => `<path class="s-steam" style="animation-delay:${i * .8}s" d="M${188 + i * 80} 130 q-3 -5 0 -10 q3 -5 0 -10" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/>`).join('')}`;
SCENE_ART.st_u12 = (id) => SCENE_ART.st_u7(id).replace(palm(30, 160, .7), pharmacySign(24, 172, 1.3));
SCENE_ART.st_u13 = (id) => `${sky(id, '#9ED8F5', '#FFF2DA')}${spinSun(300, 36, 13)}${drift(90, 30, 1, 50, 4)}${drift(220, 20, .8, 44, 26)}${bird(140, 52, .8, .5)}
  <path d="M0 112 L50 72 L90 92 L140 60 L190 88 L240 64 L300 96 L360 74 L360 200 L0 200Z" fill="#7DB886"/>
  <path d="M0 126 Q90 108 180 120 Q270 132 360 114 L360 200 L0 200Z" fill="#5AA36A"/>${teaBushes(60, 128, .7)}${teaBushes(320, 124, .6)}
  <rect x="0" y="134" width="360" height="5" fill="#8E7A62"/>
  <g transform="translate(0 135)"><g class="s-drive" style="animation-duration:15s">${train(0, 0, .62)}</g></g>
  <path d="M0 146 Q180 140 360 146 L360 200 L0 200Z" fill="#86C9E3"/>
  ${[[60, 164], [150, 172], [300, 168]].map(([wx, wy], i) => `<path class="s-twinkle" style="animation-delay:${i * .5}s" d="M${wx - 12} ${wy} q6 -3 12 0 t12 0" stroke="#fff" stroke-width="2" fill="none" opacity=".8"/>`).join('')}
  ${kandyTemple(232, 158, .9)}<path d="M180 160 H290" stroke="#fff" stroke-width="2" opacity=".5"/>
  ${palm(26, 190, .65)}${palm(340, 190, .55, true)}
  <path d="M0 184 Q180 176 360 184 L360 200 L0 200Z" fill="#D9C9A8"/>`;
// Tamil course: the train north to Jaffna (palmyra palms, the old fort) and the Nallur festival.
SCENE_ART.st_tau12 = (id) => `${sky(id, '#9ED8F5', '#FFF2DA')}${spinSun(300, 36, 13)}${drift(90, 30, 1, 50, 4)}${drift(230, 22, .8, 44, 26)}${bird(150, 50, .8, .5)}
  <path d="M0 128 Q180 118 360 126 L360 200 L0 200Z" fill="#D9B27A"/><path d="M0 120 Q90 112 180 118 Q270 124 360 116 L360 132 L0 132Z" fill="#9CBF6A"/>
  ${palmyra(28, 128, .9)}${palmyra(60, 126, .7)}${palmyra(338, 126, .85)}${palmyra(312, 124, .6)}
  <rect x="0" y="134" width="360" height="5" fill="#8E7A62"/><g transform="translate(0 135)"><g class="s-drive" style="animation-duration:15s">${train(0, 0, .62)}</g></g>
  <path d="M206 160 L214 146 L286 146 L294 160Z" fill="#9E9384"/><path d="M214 146 L222 138 L278 138 L286 146Z" fill="#B3A897"/>${[222, 238, 254, 270].map(x => `<rect x="${x}" y="133" width="8" height="6" fill="#B3A897"/>`).join('')}<path d="M214 152 H286" stroke="#857A6B" stroke-width="1.5"/>
  <path d="M0 168 Q180 160 360 170 L360 200 L0 200Z" fill="#7FB8C9"/>${[[60, 182], [180, 186], [300, 180]].map(([wx, wy], i) => `<path class="s-twinkle" style="animation-delay:${i * .5}s" d="M${wx - 12} ${wy} q6 -3 12 0 t12 0" stroke="#fff" stroke-width="2" fill="none" opacity=".8"/>`).join('')}`;
SCENE_ART.st_tau13 = (id) => `${sky(id, '#FFD9A0', '#FFF6E6')}${spinSun(64, 44, 15, '#FFB84D')}${drift(200, 24, .9, 46, 8)}
  ${palmyra(24, 150, .95)}${palmyra(336, 150, .9)}${kovilTower(180, 142, .95, true)}${stripeWall(40, 126, 142, 34)}${stripeWall(234, 320, 142, 34)}
  ${Array.from({ length: 14 }, (_, i) => `<path d="M${50 + i * 19} 70 l6 10 l6 -10" fill="${['#C0392B', '#F2C14E', '#2E86C1', '#27AE60'][i % 4]}"/>`).join('')}<path d="M44 70 Q180 64 316 70" stroke="#8B5A2B" stroke-width="1.2" fill="none"/>
  <path d="M0 142 H360 V200 H0Z" fill="#EAD3A2"/><path d="M0 142 H360" stroke="#D8BC86" stroke-width="2"/>
  <g transform="translate(247 152) scale(.62)"><path d="M-32 -26 H32 V-16 H-32Z" fill="#8B5A2B"/><path d="M-24 -50 H24 V-26 H-24Z" fill="#6A421E"/>${[-18, -6, 6].map(x => `<rect x="${x}" y="-46" width="8" height="14" rx="2" fill="#C98A0C"/>`).join('')}
    ${[[-28, -50, 28, -60, '#C0392B'], [-23, -60, 23, -70, '#FBF7EE'], [-18, -70, 18, -80, '#C0392B'], [-12, -80, 12, -88, '#F5B731']].map(([x1, y1, x2, y2, c]) => `<path d="M${x1} ${y1} L${x2} ${y1} L${x2 - 5} ${y2} L${x1 + 5} ${y2}Z" fill="${c}" stroke="#7a1f14" stroke-width=".8"/>`).join('')}
    <circle cx="0" cy="-92" r="3" fill="#C98A0C"/>${[-20, 20].map(x => `<circle cx="${x}" cy="-12" r="11" fill="#4A2E14"/><circle cx="${x}" cy="-12" r="6" fill="none" stroke="#C98A0C" stroke-width="1.6"/>`).join('')}
    <path d="M-32 -20 Q-46 -14 -58 -2" stroke="#C9A227" stroke-width="2.4" fill="none"/><path d="M32 -20 Q46 -14 58 -2" stroke="#C9A227" stroke-width="2.4" fill="none"/></g>`;
// Tamil course, Islam unit: sunset in Ramadan, a mosque among the palms, lamps on a neighbour's verandah.
SCENE_ART.st_tau14 = (id) => `${sky(id, '#F7A072', '#FFE3B8')}<circle cx="300" cy="96" r="22" fill="#FFB65C" opacity=".9"/><g class="s-twinkle"><path d="M64 30 a10 10 0 1 0 6 -15 a8 8 0 1 1 -6 15z" fill="#FFF3C4"/></g>${[[110, 22], [150, 40], [240, 18]].map(([sx, sy], i) => `<circle class="s-twinkle" style="animation-delay:${i * .4}s" cx="${sx}" cy="${sy}" r="1.6" fill="#FFF8E1"/>`).join('')}
  <path d="M0 132 Q180 122 360 130 L360 200 L0 200Z" fill="#C9A26B"/>${palm(22, 140, .8)}${palm(338, 140, .75, true)}${lankaMosque(176, 134, .78)}
  <path d="M232 134 V96 H346 V134Z" fill="#F4E6CC"/><path d="M226 98 L289 74 L352 98Z" fill="#B5523B"/><rect x="250" y="106" width="16" height="28" rx="2" fill="#7A4A2A"/><rect x="300" y="106" width="22" height="16" rx="2" fill="#9CC9E0"/>
  ${[244, 274, 304, 334].map((lx, i) => `<g transform="translate(${lx} 100)"><path d="M0 0 V6" stroke="#6b3a16" stroke-width="1"/><g class="a-flicker" style="animation-delay:${i * .3}s"><rect x="-3.5" y="6" width="7" height="9" rx="2" fill="#F5B731"/><rect x="-2" y="8" width="4" height="5" rx="1.4" fill="#FFF3C4"/></g></g>`).join('')}
  <path d="M0 150 H360 V200 H0Z" fill="#B88F5C" opacity=".45"/>`;
// Uzbek A1 additions: a courtyard evening under the vines, the streets of Osh below Sulaiman-Too, and Наврўз.
SCENE_ART.st_uzhovli = (id) => `${sky(id, '#3B4A7A', '#F3B27A')}${moon(300, 34, 14)}${[[60, 20], [120, 34], [200, 16], [250, 40]].map(([sx, sy], i) => `<circle class="s-twinkle" style="animation-delay:${i * .4}s" cx="${sx}" cy="${sy}" r="1.6" fill="#FFF8E1"/>`).join('')}
  <rect x="0" y="96" width="360" height="104" fill="#E9D7B0"/><rect x="0" y="92" width="360" height="8" fill="#D8C49A"/>${uzHouse(300, 160, 1.1)}
  ${vineArbor(20, 170, 230, 1.05)}${tapchan(150, 182, 1.1)}<path d="M0 182 H360" stroke="#CDB98C" stroke-width="2"/>`;
SCENE_ART.st_uzosh = (id) => `${sky(id, '#8FD0F2', '#FFF1D6')}${spinSun(318, 30, 13)}${drift(70, 26, .9, 46, 6)}${drift(220, 20, .7, 40, 22)}
  ${sulaimanToo(180, 140, 1.2)}${[[18, 92, 46], [70, 104, 34], [262, 98, 40], [312, 90, 44]].map(([bx, by, bw]) => `<rect x="${bx}" y="${by}" width="${bw}" height="${150 - by}" fill="#D8CFC2"/>${Array.from({ length: Math.floor((140 - by) / 12) }, (_, r) => Array.from({ length: Math.floor(bw / 12) }, (_, c) => `<rect x="${bx + 4 + c * 12}" y="${by + 6 + r * 12}" width="7" height="6" fill="${(r + c) % 4 ? '#A9C6DA' : '#FFD98A'}"/>`).join('')).join('')}`).join('')}
  <rect x="0" y="140" width="360" height="60" fill="#CFC6B8"/><rect x="0" y="156" width="360" height="44" fill="#9AA0AE"/><path d="M0 178 H360" stroke="#fff" stroke-width="2.4" stroke-dasharray="16 12"/>${poplar(110, 142, .9)}${poplar(246, 142, .9)}${bird(140, 50, .8, .3)}${bird(170, 40, .6, 1.2)}`;
SCENE_ART.st_uznavruz = (id) => `${sky(id, '#A8DCF5', '#FFF4DC')}${spinSun(300, 34, 14)}${drift(120, 28, .9, 48, 8)}
  <rect x="0" y="120" width="360" height="80" fill="#A9D67E"/>${uzHouse(70, 140, 1)}${blossomTree(190, 132, 1.3)}${blossomTree(330, 136, 1)}
  ${kazan(270, 170, 1.2)}${[[20, 186, '#E03A3E'], [36, 190, '#FFC94D'], [150, 188, '#E03A3E'], [166, 192, '#F27D9A'], [340, 190, '#FFC94D']].map(([tx, ty, c]) => tulipS(tx, ty, 1.1, c)).join('')}`;
// Swahili course (Kenya) story scenes.
SCENE_ART.st_swtown = (id) => `${sky(id, '#87CEEB', '#FFF1D6')}${spinSun(320, 30, 13)}${drift(80, 24, .9, 46, 4)}${drift(230, 20, .7, 40, 20)}${nairobi(132)}
  <rect x="0" y="132" width="360" height="68" fill="#9AA0AE"/><path d="M0 162 H360" stroke="#fff" stroke-width="2.4" stroke-dasharray="16 12"/><rect x="0" y="128" width="360" height="6" fill="#C9C2B4"/>
  <g transform="translate(0 176)"><g class="s-drive" style="animation-duration:14s">${matatu(0, 0, 1.1)}</g></g>${acacia(30, 132, .8)}${acacia(336, 132, .7)}`;
SCENE_ART.st_swkibanda = (id) => `${sky(id, '#9BD3F0', '#FFF4DC')}${spinSun(310, 30, 13)}${drift(110, 26, .9, 46, 6)}
  <rect x="0" y="120" width="360" height="80" fill="#C98A4B"/><rect x="0" y="116" width="360" height="8" fill="#B07A41"/>${acacia(44, 122, 1)}${acacia(320, 122, .8)}${kiosk(190, 150, 1.6)}
  <rect x="96" y="160" width="40" height="6" rx="2" fill="#A0703F"/>${[100, 132].map(bx => `<rect x="${bx - 2}" y="166" width="4" height="16" fill="#7A4A2A"/>`).join('')}`;
SCENE_ART.st_swmarket = (id) => `${sky(id, '#9BD3F0', '#FFF4DC')}${spinSun(318, 30, 13)}${drift(60, 24, .9, 46, 6)}
  <rect x="0" y="116" width="360" height="84" fill="#D2A86E"/>${kenyaStall(80, 150, 1.4)}${kenyaStall(280, 150, 1.4)}${acacia(180, 118, .9)}
  ${Array.from({ length: 12 }, (_, i) => `<path d="M${20 + i * 28} 70 l7 11 l7 -11" fill="${['#BB0000', '#006600', '#F4D03F', '#2E86C1'][i % 4]}"/>`).join('')}<path d="M14 70 Q180 64 346 70" stroke="#7A4A2A" stroke-width="1.2" fill="none"/>`;
SCENE_ART.st_swhome = (id) => `${sky(id, '#A8DCF5', '#FFF4DC')}${spinSun(300, 34, 14)}${drift(120, 28, .9, 48, 8)}${mtKenya(250, 120, 1.3)}
  <rect x="0" y="118" width="360" height="82" fill="#B5683A"/><path d="M0 118 Q180 110 360 118 V126 H0Z" fill="#8FBF5A"/>${mabati(250, 150, 1.6)}${bananaPlant(40, 150, 1.3)}${bananaPlant(84, 152, 1)}
  ${Array.from({ length: 6 }, (_, i) => `<g transform="translate(${118 + i * 14} 150)"><path d="M0 0 V-34" stroke="#7DA453" stroke-width="2.4"/><path d="M0 -12 Q-8 -18 -10 -26 M0 -20 Q8 -26 10 -34" stroke="#6FA33E" stroke-width="3" fill="none"/><path d="M0 -34 l-2 -8 l4 0Z" fill="#E8C35A"/></g>`).join('')}`;
SCENE_ART.st_swchurch = (id) => `${sky(id, '#9BD3F0', '#FFF6E6')}${spinSun(64, 40, 14)}${drift(210, 22, .9, 46, 8)}
  <rect x="0" y="122" width="360" height="78" fill="#C98A4B"/><path d="M0 122 Q180 114 360 122 V128 H0Z" fill="#8FBF5A"/>${smallChurch(190, 150, 2)}${acacia(40, 124, 1)}${acacia(330, 124, .8)}`;
SCENE_ART.st_esu4 = (id) => SCENE_ART.st_u4(id).replace(tuktuk(0, 0, .55), taxi(0, 0, .55));

export function storyScene(id) {
  const art = SCENE_ART[id] || SCENE_ART.st_u1;
  return `<svg class="scene" viewBox="0 0 360 200" preserveAspectRatio="xMidYMax slice" aria-hidden="true">${art(`sg${++sid}`)}</svg>`;
}
