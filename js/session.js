// Builds the list of exercises for lessons, reviews, practice and letters.
import { hasPic } from './pics.js';
import { LEX, SENT, UNITS, SPEAKERS, DEFAULT_VOICE, COURSE, ALL_LETTERS, LETTER_GROUPS } from '../data/course.js';
import { ro, tkey, isSi } from './lang.js';
import { shuffle, sample, pick, uniq, siTokens, enTokens } from './util.js';
import * as audio from './audio.js';
import { state, learnedItemIds, weakestItems, pathNodes, lessonDone } from './store.js';
import { recall } from './srs.js';

// ---------- data helpers
export function item(id) { const x = LEX[id]; return { id, ...x, ro: x.ro || ro(x.si), voice: DEFAULT_VOICE }; }
export function sent(id) {
  const x = SENT[id];
  return { id, ...x, ro: x.ro || ro(x.si), voice: x.speaker ? SPEAKERS[x.speaker].voice : DEFAULT_VOICE };
}
// Per-course indexes (rebuilt when the course changes).
const IDX = {};
function idx() {
  const k = COURSE.id;
  if (IDX[k]) return IDX[k];
  const lexTokens = {}, tokenGloss = {};
  const toks = (si) => siTokens(si).map(tkey);
  for (const [id, x] of Object.entries(LEX)) lexTokens[id] = toks(x.si).join(' ');
  for (const [id, x] of Object.entries(LEX)) { const t = toks(x.si); if (t.length === 1) tokenGloss[t[0]] = x.en; }
  for (const x of Object.values(SENT)) toks(x.si).forEach((t, i) => { if (!tokenGloss[t] && x.g[i]) tokenGloss[t] = x.g[i]; });
  return (IDX[k] = { lexTokens, tokenGloss, inSent: {} });
}
export const glossOf = (tok) => idx().tokenGloss[tkey(tok)] || '';

export function itemsInSentence(sid) {
  const I = idx();
  if (I.inSent[sid]) return I.inSent[sid];
  const joined = ' ' + siTokens(SENT[sid].si).map(tkey).join(' ') + ' ';
  return (I.inSent[sid] = Object.keys(LEX).filter(id => joined.includes(' ' + I.lexTokens[id] + ' ')));
}
export const picOf = (it) => it?.pic || LEX[it?.id]?.pic || it?.id;

export function caps() {
  const s = state.profile.settings;
  return {
    listen: s.listening !== false && audio.available() && Date.now() > (state.listenOff || 0),
    speak: s.speaking !== false && Date.now() > (state.speakOff || 0),
  };
}

// lesson nodes before (and including) a node
function lessonsUpTo(nodeId) {
  const out = [];
  for (const n of pathNodes()) { if (n.type === 'lesson') out.push(n); if (n.id === nodeId) break; }
  return out;
}
function knownSentences() {
  return pathNodes().filter(n => n.type === 'lesson' && lessonDone(n.id)).flatMap(n => n.sentences);
}
export function unitOf(nodeId) { return UNITS.find(u => u.path.some(n => n.id === nodeId)); }
export function nodeById(id) { return pathNodes().find(n => n.id === id); }

// ---------- single exercise builders
const PROPER = new Set(['I', "I'm", "I'd", 'Kumari', 'Nimal', 'John', 'Sri', 'Lanka', 'America', 'Sinhala', 'English', 'US', 'USA', 'Sofía', 'Mateo', 'Spanish', 'Mexico', 'United', 'States']);
const distinctEn = (ids, it) => ids.filter(x => x !== it.id && LEX[x].en !== it.en && LEX[x].si !== it.si);

