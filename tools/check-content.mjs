// Validates course data: references, gloss alignment, romanization. Run: node tools/check-content.mjs
import { COURSES } from '../data/course.js';
import { hasPic } from '../js/pics.js';
import { ALL_LETTERS } from '../data/letters.js';
import { romanize } from '../js/translit.js';

let errors = 0;
const err = (m) => { errors++; console.error('✗ ' + m); };
const tokens = (si) => si.trim().split(/\s+/);

const seenIds = new Map();
for (const C of Object.values(COURSES)) {
  const { LEX, SENT, STORIES, UNITS, SPEAKERS } = C;
  const tag = `[${C.id}] `;
  const own = (kind, id) => { const k = kind + ':' + id; if (seenIds.has(k) && seenIds.get(k) !== C.id) err(`${tag}${kind} id "${id}" is also used by the ${seenIds.get(k)} course`); seenIds.set(k, C.id); };
  for (const id of Object.keys(LEX)) own('word', id);
  for (const u of UNITS) { own('unit', u.id); for (const n of u.path) own('node', n.id); }
  for (const [id, x] of Object.entries(LEX)) if (x.pic && !hasPic(x.pic)) err(`${tag}LEX ${id}: no picture named ${x.pic}`);
  for (const [id, s] of Object.entries(SENT)) {
    const t = tokens(s.si);
    if (!s.g || s.g.length !== t.length) err(tag + `SENT ${id}: ${t.length} words but ${s.g?.length} glosses`);
    if (s.speaker && !SPEAKERS[s.speaker]) err(tag + `SENT ${id}: unknown speaker ${s.speaker}`);
  }
  for (const [id, st] of Object.entries(STORIES)) {
    st.lines.forEach((l, i) => {
      if (l.q) { if (l.answer == null || !l.options?.[l.answer]) err(tag + `${id}#${i}: bad question`); return; }
      if (!SPEAKERS[l.sp]) err(tag + `${id}#${i}: unknown speaker ${l.sp}`);
      const t = tokens(l.si);
      if (t.length !== l.g.length) err(tag + `${id}#${i}: ${t.length} words but ${l.g.length} glosses — ${l.si}`);
    });
  }
  const seenItems = new Set();
  for (const u of UNITS) {
    for (const n of u.path) {
      if (n.type === 'lesson') {
        for (const it of n.items) { if (!LEX[it]) err(tag + `${n.id}: missing LEX ${it}`); if (seenItems.has(it)) err(tag + `${n.id}: ${it} taught twice`); seenItems.add(it); }
        for (const s of n.sentences) if (!SENT[s]) err(tag + `${n.id}: missing SENT ${s}`);
      }
      if (n.type === 'story' && !STORIES[n.id]) err(tag + `missing story ${n.id}`);
    }
    for (const p of u.phrases) if (!SENT[p]) err(tag + `${u.id}: missing phrase ${p}`);
  }
  for (const id of Object.keys(LEX)) if (!seenItems.has(id)) err(tag + `LEX ${id} is never taught`);

  const words = Object.keys(LEX).length, sents = Object.keys(SENT).length;
  console.log(`${C.name}: ${words} words/chunks, ${sents} sentences, ${Object.keys(STORIES).length} stories`);
}
for (const l of ALL_LETTERS) {
  const r = romanize(l.ch);
  if (r !== l.ro) err(`letter ${l.ch}: romanize gives "${r}", data says "${l.ro}"`);
}

if (process.argv.includes('-v')) {
  for (const C of Object.values(COURSES)) {
    for (const [id, x] of Object.entries(C.LEX)) console.log(id.padEnd(18), x.si.padEnd(20), (C.script === 'sinhala' ? romanize(x.si) : '').padEnd(20), x.en);
    for (const [id, x] of Object.entries(C.SENT)) console.log(id.padEnd(22), (C.script === 'sinhala' ? romanize(x.si) : x.si).padEnd(36), x.en);
  }
}
console.log(`${ALL_LETTERS.length} Sinhala letters`);
if (errors) { console.error(`${errors} problem(s)`); process.exit(1); } else console.log('✓ content OK');
