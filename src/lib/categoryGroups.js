// @ts-check
// Single source of truth for how the 45 tool categories roll up into the seven
// high-level domains. Used by the Sidebar navigation AND the competency radar in
// the learner profile, so a learner's "skill domains" always match the way the
// catalogue is organised. Keep this list and the `groups.*` translation keys in
// sync.

/** @typedef {{ id: string, categories: string[] }} CategoryGroup */

/** @type {CategoryGroup[]} */
export const CATEGORY_GROUPS = [
  { id: 'productivity', categories: ['doc-processing', 'notes', 'project', 'communication', 'writing'] },
  { id: 'creative', categories: ['design', 'desktop-publishing', 'visualization', 'cms', '3d', 'photography'] },
  { id: 'data', categories: ['data-processing', 'math', 'reference', 'ai-ml', 'science'] },
  { id: 'security', categories: ['encryption', 'password', 'privacy', 'security-tools'] },
  { id: 'media', categories: ['media', 'ebook', 'audio', 'video', 'gaming'] },
  { id: 'utilities', categories: ['file', 'geographic', 'health', 'finance', 'education', 'networking', 'automation', 'backup', 'homelab'] },
  { id: 'development', categories: ['development', 'devops', 'database', 'monitoring', 'testing', 'api', 'mobile', 'web', 'virtualization'] },
  { id: 'business', categories: ['ecommerce', 'crm'] },
]

// Short, human labels used as a fallback when a translation key is missing.
/** @type {Record<string, string>} */
export const GROUP_LABELS = {
  productivity: 'Productivity',
  creative: 'Creative',
  data: 'Data & Research',
  security: 'Security & Privacy',
  media: 'Media',
  utilities: 'Everyday & Utilities',
  development: 'Development',
  business: 'Business',
}

// A representative icon per domain for the competency radar / legend.
/** @type {Record<string, string>} */
export const GROUP_ICONS = {
  productivity: 'briefcase',
  creative: 'palette',
  data: 'flask-round',
  security: 'lock-keyhole',
  media: 'headphones',
  utilities: 'wrench',
  development: 'code',
  business: 'store',
}

// Reverse lookup: category id -> group id. Built once at module load.
/** @type {Record<string, string>} */
export const CATEGORY_TO_GROUP = CATEGORY_GROUPS.reduce((acc, g) => {
  g.categories.forEach((c) => { acc[c] = g.id })
  return acc
}, /** @type {Record<string, string>} */ ({}))

/** @param {string} categoryId @returns {string | null} */
export function groupForCategory(categoryId) {
  return CATEGORY_TO_GROUP[categoryId] || null
}
