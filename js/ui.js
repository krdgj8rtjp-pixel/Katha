import { esc, rawTokens } from './util.js';
import { romanize } from './translit.js';
import { state } from './store.js';

export const ICONS = {
  flame: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2c1 3.5 5.2 5.6 5.2 10.2a5.2 5.2 0 0 1-10.4 0c0-2.1 1-3.6 2.1-4.6.2 1.5 1 2.6 2 2.6-1-3.1 0-6.2 1.1-8.2z" fill="#FF9600"/><path d="M12 13c.6 1.4 2 2 2 3.6a2 2 0 0 1-4 0c0-1 .6-1.6 1-2 .1.6.4 1 1 1-.3-1 0-2 0-2.6z" fill="#FFD43B"/></svg>',
  flameOff: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2c1 3.5 5.2 5.6 5.2 10.2a5.2 5.2 0 0 1-10.4 0c0-2.1 1-3.6 2.1-4.6.2 1.5 1 2.6 2 2.6-1-3.1 0-6.2 1.1-8.2z" fill="#CFCFD6"/></svg>',
  gem: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h12l4 6-10 12L2 9z" fill="#26A8F0"/><path d="M2 9h20L12 21z" fill="#1487CF"/><path d="M8.2 3 6.3 9h11.4l-1.9-6" fill="#9BDDFF" opacity=".75"/></svg>',
  heart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-8.2-5-8.2-11.2A4.6 4.6 0 0 1 12 7a4.6 4.6 0 0 1 8.2 2.8C20.2 16 12 21 12 21z" fill="#FF4B4B"/><path d="M7.3 7.8a2.1 2.1 0 0 1 2-1.2" stroke="#fff" stroke-width="1.6" stroke-linecap="round" fill="none" opacity=".75"/></svg>',
  heartOff: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-8.2-5-8.2-11.2A4.6 4.6 0 0 1 12 7a4.6 4.6 0 0 1 8.2 2.8C20.2 16 12 21 12 21z" fill="#D5D5DC"/></svg>',
  infinity: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 8.5a3.5 3.5 0 1 0 0 7c3 0 7-7 10-7a3.5 3.5 0 1 1 0 7c-3 0-7-7-10-7z" stroke="#FF4B4B" stroke-width="2.6" fill="none"/></svg>',
  speaker: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 9v6h4l5.5 4.5v-15L7.5 9z" fill="currentColor"/><path d="M16 8.5a5 5 0 0 1 0 7M18.6 6a8.6 8.6 0 0 1 0 12" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round"/></svg>',
  turtle: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 15.5c0-4 3.6-7 8-7s8 3 8 7z" fill="currentColor"/><circle cx="20.3" cy="13" r="2.4" fill="currentColor"/><rect x="5.5" y="15" width="3" height="3.5" rx="1.2" fill="currentColor"/><rect x="13" y="15" width="3" height="3.5" rx="1.2" fill="currentColor"/></svg>',
  close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"/></svg>',
  star: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2.6 2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.5l-5.9 3.1 1.2-6.5L2.5 9.5l6.6-.9z" fill="currentColor"/></svg>',
  check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5" stroke="currentColor" stroke-width="3.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  lock: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10.5" width="14" height="10" rx="2.5" fill="currentColor"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" stroke="currentColor" stroke-width="2.4" fill="none"/></svg>',
  book: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5.5C5.5 4 8.5 4 12 6c3.5-2 6.5-2 9-.5V19c-2.5-1.5-5.5-1.5-9 .5-3.5-2-6.5-2-9-.5z" fill="currentColor"/><path d="M12 6v13.5" stroke="#fff" stroke-width="1.5" opacity=".55"/></svg>',
  trophy: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h10v5.5a5 5 0 0 1-10 0z" fill="currentColor"/><path d="M7 5H4.2a3 3 0 0 0 3 4.2M17 5h2.8a3 3 0 0 1-3 4.2" stroke="currentColor" stroke-width="2" fill="none"/><rect x="10.5" y="12.5" width="3" height="3.6" fill="currentColor"/><rect x="7.5" y="16" width="9" height="4" rx="1.5" fill="currentColor"/></svg>',
  chest: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 10a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v1H3z" fill="#C97B2A"/><rect x="3" y="11" width="18" height="9" rx="2" fill="#E59A3E"/><rect x="3" y="10" width="18" height="2.6" fill="#8A4F14"/><rect x="10.3" y="10" width="3.4" height="5" rx="1" fill="#FFD54A"/></svg>',
  chestOpen: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.5 6 3.5h12l2 6z" fill="#8A4F14"/><rect x="3" y="11" width="18" height="9" rx="2" fill="#E59A3E"/><rect x="3" y="10" width="18" height="2.6" fill="#8A4F14"/><circle cx="9" cy="8" r="1.6" fill="#26A8F0"/><circle cx="14" cy="7" r="1.8" fill="#FFD54A"/></svg>',
  mic: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3" fill="currentColor"/><path d="M6 11a6 6 0 0 0 12 0M12 17v4" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round"/></svg>',
  home: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 11 9-7.2 9 7.2v9a1 1 0 0 1-1 1h-5.2v-6H9.2v6H4a1 1 0 0 1-1-1z" fill="currentColor"/></svg>',
  letters: '<svg viewBox="0 0 24 24" aria-hidden="true"><text x="12" y="18.5" text-anchor="middle" font-size="18" font-weight="700" fill="currentColor" font-family="Noto Sans Sinhala, Sinhala Sangam MN, sans-serif">අ</text></svg>',
  dumbbell: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="1.8" y="9" width="3" height="6" rx="1" fill="currentColor"/><rect x="5" y="6.5" width="3.5" height="11" rx="1.2" fill="currentColor"/><rect x="8.5" y="10.8" width="7" height="2.4" fill="currentColor"/><rect x="15.5" y="6.5" width="3.5" height="11" rx="1.2" fill="currentColor"/><rect x="19.2" y="9" width="3" height="6" rx="1" fill="currentColor"/></svg>',
  target: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2.4"/><circle cx="12" cy="12" r="5" fill="none" stroke="currentColor" stroke-width="2.4"/><circle cx="12" cy="12" r="1.8" fill="currentColor"/></svg>',
  user: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4.2" fill="currentColor"/><path d="M4 20.5a8 8 0 0 1 16 0z" fill="currentColor"/></svg>',
  cloud: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 18.5a4.6 4.6 0 0 1-.6-9.2 6 6 0 0 1 11.5 1.7 3.8 3.8 0 0 1-.4 7.5z" fill="currentColor"/></svg>',
  keyboard: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="6" width="20" height="12" rx="2.2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>',
  bolt: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.5 2 4 13.5h6.5L9.5 22 20 9.5h-6.6z" fill="#FFC800"/></svg>',
  clock: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M12 7v5.3l3.4 2" stroke="currentColor" stroke-width="2.4" fill="none" stroke-linecap="round"/></svg>',
  freeze: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2v20M3.3 7l17.4 10M3.3 17 20.7 7" stroke="#4FC3F7" stroke-width="2.4" stroke-linecap="round"/><path d="m9 3.5 3 2.2 3-2.2M9 20.5l3-2.2 3 2.2" stroke="#4FC3F7" stroke-width="2" fill="none" stroke-linecap="round"/></svg>',
};

