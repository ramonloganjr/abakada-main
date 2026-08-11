// @ts-check
// Read-aloud support for the guided lesson in Learning Paths.
//
// Everything here is pure (no DOM, no React, no Web Speech API) so the tricky
// parts — how a line of lesson copy is turned into speakable text, and which of
// the browser's voices is worth using — are unit-testable. The stateful side
// (loading voices, queueing utterances, cancelling) lives in
// `src/hooks/useNarration.js`.
//
// The three levers that decide whether narration sounds human, in order of how
// much they actually matter:
//
//   1. Voice choice. A neural voice ("Microsoft Aria Online (Natural)", "Google
//      US English", an Apple Enhanced/Premium voice) sounds like a person; the
//      legacy SAPI5 / eSpeak fallbacks sound like a 1998 screen reader. The
//      browser default is frequently the bad one, so picking deliberately is the
//      single biggest win available to us.
//   2. Prosody cues in the text. The Web Speech API ignores SSML in every engine
//      that ships today, so punctuation is the only phrasing control we have.
//   3. Pronunciation repair. "PDF", "SQL", "Firefly III" and friends are read as
//      nonsense words by most engines unless respelled.

// Locale hints per UI language. Cebuano and Ilokano almost never have dedicated
// voices, so they fall back to Filipino — much closer to the reader's ear than
// English, which is what the browser would otherwise pick.
/** @type {Record<string, string>} */
export const SPEECH_LANG = { en: 'en-US', tl: 'fil-PH', ilo: 'fil-PH', bis: 'fil-PH' }

/** @param {string} lang @returns {string} */
export function speechLangFor(lang) {
  return SPEECH_LANG[lang] || 'en-US'
}

// ─── Pronunciation repair ────────────────────────────────────────────────────

// Acronyms the engines get wrong when left alone: most try to pronounce them as
// words ("SQL" as "skwl", "SVG" as "svig"). Spacing the letters forces the
// letter-by-letter reading a person would use. Deliberately a short, audited
// list drawn from the actual lesson corpus rather than "every capitalised word",
// because acronyms that already read correctly (GIMP, LaTeX) must be left alone.
const SPELLED_OUT = [
  'AI', 'APA', 'BI', 'CMYK', 'CSV', 'DOCX', 'GPL', 'LMS', 'MIT', 'MLA', 'OCR',
  'PDF', 'PNG', 'PPTX', 'QR', 'SMS', 'SQL', 'SVG', 'UI', 'URL', 'UX', 'VLC',
  'VS', 'XLSX',
]

// Names and tokens with a settled spoken form that letter-spacing would ruin.
/** @type {Array<[RegExp, string]>} */
const SAY_AS = [
  // Handled before the generic word/word rule below, which would otherwise
  // expand this to the stutter "and or or".
  [/\band\/or\b/gi, 'and or'],
  [/\bFirefly III\b/g, 'Firefly Three'],        // Roman numeral, not "eye eye eye"
  [/\bR-Project\b/g, 'R Project'],              // the hyphen makes engines slur it
  [/\bE2EE\b/g, 'E 2 E E'],
  [/\bH5P\b/g, 'H 5 P'],
  [/\bPDF\/X-1a\b/g, 'P D F X 1 A'],            // print standard, read as characters
  [/\bPDF\/([A-Z])\b/g, 'P D F $1'],            // PDF/A and friends
  [/\bP&L\b/g, 'P and L'],
]

// Spoken form of the TLDs that appear in lesson copy. "draw.io" read literally
// comes out as "drawio" or "draw ee-oh".
/** @type {Record<string, string>} */
const TLD_SPOKEN = { io: 'I O', ph: 'P H', org: 'org', com: 'com', net: 'net', dev: 'dev', app: 'app' }

/**
 * Rewrite a line of lesson copy into something an engine reads like a person.
 *
 * Conservative on purpose. Hyphenated compounds ("privacy-respecting",
 * "end-to-end") are the single most common construction in the corpus and every
 * engine already handles them, so they are left untouched — stripping hyphens
 * there would make delivery worse, not better.
 *
 * @param {string | null | undefined} text
 * @returns {string}
 */
