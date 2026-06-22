// @ts-check
// Shared URL safety check. Only http(s) URLs are allowed to reach an href so a
// malformed or "javascript:" value in the data can never become a clickable
// script-injection vector. Used by every component that renders an external link
// from tool data (ToolModal, ToolDetail, …).
/** @param {string | null | undefined} url @returns {boolean} */
export function isSafeUrl(url) {
  if (!url) return false
  try {
    const u = new URL(url)
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}
