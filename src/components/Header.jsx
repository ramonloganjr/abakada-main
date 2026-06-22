import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import { useI18n } from '../contexts/I18nContext'
import { useBookmarks } from '../contexts/BookmarkContext'
import { useComparison } from '../hooks/useComparison'
import { usePWAInstall } from '../hooks/usePWAInstall'
import { stripLangPrefix } from '../lib/canonical'
import Icon from './Icon'

export default function Header({ onMenuToggle, navOpen = false }) {
  const { theme, appliedTheme, setTheme } = useTheme()
  const { lang, setLanguage, supportedLangs, t } = useI18n()
  const { bookmarks } = useBookmarks()
  const { selectedIds } = useComparison()
  const location = useLocation()
  const [langOpen, setLangOpen] = useState(false)
  const langRef = useRef(null)
  const { canInstall, triggerInstall } = usePWAInstall()

  const normalizedPath = stripLangPrefix(location.pathname)
  const isOnLearningPaths = normalizedPath === '/learning-paths' || normalizedPath.startsWith('/learning-paths/')

  // Close the language dropdown on outside click / Escape, kept in sync with React
  // state so the trigger button always reflects the real open/closed state.
  useEffect(() => {
    if (!langOpen) return
    function onPointer(e) {
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false)
    }
    function onKey(e) {
      if (e.key === 'Escape') setLangOpen(false)
    }
    document.addEventListener('click', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('click', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [langOpen])

  const logoSrc = appliedTheme === 'dark'
    ? '/assets/logo/logo-dark-background.svg'
    : '/assets/logo/logo-light-background.svg'

  const langLabels = { en: 'English', tl: 'Tagalog', ilo: 'Ilokano', bis: 'Bisaya' }
  const langCodes = { en: 'EN', tl: 'TL', ilo: 'ILO', bis: 'BIS' }

  return (
    <header className="site-header">
      <div className="header-container">
        <div className="header-left">
          <button
            type="button"
            className="menu-toggle"
            id="menu-toggle"
            aria-label="Toggle navigation"
            aria-expanded={navOpen}
            onClick={onMenuToggle}
          >
            <Icon name="menu" collection="ui" size={20} />
          </button>
          <Link to="/" className="nav__logo">
            <img id="header-logo" className="nav__logo-img" src={logoSrc} alt="Abakada" width="140" height="32" fetchpriority="high" decoding="async" />
          </Link>
        </div>
        <div className="nav__actions">
          {canInstall && (
            <button
              type="button"
              className="btn btn--primary btn--sm header-install-btn"
              aria-label={t('pwa.installAriaLabel', 'Install Abakada App')}
              onClick={triggerInstall}
            >
              <Icon name="download" collection="ui" size={14} />
              {t('pwa.install', 'Install App')}
            </button>
          )}
          <Link
            to="/bookmarks"
            className="header-nav-btn"
            title={t('nav.bookmarks', 'Bookmarks')}
            aria-label={bookmarks.length > 0 ? `${t('nav.bookmarks', 'Bookmarks')} (${bookmarks.length})` : t('nav.bookmarks', 'Bookmarks')}
          >
            <Icon name="bookmark" collection="category" size={18} />
            <span className="header-nav-btn__label">{t('nav.bookmarksShort', 'Saved')}</span>
            {bookmarks.length > 0 && (
              <span className="header-nav-btn__badge" aria-hidden="true">{bookmarks.length}</span>
            )}
          </Link>
          <Link
            to="/compare"
            className="header-nav-btn"
            title={t('nav.compare', 'Compare Tools')}
            aria-label={selectedIds.length > 0 ? `${t('nav.compare', 'Compare Tools')} (${selectedIds.length})` : t('nav.compare', 'Compare Tools')}
          >
            <Icon name="layers" collection="category" size={18} />
            <span className="header-nav-btn__label">{t('nav.compareShort', 'Compare')}</span>
            {selectedIds.length > 0 && (
              <span className="header-nav-btn__badge" aria-hidden="true">{selectedIds.length}</span>
            )}
          </Link>
          <Link
            to="/learning-paths"
            className={`header-nav-btn${isOnLearningPaths ? ' header-nav-btn--active' : ''}`}
            title={t('nav.learningPaths', 'Learning Paths')}
            aria-label={t('nav.learningPaths', 'Learning Paths')}
            aria-current={isOnLearningPaths ? 'section' : undefined}
          >
            <Icon name="graduation-cap" collection="category" size={18} />
            <span className="header-nav-btn__label">{t('nav.learningPathsShort', 'Learn')}</span>
          </Link>
          <div
            className="theme-toggle"
            role="group"
            aria-label="Color theme"
            data-active-index={String(['light', 'auto', 'dark'].indexOf(theme))}
          >
            {/* Sliding active-state indicator — GPU-composited, pointer-events none */}
            <span className="theme-toggle__thumb" aria-hidden="true" />
            {[
              { value: 'light', icon: 'sun',     label: 'Light theme'  },
              { value: 'auto',  icon: 'monitor', label: 'System theme' },
              { value: 'dark',  icon: 'moon',    label: 'Dark theme'   },
            ].map(({ value, icon, label }) => (
              <button
                key={value}
                type="button"
                className={`theme-toggle__btn${theme === value ? ' active' : ''}`}
                data-theme={value}
                aria-label={label}
                aria-pressed={theme === value}
                onClick={(e) => {
                  const r = e.currentTarget.getBoundingClientRect()
                  setTheme(value, {
                    x: Math.round(r.left + r.width  / 2),
                    y: Math.round(r.top  + r.height / 2),
                  })
                }}
              >
                <Icon name={icon} collection="ui" size={15} />
              </button>
            ))}
          </div>
          <div className={`lang-selector${langOpen ? ' open' : ''}`} ref={langRef}>
            <button
              type="button"
              className="lang-selector__btn"
              aria-haspopup="listbox"
              aria-expanded={langOpen}
              onClick={() => setLangOpen(o => !o)}
            >
              <Icon name="globe" collection="ui" size={16} />
              <span>{langCodes[lang] || 'EN'}</span>
              <Icon name="chevron-down" collection="ui" size={12} />
            </button>
            <div className="lang-selector__dropdown" role="listbox" aria-label="Select language">
              {supportedLangs.map(l => (
                <button
                  key={l}
                  type="button"
                  className={`lang-selector__option${lang === l ? ' active' : ''}`}
                  data-lang={l}
                  role="option"
                  aria-selected={lang === l}
                  onClick={() => { setLanguage(l); setLangOpen(false) }}
                >
                  {langLabels[l]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
