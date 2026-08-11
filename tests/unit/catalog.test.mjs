import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import {
  isFossTool,
  getAppStoreLinks,
  CATALOG_TOOL_COUNT,
  CATALOG_CATEGORY_COUNT,
  catalogToolCount,
} from '../../src/lib/catalog.js'
import { fillTemplate } from '../../src/lib/template.js'

const data = JSON.parse(
  readFileSync(new URL('../../public/assets/data/tools.json', import.meta.url)),
)
const tools = data.tools

// These guard the numbers quoted in the homepage title, meta description, FAQ,
// and platform guide. They are stated by hand because the copy is built before
// tools.json is fetched, so without this test they silently go stale — which is
// exactly what happened before (the copy said 1,288 against 1,289 records).
test('the tool count quoted in site copy matches tools.json', () => {
  assert.equal(CATALOG_TOOL_COUNT, tools.length)
  assert.equal(CATALOG_TOOL_COUNT, data.stats.totalTools)
})

test('the category count quoted in site copy matches tools.json', () => {
  assert.equal(CATALOG_CATEGORY_COUNT, data.categories.length)
  assert.equal(CATALOG_CATEGORY_COUNT, data.stats.totalCategories)
})

test('catalogToolCount formats to en-US regardless of runtime locale', () => {
  assert.equal(catalogToolCount(), tools.length.toLocaleString('en-US'))
  assert.match(catalogToolCount(), /^\d,\d{3}$/)
})

test('stats.fossTools matches the number of records flagged open-source', () => {
  assert.equal(data.stats.fossTools, tools.filter((t) => t.is_foss === true).length)
})

test('isFossTool trusts the explicit is_foss flag over the licence string', () => {
  assert.equal(isFossTool({ is_foss: true, license: 'Proprietary' }), true)
  assert.equal(isFossTool({ is_foss: false, license: 'MIT' }), false)
})

test('isFossTool falls back to sniffing the licence when the flag is absent', () => {
  assert.equal(isFossTool({ license: 'AGPL-3.0' }), true)
  assert.equal(isFossTool({ license: 'bsd-3-clause' }), true)
  assert.equal(isFossTool({ license: 'Freeware' }), false)
  assert.equal(isFossTool({}), false)
  assert.equal(isFossTool(null), false)
})

test('getAppStoreLinks returns only the stores a record actually lists', () => {
  assert.deepEqual(getAppStoreLinks({}), [])
  assert.deepEqual(getAppStoreLinks(null), [])

  const android = getAppStoreLinks({ android_url: 'https://play.google.com/store/apps/details?id=x' })
  assert.deepEqual(android.map((l) => l.id), ['android'])
  assert.equal(android[0].label, 'Google Play')
  assert.equal(android[0].icon, 'android')

  const both = getAppStoreLinks({ android_url: 'https://play.example', ios_url: 'https://apps.example' })
  assert.deepEqual(both.map((l) => l.id), ['android', 'ios'])
  assert.deepEqual(both.map((l) => l.label), ['Google Play', 'App Store'])
})

test('store URLs in the catalog point at the matching store and a listed platform', () => {
  const withStores = tools.filter((t) => t.android_url || t.ios_url)
  assert.ok(withStores.length > 0, 'expected at least one record with app-store links')

  for (const tool of withStores) {
    if (tool.android_url) {
      assert.match(tool.android_url, /^https:\/\/play\.google\.com\//, `${tool.id} android_url`)
      assert.ok((tool.platforms || []).includes('android'), `${tool.id} lists android_url but not the android platform`)
    }
    if (tool.ios_url) {
      assert.match(tool.ios_url, /^https:\/\/apps\.apple\.com\//, `${tool.id} ios_url`)
      assert.ok((tool.platforms || []).includes('ios'), `${tool.id} lists ios_url but not the ios platform`)
    }
  }
})

test('fillTemplate substitutes known keys and leaves unknown ones visible', () => {
  assert.equal(fillTemplate('{a} and {b}', { a: '1', b: '2' }), '1 and 2')
  assert.equal(fillTemplate('{count} tools', { count: 1291 }), '1291 tools')
  assert.equal(fillTemplate('{missing}', {}), '{missing}')
  assert.equal(fillTemplate('no placeholders', { a: '1' }), 'no placeholders')
})

test('every language keeps the {count} placeholder in hero.definition', () => {
  for (const lang of ['en', 'tl', 'ilo', 'bis']) {
    const t = JSON.parse(
      readFileSync(new URL(`../../public/assets/data/translations/${lang}.json`, import.meta.url)),
    )
    assert.match(t.hero.definition, /\{count\}/, `${lang}.json lost the {count} placeholder`)
    assert.doesNotMatch(t.hero.definition, /\d,\d{3}/, `${lang}.json hardcodes a catalog size again`)
  }
})
