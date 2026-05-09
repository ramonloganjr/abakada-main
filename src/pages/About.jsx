import { Link } from 'react-router-dom'
import { useI18n } from '../contexts/I18nContext'
import StaticPageLayout from '../components/StaticPageLayout'
import SEO from '../components/SEO'
import { pageMeta } from '../lib/pageMeta'

export default function About() {
  const { t, lang } = useI18n()
  return (
    <>
    <SEO {...pageMeta.about} lang={lang} />
    <StaticPageLayout
      breadcrumb={t('breadcrumb.about', 'About Us')}
      heroTitle={t('pages.about.heroTitle', 'Para sa Bawat Pilipino')}
      heroSubtitle={t('pages.about.heroSubtitle', 'Empowering every Filipino with free, accessible productivity tools.')}
    >
      <section className="content-section">
        <div className="container">
          <div className="content-grid">
            <div className="content-block">
              <div className="content-block__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
              </div>
              <h2 className="content-block__title">{t('pages.about.missionTitle', 'Our Mission')}</h2>
              <p className="content-block__text">{t('pages.about.missionText1', 'Abakada is dedicated to serving all people of the Philippines by providing free access to powerful productivity tools.')}</p>
              <p className="content-block__text">{t('pages.about.missionText2', 'Our special focus is on supporting underprivileged scholars who deserve the same digital resources as their peers.')}</p>
            </div>
            <div className="content-block">
              <div className="content-block__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
              </div>
              <h2 className="content-block__title">{t('pages.about.educatorsTitle', 'For Educators')}</h2>
              <p className="content-block__text">{t('pages.about.educatorsText1', 'We provide specialized tools designed to assist teachers in educational instruction.')}</p>
              <p className="content-block__text">{t('pages.about.educatorsText2', 'From lesson planning to student assessment, our curated collection supports teachers across all subjects.')}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="content-section content-section--highlight">
        <div className="container">
          <div className="feature-block">
            <div className="feature-block__content">
              <span className="feature-block__label">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="14" height="14"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                <span>{t('pages.about.visionLabel', 'Our Vision')}</span>
              </span>
              <h2 className="feature-block__title">{t('pages.about.visionTitle', 'Digital Equity for All')}</h2>
              <p className="feature-block__text">{t('pages.about.visionText1', 'We envision a Philippines where every student has access to the same powerful digital tools as their peers worldwide.')}</p>
              <p className="feature-block__text">{t('pages.about.visionText2', 'By curating and promoting free, open-source alternatives, we\'re helping bridge the digital divide one tool at a time.')}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="content-section">
        <div className="container">
          <h2 className="section-title">{t('pages.about.valuesTitle', 'Our Values')}</h2>
          <p className="section-subtitle">{t('pages.about.valuesSubtitle', 'The principles that guide everything we do at Abakada.')}</p>
          <div className="values-grid">
            {[
              { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>, title: t('pages.about.valueAccessibility', 'Accessibility'), text: t('pages.about.valueAccessibilityText', 'Free tools for everyone, everywhere in the Philippines.') },
              { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, title: t('pages.about.valueQuality', 'Quality'), text: t('pages.about.valueQualityText', 'Only the best open-source tools make it to our collection.') },
              { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>, title: t('pages.about.valueCommunity', 'Community'), text: t('pages.about.valueCommunityText', 'Built by Filipinos, for Filipinos, with love.') },
              { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>, title: t('pages.about.valueOpenSource', 'Open Source'), text: t('pages.about.valueOpenSourceText', 'Transparency and collaboration at our core.') },
            ].map((v, i) => (
              <div key={i} className="value-card">
                <div className="value-card__icon">{v.icon}</div>
                <h3 className="value-card__title">{v.title}</h3>
                <p className="value-card__text">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="content-section content-section--alt">
        <div className="container">
          <div className="story-block">
            <h2 className="section-title">{t('pages.about.storyTitle', 'Our Story')}</h2>
            <div className="story-content">
              <p>{t('pages.about.storyText1', 'Abakada was born from a simple observation: many Filipino students struggle to access the same digital tools that their peers in wealthier countries take for granted.')}</p>
              <p>{t('pages.about.storyText2', 'We started by compiling a list of free alternatives to popular paid software. What began as a personal resource quickly grew into something bigger.')}</p>
              <p>{t('pages.about.storyText3', 'Today, Abakada serves students, educators, and professionals across the Philippines, helping them discover powerful tools that cost nothing but deliver everything.')}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="content-section content-section--cta">
        <div className="container">
          <div className="cta-block">
            <h2 className="cta-block__title">{t('cta.title', 'Ready to Explore?')}</h2>
            <p className="cta-block__text">{t('cta.text', 'Discover hundreds of free and open-source productivity tools curated for Filipino students, educators, and professionals.')}</p>
            <div className="cta-block__actions">
              <Link to="/" className="btn btn--primary">{t('cta.browseTools', 'Browse All Tools')}</Link>
              <Link to="/contact" className="btn btn--secondary">{t('cta.getInTouch', 'Get in Touch')}</Link>
            </div>
          </div>
        </div>
      </section>
    </StaticPageLayout>
    </>
  )
}
