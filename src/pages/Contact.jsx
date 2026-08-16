import { Link } from 'react-router-dom'
import { useI18n } from '../contexts/I18nContext'
import StaticPageLayout from '../components/StaticPageLayout'
import Icon from '../components/Icon'
import SEO from '../components/SEO'
import { pageMeta } from '../lib/pageMeta'

export default function Contact() {
  const { t, lang } = useI18n()
  return (
    <>
    <SEO {...pageMeta.contact} lang={lang} />
    <StaticPageLayout
      breadcrumb={t('breadcrumb.contact', 'Contact')}
      heroTitle={t('pages.contact.heroTitle', 'Contact Us')}
      heroSubtitle={t('pages.contact.heroSubtitle', "We'd love to hear from you. Whether you have a question, suggestion, or want to contribute, reach out anytime.")}
    >
      <section className="content-section">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-info">
              <h2 className="contact-info__title">{t('pages.contact.getInTouchTitle', 'Get in Touch')}</h2>
              <p className="contact-info__text">{t('pages.contact.getInTouchText', "Have a question, suggestion, or want to contribute? We're always happy to hear from the community.")}</p>
              <div className="contact-methods">
                <div className="contact-method">
                  <div className="contact-method__icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  </div>
                  <div className="contact-method__content">
                    <h3 className="contact-method__title">{t('pages.contact.emailTitle', 'Email')}</h3>
                    <a href="mailto:hello@abakada.org" className="contact-method__link">hello@abakada.org</a>
                    <p className="contact-method__note">{t('pages.contact.emailNote', 'We typically respond within 24-72 hours')}</p>
                  </div>
                </div>
                <div className="contact-method">
                  <div className="contact-method__icon">
                    <Icon name="github" collection="ui" size={24} />
                  </div>
                  <div className="contact-method__content">
                    <h3 className="contact-method__title">{t('pages.contact.githubTitle', 'GitHub')}</h3>
                    <a href="https://github.com/ramonloganjr/abakada-main/" target="_blank" rel="noopener noreferrer" className="contact-method__link">github.com/ramonloganjr/abakada-main</a>
                    <p className="contact-method__note">{t('pages.contact.githubNote', 'Open issues, submit PRs, or star the project')}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="contact-topics">
              <h2 className="contact-topics__title">{t('pages.contact.howCanWeHelpTitle', 'How Can We Help?')}</h2>
              <div className="topic-cards">
                {[
                  { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>, title: t('pages.contact.suggestToolTitle', 'Suggest a Tool'), text: t('pages.contact.suggestToolText', "Know a great open-source tool we're missing? Let us know.") },
                  { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>, title: t('pages.contact.reportIssueTitle', 'Report an Issue'), text: t('pages.contact.reportIssueText', 'Found incorrect information or a broken link? Help us keep the directory accurate.') },
                  { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>, title: t('pages.contact.partnershipTitle', 'Partnership'), text: t('pages.contact.partnershipText', "Interested in collaborating or partnering with Abakada? We're open to opportunities.") },
                  { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>, title: t('pages.contact.generalInquiryTitle', 'General Inquiry'), text: t('pages.contact.generalInquiryText', "Have a question or just want to say hello? We'd love to hear from you.") },
                ].map((item, i) => (
                  <div key={i} className="topic-card">
                    <div className="topic-card__icon">{item.icon}</div>
                    <h3 className="topic-card__title">{item.title}</h3>
                    <p className="topic-card__text">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="content-section content-section--cta">
        <div className="container">
          <div className="cta-block">
            <h2 className="cta-block__title">{t('cta.title', 'Ready to Explore?')}</h2>
            <p className="cta-block__text">{t('cta.text', 'Discover hundreds of free and open-source productivity tools.')}</p>
            <div className="cta-block__actions">
              <Link to="/" className="btn btn--primary">{t('cta.browseTools', 'Browse All Tools')}</Link>
            </div>
          </div>
        </div>
      </section>
    </StaticPageLayout>
    </>
  )
}
