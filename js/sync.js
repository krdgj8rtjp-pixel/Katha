// Cloud sync via Supabase (Auth + one `progress` row per user). No SDK needed.
import { SUPABASE_URL, SUPABASE_KEY } from './config.js';
import { state, merge, replaceState, storage, save, publicProfile } from './store.js';

const SESSION_KEY = 'katha.session';
const META_KEY = 'katha.syncmeta';
let session = JSON.parse(storage.get(SESSION_KEY) || 'null');
let meta = JSON.parse(storage.get(META_KEY) || '{}');
let syncing = null;
const listeners = new Set();

export const configured = () => !!(SUPABASE_URL && SUPABASE_KEY);
export const user = () => session?.user || null;
export const lastSync = () => meta.at || 0;
export const lastError = () => meta.error || '';
export const isSyncing = () => !!syncing;
export function onSyncChange(fn) { listeners.add(fn); return () => listeners.delete(fn); }
const emit = () => listeners.forEach(fn => { try { fn(); } catch {} });

function setSession(s) { session = s; if (s) storage.set(SESSION_KEY, JSON.stringify(s)); else storage.del(SESSION_KEY); emit(); }
function setMeta(m) { meta = { ...meta, ...m }; storage.set(META_KEY, JSON.stringify(meta)); emit(); }

async function api(path, { method = 'GET', body, auth = true, headers = {} } = {}) {
  const h = { apikey: SUPABASE_KEY, 'Content-Type': 'application/json', ...headers };
  if (auth && session?.access_token) h.Authorization = 'Bearer ' + session.access_token;
  const r = await fetch(SUPABASE_URL.replace(/\/$/, '') + path, { method, headers: h, body: body ? JSON.stringify(body) : undefined });
  const text = await r.text();
  let data = null; try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!r.ok) {
    const msg = data?.msg || data?.message || data?.error_description || data?.error || `HTTP ${r.status}`;
    const e = new Error(msg); e.status = r.status; throw e;
  }
  return data;
}

function keep(d) {
  return { access_token: d.access_token, refresh_token: d.refresh_token, expires_at: Date.now() + (d.expires_in || 3600) * 1000, user: { id: d.user?.id, email: d.user?.email } };
}

export async function signUp(email, password) {
  const back = encodeURIComponent(location.origin + location.pathname);
  const d = await api(`/auth/v1/signup?redirect_to=${back}`, { method: 'POST', body: { email, password }, auth: false });
  if (d?.access_token) { setSession(keep(d)); await syncNow(); return 'signed-in'; }
  return 'confirm-email';
}
export async function signIn(email, password) {
  const d = await api('/auth/v1/token?grant_type=password', { method: 'POST', body: { email, password }, auth: false });
  setSession(keep(d));
  await syncNow();
}
export async function signOut() {
  try { await api('/auth/v1/logout', { method: 'POST' }); } catch {}
  setSession(null); setMeta({ at: 0, error: '' });
}

