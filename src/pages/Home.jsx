import { useState, useEffect, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useI18n } from '../contexts/I18nContext'
import { useSearch } from '../hooks/useSearch'
import { useLiteMode } from '../hooks/useLiteMode'
import Sidebar from '../components/Sidebar'
import ToolCard from '../components/ToolCard'
import ToolModal from '../components/ToolModal'
import FeaturedCarousel from '../components/FeaturedCarousel'
import BeginnerPicks from '../components/BeginnerPicks'
import TrustStrip from '../components/TrustStrip'
import Pagination from '../components/Pagination'
import Icon from '../components/Icon'
import SEO from '../components/SEO'
import { pageMeta } from '../lib/pageMeta'
import { fillTemplate } from '../lib/template'
import { langPrefix } from '../lib/canonical'
import { getOnboardingRole, setOnboardingRole, toolkitForRole } from '../lib/onboarding'

const ITEMS_PER_PAGE = 18

const QUICKSTART_DISMISS_KEY = 'abakada_home_quickstart_dismissed'

// Companion product: the Abakada Toolkit (separate subdomain app). Surfaced as a
// quiet cross-product spotlight in the hero so it aids discovery without
// competing with the primary "get started / browse" conversion path.
const TOOLKIT_URL = 'https://toolkit.abakada.org/'

// Role shortcuts shown in the first-visit quick-start strip. A deliberately tiny
// subset of the full 9-role onboarding so a beginner isn't asked to scan a long
// list before they've even started (review R5.3). "See all options" opens the
// complete modal for everyone else.
const QUICKSTART_ROLES = [
  { id: 'student', icon: 'graduation-cap', labelKey: 'home.quickStart.student', fallback: "I'm a student" },
  { id: 'teacher', icon: 'presentation', labelKey: 'home.quickStart.teacher', fallback: "I'm a teacher" },
]

