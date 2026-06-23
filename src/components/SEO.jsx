import { Helmet } from 'react-helmet-async'
import { SITE_ORIGIN, hreflangMap } from '../lib/canonical'

const DEFAULT_IMAGE = `${SITE_ORIGIN}/assets/logo/og.png`

/**
 * SEO — per-page <head> management.
 *
 * Props:
 *  - title         page title (will be appended with " | Abakada" unless `rawTitle`)
 *  - rawTitle      if true, use `title` verbatim
 *  - description   meta description (≤160 chars recommended)
 *  - canonical     absolute URL of this page; falls back to current pathname
 *  - pathname      relative path used to derive hreflang alternates
 *  - image         absolute OG image URL (defaults to /assets/logo/og.png)
 *  - jsonLd        a JSON-LD object or array of objects
 *  - noindex       if true, emit <meta name="robots" content="noindex,follow">
 *  - lang          ISO code (en|tl|ilo|bis); used for og:locale
 *  - locale        BCP-47 locale (e.g. "en_PH"); overrides default mapping
 */
export default function SEO({
  title,
  rawTitle = false,
  description,
  canonical,
  pathname = '/',
  image = DEFAULT_IMAGE,
  jsonLd,
  noindex = false,
  lang = 'en',
  locale,
}) {
  const fullTitle = rawTitle ? title : `${title} | Abakada`
  const url = canonical || `${SITE_ORIGIN}${pathname}`
  const hreflang = hreflangMap(pathname)
  const ogLocaleMap = { en: 'en_PH', tl: 'tl_PH', ilo: 'ilo_PH', bis: 'ceb_PH' }
  const ogLocale = locale || ogLocaleMap[lang] || 'en_PH'
  const jsonLdArr = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : []

  return (
    <Helmet prioritizeSeoTags>
      <html lang={lang === 'bis' ? 'ceb' : lang} />
      <title>{fullTitle}</title>
      {description ? <meta name="description" content={description} /> : null}
      <link rel="canonical" href={url} />
      {noindex ? (
        <meta name="robots" content="noindex,follow" />
      ) : (
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      )}

      {/* Hreflang alternates */}
      {Object.entries(hreflang).map(([code, href]) => (
        <link key={code} rel="alternate" hrefLang={code} href={href} />
      ))}

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Abakada" />
      <meta property="og:title" content={fullTitle} />
      {description ? <meta property="og:description" content={description} /> : null}
      <meta property="og:url" content={url} />
      <meta property="og:locale" content={ogLocale} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@AbakadaOrg" />
      <meta name="twitter:title" content={fullTitle} />
      {description ? <meta name="twitter:description" content={description} /> : null}
      <meta name="twitter:image" content={image} />

      {jsonLdArr.map((obj, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(obj)}
        </script>
      ))}
    </Helmet>
  )
}