// After clicking the confirmation email, Supabase sends you back with tokens in the URL.
export async function captureRedirect() {
  const h = location.hash || '';
  if (!configured() || !h.includes('access_token=')) return false;
  const p = new URLSearchParams(h.replace(/^#\/?/, ''));
  history.replaceState(null, '', location.pathname + location.search + '#/profile');
  try {
    session = { access_token: p.get('access_token'), refresh_token: p.get('refresh_token'), expires_at: Date.now() + Number(p.get('expires_in') || 3600) * 1000, user: null };
    const u = await api('/auth/v1/user');
    setSession({ ...session, user: { id: u.id, email: u.email } });
    await syncNow();
    return true;
  } catch (e) { setSession(null); return false; }
}

async function fresh() {
  if (!session) return false;
  if (Date.now() < session.expires_at - 60000) return true;
  try {
    const d = await api('/auth/v1/token?grant_type=refresh_token', { method: 'POST', body: { refresh_token: session.refresh_token }, auth: false });
    setSession(keep(d));
    return true;
  } catch (e) {
    if (e.status === 400 || e.status === 401) setSession(null);
    throw e;
  }
}

// Pull → merge → push. Safe to call often.
export function syncNow() {
  if (!configured() || !session) return Promise.resolve(false);
  if (!navigator.onLine) return Promise.resolve(false);
  if (syncing) return syncing;
  syncing = (async () => {
    try {
      await fresh();
      const uid = session.user.id;
      const rows = await api(`/rest/v1/progress?select=data,updated_at&user_id=eq.${uid}`);
      const remote = rows?.[0]?.data;
      const merged = remote ? merge(state, remote) : state;
      if (remote) replaceState(merged); else save({ quiet: true });
      await api('/rest/v1/progress', {
        method: 'POST',
        headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
        body: { user_id: uid, data: merged, updated_at: new Date().toISOString() },
      });
      setMeta({ at: Date.now(), error: '' });
      try { await pushProfile(); } catch (e) { console.warn('profile push failed', e); }
      return true;
    } catch (e) {
      console.warn('sync failed', e);
      setMeta({ error: e.message || String(e) });
      return false;
    } finally {
      syncing = null; emit();
    }
  })();
  emit();
  return syncing;
}

// ---------- Friends & weekly leaderboard
export const friendCode = () => meta.code || '';
async function pushProfile() {
  const uid = session.user.id;
  const rows = await api('/rest/v1/profiles?on_conflict=id&select=friend_code', {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
    body: { id: uid, ...publicProfile(), updated_at: new Date().toISOString() },
  });
  const code = rows?.[0]?.friend_code;
  if (code && code !== meta.code) setMeta({ code });
}
export async function loadFriends() {
  await fresh();
  const uid = session.user.id;
  const [profiles, follows] = await Promise.all([
    api('/rest/v1/profiles?select=id,name,avatar,xp_week,week,xp_total,streak,updated_at,friend_code'),
    api('/rest/v1/follows?select=follower,followee'),
  ]);
  const me = profiles.find(p => p.id === uid);
  if (me?.friend_code && me.friend_code !== meta.code) setMeta({ code: me.friend_code });
  return {
    uid, profiles,
    following: new Set(follows.filter(f => f.follower === uid).map(f => f.followee)),
    followers: new Set(follows.filter(f => f.followee === uid).map(f => f.follower)),
  };
}
export async function findFriend(code) {
  await fresh();
  const r = await api('/rest/v1/rpc/find_friend', { method: 'POST', body: { code } });
  return r?.[0] || null;
}
// Friends of friends (name and avatar only), most shared friends first.
export async function suggestFriends() {
  await fresh();
  return (await api('/rest/v1/rpc/suggest_friends', { method: 'POST', body: {} })) || [];
}
export async function follow(id) {
  await fresh();
  await api('/rest/v1/follows?on_conflict=follower,followee', { method: 'POST', headers: { Prefer: 'resolution=ignore-duplicates,return=minimal' }, body: { follower: session.user.id, followee: id } });
}
export async function unfollow(id) {
  await fresh();
  await api(`/rest/v1/follows?follower=eq.${session.user.id}&followee=eq.${id}`, { method: 'DELETE', headers: { Prefer: 'return=minimal' } });
}

// Speech recognition through the Supabase "transcribe" helper (signed-in users only).
export const canTranscribe = () => configured() && !!session && navigator.onLine;
export async function transcribe(wav, lang = 'si-LK') {
  if (!canTranscribe()) { const e = new Error('Sign in to have Katha check your speaking.'); e.code = 'signin'; throw e; }
  await fresh();
  const r = await fetch(SUPABASE_URL.replace(/\/$/, '') + `/functions/v1/transcribe?lang=${encodeURIComponent(lang)}`, {
    method: 'POST',
    headers: { apikey: SUPABASE_KEY, Authorization: 'Bearer ' + session.access_token, 'Content-Type': 'audio/wav' },
    body: wav,
  });
  let d = {};
  try { d = await r.json(); } catch {}
  if (!r.ok) { const e = new Error(d.error || `Speech check failed (${r.status})`); e.status = r.status; throw e; }
  return d;
}

let timer = null;
export function syncSoon(ms = 1500) { clearTimeout(timer); timer = setTimeout(syncNow, ms); }
