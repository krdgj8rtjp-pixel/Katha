// Tamil script trainer. Groups are taught in order; `ro` matches taRoman() in js/translit.js for the letter
// on its own (at the start of a word). `say` is what the voice reads when the letter alone would be unclear.
export const LETTER_GROUPS = [
  {
    id: 'tv1', title: 'Vowels 1', letters: [
      { ch: 'அ', ro: 'a', hint: 'a as in "about"' },
      { ch: 'ஆ', ro: 'ā', hint: 'a as in "father"' },
      { ch: 'இ', ro: 'i', hint: 'i as in "sit"' },
      { ch: 'ஈ', ro: 'ī', hint: 'ee as in "see"' },
      { ch: 'உ', ro: 'u', hint: 'u as in "put"' },
      { ch: 'ஊ', ro: 'ū', hint: 'oo as in "food"' },
    ],
  },
  {
    id: 'tv2', title: 'Vowels 2', letters: [
      { ch: 'எ', ro: 'e', hint: 'e as in "bed"' },
      { ch: 'ஏ', ro: 'ē', hint: 'e as in "bed", held longer' },
      { ch: 'ஐ', ro: 'ai', hint: 'ai as in "aisle"' },
      { ch: 'ஒ', ro: 'o', hint: 'o as in "obey"' },
      { ch: 'ஓ', ro: 'ō', hint: 'o as in "go", held' },
      { ch: 'ஔ', ro: 'au', hint: 'ow as in "cow" (rare)' },
    ],
  },
  {
    id: 'tc1', title: 'Hard letters', letters: [
      { ch: 'க', ro: 'ka', hint: 'k at the start of a word; softens to g between vowels' },
      { ch: 'ச', ro: 'sa', hint: 's at the start; ch when doubled (ச்ச), j after ஞ்' },
      { ch: 'ட', ro: 'ṭa', hint: 'tongue curled back: ṭ, softening to ḍ between vowels' },
      { ch: 'த', ro: 'ta', hint: 'soft t with the tongue on the teeth; dh between vowels' },
      { ch: 'ப', ro: 'pa', hint: 'p at the start; b between vowels' },
      { ch: 'ற', ro: 'ṟa', hint: 'a strong, rolled r. Doubled (ற்ற) it sounds like "tr"' },
    ],
  },
  {
    id: 'tc2', title: 'Soft letters', letters: [
      { ch: 'ம', ro: 'ma', hint: 'm' },
      { ch: 'ந', ro: 'na', hint: 'n, mostly at the start of a word' },
      { ch: 'ன', ro: 'na', hint: 'n, in the middle and at the end of words' },
      { ch: 'ண', ro: 'ṇa', hint: 'n with the tongue curled back' },
      { ch: 'ங', ro: 'ṅa', hint: 'ng as in "sing" (almost always before க)' },
      { ch: 'ஞ', ro: 'ña', hint: 'ny as in "canyon" (often before ச)' },
    ],
  },
  {
    id: 'tc3', title: 'Medium letters', letters: [
      { ch: 'ய', ro: 'ya', hint: 'y' },
      { ch: 'ர', ro: 'ra', hint: 'a light, tapped r' },
      { ch: 'ல', ro: 'la', hint: 'l' },
      { ch: 'வ', ro: 'va', hint: 'between English v and w' },
      { ch: 'ள', ro: 'ḷa', hint: 'l with the tongue curled back' },
      { ch: 'ழ', ro: 'zha', hint: 'the famous Tamil zh: curl the tongue back, between r and l' },
    ],
  },
  {
    id: 'ts1', title: 'Vowel signs 1', letters: [
      { ch: 'கா', ro: 'kā', hint: 'ா after the letter adds a long ā' },
      { ch: 'கி', ro: 'ki', hint: 'ி adds i' },
      { ch: 'கீ', ro: 'kī', hint: 'ீ adds a long ī' },
      { ch: 'கு', ro: 'ku', hint: 'u: the shape changes with each letter (கு, டு, ரு…)' },
      { ch: 'கூ', ro: 'kū', hint: 'long ū: also changes shape (கூ, டூ, ரூ…)' },
      { ch: 'க்', ro: 'k', say: 'இக்', hint: 'the dot (புள்ளி, pulli) removes the vowel' },
    ],
  },
  {
    id: 'ts2', title: 'Vowel signs 2', letters: [
      { ch: 'கெ', ro: 'ke', hint: 'ெ in front adds e' },
      { ch: 'கே', ro: 'kē', hint: 'ே in front adds a long ē' },
      { ch: 'கை', ro: 'kai', hint: 'ை in front adds ai' },
      { ch: 'கொ', ro: 'ko', hint: 'ெ … ா around the letter adds o' },
      { ch: 'கோ', ro: 'kō', hint: 'ே … ா around the letter adds a long ō' },
      { ch: 'கௌ', ro: 'kau', hint: 'ெ … ள around the letter adds au (rare)' },
    ],
  },
  {
    id: 'tr1', title: 'Borrowed letters', letters: [
      { ch: 'ஜ', ro: 'ja', hint: 'j, in borrowed words: ஜெபம் (prayer)' },
      { ch: 'ஸ', ro: 'sa', hint: 's, in borrowed words: ஸ்தோத்திரம்' },
      { ch: 'ஷ', ro: 'sha', hint: 'sh, in borrowed words' },
      { ch: 'ஹ', ro: 'ha', hint: 'h, in borrowed words' },
      { ch: 'ஸ்ரீ', ro: 'srī', hint: 'srī, as in ஸ்ரீ லங்கா (Sri Lanka)' },
    ],
  },
];

export const ALL_LETTERS = LETTER_GROUPS.flatMap(g => g.letters.map(l => ({ ...l, group: g.id })));
