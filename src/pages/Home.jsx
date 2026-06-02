import { useState, useEffect, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useI18n } from '../contexts/I18nContext'
import { useSearch } from '../hooks/useSearch'
import { useLowBandwidth } from '../hooks/useLowBandwidth'
import Sidebar from '../components/Sidebar'
import ToolCard from '../components/ToolCard'
import ToolModal from '../components/ToolModal'
import FeaturedCarousel from '../components/FeaturedCarousel'
import Pagination from '../components/Pagination'
import Icon from '../components/Icon'
import SEO from '../components/SEO'
import { pageMeta } from '../lib/pageMeta'
import { langPrefix } from '../lib/canonical'

const ITEMS_PER_PAGE = 18

export default function Home({ toolsData, onCloseNav }) {
  const { t, lang } = useI18n()
  const { saveData } = useLowBandwidth()
  const location = useLocation()
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [selectedTool, setSelectedTool] = useState(null)

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
              {t(
                'hero.definition',
                `Abakada is a free, curated directory of ${(stats.totalTools || toolsData.tools.length).toLocaleString()}+ open-source productivity tools for Filipino students, educators, and professionals — built by volunteers, no signup required.`
              )}
            </p>
            <div className="hero__stats">
              <div className="hero__stat">
                <div className="hero__stat-value">{(stats.totalTools || toolsData.tools.length).toLocaleString()}+</div>
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
          </div>
        </section>

        {/* Featured */}
        {!hasQuery && category === 'all' && !saveData && (
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
