/**
 * Shared e2e helpers.
 */

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
 * @param {import('@playwright/test').Page} page
 * @param {string} path
 */
export async function gotoStaticPage(page, path) {
  await page.goto(path)
  // Escape is a no-op below 768px, where the rail is an off-canvas drawer that
  // is already closed — so this is safe for the mobile projects too.
  await page.keyboard.press('Escape')
  await page.waitForFunction(() => {
    const sb = document.getElementById('sidebar')
    if (!sb) return true
    // Collapsed means translated fully off-canvas; wait for the transition to
    // finish so the rail is not still sliding over the content when we click.
    return sb.getBoundingClientRect().right <= 0
  })
}
