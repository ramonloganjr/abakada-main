import { test, expect } from '@playwright/test'
import { gotoStaticPage } from './helpers.js'

// Headless browsers ship no real voices, and audio quality is not assertable
// anyway. What *is* assertable — and what actually decided whether narration
// sounds human — is the instruction we hand the engine: which voice, at what
// rate, with what text, and whether the queue survives the platform quirks.
// So we install a recording stub over speechSynthesis and inspect it.
//
// The voice list mirrors a real Windows/Edge profile: the legacy SAPI5 default
// (robotic) alongside a neural online voice, plus a Filipino voice.
const installSpeechStub = async (page, { voices = null } = {}) => {
  await page.addInitScript((voiceSpec) => {
    const list = (
      voiceSpec || [
        { name: 'Microsoft David - English (United States)', lang: 'en-US', localService: true, default: true },
        { name: 'Microsoft Aria Online (Natural) - English (United States)', lang: 'en-US', localService: false, default: false },
        { name: 'Google US English', lang: 'en-US', localService: false, default: false },
        { name: 'Microsoft Angelo Online (Natural) - Filipino (Philippines)', lang: 'fil-PH', localService: false, default: false },
      ]
    ).map((v) => ({ ...v, voiceURI: v.name }))

    const spoken = []
    const queued = []
    let cancels = 0
    let speaking = false

    // Macrotask counter. Everything queued in one turn of the event loop shares
    // a tick, which is exactly the property iOS Safari cares about: the whole
    // batch must be issued inside the gesture's task, never from a later timer.
    let tick = 0
    ;(function bump() {
      setTimeout(() => { tick += 1; bump() }, 0)
    })()

    class FakeUtterance {
      constructor(text) {
        this.text = text
        this.lang = ''
        this.rate = 1
        this.pitch = 1
        this.volume = 1
        this.voice = null
        this.onend = null
        this.onerror = null
        this.onstart = null
      }
    }

    const synth = {
      get speaking() { return speaking },
      get paused() { return false },
      getVoices: () => list,
      speak(u) {
        speaking = true
        queued.push(u)
        spoken.push({
          text: u.text,
          lang: u.lang,
          rate: u.rate,
          pitch: u.pitch,
          volume: u.volume,
          voice: u.voice ? u.voice.name : null,
          tick,
        })
        // Deliberately does NOT auto-finish: real narration lasts seconds, and
        // an auto-end races every assertion about the speaking state.
      },
      cancel() { cancels += 1; speaking = false; queued.length = 0 },
      pause() {},
      resume() {},
      addEventListener() {},
      removeEventListener() {},
    }

    Object.defineProperty(window, 'speechSynthesis', { value: synth, configurable: true })
    Object.defineProperty(window, 'SpeechSynthesisUtterance', { value: FakeUtterance, configurable: true })

    window.__speech = {
      spoken: () => spoken,
      cancels: () => cancels,
      reset: () => { spoken.length = 0; cancels = 0 },
      // End the queue the way a real engine would once it finishes reading.
      finish: () => {
        const last = queued[queued.length - 1]
        speaking = false
        queued.length = 0
        if (last && last.onend) last.onend()
      },
    }
  }, voices)
}

// Open the first stage's guided lesson on a learning path.
async function openGuidedLesson(page) {
  await gotoStaticPage(page, '/learning-paths/digital-foundations')

  // Dismiss the analytics consent bar. It is docked to the bottom of the
  // viewport, which on a phone-sized screen sits over the lesson controls — the
  // same thing a real user does before reaching them, and it keeps tap targets
  // deterministic under parallel test load.
  const consent = page.locator('.consent-banner')
  if (await consent.isVisible().catch(() => false)) {
    await consent.locator('.btn--secondary').click()
    await expect(consent).toBeHidden()
  }

  const launch = page.locator('.lpj-guided-launch').first()
  await launch.scrollIntoViewIfNeeded()
  await launch.click()
  await expect(page.locator('.micro-lesson')).toBeVisible()
  // The Listen control must be wired before a tap can mean anything.
  await expect(page.locator('.micro-lesson__listen')).toBeEnabled()
}

const listenBtn = (page) => page.locator('.micro-lesson__listen')

