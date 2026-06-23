// Shared data-shape types for incremental TypeScript adoption. Referenced from
// JS libraries via JSDoc, e.g. `@param {import('../types').Tool[]} tools`.

export interface Tool {
  id: string
  name: string
  category: string
  tagline?: string
  description?: string
  website?: string
  license?: string
  platforms?: string[]
  tags?: string[]
  alternatives_to?: string[]
  web_try_url?: string
  repo_url?: string
  last_update?: string
  is_foss?: boolean
  stars?: number
}

export interface Toolkit {
  id: string
  title: string
  tagline?: string
  description?: string
  role?: string
  track?: string
  difficulty?: string
  icon?: string
  audiences?: string[]
  curriculum?: string[]
  outcomes?: string[]
  stages: unknown[]
}

export interface Strand {
  id: string
  category: string
  label: string
  fullName?: string
  description?: string
  color?: string
}

export interface Curriculum {
  categories?: Array<{ id: string; label: string; authority?: string; description?: string }>
  strands?: Strand[]
}

export interface InstallBucket {
  id: string
  platforms: string[]
}
