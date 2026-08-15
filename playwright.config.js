import { defineConfig, devices } from '@playwright/test'

// E2E config. Tests run against the Vite dev server (auto-started below) so no
// build step is required; `reuseExistingServer` lets a dev server you already have
// open be reused locally instead of spawning a second one.
export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  // `list` keeps the CI log readable as it streams. The HTML report is what the
  // workflow's upload-artifact step actually collects, and it bundles the
  // `on-first-retry` traces as attachments — with `list` alone no
  // playwright-report/ was ever written, so every red run uploaded nothing and
  // a failure could only be diagnosed by reproducing it locally.
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  // Cross-browser matrix. Chromium alone missed engine-specific regressions, so
  // we also run Gecko (Firefox) and WebKit — the latter doubles as the closest
  // available proxy for iOS Safari, which every iPhone browser is required to
  // use. The two mobile projects cover the touch/viewport paths (hamburger nav,
  // tap targets) that no desktop project exercises.
  // Locally, `--project=chromium` keeps the fast inner loop.
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile-safari', use: { ...devices['iPhone 13'] } },
    { name: 'mobile-chrome', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: 'npm run dev -- --port 5173 --strictPort',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
