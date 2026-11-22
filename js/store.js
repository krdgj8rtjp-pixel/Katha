// Progress store. Everything is designed to merge cleanly between devices:
// counters are kept per device, rewards are sets of claim ids, and cards keep
// the newest review. See merge() below.
import { review, strength, recall } from './srs.js';
import { UNITS, LEX, COURSES } from '../data/course.js';

const KEY = 'katha.v1';
const DEV_KEY = 'katha.device';
export const MAX_HEARTS = 5;
export const HEART_REGEN = 60 * 60 * 1000; // one heart per hour
export const PRICES = { freeze: 150, refill: 100, boost: 100 };
export const BOOST_MS = 15 * 60 * 1000; // a 2× XP boost lasts 15 minutes
export const STREAK_GIFTS = { 3: 20, 7: 50, 14: 75, 30: 150, 50: 200, 100: 500, 365: 1000 };
export const MAX_FREEZES = 2;

let memory = {};
const ls = {
  get(k) { try { return localStorage.getItem(k); } catch { return memory[k] ?? null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch { memory[k] = v; } },
  del(k) { try { localStorage.removeItem(k); } catch { delete memory[k]; } },
};
export const storage = ls;

function uid() { return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4); }
export const DEVICE = ls.get(DEV_KEY) || (() => { const d = uid(); ls.set(DEV_KEY, d); return d; })();

export function blank() {
  return {
    v: 1,
    profile: { name: '', goal: 20, created: Date.now(), onboarded: false, u: 0, avatar: 'aliya', course: 'si',
      settings: { sound: true, roman: true, hearts: true, listening: true, speaking: true, speechCheck: true } },
    lessons: {}, srs: {}, letters: {},
    log: {}, claims: {}, purchases: {}, frozen: {}, boosts: {},
    hearts: { n: MAX_HEARTS, ts: Date.now(), u: 0 },
    speakOff: 0, listenOff: 0,
  };
}

function fill(s) {
  const b = blank();
  const out = { ...b, ...s };
  out.profile = { ...b.profile, ...(s.profile || {}) };
  out.profile.settings = { ...b.profile.settings, ...((s.profile || {}).settings || {}) };
  for (const k of ['lessons', 'srs', 'letters', 'log', 'claims', 'purchases', 'frozen', 'boosts']) out[k] = out[k] || {};
  out.hearts = out.hearts || b.hearts;
  return out;
}

export let state = fill(JSON.parse(ls.get(KEY) || 'null') || {});

const subs = new Set();
export function subscribe(fn) { subs.add(fn); return () => subs.delete(fn); }
let saveTimer = null;
export function save({ quiet = false } = {}) {
  ls.set(KEY, JSON.stringify(state));
  if (!quiet) subs.forEach(fn => { try { fn(state); } catch (e) { console.error(e); } });
}
export function replaceState(s) { state = fill(s); save(); }
export function resetAll() { state = blank(); save(); }

