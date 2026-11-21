// Uzbek Cyrillic letters trainer: all 35 letters, starting with the ones English speakers already know.
// `ch` is the lowercase letter (the key used for progress), `up` the capital, `ro` the official Latin spelling,
// and `say` what the voice reads aloud (the Uzbek name of the letter, in Latin, which the Azure voices need).
export const LETTER_GROUPS = [
  {
    id: 'cy1', title: 'Familiar friends', letters: [
      { ch: 'а', up: 'А', ro: 'a', say: 'a', hint: 'a as in "father". Looks just like English a.' },
      { ch: 'к', up: 'К', ro: 'k', say: 'ka', hint: 'k as in "kite".' },
      { ch: 'м', up: 'М', ro: 'm', say: 'em', hint: 'm as in "mother".' },
      { ch: 'о', up: 'О', ro: 'o', say: 'o', hint: 'o as in British "hot": somewhere between o and a.' },
      { ch: 'т', up: 'Т', ro: 't', say: 'te', hint: 't as in "tea". The small letter is shaped like a little T.' },
    ],
  },
  {
    id: 'cy2', title: 'False friends', letters: [
      { ch: 'в', up: 'В', ro: 'v', say: 've', hint: 'Looks like B, but sounds like v.' },
      { ch: 'н', up: 'Н', ro: 'n', say: 'en', hint: 'Looks like H, but sounds like n.' },
      { ch: 'р', up: 'Р', ro: 'r', say: 'er', hint: 'Looks like P, but sounds like a lightly rolled r.' },
      { ch: 'с', up: 'С', ro: 's', say: 'es', hint: 'Looks like C, sounds like s as in "sun".' },
      { ch: 'у', up: 'У', ro: 'u', say: 'u', hint: 'Looks like y, but sounds like u in "put".' },
      { ch: 'х', up: 'Х', ro: 'x', say: 'xa', hint: 'Looks like x, but sounds like ch in Scottish "loch" — a rough h.' },
      { ch: 'е', up: 'Е', ro: 'e', say: 'ye', hint: 'e as in "bed", but ye at the start of a word: етти = yetti (seven).' },
    ],
  },
  {
    id: 'cy3', title: 'New shapes', letters: [
      { ch: 'б', up: 'Б', ro: 'b', say: 'be', hint: 'b as in "bed".' },
      { ch: 'г', up: 'Г', ro: 'g', say: 'ge', hint: 'g as in "go". Like an upside-down L.' },
      { ch: 'д', up: 'Д', ro: 'd', say: 'de', hint: 'd as in "day".' },
      { ch: 'з', up: 'З', ro: 'z', say: 'ze', hint: 'z as in "zoo". Looks like the number 3.' },
      { ch: 'и', up: 'И', ro: 'i', say: 'i', hint: 'i as in "machine". Looks like a backwards N.' },
      { ch: 'л', up: 'Л', ro: 'l', say: 'el', hint: 'l as in "lamp".' },
      { ch: 'п', up: 'П', ro: 'p', say: 'pe', hint: 'p as in "pen". Shaped like the π sign.' },
    ],
  },
  {
    id: 'cy4', title: 'More new shapes', letters: [
      { ch: 'ж', up: 'Ж', ro: 'j', say: 'je', hint: 'j as in "jam".' },
      { ch: 'й', up: 'Й', ro: 'y', say: 'y', hint: 'y as in "boy". An и with a little cap.' },
      { ch: 'ф', up: 'Ф', ro: 'f', say: 'ef', hint: 'f as in "fun".' },
      { ch: 'ч', up: 'Ч', ro: 'ch', say: 'che', hint: 'ch as in "chair". Looks like the number 4.' },
      { ch: 'ш', up: 'Ш', ro: 'sh', say: 'she', hint: 'sh as in "shop". Three teeth, like a comb.' },
      { ch: 'ц', up: 'Ц', ro: 'ts', say: 'tse', hint: 'ts as in "cats". Only in words borrowed from Russian.' },
      { ch: 'э', up: 'Э', ro: 'e', say: 'e', hint: 'e as in "egg", used at the start of a word: эллик (fifty).' },
    ],
  },
  {
    id: 'cy5', title: 'Uzbek letters', letters: [
      { ch: 'ў', up: 'Ў', ro: 'oʻ', say: 'oʻ', hint: 'oʻ — like the o in "go", but short. Written oʻ in Latin letters.' },
      { ch: 'қ', up: 'Қ', ro: 'q', say: 'qa', hint: 'q — a k made far back in the throat.' },
      { ch: 'ғ', up: 'Ғ', ro: 'gʻ', say: 'gʻa', hint: 'gʻ — a gargled g, like the French r.' },
      { ch: 'ҳ', up: 'Ҳ', ro: 'h', say: 'ha', hint: 'h as in "hat", softer than х.' },
    ],
  },
  {
    id: 'cy6', title: 'Y-vowels and signs', letters: [
      { ch: 'ё', up: 'Ё', ro: 'yo', say: 'yo', hint: 'yo as in "yonder".' },
      { ch: 'ю', up: 'Ю', ro: 'yu', say: 'yu', hint: 'yu as in "you".' },
      { ch: 'я', up: 'Я', ro: 'ya', say: 'ya', hint: 'ya as in "yard". Looks like a backwards R.' },
      { ch: 'ъ', up: 'Ъ', ro: 'ʼ (pause)', say: 'tutuq belgisi', hint: 'A tiny pause or catch in the voice: маъно (maʼno, "meaning").' },
      { ch: 'ь', up: 'Ь', ro: 'soft sign', say: 'yumshatish belgisi', hint: 'Makes no sound of its own. Only in words borrowed from Russian.' },
    ],
  },
];

export const ALL_LETTERS = LETTER_GROUPS.flatMap(g => g.letters.map(l => ({ ...l, group: g.id })));
