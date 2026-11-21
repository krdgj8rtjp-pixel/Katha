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
};

let n = 0;
// character('kumari', { size: 96, mood: 'happy', head: true, cls: 'speaker', say: 'text' })
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
