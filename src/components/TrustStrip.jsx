import { useTheme } from '../contexts/ThemeContext'
import { useI18n } from '../contexts/I18nContext'
import { useVisitorCount } from '../hooks/useVisitorCount'
import { PRESS } from '../lib/press'

// Above-the-fold social proof for the home page (review R10.1 / R10.5): the press
// logos and live visitor count are the project's strongest trust signals, but they
// previously only lived in the footer where most first-time visitors never scroll.
// This surfaces them immediately below the hero. The same PRESS source and visitor
// hook power the footer, so the two can never disagree.
export default function TrustStrip() {
  const { appliedTheme } = useTheme()
  const { t } = useI18n()
  const { totalUsers } = useVisitorCount()

  return (
    <section className="trust-strip" aria-label={t('trust.ariaLabel', 'Trusted by the community and featured in the press')}>
      <div className="container trust-strip__inner">
        {totalUsers && (
          <p className="trust-strip__visitors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <span>
              <strong>{totalUsers.toLocaleString()}</strong> {t('trust.visitors', 'Filipinos served and counting')}
            </span>
          </p>
        )}

        <div className="trust-strip__press">
          <span className="trust-strip__press-label">{t('trust.featuredIn', 'As featured in')}</span>
          <div className="trust-strip__logos">
            {PRESS.map(item => (
              <a
                key={item.name}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="trust-strip__link"
                aria-label={t('trust.coverageOn', 'Read Abakada coverage on') + ' ' + item.name}
              >
                <img
                  src={appliedTheme === 'dark' ? item.logoDark : item.logoLight}
                  alt={item.name}
                  className="trust-strip__img"
                  loading="lazy"
                  decoding="async"
                  height="22"
                  width="auto"
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
