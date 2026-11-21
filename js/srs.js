// Lightweight spaced repetition. A card's `s` (stability, in days) is the gap at
// which recall probability falls to ~90%. Correct answers grow it — more so when
// the review came late (spacing effect); misses shrink it.
export const DAY = 86400000;

export function review(card, good, now = Date.now()) {
  if (!card) {
    return { s: good ? 1 : 0.3, due: now + (good ? 1 : 0.3) * DAY, last: now, reps: 1, lapses: good ? 0 : 1 };
  }
  const elapsed = Math.max(0, (now - card.last) / DAY);
  let s = card.s;
  if (good) {
    const ratio = Math.min(1.5, Math.max(0.12, elapsed / s));
    s = s + s * 1.8 * ratio;
  } else {
    s = Math.max(0.2, s * 0.35);
  }
  s = Math.min(s, 365);
  return { s, due: now + s * DAY, last: now, reps: (card.reps || 0) + 1, lapses: (card.lapses || 0) + (good ? 0 : 1) };
}

export function recall(card, now = Date.now()) {
  if (!card) return 0;
  const elapsed = Math.max(0, (now - card.last) / DAY);
  return Math.pow(0.9, elapsed / card.s);
}

// 0 = not learned, 1..4 bars
export function strength(card, now = Date.now()) {
  if (!card) return 0;
  const r = recall(card, now);
  if (card.s >= 7 && r >= 0.9) return 4;
  if (r >= 0.9) return 3;
  if (r >= 0.75) return 2;
  return 1;
}

export function isDue(card, now = Date.now()) {
  return !!card && card.due <= now;
}
