// Language helpers that depend on the current course: Sinhala script, the Latin alphabet (Spanish),
// or Cyrillic (Uzbek, shown with its official Latin spelling).
import { COURSE } from '../data/course.js';
import { romanize, foldSinhala, foldLatin, uzLatin, foldUz } from './translit.js';

export const isSi = () => COURSE.script === 'sinhala';
export const isUz = () => COURSE.id === 'uz';
export const hasRo = () => COURSE.script !== 'latin';              // show a Latin-letter line under the text
export const hasLetters = () => (COURSE.ALL_LETTERS || []).length > 0; // a letters trainer exists
export const L = () => COURSE.lang;                                // lang attribute for target-language text
export const ro = (s) => (isSi() ? romanize(s) : COURSE.script === 'cyrillic' ? uzLatin(s) : '');
export const foldT = (s) => (isSi() ? foldSinhala(s) : isUz() ? foldUz(s) : foldLatin(s)); // compare target-language text
export const tkey = (t) => (isSi() ? t : t.toLowerCase());          // token key for lookups
export const courseName = () => COURSE.name;
export const roLabel = () => (isSi() ? 'romanization' : 'Latin spelling');
