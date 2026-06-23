// @ts-check
// Offline Learning Packs: let a learner deliberately download an entire pathway
// (its page shells, every recommended tool's detail shell, and the shared data
// files) so they can keep learning with no connection — the defining need of a
// rural / unreliable-2G audience.
//
// The bytes live in a DEDICATED Cache Storage bucket, `abakada-packs`, which the
// service worker is taught never to purge (unlike the versioned app-shell cache
// that rotates on every deploy). The page can populate this bucket directly
// because the page and the SW share the same Cache Storage origin; the SW's
// global `caches.match()` then finds these entries on later offline navigations.

import { langPrefix } from './canonical'
import { setPack, removePackMeta, getPacks } from './progressStore'

export const PACKS_CACHE = 'abakada-packs'

const SHARED_DATA = [
  '/assets/data/learning-paths.json',
  '/assets/data/curriculum.json',
  '/assets/data/tools.json',
]

export function offlineSupported() {
  return typeof caches !== 'undefined' && typeof window !== 'undefined'
}

/**
 * Same-origin URLs that make a toolkit fully usable offline.
 * @param {any} toolkit a learning-paths.json toolkit
 * @param {string} [lang]
 * @returns {string[]}
 */
export function computePackUrls(toolkit, lang = 'en') {
  if (!toolkit) return []
  const base = langPrefix(lang) // '' for en, '/tl' etc.
  const urls = new Set()

  // Shared catalogue + curriculum data (idempotent across packs).
  SHARED_DATA.forEach((u) => urls.add(u))

  // The path's own prerendered shell.
  urls.add(`${base}/learning-paths/${toolkit.id}`)

  // Every recommended tool's detail shell.
  const toolIds = [...new Set((toolkit.stages || []).flatMap((/** @type {any} */ s) => s.toolIds || []))]
  toolIds.forEach((id) => urls.add(`${base}/tools/${id}`))

  return [...urls]
}

/**
 * Rough size estimate (bytes) before downloading, so the UI can warn 2G users.
 * tools.json dominates and is shared, so we count it once. Shells are tiny.
 * @param {string[]} urls
 */
export function estimatePackBytes(urls) {
  let bytes = 0
  for (const u of urls) {
    if (u.endsWith('tools.json')) bytes += 1_250_000
    else if (u.endsWith('learning-paths.json')) bytes += 45_000
    else if (u.endsWith('curriculum.json')) bytes += 8_000
    else bytes += 9_000 // a prerendered route shell, gzipped-ish guess
  }
  return bytes
}

/** Human-friendly byte size. @param {number} bytes */
export function formatBytes(bytes) {
  if (!bytes || bytes < 1024) return `${bytes || 0} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/**
 * Download a pack into the durable cache. Resilient: one failed asset never
 * fails the whole pack (Promise-style loop with per-item catch). Reports
 * progress and records real cached byte totals.
 *
 * @param {any} toolkit
 * @param {{ lang?: string, onProgress?: (done:number,total:number)=>void, signal?: AbortSignal }} [opts]
 * @returns {Promise<{ ok: boolean, cached: number, total: number, bytes: number, urls: string[] }>}
 */
export async function downloadPack(toolkit, { lang = 'en', onProgress, signal } = {}) {
  if (!offlineSupported()) throw new Error('offline-unsupported')
  const urls = computePackUrls(toolkit, lang)
  const cache = await caches.open(PACKS_CACHE)

  let done = 0
  let bytes = 0
  const cachedUrls = []
  onProgress?.(0, urls.length)

  for (const url of urls) {
    if (signal?.aborted) break
    try {
      const res = await fetch(url, { cache: 'reload' })
      if (res && res.ok) {
        // Measure before storing (clone so the body is still available to put).
        try {
          const buf = await res.clone().arrayBuffer()
          bytes += buf.byteLength
        } catch { /* size best-effort */ }
        await cache.put(url, res)
        cachedUrls.push(url)
      }
    } catch {
      // Skip this asset; keep going.
    }
    done++
    onProgress?.(done, urls.length)
  }

  const meta = {
    urls: cachedUrls,
    bytes,
    count: cachedUrls.length,
    downloadedAt: new Date().toISOString(),
  }
  setPack(toolkit.id, meta)

  return { ok: cachedUrls.length > 0, cached: cachedUrls.length, total: urls.length, bytes, urls: cachedUrls }
}

/**
 * Delete a pack's cached responses and registry entry. Shared data files
 * (tools.json etc.) are only removed if no other downloaded pack still needs
 * them, so removing one path never breaks another.
 * @param {string} toolkitId
 */
export async function removePack(toolkitId) {
  const packs = getPacks()
  const meta = packs[toolkitId]
  if (!offlineSupported() || !meta) { removePackMeta(toolkitId); return }

  // URLs still referenced by other packs must be kept.
  const keep = new Set()
  Object.entries(packs).forEach(([id, m]) => {
    if (id === toolkitId) return
    ;(m.urls || []).forEach((u) => keep.add(u))
  })

  const cache = await caches.open(PACKS_CACHE)
  await Promise.all(
    (meta.urls || []).map((u) => (keep.has(u) ? Promise.resolve(false) : cache.delete(u))),
  )
  removePackMeta(toolkitId)
}
