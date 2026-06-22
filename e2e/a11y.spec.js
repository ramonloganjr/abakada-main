import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

// Automated WCAG checks on the key surfaces (review item 6). We gate on
// serious/critical violations against WCAG 2.0/2.1 A & AA. `color-contrast` is
// excluded here because the 45-colour category palette is audited separately;
// every other rule must pass.
const PAGES = ['/', '/educators', '/students', '/learning-paths', '/tools/libreoffice']

for (const path of PAGES) {
  test(`a11y: ${path} has no serious or critical violations`, async ({ page }) => {
    await page.goto(path)
    await page.waitForLoadState('networkidle')

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .disableRules(['color-contrast'])
      .analyze()

    const blocking = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical')
    const summary = blocking.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length }))
    expect(summary, JSON.stringify(summary, null, 2)).toEqual([])
  })
}
