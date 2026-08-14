import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useI18n } from '../contexts/I18nContext'
import { useComparison } from '../hooks/useComparison'
import { buildMatrix } from '../lib/comparison'
import { COMPARISON_MAX } from '../contexts/ComparisonContext'
import StaticPageLayout from '../components/StaticPageLayout'
import Icon from '../components/Icon'
import SEO from '../components/SEO'
import { pageMeta } from '../lib/pageMeta'

function formatValue(value) {
  if (Array.isArray(value)) return value.length > 0 ? value.join(', ') : '—'
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  return value || '—'
}

export default function Compare({ toolsData = { tools: [], categories: [] } }) {
  const { t, lang } = useI18n()
  const location = useLocation()
  const navigate = useNavigate()
  const { selectedIds, setIds, removeTool, clearComparison, addError } = useComparison()

  // ── URL seeding ────────────────────────────────────────────────────────────
  // Capture URL params on first render so the effect dep array stays stable.
  const initialUrlIds = useRef(
    new URLSearchParams(location.search)
      .getAll('t')
      .filter(id => typeof id === 'string' && id.trim().length > 0)
      .slice(0, COMPARISON_MAX)
  )

  // Whether the initial URL seed has been processed. Used to:
  //   1. Optimistically show URL-based selection on the very first render (no flash).
  //   2. Gate the URL-sync effect so it only runs after seeding is complete.
  const [seeded, setSeeded] = useState(false)

  useEffect(() => {
    if (initialUrlIds.current.length > 0) {
      setIds(initialUrlIds.current)
    }
    setSeeded(true)
  }, [setIds])

  // ── URL sync ───────────────────────────────────────────────────────────────
  // After seeding, keep the URL in sync with context state.
  // Using replace so forward/back navigation is not polluted.
  useEffect(() => {
    if (!seeded) return
    const params = new URLSearchParams()
    selectedIds.forEach(id => params.append('t', id))
    const newSearch = selectedIds.length ? '?' + params.toString() : ''
    if (window.location.search !== newSearch) {
      navigate({ search: params.toString() }, { replace: true })
    }
  }, [selectedIds, seeded, navigate])

  // ── Effective IDs ──────────────────────────────────────────────────────────
  // On the very first render (before the seed effect fires) show the URL params
  // directly so there is no blank-→-table flash when a shared link is opened.
  const effectiveIds = !seeded && initialUrlIds.current.length > 0
    ? initialUrlIds.current
    : selectedIds

  // ── Share / copy-link ──────────────────────────────────────────────────────
  const [copied, setCopied] = useState(false)
  const copyTimer = useRef(null)

  function handleShare() {
    const url = window.location.href
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      clearTimeout(copyTimer.current)
      copyTimer.current = setTimeout(() => setCopied(false), 2000)
    }).catch(() => {
      // Fallback for browsers without clipboard API (e.g. insecure contexts)
      try {
        const el = document.createElement('textarea')
        el.value = url
        el.style.position = 'fixed'
        el.style.opacity = '0'
        document.body.appendChild(el)
        el.select()
        document.execCommand('copy')
        document.body.removeChild(el)
        setCopied(true)
        clearTimeout(copyTimer.current)
        copyTimer.current = setTimeout(() => setCopied(false), 2000)
      } catch { /* silent fail */ }
    })
  }

  useEffect(() => () => clearTimeout(copyTimer.current), [])

  // ── Render ─────────────────────────────────────────────────────────────────
  const hasEnough = effectiveIds.length >= 2
  const matrix = hasEnough ? buildMatrix(effectiveIds, toolsData.tools) : null

  // seoKey is cleared when a comparison is active: the title names the tools
  // being compared, so <SEO> must not replace it with the static localized
  // "Compare Open-Source Tools". With no comparison the page falls back to the
  // generic meta, which should localize.
  const dynamicMeta = matrix
    ? {
        ...pageMeta.compare,
        title: `Compare ${matrix.tools.map((t) => t.name).join(' vs ')}`,
        rawTitle: false,
        seoKey: null,
      }
    : pageMeta.compare

  return (
    <>
    <SEO {...dynamicMeta} lang={lang} />
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
                <p className="empty-state__description" style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  {t('compare.shareHint', 'You can also share a comparison by copying the page URL after selecting tools.')}
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
                <button
                  type="button"
                  className={`btn btn--sm${copied ? ' btn--primary' : ' btn--secondary'}`}
                  onClick={handleShare}
                  aria-live="polite"
                >
                  <Icon name={copied ? 'check' : 'share-2'} collection="category" size={14} />
                  {copied ? t('compare.copied', 'Link copied!') : t('compare.share', 'Copy link')}
                </button>
              </div>

              {/* Desktop table */}
              <div className="compare-table-wrapper">
                <table className="compare-table" aria-label={t('compare.tableLabel', 'Tool comparison table')}>
                  <caption className="compare-table__caption">
                    {t('compare.caption', 'Side-by-side comparison of selected open-source tools: features, platforms, license, and editorial notes.')}
                  </caption>
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
    </>
  )
}