// ---------- dates
export function dateKey(d = new Date()) {
  const y = d.getFullYear(), m = String(d.getMonth() + 1).padStart(2, '0'), day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
export function addDays(key, n) {
  const [y, m, d] = key.split('-').map(Number);
  return dateKey(new Date(y, m - 1, d + n));
}
export const today = () => dateKey();

// ---------- per-day log (this device only writes its own bucket)
const LOG_FIELDS = ['xp', 'lessons', 'perfect', 'combo', 'letters', 'stories', 'practice', 'listen', 'speak', 'ms'];
export function myDay(key = today()) {
  const dev = state.log[DEVICE] || (state.log[DEVICE] = {});
  return dev[key] || (dev[key] = {});
}
export function dayTotals(key = today()) {
  const t = {};
  for (const f of LOG_FIELDS) t[f] = 0;
  for (const dev of Object.values(state.log)) {
    const d = dev[key]; if (!d) continue;
    for (const f of LOG_FIELDS) t[f] = f === 'combo' ? Math.max(t[f], d[f] || 0) : t[f] + (d[f] || 0);
  }
  return t;
}
export function totalXP() {
  let n = 0;
  for (const dev of Object.values(state.log)) for (const d of Object.values(dev)) n += d.xp || 0;
  return n;
}
function activeDates() {
  const set = new Set();
  for (const dev of Object.values(state.log)) for (const [k, d] of Object.entries(dev)) if ((d.xp || 0) > 0) set.add(k);
  return set;
}

// ---------- streak
export function streakInfo() {
  const act = activeDates();
  const ok = (k) => act.has(k) || state.frozen[k];
  const t = today();
  const doneToday = act.has(t);
  let k = doneToday ? t : addDays(t, -1);
  let n = 0;
  while (ok(k)) { n++; k = addDays(k, -1); }
  let longest = 0, run = 0;
  const all = [...new Set([...act, ...Object.keys(state.frozen)])].sort();
  let prev = null;
  for (const d of all) { run = prev && addDays(prev, 1) === d ? run + 1 : 1; longest = Math.max(longest, run); prev = d; }
  return { streak: n, doneToday, longest, isFrozen: ok };
}

// Use streak freezes for missed days (up to what's owned), run on app open.
export function applyFreezes() {
  const act = activeDates();
  const t = today();
  const missed = [];
  let k = addDays(t, -1);
  while (!act.has(k) && !state.frozen[k] && missed.length < 3) { missed.push(k); k = addDays(k, -1); }
  if (!missed.length || missed.length > freezesOwned()) return 0;
  // only worth it if there was a streak before the gap
  if (!act.has(k) && !state.frozen[k]) return 0;
  for (const m of missed) state.frozen[m] = 1;
  save();
  return missed.length;
}

// ---------- gems (derived from claims and purchases, so merging never double-counts)
export const ACHIEVEMENTS = [
  { id: 'streak', name: 'Keep the Fire', desc: n => `Reach a ${n} day streak`, tiers: [3, 7, 14, 30, 60, 100], stat: () => streakInfo().longest },
  { id: 'xp', name: 'XP Collector', desc: n => `Earn ${n} XP`, tiers: [100, 250, 500, 1000, 2500, 5000], stat: () => totalXP() },
  { id: 'words', name: 'Word Hoard', desc: n => `Learn ${n} words and phrases`, tiers: [10, 25, 50, 75, 100, 200], stat: () => wordsLearned() },
  { id: 'perfect', name: 'Flawless', desc: n => `Finish ${n} lessons with no mistakes`, tiers: [1, 5, 10, 25, 50, 100], stat: () => sumLog('perfect') },
  { id: 'letters', name: 'Script Reader', desc: n => `Master ${n} letters`, tiers: [6, 12, 24, 36, 48, 54], stat: () => lettersMastered() },
  { id: 'stories', name: 'Storyteller', desc: n => `Finish ${n} stories`, tiers: [1, 2, 4, 8, 12, 20], stat: () => storiesDone() },
];
const ACH_REWARD = [10, 15, 20, 30, 40, 50];

export const QUEST_POOL = [
  { id: 'lessons', text: 'Complete 2 lessons', target: 2, stat: 'lessons', reward: 10 },
  { id: 'perfect', text: 'Finish a lesson with no mistakes', target: 1, stat: 'perfect', reward: 15 },
  { id: 'combo', text: 'Get 10 in a row correct', target: 10, stat: 'combo', reward: 10 },
  { id: 'letters', text: 'Do a letters session', target: 1, stat: 'letters', reward: 10, needs: 'letters' },
  { id: 'practice', text: 'Do a practice session', target: 1, stat: 'practice', reward: 10, needs: 'practice' },
  { id: 'listen', text: 'Complete 5 listening exercises', target: 5, stat: 'listen', reward: 10, needs: 'audio' },
  { id: 'story', text: 'Finish a story', target: 1, stat: 'stories', reward: 15, needs: 'story' },
  { id: 'speak', text: 'Say 3 sentences Katha understands', target: 3, stat: 'speak', reward: 15, needs: 'speech' },
];

function hash(str) { let h = 2166136261; for (const c of str) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }

export function questsFor(key = today(), caps = {}) {
  const goal = state.profile.goal || 20;
  const xpQ = { id: 'xp', text: `Earn ${Math.max(20, goal)} XP`, target: Math.max(20, goal), stat: 'xp', reward: 10 };
  const pool = QUEST_POOL.filter(q => !q.needs || caps[q.needs]);
  const seeded = pool.map(q => ({ q, r: hash(key + q.id) })).sort((a, b) => a.r - b.r).map(x => x.q);
  const tot = dayTotals(key);
  return [xpQ, ...seeded.slice(0, 2)].map(q => {
    const progress = Math.min(q.target, tot[q.stat] || 0);
    const cid = `quest:${key}:${q.id}`;
    return { ...q, progress, done: progress >= q.target, claimed: !!state.claims[cid], cid };
  });
}

export function claimReward(cid) {
  const [kind, a, b] = cid.split(':');
  if (kind === 'welcome') return 50;
  if (kind === 'chest') return 20;
  if (kind === 'unit') return 50;
  if (kind === 'goal') return 5;
  if (kind === 'ach') return ACH_REWARD[Number(b)] || 10;
  if (kind === 'quest') { const q = QUEST_POOL.find(x => x.id === cid.split(':')[2]); return q ? q.reward : 10; }
  if (kind === 'qchest') return 15;
  if (kind === 'streak') return STREAK_GIFTS[Number(a)] || 0;
  if (kind === 'early' || kind === 'night') return 10;
  return 0;
}
export function claim(cid) {
  if (state.claims[cid]) return 0;
  state.claims[cid] = Date.now();
  save();
  return claimReward(cid);
}
export function gems() {
  let g = 0;
  for (const cid of Object.keys(state.claims)) g += claimReward(cid);
  for (const p of Object.values(state.purchases)) g -= p.cost;
  return Math.max(0, g);
}
export function freezesOwned() {
  const bought = Object.values(state.purchases).filter(p => p.item === 'freeze').length;
  return Math.max(0, bought - Object.keys(state.frozen).length);
}
export function buy(item) {
  const cost = PRICES[item];
  if (gems() < cost) return false;
  if (item === 'freeze' && freezesOwned() >= MAX_FREEZES) return false;
  const pid = uid();
  state.purchases[pid] = { item, cost, ts: Date.now() };
  if (item === 'refill') setHearts(MAX_HEARTS);
  if (item === 'boost') grantBoost('buy:' + pid);
  save();
  return true;
}

// ---------- XP boosts: each grant is a window; a new grant starts when the current one ends
export function boostLeft(now = Date.now()) {
  const gs = Object.values(state.boosts || {});
  let end = 0;
  for (const g of gs) if (g.start <= now && now < g.start + g.ms) end = Math.max(end, g.start + g.ms);
  if (!end) return 0;
  for (let grew = true; grew;) {
    grew = false;
    for (const g of gs) if (g.start <= end && g.start + g.ms > end) { end = g.start + g.ms; grew = true; }
  }
  return end - now;
}
export function grantBoost(id, ms = BOOST_MS) {
  if (state.boosts[id]) return false;
  const now = Date.now();
  state.boosts[id] = { start: now + boostLeft(now), ms };
  save();
  return true;
}
// The daily chest opens once all of today's quests are claimed.
export function questChest(caps) {
  const qs = questsFor(today(), caps);
  const cid = `qchest:${today()}`;
  return { cid, ready: qs.every(q => q.claimed), opened: !!state.claims[cid], left: qs.filter(q => !q.claimed).length };
}
export function openQuestChest(caps) {
  const c = questChest(caps);
  if (!c.ready || c.opened) return 0;
  grantBoost(c.cid);
  return claim(c.cid);
}

// ---------- hearts (last-writer-wins between devices)
export function heartsNow(now = Date.now()) {
  if (!state.profile.settings.hearts) return MAX_HEARTS;
  const { n, ts } = state.hearts;
  if (n >= MAX_HEARTS) return MAX_HEARTS;
  return Math.min(MAX_HEARTS, n + Math.floor((now - ts) / HEART_REGEN));
}
export function nextHeartIn(now = Date.now()) {
  const n = heartsNow(now);
  if (n >= MAX_HEARTS) return 0;
  const { ts } = state.hearts;
  return HEART_REGEN - ((now - ts) % HEART_REGEN);
}
function setHearts(n, now = Date.now()) {
  const cur = heartsNow(now);
  // keep the regen clock running from the last full tick
  const ts = cur >= MAX_HEARTS ? now : state.hearts.ts + Math.floor((now - state.hearts.ts) / HEART_REGEN) * HEART_REGEN;
  state.hearts = { n: Math.max(0, Math.min(MAX_HEARTS, n)), ts: n >= MAX_HEARTS ? now : ts, u: now };
}
export function loseHeart() { if (!state.profile.settings.hearts) return MAX_HEARTS; setHearts(heartsNow() - 1); save(); return heartsNow(); }
export function gainHeart(k = 1) { setHearts(heartsNow() + k); save(); }

// ---------- learning progress
export function lessonDone(id) { return (state.lessons[id]?.done || 0) > 0; }
// Words skipped by a test (card flag `sk`) count once you've practiced them for real.
export function wordsLearned() { return Object.keys(state.srs).filter(id => !state.srs[id].sk && Object.values(COURSES).some(c => c.LEX[id])).length; }
export function courseStarted(c) { return c.UNITS.some(u => u.path.some(n => state.lessons[n.id]?.done)); }
export function lettersMastered() { return Object.values(state.letters).filter(c => strength(c) >= 3).length; }
export function storiesDone() { return Object.keys(state.lessons).filter(id => id.startsWith('st_') && state.lessons[id].done && !state.lessons[id].skipped).length; }
export function sumLog(f) { let n = 0; for (const dev of Object.values(state.log)) for (const d of Object.values(dev)) n += d[f] || 0; return n; }

// Flat ordered list of path nodes across units.
export function pathNodes() {
  const out = [];
  UNITS.forEach((u, ui) => u.path.forEach((n, i) => out.push({ ...n, unit: u, unitIndex: ui, index: i })));
  return out;
}
export function nodeDone(n) { return n.type === 'chest' ? !!(state.claims['chest:' + n.id] || state.claims['skip:' + n.id]) : lessonDone(n.id); }
export const nodeSkipped = (n) => (n.type === 'chest' ? !state.claims['chest:' + n.id] && !!state.claims['skip:' + n.id] : !!state.lessons[n.id]?.skipped);
// Skipping ahead (placement test or "Jump here?"): everything before unit `ui` counts as done, but
// skipped chests pay no gems, skipped lessons replay like new, and the words go into review, due now.
export function skipToUnit(ui, now = Date.now()) {
  const words = [];
  UNITS.forEach((u, i) => {
    if (i >= ui) return;
    for (const n of u.path) {
      if (n.type === 'chest') { if (!state.claims['chest:' + n.id]) state.claims['skip:' + n.id] = state.claims['skip:' + n.id] || now; continue; }
      if (!lessonDone(n.id)) state.lessons[n.id] = { done: 1, best: 0, first: now, last: now, skipped: true };
      if (n.type === 'lesson') words.push(...n.items);
    }
  });
  let added = 0;
  for (const id of new Set(words)) if (!state.srs[id]) { state.srs[id] = { ...review(undefined, true, now), due: now, sk: 1 }; added++; }
  save();
  return added;
}
export function currentNodeIndex() {
  const nodes = pathNodes();
  const i = nodes.findIndex(n => !nodeDone(n));
  return i === -1 ? nodes.length : i;
}

// Record a finished session.
export function recordSession(r) {
  // r: { kind, nodeId, xp, perfect, maxCombo, ms, listen, items: {id: good?}, letters: {ch: good?}, accuracy }
  const now = Date.now();
  const d = myDay();
  d.xp = (d.xp || 0) + r.xp;
  if (['lesson', 'review', 'story'].includes(r.kind)) d.lessons = (d.lessons || 0) + 1;
  if (r.kind === 'story') d.stories = (d.stories || 0) + 1;
  if (r.kind === 'practice') d.practice = (d.practice || 0) + 1;
  if (r.kind === 'letters') d.letters = (d.letters || 0) + 1;
  if (r.perfect && r.kind !== 'letters') d.perfect = (d.perfect || 0) + 1;
  d.combo = Math.max(d.combo || 0, r.maxCombo || 0);
  d.listen = (d.listen || 0) + (r.listen || 0);
  d.speak = (d.speak || 0) + (r.spoke || 0);
  d.ms = (d.ms || 0) + (r.ms || 0);
  if (r.nodeId) {
    const L = state.lessons[r.nodeId] || { done: 0, best: 0, first: now };
    state.lessons[r.nodeId] = { done: L.done + 1, best: Math.max(L.best || 0, r.accuracy || 0), first: L.first || now, last: now };
  }
  for (const [id, good] of Object.entries(r.items || {})) state.srs[id] = review(state.srs[id], good, now);
  for (const [ch, good] of Object.entries(r.letters || {})) state.letters[ch] = review(state.letters[ch], good, now);
  if (r.kind === 'review' && r.nodeId) state.claims['unit:' + r.nodeId] = state.claims['unit:' + r.nodeId] || now;
  if (dayTotals().xp >= (state.profile.goal || 20)) state.claims['goal:' + today()] = state.claims['goal:' + today()] || now;
  save();
}

// Award any newly reached achievement tiers. Returns list of {a, tier}.
export function checkAchievements() {
  const out = [];
  for (const a of ACHIEVEMENTS) {
    const v = a.stat();
    a.tiers.forEach((t, i) => {
      const cid = `ach:${a.id}:${i}`;
      if (v >= t && !state.claims[cid]) { state.claims[cid] = Date.now(); out.push({ a, tier: i, target: t }); }
    });
  }
  if (out.length) save();
  return out;
}
export function achievementLevel(a) {
  const v = a.stat();
  let lvl = 0;
  a.tiers.forEach((t) => { if (v >= t) lvl++; });
  const next = a.tiers[lvl];
  return { level: lvl, value: v, next, max: lvl >= a.tiers.length };
}

export function learnedItemIds() { return Object.keys(state.srs).filter(id => LEX[id]); }
export function weakestItems(n = 8, now = Date.now()) {
  return learnedItemIds().map(id => ({ id, r: recall(state.srs[id], now) })).sort((a, b) => a.r - b.r).slice(0, n).map(x => x.id);
}
export function dueCount(now = Date.now()) { return learnedItemIds().filter(id => state.srs[id].due <= now).length; }

export function letterStrength(ch) { return strength(state.letters[ch]); }
export function nextLetterGroup(groups) {
  return groups.find(g => g.letters.some(l => !state.letters[l.ch])) || null;
}

// ---------- settings/profile (last-writer-wins)
export function setProfile(patch) {
  Object.assign(state.profile, patch);
  state.profile.u = Date.now();
  save();
}
export function setSetting(k, v) {
  state.profile.settings[k] = v;
  state.profile.u = Date.now();
  save();
}

// ---------- merging two copies of progress (local + cloud)
export function merge(a, b) {
  a = fill(a); b = fill(b);
  const out = blank();
  out.profile = (b.profile.u || 0) > (a.profile.u || 0) ? b.profile : a.profile;
  out.profile = { ...out.profile };
  out.profile.onboarded = a.profile.onboarded || b.profile.onboarded;
  out.profile.name = out.profile.name || a.profile.name || b.profile.name || '';
  out.profile.created = Math.min(a.profile.created || Date.now(), b.profile.created || Date.now());
  for (const id of new Set([...Object.keys(a.lessons), ...Object.keys(b.lessons)])) {
    const x = a.lessons[id], y = b.lessons[id];
    if (!x || !y) { out.lessons[id] = x || y; continue; }
    out.lessons[id] = { done: Math.max(x.done, y.done), best: Math.max(x.best || 0, y.best || 0), first: Math.min(x.first || Infinity, y.first || Infinity), last: Math.max(x.last || 0, y.last || 0), ...(x.skipped && y.skipped ? { skipped: true } : {}) };
  }
  for (const k of ['srs', 'letters']) {
    for (const id of new Set([...Object.keys(a[k]), ...Object.keys(b[k])])) {
      const x = a[k][id], y = b[k][id];
      out[k][id] = !x ? y : !y ? x : (y.last > x.last ? y : x);
    }
  }
  for (const dev of new Set([...Object.keys(a.log), ...Object.keys(b.log)])) {
    const X = a.log[dev] || {}, Y = b.log[dev] || {};
    out.log[dev] = {};
    for (const day of new Set([...Object.keys(X), ...Object.keys(Y)])) {
      const x = X[day] || {}, y = Y[day] || {};
      const m = {};
      for (const f of new Set([...Object.keys(x), ...Object.keys(y)])) m[f] = Math.max(x[f] || 0, y[f] || 0);
      out.log[dev][day] = m;
    }
  }
  out.claims = { ...b.claims, ...a.claims };
  out.purchases = { ...b.purchases, ...a.purchases };
  out.frozen = { ...b.frozen, ...a.frozen };
  out.boosts = { ...b.boosts, ...a.boosts };
  out.hearts = (b.hearts.u || 0) > (a.hearts.u || 0) ? b.hearts : a.hearts;
  out.speakOff = Math.max(a.speakOff || 0, b.speakOff || 0);
  out.listenOff = Math.max(a.listenOff || 0, b.listenOff || 0);
  return out;
}

// ---------- what friends see (synced to the public `profiles` table)
export function weekStartKey(d = new Date()) { const x = new Date(d); x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); return dateKey(x); }
export function weekXP() {
  const start = weekStartKey();
  let n = 0;
  for (const dev of Object.values(state.log)) for (const [day, d] of Object.entries(dev)) if (day >= start) n += d.xp || 0;
  return n;
}
export function publicProfile() {
  return { name: (state.profile.name || '').slice(0, 40), avatar: state.profile.avatar || 'aliya', xp_total: totalXP(), xp_week: weekXP(), week: weekStartKey(), streak: streakInfo().streak, suggest: state.profile.settings.suggest !== false };
}

export function ensureWelcome() { if (!state.claims.welcome) { state.claims.welcome = Date.now(); save({ quiet: true }); } }
