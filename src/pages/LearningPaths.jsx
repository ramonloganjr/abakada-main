import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useI18n } from '../contexts/I18nContext'
import StaticPageLayout from '../components/StaticPageLayout'
import OnboardingModal from '../components/OnboardingModal'

export default function LearningPaths() {
  const { t } = useI18n()
  const [toolkits, setToolkits] = useState([])
  const [loading, setLoading] = useState(true)
  const [showOnboarding, setShowOnboarding] = useState(false)

  useEffect(() => {
    fetch('/assets/data/learning-paths.json')
      .then(r => r.json())
      .then(data => { setToolkits(data.toolkits || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const hasRole = Boolean(localStorage.getItem('abakada_onboarding_role'))

  return (
    <StaticPageLayout
      breadcrumb={t('learningPaths.title', 'Learning Paths')}
      heroTitle={t('learningPaths.title', 'Learning Paths')}
    >
      <section className="section">
        <div className="container">
          <div className="learning-paths__header">
            <p className="learning-paths__intro">
              {t('learningPaths.intro', 'Curated toolkits to guide you through your learning journey — step by step.')}
            </p>
            {hasRole && (
              <button
                type="button"
                className="btn btn--secondary btn--sm"
                onClick={() => setShowOnboarding(true)}
              >
                {t('learningPaths.changePath', 'Change my path')}
              </button>
            )}
          </div>

          {loading ? (
            <p>{t('common.loading', 'Loading...')}</p>
          ) : (
            <div className="learning-paths__grid">
              {toolkits.map(toolkit => (
                <Link
                  key={toolkit.id}
                  to={`/learning-paths/${toolkit.id}`}
                  className="learning-path-card"
                  aria-label={toolkit.title}
                >
                  <div className="learning-path-card__header">
                    <span className={`learning-path-card__role-badge learning-path-card__role-badge--${toolkit.role}`}>
                      {t(`learningPaths.role.${toolkit.role}`, toolkit.role)}
                    </span>
                  </div>
                  <h2 className="learning-path-card__title">{toolkit.title}</h2>
                  <p className="learning-path-card__description">{toolkit.description}</p>
                  <div className="learning-path-card__footer">
                    <span className="learning-path-card__stages">
                      {t('learningPaths.stageCount', '{{count}} stages').replace('{{count}}', toolkit.stages.length)}
                    </span>
                    <span className="learning-path-card__cta">
                      {t('learningPaths.startPath', 'Start path')} →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {showOnboarding && (
        <OnboardingModal onClose={() => setShowOnboarding(false)} />
      )}
    </StaticPageLayout>
  )
}
