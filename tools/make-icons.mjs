// Generates PNG app icons from the mascot SVG. Needs `rsvg-convert` (librsvg).
import { writeFileSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { mascot } from '../js/ui.js';

const inner = mascot('happy', 120).replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
const icon = (pad) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#8D153A"/>
  <circle cx="256" cy="262" r="${pad ? 190 : 220}" fill="#A8264E"/>
  <g transform="translate(${256 - 60 * (pad ? 2.55 : 3.1)},${262 - 62 * (pad ? 2.55 : 3.1)}) scale(${pad ? 2.55 : 3.1})">${inner}</g>
</svg>`;
mkdirSync('icons', { recursive: true });
writeFileSync('icons/icon.svg', icon(false));
writeFileSync('icons/icon-maskable.svg', icon(true));
const out = [['icon.svg', 'icon-192.png', 192], ['icon.svg', 'icon-512.png', 512], ['icon-maskable.svg', 'icon-maskable-512.png', 512], ['icon.svg', 'apple-touch-icon.png', 180], ['icon.svg', 'favicon-32.png', 32]];
for (const [src, dst, size] of out) execFileSync('rsvg-convert', ['-w', String(size), '-h', String(size), '-o', 'icons/' + dst, 'icons/' + src]);
console.log('icons written');
