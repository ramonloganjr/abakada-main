import { useCallback, useEffect, useRef, useState } from 'react'
import { chunkForSpeech, pickVoice, speechSettings } from '../lib/speech'

// Chrome suspends synthesis after roughly 15 seconds of continuous speech; a
// periodic resume() keeps a multi-sentence queue alive. Harmless elsewhere.
const KEEPALIVE_MS = 5000

/**
 * Read-aloud for the guided lesson.
 *
 * Wraps the Web Speech API and papers over the three things that make it
 * unreliable in practice:
 *
 *  - Voices load asynchronously. `getVoices()` returns [] on the first call in
 *    Chrome, so a naive implementation silently narrates the first click with the
 *    default (usually robotic) voice. We resolve the list up front and re-resolve
 *    on `voiceschanged`.
 *  - iOS Safari only allows speech that begins inside a user gesture. Every chunk
 *    is therefore queued synchronously in the click handler, never on a timer.
 *  - Chrome drops long utterances and can swallow a `speak()` issued in the same
 *    tick as a `cancel()`.
 *
 * @param {string} langTag BCP-47 tag, e.g. "en-US"
 * @returns {{ supported: boolean, speaking: boolean, speak: (text: string) => void, stop: () => void }}
 */
export function useNarration(langTag) {
  const supported =
    typeof window !== 'undefined' &&
    'speechSynthesis' in window &&
    typeof window.SpeechSynthesisUtterance === 'function'

  const [speaking, setSpeaking] = useState(false)
  const voicesRef = useRef([])
  // Bumped on every stop/new request so callbacks from a cancelled run cannot
  // flip state belonging to the current one.
  const runRef = useRef(0)
  const keepaliveRef = useRef(null)

  // Resolve the voice list once, then keep it fresh. Chrome fires
  // `voiceschanged` after its async load; Safari populates synchronously.
  useEffect(() => {
    if (!supported) return undefined
    const synth = window.speechSynthesis
    const read = () => {
      const list = synth.getVoices()
      if (list && list.length) voicesRef.current = list
    }
    read()
    synth.addEventListener?.('voiceschanged', read)
    return () => synth.removeEventListener?.('voiceschanged', read)
  }, [supported])

  const clearKeepalive = useCallback(() => {
    if (keepaliveRef.current) {
      clearInterval(keepaliveRef.current)
      keepaliveRef.current = null
    }
  }, [])

  const stop = useCallback(() => {
    runRef.current += 1
    clearKeepalive()
    if (supported) {
      try { window.speechSynthesis.cancel() } catch { /* engine already torn down */ }
    }
    setSpeaking(false)
  }, [supported, clearKeepalive])

  const speak = useCallback(
    (text) => {
      if (!supported) return
      const chunks = chunkForSpeech(text)
      if (!chunks.length) return

      const synth = window.speechSynthesis
      try { synth.cancel() } catch { /* no-op */ }

      const run = ++runRef.current
      const voice = pickVoice(voicesRef.current, langTag)
      const { rate, pitch, volume } = speechSettings(langTag)

      setSpeaking(true)
      clearKeepalive()
      keepaliveRef.current = setInterval(() => {
        // Only nudge a queue that is genuinely mid-flight.
        if (synth.speaking && !synth.paused) {
          try { synth.resume() } catch { /* no-op */ }
        }
      }, KEEPALIVE_MS)

      chunks.forEach((chunk, i) => {
        const utterance = new window.SpeechSynthesisUtterance(chunk)
        // Setting `voice` alone is not enough on every engine — `lang` has to
        // agree with it or some fall back to the system default mid-queue.
        if (voice) utterance.voice = voice
        utterance.lang = voice?.lang || langTag
        utterance.rate = rate
        utterance.pitch = pitch
        utterance.volume = volume

        const finish = () => {
          if (runRef.current !== run) return // superseded by a newer request
          clearKeepalive()
          setSpeaking(false)
        }
        if (i === chunks.length - 1) utterance.onend = finish
        utterance.onerror = (event) => {
          // A cancel() we issued ourselves surfaces here too; it is not a fault.
          if (event?.error === 'canceled' || event?.error === 'interrupted') return
          finish()
        }

        // Queued synchronously: the whole batch belongs to the originating
        // gesture, which is what keeps iOS Safari playing past the first chunk.
        synth.speak(utterance)
      })
    },
    [supported, langTag, clearKeepalive],
  )

  // Never leave audio running after the component goes away.
  useEffect(() => stop, [stop])

  return { supported, speaking, speak, stop }
}
