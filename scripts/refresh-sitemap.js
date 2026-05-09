#!/usr/bin/env node
// Generates public/sitemap.xml from tool + learning-path data.
// Run via `npm run sitemap` or as a `prebuild` hook.

import { readFileSync, writeFileSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const DOMAIN = 'https://abakada.org'
const LANGS = ['en', 'tl', 'ilo', 'bis']
const HREFLANG_MAP = { en: 'en', tl: 'tl', ilo: 'ilo', bis: 'ceb' }

const toolsPath = resolve(ROOT, 'public/assets/data/tools.json')
const pathsPath = resolve(ROOT, 'public/assets/data/learning-paths.json')

const tools = JSON.parse(readFileSync(toolsPath, 'utf8'))
const learning = JSON.parse(readFileSync(pathsPath, 'utf8'))

const fmtDate = (d) => new Date(d).toISOString().slice(0, 10)
const today = fmtDate(Date.now())
const toolsMtime = fmtDate(statSync(toolsPath).mtimeMs)
const pathsMtime = fmtDate(statSync(pathsPath).mtimeMs)

const STATIC_ROUTES = [
  { path: '/', priority: '1.0', changefreq: 'daily', lastmod: today, image: true },
  { path: '/about', priority: '0.8', changefreq: 'monthly', lastmod: today },
  { path: '/learning-paths', priority: '0.9', changefreq: 'weekly', lastmod: pathsMtime },
  { path: '/glossary', priority: '0.7', changefreq: 'monthly', lastmod: today },
  { path: '/partnerships', priority: '0.7', changefreq: 'monthly', lastmod: today },
  { path: '/official-partners', priority: '0.7', changefreq: 'monthly', lastmod: today },
  { path: '/faq', priority: '0.7', changefreq: 'monthly', lastmod: today },
  { path: '/contact', priority: '0.6', changefreq: 'monthly', lastmod: today },
  { path: '/privacy', priority: '0.4', changefreq: 'yearly', lastmod: today },
  { path: '/terms', priority: '0.4', changefreq: 'yearly', lastmod: today },
  { path: '/sitemap', priority: '0.3', changefreq: 'monthly', lastmod: today },
  { path: '/compare', priority: '0.5', changefreq: 'monthly', lastmod: today },
]

const toolkits = (learning.toolkits || []).map((t) => ({
  path: `/learning-paths/${t.id}`,
  priority: '0.7',
  changefreq: 'monthly',
  lastmod: pathsMtime,
}))

const toolPages = (tools.tools || []).map((t) => ({
  path: `/tools/${t.id}`,
  priority: '0.6',
  changefreq: 'monthly',
  lastmod: toolsMtime,
}))

const allRoutes = [...STATIC_ROUTES, ...toolkits, ...toolPages]

const xmlEscape = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')

const renderHreflang = (path) =>
  LANGS.map(
    (l) => `    <xhtml:link rel="alternate" hreflang="${HREFLANG_MAP[l]}" href="${DOMAIN}/${l}${path === '/' ? '' : path}"/>`,
  ).join('\n') + `\n    <xhtml:link rel="alternate" hreflang="x-default" href="${DOMAIN}${path}"/>`

const renderUrl = (r) => {
  const loc = `${DOMAIN}${r.path}`
  const image = r.image
    ? `\n    <image:image>\n      <image:loc>${DOMAIN}/assets/logo/og.png</image:loc>\n      <image:title>${xmlEscape("Abakada — Free Open-Source Tools for Filipino Students & Educators")}</image:title>\n    </image:image>`
    : ''
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${r.lastmod}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
${renderHreflang(r.path)}${image}
  </url>`
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">

${allRoutes.map(renderUrl).join('\n\n')}

</urlset>
`

const outPath = resolve(ROOT, 'public/sitemap.xml')
writeFileSync(outPath, xml, 'utf8')

console.log(`[sitemap] wrote ${allRoutes.length} URLs to ${outPath}`)
console.log(`  static: ${STATIC_ROUTES.length}, toolkits: ${toolkits.length}, tools: ${toolPages.length}`)
