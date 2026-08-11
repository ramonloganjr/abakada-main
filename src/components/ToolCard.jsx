import { memo } from 'react'
import { useI18n } from '../contexts/I18nContext'
import { useBookmarks } from '../contexts/BookmarkContext'
import { useComparison } from '../hooks/useComparison'
import { isFossTool } from '../lib/catalog'
import Icon from './Icon'

function getProjectHealth(dateString) {
  if (!dateString) return null
  const months = (Date.now() - new Date(dateString)) / (1000 * 60 * 60 * 24 * 30)
  if (months < 3) return { status: 'active' }
  if (months < 12) return { status: 'maintenance' }
  return { status: 'stale' }
}

function ToolCardInner({ tool, categoryIcon, onClick }) {
  const { t } = useI18n()
  const { isBookmarked, addBookmark, removeBookmark } = useBookmarks()
  const { selectedIds, addTool, removeTool } = useComparison()
  const health = getProjectHealth(tool.last_update)
  const isFoss = isFossTool(tool)
  const bookmarked = isBookmarked(tool.id)
  const inComparison = selectedIds.includes(tool.id)
  const atMax = selectedIds.length >= 3 && !inComparison

  function handleBookmarkClick(e) {
    e.stopPropagation()
    bookmarked ? removeBookmark(tool.id) : addBookmark(tool.id)
  }

  function handleCompareClick(e) {
    e.stopPropagation()
    inComparison ? removeTool(tool.id) : addTool(tool.id)
  }

  return (
    <article
      className="card"
      data-tool-id={tool.id}
      tabIndex={0}
      aria-label={`${tool.name}: ${tool.tagline}`}
      onClick={() => onClick(tool)}
      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onClick(tool)}
    >
      <div className="card__header" style={{ position: 'relative' }}>
        <div className={`card__icon card__icon--${tool.category}`}>
          <Icon name={categoryIcon || 'box'} size={20} />
        </div>
        <div className="card__content">
          <div className="card__title-row">
            <h3 className="card__title">{tool.name}</h3>
            {health && (
              <span className={`health-badge health-badge--${health.status}`} title={health.status}>
                <span className="health-badge__dot"></span>
                <span className="health-badge__label">{health.status}</span>
              </span>
            )}
          </div>
          <p className="card__tagline">{tool.tagline}</p>
        </div>
        <button
          type="button"
          className="btn btn--icon card__bookmark"
          aria-label={bookmarked ? t('bookmark.remove', 'Remove bookmark') : t('bookmark.add', 'Bookmark')}
          aria-pressed={bookmarked}
          onClick={handleBookmarkClick}
          style={{ position: 'absolute', top: 0, right: 0 }}
        >
          <Icon name={bookmarked ? 'bookmark-filled' : 'bookmark'} collection="category" size={16} />
        </button>
      </div>
      <div className="card__footer">
        <div className="card__tags">
          <span className={`card__tag card__tag--license ${isFoss ? 'badge--foss' : 'badge--proprietary'}`}>
            {isFoss
              ? <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>{t('license.openSource', 'Open Source')}</>
              : <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>{t('license.freeware', 'Freeware')}</>
            }
          </span>
          {tool.tags && tool.tags.slice(0, 1).map(tag => (
            <span key={tag} className="card__tag">{tag}</span>
          ))}
        </div>
        <div className="card__footer-actions">
          <button
            type="button"
            className={`btn btn--sm card__compare-btn${inComparison ? ' card__compare-btn--active' : ''}`}
            aria-label={inComparison ? t('compare.remove', 'Remove from comparison') : t('compare.add', 'Compare')}
            aria-pressed={inComparison}
            disabled={atMax}
            onClick={handleCompareClick}
          >
            {inComparison ? `✓ ${t('compare.add', 'Compare')}` : t('compare.add', 'Compare')}
          </button>
          <span className="card__action">
            <svg className="card__arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </span>
        </div>
      </div>
      {tool.alternatives_to && tool.alternatives_to.length > 0 && (
        <div className="card__alternatives">
          Alt: {tool.alternatives_to.slice(0, 2).join(', ')}
        </div>
      )}
    </article>
  )
}

const ToolCard = memo(ToolCardInner)
export default ToolCard
