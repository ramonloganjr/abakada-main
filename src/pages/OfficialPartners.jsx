import { Link } from 'react-router-dom'
import StaticPageLayout from '../components/StaticPageLayout'
import SEO from '../components/SEO'
import { useI18n } from '../contexts/I18nContext'
import { useTheme } from '../contexts/ThemeContext'
import { pageMeta } from '../lib/pageMeta'

const PARTNERS = [
  {
    name: 'BetterGov PH',
    logoLight: '/assets/partner/bettergovph-light.png',
    logoDark:  '/assets/partner/bettergovph-dark.png',
    url: 'https://about.bettergov.ph/',
  },
  {
    name: 'Vaultera Labs',
    logo: '/assets/partner/vaultera-labs.png',
    url: 'https://vaulteralabs.com/',
  },
]

function PartnerCard({ partner, appliedTheme }) {
  const src = partner.logoLight && partner.logoDark
    ? (appliedTheme === 'dark' ? partner.logoDark : partner.logoLight)
    : partner.logo

  const img = (
    <img
      src={src}
      alt={`${partner.name} logo`}
      className="partner-card__img"
      loading="lazy"
      decoding="async"
      width="600"
      height="337"
    />
  )

  return (
    <div className="partner-card">
      {partner.url ? (
        <a
          href={partner.url}
          target="_blank"
          rel="noopener noreferrer"
          className="partner-card__logo"
          aria-label={`Visit ${partner.name}`}
        >
          {img}
        </a>
      ) : (
        <div className="partner-card__logo" aria-label={partner.name}>
          {img}
        </div>
      )}
    </div>
  )
}

export default function OfficialPartners() {
  const { lang } = useI18n()
  const { appliedTheme } = useTheme()
  return (
    <>
      <SEO {...pageMeta.officialPartners} lang={lang} />
      <StaticPageLayout
        breadcrumb="Official Partners"
        heroTitle="Official Partners"
        heroSubtitle="Organizations and institutions that support Abakada's mission to democratize access to digital tools for every Filipino."
      >
        <section className="content-section">
          <div className="container">
            <div className="feature-block">
              <div className="feature-block__content">
                <span className="feature-block__label">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="14" height="14">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                  <span>Our Partners</span>
                </span>
                <h2 className="feature-block__title">Building Together</h2>
                <p className="feature-block__text">
                  Abakada is made possible through the generous support of organizations that believe in open access to education and technology. Our partners share our commitment to empowering Filipino students, educators, and professionals.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="content-section content-section--alt">
          <div className="container">
            <div className="partner-grid partner-grid--2col">
              {PARTNERS.map((partner) => (
                <PartnerCard key={partner.name} partner={partner} appliedTheme={appliedTheme} />
              ))}
            </div>
          </div>
        </section>

        <section className="content-section content-section--cta">
          <div className="container">
            <div className="cta-block">
              <h2 className="cta-block__title">Become a Partner</h2>
              <p className="cta-block__text">
                Interested in supporting Abakada's mission? We'd love to hear from you. Explore our partnership models and get in touch with our team.
              </p>
              <div className="cta-block__actions">
                <Link to="/partnerships" className="btn btn--primary">View Partnership Models</Link>
                <Link to="/contact" className="btn btn--secondary">Contact Us</Link>
              </div>
            </div>
          </div>
        </section>
      </StaticPageLayout>
    </>
  )
}