function selectSi(it, pool) {
  const others = sample(distinctEn(pool, it), 3).map(item);
  return { type: 'select_si', item: it, options: shuffle([it, ...others]), tests: [it.id] };
}
function selectEn(it, pool) {
  const others = sample(distinctEn(pool, it), 3).map(x => LEX[x].en);
  return { type: 'select_en', item: it, options: shuffle([it.en, ...others]), answer: it.en, tests: [it.id] };
}
function listenSelect(it, pool) {
  const others = sample(distinctEn(pool, it), 3).map(item);
  return { type: 'listen_select', item: it, options: shuffle([it, ...others]), tests: [it.id], listen: true };
}
function typeSi(it) {
  const accepted = [it.si, it.ro, ...(it.roAlt || [])].filter(Boolean);
  return { type: 'type_si', item: it, accepted, tests: [it.id] };
}
function match(ids) {
  const seenEn = new Set(), seenSi = new Set(), pairs = [];
  for (const id of shuffle(uniq(ids))) {
    const x = LEX[id];
    if (seenEn.has(x.en) || seenSi.has(x.si)) continue;
    seenEn.add(x.en); seenSi.add(x.si); pairs.push(item(id));
    if (pairs.length === 5) break;
  }
  if (pairs.length < 3) return null;
  return { type: 'match', pairs, tests: pairs.map(p => p.id) };
}
function tilesEn(s, sentPool) {
  const ans = enTokens(s.en);
  const lower = new Set(ans.map(w => w.toLowerCase()));
  let distract = uniq(sentPool.filter(x => x !== s.id).flatMap(x => enTokens(SENT[x].en)))
    .filter(w => !lower.has(w.toLowerCase()));
  // lower-case borrowed words unless they're names
  distract = uniq(distract.map(w => PROPER.has(w) ? w : w.toLowerCase())).filter(w => !lower.has(w.toLowerCase()));
  const extra = sample(distract, Math.max(2, Math.min(4, 8 - ans.length)));
  return { type: 'tiles_en', sent: s, tiles: shuffle([...ans, ...extra]), answer: ans, accepted: [s.en, ...(s.alt || [])], tests: itemsInSentence(s.id) };
}
function siDistractors(s, sentPool, itemPool, n) {
  const ans = new Set(siTokens(s.si));
  const fromSent = sentPool.filter(x => x !== s.id).flatMap(x => siTokens(SENT[x].si));
  const fromItems = itemPool.flatMap(x => siTokens(LEX[x].si));
  return sample(uniq([...fromSent, ...fromItems]).filter(t => !ans.has(t)), n);
}
function tilesSi(s, sentPool, itemPool, listen = false) {
  const ans = siTokens(s.si);
  const extra = siDistractors(s, sentPool, itemPool, Math.max(2, Math.min(4, 7 - ans.length)));
  return { type: listen ? 'listen_tiles' : 'tiles_si', sent: s, tiles: shuffle([...ans, ...extra]), answer: ans, tests: itemsInSentence(s.id), listen };
}
function fill(s, itemPool, focus = []) {
  const toks = siTokens(s.si);
  if (toks.length < 2) return null;
  const inS = itemsInSentence(s.id).filter(id => siTokens(LEX[id].si).length === 1);
  const candidates = inS.filter(id => focus.includes(id)).concat(inS);
  if (!candidates.length) return null;
  const target = candidates[0];
  const tok = LEX[target].si;
  const idx = toks.indexOf(tok);
  if (idx < 0) return null;
  const others = sample(itemPool.filter(id => id !== target && siTokens(LEX[id].si).length === 1 && !toks.includes(LEX[id].si)), 2).map(id => LEX[id].si);
  if (others.length < 2) return null;
  return { type: 'fill', sent: s, blank: idx, options: shuffle([tok, ...others]), answer: tok, tests: [target] };
}
function speak(x) { return { type: 'speak', target: x, tests: [] }; }

// Avoid the same exercise type twice in a row where possible.
function spread(list) {
  const a = list.slice();
  for (let i = 1; i < a.length; i++) {
    if (a[i].type === a[i - 1].type) {
      const j = a.findIndex((e, k) => k > i && e.type !== a[i - 1].type && (k + 1 >= a.length || a[k + 1]?.type !== a[i].type));
      if (j > 0) [a[i], a[j]] = [a[j], a[i]];
    }
  }
  return a;
}

