import { COURSE } from '../data/course.js';
// Katha's cast as rigged, animatable SVGs.
// States (CSS classes on the <svg>): talking, happy, sad, wave, dance.
// Parts: .rig (breathes), .head, .eyes (blinks), .mouth-smile/.mouth-open/.mouth-sad,
// .brows-normal/.brows-sad, .arm (waves), and for Aliya .ear-l/.ear-r/.trunk.

const OUTLINE = '#2b2230';

const eyes = (lashes = false) => `<g class="eyes">
  <ellipse cx="49" cy="55" rx="5.4" ry="6.4" fill="#fff"/><ellipse cx="71" cy="55" rx="5.4" ry="6.4" fill="#fff"/>
  <circle cx="49.8" cy="56.2" r="3.5" fill="${OUTLINE}"/><circle cx="71.8" cy="56.2" r="3.5" fill="${OUTLINE}"/>
  <circle cx="51" cy="54.5" r="1.3" fill="#fff"/><circle cx="73" cy="54.5" r="1.3" fill="#fff"/>
  ${lashes ? `<path d="M44 50.5l-2.6-2M76 50.5l2.6-2M45.6 49l-1.4-2.6M74.4 49l1.4-2.6" stroke="${OUTLINE}" stroke-width="1.5" stroke-linecap="round"/>` : ''}
</g>`;

const brows = (color, w = 2.6) => `
  <path class="brows-normal" d="M42.5 45.5q6-4.5 12.5-1.5M65 44q6.5-3 12.5 1.5" stroke="${color}" stroke-width="${w}" fill="none" stroke-linecap="round"/>
  <path class="brows-sad" d="M42.5 46.5q6.5 -0.5 12.5 -4.5M65 42q6 4 12.5 4.5" stroke="${color}" stroke-width="${w}" fill="none" stroke-linecap="round"/>`;

const mouths = (lip = '#5b2a24') => `
  <path class="mouth-smile" d="M51.5 69.5q8.5 7.5 17 0" stroke="${lip}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <g class="mouth-open"><path d="M50.5 68q9.5 0 19 0q-1 10.5-9.5 10.5t-9.5-10.5z" fill="#5a1f24"/><path d="M54.5 75.5q5.5-3.5 11 0q-2 3-5.5 3t-5.5-3z" fill="#e86a7a"/><path d="M52 68.3h16v2.2q-8 1.6-16 0z" fill="#fff"/></g>
  <path class="mouth-sad" d="M52 74q8-6.5 16 0" stroke="${lip}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;

const cheeks = (c = '#e7837f', o = 0.35) => `<ellipse cx="43" cy="66" rx="4.5" ry="2.8" fill="${c}" opacity="${o}"/><ellipse cx="77" cy="66" rx="4.5" ry="2.8" fill="${c}" opacity="${o}"/>`;

const arm = (sleeve, skin) => `<g class="arm"><path d="M90 108 Q98 94 104 78" stroke="${sleeve}" stroke-width="11" stroke-linecap="round" fill="none"/><circle cx="105" cy="72" r="6.5" fill="${skin}"/></g>`;

// Posed arms, drawn in front of the body. Coordinates are in the 120×132 character box.
const sleeveArm = (d, c) => `<path d="${d}" stroke="${c}" stroke-width="10.5" stroke-linecap="round" fill="none"/>`;
const fist = (x, y, sk) => `<circle cx="${x}" cy="${y}" r="6.2" fill="${sk}"/>`;
const digit = (x1, y1, x2, y2, sk) => `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${sk}" stroke-width="4.2" stroke-linecap="round"/>`;
const POSES = {
  namaste: (sl, sk, sh) => `${sleeveArm('M29 114 Q35 128 50 117', sl)}${sleeveArm('M91 114 Q85 128 70 117', sl)}
    <g class="pose-hands"><path d="M60 121 L50.5 121 C49 108 52 94 59 82.5 Q60 81.5 60 84Z" fill="${sk}"/><path d="M60 121 L69.5 121 C71 108 68 94 61 82.5 Q60 81.5 60 84Z" fill="${sh}"/></g>`,
  self: (sl, sk) => `${sleeveArm('M91 112 Q99 128 80 120', sl)}${fist(76, 118, sk)}${digit(73, 116, 65, 111, sk)}`,
  heart: (sl, sk) => `${sleeveArm('M91 112 Q99 128 78 118', sl)}<ellipse cx="72" cy="113" rx="8" ry="6.5" fill="${sk}"/>`,
  point: (sl, sk) => `${sleeveArm('M90 108 Q102 106 112 100', sl)}${fist(115, 98, sk)}${digit(118, 96, 127, 92, sk)}`,
  shrug: (sl, sk) => `${sleeveArm('M28 110 Q14 116 11 102', sl)}${sleeveArm('M92 110 Q106 116 109 102', sl)}
    <ellipse cx="9" cy="97" rx="7.5" ry="4.5" fill="${sk}"/><ellipse cx="111" cy="97" rx="7.5" ry="4.5" fill="${sk}"/>`,
  scratch: (sl, sk) => `${sleeveArm('M91 110 Q108 96 96 72', sl)}${fist(92, 66, sk)}`,
  think: (sl, sk) => `${sleeveArm('M90 112 Q100 104 80 94', sl)}${fist(73, 89, sk)}`,
  cheer: (sl, sk) => `${sleeveArm('M30 104 Q16 92 18 72', sl)}${sleeveArm('M90 104 Q104 92 102 72', sl)}${fist(18, 66, sk)}${fist(102, 66, sk)}`,
  bag: (sl, sk) => `${sleeveArm('M29 110 Q20 120 22 128', sl)}<path d="M12 112 q10 -8 20 0" stroke="#7a4b1e" stroke-width="2.6" fill="none"/><rect x="9" y="112" width="26" height="20" rx="4" fill="#B5652B"/><rect x="9" y="118" width="26" height="3" fill="#8a4a1c"/>${fist(22, 112, sk)}`,
};

function person({ skin, shade, hairBack = '', hairFront = '', extrasHead = '', extrasFace = '', shirt, shirtExtras = '', browColor, lashes = false, lip }, pose = '') {
  return `
  <ellipse cx="60" cy="129" rx="34" ry="3.5" fill="#000" opacity=".08"/>
  <g class="rig">
    ${arm(shirt, skin)}
    <path d="M16 132 C18 106 34 92 60 92 C86 92 102 106 104 132 Z" fill="${shirt}"/>
    ${shirtExtras}
    <path d="M52 78h16v12q-8 6-16 0z" fill="${shade}"/>
    <g class="head">
      ${hairBack}
      <circle cx="33.5" cy="59" r="5.6" fill="${shade}"/><circle cx="86.5" cy="59" r="5.6" fill="${shade}"/>
      <ellipse cx="60" cy="56" rx="27" ry="29" fill="${skin}"/>
      ${cheeks()}
      ${eyes(lashes)}
      ${brows(browColor)}
      <path d="M58.5 59.5q3 4.5 0 6" stroke="${shade}" stroke-width="2.2" fill="none" stroke-linecap="round"/>
      ${extrasFace}
      ${mouths(lip)}
      ${hairFront}
      ${extrasHead}
    </g>
    ${pose && POSES[pose] ? POSES[pose](shirt, skin, shade) : ''}
  </g>`;
}

