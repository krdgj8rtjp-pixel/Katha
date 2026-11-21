// Exercise renderers. Each returns a controller:
//   { el, footer: 'check'|'continue'|'none', check(): {ok, solution, meaning, items?}, autoplay?(), ungraded? }
import { esc, shuffle, siTokens, enTokens } from './util.js';
import { matchAnswer, foldSinhala, isSinhala } from './translit.js';
import { ro, foldT, isSi, L, courseName } from './lang.js';
import { ICONS, siLine, audioBtn, letterDraw } from './ui.js';
import { character, castId } from './characters.js';
import { pic, hasPic } from './pics.js';
const picId = (it) => it?.pic || LEX[it?.id]?.pic || it?.id;
import * as audio from './audio.js';
import { sfx, unlock as unlockSfx } from './sfx.js';
import { speechCheckOn, checkRecording } from './speech.js';
import { state } from './store.js';
import { DEFAULT_VOICE, LEX } from '../data/course.js';

const roOn = () => state.profile.settings.roman;
function h(html) { const d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstElementChild; }
const title = (t) => `<h2 class="ex-title">${t}</h2>`;
const roSpan = (si) => roOn() && isSi() ? `<span class="ro">${esc(ro(si))}</span>` : '';
const playIf = (text, voice) => { if (audio.canPlay(text, voice)) audio.play(text, { voice }); };

// ---------------------------------------------------------------- teach
function teach(ex) {
  const it = ex.item;
  const el = h(`<div class="ex teach">
    <div class="ex-kicker">${ICONS.star} New word</div>
    <div class="teach-card">
      ${hasPic(picId(it)) ? `<div class="teach-pic">${pic(picId(it), { size: 148, live: true })}</div>` : ''}
      <div class="teach-si" lang="${L()}">${esc(it.si)}</div>
      <div class="teach-ro">${esc(it.ro)}</div>
      ${audio.canPlay(it.si) ? audioBtn(it.si, { big: true }) : ''}
      <div class="teach-en">${esc(it.en)}</div>
      ${it.note ? `<p class="teach-note">${esc(it.note)}</p>` : ''}
    </div>
  </div>`);
  return { el, footer: 'continue', autoplay: () => playIf(it.si), check: () => ({ ok: true }) };
}

function teachLetter(ex) {
  const l = ex.letter;
  const el = h(`<div class="ex teach">
    <div class="ex-kicker">${ICONS.star} New letter</div>
    <div class="teach-card">
      <div class="teach-letter draw" lang="${L()}">${letterDraw(l.ch)}</div>
      <div class="teach-ro big">${esc(l.ro)}</div>
      ${audio.canPlay(l.ch) ? audioBtn(l.ch, { big: true, slow: false }) : ''}
      <p class="teach-note">${esc(l.hint)}</p>
    </div>
  </div>`);
  return { el, footer: 'continue', autoplay: () => playIf(l.ch), check: () => ({ ok: true }) };
}

// ---------------------------------------------------------------- choice helpers
function choiceList(options, render, onPick) {
  const wrap = h(`<div class="choices"></div>`);
  options.forEach((o, i) => {
    const b = h(`<button class="choice" data-i="${i}"><span class="kbd">${i + 1}</span>${render(o)}</button>`);
    b.addEventListener('click', () => {
      wrap.querySelectorAll('.choice').forEach(x => x.classList.remove('sel'));
      b.classList.add('sel'); sfx.tap(); onPick(i, o);
    });
    wrap.appendChild(b);
  });
  return wrap;
}

