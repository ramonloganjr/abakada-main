import { memo } from 'react'
import { useI18n } from '../contexts/I18nContext'
import { useBookmarks } from '../contexts/BookmarkContext'
import { useComparison } from '../hooks/useComparison'
import Icon from './Icon'

function isSafeUrl(url) {
  if (!url) return false
  try {
    const u = new URL(url)
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch { return false }
}

function getProjectHealth(dateString) {
  if (!dateString) return null
  const months = (Date.now() - new Date(dateString)) / (1000 * 60 * 60 * 24 * 30)
  if (months < 3) return { status: 'active' }
  if (months < 12) return { status: 'maintenance' }
  return { status: 'stale' }
}

function LearningToolCardInner({ tool, categoryIcon, onInfoClick, isExplored }) {
  const { t } = useI18n()
  const { isBookmarked, addBookmark, removeBookmark } = useBookmarks()
  const { selectedIds, addTool, removeTool } = useComparison()
  const health = getProjectHealth(tool.last_update)
  const isFoss = tool.is_foss === true || (tool.is_foss == null && ['MIT','GPL','LGPL','Apache','BSD','MPL','AGPL','CC0','Unlicense'].some(l => (tool.license || '').toUpperCase().includes(l.toUpperCase())))
  const bookmarked = isBookmarked(tool.id)
  const inComparison = selectedIds.includes(tool.id)
  const atMax = selectedIds.length >= 3 && !inComparison
  const hasWebsite = isSafeUrl(tool.website)

  function handleBookmark(e) {
    e.stopPropagation()
    bookmarked ? removeBookmark(tool.id) : addBookmark(tool.id)
  }

  function handleCompare(e) {
    e.stopPropagation()
    inComparison ? removeTool(tool.id) : addTool(tool.id)
  }

  return (
    <article className={`card learning-tool-card${isExplored ? ' learning-tool-card--explored' : ''}`} data-tool-id={tool.id}>

      <div className="card__header">
        <div className={`card__icon card__icon--${tool.category}`}>
          <Icon name={categoryIcon || 'box'} size={20} />
        </div>
        <div className="card__content">
          <div className="card__title-row">
            <h3 className="card__title">{tool.name}</h3>
            {health && (
              <span className={`health-badge health-badge--${health.status}`} title={health.status}>
                <span className="health-badge__dot" />
                <span className="health-badge__label">{health.status}</span>
              </span>
            )}
          </div>
          <p className="card__tagline">{tool.tagline}</p>
        </div>
        {/* Utility icons — top-right, vertically centered with header */}
        <div className="learning-tool-card__utility-top">
          <button
            type="button"
            className={`learning-tool-card__action-btn${bookmarked ? ' learning-tool-card__action-btn--active' : ''}`}
            aria-label={bookmarked ? t('bookmark.remove', 'Remove bookmark') : t('bookmark.add', 'Bookmark')}
            aria-pressed={bookmarked}
            onClick={handleBookmark}
          >
            <Icon name={bookmarked ? 'bookmark-filled' : 'bookmark'} collection="category" size={15} />
          </button>
          <button
            type="button"
            className="learning-tool-card__action-btn"
            aria-label={`${t('tools.moreInfo', 'More info about')} ${tool.name}`}
            onClick={() => onInfoClick(tool)}
          >
            <Icon name="info" collection="ui" size={15} />
          </button>
        </div>
      </div>

      <div className="card__footer learning-tool-card__footer">
        <div className="card__tags">
          <span className={`card__tag card__tag--license ${isFoss ? 'badge--foss' : 'badge--proprietary'}`}>
            {isFoss
              ? <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></svg>{t('license.openSource', 'Open Source')}</>
              : <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>{t('license.freeware', 'Freeware')}</>
            }
          </span>
          {tool.tags && tool.tags.slice(0, 1).map(tag => (
            <span key={tag} className="card__tag">{tag}</span>
          ))}
        </div>
        {/* Footer actions: Compare text + Download icon — right-aligned, same axis as Info above */}
        <div className="learning-tool-card__actions">
          <button
            type="button"
            className={`learning-tool-card__compare-btn${inComparison ? ' learning-tool-card__compare-btn--active' : ''}${atMax ? ' learning-tool-card__compare-btn--disabled' : ''}`}
            aria-label={inComparison ? t('compare.remove', 'Remove from comparison') : t('compare.add', 'Add to compare')}
            aria-pressed={inComparison}
            disabled={atMax}
            onClick={handleCompare}
          >
            {inComparison ? t('compare.added', 'Added') : atMax ? t('compare.full', 'Full') : t('compare.add', 'Compare')}
          </button>
          {isSafeUrl(tool.web_try_url) && (
            <a
              href={tool.web_try_url}
              target="_blank"
              rel="noopener noreferrer"
              className="learning-tool-card__action-btn learning-tool-card__try-btn"
              aria-label={`Try ${tool.name} in browser`}
              title="Try in browser — no install needed"
              onClick={e => e.stopPropagation()}
            >
              <Icon name="play-circle" collection="ui" size={15} />
            </a>
          )}
          {hasWebsite && (
            <a
              href={tool.website}
              target="_blank"
              rel="noopener noreferrer"
              className="learning-tool-card__action-btn learning-tool-card__action-btn--accent"
              aria-label={`${t('learningPaths.download', 'Download')} ${tool.name}`}
              onClick={e => e.stopPropagation()}
            >
              <Icon name="download" collection="ui" size={15} />
            </a>
          )}
        </div>
      </div>

      {isExplored && (
        <span className="learning-tool-card__explored-badge" aria-hidden="true">✓</span>
      )}
    </article>
  )
}

const LearningToolCard = memo(LearningToolCardInner)
export default LearningToolCard
