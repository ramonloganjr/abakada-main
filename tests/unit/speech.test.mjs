import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import {
  normalizeForSpeech,
  chunkForSpeech,
  scoreVoice,
  pickVoice,
  speechSettings,
  speechLangFor,
  SPEECH_LANG,
} from '../../src/lib/speech.js'

const voice = (name, lang, extra = {}) => ({ name, lang, localService: true, default: false, ...extra })

// ─── Pronunciation ───────────────────────────────────────────────────────────

test('acronyms that engines mispronounce are spelled out', () => {
  assert.match(normalizeForSpeech('Export one document to PDF'), /P D F/)
  assert.match(normalizeForSpeech('Run a SQL query'), /S Q L/)
  assert.match(normalizeForSpeech('Optimize an SVG'), /S V G/)
  assert.match(normalizeForSpeech('Install VS Code'), /V S Code/)
  assert.match(normalizeForSpeech('Open the CSV'), /C S V/)
})

test('a plural acronym keeps its "s"', () => {
  assert.match(normalizeForSpeech('Merge two PDFs'), /P D Fs/)
  assert.doesNotMatch(normalizeForSpeech('Merge two PDFs'), /P D F S\b/)
})

test('acronyms that already read correctly are left alone', () => {
  // GIMP and LaTeX are pronounced as words; spacing them would break them.
  assert.match(normalizeForSpeech('Edit a photo in GIMP'), /\bGIMP\b/)
  assert.match(normalizeForSpeech('Write a paper in LaTeX'), /\bLaTeX\b/)
})

test('hyphenated compounds survive untouched', () => {
  // The most common construction in the corpus (69 lines) and every engine
  // already handles it — stripping the hyphen would make delivery worse.
  assert.match(normalizeForSpeech('Choose a privacy-respecting browser'), /privacy-respecting/)
  assert.match(normalizeForSpeech('Send an end-to-end encrypted message'), /end-to-end/)
})

test('names with a settled spoken form are respelled, not letter-spaced', () => {
  assert.match(normalizeForSpeech('Build a budget in Firefly III'), /Firefly Three/)
  assert.match(normalizeForSpeech('Run a regression in R-Project'), /R Project/)
  assert.match(normalizeForSpeech('Try one H5P interaction'), /H 5 P/)
  assert.match(normalizeForSpeech('Send one E2EE email'), /E 2 E E/)
  assert.match(normalizeForSpeech('Export a CMYK PDF/X-1a from Scribus'), /P D F X 1 A/)
})

test('symbols that engines read aloud by name or swallow are replaced', () => {
  assert.match(normalizeForSpeech('Produce a P&L statement'), /P and L/)
  assert.doesNotMatch(normalizeForSpeech('Produce a P&L statement'), /&/)
  assert.equal(
    normalizeForSpeech('Three columns: To Do · Doing · Done'),
    'Three columns: To Do, Doing, Done.',
  )
})

test('domains are spoken rather than run together', () => {
  assert.match(normalizeForSpeech('Build a flowchart in draw.io'), /draw dot I O/)
})

test('a slash between words becomes a spoken "or"', () => {
  assert.match(normalizeForSpeech('Pick slides and/or handouts'), /and or handouts/)
})

test('parentheses become a comma-set aside', () => {
  const out = normalizeForSpeech('Use citation styles (APA, MLA, Chicago) without formatting')
  assert.doesNotMatch(out, /[()]/)
  assert.match(out, /styles, A P A/)
})

test('every line ends on a full stop so the voice falls in pitch', () => {
  assert.equal(normalizeForSpeech('Set VLC as your default'), 'Set V L C as your default.')
  assert.equal(normalizeForSpeech('Ready?'), 'Ready?')
  assert.equal(normalizeForSpeech('Go!'), 'Go!')
})

test('normalizeForSpeech degrades safely on empty input', () => {
  for (const empty of ['', '   ', null, undefined]) assert.equal(normalizeForSpeech(empty), '')
})

// ─── Phrasing ────────────────────────────────────────────────────────────────

test('chunkForSpeech splits on sentences and keeps terminators', () => {
  const chunks = chunkForSpeech('Install Firefox. Import your bookmarks. Done!')
  assert.deepEqual(chunks, ['Install Firefox.', 'Import your bookmarks.', 'Done!'])
})

test('chunkForSpeech keeps a short line as one utterance', () => {
  assert.deepEqual(chunkForSpeech('Set VLC as your default media player'), [
    'Set V L C as your default media player.',
  ])
})

test('chunkForSpeech breaks a long sentence at clause boundaries', () => {
  const long = `Start here, ${'then continue steadily, '.repeat(12)}and finish.`
  const chunks = chunkForSpeech(long)
  assert.ok(chunks.length > 1, 'expected the long sentence to be split')
  for (const c of chunks) assert.ok(c.length <= 180, `chunk too long: ${c.length}`)
  // Nothing may be dropped in the split.
  assert.match(chunks.join(' '), /^Start here,/)
  assert.match(chunks.join(' '), /and finish\.$/)
})