export function normalizeForSpeech(text) {
  if (!text) return ''
  let out = String(text)

  // Fixed spoken forms first, so later rules cannot fight them.
  for (const [re, replacement] of SAY_AS) out = out.replace(re, replacement)

  // Domains: "draw.io" -> "draw dot I O".
  out = out.replace(/\b([a-z][\w-]*)\.([a-z]{2,4})\b/gi, (match, host, tld) => {
    const spoken = TLD_SPOKEN[String(tld).toLowerCase()]
    return spoken ? `${host} dot ${spoken}` : match
  })

  // Acronyms -> spaced letters. Handles a trailing plural ("PDFs" -> "P D Fs").
  for (const acronym of SPELLED_OUT) {
    out = out.replace(new RegExp(`\\b${acronym}(s?)\\b`, 'g'), (_m, plural) =>
      acronym.split('').join(' ') + (plural ? 's' : ''),
    )
  }

  // "&" is read as "ampersand" or skipped entirely depending on the engine.
  out = out.replace(/\s*&\s*/g, ' and ')

  // Separators used as visual bullets ("To Do · Doing · Done") are either read
  // aloud by name or swallowed. A comma gives the pause they were standing in for.
  out = out.replace(/\s*[·•|]\s*/g, ', ')

  // A slash between words is a spoken "or"; between letters it is a pause.
  out = out.replace(/\b([a-z]{2,})\/([a-z]{2,})\b/gi, '$1 or $2')

  // Parentheses read better as an aside set off by commas.
  out = out.replace(/\s*\(\s*/g, ', ').replace(/\s*\)\s*/g, ', ')

  // Ellipses and dashes become a beat rather than a mumble.
  out = out.replace(/\.{3,}/g, ', ').replace(/\s+[—–]\s+/g, ', ')

  // Tidy the punctuation the rules above may have doubled up.
  out = out
    .replace(/\s+/g, ' ')
    .replace(/\s+([,.!?;:])/g, '$1')
    .replace(/,\s*,+/g, ',')
    .replace(/,\s*([.!?])/g, '$1')
    .trim()
    .replace(/^[,;:\s]+/, '')
    // A trailing comma is common once a closing parenthesis has been rewritten;
    // it has to go before the full stop below, or the line ends on ",.".
    .replace(/[,;:]+$/, '')

  // A terminal full stop makes engines fall in pitch instead of leaving the line
  // hanging mid-air, which is most of what makes short TTS lines sound abrupt.
  if (out && !/[.!?]$/.test(out)) out += '.'

  return out
}

// ─── Phrasing ────────────────────────────────────────────────────────────────

// Past roughly this many characters an utterance starts to sound like it is
// racing, and Chrome's ~15s watchdog can cut it off mid-word.
const MAX_CHUNK = 180

/**
 * Split normalized text into utterance-sized chunks.
 *
 * Speaking sentence-by-sentence is what produces a real pause between sentences:
 * engines run straight through a single long utterance, but leave a natural beat
 * between queued ones. Chunks are queued synchronously by the caller (never on a
 * timer) because iOS Safari only permits speech started inside the user gesture.
 *
 * @param {string | null | undefined} text
 * @returns {string[]}
 */
export function chunkForSpeech(text) {
  const normalized = normalizeForSpeech(text)
  if (!normalized) return []

  // Keep the terminator with its sentence so the engine keeps the intonation.
  const sentences = normalized.match(/[^.!?]+[.!?]+|\S[^.!?]*$/g) || [normalized]

  const chunks = []
  for (const raw of sentences) {
    const sentence = raw.trim()
    if (!sentence) continue
    if (sentence.length <= MAX_CHUNK) {
      chunks.push(sentence)
      continue
    }
    // Long sentence: break at clause boundaries, which is where a person breathes.
    let buffer = ''
    for (const piece of sentence.split(/(?<=[,;:])\s+/)) {
      if (buffer && (buffer + ' ' + piece).length > MAX_CHUNK) {
        chunks.push(buffer.trim())
        buffer = piece
      } else {
        buffer = buffer ? `${buffer} ${piece}` : piece
      }
    }
    if (buffer.trim()) chunks.push(buffer.trim())
  }
  return chunks.filter(Boolean)
}

