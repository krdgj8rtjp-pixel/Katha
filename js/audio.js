// Plays Sinhala audio. Prefers pre-generated clips (audio/<key>.mp3, listed in
// audio/index.json); falls back to the device's own Sinhala voice if it has one.
import { clipKey } from './util.js';
import { DEFAULT_VOICE } from '../data/course.js';
import { setTalking } from './characters.js';

let have = new Set();
let base = 'audio/';
let siVoice = null;
let el = null;
let current = null;

function pickVoice() {
  if (!('speechSynthesis' in window)) return;
  const vs = speechSynthesis.getVoices();
  siVoice = vs.find(v => /^si([-_]|$)/i.test(v.lang)) || null;
}

export async function initAudio(dir = 'audio/') {
  base = dir;
  try {
    if ('speechSynthesis' in window) { pickVoice(); speechSynthesis.addEventListener?.('voiceschanged', pickVoice); }
  } catch {}
  try {
    const r = await fetch(base + 'index.json', { cache: 'no-cache' });
    if (r.ok) have = new Set(await r.json());
  } catch {}
}

export const hasClips = () => have.size > 0;
export const deviceVoice = () => siVoice;
export function available() { return have.size > 0 || !!siVoice; }
export function canPlay(text, voice = DEFAULT_VOICE) {
  if (!text) return false;
  return have.has(clipKey(text, voice)) || !!siVoice;
}

export function stop() {
  setTalking('', false);
  try { if (el) { el.pause(); } } catch {}
  try { if ('speechSynthesis' in window) speechSynthesis.cancel(); } catch {}
  if (current) { current(); current = null; }
}

export function play(text, { voice = DEFAULT_VOICE, slow = false } = {}) {
  stop();
  return new Promise((resolve) => {
    if (!text) return resolve(false);
    const k = clipKey(text, voice, slow);
    const kn = clipKey(text, voice, false);
    const file = have.has(k) ? k : have.has(kn) ? kn : null;
    if (file) {
      if (!el) { el = new Audio(); el.preload = 'auto'; }
      el.src = base + file + '.mp3';
      el.playbackRate = (slow && file === kn) ? 0.7 : 1;
      try { el.preservesPitch = true; } catch {}
      const done = () => { el.onended = el.onerror = null; current = null; setTalking(text, false); resolve(true); };
      current = () => resolve(true);
      el.onended = done; el.onerror = () => { current = null; setTalking(text, false); resolve(false); };
      el.onplaying = () => setTalking(text, true);
      el.play().catch(() => { current = null; setTalking(text, false); resolve(false); });
      return;
    }
    if (siVoice && 'speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance(text);
      u.voice = siVoice; u.lang = siVoice.lang; u.rate = slow ? 0.6 : 0.9;
      current = () => resolve(true);
      u.onstart = () => setTalking(text, true);
      u.onend = () => { current = null; setTalking(text, false); resolve(true); };
      u.onerror = () => { current = null; setTalking(text, false); resolve(false); };
      speechSynthesis.speak(u);
      return;
    }
    resolve(false);
  });
}