test.describe('guided lesson narration', () => {
  test('Listen narrates the current step with the best available voice', async ({ page }) => {
    await installSpeechStub(page)
    await openGuidedLesson(page)

    await expect(listenBtn(page)).toBeVisible()
    await listenBtn(page).click()

    await expect.poll(() => page.evaluate(() => window.__speech.spoken().length)).toBeGreaterThan(0)
    const spoken = await page.evaluate(() => window.__speech.spoken())

    // The neural voice must win over the legacy SAPI5 default.
    expect(spoken[0].voice).toBe('Microsoft Aria Online (Natural) - English (United States)')
    expect(spoken[0].lang).toBe('en-US')
    // Delivery inside the natural band, not the drawl that reads as synthetic.
    expect(spoken[0].rate).toBeGreaterThanOrEqual(0.9)
    expect(spoken[0].rate).toBeLessThanOrEqual(1.05)
    expect(spoken[0].pitch).toBe(1)
    // Narrated text is the step text, ending on a full stop for falling pitch.
    expect(spoken[0].text.length).toBeGreaterThan(0)
    expect(spoken[0].text).toMatch(/[.!?]$/)
  })

  test('all chunks are queued in one event-loop turn (iOS Safari requirement)', async ({ page }) => {
    // iOS Safari only permits speech begun inside the gesture's task, so a
    // timer-driven chunk queue goes silent after the first sentence there.
    await installSpeechStub(page)
    await openGuidedLesson(page)

    // A multi-sentence step proves the batching, not just a single utterance.
    const chunkCount = await page.evaluate(() => {
      const btn = document.querySelector('.micro-lesson__listen')
      btn.click()
      return window.__speech.spoken().length
    })
    expect(chunkCount).toBeGreaterThan(0)

    const ticks = await page.evaluate(() => [...new Set(window.__speech.spoken().map((u) => u.tick))])
    expect(ticks, 'chunks were spread across event-loop turns').toHaveLength(1)
  })

  test('Stop cancels narration and resets the button', async ({ page }) => {
    await installSpeechStub(page)
    await openGuidedLesson(page)

    await listenBtn(page).click()
    await expect(listenBtn(page)).toHaveAttribute('aria-pressed', 'true')

    await listenBtn(page).click()
    await expect(listenBtn(page)).toHaveAttribute('aria-pressed', 'false')
    expect(await page.evaluate(() => window.__speech.cancels())).toBeGreaterThan(0)
  })

  test('moving to another step stops the previous narration', async ({ page }) => {
    await installSpeechStub(page)
    await openGuidedLesson(page)

    await listenBtn(page).click()
    await page.evaluate(() => window.__speech.reset())

    await page.locator('.micro-lesson__nav .btn--primary').click()
    await expect.poll(() => page.evaluate(() => window.__speech.cancels())).toBeGreaterThan(0)
    // Nothing should start speaking on its own after a step change.
    expect(await page.evaluate(() => window.__speech.spoken().length)).toBe(0)
  })

  test('narration falls back cleanly when the browser exposes no voices', async ({ page }) => {
    await installSpeechStub(page, { voices: [] })
    await openGuidedLesson(page)

    await listenBtn(page).click()
    await expect.poll(() => page.evaluate(() => window.__speech.spoken().length)).toBeGreaterThan(0)

    const spoken = await page.evaluate(() => window.__speech.spoken())
    // No voice to force: hand the engine the locale and let it choose, rather
    // than failing silently.
    expect(spoken[0].voice).toBeNull()
    expect(spoken[0].lang).toBe('en-US')
  })

  test('narration does not block interaction or add measurable latency', async ({ page }) => {
    await installSpeechStub(page)
    await openGuidedLesson(page)

    const ms = await page.evaluate(() => {
      const btn = document.querySelector('.micro-lesson__listen')
      const t0 = performance.now()
      btn.click()
      return performance.now() - t0
    })
    // Text prep plus queueing is pure string work; it must stay well inside a frame.
    expect(ms).toBeLessThan(50)
    await expect(page.locator('.micro-lesson__nav .btn--primary')).toBeEnabled()
  })

  test('the Listen control is keyboard reachable and announces its state', async ({ page }) => {
    await installSpeechStub(page)
    await openGuidedLesson(page)

    const btn = listenBtn(page)
    await expect(btn).toHaveAttribute('aria-pressed', 'false')
    await btn.focus()
    await expect(btn).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(btn).toHaveAttribute('aria-pressed', 'true')
  })
})
