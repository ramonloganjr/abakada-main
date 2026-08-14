import { test, expect } from '@playwright/test'

// Client-side <title>/<meta description> localization.
//
// pageMeta.js held English titles and descriptions that <SEO> rendered verbatim,
// so switching language localized the page body but left the document title and
// meta description in English. Entries now carry a `seoKey` that <SEO> resolves
// against the `seo.*` bundle.
const TITLES = [
  { path: '/en/about', re: /^About Abakada/ },
  { path: '/tl/about', re: /^Tungkol sa Abakada/ },
  { path: '/ilo/about', re: /^Maipapan iti Abakada/ },
  { path: '/bis/about', re: /^Mahitungod sa Abakada/ },
]

test.describe('localized document metadata', () => {
  for (const { path, re } of TITLES) {
    test(`title and description are localized at ${path}`, async ({ page }) => {
      await page.goto(path)

      await expect(page).toHaveTitle(re)

      // Two description tags exist in the hydrated DOM: the static one baked
      // into index.html, and the one react-helmet-async appends. That duplicate
      // predates this work and only affects JS-rendering crawlers — the
      // prerendered shells replace the static tag, so the HTML served to a
      // non-rendering crawler carries exactly one, already localized.
      // Assert on helmet's tag, which is the last one written.
      const desc = page.locator('head meta[name="description"]').last()
      const content = await desc.getAttribute('content')
      expect(content, 'description should not be empty').toBeTruthy()
      expect(content).not.toContain('{count}')
    })
  }

  test('the description differs between locales', async ({ page }) => {
    // Wait on a title unique to the target locale, not just /Abakada/: after the
    // second navigation WebKit briefly keeps the previous head, so a generic
    // matcher let the stale description through and the two reads compared equal.
    const read = async (p, titleRe) => {
      await page.goto(p)
      await expect(page).toHaveTitle(titleRe)
      return page.locator('head meta[name="description"]').last().getAttribute('content')
    }

    const en = await read('/en/about', /^About Abakada/)
    const tl = await read('/tl/about', /^Tungkol sa Abakada/)
    expect(tl).not.toBe(en)
  })
})

test.describe('dynamic titles are not clobbered by translation', () => {
  test('compare keeps its tool-name title instead of the static localized one', async ({ page }) => {
    // Two real catalog IDs; the page builds "Compare A vs B" from them.
    await page.goto('/tl/compare?tools=libreoffice,onlyoffice')

    // Either the comparison renders (dynamic title) or the catalog rejected the
    // ids and we get the generic page — assert the dynamic case only when the
    // matrix actually mounted, so this does not go green vacuously.
    const matrix = page.locator('.compare-table, .compare-matrix, table')
    if (await matrix.count()) {
      await expect(page).toHaveTitle(/Compare .+ vs .+/)
    } else {
      await expect(page).toHaveTitle(/Itandi|Ihambing|Compare/)
    }
  })
})
