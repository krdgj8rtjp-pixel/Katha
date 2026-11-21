// Bundles the whole app into one self-contained HTML file (for quick previews).
import { build } from 'esbuild';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const root = new URL('..', import.meta.url).pathname;
const js = await build({ entryPoints: [root + 'js/app.js'], bundle: true, format: 'esm', minify: true, write: false, target: 'es2020' });
let css = readFileSync(root + 'css/app.css', 'utf8').replace(/url\(\.\.\/fonts\/([^)]+)\)/g, (_, f) =>
  `url(data:font/woff2;base64,${readFileSync(root + 'fonts/' + f).toString('base64')})`);
const icon = readFileSync(root + 'icons/favicon-32.png').toString('base64');
const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Katha — Learn Spoken Sinhala (preview)</title>
<link rel="icon" href="data:image/png;base64,${icon}">
<style>${css}</style>
<script>window.KATHA_PREVIEW = true; window.KATHA_VERSION = '0.1.0-preview';</script>
</head><body><div id="app"></div><div id="toasts" aria-live="polite"></div>
<script type="module">${js.outputFiles[0].text.replace(/<\/script/g, '<\\/script')}</script>
</body></html>`;
mkdirSync(root + 'dist-preview', { recursive: true });
writeFileSync(root + 'dist-preview/index.html', html);
console.log(`dist-preview/index.html — ${(html.length / 1024).toFixed(0)} KB`);
