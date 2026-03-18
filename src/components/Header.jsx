import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import { useI18n } from '../contexts/I18nContext'
import { useBookmarks } from '../contexts/BookmarkContext'
import { useComparison } from '../hooks/useComparison'
import { usePWAInstall } from '../hooks/usePWAInstall'
import Icon from './Icon'

export default function Header({ onMenuToggle, navOpen = false }) {
  const { theme, appliedTheme, setTheme } = useTheme()
  const { lang, setLanguage, supportedLangs, t } = useI18n()
  const { bookmarks } = useBookmarks()
  const { selectedIds } = useComparison()
  const [langOpen, setLangOpen] = useState(false)
  const { canInstall, triggerInstall } = usePWAInstall()

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
            <img id="header-logo" className="nav__logo-img" src={logoSrc} alt="Abakada" />
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
          <Link to="/bookmarks" className="btn btn--icon header-nav-btn" aria-label={t('nav.bookmarks', 'Bookmarks')} style={{ position: 'relative' }}>
            <Icon name="bookmark" collection="category" size={18} />
            {bookmarks.length > 0 && (
              <span className="nav-badge" aria-label={`${bookmarks.length} bookmarks`}>{bookmarks.length}</span>
            )}
          </Link>
          <Link to="/compare" className="btn btn--icon header-nav-btn" aria-label={t('nav.compare', 'Compare Tools')} style={{ position: 'relative' }}>
            <Icon name="layers" collection="category" size={18} />
            {selectedIds.length > 0 && (
              <span className="nav-badge" aria-label={`${selectedIds.length} tools in comparison`}>{selectedIds.length}</span>
            )}
          </Link>
          <Link to="/learning-paths" className="btn btn--icon header-nav-btn header-nav-btn--secondary" aria-label={t('nav.learningPaths', 'Learning Paths')} style={{ position: 'relative' }}>
            <Icon name="graduation-cap" collection="category" size={18} />
          </Link>
          <div className="theme-toggle" role="group" aria-label="Theme selection">
            {['light', 'auto', 'dark'].map(mode => (
              <button
                key={mode}
                type="button"
                className={`theme-toggle__btn${theme === mode ? ' active' : ''}`}
                data-theme={mode}
                aria-label={`${mode} theme`}
                onClick={() => setTheme(mode)}
              >
                <Icon name={mode === 'light' ? 'sun' : mode === 'dark' ? 'moon' : 'monitor'} collection="ui" size={16} />
              </button>
            ))}
          </div>
          <div className={`lang-selector${langOpen ? ' open' : ''}`}>
            <button
              type="button"
              className="lang-selector__btn"
              aria-haspopup="listbox"
              aria-expanded={langOpen}
              onClick={(e) => { e.stopPropagation(); setLangOpen(o => !o) }}
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