function selectSi(ex, ctx) {
  const it = ex.item;
  const pics = ex.options.every(o => hasPic(picId(o)));
  let picked = null;
  const el = h(`<div class="ex">${title(`Which one means “${esc(it.en)}”?`)}</div>`);
  const grid = h(`<div class="cards ${pics ? 'pics' : ''}"></div>`);
  ex.options.forEach((o, i) => {
    const b = h(`<button class="card-choice" data-i="${i}">
      ${pics ? `<div class="pic-wrap">${pic(picId(o), { size: 84 })}</div>` : ''}
      <div class="si" lang="${L()}">${esc(o.si)}</div>${roSpan(o.si)}
    </button>`);
    b.addEventListener('click', () => {
      grid.querySelectorAll('.card-choice').forEach(x => { x.classList.remove('sel'); x.querySelector('.pic')?.classList.remove('live'); });
      b.classList.add('sel'); b.querySelector('.pic')?.classList.add('live'); picked = o; sfx.tap(); playIf(o.si); ctx.onReady(true);
    });
    grid.appendChild(b);
  });
  el.appendChild(grid);
  return {
    el, footer: 'check',
    check: () => ({ ok: picked?.id === it.id, solution: `<span lang="${L()}">${esc(it.si)}</span> <i>${esc(it.ro)}</i>`, meaning: it.en }),
  };
}

function selectEn(ex, ctx) {
  const it = ex.item;
  let picked = null;
  const canAudio = audio.canPlay(it.si);
  const el = h(`<div class="ex">${title('What does this mean?')}
    <div class="prompt-row">${canAudio ? audioBtn(it.si, { slow: false }) : ''}${siLine(it.si, [it.en], { cls: 'big' })}</div>
  </div>`);
  el.appendChild(choiceList(ex.options, o => `<span>${esc(o)}</span>`, (i, o) => { picked = o; ctx.onReady(true); }));
  return { el, footer: 'check', autoplay: () => playIf(it.si), check: () => ({ ok: picked === ex.answer, solution: esc(ex.answer) }) };
}

function listenSelect(ex, ctx) {
  const it = ex.item;
  let picked = null;
  const el = h(`<div class="ex">${title('Tap what you hear')}<div class="listen-hero">${audioBtn(it.si, { big: true })}</div></div>`);
  el.appendChild(choiceList(ex.options, o => `<span class="si" lang="${L()}">${esc(o.si)}</span>${roSpan(o.si)}`, (i, o) => { picked = o; ctx.onReady(true); }));
  return {
    el, footer: 'check', autoplay: () => playIf(it.si),
    check: () => ({ ok: picked?.id === it.id, solution: `<span lang="${L()}">${esc(it.si)}</span> <i>${esc(it.ro)}</i>`, meaning: it.en }),
  };
}

// ---------------------------------------------------------------- matching
function matchPairs(ex, ctx, { letters = false } = {}) {
  const pairs = ex.pairs;
  const left = shuffle(pairs.map((p, i) => ({ i, label: letters ? p.ch : p.si, si: true })));
  const right = shuffle(pairs.map((p, i) => ({ i, label: letters ? p.ro : p.en })));
  const wrong = new Set();
  let sel = null, done = 0;
  const el = h(`<div class="ex">${title('Tap the matching pairs')}<div class="match ${letters ? 'letters' : ''}"><div class="col l"></div><div class="col r"></div></div></div>`);
  const mk = (o, side) => {
    const b = h(`<button class="choice match-btn ${o.si ? 'si-btn' : ''}" data-side="${side}" data-i="${o.i}">${o.si ? `<span class="si" lang="${L()}">${esc(o.label)}</span>` : `<span>${esc(o.label)}</span>`}</button>`);
    b.addEventListener('click', () => {
      if (b.classList.contains('done')) return;
      if (side === 'l') playIf(letters ? pairs[o.i].ch : pairs[o.i].si);
      if (!sel || sel.side === side) {
        el.querySelectorAll(`.match-btn[data-side="${side}"]`).forEach(x => x.classList.remove('sel'));
        b.classList.add('sel'); sel = { side, i: o.i, b }; sfx.tap(); return;
      }
      if (sel.i === o.i) {
        [sel.b, b].forEach(x => { x.classList.remove('sel'); x.classList.add('ok-flash', 'done'); });
        sfx.match(); done++; sel = null;
        if (done === pairs.length) setTimeout(() => ctx.submit(), 350);
      } else {
        const a = sel.b; wrong.add(sel.i); wrong.add(o.i);
        [a, b].forEach(x => { x.classList.remove('sel'); x.classList.add('bad-shake'); setTimeout(() => x.classList.remove('bad-shake'), 500); });
        sfx.wrong(); sel = null;
      }
    });
    return b;
  };
  left.forEach(o => el.querySelector('.col.l').appendChild(mk(o, 'l')));
  right.forEach(o => el.querySelector('.col.r').appendChild(mk(o, 'r')));
  return {
    el, footer: 'none', ungraded: true,
    check: () => {
      const items = {}, lettersRes = {};
      pairs.forEach((p, i) => { if (letters) lettersRes[p.ch] = !wrong.has(i); else items[p.id] = !wrong.has(i); });
      return { ok: true, items, letters: lettersRes, praise: wrong.size ? 'All matched!' : 'Perfect match!' };
    },
  };
}