const flower = (x, y) => `<g transform="translate(${x} ${y})">${[0, 72, 144, 216, 288].map(a => `<ellipse cx="0" cy="-5" rx="3.6" ry="5.4" fill="#fffaf0" stroke="#f1d9b5" stroke-width=".6" transform="rotate(${a})"/>`).join('')}<circle r="2.6" fill="#f5b731"/></g>`;

const BUILD = {
  kumari: (pose) => person({
    skin: '#B97A52', shade: '#9C6141', browColor: '#1c1719', lashes: true, lip: '#7b2f2f',
    shirt: '#14898A',
    shirtExtras: `<path d="M46 93 Q60 108 74 93" stroke="#E8B53A" stroke-width="3.2" fill="none"/><circle cx="60" cy="104" r="2.4" fill="#E8B53A"/>`,
    hairBack: `<path d="M30 58 C27 28 44 20 60 20 C77 20 94 28 90 58 C89 76 86 86 82 92 L38 92 C34 86 31 76 30 58Z" fill="#1d181c"/>`,
    hairFront: `<path d="M32.5 53 C33 33 45 26 60 26 C75 26 87 33 87.5 53 C82 41 71 34.5 61 36 L60 30 L58.5 36 C49 35 38 41 32.5 53Z" fill="#1d181c"/>`,
    extrasHead: `${flower(84, 33)}<circle cx="33.5" cy="66" r="2.1" fill="#E8B53A"/><circle cx="86.5" cy="66" r="2.1" fill="#E8B53A"/>`,
  }, pose),
  nimal: (pose) => person({
    skin: '#A8693F', shade: '#8C5332', browColor: '#141114', lip: '#5b2a24',
    shirt: '#4F8FCF',
    shirtExtras: `<path d="M49 92 L60 106 L71 92 L67 90 L60 99 L53 90Z" fill="#fff"/><circle cx="60" cy="112" r="1.8" fill="#2f5f8f"/><circle cx="60" cy="122" r="1.8" fill="#2f5f8f"/><path d="M38 112 h10 v6 h-10z" fill="#3f7cb9"/>`,
    hairFront: `<path d="M32.5 51 C32 30 45 23 61 23 C77 23 89 30 87.5 51 C85 42 79 36.5 71 35.5 C61 40 47 40 40 36 C36 40 34 45 32.5 51Z" fill="#17131a"/><path d="M33 51 l1 8 M87 51 l-1 8" stroke="#17131a" stroke-width="4" stroke-linecap="round"/>`,
    extrasFace: `<path d="M49.5 66.5 q5.5 -5 10.5 -1.5 q5 -3.5 10.5 1.5 q-5 3 -10.5 0.5 q-5.5 2.5 -10.5 -0.5z" fill="#17131a"/>`,
  }, pose),
  john: (pose) => person({
    skin: '#F1C6A3', shade: '#D9A47F', browColor: '#8a5a2b', lip: '#7a3b30',
    shirt: '#6F8F3E',
    shirtExtras: `<path d="M36 100 L44 132 M84 100 L76 132" stroke="#3d4a2a" stroke-width="6" stroke-linecap="round"/><path d="M50 92 Q60 100 70 92" stroke="#5c7733" stroke-width="3" fill="none"/>`,
    hairBack: `<path d="M33 46 C32 58 33 64 34 68 L37 66 C36 58 37 52 39 46Z M87 46 C88 58 87 64 86 68 L83 66 C84 58 83 52 81 46Z" fill="#b07a3c"/>`,
    extrasFace: `<path d="M35.5 62 C37 82 49 89.5 60 89.5 C71 89.5 83 82 84.5 62 C81 71 74 75 69 75 C67 71.5 53 71.5 51 75 C46 75 39 71 35.5 62Z" fill="#b07a3c"/>`,
    extrasHead: `<ellipse cx="60" cy="35" rx="41" ry="8" fill="#C8A464"/><path d="M37 35 C37 14 83 14 83 35Z" fill="#d6b675"/><path d="M37.5 31 h45 v4.5 h-45z" fill="#8a6a35"/>`,
  }, pose),
  amma: (pose) => person({
    skin: '#B5764C', shade: '#96603D', browColor: '#3a3236', lashes: true, lip: '#7b3a33',
    shirt: '#8D153A',
    shirtExtras: `<path d="M38 100 Q60 118 82 100 L86 108 Q60 128 34 108Z" fill="#E8B53A"/><path d="M70 94 L98 132 L84 132 L64 96Z" fill="#A61E48"/><path d="M70 94 L98 132" stroke="#E8B53A" stroke-width="2.4"/>`,
    hairBack: `<circle cx="60" cy="23" r="12" fill="#3b3438"/><path d="M31 56 C29 32 44 24 60 24 C76 24 91 32 89 56 C88 64 86 70 84 74 L36 74 C34 70 32 64 31 56Z" fill="#3b3438"/>`,
    hairFront: `<path d="M33 52 C34 34 46 28 60 28 C74 28 86 34 87 52 C82 42 71 36 61.5 37 L60 30 L58.5 37 C49 36 38 42 33 52Z" fill="#3b3438"/><path d="M45 31 C52 29 56 30 58.5 32 M66 30 C71 31 76 33 79 37" stroke="#9a9396" stroke-width="2" fill="none" stroke-linecap="round"/>`,
    extrasFace: `<g fill="none" stroke="#6b4a2e" stroke-width="1.8"><circle cx="47" cy="54" r="7.5"/><circle cx="73" cy="54" r="7.5"/><path d="M54.5 53.5 q5.5 -3 11 0"/></g>`,
    extrasHead: `<circle cx="33.5" cy="66" r="2.1" fill="#E8B53A"/><circle cx="86.5" cy="66" r="2.1" fill="#E8B53A"/>`,
  }, pose),
  thaththa: (pose) => person({
    skin: '#9C6139', shade: '#7F4D2B', browColor: '#d9d4cf', lip: '#5b2a24',
    shirt: '#F3F1EA',
    shirtExtras: `<path d="M48 92 L60 104 L72 92 L68 89 L60 98 L52 89Z" fill="#DCD8CC"/><path d="M60 104 V132" stroke="#DCD8CC" stroke-width="1.6"/><circle cx="60" cy="112" r="1.6" fill="#bdb8ab"/><circle cx="60" cy="122" r="1.6" fill="#bdb8ab"/><path d="M76 106 h10 v8 h-10z" fill="#E6E2D6"/>`,
    hairFront: `<path d="M32.5 54 C31 40 36 32 42 30 C40 36 40 42 41 46 C38 47 35 50 32.5 54Z M87.5 54 C89 40 84 32 78 30 C80 36 80 42 79 46 C82 47 85 50 87.5 54Z" fill="#c9c4bf"/><path d="M45 29 C52 26 68 26 75 29" stroke="#c9c4bf" stroke-width="3" fill="none" stroke-linecap="round"/>`,
    extrasFace: `<path d="M48.5 67 q5.5 -5.5 11.5 -1.5 q6 -4 11.5 1.5 q-5.5 3.5 -11.5 0.8 q-6 2.7 -11.5 -0.8z" fill="#e3dfda"/><g fill="none" stroke="#2b2230" stroke-width="2"><rect x="39.5" y="47.5" width="15" height="12" rx="4"/><rect x="65.5" y="47.5" width="15" height="12" rx="4"/><path d="M54.5 52 h11"/></g>`,
  }, pose),
  putha: (pose) => person({
    skin: '#AE6F45', shade: '#915837', browColor: '#141114', lip: '#6b2f28',
    shirt: '#F5B731',
    shirtExtras: `<path d="M18 116 h84 v6 h-84z" fill="#E5484D" opacity=".85"/><path d="M50 92 Q60 99 70 92" stroke="#d69a12" stroke-width="3" fill="none"/>`,
    hairFront: `<path d="M32.5 52 C31 30 45 22 61 22 C77 22 90 30 87.5 52 C84 42 78 37 70 36 L66 41 L62 35 L56 41 L52 35 L47 40 C40 41 35 46 32.5 52Z" fill="#17131a"/>`,
  }, pose),
  duva: (pose) => person({
    skin: '#B77A50', shade: '#99613F', browColor: '#1c1719', lashes: true, lip: '#8a3a3a',
    shirt: '#F27D9A',
    shirtExtras: `<path d="M40 96 Q60 110 80 96" stroke="#fff" stroke-width="3" fill="none" stroke-dasharray="2 3"/><circle cx="60" cy="112" r="3" fill="#fff"/>`,
    hairBack: `<path d="M30 56 C27 30 44 21 60 21 C76 21 93 30 90 56 C89 62 87 66 85 68 L35 68 C33 66 31 62 30 56Z" fill="#1d181c"/><path d="M28 60 C22 76 24 96 30 104 C34 96 34 80 33 66Z M92 60 C98 76 96 96 90 104 C86 96 86 80 87 66Z" fill="#1d181c"/><circle cx="30" cy="104" r="4" fill="#E5484D"/><circle cx="90" cy="104" r="4" fill="#E5484D"/>`,
    hairFront: `<path d="M32.5 54 C33 33 45 26 60 26 C75 26 87 33 87.5 54 C84 44 76 38 66 38 C58 40 50 38 46 34 C40 38 35 44 32.5 54Z" fill="#1d181c"/>`,
    extrasHead: `<path d="M73 27 l7 -5 l1 9z M73 27 l-1 -9 l8 4z" fill="#E5484D"/>`,
  }, pose),
  sofia: (pose) => person({
    skin: '#D7A07A', shade: '#BD8460', browColor: '#3b2418', lashes: true, lip: '#9b3b3b',
    shirt: '#E8664A',
    shirtExtras: `<path d="M44 94 Q60 112 76 94" stroke="#fff" stroke-width="3" fill="none" opacity=".85"/><circle cx="49" cy="112" r="2" fill="#fff" opacity=".8"/><circle cx="71" cy="112" r="2" fill="#fff" opacity=".8"/><circle cx="60" cy="120" r="2" fill="#fff" opacity=".8"/>`,
    hairBack: `<path d="M29 58 C25 28 44 18 60 18 C78 18 96 28 91 58 C92 74 96 88 92 100 C86 96 84 90 84 84 L36 84 C36 90 34 96 28 100 C24 88 28 74 29 58Z" fill="#4a2c1c"/>`,
    hairFront: `<path d="M32 54 C32 32 46 24 61 24 C76 24 88 32 88 54 C84 42 74 35 64 34 C56 40 44 44 36 46 C34 48 33 51 32 54Z" fill="#4a2c1c"/><path d="M64 34 C70 36 78 40 82 46" stroke="#6b4129" stroke-width="2" fill="none" stroke-linecap="round"/>`,
    extrasHead: `<circle cx="33.5" cy="67" r="3" fill="none" stroke="#E8B53A" stroke-width="1.6"/><circle cx="86.5" cy="67" r="3" fill="none" stroke="#E8B53A" stroke-width="1.6"/>`,
  }, pose),
  mateo: (pose) => person({
    skin: '#C88B5E', shade: '#AA7148', browColor: '#1b1310', lip: '#6b2f28',
    shirt: '#2E7D5B',
    shirtExtras: `<path d="M49 92 L60 104 L71 92 L67 90 L60 98 L53 90Z" fill="#256A4C"/><circle cx="60" cy="112" r="1.8" fill="#1c5a3f"/><circle cx="60" cy="122" r="1.8" fill="#1c5a3f"/>`,
    hairFront: `<path d="M32.5 52 C31 30 45 22 61 22 C77 22 90 30 87.5 52 C86 44 81 38 74 36 C66 39 54 39 46 35 C40 39 35 45 32.5 52Z" fill="#1b1310"/><path d="M33 52 l1 7 M87 52 l-1 7" stroke="#1b1310" stroke-width="4" stroke-linecap="round"/>`,
    extrasFace: `<path d="M37 64 C38 80 48 88 60 88 C72 88 82 80 83 64 C80 72 74 78 69 78 C66 74 54 74 51 78 C46 78 40 72 37 64Z" fill="#1b1310" opacity=".28"/>`,
  }, pose),
  // Uzbek course: Dilnoza in an atlas (ikat) dress with long braids; Aziz in a striped chapan and a doppi cap.
  dilnoza: (pose) => person({
    skin: '#E0B08A', shade: '#C6936C', browColor: '#2a1a14', lashes: true, lip: '#9b3b3b',
    shirt: '#8E3FA8',
    shirtExtras: `${[[31, '#F5C23A'], [43, '#E84A7F'], [55, '#3FC1C9'], [67, '#F5C23A'], [79, '#E84A7F'], [91, '#3FC1C9']].map(([x, c]) => `<path d="M${x} ${x < 36 || x > 84 ? 111 : 101} ${x < 36 || x > 84 ? '' : 'q4 5 0 10 '}q-4 5 0 10 q4 5 0 9" stroke="${c}" stroke-width="3.4" fill="none" stroke-linecap="round" opacity=".9"/>`).join('')}<path d="M46 93 Q60 104 74 93" stroke="#F5C23A" stroke-width="3" fill="none"/>`,
    hairBack: `<path d="M30 56 C27 30 44 21 60 21 C76 21 93 30 90 56 C89 64 87 68 85 70 L35 70 C33 68 31 64 30 56Z" fill="#231815"/>
      ${[[30, 1], [90, -1]].map(([x, d]) => `<g fill="#231815">${[0, 1, 2, 3, 4].map(i => `<ellipse cx="${x + d * (i % 2 ? -1 : 1)}" cy="${70 + i * 10}" rx="5.2" ry="6.4"/>`).join('')}<path d="M${x - 2} 118 l2 8 l2 -8z"/></g><circle cx="${x}" cy="117" r="2.6" fill="#E84A7F"/>`).join('')}`,
    hairFront: `<path d="M32.5 54 C33 33 45 26 60 26 C75 26 87 33 87.5 54 C84 44 75 37 64 36 L60 30 L56 36 C45 37 36 44 32.5 54Z" fill="#231815"/>`,
    extrasHead: `<path d="M41 30 C45 20 75 20 79 30 L78 34 C70 30 50 30 42 34Z" fill="#C2185B"/><path d="M44 29 h32" stroke="#F5C23A" stroke-width="1.6" stroke-dasharray="2.6 2.4"/>
      <circle cx="33.5" cy="67" r="2.4" fill="#F5C23A"/><circle cx="86.5" cy="67" r="2.4" fill="#F5C23A"/>`,
  }, pose),
  aziz: (pose) => person({
    skin: '#D2A076', shade: '#B78358', browColor: '#141114', lip: '#6b2f28',
    shirt: '#2D5B9A',
    shirtExtras: `${[26, 38, 50, 70, 82, 94].map((x, i) => `<path d="M${x} ${x < 32 || x > 88 ? 112 : 98} V132" stroke="${i % 2 ? '#E8B53A' : '#79A8DA'}" stroke-width="2.6"/>`).join('')}
      <path d="M50 92 L60 112 L70 92 L66 90 L60 102 L54 90Z" fill="#F3F1EA"/><path d="M60 112 V132" stroke="#1F4373" stroke-width="2"/>
      <path d="M22 122 Q60 130 98 122 L99 128 Q60 136 21 128Z" fill="#3FA35F"/>`,
    hairFront: `<path d="M32.5 54 C32 44 34 38 38 36 L82 36 C86 38 88 44 87.5 54 C85 47 80 44 74 43 C64 45 54 45 46 43 C40 44 35 47 32.5 54Z" fill="#17131a"/>`,
    extrasFace: `<path d="M49 66.8 q5.5 -4.6 11 -1.4 q5.5 -3.2 11 1.4 q-5.5 2.6 -11 0.4 q-5.5 2.2 -11 -0.4z" fill="#17131a"/>`,
    extrasHead: `<path d="M35 38 L38 20 Q60 14 82 20 L85 38 Q60 33 35 38Z" fill="#17131a"/><path d="M38 20 Q60 14 82 20" stroke="#2c2630" stroke-width="2" fill="none"/>
      ${[[46, 31, -1], [60, 28, 1], [74, 31, 1]].map(([x, y, d]) => `<path d="M${x - 2 * d} ${y + 5} C${x - 5 * d} ${y - 1} ${x - d} ${y - 5} ${x + 3 * d} ${y - 6} C${x + d} ${y - 2} ${x + 2 * d} ${y + 2} ${x - 2 * d} ${y + 5}Z" fill="#fff"/>`).join('')}`,
  }, pose),
  // ---- Tamil course (Jaffna): Kavitha, Ravi and their grandmother Ammamma
  kavitha: (pose) => person({
    skin: '#9A5F3C', shade: '#7E4B2D', browColor: '#141014', lashes: true, lip: '#6e2828',
    shirt: '#D35F1E',
    shirtExtras: `<path d="M24 132 C32 112 46 99 64 95 L82 132Z" fill="#B8441A"/><path d="M64 95 L83 132" stroke="#F2C14E" stroke-width="3.4"/><path d="M27 125 Q50 117 72 123" stroke="#F2C14E" stroke-width="2.2" fill="none"/><path d="M47 93 Q60 101 73 93" stroke="#F2C14E" stroke-width="2.6" fill="none"/>`,
    hairBack: `<path d="M30 58 C27 28 44 20 60 20 C77 20 94 28 90 58 C89 66 87 70 85 72 L35 72 C33 70 31 66 30 58Z" fill="#141014"/>
      <g fill="#141014">${[0, 1, 2, 3, 4].map(i => `<ellipse cx="${88 + (i % 2 ? -1.5 : 1.5)}" cy="${72 + i * 10}" rx="5.4" ry="6.4"/>`).join('')}</g>
      ${[0, 1, 2, 3, 4, 5].map(i => `<circle cx="${93 + (i % 2 ? 1 : -0.5)}" cy="${68 + i * 8}" r="2.3" fill="#FFFDF5" stroke="#E9E2CF" stroke-width=".5"/>`).join('')}`,
    hairFront: `<path d="M32.5 53 C33 33 45 26 60 26 C75 26 87 33 87.5 53 C82 41 72 35 60.5 35.5 C49 35 38 41 32.5 53Z" fill="#141014"/><path d="M60 26 V35" stroke="#2a2229" stroke-width="1.4"/>`,
    extrasHead: `${[[33.5, 66], [86.5, 66]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.2" fill="#F2C14E"/><path d="M${x - 2.4} ${y + 3} q2.4 4 4.8 0z" fill="#F2C14E"/>`).join('')}`,
  }, pose),
  ravi: (pose) => person({
    skin: '#8E5534', shade: '#74432A', browColor: '#100d10', lip: '#4f2620',
    shirt: '#F4F2EC',
    shirtExtras: `<path d="M49 92 L60 106 L71 92 L67 90 L60 99 L53 90Z" fill="#E4E0D6"/><path d="M60 106 V132" stroke="#D9D4C8" stroke-width="1.6"/><circle cx="60" cy="114" r="1.6" fill="#B9B3A6"/><circle cx="60" cy="124" r="1.6" fill="#B9B3A6"/>
      <path d="M38 108 h11 v8 h-11z" fill="#E9E5DB"/><path d="M41 104 v7" stroke="#1565C0" stroke-width="2" stroke-linecap="round"/>`,
    hairFront: `<path d="M32.5 51 C31 30 45 22 61 22 C77 22 90 30 87.5 51 C86 43 81 37 73 35 C66 38 52 39 44 36 C38 39 34 44 32.5 51Z" fill="#100d10"/><path d="M33 51 l1 7 M87 51 l-1 7" stroke="#100d10" stroke-width="4" stroke-linecap="round"/>`,
    extrasFace: `<path d="M48 66.5 q6 -6 12 -2 q6 -4 12 2 q-3 3.4 -6 2.6 q-3 -1 -6 -0.6 q-3 -0.4 -6 0.6 q-3 0.8 -6 -2.6z" fill="#100d10"/>`,
  }, pose),
  ammamma: (pose) => person({
    skin: '#8C5536', shade: '#734429', browColor: '#d9d4cf', lashes: true, lip: '#6e3030',
    shirt: '#5B2C6F',
    shirtExtras: `<path d="M22 132 C30 112 44 98 62 94 L80 132Z" fill="#47205A"/><path d="M62 94 L81 132" stroke="#E2B13C" stroke-width="3.4"/><path d="M25 124 Q50 116 70 122" stroke="#E2B13C" stroke-width="2.2" fill="none"/><path d="M48 92 Q60 100 72 92" stroke="#E2B13C" stroke-width="2.4" fill="none"/>`,
    hairBack: `<ellipse cx="60" cy="24" rx="12" ry="9" fill="#B8B2AA"/><path d="M31 56 C29 32 44 24 60 24 C76 24 91 32 89 56 C88 62 86 66 84 68 L36 68 C34 66 32 62 31 56Z" fill="#C5BFB7"/>`,
    hairFront: `<path d="M33 52 C34 34 46 28 60 28 L60 36 C48 37 38 42 33 52Z M87 52 C86 34 74 28 60 28 L60 36 C72 37 82 42 87 52Z" fill="#D3CEC6"/>`,
    extrasFace: `<g fill="none" stroke="#3b2a1c" stroke-width="1.6"><rect x="40" y="48.5" width="14" height="11" rx="4"/><rect x="66" y="48.5" width="14" height="11" rx="4"/><path d="M54 53 q6 -2.6 12 0"/></g><circle cx="33.5" cy="66" r="2.3" fill="#E2B13C"/><circle cx="86.5" cy="66" r="2.3" fill="#E2B13C"/><circle cx="56.5" cy="63.5" r="1.3" fill="#E2B13C"/>`,
  }, pose),
  // Fathima: a Tamil-speaking Muslim neighbour (Tamil course), headscarf over hair and neck.
  fathima: (pose) => person({
    skin: '#A0683F', shade: '#86532F', browColor: '#22160f', lashes: true, lip: '#93403a',
    shirt: '#F3DDB8',
    shirtExtras: `<path d="M24 132 C28 112 40 100 56 96 L64 132Z" fill="#E8CB9C"/>${[34, 46, 58, 70, 82].map((x, i) => `<circle cx="${x}" cy="${118 + (i % 2) * 6}" r="1.8" fill="#1F7A6B" opacity=".55"/>`).join('')}`,
    hairBack: `<path d="M26 60 C22 25 43 13 60 13 C77 13 98 25 94 60 C94 80 90 94 85 104 L35 104 C30 94 26 80 26 60Z" fill="#1F7A6B"/><path d="M35 104 C45 110 75 110 85 104 L88 112 C70 120 50 120 32 112Z" fill="#196457"/><path d="M27 62 C28 82 32 96 37 103" stroke="#196457" stroke-width="2" fill="none"/>`,
    hairFront: `<path d="M31 52 C32 30 45 20 60 20 C75 20 88 30 89 52 C84 38 73 31 60 31 C47 31 36 38 31 52Z" fill="#1F7A6B"/><path d="M34 46 C40 35 50 31 60 31 C70 31 80 35 86 46" stroke="#2A9583" stroke-width="2.2" fill="none"/>`,
    extrasHead: `<circle cx="80" cy="40" r="2" fill="#F5D46A"/>`,
  }, pose),
  // ---- Family casts for the Spanish and Uzbek courses (they stand in for amma, thaththa, putha, duva),
  // plus grandparents used by every course.
  madre: (pose) => person({
    skin: '#C68A5E', shade: '#A86F45', browColor: '#2a1a14', lashes: true, lip: '#9b3b3b',
    shirt: '#14898A',
    shirtExtras: `<path d="M42 94 Q60 110 78 94" stroke="#fff" stroke-width="5" fill="none"/>${[46, 53, 60, 67, 74].map((x, i) => `<circle cx="${x}" cy="${i % 4 ? 101 + (i === 2 ? 2 : 0) : 98}" r="2" fill="${['#E5484D', '#F5B731', '#F27D9A', '#F5B731', '#E5484D'][i]}"/>`).join('')}`,
    hairBack: `<circle cx="60" cy="22" r="12" fill="#3a2418"/><path d="M31 56 C29 32 44 24 60 24 C76 24 91 32 89 56 C88 62 86 66 84 68 L36 68 C34 66 32 62 31 56Z" fill="#3a2418"/>`,
    hairFront: `<path d="M33 52 C34 34 46 28 60 28 C74 28 86 34 87 52 C82 42 71 36 62 37 C54 34 46 34 41 38 C37 42 35 46 33 52Z" fill="#3a2418"/>`,
    extrasHead: `<circle cx="72" cy="18" r="4" fill="#E5484D"/><circle cx="72" cy="18" r="1.6" fill="#F5B731"/><circle cx="33.5" cy="67" r="2.6" fill="#F5B731"/><circle cx="86.5" cy="67" r="2.6" fill="#F5B731"/>`,
  }, pose),
  padre: (pose) => person({
    skin: '#B9805A', shade: '#9A6442', browColor: '#1a1414', lip: '#6b2f28',
    shirt: '#C0392B',
    shirtExtras: `${[30, 44, 58, 72, 86].map(x => `<path d="M${x} ${x < 36 || x > 84 ? 110 : 96} V132" stroke="#8E2A20" stroke-width="3"/>`).join('')}${[104, 116, 126].map(y => `<path d="M20 ${y} H100" stroke="#8E2A20" stroke-width="2" opacity=".7"/>`).join('')}<path d="M48 92 L60 104 L72 92 L68 89 L60 98 L52 89Z" fill="#F3F1EA"/>`,
    hairFront: `<path d="M32.5 52 C31 32 44 23 60 23 C76 23 89 32 87.5 52 C85 44 80 39 72 37 C64 39 52 39 44 37 C38 40 34 45 32.5 52Z" fill="#1a1414"/><path d="M33 50 l1 8 M87 50 l-1 8" stroke="#6b6670" stroke-width="3.6" stroke-linecap="round"/>`,
    extrasFace: `<path d="M48 67.5 q6 -5 12 -1.4 q6 -3.6 12 1.4 q-6 3.8 -12 .8 q-6 3 -12 -.8z" fill="#1a1414"/>`,
  }, pose),
  hijo: (pose) => person({
    skin: '#C68A5E', shade: '#A86F45', browColor: '#221812', lip: '#7a3a30',
    shirt: '#3AAE5A',
    shirtExtras: `${[104, 116].map(y => `<path d="M${y < 110 ? 24 : 19} ${y} H${y < 110 ? 96 : 101}" stroke="#fff" stroke-width="5" opacity=".85"/>`).join('')}<path d="M50 92 Q60 99 70 92" stroke="#2A8743" stroke-width="3" fill="none"/>`,
    hairFront: `<path d="M32.5 52 C31 30 45 22 61 22 C77 22 90 30 87.5 52 C84 42 78 37 70 36 L67 42 L62 35 L57 41 L52 35 L47 40 C40 41 35 46 32.5 52Z" fill="#2a1a14"/><path d="M58 22 q4 -6 9 -3" stroke="#2a1a14" stroke-width="3" fill="none" stroke-linecap="round"/>`,
  }, pose),
  hija: (pose) => person({
    skin: '#C99068', shade: '#AB7350', browColor: '#2a1a14', lashes: true, lip: '#9b3b3b',
    shirt: '#F5B731',
    shirtExtras: `<path d="M42 95 Q60 106 78 95" stroke="#fff" stroke-width="3" fill="none"/>${[[40, 114], [60, 120], [80, 114]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3" fill="#E5484D"/>`).join('')}`,
    hairBack: `<path d="M30 56 C27 30 44 21 60 21 C76 21 93 30 90 56 L88 64 L32 64Z" fill="#3a2418"/><path d="M26 44 C14 52 14 72 22 82 C26 74 28 62 30 52Z M94 44 C106 52 106 72 98 82 C94 74 92 62 90 52Z" fill="#3a2418"/>`,
    hairFront: `<path d="M32.5 54 C33 33 45 26 60 26 C75 26 87 33 87.5 54 C84 44 76 38 66 38 C58 40 50 38 46 34 C40 38 35 44 32.5 54Z" fill="#3a2418"/>`,
    extrasHead: `<path d="M24 42 l-7 -5 l1 9z M24 42 l6 -6 l1 9z M96 42 l7 -5 l-1 9z M96 42 l-6 -6 l-1 9z" fill="#E5484D"/>`,
  }, pose),
  abuelo: (pose) => person({
    skin: '#B57A52', shade: '#97633F', browColor: '#e8e4de', lip: '#6b2f28',
    shirt: '#8A5A3B',
    shirtExtras: `<path d="M48 92 L60 112 L72 92Z" fill="#F3F1EA"/><path d="M60 112 V132" stroke="#6E452B" stroke-width="2"/>${[116, 124].map(y => `<circle cx="64" cy="${y}" r="1.8" fill="#E8C98E"/>`).join('')}`,
    hairFront: `<path d="M32.5 54 C31 42 35 35 41 32 C40 38 40 43 41 47 C38 48 35 50 32.5 54Z M87.5 54 C89 42 85 35 79 32 C80 38 80 43 79 47 C82 48 85 50 87.5 54Z" fill="#ECE8E2"/>`,
    extrasFace: `<path d="M48 67 q6 -5.5 12 -1.5 q6 -4 12 1.5 q-6 3.6 -12 .8 q-6 2.8 -12 -.8z" fill="#ECE8E2"/><g fill="none" stroke="#2b2230" stroke-width="2"><circle cx="47" cy="54" r="7.5"/><circle cx="73" cy="54" r="7.5"/><path d="M54.5 53.5 q5.5 -3 11 0"/></g>`,
    extrasHead: `<path d="M34 36 Q60 18 86 36 L84 30 Q60 12 36 30Z" fill="#5E4632"/><path d="M33 37 Q60 30 87 37 Q90 40 92 38 Q60 26 30 38Z" fill="#4A3626"/>`,
  }, pose),
  abuela: (pose) => person({
    skin: '#C08660', shade: '#A26C48', browColor: '#d9d4cf', lashes: true, lip: '#8a3a3a',
    shirt: '#7B61C9',
    shirtExtras: `<path d="M18 120 Q60 96 102 120 L104 132 L16 132Z" fill="#5B45A3"/>${[30, 46, 62, 78, 92].map(x => `<path d="M${x} ${Math.abs(x - 60) > 26 ? 120 : 112} v14" stroke="#F5B731" stroke-width="2"/>`).join('')}`,
    hairBack: `<circle cx="60" cy="23" r="11" fill="#DCD7D1"/><path d="M31 56 C29 32 44 24 60 24 C76 24 91 32 89 56 C88 62 86 66 84 68 L36 68 C34 66 32 62 31 56Z" fill="#DCD7D1"/>`,
    hairFront: `<path d="M33 52 C34 34 46 28 60 28 C74 28 86 34 87 52 C82 42 72 37 60 37 C48 37 38 42 33 52Z" fill="#E8E4DE"/>`,
    extrasFace: `<g fill="none" stroke="#6b4a2e" stroke-width="1.8"><circle cx="47" cy="54" r="7.5"/><circle cx="73" cy="54" r="7.5"/><path d="M54.5 53.5 q5.5 -3 11 0"/></g>`,
  }, pose),
  ona: (pose) => person({
    skin: '#E0B08A', shade: '#C6936C', browColor: '#2a1a14', lashes: true, lip: '#9b3b3b',
    shirt: '#2E8B57',
    shirtExtras: `${[30, 45, 60, 75, 90].map((x, i) => `<path d="M${x} ${Math.abs(x - 60) > 24 ? 110 : 100} q4 5 0 10 q-4 5 0 10" stroke="${i % 2 ? '#F27D9A' : '#F5C23A'}" stroke-width="3.2" fill="none" stroke-linecap="round"/>`).join('')}`,
    hairBack: `<path d="M27 60 C23 26 44 15 60 15 C76 15 97 26 93 60 C93 76 89 88 84 94 L36 94 C31 88 27 76 27 60Z" fill="#C0392B"/>${[[34, 70], [86, 70], [38, 86], [82, 86]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.6" fill="#fff"/>`).join('')}`,
    hairFront: `<path d="M36 50 C40 40 50 35 60 35 C70 35 80 40 84 50" stroke="#2a1a14" stroke-width="4" fill="none"/><path d="M32 50 C33 31 46 22 60 22 C74 22 87 31 88 50 C83 38 72 31 60 31 C48 31 37 38 32 50Z" fill="#C0392B"/>${[[46, 27], [60, 24.5], [74, 27], [38, 38], [82, 38]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.4" fill="#fff"/>`).join('')}`,
  }, pose),
  ota: (pose) => person({
    skin: '#D2A076', shade: '#B78358', browColor: '#5e5a62', lip: '#6b2f28',
    shirt: '#24507A',
    shirtExtras: `${[26, 38, 50, 70, 82, 94].map((x, i) => `<path d="M${x} ${x < 32 || x > 88 ? 112 : 98} V132" stroke="${i % 2 ? '#3FA35F' : '#79A8DA'}" stroke-width="2.6"/>`).join('')}<path d="M50 92 L60 112 L70 92 L66 90 L60 102 L54 90Z" fill="#F3F1EA"/><path d="M22 122 Q60 130 98 122 L99 128 Q60 136 21 128Z" fill="#C0392B"/>`,
    hairFront: `<path d="M32.5 54 C32 44 34 38 38 36 L82 36 C86 38 88 44 87.5 54 C85 47 80 44 74 43 C64 45 54 45 46 43 C40 44 35 47 32.5 54Z" fill="#8f8a93"/>`,
    extrasFace: `<path d="M47.5 67 q6.5 -5.4 12.5 -1.6 q6 -3.8 12.5 1.6 q-6.5 3.4 -12.5 .8 q-6 2.6 -12.5 -.8z" fill="#8f8a93"/>`,
    extrasHead: `<path d="M35 38 L38 20 Q60 14 82 20 L85 38 Q60 33 35 38Z" fill="#17131a"/>${[[46, 31, -1], [60, 28, 1], [74, 31, 1]].map(([x, y, d]) => `<path d="M${x - 2 * d} ${y + 5} C${x - 5 * d} ${y - 1} ${x - d} ${y - 5} ${x + 3 * d} ${y - 6} C${x + d} ${y - 2} ${x + 2 * d} ${y + 2} ${x - 2 * d} ${y + 5}Z" fill="#fff"/>`).join('')}`,
  }, pose),
  ogil: (pose) => person({
    skin: '#E0B08A', shade: '#C6936C', browColor: '#221812', lip: '#7a3a30',
    shirt: '#F3F1EA',
    shirtExtras: `<path d="M22 132 C24 112 32 100 44 96 L48 132Z M98 132 C96 112 88 100 76 96 L72 132Z" fill="#1E6FB8"/><path d="M50 92 Q60 99 70 92" stroke="#cfc9bc" stroke-width="3" fill="none"/>`,
    hairFront: `<path d="M32.5 52 C31 34 40 30 46 32 L46 40 C40 42 35 46 32.5 52Z M87.5 52 C89 34 80 30 74 32 L74 40 C80 42 85 46 87.5 52Z" fill="#221812"/>`,
    extrasHead: `<path d="M37 40 L39 23 Q60 17 81 23 L83 40 Q60 35 37 40Z" fill="#17131a"/>${[[48, 33, -1], [60, 30, 1], [72, 33, 1]].map(([x, y, d]) => `<path d="M${x - 2 * d} ${y + 4} C${x - 4 * d} ${y - 1} ${x - d} ${y - 4} ${x + 2.4 * d} ${y - 5} C${x + d} ${y - 2} ${x + 1.6 * d} ${y + 2} ${x - 2 * d} ${y + 4}Z" fill="#fff"/>`).join('')}`,
  }, pose),
  qiz: (pose) => person({
    skin: '#E6B993', shade: '#CB9B74', browColor: '#2a1a14', lashes: true, lip: '#9b3b3b',
    shirt: '#C2185B',
    shirtExtras: `${[34, 48, 62, 76, 88].map((x, i) => `<path d="M${x} ${Math.abs(x - 60) > 22 ? 110 : 100} q4 5 0 10 q-4 5 0 10" stroke="${['#F5C23A', '#3FC1C9', '#fff', '#3FC1C9', '#F5C23A'][i]}" stroke-width="3" fill="none" stroke-linecap="round"/>`).join('')}`,
    hairBack: `<path d="M30 56 C27 30 44 21 60 21 C76 21 93 30 90 56 L88 66 L32 66Z" fill="#231815"/>${[[29, 1], [91, -1]].map(([x, d]) => `<g fill="#231815">${[0, 1, 2, 3].map(i => `<ellipse cx="${x + d * (i % 2 ? -1 : 1)}" cy="${68 + i * 9}" rx="4.6" ry="5.6"/>`).join('')}</g><circle cx="${x}" cy="103" r="3" fill="#F5C23A"/>`).join('')}`,
    hairFront: `<path d="M32.5 54 C33 33 45 26 60 26 C75 26 87 33 87.5 54 C84 44 75 37 64 36 L60 30 L56 36 C45 37 36 44 32.5 54Z" fill="#231815"/>`,
    extrasHead: `<path d="M44 30 L46 18 Q60 13 74 18 L76 30 Q60 26 44 30Z" fill="#7B3FA0"/><path d="M47 24 h26" stroke="#F5C23A" stroke-width="2" stroke-dasharray="2.4 2"/><circle cx="60" cy="16" r="1.8" fill="#F5C23A"/>`,
  }, pose),
  bobo: (pose) => person({
    skin: '#CF9C72', shade: '#B48157', browColor: '#eeeae4', lip: '#6b2f28',
    shirt: '#2C3E66',
    shirtExtras: `${[26, 40, 80, 94].map((x, i) => `<path d="M${x} ${x < 32 || x > 88 ? 112 : 99} V132" stroke="${i % 2 ? '#E8B53A' : '#C0392B'}" stroke-width="2.6"/>`).join('')}<path d="M22 122 Q60 130 98 122 L99 128 Q60 136 21 128Z" fill="#E8B53A"/>`,
    extrasFace: `<path d="M35 62 C36 86 48 98 60 98 C72 98 84 86 85 62 C80 72 72 76 60 76 C48 76 40 72 35 62Z" fill="#F4F1EC"/><path d="M47 67 q6.5 -5.4 13 -1.6 q6.5 -3.8 13 1.6 q-6.5 3.6 -13 .8 q-6.5 2.8 -13 -.8z" fill="#F4F1EC"/>`,
    extrasHead: `<path d="M35 40 L38 21 Q60 15 82 21 L85 40 Q60 35 35 40Z" fill="#17131a"/>${[[46, 32, -1], [60, 29, 1], [74, 32, 1]].map(([x, y, d]) => `<path d="M${x - 2 * d} ${y + 5} C${x - 5 * d} ${y - 1} ${x - d} ${y - 5} ${x + 3 * d} ${y - 6} C${x + d} ${y - 2} ${x + 2 * d} ${y + 2} ${x - 2 * d} ${y + 5}Z" fill="#fff"/>`).join('')}`,
  }, pose),
  // Sri Lankan grandmother in a white osariya (the sari worn to the temple), grey hair in a bun.
  achchi: (pose) => person({
    skin: '#A86E48', shade: '#8C5834', browColor: '#d9d4cf', lashes: true, lip: '#7a3434',
    shirt: '#F7F5F0',
    shirtExtras: `<path d="M24 132 C30 112 44 98 62 94 L78 132Z" fill="#ECE8DF"/><path d="M62 94 L80 132" stroke="#E2B13C" stroke-width="3"/><path d="M27 124 Q50 116 70 122" stroke="#E2B13C" stroke-width="2" fill="none"/><path d="M50 92 Q60 99 70 92" stroke="#E2B13C" stroke-width="2.4" fill="none"/>`,
    hairBack: `<ellipse cx="60" cy="24" rx="12" ry="9" fill="#BDB7B0"/><path d="M31 56 C29 32 44 24 60 24 C76 24 91 32 89 56 C88 62 86 66 84 68 L36 68 C34 66 32 62 31 56Z" fill="#C9C3BC"/>`,
    hairFront: `<path d="M33 52 C34 34 46 28 60 28 L60 36 C48 37 38 42 33 52Z M87 52 C86 34 74 28 60 28 L60 36 C72 37 82 42 87 52Z" fill="#D6D1CA"/>`,
    extrasFace: `<g fill="none" stroke="#5b3a22" stroke-width="1.6"><circle cx="47" cy="54" r="7"/><circle cx="73" cy="54" r="7"/><path d="M54 53.5 q6 -3 12 0"/></g><circle cx="33.5" cy="66" r="2.2" fill="#E2B13C"/><circle cx="86.5" cy="66" r="2.2" fill="#E2B13C"/>`,
  }, pose),
  buvi: (pose) => person({
    skin: '#D9A880', shade: '#BE8C64', browColor: '#cfc9c2', lashes: true, lip: '#8a3a3a',
    shirt: '#7A2B3A',
    shirtExtras: `<path d="M44 94 Q60 104 76 94" stroke="#E8B53A" stroke-width="3" fill="none"/>`,
    hairBack: `<path d="M27 60 C23 26 44 15 60 15 C76 15 97 26 93 60 C93 78 89 92 84 100 L36 100 C31 92 27 78 27 60Z" fill="#F4F1EC"/><path d="M27 60 C27 80 31 94 36 100" stroke="#E0D9CC" stroke-width="2" fill="none"/>`,
    hairFront: `<path d="M38 48 C42 40 50 36 60 36 C70 36 78 40 82 48" stroke="#cfc9c2" stroke-width="3.6" fill="none"/><path d="M32 50 C33 31 46 22 60 22 C74 22 87 31 88 50 C83 38 72 32 60 32 C48 32 37 38 32 50Z" fill="#F4F1EC"/>`,
    extrasFace: `<path d="M44 74 q4 3 8 1 M76 74 q-4 3 -8 1" stroke="${'#BE8C64'}" stroke-width="1.4" fill="none"/>`,
  }, pose),
  doktor: (pose) => person({
    skin: '#C99068', shade: '#AB7350', browColor: '#2a1a14', lashes: true, lip: '#9b3b3b',
    shirt: '#F7F7F5',
    shirtExtras: `<path d="M50 92 L60 110 L70 92Z" fill="#7FB6D9"/><path d="M60 110 V132" stroke="#D9DCE3" stroke-width="2"/><path d="M42 94 C38 112 46 120 54 116" stroke="#3E4A5C" stroke-width="3" fill="none"/><path d="M78 94 C82 108 78 116 70 118" stroke="#3E4A5C" stroke-width="3" fill="none"/><circle cx="70" cy="119" r="4.5" fill="#B8BECB" stroke="#3E4A5C" stroke-width="2"/><rect x="80" y="112" width="12" height="8" rx="2" fill="#E5484D"/><path d="M86 113.5 v5 M83.5 116 h5" stroke="#fff" stroke-width="1.6"/>`,
    hairBack: `<circle cx="60" cy="22" r="11" fill="#3a2418"/><path d="M31 56 C29 32 44 24 60 24 C76 24 91 32 89 56 L87 64 L33 64Z" fill="#3a2418"/>`,
    hairFront: `<path d="M33 52 C34 34 46 28 60 28 C74 28 86 34 87 52 C82 42 71 36 60 36 C49 36 38 42 33 52Z" fill="#3a2418"/>`,
  }, pose),
  aliya: () => `
  <ellipse cx="60" cy="129" rx="32" ry="3.5" fill="#000" opacity=".08"/>
  <g class="rig">
    <g class="arm"><path d="M88 104 Q100 92 104 78" stroke="#9BAECB" stroke-width="12" stroke-linecap="round" fill="none"/><circle cx="105" cy="73" r="7" fill="#8ea2c1"/></g>
    <path d="M20 132 C22 108 36 94 60 94 C84 94 98 108 100 132 Z" fill="#8EA2C1"/>
    <path d="M30 86 q30 26 60 0 l2 14 q-32 20 -64 0z" fill="#E8891C"/><path d="M30 92 q30 22 60 0" stroke="#8D153A" stroke-width="3" fill="none"/>
    <g class="head">
      <g class="ear-l"><ellipse cx="26" cy="58" rx="22" ry="27" fill="#7F93B4"/><ellipse cx="28" cy="59" rx="13.5" ry="18.5" fill="#F4B9C8"/></g>
      <g class="ear-r"><ellipse cx="94" cy="58" rx="22" ry="27" fill="#7F93B4"/><ellipse cx="92" cy="59" rx="13.5" ry="18.5" fill="#F4B9C8"/></g>
      <ellipse cx="60" cy="58" rx="33" ry="32" fill="#9BAECB"/>
      <path d="M54 27 q6 -10 12 0" stroke="#6E82A4" stroke-width="3" fill="none" stroke-linecap="round"/>
      ${cheeks('#F49AB0', 0.85)}
      ${eyes()}
      ${brows('#6E82A4', 2.4)}
      <g class="mouth-smile"><path d="M40 77 q5 4 9 2 M71 79 q4 2 9 -2" stroke="#5a6b8a" stroke-width="2.2" fill="none" stroke-linecap="round"/></g>
      <g class="mouth-open"><ellipse cx="45" cy="79" rx="4.5" ry="4" fill="#5a1f24"/><ellipse cx="75" cy="79" rx="4.5" ry="4" fill="#5a1f24"/></g>
      <g class="mouth-sad"><path d="M41 81 q4 -4 8 -2 M71 79 q4 -2 8 2" stroke="#5a6b8a" stroke-width="2.2" fill="none" stroke-linecap="round"/></g>
      <path d="M45 74q-4 8 2 12M75 74q4 8-2 12" stroke="#fffaf0" stroke-width="4" fill="none" stroke-linecap="round"/>
      <g class="trunk"><path d="M52 68 q-3 30 9 38 10 5 15 -4 -6 2 -10 -4 -4 -8 0 -30z" fill="#9BAECB"/><path d="M56 80v3M57 90v3" stroke="#7F93B4" stroke-width="2" stroke-linecap="round"/></g>
    </g>
  </g>`,
};

