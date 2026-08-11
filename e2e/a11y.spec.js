import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { gotoStaticPage } from './helpers.js'

// Automated WCAG checks on the key surfaces (review item 6). We gate on
// serious/critical violations against WCAG 2.0/2.1/2.2 A & AA. `color-contrast`
// is excluded here because the 45-colour category palette is audited
// separately; every other rule must pass.
// WCAG 2.2 note: the 2.2 tags add SC 2.5.8 Target Size (Minimum), which is what
// caught the 8px featured-carousel dots. Keep these tags on — dropping them
// silently un-tests every 2.2-only success criterion.
const PAGES = ['/', '/educators', '/students', '/learning-paths', '/tools/libreoffice', '/progress']

for (const path of PAGES) {
  test(`a11y: ${path} has no serious or critical violations`, async ({ page }) => {
    await page.goto(path)
    await page.waitForLoadState('networkidle')

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22a', 'wcag22aa'])
      .disableRules(['color-contrast'])
      .analyze()

    const blocking = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical')
    const summary = blocking.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length }))
    expect(summary, JSON.stringify(summary, null, 2)).toEqual([])
  })
}

// The pass above always runs with the sidebar rail expanded, which left the
// *collapsed* rail untested on every static page. That state used to keep the
// in-rail collapse button in the DOM, off-canvas and clipped but still focusable
// and still counted as a pointer target — a SC 2.5.8 failure and a second
// control sharing the reopen tab's "Expand sidebar" name. Audit both states.
for (const path of ['/tools/libreoffice', '/faq', '/compare']) {
  test(`a11y: ${path} with the sidebar rail collapsed`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 })
    await gotoStaticPage(page, path)

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22a', 'wcag22aa'])
      .disableRules(['color-contrast'])
      .analyze()

    const blocking = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical')
    const summary = blocking.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.map((n) => n.target) }))
    expect(summary, JSON.stringify(summary, null, 2)).toEqual([])
  })
}

test('a11y: the collapsed rail exposes exactly one "Expand sidebar" control', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await gotoStaticPage(page, '/tools/libreoffice')
  await expect(page.getByRole('button', { name: 'Expand sidebar' })).toHaveCount(1)

  // Reopening restores the in-rail control, and closing again returns to one.
  await page.getByRole('button', { name: 'Expand sidebar' }).click()
  await expect(page.getByRole('button', { name: 'Collapse sidebar' })).toBeVisible()
  await page.getByRole('button', { name: 'Collapse sidebar' }).click()
  await expect(page.getByRole('button', { name: 'Expand sidebar' })).toHaveCount(1)
})
