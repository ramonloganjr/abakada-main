import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext(null)

const STORAGE_KEY = 'abakada-theme'
const THEMES = ['light', 'dark', 'auto']

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

  useEffect(() => {
    const html = document.documentElement
    html.classList.add('theme-transitioning')
    html.setAttribute('data-theme', appliedTheme)
    setTimeout(() => html.classList.remove('theme-transitioning'), 300)
  }, [appliedTheme])

  function setTheme(t) {
    if (!THEMES.includes(t)) return
    setThemeState(t)
    try { localStorage.setItem(STORAGE_KEY, t) } catch {}
  }

  return (
    <ThemeContext.Provider value={{ theme, appliedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
