import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'
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
  const [translationError, setTranslationError] = useState(false)
  const cacheRef = useRef({})

  // Sync lang with URL on every navigation.
  useEffect(() => {
    const fromUrl = langFromPath(location.pathname)
    if (fromUrl && fromUrl !== lang) setLangState(fromUrl)
  }, [location.pathname, lang])

  // Lazy-load: fetch only the active language on demand, cache in a ref so
  // switching back to a previously-loaded language is instant.
  useEffect(() => {
    // Keep html[lang] in sync for screen readers and SEO; map `bis` to `ceb`.
    document.documentElement.lang = lang === 'bis' ? 'ceb' : lang

    if (cacheRef.current[lang]) {
      setTranslations(cacheRef.current[lang])
      setTranslationError(false)
      return
    }

    let cancelled = false
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)

    fetch(`/assets/data/translations/${lang}.json`, { signal: controller.signal })
      .then(r => {
        if (!r.ok) throw new Error(`Translations ${lang}: HTTP ${r.status}`)
        return r.json()
      })
      .then(data => {
        if (!cancelled) {
          cacheRef.current[lang] = data
          setTranslations(data)
          setTranslationError(false)
        }
      })
      .catch(err => {
        if (cancelled) return
        if (err.name === 'AbortError') {
          console.warn(`[i18n] Translation fetch timed out for "${lang}"`)
        } else {
          console.error('[i18n] Failed to load translations:', err.message)
        }
        // UI falls back to English fallback strings already in the t() calls
        setTranslationError(true)
      })
      .finally(() => clearTimeout(timeout))

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [lang])

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
    <I18nContext.Provider value={{ lang, t, setLanguage, supportedLangs: SUPPORTED_LANGS, translationError }}>
      {children}
    </I18nContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useI18n = () => useContext(I18nContext)
