import { useEffect, useRef } from 'react'
import { useI18n } from '../contexts/I18nContext'
import { useBookmarks } from '../contexts/BookmarkContext'
import { isSafeUrl } from '../lib/url'
import { isFossTool, getAppStoreLinks } from '../lib/catalog'
import { platformLabel } from '../lib/install'
import Icon from './Icon'

function getProjectHealth(dateString) {
  if (!dateString) return null
  const months = (Date.now() - new Date(dateString)) / (1000 * 60 * 60 * 24 * 30)
  if (months < 3) return { status: 'active', label: 'Active', color: 'green' }
  if (months < 12) return { status: 'maintenance', label: 'Stable', color: 'yellow' }
  return { status: 'stale', label: 'Stale', color: 'red' }
}

export default function ToolModal({ tool, categoryIcon, onClose }) {
  const { t } = useI18n()
  const { isBookmarked, addBookmark, removeBookmark } = useBookmarks()
  const bookmarked = isBookmarked(tool?.id)
  const modalRef = useRef(null)

  // Focus trap + Escape key + body scroll lock
  useEffect(() => {
    const previouslyFocused = document.activeElement

    // Move focus into modal on open
    const firstFocusable = modalRef.current?.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    firstFocusable?.focus()

    function handleKeyDown(e) {
      if (e.key === 'Escape') { onClose(); return }

      // Focus trap
      if (e.key === 'Tab' && modalRef.current) {
        const focusable = Array.from(
          modalRef.current.querySelectorAll(
            'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          )
        ).filter(el => !el.closest('[hidden]'))
        if (!focusable.length) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault(); last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault(); first.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
      // Restore focus to the element that opened the modal
      previouslyFocused?.focus()
    }
  }, [onClose])

  if (!tool) return null

  const health = getProjectHealth(tool.last_update)
  const isFoss = isFossTool(tool)
  const storeLinks = getAppStoreLinks(tool)

  function formatDate(d) {
    if (!d) return ''
    return new Date(d).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <div
      className="modal-backdrop active"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="modal active" ref={modalRef}>
        {/* Header */}
        <div className="modal__header">
          <div className="modal__title-group">
            <div className={`modal__icon card__icon--${tool.category}`}>
              <Icon name={categoryIcon || 'box'} size={24} />
            </div>
            <div className="modal__title-content">
              <h2 className="modal__title" id="modal-title">{tool.name}</h2>
              <p className="modal__tagline">{tool.tagline}</p>
            </div>
          </div>
          <button type="button" className="modal__close btn btn--icon" aria-label="Close" onClick={onClose}>
            <Icon name="close" collection="ui" size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="modal__body">
          {/* Badges */}
          <div className="modal__badges">
            <span className={`badge ${isFoss ? 'badge--foss' : 'badge--proprietary'}`}>
              {isFoss
                ? <><Icon name="shield-check-01" size={12} />{t('license.openSource', 'Open Source')}</>
                : t('license.freeware', 'Freeware')
              }
            </span>
            {tool.license && <span className="badge badge--license">{tool.license}</span>}
            {health && (
              <span className={`badge badge--health badge--health-${health.color}`}>
                <span className="health-indicator__dot" />
                {health.label}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="modal__description">{tool.description}</p>

          {/* Platforms */}
          {tool.platforms?.length > 0 && (
            <div className="modal__section">
              <h3 className="modal__section-title">{t('tools.platforms', 'Platforms')}</h3>
              <div className="modal__platforms">
                {tool.platforms.map(p => (
                  <span key={p} className={`platform-badge platform-badge--${p}`}>
                    <Icon name={p} collection="platform" size={14} />
                    {platformLabel(p)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {tool.tags?.length > 0 && (
            <div className="modal__section">
              <h3 className="modal__section-title">{t('tools.tags', 'Tags')}</h3>
              <div className="modal__tags">
                {tool.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
              </div>
            </div>
          )}

          {/* Alternatives */}
          {tool.alternatives_to?.length > 0 && (
            <div className="modal__section">
              <h3 className="modal__section-title">{t('tools.alternativeTo', 'Alternative to')}</h3>
              <div className="modal__tags">
                {tool.alternatives_to.map(alt => <span key={alt} className="tag tag--alt">{alt}</span>)}
              </div>
            </div>
          )}

          {/* Meta */}
          <div className="modal__meta">
            {tool.last_update && (
              <div className="modal__meta-item">
                <span className="modal__meta-label">{t('tools.lastUpdate', 'Last Updated')}</span>
                <span className="modal__meta-value">{formatDate(tool.last_update)}</span>
              </div>
            )}
            {tool.stars > 0 && (
              <div className="modal__meta-item">
                <Icon name="star" collection="ui" size={14} />
                <span className="modal__meta-value">{tool.stars.toLocaleString()} stars</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="modal__footer">
          <button
            type="button"
            className={`btn btn--secondary${bookmarked ? ' active' : ''}`}
            aria-label={bookmarked ? t('bookmark.remove', 'Remove bookmark') : t('bookmark.add', 'Save')}
            aria-pressed={bookmarked}
            onClick={() => bookmarked ? removeBookmark(tool.id) : addBookmark(tool.id)}
          >
            <Icon name={bookmarked ? 'bookmark-filled' : 'bookmark'} collection="category" size={14} />
            {bookmarked ? t('bookmark.saved', 'Saved') : t('bookmark.add', 'Save')}
          </button>
          {tool.web_try_url && isSafeUrl(tool.web_try_url) && (
            <a href={tool.web_try_url} target="_blank" rel="noopener noreferrer" className="btn btn--try-browser">
              <Icon name="play-circle" collection="ui" size={14} />
              {t('tools.tryInBrowser', 'Try in Browser')}
            </a>
          )}
          {tool.website && isSafeUrl(tool.website) && (
            <a href={tool.website} target="_blank" rel="noopener noreferrer" className="btn btn--primary">
              {t('tools.visitWebsite', 'Visit Website & Download')}
              <Icon name="external-link" collection="ui" size={14} />
            </a>
          )}
          {/* App stores — rendered with the same secondary button and the
              platform glyph already used by the badges above, so an app-store
              listing reads as one more way to get the tool rather than a
              bespoke treatment. */}
          {storeLinks.map(store => isSafeUrl(store.url) && (
            <a key={store.id} href={store.url} target="_blank" rel="noopener noreferrer" className="btn btn--secondary">
              <Icon name={store.icon} collection="platform" size={14} />
              {t(store.labelKey, store.label)}
            </a>
          ))}
          {tool.repo_url && isSafeUrl(tool.repo_url) && (
            <a href={tool.repo_url} target="_blank" rel="noopener noreferrer" className="btn btn--secondary">
              <Icon name="github" collection="ui" size={14} />
              {t('tools.viewSource', 'View Source')}
            </a>
          )}
          {tool.download_url && isSafeUrl(tool.download_url) && (
            <a href={tool.download_url} target="_blank" rel="noopener noreferrer" className="btn btn--secondary">
              <Icon name="download" collection="ui" size={14} />
              {t('tools.download', 'Download')}
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
