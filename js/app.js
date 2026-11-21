// Katha — spoken Sinhala. App shell, routing and screens.
import { UNITS, COMING, LEX, STORIES, DEFAULT_VOICE } from '../data/course.js';
import { LETTER_GROUPS, ALL_LETTERS } from '../data/letters.js';
import * as S from './store.js';
import { state } from './store.js';
import * as audio from './audio.js';
import * as sync from './sync.js';
import { sfx, unlock } from './sfx.js';
import { ICONS, mascot, toast, modal, confetti, showHint, hideHint, siLine, audioBtn, bigFlame, chestArt, trophyArt } from './ui.js';
import { badge } from './badges.js';
import { pic } from './pics.js';
import { esc, plural, fmtDuration } from './util.js';
import { romanize } from './translit.js';
import { strength } from './srs.js';
import { buildLesson, buildUnitReview, buildPractice, buildLetters, caps, item, sent, nodeById } from './session.js';
import { runSession } from './player.js';
import { runStory } from './story.js';
import { character } from './characters.js';
import { pathScene, castLineup, unitHero } from './art.js';

const app = document.getElementById('app');
const go = (h) => { if (location.hash === '#/' + h) route(); else location.hash = '#/' + h; };
let currentTab = null;
let inSession = false;

// ------------------------------------------------------------ global taps
document.addEventListener('click', (e) => {
  unlock();
  const p = e.target.closest('[data-play]');
  if (p) { e.preventDefault(); e.stopPropagation(); audio.play(p.dataset.play, { voice: p.dataset.v || DEFAULT_VOICE, slow: !!p.dataset.slow }); return; }
  const w = e.target.closest('.w');
  if (w) {
    showHint(w, w.dataset.g);
    const t = w.dataset.t;
    if (t && audio.canPlay(t)) audio.play(t);
    return;
  }
  if (!e.target.closest('.hint-tip')) hideHint();
  if (!e.target.closest('.node-wrap')) closePops();
});
addEventListener('scroll', hideHint, true);

// ------------------------------------------------------------ router
function route() {
  const h = (location.hash || '').replace(/^#\/?/, '') || 'learn';
  const [name, arg] = h.split('/');
  hideHint();
  if (!state.profile.onboarded && name !== 'onboarding') { go('onboarding'); return; }
  if (state.profile.onboarded && name === 'onboarding') { go('learn'); return; }
  inSession = false;
  switch (name) {
    case 'learn': case 'letters': case 'practice': case 'quests': case 'friends': case 'profile': return renderTab(name);
    case 'add': return addFriendLink(arg);
    case 'lesson': return startNode(arg);
    case 'letters-session': return startLetters(arg);
    case 'practice-session': return startPractice(arg || 'smart');
    case 'shop': return renderShop();
    case 'guide': return renderGuide(arg);
    case 'onboarding': return renderOnboarding(Number(arg) || 0);
    default: return renderTab('learn');
  }
}
addEventListener('hashchange', route);

// ------------------------------------------------------------ shell
function topbar() {
  const st = S.streakInfo();
  const h = S.heartsNow();
  const hearts = state.profile.settings.hearts;
  return `<header class="topbar">
    <a class="tb-item brand" href="#/learn" aria-label="Katha home"><span class="brand-mark" lang="si">ක</span></a>
    <button class="tb-item streak ${st.doneToday ? 'lit' : ''}" data-act="streak">${st.doneToday || st.streak ? ICONS.flame : ICONS.flameOff}<b>${st.streak}</b></button>
    <button class="tb-item gems" data-act="gems">${ICONS.gem}<b>${S.gems()}</b></button>
    ${S.boostLeft() > 0 ? `<button class="tb-item boost" data-act="boost">${ICONS.bolt}<b>2×</b></button>` : ''}
    <button class="tb-item hearts" data-act="hearts">${hearts ? ICONS.heart + `<b>${h}</b>` : ICONS.infinity}</button>
  </header>`;
}
const TABS = [
  ['learn', 'Learn', ICONS.home], ['letters', 'Letters', ICONS.letters], ['practice', 'Practice', ICONS.dumbbell],
  ['quests', 'Quests', ICONS.target], ['friends', 'Friends', ICONS.trophy], ['profile', 'Profile', ICONS.user],
];
function tabbar(active) {
  const claimable = S.questsFor(S.today(), questCaps()).some(q => q.done && !q.claimed);
  return `<nav class="tabbar">${TABS.map(([id, label, icon]) => `<a href="#/${id}" class="tab ${id === active ? 'on' : ''}" aria-label="${label}">
    <span class="tab-ic">${icon}${id === 'quests' && claimable ? '<i class="dot"></i>' : ''}</span><span class="tab-l">${label}</span></a>`).join('')}</nav>`;
}
function shell(active, body) {
  app.innerHTML = `<div class="shell">${topbar()}<main class="tab-body" id="tab">${body}</main>${tabbar(active)}</div>`;
  app.querySelector('.topbar').addEventListener('click', topbarClick);
}
function refreshTopbar() { const t = app.querySelector('.topbar'); if (t) { t.outerHTML = topbar(); app.querySelector('.topbar').addEventListener('click', topbarClick); } }

async function topbarClick(e) {
  const b = e.target.closest('[data-act]'); if (!b) return;
  const act = b.dataset.act;
  if (act === 'gems') return go('shop');
  if (act === 'boost') {
    const m = Math.max(1, Math.ceil(S.boostLeft() / 60000));
    return modal({ art: `<div class="boost-art">${ICONS.bolt}<b>2×</b></div>`, title: 'XP Boost is on', body: `<p>Everything you do earns double XP for the next ${plural(m, 'minute')}.</p>`, buttons: [{ label: 'Keep going', value: 1, cls: 'primary' }] });
  }
  if (act === 'streak') {
    const st = S.streakInfo();
    return modal({
      art: `<div class="big-flame">${st.streak ? ICONS.flame : ICONS.flameOff}<b>${st.streak}</b></div>`,
      title: st.streak ? `${plural(st.streak, 'day')} streak` : 'Start a streak!',
      body: `${weekStrip()}<p>${st.doneToday ? 'You\'ve practiced today. Come back tomorrow to keep it going!' : st.streak ? 'Do a lesson today to extend your streak.' : 'Do a lesson every day to build a streak.'}</p>
        <p class="muted">Longest streak: ${st.longest} · Streak freezes: ${S.freezesOwned()}</p>`,
      buttons: [{ label: 'Got it', value: 1, cls: 'primary' }], dismiss: 0,
    });
  }
  if (act === 'hearts') return heartsModal();
}

async function heartsModal() {
  if (!state.profile.settings.hearts) return modal({ title: 'Unlimited hearts', body: '<p>Hearts are turned off in your settings, so mistakes never stop you.</p>', buttons: [{ label: 'OK', value: 1, cls: 'primary' }], dismiss: 0 });
  const n = S.heartsNow();
  const wait = S.nextHeartIn();
  const v = await modal({
    art: `<div class="hearts-row">${Array.from({ length: S.MAX_HEARTS }, (_, i) => i < n ? ICONS.heart : ICONS.heartOff).join('')}</div>`,
    title: n >= S.MAX_HEARTS ? 'You have full hearts' : `${n} of ${S.MAX_HEARTS} hearts`,
    body: `<p>${n >= S.MAX_HEARTS ? 'Keep on learning!' : `Next heart in ${Math.ceil(wait / 60000)} min.`} Each mistake in a lesson costs a heart. Practice sessions are free and earn one back.</p>`,
    buttons: [
      ...(n < S.MAX_HEARTS && S.gems() >= S.PRICES.refill ? [{ label: `Refill for ${S.PRICES.refill} ${ICONS.gem}`, value: 'refill', cls: 'primary' }] : []),
      ...(n < S.MAX_HEARTS ? [{ label: 'Practice to earn a heart', value: 'practice' }] : []),
      { label: 'Close', value: 0, cls: 'ghost' },
    ], dismiss: 0,
  });
  if (v === 'refill') { S.buy('refill'); refreshTopbar(); toast('Hearts refilled!', { icon: ICONS.heart }); }
  if (v === 'practice') go('practice-session/smart');
}

function weekStrip() {
  const st = S.streakInfo();
  const t = S.today();
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const k = S.addDays(t, -i);
    const [y, m, d] = k.split('-').map(Number);
    const label = new Date(y, m - 1, d).toLocaleDateString(undefined, { weekday: 'narrow' });
    const on = S.dayTotals(k).xp > 0, fz = state.frozen[k];
    days.push(`<div class="wd ${on ? 'on' : ''} ${fz ? 'fz' : ''} ${i === 0 ? 'today' : ''}"><span>${label}</span><i>${on ? ICONS.check : fz ? ICONS.freeze : ''}</i></div>`);
  }
  return `<div class="week">${days.join('')}</div>`;
}

