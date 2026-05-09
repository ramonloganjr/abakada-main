import { useState, useEffect, lazy, Suspense } from 'react'
import { Routes, Route, Outlet, useLocation } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { I18nProvider } from './contexts/I18nContext'
import { BookmarkProvider } from './contexts/BookmarkContext'
import { ComparisonProvider } from './contexts/ComparisonContext'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Footer from './components/Footer'
import OnboardingModal from './components/OnboardingModal'
import ErrorBoundary from './components/ErrorBoundary'
import PWAInstallBanner from './components/PWAInstallBanner'
import BrandLoader from './components/BrandLoader'
import { stripLangPrefix } from './lib/canonical'

const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const FAQ = lazy(() => import('./pages/FAQ'))
const Privacy = lazy(() => import('./pages/Privacy'))
const Terms = lazy(() => import('./pages/Terms'))
const Partnerships = lazy(() => import('./pages/Partnerships'))
const Sitemap = lazy(() => import('./pages/Sitemap'))
const NotFound = lazy(() => import('./pages/NotFound'))
const PartnershipDeck = lazy(() => import('./pages/PartnershipDeck'))
const Bookmarks = lazy(() => import('./pages/Bookmarks'))
const Compare = lazy(() => import('./pages/Compare'))
const LearningPaths = lazy(() => import('./pages/LearningPaths'))
const LearningPathDetail = lazy(() => import('./pages/LearningPathDetail'))
const OfficialPartners = lazy(() => import('./pages/OfficialPartners'))
const ToolDetail = lazy(() => import('./pages/ToolDetail'))
const Glossary = lazy(() => import('./pages/Glossary'))

const SUSPENSE_FALLBACK = (
  <main className="site-main" id="main-content">
    <BrandLoader variant="block" />
  </main>
)

const EMPTY_DATA = { categories: [], tools: [], stats: {} }

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    // Don't scroll on home route — category hash navigation handles that separately
    if (pathname !== '/') {
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
  }, [pathname])
  return null
}

