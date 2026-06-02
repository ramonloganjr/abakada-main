import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { addToComparison, removeFromComparison } from '../lib/comparison'

const STORAGE_KEY = 'abakada_compare'
export const COMPARISON_MAX = 3
const MAX = COMPARISON_MAX

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) && parsed.every(i => typeof i === 'string') ? parsed : []
  } catch { return [] }
}

const ComparisonContext = createContext(null)

export function ComparisonProvider({ children }) {
  const [selectedIds, setSelectedIds] = useState(() => loadFromStorage())
  const [addError, setAddError] = useState(null)

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedIds)) } catch {}
  }, [selectedIds])

  const addTool = useCallback((id) => {
    const result = addToComparison(selectedIds, id)
    if (result.error === 'max_reached') {
      setAddError(result.message)
      return result.message
    }
    setSelectedIds(result.ids)
    setAddError(null)
    return null
  }, [selectedIds])

  const removeTool = useCallback((id) => {
    const result = removeFromComparison(selectedIds, id)
    setSelectedIds(result.ids)
    setAddError(null)
  }, [selectedIds])

  const clearComparison = useCallback(() => {
    setSelectedIds([])
    try { localStorage.removeItem(STORAGE_KEY) } catch {}
  }, [])

  // Replaces the entire selection at once — used by Compare page to seed from URL params.
  const setIds = useCallback((ids) => {
    const sanitized = Array.isArray(ids)
      ? ids.filter(id => typeof id === 'string' && id.trim().length > 0).slice(0, MAX)
      : []
    setSelectedIds(sanitized)
    setAddError(null)
  }, [])

  return (
    <ComparisonContext.Provider value={{ selectedIds, addTool, removeTool, clearComparison, setIds, addError, max: MAX }}>
      {children}
    </ComparisonContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useComparisonContext() {
  const ctx = useContext(ComparisonContext)
  if (!ctx) throw new Error('useComparisonContext must be used within a ComparisonProvider')
  return ctx
}
