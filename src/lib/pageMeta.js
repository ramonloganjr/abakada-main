// Centralized page metadata for SEO/AEO/GEO. All page components import from here.
// Keep titles ≤ 60 chars (after the " | Abakada" suffix), descriptions ≤ 160 chars.

import { SITE_ORIGIN } from './canonical'
import { catalogToolCount, CATALOG_CATEGORY_COUNT } from './catalog'

const ORG = {
  '@type': 'Organization',
  name: 'Abakada',
  url: `${SITE_ORIGIN}/`,
  logo: `${SITE_ORIGIN}/assets/logo/og.png`,
}

const personFounder = {
  '@type': 'Person',
  name: 'Ramon Logan Jr.',
  jobTitle: 'Founder',
  url: 'https://ramonloganjr.com',
  sameAs: ['https://github.com/ramonloganjr'],
  worksFor: ORG,
}

const breadcrumb = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: it.name,
    item: `${SITE_ORIGIN}${it.path}`,
  })),
})

export const pageMeta = {
  home: {
    title: `${catalogToolCount()} Free Open-Source Tools for Filipino Students & Educators`,
    description:
      `Abakada is a free, curated directory of ${catalogToolCount()} open-source productivity tools for Filipino students, educators, and professionals. Browse ${CATALOG_CATEGORY_COUNT}+ categories.`,
    pathname: '/',
    jsonLd: breadcrumb([{ name: 'Home', path: '/' }]),
  },

  about: {
    title: 'About Abakada: Mission, Team & Editorial Standards',
    description:
      'Learn about Abakada, a volunteer-driven directory of free open-source tools for Filipinos. Founded by Ramon Logan Jr. in service of digital equity.',
    pathname: '/about',
    jsonLd: [
      breadcrumb([
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
      ]),
      {
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        name: 'About Abakada',
        url: `${SITE_ORIGIN}/about`,
        about: ORG,
        author: personFounder,
        inLanguage: ['en', 'tl', 'ilo', 'ceb'],
      },
      { '@context': 'https://schema.org', ...personFounder },
    ],
  },

  faq: {
    title: 'Frequently Asked Questions',
    description:
      'Answers to common questions about Abakada: how we select tools, licensing, offline use, AI policy, partnerships, and how to contribute.',
    pathname: '/faq',
    jsonLd: breadcrumb([
      { name: 'Home', path: '/' },
      { name: 'FAQ', path: '/faq' },
    ]),
  },

  privacy: {
    title: 'Privacy Policy',
    description:
      'How Abakada collects, uses, and protects your data. We use minimal analytics, store no personal data on our servers, and never sell your information.',
    pathname: '/privacy',
    jsonLd: breadcrumb([
      { name: 'Home', path: '/' },
      { name: 'Privacy', path: '/privacy' },
    ]),
  },

  terms: {
    title: 'Terms of Use | Abakada.org',
    description:
      'Terms of Use governing access to Abakada.org: intellectual property, acceptable use, brand protection, liability limitations, and dispute resolution under Philippine law.',
    pathname: '/terms',
    jsonLd: breadcrumb([
      { name: 'Home', path: '/' },
      { name: 'Terms of Use', path: '/terms' },
    ]),
  },

  contact: {
    title: 'Contact Abakada: Editorial, Partnerships, Support',
    description:
      'Reach the Abakada team for editorial corrections, partnership inquiries, or general support. Email hello@abakada.org or use our contact form.',
    pathname: '/contact',
    jsonLd: [
      breadcrumb([
        { name: 'Home', path: '/' },
        { name: 'Contact', path: '/contact' },
      ]),
      {
        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        name: 'Contact Abakada',
        url: `${SITE_ORIGIN}/contact`,
      },
    ],
  },

  partnerships: {
    title: 'Partnership Opportunities: Schools, NGOs, FOSS Projects',
    description:
      'Partner with Abakada to bring free open-source tools to Filipino schools, communities, and organizations. Volunteer, donate, or co-publish content.',
    pathname: '/partnerships',
    jsonLd: breadcrumb([
      { name: 'Home', path: '/' },
      { name: 'Partnerships', path: '/partnerships' },
    ]),
  },

  officialPartners: {
    title: 'Official Partners of Abakada',
    description:
      'Schools, organizations, and FOSS projects officially partnered with Abakada to expand access to free open-source productivity tools in the Philippines.',
    pathname: '/official-partners',
    jsonLd: breadcrumb([
      { name: 'Home', path: '/' },
      { name: 'Official Partners', path: '/official-partners' },
    ]),
  },

  learningPaths: {
    title: 'Learning Paths: Curated FOSS Toolkits for Students',
    description:
      'Structured learning paths combining free open-source tools: Digital Foundations, Research Starter, Beginner Coding, Designer Toolkit, and more.',
    pathname: '/learning-paths',
    jsonLd: breadcrumb([
      { name: 'Home', path: '/' },
      { name: 'Learning Paths', path: '/learning-paths' },
    ]),
  },

  educators: {
    title: 'For Educators: Free Curriculum-Aligned Classroom Tools',
    description:
      'Free, open-source tools for Filipino teachers, mapped to DepEd Senior High School strands. No licenses, no student accounts. Plus a classroom starter kit and parent FAQ.',
    pathname: '/educators',
    jsonLd: [
      breadcrumb([
        { name: 'Home', path: '/' },
        { name: 'For Educators', path: '/educators' },
      ]),
      {
        '@context': 'https://schema.org',
        '@type': 'EducationalOrganization',
        name: 'Abakada',
        url: `${SITE_ORIGIN}/educators`,
        description:
          'A volunteer-driven directory of free, open-source tools for Filipino educators, aligned to DepEd Senior High School strands.',
        audience: { '@type': 'EducationalAudience', educationalRole: 'teacher' },
        inLanguage: ['en', 'tl', 'ilo', 'ceb'],
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          ['Is this software safe for my child?', 'Yes. Every tool is open-source and reviewed before listing, and we link only to official download sites. Open-source code can be publicly inspected, which is one reason schools and governments worldwide trust it.'],
          ['Does my child need to create an account?', 'No. Abakada requires no sign-up, and the tools we highlight for classrooms can be used without creating accounts. Some optional online services may offer a free account to save work.'],
          ['Will these run on our home computer?', 'Almost certainly. We prioritise tools that run on Windows, macOS, and Linux, including older and lower-spec machines, and many work offline.'],
          ['Is Abakada endorsed by DepEd?', 'Abakada is an independent, volunteer-driven project. We align our learning paths to DepEd Senior High School strands for relevance, but we are not an official DepEd program.'],
        ].map(([q, a]) => ({
          '@type': 'Question',
          name: q,
          acceptedAnswer: { '@type': 'Answer', text: a },
        })),
      },
    ],
  },

  students: {
    title: 'For Students: Free Tools for Schoolwork & Study',
    description:
      'Free, open-source tools for Filipino students, for writing, presentations, photos, video, coding, and study. No cost, no account, works offline.',
    pathname: '/students',
    jsonLd: [
      breadcrumb([
        { name: 'Home', path: '/' },
        { name: 'For Students', path: '/students' },
      ]),
      {
        '@context': 'https://schema.org',
        '@type': 'EducationalOrganization',
        name: 'Abakada',
        url: `${SITE_ORIGIN}/students`,
        description:
          'A volunteer-driven directory of free, open-source tools for Filipino students, organized by what you need to do.',
        audience: { '@type': 'EducationalAudience', educationalRole: 'student' },
        inLanguage: ['en', 'tl', 'ilo', 'ceb'],
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          ['Do I have to pay for anything?', 'No. Every tool here is free and open-source. There are no trials that expire and no hidden fees.'],
          ['Do I need to make an account?', 'No account is needed to use Abakada, and most tools work without signing up. Some optional cloud features may offer a free account.'],
          ['Will these work on my phone?', 'Many do, and some are phone-first. Each tool page lists the platforms it supports. Look for Android or iOS.'],
          ['Can I use these for schoolwork?', 'Yes. These tools create standard files (documents, images, video) you can submit anywhere, perfect for reports, projects, and presentations.'],
        ].map(([q, a]) => ({
          '@type': 'Question',
          name: q,
          acceptedAnswer: { '@type': 'Answer', text: a },
        })),
      },
    ],
  },

  bookmarks: {
    title: 'My Bookmarks',
    description: 'Your saved tools on Abakada, synced across the device, no account required.',
    pathname: '/bookmarks',
    noindex: true,
  },

  compare: {
    title: 'Compare Open-Source Tools',
    description:
      'Side-by-side comparison of free open-source tools: features, platforms, licenses, and use cases. Pick the right tool for your workflow.',
    pathname: '/compare',
    jsonLd: breadcrumb([
      { name: 'Home', path: '/' },
      { name: 'Compare', path: '/compare' },
    ]),
  },

  sitemap: {
    title: 'HTML Sitemap',
    description: 'Browse all Abakada pages: tools, learning paths, FAQ, about, partnerships, and more.',
    pathname: '/sitemap',
    jsonLd: breadcrumb([
      { name: 'Home', path: '/' },
      { name: 'Sitemap', path: '/sitemap' },
    ]),
  },

  guide: {
    title: 'Platform Guide: How to Use Abakada',
    description:
      'The complete user guide to Abakada: getting started, learning paths, the Toolkit, offline use, roles, workflows, troubleshooting, and support. Plain language.',
    pathname: '/guide',
    jsonLd: breadcrumb([
      { name: 'Home', path: '/' },
      { name: 'Platform Guide', path: '/guide' },
    ]),
  },

  glossary: {
    title: 'Glossary: Open-Source, Licensing & Productivity Terms',
    description:
      'Definitions of common terms used on Abakada: FOSS, GPL, MIT, AGPL, PWA, OER, Creative Commons, AEO, GEO, and more.',
    pathname: '/glossary',
    jsonLd: breadcrumb([
      { name: 'Home', path: '/' },
      { name: 'Glossary', path: '/glossary' },
    ]),
  },

  notFound: {
    title: 'Page Not Found',
    description: 'The page you requested does not exist on Abakada. Browse our tools, learning paths, or FAQ.',
    pathname: '/404',
    noindex: true,
  },

  partnershipDeck: {
    title: 'Partnership Deck',
    description: 'Abakada partnership pitch deck: overview, mission, traction, and partnership tiers.',
    pathname: '/partnership-deck',
    noindex: true,
  },
}