// Our mascot: Aliya the elephant (අලියා).
export function mascot(mood = 'happy', size = 120) {
  const eyes = mood === 'happy'
    ? '<path d="M41 53q7-8 14 0M65 53q7-8 14 0" stroke="#1d2433" stroke-width="4" fill="none" stroke-linecap="round"/>'
    : mood === 'sad'
      ? '<circle cx="48" cy="55" r="7" fill="#fff"/><circle cx="72" cy="55" r="7" fill="#fff"/><circle cx="48" cy="57" r="4" fill="#1d2433"/><circle cx="72" cy="57" r="4" fill="#1d2433"/><path d="M40 44l12 4M80 44l-12 4" stroke="#55698a" stroke-width="3.5" stroke-linecap="round"/>'
      : '<circle cx="48" cy="52" r="7.5" fill="#fff"/><circle cx="72" cy="52" r="7.5" fill="#fff"/><circle cx="49.5" cy="53" r="4.3" fill="#1d2433"/><circle cx="73.5" cy="53" r="4.3" fill="#1d2433"/><circle cx="51" cy="51.3" r="1.5" fill="#fff"/><circle cx="75" cy="51.3" r="1.5" fill="#fff"/>';
  const mouth = mood === 'sad' ? '<path d="M53 80q7-5 14 0" stroke="#1d2433" stroke-width="3" fill="none" stroke-linecap="round"/>' : '';
  return `<svg class="mascot" width="${size}" height="${size}" viewBox="0 0 120 120" aria-hidden="true">
    <ellipse cx="60" cy="112" rx="30" ry="5" fill="#000" opacity=".08"/>
    <ellipse cx="23" cy="58" rx="22" ry="28" fill="#7F93B4"/><ellipse cx="97" cy="58" rx="22" ry="28" fill="#7F93B4"/>
    <ellipse cx="25" cy="59" rx="13.5" ry="19" fill="#F4B9C8"/><ellipse cx="95" cy="59" rx="13.5" ry="19" fill="#F4B9C8"/>
    <path d="M30 86q30 22 60 0v14q-30 16-60 0z" fill="#E8891C"/><path d="M30 92q30 18 60 0" stroke="#8D153A" stroke-width="3" fill="none"/>
    <ellipse cx="60" cy="56" rx="34" ry="33" fill="#9BAECB"/>
    <path d="M51 68q-3 28 9 36 10 5 15-4-6 2-10-4-4-8 0-28z" fill="#9BAECB"/>
    <path d="M57 74v4M57 84v4" stroke="#7F93B4" stroke-width="2" stroke-linecap="round"/>
    <path d="M54 25q6-10 12 0" stroke="#6E82A4" stroke-width="3" fill="none" stroke-linecap="round"/>
    ${eyes}${mouth}
    <ellipse cx="38" cy="66" rx="5.5" ry="3.4" fill="#F49AB0" opacity=".85"/><ellipse cx="82" cy="66" rx="5.5" ry="3.4" fill="#F49AB0" opacity=".85"/>
    <path d="M44 74q-4 8 2 12M76 74q4 8-2 12" stroke="#fffaf0" stroke-width="4" fill="none" stroke-linecap="round"/>
  </svg>`;
}

