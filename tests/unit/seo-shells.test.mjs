import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

// The prerendered shells are what crawlers read before any JS runs. sitemap.xml
// advertises hreflang alternates for /tl, /ilo and /bis, and until these shells
// existed those URLs fell through the SPA rewrite to the English index.html —
// so every declared alternate served English metadata.
//
// This asserts the bundles carry the copy those shells are built from. It reads
// the translation files rather than dist/, so it runs without a build.
const LANGS = ['en', 'tl', 'ilo', 'bis']
const load = (l) =>
  JSON.parse(readFileSync(new URL(`../../public/assets/data/translations/${l}.json`, import.meta.url)))

// Keys mirror the static routes in scripts/prerender-shells.js, plus `home`
// for the /<lang> roots.
const PAGES = [
  'home', 'about', 'faq', 'privacy', 'contact', 'partnerships', 'official-partners',
  'learning-paths', 'educators', 'students', 'compare', 'sitemap', 'glossary', 'guide', 'terms',
]

for (const lang of LANGS) {
  const bundle = load(lang)

  test(`${lang}.json defines seo copy for every prerendered route`, () => {
    assert.ok(bundle.seo, `${lang} has no seo namespace`)
    const missing = PAGES.filter((p) => !bundle.seo[p]?.title || !bundle.seo[p]?.description)
    assert.deepEqual(missing, [], `${lang} missing seo copy for: ${missing.join(', ')}`)
  })

  test(`${lang}.json seo copy is not left in English`, () => {
    if (lang === 'en') return
    const en = load('en').seo
    // Brand-only titles can legitimately match; require the description — the
    // longest, most language-specific field — to differ.
    const untranslated = PAGES.filter((p) => bundle.seo[p].description === en[p].description)
    assert.deepEqual(untranslated, [], `${lang} descriptions still English for: ${untranslated.join(', ')}`)
  })

  test(`${lang}.json seo descriptions stay within the meta-description budget`, () => {
    // Google truncates display around 160 characters. Filipino, Ilokano and
    // Cebuano run noticeably longer than English for the same meaning, so this
    // is the check most likely to catch a regression when copy is edited.
    //
    // English is held to a looser bound: `terms` predates this work at 170 and
    // is already indexed, so tightening it is an SEO copy change rather than a
    // localization fix.
    const limit = lang === 'en' ? 175 : 165
    const tooLong = PAGES
      .map((p) => [p, bundle.seo[p].description.length])
      .filter(([, len]) => len > limit)
    assert.deepEqual(tooLong, [], `${lang} descriptions exceed ${limit} chars: ${JSON.stringify(tooLong)}`)
  })

  test(`${lang}.json home seo keeps its interpolation placeholders`, () => {
    // The prerenderer substitutes these from tools.json; dropping one in
    // translation would ship a literal "{count}" in the <title>.
    assert.match(bundle.seo.home.title, /\{count\}/, `${lang} home title lost {count}`)
    assert.match(bundle.seo.home.description, /\{count\}/, `${lang} home description lost {count}`)
    assert.match(bundle.seo.home.description, /\{categories\}/, `${lang} home description lost {categories}`)
  })
}