// ---------- sessions
export function buildLesson(node) {
  const C = caps();
  const first = !lessonDone(node.id) || !!state.lessons[node.id]?.skipped;
  const unit = unitOf(node.id);
  const unitItems = unit.path.filter(n => n.type === 'lesson').flatMap(n => n.items);
  const earlier = lessonsUpTo(node.id).flatMap(n => n.items);
  const pool = uniq([...node.items, ...earlier, ...unitItems.filter(id => earlier.includes(id) || node.items.includes(id))]);
  const sentPool = uniq([...node.sentences, ...lessonsUpTo(node.id).flatMap(n => n.sentences)]);
  const out = [];
  const items = node.items.map(item);

  if (first) {
    for (let i = 0; i < items.length; i += 2) {
      const chunk = items.slice(i, i + 2);
      chunk.forEach(it => out.push({ type: 'teach', item: it, tests: [] }));
      chunk.forEach((it, j) => out.push((j === 0 && hasPic(picOf(it))) ? selectSi(it, pool) : selectEn(it, pool)));
    }
  } else {
    items.forEach(it => out.push(pick([selectSi, selectEn])(it, pool)));
  }
  const m = match([...node.items, ...sample(earlier.filter(id => !node.items.includes(id)), 3)]);
  if (m) out.push(m);

  const mixed = [];
  node.sentences.forEach((sid, i) => {
    const s = sent(sid);
    mixed.push(tilesEn(s, sentPool));
    const r = i % 3;
    if (r === 1 && C.listen && audio.canPlay(s.si, s.voice)) mixed.push(tilesSi(s, sentPool, pool, true));
    else if (r === 2) mixed.push(fill(s, pool, node.items) || tilesSi(s, sentPool, pool));
    else mixed.push(tilesSi(s, sentPool, pool));
  });
  const short = items.filter(it => siTokens(it.si).length <= 2);
  if (short.length) mixed.push(typeSi(pick(short)));
  if (C.listen) { const it = pick(items); if (audio.canPlay(it.si)) mixed.push(listenSelect(it, pool)); }
  if (C.speak && node.sentences.length) mixed.push(speak(sent(pick(node.sentences))));
  out.push(...spread(shuffle(mixed)));
  return { kind: 'lesson', nodeId: node.id, title: node.title, exercises: out, teach: node.items, xp: first ? 10 : 5 };
}

export function buildUnitReview(node) {
  const C = caps();
  const unit = unitOf(node.id);
  const lessons = unit.path.filter(n => n.type === 'lesson');
  const ids = lessons.flatMap(n => n.items);
  const sids = lessons.flatMap(n => n.sentences);
  const pool = uniq([...ids, ...learnedItemIds()]);
  const out = [];
  sample(ids, 5).forEach((id, i) => {
    const it = item(id);
    if (i === 2 && siTokens(it.si).length <= 2) out.push(typeSi(it));
    else if (i === 3 && C.listen && audio.canPlay(it.si)) out.push(listenSelect(it, pool));
    else out.push(pick([selectSi, selectEn])(it, pool));
  });
  const m = match(sample(ids, 6)); if (m) out.push(m);
  sample(sids, 7).forEach((sid, i) => {
    const s = sent(sid);
    if (i % 3 === 0) out.push(tilesSi(s, sids, pool));
    else if (i % 3 === 1 && C.listen && audio.canPlay(s.si, s.voice)) out.push(tilesSi(s, sids, pool, true));
    else out.push(tilesEn(s, sids));
  });
  const f = fill(sent(pick(sids)), pool); if (f) out.push(f);
  if (C.speak) out.push(speak(sent(pick(sids))));
  return { kind: 'review', nodeId: node.id, title: `Unit ${UNITS.indexOf(unit) + 1} review`, exercises: spread(shuffle(out)), teach: [], xp: lessonDone(node.id) && !state.lessons[node.id]?.skipped ? 10 : 20 };
}

export function buildPractice(mode = 'smart') {
  const C = caps();
  const learned = learnedItemIds();
  if (learned.length < 3) return null;
  let ids;
  if (mode === 'mistakes') {
    ids = learned.filter(id => (state.srs[id].lapses || 0) > 0).sort((a, b) => state.srs[b].last - state.srs[a].last).slice(0, 8);
    if (ids.length < 3) ids = weakestItems(8);
  } else ids = weakestItems(8);
  const pool = uniq([...ids, ...learned]);
  const out = [];
  if (mode === 'speaking') {
    const sids = uniq(knownSentences());
    sample(sids, 5).forEach(sid => out.push(speak(sent(sid))));
    if (!out.length) return null;
    return { kind: 'practice', nodeId: null, title: 'Speaking practice', exercises: out, teach: [], xp: 10 };
  }
  if (mode === 'listening' && C.listen) {
    ids.slice(0, 5).forEach(id => { const it = item(id); if (audio.canPlay(it.si)) out.push(listenSelect(it, pool)); });
    const sids = uniq(knownSentences()).filter(sid => itemsInSentence(sid).some(i => ids.includes(i)) || true);
    sample(sids, 6).forEach(sid => { const s = sent(sid); if (audio.canPlay(s.si, s.voice)) out.push(tilesSi(s, sids, pool, true)); });
  } else {
    ids.forEach((id, i) => {
      const it = item(id);
      const opts = [selectSi, selectEn];
      if (siTokens(it.si).length <= 2) opts.push(typeSi);
      if (C.listen && audio.canPlay(it.si)) opts.push(listenSelect);
      const f = pick(opts);
      out.push(f === typeSi ? typeSi(it) : f(it, pool));
    });
    const m = match(sample(ids, 5)); if (m) out.push(m);
    const sids = uniq(knownSentences()).filter(sid => itemsInSentence(sid).some(i => ids.includes(i)));
    sample(sids, 4).forEach((sid, i) => { const s = sent(sid); out.push(i % 2 ? tilesEn(s, sids) : tilesSi(s, sids, pool)); });
    if (C.speak && sids.length) out.push(speak(sent(pick(sids))));
  }
  if (!out.length) return null;
  return { kind: 'practice', nodeId: null, title: mode === 'listening' ? 'Listening practice' : mode === 'mistakes' ? 'Mistakes review' : 'Practice', exercises: spread(shuffle(out)), teach: [], xp: 10 };
}

