/**
 * Client-side security hardening
 * Layers: anti-scraping signals, devtools detection, request throttling
 *
 * NOTE: Client-side measures are a deterrent, not a guarantee.
 * Real protection requires server-side rate limiting and WAF rules.
 */

// ─── Honeypot field name (used in any future forms) ──────────────────────────
export const HONEYPOT_FIELD = 'website_url'

// ─── Rate limiter for data fetches ───────────────────────────────────────────
const _fetchLog = new Map() // url → [timestamps]

/**
 * Returns false if the caller is fetching too fast (scraper signal).
 * Allows up to `limit` fetches per `windowMs`.
 */
export function checkFetchRate(key, limit = 30, windowMs = 60_000) {
  const now = Date.now()
  const log = (_fetchLog.get(key) || []).filter(t => now - t < windowMs)
  log.push(now)
  _fetchLog.set(key, log)
  return log.length <= limit
}

// ─── Passive bot signals ──────────────────────────────────────────────────────
export function collectBotSignals() {
  const signals = {
    noPointer:    !window.matchMedia('(pointer: fine)').matches && !window.matchMedia('(pointer: coarse)').matches,
    noTouch:      !('ontouchstart' in window) && navigator.maxTouchPoints === 0,
    headless:     /HeadlessChrome|PhantomJS|Selenium|WebDriver/.test(navigator.userAgent),
    webdriver:    Boolean(navigator.webdriver),
    noPlugins:    navigator.plugins?.length === 0,
    noLanguages:  !navigator.languages || navigator.languages.length === 0,
    tinyViewport: window.innerWidth < 100 || window.innerHeight < 100,
  }
  const score = Object.values(signals).filter(Boolean).length
  return { signals, score, likelyBot: score >= 3 }
}

// ─── Devtools detection (passive, no blocking) ───────────────────────────────
let _devtoolsOpen = false
const _devtoolsCallbacks = []
let _devtoolsTimer = null

function _checkDevTools() {
  const threshold = 160
  const widthDiff  = window.outerWidth  - window.innerWidth
  const heightDiff = window.outerHeight - window.innerHeight
  const opened = widthDiff > threshold || heightDiff > threshold
  if (opened && !_devtoolsOpen) {
    _devtoolsOpen = true
    _devtoolsCallbacks.forEach(cb => cb())
  } else if (!opened) {
    _devtoolsOpen = false
  }
}

// Start polling only when a consumer actually registers interest, so we never
// run a 1.5s timer forever for no reason (the previous version always did).
export function onDevToolsOpen(cb) {
  _devtoolsCallbacks.push(cb)
  if (!_devtoolsTimer && import.meta.env.PROD) {
    _devtoolsTimer = setInterval(_checkDevTools, 1500)
  }
}

// ─── Disable right-click context menu on tool data cards ─────────────────────
export function disableContextMenuOn(selector) {
  document.addEventListener('contextmenu', e => {
    if (e.target?.closest && e.target.closest(selector)) {
      e.preventDefault()
    }
  })
}

// ─── Disable text selection on tool card content ─────────────────────────────
export function disableSelectOn(selector) {
  document.addEventListener('selectstart', e => {
    if (e.target?.closest && e.target.closest(selector)) {
      e.preventDefault()
    }
  })
}

// ─── Console warning for curious visitors ────────────────────────────────────
export function printConsoleWarning() {
  if (import.meta.env.PROD) {
    console.log(
      '%c⚠ Stop!',
      'color: #ff4444; font-size: 2rem; font-weight: bold;'
    )
    console.log(
      '%cThis is a browser feature intended for developers. If someone told you to paste something here, it is a scam and will give them access to your data.',
      'color: #e6edf3; font-size: 1rem;'
    )
    console.log(
      '%cAbakada © 2026 — Unauthorized scraping or data extraction is prohibited.',
      'color: #8b949e; font-size: 0.875rem;'
    )
  }
}

// ─── Obfuscate email addresses in the DOM ────────────────────────────────────
/**
 * Usage: deobfuscateEmail('partnerships', 'abakada.org')
 * Returns the assembled email string — never written as plain text in source.
 */
export function deobfuscateEmail(user, domain) {
  return `${user}\u0040${domain}`
}

// ─── Session fingerprint (lightweight, privacy-safe) ─────────────────────────
export function getSessionFingerprint() {
  const parts = [
    navigator.language,
    screen.colorDepth,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset(),
    navigator.hardwareConcurrency || 0,
  ]
  return parts.join('|')
}