// ---------------------------------------------------------------- word tiles
// Animate an element from its previous position to where it is now (FLIP).
function flyFrom(el, from) {
  const to = el.getBoundingClientRect();
  const dx = from.left - to.left, dy = from.top - to.top;
  if (!dx && !dy) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  el.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'translate(0,0)' }], { duration: 230, easing: 'cubic-bezier(.2,.9,.3,1.1)' });
}

function tilesWidget(tiles, { si = false, onChange }) {
  const wrap = h(`<div class="tiles-wrap"><div class="answer-area"><div class="answer-lines"></div></div><div class="bank"></div></div>`);
  const area = wrap.querySelector('.answer-lines');
  const bank = wrap.querySelector('.bank');
  const placed = [];
  const btns = tiles.map((t, i) => {
    const b = h(`<button class="tile ${si ? 'si-tile' : ''}" data-i="${i}">${si ? `<span lang="${L()}">${esc(t)}</span>${roOn() && isSi() ? `<small>${esc(ro(t))}</small>` : ''}` : esc(t)}</button>`);
    const slot = h(`<span class="tile-slot"></span>`);
    slot.appendChild(b); bank.appendChild(slot);
    b.addEventListener('click', () => {
      const from = b.getBoundingClientRect();
      if (b.parentElement === area) { // send back
        placed.splice(placed.indexOf(i), 1); slot.appendChild(b);
      } else {
        placed.push(i); area.appendChild(b);
        if (si) playIf(t); else sfx.tap();
      }
      flyFrom(b, from);
      onChange(placed.map(j => tiles[j]));
    });
    return b;
  });
  return { el: wrap, value: () => placed.map(j => tiles[j]), disable: () => btns.forEach(b => b.disabled = true) };
}

// Who says a line: the sentence's speaker, else a stable pick that matches the default (female) voice.
function speakerOf(x) {
  if (x?.speaker) return x.speaker;
  const key = String(x?.id || x?.si || '');
  let h = 0; for (const c of key) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h % 2 ? castId('kumari') : 'aliya';
}
function bubble(inner, who = 'aliya', say = '') {
  return `<div class="speaker-row"><div class="speaker-mascot">${character(who, { size: 92, cls: 'speaker', say })}</div><div class="bubble">${inner}</div></div>`;
}

