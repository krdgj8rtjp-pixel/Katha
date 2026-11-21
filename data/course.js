// Katha courses. Each course module exports SPEAKERS, DEFAULT_VOICE, LEX, SENT, STORIES, UNITS, COMING.
// The rest of the app imports from here; useCourse() swaps the live bindings to the chosen course.
import * as si from './si.js';
import * as es from './es.js';

export const COURSES = {
  si: {
    ...si, id: 'si', name: 'Sinhala', native: 'සිංහල', lang: 'si', speechLang: 'si-LK', script: 'sinhala',
    mark: 'ක', currency: 'රු', color: '#8D153A', cast: {},
    tagline: 'everyday spoken Sinhala — the way people really talk in Sri Lanka',
  },
  es: {
    ...es, id: 'es', name: 'Spanish', native: 'Español', lang: 'es', speechLang: 'es-MX', script: 'latin',
    mark: 'Ñ', currency: '$', color: '#C0392B', cast: { kumari: 'sofia', nimal: 'mateo' },
    tagline: 'everyday Latin American Spanish, the way people talk at home, at church and at the market',
  },
};
export const COURSE_IDS = Object.keys(COURSES);

export let COURSE, LEX, SENT, STORIES, UNITS, COMING, SPEAKERS, DEFAULT_VOICE;
const listeners = new Set();
export function onCourseChange(fn) { listeners.add(fn); }
export function useCourse(id) {
  const c = COURSES[id] || COURSES.si;
  if (c === COURSE) return c;
  COURSE = c;
  ({ LEX, SENT, STORIES, UNITS, COMING, SPEAKERS, DEFAULT_VOICE } = c);
  listeners.forEach(fn => fn(c));
  return c;
}
useCourse('si');
