import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'

const ThemeContext = createContext(null)

const STORAGE_KEY = 'abakada-theme'
const THEMES = ['light', 'dark', 'auto']
const FALLBACK_MS = 270   // class-based fallback transition duration + buffer

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return THEMES.includes(saved) ? saved : 'auto'
    } catch { return 'auto' }
  })

  const [systemPref, setSystemPref] = useState(() =>
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  )

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e) => setSystemPref(e.matches ? 'dark' : 'light')
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const appliedTheme = theme === 'auto' ? systemPref : theme

  // Refs that survive re-renders without triggering them
  const transitionTimer  = useRef(null)
  const prevAppliedRef   = useRef(appliedTheme)   // tracks last known applied value
  const userTriggeredRef = useRef(false)

  // Remove the loading class set by the FOUC script after the first frame.
  // Double-rAF guarantees the browser has actually painted before we re-enable
  // transitions — single rAF can still fire before the first real paint.
  useEffect(() => {
    let inner
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => {
        document.documentElement.classList.remove('loading')
      })
    })
    return () => { cancelAnimationFrame(outer); cancelAnimationFrame(inner) }
  }, [])

  // Handles the one case setTheme() can't: OS preference change while in
  // auto mode. User-triggered switches are handled directly in setTheme().
  useEffect(() => {
    const prev = prevAppliedRef.current
    prevAppliedRef.current = appliedTheme

    // Skip when nothing actually changed — covers:
    //   • First mount (FOUC script already set data-theme correctly)
    //   • React Strict Mode's double-invocation (same value both times)
    if (prev === appliedTheme) return

    // setTheme() already handled the DOM update for user-triggered changes.
    if (userTriggeredRef.current) {
      userTriggeredRef.current = false
      return
    }

    // OS preference changed while theme === 'auto' — use the class-based sweep.
    const root = document.documentElement
    clearTimeout(transitionTimer.current)
    root.classList.add('theme-transitioning')
    root.setAttribute('data-theme', appliedTheme)
    transitionTimer.current = setTimeout(
      () => root.classList.remove('theme-transitioning'),
      FALLBACK_MS
    )
    return () => clearTimeout(transitionTimer.current)
  }, [appliedTheme])

  /**
   * Switch theme.
   *
   * @param {string} t - 'light' | 'dark' | 'auto'
   * @param {{ x: number, y: number } | null} origin
   *   Viewport coords of the click centre (from getBoundingClientRect).
   *   Used as the epicentre of the circular reveal animation.
   */
  function setTheme(t, origin = null) {
    if (!THEMES.includes(t) || t === theme) return

    userTriggeredRef.current = true
    try { localStorage.setItem(STORAGE_KEY, t) } catch {}

    const newApplied = t === 'auto' ? systemPref : t
    const root       = document.documentElement
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Pin the animation origin so the CSS circle() knows where to start.
    const ox = origin?.x ?? Math.round(window.innerWidth  / 2)
    const oy = origin?.y ?? Math.round(window.innerHeight / 2)
    root.style.setProperty('--reveal-x', `${ox}px`)
    root.style.setProperty('--reveal-y', `${oy}px`)

    if ('startViewTransition' in document && !reducedMotion) {
      // ─── View Transitions API path ────────────────────────────────────────
      // html.theme-switching gates the ::view-transition CSS so it ONLY fires
      // for our explicit switches — never for browser navigation or page load.
      root.classList.add('theme-switching')
      try {
        const vt = document.startViewTransition(() => {
          root.setAttribute('data-theme', newApplied)
          // flushSync commits React's re-render synchronously so the new
          // active-button state (thumb position) is captured in the new snapshot.
          flushSync(() => setThemeState(t))
        })
        vt.finished.finally(() => root.classList.remove('theme-switching'))
      } catch {
        // startViewTransition can throw on some browsers mid-transition;
        // fall through to the class-based sweep instead.
        root.classList.remove('theme-switching')
        setThemeState(t)
        root.classList.add('theme-transitioning')
        root.setAttribute('data-theme', newApplied)
        transitionTimer.current = setTimeout(
          () => root.classList.remove('theme-transitioning'),
          FALLBACK_MS
        )
      }
    } else {
      // ─── Fallback: class-based colour sweep ───────────────────────────────
      setThemeState(t)
      clearTimeout(transitionTimer.current)
      root.classList.add('theme-transitioning')
      root.setAttribute('data-theme', newApplied)
      transitionTimer.current = setTimeout(
        () => root.classList.remove('theme-transitioning'),
        FALLBACK_MS
      )
    }
  }

  return (
    <ThemeContext.Provider value={{ theme, appliedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => useContext(ThemeContext)