// ---------- tests: "Find my level" (placement) and "Jump here?"
// No teaching and no picture cards: build sentences, translate, type and listen, so guessing doesn't pass.
function unitPools(ui) {
  const lessons = UNITS[ui].path.filter(n => n.type === 'lesson');
  return { items: uniq(lessons.flatMap(n => n.items)), sents: uniq(lessons.flatMap(n => n.sentences)) };
}
function poolsUpTo(ui) {
  const items = [], sents = [];
  for (let i = 0; i <= ui; i++) { const p = unitPools(i); items.push(...p.items); sents.push(...p.sents); }
  return { items: uniq(items), sents: uniq(sents) };
}
function testQuestion(ui, used, want) {
  const C = caps();
  const { items, sents } = unitPools(ui);
  const all = poolsUpTo(ui);
  const fresh = (arr) => { const f = arr.filter(x => !used.has(x)); return f.length ? f : arr; };
  if (want === 'sentence' && sents.length) {
    const s = sent(pick(fresh(sents))); used.add(s.id);
    const r = Math.random();
    const ex = r < 0.3 && C.listen && audio.canPlay(s.si, s.voice) ? tilesSi(s, all.sents, all.items, true)
      : r < 0.65 ? tilesSi(s, all.sents, all.items) : tilesEn(s, all.sents);
    return { ...ex, unit: ui };
  }
  const it = item(pick(fresh(items))); used.add(it.id);
  const kinds = [selectEn];
  if (siTokens(it.si).length <= 2) kinds.push(typeSi, typeSi);
  if (C.listen && audio.canPlay(it.si)) kinds.push(listenSelect);
  const f = pick(kinds);
  return { ...(f === typeSi ? typeSi(it) : f(it, all.items)), unit: ui };
}
export const JUMP_QUESTIONS = 12, JUMP_LIVES = 3;
// A test on everything before unit `target`: half from the unit just before it, half from earlier ones.
export function buildJumpTest(target) {
  const used = new Set(), last = target - 1;
  const plan = Array.from({ length: JUMP_QUESTIONS }, (_, i) => (i < JUMP_QUESTIONS / 2 || last === 0 ? last : Math.floor(Math.random() * last)));
  const out = plan.map((ui, i) => testQuestion(ui, used, i % 3 === 2 ? 'item' : 'sentence'));
  return { kind: 'test', test: 'jump', target, nodeId: null, title: `Jump to Unit ${target + 1}`, exercises: spread(shuffle(out)), teach: [], xp: 20, lives: JUMP_LIVES };
}
// Adaptive placement: start with Unit 1; two right answers move up a unit, two wrong answers stop the
// test and place you in that unit. Passing every unit places you at the end of the course.
export function buildPlacement() {
  const N = UNITS.length, MAX = 2 * N + 4, used = new Set();
  let level = 0, right = 0, wrong = 0, asked = 0, done = false, placed = 0, shown = 0;
  const q = () => testQuestion(level, used, (right + wrong) % 2 ? 'sentence' : 'item');
  const adaptive = {
    answer(ok) {
      if (done) return;
      asked++;
      if (ok) { if (++right >= 2) { level++; right = 0; wrong = 0; if (level >= N) { done = true; placed = N; } } }
      else if (++wrong >= 2) { done = true; placed = level; }
      if (!done && asked >= MAX) { done = true; placed = level; }
    },
    next: () => (done ? null : q()),
    progress() { shown = Math.max(shown, done ? 1 : Math.min(0.95, Math.max(asked / MAX, (level + right / 2) / N))); return shown; },
    result: () => placed,
    get level() { return level; },
  };
  return { kind: 'test', test: 'placement', nodeId: null, title: 'Find my level', exercises: [q()], teach: [], xp: 15, adaptive };
}

