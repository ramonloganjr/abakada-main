import { useState, useCallback, useRef, useMemo, useEffect } from 'react'
import { useSearchInput } from '../contexts/SearchContext'

const DEBOUNCE_MS = 150
const FUZZY_THRESHOLD = 0.72  // higher = stricter fuzzy, fewer false positives

// Levenshtein similarity ratio between two strings
function similarity(a, b) {
  if (a === b) return 1
  const la = a.length, lb = b.length
  if (!la || !lb) return 0
  // Skip if lengths are too different to ever meet threshold
  if (Math.abs(la - lb) / Math.max(la, lb) > 0.4) return 0
  const row = Array.from({ length: lb + 1 }, (_, i) => i)
  for (let i = 1; i <= la; i++) {
    let prev = i
    for (let j = 1; j <= lb; j++) {
      const val = a[i - 1] === b[j - 1]
        ? row[j - 1]
        : 1 + Math.min(prev, row[j], row[j - 1])
      row[j - 1] = prev
      prev = val
    }
    row[lb] = prev
  }
  return 1 - row[lb] / Math.max(la, lb)
}

// Build a lean per-tool index using the pre-built searchTerms field when available
function buildIndex(tools) {
  const index = new Map()
  tools.forEach(tool => {
    // Prefer the pre-built searchTerms field; fall back to manual concat
    const fullText = (tool.searchTerms || [
      tool.name, tool.tagline, tool.description, tool.license,
      ...(tool.tags || []), ...(tool.platforms || []), ...(tool.alternatives_to || [])
    ].join(' ')).toLowerCase()

    const nameLower = (tool.name || '').toLowerCase()
    const taglineLower = (tool.tagline || '').toLowerCase()
    const altLower = (tool.alternatives_to || []).map(a => a.toLowerCase())

    // Unique words for fuzzy matching (skip very short ones)
    const words = [...new Set(fullText.split(/\W+/).filter(w => w.length > 2))]

    index.set(tool.id, { fullText, nameLower, taglineLower, altLower, words })
  })
  return index
}

// Score a single query word against a tool. Returns 0 if no match at all.
function scoreWord(word, entry) {
  const { fullText, nameLower, taglineLower, altLower, words } = entry

  // Exact / prefix / contains on name (highest priority)
  if (nameLower === word) return 100
  if (nameLower.startsWith(word)) return 85
  if (nameLower.includes(word)) return 65

  // Alternatives (e.g. searching "photoshop" surfaces GIMP)
  if (altLower.some(a => a.includes(word))) return 72

  // Tagline
  if (taglineLower.startsWith(word)) return 45
  if (taglineLower.includes(word)) return 35

  // Full text (tags, description, platforms, license)
  if (fullText.includes(word)) return 22

  // Fuzzy fallback — only for words >= 4 chars to avoid noise
  if (word.length >= 4) {
    let best = 0
    for (const w of words) {
      if (Math.abs(w.length - word.length) > 3) continue
      const s = similarity(word, w)
      if (s > best) best = s
      if (best >= 0.95) break  // good enough, stop early
    }
    if (best >= FUZZY_THRESHOLD) return Math.floor(best * 18)
  }

  return 0
}

// Score a tool against all query words.
// ALL words must match (AND semantics) but partial credit accumulates.
function scoreMatch(tool, queryWords, index) {
  const entry = index.get(tool.id)
  if (!entry || !queryWords.length) return 0
  let total = 0
  for (const word of queryWords) {
    const s = scoreWord(word, entry)
    if (s === 0) return 0   // strict AND: every word must match something
    total += s
  }
  return total
}

export function useSearch(tools) {
  // The raw input text lives in shared context so the header and sidebar search
  // bars stay in lockstep (single source of truth). `query` below is the
  // debounced, normalized form derived from it that actually drives scoring.
  const { searchInput, setSearchInput } = useSearchInput()
  const [query, setQueryState] = useState(
    () => searchInput.trim().replace(/\s+/g, ' ').toLowerCase()
  )
  const [category, setCategoryState] = useState('all')
  const [platforms, setPlatformsState] = useState([])
  const [tags, setTagsState] = useState([])
  const debounceRef = useRef(null)

  // Rebuild index only when tools array reference changes (i.e. on load)
  const index = useMemo(() => buildIndex(tools), [tools])

  // Debounce the shared raw input into the normalized search query. Both search
  // bars write to `searchInput`, so this is the single place that derives `query`
  // — keeping scoring off the keystroke path while results still update live.
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    const normalized = searchInput.trim().replace(/\s+/g, ' ').toLowerCase()
    // Clearing resets results instantly, with no debounce gap.
    if (!normalized) {
      setQueryState('')
      return undefined
    }
    debounceRef.current = setTimeout(() => setQueryState(normalized), DEBOUNCE_MS)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [searchInput])

  const results = useMemo(() => {
    let filtered = tools

    // Category filter
    if (category !== 'all') {
      filtered = filtered.filter(t => t.category === category)
    }

    // Platform filter (OR — tool must support at least one selected platform)
    if (platforms.length) {
      filtered = filtered.filter(t =>
        platforms.some(p => (t.platforms || []).includes(p))
      )
    }

    // Tag filter (OR — tool must have at least one selected tag)
    if (tags.length) {
      filtered = filtered.filter(t =>
        tags.some(tag => (t.tags || []).includes(tag))
      )
    }

    // Text search
    if (query.length >= 1) {
      const words = query.split(/\s+/).filter(Boolean)
      const scored = []
      for (const t of filtered) {
        const score = scoreMatch(t, words, index)
        if (score > 0) scored.push({ tool: t, score })
      }
      scored.sort((a, b) => b.score - a.score)
      return scored.map(x => x.tool)
    }

    return filtered
  }, [tools, query, category, platforms, tags, index])

  // Writing through the shared setter keeps the header bar and sidebar bar in
  // sync; sanitization and the debounce-into-`query` both happen downstream.
  const setQuery = useCallback((val) => {
    setSearchInput(val)
  }, [setSearchInput])

  const togglePlatform = useCallback((p) => {
    setPlatformsState(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p])
  }, [])

  const toggleTag = useCallback((tag) => {
    setTagsState(prev => prev.includes(tag) ? prev.filter(x => x !== tag) : [...prev, tag])
  }, [])

  const resetAll = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    setSearchInput('')
    setQueryState('')
    setCategoryState('all')
    setPlatformsState([])
    setTagsState([])
  }, [setSearchInput])

  // hasQuery uses the raw input so the featured carousel hides immediately on
  // typing, not after the debounce delay
  const hasQuery = searchInput.trim().length > 0
  const hasActiveFilters = hasQuery || platforms.length > 0 || tags.length > 0 || category !== 'all'

  return {
    query,
    displayQuery: searchInput,
    category,
    platforms,
    tags,
    results,
    setQuery,
    setCategory: setCategoryState,
    togglePlatform,
    toggleTag,
    resetAll,
    hasActiveFilters,
    hasQuery,
    hasFilters: platforms.length > 0 || tags.length > 0,
  }
}
