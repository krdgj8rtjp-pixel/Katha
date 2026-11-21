// Hand-drawn picture for every word, as inline SVG (viewBox 0 0 100 100).
// Moving parts carry a-* classes (steam, twinkle, wave…) that only animate
// inside a `.pic.live` svg, so a grid of cards stays calm until one is picked.
import { character, castId } from './characters.js';
import { COURSE } from '../data/course.js';
import { tuktuk } from './art.js';

const P = {
  skin: '#C68A5E', skinD: '#9E663F',
  china: '#FBF8F2', chinaD: '#DDD5C5',
  red: '#E5484D', redD: '#B42D32', green: '#3AAE5A', greenD: '#2A8743', leaf: '#3FA35F', leafD: '#2B7D47', leafL: '#6CCB86',
  blue: '#1E9FE3', blueD: '#1679AE', blueL: '#BFE6FA', water: '#7FD0F5',
  orange: '#E8891C', orangeD: '#B8640C', gold: '#F5B731', goldD: '#C98A0C', yellow: '#FFD54A',
  maroon: '#8D153A', brown: '#9A6332', brownD: '#6A421E', tea: '#C87A2E', coffee: '#5E3521',
  purple: '#7B61C9', pink: '#F27D9A', teal: '#14898A', gray: '#B8BECB', grayD: '#7D8496', ink: '#2b2230',
};

let uid = 0;
const nid = () => `kp${++uid}`;

// ------------------------------------------------------------------ shared bits
const shadow = (rx = 28, cx = 50, cy = 93) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="3.6" fill="#000" opacity=".09"/>`;
const at = (x, y, s, inner, r = 0) => `<g transform="translate(${x} ${y})${r ? ` rotate(${r})` : ''}${s !== 1 ? ` scale(${s})` : ''}">${inner}</g>`;
const sparkle = (x, y, s = 1, c = P.gold, d = 0) => at(x, y, s, `<path class="a-twinkle" style="animation-delay:${d}s" d="M0 -6 Q1 -1 6 0 Q1 1 0 6 Q-1 1 -6 0 Q-1 -1 0 -6Z" fill="${c}"/>`);
const HEART = 'M0 5 C-8.5 -1 -8.5 -8 -4.2 -8 C-1.8 -8 0 -6.3 0 -4.8 C0 -6.3 1.8 -8 4.2 -8 C8.5 -8 8.5 -1 0 5Z';
const heart = (x, y, s = 1, c = P.red, cls = '', d = 0) => at(x, y, s, `<path class="${cls}" style="animation-delay:${d}s" d="${HEART}" fill="${c}"/><path d="M-4.5 -5 q1.5-1.6 3 -.6" stroke="#fff" stroke-width="1.4" fill="none" stroke-linecap="round" opacity=".7"/>`);
const floatHeart = (x, y, s, d) => at(x, y, s, `<g class="a-float" style="animation-delay:${d}s"><path d="${HEART}" fill="${P.red}"/></g>`);
const chr = (id, x, y, size, o = {}) => character(castId(id), { x, y, size, ...o });
const CUR = () => COURSE?.currency || 'රු';
const curFont = () => (CUR() === 'රු' ? 'class="pic-si"' : 'class="pic-num"');
const T = (x, y, txt, size, fill, extra = '') => `<text x="${x}" y="${y}" text-anchor="middle" font-size="${size}" fill="${fill}" ${extra}>${txt}</text>`;

const badge = (x, y, r, fill, mark) => at(x, y, 1, `<g class="a-pop"><circle r="${r + 2.4}" fill="#fff"/><circle r="${r}" fill="${fill}"/>${mark}</g>`);
const checkBadge = (x, y, r = 12) => badge(x, y, r, P.green, `<path d="M${-r * .46} ${r * .02} L${-r * .12} ${r * .38} L${r * .5} ${-r * .34}" stroke="#fff" stroke-width="${r * .27}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`);
const xBadge = (x, y, r = 12) => badge(x, y, r, P.red, `<path d="M${-r * .36} ${-r * .36} L${r * .36} ${r * .36} M${r * .36} ${-r * .36} L${-r * .36} ${r * .36}" stroke="#fff" stroke-width="${r * .27}" stroke-linecap="round"/>`);

function bubble(x, y, w, h, { fill = '#fff', stroke = '#CFD6E2', tail = 'bl', sw = 2.4 } = {}) {
  const tx = tail === 'bl' ? x + w * .26 : tail === 'br' ? x + w * .74 : x + w / 2;
  const lean = tail === 'br' ? 6 : tail === 'bl' ? -6 : 0;
  return `<path d="M${tx - 6} ${y + h - 2} L${tx + lean} ${y + h + 10} L${tx + 6} ${y + h - 2}Z" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round"/>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${Math.min(h / 2, 12)}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>
    <path d="M${tx - 4.4} ${y + h - sw / 2} L${tx + 4.4} ${y + h - sw / 2}" stroke="${fill}" stroke-width="${sw + 1.2}"/>`;
}
const thought = (cx, cy, rx, ry, inner = '', bx = 0, by = 0) => `<circle cx="${bx}" cy="${by}" r="2.6" fill="#fff" stroke="#CFD6E2" stroke-width="2"/><circle cx="${(bx + cx) / 2 - 2}" cy="${(by + cy + ry) / 2}" r="4" fill="#fff" stroke="#CFD6E2" stroke-width="2"/>
  <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#fff" stroke="#CFD6E2" stroke-width="2.4"/>${inner}`;

// Hands. Wrist at (0,0), fingers pointing up; rotate to aim.
function hand(kind, { x = 50, y = 90, r = 0, s = 1, sleeve = P.teal, cls = '', flip = false } = {}) {
  const sk = P.skin, sd = P.skinD;
  const cap = (d, w) => `<path d="${d}" stroke="${sd}" stroke-width="${w + 2.8}" stroke-linecap="round" fill="none"/><path d="${d}" stroke="${sk}" stroke-width="${w}" stroke-linecap="round" fill="none"/>`;
  const palm = (x0, y0, w, h, rx) => [`<rect x="${x0}" y="${y0}" width="${w}" height="${h}" rx="${rx}" fill="${sd}" stroke="${sd}" stroke-width="2.8"/>`, `<rect x="${x0}" y="${y0}" width="${w}" height="${h}" rx="${rx}" fill="${sk}"/>`];
  const cuff = (x0 = -12, w = 24) => `<rect x="${x0}" y="-5" width="${w}" height="12" rx="3.5" fill="${sleeve}"/><rect x="${x0}" y="-5" width="${w}" height="3" rx="1.5" fill="#000" opacity=".14"/>`;
  let b = '';
  if (kind === 'open') {
    const [po, pf] = palm(-12.5, -31, 25, 29, 9);
    b = po + cap('M9 -24 L9 -40', 5.4) + cap('M3 -25 L3 -46', 5.4) + cap('M-3 -25 L-3 -48', 5.4) + cap('M-9 -24 L-9 -44.5', 5.4) + pf
      + cap('M-10.5 -13 L-19.5 -25.5', 6.6) + `<path d="M-5 -12.5 q5 3.4 10 0" stroke="${sd}" stroke-width="1.5" fill="none" stroke-linecap="round" opacity=".55"/>` + cuff();
  } else if (kind === 'thumb') {
    const [po, pf] = palm(-11, -30, 22, 27, 8.5);
    b = po + [-25.5, -19, -12.5, -6].map(fy => cap(`M3 ${fy} L13.5 ${fy}`, 5.8)).join('') + pf + cap('M-5 -27 L-5 -46', 7.6) + cuff(-11, 22);
  } else if (kind === 'point') {
    const [po, pf] = palm(-11.5, -28, 23, 25, 8.5);
    b = po + cap('M-6 -26 L-6 -51', 6) + pf + [-21.5, -15, -8.5].map(fy => cap(`M-1.5 ${fy} L8.5 ${fy}`, 5.4)).join('') + cap('M-9.5 -11 L1 -16.5', 6.2) + cuff(-11.5, 23);
  } else if (kind === 'pinch') {
    const [po, pf] = palm(-13, -30, 22, 26, 9);
    b = po + cap('M2 -25 C10 -31 18 -31 23 -25', 6) + cap('M1 -10 C9 -9 15 -11 19.5 -15.5', 6.6) + pf + cuff(-13, 22);
  } else if (kind === 'pray') {
    b = `<path d="M0 0 L-9.5 0 C-11.5 -12 -8.5 -27 -1 -41 Q0 -43 0 -39Z" fill="${sk}" stroke="${sd}" stroke-width="2.4" stroke-linejoin="round"/>
      <path d="M0 0 L9.5 0 C11.5 -12 8.5 -27 1 -41 Q0 -43 0 -39Z" fill="${sk}" stroke="${sd}" stroke-width="2.4" stroke-linejoin="round"/>
      <rect x="-13" y="-2" width="12" height="10" rx="3" fill="${sleeve}"/><rect x="1" y="-2" width="12" height="10" rx="3" fill="${sleeve}"/>`;
  }
  return `<g transform="translate(${x} ${y}) rotate(${r}) scale(${flip ? -s : s} ${s})"><g class="${cls}">${b}</g></g>`;
}

// ------------------------------------------------------------------ objects
const cup = (x, y, s = 1, tea = P.tea, steam = true) => at(x, y, s, `
  ${steam ? [-8, 0, 8].map((sx, i) => `<path class="a-steam" style="animation-delay:${i * .7}s" d="M${sx} -30 q-4 -6 0 -12 q4 -6 0 -12" stroke="#C9CED8" stroke-width="3" fill="none" stroke-linecap="round"/>`).join('') : ''}
  <ellipse cx="0" cy="12" rx="30" ry="6.5" fill="${P.chinaD}"/><ellipse cx="0" cy="10.5" rx="27" ry="5" fill="${P.china}"/>
  <path d="M21 -10 C33 -11 33 6 18 4" stroke="${P.chinaD}" stroke-width="5" fill="none" stroke-linecap="round"/>
  <path d="M-22 -16 L22 -16 C22 2 14 11 0 11 C-14 11 -22 2 -22 -16Z" fill="${P.china}"/>
  <path d="M-22 -16 L22 -16 C22 -10 21 -6 19 -2 C10 0 -10 0 -19 -2 C-21 -6 -22 -10 -22 -16Z" fill="#fff" opacity=".5"/>
  <path d="M-21 -2 C-10 2 10 2 21 -2" stroke="${P.blue}" stroke-width="2.6" fill="none" opacity=".75"/>
  <ellipse cx="0" cy="-16" rx="22" ry="5" fill="${P.chinaD}"/><ellipse cx="0" cy="-15.4" rx="19.5" ry="3.8" fill="${tea}"/>
  <path d="M-15 -7 q-1 7 3 11" stroke="#fff" stroke-width="2.6" fill="none" stroke-linecap="round" opacity=".8"/>`);

const coconut = (x, y, s = 1) => at(x, y, s, `<ellipse cx="0" cy="2" rx="17" ry="19" fill="#F08A24"/><ellipse cx="-5" cy="-3" rx="8" ry="11" fill="#F6A74A"/>
  <path d="M-9 -15 Q0 -24 9 -15 Q0 -11 -9 -15Z" fill="${P.leafD}"/><path d="M-3 -19 l-2 -6 M3 -19 l3 -5" stroke="${P.leafD}" stroke-width="2.4" stroke-linecap="round"/>
  <path d="M-10 -2 q0 -8 5 -11" stroke="#fff" stroke-width="2.2" fill="none" stroke-linecap="round" opacity=".7"/>`);

const tag = (x, y, r, fill, inner, s = 1) => at(x, y, s, `<path d="M-20 -26 L10 -26 L26 -6 L10 14 L-20 14 Q-24 14 -24 10 L-24 -22 Q-24 -26 -20 -26Z" fill="${fill}"/>
  <path d="M-20 -26 L10 -26 L26 -6 L22 -2 L-24 -2 L-24 -22 Q-24 -26 -20 -26Z" fill="#fff" opacity=".18"/>
  <circle cx="12" cy="-6" r="3.6" fill="#fff"/><path d="M14 -8 C24 -22 34 -26 40 -32" stroke="#B9A27A" stroke-width="2" fill="none"/>${inner}`, r);

const plate = (x, y, rx = 34, ry = 12) => `<ellipse cx="${x}" cy="${y + 2.5}" rx="${rx}" ry="${ry}" fill="${P.chinaD}"/><ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#fff"/><ellipse cx="${x}" cy="${y}" rx="${rx * .7}" ry="${ry * .62}" fill="${P.china}" stroke="${P.chinaD}" stroke-width="1.2"/>`;

const spoon = (x, y, r = 0, s = 1) => at(x, y, s, `<rect x="-2" y="0" width="4" height="34" rx="2" fill="${P.gray}"/><ellipse cx="0" cy="-4" rx="7" ry="9" fill="${P.gray}"/><ellipse cx="-1.5" cy="-6" rx="3" ry="4.5" fill="#fff" opacity=".55"/>`, r);
const fork = (x, y, r = 0, s = 1) => at(x, y, s, `<rect x="-2" y="0" width="4" height="34" rx="2" fill="${P.gray}"/><path d="M-7 -14 L-7 -2 Q-7 4 0 4 Q7 4 7 -2 L7 -14" stroke="${P.gray}" stroke-width="3.2" fill="none" stroke-linecap="round"/><path d="M0 -14 L0 2 M-3.5 -14 L-3.5 0 M3.5 -14 L3.5 0" stroke="${P.gray}" stroke-width="2.4" stroke-linecap="round"/>`, r);

const steam = (x, y, s = 1) => at(x, y, s, [-7, 1, 9].map((sx, i) => `<path class="a-steam" style="animation-delay:${i * .65}s" d="M${sx} 0 q-4 -6 0 -12 q4 -6 0 -12" stroke="#C9CED8" stroke-width="3" fill="none" stroke-linecap="round"/>`).join(''));

const NUM_COLORS = [P.blue, P.green, P.orange, P.purple, P.red, P.teal, P.gold, P.pink, P.maroon, P.blueD, P.leafD, P.orangeD, P.purple];
function numberTile(n, k) {
  const c = NUM_COLORS[k % NUM_COLORS.length];
  const big = n >= 100;
  const dots = n <= 10 ? Array.from({ length: n }, (_, i) => {
    const row = n > 5 ? (i < Math.ceil(n / 2) ? 0 : 1) : 0;
    const inRow = n > 5 ? (row === 0 ? Math.ceil(n / 2) : Math.floor(n / 2)) : n;
    const col = row === 0 ? i : i - Math.ceil(n / 2);
    return `<circle cx="${50 + (col - (inRow - 1) / 2) * 9}" cy="${n > 5 ? 66 + row * 9 : 70}" r="3.2" fill="#fff" opacity=".92"/>`;
  }).join('') : sparkle(73, 30, .8, '#fff', .3);
  return `${shadow(30)}<g class="a-bob"><rect x="16" y="14" width="68" height="74" rx="16" fill="${c}" filter="brightness(.8)"/><rect x="16" y="12" width="68" height="70" rx="16" fill="${c}"/>
    <rect x="22" y="16" width="56" height="10" rx="5" fill="#fff" opacity=".18"/>
    ${T(50, n <= 10 ? 58 : 62, n, big ? 34 : 40, '#fff', 'class="pic-num"')}${dots}</g>`;
}

