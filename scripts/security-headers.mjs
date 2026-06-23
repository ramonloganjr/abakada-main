#!/usr/bin/env node
// Single source of truth for the Content-Security-Policy (review item 3) plus
// extra hardening (item 8). Defines the policy once and writes it into every
// target that previously restated it — .htaccess (cPanel prod), _headers
// (Netlify/CF), vercel.json, and the index.html <meta> — so they can never drift.
// Runs in prebuild; idempotent.
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
  ['connect-src', "'self' https://www.google-analytics.com https://analytics.google.com"],
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

patch('public/.htaccess', /(Header always set Content-Security-Policy ")[^"]*(")/, `$1${cspHeader}$2`)
patch('public/_headers', /^(\s*Content-Security-Policy:).*$/m, `$1 ${cspHeader}`)
patch('vercel.json', /("key": "Content-Security-Policy", "value": ")[^"]*(")/, `$1${cspHeader}$2`)
patch('index.html', /(<meta http-equiv="Content-Security-Policy" content=")[^"]*("\s*\/>)/, `$1${cspMeta}$2`, 'index.html(meta)')

console.log(`[security-headers] CSP single-sourced across .htaccess/_headers/vercel.json/meta. Updated: ${edits.join(', ') || '(already current)'}`)
