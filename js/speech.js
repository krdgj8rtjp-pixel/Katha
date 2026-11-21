// Speaking check: turn a recording into 16 kHz mono WAV, send it to the
// "transcribe" helper (Azure, via Supabase), and grade it against the target.
import { levenshtein } from './translit.js';
import { foldT, isSi } from './lang.js';
import { COURSE } from '../data/course.js';
import { transcribe, canTranscribe } from './sync.js';
import { state } from './store.js';

export const speechCheckOn = () => state.profile.settings.speechCheck !== false && canTranscribe();

// ---------- audio → WAV
export async function toWav16k(blob, { maxSeconds = 10 } = {}) {
  const AC = window.AudioContext || window.webkitAudioContext;
  const OAC = window.OfflineAudioContext || window.webkitOfflineAudioContext;
  const ctx = new AC();
  let decoded;
  try {
    const buf = await blob.arrayBuffer();
    decoded = await new Promise((res, rej) => {
      const p = ctx.decodeAudioData(buf, res, rej);
      if (p && p.then) p.then(res, rej);
    });
  } finally { try { ctx.close(); } catch {} }
  const rate = 16000;
  const length = Math.max(1, Math.ceil(decoded.duration * rate));
  const off = new OAC(1, length, rate);
  const src = off.createBufferSource();
  src.buffer = decoded; src.connect(off.destination); src.start(0);
  const rendered = await off.startRendering();
  let data = trimSilence(rendered.getChannelData(0), rate);
  if (data.length > rate * maxSeconds) data = data.subarray(0, rate * maxSeconds);
  return { wav: encodeWav(data, rate), seconds: data.length / rate };
}

function trimSilence(x, rate) {
  const win = Math.floor(rate * 0.02);
  const rms = [];
  let peak = 0;
  for (let i = 0; i < x.length; i += win) {
    let s = 0; const end = Math.min(x.length, i + win);
    for (let j = i; j < end; j++) s += x[j] * x[j];
    const r = Math.sqrt(s / Math.max(1, end - i));
    rms.push(r); if (r > peak) peak = r;
  }
  const thr = Math.max(0.008, peak * 0.08);
  let a = rms.findIndex(r => r > thr), b = rms.length - 1 - [...rms].reverse().findIndex(r => r > thr);
  if (a < 0) return x; // all quiet — let the server say so
  const pad = Math.floor(rate * 0.25);
  return x.subarray(Math.max(0, a * win - pad), Math.min(x.length, (b + 1) * win + pad));
}

function encodeWav(samples, rate) {
  const buf = new ArrayBuffer(44 + samples.length * 2);
  const v = new DataView(buf);
  const w = (o, s) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
  w(0, 'RIFF'); v.setUint32(4, 36 + samples.length * 2, true); w(8, 'WAVE');
  w(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
  v.setUint32(24, rate, true); v.setUint32(28, rate * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true);
  w(36, 'data'); v.setUint32(40, samples.length * 2, true);
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    v.setInt16(44 + i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  return new Blob([buf], { type: 'audio/wav' });
}

// ---------- grading
const DIGITS_SI = { 1: 'එක', 2: 'දෙක', 3: 'තුන', 4: 'හතර', 5: 'පහ', 6: 'හය', 7: 'හත', 8: 'අට', 9: 'නවය', 10: 'දහය', 20: 'විස්ස', 50: 'පනහ', 80: 'අසූව', 100: 'සීය' };
// Spoken/written spellings the recognizer may use for the same word.
const DIGITS_ES = { 1: 'uno', 2: 'dos', 3: 'tres', 4: 'cuatro', 5: 'cinco', 6: 'seis', 7: 'siete', 8: 'ocho', 9: 'nueve', 10: 'diez', 15: 'quince', 20: 'veinte', 50: 'cincuenta', 100: 'cien' };
const SAME = [['නැහැ', 'නෑ', 'නැ'], ['ඕනේ', 'ඕනෑ'], ['හොඳයි', 'හොදයි'], ['ස්තුතියි', 'ස්තූතියි'], ['මොකක්ද', 'මොකද්ද'], ['කීයද', 'කීයක්ද']];
const canon = {};
SAME.forEach(g => g.forEach(w => { canon[w] = g[0]; }));

function tokens(s) {
  const D = isSi() ? DIGITS_SI : DIGITS_ES;
  const withWords = String(s || '').replace(/\d+/g, d => ` ${D[d] || d} `);
  return foldT(withWords).split(' ').filter(Boolean).map(w => canon[w] || w);
}
const close = (a, b) => a === b || levenshtein(a, b) <= Math.max(1, Math.floor(Math.max(a.length, b.length) / 4));

// Returns { score 0..1, hits: bool per target word, heard }
export function grade(target, heardOptions) {
  const T = tokens(target);
  let best = { score: 0, hits: T.map(() => false), heard: heardOptions[0] || '' };
  for (const h of heardOptions) {
    if (!h) continue;
    const H = tokens(h);
    const used = new Set();
    const hits = T.map(t => {
      const j = H.findIndex((w, k) => !used.has(k) && close(t, w));
      if (j >= 0) { used.add(j); return true; }
      return false;
    });
    const wordScore = hits.filter(Boolean).length / Math.max(1, T.length);
    const a = T.join(''), b = H.join('');
    const charScore = Math.max(0, 1 - levenshtein(a, b) / Math.max(a.length, 1));
    const score = Math.max(wordScore, charScore * 0.95);
    if (score > best.score) best = { score, hits: wordScore >= charScore * 0.95 ? hits : T.map((t) => H.some(w => close(t, w))), heard: h };
  }
  return best;
}

export async function checkRecording(blob, target) {
  const { wav, seconds } = await toWav16k(blob);
  if (seconds < 0.3) return { score: 0, hits: [], heard: '', empty: true };
  const res = await transcribe(wav, COURSE.speechLang);
  const options = [res.text, ...(res.alternatives || []).flatMap(a => [a.text, a.lexical])].filter(Boolean);
  if (!options.length) return { score: 0, hits: tokens(target).map(() => false), heard: '', empty: true };
  return grade(target, options);
}
