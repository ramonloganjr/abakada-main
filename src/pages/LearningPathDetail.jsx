import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useI18n } from '../contexts/I18nContext'
import { useProgress } from '../hooks/useProgress'
import StaticPageLayout from '../components/StaticPageLayout'
import LearningToolCard from '../components/LearningToolCard'
import ToolModal from '../components/ToolModal'

export default function LearningPathDetail({ toolsData = { tools: [], categories: [] } }) {
  const { toolkitId } = useParams()
  const { t } = useI18n()
  const [toolkit, setToolkit] = useState(null)
  const [loading, setLoading] = useState(true)
  const { exploredIds, markExplored, unmarkExplored, isExplored } = useProgress(toolkitId)
  const [selectedTool, setSelectedTool] = useState(null)

  useEffect(() => {
    fetch('/assets/data/learning-paths.json')
      .then(r => r.json())
      .then(data => {
        const found = (data.toolkits || []).find(tk => tk.id === toolkitId)
        setToolkit(found || null)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [toolkitId])

  if (loading) {
    return (
      <StaticPageLayout breadcrumb={t('common.loading', 'Loading...')} heroTitle="">
        <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
          <p>{t('common.loading', 'Loading...')}</p>
        </div>
      </StaticPageLayout>
    )
  }

  if (!toolkit) {
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

  // Flatten all tool IDs in this toolkit
  const allToolIds = toolkit.stages.flatMap(s => s.toolIds)
  const totalTools = allToolIds.length
  const exploredCount = allToolIds.filter(id => isExplored(id)).length

  function getCategoryIcon(tool) {
    const cat = toolsData.categories?.find(c => c.id === tool.category)
    return cat?.icon || 'box'
  }

  return (
    <StaticPageLayout
      breadcrumb={toolkit.title}
      heroTitle={toolkit.title}
    >
      <section className="section">
        <div className="container">
          <div className="learning-path-detail__meta">
            <span className={`learning-path-card__role-badge learning-path-card__role-badge--${toolkit.role}`}>
              {t(`learningPaths.role.${toolkit.role}`, toolkit.role)}
            </span>
            <p className="learning-path-detail__description">{toolkit.description}</p>
          </div>

          {/* Progress indicator */}
          <div className="learning-path-detail__progress" aria-label={t('learningPaths.progressLabel', 'Progress')}>
            <div className="progress-bar">
              <div
                className="progress-bar__fill"
                style={{ width: totalTools > 0 ? `${(exploredCount / totalTools) * 100}%` : '0%' }}
                role="progressbar"
                aria-valuenow={exploredCount}
                aria-valuemin={0}
                aria-valuemax={totalTools}
              />
            </div>
            <span className="progress-bar__label">
              {t('learningPaths.progressText', '{{explored}} / {{total}} explored')
                .replace('{{explored}}', exploredCount)
                .replace('{{total}}', totalTools)}
            </span>
          </div>

          {/* Stages */}
          {toolkit.stages.map((stage, stageIdx) => {
            const stageTools = stage.toolIds
              .map(id => toolsData.tools.find(t => t.id === id))
              .filter(Boolean)

            return (
              <div key={stage.id} className="learning-path-stage">
                <div className="learning-path-stage__header">
                  <span className="learning-path-stage__number">{stageIdx + 1}</span>
                  <div>
                    <h2 className="learning-path-stage__title">{stage.title}</h2>
                    <p className="learning-path-stage__description">{stage.description}</p>
                  </div>
                </div>
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
            )
          })}

          <div style={{ marginTop: '2rem' }}>
            <Link to="/learning-paths" className="btn btn--secondary btn--sm">
              ← {t('learningPaths.backToAll', 'Back to Learning Paths')}
            </Link>
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
  )
}