function tilesEn(ex, ctx) {
  const s = ex.sent;
  const canAudio = audio.canPlay(s.si, s.voice);
  let mode = 'tiles', typed = '';
  const el = h(`<div class="ex">${title('Translate this sentence')}
    ${bubble(`${canAudio ? audioBtn(s.si, { voice: s.voice, slow: false }) : ''}${siLine(s.si, s.g, { voice: s.voice })}`, speakerOf(s), s.si)}
    <div class="tiles-host"></div>
    <button class="link-btn kb-toggle">${ICONS.keyboard}<span>Use keyboard</span></button>
  </div>`);
  const host = el.querySelector('.tiles-host');
  let w = tilesWidget(ex.tiles, { onChange: v => ctx.onReady(v.length > 0) });
  host.appendChild(w.el);
  el.querySelector('.kb-toggle').addEventListener('click', (e) => {
    mode = mode === 'tiles' ? 'type' : 'tiles';
    host.innerHTML = '';
    if (mode === 'type') {
      const ta = h(`<textarea class="type-box" rows="3" placeholder="Type in English" autocapitalize="sentences"></textarea>`);
      ta.addEventListener('input', () => { typed = ta.value; ctx.onReady(typed.trim().length > 0); });
      ta.addEventListener('keydown', (ev) => { if (ev.key === 'Enter' && !ev.shiftKey) { ev.preventDefault(); ctx.enter(); } });
      host.appendChild(ta); ta.focus();
      e.currentTarget.querySelector('span').textContent = 'Use word bank';
      ctx.onReady(false);
    } else {
      w = tilesWidget(ex.tiles, { onChange: v => ctx.onReady(v.length > 0) });
      host.appendChild(w.el);
      e.currentTarget.querySelector('span').textContent = 'Use keyboard';
      ctx.onReady(false);
    }
  });
  return {
    el, footer: 'check', autoplay: () => playIf(s.si, s.voice),
    check: () => {
      const input = mode === 'tiles' ? w.value().join(' ') : typed;
      let ok = matchAnswer(input, ex.accepted, 'en');
      if (mode === 'tiles' && ok === 'typo') ok = false;
      return { ok, solution: esc(s.en) };
    },
  };
}

function tilesSi(ex, ctx) {
  const s = ex.sent;
  const listen = ex.type === 'listen_tiles';
  const el = h(`<div class="ex">${title(listen ? 'Tap what you hear' : `Write this in ${courseName()}`)}
    ${listen ? `<div class="listen-hero">${audioBtn(s.si, { voice: s.voice, big: true })}</div>` : bubble(`<div class="en-prompt">${esc(s.en)}</div>`, speakerOf(s))}
    <div class="tiles-host"></div>
  </div>`);
  const w = tilesWidget(ex.tiles, { si: true, onChange: v => ctx.onReady(v.length > 0) });
  el.querySelector('.tiles-host').appendChild(w.el);
  return {
    el, footer: 'check', autoplay: listen ? () => playIf(s.si, s.voice) : null,
    check: () => {
      const got = foldT(w.value().join(' '));
      const want = foldT(ex.answer.join(' '));
      return { ok: got === want, solution: `<span lang="${L()}">${esc(s.si)}</span> <i>${esc(s.ro)}</i>`, meaning: listen ? s.en : null };
    },
  };
}

function fillBlank(ex, ctx) {
  const s = ex.sent;
  const toks = s.si.trim().split(/\s+/);
  let picked = null;
  const line = toks.map((t, i) => {
    if (i === ex.blank) {
      const punct = t.match(/[.,!?]+$/)?.[0] || '';
      return `<span class="blank">&nbsp;</span>${esc(punct)}`;
    }
    return `<span class="w" data-t="${esc(t.replace(/[.,!?]+/g, ''))}" data-g="${esc(s.g[i] || '')}">${esc(t)}</span>`;
  }).join(' ');
  const el = h(`<div class="ex">${title('Fill in the blank')}
    <div class="en-sub">${esc(s.en)}</div>
    <div class="si-line big"><div class="si fill-line" lang="${L()}">${line}</div></div>
  </div>`);
  const blankEl = el.querySelector('.blank');
  el.appendChild(choiceList(ex.options, o => `<span class="si" lang="${L()}">${esc(o)}</span>${roSpan(o)}`, (i, o) => {
    picked = o; blankEl.textContent = o; blankEl.classList.add('filled'); playIf(o); ctx.onReady(true);
  }));
  return { el, footer: 'check', check: () => ({ ok: picked === ex.answer, solution: `<span lang="${L()}">${esc(s.si)}</span> <i>${esc(s.ro)}</i>`, meaning: s.en }) };
}