const questCaps = () => ({ speech: caps().speak && sync.canTranscribe() && state.profile.settings.speechCheck !== false, audio: caps().listen, practice: S.learnedItemIds().length >= 3, story: S.pathNodes().some(n => n.type === 'story' && S.lessonDone(n.id)) || S.currentNodeIndex() > 4 });

// ------------------------------------------------------------ tabs
function renderTab(name) {
  currentTab = name;
  const body = { learn: learnTab, letters: lettersTab, practice: practiceTab, quests: questsTab, friends: friendsTab, profile: profileTab }[name]();
  shell(name, body);
  ({ learn: mountLearn, letters: mountLetters, practice: mountPractice, quests: mountQuests, friends: mountFriends, profile: mountProfile })[name]?.();
}

// ----- Learn (the path)
const OFFSETS = [0, 48, 72, 48, 0, -48, -72, -48];
function nodeIcon(n, done) {
  if (n.type === 'chest') return done ? ICONS.chestOpen : ICONS.chest;
  if (n.type === 'story') return ICONS.book;
  if (n.type === 'review') return ICONS.trophy;
  return done ? ICONS.check : ICONS.star;
}
function learnTab() {
  const nodes = S.pathNodes();
  const cur = S.currentNodeIndex();
  let html = '<div class="path">';
  let gi = 0;
  UNITS.forEach((u, ui) => {
    const unitNodes = nodes.filter(n => n.unitIndex === ui);
    const unitDone = unitNodes.every(S.nodeDone);
    html += `<section class="unit" style="--u:${u.color}">
      <div class="unit-banner ${unitDone ? 'done' : ''}">
        <div><div class="unit-k">Unit ${ui + 1} · <span lang="si">${esc(u.si)}</span></div><h2>${esc(u.title)}</h2><p>${esc(u.desc)}</p></div>
        <a class="guide-btn" href="#/guide/${u.id}" aria-label="Guidebook">${ICONS.book}<span>Guide</span></a>
      </div><div class="nodes">`;
    unitNodes.forEach((n, i) => {
      const idx = gi++;
      const done = S.nodeDone(n);
      const status = done ? 'done' : idx === cur ? 'current' : idx < cur ? 'done' : 'locked';
      const x = OFFSETS[i % OFFSETS.length];
      html += `<div class="node-wrap" style="--x:${x}px" data-node="${n.id}">
        ${status === 'current' ? `<div class="start-bubble">${n.type === 'chest' ? 'OPEN' : 'START'}</div>` : ''}
        <button class="node n-${n.type} ${status}" data-node="${n.id}" aria-label="${esc(nodeTitle(n))}">${nodeIcon(n, done)}</button>
      </div>`;
      if (i === 2) html += pathScene(u.id, x > 0 ? 'left' : 'right');
    });
    html += `</div></section>`;
  });
  COMING.forEach((c, ci) => {
    html += `<section class="unit coming" style="--u:${c.color}"><div class="unit-banner">
      <div><div class="unit-k">Unit ${UNITS.length + ci + 1} · Coming soon</div><h2>${esc(c.title)}</h2><p>${esc(c.desc)}</p></div>${ICONS.lock}</div></section>`;
  });
  html += `<div class="path-end">${mascot('happy', 80)}<p>Units ${UNITS.length + 1}–${UNITS.length + COMING.length} complete the A1 course. New units will appear here as they're written.</p></div>`;
  return html + '</div>';
}
function nodeTitle(n) {
  if (n.type === 'chest') return 'Treasure chest';
  if (n.type === 'story') return 'Story: ' + STORIES[n.id].title;
  if (n.type === 'review') return `Unit ${n.unitIndex + 1} review`;
  return n.title;
}
function closePops() { app.querySelectorAll('.node-pop').forEach(p => p.remove()); }
function mountLearn() {
  const nodes = S.pathNodes();
  const cur = S.currentNodeIndex();
  const curNode = nodes[cur];
  if (curNode) {
    const el = app.querySelector(`.node-wrap[data-node="${curNode.id}"]`);
    el?.scrollIntoView({ block: 'center' });
    if (justDone) el?.querySelector('.node')?.classList.add('arrive');
  }
  if (justDone) {
    const done = app.querySelector(`.node-wrap[data-node="${justDone}"] .node`);
    done?.classList.add('just-done');
    justDone = null;
  }
  app.querySelector('.path').addEventListener('click', async (e) => {
    const b = e.target.closest('button.node'); if (!b) return;
    e.stopPropagation();
    const idx = nodes.findIndex(n => n.id === b.dataset.node);
    const n = nodes[idx];
    const wrap = b.parentElement;
    const open = wrap.querySelector('.node-pop');
    closePops();
    if (open) return;
    const done = S.nodeDone(n);
    const locked = !done && idx > cur;
    if (n.type === 'chest' && !locked && !done) return openChest(n);
    const lessonsInUnit = n.unit.path.filter(x => x.type === 'lesson');
    let sub = '';
    if (n.type === 'lesson') sub = `Lesson ${lessonsInUnit.findIndex(x => x.id === n.id) + 1} of ${lessonsInUnit.length}`;
    if (n.type === 'story') sub = STORIES[n.id].blurb;
    if (n.type === 'review') sub = 'Practice everything in this unit';
    if (n.type === 'chest') sub = done ? 'Already opened' : 'Finish the lessons before it to open';
    const xp = n.type === 'story' ? (done ? 5 : 15) : n.type === 'review' ? (done ? 10 : 20) : (done ? 5 : 10);
    const pop = document.createElement('div');
    pop.className = `node-pop ${locked ? 'locked' : ''}`;
    pop.innerHTML = `<h3>${esc(nodeTitle(n))}</h3><p>${esc(locked ? 'Complete the levels above to unlock this' : sub)}</p>
      ${locked || n.type === 'chest' ? '' : `<button class="btn ${done ? '' : 'primary'} wide">${done ? 'Practice' : 'Start'} +${xp} XP</button>`}`;
    wrap.appendChild(pop);
    requestAnimationFrame(() => pop.scrollIntoView({ block: 'nearest', behavior: 'smooth' }));
    pop.querySelector('button')?.addEventListener('click', () => { closePops(); go(`lesson/${n.id}`); });
  });
}

async function openChest(n) {
  sfx.chest();
  const g = S.claim('chest:' + n.id);
  confetti(60);
  const burst = Array.from({ length: 9 }, (_, i) => `<i style="--a:${i * 40}deg;--d:${(i % 3) * 60}ms">${ICONS.gem}</i>`).join('');
  await modal({ art: `<div class="chest-art"><div class="chest-burst">${burst}</div>${ICONS.chestOpen}</div>`, title: `+${g} gems!`, body: '<p>Treasure! Spend gems on streak freezes and heart refills in the shop.</p>', buttons: [{ label: 'Nice', value: 1, cls: 'primary' }], dismiss: 1 });
  sync.syncSoon();
  renderTab('learn');
}

