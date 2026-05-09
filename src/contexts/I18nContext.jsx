import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const I18nContext = createContext(null)

const STORAGE_KEY = 'abakada-language'
const DEFAULT_LANG = 'en'
const SUPPORTED_LANGS = ['en', 'tl', 'ilo', 'bis']
const LANG_RE = /^\/(en|tl|ilo|bis)(\/|$)/

function detectBrowserLanguage() {
  const lang = navigator.language?.toLowerCase() || ''
  if (lang.startsWith('tl') || lang.startsWith('fil')) return 'tl'
  if (lang.startsWith('ilo')) return 'ilo'
  if (lang.startsWith('ceb') || lang.startsWith('bis')) return 'bis'
  return DEFAULT_LANG
}

function langFromPath(pathname) {
  const m = pathname.match(LANG_RE)
  return m ? m[1] : null
}

export function I18nProvider({ children }) {
  const location = useLocation()
  const navigate = useNavigate()

  // Initial lang preference: URL > localStorage > browser detection.
  const [lang, setLangState] = useState(() => {
    const fromUrl = langFromPath(location?.pathname || '/')
    if (fromUrl) return fromUrl
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return SUPPORTED_LANGS.includes(saved) ? saved : detectBrowserLanguage()
    } catch { return DEFAULT_LANG }
  })

  const [translations, setTranslations] = useState({})
  const [cache, setCache] = useState({})

  // Sync lang with URL on every navigation.
  useEffect(() => {
    const fromUrl = langFromPath(location.pathname)
    if (fromUrl && fromUrl !== lang) setLangState(fromUrl)
  }, [location.pathname, lang])

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
    // Keep html[lang] in sync for screen readers and SEO; map `bis` to `ceb`.
    document.documentElement.lang = lang === 'bis' ? 'ceb' : lang
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

    // Navigate to the same canonical path under the new language prefix.
    const current = location.pathname
    const stripped = current.replace(LANG_RE, '/').replace(/\/{2,}/g, '/')
    const nextPath = l === DEFAULT_LANG ? stripped : `/${l}${stripped === '/' ? '' : stripped}`
    if (nextPath !== current) {
      navigate(nextPath + (location.search || '') + (location.hash || ''))
    }
  }

  return (
    <I18nContext.Provider value={{ lang, t, setLanguage, supportedLangs: SUPPORTED_LANGS }}>
      {children}
    </I18nContext.Provider>
  )
}

export const useI18n = () => useContext(I18nContext)
