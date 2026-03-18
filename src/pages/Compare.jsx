import { Link } from 'react-router-dom'
import { useI18n } from '../contexts/I18nContext'
import { useComparison } from '../hooks/useComparison'
import { buildMatrix } from '../lib/comparison'
import StaticPageLayout from '../components/StaticPageLayout'

function formatValue(value) {
  if (Array.isArray(value)) return value.length > 0 ? value.join(', ') : '—'
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  return value || '—'
}

export default function Compare({ toolsData = { tools: [], categories: [] } }) {
  const { t } = useI18n()
  const { selectedIds, removeTool, clearComparison, addError } = useComparison()

  const hasEnough = selectedIds.length >= 2
  const matrix = hasEnough ? buildMatrix(selectedIds, toolsData.tools) : null

  return (
    <StaticPageLayout
      breadcrumb={t('compare.title', 'Compare Tools')}
      heroTitle={t('compare.title', 'Compare Tools')}
    >
      <section className="section">
        <div className="container">
          {addError && (
            <div className="compare-error" role="alert" aria-live="polite">
              {addError}
            </div>
          )}

          {!hasEnough ? (
            <div className="empty-state" role="status" style={{ textAlign: 'center' }}>
              <div className="empty-state__content">
                <h3 className="empty-state__title">{t('compare.emptyTitle', 'No tools selected')}</h3>
                <p className="empty-state__description">
                  {t('compare.emptyDesc', 'Select at least 2 tools from the home page to compare them side by side.')}
                </p>
                <div className="empty-state__actions">
                  <Link to="/" className="empty-state__btn empty-state__btn--primary">
                    {t('compare.browseTools', 'Browse Tools')}
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="compare-actions">
                <button
                  type="button"
                  className="btn btn--secondary btn--sm"
                  onClick={clearComparison}
                >
                  {t('compare.clear', 'Clear comparison')}
                </button>
              </div>

              {/* Desktop table */}
              <div className="compare-table-wrapper">
                <table className="compare-table" aria-label={t('compare.tableLabel', 'Tool comparison table')}>
                  <thead>
                    <tr>
                      <th scope="col">{t('compare.dimension', 'Dimension')}</th>
                      {matrix.tools.map(tool => (
                        <th key={tool.id} scope="col">
                          <div className="compare-table__tool-header">
                            <span>{tool.name}</span>
                            <button
                              type="button"
                              className="btn btn--icon btn--sm"
                              aria-label={t('compare.removeTool', 'Remove {{name}}').replace('{{name}}', tool.name)}
                              onClick={() => removeTool(tool.id)}
                            >
                              ×
                            </button>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {matrix.dimensions.map(dim => (
                      <tr key={dim.key}>
                        <th scope="row">{dim.label}</th>
                        {matrix.tools.map(tool => {
                          const cell = dim.values[tool.id]
                          return (
                            <td
                              key={tool.id}
                              className={cell?.highlight ? 'compare-cell--highlight' : undefined}
                            >
                              {formatValue(cell?.value)}
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile stacked cards */}
              <div className="compare-stack" aria-label={t('compare.stackLabel', 'Tool comparison cards')}>
                {matrix.tools.map(tool => (
                  <div key={tool.id} className="compare-stack__card">
                    <div className="compare-stack__card-header">
                      <strong>{tool.name}</strong>
                      <button
                        type="button"
                        className="btn btn--icon btn--sm"
                        aria-label={t('compare.removeTool', 'Remove {{name}}').replace('{{name}}', tool.name)}
                        onClick={() => removeTool(tool.id)}
                      >
                        ×
                      </button>
                    </div>
                    {matrix.dimensions.map(dim => {
                      const cell = dim.values[tool.id]
                      return (
                        <div
                          key={dim.key}
                          className={`compare-stack__row${cell?.highlight ? ' compare-cell--highlight' : ''}`}
                        >
                          <span className="compare-stack__label">{dim.label}</span>
                          <span className="compare-stack__value">{formatValue(cell?.value)}</span>
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </StaticPageLayout>
  )
}
