// Katha courses. Each course module exports SPEAKERS, DEFAULT_VOICE, LEX, SENT, STORIES, UNITS, COMING
// (and, for a course with its own script, LETTER_GROUPS / ALL_LETTERS for the letters trainer).
// The rest of the app imports from here; useCourse() swaps the live bindings to the chosen course.
import * as si from './si.js';
import * as es from './es.js';
import * as uz from './uz.js';
import * as ta from './ta.js';
import * as siLetters from './letters.js';
import * as uzLetters from './uz-letters.js';
import * as taLetters from './ta-letters.js';
import { uzLatin } from '../js/translit.js';

export const COURSES = {
  si: {
    ...si, ...siLetters, id: 'si', name: 'Sinhala', native: 'සිංහල', lang: 'si', speechLang: 'si-LK', script: 'sinhala',
    mark: 'ක', currency: 'රු', color: '#8D153A', cast: { grandpa: 'abuelo', grandma: 'abuela' },
    tagline: 'everyday spoken Sinhala — the way people really talk in Sri Lanka',
    lettersTitle: 'Sinhala letters', letterIcon: 'අ', praise: ['නියමයි! (Great!)', 'හරි! (Right!)'],
    lettersBlurb: 'Learn to read the script — signs, menus and bus boards will start to make sense.',
  },
  es: {
    ...es, id: 'es', name: 'Spanish', native: 'Español', lang: 'es', speechLang: 'es-MX', script: 'latin',
    mark: 'Ñ', currency: '$', color: '#C0392B', cast: { kumari: 'sofia', nimal: 'mateo', amma: 'madre', thaththa: 'padre', putha: 'hijo', duva: 'hija', grandpa: 'abuelo', grandma: 'abuela' },
    praise: ['¡Muy bien! (Very good!)', '¡Excelente! (Excellent!)', '¡Eso es! (That\'s it!)'],
    tagline: 'everyday Latin American Spanish, the way people talk at home, at church and at the market',
  },
  uz: {
    ...uz, ...uzLetters, id: 'uz', name: 'Uzbek', native: 'Ўзбекча', lang: 'uz-Cyrl', speechLang: 'uz-UZ', script: 'cyrillic',
    mark: 'Ў', currency: 'сўм', color: '#0E8FB0', cast: { kumari: 'dilnoza', nimal: 'aziz', amma: 'ona', thaththa: 'ota', putha: 'ogil', duva: 'qiz', grandpa: 'bobo', grandma: 'buvi' },
    tagline: 'everyday spoken Uzbek, written in Cyrillic — the way people talk at home, over tea and at the bazaar',
    lettersTitle: 'Cyrillic letters', letterIcon: 'Ж', praise: ['Баракалла! (Well done!)', 'Зўр! (Great!)', 'Тўғри! (Right!)'],
    lettersBlurb: 'Learn to read Uzbek Cyrillic. Many letters look familiar — and some only pretend to.',
    // Azure's Uzbek voices read the Latin alphabet, so clips are generated from the Latin spelling
    // (and single letters from their spoken names). Clips are still keyed by the Cyrillic text.
    say: (text) => uzLetters.ALL_LETTERS.find(l => l.ch === text)?.say || uzLatin(text),
  },
  ta: {
    ...ta, ...taLetters, id: 'ta', name: 'Tamil', native: 'தமிழ்', lang: 'ta', speechLang: 'ta-IN', script: 'tamil',
    mark: 'த', currency: 'ரூ', color: '#C0501A', cast: { kumari: 'kavitha', nimal: 'ravi', achchi: 'ammamma', grandpa: 'abuelo', grandma: 'ammamma' },
    tagline: 'everyday spoken Sri Lankan Tamil — the way people talk in Jaffna, at church and at the market',
    lettersTitle: 'Tamil letters', letterIcon: 'அ', praise: ['நல்லம்! (Great!)', 'சரி! (Right!)', 'அருமை! (Excellent!)'],
    lettersBlurb: 'Learn to read Tamil script — signs, menus and bus boards will start to make sense.',
    // Azure's Sri Lankan Tamil voices read the script directly; a few single letters are read by their names.
    // (Speaking is graded with Azure's Tamil recognizer, ta-IN: there is no Sri Lankan one.)
    say: (text) => taLetters.ALL_LETTERS.find(l => l.ch === text)?.say || text,
  },
};
export const COURSE_IDS = Object.keys(COURSES);

export let COURSE, LEX, SENT, STORIES, UNITS, COMING, SPEAKERS, DEFAULT_VOICE, LETTER_GROUPS, ALL_LETTERS;
const listeners = new Set();
export function onCourseChange(fn) { listeners.add(fn); }
export function useCourse(id) {
  const c = COURSES[id] || COURSES.si;
  if (c === COURSE) return c;
  COURSE = c;
  ({ LEX, SENT, STORIES, UNITS, COMING, SPEAKERS, DEFAULT_VOICE } = c);
  LETTER_GROUPS = c.LETTER_GROUPS || [];
  ALL_LETTERS = c.ALL_LETTERS || [];
  listeners.forEach(fn => fn(c));
  return c;
}
useCourse('si');
