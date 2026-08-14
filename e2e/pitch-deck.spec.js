import { test, expect } from '@playwright/test'

// The deck PDF is the one asset users download rather than view, so it is worth
// asserting end-to-end: the bytes on the wire are a real PDF, and both entry
// points hand the browser the current filename.
//
// The filename is duplicated in Footer.jsx and PartnershipDeck.jsx; when it is
// rotated (as it was from Abakada-Pitch-Deck-2026.pdf) it is easy to update one
// and miss the other, which fails silently — downloadFile() falls back through
// three strategies and the last one opens a tab rather than throwing.
const PITCH_DECK_PATH = '/assets/doc/Abakada-Impact-Pitch-Deck-2026.pdf'
const PITCH_DECK_FILENAME = 'Abakada-Impact-Pitch-Deck-2026.pdf'
const RETIRED_PATH = '/assets/doc/Abakada-Pitch-Deck-2026.pdf'

test.describe('pitch deck asset', () => {
  test('is served as real PDF bytes, not the SPA shell', async ({ page }) => {
    const res = await page.request.get(PITCH_DECK_PATH)

    expect(res.status()).toBe(200)
    expect(res.headers()['content-type']).toContain('application/pdf')

    // downloadFile() stage 1 explicitly rejects a text/html body, because the
    // SPA rewrite returning index.html for a missing PDF is the exact failure a
    // renamed file causes. Assert the magic bytes so we catch it here instead.
    const body = await res.body()
    expect(body.subarray(0, 5).toString('latin1')).toBe('%PDF-')
    expect(body.byteLength).toBeGreaterThan(100_000)
  })

  test('the retired filename no longer serves a PDF', async ({ page }) => {
    const res = await page.request.get(RETIRED_PATH)

    // Deliberately not asserting a 404: the two environments answer a missing
    // doc differently. Vercel 404s it (the vercel.json rewrite excludes
    // `assets`), while the Vite dev server this suite runs against falls through
    // to the SPA shell and returns 200 text/html. What must hold in both — and
    // what actually breaks a download — is that no PDF comes back.
    const contentType = res.headers()['content-type'] || ''
    expect(contentType).not.toContain('application/pdf')

    if (res.ok()) {
      const body = await res.body()
      expect(body.subarray(0, 5).toString('latin1')).not.toBe('%PDF-')
    }
  })
})

test.describe('pitch deck download', () => {
  test('the deck CTA downloads the PDF under the current filename', async ({ page }) => {
    await page.goto('/partnership-deck')

    const cta = page.locator('a[aria-label*="Pitch Deck"]')
    await cta.scrollIntoViewIfNeeded()
    await expect(cta).toBeVisible()

    // The href is the no-JS path; assert it too, since the click handler
    // preventDefault()s and could mask a stale href.
    await expect(cta).toHaveAttribute('href', PITCH_DECK_PATH)
    await expect(cta).toHaveAttribute('download', PITCH_DECK_FILENAME)

    const downloadPromise = page.waitForEvent('download')
    await cta.click()
    const download = await downloadPromise

    expect(download.suggestedFilename()).toBe(PITCH_DECK_FILENAME)
    await expectPdfPayload(download)
  })

  test('the footer link downloads the PDF under the current filename', async ({ page }) => {
    // The deck route hides the footer (App.jsx), so exercise it from home.
    await page.goto('/')

    const link = page.locator('.site-footer a[aria-label*="Pitch Deck"]')
    await link.scrollIntoViewIfNeeded()
    await expect(link).toHaveAttribute('href', PITCH_DECK_PATH)
    await expect(link).toHaveAttribute('download', PITCH_DECK_FILENAME)

    // The label drifted out of sync with the file once already (it still read
    // "Partnership Pitch Deck" after the file became the Impact deck). Pin the
    // default-locale copy so a future rename has to update both.
    await expect(link).toHaveText('Impact Pitch Deck')

    const downloadPromise = page.waitForEvent('download')
    await link.click()
    const download = await downloadPromise

    expect(download.suggestedFilename()).toBe(PITCH_DECK_FILENAME)
    await expectPdfPayload(download)
  })
})

// The footer label ships in four languages. Renaming the deck means touching
// five files (the component fallback plus four translation bundles), so assert
// every locale actually resolves its own string — a missed bundle silently
// falls back to the English default rather than failing.
const LOCALE_LABELS = [
  ['/en', 'Impact Pitch Deck'],
  ['/tl', 'Pitch Deck ng Epekto'],
  ['/ilo', 'Pitch Deck ti Epekto'],
  ['/bis', 'Pitch Deck sa Epekto'],
]

test.describe('pitch deck label', () => {
  for (const [path, label] of LOCALE_LABELS) {
    test(`resolves the localized footer label at ${path}`, async ({ page }) => {
      await page.goto(path)

      const link = page.locator('.site-footer a[aria-label*="Pitch Deck"]')
      await link.scrollIntoViewIfNeeded()
      await expect(link).toHaveText(label)
      // The label is localized; the file it points at is not.
      await expect(link).toHaveAttribute('download', PITCH_DECK_FILENAME)
    })
  }
})

/**
 * Assert a completed download is a PDF rather than an error page saved under a
 * .pdf name — the failure mode a broken path produces once the anchor fallback
 * kicks in.
 *
 * @param {import('@playwright/test').Download} download
 */
async function expectPdfPayload(download) {
  const stream = await download.createReadStream()
  const chunks = []
  for await (const chunk of stream) chunks.push(chunk)
  const bytes = Buffer.concat(chunks)

  expect(bytes.subarray(0, 5).toString('latin1')).toBe('%PDF-')
  expect(bytes.byteLength).toBeGreaterThan(100_000)
}
