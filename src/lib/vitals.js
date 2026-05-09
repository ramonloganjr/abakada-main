// Reports Core Web Vitals to GA4 via the existing gtag setup in index.html.
// Tracked: CLS, LCP, INP, FCP, TTFB.

import { onCLS, onLCP, onINP, onFCP, onTTFB } from 'web-vitals'

function send(metric) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return
  window.gtag('event', 'web_vitals', {
    event_category: 'Web Vitals',
    event_label: metric.id,
    metric_name: metric.name,
    metric_value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
    metric_rating: metric.rating,
    metric_delta: Math.round(metric.delta * 1000) / 1000,
    non_interaction: true,
  })
}

export function reportWebVitals() {
  try {
    onCLS(send)
    onLCP(send)
    onINP(send)
    onFCP(send)
    onTTFB(send)
  } catch {
    // No-op: web-vitals may throw on unsupported browsers.
  }
}
