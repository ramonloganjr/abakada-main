#!/usr/bin/env node
// Auto-version the service worker cache from the built asset fingerprints, so a
// deploy can never ship a stale app shell because someone forgot to bump the
// hardcoded CACHE_NAME. Runs in postbuild against dist/sw.js.
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { createHash } from 'node:crypto'

const DIST = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'dist')
const swPath = resolve(DIST, 'sw.js')
if (!existsSync(swPath)) { console.warn('[version-sw] dist/sw.js not found; skipping'); process.exit(0) }

// Deterministic version derived from the content-hashed asset filenames.
const assetsDir = resolve(DIST, 'assets')
const files = existsSync(assetsDir) ? readdirSync(assetsDir).sort() : []
const version = `abakada-${createHash('sha256').update(files.join('|')).digest('hex').slice(0, 12)}`

const sw = readFileSync(swPath, 'utf8')
const next = sw.replace(/const CACHE_NAME = '[^']*'/, `const CACHE_NAME = '${version}'`)
if (next === sw) { console.warn('[version-sw] CACHE_NAME line not found — service worker not versioned'); process.exit(0) }
writeFileSync(swPath, next, 'utf8')
console.log(`[version-sw] CACHE_NAME = ${version}`)
