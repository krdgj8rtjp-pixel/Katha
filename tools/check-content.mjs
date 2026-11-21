// Validates course data: references, gloss alignment, romanization. Run: node tools/check-content.mjs
import { LEX, SENT, STORIES, UNITS, SPEAKERS } from '../data/course.js';
import { ALL_LETTERS } from '../data/letters.js';
import { romanize } from '../js/translit.js';

let errors = 0;
const err = (m) => { errors++; console.error('✗ ' + m); };
const tokens = (si) => si.trim().split(/\s+/);

for (const [id, s] of Object.entries(SENT)) {
  const t = tokens(s.si);
  if (!s.g || s.g.length !== t.length) err(`SENT ${id}: ${t.length} words but ${s.g?.length} glosses`);
  if (s.speaker && !SPEAKERS[s.speaker]) err(`SENT ${id}: unknown speaker ${s.speaker}`);
}
for (const [id, st] of Object.entries(STORIES)) {
  st.lines.forEach((l, i) => {
    if (l.q) { if (l.answer == null || !l.options?.[l.answer]) err(`${id}#${i}: bad question`); return; }
    if (!SPEAKERS[l.sp]) err(`${id}#${i}: unknown speaker ${l.sp}`);
    const t = tokens(l.si);
    if (t.length !== l.g.length) err(`${id}#${i}: ${t.length} words but ${l.g.length} glosses — ${l.si}`);
  });
}
const seenItems = new Set();
for (const u of UNITS) {
  for (const n of u.path) {
    if (n.type === 'lesson') {
      for (const it of n.items) { if (!LEX[it]) err(`${n.id}: missing LEX ${it}`); if (seenItems.has(it)) err(`${n.id}: ${it} taught twice`); seenItems.add(it); }
      for (const s of n.sentences) if (!SENT[s]) err(`${n.id}: missing SENT ${s}`);
    }
    if (n.type === 'story' && !STORIES[n.id]) err(`missing story ${n.id}`);
  }
  for (const p of u.phrases) if (!SENT[p]) err(`${u.id}: missing phrase ${p}`);
}
for (const id of Object.keys(LEX)) if (!seenItems.has(id)) err(`LEX ${id} is never taught`);
for (const l of ALL_LETTERS) {
  const r = romanize(l.ch);
  if (r !== l.ro) err(`letter ${l.ch}: romanize gives "${r}", data says "${l.ro}"`);
}

if (process.argv.includes('-v')) {
  for (const [id, x] of Object.entries(LEX)) console.log(id.padEnd(16), x.si.padEnd(18), romanize(x.si).padEnd(20), x.en);
  for (const [id, x] of Object.entries(SENT)) console.log(id.padEnd(20), romanize(x.si).padEnd(34), x.en);
}
const words = Object.keys(LEX).length, sents = Object.keys(SENT).length;
console.log(`${words} words/chunks, ${sents} sentences, ${Object.keys(STORIES).length} stories, ${ALL_LETTERS.length} letters`);
if (errors) { console.error(`${errors} problem(s)`); process.exit(1); } else console.log('✓ content OK');