// ----- Letters
function lettersTab() {
  const next = S.nextLetterGroup(LETTER_GROUPS);
  const learned = Object.keys(state.letters).length;
  let html = `<div class="letters-tab">
    <div class="tab-hero"><h1>Sinhala letters</h1><p>Learn to read the script — signs, menus and bus boards will start to make sense.</p>
    <a class="btn primary wide" href="#/letters-session">${next ? (learned ? `Continue: ${esc(next.title)}` : 'Start learning letters') : 'Review letters'}</a></div>`;
  for (const g of LETTER_GROUPS) {
    html += `<h3 class="sec-title">${esc(g.title)}</h3><div class="letter-grid">`;
    for (const l of g.letters) {
      const s = S.letterStrength(l.ch);
      html += `<button class="letter-cell ${s ? '' : 'new'}" data-letter="${esc(l.ch)}">
        <span class="lc" lang="si">${esc(l.ch)}</span><span class="lr">${esc(l.ro)}</span>
        <span class="lbar"><i style="width:${s * 25}%"></i></span></button>`;
    }
    html += `</div>`;
    if (g !== next && g.letters.some(l => !state.letters[l.ch])) { /* locked-ish groups still shown */ }
  }
  return html + '</div>';
}
function mountLetters() {
  app.querySelector('.letters-tab').addEventListener('click', (e) => {
    const c = e.target.closest('.letter-cell'); if (!c) return;
    const l = ALL_LETTERS.find(x => x.ch === c.dataset.letter);
    if (audio.canPlay(l.ch)) audio.play(l.ch);
    toast(`<b lang="si">${esc(l.ch)}</b> · <i>${esc(l.ro)}</i> — ${esc(l.hint)}`, { ms: 3200 });
  });
}