// ─── Voice selection ─────────────────────────────────────────────────────────

// Name markers that identify a neural/high-quality voice across the engines we
// actually meet: Microsoft "Online (Natural)" on Edge, Google's network voices on
// Chrome and Android, Apple's Enhanced/Premium and Siri voices on Safari.
/** @type {Array<[RegExp, number]>} */
const QUALITY_MARKERS = [
  [/\bneural\b/i, 60],
  [/\bnatural\b/i, 60],
  [/\bpremium\b/i, 45],
  [/\benhanced\b/i, 40],
  [/\bsiri\b/i, 35],
  [/^google\b/i, 30],
  [/\bonline\b/i, 30],
  [/\bwavenet\b/i, 55],
]

// Known-poor engines and the legacy desktop voices that ship as the default on
// Windows and most Linux builds — the exact voices that make TTS sound robotic.
/** @type {Array<[RegExp, number]>} */
const QUALITY_PENALTIES = [
  [/\bespeak\b/i, -80],
  [/\bcompact\b/i, -35],
  [/\beloquence\b/i, -45],
  [/\b(david|zira|mark|hazel|george|susan|richard|linda)\b/i, -25], // legacy SAPI5
  // Apple's novelty voices are installed by default and are not usable narration.
  [/\b(albert|bad news|bahh|bells|boing|bubbles|cellos|deranged|good news|jester|organ|superstar|trinoids|whisper|wobble|zarvox|fred|ralph|junior|kathy)\b/i, -90],
]

/**
 * Score one voice for narrating `langTag`. Higher is better; a negative score
 * means "only if there is nothing else".
 *
 * @param {SpeechSynthesisVoice} voice
 * @param {string} langTag e.g. "en-US"
 * @returns {number}
 */
export function scoreVoice(voice, langTag) {
  if (!voice || !voice.lang) return -Infinity
  const voiceLang = voice.lang.replace('_', '-').toLowerCase()
  const wanted = String(langTag || '').replace('_', '-').toLowerCase()
  const base = wanted.split('-')[0]

  // A voice from the wrong language is unusable: an English voice reading
  // Filipino is worse than no narration at all.
  if (!voiceLang.startsWith(base)) return -Infinity

  let score = voiceLang === wanted ? 50 : 25
  const name = voice.name || ''
  for (const [re, points] of QUALITY_MARKERS) if (re.test(name)) score += points
  for (const [re, points] of QUALITY_PENALTIES) if (re.test(name)) score += points
  // Network voices are neural far more often than not.
  if (voice.localService === false) score += 15
  if (voice.default) score += 5
  return score
}

/**
 * Best available voice for `langTag`, or null when the browser offers nothing in
 * that language (in which case the caller should let the engine choose rather
 * than force a mismatched accent).
 *
 * @param {SpeechSynthesisVoice[] | null | undefined} voices
 * @param {string} langTag
 * @returns {SpeechSynthesisVoice | null}
 */
export function pickVoice(voices, langTag) {
  if (!Array.isArray(voices) || !voices.length) return null
  let best = null
  let bestScore = -Infinity
  for (const voice of voices) {
    const score = scoreVoice(voice, langTag)
    if (score > bestScore) {
      bestScore = score
      best = voice
    }
  }
  return bestScore === -Infinity ? null : best
}

/**
 * Delivery settings. Slightly under natural speed aids comprehension for the
 * first-time and non-native readers this lesson mode is built for, without the
 * dragging, drunk quality that shows up below about 0.9.
 *
 * @param {string} langTag
 * @returns {{ rate: number, pitch: number, volume: number }}
 */
export function speechSettings(langTag) {
  const isFilipino = String(langTag || '').toLowerCase().startsWith('fil')
  return { rate: isFilipino ? 0.92 : 0.95, pitch: 1, volume: 1 }
}
