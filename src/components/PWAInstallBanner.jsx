import { useState, useEffect } from 'react'
import { usePWAInstall } from '../hooks/usePWAInstall'

const DISMISSED_KEY = 'abakada_pwa_install_dismissed'

// Detect iOS Safari (no beforeinstallprompt support)
function isIOS() {
  if (typeof navigator === 'undefined') return false
  return /iphone|ipad|ipod/i.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
}

// Detect Android Chrome / Samsung / other Android browsers
function isAndroid() {
  if (typeof navigator === 'undefined') return false
  return /android/i.test(navigator.userAgent)
}

export default function PWAInstallBanner() {
  const { canInstall, isStandalone, triggerInstall } = usePWAInstall()
  const [visible, setVisible] = useState(false)
  const ios = isIOS()
  const android = isAndroid()

  useEffect(() => {
    // Already installed as PWA — never show
    if (isStandalone) return
    if (localStorage.getItem(DISMISSED_KEY)) return

    // iOS Safari: show manual instructions banner
    if (ios) {
      const t = setTimeout(() => setVisible(true), 3000)
      return () => clearTimeout(t)
    }

    // Android / other: wait for beforeinstallprompt
    if (!canInstall) return
    const t = setTimeout(() => setVisible(true), 3000)
    return () => clearTimeout(t)
  }, [canInstall, isStandalone, ios])

  if (!visible) return null

  function dismiss() {
    setVisible(false)
    localStorage.setItem(DISMISSED_KEY, '1')
  }

  async function handleInstall() {
    const outcome = await triggerInstall()
    if (outcome === 'accepted' || outcome === null) dismiss()
  }

  return (
    <div className="pwa-banner" role="dialog" aria-label="Install app">
      <div className="pwa-banner__icon" aria-hidden="true">
        <img src="/assets/logo/favicon-32px.png" alt="" width="32" height="32" loading="lazy" decoding="async" />
      </div>
      <div className="pwa-banner__text">
        <strong>Add to Home Screen</strong>
        {ios ? (
          <span>
            Tap{' '}
            <svg className="pwa-banner__share-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-label="Share">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
            {' '}then "Add to Home Screen"
          </span>
        ) : (
          <span>Add Abakada.org to your home screen for quick access.</span>
        )}
      </div>
      <div className="pwa-banner__actions">
        {!ios && (
          <button type="button" className="btn btn--primary btn--sm" onClick={handleInstall}>
            Install
          </button>
        )}
        <button type="button" className="btn btn--ghost btn--sm" onClick={dismiss}>
          {ios ? 'Dismiss' : 'Not now'}
        </button>
      </div>
    </div>
  )
}
