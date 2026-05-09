import { Link } from 'react-router-dom'
import { useI18n } from '../contexts/I18nContext'

export default function StaticPageLayout({ breadcrumb, heroTitle, heroSubtitle, children }) {
  const { t } = useI18n()
  return (
    <main className="site-main" id="main-content">
      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">{t('breadcrumb.home', 'Home')}</Link>
            <span className="breadcrumb__separator" aria-hidden="true">/</span>
            <span aria-current="page">{breadcrumb}</span>
          </nav>
          <h1 className="page-hero__title">{heroTitle}</h1>
          {heroSubtitle && <p className="page-hero__subtitle">{heroSubtitle}</p>}
        </div>
      </section>
      {children}
    </main>
  )
}
