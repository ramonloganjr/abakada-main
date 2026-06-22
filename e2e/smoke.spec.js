import { test, expect } from '@playwright/test'

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
})

test.describe('tool detail — evaluate, try, install', () => {
  test('shows alternative-to, action buttons and a platform-aware install guide', async ({ page }) => {
    await page.goto('/tools/libreoffice')
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
