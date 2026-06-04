import { Link } from 'react-router-dom'
import { useI18n } from '../contexts/I18nContext'
import StaticPageLayout from '../components/StaticPageLayout'
import SEO from '../components/SEO'
import { pageMeta } from '../lib/pageMeta'

// Three tiers — kept in sync with PartnershipDeck.jsx (slide 7).
const TIERS = [
  {
    name: 'Model 01',
    title: 'Community Supporter',
    desc: 'For NGOs, schools, student organizations, and grassroots groups aligned with our mission.',
    benefits: [
      'Logo & link on the Official Partners page',
      'Cross-promotion on social channels',
      'Joint outreach to Filipino learners',
      'Annual impact recap',
    ],
    icon: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
  },
  {
    name: 'Model 02',
    title: 'Content & Editorial Partner',
    desc: 'For educators, publishers, and open-source projects who want to co-create learning content.',
    benefits: [
      'Co-authored learning paths or tool collections',
      'Bylined guides published under CC BY 4.0',
      'Featured tool spotlights',
      'Translation contributions (Tagalog, Bisaya, Ilokano)',
      'Quarterly check-in on what is resonating',
    ],
    icon: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></>,
  },
  {
    name: 'Model 03',
    title: 'Infrastructure Sponsor',
    desc: 'For companies offering hosting credits, domain services, dev tools, or financial sponsorship that keeps Abakada free forever.',
    benefits: [
      'Sponsor recognition on the site & in our deck',
      'Inclusion in the project README on GitHub',
      'Direct relationship with the maintainer',
      'Public, transparent attribution',
    ],
    icon: <><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></>,
  },
]

// Stats — kept in sync with PartnershipDeck.jsx (slide 5).
const STATS = [
  { value: '1,000+', labelKey: 'pages.partnerships.statsTools', label: 'Hand-curated Tools' },
  { value: '45+', labelKey: 'pages.partnerships.statsCategories', label: 'Categories' },
  { value: '10', labelKey: 'pages.partnerships.statsPaths', label: 'Learning Pathways' },
  { value: '4', labelKey: 'pages.partnerships.statsLanguages', label: 'Philippine Languages' },
]

export default function Partnerships() {
  const { t, lang } = useI18n()
  return (
    <>
    <SEO {...pageMeta.partnerships} lang={lang} />
    <StaticPageLayout
      breadcrumb={t('breadcrumb.partnerships', 'Partnerships')}
      heroTitle={t('pages.partnerships.heroTitle', 'Partner with Abakada')}
      heroSubtitle={t('pages.partnerships.heroSubtitle', 'Join us in empowering Filipino students, educators, and professionals with free, open-source tools.')}
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
              <h2 className="content-block__title">{t('pages.partnerships.whyTitle', 'Why Partner with Abakada?')}</h2>
              <p className="content-block__text">{t('pages.partnerships.whyText', 'Abakada reaches Filipino students, educators, scholars, and professionals seeking free productivity tools. Partnering with us means supporting digital equity across the Philippines — through a transparent, open-source civic-tech project with no tracking, no accounts, and no paywalls.')}</p>
            </div>
            <div className="content-block">
              <div className="content-block__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <h2 className="content-block__title">{t('pages.partnerships.alignedTitle', 'Aligned, Honest Engagements')}</h2>
              <p className="content-block__text">{t('pages.partnerships.alignedText', 'We welcome partnerships with educational institutions, NGOs, open-source projects, and organizations aligned with our mission of digital equity. Every partnership model below is something we already ship today — no vaporware.')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats — same numbers used in the Partnership Deck */}
      <section className="content-section">
        <div className="container">
          <div className="partnership-stats">
            {STATS.map((s, i) => (
              <div key={i} className="partnership-stat">
                <div className="partnership-stat__value">{s.value}</div>
                <div className="partnership-stat__label">{t(s.labelKey, s.label)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership tiers — synced with deck slide 7 */}
      <section className="content-section">
        <div className="container">
          <h2 className="content-section__title" style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
            {t('pages.partnerships.tiersTitle', 'Three Honest Engagements')}
          </h2>
          <p className="content-section__subtitle" style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 2.5rem', color: 'var(--text-secondary)' }}>
            {t('pages.partnerships.tiersSubtitle', 'Pick the model that fits how you want to contribute. None require Abakada to be something it is not.')}
          </p>
          <div className="partnership-tiers">
            {TIERS.map((tier, i) => (
              <div key={i} className="partnership-tier">
                <div className="partnership-tier__icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
                    {tier.icon}
                  </svg>
                </div>
                <div className="partnership-tier__name">{tier.name}</div>
                <h3 className="partnership-tier__title">{t(`pages.partnerships.tier${i + 1}Title`, tier.title)}</h3>
                <p className="partnership-tier__desc">{t(`pages.partnerships.tier${i + 1}Desc`, tier.desc)}</p>
                <ul className="partnership-tier__list">
                  {tier.benefits.map((b, j) => (
                    <li key={j}>{t(`pages.partnerships.tier${i + 1}Benefit${j + 1}`, b)}</li>
                  ))}
                </ul>
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
                {t('pages.partnerships.deckLabel', 'Partnership Deck')}
              </span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{t('pages.partnerships.deckTitle', 'View Our Full Partnership Deck')}</h3>
              <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{t('pages.partnerships.deckText', 'Explore our vision, impact stats, traction, and collaboration models in a full presentation format.')}</p>
            </div>
            <Link to="/partnership-deck" className="btn btn--primary" style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>
              {t('pages.partnerships.viewDeck', 'View Deck')}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Main CTA — uses same email as the deck (partnerships@abakada.org) */}
      <section className="content-section content-section--cta">
        <div className="container">
          <div className="cta-block">
            <h2 className="cta-block__title">{t('pages.partnerships.ctaTitle', 'Ready to Make an Impact?')}</h2>
            <p className="cta-block__text">{t('pages.partnerships.ctaText', 'No discovery-call funnel, no qualification round. Reach out directly to the maintainer — if there is a fit, we will figure out the rest in one call.')}</p>
            <div className="cta-block__actions">
              <a href="mailto:partnerships@abakada.org" className="btn btn--primary">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                {t('pages.partnerships.ctaEmail', 'Email partnerships@abakada.org')}
              </a>
              <Link to="/contact" className="btn btn--secondary">{t('cta.getInTouch', 'Get in Touch')}</Link>
            </div>
          </div>
        </div>
      </section>
    </StaticPageLayout>
    </>
  )
}
