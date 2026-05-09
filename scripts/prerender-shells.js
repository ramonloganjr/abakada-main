#!/usr/bin/env node
// Generates per-route HTML shells in dist/<route>/index.html.
//
// Each shell is a clone of dist/index.html with route-specific <title>,
// <meta name="description">, <link rel="canonical">, and OG/Twitter overrides.
// React hydrates on top and react-helmet-async then manages updates client-side.
//
// This is a pragmatic alternative to full SSG/SSR: crawlers receive the correct
// per-page metadata in the HTML they fetch, while the SPA continues to work.
//
// Run after `vite build` (a `postbuild` npm hook).

import { readFileSync, writeFileSync, mkdirSync, statSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const DIST = resolve(ROOT, 'dist')
const SHELL_PATH = resolve(DIST, 'index.html')
const SITE = 'https://abakada.org'

if (!existsSync(SHELL_PATH)) {
  console.error(`[prerender] dist/index.html not found at ${SHELL_PATH}. Did you run vite build?`)
  process.exit(1)
}

const SHELL = readFileSync(SHELL_PATH, 'utf8')

const tools = JSON.parse(readFileSync(resolve(ROOT, 'public/assets/data/tools.json'), 'utf8'))
const learning = JSON.parse(readFileSync(resolve(ROOT, 'public/assets/data/learning-paths.json'), 'utf8'))

const STATIC_PAGES = [
  { path: '/about', title: 'About Abakada — Mission, Team & Editorial Standards', description: 'Learn about Abakada — a volunteer-driven directory of free open-source tools for Filipinos. Founded by Ramon Logan Jr. in service of digital equity.' },
  { path: '/faq', title: 'Frequently Asked Questions — Abakada', description: 'Answers to common questions about Abakada — how we select tools, licensing, offline use, AI policy, partnerships, and how to contribute.' },
  { path: '/privacy', title: 'Privacy Policy — Abakada', description: 'How Abakada collects, uses, and protects your data. We use minimal analytics, store no personal data on our servers, and never sell your information.' },
  { path: '/contact', title: 'Contact Abakada — Editorial, Partnerships, Support', description: 'Reach the Abakada team for editorial corrections, partnership inquiries, or general support. Email hello@abakada.org or use our contact form.' },
  { path: '/partnerships', title: 'Partnership Opportunities — Abakada', description: 'Partner with Abakada to bring free open-source tools to Filipino schools, communities, and organizations. Volunteer, donate, or co-publish content.' },
  { path: '/official-partners', title: 'Official Partners of Abakada', description: 'Schools, organizations, and FOSS projects officially partnered with Abakada to expand access to free open-source productivity tools in the Philippines.' },
  { path: '/learning-paths', title: 'Learning Paths — Curated FOSS Toolkits — Abakada', description: 'Structured learning paths combining free open-source tools — Digital Foundations, Research Starter, Beginner Coding, Designer Toolkit, and more.' },
  { path: '/compare', title: 'Compare Open-Source Tools — Abakada', description: 'Side-by-side comparison of free open-source tools — features, platforms, licenses, and use cases. Pick the right tool for your workflow.' },
  { path: '/sitemap', title: 'HTML Sitemap — Abakada', description: 'Browse all Abakada pages — tools, learning paths, FAQ, about, partnerships, and more.' },
  { path: '/glossary', title: 'Glossary — Open-Source, Licensing & Productivity Terms — Abakada', description: 'Definitions of common terms used on Abakada — FOSS, GPL, MIT, AGPL, PWA, OER, Creative Commons, AEO, GEO, and more.' },
  { path: '/terms', title: 'Terms of Use — Abakada.org', description: 'Terms of Use governing access to Abakada.org — intellectual property, acceptable use, brand protection, liability limitations, and dispute resolution under Philippine law.' },
]

const toolkitPages = (learning.toolkits || []).map((tk) => ({
  path: `/learning-paths/${tk.id}`,
  title: `${tk.title} — Abakada Learning Path`,
  description: (tk.description || `${tk.title} learning path on Abakada.`).slice(0, 158),
}))

const toolPages = (tools.tools || []).map((tool) => {
  const tagline = tool.tagline || 'Free open-source tool'
  return {
    path: `/tools/${tool.id}`,
    title: `${tool.name} — ${tagline} — Abakada`,
    description: (tool.description || `${tool.name}: ${tagline}. Free, open-source tool reviewed by Abakada.`).slice(0, 158),
  }
})

const xmlEscape = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

function rewriteShell(page) {
  const url = `${SITE}${page.path}`
  let html = SHELL

  // Title
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${xmlEscape(page.title)}</title>`)

  // Meta description
  html = html.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/>/,
    `<meta name="description" content="${xmlEscape(page.description)}" />`,
  )

  // Canonical
  html = html.replace(
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/>/,
    `<link rel="canonical" href="${url}" />`,
  )

  // OG title/description/url
  html = html.replace(
    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:title" content="${xmlEscape(page.title)}" />`,
  )
  html = html.replace(
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:description" content="${xmlEscape(page.description)}" />`,
  )
  html = html.replace(
    /<meta\s+property="og:url"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:url" content="${url}" />`,
  )

  // Twitter title/description
  html = html.replace(
    /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/>/,
    `<meta name="twitter:title" content="${xmlEscape(page.title)}" />`,
  )
  html = html.replace(
    /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/>/,
    `<meta name="twitter:description" content="${xmlEscape(page.description)}" />`,
  )

  return html
}

function writeShell(page) {
  const dir = resolve(DIST, page.path.replace(/^\//, ''))
  mkdirSync(dir, { recursive: true })
  writeFileSync(resolve(dir, 'index.html'), rewriteShell(page), 'utf8')
}

const all = [...STATIC_PAGES, ...toolkitPages, ...toolPages]
let written = 0

for (const page of all) {
  try {
    writeShell(page)
    written++
  } catch (err) {
    console.warn(`[prerender] skip ${page.path}: ${err.message}`)
  }
}

console.log(`[prerender] wrote ${written} HTML shells (${STATIC_PAGES.length} static + ${toolkitPages.length} toolkits + ${toolPages.length} tools)`)
