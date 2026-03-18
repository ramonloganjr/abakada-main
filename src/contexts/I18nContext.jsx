import { createContext, useContext, useEffect, useState, useCallback } from 'react'

const I18nContext = createContext(null)

const STORAGE_KEY = 'abakada-language'
const DEFAULT_LANG = 'en'
const SUPPORTED_LANGS = ['en', 'tl', 'ilo', 'bis']

function detectBrowserLanguage() {
  const lang = navigator.language?.toLowerCase() || ''
  if (lang.startsWith('tl') || lang.startsWith('fil')) return 'tl'
  if (lang.startsWith('ilo')) return 'ilo'
  if (lang.startsWith('ceb') || lang.startsWith('bis')) return 'bis'
  return DEFAULT_LANG
}

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return SUPPORTED_LANGS.includes(saved) ? saved : detectBrowserLanguage()
    } catch { return DEFAULT_LANG }
  })

  const [translations, setTranslations] = useState({})
  const [cache, setCache] = useState({})

  useEffect(() => {
    async function loadAll() {
      const results = {}
      await Promise.all(
        SUPPORTED_LANGS.map(async (l) => {
          try {
            const res = await fetch(`/assets/data/translations/${l}.json`)
            if (res.ok) results[l] = await res.json()
          } catch {}
        })
      )
      setCache(results)
      setTranslations(results[lang] || {})
    }
    loadAll()
  }, [])

  useEffect(() => {
    if (cache[lang]) setTranslations(cache[lang])
    // Keep html[lang] in sync for screen readers and SEO
    document.documentElement.lang = lang
  }, [lang, cache])

  const t = useCallback((key, fallback = '') => {
    const parts = key.split('.')
    let val = translations
    for (const p of parts) {
      if (val == null || typeof val !== 'object') return fallback
      val = val[p]
    }
    return (val != null && typeof val !== 'object') ? String(val) : fallback
  }, [translations])

  function setLanguage(l) {
    if (!SUPPORTED_LANGS.includes(l)) return
    setLangState(l)
    try { localStorage.setItem(STORAGE_KEY, l) } catch {}
  }

  return (
    <I18nContext.Provider value={{ lang, t, setLanguage, supportedLangs: SUPPORTED_LANGS }}>
      {children}
    </I18nContext.Provider>
  )
}

export const useI18n = () => useContext(I18nContext)
