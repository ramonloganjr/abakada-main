import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import { useI18n } from '../contexts/I18nContext'
import { downloadFile } from '../lib/downloadFile'
import { PRESS } from '../lib/press'
import { useVisitorCount } from '../hooks/useVisitorCount'

const PITCH_DECK_URL = '/assets/doc/Abakada-Pitch-Deck-2026.pdf'
const PITCH_DECK_FILENAME = 'Abakada-Pitch-Deck-2026.pdf'

export default function Footer({ isStatic = false }) {
  const { appliedTheme } = useTheme()
  const { t } = useI18n()
  const navigate = useNavigate()
  const [year] = useState(() => new Date().getFullYear())
  const { totalUsers, updatedDate: visitorDate } = useVisitorCount()

  const logoSrc = appliedTheme === 'dark'
    ? '/assets/logo/logo-dark-background.svg'
    : '/assets/logo/logo-light-background.svg'

  function handleCategoryNav(e, path) {
    e.preventDefault()
    navigate(path)
    requestAnimationFrame(() => {
      const el = document.getElementById('tools-section')
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  return (
    <footer className={`site-footer${isStatic ? ' site-footer--static' : ''}`}>
      <div className="footer-main">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <Link to="/" className="footer-logo-link">
                <img id="footer-logo" className="nav__logo-img" src={logoSrc} alt="Abakada Logo" width="140" height="32" loading="lazy" decoding="async" />
              </Link>
              <p className="footer-description">{t('footer.description', 'A collection of free and open‑source software tools for Filipino students, scholars, educators, and professionals.')}</p>
              {totalUsers && (
                <div className="footer-badge">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                  {totalUsers.toLocaleString()} Total Visitors{visitorDate && <> • Updated {visitorDate}</>}
                </div>
              )}
              <div className="footer-social">
                <a href="https://github.com/Abakada-org" target="_blank" rel="noopener noreferrer" className="footer-social__link" aria-label="GitHub">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                </a>
                <a href="https://www.facebook.com/AbakadaOrg" target="_blank" rel="noopener noreferrer" className="footer-social__link" aria-label="Facebook">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                    <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
                  </svg>
                </a>
                <a href="https://www.linkedin.com/company/abakada-org" target="_blank" rel="noopener noreferrer" className="footer-social__link" aria-label="LinkedIn">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>

            <div className="footer-section">
              <h4 className="footer-section__title">{t('footer.quickLinks', 'Quick Links')}</h4>
              <nav className="footer-links">
                <a href="/" className="footer-link" onClick={e => handleCategoryNav(e, '/')}>{t('footer.allTools', 'All Tools')}</a>
                <Link to="/bookmarks" className="footer-link">{t('footer.bookmarks', 'Bookmarks')}</Link>
                <Link to="/compare" className="footer-link">{t('footer.compare', 'Comparison Tools')}</Link>
                <Link to="/learning-paths" className="footer-link">{t('footer.learningPaths', 'Learning Paths')}</Link>
                <a href="/#doc-processing" className="footer-link" onClick={e => handleCategoryNav(e, '/#doc-processing')}>{t('categories.doc-processing', 'Document Processing')}</a>
                <a href="/#notes" className="footer-link" onClick={e => handleCategoryNav(e, '/#notes')}>{t('categories.notes', 'Note-taking')}</a>
                <a href="/#project" className="footer-link" onClick={e => handleCategoryNav(e, '/#project')}>{t('categories.project', 'Project Management')}</a>
                <a href="/#design" className="footer-link" onClick={e => handleCategoryNav(e, '/#design')}>{t('categories.design', 'Design & Images')}</a>
                <a href="/#education" className="footer-link" onClick={e => handleCategoryNav(e, '/#education')}>{t('categories.education', 'Education & Teaching')}</a>
              </nav>
            </div>

            <div className="footer-section">
              <h4 className="footer-section__title">{t('footer.resources', 'Resources')}</h4>
              <nav className="footer-links">
                <Link to="/educators" className="footer-link">{t('footer.educators', 'For Educators')}</Link>
                <Link to="/students" className="footer-link">{t('footer.students', 'For Students')}</Link>
                <Link to="/faq" className="footer-link">{t('footer.faq', 'Frequently Asked Questions')}</Link>
                <Link to="/glossary" className="footer-link">{t('footer.glossary', 'Glossary')}</Link>
                <a href="https://github.com/Abakada-org" target="_blank" rel="noopener" className="footer-link">{t('footer.contribute', 'Contribute on GitHub')}</a>
                <a href="https://opensource.org" target="_blank" rel="noopener noreferrer" className="footer-link">{t('footer.openSourceInitiative', 'Open Source Initiative')}</a>
                <a
                  href={PITCH_DECK_URL}
                  download={PITCH_DECK_FILENAME}
                  className="footer-link"
                  aria-label="Download Abakada Partnership Pitch Deck 2026 PDF"
                  onClick={(e) => {
                    e.preventDefault()
                    downloadFile(PITCH_DECK_URL, PITCH_DECK_FILENAME)
                  }}
                >
                  {t('footer.pitchDeck', 'Partnership Pitch Deck')}
                </a>
                <Link to="/privacy" className="footer-link">{t('footer.privacyPolicy', 'Privacy Policy')}</Link>
                <Link to="/terms" className="footer-link">{t('footer.termsOfUse', 'Terms of Use')}</Link>
                <Link to="/sitemap" className="footer-link">{t('footer.sitemap', 'Sitemap')}</Link>
              </nav>
            </div>

            <div className="footer-section">
              <h4 className="footer-section__title">{t('footer.abakada', 'Abakada')}</h4>
              <nav className="footer-links">
                <Link to="/about" className="footer-link">{t('footer.about', 'About Us')}</Link>
                <Link to="/official-partners" className="footer-link">{t('footer.officialPartners', 'Official Partners')}</Link>
                <Link to="/partnerships" className="footer-link">{t('footer.partnerships', 'Partnerships')}</Link>
                <Link to="/contact" className="footer-link">{t('footer.contact', 'Contact')}</Link>
              </nav>
            </div>
          </div>

          {/* Featured In — press coverage strip */}
          <div className="footer-press">
            <span className="footer-press__label">Featured In</span>
            <div className="footer-press__logos">
              {PRESS.map(item => (
                <a
                  key={item.name}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-press__link"
                  aria-label={`Read Abakada coverage on ${item.name}`}
                >
                  <img
                    src={appliedTheme === 'dark' ? item.logoDark : item.logoLight}
                    alt={item.name}
                    className="footer-press__img"
                    loading="lazy"
                    decoding="async"
                    height="24"
                    width="auto"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-content">
            <p className="footer-copyright">
              <img src="/assets/logo/philippine.svg" alt="Philippine Flag" className="footer-flag" width="24" height="16" loading="lazy" decoding="async" />
              <span className="footer-copyright__line1">{t('footer.copyright_line1', 'Brown and Proud.')}</span>
              <span className="footer-copyright__line2">{t('footer.copyright_line2', 'Show your support by sharing this website.')}</span>
            </p>
            <div className="footer-legal">
              <span className="footer-legal__link">{t('footer.license', 'MIT | CC BY 4.0')}</span>
              <span className="footer-legal__divider"></span>
              <span className="footer-legal__link">© {year} Abakada</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
