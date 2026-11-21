// Hand-drawn picture for every word, as inline SVG (viewBox 0 0 100 100).
// Moving parts carry a-* classes (steam, twinkle, wave…) that only animate
// inside a `.pic.live` svg, so a grid of cards stays calm until one is picked.
import { character } from './characters.js';

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
const chr = (id, x, y, size, o = {}) => character(id, { x, y, size, ...o });
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
function hand(kind, { x = 50, y = 90, r = 0, s = 1, sleeve = P.teal, cls = '' } = {}) {
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
  return `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})"><g class="${cls}">${b}</g></g>`;
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
    <path d="M32 62 L68 62" stroke="${P.ink}" stroke-width="2" stroke-dasharray="3 3" opacity=".4"/>${T(42, 75, 'රු', 11, P.ink, 'class="pic-si"')}${T(60, 75, '450', 10, P.ink, 'class="pic-num"')}</g>
    <g transform="rotate(35 80 60)"><rect x="76" y="34" width="7" height="40" rx="2" fill="${P.blue}"/><path d="M76 74 L79.5 84 L83 74Z" fill="#F2D6A6"/></g>`,

  // ---- Unit 4: numbers & money
  rupiyal: () => `${shadow(34)}<g transform="rotate(-10 50 54)"><rect x="12" y="30" width="72" height="40" rx="5" fill="#6FAE6A"/><rect x="16" y="34" width="64" height="32" rx="3" fill="none" stroke="#fff" stroke-width="1.6" opacity=".6"/></g>
    <g class="a-bob"><rect x="16" y="38" width="72" height="40" rx="5" fill="#8E5BB5"/><rect x="20" y="42" width="64" height="32" rx="3" fill="none" stroke="#fff" stroke-width="1.6" opacity=".6"/>
    <ellipse cx="52" cy="58" rx="13" ry="11" fill="#fff" opacity=".9"/>${T(52, 63, 'රු', 13, '#8E5BB5', 'class="pic-si"')}${T(28, 50, '100', 7.5, '#fff', 'class="pic-num"')}${T(76, 74, '100', 7.5, '#fff', 'class="pic-num"')}</g>
    <ellipse cx="80" cy="84" rx="12" ry="5" fill="${P.goldD}"/><ellipse cx="80" cy="80" rx="12" ry="5" fill="${P.gold}"/><ellipse cx="80" cy="76" rx="12" ry="5" fill="${P.goldD}"/><ellipse cx="80" cy="72.5" rx="12" ry="5" fill="${P.gold}"/><ellipse cx="80" cy="72.5" rx="7" ry="2.6" fill="none" stroke="${P.goldD}" stroke-width="1.4"/>`,
  kiyada: () => `${shadow(26, 46)}<g class="a-swing-tag">${tag(46, 58, -14, P.gold, `${T(-6, 2, '?', 26, '#fff')}`, 1.35)}</g>`,
  meka: () => `${shadow(26)}<rect x="32" y="64" width="36" height="26" rx="5" fill="${P.orange}"/><rect x="32" y="64" width="36" height="7" rx="3" fill="${P.orangeD}"/><rect x="47" y="64" width="6" height="26" fill="${P.gold}"/>
    <ellipse class="a-glow" cx="50" cy="77" rx="26" ry="18" fill="${P.gold}" opacity=".18"/>${hand('point', { x: 54, y: 4, r: 180, s: .9, sleeve: P.teal, cls: 'a-poke' })}`,
  eka_that: () => `${shadow(16, 82, 70)}<rect x="74" y="54" width="16" height="13" rx="3" fill="${P.orange}"/><rect x="74" y="54" width="16" height="4" rx="2" fill="${P.orangeD}"/>
    <path class="a-dash" d="M52 52 Q66 44 74 52" stroke="${P.gray}" stroke-width="2.6" fill="none" stroke-dasharray="4 5" stroke-linecap="round"/>
    ${hand('point', { x: 10, y: 74, r: 64, s: .78, sleeve: P.teal, cls: 'a-poke' })}`,
  ganan_vadiyi: () => `${shadow(26, 44)}${tag(42, 60, -12, P.red, `${T(-6, 0, 'රු', 13, '#fff', 'class="pic-si"')}`, 1.2)}
    <g class="a-up">${[[78, 36], [88, 52]].map(([x, y]) => `<path d="M${x} ${y} L${x} ${y - 18} M${x - 7} ${y - 11} L${x} ${y - 18} L${x + 7} ${y - 11}" stroke="${P.red}" stroke-width="4.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`).join('')}</g>
    <path class="a-drip" d="M22 22 q-4 6 0 8 q4 -2 0 -8Z" fill="${P.water}"/>`,
  adu_karanna: () => `${shadow(26, 44)}${tag(42, 54, -12, P.green, `${T(-6, 0, 'රු', 13, '#fff', 'class="pic-si"')}`, 1.2)}
    <g class="a-down"><path d="M82 44 L82 76 M72 66 L82 76 L92 66" stroke="${P.green}" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>`,
  amba: () => `${shadow(30)}<g class="a-bob"><path d="M26 56 C22 34 44 18 64 24 C84 30 88 54 76 72 C66 86 44 90 34 80 C28 74 28 64 26 56Z" fill="#F5A623"/>
    <path d="M40 30 C52 22 74 26 80 44 C82 52 80 60 76 66 C76 50 64 34 40 30Z" fill="#F7C548"/><path d="M28 62 C30 74 38 82 50 84 C40 84 30 78 28 62Z" fill="#E27D12"/>
    <path d="M38 42 q2 -8 10 -10" stroke="#fff" stroke-width="3.4" fill="none" stroke-linecap="round" opacity=".7"/>
    <path d="M60 24 C60 18 62 14 66 12" stroke="${P.brownD}" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M64 14 C72 4 88 6 92 14 C84 20 70 20 64 14Z" fill="${P.leaf}"/><path d="M66 14 C74 12 84 12 90 14" stroke="${P.leafD}" stroke-width="1.6" fill="none"/></g>`,
};
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
