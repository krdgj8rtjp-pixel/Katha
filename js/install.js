// "Add Katha to your home screen": one-tap install where the browser allows it (Chrome/Edge on Android
// and computers), and illustrated steps for iPhone/iPad (Safari has no install prompt) and Android menus.
import { ICONS, modal, toast } from './ui.js';

const UA = navigator.userAgent;
export const isIOS = /iPad|iPhone|iPod/.test(UA) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
export const isAndroid = /Android/i.test(UA);
const iosOtherBrowser = isIOS && /CriOS|FxiOS|EdgiOS|OPiOS/.test(UA);
const safariMajor = +((UA.match(/Version\/(\d+)/) || [])[1] || 0);
const samsung = /SamsungBrowser/i.test(UA);
export const isStandalone = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;

// Chrome/Edge fire this when Katha can be installed; keep it so our own button can open the install dialog.
let deferred = null;
addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferred = e; document.dispatchEvent(new Event('katha:installable')); });
addEventListener('appinstalled', () => {
  deferred = null;
  try { localStorage.setItem('katha.installed', '1'); } catch {}
  document.querySelectorAll('.install-float').forEach(x => x.remove());
  toast('Katha is on your home screen', { icon: ICONS.check, ms: 3600 });
});
export const canPrompt = () => !!deferred;
export async function promptInstall() {
  if (!deferred) return showInstallHelp();
  const e = deferred; deferred = null;
  e.prompt();
  try { await e.userChoice; } catch {}
}

const I = {
  share: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v11M8 7l4-4 4 4" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M7 10H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-1" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>',
  dots: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="5" cy="12" r="2" fill="currentColor"/><circle cx="12" cy="12" r="2" fill="currentColor"/><circle cx="19" cy="12" r="2" fill="currentColor"/></svg>',
  vdots: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="5" r="2" fill="currentColor"/><circle cx="12" cy="12" r="2" fill="currentColor"/><circle cx="12" cy="19" r="2" fill="currentColor"/></svg>',
  add: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="4" stroke="currentColor" stroke-width="2" fill="none"/><path d="M12 8v8M8 12h8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  phone: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="2.5" width="12" height="19" rx="3" stroke="currentColor" stroke-width="2" fill="none"/><path d="M10.5 18.5h3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M12 7v6m-2.5-2.5L12 13l2.5-2.5" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  burger: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14M5 12h14M5 17h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
};
export const INSTALL_ICON = I.phone;
const key = (svg, label) => `<span class="kbd" ${label ? `aria-label="${label}"` : ''}>${svg}</span>`;
const step = (n, html, sub = '') => `<li><span class="inst-n">${n}</span><div>${html}${sub ? `<small>${sub}</small>` : ''}</div></li>`;
const URL_TEXT = location.host + location.pathname.replace(/index\.html$/, '');