export const CAST = {
  aliya: { name: 'Aliya', color: '#6E82A4' },
  kumari: { name: 'Kumari', color: '#C2185B' },
  nimal: { name: 'Nimal', color: '#00796B' },
  john: { name: 'John', color: '#1565C0' },
  sofia: { name: 'Sofía', color: '#C2185B' },
  mateo: { name: 'Mateo', color: '#00796B' },
  dilnoza: { name: 'Dilnoza', color: '#8E3FA8' },
  achchi: { name: 'Achchi', color: '#9C6B3C' },
  buvi: { name: 'Buvi', color: '#7A2B3A' },
  aziz: { name: 'Aziz', color: '#2D5B9A' },
  kavitha: { name: 'Kavitha', color: '#C0501A' },
  ravi: { name: 'Ravi', color: '#00796B' },
  ammamma: { name: 'Ammamma', color: '#5B2C6F' },
  fathima: { name: 'Fathima', color: '#1F7A6B' },
};

let n = 0;
// character('kumari', { size: 96, mood: 'happy', head: true, cls: 'speaker', say: 'text' })
// Course-specific stand-ins: the Spanish course re-casts Kumari and Nimal as Sofía and Mateo in pictures and scenes.
export function castId(id) { return (COURSE?.cast && COURSE.cast[id]) || id; }

