import { Link } from 'react-router-dom'
import { useI18n } from '../contexts/I18nContext'
import Icon from '../components/Icon'
import SEO from '../components/SEO'
import { pageMeta } from '../lib/pageMeta'

export default function NotFound() {
  const { t, lang } = useI18n()
  return (
    <>
      <SEO {...pageMeta.notFound} lang={lang} />
      <main className="site-main" id="main-content">
        <div className="error-page">
          <div className="container">
            <div className="error-page__content">
              <div className="error-page__icon">
                <Icon name="search" collection="ui" size={64} />
              </div>
              <span className="error-page__label">404</span>
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
