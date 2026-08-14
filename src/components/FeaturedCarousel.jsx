import { useState, useEffect, useCallback, useRef } from 'react'
import { useI18n } from '../contexts/I18nContext'
import Icon from './Icon'

const FEATURED_COUNT = 9  // pool size — carousel pages through these
const REFRESH_MS = 20000  // reshuffle every 20s while visible

function pickFeatured(tools) {
  if (!tools.length) return []
  // Build a category-diverse pool: up to 1 tool per category, prefer foss + has description
  const byCategory = {}
  tools.forEach(tool => {
    if (!byCategory[tool.category]) byCategory[tool.category] = []
    byCategory[tool.category].push(tool)
  })
  const candidates = Object.values(byCategory).map(group => {
    // Score: foss > has description > has last_update
    const scored = group.map(t => ({
      tool: t,
      score: (t.is_foss ? 2 : 0) + (t.description ? 1 : 0) + (t.last_update ? 1 : 0)
    }))
    scored.sort((a, b) => b.score - a.score)
    // Pick from top 3 of each category randomly for variety
    const top = scored.slice(0, 3)
    return top[Math.floor(Math.random() * top.length)].tool
  })
  // Shuffle and take FEATURED_COUNT
  for (let i = candidates.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [candidates[i], candidates[j]] = [candidates[j], candidates[i]]
  }
  return candidates.slice(0, FEATURED_COUNT)
}

function getItemsPerPage() {
  if (typeof window === 'undefined') return 3
  if (window.innerWidth >= 1024) return 3
  if (window.innerWidth >= 640) return 2
  return 1
}

export default function FeaturedCarousel({ tools, categories, onToolClick }) {
  const { t } = useI18n()
  const [page, setPage] = useState(0)
  const [perPage, setPerPage] = useState(getItemsPerPage)
  const [items, setItems] = useState(() => pickFeatured(tools))
  const timerRef = useRef(null)

  // Re-pick when tools data loads (initially empty)
  useEffect(() => {
    if (tools.length) setItems(pickFeatured(tools))
  }, [tools])

  // Periodic reshuffle — skip while the tab is hidden so we don't burn CPU
  // reshuffling and re-rendering a carousel nobody is looking at.
  // toolsRef keeps the interval callback in sync with the latest tools array
  // without re-scheduling the interval on every render.
  const toolsRef = useRef(tools)
  useEffect(() => { toolsRef.current = tools }, [tools])

  useEffect(() => {
    timerRef.current = setInterval(() => {
      if (document.visibilityState !== 'visible') return
      setItems(pickFeatured(toolsRef.current))
      setPage(0)
    }, REFRESH_MS)
    return () => clearInterval(timerRef.current)
  }, [])

  const totalPages = Math.ceil(items.length / perPage)

  useEffect(() => {
    const handler = () => {
      const next = getItemsPerPage()
      setPerPage(next)
      setPage(p => Math.min(p, Math.ceil(items.length / next) - 1))
    }
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [items.length])

  const prev = useCallback(() => setPage(p => Math.max(0, p - 1)), [])
  const next = useCallback(() => setPage(p => Math.min(totalPages - 1, p + 1)), [totalPages])

  const pageItems = items.slice(page * perPage, page * perPage + perPage)

  return (
    <section className="section section--featured featured-section" role="region" aria-label={t('accessibility.featuredTools', 'Featured productivity tools')}>
      {/* Decorative layers */}
      <div className="featured-orb featured-orb--1" aria-hidden="true" />
      <div className="featured-orb featured-orb--2" aria-hidden="true" />
      <div className="featured-orb featured-orb--3" aria-hidden="true" />
      <div className="featured-scanline" aria-hidden="true" />

      <div className="container">
        <div className="featured-header">
          <div className="featured-header__content">
            <div className="featured-label">
              <svg className="featured-label__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <span>{t('featured.label', "Editor's Picks")}</span>
            </div>
            <h2 className="featured-title">{t('featured.title', "Editor's Picks")}</h2>
            <p className="featured-subtitle">{t('featured.subtitle', 'Discover the most loved open-source tools in our collection')}</p>
          </div>
          <div className="featured-nav">
            <button type="button" className="featured-nav__btn" id="featured-prev" disabled={page <= 0} onClick={prev} aria-label={t('accessibility.prevTools', 'Previous tools')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="15 18 9 12 15 6" /></svg>
            </button>
            <button type="button" className="featured-nav__btn" id="featured-next" disabled={page >= totalPages - 1} onClick={next} aria-label={t('accessibility.nextTools', 'Next tools')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="9 18 15 12 9 6" /></svg>
            </button>
          </div>
        </div>

      <div className="featured-grid" id="featured-grid" aria-live="polite">
        {pageItems.map(tool => {
          const cat = categories.find(c => c.id === tool.category)
          return (
            <article
              key={tool.id}
              className="featured-card"
              data-tool-id={tool.id}
              tabIndex={0}
              aria-label={`${tool.name}: ${tool.tagline}`}
              onClick={() => onToolClick(tool)}
              onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onToolClick(tool)}
            >
              <div className="featured-card__header">
                <div className={`featured-card__icon card__icon--${tool.category}`}>
                  <Icon name={cat?.icon || 'box'} size={22} />
                </div>
                <div className="featured-card__meta">
                  <h3 className="featured-card__title">{tool.name}</h3>
                  <p className="featured-card__tagline">{tool.tagline}</p>
                </div>
              </div>
              <div className="featured-card__body">
                <p className="featured-card__description">{tool.description}</p>
              </div>
              <div className="featured-card__footer">
                <div className="featured-card__badges">
                  <span className="featured-card__badge featured-card__badge--license">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="12" height="12">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                    {tool.license}
                  </span>
                </div>
                <span className="featured-card__action">
                  <span>{t('featured.viewTool', 'View')}</span>
                  <Icon name="arrow-right" collection="ui" size={14} />
                </span>
              </div>
            </article>
          )
        })}
      </div>

      <div className="featured-progress">
          <div className="featured-progress__dots" id="featured-dots" role="tablist" aria-label={t('accessibility.featuredPages', 'Featured pages')}>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                type="button"
                className={`featured-progress__dot${i === page ? ' active' : ''}`}
                data-page={i}
                role="tab"
                aria-label={`Page ${i + 1}`}
                aria-selected={i === page}
                onClick={() => setPage(i)}
              />
            ))}
          </div>
          <span className="featured-progress__counter" id="featured-counter">{page + 1} / {totalPages}</span>
        </div>
      </div>
    </section>
  )
}
