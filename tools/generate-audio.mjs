// Generates every audio clip the app can play, for every course, using Azure
// neural voices (Sinhala: si-LK-*, Spanish: es-MX-*, es-US-*). Only missing clips
// are generated, so it's cheap to re-run after adding lessons.
//
//   AZURE_SPEECH_KEY=... AZURE_SPEECH_REGION=eastus node tools/generate-audio.mjs
//   node tools/generate-audio.mjs --list     (just count what's needed)
import { existsSync, mkdirSync, writeFileSync, readdirSync } from 'node:fs';
import { COURSES } from '../data/course.js';
import { ALL_LETTERS } from '../data/letters.js';
import { clipKey, siTokens } from '../js/util.js';

const OUT = new URL('../audio/', import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });

// ---- everything the app may ask for (keep in sync with js/session.js, exercises.js, story.js)
const want = new Map();
const add = (text, voice, slow = false) => { if (text?.trim()) want.set(clipKey(text, voice, slow), { text: text.trim(), voice, slow }); };
for (const { LEX, SENT, STORIES, SPEAKERS, DEFAULT_VOICE, script } of Object.values(COURSES)) {
  for (const x of Object.values(LEX)) { add(x.si, DEFAULT_VOICE); add(x.si, DEFAULT_VOICE, true); siTokens(x.si).forEach(t => add(t, DEFAULT_VOICE)); }
  for (const x of Object.values(SENT)) {
    const v = x.speaker ? SPEAKERS[x.speaker].voice : DEFAULT_VOICE;
    add(x.si, v); add(x.si, v, true);
    siTokens(x.si).forEach(t => add(t, DEFAULT_VOICE));
  }
  for (const st of Object.values(STORIES)) for (const l of st.lines) {
    if (l.q) continue;
    add(l.si, SPEAKERS[l.sp].voice);
    siTokens(l.si).forEach(t => add(t, DEFAULT_VOICE));
  }
  if (script === 'sinhala') for (const l of ALL_LETTERS) add(l.ch, DEFAULT_VOICE);
}

const missing = [...want.entries()].filter(([k]) => !existsSync(OUT + k + '.mp3'));
console.log(`${want.size} clips in the course, ${missing.length} to generate`);
if (process.argv.includes('--list')) process.exit(0);

const KEY = process.env.AZURE_SPEECH_KEY, REGION = process.env.AZURE_SPEECH_REGION || 'eastus';
const DELAY = Number(process.env.AZURE_TTS_DELAY_MS || 400);
if (missing.length && !KEY) { console.error('Set AZURE_SPEECH_KEY (and AZURE_SPEECH_REGION) to generate audio.'); process.exit(1); }

const xml = (s) => s.replace(/[<>&'"]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c]));
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function tts({ text, voice, slow }) {
  const locale = voice.split('-').slice(0, 2).join('-');
  const ssml = `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="${locale}"><voice name="${voice}">` +
    (slow ? `<prosody rate="-35%">${xml(text)}</prosody>` : xml(text)) + `</voice></speak>`;
  for (let attempt = 0; attempt < 6; attempt++) {
    const r = await fetch(`https://${REGION}.tts.speech.microsoft.com/cognitiveservices/v1`, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': KEY,
        'Content-Type': 'application/ssml+xml',
        'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3',
        'User-Agent': 'katha-audio-builder',
      },
      body: ssml,
    });
    if (r.ok) return Buffer.from(await r.arrayBuffer());
    if (r.status === 429 || r.status >= 500) {
      const wait = Number(r.headers.get('retry-after') || 0) * 1000 || 2000 * 2 ** attempt;
      console.log(`  ${r.status} — waiting ${Math.round(wait / 1000)}s`);
      await sleep(wait); continue;
    }
    throw new Error(`Azure TTS ${r.status}: ${await r.text()}`);
  }
  throw new Error('Azure TTS kept failing');
}

let n = 0;
for (const [k, clip] of missing) {
  const buf = await tts(clip);
  writeFileSync(OUT + k + '.mp3', buf);
  n++;
  if (n % 25 === 0 || n === missing.length) console.log(`  ${n}/${missing.length}`);
  await sleep(DELAY);
}
const all = readdirSync(OUT).filter(f => f.endsWith('.mp3')).map(f => f.slice(0, -4)).sort();
writeFileSync(OUT + 'index.json', JSON.stringify(all));
console.log(`done — ${all.length} clips available`);