function typeSi(ex, ctx) {
  const it = ex.item;
  let typed = '';
  const el = h(`<div class="ex">${title(`Write this in ${courseName()}`)}
    ${bubble(`<div class="en-prompt">${esc(it.en)}</div>`, 'aliya')}
    <input class="type-box one" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="${isSi() ? 'Type it — English letters are fine' : 'Type it — accents are optional'}">
    ${isSi() ? `<p class="type-tip">Tip: type how it sounds, e.g. <i>${esc(exampleRo(it))}</i></p>` : ''}
  </div>`);
  const inp = el.querySelector('input');
  inp.addEventListener('input', () => { typed = inp.value; ctx.onReady(typed.trim().length > 0); });
  inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); ctx.enter(); } });
  return {
    el, footer: 'check', focus: () => inp.focus({ preventScroll: true }),
    check: () => {
      let ok;
      if (!isSi()) ok = matchAnswer(typed, ex.accepted, 'en');
      else if (isSinhala(typed)) ok = foldSinhala(typed) === foldSinhala(it.si) ? 'exact' : false;
      else ok = matchAnswer(typed, ex.accepted.filter(a => !isSinhala(a)), 'roman');
      return { ok, solution: `<span lang="${L()}">${esc(it.si)}</span> <i>${esc(it.ro)}</i>` };
    },
  };
}
function exampleRo(it) { return it.id === 'ayubovan' ? 'kohomada' : 'ayubowan'; }

