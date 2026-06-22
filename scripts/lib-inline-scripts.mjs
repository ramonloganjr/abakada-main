import { createHash } from 'node:crypto'

// Executable inline-script types under CSP script-src. `application/ld+json`,
// importmaps, etc. are data and are NOT governed by script-src, so they must be
// excluded from hashing (otherwise we'd allow non-scripts and miss real ones).
const JS_TYPES = new Set(['', 'text/javascript', 'application/javascript', 'module'])

// Return the bodies of executable inline <script> blocks (no src) in an HTML doc.
export function extractExecutableInlineScripts(html) {
  const out = []
  for (const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    const attrs = m[1] || ''
    if (/\bsrc\s*=/i.test(attrs)) continue // external — covered by host allowlist
    const typeMatch = attrs.match(/\btype\s*=\s*["']([^"']*)["']/i)
    const type = (typeMatch ? typeMatch[1] : '').toLowerCase().trim()
    if (!JS_TYPES.has(type)) continue // ld+json / importmap — not executed
    out.push(m[2])
  }
  return out
}

// CSP sha256 source-expressions for every executable inline script, de-duplicated.
export function cspHashesFrom(html) {
  const seen = new Set()
  for (const body of extractExecutableInlineScripts(html)) {
    seen.add(`'sha256-${createHash('sha256').update(body, 'utf8').digest('base64')}'`)
  }
  return [...seen]
}
