// Sinhala script trainer. Groups are taught in order; romanization matches js/translit.js.
export const LETTER_GROUPS = [
  {
    id: 'v1', title: 'Vowels 1', letters: [
      { ch: 'අ', ro: 'a', hint: 'a as in "about"' },
      { ch: 'ආ', ro: 'ā', hint: 'a as in "father"' },
      { ch: 'ඉ', ro: 'i', hint: 'i as in "sit"' },
      { ch: 'ඊ', ro: 'ī', hint: 'ee as in "see"' },
      { ch: 'උ', ro: 'u', hint: 'u as in "put"' },
      { ch: 'ඌ', ro: 'ū', hint: 'oo as in "food"' },
    ],
  },
  {
    id: 'v2', title: 'Vowels 2', letters: [
      { ch: 'එ', ro: 'e', hint: 'e as in "bed"' },
      { ch: 'ඒ', ro: 'ē', hint: 'e as in "bed", held longer' },
      { ch: 'ඔ', ro: 'o', hint: 'o as in "obey"' },
      { ch: 'ඕ', ro: 'ō', hint: 'o as in "go", held' },
      { ch: 'ඇ', ro: 'æ', hint: 'a as in "cat"' },
      { ch: 'ඈ', ro: 'ǣ', hint: 'a as in "bad", held longer' },
    ],
  },
  {
    id: 'c1', title: 'Consonants 1', letters: [
      { ch: 'ක', ro: 'ka', hint: 'k (every consonant has a built-in "a")' },
      { ch: 'ග', ro: 'ga', hint: 'g as in "go"' },
      { ch: 'ත', ro: 'ta', hint: 'soft t — tongue touches the teeth' },
      { ch: 'ද', ro: 'da', hint: 'soft d — tongue touches the teeth' },
      { ch: 'ට', ro: 'ṭa', hint: 'tongue curled back — like English t' },
      { ch: 'ඩ', ro: 'ḍa', hint: 'tongue curled back — like English d' },
    ],
  },
  {
    id: 'c2', title: 'Consonants 2', letters: [
      { ch: 'ප', ro: 'pa', hint: 'p' },
      { ch: 'බ', ro: 'ba', hint: 'b' },
      { ch: 'ම', ro: 'ma', hint: 'm' },
      { ch: 'න', ro: 'na', hint: 'n' },
      { ch: 'ස', ro: 'sa', hint: 's' },
      { ch: 'හ', ro: 'ha', hint: 'h' },
    ],
  },
  {
    id: 'c3', title: 'Consonants 3', letters: [
      { ch: 'ය', ro: 'ya', hint: 'y' },
      { ch: 'ර', ro: 'ra', hint: 'a light, tapped r' },
      { ch: 'ල', ro: 'la', hint: 'l' },
      { ch: 'ව', ro: 'va', hint: 'between English v and w' },
      { ch: 'ච', ro: 'ca', hint: 'ch as in "church"' },
      { ch: 'ජ', ro: 'ja', hint: 'j as in "jam"' },
    ],
  },
  {
    id: 'c4', title: 'Consonants 4', letters: [
      { ch: 'ණ', ro: 'ṇa', hint: 'sounds the same as න in everyday speech' },
      { ch: 'ළ', ro: 'ḷa', hint: 'sounds the same as ල in everyday speech' },
      { ch: 'ඳ', ro: 'nda', hint: 'a quick n slides into d' },
      { ch: 'ඬ', ro: 'nḍa', hint: 'a quick n slides into ḍ' },
      { ch: 'ඟ', ro: 'nga', hint: 'a quick n slides into g' },
      { ch: 'ඹ', ro: 'mba', hint: 'a quick m slides into b' },
    ],
  },
  {
    id: 's1', title: 'Vowel signs 1', letters: [
      { ch: 'කා', ro: 'kā', hint: 'ා adds a long ā' },
      { ch: 'කි', ro: 'ki', hint: 'ි adds i' },
      { ch: 'කී', ro: 'kī', hint: 'ී adds a long ī' },
      { ch: 'කු', ro: 'ku', hint: 'ු adds u' },
      { ch: 'කූ', ro: 'kū', hint: 'ූ adds a long ū' },
      { ch: 'ක්', ro: 'k', hint: '් (hal kirīma) removes the vowel' },
    ],
  },
  {
    id: 's2', title: 'Vowel signs 2', letters: [
      { ch: 'කෙ', ro: 'ke', hint: 'ෙ in front adds e' },
      { ch: 'කේ', ro: 'kē', hint: 'ෙ + ් adds a long ē' },
      { ch: 'කො', ro: 'ko', hint: 'ෙ … ා around the letter adds o' },
      { ch: 'කෝ', ro: 'kō', hint: 'ෙ … ා + ් adds a long ō' },
      { ch: 'කැ', ro: 'kæ', hint: 'ැ adds æ (as in "cat")' },
      { ch: 'කෑ', ro: 'kǣ', hint: 'ෑ adds a long ǣ' },
      { ch: 'කං', ro: 'kaṅ', hint: 'ං adds an "ng" sound' },
    ],
  },
  {
    id: 'r1', title: 'Less common', letters: [
      { ch: 'ශ', ro: 'śa', hint: 'sh' },
      { ch: 'ෂ', ro: 'ṣa', hint: 'sh (same sound as ශ)' },
      { ch: 'ඤ', ro: 'ña', hint: 'ny as in "canyon"' },
      { ch: 'ෆ', ro: 'fa', hint: 'f (used in borrowed words)' },
      { ch: 'භ', ro: 'bha', hint: 'b (written in Sanskrit-origin words)' },
      { ch: 'ධ', ro: 'dha', hint: 'd (written in Sanskrit-origin words)' },
    ],
  },
];

export const ALL_LETTERS = LETTER_GROUPS.flatMap(g => g.letters.map(l => ({ ...l, group: g.id })));