function AppContent() {
  const [toolsData, setToolsData] = useState(EMPTY_DATA)
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState(false)
  const [navOpen, setNavOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [swUpdateReady, setSwUpdateReady] = useState(false)
  const location = useLocation()

  // Normalize pathname so route checks ignore the optional /<lang> prefix
  // (e.g. /tl, /ilo, /bis, /en). Without this, the home page under a language
  // prefix is treated as a non-home static page and gets the global sidebar
  // overlaid on top of Home.jsx's own filter sidebar.
  const normalizedPath = stripLangPrefix(location.pathname)

  // Show onboarding on first visit to /learning-paths if role not set
  useEffect(() => {
    if (normalizedPath === '/learning-paths') {
      const hasRole = Boolean(localStorage.getItem('abakada_onboarding_role'))
      if (!hasRole) setShowOnboarding(true)
    }
  }, [normalizedPath])

  useEffect(() => {
    let retries = 0
    const MAX_RETRIES = 2

    async function loadTools() {
      try {
        const r = await fetch('/assets/data/tools.json')
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        const data = await r.json()
        setToolsData(data)
        setFetchError(false)
      } catch (err) {
        if (retries < MAX_RETRIES) {
          retries++
          setTimeout(loadTools, 1000 * retries)
        } else {
          setFetchError(true)
          if (import.meta.env.DEV) console.error('[App] Failed to load tools.json:', err)
        }
      } finally {
        setLoading(false)
      }
    }

    loadTools()
  }, [])

  // Close nav on route change
  useEffect(() => { setNavOpen(false) }, [location.pathname])

  // Listen for SW update-ready event (genuine update, not first install)
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return
    const handleUpdateReady = () => setSwUpdateReady(true)
    window.addEventListener('sw-update-ready', handleUpdateReady)
    return () => window.removeEventListener('sw-update-ready', handleUpdateReady)
  }, [])

  // Close lang dropdown on outside click
  useEffect(() => {
    const handler = () => {
      document.querySelector('.lang-selector')?.classList.remove('open')
    }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [])

  // Viewport height fix for mobile browsers
  useEffect(() => {
    const setVh = () => document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`)
    setVh()
    window.addEventListener('resize', setVh)
    window.addEventListener('orientationchange', () => setTimeout(setVh, 100))
    return () => window.removeEventListener('resize', setVh)
  }, [])

  const isHome = normalizedPath === '/'
  const isDeck = normalizedPath === '/partnership-deck'

  // Static pages that show the collapsible sidebar
  const STATIC_SIDEBAR_PATHS = ['/faq', '/privacy', '/terms', '/glossary', '/sitemap', '/about', '/official-partners', '/partnerships', '/contact', '/bookmarks', '/compare', '/learning-paths']
  const isStaticSidebarPage = STATIC_SIDEBAR_PATHS.includes(normalizedPath) || normalizedPath.startsWith('/learning-paths/')

  // Sync body class for sidebar collapsed state (desktop only)
  useEffect(() => {
    document.body.classList.toggle('sidebar-collapsed', sidebarCollapsed && isStaticSidebarPage)
    return () => document.body.classList.remove('sidebar-collapsed')
  }, [sidebarCollapsed, isStaticSidebarPage])

  // Apply static-page class to body for non-home routes
  useEffect(() => {
    if (isHome) {
      document.body.classList.remove('static-page')
    } else {
      document.body.classList.add('static-page')
    }
    return () => document.body.classList.remove('static-page')
  }, [isHome])

  function toggleNav() {
    setNavOpen(o => {
      const next = !o
      document.body.classList.toggle('nav-open', next)
      return next
    })
  }

  function closeNav() {
    setNavOpen(false)
    document.body.classList.remove('nav-open')
  }

  return (
    <div className="app">
      <ScrollToTop />
      <a href="#main-content" className="skip-link">Skip to main content</a>

      {/* PWA update notification */}
      {swUpdateReady && (
        <div role="alert" aria-live="polite" style={{
          position: 'fixed', bottom: '1rem', left: '50%', transform: 'translateX(-50%)',
          background: 'var(--bg-elevated)', border: '1px solid var(--border-secondary)',
          borderRadius: '0.5rem', padding: '0.75rem 1.25rem', zIndex: 9999,
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          boxShadow: '0 4px 16px rgba(0,0,0,0.12)'
        }}>
          <span style={{ fontSize: '0.875rem' }}>A new version is available.</span>
          <button
            type="button"
            className="btn btn--primary btn--sm"
            onClick={() => {
              if (window.__swWaiting) {
                window.__swWaiting.postMessage({ type: 'SKIP_WAITING' })
              }
              window.location.reload()
            }}
          >
            Update
          </button>
        </div>
      )}

      {!isDeck && <Header onMenuToggle={toggleNav} navOpen={navOpen} />}

      {/* Global sidebar + overlay — visible on all pages on mobile */}
      {!isDeck && (
        <>
          {navOpen && <div className="nav-overlay" id="nav-overlay" onClick={closeNav} />}
          {!isHome && (
            <>
              <Sidebar
                categories={toolsData.categories}
                tools={toolsData.tools}
                category="all"
                query=""
                onQueryChange={() => {}}
                onCategoryChange={() => { closeNav() }}
                platforms={[]}
                tags={[]}
                availablePlatforms={[]}
                availableTags={[]}
                onTogglePlatform={() => {}}
                onToggleTag={() => {}}
                onReset={() => {}}
                hasActiveFilters={false}
                collapsible={isStaticSidebarPage}
                collapsed={sidebarCollapsed}
                onToggleCollapse={() => setSidebarCollapsed(c => !c)}
              />
              {isStaticSidebarPage && sidebarCollapsed && (
                <button
                  type="button"
                  className="sidebar__reopen-tab"
                  aria-label="Expand sidebar"
                  onClick={() => setSidebarCollapsed(false)}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              )}
            </>
          )}
        </>
      )}
      {loading ? (
        <main className="site-main" id="main-content">
          <BrandLoader variant="block" />
        </main>
      ) : fetchError ? (
        <main className="site-main" id="main-content" role="alert">
          <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
            <h1 style={{ marginBottom: '1rem' }}>Unable to load tools</h1>
            <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
              Check your connection and try again.
            </p>
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        </main>
      ) : (
        <ErrorBoundary>
          <Suspense fallback={SUSPENSE_FALLBACK}>
            <Routes>
              {[''].concat(['/en', '/tl', '/ilo', '/bis']).map((prefix) => (
                <Route key={prefix || 'root'} path={prefix || '/'} element={<Outlet />}>
                  <Route index element={<Home toolsData={toolsData} navOpen={navOpen} onCloseNav={closeNav} />} />
                  <Route path="about" element={<About />} />
                  <Route path="contact" element={<Contact />} />
                  <Route path="faq" element={<FAQ />} />
                  <Route path="privacy" element={<Privacy />} />
                  <Route path="terms" element={<Terms />} />
                  <Route path="partnerships" element={<Partnerships />} />
                  <Route path="partnership-deck" element={<PartnershipDeck />} />
                  <Route path="sitemap" element={<Sitemap />} />
                  <Route path="bookmarks" element={<Bookmarks toolsData={toolsData} />} />
                  <Route path="compare" element={<Compare toolsData={toolsData} />} />
                  <Route path="learning-paths" element={<LearningPaths />} />
                  <Route path="learning-paths/:toolkitId" element={<LearningPathDetail toolsData={toolsData} />} />
                  <Route path="tools/:toolId" element={<ToolDetail toolsData={toolsData} />} />
                  <Route path="glossary" element={<Glossary />} />
                  <Route path="official-partners" element={<OfficialPartners />} />
                </Route>
              ))}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      )}
      {!isDeck && <Footer isStatic={!isHome} />}
      {showOnboarding && (
        <OnboardingModal onClose={() => setShowOnboarding(false)} />
      )}
      <PWAInstallBanner />
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <BookmarkProvider>
          <ComparisonProvider>
            <AppContent />
          </ComparisonProvider>
        </BookmarkProvider>
      </I18nProvider>
    </ThemeProvider>
  )
}
