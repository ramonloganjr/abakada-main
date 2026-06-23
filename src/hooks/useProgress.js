import { useState, useEffect, useCallback } from 'react'
import { PROGRESS_PREFIX, emitChange, recordActivity, setRecentToolkit } from '../lib/progressStore'

function getStorageKey(toolkitId) {
  return `${PROGRESS_PREFIX}${toolkitId}`
}

function isStorageAvailable() {
  try {
    localStorage.setItem('__progress_test__', '1')
    localStorage.removeItem('__progress_test__')
    return true
  } catch {
    return false
  }
}

function loadIds(toolkitId) {
  try {
    const raw = localStorage.getItem(getStorageKey(toolkitId))
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter(x => typeof x === 'string') : []
  } catch {
    return []
  }
}

function saveIds(toolkitId, ids) {
  try {
    localStorage.setItem(getStorageKey(toolkitId), JSON.stringify(ids))
  } catch {}
}

/**
 * Track which tools have been explored in a given toolkit.
 * Falls back to in-memory state if localStorage is unavailable.
 *
 * @param {string} toolkitId
 * @returns {{ exploredIds: string[], markExplored: Function, unmarkExplored: Function, isExplored: Function, storageUnavailable: boolean }}
 */
export function useProgress(toolkitId) {
  const [storageAvailable] = useState(() => isStorageAvailable())
  const [exploredIds, setExploredIds] = useState(() =>
    storageAvailable ? loadIds(toolkitId) : []
  )

  // Persist to localStorage whenever exploredIds changes, then notify the
  // central store so the profile dashboard (and any other tab) recomputes.
  useEffect(() => {
    if (storageAvailable && toolkitId) {
      saveIds(toolkitId, exploredIds)
      emitChange()
    }
  }, [exploredIds, toolkitId, storageAvailable])

  // Reload when toolkitId changes
  useEffect(() => {
    if (storageAvailable && toolkitId) {
      setExploredIds(loadIds(toolkitId))
    } else {
      setExploredIds([])
    }
  }, [toolkitId, storageAvailable])

  const markExplored = useCallback((id) => {
    setExploredIds(prev => prev.includes(id) ? prev : [...prev, id])
    // Exploring a tool counts as activity today and makes this the "recent" path.
    recordActivity()
    if (toolkitId) setRecentToolkit(toolkitId)
  }, [toolkitId])

  const unmarkExplored = useCallback((id) => {
    setExploredIds(prev => prev.filter(x => x !== id))
  }, [])

  const isExplored = useCallback((id) => {
    return exploredIds.includes(id)
  }, [exploredIds])

  return {
    exploredIds,
    markExplored,
    unmarkExplored,
    isExplored,
    storageUnavailable: !storageAvailable,
  }
}
