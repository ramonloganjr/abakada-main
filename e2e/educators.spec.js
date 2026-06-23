import { test, expect } from '@playwright/test'

test.describe('educators page', () => {
  test('renders hero, value props and the strand browser', async ({ page }) => {
    await page.goto('/educators')
    await expect(page.locator('.page-hero__title')).toContainText(/classroom/i)
    await expect(page.locator('.edu-value')).toHaveCount(4)
    await expect(page.locator('.edu-strand').first()).toBeVisible()
  })

  test('selecting a strand updates the URL and shows aligned learning paths', async ({ page }) => {
    await page.goto('/educators')
    await page.locator('.edu-strand', { hasText: 'STEM' }).click()
    await expect(page).toHaveURL(/strand=STEM/)
    await expect(page.locator('.edu-path-card').first()).toBeVisible()
  })

  test('features the Teacher’s Digital Classroom path', async ({ page }) => {
    await page.goto('/educators')
    const featured = page.locator('.edu-featured')
    await expect(featured).toBeVisible()
    await expect(featured.locator('a[href$="/learning-paths/teacher-digital-classroom"]')).toBeVisible()
  })

  test('shows the classroom starter kit and an expandable parent FAQ', async ({ page }) => {
    await page.goto('/educators')
    await expect(page.locator('.edu-kit__grid .card').first()).toBeVisible()
    const firstFaq = page.locator('.edu-faq__item').first()
    await firstFaq.locator('summary').click()
    await expect(firstFaq.locator('.edu-faq__a')).toBeVisible()
  })
})
