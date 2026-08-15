/**
 * Shared e2e helpers.
 */

import { expect } from '@playwright/test'

/**
 * The rail breakpoint. Must stay in step with the `min-width: 768px` blocks in
 * layout.css and the `isRailViewport()` gate in App.jsx — below it the rail is
 * the off-canvas drawer, not a dismissible overlay.
 */
const RAIL_MIN_WIDTH = 768

/**
 * Open a static (non-home) page with the category sidebar rail dismissed.
 *
 * On `body.static-page` routes the rail is expanded by default from 768px up and
 * deliberately *overlays* the content (those pages keep `.site-main`
 * margin-left: 0 — see the "Non-home sidebar rail" block in layout.css). It is a
 * temporary drawer: clicking outside it or pressing Escape collapses it.
 *
 * Tests that skip that dismissal can only reach content outside the rail's
 * 280px column, which made them silently engine-dependent — an element's exact
 * x position shifts with each browser's font metrics, so the same click passed
 * on one engine and hit the rail on another. Dismissing first is both what a
 * real user does and what makes the assertions deterministic.
 *
 * Dismissal has to be driven off the app's own state rather than fired blind.
 * `page.goto` resolves on `load`, but the rail is client-rendered and its
 * Escape handler only attaches in a post-mount effect, so a single unprompted
 * keypress is a lost update: if nothing is listening yet the press is dropped
 * and never replayed, and the rail stays open until the test times out. Every
 * step below therefore waits for an observable commit from the app.
 *
 * @param {import('@playwright/test').Page} page
 * @param {string} path
 */
export async function gotoStaticPage(page, path) {
  await page.goto(path)

  // Hydration gate. `body.static-page` is toggled in the same layout effect that
  // governs the rail, so its presence means the route's render has committed and
  // the dismiss handlers are attached — the precondition for anything below.
  await expect(page.locator('body.static-page')).toHaveCount(1)
  await page.locator('#sidebar').waitFor({ state: 'attached' })

  // Below the breakpoint the rail is the off-canvas drawer and is already shut;
  // App.jsx's handler returns before touching state, so `sidebar-collapsed`
  // would never appear and waiting on it would hang. Nothing to dismiss here.
  const width = page.viewportSize()?.width ?? RAIL_MIN_WIDTH
  if (width >= RAIL_MIN_WIDTH) {
    // Retry the press until the app acknowledges it through its own state,
    // which closes the lost-keypress race described above.
    await expect(async () => {
      await page.keyboard.press('Escape')
      await expect(page.locator('body.sidebar-collapsed')).toHaveCount(1, { timeout: 250 })
    }).toPass({ timeout: 10_000 })
  }

  // Let the slide-out finish. Until the rail is fully off-canvas it still covers
  // a 280px column, and a click aimed at what is behind it lands on the rail
  // instead — the engine-dependent flake this helper exists to prevent.
  // The element must exist to satisfy this: treating "not rendered yet" as
  // "already dismissed" is what let callers run against a rail that was still
  // sliding into view.
  await page.waitForFunction(() => {
    const sb = document.getElementById('sidebar')
    return !!sb && sb.getBoundingClientRect().right <= 0
  })
}
