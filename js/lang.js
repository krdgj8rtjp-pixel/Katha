// Language helpers that depend on the current course: Sinhala or Tamil script (with a romanization line),
// the Latin alphabet (Spanish), or Cyrillic (Uzbek, shown with its official Latin spelling).
import { COURSE } from '../data/course.js';
import { romanize, foldSinhala, foldLatin, uzLatin, foldUz, taRoman, foldTamil } from './translit.js';

export const isSi = () => COURSE.script === 'sinhala';
export const isTa = () => COURSE.script === 'tamil';
export const isIndic = () => isSi() || isTa();                    // own script, romanized; typed answers in either
export const isUz = () => COURSE.id === 'uz';
export const hasRo = () => COURSE.script !== 'latin';              // show a Latin-letter line under the text
export const hasLetters = () => (COURSE.ALL_LETTERS || []).length > 0; // a letters trainer exists
export const L = () => COURSE.lang;                                // lang attribute for target-language text
export const ro = (s) => (isSi() ? romanize(s) : isTa() ? taRoman(s) : COURSE.script === 'cyrillic' ? uzLatin(s) : '');
export const foldT = (s) => (isSi() ? foldSinhala(s) : isTa() ? foldTamil(s) : isUz() ? foldUz(s) : foldLatin(s)); // compare target-language text
export const tkey = (t) => (isIndic() ? t : t.toLowerCase());          // token key for lookups
export const courseName = () => COURSE.name;
export const roLabel = () => (isIndic() ? 'romanization' : 'Latin spelling');
// Font for the course's own script, for small SVG labels (tab icon, medals).
export const scriptFont = () => (isSi() ? 'Noto Sans Sinhala, Sinhala Sangam MN, sans-serif' : isTa() ? 'Noto Sans Tamil, Tamil Sangam MN, sans-serif' : 'Nunito, sans-serif');
