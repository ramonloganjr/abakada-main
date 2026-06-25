import { createContext, useContext, useState, useCallback, useMemo } from 'react'

const SearchContext = createContext(null)

const MAX_QUERY_LENGTH = 100

// Strip control characters and cap length. Centralizing sanitization here means
// every entry point — the header search bar, the sidebar search bar, and ?q=
// deep links — writes the same clean value into the single shared source of truth.
function sanitizeQuery(val) {
  // eslint-disable-next-line no-control-regex
  return String(val || '').replace(/[\x00-\x1F\x7F]/g, '').slice(0, MAX_QUERY_LENGTH)
}

// Single source of truth for the catalog search text. The header search bar and
// the home sidebar search bar both read and write `searchInput`, so typing into
// or clearing either one updates the other instantly — no submit, no round-trip
// through the URL, no state divergence.
export function SearchProvider({ children }) {
  const [searchInput, setSearchInputState] = useState('')

  const setSearchInput = useCallback((val) => {
    setSearchInputState(sanitizeQuery(val))
  }, [])

  const value = useMemo(() => ({ searchInput, setSearchInput }), [searchInput, setSearchInput])

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSearchInput() {
  const ctx = useContext(SearchContext)
  if (!ctx) throw new Error('useSearchInput must be used within a SearchProvider')
  return ctx
}
