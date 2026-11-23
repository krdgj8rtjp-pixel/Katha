// Speaking check: turn a recording into 16 kHz mono WAV, send it to the
// "transcribe" helper (Azure, via Supabase), and grade it against the target.
import { levenshtein } from './translit.js';
import { foldT, isSi, isTa, isUz } from './lang.js';
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
const DIGITS_SW = { 1: 'moja', 2: 'mbili', 3: 'tatu', 4: 'nne', 5: 'tano', 6: 'sita', 7: 'saba', 8: 'nane', 9: 'tisa', 10: 'kumi', 20: 'ishirini', 50: 'hamsini', 80: 'themanini', 100: 'mia moja' };
const DIGITS_UZ = { 1: 'bir', 2: 'ikki', 3: 'uch', 4: 'toʻrt', 5: 'besh', 6: 'olti', 7: 'yetti', 8: 'sakkiz', 9: 'toʻqqiz', 10: 'oʻn', 15: 'oʻn besh', 20: 'yigirma', 50: 'ellik', 100: 'yuz', 1000: 'ming' };
// Sri Lankan Tamil numbers as spoken; the recognizer (Indian Tamil) may write digits or the written forms.
const DIGITS_TA = { 1: 'ஒண்டு', 2: 'ரெண்டு', 3: 'மூண்டு', 4: 'நாலு', 5: 'அஞ்சு', 6: 'ஆறு', 7: 'ஏழு', 8: 'எட்டு', 9: 'ஒன்பது', 10: 'பத்து', 20: 'இருபது', 50: 'ஐம்பது', 100: 'நூறு', 200: 'இருநூறு', 1000: 'ஆயிரம்' };
const SAME = [['නැහැ', 'නෑ', 'නැ'], ['ඕනේ', 'ඕනෑ'], ['හොඳයි', 'හොදයි'], ['ස්තුතියි', 'ස්තූතියි'], ['මොකක්ද', 'මොකද්ද'], ['කීයද', 'කීයක්ද'],
  ['ஒண்டு', 'ஒன்று', 'ஒன்னு'], ['ரெண்டு', 'இரண்டு'], ['மூண்டு', 'மூன்று', 'மூணு'], ['அஞ்சு', 'ஐந்து'], ['ஓம்', 'ஆம்'], ['நன்றி', 'நன்றீ'], ['இண்டைக்கு', 'இன்றைக்கு'], ['எங்கை', 'எங்கே'], ['இஞ்சை', 'இங்கே'], ['வேணும்', 'வேண்டும்'], ['எப்பிடி', 'எப்படி']];
