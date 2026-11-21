// Language helpers that depend on the current course (Sinhala script vs Latin alphabet).
import { COURSE } from '../data/course.js';
import { romanize, foldSinhala, foldLatin } from './translit.js';

export const isSi = () => COURSE.script === 'sinhala';
export const L = () => COURSE.lang;                       // lang attribute for target-language text
export const ro = (s) => (isSi() ? romanize(s) : '');     // romanization (Sinhala only)
export const foldT = (s) => (isSi() ? foldSinhala(s) : foldLatin(s)); // compare target-language text
export const tkey = (t) => (isSi() ? t : t.toLowerCase()); // token key for lookups
export const courseName = () => COURSE.name;
