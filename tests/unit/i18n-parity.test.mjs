import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const LANGS = ['en', 'tl', 'ilo', 'bis']
const load = (l) => JSON.parse(readFileSync(new URL(`../../public/assets/data/translations/${l}.json`, import.meta.url)))

// Flatten to dotted leaf-key paths (objects recurse; arrays/strings are leaves).
function leafKeys(obj, prefix = '', acc = []) {
  for (const k of Object.keys(obj)) {
    const v = obj[k]
    const path = prefix ? `${prefix}.${k}` : k
    if (v && typeof v === 'object' && !Array.isArray(v)) leafKeys(v, path, acc)
    else acc.push(path)
  }
  return acc
}

const en = new Set(leafKeys(load('en')))

for (const lang of LANGS.filter((l) => l !== 'en')) {
  test(`${lang}.json has every key present in en.json (no silent English fallback)`, () => {
    const keys = new Set(leafKeys(load(lang)))
    const missing = [...en].filter((k) => !keys.has(k))
    assert.deepEqual(missing, [], `${lang} is missing ${missing.length} key(s): ${missing.slice(0, 15).join(', ')}`)
  })
}
