// Canonical URL helpers for SEO + sitemap consumers.
// Single source of truth for the production origin and supported languages.

export const SITE_ORIGIN = 'https://abakada.org'
export const LANGS = ['en', 'tl', 'ilo', 'bis']
export const DEFAULT_LANG = 'en'

// Map internal lang codes to BCP-47 hreflang values.
// `bis` (Cebuano) uses ISO 639-1 `ceb` for hreflang correctness.
export const HREFLANG = { en: 'en', tl: 'tl', ilo: 'ilo', bis: 'ceb' }

const trim = (p) => (p === '/' ? '' : p.replace(/\/+$/, ''))

export function canonicalUrl(pathname = '/', lang = null) {
  const base = trim(pathname || '/')
  if (!lang || lang === DEFAULT_LANG) {
    return `${SITE_ORIGIN}${base || '/'}`
  }
  return `${SITE_ORIGIN}/${lang}${base}`
}

export function hreflangMap(pathname = '/') {
  const base = trim(pathname || '/')
  const map = {}
  for (const lang of LANGS) {
    map[HREFLANG[lang]] = `${SITE_ORIGIN}/${lang}${base || ''}`
  }
  map['x-default'] = `${SITE_ORIGIN}${base || '/'}`
  return map
}

// Strip a leading `/<lang>` segment from a router pathname so we can compare
// routes regardless of the active language prefix.
export function stripLangPrefix(pathname = '/') {
  const m = pathname.match(/^\/(en|tl|ilo|bis)(\/.*)?$/)
  if (!m) return pathname
  return m[2] || '/'
}