// ---------------------------------------------------------------- speaking
const PASS = 0.6, PASS_RETRY = 0.5;
function speak(ex, ctx) {
  const t = ex.target;
  const voice = t.voice || DEFAULT_VOICE;
  const canAudio = audio.canPlay(t.si, voice);
  const checking = speechCheckOn();
  const el = h(`<div class="ex">${title('Say this out loud')}
    ${bubble(`${canAudio ? audioBtn(t.si, { voice, slow: true }) : ''}${siLine(t.si, t.g || [t.en], { voice })}`, speakerOf(t), t.si)}
    <div class="speak-zone">
      <button class="mic-btn">${ICONS.mic}<span>Tap to speak</span></button>
      <div class="speak-status" hidden><span class="spinner"></span><span>Listening to what you said…</span></div>
      <div class="speak-result" hidden>
        <div class="sr-words si" lang="${L()}"></div>
        <div class="sr-msg"></div>
        <div class="sr-heard"></div>
      </div>
      <div class="speak-after" hidden>
        <div class="compare">
          <button class="btn small ghost you">▶ You</button>
          ${canAudio ? `<button class="btn small ghost native">▶ Native</button>` : ''}
        </div>
        <div class="self-check">
          <button class="btn small again">Try again</button>
          <button class="btn small primary said">I said it ${ICONS.check}</button>
          <button class="btn small primary go-on" hidden>Continue</button>
        </div>
      </div>
      <p class="speak-meaning">${esc(t.en)}</p>
      ${!checking && state.profile.settings.speechCheck !== false ? `<p class="speak-tip">Sign in under Profile → Account and Katha will check your speaking.</p>` : ''}
    </div>
    <button class="link-btn cant">Can't speak now</button>
  </div>`);
  const $ = (q) => el.querySelector(q);
  const mic = $('.mic-btn'), after = $('.speak-after'), status = $('.speak-status'), result = $('.speak-result');
  let rec = null, chunks = [], url = null, stream = null, timer = null, attempts = 0, passed = false, heard = '', verified = false;

  const stopRec = () => { try { rec && rec.state !== 'inactive' && rec.stop(); } catch {} clearTimeout(timer); };
  const showButtons = ({ selfCheck, cont, again = true }) => {
    after.hidden = false;
    $('.said').hidden = !selfCheck;
    $('.go-on').hidden = !cont;
    $('.again').hidden = !again;
    $('.again').classList.toggle('primary', again && !cont && !selfCheck);
  };
  const reset = () => { after.hidden = true; result.hidden = true; status.hidden = true; mic.hidden = false; ctx.onReady(false); };

  function paintWords(hits) {
    const toks = t.si.trim().split(/\s+/);
    $('.sr-words').innerHTML = toks.map((w, i) => `<span class="${hits[i] ? 'hit' : 'miss'}">${esc(w)}</span>`).join(' ');
  }

  async function handleRecording(blob) {
    if (!checking) { mic.hidden = true; showButtons({ selfCheck: true }); return; }
    mic.hidden = true; status.hidden = false;
    try {
      const r = await checkRecording(blob, t.si);
      attempts++;
      status.hidden = true; result.hidden = false;
      heard = r.heard || '';
      paintWords(r.hits || []);
      const need = attempts > 1 ? PASS_RETRY : PASS;
      if (r.empty) {
        $('.sr-msg').textContent = "I didn't catch anything. Hold the phone a little closer and try again.";
        $('.sr-heard').textContent = '';
        showButtons({ selfCheck: attempts >= 2 });
      } else if (r.score >= need) {
        passed = true; verified = true; sfx.correct();
        $('.sr-msg').textContent = r.score >= 0.9 ? 'Excellent — that came through clearly!' : 'Nice — Katha understood you!';
        $('.sr-heard').innerHTML = `Heard: <span lang="${L()}">${esc(heard)}</span>`;
        showButtons({ cont: true });
      } else {
        sfx.wrong();
        $('.sr-msg').textContent = r.score >= 0.35 ? 'Almost! Listen once more and try again.' : 'Not quite. Play the native audio, then try again.';
        $('.sr-heard').innerHTML = heard ? `Heard: <span lang="${L()}">${esc(heard)}</span>` : '';
        showButtons({ selfCheck: attempts >= 2 });
        if (attempts >= 2) $('.said').textContent = 'Continue anyway';
      }
    } catch (e) {
      status.hidden = true; result.hidden = false;
      $('.sr-words').innerHTML = '';
      $('.sr-msg').textContent = e.message || 'Speech check is unavailable right now.';
      $('.sr-heard').textContent = 'You can still compare with the native audio and check yourself.';
      showButtons({ selfCheck: true });
    }
  }

  mic.addEventListener('click', async () => {
    if (rec && rec.state === 'recording') { stopRec(); return; }
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) { mic.hidden = true; $('.you').hidden = true; showButtons({ selfCheck: true, again: false }); return; }
    try {
      audio.stop(); unlockSfx();
      stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
      rec = new MediaRecorder(stream); chunks = [];
      rec.ondataavailable = (e) => { if (e.data && e.data.size) chunks.push(e.data); };
      rec.onstop = () => {
        stream.getTracks().forEach(tr => tr.stop());
        mic.classList.remove('rec'); mic.querySelector('span').textContent = 'Tap to speak';
        const blob = new Blob(chunks, { type: rec.mimeType || 'audio/webm' });
        if (url) URL.revokeObjectURL(url);
        url = URL.createObjectURL(blob);
        handleRecording(blob);
      };
      rec.start(); mic.classList.add('rec'); mic.querySelector('span').textContent = 'Listening… tap when done';
      timer = setTimeout(stopRec, 8000);
    } catch (e) {
      mic.hidden = true; $('.you').hidden = true; showButtons({ selfCheck: true, again: false });
    }
  });
  $('.you').addEventListener('click', () => { if (url) new Audio(url).play(); });
  $('.native')?.addEventListener('click', () => audio.play(t.si, { voice }));
  $('.again').addEventListener('click', reset);
  $('.said').addEventListener('click', () => { passed = true; ctx.submit(); });
  $('.go-on').addEventListener('click', () => ctx.submit());
  $('.cant').addEventListener('click', () => { stopRec(); ctx.skip({ speakOff: true }); });
  return {
    el, footer: 'none', ungraded: true, autoplay: () => playIf(t.si, voice),
    cleanup: () => { stopRec(); try { stream?.getTracks().forEach(tr => tr.stop()); } catch {} },
    check: () => ({
      ok: true, verified,
      praise: verified ? 'Great speaking!' : 'Keep practicing that one',
    }),
  };
}

