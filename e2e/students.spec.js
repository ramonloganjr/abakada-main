import { test, expect } from '@playwright/test'

test.describe('students page', () => {
  test('renders hero, trust row and the goal browser', async ({ page }) => {
    await page.goto('/students')
    await expect(page.locator('.page-hero__title')).toContainText(/student/i)
    await expect(page.locator('.stu-trust__item')).toHaveCount(3)
    await expect(page.locator('.stu-goal')).toHaveCount(8)
  })

  test('selecting a goal updates the URL and shows matching tools', async ({ page }) => {
    await page.goto('/students')
    await page.locator('.stu-goal', { hasText: 'Edit photos' }).click()
    await expect(page).toHaveURL(/do=photos/)
    await expect(page.locator('.stu-goal__grid .card').first()).toBeVisible()
  })

  test('shows student learning paths with a Start here badge', async ({ page }) => {
    await page.goto('/students')
    await expect(page.locator('.stu-paths .edu-path-card').first()).toBeVisible()
    await expect(page.locator('.stu-badge')).toHaveCount(1)
  })

  test('shows free-vs-paid swaps and an expandable FAQ', async ({ page }) => {
    await page.goto('/students')
    await expect(page.locator('.stu-swap__item').first()).toBeVisible()
    const firstFaq = page.locator('.edu-faq__item').first()
    await firstFaq.locator('summary').click()
    await expect(firstFaq.locator('.edu-faq__a')).toBeVisible()
  })
})
