// @ts-check
// Pure helpers for reading a tools.json record. Kept free of React, i18n, and the
// DOM so they are trivially unit-testable; components layer translation and
// presentation on top (same split as `install.js`).

// Headline catalog figures quoted in prose and SEO copy: the homepage title and
// meta description, the FAQ, the platform guide. tools.json is fetched at runtime,
// long after those strings are constructed, so the numbers cannot be derived where
// they are used and have to be stated. Stating them once here keeps the copy in
// one place, and tests/unit/catalog.test.mjs asserts both against tools.json, so
// adding a tool without updating them fails CI instead of silently drifting.
export const CATALOG_TOOL_COUNT = 1291
export const CATALOG_CATEGORY_COUNT = 45

// "1,291" — fixed to en-US so the figure is identical in prerendered HTML and in
// the browser, whatever locale the visitor's runtime defaults to.
export const catalogToolCount = () => CATALOG_TOOL_COUNT.toLocaleString('en-US')

// License identifiers that mark a record as free/open-source when the explicit
// `is_foss` flag is absent. Matched case-insensitively against `license`.
const FOSS_LICENSE_HINTS = ['MIT', 'GPL', 'LGPL', 'Apache', 'BSD', 'MPL', 'AGPL', 'CC0', 'Unlicense']

// Is this a free/open-source record? `is_foss` wins when present; otherwise fall
// back to sniffing the license string, so older records without the flag still
// get the right badge.
/** @param {import('../types').Tool | null | undefined} tool @returns {boolean} */
export function isFossTool(tool) {
  if (!tool) return false
  if (tool.is_foss != null) return tool.is_foss === true
  const license = (tool.license || '').toUpperCase()
  return FOSS_LICENSE_HINTS.some((l) => license.includes(l.toUpperCase()))
}

// Mobile app-store destinations a record can carry. Ordered Android-first to
// match the `platforms` vocabulary ordering used elsewhere in the catalog.
// `icon` reuses the existing platform glyph set, so store links inherit the same
// iconography as the platform badges rather than introducing new artwork.
/** @type {Array<{ id: string, icon: string, labelKey: string, label: string, read: (t: import('../types').Tool) => string | undefined }>} */
const APP_STORES = [
  { id: 'android', icon: 'android', labelKey: 'tools.googlePlay', label: 'Google Play', read: (t) => t.android_url },
  { id: 'ios', icon: 'ios', labelKey: 'tools.appStore', label: 'App Store', read: (t) => t.ios_url },
]

/**
 * App-store links a record actually has, in a render-ready shape.
 * URL safety is left to the caller's `isSafeUrl` check at the href, matching how
 * every other external link in the catalog is rendered.
 * @param {import('../types').Tool | null | undefined} tool
 * @returns {Array<{ id: string, url: string, icon: string, labelKey: string, label: string }>}
 */
export function getAppStoreLinks(tool) {
  if (!tool) return []
  const links = []
  for (const store of APP_STORES) {
    const url = store.read(tool)
    if (url) links.push({ id: store.id, url, icon: store.icon, labelKey: store.labelKey, label: store.label })
  }
  return links
}
