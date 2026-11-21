// Little synthesized sound effects — no audio files needed.
import { state } from './store.js';

let ctx = null;
function ac() {
  if (!ctx) { try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch { return null; } }
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
}
export function unlock() { ac(); }

function tone(freq, start, dur, { type = 'sine', gain = 0.18, slideTo = null } = {}) {
  const c = ac(); if (!c) return;
  const t0 = c.currentTime + start;
  const o = c.createOscillator(), g = c.createGain();
  o.type = type; o.frequency.setValueAtTime(freq, t0);
  if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g).connect(c.destination);
  o.start(t0); o.stop(t0 + dur + 0.05);
}

const on = () => state.profile.settings.sound !== false;

export const sfx = {
  correct() { if (!on()) return; tone(660, 0, 0.12, { type: 'triangle' }); tone(990, 0.09, 0.22, { type: 'triangle' }); },
  wrong() { if (!on()) return; tone(220, 0, 0.18, { type: 'square', gain: 0.07 }); tone(165, 0.12, 0.25, { type: 'square', gain: 0.07 }); },
  tap() { if (!on()) return; tone(520, 0, 0.05, { type: 'sine', gain: 0.08 }); },
  match() { if (!on()) return; tone(880, 0, 0.1, { type: 'triangle', gain: 0.12 }); },
  complete() { if (!on()) return; [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.11, 0.3, { type: 'triangle', gain: 0.15 })); },
  chest() { if (!on()) return; [784, 988, 1175, 1568].forEach((f, i) => tone(f, i * 0.07, 0.25, { type: 'sine', gain: 0.12 })); },
  tick() { if (!on()) return; tone(1046, 0, 0.08, { type: 'triangle', gain: 0.1 }); tone(1568, 0.05, 0.12, { type: 'sine', gain: 0.07 }); },
  whoosh() { if (!on()) return; tone(260, 0, 0.22, { type: 'sine', gain: 0.06, slideTo: 620 }); },
  fanfare() { if (!on()) return; [523, 659, 784, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.12, i === 5 ? 0.6 : 0.2, { type: 'triangle', gain: 0.15 })); },
  streak() { if (!on()) return; tone(300, 0, 0.5, { type: 'sawtooth', gain: 0.05, slideTo: 900 }); tone(1200, 0.45, 0.3, { type: 'triangle', gain: 0.12 }); },
};
