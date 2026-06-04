/**
 * Lightweight production error reporter.
 *
 * Reads VITE_ERROR_REPORT_URL from the build environment.
 * If not set, errors are console.error-only (safe default).
 *
 * To enable remote reporting:
 *   1. Set VITE_ERROR_REPORT_URL in your Vercel/CI environment.
 *   2. Point it at a Cloudflare Worker, Sentry DSN ingest, or any POST endpoint.
 *
 * Payload shape:
 *   { message, stack, context, url, userAgent, timestamp }
 */

const ENDPOINT = import.meta.env.VITE_ERROR_REPORT_URL || null

export function reportError(error, context = '') {
  const message = error?.message ?? String(error)
  const stack   = error?.stack?.slice(0, 2000) ?? ''

  console.error(`[abakada] ${context ? `[${context}] ` : ''}${message}`)

  if (!ENDPOINT || import.meta.env.DEV) return

  // Fire-and-forget — never let the reporter itself cause another error
  try {
    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // keepalive allows the request to outlive the page
      keepalive: true,
      body: JSON.stringify({
        message,
        stack,
        context,
        url: globalThis.location?.href ?? '',
        userAgent: globalThis.navigator?.userAgent?.slice(0, 200) ?? '',
        timestamp: new Date().toISOString(),
      }),
    }).catch(() => {})
  } catch {
    // Swallow — reporting must never break the page
  }
}
