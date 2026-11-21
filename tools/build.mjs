// Builds the deployable site into dist/: copies app files, writes audio/index.json
// and a service worker that precaches the app. Run: node tools/build.mjs
import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync, copyFileSync, rmSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { createHash } from 'node:crypto';

const ROOT = new URL('..', import.meta.url).pathname;
const DIST = join(ROOT, 'dist');
const INCLUDE = ['index.html', 'manifest.webmanifest', 'css', 'js', 'data', 'fonts', 'icons', 'audio'];

function walk(p, out = []) {
  const full = join(ROOT, p);
  if (!existsSync(full)) return out;
  if (statSync(full).isDirectory()) for (const f of readdirSync(full)) walk(join(p, f), out);
  else out.push(p);
  return out;
}

// audio/index.json lists the clips that exist
mkdirSync(join(ROOT, 'audio'), { recursive: true });
const clips = readdirSync(join(ROOT, 'audio')).filter(f => f.endsWith('.mp3')).map(f => f.replace(/\.mp3$/, '')).sort();
writeFileSync(join(ROOT, 'audio/index.json'), JSON.stringify(clips));

const files = INCLUDE.flatMap(p => walk(p));
const shell = files.filter(f => !f.startsWith('audio/') || f === 'audio/index.json');
const hash = createHash('sha256');
for (const f of shell.sort()) hash.update(f).update(readFileSync(join(ROOT, f)));
const version = hash.digest('hex').slice(0, 10);

const sw = readFileSync(join(ROOT, 'tools/sw-template.js'), 'utf8')
  .replace('__VERSION__', version)
  .replace('__PRECACHE__', JSON.stringify(['./', ...shell.filter(f => f !== 'audio/index.json')], null, 0));
writeFileSync(join(ROOT, 'sw.js'), sw);

rmSync(DIST, { recursive: true, force: true });
for (const f of [...files, 'sw.js']) {
  mkdirSync(dirname(join(DIST, f)), { recursive: true });
  copyFileSync(join(ROOT, f), join(DIST, f));
}
writeFileSync(join(DIST, '.nojekyll'), '');
console.log(`built dist/ — ${files.length} files, ${clips.length} audio clips, version ${version}`);
