import { useState, useEffect, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useI18n } from '../contexts/I18nContext'
import { useProgress } from '../hooks/useProgress'
import StaticPageLayout from '../components/StaticPageLayout'
import LearningToolCard from '../components/LearningToolCard'
import ToolModal from '../components/ToolModal'
import Icon from '../components/Icon'
import SEO from '../components/SEO'
import BrandLoader from '../components/BrandLoader'
import CompletionCertificate from '../components/CompletionCertificate'
import { buildLearningPathMeta } from '../lib/pageMeta'

export default function LearningPathDetail({ toolsData = { tools: [], categories: [] } }) {
  const { toolkitId } = useParams()
  const { t, lang } = useI18n()
  const diffLabel = (d) => t(`learningPaths.${d}`, d.charAt(0).toUpperCase() + d.slice(1))
  const [data, setData] = useState({ toolkit: null, track: null })
  const [curriculumStrands, setCurriculumStrands] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const { markExplored, unmarkExplored, isExplored } = useProgress(toolkitId)
  const [selectedTool, setSelectedTool] = useState(null)
  const [openStageId, setOpenStageId] = useState(null)
  const [completedTasks, setCompletedTasks] = useState(() => {
    try {
      const raw = localStorage.getItem(`abakada_tasks_${toolkitId}`)
      return raw ? new Set(JSON.parse(raw)) : new Set()
    } catch { return new Set() }
  })

  useEffect(() => {
    const required = fetch('/assets/data/learning-paths.json').then(r => {
      if (!r.ok) throw new Error(`learning-paths.json: HTTP ${r.status}`)
      return r.json()
    })
    const optional = fetch('/assets/data/curriculum.json')
      .then(r => r.ok ? r.json() : { strands: [] })
      .catch(() => ({ strands: [] }))

    Promise.all([required, optional])
      .then(([lp, cur]) => {
        const tk = (lp.toolkits || []).find(t => t.id === toolkitId)
        const tr = tk ? (lp.tracks || []).find(x => x.id === tk.track) : null
        setData({ toolkit: tk || null, track: tr || null })
        setCurriculumStrands(cur.strands || [])
        setLoading(false)
        if (tk && tk.stages.length > 0) {
          setOpenStageId(tk.stages[0].id)
        }
      })
      .catch(err => {
        console.error('[LearningPathDetail] Failed to load required data:', err.message)
        setLoadError(true)
        setLoading(false)
      })
  }, [toolkitId])

  useEffect(() => {
    try { localStorage.setItem(`abakada_tasks_${toolkitId}`, JSON.stringify([...completedTasks])) } catch {}
  }, [completedTasks, toolkitId])

  const stageMetrics = useMemo(() => {
    if (!data.toolkit) return { allToolIds: [], totalTools: 0, exploredCount: 0, stageStatus: {} }
    const allToolIds = data.toolkit.stages.flatMap(s => s.toolIds)
    const exploredCount = allToolIds.filter(id => isExplored(id)).length
    const stageStatus = {}
    data.toolkit.stages.forEach(s => {
      const total = s.toolIds.length
      const done = s.toolIds.filter(id => isExplored(id)).length
      stageStatus[s.id] = {
        total,
        done,
        complete: total > 0 && done === total,
        started: done > 0,
        pct: total > 0 ? Math.round((done / total) * 100) : 0,
      }
    })
    return { allToolIds, totalTools: allToolIds.length, exploredCount, stageStatus }
  }, [data.toolkit, isExplored])

  if (loading) {
    return (
      <StaticPageLayout breadcrumb={t('common.loading', 'Loading')} heroTitle="">
        <BrandLoader variant="block" ariaLabel={t('common.loading', 'Loading')} />
      </StaticPageLayout>
    )
  }

  if (loadError) {
    return (
      <StaticPageLayout breadcrumb={t('common.error', 'Error')} heroTitle="">
        <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
          <p>Could not load this learning path. Check your connection and try again.</p>
          <button type="button" className="btn btn--primary" style={{ marginTop: '1rem' }} onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      </StaticPageLayout>
    )
  }

  if (!data.toolkit) {
    return (
      <StaticPageLayout breadcrumb={t('learningPaths.notFound', 'Not Found')} heroTitle="">
        <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
          <p>{t('learningPaths.toolkitNotFound', 'Toolkit not found.')}</p>
          <Link to="/learning-paths" className="btn btn--primary" style={{ marginTop: '1rem', display: 'inline-block' }}>
            {t('learningPaths.backToAll', 'Back to Learning Paths')}
          </Link>
        </div>
      </StaticPageLayout>
    )
  }

  const { toolkit, track } = data
  const { totalTools, exploredCount, stageStatus } = stageMetrics
  const overallPct = totalTools > 0 ? Math.round((exploredCount / totalTools) * 100) : 0
  const completedStages = Object.values(stageStatus).filter(s => s.complete).length
  const totalStages = toolkit.stages.length

  const allTaskIds = toolkit.stages.flatMap(s => (s.tasks || []).map((_, i) => `${s.id}::${i}`))
  const completedTaskCount = allTaskIds.filter(id => completedTasks.has(id)).length

  function getCategoryIcon(tool) {
    const cat = toolsData.categories?.find(c => c.id === tool.category)
    return cat?.icon || 'box'
  }

  function toggleTask(taskKey) {
    setCompletedTasks(prev => {
      const next = new Set(prev)
      if (next.has(taskKey)) next.delete(taskKey)
      else next.add(taskKey)
      return next
    })
  }

  function toggleStage(id) {
    setOpenStageId(prev => (prev === id ? null : id))
  }

  const seoMeta = buildLearningPathMeta(toolkit)

  return (
    <>
    <SEO {...seoMeta} lang={lang} />
    <StaticPageLayout
      breadcrumb={toolkit.title}
      heroTitle={toolkit.title}
    >
      <section className="section">
        <div className="container">

          <div className="lpj-header">
            <div className="lpj-header__main">
              <div className="lpj-header__top">
                <span className="lpj-header__icon" aria-hidden="true">
                  <Icon name={toolkit.icon || 'box'} collection="ui" size={28} />
                </span>
                <div className="lpj-header__badges">
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
                  {toolkit.duration && (
                    <span className="lpj-meta-pill">
                      <Icon name="clock" collection="ui" size={11} />
                      {toolkit.duration}
                    </span>
                  )}
                </div>
              </div>
              {toolkit.tagline && <p className="lpj-header__tagline">{toolkit.tagline}</p>}
              <p className="lpj-header__description">{toolkit.description}</p>

              {Array.isArray(toolkit.outcomes) && toolkit.outcomes.length > 0 && (
                <div className="lpj-outcomes">
                  <h2 className="lpj-outcomes__title">
                    <Icon name="target" collection="ui" size={14} />
                    {t('learningPaths.byTheEnd', "By the end, you'll be able to:")}
                  </h2>
                  <ul className="lpj-outcomes__list">
                    {toolkit.outcomes.map((o, i) => (
                      <li key={i}>
                        <Icon name="check" collection="ui" size={16} />
                        <span>{o}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* ── Curriculum Alignment ── */}
              {Array.isArray(toolkit.curriculum) && toolkit.curriculum.length > 0 && (() => {
                const tags = toolkit.curriculum
                  .map(id => curriculumStrands.find(s => s.id === id))
                  .filter(Boolean)
                const k12 = tags.filter(s => s.category === 'k12')
                const ched = tags.filter(s => s.category === 'ched')
                if (!tags.length) return null
                return (
                  <div className="lpj-curriculum" aria-label="Curriculum alignment">
                    <h2 className="lpj-curriculum__title">
                      <Icon name="graduation-cap" collection="category" size={14} />
                      {t('learningPaths.curriculumAlignment', 'Curriculum Alignment')}
                    </h2>
                    <p className="lpj-curriculum__intro">
                      {t('learningPaths.curriculumAlignedIntro', 'This pathway is aligned with the following DepEd and CHED frameworks, making it directly applicable to your coursework and learning goals.')}
                    </p>
                    {k12.length > 0 && (
                      <div className="lpj-curriculum__group">
                        <span className="lpj-curriculum__group-label">
                          <span className="lp-curriculum__authority lp-curriculum__authority--deped">{t('learningPaths.depedLabel', 'DepEd')}</span>
                          {t('learningPaths.k12Label', 'K-12 Senior High School')}
                        </span>
                        <div className="lpj-curriculum__tags">
                          {k12.map(s => (
                            <span key={s.id} className={`lp-strand-tag lp-strand-tag--${s.color} lp-strand-tag--lg`} title={s.fullName}>
                              <span className={`lp-strand-dot lp-strand-dot--${s.color}`} aria-hidden="true" />
                              <strong>{s.label}</strong>
                              <span className="lp-strand-tag__full">{s.fullName}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {ched.length > 0 && (
                      <div className="lpj-curriculum__group">
                        <span className="lpj-curriculum__group-label">
                          <span className="lp-curriculum__authority lp-curriculum__authority--ched">{t('learningPaths.chedLabel', 'CHED')}</span>
                          {t('learningPaths.higherEdLabel', 'Higher Education Programs')}
                        </span>
                        <div className="lpj-curriculum__tags">
                          {ched.map(s => (
                            <span key={s.id} className="lp-strand-tag lp-strand-tag--teal lp-strand-tag--lg" title={s.fullName}>
                              <span className="lp-strand-dot lp-strand-dot--teal" aria-hidden="true" />
                              <strong>{s.label}</strong>
                              <span className="lp-strand-tag__full">{s.fullName}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })()}
            </div>

            <aside className="lpj-progress" aria-label={t('learningPaths.progressLabel', 'Progress')}>
              <div className="lpj-progress__ring" role="img" aria-label={`${overallPct}% complete`}>
                <svg viewBox="0 0 120 120" width="120" height="120">
                  <circle cx="60" cy="60" r="52" fill="none" stroke="var(--border-secondary)" strokeWidth="8" />
                  <circle
                    cx="60" cy="60" r="52" fill="none"
                    stroke="var(--accent-primary)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${(overallPct / 100) * 326.7} 326.7`}
                    strokeDashoffset="0"
                    transform="rotate(-90 60 60)"
                    style={{ transition: 'stroke-dasharray 0.6s cubic-bezier(0.16,1,0.3,1)' }}
                  />
                </svg>
                <div className="lpj-progress__ring-label">
                  <strong>{overallPct}%</strong>
                  <span>{t('learningPaths.complete', 'complete')}</span>
                </div>
              </div>
              <ul className="lpj-progress__stats">
                <li>
                  <Icon name="check-circle" collection="ui" size={14} />
                  <span><strong>{completedStages}</strong> / {totalStages} {t('learningPaths.stagesCleared', 'stages cleared')}</span>
                </li>
                <li>
                  <Icon name="wrench" collection="ui" size={14} />
                  <span><strong>{exploredCount}</strong> / {totalTools} {t('learningPaths.toolsExplored', 'tools explored')}</span>
                </li>
                <li>
                  <Icon name="list-checks" collection="ui" size={14} />
                  <span><strong>{completedTaskCount}</strong> {t('learningPaths.tasksDone', 'hands-on tasks done')}</span>
                </li>
              </ul>
              {overallPct === 100 && (
                <CompletionCertificate toolkit={toolkit} />
              )}
            </aside>
          </div>

          <ol className="lpj-stages" aria-label="Learning stages">
            {toolkit.stages.map((stage, idx) => {
              const status = stageStatus[stage.id] || { pct: 0, complete: false, started: false }
              const isOpen = openStageId === stage.id
              const stageTools = stage.toolIds
                .map(id => toolsData.tools.find(t => t.id === id))
                .filter(Boolean)
              const stateLabel = status.complete ? 'Completed' : status.started ? 'In Progress' : 'Up Next'
              const stateClass = status.complete ? 'lpj-stage--complete' : status.started ? 'lpj-stage--active' : 'lpj-stage--upcoming'
              const stateIcon = status.complete ? 'check-circle' : status.started ? 'play-circle' : 'circle-empty'

              return (
                <li key={stage.id} id={`stage-${stage.id}`} className={`lpj-stage ${stateClass}${isOpen ? ' lpj-stage--open' : ''}`}>
                  <button
                    type="button"
                    className="lpj-stage__header"
                    onClick={() => toggleStage(stage.id)}
                    aria-expanded={isOpen}
                    aria-controls={`stage-body-${stage.id}`}
                  >
                    <span className="lpj-stage__node" aria-hidden="true">
                      {status.complete ? (
                        <Icon name="check" collection="ui" size={18} />
                      ) : (
                        <span className="lpj-stage__node-num">{idx + 1}</span>
                      )}
                    </span>
                    <div className="lpj-stage__intro">
                      <div className="lpj-stage__intro-top">
                        <h2 className="lpj-stage__title">{stage.title}</h2>
                        <span className={`lpj-stage__state lpj-stage__state--${status.complete ? 'complete' : status.started ? 'active' : 'upcoming'}`}>
                          <Icon name={stateIcon} collection="ui" size={11} />
                          {stateLabel}
                        </span>
                      </div>
                      <p className="lpj-stage__description">{stage.description}</p>
                      <div className="lpj-stage__meta">
                        {stage.estimatedTime && (
                          <span><Icon name="clock" collection="ui" size={12} /> {stage.estimatedTime}</span>
                        )}
                        <span><Icon name="wrench" collection="ui" size={12} /> {stage.toolIds.length} tools</span>
                        {Array.isArray(stage.tasks) && (
                          <span><Icon name="list-checks" collection="ui" size={12} /> {stage.tasks.length} tasks</span>
                        )}
                        <span className="lpj-stage__pct">{status.pct}%</span>
                      </div>
                      <div
                        className="lpj-stage__bar"
                        role="progressbar"
                        aria-valuenow={status.pct}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`Stage progress: ${status.pct}%`}
                      >
                        <div className="lpj-stage__bar-fill" style={{ width: `${status.pct}%` }} />
                      </div>
                    </div>
                    <span className="lpj-stage__chevron" aria-hidden="true">
                      <Icon name="chevron-down" collection="ui" size={18} />
                    </span>
                  </button>

                  <div className="lpj-stage__body" id={`stage-body-${stage.id}`} hidden={!isOpen}>
                      {Array.isArray(stage.objectives) && stage.objectives.length > 0 && (
                        <div className="lpj-block">
                          <h3 className="lpj-block__title">
                            <Icon name="target" collection="ui" size={13} />
                            {t('learningPaths.learningObjectives', 'Learning objectives')}
                          </h3>
                          <ul className="lpj-objectives">
                            {stage.objectives.map((obj, i) => (
                              <li key={i}>
                                <span className="lpj-objectives__dot" aria-hidden="true" />
                                {obj}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {Array.isArray(stage.tasks) && stage.tasks.length > 0 && (
                        <div className="lpj-block">
                          <h3 className="lpj-block__title">
                            <Icon name="list-checks" collection="ui" size={13} />
                            {t('learningPaths.handsonTasks', 'Hands-on tasks')}
                          </h3>
                          <ul className="lpj-tasks">
                            {stage.tasks.map((task, i) => {
                              const key = `${stage.id}::${i}`
                              const done = completedTasks.has(key)
                              return (
                                <li key={i} className={`lpj-task${done ? ' lpj-task--done' : ''}`}>
                                  <label>
                                    <input
                                      type="checkbox"
                                      checked={done}
                                      onChange={() => toggleTask(key)}
                                      aria-label={done ? `Task ${i + 1} complete — click to mark incomplete` : `Mark task ${i + 1} as complete`}
                                    />
                                    <span>{task}</span>
                                  </label>
                                </li>
                              )
                            })}
                          </ul>
                        </div>
                      )}

                      <div className="lpj-block">
                        <h3 className="lpj-block__title">
                          <Icon name="wrench" collection="ui" size={13} />
                          {t('learningPaths.recommendedTools', 'Recommended tools')}
                        </h3>
                        <div className="grid grid--tools learning-path-tools-grid">
                          {stageTools.map(tool => (
                            <div key={tool.id} className="learning-path-stage__tool-wrapper">
                              <LearningToolCard
                                tool={tool}
                                categoryIcon={getCategoryIcon(tool)}
                                onInfoClick={setSelectedTool}
                                isExplored={isExplored(tool.id)}
                                onToggleExplored={id => isExplored(id) ? unmarkExplored(id) : markExplored(id)}
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      {status.complete && (
                        <div className="lpj-milestone" role="status">
                          <span className="lpj-milestone__icon" aria-hidden="true">
                            <Icon name="award" collection="ui" size={20} />
                          </span>
                          <div className="lpj-milestone__copy">
                            <strong>{t('learningPaths.stageComplete', 'Stage complete.')}</strong>{' '}
                            {idx + 1 < toolkit.stages.length
                              ? t('learningPaths.earnedNextStage', "You've earned the next stage.")
                              : t('learningPaths.completedPathway', "You've completed the pathway.")}
                          </div>
                          {idx + 1 < toolkit.stages.length && (
                            <button type="button" className="btn btn--secondary btn--sm"
                              onClick={() => {
                                const nextStage = toolkit.stages[idx + 1]
                                setOpenStageId(nextStage.id)
                                requestAnimationFrame(() => {
                                  document.getElementById(`stage-${nextStage.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                                })
                              }}>
                              {t('learningPaths.nextStage', 'Next stage')}
                              <Icon name="chevron-right" collection="ui" size={12} aria-hidden="true" />
                            </button>
                          )}
                        </div>
                      )}
                  </div>
                </li>
              )
            })}
          </ol>

          <div className="lpj-footer">
            <Link to="/learning-paths" className="btn btn--secondary btn--sm">
              <Icon name="chevron-left" collection="ui" size={14} />
              {t('learningPaths.backToAll', 'Back to Learning Paths')}
            </Link>
            <button
              type="button"
              className="btn btn--secondary btn--sm no-print"
              onClick={() => window.print()}
              aria-label={t('learningPaths.printChecklist', 'Print Checklist')}
            >
              <Icon name="printer" collection="ui" size={14} aria-hidden="true" />
              {t('learningPaths.printChecklist', 'Print Checklist')}
            </button>
            {overallPct < 100 && (
              <p className="lpj-footer__nudge">
                {t('learningPaths.motivationNudge', 'Consistency beats intensity — even 15 minutes a day will get you there.')}
              </p>
            )}
          </div>
        </div>
      </section>

      {selectedTool && (
        <ToolModal
          tool={selectedTool}
          categoryIcon={getCategoryIcon(selectedTool)}
          onClose={() => setSelectedTool(null)}
        />
      )}
    </StaticPageLayout>
    </>
  )
}
