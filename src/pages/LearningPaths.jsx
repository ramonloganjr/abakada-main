import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useI18n } from '../contexts/I18nContext'
import StaticPageLayout from '../components/StaticPageLayout'
import OnboardingModal from '../components/OnboardingModal'
import Icon from '../components/Icon'
import SEO from '../components/SEO'
import BrandLoader from '../components/BrandLoader'
import { pageMeta } from '../lib/pageMeta'

const DIFFICULTY_LABEL = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
}

function getProgress(toolkitId) {
  try {
    const raw = localStorage.getItem(`abakada_progress_${toolkitId}`)
    if (!raw) return 0
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.length : 0
  } catch { return 0 }
}

export default function LearningPaths() {
  const { t, lang } = useI18n()
  const [data, setData] = useState({ toolkits: [], tracks: [] })
  const [loading, setLoading] = useState(true)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [activeTrack, setActiveTrack] = useState('all')
  const [activeDifficulty, setActiveDifficulty] = useState('all')
  const [query, setQuery] = useState('')

  useEffect(() => {
    fetch('/assets/data/learning-paths.json')
      .then(r => r.json())
      .then(d => { setData({ toolkits: d.toolkits || [], tracks: d.tracks || [] }); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const userRole = (typeof localStorage !== 'undefined' && localStorage.getItem('abakada_onboarding_role')) || ''
  const hasRole = Boolean(userRole)

  const featured = useMemo(() => {
    if (!hasRole) return []
    return data.toolkits.filter(tk =>
      tk.role === userRole || (tk.audiences || []).includes(userRole)
    ).slice(0, 3)
  }, [data.toolkits, userRole, hasRole])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return data.toolkits.filter(tk => {
      if (activeTrack !== 'all' && tk.track !== activeTrack) return false
      if (activeDifficulty !== 'all' && tk.difficulty !== activeDifficulty) return false
      if (q) {
        const hay = `${tk.title} ${tk.description} ${tk.tagline || ''} ${(tk.outcomes || []).join(' ')}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [data.toolkits, activeTrack, activeDifficulty, query])

  const grouped = useMemo(() => {
    const map = new Map()
    data.tracks.forEach(tr => map.set(tr.id, []))
    filtered.forEach(tk => {
      if (!map.has(tk.track)) map.set(tk.track, [])
      map.get(tk.track).push(tk)
    })
    return Array.from(map.entries())
      .map(([trackId, toolkits]) => ({ track: data.tracks.find(t => t.id === trackId), toolkits }))
      .filter(g => g.track && g.toolkits.length > 0)
  }, [filtered, data.tracks])

  const totalToolkits = data.toolkits.length
  const totalStages = data.toolkits.reduce((sum, tk) => sum + tk.stages.length, 0)
  const totalTools = data.toolkits.reduce((sum, tk) => sum + tk.stages.reduce((s, st) => s + st.toolIds.length, 0), 0)

  return (
    <>
    <SEO {...pageMeta.learningPaths} lang={lang} />
    <StaticPageLayout
      breadcrumb={t('learningPaths.title', 'Learning Paths')}
      heroTitle={t('learningPaths.heroTitle', 'Learn the Tools. Build the Future.')}
      heroSubtitle={t('learningPaths.heroSubtitle', 'Curated, hands-on pathways to master open-source tools — built for every learner, every level, every goal.')}
    >
      <section className="section">
        <div className="container">

          <div className="lp-stats">
            <div className="lp-stat">
              <div className="lp-stat__value">{totalToolkits}</div>
              <div className="lp-stat__label">Curated Pathways</div>
            </div>
            <div className="lp-stat">
              <div className="lp-stat__value">{data.tracks.length}</div>
              <div className="lp-stat__label">Skill Tracks</div>
            </div>
            <div className="lp-stat">
              <div className="lp-stat__value">{totalStages}</div>
              <div className="lp-stat__label">Hands-On Stages</div>
            </div>
            <div className="lp-stat">
              <div className="lp-stat__value">{totalTools}</div>
              <div className="lp-stat__label">Vetted FOSS Tools</div>
            </div>
          </div>

          <div className="lp-persona">
            <div className="lp-persona__copy">
              <p className="lp-persona__eyebrow">
                {hasRole ? t('learningPaths.personaActive', 'Your learning profile') : t('learningPaths.personaInactive', 'New here?')}
              </p>
              <h2 className="lp-persona__title">
                {hasRole
                  ? t('learningPaths.personaTitleActive', 'Pathways tailored to you')
                  : t('learningPaths.personaTitleInactive', 'Find your perfect starting point')}
              </h2>
              <p className="lp-persona__text">
                {hasRole
                  ? t('learningPaths.personaTextActive', "Below are pathways matched to your role. You can switch your profile anytime.")
                  : t('learningPaths.personaTextInactive', "Tell us who you are and we'll recommend the best pathway to start with — students, professionals, educators, and self-directed learners welcome.")}
              </p>
            </div>
            <button
              type="button"
              className="btn btn--primary lp-persona__btn"
              onClick={() => setShowOnboarding(true)}
            >
              {hasRole
                ? t('learningPaths.changePath', 'Change my path')
                : t('learningPaths.takeAssessment', 'Find my path')}
              <Icon name="chevron-right" collection="ui" size={14} />
            </button>
          </div>

          {featured.length > 0 && (
            <div className="lp-featured">
              <div className="lp-section-head">
                <span className="lp-section-head__badge">
                  <Icon name="sparkles" collection="ui" size={12} />
                  For You
                </span>
                <h2 className="lp-section-head__title">Recommended pathways</h2>
              </div>
              <div className="lp-grid">
                {featured.map(tk => (
                  <PathCard key={tk.id} toolkit={tk} tracks={data.tracks} t={t} />
                ))}
              </div>
            </div>
          )}

          <div className="lp-filters" role="search" aria-label="Filter pathways">
            <div className="lp-filters__search">
              <Icon name="search" collection="ui" size={16} />
              <input
                type="search"
                placeholder={t('learningPaths.searchPlaceholder', 'Search pathways, tools, or outcomes…')}
                value={query}
                onChange={e => setQuery(e.target.value)}
                aria-label="Search pathways"
              />
            </div>
            <div className="lp-filters__row">
              <div className="lp-pills" role="tablist" aria-label="Track">
                <button type="button" role="tab" aria-selected={activeTrack === 'all'}
                  className={`lp-pill${activeTrack === 'all' ? ' lp-pill--active' : ''}`}
                  onClick={() => setActiveTrack('all')}>All Tracks</button>
                {data.tracks.map(tr => (
                  <button key={tr.id} type="button" role="tab" aria-selected={activeTrack === tr.id}
                    className={`lp-pill${activeTrack === tr.id ? ' lp-pill--active' : ''}`}
                    onClick={() => setActiveTrack(tr.id)}>
                    <Icon name={tr.icon} collection="ui" size={14} />
                    {tr.title}
                  </button>
                ))}
              </div>
              <div className="lp-pills lp-pills--difficulty" role="tablist" aria-label="Difficulty">
                {['all', 'beginner', 'intermediate', 'advanced'].map(diff => (
                  <button key={diff} type="button" role="tab" aria-selected={activeDifficulty === diff}
                    className={`lp-pill lp-pill--ghost${activeDifficulty === diff ? ' lp-pill--active' : ''}`}
                    onClick={() => setActiveDifficulty(diff)}>
                    {diff === 'all' ? 'Any Level' : DIFFICULTY_LABEL[diff]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {loading ? (
            <BrandLoader variant="inline" ariaLabel={t('common.loading', 'Loading')} />
          ) : filtered.length === 0 ? (
            <div className="lp-empty">
              <h3>No pathways match your filters</h3>
              <p>Try clearing the search or selecting a different track.</p>
              <button type="button" className="btn btn--secondary btn--sm"
                onClick={() => { setActiveTrack('all'); setActiveDifficulty('all'); setQuery('') }}>
                Clear filters
              </button>
            </div>
          ) : (
            grouped.map(({ track, toolkits }) => (
              <div key={track.id} className="lp-track-section">
                <div className="lp-section-head">
                  <span className="lp-track-icon" aria-hidden="true">
                    <Icon name={track.icon} collection="ui" size={18} />
                  </span>
                  <div className="lp-section-head__copy">
                    <h2 className="lp-section-head__title">{track.title}</h2>
                    <p className="lp-section-head__sub">{track.description}</p>
                  </div>
                  <span className="lp-section-head__count">
                    {toolkits.length} {toolkits.length === 1 ? 'pathway' : 'pathways'}
                  </span>
                </div>
                <div className="lp-grid">
                  {toolkits.map(tk => (
                    <PathCard key={tk.id} toolkit={tk} tracks={data.tracks} t={t} />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {showOnboarding && (
        <OnboardingModal onClose={() => setShowOnboarding(false)} />
      )}
    </StaticPageLayout>
    </>
  )
}

function PathCard({ toolkit, tracks, t }) {
  const track = tracks.find(tr => tr.id === toolkit.track)
  const totalTools = toolkit.stages.reduce((sum, s) => sum + s.toolIds.length, 0)
  const explored = getProgress(toolkit.id)
  const pct = totalTools > 0 ? Math.round((explored / totalTools) * 100) : 0
  const started = explored > 0

  return (
    <Link
      to={`/learning-paths/${toolkit.id}`}
      className="lp-card"
      aria-label={toolkit.title}
    >
      <div className="lp-card__top">
        <span className="lp-card__icon" aria-hidden="true">
          <Icon name={toolkit.icon || 'box'} collection="ui" size={22} />
        </span>
        <div className="lp-card__badges">
          {track && (
            <span className="lp-card__track-badge">
              <Icon name={track.icon} collection="ui" size={11} />
              {track.title}
            </span>
          )}
          {toolkit.difficulty && (
            <span className={`lp-card__difficulty lp-card__difficulty--${toolkit.difficulty}`}>
              <span className="lp-card__difficulty-dots" aria-hidden="true">
                <span /><span /><span />
              </span>
              {DIFFICULTY_LABEL[toolkit.difficulty] || toolkit.difficulty}
            </span>
          )}
        </div>
      </div>

      <h3 className="lp-card__title">{toolkit.title}</h3>
      {toolkit.tagline && <p className="lp-card__tagline">{toolkit.tagline}</p>}
      <p className="lp-card__description">{toolkit.description}</p>

      {Array.isArray(toolkit.outcomes) && toolkit.outcomes.length > 0 && (
        <ul className="lp-card__outcomes">
          {toolkit.outcomes.slice(0, 3).map((o, i) => (
            <li key={i}>
              <Icon name="check" collection="ui" size={14} />
              <span>{o}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="lp-card__meta">
        <span className="lp-card__meta-item" title="Stages">
          <Icon name="list" collection="ui" size={13} />
          {toolkit.stages.length} stages
        </span>
        {toolkit.duration && (
          <span className="lp-card__meta-item" title="Estimated duration">
            <Icon name="clock" collection="ui" size={13} />
            {toolkit.duration}
          </span>
        )}
        <span className="lp-card__meta-item" title="Tools">
          <Icon name="wrench" collection="ui" size={13} />
          {totalTools} tools
        </span>
      </div>

      <div className="lp-card__progress">
        <div className="lp-card__progress-track">
          <div className="lp-card__progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <span className="lp-card__progress-label">
          {started ? `${pct}% complete` : 'Start path'}
          <Icon name="chevron-right" collection="ui" size={12} />
        </span>
      </div>
    </Link>
  )
}