// Uzbek: everyday Russian words and their Uzbek equivalents count as the same word (with common endings).
const SAME_UZ = [['apteka', 'dorihona'], ['aptekaga', 'dorihonaga'], ['aptekada', 'dorihonada'], ['aptekadan', 'dorihonadan'], ['aptekani', 'dorihonani'], ['vrach', 'shifokor', 'doktor'], ['vrachga', 'shifokorga', 'doktorga'], ['vrachda', 'shifokorda', 'doktorda'], ['vrachdan', 'shifokordan', 'doktordan'], ['vrachni', 'shifokorni', 'doktorni'], ['tualet', 'hojathona'], ['tualetga', 'hojathonaga'], ['tualetda', 'hojathonada'], ['tualetdan', 'hojathonadan'], ['tualetni', 'hojathonani'], ['schyot', 'hisob', 'schet'], ['schyotga', 'hisobga', 'schetga'], ['schyotda', 'hisobda', 'schetda'], ['schyotdan', 'hisobdan', 'schetdan'], ['schyotni', 'hisobni', 'schetni'], ['ostanovka', 'bekat'], ['ostanovkaga', 'bekatga'], ['ostanovkada', 'bekatda'], ['ostanovkadan', 'bekatdan'], ['ostanovkani', 'bekatni'], ['bolnitsa', 'kasalhona', 'shifohona'], ['bolnitsaga', 'kasalhonaga', 'shifohonaga'], ['bolnitsada', 'kasalhonada', 'shifohonada'], ['bolnitsadan', 'kasalhonadan', 'shifohonadan'], ['bolnitsani', 'kasalhonani', 'shifohonani'], ['magazin', 'dokon'], ['magazinga', 'dokonga'], ['magazinda', 'dokonda'], ['magazindan', 'dokondan'], ['magazinni', 'dokonni'], ['magaziningiz', 'dokoningiz'], ['magaziningizni', 'dokoningizni'], ['magazinim', 'dokonim'], ['razmer', 'olcham'], ['razmerga', 'olchamga'], ['razmerda', 'olchamda'], ['razmerdan', 'olchamdan'], ['razmerni', 'olchamni'], ['razmeringiz', 'olchamingiz'], ['razmeringizni', 'olchamingizni'], ['razmerim', 'olchamim'], ['skidka', 'chegirma'], ['skidkaga', 'chegirmaga'], ['skidkada', 'chegirmada'], ['skidkadan', 'chegirmadan'], ['skidkani', 'chegirmani'], ['skidkaingiz', 'chegirmaingiz'], ['skidkaingizni', 'chegirmaingizni'], ['skidkaim', 'chegirmaim'], ['sdacha', 'kaytim'], ['sdachaga', 'kaytimga'], ['sdachada', 'kaytimda'], ['sdachadan', 'kaytimdan'], ['sdachani', 'kaytimni'], ['sdachaingiz', 'kaytimingiz'], ['sdachaingizni', 'kaytimingizni'], ['sdachaim', 'kaytimim'], ['holodilnik', 'muzlatgich'], ['holodilnikga', 'muzlatgichga'], ['holodilnikda', 'muzlatgichda'], ['holodilnikdan', 'muzlatgichdan'], ['holodilnikni', 'muzlatgichni'], ['holodilnikingiz', 'muzlatgichingiz'], ['holodilnikingizni', 'muzlatgichingizni'], ['holodilnikim', 'muzlatgichim'], ['nomer', 'rakam'], ['nomerga', 'rakamga'], ['nomerda', 'rakamda'], ['nomerdan', 'rakamdan'], ['nomerni', 'rakamni'], ['nomeringiz', 'rakamingiz'], ['nomeringizni', 'rakamingizni'], ['nomerim', 'rakamim'], ['student', 'talaba'], ['studentga', 'talabaga'], ['studentda', 'talabada'], ['studentdan', 'talabadan'], ['studentni', 'talabani'], ['studentingiz', 'talabaingiz'], ['studentingizni', 'talabaingizni'], ['studentim', 'talabaim'], ['park', 'bog'], ['parkga', 'bogga'], ['parkda', 'bogda'], ['parkdan', 'bogdan'], ['parkni', 'bogni'], ['parkingiz', 'bogingiz'], ['parkingizni', 'bogingizni'], ['parkim', 'bogim'], ['stul', 'kursi'], ['stulga', 'kursiga'], ['stulda', 'kursida'], ['stuldan', 'kursidan'], ['stulni', 'kursini'], ['stulingiz', 'kursiingiz'], ['stulingizni', 'kursiingizni'], ['stulim', 'kursiim'], ['zal', 'mehmonhona'], ['zalga', 'mehmonhonaga'], ['zalda', 'mehmonhonada'], ['zaldan', 'mehmonhonadan'], ['zalni', 'mehmonhonani'], ['zalingiz', 'mehmonhonaingiz'], ['zalingizni', 'mehmonhonaingizni'], ['zalim', 'mehmonhonaim'], ['minut', 'dakika'], ['minutga', 'dakikaga'], ['minutda', 'dakikada'], ['minutdan', 'dakikadan'], ['minutni', 'dakikani'], ['minutingiz', 'dakikaingiz'], ['minutingizni', 'dakikaingizni'], ['minutim', 'dakikaim'], ['svet', 'elektr'], ['svetga', 'elektrga'], ['svetda', 'elektrda'], ['svetdan', 'elektrdan'], ['svetni', 'elektrni'], ['svetingiz', 'elektringiz'], ['svetingizni', 'elektringizni'], ['svetim', 'elektrim']];
const canon = {};
[...SAME, ...SAME_UZ].forEach(g => g.forEach(w => { canon[w] = g[0]; }));

function tokens(s) {
  const D = isSi() ? DIGITS_SI : isTa() ? DIGITS_TA : isUz() ? DIGITS_UZ : COURSE.id === 'sw' ? DIGITS_SW : DIGITS_ES;
  let text = String(s || '');
  if (isUz()) text = text.replace(/(\d+)[\s,.\u00a0]?000\b/g, '$1 ming'); // "50 000 so'm" → "50 ming so'm"
  const withWords = text.replace(/\d+/g, d => ` ${D[d] || d} `);
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
