#!/usr/bin/env node
// Postbuild safety net for the CSP Vercel serves, declared in vercel.json.
//   • If script-src keeps 'unsafe-inline' (current GA-on-static-host mode), all
//     inline scripts are allowed — we just confirm a CSP is present.
//   • If 'unsafe-inline' is ever dropped (strict hash mode), every executable
//     inline script in the BUILT dist/index.html must have its sha256 in the CSP,
//     or the build fails instead of silently breaking scripts in production.
import { readFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { createHash } from 'node:crypto'
import { extractExecutableInlineScripts } from './lib-inline-scripts.mjs'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const vercelConfig = resolve(ROOT, 'vercel.json')
const html = resolve(ROOT, 'dist', 'index.html')

// Only the built HTML is optional here (this runs postbuild, but stays callable
// on its own). vercel.json is committed and is the deployed policy, so a missing
// or empty CSP there is a hard failure, never a skip — a silent skip is exactly
// how a security net stops protecting anything.
if (!existsSync(vercelConfig)) { console.error('[verify-csp] FAIL — vercel.json is missing'); process.exit(1) }
if (!existsSync(html)) { console.warn('[verify-csp] dist/index.html missing; run a build first — skipping'); process.exit(0) }

const csp = (() => {
  const cfg = JSON.parse(readFileSync(vercelConfig, 'utf8'))
  for (const rule of cfg.headers || []) {
    for (const h of rule.headers || []) {
      if (String(h.key).toLowerCase() === 'content-security-policy') return h.value
    }
  }
  return ''
})()
if (!csp) { console.error('[verify-csp] FAIL — no Content-Security-Policy header in vercel.json'); process.exit(1) }

const scriptSrc = (csp.match(/script-src([^;]*)/) || ['', ''])[1]
const allowsInline = /'unsafe-inline'/.test(scriptSrc)

if (allowsInline) {
  console.log("[verify-csp] OK — script-src allows inline (GA-compatible mode); CSP present and single-sourced.")
  process.exit(0)
}

// Strict hash mode: assert every built inline script is covered.
const inline = extractExecutableInlineScripts(readFileSync(html, 'utf8'))
let missing = 0
for (const body of inline) {
  const h = `sha256-${createHash('sha256').update(body, 'utf8').digest('base64')}`
  if (!csp.includes(h)) { missing++; console.error(`[verify-csp] inline script not allowed by CSP: ${h}`) }
}
if (missing) { console.error(`[verify-csp] FAIL — ${missing} inline script(s) would be blocked in production.`); process.exit(1) }
console.log(`[verify-csp] OK — strict mode: ${inline.length} inline script hash(es) present in CSP.`)