// ---------------------------------------------------------------- letters
function letterSound(ex, ctx) {
  const l = ex.letter;
  let picked = null;
  const el = h(`<div class="ex">${title('What sound does this make?')}<div class="big-letter" lang="${L()}">${esc(l.ch)}</div></div>`);
  el.appendChild(choiceList(ex.options, o => `<span class="ro-opt">${esc(o)}</span>`, (i, o) => { picked = o; ctx.onReady(true); }));
  return {
    el, footer: 'check',
    check: () => { playIf(l.ch); return { ok: picked === ex.answer, solution: `<span lang="${L()}">${esc(l.ch)}</span> = <i>${esc(l.ro)}</i>`, meaning: l.hint, letters: { [l.ch]: picked === ex.answer } }; },
  };
}
function soundLetter(ex, ctx) {
  const l = ex.letter;
  let picked = null;
  const canAudio = audio.canPlay(l.ch);
  const el = h(`<div class="ex">${title(`Which letter makes the sound “${esc(l.ro)}”?`)}
    ${canAudio ? `<div class="listen-hero">${audioBtn(l.ch, { slow: false })}</div>` : ''}</div>`);
  const grid = h(`<div class="cards letters"></div>`);
  ex.options.forEach((o) => {
    const b = h(`<button class="card-choice"><div class="si big-glyph" lang="${L()}">${esc(o)}</div></button>`);
    b.addEventListener('click', () => { grid.querySelectorAll('.card-choice').forEach(x => x.classList.remove('sel')); b.classList.add('sel'); picked = o; sfx.tap(); ctx.onReady(true); });
    grid.appendChild(b);
  });
  el.appendChild(grid);
  return { el, footer: 'check', autoplay: () => playIf(l.ch), check: () => ({ ok: picked === ex.answer, solution: `<span lang="${L()}">${esc(l.ch)}</span> = <i>${esc(l.ro)}</i>`, letters: { [l.ch]: picked === ex.answer } }) };
}
function readWord(ex, ctx) {
  const it = ex.item;
  let picked = null;
  const el = h(`<div class="ex">${title('How do you read this word?')}<div class="big-word" lang="${L()}">${esc(it.si)}</div></div>`);
  el.appendChild(choiceList(ex.options, o => `<span class="ro-opt">${esc(o)}</span>`, (i, o) => { picked = o; ctx.onReady(true); }));
  return { el, footer: 'check', check: () => { playIf(it.si); return { ok: picked === ex.answer, solution: `<i>${esc(it.ro)}</i>`, meaning: `It means “${it.en}”` }; } };
}

export function renderExercise(ex, ctx) {
  switch (ex.type) {
    case 'teach': return teach(ex, ctx);
    case 'teach_letter': return teachLetter(ex, ctx);
    case 'select_si': return selectSi(ex, ctx);
    case 'select_en': return selectEn(ex, ctx);
    case 'listen_select': return listenSelect(ex, ctx);
    case 'match': return matchPairs(ex, ctx);
    case 'letter_match': return matchPairs(ex, ctx, { letters: true });
    case 'tiles_en': return tilesEn(ex, ctx);
    case 'tiles_si': case 'listen_tiles': return tilesSi(ex, ctx);
    case 'fill': return fillBlank(ex, ctx);
    case 'type_si': return typeSi(ex, ctx);
    case 'speak': return speak(ex, ctx);
    case 'letter_sound': return letterSound(ex, ctx);
    case 'sound_letter': return soundLetter(ex, ctx);
    case 'read_word': return readWord(ex, ctx);
    default: throw new Error('Unknown exercise ' + ex.type);
  }
}
