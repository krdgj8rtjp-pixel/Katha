export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export function shuffle(a) {
  a = a.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
export const pick = (a) => a[Math.floor(Math.random() * a.length)];
export const sample = (a, n) => shuffle(a).slice(0, n);
export const uniq = (a) => [...new Set(a)];
export const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const PUNCT = /[.,!?;:“”"…]+/g;
// Sinhala sentence → word tiles (no punctuation)
export const siTokens = (si) => si.replace(PUNCT, ' ').trim().split(/\s+/).filter(Boolean);
// English sentence → word tiles (no trailing punctuation, keeps apostrophes)
export const enTokens = (en) => en.replace(/[.,!?;:"…]+/g, ' ').trim().split(/\s+/).filter(Boolean);
// Display tokens keep their punctuation (for tap-to-hint lines)
export const rawTokens = (s) => s.trim().split(/\s+/);

// FNV-1a — shared by the app and tools/generate-audio.mjs to name clip files.
export function clipKey(text, voice, slow = false) {
  const s = `${voice}|${slow ? 'slow' : 'normal'}|${text.normalize('NFC').trim()}`;
  let h = 0x811c9dc5;
  for (const ch of new TextEncoder().encode(s)) { h ^= ch; h = Math.imul(h, 0x01000193) >>> 0; }
  return h.toString(16).padStart(8, '0');
}

export function fmtDuration(ms) {
  const s = Math.round(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}
export function plural(n, one, many = one + 's') { return `${n} ${n === 1 ? one : many}`; }