export default function Home({ toolsData, onCloseNav, onStartOnboarding, onOpenNav }) {
  const { t, lang } = useI18n()
  const { liteMode } = useLiteMode()
  const location = useLocation()
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [selectedTool, setSelectedTool] = useState(null)
  const [showQuickStart, setShowQuickStart] = useState(() => {
    try {
      return !getOnboardingRole() && localStorage.getItem(QUICKSTART_DISMISS_KEY) !== '1'
    } catch { return false }
  })

  const { query, displayQuery, category, platforms, tags, results, setQuery, setCategory, togglePlatform, toggleTag, resetAll, hasActiveFilters, hasQuery } = useSearch(toolsData.tools)

  // Sync category with URL hash and scroll to tools section top
  useEffect(() => {
    const hash = location.hash.slice(1)
    if (hash && toolsData.categories.find(c => c.id === hash)) {
      setCategory(hash)
      // Scroll to top of tools section so the title is visible
      requestAnimationFrame(() => {
        const el = document.getElementById('tools-section')
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    } else if (!hash) {
      setCategory('all')
    }
  }, [location.hash, setCategory, toolsData.categories])

  function handleCategoryChange(cat) {
    setCategory(cat)
    setPage(1)
    const base = langPrefix(lang)
    navigate(cat === 'all' ? `${base}/` : `${base}/#${cat}`, { replace: true })
    if (onCloseNav) onCloseNav()
    // Scroll to top of tools section
    requestAnimationFrame(() => {
      const el = document.getElementById('tools-section')
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  function handlePageChange(p) {
    setPage(p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function scrollToTools() {
    requestAnimationFrame(() => {
      const el = document.getElementById('tools-section')
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  function dismissQuickStart() {
    setShowQuickStart(false)
    try { localStorage.setItem(QUICKSTART_DISMISS_KEY, '1') } catch { /* private mode */ }
  }

  function handleQuickRole(roleId) {
    setOnboardingRole(roleId)
    setShowQuickStart(false)
    const toolkitId = toolkitForRole(roleId)
    navigate(toolkitId ? `/learning-paths/${toolkitId}` : '/learning-paths')
  }

  function handleExploring() {
    dismissQuickStart()
    scrollToTools()
  }

  // Seed the catalog search from ?q= (global header search + SearchAction links).
  useEffect(() => {
    const q = new URLSearchParams(location.search).get('q')
    if (q) setQuery(q)
  }, [location.search, setQuery])

  useEffect(() => { setPage(1) }, [query, category, platforms, tags])

  const availablePlatforms = useMemo(() => {
    const s = new Set()
    toolsData.tools.forEach(t => (t.platforms || []).forEach(p => s.add(p)))
    return Array.from(s).sort()
  }, [toolsData.tools])

  const availableTags = useMemo(() => {
    const s = new Set()
    toolsData.tools.forEach(t => (t.tags || []).forEach(tag => s.add(tag)))
    return Array.from(s).sort()
  }, [toolsData.tools])

  const totalPages = Math.ceil(results.length / ITEMS_PER_PAGE)
  const pageTools = results.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  const selectedCategory = toolsData.categories.find(c => c.id === (selectedTool?.category))

  const stats = toolsData.stats || {}
  // Formatted once, from live data, and fed to both the hero stat and the
  // {count} placeholder in `hero.definition`. Pinned to en-US so the figure reads
  // identically whatever locale the visitor's runtime defaults to, and so the
  // four translations cannot drift apart from the catalog (they used to hardcode
  // the number and quietly went stale).
  const toolCount = (stats.totalTools || toolsData.tools.length).toLocaleString('en-US')

  return (
    <>
      <SEO {...pageMeta.home} lang={lang} />
      <Sidebar
        categories={toolsData.categories}
        tools={toolsData.tools}
        category={category}
        query={displayQuery}
        onQueryChange={setQuery}
        onCategoryChange={handleCategoryChange}
        platforms={platforms}
        tags={tags}
        availablePlatforms={availablePlatforms}
        availableTags={availableTags}
        onTogglePlatform={togglePlatform}
        onToggleTag={toggleTag}
        onReset={resetAll}
        hasActiveFilters={hasActiveFilters}
      />

      <main className="site-main" id="main-content">
        {/* Hero */}
        <section className="section section--hero">
          <div className="container">
            <h1 className="hero__title">
              {t('hero.title', 'Open Source')}<br />
              <span className="hero__title-gradient">{t('hero.titleHighlight', 'Productivity Tools')}</span>
            </h1>
            <p className="hero__subtitle">{t('hero.subtitle', 'Discover powerful, free, and open-source productivity tools organized by category.')}</p>
            <p className="hero__definition" aria-label="About Abakada">
              {fillTemplate(
                t(
                  'hero.definition',
                  'Abakada is a free, curated directory of {count} open-source productivity tools for Filipino students, educators, and professionals. Built by volunteers, no signup required.'
                ),
                { count: toolCount }
              )}
            </p>
            <div className="hero__stats">
              <div className="hero__stat">
                <div className="hero__stat-value">{toolCount}+</div>
                <div className="hero__stat-label">{t('hero.statsTools', 'Tools')}</div>
              </div>
              <div className="hero__stat">
                <div className="hero__stat-value">{stats.totalCategories || toolsData.categories.length}</div>
                <div className="hero__stat-label">{t('hero.statsCategories', 'Categories')}</div>
              </div>
              <div className="hero__stat">
                <div className="hero__stat-value">100%</div>
                <div className="hero__stat-label">{t('hero.statsOpenSource', 'Open Source')}</div>
              </div>
            </div>

            {/* Dual entry point (review R1.1): a guided path for newcomers and a
                direct path for people who already know what they want. */}
            <div className="hero__actions">
              <button type="button" className="btn btn--primary hero__cta" onClick={onStartOnboarding}>
                <Icon name="compass" collection="ui" size={18} />
                {t('hero.ctaGuided', 'Help me get started')}
              </button>
              <button type="button" className="btn btn--secondary hero__cta" onClick={scrollToTools}>
                <Icon name="layout-grid" size={18} />
                {t('hero.ctaBrowse', 'Browse all tools')}
              </button>
            </div>

            {/* Cross-product discovery: a compact spotlight for the companion
                Abakada Toolkit. Kept visually subordinate to the primary CTAs
                above so it lifts discovery without distracting from the main path. */}
            <a
              className="toolkit-spotlight"
              href={TOOLKIT_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t('home.toolkit.aria', 'Abakada Toolkit: free in-browser utilities. Opens in a new tab.')}
            >
              <span className="toolkit-spotlight__icon" aria-hidden="true">
                <Icon name="wrench" collection="ui" size={20} />
              </span>
              <span className="toolkit-spotlight__text">
                <span className="toolkit-spotlight__heading">
                  <span className="toolkit-spotlight__badge">{t('home.toolkit.badge', 'New')}</span>
                  {t('home.toolkit.label', 'Abakada Toolkit')}
                </span>
                <span className="toolkit-spotlight__desc">
                  {t('home.toolkit.desc', 'Free in-browser utilities. No installs, no sign-up.')}
                </span>
              </span>
              <span className="toolkit-spotlight__cta">
                {t('home.toolkit.cta', 'Explore')}
                <Icon name="arrow-right" collection="ui" size={16} />
              </span>
            </a>
          </div>
        </section>

        {/* First-visit quick start (review R5.1): a soft, dismissible role nudge so
            newcomers get a tailored path without a forced interstitial modal. */}
        {showQuickStart && (
          <section className="quick-start" aria-label={t('home.quickStart.aria', 'Personalize your start')}>
            <div className="container quick-start__inner">
              <p className="quick-start__prompt">
                <Icon name="sparkles" collection="ui" size={16} />
                {t('home.quickStart.prompt', 'New here? Tell us what you do and we’ll point you the right way:')}
              </p>
              <div className="quick-start__choices">
                {QUICKSTART_ROLES.map(role => (
                  <button
                    key={role.id}
                    type="button"
                    className="quick-start__chip"
                    onClick={() => handleQuickRole(role.id)}
                  >
                    <Icon name={role.icon} collection="ui" size={16} />
                    {t(role.labelKey, role.fallback)}
                  </button>
                ))}
                <button type="button" className="quick-start__chip" onClick={handleExploring}>
                  <Icon name="search" collection="ui" size={16} />
                  {t('home.quickStart.exploring', 'Just exploring')}
                </button>
                <button type="button" className="quick-start__more" onClick={onStartOnboarding}>
                  {t('home.quickStart.more', 'See all options')}
                </button>
              </div>
              <button
                type="button"
                className="quick-start__dismiss"
                aria-label={t('common.dismiss', 'Dismiss')}
                onClick={dismissQuickStart}
              >
                <Icon name="close" collection="ui" size={16} />
              </button>
            </div>
          </section>
        )}

        {/* Social proof, above the fold (review R10.1 / R10.5) */}
        {!hasQuery && category === 'all' && <TrustStrip />}

        {/* Beginner-friendly entry point (review R3.5) */}
        {!hasQuery && category === 'all' && (
          <BeginnerPicks
            tools={toolsData.tools}
            categories={toolsData.categories}
            onToolClick={setSelectedTool}
          />
        )}

        {/* Featured — skipped in lite mode (low data / low-end devices) */}
        {!hasQuery && category === 'all' && !liteMode && (
          <FeaturedCarousel
            tools={toolsData.tools}
            categories={toolsData.categories}
            onToolClick={setSelectedTool}
          />
        )}

        {/* Tools Grid */}
        <section className="section section--tools" id="tools-section">
          <div className="container">
            <div className="tools-header">
              <h2 className="tools-title" id="tools-title">
                {category === 'all'
                  ? t('tools.allTools', 'All Tools')
                  : t(`categories.${category}`, toolsData.categories.find(c => c.id === category)?.name || category)
                }
              </h2>
              <span className="tools-count">
                {results.length} {t('tools.results', 'tools')}
              </span>
            </div>

            {pageTools.length === 0 ? (
              <div className="empty-state" role="status" aria-live="polite">
                <div className="empty-state__icon-wrapper">
                  <div className="empty-state__icon">
                    <Icon name="search" collection="ui" size={32} />
                  </div>
                </div>
                <div className="empty-state__content">
                  <h3 className="empty-state__title">{t('search.noResultsFor', 'No results found')}</h3>
                  <p className="empty-state__description">{t('search.noResultsQuery', 'Try a different search term or clear your filters.')}</p>
                  <div className="empty-state__actions">
                    <button type="button" className="empty-state__btn empty-state__btn--primary" onClick={resetAll}>
                      <Icon name="refresh" collection="ui" size={14} />
                      {t('search.clearFilters', 'Clear filters')}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid--tools" id="tools-grid">
                {pageTools.map(tool => {
                  const cat = toolsData.categories.find(c => c.id === tool.category)
                  return (
                    <ToolCard
                      key={tool.id}
                      tool={tool}
                      categoryIcon={cat?.icon}
                      onClick={setSelectedTool}
                    />
                  )
                })}
              </div>
            )}

            <Pagination page={page} totalPages={totalPages} total={results.length} onPage={handlePageChange} />
          </div>
        </section>
      </main>

      {/* Mobile filter sheet trigger (review item 10) — opens the sidebar (which
          holds search + category/platform/tag filters) as an off-canvas sheet. */}
      {onOpenNav && (
        <button
          type="button"
          className="filter-fab"
          onClick={onOpenNav}
          aria-label={t('filters.title', 'Filters')}
        >
          <Icon name="filter" collection="ui" size={18} />
          <span>{t('filters.title', 'Filters')}</span>
          {(platforms.length + tags.length + (category !== 'all' ? 1 : 0)) > 0 && (
            <span className="filter-fab__count">{platforms.length + tags.length + (category !== 'all' ? 1 : 0)}</span>
          )}
        </button>
      )}

      {selectedTool && (
        <ToolModal
          tool={selectedTool}
          categoryIcon={selectedCategory?.icon}
          onClose={() => setSelectedTool(null)}
        />
      )}
    </>
  )
}
