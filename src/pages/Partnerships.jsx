import { Link } from 'react-router-dom'
import { useI18n } from '../contexts/I18nContext'
import StaticPageLayout from '../components/StaticPageLayout'

const MODELS = [
  {
    icon: <><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></>,
    title: 'Technology Partner',
    text: 'Provide infrastructure, hosting, or software credits to support our platform operations.',
  },
  {
    icon: <><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></>,
    title: 'Educational Partner',
    text: 'Schools and universities partnering to bring curated tools directly to students and faculty.',
  },
  {
    icon: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></>,
    title: 'Content Partner',
    text: 'Co-create educational guides, tutorials, and resources for the community.',
  },
  {
    icon: <><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></>,
    title: 'Community Partner',
    text: 'Support outreach programs, hackathons, and local events throughout the year.',
  },
]

export default function Partnerships() {
  const { t } = useI18n()
  return (
    <StaticPageLayout
      breadcrumb="Partnerships"
      heroTitle={t('pages.partnerships.heroTitle', 'Partner with Abakada')}
      heroSubtitle={t('pages.partnerships.heroSubtitle', 'Join us in empowering Filipino students and educators with free, open-source tools.')}
    >
      {/* Why partner */}
      <section className="content-section">
        <div className="container">
          <div className="content-grid">
            <div className="content-block">
              <div className="content-block__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <h2 className="content-block__title">Why Partner with Us?</h2>
              <p className="content-block__text">Abakada reaches thousands of Filipino students, educators, and professionals seeking free productivity tools. Partnering with us means supporting digital equity across the Philippines.</p>
            </div>
            <div className="content-block">
              <div className="content-block__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <h2 className="content-block__title">Partnership Models</h2>
              <p className="content-block__text">We welcome partnerships with educational institutions, NGOs, open-source projects, and organizations aligned with our mission of digital equity.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Partnership models grid */}
      <section className="content-section">
        <div className="container">
          <div className="values-grid">
            {MODELS.map((m, i) => (
              <div key={i} className="value-card">
                <div className="value-card__icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
                    {m.icon}
                  </svg>
                </div>
                <h3 className="value-card__title">{m.title}</h3>
                <p className="value-card__text">{m.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Deck CTA */}
      <section className="content-section">
        <div className="container">
          <div className="feature-block" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '2rem', flexWrap: 'wrap', padding: '2rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)', borderRadius: '1rem' }}>
            <div style={{ flex: 1, minWidth: 240 }}>
              <span className="feature-block__label" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                </svg>
                Partnership Deck
              </span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>View Our Full Partnership Deck</h3>
              <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>Explore our vision, impact stats, and collaboration models in a full presentation format.</p>
            </div>
            <Link to="/partnership-deck" className="btn btn--primary" style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>
              View Deck
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Main CTA */}
      <section className="content-section content-section--cta">
        <div className="container">
          <div className="cta-block">
            <h2 className="cta-block__title">Ready to Make an Impact?</h2>
            <p className="cta-block__text">Reach out to our partnerships team to explore how we can collaborate and empower Filipino learners together.</p>
            <div className="cta-block__actions">
              <a href="mailto:partnerships@abakada.org" className="btn btn--primary">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                Send a Partnership Inquiry
              </a>
              <Link to="/contact" className="btn btn--secondary">Get in Touch</Link>
            </div>
          </div>
        </div>
      </section>
    </StaticPageLayout>
  )
}