// Tie each entry to its `seo.<key>` translation so <SEO> can localize the title
// and description without every page having to look them up.
//
// The titles/descriptions above stay as the English source and the fallback used
// when a bundle has not loaded yet (translations are fetched, so the first paint
// of a hard navigation has none). Route keys differ from the bundle's path-style
// keys in three places, hence the explicit map rather than a derived name.
const SEO_KEY_OVERRIDES = {
  officialPartners: 'official-partners',
  learningPaths: 'learning-paths',
}

for (const [key, entry] of Object.entries(pageMeta)) {
  entry.seoKey = SEO_KEY_OVERRIDES[key] || key
}

export const buildLearningPathMeta = (toolkit) => ({
  title: `${toolkit.title}: Learning Path`,
  description:
    toolkit.description ||
    `${toolkit.title} learning path on Abakada, a structured set of free open-source tools and tasks.`,
  pathname: `/learning-paths/${toolkit.id}`,
  jsonLd: [
    breadcrumb([
      { name: 'Home', path: '/' },
      { name: 'Learning Paths', path: '/learning-paths' },
      { name: toolkit.title, path: `/learning-paths/${toolkit.id}` },
    ]),
    {
      '@context': 'https://schema.org',
      '@type': 'Course',
      name: toolkit.title,
      description: toolkit.description || '',
      url: `${SITE_ORIGIN}/learning-paths/${toolkit.id}`,
      provider: { ...ORG, '@type': 'EducationalOrganization' },
      inLanguage: ['en', 'tl', 'ilo', 'ceb'],
      isAccessibleForFree: true,
      educationalLevel: toolkit.level || 'Beginner',
    },
  ],
})

export const buildToolMeta = (tool) => {
  const name = tool.name
  const tagline = tool.tagline || ''
  const description =
    tool.description?.slice(0, 158) ||
    `${name}: ${tagline}. Free, open-source ${tool.category || 'productivity'} tool reviewed by Abakada.`
  return {
    title: `${name}: ${tagline || 'Free Open-Source Tool'}`,
    description,
    pathname: `/tools/${tool.id}`,
    jsonLd: [
      breadcrumb([
        { name: 'Home', path: '/' },
        { name: 'Tools', path: '/' },
        { name, path: `/tools/${tool.id}` },
      ]),
      {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name,
        description,
        url: tool.url || `${SITE_ORIGIN}/tools/${tool.id}`,
        applicationCategory: tool.category || 'Utilities',
        operatingSystem: Array.isArray(tool.platforms) ? tool.platforms.join(', ') : tool.platforms || 'Cross-platform',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        license: tool.license || '',
        review: {
          '@type': 'Review',
          author: personFounder,
          datePublished: tool.lastReviewed || new Date().toISOString().slice(0, 10),
        },
        publisher: ORG,
      },
    ],
  }
}
