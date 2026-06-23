import { useState, useEffect } from 'react'
import { useI18n } from '../contexts/I18nContext'

// Analytics consent (review item 9). GA4 boots with Consent Mode v2 defaulting to
// "denied" (see index.html), so no analytics cookies are set until the visitor
// opts in here. The choice is remembered; on return visits a prior "granted" is
// re-applied (consent defaults to denied on every fresh load).
const KEY = 'abakada-consent'

function updateConsent(granted) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('consent', 'update', { analytics_storage: granted ? 'granted' : 'denied' })
  }
}

export default function ConsentBanner() {
  const { t } = useI18n()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let choice = null
    try { choice = localStorage.getItem(KEY) } catch { /* private mode */ }
    if (choice === 'granted') updateConsent(true)
    else if (!choice) setVisible(true)
  }, [])

  function decide(granted) {
    try { localStorage.setItem(KEY, granted ? 'granted' : 'denied') } catch { /* private mode */ }
    updateConsent(granted)
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="consent-banner" role="dialog" aria-live="polite" aria-label={t('consent.label', 'Analytics consent')}>
      <p className="consent-banner__text">
        {t('consent.text', 'We use privacy-friendly analytics to see what helps. No ads, and no data is sold. You can decline and everything still works.')}
      </p>
      <div className="consent-banner__actions">
        <button type="button" className="btn btn--secondary btn--sm" onClick={() => decide(false)}>
          {t('consent.decline', 'Decline')}
        </button>
        <button type="button" className="btn btn--primary btn--sm" onClick={() => decide(true)}>
          {t('consent.accept', 'Accept')}
        </button>
      </div>
    </div>
  )
}
