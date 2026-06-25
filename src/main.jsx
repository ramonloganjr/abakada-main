import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import App from './App'
import { reportWebVitals } from './lib/vitals'
import { reportError } from './lib/reportError'
import './styles/inter.css'
import './styles/base.css'
import './styles/themes.css'
import './styles/layout.css'
import './styles/components.css'
import './styles/animations.css'
import { printConsoleWarning, disableContextMenuOn, disableSelectOn, collectBotSignals } from './lib/security'

// Security bootstrap
printConsoleWarning()
disableContextMenuOn('.card, .tool-card, .learning-tool-card')
disableSelectOn('.card__title, .card__description, .card__tag')

// Passive bot detection — log signal in dev, could feed analytics in prod
if (import.meta.env.DEV) {
  const { score, likelyBot } = collectBotSignals()
  if (likelyBot) console.warn('[Security] Bot signals detected, score:', score)
}

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  try {
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => {
        // Check for updates in the background — don't force skip waiting
        reg.update().catch(() => {})

        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing
          if (!newWorker) return
          newWorker.addEventListener('statechange', () => {
            // Only show update banner when:
            // 1. New SW is fully installed (not just installing)
            // 2. A previous SW was already controlling the page (genuine update, not first install)
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // Don't auto-skip — let the user trigger reload via the banner
              window.__swWaiting = newWorker
              // Dispatch a custom event that App.jsx listens for
              window.dispatchEvent(new Event('sw-update-ready'))
            }
          })
        })
      })
      .catch(() => {})
  } catch {
    // SW blocked by IAB — continue without it
  }
}

// Normalize direct hits on prerendered shell URLs (e.g. "/glossary/index.html"
// produced by static hosts, crawlers, copy-pasted paths, or Lighthouse's static
// server) to their clean route BEFORE React Router initializes. Otherwise the SPA
// can't match the trailing "/index.html", falls through to NotFound, and NotFound
// injects a conflicting /404 canonical + noindex — a real SEO regression on those
// URLs. Running pre-mount means the router sees the clean path from the first
// render, with no NotFound flash.
if (location.pathname.endsWith('/index.html')) {
  const clean = location.pathname.replace(/\/index\.html$/, '') || '/'
  window.history.replaceState(window.history.state, '', clean + location.search + location.hash)
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
)

if (import.meta.env.PROD) reportWebVitals()

if (import.meta.env.PROD) {
  window.addEventListener('unhandledrejection', ({ reason }) => {
    reportError(reason instanceof Error ? reason : new Error(String(reason)), 'unhandledrejection')
  })
  // Synchronous global errors (the unhandledrejection handler only covers async).
  window.addEventListener('error', (e) => {
    if (e?.error) reportError(e.error, 'window.error')
  })
}
