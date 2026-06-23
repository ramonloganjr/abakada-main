import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useI18n } from '../contexts/I18nContext'
import { useBookmarks } from '../contexts/BookmarkContext'
import { useComparisonContext } from '../contexts/ComparisonContext'
import { usePWAInstall } from '../hooks/usePWAInstall'
import { CATEGORY_GROUPS } from '../lib/categoryGroups'
import Icon from './Icon'

export default function Sidebar({ categories, tools, category, query, onQueryChange, onCategoryChange, platforms, tags, availablePlatforms, availableTags, onTogglePlatform, onToggleTag, onReset, hasActiveFilters, collapsible, collapsed, onToggleCollapse, filtering = true }) {
  const { t } = useI18n()
  const { bookmarks } = useBookmarks()
  const { selectedIds } = useComparisonContext()
  const { canInstall, triggerInstall } = usePWAInstall()
  const [groupsCollapsed, setGroupsCollapsed] = useState({})
  const [filtersCollapsed, setFiltersCollapsed] = useState(false)

  function toggleGroup(id) {
    setGroupsCollapsed(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const platformCounts = {}
  availablePlatforms.forEach(p => {
    platformCounts[p] = tools.filter(tool => (tool.platforms || []).includes(p)).length
  })
  const tagCounts = {}
  availableTags.forEach(tag => {
    tagCounts[tag] = tools.filter(tool => (tool.tags || []).includes(tag)).length
  })

  const topPlatforms = [...availablePlatforms].sort((a, b) => (platformCounts[b] || 0) - (platformCounts[a] || 0)).slice(0, 7)
  const topTags = [...availableTags].sort((a, b) => (tagCounts[b] || 0) - (tagCounts[a] || 0)).slice(0, 8)

  const platformIcons = { windows: 'windows', macos: 'macos', linux: 'linux', web: 'web', ios: 'ios', android: 'android', 'self-hosted': 'self-hosted' }

  return (
    <aside className="sidebar" id="sidebar" role="navigation" aria-label="Category navigation">
      {collapsible && (
        <button
          type="button"
          className="sidebar__collapse-btn"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-expanded={!collapsed}
          onClick={onToggleCollapse}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points={collapsed ? '9 18 15 12 9 6' : '15 18 9 12 15 6'} />
          </svg>
        </button>
      )}
      <div className="sidebar__mobile-actions" aria-label="Quick actions">
        {canInstall && (
          <button
            type="button"
            className="btn btn--primary sidebar__mobile-action-btn"
            aria-label={t('pwa.installAriaLabel', 'Install Abakada App')}
            onClick={triggerInstall}
          >
            <Icon name="download" collection="ui" size={16} />
            {t('pwa.install', 'Install App')}
          </button>
        )}
        <Link to="/bookmarks" className="sidebar__mobile-action-link">
          <Icon name="bookmark" collection="category" size={18} />
          <span>{t('nav.bookmarks', 'Bookmarks')}</span>
          {bookmarks.length > 0 && (
            <span className="nav-badge nav-badge--inline" aria-label={`${bookmarks.length} bookmarks`}>
              {bookmarks.length}
            </span>
          )}
        </Link>
        <Link to="/compare" className="sidebar__mobile-action-link">
          <Icon name="layers" collection="category" size={18} />
          <span>{t('nav.compare', 'Compare Tools')}</span>
          {selectedIds.length > 0 && (
            <span className="nav-badge nav-badge--inline" aria-label={`${selectedIds.length} tools in comparison`}>
              {selectedIds.length}
            </span>
          )}
        </Link>
        <Link to="/learning-paths" className="sidebar__mobile-action-link">
          <Icon name="graduation-cap" collection="category" size={18} />
          <span>{t('nav.learningPaths', 'Learning Paths')}</span>
        </Link>
        <Link to="/progress" className="sidebar__mobile-action-link">
          <Icon name="trending-up" collection="ui" size={18} />
          <span>{t('nav.progress', 'My Progress')}</span>
        </Link>
      </div>
      {filtering && (
      <>
      <div className="sidebar__header">
        <div className="sidebar__search">
          <svg className="sidebar__search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="search"
            id="search-input"
            className="sidebar__search-input"
            placeholder={t('search.placeholder', 'Search tools...')}
            aria-label={t('search.placeholder', 'Search tools')}
            autoComplete="off"
            spellCheck="false"
            maxLength={100}
            value={query}
            onChange={e => onQueryChange(e.target.value)}
          />
          <button
            type="button"
            className="sidebar__search-clear"
            id="search-clear"
            aria-label="Clear search"
            style={{ opacity: query ? 1 : 0, visibility: query ? 'visible' : 'hidden' }}
            onClick={() => onQueryChange('')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      <div className={`sidebar__filters${filtersCollapsed ? ' collapsed' : ''}`} id="sidebar-filters">
        <button
          type="button"
          className="sidebar__filters-toggle"
          aria-expanded={!filtersCollapsed}
          onClick={() => setFiltersCollapsed(f => !f)}
        >
          <span>{t('filters.title', 'Filters')}</span>
          {hasActiveFilters && <span className="filters-active-badge">{platforms.length + tags.length}</span>}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
        <div className="sidebar__filters-content" id="filters-content">
          <div className="filter-group">
            <span className="filter-group__label">{t('filters.platforms', 'Platforms')}</span>
            <div className="filter-chips" id="platform-filters">
              {topPlatforms.map(p => (
                <button
                  key={p}
                  type="button"
                  className={`filter-chip${platforms.includes(p) ? ' active' : ''}`}
                  data-platform={p}
                  aria-pressed={platforms.includes(p)}
                  onClick={() => onTogglePlatform(p)}
                >
                  <span className={`filter-chip__icon platform-icon platform-icon--${p}`}>
                    <Icon name={platformIcons[p] || 'web'} collection="platform" size={14} />
                  </span>
                  <span>{p}</span>
                  <span className="filter-chip__count">{platformCounts[p] || 0}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="filter-group">
            <span className="filter-group__label">{t('filters.tags', 'Tags')}</span>
            <div className="filter-chips" id="tag-filters">
              {topTags.map(tag => (
                <button
                  key={tag}
                  type="button"
                  className={`filter-chip${tags.includes(tag) ? ' active' : ''}`}
                  data-tag={tag}
                  aria-pressed={tags.includes(tag)}
                  onClick={() => onToggleTag(tag)}
                >
                  <span>{tag}</span>
                  <span className="filter-chip__count">{tagCounts[tag] || 0}</span>
                </button>
              ))}
            </div>
          </div>
          {hasActiveFilters && (
            <button
              type="button"
              className="filters-clear visible"
              id="clear-filters"
              aria-label="Clear all active filters"
              onClick={onReset}
            >
              {t('search.clearFilters', 'Clear all filters')}
            </button>
          )}
        </div>
      </div>
      </>
      )}

      <nav className="sidebar__nav" id="sidebar-nav" aria-label="Tool categories">
        <button
          type="button"
          className={`nav-item nav-item--all${category === 'all' ? ' active' : ''}`}
          data-category="all"
          onClick={() => onCategoryChange('all')}
        >
          <Icon name="layout-grid" size={18} className="nav-item__icon" />
          <span className="nav-item__label">{t('categories.all', 'All Tools')}</span>
          <span className="nav-item__count">{tools.length}</span>
        </button>

        {CATEGORY_GROUPS.map(group => {
          const groupCats = group.categories.map(id => categories.find(c => c.id === id)).filter(Boolean)
          if (!groupCats.length) return null
          const isCollapsed = groupsCollapsed[group.id]
          return (
            <div key={group.id} className={`nav-group${isCollapsed ? ' collapsed' : ''}`} data-group={group.id}>
              <button
                type="button"
                className="nav-group__header"
                aria-expanded={!isCollapsed}
                onClick={() => toggleGroup(group.id)}
              >
                <span>{t(`groups.${group.id}`, group.id)}</span>
                <svg className="nav-group__toggle" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              <div className="nav-group__items">
                {groupCats.map(cat => {
                  const count = tools.filter(tool => tool.category === cat.id).length
                  const isActive = category === cat.id
                  // Plain-language hint for non-technical visitors (review R1.2).
                  const hint = t(`categoryDescriptions.${cat.id}`, '')
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      className={`nav-item${isActive ? ' active' : ''}`}
                      data-category={cat.id}
                      title={hint || undefined}
                      onClick={() => onCategoryChange(cat.id)}
                    >
                      <Icon name={cat.icon || 'box'} size={18} className="nav-item__icon" />
                      <span className="nav-item__label">{t(`categories.${cat.id}`, cat.name)}</span>
                      <span className="nav-item__count">{count}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </nav>

      <div className="sidebar__footer">
        <div className="sidebar__stats">
          <span className="sidebar__stat">{tools.length} tools</span>
          <span className="sidebar__stat-divider">•</span>
          <span className="sidebar__stat">{categories.length} categories</span>
        </div>
      </div>
    </aside>
  )
}
