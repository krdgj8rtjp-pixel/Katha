// App updates: watch for a new version, show a card with download progress, then restart into it.
// The service worker (tools/sw-template.js) reports progress with postMessage while it installs.
import { ICONS, toast } from './ui.js';
import { esc } from './util.js';

let reg = null;
let card = null;
let st = { phase: 'idle', done: 0, total: 0 }; // idle | checking | downloading | ready | applying | failed
let isBusy = () => false;                        // true while a lesson is running: don't interrupt it
let version = null, built = null;
let manual = false;                              // the learner tapped "Check for updates"

const pct = () => (st.total ? Math.round((st.done / st.total) * 100) : 0);

function render() {
  const show = ['downloading', 'ready', 'applying', 'failed'].includes(st.phase) || (st.phase === 'checking' && manual);
  if (!show || (isBusy() && st.phase !== 'applying')) { card?.classList.remove('in'); return; }
  if (!card) {
    card = document.createElement('div');
    card.className = 'upd';
    card.setAttribute('role', 'status');
    card.setAttribute('aria-live', 'polite');
    card.addEventListener('click', (e) => {
      if (e.target.closest('.upd-go')) apply();
      else if (e.target.closest('.upd-x')) { st.phase === 'ready' ? (st.snoozed = true) : (st.phase = 'idle'); card.classList.remove('in'); }
    });
    document.body.appendChild(card);
  }
  const p = pct();
  const text = {
    checking: ['Checking for updates…', 'One moment'],
    downloading: ['Downloading an update', st.total ? `New lessons and fixes · ${p}%` : 'Starting…'],
    ready: ['Update ready', 'Restart to get the latest lessons'],
    applying: ['Updating Katha…', 'Restarting with the new version'],
    failed: ["The update didn't finish", "Katha will try again next time you open it"],
  }[st.phase];
  const indeterminate = st.phase === 'checking' || st.phase === 'applying' || (st.phase === 'downloading' && !st.total);
  card.className = `upd ${st.phase}`;
  card.innerHTML = `<span class="upd-ic">${st.phase === 'ready' ? ICONS.check : st.phase === 'failed' ? ICONS.close : ICONS.download}</span>
    <div class="upd-main"><b>${esc(text[0])}</b><small>${esc(text[1])}</small>
      ${st.phase === 'ready' || st.phase === 'failed' ? '' : `<div class="upd-bar ${indeterminate ? 'ind' : ''}"><i style="width:${indeterminate ? 40 : Math.max(4, p)}%"></i></div>`}</div>
    ${st.phase === 'ready' ? '<button class="btn primary small upd-go">Restart</button>' : ''}
    ${st.phase === 'ready' || st.phase === 'failed' ? `<button class="upd-x" aria-label="Later">${ICONS.close}</button>` : ''}`;
  if (!(st.phase === 'ready' && st.snoozed)) requestAnimationFrame(() => card.classList.add('in'));
}

function set(patch) { st = { ...st, ...patch }; render(); }

function watch(worker) {
  if (!worker) return;
  if (worker.state === 'installed') return set({ phase: 'ready' });
  if (st.phase !== 'downloading') set({ phase: 'downloading', done: 0, total: 0 });
  worker.addEventListener('statechange', () => {
    if (worker.state === 'installed' && navigator.serviceWorker.controller) set({ phase: 'ready', done: st.total, snoozed: false });
    if (worker.state === 'redundant' && st.phase === 'downloading') { set({ phase: 'failed' }); setTimeout(() => st.phase === 'failed' && set({ phase: 'idle' }), 6000); }
  });
}

export function apply() {
  const w = reg?.waiting;
  if (!w) return;
  set({ phase: 'applying' });
  try { sessionStorage.setItem('katha.updated', '1'); } catch {}
  w.postMessage({ type: 'skipWaiting' });
  setTimeout(() => location.reload(), 8000); // safety net if controllerchange never fires
}

// The learner asked: check now, and say what we found.
export async function checkNow() {
  if (!reg) { toast('Updates work in the installed app', { icon: ICONS.cloud }); return; }
  if (reg.waiting) return set({ phase: 'ready', snoozed: false });
  if (reg.installing) { manual = true; return render(); }
  manual = true; set({ phase: 'checking' });
  try { await reg.update(); } catch {}
  setTimeout(() => {
    if (st.phase === 'checking') { set({ phase: 'idle' }); toast(`You're up to date${built ? ` · version from ${fmt(built)}` : ''}`, { icon: ICONS.check }); }
    manual = false;
  }, 1600);
}

const fmt = (iso) => { try { return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }); } catch { return iso; } };
export const versionLabel = () => (version ? `Version ${version.slice(0, 7)}${built ? ` · ${fmt(built)}` : ''}` : '');

export async function initUpdates({ busy } = {}) {
  if (busy) isBusy = busy;
  // Just restarted into a new version? Say so.
  try {
    if (sessionStorage.getItem('katha.updated')) {
      sessionStorage.removeItem('katha.updated');
      setTimeout(() => toast('Katha is updated — you have the latest lessons', { icon: ICONS.check, ms: 3600 }), 700);
    }
  } catch {}
  if (!('serviceWorker' in navigator) || window.KATHA_PREVIEW || !(location.protocol === 'https:' || location.hostname === 'localhost')) return;
  const sw = navigator.serviceWorker;
  sw.addEventListener('message', (e) => {
    const m = e.data || {};
    if (m.type === 'sw-hello') { version = m.version; built = m.built; return; }
    if (!sw.controller) return; // first install: nothing to announce
    if (m.type === 'sw-progress' && st.phase !== 'ready' && st.phase !== 'applying') set({ phase: 'downloading', done: m.done, total: m.total });
    if (m.type === 'sw-failed') set({ phase: 'failed' });
  });
  let reloading = false;
  sw.addEventListener('controllerchange', () => { if (st.phase === 'applying' && !reloading) { reloading = true; location.reload(); } });
  try {
    reg = await sw.register('sw.js');
    sw.controller?.postMessage({ type: 'hello' });
    sw.controller?.postMessage({ type: 'cache-audio' }); // fill in any missing voice clips, in the background
    if (reg.waiting && sw.controller) set({ phase: 'ready' });
    else if (reg.installing && sw.controller) watch(reg.installing);
    reg.addEventListener('updatefound', () => { if (sw.controller) watch(reg.installing); });
  } catch (e) { console.warn('SW failed', e); return; }
  // Look for updates while the app stays open (phones keep installed apps alive for days).
  let lastCheck = Date.now();
  const check = () => { if (Date.now() - lastCheck > 60_000) { lastCheck = Date.now(); reg.update().catch(() => {}); } };
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') check();
    // Leaving the app with an update waiting: apply it now, so it's ready next time.
    else if (reg.waiting && st.phase === 'ready' && !isBusy()) apply();
  });
  setInterval(check, 20 * 60_000);
}

// Call after a lesson ends, so a card that waited during the lesson appears.
export const refreshUpdateCard = () => render();
