// @ts-check
// Install-guide generator.
//
// tools.json carries a `platforms` array using a mixed vocabulary — operating
// systems (windows/macos/linux), runtimes (python/nodejs/…), deployment targets
// (self-hosted/kubernetes/cloud), web, and mobile. Rather than hand-write install
// steps for every tool in the catalog, we classify each tool's platforms into a few buckets and
// the UI renders localized, step-by-step guidance per bucket. This keeps the page
// genuinely helpful for non-technical visitors while scaling to the whole catalog.
//
// This module is intentionally pure (no React, no i18n, no DOM) so it is trivially
// unit-testable; the component layers translation + presentation on top.

/** @type {Record<string, string>} */
export const PLATFORM_LABELS = {
  windows: 'Windows',
  macos: 'macOS',
  linux: 'Linux',
  android: 'Android',
  ios: 'iOS',
  web: 'Web',
  'self-hosted': 'Self-hosted',
  kubernetes: 'Kubernetes',
  cloud: 'Cloud',
  docker: 'Docker',
  python: 'Python',
  nodejs: 'Node.js',
  deno: 'Deno',
  ruby: 'Ruby',
  go: 'Go',
  java: 'Java',
  'multi-language': 'multiple languages',
  'ide-plugins': 'IDE plugins',
  microcontrollers: 'microcontrollers',
  esp8266: 'ESP8266',
  esp32: 'ESP32',
  specification: 'specification',
}

// Human-readable label for a platform code, with a sensible capitalized fallback
// for any value we have not explicitly mapped.
/** @param {string} code @returns {string} */
export function platformLabel(code) {
  if (!code) return ''
  return PLATFORM_LABELS[code] || code.charAt(0).toUpperCase() + code.slice(1)
}

// Ordered easiest-first so a beginner sees the lowest-friction path (web) before
// desktop installs, and developer/server paths last.
const BUCKET_DEFS = [
  { id: 'web', platforms: ['web'] },
  { id: 'desktop', platforms: ['windows', 'macos', 'linux'] },
  { id: 'mobile', platforms: ['android', 'ios'] },
  { id: 'runtime', platforms: ['python', 'nodejs', 'deno', 'ruby', 'go', 'java', 'multi-language', 'ide-plugins', 'microcontrollers', 'esp8266', 'esp32'] },
  { id: 'server', platforms: ['self-hosted', 'kubernetes', 'cloud', 'docker'] },
]

// Classify a tool's platforms into install buckets.
// Returns [{ id, platforms: [...] }] in easiest-first order. When nothing matches
// (unknown/spec-only platforms), returns a single 'generic' bucket so the UI can
// still point the visitor to the official site.
/** @param {import('../types').Tool | null | undefined} tool @returns {import('../types').InstallBucket[]} */
export function getInstallBuckets(tool) {
  const platforms = tool && Array.isArray(tool.platforms) ? tool.platforms : []
  const buckets = []
  for (const def of BUCKET_DEFS) {
    const matched = platforms.filter((p) => def.platforms.includes(p))
    if (matched.length) buckets.push({ id: def.id, platforms: matched })
  }
  return buckets.length ? buckets : [{ id: 'generic', platforms: [] }]
}

// Format a bucket's platforms as a readable list, e.g. "Windows, macOS, Linux".
/** @param {string[] | null | undefined} platforms @returns {string} */
export function formatPlatformList(platforms) {
  return (platforms || []).map(platformLabel).join(', ')
}