// Sinhala line with tap-for-hint words.
export function siLine(si, glosses = [], { cls = '', roman = null, voice = '' } = {}) {
  const toks = rawTokens(si);
  const words = toks.map((t, i) => {
    const clean = t.replace(/[.,!?;:]+/g, '');
    return `<span class="w" tabindex="0" data-t="${esc(clean)}" data-g="${esc(glosses[i] || '')}" data-v="${esc(voice)}">${esc(t)}</span>`;
  }).join(' ');
  const showRoman = roman ?? state.profile.settings.roman;
  return `<div class="si-line ${cls}"><div class="si" lang="si">${words}</div>${showRoman ? `<div class="ro">${esc(romanize(si))}</div>` : ''}</div>`;
}

export function audioBtn(text, { voice = '', big = false, slow = true, label = 'Play audio' } = {}) {
  return `<div class="audio-btns ${big ? 'big' : ''}">
    <button class="audio-btn" data-play="${esc(text)}" data-v="${esc(voice)}" aria-label="${label}">${ICONS.speaker}</button>
    ${slow ? `<button class="audio-btn slow" data-play="${esc(text)}" data-v="${esc(voice)}" data-slow="1" aria-label="Play slowly">${ICONS.turtle}</button>` : ''}
  </div>`;
}

export function toast(msg, { icon = '', ms = 2600 } = {}) {
  const host = document.getElementById('toasts');
  if (!host) return;
  const el = document.createElement('div');
  el.className = 'toast';
  el.innerHTML = `${icon ? `<span class="ti">${icon}</span>` : ''}<span>${msg}</span>`;
  host.appendChild(el);
  requestAnimationFrame(() => el.classList.add('in'));
  setTimeout(() => { el.classList.remove('in'); setTimeout(() => el.remove(), 300); }, ms);
}