// ---------- letters
const letterByCh = (ch) => ALL_LETTERS.find(l => l.ch === ch);
function letterSound(l, pool) {
  const others = sample(pool.filter(x => x.ro !== l.ro), 3).map(x => x.ro);
  return { type: 'letter_sound', letter: l, options: shuffle([l.ro, ...others]), answer: l.ro, testsLetters: [l.ch], tests: [] };
}
function soundLetter(l, pool) {
  const others = sample(pool.filter(x => x.ch !== l.ch && x.ro !== l.ro), 3).map(x => x.ch);
  return { type: 'sound_letter', letter: l, options: shuffle([l.ch, ...others]), answer: l.ch, testsLetters: [l.ch], tests: [] };
}
function letterMatch(ls) {
  const seen = new Set(); const pairs = [];
  for (const l of shuffle(ls)) { if (seen.has(l.ro)) continue; seen.add(l.ro); pairs.push(l); if (pairs.length === 5) break; }
  return pairs.length >= 3 ? { type: 'letter_match', pairs, testsLetters: pairs.map(p => p.ch), tests: [] } : null;
}

// Words the learner can read with the letters they know.
export function readableWords(known) {
  const knownSet = new Set(known);
  const signOk = (c) => ALL_LETTERS.some(l => l.ch.length > 1 && l.ch.includes(c) && knownSet.has(l.ch));
  return Object.keys(LEX).filter(id => {
    for (const c of Array.from(isSi() ? LEX[id].si : LEX[id].si.toLowerCase())) {
      if (c === ' ' || c === '‍' || /[?!.,…\-]/.test(c)) continue;
      if (knownSet.has(c)) continue;
      if (/[්-ෟංඃ\u0BBE-\u0BCD\u0BD7]/.test(c) && signOk(c)) continue;
      return false;
    }
    return true;
  });
}
function readWord(id, pool) {
  const it = item(id);
  const others = sample(pool.filter(x => x !== id && ro(LEX[x].si) !== it.ro), 3).map(x => ro(LEX[x].si));
  return { type: 'read_word', item: it, options: shuffle([it.ro, ...others]), answer: it.ro, testsLetters: [], tests: [] };
}

export function buildLetters(groupId = null) {
  const learnedCh = ALL_LETTERS.map(l => l.ch).filter(ch => state.letters[ch]);
  let group = groupId ? LETTER_GROUPS.find(g => g.id === groupId) : LETTER_GROUPS.find(g => g.letters.some(l => !state.letters[l.ch]));
  const out = [];
  const known = ALL_LETTERS.filter(l => state.letters[l.ch]);
  let teach = [];
  if (group && group.letters.some(l => !state.letters[l.ch])) {
    const ls = group.letters;
    const pool = uniq([...ls, ...known]);
    teach = ls.map(l => l.ch);
    for (let i = 0; i < ls.length; i += 2) {
      const chunk = ls.slice(i, i + 2);
      chunk.forEach(l => out.push({ type: 'teach_letter', letter: l, tests: [] }));
      chunk.forEach(l => out.push(letterSound(l, pool)));
    }
    const mixed = [];
    sample(ls, 3).forEach(l => mixed.push(soundLetter(l, pool)));
    const m = letterMatch(ls); if (m) mixed.push(m);
    sample(ls, 2).forEach(l => mixed.push(letterSound(l, pool)));
    const words = readableWords([...learnedCh, ...teach]).filter(id => Array.from(LEX[id].si.toLowerCase()).some(c => teach.includes(c) || teach.some(t => t.length > 1 && t.includes(c))));
    sample(words, 2).forEach(id => mixed.push(readWord(id, Object.keys(LEX))));
    out.push(...spread(shuffle(mixed)));
    return { kind: 'letters', nodeId: null, title: group.title, exercises: out, teach: [], teachLetters: teach, xp: 7 };
  }
  // all groups started: review weakest letters
  const weakest = (group ? group.letters : known.slice().sort((a, b) => recall(state.letters[a.ch]) - recall(state.letters[b.ch])).slice(0, 8));
  const pool = known.length >= 4 ? known : ALL_LETTERS;
  weakest.slice(0, 5).forEach(l => out.push(letterSound(l, pool)));
  weakest.slice(0, 4).forEach(l => out.push(soundLetter(l, pool)));
  const m = letterMatch(weakest); if (m) out.push(m);
  sample(readableWords(learnedCh), 3).forEach(id => out.push(readWord(id, Object.keys(LEX))));
  return { kind: 'letters', nodeId: null, title: 'Letter review', exercises: spread(shuffle(out)), teach: [], teachLetters: [], xp: 7 };
}
export { letterByCh };
