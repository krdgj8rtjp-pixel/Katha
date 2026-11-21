// Runs a session of exercises full-screen: progress, hearts, feedback, retries.
import { renderExercise } from './exercises.js';
import { ICONS, modal, mascot, hideHint } from './ui.js';
import { sfx } from './sfx.js';
import * as audio from './audio.js';
import { state, heartsNow, loseHeart, gems, buy, PRICES, save, MAX_HEARTS } from './store.js';
import { pick, esc } from './util.js';

const PRAISE = ['Nice!', 'Great job!', 'Correct!', 'Excellent!', 'Well done!', 'නියමයි! (Great!)', 'හරි! (Right!)'];

export function runSession(session, { host, onQuit, onComplete, onNeedHearts }) {
  const usesHearts = ['lesson', 'review'].includes(session.kind) && state.profile.settings.hearts;
  const queue = session.exercises.map((e, i) => ({ ...e, _k: i }));
  const retried = new Set();
  const items = {}, letters = {};
  let pos = 0, ctrl = null, phase = 'answer', mistakes = 0, combo = 0, maxCombo = 0, firstTry = 0, graded = 0, listen = 0, spoke = 0;
  const start = Date.now();

  host.innerHTML = `<div class="lesson">
    <div class="lesson-top">
      <button class="icon-btn quit" aria-label="Quit">${ICONS.close}</button>
      <div class="progress"><div class="bar"></div><div class="combo-tag" hidden></div></div>
      <div class="hearts-pill">${usesHearts ? `${ICONS.heart}<b>${heartsNow()}</b>` : state.profile.settings.hearts ? `${ICONS.infinity}` : ''}</div>
    </div>
    <div class="lesson-body"><div class="ex-host"></div></div>
    <div class="lesson-foot">
      <div class="feedback" hidden></div>
      <div class="foot-inner">
        <button class="btn ghost skip" hidden>Skip</button>
        <button class="btn primary go" disabled>Check</button>
      </div>
    </div>
  </div>`;
  const $ = (s) => host.querySelector(s);
  const exHost = $('.ex-host'), go = $('.go'), skipBtn = $('.skip'), fb = $('.feedback'), foot = $('.lesson-foot');
  const bar = $('.bar');

  const ctx = {
    onReady: (b) => { if (phase === 'answer') go.disabled = !b; },
    submit: () => { if (phase === 'answer') check(); },
    enter: () => { if (!go.disabled) go.click(); },
    skip: (opts = {}) => {
      if (opts.speakOff) { state.speakOff = Date.now() + 60 * 60 * 1000; save({ quiet: true }); }
      if (opts.listenOff) { state.listenOff = Date.now() + 60 * 60 * 1000; save({ quiet: true }); }
      // drop remaining exercises of the same kind
      if (opts.speakOff) removeRemaining(e => e.type === 'speak');
      if (opts.listenOff) removeRemaining(e => e.listen || e.type === 'listen_tiles' || e.type === 'listen_select');
      next();
    },
  };
  function removeRemaining(fn) { for (let i = queue.length - 1; i > pos; i--) if (fn(queue[i])) queue.splice(i, 1); }

  function setProgress(extra = 0) {
    const pct = Math.min(1, (pos + extra) / queue.length);
    bar.style.width = (pct * 100).toFixed(1) + '%';
  }

  function show() {
    hideHint(); audio.stop();
    ctrl?.cleanup?.();
    phase = 'answer';
    const ex = queue[pos];
    ctrl = renderExercise(ex, ctx);
    window.__kathaEx = ex; // used by automated tests
    exHost.innerHTML = '';
    exHost.appendChild(ctrl.el);
    exHost.scrollTop = 0;
    fb.hidden = true; foot.className = 'lesson-foot';
    go.className = 'btn primary go';
    const isListen = ex.listen || ex.type === 'listen_tiles';
    skipBtn.hidden = !isListen;
    skipBtn.textContent = "Can't listen now";
    if (ctrl.footer === 'continue') { go.textContent = 'Continue'; go.disabled = false; go.hidden = false; }
    else if (ctrl.footer === 'none') { go.hidden = true; }
    else { go.textContent = 'Check'; go.disabled = true; go.hidden = false; }
    setProgress();
    const c = ctrl;
    if (c.autoplay) setTimeout(() => { if (ctrl === c) c.autoplay(); }, 250);
    if (c.focus) setTimeout(() => { if (ctrl === c) c.focus(); }, 50);
  }

  function check() {
    const ex = queue[pos];
    if (ctrl.footer === 'continue') { next(); return; }
    const res = ctrl.check();
    const isGraded = !ctrl.ungraded;
    const firstAttempt = !retried.has(ex._k);
    // record item results (first attempt counts)
    for (const id of ex.tests || []) if (!(id in items)) items[id] = !!res.ok;
    for (const [id, v] of Object.entries(res.items || {})) if (!(id in items)) items[id] = v;
    for (const [ch, v] of Object.entries(res.letters || {})) if (!(ch in letters)) letters[ch] = v;
    for (const ch of ex.testsLetters || []) if (!(ch in letters)) letters[ch] = !!res.ok;

    phase = 'feedback';
    exHost.querySelectorAll('button, input, textarea').forEach(b => { if (!b.closest('.audio-btns') && !b.classList.contains('w')) b.disabled = true; });
    skipBtn.hidden = true;
    let comboMsg = '';
    if (res.ok) {
      if (isGraded) { combo++; maxCombo = Math.max(maxCombo, combo); if (firstAttempt) firstTry++; }
      if (isGraded && firstAttempt) graded++;
      if (ex.listen || ex.type === 'listen_tiles') listen++;
      if (res.verified) spoke++;
      if (combo > 0 && combo % 5 === 0 && isGraded) comboMsg = `${combo} in a row!`;
      sfx.correct();
      const title = comboMsg || res.praise || (res.ok === 'typo' ? 'You have a typo' : pick(PRAISE));
      fb.innerHTML = `<div class="fb-head">${ICONS.check}<span>${esc(title)}</span></div>
        ${res.ok === 'typo' ? `<div class="fb-sol">${res.solution}</div>` : ''}
        ${res.meaning ? `<div class="fb-mean">Meaning: ${esc(res.meaning)}</div>` : ''}`;
      foot.className = 'lesson-foot good';
      go.className = 'btn go ok';
    } else {
      if (isGraded) { combo = 0; mistakes++; if (firstAttempt) graded++; }
      sfx.wrong();
      fb.innerHTML = `<div class="fb-head">${ICONS.close}<span>Correct answer:</span></div>
        <div class="fb-sol">${res.solution || ''}</div>
        ${res.meaning ? `<div class="fb-mean">Meaning: ${esc(res.meaning)}</div>` : ''}`;
      foot.className = 'lesson-foot bad';
      go.className = 'btn go bad';
      if (!retried.has(ex._k)) { retried.add(ex._k); queue.push(ex); }
      if (usesHearts) {
        const n = loseHeart();
        $('.hearts-pill b').textContent = n;
        $('.hearts-pill').classList.add('lost'); setTimeout(() => $('.hearts-pill')?.classList.remove('lost'), 600);
      }
    }
    const tag = $('.combo-tag');
    if (combo >= 3) { tag.hidden = false; tag.textContent = `🔥 ${combo}`; } else tag.hidden = true;
    fb.hidden = false;
    go.textContent = 'Continue'; go.disabled = false; go.hidden = false;
    setProgress(1);
  }

  async function next() {
    if (phase === 'feedback' && usesHearts && heartsNow() <= 0) {
      const choice = await outOfHearts();
      if (choice === 'refill') { $('.hearts-pill b').textContent = heartsNow(); }
      else { cleanup(); onNeedHearts?.(choice); return; }
    }
    pos++;
    if (pos >= queue.length) return finish();
    show();
  }

  async function outOfHearts() {
    const g = gems();
    const can = g >= PRICES.refill;
    const v = await modal({
      art: mascot('sad', 110), title: 'You ran out of hearts',
      body: `<p>Hearts refill by themselves — one every hour. You can also earn one by doing a practice session.</p>`,
      buttons: [
        ...(can ? [{ label: `Refill for ${PRICES.refill} ${ICONS.gem}`, value: 'refill', cls: 'primary' }] : []),
        { label: 'Practice to earn hearts', value: 'practice', cls: can ? '' : 'primary' },
        { label: 'End session', value: 'quit', cls: 'ghost' },
      ],
    });
    if (v === 'refill') { buy('refill'); }
    return v;
  }

  function finish() {
    cleanup();
    for (const id of session.teach || []) if (!(id in items)) items[id] = true;
    for (const ch of session.teachLetters || []) if (!(ch in letters)) letters[ch] = true;
    const perfect = mistakes === 0;
    const accuracy = graded ? Math.round((firstTry / graded) * 100) : 100;
    const bonus = perfect && session.kind !== 'letters' ? 5 : 0;
    onComplete({ kind: session.kind, nodeId: session.nodeId, title: session.title, xp: session.xp + bonus, bonus, perfect, accuracy, maxCombo, ms: Date.now() - start, listen, spoke, items, letters });
  }

  function cleanup() { hideHint(); audio.stop(); ctrl?.cleanup?.(); document.removeEventListener('keydown', onKey); }

  function onKey(e) {
    if (e.key === 'Enter' && !e.target.matches('textarea, input')) { e.preventDefault(); if (!go.disabled && !go.hidden) go.click(); }
    if (/^[1-9]$/.test(e.key) && phase === 'answer' && !e.target.matches('textarea, input')) {
      const opts = exHost.querySelectorAll('.choice:not([disabled]), .card-choice:not([disabled])');
      opts[+e.key - 1]?.click();
    }
  }
  document.addEventListener('keydown', onKey);

  go.addEventListener('click', () => { if (phase === 'answer') check(); else next(); });
  skipBtn.addEventListener('click', () => ctx.skip({ listenOff: true }));
  $('.quit').addEventListener('click', async () => {
    const v = await modal({
      art: mascot('sad', 100), title: 'Wait, don\'t go!', body: '<p>You\'ll lose your progress in this session if you quit now.</p>',
      buttons: [{ label: 'Keep learning', value: false, cls: 'primary' }, { label: 'End session', value: true, cls: 'ghost danger' }], dismiss: false,
    });
    if (v) { cleanup(); onQuit(); }
  });

  show();
  return { cleanup };
}