export function character(id, { size = 96, mood = '', head = false, cls = '', say = '', pose = '', x = null, y = null } = {}) {
  const build = BUILD[id] || BUILD.aliya;
  const vb = head ? '14 12 92 92' : '0 0 120 132';
  const delay = -((n++ * 1.37) % 5).toFixed(2);
  return `<svg class="char char-${id} ${mood} ${cls}" data-char="${id}" ${say ? `data-say="${say.replace(/"/g, '&quot;')}"` : ''} viewBox="${vb}" ${x != null ? `x="${x}" y="${y}"` : ''} width="${size}" height="${head ? size : Math.round(size * 132 / 120)}" style="--d:${delay}s" aria-hidden="true">${build(pose)}</svg>`;
}

// Briefly put characters in a mood (happy / sad / dance).
export function react(root, mood, ms = 1200) {
  if (!root) return;
  root.querySelectorAll('.char').forEach(c => {
    c.classList.remove('happy', 'sad');
    void c.getBoundingClientRect();
    c.classList.add(mood);
    clearTimeout(c._t);
    c._t = setTimeout(() => c.classList.remove(mood), ms);
  });
}

// Mark characters as talking while a line of audio plays.
export function setTalking(text, on) {
  const all = [...document.querySelectorAll('.char[data-say]')];
  const match = all.filter(c => c.dataset.say === text);
  const targets = match.length ? match : [...document.querySelectorAll('.char.speaker')];
  if (!on) { document.querySelectorAll('.char.talking').forEach(c => c.classList.remove('talking')); return; }
  targets.forEach(c => c.classList.add('talking'));
}
