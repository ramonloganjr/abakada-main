import { useState, useEffect, useLayoutEffect, lazy, Suspense } from 'react'
import { Routes, Route, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { I18nProvider, useI18n } from './contexts/I18nContext'
import { BookmarkProvider } from './contexts/BookmarkContext'
import { ComparisonProvider } from './contexts/ComparisonContext'
import { SearchProvider } from './contexts/SearchContext'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Footer from './components/Footer'
import OnboardingModal from './components/OnboardingModal'
import RouteAnnouncer from './components/RouteAnnouncer'
import ConsentBanner from './components/ConsentBanner'
import ErrorBoundary from './components/ErrorBoundary'
import BrandLoader from './components/BrandLoader'
import { stripLangPrefix, langPrefix } from './lib/canonical'
import { getOnboardingRole } from './lib/onboarding'
import { useLiteMode } from './hooks/useLiteMode'

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
const Educators = lazy(() => import('./pages/Educators'))
const Students = lazy(() => import('./pages/Students'))
const Progress = lazy(() => import('./pages/Progress'))

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
  const navigate = useNavigate()
  const { lang } = useI18n()
  const { liteMode } = useLiteMode()

  // Normalize pathname so route checks ignore the optional /<lang> prefix
  // (e.g. /tl, /ilo, /bis, /en). Without this, the home page under a language
  // prefix is treated as a non-home static page and gets the global sidebar
  // overlaid on top of Home.jsx's own filter sidebar.
  const normalizedPath = stripLangPrefix(location.pathname)

  // Show onboarding on first visit to /learning-paths if role not set
  useEffect(() => {
    if (normalizedPath === '/learning-paths') {
      if (!getOnboardingRole()) setShowOnboarding(true)
    }
  }, [normalizedPath])

  useEffect(() => {
    let retries = 0
    const MAX_RETRIES = 3

    async function loadTools() {
      try {
        const r = await fetch('/assets/data/tools.json')

        // Retry on server errors; treat 404 as permanent failure
        if (!r.ok) {
          if (r.status === 404) throw new Error('tools.json not found')
          throw new Error(`HTTP ${r.status}`)
        }

        const data = await r.json()
        setToolsData(data)
        setFetchError(false)
        setLoading(false)
      } catch (err) {
        if (retries < MAX_RETRIES) {
          retries++
          setTimeout(loadTools, 1000 * retries)
          return
        }

        // Final fallback: try the service worker cache before showing error UI
        try {
          const cached = await caches.match('/assets/data/tools.json')
          if (cached) {
            const data = await cached.json()
            setToolsData(data)
            setFetchError(false)
            setLoading(false)
            return
          }
        } catch {
          // Cache also unavailable — fall through to error state
        }

        console.error('[App] Failed to load tools.json after retries:', err.message)
        setFetchError(true)
        setLoading(false)
      }
    }

    loadTools()
  }, [])

  // Close nav on route change
  useEffect(() => { setNavOpen(false) }, [location.pathname])

  // Lite mode: a low-data / low-end-device experience. The body class lets CSS
  // drop the featured carousel, decorative backgrounds, blur and large motion.
  useEffect(() => {
    document.body.classList.toggle('data-lite', liteMode)
    return () => document.body.classList.remove('data-lite')
  }, [liteMode])

  // Listen for SW update-ready event (genuine update, not first install)
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return
    const handleUpdateReady = () => setSwUpdateReady(true)
    window.addEventListener('sw-update-ready', handleUpdateReady)
    return () => window.removeEventListener('sw-update-ready', handleUpdateReady)
  }, [])

  // Viewport height fix for mobile browsers
  useEffect(() => {
    const setVh = () => document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`)
    const onOrientation = () => setTimeout(setVh, 100)
    setVh()
    window.addEventListener('resize', setVh)
    window.addEventListener('orientationchange', onOrientation)
    return () => {
      window.removeEventListener('resize', setVh)
      window.removeEventListener('orientationchange', onOrientation)
    }
  }, [])

  const isHome = normalizedPath === '/'
  const isDeck = normalizedPath === '/partnership-deck'

  // Pages that show the collapsible (auto-hide) sidebar. The global category
  // sidebar renders on every non-home page; on these it behaves as a temporary,
  // collapsed-by-default rail. Tool-detail and learning-path-detail pages are
  // included so the rail stays off-screen by default instead of overlaying their
  // full-width content (which has no sidebar margin on non-home routes).
  const STATIC_SIDEBAR_PATHS = ['/faq', '/privacy', '/terms', '/glossary', '/sitemap', '/about', '/official-partners', '/partnerships', '/contact', '/bookmarks', '/compare', '/learning-paths', '/educators', '/students', '/progress']
  const isStaticSidebarPage =
    STATIC_SIDEBAR_PATHS.includes(normalizedPath) ||
    normalizedPath.startsWith('/learning-paths/') ||
    normalizedPath.startsWith('/tools/')

  // Sync body class for sidebar collapsed state (desktop only).
  // useLayoutEffect (not useEffect) so the class lands BEFORE the first paint —
  // otherwise the sidebar paints expanded for one frame and then slides shut,
  // flashing the panel and animating .site-main's margin on initial load.
  useLayoutEffect(() => {
    document.body.classList.toggle('sidebar-collapsed', sidebarCollapsed && isStaticSidebarPage)
    return () => document.body.classList.remove('sidebar-collapsed')
  }, [sidebarCollapsed, isStaticSidebarPage])

  // Apply static-page class to body for non-home routes.
  // Also pre-paint: body.static-page zeroes .site-main's sidebar margin, so a
  // post-paint toggle would shift content 280px -> 0 on the first frame.
  useLayoutEffect(() => {
    if (isHome) {
      document.body.classList.remove('static-page')
    } else {
      document.body.classList.add('static-page')
    }
    return () => document.body.classList.remove('static-page')
  }, [isHome])

  // Intelligent dismissal for the desktop static-page sidebar: once the user
  // expands it, treat it as a temporary drawer. Clicking/tapping into the main
  // content area (anywhere outside the sidebar) or pressing Escape collapses it
  // again — the same click-outside pattern the mobile nav overlay already uses,
  // so behavior stays consistent across breakpoints. Below 1024px the sidebar is
  // the off-canvas drawer driven by nav-open, so we gate this to desktop.
  useEffect(() => {
    if (!isStaticSidebarPage || sidebarCollapsed) return

    const isDesktop = () => window.matchMedia('(min-width: 1024px)').matches
    if (!isDesktop()) return

    const handlePointerDown = (e) => {
      if (!isDesktop()) return
      const sidebar = document.getElementById('sidebar')
      // Ignore interactions inside the sidebar (incl. its collapse control).
      if (sidebar && sidebar.contains(e.target)) return
      setSidebarCollapsed(true)
    }
    const handleKey = (e) => {
      if (e.key === 'Escape') setSidebarCollapsed(true)
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKey)
    }
  }, [isStaticSidebarPage, sidebarCollapsed])

  // Collapse the static-page sidebar drawer whenever the route changes so each
  // page opens in the clean, distraction-free default state.
  useEffect(() => {
    setSidebarCollapsed(true)
  }, [normalizedPath])

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

  function openNav() {
    setNavOpen(true)
    document.body.classList.add('nav-open')
  }

  return (
    <div className="app">
      <ScrollToTop />
      <RouteAnnouncer />
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
                onCategoryChange={(cat) => { const base = langPrefix(lang); navigate(cat === 'all' ? `${base}/` : `${base}/#${cat}`); closeNav() }}
                platforms={[]}
                tags={[]}
                availablePlatforms={[]}
                availableTags={[]}
                onTogglePlatform={() => {}}
                onToggleTag={() => {}}
                onReset={() => {}}
                hasActiveFilters={false}
                filtering={false}
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
                  <Route index element={<Home toolsData={toolsData} onCloseNav={closeNav} onStartOnboarding={() => setShowOnboarding(true)} onOpenNav={openNav} />} />
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
                  <Route path="tools/:toolId" element={<ToolDetail toolsData={toolsData} hasToolsData={toolsData.tools.length > 0} />} />
                  <Route path="glossary" element={<Glossary />} />
                  <Route path="educators" element={<Educators toolsData={toolsData} />} />
                  <Route path="students" element={<Students toolsData={toolsData} />} />
                  <Route path="progress" element={<Progress toolsData={toolsData} />} />
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
      <ConsentBanner />
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <BookmarkProvider>
          <ComparisonProvider>
            <SearchProvider>
              <AppContent />
            </SearchProvider>
          </ComparisonProvider>
        </BookmarkProvider>
      </I18nProvider>
    </ThemeProvider>
  )
}
