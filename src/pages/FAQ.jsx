import { Link } from 'react-router-dom'
import { useI18n } from '../contexts/I18nContext'
import StaticPageLayout from '../components/StaticPageLayout'

const FAQ_ITEMS = [
  { q: 'What is Abakada?', a: 'Abakada is a curated directory of free and open-source productivity tools designed specifically for Filipino students, scholars, and educators. We help bridge the digital divide by providing access to powerful software alternatives that cost nothing.' },
  { q: 'Are all the tools really free?', a: 'Yes! Every tool in our directory is either completely free or has a free tier that provides substantial functionality. We prioritize open-source software that respects user freedom and privacy.' },
  { q: 'How do I suggest a new tool?', a: 'We welcome tool suggestions! You can contribute by opening an issue or pull request on our GitHub repository, or reach out through our contact page.' },
  { q: 'What does "Open Source" mean?', a: "Open-source software has its source code publicly available for anyone to view, modify, and distribute. This ensures transparency, security through community review, and freedom from vendor lock-in." },
  { q: 'Can I use these tools offline?', a: 'Many tools in our directory work offline after installation. We indicate platform compatibility (Windows, macOS, Linux, Web) for each tool so you can find options that work for your setup.' },
  { q: 'How do you select tools for the directory?', a: 'We evaluate tools based on relevance, maturity, security posture, licensing clarity, and community adoption. We prioritize tools that are actively maintained, well-documented, and suitable for educational use.' },
  { q: 'Is Abakada affiliated with any government agency?', a: 'No, Abakada is an independent, volunteer-driven project. We are not affiliated with any government agency, educational institution, or commercial entity.' },
  { q: 'How can I contribute to Abakada?', a: 'There are many ways to contribute! You can suggest tools, report issues, improve translations, write documentation, or contribute code. Visit our GitHub repository to get started.' },
]

const QuestionIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="10"/>
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
)

export default function FAQ() {
  const { t } = useI18n()
  return (
    <StaticPageLayout
      breadcrumb={t('breadcrumb.faq', 'FAQ')}
      heroTitle={t('pages.faq.heroTitle', 'Frequently Asked Questions')}
      heroSubtitle={t('pages.faq.heroSubtitle', 'Everything you need to know about Abakada and how to make the most of our open-source tools directory.')}
    >
      <section className="content-section">
        <div className="container">
          <div className="faq-grid">
            {FAQ_ITEMS.map((item, i) => (
              <div key={i} className="faq-item">
                <h3 className="faq-item__question"><QuestionIcon />{item.q}</h3>
                <p className="faq-item__answer">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="content-section content-section--highlight">
        <div className="container">
          <div className="developer-block">
            <div className="developer-block__header">
              <div className="developer-block__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
              </div>
              <div>
                <span className="developer-block__label">Meet the Developer</span>
                <h2 className="developer-block__name"><a href="https://ramonloganjr.com" target="_blank" rel="noopener">Ramon Logan Jr.</a></h2>
              </div>
            </div>
            <div className="developer-block__content">
              <p><a href="https://ramonloganjr.com" target="_blank" rel="noopener">Ramon Logan Jr.</a> is the developer behind Abakada and <a href="https://bettersolano.org" target="_blank" rel="noopener">BetterSolano.org</a>. Based in the United Arab Emirates, he works in IT and practices full-stack development.</p>
              <p>He also started <a href="https://hellopinas.com" target="_blank" rel="noopener">HelloPinas.com</a> and contributes to <a href="https://bettergov.ph" target="_blank" rel="noopener">BetterGov.ph</a>, a volunteer-driven civic-tech effort focused on improving access to local government information in the Philippines.</p>
              <p>He is also an individual participant of the <a href="https://openjsf.org" target="_blank" rel="noopener">OpenJS Foundation</a>.</p>
              <p>Abakada is also dedicated to his wife Alison and daughter Nana.</p>
              <div className="developer-block__highlight">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>
                <p>Ramon has made Abakada open source under <strong>MIT | CC BY 4.0</strong> to empower community-driven development. Contributions are warmly welcomed from everyone.</p>
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
              <Link to="/contact" className="btn btn--secondary">{t('cta.getInTouch', 'Get in Touch')}</Link>
            </div>
          </div>
        </div>
      </section>
    </StaticPageLayout>
  )
}