// ----- Practice
function practiceTab() {
  const learned = S.learnedItemIds();
  const C = caps();
  const due = S.dueCount();
  const mistakes = learned.filter(id => (state.srs[id].lapses || 0) > 0).length;
  const enough = learned.length >= 3;
  const card = (href, icon, t, d, on = true) => `<a class="prac-card ${on ? '' : 'off'}" ${on ? `href="${href}"` : ''}><div class="pc-ic">${pic(icon, { size: 58, live: on })}</div><div><h3>${t}</h3><p>${d}</p></div></a>`;
  let html = `<div class="practice-tab"><div class="tab-hero"><h1>Practice</h1><p>Practice is free — no hearts lost — and it earns a heart back.</p></div>
    ${card('#/practice-session/smart', 'ui_practice', 'Personalized practice', enough ? (due ? `${plural(due, 'word')} ready for review` : 'Strengthen your weakest words') : 'Finish your first lesson to unlock', enough)}
    ${card('#/practice-session/mistakes', 'ui_target', 'Mistakes', mistakes ? `${plural(mistakes, 'word')} you've missed before` : 'Nothing here yet — nice!', enough && mistakes > 0)}
    ${C.listen ? card('#/practice-session/listening', 'ui_listen', 'Listening', 'Train your ear with audio only', enough) : ''}
    ${C.speak ? card('#/practice-session/speaking', 'ui_speak', 'Speaking', sync.canTranscribe() && state.profile.settings.speechCheck !== false ? 'Say sentences out loud — Katha checks them' : 'Say sentences out loud and compare with a native speaker', enough && S.pathNodes().some(n => n.type === 'lesson' && S.lessonDone(n.id))) : ''}
    <h3 class="sec-title">Words · ${learned.length}</h3>`;
  if (!learned.length) html += `<p class="muted center">Words you learn will show up here with how well you know them.</p>`;
  else {
    html += '<div class="word-list">';
    const rows = learned.map(id => ({ id, s: strength(state.srs[id]) })).sort((a, b) => a.s - b.s);
    for (const { id, s } of rows) {
      const x = LEX[id];
      html += `<div class="word-row"><div class="wr-pic">${pic(id, { size: 38 })}</div><button class="mini-play" data-play="${esc(x.si)}" aria-label="Play">${ICONS.speaker}</button>
        <div class="wr-main"><span class="si" lang="si">${esc(x.si)}</span><span class="ro">${esc(romanize(x.si))}</span></div>
        <div class="wr-en">${esc(x.en)}</div><div class="bars s${s}" title="Strength ${s}/4"><i></i><i></i><i></i><i></i></div></div>`;
    }
    html += '</div>';
  }
  return html + '</div>';
}
function mountPractice() {}

// ----- Quests
function questsTab() {
  const qs = S.questsFor(S.today(), questCaps());
  const goal = state.profile.goal || 20;
  const xp = S.dayTotals().xp;
  const pct = Math.min(1, xp / goal);
  const now = new Date(); const end = new Date(now); end.setHours(24, 0, 0, 0);
  const hrs = Math.max(1, Math.round((end - now) / 3600000));
  let html = `<div class="quests-tab"><div class="tab-hero"><h1>Daily quests</h1><p>New quests in ${plural(hrs, 'hour')}</p></div>
    <div class="goal-card"><div class="ring" style="--p:${pct}"><span>${ICONS.bolt}</span></div>
      <div><h3>Daily goal</h3><p>${xp} / ${goal} XP today${xp >= goal ? ' — done!' : ''}</p></div></div>
    <div class="quest-list">`;
  for (const q of qs) {
    html += `<div class="quest ${q.claimed ? 'claimed' : ''}">
      <div class="q-main"><h3>${esc(q.text)}</h3>
        <div class="qbar"><i style="width:${(q.progress / q.target) * 100}%"></i><span>${q.progress} / ${q.target}</span></div></div>
      ${q.claimed ? `<div class="q-claimed">${ICONS.check}</div>` : q.done ? `<button class="btn primary small claim" data-cid="${q.cid}">Claim ${q.reward}${ICONS.gem}</button>` : `<div class="q-reward">${ICONS.chest}</div>`}
    </div>`;
  }
  const qc = S.questChest(questCaps());
  const bl = S.boostLeft();
  html += `</div><div class="quest-chest ${qc.opened ? 'opened' : qc.ready ? 'ready' : ''}"><div class="qc-art">${chestArt(qc.opened, 64)}</div>
    <div class="q-main"><h3>Daily chest</h3><p>${qc.opened ? (bl ? `2× XP is on — ${plural(Math.ceil(bl / 60000), 'minute')} left` : 'Opened. A new chest comes tomorrow.') : qc.ready ? 'All quests done! Open it for 2× XP for 15 minutes and 15 gems.' : `Claim ${qc.left === 1 ? 'the last quest' : `all ${qc.left} quests`} to open: 2× XP for 15 minutes and 15 gems.`}</p></div>
    ${qc.ready && !qc.opened ? '<button class="btn primary small open-qc">Open</button>' : ''}</div>`;
  html += `<h3 class="sec-title">Achievements</h3><div class="ach-list">`;
  for (const a of S.ACHIEVEMENTS) {
    const lv = S.achievementLevel(a);
    const target = lv.max ? a.tiers[a.tiers.length - 1] : lv.next;
    html += `<div class="ach ${lv.level ? '' : 'locked'}"><div class="ach-ic">${badge(a.id, lv.level, { size: 54 })}${lv.level ? `<small>LVL ${lv.level}</small>` : ''}</div>
      <div class="q-main"><h3>${esc(a.name)}</h3><p>${esc(a.desc(target))}</p>
      <div class="qbar gold"><i style="width:${Math.min(100, (lv.value / target) * 100)}%"></i><span>${Math.min(lv.value, target)} / ${target}</span></div></div></div>`;
  }
  return html + '</div></div>';
}
function mountQuests() {
  app.querySelector('.quests-tab').addEventListener('click', async (e) => {
    if (e.target.closest('.open-qc')) {
      const g = S.openQuestChest(questCaps());
      if (!g) return;
      sfx.chest(); confetti(80); sync.syncSoon();
      await modal({ art: `<div class="chest-pop">${chestArt(true, 120)}</div>`, title: '2× XP for 15 minutes!', body: `<p>Plus ${g} gems. Do a lesson now to make the most of it.</p>`, buttons: [{ label: 'Let\'s go', value: 1, cls: 'primary' }] });
      return renderTab('quests');
    }
    const b = e.target.closest('.claim'); if (!b) return;
    const g = S.claim(b.dataset.cid);
    sfx.chest(); confetti(50);
    toast(`+${g} gems`, { icon: ICONS.gem });
    sync.syncSoon();
    renderTab('quests');
  });
}

// ----- Friends & weekly leaderboard
const AVATARS = ['aliya', 'kumari', 'nimal', 'john', 'amma', 'thaththa', 'putha', 'duva'];
let friendsCache = null, friendsAt = 0;
function weekEndsIn() {
  const now = new Date(); const end = new Date(now);
  end.setDate(end.getDate() + (7 - ((now.getDay() + 6) % 7))); end.setHours(0, 0, 0, 0);
  const h = Math.round((end - now) / 3600000);
  return h >= 48 ? plural(Math.round(h / 24), 'day') : plural(Math.max(1, h), 'hour');
}
function friendsTab() {
  if (!sync.configured() || window.KATHA_PREVIEW || !sync.user()) {
    return `<div class="friends-tab"><div class="tab-hero"><h1>Friends</h1></div>
      <div class="friends-empty">${castLineup(['kumari', 'john', 'nimal'], 74, 'wave')}
        <h2>Learn together</h2><p>Sign in to get your friend code, add friends and compete on a weekly XP leaderboard.</p>
        <a class="btn primary wide" href="#/profile">Sign in or create an account</a></div></div>`;
  }
  return `<div class="friends-tab"><div class="tab-hero"><h1>Friends</h1><p>Weekly leaderboard · ends in ${weekEndsIn()}</p></div>
    <div class="board">${friendsCache ? boardHTML(friendsCache) : '<div class="board-loading"><span class="spinner"></span> Loading your league…</div>'}</div>
    <h3 class="sec-title">Your friend code</h3>
    <div class="panel code-card"><div class="fc-code">${sync.friendCode() ? [...sync.friendCode()].map((c, i) => `<b style="--i:${i}">${c}</b>`).join('') : '<span class="muted">Syncing…</span>'}</div>
      <p class="muted">Friends type this in, or tap your invite link.</p>
      <div class="row-btns"><button class="btn small primary" data-act="share">${ICONS.share} Share invite</button><button class="btn small" data-act="copy">Copy code</button></div></div>
    <h3 class="sec-title">Add a friend</h3>
    <form class="panel add-form"><input name="code" placeholder="Friend code, e.g. 7F3A9C" maxlength="8" autocomplete="off" autocapitalize="characters" spellcheck="false"><button class="btn small primary">Add</button><p class="add-msg muted"></p></form>
    <div class="friend-list">${friendsCache ? friendListHTML(friendsCache) : ''}</div>
  </div>`;
}
function rankRows(data) {
  const wk = S.weekStartKey();
  return data.profiles.map(p => {
    const me = p.id === data.uid;
    return { ...p, me, xp: me ? S.weekXP() : (p.week === wk ? p.xp_week : 0), name: me ? (state.profile.name || p.name || 'You') : (p.name || 'Friend'), avatar: me ? (state.profile.avatar || p.avatar) : p.avatar, streak: me ? S.streakInfo().streak : p.streak };
  }).sort((a, b) => b.xp - a.xp || (a.me ? -1 : 1));
}
function avatarHead(a, size) { return character(AVATARS.includes(a) ? a : 'aliya', { head: true, size }); }
function boardHTML(data) {
  const rows = rankRows(data);
  if (rows.length < 2) {
    return `<div class="board-solo">${avatarHead(state.profile.avatar, 70)}<div><b>${S.weekXP()} XP this week</b><p>Add a friend below to start your league. Whoever earns the most XP by Sunday night wins the week.</p></div></div>`;
  }
  const podium = rows.slice(0, 3);
  const order = podium.length === 3 ? [podium[1], podium[0], podium[2]] : [podium[1], podium[0]];
  return `<div class="podium">${order.map(r => { const place = rows.indexOf(r) + 1; return `<div class="pod p${place} ${r.me ? 'me' : ''}" style="--d:${(3 - place) * .18}s">
      <div class="pod-av">${avatarHead(r.avatar, 58)}${place === 1 ? `<span class="crown">${ICONS.crown}</span>` : ''}</div>
      <b class="pod-name">${esc(r.me ? 'You' : r.name)}</b><span class="pod-xp">${r.xp} XP</span>
      <div class="pod-step"><span>${place}</span></div></div>`; }).join('')}</div>
    <div class="rank-list">${rows.map((r, i) => `<div class="rank ${r.me ? 'me' : ''}" style="--i:${i}"><span class="rk">${i + 1}</span>${avatarHead(r.avatar, 40)}
      <div class="rk-main"><b>${esc(r.me ? `${r.name} (you)` : r.name)}</b><small>${r.streak ? `${ICONS.flame}${plural(r.streak, 'day')}` : 'No streak yet'}</small></div><span class="rk-xp">${r.xp} XP</span></div>`).join('')}</div>`;
}
function friendListHTML(data) {
  const others = data.profiles.filter(p => p.id !== data.uid);
  if (!others.length) return '';
  return `<h3 class="sec-title">Your friends</h3><div class="panel">${others.map(p => {
    const f = data.following.has(p.id), back = data.followers.has(p.id);
    return `<div class="fr">${avatarHead(p.avatar, 40)}<div class="fr-main"><b>${esc(p.name || 'Friend')}</b><small>${back && f ? 'Friends' : back ? 'Follows you' : 'You follow them'} · ${p.xp_total} XP total</small></div>
      ${f ? `<button class="btn small ghost" data-unfollow="${p.id}">Unfollow</button>` : `<button class="btn small primary" data-follow="${p.id}">Follow back</button>`}</div>`;
  }).join('')}</div>`;
}
function inviteLink() { return `${location.origin}${location.pathname}#/add/${sync.friendCode()}`; }
async function refreshFriends() {
  try {
    if (!sync.friendCode()) await sync.syncNow();
    friendsCache = await sync.loadFriends();
  } catch (e) {
    console.warn('friends', e);
    if (!friendsCache) friendsCache = { uid: sync.user()?.id, profiles: [], following: new Set(), followers: new Set() };
  }
  friendsAt = Date.now();
  if (currentTab === 'friends') renderTab('friends');
}
function mountFriends() {
  const root = app.querySelector('.friends-tab');
  if (!root || !sync.user()) return;
  if ((!friendsCache || Date.now() - friendsAt > 30000) && !mountFriends.busy) { mountFriends.busy = true; refreshFriends().finally(() => { mountFriends.busy = false; }); }
  root.addEventListener('click', async (e) => {
    const b = e.target.closest('[data-act], [data-follow], [data-unfollow]'); if (!b) return;
    if (b.dataset.act === 'share') {
      const url = inviteLink();
      if (navigator.share) { try { await navigator.share({ title: 'Learn Sinhala with me on Katha', text: `Add me on Katha — my friend code is ${sync.friendCode()}`, url }); } catch {} }
      else { await navigator.clipboard?.writeText(url).catch(() => {}); toast('Invite link copied', { icon: ICONS.check }); }
    }
    if (b.dataset.act === 'copy') { await navigator.clipboard?.writeText(sync.friendCode()).catch(() => {}); toast('Friend code copied', { icon: ICONS.check }); }
    if (b.dataset.follow) { b.disabled = true; await sync.follow(b.dataset.follow).catch(err => toast(err.message)); refreshFriends(); }
    if (b.dataset.unfollow) {
      const ok = await modal({ title: 'Unfollow?', body: '<p>They\'ll leave your leaderboard unless they follow you.</p>', buttons: [{ label: 'Keep', value: false, cls: 'primary' }, { label: 'Unfollow', value: true, cls: 'ghost danger' }], dismiss: false });
      if (ok) { await sync.unfollow(b.dataset.unfollow).catch(err => toast(err.message)); refreshFriends(); }
    }
  });
  const form = root.querySelector('.add-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const code = form.code.value.trim().toUpperCase();
    const msg = form.querySelector('.add-msg');
    if (!/^[0-9A-Z]{6,8}$/.test(code)) { msg.textContent = 'Friend codes are 6 letters and numbers.'; return; }
    if (code === sync.friendCode()) { msg.textContent = 'That\'s your own code!'; return; }
    msg.textContent = 'Looking…';
    try {
      const f = await sync.findFriend(code);
      if (!f) { msg.textContent = 'No one has that code. Check it and try again.'; return; }
      await sync.follow(f.id);
      sfx.chest(); confetti(60);
      toast(`You're now following ${f.name || 'your friend'}`, { icon: ICONS.check });
      refreshFriends();
    } catch (err) { msg.textContent = err.message || 'Something went wrong.'; }
  });
}
async function addFriendLink(code) {
  code = (code || '').toUpperCase();
  if (!sync.user()) { sessionStorage.setItem('katha.addFriend', code); toast('Sign in first, then we\'ll add your friend', { icon: ICONS.user }); return go('profile'); }
  history.replaceState(null, '', location.pathname + '#/friends');
  renderTab('friends');
  try {
    const f = await sync.findFriend(code);
    if (!f) { toast('That invite link didn\'t match anyone'); return; }
    const ok = await modal({ art: `<div class="add-art">${avatarHead(f.avatar, 96)}</div>`, title: `Add ${esc(f.name || 'this friend')}?`, body: '<p>You\'ll see each other on the weekly leaderboard.</p>', buttons: [{ label: 'Add friend', value: true, cls: 'primary' }, { label: 'Not now', value: false, cls: 'ghost' }], dismiss: false });
    if (ok) { await sync.follow(f.id); sfx.chest(); confetti(60); }
  } catch (e) { toast(e.message || 'Couldn\'t add that friend'); }
  refreshFriends();
}

