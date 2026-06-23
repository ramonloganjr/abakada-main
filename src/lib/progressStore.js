// @ts-check
// Central, privacy-first learner state. Everything lives in localStorage (no
// account, no network) and is shared by the learning-path pages, the offline
// pack manager, and the unified profile dashboard.
//
// Two design choices make the dashboard "just work":
//   1. One naming convention for every key (see below) so the profile can scan
//      and aggregate progress across ALL toolkits without being told about them.
//   2. A tiny change bus — emitChange()/onChange() — so any mutation anywhere
//      (explore a tool, finish a task, download a pack, flip lite mode) makes the
//      dashboard recompute instantly, in this tab and across tabs.

export const PROGRESS_PREFIX = 'abakada_progress_' // + toolkitId -> string[] of explored tool ids
export const TASKS_PREFIX = 'abakada_tasks_'       // + toolkitId -> string[] of `${stageId}::${i}`
const ACTIVITY_KEY = 'abakada_activity'            // string[] of unique ISO day stamps (YYYY-MM-DD)
const RECENT_KEY = 'abakada_recent_toolkit'        // last toolkit the learner engaged with
const PACKS_KEY = 'abakada_packs'                  // { [toolkitId]: PackMeta }
const BADGES_SEEN_KEY = 'abakada_badges_seen'      // string[] badge ids already celebrated

export const CHANGE_EVENT = 'abakada:progress'

const hasWindow = typeof window !== 'undefined'
const hasLS = (() => {
  try { return hasWindow && !!window.localStorage } catch { return false }
})()

/** @param {string} key @param {any} fallback @returns {any} */
function read(key, fallback) {
  if (!hasLS) return fallback
  try {
    const raw = window.localStorage.getItem(key)
    if (raw == null) return fallback
    return JSON.parse(raw)
  } catch { return fallback }
}

/** @param {string} key @param {any} value */
function write(key, value) {
  if (!hasLS) return
  try { window.localStorage.setItem(key, JSON.stringify(value)) } catch { /* quota / private mode */ }
}

/** Broadcast that learner state changed so reactive hooks recompute. */
export function emitChange() {
  if (!hasWindow) return
  try { window.dispatchEvent(new Event(CHANGE_EVENT)) } catch { /* no-op */ }
}

/**
 * Subscribe to learner-state changes (same tab via CHANGE_EVENT, other tabs via
 * the native storage event). Returns an unsubscribe function.
 * @param {() => void} cb
 */
export function onChange(cb) {
  if (!hasWindow) return () => {}
  const storageHandler = (/** @type {StorageEvent} */ e) => {
    // Only react to our own keys to avoid needless recomputes.
    if (!e.key || e.key.startsWith('abakada_')) cb()
  }
  window.addEventListener(CHANGE_EVENT, cb)
  window.addEventListener('storage', storageHandler)
  return () => {
    window.removeEventListener(CHANGE_EVENT, cb)
    window.removeEventListener('storage', storageHandler)
  }
}

/** @returns {string} today's local date as YYYY-MM-DD */
export function todayISO() {
  const d = new Date()
  const off = d.getTimezoneOffset()
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 10)
}

/** Record that the learner did something today (drives streaks). Idempotent per day. */
export function recordActivity() {
  const days = getActivityDays()
  const today = todayISO()
  if (days[days.length - 1] === today) return // already logged today
  if (!days.includes(today)) {
    days.push(today)
    // Keep the log bounded — a year of daily stamps is plenty for streaks.
    write(ACTIVITY_KEY, days.slice(-400))
    emitChange()
  }
}

/** @returns {string[]} sorted unique ISO day stamps */
export function getActivityDays() {
  const v = read(ACTIVITY_KEY, [])
  return Array.isArray(v) ? v.filter((x) => typeof x === 'string') : []
}

/** @param {string} toolkitId */
export function setRecentToolkit(toolkitId) {
  if (!toolkitId) return
  if (read(RECENT_KEY, null) === toolkitId) return
  write(RECENT_KEY, toolkitId)
  emitChange()
}

/** @returns {string | null} */
export function getRecentToolkit() {
  const v = read(RECENT_KEY, null)
  return typeof v === 'string' ? v : null
}

/**
 * Aggregate every toolkit's explored tools and completed tasks by scanning the
 * prefixed keys, so the profile never needs a hard-coded toolkit list.
 * @returns {{ exploredByToolkit: Record<string,string[]>, tasksByToolkit: Record<string,string[]> }}
 */
export function getAllProgress() {
  /** @type {Record<string, string[]>} */
  const exploredByToolkit = {}
  /** @type {Record<string, string[]>} */
  const tasksByToolkit = {}
  if (!hasLS) return { exploredByToolkit, tasksByToolkit }
  try {
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i)
      if (!key) continue
      if (key.startsWith(PROGRESS_PREFIX)) {
        const id = key.slice(PROGRESS_PREFIX.length)
        const arr = read(key, [])
        if (Array.isArray(arr) && arr.length) exploredByToolkit[id] = arr.filter((x) => typeof x === 'string')
      } else if (key.startsWith(TASKS_PREFIX)) {
        const id = key.slice(TASKS_PREFIX.length)
        const arr = read(key, [])
        if (Array.isArray(arr) && arr.length) tasksByToolkit[id] = arr.filter((x) => typeof x === 'string')
      }
    }
  } catch { /* ignore */ }
  return { exploredByToolkit, tasksByToolkit }
}

/* ---------------------------------------------------------------------------
   Offline pack registry — lightweight metadata kept alongside the actual cached
   responses (which live in the durable `abakada-packs` Cache Storage bucket).
   --------------------------------------------------------------------------- */

/** @typedef {{ urls: string[], bytes: number, count: number, downloadedAt: string }} PackMeta */

/** @returns {Record<string, PackMeta>} */
export function getPacks() {
  const v = read(PACKS_KEY, {})
  return v && typeof v === 'object' && !Array.isArray(v) ? v : {}
}

/** @param {string} toolkitId @param {PackMeta} meta */
export function setPack(toolkitId, meta) {
  const packs = getPacks()
  packs[toolkitId] = meta
  write(PACKS_KEY, packs)
  emitChange()
}

/** @param {string} toolkitId */
export function removePackMeta(toolkitId) {
  const packs = getPacks()
  if (!(toolkitId in packs)) return
  delete packs[toolkitId]
  write(PACKS_KEY, packs)
  emitChange()
}

/** @param {string} toolkitId @returns {boolean} */
export function isPackDownloaded(toolkitId) {
  return !!getPacks()[toolkitId]
}

/* --- badge celebration bookkeeping --- */

/** @returns {string[]} */
export function getSeenBadges() {
  const v = read(BADGES_SEEN_KEY, [])
  return Array.isArray(v) ? v : []
}

/** @param {string[]} ids mark these badge ids as already celebrated */
export function markBadgesSeen(ids) {
  if (!ids || !ids.length) return
  const seen = new Set(getSeenBadges())
  ids.forEach((id) => seen.add(id))
  write(BADGES_SEEN_KEY, [...seen])
}
