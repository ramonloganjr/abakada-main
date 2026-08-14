import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

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

  test(`${lang}.json defines no key absent from en.json`, () => {
    const extra = leafKeys(load(lang)).filter((k) => !en.has(k))
    assert.deepEqual(extra, [], `${lang} defines ${extra.length} orphan key(s): ${extra.slice(0, 15).join(', ')}`)
  })
}

// Interpolation is done by fillTemplate() on the *translated* string, so a
// placeholder dropped or renamed during translation surfaces as a literal
// "{count}" — or a silently missing number — in front of the user.
const placeholders = (s) => [...String(s).matchAll(/\{[a-zA-Z0-9_]+\}/g)].map((m) => m[0]).sort()

for (const lang of LANGS.filter((l) => l !== 'en')) {
  test(`${lang}.json preserves every interpolation placeholder`, () => {
    const enFlat = flatten(load('en'))
    const langFlat = flatten(load(lang))
    const bad = []
    for (const [k, v] of enFlat) {
      const other = langFlat.get(k)
      if (typeof v !== 'string' || typeof other !== 'string') continue
      const a = placeholders(v).join(',')
      const b = placeholders(other).join(',')
      if (a !== b) bad.push(`${k}: en[${a || 'none'}] vs ${lang}[${b || 'none'}]`)
    }
    assert.deepEqual(bad, [], `placeholder mismatch in ${lang}: ${bad.join(' | ')}`)
  })
}

function flatten(obj, prefix = '', out = new Map()) {
  for (const [k, v] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${k}` : k
    if (v && typeof v === 'object' && !Array.isArray(v)) flatten(v, path, out)
    else out.set(path, v)
  }
  return out
}

// Bundle-to-bundle parity above cannot catch a key the UI *asks* for that no
// bundle defines: t() returns its inline fallback, so the string renders in
// English in every language and nothing fails. `common.backToTop` shipped that
// way in the platform guide. This walks the real call sites instead.
function sourceFiles(dir, acc = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry)
    if (statSync(p).isDirectory()) sourceFiles(p, acc)
    else if (/\.jsx?$/.test(entry)) acc.push(p)
  }
  return acc
}

test('every t() key referenced in src exists in en.json', () => {
  // Only string-literal keys are checkable; t(`categories.${id}`) is resolved at
  // runtime from catalog data and is covered by the catalog tests instead.
  const RE = /\bt\(\s*['"]([a-zA-Z0-9_.]+)['"]/g
  const missing = new Map()

  for (const file of sourceFiles('src')) {
    const src = readFileSync(file, 'utf8')
    src.split(/\r?\n/).forEach((line, i) => {
      RE.lastIndex = 0
      let m
      while ((m = RE.exec(line))) {
        if (!en.has(m[1]) && !missing.has(m[1])) missing.set(m[1], `${file}:${i + 1}`)
      }
    })
  }

  const report = [...missing].map(([k, where]) => `${k} (${where})`)
  assert.deepEqual(report, [], `${report.length} key(s) referenced but undefined: ${report.join(', ')}`)
})