function iosPane(signedIn) {
  const newSafari = !safariMajor || safariMajor >= 26;
  return `${iosOtherBrowser ? `<p class="inst-warn">Use <b>Safari</b> for this: open <b>${URL_TEXT}</b> in Safari, then follow these steps. <button class="link-btn" data-copy-link>Copy link</button></p>` : ''}
    <ol class="inst-steps">
      ${newSafari
        ? step(1, `In Safari, tap ${key(I.dots, 'More')} next to the address bar, then tap <b>Share</b> ${key(I.share, 'Share')}.`, `On older iPhones, tap the Share button ${key(I.share)} in the toolbar instead.`)
        : step(1, `In Safari, tap the Share button ${key(I.share, 'Share')} in the toolbar.`, `On iOS 26, it's under ${key(I.dots)} next to the address bar.`)}
      ${step(2, `Scroll down and tap <b>Add to Home Screen</b> ${key(I.add, 'Add to Home Screen')}.`)}
      ${step(3, `Leave <b>Open as Web App</b> on, then tap <b>Add</b>.`)}
    </ol>
    ${signedIn ? '' : `<p class="inst-note">${ICONS.cloud}<span>On iPhone and iPad the Home Screen app keeps its own storage, separate from Safari. <b>Sign in first</b> so your progress comes with you. <button class="link-btn" data-signin-first>Sign in</button></span></p>`}`;
}
function androidPane() {
  return `${deferred ? `<button class="btn primary wide inst-go" data-install-now>${INSTALL_ICON} Install Katha</button><p class="muted small inst-or">or from the browser menu:</p>` : ''}
    <ol class="inst-steps">
      ${samsung
        ? step(1, `In Samsung Internet, tap ${key(I.burger, 'Menu')} at the bottom.`) + step(2, `Tap <b>Add page to</b>, then <b>Home screen</b>.`)
        : step(1, `In Chrome, tap ${key(I.vdots, 'More')} at the top right.`) + step(2, `Tap <b>Add to home screen</b> ${key(I.add)} (it may say <b>Install app</b>).`) + step(3, `Tap <b>Install</b>.`)}
    </ol>
    <p class="muted small">Your progress stays on this phone either way.${samsung ? '' : ' Samsung Internet: ' + key(I.burger) + ' → <b>Add page to</b> → <b>Home screen</b>.'}</p>`;
}
function computerPane() {
  return `${deferred ? `<button class="btn primary wide inst-go" data-install-now>${INSTALL_ICON} Install Katha</button>` : ''}
    <ol class="inst-steps">
      ${step(1, `<b>Chrome or Edge:</b> click the install icon at the right end of the address bar, or ${key(I.vdots)} → <b>Save and share</b> → <b>Install Katha</b>.`)}
      ${step(2, `<b>Safari on a Mac:</b> <b>File</b> → <b>Add to Dock</b>.`)}
    </ol>`;
}

export function showInstallHelp({ signedIn = false, onSignIn } = {}) {
  const plat = isIOS ? 'ios' : isAndroid ? 'android' : 'computer';
  const tabs = [['ios', 'iPhone & iPad'], ['android', 'Android'], ['computer', 'Computer']];
  const body = `<div class="inst">
    <p class="inst-why">Katha opens full-screen like any other app, works offline, and your streak is one tap away.</p>
    <div class="inst-tabs" role="tablist">${tabs.map(([id, label]) => `<button role="tab" data-plat="${id}" class="${id === plat ? 'on' : ''}" aria-selected="${id === plat}">${label}</button>`).join('')}</div>
    <div class="inst-pane" data-pane="ios" ${plat === 'ios' ? '' : 'hidden'}>${iosPane(signedIn)}</div>
    <div class="inst-pane" data-pane="android" ${plat === 'android' ? '' : 'hidden'}>${androidPane()}</div>
    <div class="inst-pane" data-pane="computer" ${plat === 'computer' ? '' : 'hidden'}>${computerPane()}</div></div>`;
  modal({ art: `<div class="inst-art">${I.phone}</div>`, title: 'Add Katha to your home screen', body, buttons: [{ label: 'Done', value: null, cls: '' }], dismiss: null });
  const wrap = [...document.querySelectorAll('.modal-wrap')].pop();
  wrap?.addEventListener('click', async (e) => {
    const t = e.target.closest('[data-plat]');
    if (t) {
      wrap.querySelectorAll('[data-plat]').forEach(b => { b.classList.toggle('on', b === t); b.setAttribute('aria-selected', b === t); });
      wrap.querySelectorAll('[data-pane]').forEach(p => { p.hidden = p.dataset.pane !== t.dataset.plat; });
      return;
    }
    if (e.target.closest('[data-install-now]')) { wrap.querySelector('[data-i="0"]')?.click(); return promptInstall(); }
    if (e.target.closest('[data-signin-first]')) { wrap.querySelector('[data-i="0"]')?.click(); return onSignIn?.(); }
    if (e.target.closest('[data-copy-link]')) {
      try { await navigator.clipboard.writeText(location.origin + location.pathname); toast('Link copied — paste it into Safari', { icon: ICONS.check }); } catch { toast(URL_TEXT); }
    }
  });
}

// Should the Learn tab invite this person to install? Phones and tablets only, not already installed.
export function shouldOfferInstall() {
  if (isStandalone() || window.KATHA_PREVIEW) return false;
  if (!(isIOS || isAndroid || deferred)) return false;
  try { if (Date.now() - (+localStorage.getItem('katha.installAt') || 0) < 7 * 864e5) return false; } catch {}
  return true;
}
export const snoozeInstall = () => { try { localStorage.setItem('katha.installAt', String(Date.now())); } catch {} };