export function modal({ title = '', body = '', art = '', buttons = [{ label: 'OK', value: true, cls: 'primary' }], dismiss = null }) {
  return new Promise((resolve) => {
    const wrap = document.createElement('div');
    wrap.className = 'modal-wrap';
    wrap.innerHTML = `<div class="modal" role="dialog" aria-modal="true">
      ${art ? `<div class="modal-art">${art}</div>` : ''}
      ${title ? `<h2>${title}</h2>` : ''}
      ${body ? `<div class="modal-body">${body}</div>` : ''}
      <div class="modal-btns">${buttons.map((b, i) => `<button class="btn ${b.cls || ''}" data-i="${i}">${b.label}</button>`).join('')}</div>
    </div>`;
    document.body.appendChild(wrap);
    requestAnimationFrame(() => wrap.classList.add('in'));
    const close = (v) => { wrap.classList.remove('in'); setTimeout(() => wrap.remove(), 200); resolve(v); };
    wrap.addEventListener('click', (e) => {
      const b = e.target.closest('[data-i]');
      if (b) return close(buttons[+b.dataset.i].value);
      if (e.target === wrap && dismiss !== null) close(dismiss);
    });
  });
}

export function confetti(n = 90) {
  const c = document.createElement('canvas');
  c.className = 'confetti';
  const W = c.width = innerWidth * devicePixelRatio, H = c.height = innerHeight * devicePixelRatio;
  document.body.appendChild(c);
  const ctx = c.getContext('2d');
  const colors = ['#E8891C', '#8D153A', '#FFC800', '#26A8F0', '#2EB872', '#FF4B4B'];
  const ps = Array.from({ length: n }, () => ({
    x: W / 2 + (Math.random() - 0.5) * W * 0.3, y: H * 0.35, vx: (Math.random() - 0.5) * 18 * devicePixelRatio,
    vy: (-Math.random() * 18 - 6) * devicePixelRatio, r: (4 + Math.random() * 5) * devicePixelRatio, c: colors[Math.floor(Math.random() * colors.length)],
    a: Math.random() * Math.PI, va: (Math.random() - 0.5) * 0.3,
  }));
  let t = 0;
  (function frame() {
    ctx.clearRect(0, 0, W, H);
    for (const p of ps) {
      p.vy += 0.6 * devicePixelRatio; p.x += p.vx; p.y += p.vy; p.a += p.va; p.vx *= 0.99;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a); ctx.fillStyle = p.c; ctx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r); ctx.restore();
    }
    if (++t < 140) requestAnimationFrame(frame); else c.remove();
  })();
}

// Simple popover for word hints.
let tip = null;
export function showHint(el, text) {
  hideHint();
  if (!text) return;
  tip = document.createElement('div');
  tip.className = 'hint-tip';
  tip.textContent = text;
  document.body.appendChild(tip);
  const r = el.getBoundingClientRect();
  const tr = tip.getBoundingClientRect();
  let left = r.left + r.width / 2 - tr.width / 2;
  left = Math.max(8, Math.min(innerWidth - tr.width - 8, left));
  tip.style.left = left + 'px';
  tip.style.top = (r.bottom + 8) + 'px';
  el.classList.add('hinted');
  tip._el = el;
}
export function hideHint() { if (tip) { tip._el?.classList.remove('hinted'); tip.remove(); tip = null; } }
