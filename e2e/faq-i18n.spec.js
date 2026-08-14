import { test, expect } from '@playwright/test'

// The FAQ body shipped as a hardcoded English array while the page chrome was
// translated — so /tl rendered "Mga Madalas Itanong" above eighteen English
// answers. These assert the answers themselves follow the active language.
const FAQ = [
  { path: '/en', first: 'What is Abakada?', marker: 'free, curated directory' },
  { path: '/tl', first: 'Ano ang Abakada?', marker: 'maingat na piniling direktoryo' },
  { path: '/ilo', first: 'Ania ti Abakada?', marker: 'naurnos a direktorio' },
  { path: '/bis', first: 'Unsa ang Abakada?', marker: 'maampingong pinili nga direktoryo' },
]

test.describe('FAQ content localization', () => {
  for (const { path, first, marker } of FAQ) {
    test(`answers are localized at ${path}`, async ({ page }) => {
      await page.goto(`${path}/faq`)

      const items = page.locator('.faq-item')
      await expect(items).toHaveCount(18)

      await expect(items.first().locator('.faq-item__question')).toHaveText(first)
      await expect(items.first().locator('.faq-item__answer')).toContainText(marker)

      // The catalog size is interpolated into answer 1; a dropped placeholder
      // would leave a literal "{count}" in front of the user.
      const answer = await items.first().locator('.faq-item__answer').innerText()
      expect(answer).not.toContain('{count}')
      expect(answer).toMatch(/[\d,]{3,}/)
    })
  }

  test('structured data carries the localized answers, not English', async ({ page }) => {
    await page.goto('/tl/faq')

    // Wait for the localized body first: it means the bundle resolved, which is
    // the same condition the head needs before react-helmet-async flushes.
    await expect(page.locator('.faq-item').first().locator('.faq-item__question'))
      .toHaveText('Ano ang Abakada?')

    // index.html also ships a static, English-only FAQPage block on every route,
    // so select the app-rendered one by its inLanguage tag rather than assuming
    // there is exactly one. (That static duplicate is a separate SEO defect —
    // it is English on every locale and declares FAQPage on non-FAQ routes.)
    //
    // Polled because the head is written by a helmet side effect that lands a
    // tick after the body — reading it once raced on WebKit.
    let faqBlock
    await expect.poll(async () => {
      const ld = await page.locator('script[type="application/ld+json"]').allTextContents()
      faqBlock = ld.map((s) => JSON.parse(s)).filter((o) => o['@type'] === 'FAQPage').find((o) => o.inLanguage)
      return faqBlock?.inLanguage
    }, { message: 'no app-rendered FAQPage with inLanguage appeared' }).toBe('tl')
    expect(faqBlock.mainEntity).toHaveLength(18)
    expect(faqBlock.mainEntity[0].name).toBe('Ano ang Abakada?')
    expect(faqBlock.mainEntity[0].acceptedAnswer.text).not.toContain('{count}')
  })
})