test('chunkForSpeech returns nothing for empty input', () => {
  assert.deepEqual(chunkForSpeech(''), [])
  assert.deepEqual(chunkForSpeech(null), [])
})

// ─── Voice selection ─────────────────────────────────────────────────────────

test('a neural voice outranks the legacy default in the same language', () => {
  const voices = [
    voice('Microsoft David - English (United States)', 'en-US', { default: true }),
    voice('Microsoft Aria Online (Natural) - English (United States)', 'en-US', { localService: false }),
  ]
  assert.equal(pickVoice(voices, 'en-US').name, 'Microsoft Aria Online (Natural) - English (United States)')
})

test('Apple enhanced and premium voices outrank the plain one', () => {
  const voices = [voice('Samantha', 'en-US', { default: true }), voice('Samantha (Enhanced)', 'en-US')]
  assert.equal(pickVoice(voices, 'en-US').name, 'Samantha (Enhanced)')
})

test('novelty and eSpeak voices lose to anything usable', () => {
  const voices = [voice('Zarvox', 'en-US', { default: true }), voice('Alex', 'en-US')]
  assert.equal(pickVoice(voices, 'en-US').name, 'Alex')

  const linux = [voice('espeak-ng', 'en-US', { default: true }), voice('Google US English', 'en-US', { localService: false })]
  assert.equal(pickVoice(linux, 'en-US').name, 'Google US English')
})

test('an exact locale match beats a same-language one', () => {
  const voices = [voice('Daniel', 'en-GB'), voice('Alex', 'en-US')]
  assert.equal(pickVoice(voices, 'en-US').name, 'Alex')
})

test('a same-language voice is still used when the locale differs', () => {
  assert.equal(pickVoice([voice('Daniel', 'en-GB')], 'en-US').name, 'Daniel')
})

test('a wrong-language voice is never chosen', () => {
  // An English voice reading Filipino is worse than letting the engine decide.
  assert.equal(pickVoice([voice('Alex', 'en-US')], 'fil-PH'), null)
  assert.equal(scoreVoice(voice('Alex', 'en-US'), 'fil-PH'), -Infinity)
})

test('a Filipino voice is chosen for Tagalog, Ilokano and Cebuano', () => {
  const voices = [voice('Alex', 'en-US', { default: true }), voice('Angelo', 'fil-PH')]
  for (const uiLang of ['tl', 'ilo', 'bis']) {
    assert.equal(pickVoice(voices, speechLangFor(uiLang)).name, 'Angelo', `failed for ${uiLang}`)
  }
})

test('pickVoice degrades safely when the browser reports no voices', () => {
  assert.equal(pickVoice([], 'en-US'), null)
  assert.equal(pickVoice(null, 'en-US'), null)
})

// ─── Delivery + language mapping ─────────────────────────────────────────────

test('every UI language maps to a speech locale', () => {
  for (const uiLang of ['en', 'tl', 'ilo', 'bis']) {
    assert.match(speechLangFor(uiLang), /^[a-z]{2,3}-[A-Z]{2}$/, `bad tag for ${uiLang}`)
  }
  assert.equal(speechLangFor('unknown'), 'en-US')
  assert.deepEqual(Object.keys(SPEECH_LANG).sort(), ['bis', 'en', 'ilo', 'tl'])
})

test('delivery stays in the natural-sounding band', () => {
  for (const tag of ['en-US', 'fil-PH']) {
    const { rate, pitch, volume } = speechSettings(tag)
    assert.ok(rate >= 0.9 && rate <= 1.05, `rate ${rate} outside the natural band`)
    assert.equal(pitch, 1)
    assert.equal(volume, 1)
  }
})

// ─── The real corpus ─────────────────────────────────────────────────────────

test('every narrated line in learning-paths.json survives normalization cleanly', () => {
  const lp = JSON.parse(readFileSync(new URL('../../public/assets/data/learning-paths.json', import.meta.url)))
  const lines = []
  for (const tk of lp.toolkits || []) {
    for (const st of tk.stages || []) {
      lines.push(...(st.objectives || []), ...(st.tasks || []))
      if (st.description) lines.push(st.description)
    }
  }
  assert.ok(lines.length > 100, `expected a real corpus, got ${lines.length} lines`)

  for (const line of lines) {
    const out = normalizeForSpeech(line)
    assert.ok(out.length, `produced nothing for: ${line}`)
    assert.doesNotMatch(out, /\s{2,}/, `double space in: ${out}`)
    assert.doesNotMatch(out, /[·•|&()]/, `unspoken symbol left in: ${out}`)
    assert.doesNotMatch(out, /,\s*[,.]/, `doubled punctuation in: ${out}`)
    assert.doesNotMatch(out, /^\s*[,;:]/, `leading punctuation in: ${out}`)
    assert.match(out, /[.!?]$/, `no terminal punctuation: ${out}`)
    assert.ok(chunkForSpeech(line).length >= 1, `no chunks for: ${line}`)
  }
})