// ------------------------------------------------------------------ the pictures
const ART = {
  // ---- Unit 1: greetings
  ayubovan: () => `${sparkle(14, 28, 1)}${sparkle(87, 24, .8, P.gold, .6)}${sparkle(86, 66, .7, P.pink, 1.1)}${chr('kumari', 12, 8, 76, { pose: 'namaste' })}`,
  ov: () => `${shadow(26, 44)}<g class="a-nod">${chr('nimal', 4, 18, 74, { head: true })}</g>${checkBadge(80, 24, 13)}`,
  nae: () => `${shadow(26, 44)}<g class="a-shake">${chr('nimal', 4, 18, 74, { head: true })}</g>${xBadge(80, 24, 13)}`,
  stutiyi: () => `${chr('nimal', 12, 8, 76, { pose: 'heart', mood: 'happy' })}${floatHeart(82, 40, 1, 0)}${floatHeart(18, 36, .8, 1.2)}${floatHeart(86, 66, .7, .6)}`,
  hondayi: () => `${shadow(24)}${hand('thumb', { x: 48, y: 87, s: 1.45, sleeve: P.blue, cls: 'a-bob' })}${sparkle(80, 22, 1)}${sparkle(20, 30, .7, P.gold, .8)}`,
  kohomada: () => `${chr('john', 0, 22, 64, { mood: 'wave' })}${bubble(54, 8, 38, 32, { stroke: P.blue })}<g class="a-bob">${T(73, 34, '?', 28, P.blue)}</g>`,
  oya: () => `<circle cx="76" cy="47" r="22" fill="${P.gold}" opacity=".22" class="a-glow"/>${chr('kumari', 56, 26, 42, { head: true })}${hand('point', { x: 10, y: 58, r: 90, s: .78, sleeve: P.blue, cls: 'a-poke' })}${shadow(24, 50)}`,
  mama: () => `${sparkle(18, 30, .9)}${sparkle(84, 26, .7, P.pink, .7)}${chr('kumari', 12, 8, 76, { pose: 'self' })}`,
  mata: () => `<g class="a-bob">${at(20, 24, 1, `<rect x="-12" y="-9" width="24" height="20" rx="3" fill="${P.red}"/><rect x="-14" y="-14" width="28" height="7" rx="2.5" fill="${P.redD}"/><rect x="-2.5" y="-14" width="5" height="25" fill="${P.gold}"/><path d="M0 -14 C-8 -22 -12 -14 0 -14 C12 -14 8 -22 0 -14" stroke="${P.gold}" stroke-width="3" fill="none"/>`)}</g>
    <path class="a-dash" d="M30 36 Q34 62 54 66" stroke="${P.orange}" stroke-width="3" fill="none" stroke-dasharray="5 5" stroke-linecap="round"/><path d="M48 70 L56 66 L49 60" stroke="${P.orange}" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    ${chr('kumari', 40, 26, 60, { pose: 'self' })}`,
  hari: () => `${shadow(26)}<circle class="a-ring" cx="50" cy="48" r="34" fill="none" stroke="${P.green}" stroke-width="3" opacity=".4"/>${checkBadge(50, 48, 30)}${sparkle(84, 18, .9)}${sparkle(16, 78, .7, P.gold, .9)}`,
  samavenna: () => `${chr('nimal', 12, 8, 76, { pose: 'scratch', mood: 'sad' })}<path class="a-drip" d="M30 30 q-4 6 0 8 q4 -2 0 -8Z" fill="${P.water}"/>`,
  kamak_nae: () => `${chr('john', 12, 10, 76, { pose: 'shrug' })}${sparkle(86, 24, .8, P.leaf)}${sparkle(14, 22, .6, P.leaf, .8)}`,
  bohoma: () => {
    const pt = (a, r = 34) => [50 + r * Math.cos(a * Math.PI / 180), 66 + r * Math.sin(a * Math.PI / 180)].map(v => v.toFixed(1)).join(' ');
    return `${shadow(34, 50, 90)}<path d="M8 66 A42 42 0 0 1 92 66 L92 74 Q92 80 86 80 L14 80 Q8 80 8 74Z" fill="#3A3F52"/>
      <path d="M${pt(180)} A34 34 0 0 1 ${pt(240)}" stroke="${P.green}" stroke-width="10" fill="none"/>
      <path d="M${pt(242)} A34 34 0 0 1 ${pt(298)}" stroke="${P.gold}" stroke-width="10" fill="none"/>
      <path d="M${pt(300)} A34 34 0 0 1 ${pt(360)}" stroke="${P.red}" stroke-width="10" fill="none"/>
      <path class="a-needle" d="M48 66 L50 34 L52 66Z" fill="#fff"/><circle cx="50" cy="66" r="6" fill="#fff"/><circle cx="50" cy="66" r="2.6" fill="#3A3F52"/>
      ${sparkle(88, 20, .9)}${sparkle(14, 24, .7, P.gold, .6)}`;
  },
  gihin_ennam: () => `<path d="M22 14 C6 18 6 40 20 44" stroke="${P.blue}" stroke-width="3.4" fill="none" stroke-linecap="round" stroke-dasharray="1 7" class="a-dash"/><path d="M14 40 L21 45 L24 37" stroke="${P.blue}" stroke-width="3.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>${chr('nimal', 18, 10, 72, { pose: 'bag', mood: 'wave' })}`,
  gihin_enna: () => `<rect x="20" y="6" width="60" height="86" rx="4" fill="${P.brown}"/><rect x="26" y="12" width="48" height="80" fill="#FFE7A8"/><rect x="26" y="12" width="48" height="80" fill="#FFC94D" opacity=".35" class="a-glow"/>
    <path d="M74 12 L88 18 L88 92 L74 92Z" fill="${P.brownD}"/><circle cx="84" cy="56" r="2" fill="${P.gold}"/>${chr('kumari', 16, 20, 66, { mood: 'wave' })}${floatHeart(84, 8, .8, .2)}`,
  passe: () => `${shadow(30)}<circle cx="50" cy="50" r="38" fill="${P.blue}"/><circle cx="50" cy="50" r="32" fill="#fff"/>
    ${Array.from({ length: 12 }, (_, i) => `<path d="M50 ${i % 3 ? 21 : 20} L50 ${i % 3 ? 24 : 27}" stroke="${i % 3 ? P.gray : P.ink}" stroke-width="${i % 3 ? 2 : 3}" stroke-linecap="round" transform="rotate(${i * 30} 50 50)"/>`).join('')}
    <path d="M50 50 L64 50" stroke="${P.ink}" stroke-width="4.4" stroke-linecap="round"/>
    <path class="a-spin" d="M48.5 52 L50 25 L51.5 52Z" fill="${P.red}"/><circle cx="50" cy="50" r="3.6" fill="${P.ink}"/>
    <path d="M78 10 A22 22 0 0 1 94 30" stroke="${P.orange}" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M88 29 L94 31 L96 24" stroke="${P.orange}" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
  hambavemu: () => `${shadow(30)}<rect x="12" y="20" width="76" height="68" rx="10" fill="#fff" stroke="${P.chinaD}" stroke-width="2.4"/><path d="M12 30 Q12 20 22 20 L78 20 Q88 20 88 30 L88 36 L12 36Z" fill="${P.red}"/>
    <rect x="27" y="12" width="6" height="16" rx="3" fill="${P.grayD}"/><rect x="67" y="12" width="6" height="16" rx="3" fill="${P.grayD}"/>
    ${chr('kumari', 16, 40, 40, { head: true, mood: 'happy' })}${chr('john', 44, 40, 40, { head: true, mood: 'happy' })}<g class="a-pulse">${heart(50, 44, .8)}</g>`,
  suba_udasanak: () => { const id = nid(); return `<defs><clipPath id="${id}"><circle cx="50" cy="50" r="40"/></clipPath></defs>
    <g clip-path="url(#${id})"><rect x="0" y="0" width="100" height="100" fill="#FFE2B0"/><rect x="0" y="40" width="100" height="60" fill="#FFCF8A" opacity=".6"/>
      <g class="a-rise"><circle cx="50" cy="62" r="16" fill="#FFB020"/>${Array.from({ length: 9 }, (_, i) => `<path d="M50 40 L50 34" stroke="#FFB020" stroke-width="3.4" stroke-linecap="round" transform="rotate(${-80 + i * 20} 50 62)"/>`).join('')}</g>
      <path d="M0 70 Q26 56 50 68 Q74 80 100 64 L100 100 L0 100Z" fill="${P.leaf}"/><path d="M0 80 Q30 70 60 82 Q80 88 100 78 L100 100 L0 100Z" fill="${P.leafD}"/>
      <path class="a-bob" d="M26 34 q4 -4 8 0 q4 -4 8 0" stroke="${P.ink}" stroke-width="2.2" fill="none" stroke-linecap="round"/><path class="a-bob" style="animation-delay:.5s" d="M62 26 q3 -3 6 0 q3 -3 6 0" stroke="${P.ink}" stroke-width="2" fill="none" stroke-linecap="round"/></g>
    <circle cx="50" cy="50" r="40" fill="none" stroke="#fff" stroke-width="3"/>`; },
  suba_ratriyak: () => { const id = nid(); return `<defs><clipPath id="${id}"><circle cx="50" cy="50" r="40"/></clipPath></defs>
    <g clip-path="url(#${id})"><rect width="100" height="100" fill="#2D3566"/><circle cx="34" cy="28" r="40" fill="#3A4480" opacity=".5"/>
      <g class="a-bob"><path d="M58 22 A22 22 0 1 0 74 58 A17 17 0 1 1 58 22Z" fill="#FFE07A"/><circle cx="52" cy="46" r="3" fill="#F0C64A"/><circle cx="58" cy="58" r="2" fill="#F0C64A"/></g>
      ${sparkle(26, 30, .7, '#fff', 0)}${sparkle(78, 26, .5, '#fff', .7)}${sparkle(30, 70, .45, '#fff', 1.2)}${sparkle(80, 74, .6, '#fff', .4)}
      <path d="M0 84 Q30 76 60 86 Q80 90 100 82 L100 100 L0 100Z" fill="#1E2550"/></g>
    <circle cx="50" cy="50" r="40" fill="none" stroke="#fff" stroke-width="3"/>
    <g class="a-zz">${T(84, 22, 'z', 14, '#7B8AD6')}${T(92, 12, 'z', 10, '#7B8AD6')}</g>`; },

  // ---- Unit 2: about me
  mage: () => `${chr('kumari', 12, 8, 76, { pose: 'self' })}<g transform="rotate(-6 39 81)"><rect x="29" y="73" width="20" height="14" rx="2.5" fill="#fff" stroke="${P.chinaD}" stroke-width="1"/><rect x="29" y="73" width="20" height="5" rx="2" fill="${P.red}"/><path d="M32 83 q3 -2 6 0 t6 0" stroke="${P.blue}" stroke-width="1.4" fill="none"/></g>${sparkle(86, 26, .8)}`,
  nama: () => `${shadow(32)}<g class="a-bob"><g transform="rotate(-7 50 52)">
    <rect x="12" y="24" width="76" height="56" rx="10" fill="${P.red}"/><rect x="16" y="42" width="68" height="34" rx="5" fill="#fff"/>
    ${T(50, 38.5, 'HELLO', 12, '#fff', 'class="pic-label" letter-spacing="1"')}
    <path d="M24 62 q4 -10 8 -2 q3 8 7 -2 q3 -8 7 0 q4 8 8 -2 q4 -6 8 2 q3 6 7 0" stroke="${P.blue}" stroke-width="2.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g></g>`,
  oyage: () => `${shadow(26, 60)}<g class="a-bob"><g transform="rotate(6 70 50)"><rect x="50" y="28" width="42" height="34" rx="6" fill="${P.blue}"/><rect x="53" y="39" width="36" height="20" rx="3" fill="#fff"/>${T(71, 36.5, 'HELLO', 7, '#fff', 'class="pic-label"')}<path d="M57 51 q3 -5 6 -1 q3 4 6 -1 q3 -4 6 0 q3 4 6 -1" stroke="${P.blue}" stroke-width="2" fill="none" stroke-linecap="round"/></g></g>
    ${hand('point', { x: 6, y: 56, r: 80, s: .78, sleeve: P.teal, cls: 'a-poke' })}`,
  mokakda: () => `${shadow(30)}<path d="M18 46 L50 58 L50 92 L18 80Z" fill="#C98A4B"/><path d="M82 46 L50 58 L50 92 L82 80Z" fill="#B0743A"/>
    <g class="a-lid"><path d="M18 46 L50 34 L82 46 L50 58Z" fill="#E0A766"/><path d="M14 44 L50 30 L86 44 L50 56Z" fill="#D9995A" opacity=".0"/></g>
    <path d="M30 51 L42 55.5 M30 57 L38 60" stroke="#8a5424" stroke-width="2" stroke-linecap="round" opacity=".5"/>
    <g class="a-bob">${T(66, 78, '?', 22, '#fff', 'transform="skewY(-20)" style="transform-box:fill-box"')}</g>
    <g class="a-q">${T(50, 26, '?', 22, P.purple)}</g>${sparkle(22, 24, .7, P.purple, .4)}${sparkle(82, 22, .6, P.purple, 1)}`,
  hamuvima: () => `${chr('kumari', 0, 34, 52, { head: true, mood: 'happy' })}${chr('john', 48, 34, 52, { head: true, mood: 'happy' })}<g class="a-pulse">${heart(50, 22, 1.2)}</g>${sparkle(24, 18, .6, P.pink, .3)}${sparkle(78, 16, .6, P.pink, .9)}`,
  kohenda: () => `${shadow(28)}<circle cx="50" cy="56" r="32" fill="${P.blue}"/><path d="M28 40 q8 -6 14 0 q4 6 -2 12 q-6 4 -4 12 q-6 2 -10 -6 q-4 -10 2 -18Z M58 34 q10 -2 14 6 q2 8 -6 10 q-6 0 -8 6 q-4 6 -8 0 q0 -8 4 -12 q-2 -8 4 -10Z M62 70 q8 -4 12 2 q-2 8 -10 8 q-4 -4 -2 -10Z" fill="${P.leafL}"/>
    <circle cx="50" cy="56" r="32" fill="none" stroke="#fff" stroke-width="2" opacity=".5"/>
    <g class="a-bob"><path d="M50 50 C36 34 34 26 34 22 A16 16 0 0 1 66 22 C66 26 64 34 50 50Z" fill="${P.red}"/><circle cx="50" cy="22" r="10" fill="#fff"/>${T(50, 27.5, '?', 15, P.red)}</g>`,
  amerikaven: () => `${shadow(20, 30)}<rect x="17" y="8" width="5" height="86" rx="2.5" fill="${P.grayD}"/><circle cx="19.5" cy="8" r="4" fill="${P.gold}"/>
    <g class="a-flag">${[0, 1, 2, 3, 4, 5, 6].map(i => `<rect x="22" y="${14 + i * 6}" width="62" height="6" fill="${i % 2 ? '#fff' : '#D23A3F'}"/>`).join('')}
    <rect x="22" y="14" width="28" height="24" fill="#2E4C9A"/>${[0, 1, 2].map(r => [0, 1, 2, 3].map(c => `<circle cx="${26.5 + c * 6.3 + (r % 2) * 3}" cy="${18.5 + r * 7}" r="1.5" fill="#fff"/>`).join('')).join('')}
    <rect x="22" y="14" width="62" height="42" fill="url(#none)" stroke="#000" stroke-opacity=".08"/></g>`,
  lankaven: () => `${shadow(30)}<circle cx="50" cy="50" r="40" fill="${P.blueL}"/><path d="M14 40 q6 -3 12 0 M70 80 q6 -3 12 0 M74 22 q5 -3 10 0" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".8"/>
    <path d="M44 14 C50 13 52 20 56 26 C64 36 72 48 72 60 C72 74 64 84 54 86 C44 88 34 80 32 68 C30 56 34 44 38 34 C40 26 38 18 44 14Z" fill="${P.leaf}"/>
    <path d="M44 14 C50 13 52 20 56 26 C60 31 63 37 66 43 C56 38 46 38 38 34 C40 26 38 18 44 14Z" fill="${P.leafL}" opacity=".6"/>
    ${at(56, 70, .34, `<path d="M0 0 C-2 -30 4 -60 14 -86" stroke="#8B5A2B" stroke-width="7" fill="none" stroke-linecap="round"/><g transform="translate(14 -86)"><path d="M0 0 C-14 -14 -34 -12 -46 2 C-32 -4 -16 -4 0 0Z M0 0 C14 -16 36 -14 48 0 C34 -6 16 -6 0 0Z" fill="#1F7A40"/><path d="M0 0 C-4 -18 -18 -30 -32 -30 C-20 -24 -10 -14 0 0Z M0 0 C6 -18 20 -28 34 -26 C22 -22 12 -12 0 0Z" fill="#2B8F4E"/></g>`)}
    <g class="a-bob">${at(46, 42, .8, `<path d="M0 0 C-12 -14 -14 -20 -14 -24 A14 14 0 0 1 14 -24 C14 -20 12 -14 0 0Z" fill="${P.red}"/><circle cx="0" cy="-24" r="5.4" fill="#fff"/>`)}</g>`,
  vivaha_vela: () => `${shadow(28)}<circle cx="38" cy="58" r="19" fill="none" stroke="${P.goldD}" stroke-width="8"/><circle cx="38" cy="58" r="19" fill="none" stroke="${P.gold}" stroke-width="5"/>
    <circle cx="62" cy="54" r="19" fill="none" stroke="${P.goldD}" stroke-width="8"/><circle cx="62" cy="54" r="19" fill="none" stroke="${P.gold}" stroke-width="5"/>
    <path d="M54.5 41 A19 19 0 0 1 57 61" stroke="${P.goldD}" stroke-width="8" fill="none"/><path d="M54.5 41 A19 19 0 0 1 57 61" stroke="${P.gold}" stroke-width="5" fill="none"/>
    <path d="M28 48 a14 14 0 0 1 8 -6" stroke="#fff" stroke-width="2" fill="none" opacity=".7" stroke-linecap="round"/>
    <g class="a-glint"><path d="M62 35 L55 28 L58 22 L66 22 L69 28Z" fill="#BFE9FF"/><path d="M55 28 L69 28 L62 35Z" fill="#8ED3F5"/></g>
    ${sparkle(80, 22, .9, P.gold)}${sparkle(20, 30, .6, P.gold, .7)}`,
  sinhala: () => `${bubble(12, 14, 76, 60, { fill: P.maroon, stroke: P.maroon, tail: 'bl' })}<g class="a-bob">${T(50, 60, 'අ', 40, '#fff', 'class="pic-si"')}</g>${sparkle(84, 14, .8, P.gold)}`,
  ingrisi: () => `${bubble(12, 14, 76, 60, { fill: P.blue, stroke: P.blue, tail: 'br' })}<g class="a-bob">${T(50, 57, 'Aa', 34, '#fff', 'class="pic-num"')}</g>${sparkle(16, 14, .8, P.gold, .5)}`,
  tikak: () => `${shadow(22, 42)}${hand('pinch', { x: 36, y: 82, s: 1.6, sleeve: P.purple })}<circle class="a-twinkle" cx="68.5" cy="48.5" r="1.8" fill="${P.gold}"/>${sparkle(80, 30, .6, P.gold, .5)}`,
  kata_karanava: () => `${bubble(8, 14, 54, 34, { fill: P.blue, stroke: P.blue, tail: 'bl' })}${[22, 35, 48].map((x, i) => `<circle class="a-dot" style="animation-delay:${i * .18}s" cx="${x}" cy="31" r="4" fill="#fff"/>`).join('')}
    ${bubble(40, 52, 52, 32, { fill: P.orange, stroke: P.orange, tail: 'br' })}${[54, 66, 78].map((x, i) => `<circle class="a-dot" style="animation-delay:${.6 + i * .18}s" cx="${x}" cy="68" r="4" fill="#fff"/>`).join('')}`,
  terenava: () => `${shadow(18)}<g class="a-glow">${Array.from({ length: 7 }, (_, i) => `<path d="M50 6 L50 13" stroke="${P.gold}" stroke-width="3.4" stroke-linecap="round" transform="rotate(${-90 + i * 30} 50 40)"/>`).join('')}</g>
    <path d="M50 16 A24 24 0 0 1 64 59 L64 68 L36 68 L36 59 A24 24 0 0 1 50 16Z" fill="${P.yellow}"/><path d="M40 26 a14 14 0 0 0 -4 14" stroke="#fff" stroke-width="3.4" fill="none" stroke-linecap="round" opacity=".8"/>
    <path d="M44 66 L44 54 q1.5 -5 3 0 q1.5 5 3 0 q1.5 -5 3 0 q1.5 5 3 0 L56 66" stroke="${P.orange}" stroke-width="2.2" fill="none" stroke-linejoin="round" stroke-linecap="round"/>
    <rect x="37" y="68" width="26" height="6" rx="2" fill="${P.gray}"/><rect x="38" y="74" width="24" height="6" rx="2" fill="${P.grayD}"/><rect x="42" y="80" width="16" height="7" rx="3.5" fill="${P.gray}"/>`,
  terenne_nae: () => `<g class="a-spin-slow"><path d="M30 26 c6 -16 26 -16 30 -4 c4 10 -14 14 -12 2 c2 -10 22 -12 26 0 c3 8 -8 12 -8 4" stroke="${P.purple}" stroke-width="3" fill="none" stroke-linecap="round"/></g>
    ${chr('nimal', 14, 30, 64, { head: true, mood: 'sad' })}${T(84, 40, '?', 18, P.purple, 'class="a-q"')}${T(16, 52, '?', 13, P.purple, 'class="a-q" style="animation-delay:.6s"')}`,
  hemin: () => `${shadow(34, 50, 86)}<g class="a-walk">
    <path class="a-leg" d="M30 74 l-2 10" stroke="${P.leafL}" stroke-width="8" stroke-linecap="round"/><path class="a-leg2" d="M64 74 l2 10" stroke="${P.leafL}" stroke-width="8" stroke-linecap="round"/>
    <path d="M76 66 C80 52 96 52 96 62 C96 70 88 72 80 72Z" fill="${P.leafL}"/><circle cx="88" cy="60" r="2.4" fill="${P.ink}"/><path d="M90 66 q-3 2 -6 1" stroke="${P.ink}" stroke-width="1.6" fill="none" stroke-linecap="round"/>
    <path d="M14 76 C14 44 30 32 46 32 C62 32 80 44 80 76Z" fill="${P.leaf}"/><path d="M12 76 L82 76 Q82 81 77 81 L17 81 Q12 81 12 76Z" fill="#E1C068"/>
    <path d="M30 48 L42 42 L54 48 L54 60 L42 66 L30 60Z" fill="${P.leafD}" opacity=".55"/><path d="M60 50 L70 56 L70 68 M24 54 L20 66 M42 66 L42 76 M54 60 L64 66 M30 60 L22 68" stroke="${P.leafD}" stroke-width="2.4" opacity=".55" fill="none"/>
    <path class="a-leg2" d="M22 76 l-6 8" stroke="${P.leafL}" stroke-width="8" stroke-linecap="round"/><path class="a-leg" d="M72 76 l4 8" stroke="${P.leafL}" stroke-width="8" stroke-linecap="round"/></g>
    <path d="M6 58 h6 M3 66 h7" stroke="${P.gray}" stroke-width="2.4" stroke-linecap="round" opacity=".7"/>`,
  ayet: () => `${shadow(28)}<g class="a-spin-slow"><path d="M50 18 A30 30 0 0 1 80 48" stroke="${P.green}" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M88 40 L80 54 L70 42Z" fill="${P.green}"/>
    <path d="M50 78 A30 30 0 0 1 20 48" stroke="${P.blue}" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M12 56 L20 42 L30 54Z" fill="${P.blue}"/></g>
    ${sparkle(50, 48, 1.1, P.gold)}`,
  kiyanna: () => `${chr('kumari', 2, 20, 66, { head: true, cls: 'talking' })}${[0, 1, 2].map(i => `<path class="a-wave-out" style="animation-delay:${i * .3}s" d="M${70 + i * 8} ${38 - i * 4} q${6 + i * 2} ${15 + i * 4} 0 ${30 + i * 8}" stroke="${P.orange}" stroke-width="3.6" fill="none" stroke-linecap="round"/>`).join('')}`,

  // ---- Unit 3: food & drink
  vatura: () => `${shadow(22)}<g class="a-drop"><path d="M50 4 C44 12 42 16 42 19 A8 8 0 0 0 58 19 C58 16 56 12 50 4Z" fill="${P.water}"/></g>
    <path d="M28 30 L72 30 L66 88 Q65 92 60 92 L40 92 Q35 92 34 88Z" fill="#EAF7FD" stroke="#CDE7F3" stroke-width="2"/>
    <path d="M30.5 46 L69.5 46 L66 88 Q65 91 60 91 L40 91 Q35 91 34 88Z" fill="${P.water}" opacity=".85"/><ellipse cx="50" cy="46" rx="19.5" ry="3" fill="#B8E6FA"/>
    ${[[42, 80, 0], [56, 72, .8], [48, 62, 1.5]].map(([x, y, d]) => `<circle class="a-bubble" style="animation-delay:${d}s" cx="${x}" cy="${y}" r="2.2" fill="#fff" opacity=".8"/>`).join('')}
    <path d="M35 36 L38.5 84" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".8"/>`,
  te: () => `${shadow(30)}${cup(50, 70, 1.05, P.tea)}`,
  kopi: () => `${shadow(26)}${steam(46, 24, 1)}<path d="M66 40 C82 38 82 62 64 62" stroke="#2E6B5E" stroke-width="7" fill="none" stroke-linecap="round"/>
    <path d="M24 30 L70 30 L66 82 Q65 88 58 88 L36 88 Q29 88 28 82Z" fill="#3D8B7A"/><path d="M24 30 L70 30 L69 40 L25 40Z" fill="#fff" opacity=".12"/>
    <ellipse cx="47" cy="30" rx="23" ry="5.5" fill="#2E6B5E"/><ellipse cx="47" cy="30.5" rx="20" ry="4" fill="${P.coffee}"/><path d="M42 30 q2.5 -2.6 5 0 q2.5 -2.6 5 0 l-5 2.6Z" fill="#E8C9A0"/>
    <path d="M32 46 l2 32" stroke="#fff" stroke-width="3.4" stroke-linecap="round" opacity=".35"/>`,
  kiri: () => `${shadow(30)}<path d="M30 30 L30 24 L46 24 L46 30 C52 36 54 42 54 50 L54 84 Q54 90 48 90 L28 90 Q22 90 22 84 L22 50 C22 42 24 36 30 30Z" fill="#fff" stroke="#DCE3EC" stroke-width="2"/>
    <rect x="29" y="14" width="18" height="11" rx="3" fill="${P.blue}"/><rect x="22" y="54" width="32" height="20" fill="${P.blue}"/>${T(38, 68, 'MILK', 8, '#fff', 'class="pic-label"')}
    <path d="M27 40 l0 10" stroke="#E6EDF5" stroke-width="3" stroke-linecap="round"/>
    <path d="M60 52 L82 52 L79 88 Q78.5 91 76 91 L66 91 Q63.5 91 63 88Z" fill="#fff" stroke="#DCE3EC" stroke-width="2"/><path d="M61 60 L81 60 L79 88 Q78.5 90 76 90 L66 90 Q63.5 90 63 88Z" fill="#F6F7FA"/>
    <g class="a-drop"><path d="M71 38 C68 42 67 44 67 45.5 A4 4 0 0 0 75 45.5 C75 44 74 42 71 38Z" fill="#fff" stroke="#DCE3EC" stroke-width="1.4"/></g>`,
  one: () => `${chr('nimal', 2, 38, 58, { head: true })}${thought(66, 28, 24, 20, `<g class="a-pulse">${heart(66, 29, 1.5)}</g>`, 46, 54)}`,
  epa: () => `${shadow(30)}${cup(32, 70, .82, P.tea, false)}${xBadge(32, 34, 9)}${hand('open', { x: 72, y: 90, s: 1.05, sleeve: P.red, cls: 'a-push' })}`,
  sini: () => `${shadow(30)}<path d="M18 50 C18 76 32 86 50 86 C68 86 82 76 82 50Z" fill="#fff" stroke="${P.chinaD}" stroke-width="2"/><path d="M19 58 C30 64 70 64 81 58" stroke="${P.blue}" stroke-width="3" fill="none"/>
    ${[30, 42, 54, 66].map(x => `<circle cx="${x}" cy="${72 - ((x - 48) * (x - 48)) / 180}" r="2.2" fill="${P.blue}"/>`).join('')}
    <ellipse cx="50" cy="50" rx="32" ry="7" fill="#F4F1EA" stroke="${P.chinaD}" stroke-width="2"/><ellipse cx="50" cy="49" rx="26" ry="4.5" fill="#fff"/>
    <g class="a-lid"><path d="M22 44 C22 30 78 30 78 44Z" fill="#fff" stroke="${P.chinaD}" stroke-width="2"/><circle cx="50" cy="30" r="5" fill="${P.blue}"/></g>
    <g class="a-bob"><rect x="72" y="66" width="12" height="12" rx="2" fill="#fff" stroke="${P.chinaD}" stroke-width="1.6" transform="rotate(12 78 72)"/><rect x="80" y="78" width="10" height="10" rx="2" fill="#fff" stroke="${P.chinaD}" stroke-width="1.6" transform="rotate(-10 85 83)"/></g>${sparkle(88, 60, .5, P.gold, .5)}`,
  ekak: () => `${shadow(20)}<g class="a-bob">${coconut(50, 64, 1.45)}<path d="M54 30 L64 8" stroke="${P.red}" stroke-width="3.4" stroke-linecap="round"/><path d="M64 8 l6 -2" stroke="${P.red}" stroke-width="3.4" stroke-linecap="round"/></g>`,
  dekak: () => `${shadow(34)}<g class="a-bob">${coconut(32, 66, 1.2)}</g><g class="a-bob" style="animation-delay:.4s">${coconut(68, 66, 1.2)}</g>`,
  tunak: () => `${shadow(38)}${coconut(28, 74, 1)}${coconut(72, 74, 1)}<g class="a-bob">${coconut(50, 46, 1)}</g>`,
  denna: () => `${shadow(30)}<g class="a-bob">${cup(50, 28, .62, P.tea, false)}</g>
    <path d="M12 62 C12 82 30 92 50 92 C70 92 88 82 88 62 Q84 57 80 62 Q76 57 72 62 Q68 57 64 62 Q60 58 56 64 L50 69 L44 64 Q40 58 36 62 Q32 57 28 62 Q24 57 20 62 Q16 57 12 62Z" fill="${P.skin}" stroke="${P.skinD}" stroke-width="2.4" stroke-linejoin="round"/>
    <path d="M20 62 q1 5 3 9 M28 62 q1 5 2 9 M36 62 q0 5 1 8 M64 62 q0 5 -1 8 M72 62 q-1 5 -2 9 M80 62 q-1 5 -3 9 M50 69 L50 92" stroke="${P.skinD}" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".75"/>
    <rect x="0" y="60" width="16" height="13" rx="4" fill="${P.blue}" transform="rotate(35 8 66)"/><rect x="84" y="60" width="16" height="13" rx="4" fill="${P.blue}" transform="rotate(-35 92 66)"/>`,
  bat: () => `${shadow(38, 50, 84)}<ellipse cx="50" cy="62" rx="42" ry="22" fill="${P.chinaD}"/><ellipse cx="50" cy="59" rx="42" ry="22" fill="#fff"/><ellipse cx="50" cy="59" rx="34" ry="16" fill="${P.china}"/>
    <path d="M30 58 C30 44 54 40 60 50 C66 58 58 68 44 68 C34 68 30 64 30 58Z" fill="#fff" stroke="#E6E1D6" stroke-width="1.4"/>${[[38, 52], [46, 56], [52, 50], [40, 60], [50, 62]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="2" ry="1" fill="#E6E1D6"/>`).join('')}
    <ellipse cx="68" cy="52" rx="10" ry="6" fill="#F2B52E"/><ellipse cx="66" cy="66" rx="9" ry="5.5" fill="#D8562C"/><ellipse cx="25" cy="66" rx="8" ry="5" fill="${P.leaf}"/>
    <circle cx="70" cy="64" r="2" fill="#fff" opacity=".5"/><path d="M60 44 l4 4" stroke="${P.red}" stroke-width="2.4" stroke-linecap="round"/>${steam(48, 40, .7)}`,
  kari: () => `${shadow(32)}${steam(48, 34, .9)}<path d="M14 50 C14 76 30 88 50 88 C70 88 86 76 86 50Z" fill="#B5652B"/><path d="M14 50 C16 62 22 70 30 76" stroke="#fff" stroke-width="3" fill="none" opacity=".25" stroke-linecap="round"/>
    <ellipse cx="50" cy="50" rx="38" ry="10" fill="#8A4A1C"/><ellipse cx="50" cy="51" rx="33" ry="7.4" fill="#E8891C"/>
    ${[[38, 50, 4], [54, 48, 3.4], [62, 53, 3], [44, 54, 2.6]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#C4561C"/>`).join('')}<path d="M48 52 l6 2" stroke="${P.leafD}" stroke-width="2.4" stroke-linecap="round"/>
    <path d="M8 50 Q4 50 6 54 L14 56 M92 50 Q96 50 94 54 L86 56" stroke="#8A4A1C" stroke-width="4" fill="none" stroke-linecap="round"/>`,
  pan: () => `${shadow(36)}<g class="a-bob"><path d="M14 66 C10 40 26 26 50 26 C74 26 90 40 86 66 Q85 74 76 74 L24 74 Q15 74 14 66Z" fill="#D88B3C"/>
    <path d="M18 52 C20 36 34 30 50 30 C66 30 80 36 82 52 C72 42 28 42 18 52Z" fill="#E9A85A"/>
    ${[34, 50, 66].map(x => `<path d="M${x - 5} 40 Q${x} 34 ${x + 6} 38" stroke="#B86E2A" stroke-width="3.4" fill="none" stroke-linecap="round"/>`).join('')}
    <path d="M14 66 Q15 74 24 74 L76 74 Q85 74 86 66 Q50 72 14 66Z" fill="#B86E2A"/></g>
    <path d="M60 80 C58 70 64 64 72 64 C80 64 86 70 84 80 Q84 86 78 86 L66 86 Q60 86 60 80Z" fill="#F6E3B8" stroke="#D88B3C" stroke-width="3"/>`,
  kama: () => `${shadow(34)}${fork(28, 36, -28, 1)}${spoon(72, 36, 28, 1)}<path d="M18 56 C18 80 34 88 50 88 C66 88 82 80 82 56Z" fill="${P.blue}"/><path d="M22 62 C30 70 70 70 78 62" stroke="#fff" stroke-width="2.4" fill="none" opacity=".4"/>
    <ellipse cx="50" cy="56" rx="32" ry="8" fill="${P.blueD}"/><path d="M24 56 C26 40 42 36 50 36 C58 36 74 40 76 56Z" fill="#fff"/>
    <ellipse cx="40" cy="48" rx="7" ry="4" fill="#F2B52E"/><ellipse cx="58" cy="46" rx="6" ry="3.6" fill="#D8562C"/><ellipse cx="50" cy="53" rx="5" ry="3" fill="${P.leaf}"/>${steam(48, 30, .7)}`,
  kaevada: () => `${shadow(34)}${plate(44, 72, 36, 13)}${spoon(76, 50, 40, .8)}${bubble(52, 8, 38, 30, { stroke: P.orange, tail: 'bl' })}<g class="a-bob">${T(71, 32, '?', 24, P.orange)}</g>${chr('kumari', 4, 18, 46, { head: true })}`,
  kaeva: () => `${shadow(34)}${plate(46, 70, 38, 14)}${[[36, 68], [44, 73], [55, 66], [50, 70]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="2" ry="1" fill="#E3DACB"/>`).join('')}${spoon(64, 60, 70, .8)}${checkBadge(76, 30, 13)}${chr('nimal', 2, 12, 46, { head: true, mood: 'happy' })}`,
  tama: () => `${shadow(22)}<rect x="24" y="10" width="52" height="8" rx="4" fill="${P.brown}"/><rect x="24" y="82" width="52" height="8" rx="4" fill="${P.brown}"/>
    <path d="M30 18 L70 18 C70 34 56 42 52 50 C56 58 70 66 70 82 L30 82 C30 66 44 58 48 50 C44 42 30 34 30 18Z" fill="#EAF6FC" stroke="#CDE7F3" stroke-width="2"/>
    <path class="a-sand-top" d="M36 26 L64 26 C62 34 54 40 50 46 C46 40 38 34 36 26Z" fill="${P.gold}"/>
    <path class="a-sand-fall" d="M50 47 L50 74" stroke="${P.gold}" stroke-width="2.2" stroke-dasharray="3 3"/>
    <path class="a-sand-bot" d="M34 81 C38 70 46 66 50 66 C54 66 62 70 66 81Z" fill="${P.gold}"/>
    <rect x="27" y="18" width="4" height="64" rx="2" fill="${P.brownD}"/><rect x="69" y="18" width="4" height="64" rx="2" fill="${P.brownD}"/>`,
  rasayi: () => `${chr('aliya', 6, 22, 62, { mood: 'happy' })}${spoon(74, 46, 28, 1)}<ellipse cx="72" cy="42" rx="6" ry="4" fill="${P.orange}" transform="rotate(28 72 42)"/>${floatHeart(86, 22, .8, 0)}${floatHeart(66, 14, .6, .9)}${sparkle(20, 18, .8, P.gold, .4)}`,
  saerayi: () => `${shadow(30)}<g class="a-flicker">${[[40, 30, 1], [56, 24, 1.2], [70, 34, .9]].map(([x, y, s]) => at(x, y, s, `<path d="M0 -14 C4 -8 8 -4 8 2 A8 8 0 0 1 -8 2 C-8 -4 -3 -6 0 -14Z" fill="${P.orange}"/><path d="M0 -6 C2 -3 4 0 4 3 A4 4 0 0 1 -4 3 C-4 0 -1 -2 0 -6Z" fill="${P.yellow}"/>`)).join('')}</g>
    <path d="M22 54 C40 46 64 50 78 62 C86 70 84 80 76 78 C64 72 46 66 30 66 C22 66 18 58 22 54Z" fill="${P.red}"/><path d="M30 56 C44 52 60 56 72 64" stroke="#fff" stroke-width="3" fill="none" opacity=".4" stroke-linecap="round"/>
    <path d="M22 54 C16 50 14 46 16 42 M20 58 C14 58 10 54 12 48" stroke="${P.leafD}" stroke-width="5" fill="none" stroke-linecap="round"/>
    <path class="a-drip" d="M88 46 q-3 5 0 7 q3 -2 0 -7Z" fill="${P.water}"/>`,
  godak: () => `${shadow(34)}<path d="M14 86 L88 86" stroke="${P.grayD}" stroke-width="3" stroke-linecap="round"/>
    ${[[18, 66, P.blue, 0], [36, 52, P.green, .15], [54, 36, P.orange, .3], [72, 18, P.red, .45]].map(([x, y, c, d]) => `<rect class="a-grow" style="animation-delay:${d}s" x="${x}" y="${y}" width="13" height="${86 - y}" rx="3.5" fill="${c}"/>`).join('')}
    <g class="a-bob"><path d="M22 52 L60 22" stroke="${P.ink}" stroke-width="3.4" stroke-linecap="round" opacity=".7"/><path d="M50 20 L62 20 L60 32" stroke="${P.ink}" stroke-width="3.4" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity=".7"/></g>`,
  bila: () => `${shadow(26)}<g class="a-bob"><path d="M26 10 L74 10 L74 88 L68 83 L62 88 L56 83 L50 88 L44 83 L38 88 L32 83 L26 88Z" fill="#fff" stroke="${P.chinaD}" stroke-width="2" stroke-linejoin="round"/>
    ${[22, 32, 42, 52].map((y, i) => `<path d="M33 ${y} L${i % 2 ? 52 : 56} ${y} M60 ${y} L67 ${y}" stroke="${P.gray}" stroke-width="3" stroke-linecap="round"/>`).join('')}
    <path d="M32 62 L68 62" stroke="${P.ink}" stroke-width="2" stroke-dasharray="3 3" opacity=".4"/>${T(42, 75, CUR(), 11, P.ink, curFont())}${T(60, 75, '450', 10, P.ink, 'class="pic-num"')}</g>
    <g transform="rotate(35 80 60)"><rect x="76" y="34" width="7" height="40" rx="2" fill="${P.blue}"/><path d="M76 74 L79.5 84 L83 74Z" fill="#F2D6A6"/></g>`,

  // ---- Unit 4: numbers & money
  rupiyal: () => `${shadow(34)}<g transform="rotate(-10 50 54)"><rect x="12" y="30" width="72" height="40" rx="5" fill="#6FAE6A"/><rect x="16" y="34" width="64" height="32" rx="3" fill="none" stroke="#fff" stroke-width="1.6" opacity=".6"/></g>
    <g class="a-bob"><rect x="16" y="38" width="72" height="40" rx="5" fill="#8E5BB5"/><rect x="20" y="42" width="64" height="32" rx="3" fill="none" stroke="#fff" stroke-width="1.6" opacity=".6"/>
    <ellipse cx="52" cy="58" rx="13" ry="11" fill="#fff" opacity=".9"/>${T(52, 63, CUR(), 13, '#8E5BB5', curFont())}${T(28, 50, '100', 7.5, '#fff', 'class="pic-num"')}${T(76, 74, '100', 7.5, '#fff', 'class="pic-num"')}</g>
    <ellipse cx="80" cy="84" rx="12" ry="5" fill="${P.goldD}"/><ellipse cx="80" cy="80" rx="12" ry="5" fill="${P.gold}"/><ellipse cx="80" cy="76" rx="12" ry="5" fill="${P.goldD}"/><ellipse cx="80" cy="72.5" rx="12" ry="5" fill="${P.gold}"/><ellipse cx="80" cy="72.5" rx="7" ry="2.6" fill="none" stroke="${P.goldD}" stroke-width="1.4"/>`,
  kiyada: () => `${shadow(26, 46)}<g class="a-swing-tag">${tag(46, 58, -14, P.gold, `${T(-6, 2, '?', 26, '#fff')}`, 1.35)}</g>`,
  meka: () => `${shadow(26)}<rect x="32" y="64" width="36" height="26" rx="5" fill="${P.orange}"/><rect x="32" y="64" width="36" height="7" rx="3" fill="${P.orangeD}"/><rect x="47" y="64" width="6" height="26" fill="${P.gold}"/>
    <ellipse class="a-glow" cx="50" cy="77" rx="26" ry="18" fill="${P.gold}" opacity=".18"/>${hand('point', { x: 54, y: 4, r: 180, s: .9, sleeve: P.teal, cls: 'a-poke' })}`,
  eka_that: () => `${shadow(16, 82, 70)}<rect x="74" y="54" width="16" height="13" rx="3" fill="${P.orange}"/><rect x="74" y="54" width="16" height="4" rx="2" fill="${P.orangeD}"/>
    <path class="a-dash" d="M52 52 Q66 44 74 52" stroke="${P.gray}" stroke-width="2.6" fill="none" stroke-dasharray="4 5" stroke-linecap="round"/>
    ${hand('point', { x: 10, y: 74, r: 64, s: .78, sleeve: P.teal, cls: 'a-poke' })}`,
  ganan_vadiyi: () => `${shadow(26, 44)}${tag(42, 60, -12, P.red, `${T(-6, 0, CUR(), 13, '#fff', curFont())}`, 1.2)}
    <g class="a-up">${[[78, 36], [88, 52]].map(([x, y]) => `<path d="M${x} ${y} L${x} ${y - 18} M${x - 7} ${y - 11} L${x} ${y - 18} L${x + 7} ${y - 11}" stroke="${P.red}" stroke-width="4.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`).join('')}</g>
    <path class="a-drip" d="M22 22 q-4 6 0 8 q4 -2 0 -8Z" fill="${P.water}"/>`,
  adu_karanna: () => `${shadow(26, 44)}${tag(42, 54, -12, P.green, `${T(-6, 0, CUR(), 13, '#fff', curFont())}`, 1.2)}
    <g class="a-down"><path d="M82 44 L82 76 M72 66 L82 76 L92 66" stroke="${P.green}" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>`,
  amba: () => `${shadow(30)}<g class="a-bob"><path d="M26 56 C22 34 44 18 64 24 C84 30 88 54 76 72 C66 86 44 90 34 80 C28 74 28 64 26 56Z" fill="#F5A623"/>
    <path d="M40 30 C52 22 74 26 80 44 C82 52 80 60 76 66 C76 50 64 34 40 30Z" fill="#F7C548"/><path d="M28 62 C30 74 38 82 50 84 C40 84 30 78 28 62Z" fill="#E27D12"/>
    <path d="M38 42 q2 -8 10 -10" stroke="#fff" stroke-width="3.4" fill="none" stroke-linecap="round" opacity=".7"/>
    <path d="M60 24 C60 18 62 14 66 12" stroke="${P.brownD}" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M64 14 C72 4 88 6 92 14 C84 20 70 20 64 14Z" fill="${P.leaf}"/><path d="M66 14 C74 12 84 12 90 14" stroke="${P.leafD}" stroke-width="1.6" fill="none"/></g>`,
};
// ------------------------------------------------------------------ more shared bits (units 5–8)
const ring = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${P.gold}" opacity=".16"/><circle class="a-spin-slow" cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${P.gold}" stroke-width="2.6" stroke-dasharray="5 4"/>`;
const arrowDown = (x, y) => `<g class="a-bob"><path d="M${x - 7} ${y - 10} L${x + 7} ${y - 10} L${x} ${y}Z" fill="${P.orange}"/></g>`;
const figure = (x, y, s, c) => at(x, y, s, `<circle cx="0" cy="-30" r="10" fill="${c}"/><path d="M-16 0 C-16 -14 -9 -18 0 -18 C9 -18 16 -14 16 0Z" fill="${c}"/>`);
const numBadge = (x, y, n, c) => badge(x, y, 11, c, T(0, 5.5, n, 15, '#fff', 'class="pic-num"'));
const pin = (x, y, s = 1, c = P.red) => at(x, y, s, `<path d="M0 0 C-12 -14 -14 -20 -14 -24 A14 14 0 0 1 14 -24 C14 -20 12 -14 0 0Z" fill="${c}"/><circle cx="0" cy="-24" r="5.4" fill="#fff"/>`);
const church = (x, y, s) => at(x, y, s, `<rect x="-26" y="-34" width="52" height="34" fill="#FBF7EE" stroke="#E4DCCB" stroke-width="1.5"/><path d="M-32 -32 L0 -56 L32 -32Z" fill="#C0533A"/><rect x="-8" y="-82" width="16" height="32" fill="#FBF7EE" stroke="#E4DCCB" stroke-width="1.5"/><path d="M-11 -82 L0 -94 L11 -82Z" fill="#C0533A"/><path d="M0 -107 V-94 M-5 -102 H5" stroke="${P.gold}" stroke-width="3" stroke-linecap="round"/><path d="M-7 0 V-14 a7 7 0 0 1 14 0 V0Z" fill="#7A4A2A"/><path d="M-20 -12 V-20 a4 4 0 0 1 8 0 V-12Z M12 -12 V-20 a4 4 0 0 1 8 0 V-12Z" fill="#7FB6D9"/><circle cx="0" cy="-42" r="4" fill="#7FB6D9"/><path d="M-3 -74 a3 3 0 0 1 6 0 V-68 H-3Z" fill="#3E3346"/>`);
const house = (x, y, s) => at(x, y, s, `<rect x="-30" y="-36" width="60" height="36" fill="#FFF3DC"/><path d="M-38 -34 L0 -64 L38 -34Z" fill="#C0533A"/><path d="M-38 -34 L38 -34 L36 -30 L-36 -30Z" fill="#9E3F2A"/><rect x="-8" y="-22" width="16" height="22" rx="2" fill="#7A4A2A"/><rect x="-24" y="-26" width="12" height="11" rx="1.5" fill="#FFD36E"/><rect x="12" y="-26" width="12" height="11" rx="1.5" fill="#FFD36E"/><circle cx="4" cy="-11" r="1.4" fill="${P.gold}"/>`);
const sunIcon = (x, y, r = 12) => `<g transform="translate(${x} ${y})"><g class="a-spin-slow">${Array.from({ length: 10 }, (_, i) => `<path d="M0 -${r + 4} v-6" stroke="${P.gold}" stroke-width="3" stroke-linecap="round" transform="rotate(${i * 36})"/>`).join('')}</g><circle r="${r}" fill="${P.gold}"/></g>`;
const rays = (x, y, n = 9, len = 60, op = .3, a0 = 200, a1 = 340) => `<g class="a-glow">${Array.from({ length: n }, (_, i) => { const a = (a0 + i * (a1 - a0) / (n - 1)) * Math.PI / 180; return `<path d="M${x} ${y} l${(len * Math.cos(a)).toFixed(1)} ${(-len * Math.sin(a)).toFixed(1)}" stroke="${P.gold}" stroke-width="6" stroke-linecap="round" opacity="${op}"/>`; }).join('')}</g>`;
const cloudShape = (x, y, s = 1) => at(x, y, s, `<circle cx="-14" cy="0" r="10" fill="#fff"/><circle cx="0" cy="-6" r="14" fill="#fff"/><circle cx="16" cy="0" r="11" fill="#fff"/><rect x="-24" y="0" width="50" height="10" rx="5" fill="#fff"/>`);
const note = (x, y, c = P.purple) => at(x, y, 1, `<path d="M0 0 V-16 L10 -19 V-3" stroke="${c}" stroke-width="2.6" fill="none"/><ellipse cx="-3" cy="0" rx="4" ry="3" fill="${c}"/><ellipse cx="7" cy="-3" rx="4" ry="3" fill="${c}"/>`);
const gear = (x, y, r, c) => `<g transform="translate(${x} ${y})">${Array.from({ length: 8 }, (_, i) => `<rect x="-3.5" y="${-r - 5}" width="7" height="8" rx="1.5" fill="${c}" transform="rotate(${i * 45})"/>`).join('')}<circle r="${r}" fill="${c}"/><circle r="${(r * .4).toFixed(1)}" fill="#fff"/></g>`;
const walker = (x, y, s, c, flip = false) => at(x, y, s, `<g transform="scale(${flip ? -1 : 1} 1)"><circle cx="3" cy="-60" r="8.5" fill="${c}"/><path class="a-leg2" d="M1 -46 L-9 -32" stroke="${c}" stroke-width="6.5" stroke-linecap="round"/><path class="a-leg" d="M-3 -24 L-9 0" stroke="${c}" stroke-width="8" stroke-linecap="round"/><path class="a-leg2" d="M-3 -24 L5 0" stroke="${c}" stroke-width="8" stroke-linecap="round"/><path d="M1 -48 L-3 -24" stroke="${c}" stroke-width="11" stroke-linecap="round"/><path class="a-leg" d="M1 -46 L11 -32" stroke="${c}" stroke-width="6.5" stroke-linecap="round"/></g>`);
const openBook = (x, y, s, cover = P.blue, lines = true) => at(x, y, s, `<path d="M-40 -4 Q-20 -12 0 -4 Q20 -12 40 -4 L40 30 Q20 22 0 30 Q-20 22 -40 30Z" fill="${cover}"/><path d="M-37 -8 Q-18 -15 0 -7 L0 26 Q-18 18 -37 25Z" fill="#fff"/><path d="M37 -8 Q18 -15 0 -7 L0 26 Q18 18 37 25Z" fill="#F4F1EA"/>${lines ? [0, 6, 12].map(d => `<path d="M-31 ${-4 + d} Q-17 ${-9 + d} -5 ${-3 + d} M5 ${-3 + d} Q17 ${-9 + d} 31 ${-4 + d}" stroke="#B8BECB" stroke-width="2" fill="none"/>`).join('') : ''}`);
const calendar = (inner, head = P.red, label = '') => `${shadow(30)}<rect x="14" y="18" width="72" height="70" rx="10" fill="#fff" stroke="${P.chinaD}" stroke-width="2.4"/><path d="M14 28 Q14 18 24 18 L76 18 Q86 18 86 28 L86 36 L14 36Z" fill="${head}"/><rect x="28" y="10" width="6" height="16" rx="3" fill="${P.grayD}"/><rect x="66" y="10" width="6" height="16" rx="3" fill="${P.grayD}"/>${label ? T(50, 32, label, 8.5, '#fff', 'class="pic-label"') : ''}${inner}`;
const cell = (i) => [21 + (i % 7) * 8.8, 44 + Math.floor(i / 7) * 13];
const pair = (big, small, hiBig) => `${hiBig ? ring(34, 40, 28) : ring(78, 61, 19)}${chr(big, 4, 12, 60)}${chr(small, 58, 42, 40)}${hiBig ? arrowDown(34, 12) : arrowDown(78, 42)}`;
const couple = (hiM) => `${hiM ? ring(28, 37, 25) : ring(72, 37, 25)}${chr('thaththa', 0, 10, 56)}${chr('amma', 44, 10, 56)}<g class="a-pulse">${heart(50, 16, .8)}</g>${hiM ? arrowDown(28, 12) : arrowDown(72, 12)}`;
const sign = (inner) => `${shadow(16, 50, 93)}<rect x="47" y="60" width="6" height="33" fill="${P.grayD}"/><g class="a-bob"><circle cx="50" cy="38" r="30" fill="#fff"/><circle cx="50" cy="38" r="26" fill="${P.blue}"/>${inner}</g>`;

Object.assign(ART, {
  // ---- Unit 5: family
  amma: () => `${chr('amma', 12, 8, 76, { mood: 'happy' })}${floatHeart(86, 30, .8, 0)}${floatHeart(16, 40, .6, .9)}`,
  thaththa: () => `${chr('thaththa', 12, 8, 76)}${sparkle(86, 26, .8)}${sparkle(14, 34, .6, P.gold, .7)}`,
  pavula: () => `<g class="a-pulse">${heart(50, 11, 1)}</g>${chr('thaththa', 0, 14, 52)}${chr('amma', 48, 14, 52)}${chr('putha', 16, 50, 38)}${chr('duva', 46, 50, 38)}`,
  meya: () => `${ring(64, 44, 30)}${chr('kumari', 36, 16, 56, { head: true })}${hand('point', { x: 12, y: 98, r: 42, s: .7, sleeve: P.blue, cls: 'a-poke' })}`,
  kavda: () => `${shadow(26)}<g class="a-bob"><circle cx="50" cy="36" r="20" fill="${P.gray}"/><path d="M18 90 C18 66 32 58 50 58 C68 58 82 66 82 90Z" fill="${P.gray}"/>${T(50, 45, '?', 26, '#fff')}</g>${sparkle(84, 22, .7, P.purple)}${sparkle(16, 30, .5, P.purple, .6)}`,
  ayya: () => pair('nimal', 'putha', true),
  akka: () => pair('kumari', 'duva', true),
  malli: () => pair('nimal', 'putha', false),
  nangi: () => pair('kumari', 'duva', false),
  eya: () => `${shadow(14, 78, 84)}${ring(78, 59, 17)}${chr('john', 62, 44, 32)}<path class="a-dash" d="M40 66 L58 62" stroke="${P.gray}" stroke-width="2.4" stroke-dasharray="4 4" stroke-linecap="round"/>${hand('point', { x: 8, y: 84, r: 72, s: .6, sleeve: P.blue, cls: 'a-poke' })}`,
  innava: () => `${shadow(34)}<rect x="18" y="12" width="64" height="80" rx="6" fill="${P.brown}"/><rect x="25" y="19" width="50" height="73" fill="#FFE7A8"/>${chr('nimal', 22, 34, 56, { mood: 'wave' })}${checkBadge(82, 18, 11)}`,
  kenek: () => `${shadow(20)}<g class="a-bob">${figure(50, 88, 1.5, P.blue)}</g>${numBadge(76, 22, '1', P.orange)}`,
  dennek: () => `${shadow(34)}<g class="a-bob">${figure(32, 88, 1.3, P.blue)}</g><g class="a-bob" style="animation-delay:.35s">${figure(68, 88, 1.3, P.green)}</g>${numBadge(84, 20, '2', P.orange)}`,
  lamayi: () => `${chr('putha', 0, 20, 56, { mood: 'wave' })}${chr('duva', 44, 20, 56, { mood: 'happy' })}${sparkle(50, 12, .8)}`,
  mahattaya: () => couple(true),
  birinda: () => couple(false),
  putha: () => `${chr('putha', 12, 10, 76, { mood: 'wave' })}${sparkle(86, 26, .8)}`,
  duva: () => `${chr('duva', 12, 10, 76, { mood: 'happy' })}${sparkle(14, 24, .8, P.pink)}`,
  podi: () => `${shadow(38)}${cup(34, 72, .88, P.tea, false)}${ring(80, 76, 15)}${cup(80, 80, .34, P.tea, false)}${arrowDown(80, 58)}`,
  adarei: () => `${shadow(26)}<g class="a-pulse">${heart(50, 56, 4.2)}</g>${floatHeart(18, 30, .9, 0)}${floatHeart(84, 26, .8, .8)}${floatHeart(82, 74, .6, 1.4)}`,

  // ---- Unit 6: getting around
  koheda: () => `${shadow(32)}<path d="M12 30 L36 22 L64 30 L88 22 L88 80 L64 88 L36 80 L12 88Z" fill="#E9F4E4" stroke="#BFD9B6" stroke-width="2"/><path d="M36 22 V80 M64 30 V88" stroke="#BFD9B6" stroke-width="2"/><path d="M14 64 Q30 52 46 64 T86 54" stroke="${P.blue}" stroke-width="3" fill="none" opacity=".6"/>
    <g class="a-look"><circle cx="52" cy="48" r="17" fill="#fff" fill-opacity=".6" stroke="${P.ink}" stroke-width="5"/><path d="M64 60 L78 74" stroke="${P.ink}" stroke-width="7" stroke-linecap="round"/>${T(52, 56, '?', 22, P.red)}</g>`,
  metana: () => `<ellipse cx="50" cy="84" rx="36" ry="10" fill="${P.green}" opacity=".22"/><ellipse class="a-ring" cx="50" cy="84" rx="22" ry="6" fill="none" stroke="${P.green}" stroke-width="2.4"/><ellipse cx="50" cy="84" rx="8" ry="2.6" fill="${P.green}"/><g class="a-bob">${pin(50, 80, 1.6)}</g>`,
  etana: () => `<path d="M36 84 Q64 56 100 64 L100 92 L36 92Z" fill="${P.leafL}" opacity=".6"/><g class="a-bob">${pin(80, 62, .9)}</g><path class="a-dash" d="M44 60 Q58 48 70 50" stroke="${P.gray}" stroke-width="2.4" fill="none" stroke-dasharray="4 4" stroke-linecap="round"/>${hand('point', { x: 8, y: 88, r: 58, s: .68, sleeve: P.teal, cls: 'a-poke' })}`,
  palliya: () => `${shadow(34, 50, 92)}${church(50, 91, .82)}${sparkle(84, 30, .8)}${sparkle(16, 44, .6, P.gold, .6)}`,
  toilet: () => `${shadow(30)}<rect x="22" y="10" width="56" height="82" rx="4" fill="#9AA0AE"/><rect x="27" y="15" width="46" height="77" fill="#C7CCD6"/><circle cx="66" cy="58" r="3" fill="${P.gold}"/>
    <g class="a-bob"><rect x="31" y="24" width="38" height="24" rx="5" fill="${P.blue}"/>${at(41, 45, .62, `<circle cx="0" cy="-26" r="4.6" fill="#fff"/><path d="M-6 0 V-12 Q-6 -19 0 -19 Q6 -19 6 -12 V0Z" fill="#fff"/>`)}<path d="M50 27 V45" stroke="#fff" stroke-width="1.6" opacity=".7"/>${at(59, 45, .62, `<circle cx="0" cy="-26" r="4.6" fill="#fff"/><path d="M-9 0 L0 -19 L9 0Z" fill="#fff"/>`)}</g>`,
  dakunata: () => sign(`<path d="M40 54 V38 Q40 30 48 30 H58" stroke="#fff" stroke-width="7" fill="none" stroke-linejoin="round"/><path d="M56 20 L68 30 L56 40Z" fill="#fff"/>`),
  vamata: () => sign(`<path d="M60 54 V38 Q60 30 52 30 H42" stroke="#fff" stroke-width="7" fill="none" stroke-linejoin="round"/><path d="M44 20 L32 30 L44 40Z" fill="#fff"/>`),
  kelinma: () => sign(`<path d="M50 58 V28" stroke="#fff" stroke-width="7"/><path d="M38 32 L50 17 L62 32Z" fill="#fff"/>`),
  yanna: () => { const id = nid(); return `<defs><clipPath id="${id}"><rect x="8" y="8" width="84" height="84" rx="16"/></clipPath></defs><g clip-path="url(#${id})"><rect width="100" height="100" fill="#9DD47E"/><path d="M0 0 H100 V26 Q50 20 0 26Z" fill="#CFEAFB"/><path d="M24 100 L46 24 L54 24 L80 100Z" fill="#E9D7A8"/>${[[44, 84, 0, 0], [56, 70, 0, .25], [46, 56, 0, .5], [54, 44, 0, .75], [48, 33, 0, 1]].map(([x, y, r, d], i) => at(x, y, 1 - i * .12, `<g class="a-step" style="animation-delay:${d}s"><ellipse cx="0" cy="0" rx="3.6" ry="6" fill="${P.brownD}"/><circle cx="${i % 2 ? 1.6 : -1.6}" cy="-8.4" r="1.6" fill="${P.brownD}"/></g>`)).join('')}</g><rect x="8" y="8" width="84" height="84" rx="16" fill="none" stroke="#fff" stroke-width="3"/>`; },
  haravenna: () => `${shadow(30)}<g class="a-steer"><circle cx="50" cy="52" r="33" fill="none" stroke="#3A3F52" stroke-width="9"/><circle cx="50" cy="52" r="10" fill="#3A3F52"/><path d="M19 48 Q34 42 42 50 M81 48 Q66 42 58 50 M50 62 V83" stroke="#3A3F52" stroke-width="8" stroke-linecap="round" fill="none"/><circle cx="50" cy="52" r="4" fill="${P.gold}"/></g><path d="M66 6 A44 44 0 0 1 92 30" stroke="${P.orange}" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M86 30 L93 32 L95 25" stroke="${P.orange}" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
  navattanna: () => { const oct = (r) => Array.from({ length: 8 }, (_, i) => { const a = (i * 45 + 22.5) * Math.PI / 180; return `${(50 + r * Math.cos(a)).toFixed(1)},${(40 + r * Math.sin(a)).toFixed(1)}`; }).join(' ');
    return `${shadow(16, 50, 93)}<rect x="47" y="64" width="6" height="29" fill="${P.grayD}"/><polygon points="${oct(34)}" fill="#fff"/><polygon points="${oct(30)}" fill="${P.red}"/>${hand('open', { x: 50, y: 66, s: .6, sleeve: P.redD, cls: 'a-pop' })}`; },
  yamu: () => `${chr('kumari', 4, 10, 74, { pose: 'point', mood: 'happy' })}<g class="a-wave-out">${[28, 38, 48].map(y => `<path d="M88 ${y} h9" stroke="${P.orange}" stroke-width="3.4" stroke-linecap="round"/>`).join('')}</g>`,
  gedara: () => `${shadow(38)}${house(50, 90, 1.12)}<g class="a-pulse">${heart(50, 54, .7)}</g>${sparkle(86, 22, .8)}`,
  dura: () => { const id = nid(); return `<defs><clipPath id="${id}"><rect x="6" y="8" width="88" height="84" rx="14"/></clipPath></defs><g clip-path="url(#${id})"><rect width="100" height="100" fill="#DFF1FB"/><path d="M0 54 L24 30 L42 46 L62 22 L86 44 L100 34 L100 100 L0 100Z" fill="#9FB7D4"/><path d="M0 60 Q50 50 100 60 L100 100 L0 100Z" fill="#8BCB6C"/><path d="M36 100 L49 58 L51 58 L64 100Z" fill="#B8BECB"/><path d="M50 98 V90 M50 84 V78 M50 72 V68 M50 64 V61" stroke="#fff" stroke-width="1.6"/><g class="a-bob"><path d="M50 58 V45" stroke="${P.ink}" stroke-width="1.4"/><path d="M50 45 L58 48 L50 51Z" fill="${P.red}"/></g></g><rect x="6" y="8" width="88" height="84" rx="14" fill="none" stroke="#fff" stroke-width="3"/>`; },
  langa: () => `${shadow(42)}${house(34, 88, .82)}${chr('john', 58, 40, 42, { mood: 'wave' })}<path d="M52 92 h10 M54 89 l-3 3 3 3 M60 89 l3 3 -3 3" stroke="${P.green}" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
  bas: () => `${shadow(42, 50, 88)}<g class="a-bob"><rect x="8" y="26" width="84" height="54" rx="9" fill="#C0392B"/><rect x="8" y="60" width="84" height="6" fill="${P.gold}"/><rect x="14" y="34" width="64" height="20" rx="3" fill="#AEDCF0"/>${[30, 46, 62].map(x => `<path d="M${x} 34 V54" stroke="#C0392B" stroke-width="2.4"/>`).join('')}<rect x="82" y="34" width="6" height="40" rx="2" fill="#AEDCF0"/><rect x="12" y="20" width="76" height="9" rx="4" fill="#A93226"/><rect x="38" y="21" width="24" height="7" rx="1.5" fill="#1B1B1F"/><path d="M42 24.5 h16" stroke="${P.gold}" stroke-width="2" stroke-dasharray="3 2"/></g><circle cx="26" cy="82" r="8" fill="#222"/><circle cx="26" cy="82" r="3" fill="#bbb"/><circle cx="74" cy="82" r="8" fill="#222"/><circle cx="74" cy="82" r="3" fill="#bbb"/>`,
  trivilar: () => `${shadow(38, 50, 90)}<g class="a-bob">${tuktuk(50, 86, .95)}</g>`,
  steshan: () => `${shadow(42, 50, 92)}<rect x="4" y="82" width="92" height="7" fill="#B8BECB"/><g class="a-train"><rect x="8" y="36" width="72" height="44" rx="8" fill="#1F5FA8"/><rect x="8" y="64" width="72" height="6" fill="${P.gold}"/>${[14, 32, 50].map(x => `<rect x="${x}" y="42" width="14" height="14" rx="2" fill="#AEDCF0"/>`).join('')}<path d="M80 42 Q94 46 94 62 L94 80 L80 80Z" fill="#164C88"/><circle cx="89" cy="72" r="2.6" fill="${P.yellow}"/><circle cx="22" cy="82" r="5" fill="#333"/><circle cx="66" cy="82" r="5" fill="#333"/></g><rect x="58" y="8" width="36" height="14" rx="3" fill="${P.green}"/><path d="M63 15 h26" stroke="#fff" stroke-width="2.4" stroke-dasharray="5 3"/><path d="M66 22 V32 M86 22 V32" stroke="${P.grayD}" stroke-width="2"/>`,
  kiyak_venavada: () => `${shadow(28, 36, 92)}${tuktuk(36, 90, .6)}<g class="a-swing-tag">${tag(70, 36, -14, P.gold, T(-6, 2, '?', 22, '#fff'), .9)}</g>`,
  meetare: () => `${shadow(32)}<rect x="12" y="28" width="76" height="48" rx="8" fill="#2B2F3A"/><rect x="18" y="36" width="64" height="24" rx="3" fill="#120D0D"/><g class="a-glow">${T(50, 55, '120', 19, '#FF4D3A', 'class="pic-num" letter-spacing="3"')}</g><circle cx="26" cy="68" r="3" fill="${P.green}"/><circle cx="36" cy="68" r="3" fill="${P.gold}"/><circle cx="46" cy="68" r="3" fill="${P.red}"/><rect x="40" y="76" width="20" height="10" fill="#2B2F3A"/>`,
  danna: () => `${shadow(26, 50, 90)}<rect x="26" y="72" width="48" height="14" rx="5" fill="#3A3F52"/><g class="a-press"><rect x="35" y="64" width="30" height="8" fill="${P.redD}"/><ellipse cx="50" cy="64" rx="15" ry="6" fill="${P.red}"/></g>${hand('point', { x: 47, y: 2, r: 180, s: .7, sleeve: P.teal, cls: 'a-poke' })}`,

  // ---- Unit 7: everyday verbs
  yanava: () => `${shadow(20, 46)}<g class="a-walk">${walker(46, 90, 1.12, P.blue)}</g>${[44, 56, 68].map((y, i) => `<path d="M${16 - i * 3} ${y} h12" stroke="${P.gray}" stroke-width="3" stroke-linecap="round"/>`).join('')}<path d="M66 28 H92 M84 20 L92 28 L84 36" stroke="${P.orange}" stroke-width="4.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
  enava: () => `${shadow(42)}${house(28, 90, .62)}<g class="a-walk">${walker(72, 90, 1, P.green, true)}</g><path d="M64 24 H42 M50 16 L42 24 L50 32" stroke="${P.orange}" stroke-width="4.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
  dan: () => `${shadow(28)}<rect x="44" y="8" width="12" height="8" rx="2" fill="${P.grayD}"/><circle class="a-ring" cx="50" cy="54" r="36" fill="none" stroke="${P.red}" stroke-width="3"/><circle cx="50" cy="54" r="32" fill="${P.red}"/><circle cx="50" cy="54" r="26" fill="#fff"/><path class="a-spin" style="animation-duration:1.6s" d="M48.5 56 L50 31 L51.5 56Z" fill="${P.ink}"/><circle cx="50" cy="54" r="3.4" fill="${P.ink}"/>${T(50, 74, 'NOW', 7, P.red, 'class="pic-label"')}`,
  ada: () => { const [x, y] = cell(10); return calendar(`${Array.from({ length: 21 }, (_, i) => { const [cx, cy] = cell(i); return `<rect x="${cx}" y="${cy}" width="6.6" height="8" rx="2" fill="${i === 10 ? P.red : P.china}"/>`; }).join('')}<circle class="a-ring" cx="${x + 3.3}" cy="${y + 4}" r="8" fill="none" stroke="${P.red}" stroke-width="2.4"/>`, P.red, 'TODAY'); },
  kanava: () => `${chr('kumari', 2, 24, 66, { head: true, cls: 'talking' })}${plate(78, 88, 20, 6)}<g class="a-feed"><g transform="rotate(-42 80 64)"><rect x="78" y="62" width="4" height="30" rx="2" fill="${P.gray}"/><ellipse cx="80" cy="57" rx="6" ry="8.5" fill="${P.gray}"/><path d="M74.5 56 C75 49 85 49 85.5 56 Z" fill="#fff"/><ellipse cx="80" cy="52.5" rx="3.4" ry="2.4" fill="${P.orange}"/></g></g>`,
  bonava: () => `${chr('nimal', 2, 24, 66, { head: true })}<g transform="rotate(-30 74 66)"><g class="a-sip"><path d="M64 48 L84 48 L81 82 Q80.5 85 78 85 L70 85 Q67.5 85 67 82Z" fill="#EAF7FD" stroke="#CDE7F3" stroke-width="2"/><path d="M65 58 L83 58 L81 82 Q80.5 84 78 84 L70 84 Q67.5 84 67 82Z" fill="${P.tea}"/></g></g>`,
  hamadama: () => calendar(Array.from({ length: 21 }, (_, i) => { const [x, y] = cell(i); return `<g class="a-pop" style="animation-delay:${(i * .07).toFixed(2)}s"><rect x="${x}" y="${y}" width="6.6" height="8" rx="2" fill="${P.green}"/><path d="M${x + 1.4} ${y + 4.2} l1.6 1.8 l2.4 -3.4" stroke="#fff" stroke-width="1.3" fill="none" stroke-linecap="round"/></g>`; }).join(''), P.green, 'EVERY DAY'),
  kanne_nae: () => `${shadow(34, 46)}${plate(46, 70, 36, 13)}<g transform="rotate(-20 46 62)"><path d="M28 64 C28 52 42 48 50 54 C56 58 54 66 48 68 L38 70 C32 72 28 70 28 64Z" fill="#B5652B"/><path d="M48 66 L62 72" stroke="#F4EBDD" stroke-width="5" stroke-linecap="round"/><circle cx="64" cy="70" r="3" fill="#F4EBDD"/><circle cx="64" cy="75" r="3" fill="#F4EBDD"/></g>${xBadge(80, 30, 13)}`,
  mokada_karanne: () => `${chr('kumari', 0, 26, 66, { pose: 'think' })}${bubble(54, 8, 40, 30, { stroke: P.purple, tail: 'bl' })}<g class="a-q">${T(74, 31, '?', 22, P.purple)}</g>`,
  karanava: () => `${shadow(30)}<g class="a-spin-slow">${gear(70, 30, 13, P.gold)}</g><g transform="rotate(-40 44 60)"><rect x="40" y="38" width="8" height="50" rx="3" fill="${P.brown}"/><rect x="28" y="28" width="32" height="14" rx="4" fill="${P.grayD}"/></g><g transform="rotate(40 54 60)"><rect x="50" y="42" width="8" height="46" rx="4" fill="${P.gray}"/><path d="M45 42 C45 28 63 28 63 42 L58 42 L58 34 L50 34 L50 42Z" fill="${P.gray}"/></g>`,
  vada: () => `${shadow(38)}<rect x="20" y="22" width="60" height="42" rx="4" fill="#3A3F52"/><rect x="24" y="26" width="52" height="34" rx="2" fill="#DFF1FB"/><path d="M28 33 H50 M28 39 H56 M28 45 H46" stroke="${P.blue}" stroke-width="3" stroke-linecap="round"/><rect class="a-grow" x="58" y="44" width="6" height="12" fill="${P.green}"/><rect class="a-grow" style="animation-delay:.2s" x="66" y="38" width="6" height="18" fill="${P.orange}"/><path d="M12 64 H88 L82 72 H18Z" fill="#B8BECB"/><rect x="42" y="64" width="16" height="3" rx="1.5" fill="${P.grayD}"/>${cup(88, 82, .3, P.coffee, true)}`,
  api: () => `${chr('nimal', 0, 32, 44, { head: true, mood: 'happy' })}${chr('john', 56, 32, 44, { head: true, mood: 'happy' })}${chr('kumari', 25, 20, 50, { head: true, mood: 'happy' })}${sparkle(50, 12, .7)}`,
  balanava: () => `${shadow(32)}<g class="a-look"><rect x="18" y="32" width="26" height="40" rx="10" fill="#3A3F52"/><rect x="56" y="32" width="26" height="40" rx="10" fill="#3A3F52"/><rect x="40" y="40" width="20" height="14" rx="4" fill="#2B2F3A"/><circle cx="31" cy="74" r="12" fill="#2B2F3A"/><circle cx="69" cy="74" r="12" fill="#2B2F3A"/><circle cx="31" cy="74" r="8" fill="${P.water}"/><circle cx="69" cy="74" r="8" fill="${P.water}"/><path d="M27 70 a5 5 0 0 1 5 -3 M65 70 a5 5 0 0 1 5 -3" stroke="#fff" stroke-width="2" fill="none"/></g>`,
  kiyavanava: () => `${shadow(34)}${openBook(50, 64, 1)}<g class="a-look"><circle cx="38" cy="36" r="9" fill="none" stroke="${P.ink}" stroke-width="3"/><circle cx="62" cy="36" r="9" fill="none" stroke="${P.ink}" stroke-width="3"/><path d="M47 36 Q50 33 53 36" stroke="${P.ink}" stroke-width="3" fill="none"/></g>`,
  igena_gannava: () => `${shadow(32)}<rect x="22" y="58" width="56" height="12" rx="2" fill="${P.green}"/><rect x="26" y="70" width="52" height="12" rx="2" fill="${P.orange}"/>${T(50, 67.5, 'අ ආ ඇ', 8, '#fff', 'class="pic-si"')}<g class="a-bob"><path d="M14 36 L50 22 L86 36 L50 50Z" fill="#2B2F3A"/><path d="M30 42 V52 Q50 60 70 52 V42 L50 50Z" fill="#3A3F52"/><path d="M78 39 V54" stroke="${P.gold}" stroke-width="2.4"/><circle cx="78" cy="56" r="3" fill="${P.gold}"/></g>`,
  dannava: () => `${chr('john', 0, 30, 62, { head: true, mood: 'happy' })}${bubble(54, 6, 38, 32, { stroke: P.green, tail: 'bl' })}<g class="a-q">${T(73, 32, '!', 24, P.green)}</g>`,
  danne_nae: () => `${chr('kumari', 12, 14, 76, { pose: 'shrug' })}<g class="a-q">${T(50, 16, '?', 18, P.purple)}</g>${T(16, 34, '?', 12, P.purple, 'class="a-q" style="animation-delay:.5s"')}`,
  liyanava: () => `${shadow(32)}<g transform="rotate(-6 45 55)"><rect x="14" y="18" width="62" height="72" rx="4" fill="#fff" stroke="${P.chinaD}" stroke-width="2"/>${[36, 58, 70].map(y => `<path d="M22 ${y} H68" stroke="${P.blueL}" stroke-width="1.6"/>`).join('')}<path class="a-write" d="M22 50 q4 -10 8 -2 q3 8 7 -2 q3 -8 7 0 q4 8 8 -2 q4 -6 8 2" stroke="${P.blue}" stroke-width="3" fill="none" stroke-linecap="round" stroke-dasharray="70"/></g>
    <g transform="rotate(32 72 54)"><g class="a-pencil"><rect x="67" y="6" width="9" height="46" rx="1.5" fill="${P.gold}"/><rect x="67" y="6" width="9" height="7" fill="${P.pink}"/><path d="M67 52 L71.5 62 L76 52Z" fill="#F2D6A6"/><path d="M70 58.5 L71.5 62 L73 58.5Z" fill="${P.ink}"/></g></g>`,
  nidagannava: () => `${shadow(42, 50, 92)}<path d="M76 14 A12 12 0 1 0 88 30 A9 9 0 1 1 76 14Z" fill="${P.yellow}"/><rect x="8" y="38" width="10" height="52" rx="3" fill="${P.brown}"/><rect x="82" y="58" width="10" height="32" rx="3" fill="${P.brown}"/><rect x="12" y="66" width="76" height="14" rx="3" fill="${P.brownD}"/>
    <ellipse cx="30" cy="60" rx="14" ry="7" fill="#fff"/><circle cx="32" cy="53" r="10" fill="${P.skin}"/><path d="M24 50 C24 42 40 42 41 50 C36 46 30 46 24 50Z" fill="#17131a"/><path d="M27 54 q2 2 4 0 M34 54 q2 2 4 0" stroke="${P.ink}" stroke-width="1.6" fill="none" stroke-linecap="round"/>
    <path d="M40 58 C44 52 64 50 86 54 L88 68 L36 68Z" fill="${P.blue}"/><path d="M50 58 L84 58" stroke="#fff" stroke-width="2" opacity=".4"/><g class="a-zz">${T(52, 40, 'z', 14, P.purple)}${T(62, 30, 'z', 11, P.purple)}${T(70, 22, 'z', 8, P.purple)}</g>`,

  // ---- Unit 8: faith & church
  irida: () => calendar(`${sunIcon(50, 62, 11)}`, P.orange, 'SUNDAY'),
  deva_meheya: () => `${shadow(40, 50, 93)}<path d="M14 92 V40 Q14 14 50 8 Q86 14 86 40 V92Z" fill="#FFF3DC" stroke="#EADBC0" stroke-width="2"/><g class="a-glow"><path d="M50 18 L28 92 H72Z" fill="${P.gold}" opacity=".28"/></g><path d="M50 20 V46 M41 29 H59" stroke="${P.brown}" stroke-width="5" stroke-linecap="round"/>${[60, 72, 84].map((y, i) => `<rect x="${18 + i * 2}" y="${y}" width="${26 - i * 2}" height="6" rx="2" fill="${P.brown}"/><rect x="56" y="${y}" width="${26 - i * 2}" height="6" rx="2" fill="${P.brown}"/>`).join('')}`,
  tiyenava: () => `${shadow(38)}<rect x="12" y="62" width="76" height="8" rx="3" fill="${P.brown}"/><rect x="18" y="70" width="6" height="20" fill="${P.brownD}"/><rect x="76" y="70" width="6" height="20" fill="${P.brownD}"/><g class="a-bob">${at(34, 62, 1, `<rect x="-12" y="-20" width="24" height="20" rx="3" fill="${P.orange}"/><rect x="-2.5" y="-20" width="5" height="20" fill="${P.gold}"/>`)}</g>${cup(64, 56, .42, P.tea, false)}${checkBadge(78, 22, 12)}`,
  ape: () => `<path d="M8 46 L50 10 L92 46" stroke="${P.red}" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>${chr('nimal', 4, 50, 38, { head: true, mood: 'happy' })}${chr('john', 58, 50, 38, { head: true, mood: 'happy' })}${chr('kumari', 29, 38, 42, { head: true, mood: 'happy' })}<g class="a-pulse">${heart(50, 30, .8)}</g>`,
  pastor: () => `${chr('nimal', 12, 8, 76, { pose: 'heart', mood: 'happy' })}<g transform="rotate(-8 56 82)"><rect x="45" y="70" width="22" height="28" rx="2.5" fill="#2B2F3A"/><path d="M56 76 V90 M51 81 H61" stroke="${P.gold}" stroke-width="2.2"/></g>${sparkle(86, 24, .8)}`,
  deviyan: () => { const id = nid(); return `<defs><clipPath id="${id}"><circle cx="50" cy="50" r="42"/></clipPath></defs><g clip-path="url(#${id})"><rect width="100" height="100" fill="#BFE3F8"/>${rays(50, 58, 11, 60, .5, 12, 168)}<circle cx="50" cy="58" r="17" fill="#FFE59A"/><circle cx="50" cy="58" r="11" fill="#FFF3C4"/><g opacity=".97">${cloudShape(22, 70, 1.3)}${cloudShape(78, 68, 1.4)}${cloudShape(50, 78, 1.5)}</g><path d="M4 76 Q20 70 34 74 Q50 68 66 73 Q82 68 96 74" stroke="#D6E6F3" stroke-width="2" fill="none"/><rect x="0" y="82" width="100" height="20" fill="#F3F8FD"/></g><circle cx="50" cy="50" r="42" fill="none" stroke="#CFE0EE" stroke-width="2.4"/>${sparkle(14, 18, .7, P.gold, .3)}${sparkle(88, 16, .6, P.gold, .9)}`; },
  yesus: () => `${rays(50, 32, 12, 46, .3, 0, 330)}<path d="M2 94 Q50 66 98 94Z" fill="${P.leaf}"/><rect x="45" y="12" width="10" height="68" rx="2" fill="${P.brown}"/><rect x="29" y="27" width="42" height="10" rx="2" fill="${P.brown}"/><path d="M47 14 V78" stroke="#fff" stroke-width="2" opacity=".25"/>`,
  bayibalaya: () => `${shadow(30)}<g class="a-bob"><g transform="rotate(-8 50 52)"><rect x="24" y="14" width="52" height="72" rx="4" fill="#2B2F3A"/><rect x="24" y="14" width="8" height="72" rx="2" fill="#1B1E26"/><rect x="72" y="16" width="5" height="68" fill="#F4F1EA"/><path d="M54 30 V64 M44 42 H64" stroke="${P.gold}" stroke-width="4" stroke-linecap="round"/><path d="M60 86 V97 L63 94 L66 97 V86Z" fill="${P.red}"/></g></g>`,
  kiyavamu: () => `<ellipse class="a-glow" cx="50" cy="46" rx="36" ry="26" fill="${P.gold}" opacity=".25"/>${shadow(36)}${openBook(50, 64, 1, '#2B2F3A')}${sparkle(30, 24, .8)}${sparkle(72, 18, .7, P.gold, .6)}`,
  yachna: () => `<circle class="a-glow" cx="50" cy="48" r="34" fill="${P.gold}" opacity=".2"/>${hand('pray', { x: 50, y: 86, s: 1.45, sleeve: P.purple })}${sparkle(20, 24, .8)}${sparkle(82, 30, .6, P.gold, .7)}`,
  amen: () => `${bubble(10, 8, 80, 62, { stroke: P.gold, tail: 'bl' })}${hand('pray', { x: 50, y: 62, s: .9, sleeve: P.purple })}${sparkle(80, 16, .7)}${sparkle(22, 18, .5, P.gold, .5)}`,
  gitikava: () => `${shadow(34)}${openBook(50, 68, .95, P.maroon, false)}${[0, 4, 8].map(d => `<path d="M17 ${60 + d} Q30 ${56 + d} 46 ${62 + d} M54 ${62 + d} Q70 ${56 + d} 83 ${60 + d}" stroke="${P.gray}" stroke-width="1.2" fill="none"/>`).join('')}<g class="a-float">${note(68, 34)}</g><g class="a-float" style="animation-delay:1.1s">${note(30, 38, P.blue)}</g>`,
  gayamu: () => `${chr('kumari', 2, 22, 68, { head: true, cls: 'talking', mood: 'happy' })}<g class="a-float">${note(80, 36)}</g><g class="a-float" style="animation-delay:.9s">${note(90, 62, P.blue)}</g><g class="a-float" style="animation-delay:1.6s">${note(70, 18, P.pink)}</g>`,
  venuven: () => `<g class="a-pulse">${heart(24, 40, 2.2)}</g><path class="a-dash" d="M38 40 Q50 28 60 38" stroke="${P.red}" stroke-width="3" fill="none" stroke-dasharray="5 4" stroke-linecap="round"/><path d="M55 40 L61 39 L59 33" stroke="${P.red}" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>${chr('john', 50, 30, 48, { mood: 'happy' })}`,
  stuti_veva: () => `${rays(50, 58, 9, 52, .3, 25, 155)}${hand('open', { x: 30, y: 94, r: -16, s: .95, sleeve: P.blue, cls: 'a-wave' })}${hand('open', { x: 70, y: 94, r: 16, s: .95, sleeve: P.blue, cls: 'a-wave', flip: true })}${sparkle(50, 14, 1)}`,
  ashirvada: () => `<path class="a-glow" d="M50 30 L22 96 H78Z" fill="${P.gold}" opacity=".25"/>${chr('john', 18, 36, 64, { mood: 'happy' })}${hand('open', { x: 30, y: 6, r: 155, s: .58, sleeve: P.purple })}${hand('open', { x: 70, y: 6, r: -155, s: .58, sleeve: P.purple, flip: true })}${sparkle(84, 50, .6)}`,
  obata: () => `${ring(70, 48, 25)}${chr('thaththa', 46, 24, 48, { head: true, mood: 'happy' })}${hand('open', { x: 6, y: 72, r: 70, s: .62, sleeve: P.teal, cls: 'a-poke' })}${sparkle(88, 18, .7)}`,
  suba_iridavak: () => `${sunIcon(76, 22, 10)}${shadow(30, 44, 93)}${church(44, 92, .72)}${sparkle(86, 56, .8)}${sparkle(14, 36, .6, P.gold, .6)}`,
});

// ------------------------------------------------------------------ Spanish-course pictures
Object.assign(ART, {
  es_hola: () => `${chr('kumari', 4, 18, 70, { mood: 'wave' })}${bubble(54, 6, 42, 28, { stroke: P.orange, tail: 'bl' })}<g class="a-bob">${T(75, 26, '¡Hola!', 11, P.orange, 'class="pic-num"')}</g>`,
  es_tarde: () => { const id = nid(); return `<defs><clipPath id="${id}"><circle cx="50" cy="50" r="40"/></clipPath></defs>
    <g clip-path="url(#${id})"><rect width="100" height="100" fill="#BFE6FA"/><rect y="56" width="100" height="44" fill="#FFE0A8" opacity=".5"/>
      <g class="a-bob">${sunIcon(62, 34, 12)}</g>${cloudShape(28, 44, .8)}
      <path d="M0 74 Q30 64 56 72 Q78 78 100 68 L100 100 L0 100Z" fill="${P.leaf}"/><path d="M0 84 Q40 78 70 86 Q86 90 100 84 L100 100 L0 100Z" fill="${P.leafD}"/></g>
    <circle cx="50" cy="50" r="40" fill="none" stroke="#fff" stroke-width="3"/>`; },
  es_yo: () => `${ring(50, 44, 30)}${chr('kumari', 14, 8, 72, { mood: 'happy' })}${arrowDown(50, 12)}`,
  es_mexico: () => `${shadow(20, 30)}<rect x="17" y="8" width="5" height="86" rx="2.5" fill="${P.grayD}"/><circle cx="19.5" cy="8" r="4" fill="${P.gold}"/>
    <g class="a-flag"><rect x="22" y="14" width="21" height="42" fill="#006847"/><rect x="43" y="14" width="21" height="42" fill="#fff"/><rect x="64" y="14" width="21" height="42" fill="#CE1126"/>
      <circle cx="53.5" cy="35" r="6.5" fill="none" stroke="#8B5A2B" stroke-width="2"/><path d="M50 37 q3.5 -6 7 0" stroke="#3FA35F" stroke-width="1.6" fill="none"/><circle cx="53.5" cy="32" r="2" fill="#8B5A2B"/>
      <rect x="22" y="14" width="63" height="42" fill="none" stroke="#000" stroke-opacity=".08"/></g>`,
  es_espanol: () => `${bubble(12, 14, 76, 60, { fill: '#C0392B', stroke: '#C0392B', tail: 'bl' })}<g class="a-bob">${T(50, 58, 'Ñ', 38, '#fff', 'class="pic-num"')}</g><path d="M30 26 h40" stroke="${P.gold}" stroke-width="4" stroke-linecap="round" opacity=".7"/>${sparkle(84, 14, .8, P.gold)}`,
});

// ------------------------------------------------------------------ Uzbek-course pictures
Object.assign(ART, {
  uz_salom: () => `${chr('kumari', 4, 18, 70, { mood: 'wave' })}${bubble(52, 6, 44, 28, { stroke: P.teal, tail: 'bl' })}<g class="a-bob">${T(74, 25, 'Салом!', 10, P.teal, 'class="pic-num"')}</g>`,
  uz_assalom: () => `${chr('nimal', 2, 18, 70, { pose: 'heart' })}${bubble(50, 4, 47, 27, { stroke: P.blueD, tail: 'bl' })}<g class="a-bob">${T(73.5, 22.5, 'Ассалом!', 8.6, P.blueD, 'class="pic-num"')}</g>${sparkle(90, 60, .7, P.gold, .4)}`,
  uz_vaalaykum: () => `${chr('kumari', 2, 18, 70, { pose: 'heart' })}${bubble(48, 4, 50, 27, { stroke: '#8E3FA8', tail: 'bl' })}<g class="a-bob">${T(73, 22.5, 'Ваалайкум', 8.2, '#8E3FA8', 'class="pic-num"')}</g>${sparkle(90, 60, .7, P.gold, .4)}`,
  uz_qol_yurak: () => `${sparkle(14, 28, 1)}${sparkle(87, 24, .8, P.gold, .6)}${chr('kumari', 12, 8, 76, { pose: 'heart' })}${floatHeart(80, 44, .9, .2)}`,
  uz_ozbekiston: () => `${shadow(20, 30)}<rect x="17" y="8" width="5" height="86" rx="2.5" fill="${P.grayD}"/><circle cx="19.5" cy="8" r="4" fill="${P.gold}"/>
    <g class="a-flag"><rect x="22" y="14" width="63" height="14" fill="#0099B5"/><rect x="22" y="28" width="63" height="14" fill="#fff"/><rect x="22" y="42" width="63" height="14" fill="#1EB53A"/>
      <rect x="22" y="27.6" width="63" height="1.6" fill="#CE1126"/><rect x="22" y="40.8" width="63" height="1.6" fill="#CE1126"/>
      <circle cx="30" cy="21" r="4.6" fill="#fff"/><circle cx="32" cy="20.4" r="4" fill="#0099B5"/>
      ${[[45, 17], [49, 17], [53, 17], [41, 21], [45, 21], [49, 21], [53, 21], [37, 25], [41, 25], [45, 25], [49, 25], [53, 25]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1" fill="#fff"/>`).join('')}
      <rect x="22" y="14" width="63" height="42" fill="none" stroke="#000" stroke-opacity=".08"/></g>`,
  uz_ozbekcha: () => `${bubble(12, 14, 76, 60, { fill: '#0E8FB0', stroke: '#0E8FB0', tail: 'bl' })}<g class="a-bob">${T(50, 57, 'Ўз', 34, '#fff', 'class="pic-num"')}</g><path d="M30 26 h40" stroke="#1EB53A" stroke-width="4" stroke-linecap="round" opacity=".8"/>${sparkle(84, 14, .8, P.gold)}`,
  uz_osh: () => `${shadow(38)}<ellipse cx="50" cy="72" rx="42" ry="15" fill="#fff" stroke="#1E6FB8" stroke-width="3"/>
    ${[18, 30, 44, 58, 72, 84].map((x, i) => `<circle cx="${x}" cy="${i % 2 ? 83 : 81}" r="1.8" fill="#1E6FB8"/>`).join('')}
    <g class="a-bob"><path d="M16 70 C18 52 32 38 50 38 C68 38 82 52 84 70 Q50 80 16 70Z" fill="#F2C14E"/>
      ${Array.from({ length: 26 }, (_, i) => { const x = 22 + (i * 37) % 56, y = 46 + (i * 13) % 22; return `<path d="M${x} ${y} l2.6 -1" stroke="${i % 3 ? '#FFF3C4' : '#D9A23A'}" stroke-width="1.6" stroke-linecap="round"/>`; }).join('')}
      ${[[28, 58], [38, 50], [62, 52], [70, 62], [46, 64], [56, 44]].map(([x, y]) => `<path d="M${x} ${y} l7 -3" stroke="#E8761C" stroke-width="2.6" stroke-linecap="round"/>`).join('')}
      ${[[34, 62], [60, 60], [48, 52], [66, 50]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="4.6" ry="3.4" fill="#8A4A24"/><ellipse cx="${x - 1}" cy="${y - 1}" rx="2" ry="1.2" fill="#B06A3C"/>`).join('')}
      <path d="M44 40 C42 30 47 26 50 26 C53 26 58 30 56 40 Q50 43 44 40Z" fill="#F7F1E3" stroke="#D9CDB2" stroke-width="1.2"/><path d="M50 26 V40 M46.5 29 Q47 35 47.5 40 M53.5 29 Q53 35 52.5 40" stroke="#D9CDB2" stroke-width="1"/></g>
    ${[0, 1].map(i => `<path class="a-steam" style="animation-delay:${i * .8}s" d="M${36 + i * 26} 30 q-4 -6 0 -12 q4 -6 0 -12" stroke="#CFD6E2" stroke-width="2.6" fill="none" stroke-linecap="round"/>`).join('')}`,
  uz_non: () => `${shadow(38)}<g class="a-bob"><ellipse cx="50" cy="58" rx="42" ry="30" fill="#B8692A"/><ellipse cx="50" cy="55" rx="42" ry="30" fill="#D98C3E"/>
      <ellipse cx="50" cy="55" rx="40" ry="28" fill="none" stroke="#E9A65A" stroke-width="2.4" opacity=".7"/>
      <ellipse cx="50" cy="56" rx="24" ry="16.5" fill="#EDBB76"/><ellipse cx="50" cy="56" rx="24" ry="16.5" fill="none" stroke="#C47A33" stroke-width="1.6"/>
      ${[[0, 0], ...Array.from({ length: 6 }, (_, i) => [Math.cos(i * Math.PI / 3) * 8, Math.sin(i * Math.PI / 3) * 5.5]), ...Array.from({ length: 12 }, (_, i) => [Math.cos(i * Math.PI / 6) * 16, Math.sin(i * Math.PI / 6) * 11])].map(([x, y]) => `<circle cx="${(50 + x).toFixed(1)}" cy="${(56 + y).toFixed(1)}" r="1.5" fill="#B06A2A"/>`).join('')}
      ${Array.from({ length: 22 }, (_, i) => { const a = i * 2 * Math.PI / 22, r = i % 2 ? 33 : 30; return `<ellipse cx="${(50 + Math.cos(a) * r).toFixed(1)}" cy="${(55 + Math.sin(a) * r * .7).toFixed(1)}" rx="1.4" ry=".8" fill="${i % 3 ? '#FFF1D0' : '#2b2230'}"/>`; }).join('')}
      <path d="M22 38 Q34 30 48 29" stroke="#fff" stroke-width="2.6" fill="none" stroke-linecap="round" opacity=".35"/></g>`,
  uz_qovun: () => `${shadow(38)}<g class="a-bob"><g transform="rotate(-14 50 54)"><ellipse cx="50" cy="54" rx="40" ry="24" fill="#E8B830"/><ellipse cx="50" cy="51" rx="38" ry="21" fill="#F5CF4E"/>
      ${[-24, -12, 0, 12, 24].map(dx => `<path d="M${50 + dx - 10} 33 Q${50 + dx} 54 ${50 + dx - 10} 75 M${50 + dx + 10} 33 Q${50 + dx} 54 ${50 + dx + 10} 75" stroke="#D9A428" stroke-width="1" fill="none" opacity=".45"/>`).join('')}
      <path d="M88 52 l7 -2" stroke="#7A5A2A" stroke-width="3" stroke-linecap="round"/><path d="M24 38 Q40 30 60 31" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".45"/></g></g>
    <g transform="translate(62 72)"><path d="M-16 6 Q0 -10 16 6Z" fill="#E8B830"/><path d="M-13 5 Q0 -6 13 5Z" fill="#F7EDC0"/><path d="M-7 3 q2 -2 4 0 M1 2 q2 -2 4 0" stroke="#E2C56A" stroke-width="1.4" fill="none"/></g>`,
  uz_anor: () => `${shadow(36)}<g class="a-bob"><circle cx="42" cy="54" r="29" fill="#A82C24"/><circle cx="40" cy="51" r="27" fill="#C9392F"/>
      <path d="M35 26 L37 18 L40 24 L42 16 L45 24 L48 18 L49 27Z" fill="#8E2A20"/><path d="M24 40 Q30 32 40 30" stroke="#fff" stroke-width="3.4" fill="none" stroke-linecap="round" opacity=".35"/></g>
    <g transform="translate(73 70)"><circle r="17" fill="#C9392F"/><circle r="14.4" fill="#F6D9C8"/>
      ${[[0, 0], [5, 0], [-5, 0], [2.5, 4.4], [-2.5, 4.4], [2.5, -4.4], [-2.5, -4.4], [7.5, 4.4], [-7.5, 4.4], [7.5, -4.4], [-7.5, -4.4], [0, 8.8], [5, 8.8], [-5, 8.8], [0, -8.8], [5, -8.8], [-5, -8.8], [10, 0], [-10, 0]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="2.3" fill="${i % 3 ? '#E0314B' : '#C4203A'}"/>`).join('')}
      <circle cx="-4" cy="-5" r="1" fill="#fff" opacity=".8"/></g>`,
  uz_ming: () => numberTile(1000, 12).replace('font-size="34"', 'font-size="25"'),
});

// Pictures for the app's own cards (not vocabulary).
Object.assign(ART, {
  ui_practice: () => `${shadow(30)}<g class="a-bob"><g transform="rotate(-20 50 54)"><rect x="24" y="50" width="52" height="8" rx="4" fill="${P.grayD}"/>
    <rect x="12" y="34" width="12" height="40" rx="5" fill="${P.blue}"/><rect x="22" y="40" width="8" height="28" rx="3.5" fill="${P.blueD}"/>
    <rect x="76" y="34" width="12" height="40" rx="5" fill="${P.blue}"/><rect x="70" y="40" width="8" height="28" rx="3.5" fill="${P.blueD}"/>
    <rect x="14" y="38" width="4" height="14" rx="2" fill="#fff" opacity=".5"/></g></g>${sparkle(84, 18, .9)}${sparkle(16, 22, .6, P.gold, .7)}`,
  ui_target: () => `${shadow(30)}<circle cx="46" cy="54" r="34" fill="${P.red}"/><circle cx="46" cy="54" r="25" fill="#fff"/><circle cx="46" cy="54" r="16" fill="${P.red}"/><circle cx="46" cy="54" r="7" fill="#fff"/>
    <g class="a-poke"><path d="M48 52 L86 18" stroke="${P.brownD}" stroke-width="3.6" stroke-linecap="round"/><path d="M80 14 L92 10 L88 22 Z M84 24 L94 24 L90 30Z" fill="${P.gold}"/><path d="M44 56 L52 47 L54 54Z" fill="${P.grayD}"/></g>`,
  ui_listen: () => `${shadow(26)}<path d="M20 58 C20 30 34 18 50 18 C66 18 80 30 80 58" stroke="${P.purple}" stroke-width="8" fill="none" stroke-linecap="round"/>
    <rect x="12" y="52" width="18" height="30" rx="8" fill="${P.purple}"/><rect x="70" y="52" width="18" height="30" rx="8" fill="${P.purple}"/><rect x="24" y="56" width="8" height="22" rx="4" fill="#5D45A6"/><rect x="68" y="56" width="8" height="22" rx="4" fill="#5D45A6"/>
    <g class="a-float" style="animation-delay:.2s"><path d="M46 62 L46 42 L58 38 L58 58" stroke="${P.blue}" stroke-width="3.4" fill="none"/><ellipse cx="43" cy="62" rx="4.6" ry="3.6" fill="${P.blue}"/><ellipse cx="55" cy="58" rx="4.6" ry="3.6" fill="${P.blue}"/></g>`,
  ui_speak: () => `${shadow(22, 42)}<rect x="30" y="12" width="24" height="44" rx="12" fill="${P.grayD}"/><rect x="33" y="15" width="18" height="38" rx="9" fill="${P.gray}"/>${[24, 31, 38, 45].map(y => `<path d="M35 ${y} h14" stroke="${P.grayD}" stroke-width="1.6" opacity=".6"/>`).join('')}
    <path d="M22 44 C22 62 62 62 62 44" stroke="${P.grayD}" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M42 61 V80 M30 82 H54" stroke="${P.grayD}" stroke-width="4.4" stroke-linecap="round"/>
    ${[0, 1, 2].map(i => `<path class="a-wave-out" style="animation-delay:${i * .3}s" d="M${68 + i * 8} ${26 - i * 4} q${6 + i * 2} ${14 + i * 4} 0 ${28 + i * 8}" stroke="${P.orange}" stroke-width="3.6" fill="none" stroke-linecap="round"/>`).join('')}`,
});

['eka', 'deka', 'tuna', 'hatara', 'paha', 'haya', 'hata', 'ata', 'navaya', 'dahaya', 'vissa', 'panaha', 'siya'].forEach((id, k) => {
  const n = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 50, 100][k];
  ART[id] = () => numberTile(n, k);
});

export const hasPic = (id) => !!ART[id];
export function pic(id, { size = 96, live = false, cls = '' } = {}) {
  if (!ART[id]) return '';
  return `<svg class="pic pic-${id} ${live ? 'live' : ''} ${cls}" viewBox="0 0 100 100" width="${size}" height="${size}" aria-hidden="true">${ART[id]()}</svg>`;
}
export const PIC_IDS = Object.keys(ART);
