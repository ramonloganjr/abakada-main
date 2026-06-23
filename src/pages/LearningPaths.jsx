import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useI18n } from '../contexts/I18nContext'
import StaticPageLayout from '../components/StaticPageLayout'
import OnboardingModal from '../components/OnboardingModal'
import Icon from '../components/Icon'
import SEO from '../components/SEO'
import BrandLoader from '../components/BrandLoader'
import { pageMeta } from '../lib/pageMeta'

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
  const [curriculum, setCurriculum] = useState({ categories: [], strands: [] })
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [activeTrack, setActiveTrack] = useState('all')
  const [activeDifficulty, setActiveDifficulty] = useState('all')
  const [activeCurriculum, setActiveCurriculum] = useState('all')
  const [showCurriculumFilter, setShowCurriculumFilter] = useState(false)
  const [query, setQuery] = useState('')

  useEffect(() => {
    const required = fetch('/assets/data/learning-paths.json').then(r => {
      if (!r.ok) throw new Error(`learning-paths.json: HTTP ${r.status}`)
      return r.json()
    })
    const optional = fetch('/assets/data/curriculum.json')
      .then(r => r.ok ? r.json() : { categories: [], strands: [] })
      .catch(() => ({ categories: [], strands: [] }))

    Promise.all([required, optional])
      .then(([lp, cur]) => {
        setData({ toolkits: lp.toolkits || [], tracks: lp.tracks || [] })
        setCurriculum({ categories: cur.categories || [], strands: cur.strands || [] })
        setLoading(false)
      })
      .catch(err => {
        console.error('[LearningPaths] Failed to load required data:', err.message)
        setLoadError(true)
        setLoading(false)
      })
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
      if (activeCurriculum !== 'all' && !(tk.curriculum || []).includes(activeCurriculum)) return false
      if (q) {
        const hay = `${tk.title} ${tk.description} ${tk.tagline || ''} ${(tk.outcomes || []).join(' ')}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [data.toolkits, activeTrack, activeDifficulty, activeCurriculum, query])

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

  const k12Strands = curriculum.strands.filter(s => s.category === 'k12')
  const chedPrograms = curriculum.strands.filter(s => s.category === 'ched')

  const activeCurriculumStrand = curriculum.strands.find(s => s.id === activeCurriculum)

  function resetAllFilters() {
    setActiveTrack('all')
    setActiveDifficulty('all')
    setActiveCurriculum('all')
    setQuery('')
  }

  const hasActiveFilters = activeTrack !== 'all' || activeDifficulty !== 'all' || activeCurriculum !== 'all' || query.trim()

  return (
    <>
    <SEO {...pageMeta.learningPaths} lang={lang} />
    <StaticPageLayout
      breadcrumb={t('learningPaths.title', 'Learning Paths')}
      heroTitle={t('learningPaths.heroTitle', 'Learn the Tools. Build the Future.')}
      heroSubtitle={t('learningPaths.heroSubtitle', 'Curated, hands-on pathways to master open-source tools. Built for every learner, every level, every goal.')}
    >
      <section className="section">
        <div className="container">

          <div
            role="status"
            aria-live="polite"
            aria-atomic="true"
            className="sr-only"
          >
            {!loading && `${filtered.length} ${filtered.length !== 1 ? t('learningPaths.pathwaysFoundAria', 'pathways found') : t('learningPaths.pathwayFoundAria', 'pathway found')}`}
          </div>

          <div className="lp-stats">
            <div className="lp-stat">
              <div className="lp-stat__value">{totalToolkits}</div>
              <div className="lp-stat__label">{t('learningPaths.statCuratedPathways', 'Curated Pathways')}</div>
            </div>
            <div className="lp-stat">
              <div className="lp-stat__value">{data.tracks.length}</div>
              <div className="lp-stat__label">{t('learningPaths.statSkillTracks', 'Skill Tracks')}</div>
            </div>
            <div className="lp-stat">
              <div className="lp-stat__value">{totalStages}</div>
              <div className="lp-stat__label">{t('learningPaths.statHandsOnStages', 'Hands-On Stages')}</div>
            </div>
            <div className="lp-stat">
              <div className="lp-stat__value">{totalTools}</div>
              <div className="lp-stat__label">{t('learningPaths.statVettedTools', 'Vetted FOSS Tools')}</div>
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
                  : t('learningPaths.personaTextInactive', "Tell us who you are and we'll recommend the best pathway to start with. Students, professionals, educators, and self-directed learners welcome.")}
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
                  {t('learningPaths.forYouLabel', 'For You')}
                </span>
                <h2 className="lp-section-head__title">{t('learningPaths.recommendedPathways', 'Recommended pathways')}</h2>
              </div>
              <div className="lp-grid">
                {featured.map(tk => (
                  <PathCard key={tk.id} toolkit={tk} tracks={data.tracks} strands={curriculum.strands} />
                ))}
              </div>
            </div>
          )}

          {/* ── Filter panel ── */}
          <div className="lp-filters" role="search" aria-label="Filter pathways">
            <div className="lp-filters__search">
              <Icon name="search" collection="ui" size={16} aria-hidden="true" />
              <input
                type="search"
                placeholder={t('learningPaths.searchPlaceholder', 'Search pathways, tools, or outcomes…')}
                value={query}
                onChange={e => setQuery(e.target.value)}
                aria-label={t('learningPaths.searchPlaceholder', 'Search pathways, tools, or outcomes…')}
                aria-controls="lp-results-region"
              />
            </div>
            <div className="lp-filters__row">
              <div className="lp-pills" role="group" aria-label="Filter by track">
                <button type="button" aria-pressed={activeTrack === 'all'}
                  className={`lp-pill${activeTrack === 'all' ? ' lp-pill--active' : ''}`}
                  onClick={() => setActiveTrack('all')}>{t('learningPaths.allTracks', 'All Tracks')}</button>
                {data.tracks.map(tr => (
                  <button key={tr.id} type="button" aria-pressed={activeTrack === tr.id}
                    className={`lp-pill${activeTrack === tr.id ? ' lp-pill--active' : ''}`}
                    onClick={() => setActiveTrack(tr.id)}>
                    <Icon name={tr.icon} collection="ui" size={14} aria-hidden="true" />
                    {tr.title}
                  </button>
                ))}
              </div>
              <div className="lp-pills lp-pills--difficulty" role="group" aria-label="Filter by difficulty">
                {['all', 'beginner', 'intermediate', 'advanced'].map(diff => (
                  <button key={diff} type="button" aria-pressed={activeDifficulty === diff}
                    className={`lp-pill lp-pill--ghost${activeDifficulty === diff ? ' lp-pill--active' : ''}`}
                    onClick={() => setActiveDifficulty(diff)}>
                    {diff === 'all'
                      ? t('learningPaths.anyLevel', 'Any Level')
                      : t(`learningPaths.${diff}`, diff.charAt(0).toUpperCase() + diff.slice(1))}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Curriculum filter ── */}
            <div className="lp-curriculum">
              <button
                type="button"
                className={`lp-curriculum__toggle${showCurriculumFilter ? ' lp-curriculum__toggle--open' : ''}${activeCurriculum !== 'all' ? ' lp-curriculum__toggle--active' : ''}`}
                aria-expanded={showCurriculumFilter}
                onClick={() => setShowCurriculumFilter(v => !v)}
              >
                <Icon name="graduation-cap" collection="category" size={14} />
                <span>{t('learningPaths.curriculumFilter', 'Curriculum Alignment')}</span>
                {activeCurriculum !== 'all' && (
                  <span className="lp-curriculum__active-badge">{activeCurriculumStrand?.label}</span>
                )}
                <Icon name="chevron-down" collection="ui" size={13} className="lp-curriculum__chevron" />
              </button>

              {showCurriculumFilter && (
                <div className="lp-curriculum__body" role="group" aria-label="Filter by curriculum strand or program">
                  <p className="lp-curriculum__hint">
                    {t('learningPaths.curriculumFilterHint', 'Filter pathways aligned to a specific DepEd or CHED framework. Select one strand or program to see matching pathways.')}
                  </p>

                  <div className="lp-curriculum__section">
                    <span className="lp-curriculum__section-label">
                      <span className="lp-curriculum__authority lp-curriculum__authority--deped">{t('learningPaths.depedLabel', 'DepEd')}</span>
                      {t('learningPaths.k12Strands', 'K-12 Senior High School Strands')}
                    </span>
                    <div className="lp-pills" role="radiogroup" aria-label="K-12 strand">
                      <button type="button" role="radio" aria-checked={activeCurriculum === 'all'}
                        className={`lp-pill lp-pill--ghost${activeCurriculum === 'all' ? ' lp-pill--active' : ''}`}
                        onClick={() => setActiveCurriculum('all')}>{t('learningPaths.allStrands', 'All')}</button>
                      {k12Strands.map(s => (
                        <button key={s.id} type="button" role="radio" aria-checked={activeCurriculum === s.id}
                          className={`lp-pill lp-strand-pill lp-strand-pill--${s.color}${activeCurriculum === s.id ? ' lp-pill--active lp-strand-pill--selected' : ''}`}
                          title={s.fullName}
                          onClick={() => setActiveCurriculum(activeCurriculum === s.id ? 'all' : s.id)}>
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="lp-curriculum__section">
                    <span className="lp-curriculum__section-label">
                      <span className="lp-curriculum__authority lp-curriculum__authority--ched">{t('learningPaths.chedLabel', 'CHED')}</span>
                      {t('learningPaths.chedPrograms', 'Higher Education Programs')}
                    </span>
                    <div className="lp-pills" role="radiogroup" aria-label="CHED program">
                      {chedPrograms.map(s => (
                        <button key={s.id} type="button" role="radio" aria-checked={activeCurriculum === s.id}
                          className={`lp-pill lp-strand-pill lp-strand-pill--teal${activeCurriculum === s.id ? ' lp-pill--active lp-strand-pill--selected' : ''}`}
                          title={s.fullName}
                          onClick={() => setActiveCurriculum(activeCurriculum === s.id ? 'all' : s.id)}>
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {hasActiveFilters && (
              <div className="lp-filters__clear">
                <button type="button" className="btn btn--ghost btn--sm" onClick={resetAllFilters}>
                  <Icon name="x" collection="ui" size={12} />
                  {t('learningPaths.clearAllFilters', 'Clear all filters')}
                </button>
              </div>
            )}
          </div>

          {/* ── Active curriculum context banner ── */}
          {activeCurriculum !== 'all' && activeCurriculumStrand && (
            <div className="lp-curriculum-banner" role="status" aria-live="polite">
              <span className={`lp-curriculum-banner__dot lp-strand-dot--${activeCurriculumStrand.color}`} aria-hidden="true" />
              <div className="lp-curriculum-banner__copy">
                <strong>{activeCurriculumStrand.fullName}</strong>
                <span>{activeCurriculumStrand.description}</span>
              </div>
              <button type="button" className="lp-curriculum-banner__clear btn btn--ghost btn--sm"
                aria-label={t('learningPaths.clearFilters', 'Clear filters')}
                onClick={() => setActiveCurriculum('all')}>
                <Icon name="x" collection="ui" size={13} />
              </button>
            </div>
          )}

          <div id="lp-results-region">
          {loading ? (
            <BrandLoader variant="inline" ariaLabel={t('common.loading', 'Loading')} />
          ) : loadError ? (
            <div className="lp-empty" role="alert">
              <h3>Could not load learning paths</h3>
              <p>Check your connection and try again.</p>
              <button type="button" className="btn btn--secondary btn--sm" onClick={() => window.location.reload()}>
                Retry
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="lp-empty">
              <h3>{t('learningPaths.noPathwaysFound', 'No pathways match your filters')}</h3>
              <p>{t('learningPaths.noPathwaysHint', 'Try clearing the search or selecting a different strand or track.')}</p>
              <button type="button" className="btn btn--secondary btn--sm" onClick={resetAllFilters}>
                {t('learningPaths.clearFilters', 'Clear filters')}
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
                    {toolkits.length} {toolkits.length === 1 ? t('learningPaths.pathwayCount', 'pathway') : t('learningPaths.pathwaysCount', 'pathways')}
                  </span>
                </div>
                <div className="lp-grid">
                  {toolkits.map(tk => (
                    <PathCard key={tk.id} toolkit={tk} tracks={data.tracks} strands={curriculum.strands} activeCurriculum={activeCurriculum} />
                  ))}
                </div>
              </div>
            ))
          )}
          </div>
        </div>
      </section>

      {showOnboarding && (
        <OnboardingModal onClose={() => setShowOnboarding(false)} />
      )}
    </StaticPageLayout>
    </>
  )
}

function PathCard({ toolkit, tracks, strands = [], activeCurriculum = 'all' }) {
  const { t } = useI18n()
  const track = tracks.find(tr => tr.id === toolkit.track)
  const totalTools = toolkit.stages.reduce((sum, s) => sum + s.toolIds.length, 0)
  const explored = getProgress(toolkit.id)
  const pct = totalTools > 0 ? Math.round((explored / totalTools) * 100) : 0
  const started = explored > 0

  // Resolve curriculum tag objects for this toolkit — K-12 first, then CHED, max 3 shown
  const curriculumTags = useMemo(() => {
    const ids = toolkit.curriculum || []
    const resolved = ids.map(id => strands.find(s => s.id === id)).filter(Boolean)
    const k12 = resolved.filter(s => s.category === 'k12')
    const ched = resolved.filter(s => s.category === 'ched')
    const combined = [...k12, ...ched]
    return { shown: combined.slice(0, 3), overflow: Math.max(0, combined.length - 3) }
  }, [toolkit.curriculum, strands])

  const diffLabel = (d) => t(`learningPaths.${d}`, d.charAt(0).toUpperCase() + d.slice(1))
  const stagesText = toolkit.stages.length === 1
    ? `${toolkit.stages.length} ${t('learningPaths.stageLabel', 'stage')}`
    : `${toolkit.stages.length} ${t('learningPaths.stagesLabel', 'stages')}`

  const cardLabel = [
    toolkit.title,
    track ? track.title : null,
    toolkit.difficulty ? diffLabel(toolkit.difficulty) : null,
    toolkit.duration || null,
    stagesText,
    started ? `${pct}${t('learningPaths.percentComplete', '% complete')}` : t('learningPaths.notStarted', 'Not started'),
  ].filter(Boolean).join('. ')

  return (
    <Link
      to={`/learning-paths/${toolkit.id}`}
      className="lp-card"
      aria-label={cardLabel}
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
              {diffLabel(toolkit.difficulty)}
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

      {/* Curriculum alignment tags */}
      {curriculumTags.shown.length > 0 && (
        <div className="lp-card__curriculum" aria-label="Curriculum alignment">
          {curriculumTags.shown.map(s => (
            <span
              key={s.id}
              className={`lp-strand-tag lp-strand-tag--${s.color}${activeCurriculum === s.id ? ' lp-strand-tag--highlight' : ''}`}
              title={s.fullName}
            >
              {s.label}
            </span>
          ))}
          {curriculumTags.overflow > 0 && (
            <span className="lp-strand-tag lp-strand-tag--overflow">+{curriculumTags.overflow}</span>
          )}
        </div>
      )}

      <div className="lp-card__meta">
        <span className="lp-card__meta-item" title={t('learningPaths.stagesLabel', 'stages')}>
          <Icon name="list" collection="ui" size={13} />
          {stagesText}
        </span>
        {toolkit.duration && (
          <span className="lp-card__meta-item">
            <Icon name="clock" collection="ui" size={13} />
            {toolkit.duration}
          </span>
        )}
        <span className="lp-card__meta-item">
          <Icon name="wrench" collection="ui" size={13} />
          {totalTools} {t('learningPaths.toolsLabel', 'tools')}
        </span>
      </div>

      <div className="lp-card__progress" aria-hidden="true">
        <div
          className="lp-card__progress-track"
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${t('learningPaths.progressLabel', 'Progress')}: ${pct}%`}
        >
          <div className="lp-card__progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <span className="lp-card__progress-label">
          {started
            ? `${pct}${t('learningPaths.percentComplete', '% complete')}`
            : t('learningPaths.startPath', 'Start path')}
          <Icon name="chevron-right" collection="ui" size={12} aria-hidden="true" />
        </span>
      </div>
    </Link>
  )
}
