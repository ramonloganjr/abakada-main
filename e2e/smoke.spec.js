import { test, expect } from '@playwright/test'
import { gotoStaticPage } from './helpers.js'

test.describe('home — beginner-first entry points', () => {
  test('renders dual CTAs, trust strip and beginner picks', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('.hero__cta', { hasText: /get started/i })).toBeVisible()
    await expect(page.locator('.hero__cta', { hasText: /browse/i })).toBeVisible()
    await expect(page.locator('.trust-strip')).toBeVisible()
    await expect(page.locator('.beginner-picks')).toBeVisible()
    await expect(page.locator('.beginner-picks .card')).toHaveCount(6)
  })

  test('guided CTA opens the onboarding modal with all roles', async ({ page }) => {
    await page.goto('/')
    await page.locator('.hero__cta', { hasText: /get started/i }).click()
    await expect(page.locator('.onboarding-modal')).toBeVisible()
    await expect(page.locator('.onboarding-modal__role-btn')).toHaveCount(9)
  })

  test('desktop header exposes labeled actions', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/')
    await expect(page.locator('.header-nav-btn__label').first()).toBeVisible()
  })

  // The hero stat, the hero sentence and the page title each used to carry their
  // own copy of the catalog size — the sentence lived in four translation files
  // and sat three tools behind reality for a while. They now all derive from the
  // data (or from the constant the unit tests pin to it), so assert they agree.
  test('every catalog-size figure on the home page agrees with the data', async ({ page }) => {
    const expected = await page.request.get('/assets/data/tools.json')
      .then((r) => r.json())
      .then((d) => d.stats.totalTools.toLocaleString('en-US'))

    await page.goto('/')
    await expect(page.locator('.hero__stat-value').first()).toHaveText(`${expected}+`)
    await expect(page.locator('.hero__definition')).toContainText(expected)
    await expect(page.locator('.hero__definition')).not.toContainText('{count}')
    await expect(page).toHaveTitle(new RegExp(`^${expected} Free Open-Source Tools`))
  })
})

test.describe('tool detail — evaluate, try, install', () => {
  test('shows alternative-to, action buttons and a platform-aware install guide', async ({ page }) => {
    await gotoStaticPage(page, '/tools/libreoffice')
    await expect(page.locator('.tool-detail__alternative')).toContainText(/Microsoft Office/i)
    await expect(page.locator('.tool-detail__actions a', { hasText: /visit official site/i })).toBeVisible()

    const guide = page.locator('.install-guide')
    await expect(guide).toBeVisible()
    // <details> is collapsed by default; opening it reveals the generated steps.
    await guide.locator('summary').click()
    await expect(guide.locator('.install-guide__group-title').first()).toContainText(/your computer/i)
    await expect(guide.locator('.install-guide__steps li').first()).toBeVisible()
  })
})

test.describe('footer — sponsorship', () => {
  // The button is a native anchor rather than GitHub's <iframe> embed, which
  // means it is bound by our CSP's default-src and needs no frame-src entry.
  // These assertions are what would break if someone swapped the iframe back
  // in: the link would become a frame, the accessible name would come from the
  // vendor's title, and the heart would stop tracking the theme.
  test('exposes a themed, keyboard-reachable GitHub Sponsors link', async ({ page }) => {
    await page.goto('/')
    const sponsor = page.locator('.footer-sponsor')
    await sponsor.scrollIntoViewIfNeeded()

    await expect(sponsor).toBeVisible()
    await expect(sponsor).toHaveAttribute('href', 'https://github.com/sponsors/Abakada-org')
    await expect(sponsor).toHaveAttribute('rel', /noopener/)
    // Names the destination and warns about the new tab, like .footer-toolkit.
    await expect(sponsor).toHaveAttribute('aria-label', /GitHub Sponsors.*new tab/i)

    // Directly after the social row in the tab order — it reads as part of that
    // group, so it must not be reachable only by scrolling past the link lists.
    await page.locator('.footer-social__link').last().focus()
    await page.keyboard.press('Tab')
    await expect(sponsor).toBeFocused()
  })

  test('sponsor heart takes a distinct colour in each theme', async ({ page }) => {
    // Polled, not read once: themes.css crossfades colour over 250ms via
    // html.theme-transitioning, so a single read after the switch samples a
    // blend of the two pinks and fails on a value that is only ever in flight.
    const heartColour = () =>
      expect
        .poll(() => page.locator('.footer-sponsor__heart').evaluate((n) => getComputedStyle(n).color))

    await page.emulateMedia({ colorScheme: 'light' })
    await page.goto('/')
    await page.locator('.footer-sponsor').scrollIntoViewIfNeeded()
    // Both are GitHub's sponsor pinks; the point is that the token actually
    // re-resolves rather than the light value bleeding into dark mode.
    await heartColour().toBe('rgb(191, 57, 137)')

    await page.emulateMedia({ colorScheme: 'dark' })
    await heartColour().toBe('rgb(219, 97, 162)')
  })
})
