#!/usr/bin/env node
// Build a lightweight catalog index (id/name/tagline/category/platforms/searchTerms)
// — much smaller than tools.json because it drops long descriptions. This is the
// foundation for scaling search past a few thousand tools: the listing/search UI
// can load this slim index while full records are fetched per tool-detail page.
// Generated into public/ (committed, like sitemap.xml) so it ships with the build.
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const tools = JSON.parse(readFileSync(resolve(ROOT, 'public/assets/data/tools.json'), 'utf8'))

const index = (tools.tools || []).map((t) => ({
  id: t.id,
  name: t.name,
  tagline: t.tagline || '',
  category: t.category,
  platforms: t.platforms || [],
  tags: (t.tags || []).slice(0, 5),
  searchTerms: t.searchTerms || `${t.name} ${t.tagline || ''} ${(t.tags || []).join(' ')}`.toLowerCase(),
}))

const payload = JSON.stringify({ count: index.length, tools: index })
writeFileSync(resolve(ROOT, 'public/assets/data/tools-index.json'), payload)
console.log(`[search-index] wrote ${index.length} entries (~${(Buffer.byteLength(payload) / 1024).toFixed(0)} KB)`)