// ----- Profile
function xpChart() {
  const t = S.today();
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const k = S.addDays(t, -i);
    const [y, m, d] = k.split('-').map(Number);
    days.push({ k, xp: S.dayTotals(k).xp, label: new Date(y, m - 1, d).toLocaleDateString(undefined, { weekday: 'short' }) });
  }
  const goal = state.profile.goal || 20;
  const max = Math.max(goal, ...days.map(d => d.xp), 10);
  return `<figure class="xp-chart" aria-label="XP earned in the last 7 days">
    <figcaption>XP this week <span class="muted">· ${days.reduce((a, d) => a + d.xp, 0)} total</span></figcaption>
    <div class="xc-plot" style="--goal:${(goal / max) * 100}%"><div class="xc-goal"><span>goal</span></div>
    ${days.map((d, i) => `<button class="xc-col ${i === 6 ? 'today' : ''}" aria-label="${d.label}: ${d.xp} XP"><span class="xc-val">${d.xp}</span><i style="height:${Math.max(d.xp ? 3 : 0, (d.xp / max) * 100)}%"></i></button>`).join('')}
    </div>
    <div class="xc-labels">${days.map(d => `<span>${d.label}</span>`).join('')}</div>
    <table class="sr-only"><tr><th>Day</th><th>XP</th></tr>${days.map(d => `<tr><td>${d.label}</td><td>${d.xp}</td></tr>`).join('')}</table>
  </figure>`;
}
function profileTab() {
  const p = state.profile;
  const st = S.streakInfo();
  const since = new Date(p.created).toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  const set = p.settings;
  const tog = (k, label, desc) => `<label class="setting"><div><b>${label}</b>${desc ? `<small>${desc}</small>` : ''}</div><input type="checkbox" data-set="${k}" ${set[k] !== false ? 'checked' : ''}><span class="switch"></span></label>`;
  const u = sync.user();
  let account;
  if (window.KATHA_PREVIEW) {
    account = `<p class="muted">Sign-in and sync work in the installed app. This preview page can't reach the sync server, so progress here stays on this page.</p>`;
  } else if (!sync.configured()) {
    account = `<p class="muted">Cloud sync isn't set up yet, so progress is saved on this device. Setup steps are in the README — once done, sign in here on each device.</p>`;
  } else if (u) {
    const ls = sync.lastSync();
    account = `<p>Signed in as <b>${esc(u.email)}</b></p>
      <p class="muted sync-status">${sync.isSyncing() ? 'Syncing…' : ls ? `Last synced ${timeAgo(ls)}` : 'Not synced yet'}${sync.lastError() ? ` · <span class="err">${esc(sync.lastError())}</span>` : ''}</p>
      <div class="row-btns"><button class="btn small" data-act="sync">Sync now</button><button class="btn small ghost" data-act="signout">Sign out</button></div>`;
  } else {
    account = `<form class="auth-form">
      <p class="muted">Sign in to keep your progress in sync across your phone, tablet and computer.</p>
      <input type="email" name="email" placeholder="Email" autocomplete="email" required>
      <input type="password" name="password" placeholder="Password (6+ characters)" autocomplete="current-password" minlength="6" required>
      <div class="row-btns"><button class="btn primary small" data-mode="in">Sign in</button><button class="btn small" data-mode="up">Create account</button></div>
      <p class="auth-msg muted"></p></form>`;
  }
  return `<div class="profile-tab">
    <div class="prof-head"><div class="avatar-big char-av">${character(p.avatar || 'aliya', { head: true, size: 72 })}</div>
      <div><h1 class="prof-name">${esc(p.name || 'Learner')}</h1><p class="muted">Learning spoken Sinhala since ${since}</p></div></div>
    <div class="stats">
      <div class="stat">${ICONS.flame}<b>${st.streak}</b><span>Day streak</span></div>
      <div class="stat">${ICONS.bolt}<b>${S.totalXP()}</b><span>Total XP</span></div>
      <div class="stat">${ICONS.words}<b>${S.wordsLearned()}</b><span>Words</span></div>
      <div class="stat"><span class="stat-emo" lang="si">අ</span><b>${S.lettersMastered()}</b><span>Letters</span></div>
    </div>
    ${xpChart()}
    <a class="shop-link" href="#/shop">${ICONS.gem}<div><b>Shop</b><small>${S.gems()} gems · ${plural(S.freezesOwned(), 'streak freeze')}</small></div><span>›</span></a>
    <h3 class="sec-title">${ICONS.cloud} Account & sync</h3><div class="panel account">${account}</div>
    <h3 class="sec-title">Settings</h3>
    <div class="panel settings">
      <label class="setting"><div><b>Name</b></div><input class="name-in" type="text" value="${esc(p.name)}" placeholder="Your name" maxlength="30"></label>
      <div class="setting avatar-set"><div><b>Avatar</b><small>What friends see on the leaderboard</small></div>
        <div class="av-pick">${AVATARS.map(a => `<button class="av-opt ${a === (p.avatar || 'aliya') ? 'on' : ''}" data-avatar="${a}" aria-label="${a}">${character(a, { head: true, size: 44 })}</button>`).join('')}</div></div>
      <label class="setting"><div><b>Daily goal</b></div><select data-goal>${[10, 20, 30, 50].map(g => `<option value="${g}" ${p.goal === g ? 'selected' : ''}>${g} XP · ${{ 10: 'Casual', 20: 'Regular', 30: 'Serious', 50: 'Intense' }[g]}</option>`).join('')}</select></label>
      ${tog('roman', 'Show romanization', 'English letters under Sinhala script')}
      ${tog('sound', 'Sound effects')}
      ${tog('hearts', 'Hearts', 'Mistakes cost hearts in lessons')}
      ${tog('listening', 'Listening exercises')}
      ${tog('speaking', 'Speaking exercises')}
      ${tog('speechCheck', 'Check my speaking', 'Sends your recordings to Azure to grade them (needs sign-in)')}
    </div>
    <h3 class="sec-title">Audio</h3>
    <div class="panel"><p class="muted">${audio.hasClips() ? 'Using recorded Sinhala voices.' : audio.deviceVoice() ? `Using this device's Sinhala voice (${esc(audio.deviceVoice().name)}). Recorded voices will replace it once they're generated.` : 'No Sinhala audio yet on this device — listening exercises are hidden until voice clips are generated (see README).'}</p></div>
    <div class="danger-zone"><button class="link-btn danger" data-act="reset">Reset all progress on this device</button>
    <p class="muted small">Katha v${window.KATHA_VERSION || 'dev'}</p></div>
  </div>`;
}
function timeAgo(t) {
  const s = Math.round((Date.now() - t) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.round(s / 60)} min ago`;
  if (s < 86400) return `${Math.round(s / 3600)} h ago`;
  return new Date(t).toLocaleDateString();
}
function mountProfile() {
  const root = app.querySelector('.profile-tab');
  root.addEventListener('change', (e) => {
    const t = e.target;
    if (t.dataset.set) { S.setSetting(t.dataset.set, t.checked); refreshTopbar(); sync.syncSoon(); }
    if (t.matches('[data-goal]')) { S.setProfile({ goal: Number(t.value) }); sync.syncSoon(); }
    if (t.matches('.name-in')) { S.setProfile({ name: t.value.trim() }); root.querySelector('.prof-name').textContent = t.value.trim() || 'Learner'; root.querySelector('.avatar-big').textContent = (t.value.trim() || 'You')[0].toUpperCase(); sync.syncSoon(); }
  });
  root.addEventListener('click', async (e) => {
    const av = e.target.closest('[data-avatar]');
    if (av) { S.setProfile({ avatar: av.dataset.avatar }); sfx.tap(); sync.syncSoon(); renderTab('profile'); return; }
    const b = e.target.closest('[data-act]');
    if (b?.dataset.act === 'sync') { b.disabled = true; await sync.syncNow(); renderTab('profile'); }
    if (b?.dataset.act === 'signout') { await sync.signOut(); renderTab('profile'); }
    if (b?.dataset.act === 'reset') {
      const v = await modal({ title: 'Reset everything?', body: '<p>This erases all progress on this device. If you\'re signed in, your cloud copy stays — sign out first if you want a truly fresh start.</p>',
        buttons: [{ label: 'Cancel', value: false, cls: 'primary' }, { label: 'Reset', value: true, cls: 'ghost danger' }], dismiss: false });
      if (v) { S.resetAll(); go('onboarding'); }
    }
  });
  const form = root.querySelector('.auth-form');
  form?.addEventListener('submit', (e) => e.preventDefault());
  form?.addEventListener('click', async (e) => {
    const b = e.target.closest('[data-mode]'); if (!b) return;
    e.preventDefault();
    const email = form.email.value.trim(), password = form.password.value;
    const msg = form.querySelector('.auth-msg');
    if (!email || password.length < 6) { msg.textContent = 'Enter your email and a password of at least 6 characters.'; return; }
    form.querySelectorAll('button').forEach(x => x.disabled = true);
    msg.textContent = b.dataset.mode === 'up' ? 'Creating your account…' : 'Signing in…';
    try {
      if (b.dataset.mode === 'up') {
        const r = await sync.signUp(email, password);
        if (r === 'confirm-email') { msg.textContent = 'Check your email to confirm your account, then come back and sign in.'; form.querySelectorAll('button').forEach(x => x.disabled = false); return; }
      } else await sync.signIn(email, password);
      toast('Signed in — progress synced', { icon: ICONS.cloud });
      const pending = sessionStorage.getItem('katha.addFriend');
      if (pending) { sessionStorage.removeItem('katha.addFriend'); return go('add/' + pending); }
      renderTab('profile');
    } catch (err) {
      msg.textContent = err.message || 'Something went wrong.';
      form.querySelectorAll('button').forEach(x => x.disabled = false);
    }
  });
  root.querySelectorAll('.xc-col').forEach(c => c.addEventListener('click', () => { root.querySelectorAll('.xc-col').forEach(x => x.classList.remove('show')); c.classList.add('show'); }));
}

// ------------------------------------------------------------ shop & guide
function renderShop() {
  currentTab = null;
  const g = S.gems();
  const owned = S.freezesOwned();
  const n = S.heartsNow();
  app.innerHTML = `<div class="page">
    <div class="page-top"><a class="icon-btn" href="#/profile" aria-label="Back">${ICONS.close}</a><h1>Shop</h1><div class="gem-count">${ICONS.gem}<b>${g}</b></div></div>
    <div class="shop-list">
      <div class="shop-item"><div class="si-ic">${ICONS.freeze}</div><div class="si-txt"><h3>Streak freeze</h3><p>Keeps your streak alive if you miss a day. You have ${owned} of ${S.MAX_FREEZES}.</p></div>
        <button class="btn small ${g >= S.PRICES.freeze && owned < S.MAX_FREEZES ? 'primary' : ''}" data-buy="freeze" ${g >= S.PRICES.freeze && owned < S.MAX_FREEZES ? '' : 'disabled'}>${owned >= S.MAX_FREEZES ? 'Full' : `${S.PRICES.freeze} ${ICONS.gem}`}</button></div>
      <div class="shop-item"><div class="si-ic">${ICONS.heart}</div><div class="si-txt"><h3>Refill hearts</h3><p>${n >= S.MAX_HEARTS ? 'Your hearts are already full.' : `Get all ${S.MAX_HEARTS} hearts back now.`}</p></div>
        <button class="btn small ${g >= S.PRICES.refill && n < S.MAX_HEARTS ? 'primary' : ''}" data-buy="refill" ${g >= S.PRICES.refill && n < S.MAX_HEARTS ? '' : 'disabled'}>${S.PRICES.refill} ${ICONS.gem}</button></div>
      <div class="shop-item"><div class="si-ic boost-ic">${ICONS.bolt}</div><div class="si-txt"><h3>XP Boost</h3><p>Double XP for 15 minutes.${S.boostLeft() ? ` On now: ${plural(Math.ceil(S.boostLeft() / 60000), 'minute')} left. Buying adds 15 more.` : ''}</p></div>
        <button class="btn small ${g >= S.PRICES.boost ? 'primary' : ''}" data-buy="boost" ${g >= S.PRICES.boost ? '' : 'disabled'}>${S.PRICES.boost} ${ICONS.gem}</button></div>
    </div>
    <p class="muted center">Earn gems from treasure chests, daily quests, streak milestones and achievements.</p>
  </div>`;
  app.querySelector('.shop-list').addEventListener('click', (e) => {
    const b = e.target.closest('[data-buy]'); if (!b) return;
    const it = b.dataset.buy;
    if (S.buy(it)) { sfx.chest(); toast({ freeze: 'Streak freeze equipped', refill: 'Hearts refilled!', boost: '2× XP for 15 minutes!' }[it], { icon: { freeze: ICONS.freeze, refill: ICONS.heart, boost: ICONS.bolt }[it] }); sync.syncSoon(); renderShop(); }
  });
}

function renderGuide(uid) {
  currentTab = null;
  const u = UNITS.find(x => x.id === uid) || UNITS[0];
  const ui = UNITS.indexOf(u);
  app.innerHTML = `<div class="page guide" style="--u:${u.color}">
    <div class="page-top"><a class="icon-btn" href="#/learn" aria-label="Back">${ICONS.close}</a><h1>Unit ${ui + 1} guidebook</h1><div></div></div>
    <div class="guide-hero"><div><h2>${esc(u.title)}</h2><p>${esc(u.desc)}</p></div>${unitHero(u.id)}</div>
    <h3 class="sec-title">Key phrases</h3>
    <div class="phrases">${u.phrases.map(id => { const s = sent(id); return `<div class="phrase">${audio.canPlay(s.si, s.voice) ? audioBtn(s.si, { voice: s.voice, slow: false }) : ''}<div>${siLine(s.si, s.g, { roman: true, voice: s.voice })}<div class="ph-en">${esc(s.en)}</div></div></div>`; }).join('')}</div>
    <h3 class="sec-title">Tips</h3>
    ${u.guide.map(t => `<div class="tip"><h4>${esc(t.h)}</h4><p>${esc(t.p).replace(/\*(.+?)\*/g, '<em>$1</em>')}</p></div>`).join('')}
    <a class="btn primary wide" href="#/learn">Back to the path</a>
  </div>`;
}

// ------------------------------------------------------------ onboarding
function renderOnboarding(step) {
  currentTab = null;
  const p = state.profile;
  const steps = [
    () => `<div class="onb center">${castLineup(['kumari', 'aliya', 'nimal', 'john'], 82, 'wave')}
      <h1>Learn to <span class="accent">speak</span> Sinhala</h1>
      <p>Short, game-like lessons in everyday spoken Sinhala — the way people really talk in Sri Lanka.</p>
      <div class="onb-btns"><button class="btn primary wide" data-next>Get started</button>
      ${sync.configured() && !window.KATHA_PREVIEW ? '<button class="btn ghost wide" data-signin>I already have an account</button>' : ''}</div></div>`,
    () => `<div class="onb">${mascot('idle', 110)}<h2>What should I call you?</h2>
      <input class="name-in big-in" type="text" placeholder="Your name" value="${esc(p.name)}" maxlength="30">
      <div class="onb-btns"><button class="btn primary wide" data-next>Continue</button></div></div>`,
    () => `<div class="onb">${mascot('idle', 110)}<h2>Pick a daily goal</h2>
      <div class="goal-opts">${[[10, 'Casual', '~5 min a day'], [20, 'Regular', '~10 min a day'], [30, 'Serious', '~15 min a day'], [50, 'Intense', '~25 min a day']]
        .map(([g, l, d]) => `<button class="choice goal-opt ${p.goal === g ? 'sel' : ''}" data-goal="${g}"><b>${l}</b><span>${d}</span><i>${g} XP</i></button>`).join('')}</div>
      <div class="onb-btns"><button class="btn primary wide" data-next>Continue</button></div></div>`,
    () => `<div class="onb">${mascot('happy', 110)}<h2>Where do you want to start?</h2>
      <button class="choice start-opt" data-start="lesson"><span class="so-ic">${ICONS.chat}</span><div><b>Start speaking</b><span>Jump into Unit 1: Greetings. Romanization helps you read along.</span></div></button>
      <button class="choice start-opt" data-start="letters"><span class="so-ic" lang="si">අ</span><div><b>Learn the letters first</b><span>Get to know the Sinhala script, then start speaking.</span></div></button></div>`,
  ];
  app.innerHTML = `<div class="page onboarding">${step > 0 ? `<div class="onb-progress"><i style="width:${(step / (steps.length - 1)) * 100}%"></i></div>` : ''}${steps[step]()}</div>`;
  const root = app.querySelector('.onboarding');
  root.addEventListener('click', (e) => {
    unlock();
    if (e.target.closest('[data-next]')) {
      const n = root.querySelector('.name-in'); if (n) S.setProfile({ name: n.value.trim() });
      renderOnboarding(step + 1);
    }
    if (e.target.closest('[data-signin]')) { state.profile.onboarded = true; S.save({ quiet: true }); S.ensureWelcome(); go('profile'); }
    const gb = e.target.closest('[data-goal]');
    if (gb) { root.querySelectorAll('.goal-opt').forEach(x => x.classList.remove('sel')); gb.classList.add('sel'); S.setProfile({ goal: Number(gb.dataset.goal) }); }
    const sb = e.target.closest('[data-start]');
    if (sb) { S.setProfile({ onboarded: true }); S.ensureWelcome(); go(sb.dataset.start === 'letters' ? 'letters-session' : `lesson/${UNITS[0].path[0].id}`); }
  });
  root.querySelector('.name-in')?.addEventListener('keydown', (e) => { if (e.key === 'Enter') root.querySelector('[data-next]').click(); });
}

// ------------------------------------------------------------ sessions
async function needHeartsFirst() {
  if (!state.profile.settings.hearts || S.heartsNow() > 0) return false;
  const v = await modal({ art: mascot('sad', 100), title: 'Out of hearts', body: `<p>Next heart in ${Math.ceil(S.nextHeartIn() / 60000)} min. Practice is free and earns one back.</p>`,
    buttons: [...(S.gems() >= S.PRICES.refill ? [{ label: `Refill for ${S.PRICES.refill} ${ICONS.gem}`, value: 'refill', cls: 'primary' }] : []), { label: 'Practice', value: 'practice' }, { label: 'Not now', value: 'quit', cls: 'ghost' }], dismiss: 'quit' });
  if (v === 'refill') { S.buy('refill'); return false; }
  go(v === 'practice' ? 'practice-session/smart' : 'learn');
  return true;
}

function stage() { currentTab = null; inSession = true; app.innerHTML = '<div class="stage"></div>'; return app.querySelector('.stage'); }

async function startNode(id) {
  const n = nodeById(id);
  if (!n) return go('learn');
  const idx = S.pathNodes().findIndex(x => x.id === id);
  if (idx > S.currentNodeIndex()) return go('learn');
  if (n.type === 'story') {
    const host = stage();
    return runStory(id, { host, onQuit: () => go('learn'), onComplete: (r) => finishSession(r, 'learn') });
  }
  if (n.type === 'chest') return go('learn');
  if (await needHeartsFirst()) return;
  if (!(await lessonIntro(n))) return;
  const session = n.type === 'review' ? buildUnitReview(n) : buildLesson(n);
  const host = app.querySelector('.stage') || stage();
  runSession(session, { host, onQuit: () => go('learn'), onComplete: (r) => finishSession(r, 'learn'), onNeedHearts: (c) => go(c === 'practice' ? 'practice-session/smart' : 'learn') });
}
// Animated card before a lesson: the unit's scene, the lesson title and its new words.
function lessonIntro(n) {
  const u = UNITS.find(x => x.path.some(p => p.id === n.id));
  if (!u) return Promise.resolve(true);
  const ui = UNITS.indexOf(u);
  const lessons = u.path.filter(x => x.type === 'lesson');
  const li = lessons.findIndex(x => x.id === n.id);
  const first = !S.lessonDone(n.id);
  const host = stage();
  sfx.whoosh();
  const words = n.type === 'lesson' ? n.items : [];
  host.innerHTML = `<div class="intro-card" style="--u:${u.color}">
    <button class="icon-btn ic-close" aria-label="Close">${ICONS.close}</button>
    <div class="ic-hero">${unitHero(u.id)}</div>
    <div class="ic-body">
      <div class="ic-meta">Unit ${ui + 1} · ${n.type === 'review' ? 'Unit review' : `Lesson ${li + 1} of ${lessons.length}`}</div>
      <h1>${esc(n.type === 'review' ? `Review: ${u.title}` : n.title)}</h1>
      ${words.length ? `<p class="ic-sub">${first ? 'New words' : 'Words in this lesson'}</p>
        <div class="ic-words">${words.map((id, i) => `<div class="ic-w" style="--i:${i}">${pic(id, { size: 56, live: true })}<span lang="si">${esc(LEX[id].si)}</span></div>`).join('')}</div>`
        : `<p class="ic-sub">Everything from Unit ${ui + 1}, mixed together. Finish it to complete the unit.</p><div class="ic-trophy">${trophyArt(90)}</div>`}
      ${S.boostLeft() > 0 ? `<p class="ic-boost">${ICONS.bolt} 2× XP is on</p>` : ''}
    </div>
    <div class="ic-foot"><button class="btn primary wide ic-go">${n.type === 'review' ? 'Start review' : first ? 'Start lesson' : 'Practice again'}</button></div>
  </div>`;
  return new Promise(res => {
    host.querySelector('.ic-go').addEventListener('click', () => {
      host.querySelector('.intro-card').classList.add('leaving');
      setTimeout(() => res(true), 260);
    }, { once: true });
    host.querySelector('.ic-close').addEventListener('click', () => { res(false); go('learn'); }, { once: true });
  });
}

function startLetters(groupId) {
  const session = buildLetters(groupId || null);
  const host = stage();
  runSession(session, { host, onQuit: () => go('letters'), onComplete: (r) => finishSession(r, 'letters') });
}
function startPractice(mode) {
  const session = buildPractice(mode);
  if (!session) { toast('Finish a lesson first — then there\'s something to practice!'); return go('practice'); }
  const host = stage();
  runSession(session, { host, onQuit: () => go('practice'), onComplete: (r) => finishSession(r, 'practice') });
}

let justDone = null;
async function finishSession(r, back) {
  justDone = r.nodeId || null;
  const before = S.streakInfo();
  const goalBefore = S.dayTotals().xp >= (state.profile.goal || 20);

  // Bonuses, applied before the session is recorded so they count toward goals and quests.
  const bonuses = [];
  if (r.bonus) bonuses.push({ icon: ICONS.star || ICONS.check, cls: 'perfect', label: 'Flawless — no mistakes', val: `+${r.bonus} XP` });
  const comboXP = r.kind === 'letters' ? 0 : r.maxCombo >= 10 ? 3 : r.maxCombo >= 5 ? 2 : 0;
  if (comboXP) { r.xp += comboXP; bonuses.push({ icon: ICONS.flame, cls: 'combo', label: `${r.maxCombo} in a row`, val: `+${comboXP} XP` }); }
  if (S.boostLeft() > 0) { const extra = r.xp; r.xp += extra; bonuses.push({ icon: ICONS.bolt, cls: 'boost', label: 'XP Boost', val: `×2 · +${extra} XP` }); }
  const hr = new Date().getHours();
  if (hr >= 5 && hr < 9) { const g = S.claim(`early:${S.today()}`); if (g) bonuses.push({ icon: ICONS.sun || ICONS.gem, cls: 'early', label: 'Early bird', val: `+${g} gems` }); }
  if (hr >= 21 || hr < 2) { const g = S.claim(`night:${S.today()}`); if (g) bonuses.push({ icon: ICONS.moon || ICONS.gem, cls: 'night', label: 'Night owl', val: `+${g} gems` }); }

  const unitDone = r.kind === 'review' && r.nodeId && !state.claims['unit:' + r.nodeId];
  S.recordSession(r);
  if (r.kind === 'practice') { S.gainHeart(1); bonuses.push({ icon: ICONS.heart, cls: 'heart', label: 'Practice reward', val: '+1 heart' }); }
  if (unitDone) bonuses.push({ icon: ICONS.gem, cls: 'unit', label: 'Unit complete', val: `+${S.claimReward('unit:x')} gems` });
  const achs = S.checkAchievements();
  const after = S.streakInfo();
  const goalNow = S.dayTotals().xp >= (state.profile.goal || 20);
  sync.syncSoon(500);
  const unit = r.nodeId ? UNITS.find(u => u.path.some(x => x.id === r.nodeId)) : null;
  const titles = { lesson: 'Lesson complete!', review: 'Unit review complete!', story: 'Story complete!', practice: 'Practice complete!', letters: 'Letters practiced!' };
  const title = unitDone && unit ? `Unit ${UNITS.indexOf(unit) + 1} complete!` : (titles[r.kind] || 'Complete!');
  const cast = unit ? [...new Set(['aliya', ...Object.values(STORIES[`st_${unit.id}`]?.lines || []).map(l => l.sp).filter(Boolean)])].slice(0, 3) : [];
  const art = unitDone
    ? `<div class="res-art unit-done"><div class="res-rays"></div><div class="res-trophy">${trophyArt(104)}</div>${castLineup(cast, 74, 'happy')}</div>`
    : `<div class="res-art"><div class="res-rays"></div>${character('aliya', { size: 170, mood: 'dance' })}</div>`;
  (unitDone ? sfx.fanfare : sfx.complete)();
  const host = app.querySelector('.stage') || stage();
  host.innerHTML = `<div class="results ${unitDone ? 'unit-complete' : ''}" style="--u:${unit?.color || 'var(--brand)'}">
    ${art}
    <h1 class="res-title">${esc(title)}</h1>
    ${unitDone ? `<p class="res-sub">You finished ${esc(unit.title)}. ${UNITS.indexOf(unit) + 1 < UNITS.length ? 'The next unit is open!' : 'That\'s every unit so far!'}</p>` : ''}
    <div class="res-stats">
      <div class="rs gold" style="--i:0"><span>Total XP</span><b>${ICONS.bolt}0</b></div>
      <div class="rs green" style="--i:1"><span>${r.accuracy >= 90 ? 'Amazing' : r.accuracy >= 70 ? 'Good' : 'Accuracy'}</span><b>${ICONS.target}0%</b></div>
      <div class="rs blue" style="--i:2"><span>${r.ms < 120000 ? 'Speedy' : 'Time'}</span><b>${ICONS.clock}${fmtDuration(r.ms)}</b></div>
    </div>
    ${bonuses.length ? `<div class="res-bonus">${bonuses.map((b, i) => `<div class="rb ${b.cls}" style="--i:${i}"><span class="rb-ic">${b.icon}</span><span class="rb-l">${esc(b.label)}</span><b>${b.val}</b></div>`).join('')}</div>` : ''}
    <div class="res-foot"><button class="btn primary wide go-on">Continue</button></div>
  </div>`;
  confetti(unitDone ? 180 : 90);
  if (unitDone) setTimeout(() => confetti(120), 900);
  setTimeout(() => countUp(host.querySelector('.rs.gold b'), r.xp, ICONS.bolt), 350);
  setTimeout(() => countUp(host.querySelector('.rs.green b'), r.accuracy, ICONS.target, '%'), 500);
  bonuses.forEach((_, i) => setTimeout(() => sfx.tick(), 1100 + i * 280));
  await new Promise(res => host.querySelector('.go-on').addEventListener('click', res, { once: true }));

  if (!before.doneToday && after.doneToday) {
    sfx.streak();
    const gift = S.STREAK_GIFTS[after.streak] ? S.claim(`streak:${after.streak}`) : 0;
    host.innerHTML = `<div class="results streak-screen">
      <div class="flame-wrap">${bigFlame(170)}</div><div class="streak-num"><span class="sn-old">${Math.max(0, after.streak - 1)}</span><span class="sn-new">${after.streak}</span></div>
      <h1>${plural(after.streak, 'day')} streak!</h1>
      ${weekStrip()}
      ${gift ? `<div class="milestone"><div class="ms-chest">${chestArt(true, 72)}</div><div><b>${after.streak}-day milestone!</b><span>+${gift} gems</span></div></div>` : ''}
      <p class="res-sub">${after.streak === 1 ? 'Every streak starts with day one. See you tomorrow!' : gift ? 'Keep going — the next milestone has a bigger chest.' : 'Practice each day to keep it growing.'}</p>
      <div class="res-foot"><button class="btn primary wide go-on">Continue</button></div></div>`;
    if (gift) setTimeout(() => { sfx.chest(); confetti(80); }, 1300);
    await new Promise(res => host.querySelector('.go-on').addEventListener('click', res, { once: true }));
  }
  if (!goalBefore && goalNow) toast(`Daily goal reached! +${S.claimReward('goal:x')} gems`, { icon: ICONS.bolt });
  achs.forEach((x, i) => setTimeout(() => toast(`Achievement: ${x.a.name} (level ${x.tier + 1}) +${S.claimReward(`ach:${x.a.id}:${x.tier}`)} gems`, { icon: badge(x.a.id, x.tier + 1, { size: 30, cls: 'pop' }), ms: 3200 }), 400 + i * 900));
  go(back);
}

function countUp(el, to, icon = '', suffix = '', ms = 800) {
  if (!el) return;
  const t0 = performance.now();
  const step = (t) => {
    const k = Math.min(1, (t - t0) / ms);
    const v = Math.round(to * (1 - Math.pow(1 - k, 3)));
    el.innerHTML = `${icon}${v}${suffix}`;
    if (k < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

// ------------------------------------------------------------ boot
async function boot() {
  await audio.initAudio('audio/');
  if (await sync.captureRedirect()) setTimeout(() => toast('Email confirmed — you\'re signed in and synced', { icon: ICONS.cloud, ms: 3500 }), 400);
  const used = S.applyFreezes();
  route();
  if (used) setTimeout(() => toast(`A streak freeze saved your streak!`, { icon: ICONS.freeze, ms: 4000 }), 600);
  if (sync.configured() && sync.user()) {
    sync.syncNow().then(ok => { if (ok && !inSession && currentTab) renderTab(currentTab); });
  }
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      if (sync.user()) sync.syncNow().then(ok => { if (ok && !inSession && currentTab && !document.activeElement?.matches('input, textarea, select')) renderTab(currentTab); });
      else if (!inSession && currentTab) refreshTopbar();
    }
  });
  sync.onSyncChange(() => { const s = app.querySelector('.sync-status'); if (s && currentTab === 'profile') s.textContent = sync.isSyncing() ? 'Syncing…' : sync.lastSync() ? `Last synced ${timeAgo(sync.lastSync())}` : ''; });
  setInterval(() => { if (!inSession && currentTab) refreshTopbar(); }, 60000);

  if ('serviceWorker' in navigator && !window.KATHA_PREVIEW && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    try {
      const reg = await navigator.serviceWorker.register('sw.js');
      reg.addEventListener('updatefound', () => {
        const w = reg.installing;
        w?.addEventListener('statechange', () => {
          if (w.state === 'installed' && navigator.serviceWorker.controller) showUpdateBanner(w);
        });
      });
    } catch (e) { console.warn('SW failed', e); }
  }
}
function showUpdateBanner(worker) {
  const b = document.createElement('button');
  b.className = 'update-banner';
  b.textContent = 'A new version of Katha is ready — tap to update';
  b.addEventListener('click', () => { worker.postMessage('skipWaiting'); });
  document.body.appendChild(b);
  navigator.serviceWorker.addEventListener('controllerchange', () => location.reload());
}

boot();
