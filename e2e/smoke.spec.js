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
