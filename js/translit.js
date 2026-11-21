// Sinhala script → learner-friendly romanization, plus lenient answer matching.
// Long vowels get macrons (ā ē ī ō ū), æ/ǣ for the "cat" vowel,
// a dot under retroflex consonants (ṭ ḍ ṇ ḷ). Pre-nasalized letters are
// written nd / ng / mb so they read naturally.

const INDEP = {
  'අ': 'a', 'ආ': 'ā', 'ඇ': 'æ', 'ඈ': 'ǣ', 'ඉ': 'i', 'ඊ': 'ī', 'උ': 'u', 'ඌ': 'ū',
  'ඍ': 'ṛ', 'ඎ': 'ṝ', 'එ': 'e', 'ඒ': 'ē', 'ඓ': 'ai', 'ඔ': 'o', 'ඕ': 'ō', 'ඖ': 'au',
};
const CONS = {
  'ක': 'k', 'ඛ': 'kh', 'ග': 'g', 'ඝ': 'gh', 'ඞ': 'ṅ', 'ඟ': 'ng',
  'ච': 'c', 'ඡ': 'ch', 'ජ': 'j', 'ඣ': 'jh', 'ඤ': 'ñ', 'ඥ': 'gn', 'ඦ': 'nj',
  'ට': 'ṭ', 'ඨ': 'ṭh', 'ඩ': 'ḍ', 'ඪ': 'ḍh', 'ණ': 'ṇ', 'ඬ': 'nḍ',
  'ත': 't', 'ථ': 'th', 'ද': 'd', 'ධ': 'dh', 'න': 'n', 'ඳ': 'nd',
  'ප': 'p', 'ඵ': 'ph', 'බ': 'b', 'භ': 'bh', 'ම': 'm', 'ඹ': 'mb',
  'ය': 'y', 'ර': 'r', 'ල': 'l', 'ව': 'v', 'ශ': 'ś', 'ෂ': 'ṣ', 'ස': 's', 'හ': 'h',
  'ළ': 'ḷ', 'ෆ': 'f',
};
const SIGNS = {
  'ා': 'ā', 'ැ': 'æ', 'ෑ': 'ǣ', 'ි': 'i', 'ී': 'ī', 'ු': 'u', 'ූ': 'ū',
  'ෘ': 'ṛ', 'ෲ': 'ṝ', 'ෙ': 'e', 'ේ': 'ē', 'ෛ': 'ai', 'ො': 'o', 'ෝ': 'ō', 'ෞ': 'au',
};
const VIRAMA = '්';
const ZWJ = '‍';
const ZWNJ = '‌';

export function romanize(text) {
  if (!text) return '';
  const chars = Array.from(text.normalize('NFC'));
  let out = '';
  for (let i = 0; i < chars.length; i++) {
    const c = chars[i];
    if (c === ZWJ || c === ZWNJ) continue;
    if (CONS[c]) {
      out += CONS[c];
      // look ahead past joiners
      let j = i + 1;
      while (chars[j] === ZWJ || chars[j] === ZWNJ) j++;
      const nx = chars[j];
      if (nx === VIRAMA) { i = j; continue; }
      if (SIGNS[nx]) { out += SIGNS[nx]; i = j; continue; }
      out += 'a';
      continue;
    }
    if (INDEP[c]) { out += INDEP[c]; continue; }
    if (c === 'ං') { out += 'ṅ'; continue; }
    if (c === 'ඃ') { out += 'h'; continue; }
    if (SIGNS[c] || c === VIRAMA) continue; // stray sign
    out += c;
  }
  return out;
}

// --- lenient matching -------------------------------------------------------

// Fold a romanized or English string to a plain skeleton for comparison.
export function foldLatin(s) {
  return s
    .toLowerCase()
    .replace(/[æǣ]/g, 'a')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[’'`]/g, '')
    .replace(/[^a-z0-9 ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Extra folding for romanized Sinhala typed by learners ("sthuthi", "kohomadha").
export function foldRoman(s) {
  return foldLatin(s)
    .replace(/ae/g, 'a')
    .replace(/th/g, 't').replace(/dh/g, 'd').replace(/kh/g, 'k').replace(/gh/g, 'g')
    .replace(/ph/g, 'p').replace(/bh/g, 'b').replace(/sh/g, 's').replace(/ch/g, 'c')
    .replace(/w/g, 'v')
    .replace(/([aeiou])\1+/g, '$1')
    .replace(/([bcdfghjklmnpqrstvyz])\1+/g, '$1')
    .replace(/\s+/g, '');
}

export function foldSinhala(s) {
  return s.normalize('NFC').replace(/[‌‍]/g, '').replace(/[^඀-෿ ]+/g, ' ').replace(/\s+/g, ' ').trim();
}

export function isSinhala(s) {
  return /[඀-෿]/.test(s);
}

export function levenshtein(a, b) {
  if (a === b) return 0;
  const m = a.length, n = b.length;
  if (!m) return n; if (!n) return m;
  let prev = new Array(n + 1);
  for (let j = 0; j <= n; j++) prev[j] = j;
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = cur;
  }
  return prev[n];
}

// Compare a typed answer to a list of acceptable answers.
// Returns 'exact' | 'typo' | false
export function matchAnswer(input, accepted, mode = 'en') {
  const fold = mode === 'roman' ? foldRoman : foldLatin;
  const a = fold(input);
  if (!a) return false;
  let best = Infinity;
  for (const acc of accepted) {
    const b = fold(acc);
    if (a === b) return 'exact';
    const d = levenshtein(a, b);
    if (d < best) best = d;
  }
  const len = Math.max(4, fold(accepted[0] || '').length);
  const allowed = len <= 5 ? 1 : Math.max(1, Math.floor(len / 7));
  return best <= allowed ? 'typo' : false;
}
