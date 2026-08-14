import { test, expect } from '@playwright/test'

// Localization coverage for the persistent chrome — the strings on every page.
//
// These were hardcoded English until the localization audit: the skip link, the
// menu/theme/language controls and the pagination buttons all shipped fixed
// English while fully-translated `accessibility.*` and `pagination.*` bundles
// sat unused. Nothing caught it because the affected strings are aria-labels and
// a visually-hidden link, so they are invisible to a screenshot and to any test
// that only reads visible text.
const CHROME = [
  { path: '/tl', skip: 'Lumaktaw sa pangunahing nilalaman', menu: 'Buksan ang menu' },
  { path: '/ilo', skip: 'Lumaktaw iti kangrunaan a linaon', menu: 'Lukatan ti menu' },
  { path: '/bis', skip: 'Laktaw ngadto sa nag-unang sulod', menu: 'Ablihi ang menu' },
  { path: '/en', skip: 'Skip to main content', menu: 'Open menu' },
]

test.describe('localized page chrome', () => {
  for (const { path, skip, menu } of CHROME) {
    test(`skip link and menu control are localized at ${path}`, async ({ page }) => {
      await page.goto(path)

      // The skip link is visually hidden but must still be translated — it is the
      // first thing a keyboard or screen-reader user reaches.
      await expect(page.locator('a.skip-link')).toHaveText(skip)

      await expect(page.locator('#menu-toggle')).toHaveAttribute('aria-label', menu)
    })
  }
})

test.describe('localized pagination', () => {
  // Pagination renders only when a view overflows one page; the all-tools listing
  // reliably does with a 1,200+ catalog.
  const PAGER = [
    { path: '/tl', prev: 'Nakaraang pahina', next: 'Susunod na pahina' },
    { path: '/ilo', prev: 'Napalabas a panid', next: 'Sumaruno a panid' },
    { path: '/bis', prev: 'Miaging panid', next: 'Sunod nga panid' },
  ]

  for (const { path, prev, next } of PAGER) {
    test(`pagination controls are localized at ${path}`, async ({ page }) => {
      await page.goto(path)

      const pager = page.locator('nav.pagination')
      await pager.scrollIntoViewIfNeeded()
      await expect(pager).toBeVisible()

      await expect(pager.locator(`[aria-label="${prev}"]`)).toBeAttached()
      await expect(pager.locator(`[aria-label="${next}"]`)).toBeAttached()
    })
  }
})
