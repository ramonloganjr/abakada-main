import { Link } from 'react-router-dom'
import { useI18n } from '../contexts/I18nContext'
import { useTheme } from '../contexts/ThemeContext'
import SEO from '../components/SEO'
import { pageMeta } from '../lib/pageMeta'

export default function NotFound() {
  const { t, lang } = useI18n()
  const { appliedTheme } = useTheme()

  // Theme-aware 404 wordmark — local SVGs in /public/assets/logo/.
  // Decorative role (the heading + label below already convey "404"
  // semantically), so alt="" keeps screen readers from double-announcing.
  const artworkSrc = appliedTheme === 'dark'
    ? '/assets/logo/404-dark-mode.svg'
    : '/assets/logo/404-light-mode.svg'

  return (
    <>
      <SEO {...pageMeta.notFound} lang={lang} />
      <main className="site-main" id="main-content">
        <div className="error-page">
          <div className="container">
            <div className="error-page__content">
              <div className="error-page__artwork">
                <img
                  src={artworkSrc}
                  alt=""
                  role="presentation"
                  width="240"
                  height="88"
                  decoding="async"
                  fetchpriority="high"
                />
              </div>
              <span className="error-page__label">{t('errors.404.label', 'Error 404')}</span>
              <h1 className="error-page__title">{t('errors.notFoundTitle', 'Page Not Found')}</h1>
              <p className="error-page__message">{t('errors.notFoundText', "The page you're looking for doesn't exist or has been moved.")}</p>
              <div className="error-page__actions">
                <Link to="/" className="btn btn--primary">{t('errors.goHome', 'Go Home')}</Link>
                <Link to="/contact" className="btn btn--secondary">{t('errors.contactUs', 'Contact Us')}</Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
