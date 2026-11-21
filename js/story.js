// Story player: a short dialogue revealed line by line, with comprehension questions.
import { STORIES, SPEAKERS } from '../data/course.js';
import { ICONS, siLine, modal, mascot, hideHint } from './ui.js';
import { esc } from './util.js';
import * as audio from './audio.js';
import { sfx } from './sfx.js';
import { lessonDone } from './store.js';
import { character, react } from './characters.js';
import { storyScene } from './art.js';

export function runStory(id, { host, onQuit, onComplete }) {
  const st = STORIES[id];
  const lines = st.lines;
  const cast = [...new Set(lines.filter(l => l.sp).map(l => l.sp))];
  let i = -1, mistakes = 0, waiting = false;
  const start = Date.now();
  host.innerHTML = `<div class="lesson story">
    <div class="lesson-top">
      <button class="icon-btn quit" aria-label="Quit">${ICONS.close}</button>
      <div class="progress"><div class="bar"></div></div>
      <div class="hearts-pill"></div>
    </div>
    <div class="lesson-body story-body">
      <div class="story-stage intro">${storyScene(id)}
        <div class="stage-cast">${cast.map((c, k) => `<div class="stage-slot" style="--k:${k};--dir:${k % 2 ? 1 : -1}">${character(c, { size: 96, mood: 'wave' })}<span>${esc(SPEAKERS[c].name)}</span></div>`).join('')}</div>
      </div>
      <div class="story-head"><h2>${esc(st.title)}</h2><p>${esc(st.blurb)}</p></div>
      <div class="story-lines"></div>
    </div>
    <div class="lesson-foot"><div class="foot-inner"><button class="btn primary go">Start story</button></div></div>
  </div>`;
  const $ = (s) => host.querySelector(s);
  const box = $('.story-lines'), go = $('.go'), body = $('.story-body'), bar = $('.bar');

  function line(l) {
    const sp = SPEAKERS[l.sp];
    const canAudio = audio.canPlay(l.si, sp.voice);
    const el = document.createElement('div');
    el.className = 'story-line';
    el.innerHTML = `<div class="avatar" style="--c:${sp.color}">${character(l.sp, { size: 46, head: true, say: l.si })}</div>
      <div class="story-bubble">
        <div class="who" style="color:${sp.color}">${esc(sp.name)} ${canAudio ? `<button class="mini-play" data-play="${esc(l.si)}" data-v="${sp.voice}" aria-label="Play">${ICONS.speaker}</button>` : ''}</div>
        ${siLine(l.si, l.g, { voice: sp.voice })}
        <button class="reveal">Show translation</button>
        <div class="tr" hidden>${esc(l.en)}</div>
      </div>`;
    el.querySelector('.reveal').addEventListener('click', (e) => { e.currentTarget.hidden = true; el.querySelector('.tr').hidden = false; });
    const actor = host.querySelector(`.story-stage .char[data-char="${l.sp}"]`);
    if (actor) actor.dataset.say = l.si;
    host.querySelectorAll('.stage-slot').forEach(x => x.classList.toggle('on', x.contains(actor)));
    if (canAudio) setTimeout(() => audio.play(l.si, { voice: sp.voice }), 150);
    else if (actor) { actor.classList.add('talking'); setTimeout(() => actor.classList.remove('talking'), 1400); }
    return el;
  }

  function question(q) {
    const el = document.createElement('div');
    el.className = 'story-q';
    el.innerHTML = `<div class="q-title">${esc(q.q)}</div><div class="choices"></div>`;
    const wrap = el.querySelector('.choices');
    // shuffle options but remember the answer
    const opts = q.options.map((o, k) => ({ o, k })).sort(() => Math.random() - 0.5);
    opts.forEach(({ o, k }) => {
      const b = document.createElement('button');
      b.className = 'choice'; b.innerHTML = `<span>${esc(o)}</span>`;
      b.addEventListener('click', () => {
        if (k === q.answer) {
          b.classList.add('right'); wrap.querySelectorAll('button').forEach(x => x.disabled = true);
          sfx.correct(); waiting = false; go.disabled = false; go.textContent = 'Continue';
          react(host.querySelector('.story-stage'), 'happy', 1200);
        } else {
          b.classList.add('bad-shake', 'wrong'); b.disabled = true; mistakes++; sfx.wrong();
          react(host.querySelector('.story-stage'), 'sad', 1400);
          setTimeout(() => b.classList.remove('bad-shake'), 500);
        }
      });
      wrap.appendChild(b);
    });
    return el;
  }

  function advance() {
    hideHint();
    if (waiting) return;
    i++;
    bar.style.width = ((i / lines.length) * 100).toFixed(1) + '%';
    if (i >= lines.length) return finish();
    const l = lines[i];
    $('.story-head')?.classList.add('small');
    const stg = $('.story-stage');
    if (stg.classList.contains('intro')) { stg.classList.remove('intro'); stg.querySelectorAll('.char.wave').forEach(c => c.classList.remove('wave')); }
    const el = l.q ? question(l) : line(l);
    box.appendChild(el);
    requestAnimationFrame(() => { el.classList.add('in'); body.scrollTo({ top: body.scrollHeight, behavior: 'smooth' }); });
    if (l.q) { waiting = true; go.disabled = true; go.textContent = 'Answer to continue'; }
    else { go.disabled = false; go.textContent = i === lines.length - 1 ? 'Finish' : 'Continue'; }
  }

  function finish() {
    audio.stop();
    const replay = lessonDone(id);
    onComplete({ kind: 'story', nodeId: id, title: st.title, xp: replay ? 5 : 15, bonus: 0, perfect: mistakes === 0, accuracy: 100, maxCombo: 0, ms: Date.now() - start, listen: 0, items: {}, letters: {} });
  }

  go.addEventListener('click', advance);
  $('.quit').addEventListener('click', async () => {
    const v = await modal({ art: mascot('sad', 100), title: 'Leave the story?', body: '<p>You can pick it up again from the path.</p>',
      buttons: [{ label: 'Keep reading', value: false, cls: 'primary' }, { label: 'Leave', value: true, cls: 'ghost danger' }], dismiss: false });
    if (v) { audio.stop(); onQuit(); }
  });
}
