#!/usr/bin/env node
// Single source of truth for the Content-Security-Policy (review item 3) plus
// extra hardening (item 8). Defines the policy once and writes it into both
// places that restate it — vercel.json (the response header Vercel actually
// serves) and the index.html <meta> (the in-document fallback) — so they can
// never drift. Runs in prebuild; idempotent.
//
// Vercel is the only deployment target. The former cPanel/.htaccess and
// Netlify/_headers copies were removed with that path; `verify-csp` asserts the
// vercel.json policy survived the build so this file cannot silently no-op.
//
// NOTE on script-src 'unsafe-inline': Google Analytics (gtag.js) injects inline
// scripts at runtime, and a CSP3 browser ignores 'unsafe-inline' the moment a
// hash/nonce is present — so a static, hash-only script-src breaks GA (it can't
// be nonced without a server). We therefore keep 'unsafe-inline' for scripts
// while GA runs on static hosting, and harden everything else (object-src 'none',
// base-uri, frame-ancestors, form-action, etc.). Removing 'unsafe-inline' is a
// follow-up gated on either a nonce-capable host or a cookieless analytics
// (e.g. Plausible/Umami) that doesn't inject inline. `verify-csp` enforces the
// stricter hash mode automatically if 'unsafe-inline' is ever dropped here.
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const rd = (p) => readFileSync(resolve(ROOT, p), 'utf8')
const wr = (p, c) => writeFileSync(resolve(ROOT, p), c, 'utf8')

const indexHtml = rd('index.html')
const GA = 'https://www.googletagmanager.com https://www.google-analytics.com'

const directives = [
  ['default-src', "'self'"],
  ['script-src', `'self' ${GA} 'unsafe-inline'`],
  ['style-src', "'self' 'unsafe-inline'"],
  ['img-src', "'self' data: https:"],
  ['font-src', "'self'"],
  ['connect-src', "'self' https://www.google-analytics.com https://analytics.google.com https://www.google.com"],
  // The footer embeds the App Builders PH vote widget. Without an explicit
  // frame-src this falls back to default-src 'self' and the iframe is blocked
  // outright in production, rendering an empty box. Scoped to that one origin.
  ['frame-src', 'https://appbuildersph.com'],
  ['worker-src', "'self'"],
  ['manifest-src', "'self'"],
  ['object-src', "'none'"],
  ['base-uri', "'self'"],
  ['form-action', "'self'"],
  ['frame-ancestors', "'none'"],
  ['upgrade-insecure-requests', ''],
]
const toCsp = (list) => list.map(([k, v]) => (v ? `${k} ${v}` : k)).join('; ')
const cspHeader = toCsp(directives)
// <meta> cannot express frame-ancestors / upgrade-insecure-requests.
const cspMeta = toCsp(directives.filter(([k]) => k !== 'frame-ancestors' && k !== 'upgrade-insecure-requests'))

const edits = []
function patch(file, re, replacement, label) {
  if (!existsSync(resolve(ROOT, file))) return
  const cur = rd(file)
  const next = cur.replace(re, replacement)
  if (next !== cur) { wr(file, next); edits.push(label || file) }
}

patch('vercel.json', /("key": "Content-Security-Policy", "value": ")[^"]*(")/, `$1${cspHeader}$2`)
patch('index.html', /(<meta http-equiv="Content-Security-Policy" content=")[^"]*("\s*\/>)/, `$1${cspMeta}$2`, 'index.html(meta)')

// A silent no-op here would ship an outdated policy, so prove both targets were
// actually reachable rather than trusting the regexes to have matched.
for (const [file, needle] of [['vercel.json', cspHeader], ['index.html', cspMeta]]) {
  if (!rd(file).includes(needle)) {
    console.error(`[security-headers] FAIL — could not write the CSP into ${file}. Did its shape change?`)
    process.exit(1)
  }
}

console.log(`[security-headers] CSP single-sourced across vercel.json/meta. Updated: ${edits.join(', ') || '(already current)'}`)
