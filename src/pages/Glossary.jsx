import { useI18n } from '../contexts/I18nContext'
import StaticPageLayout from '../components/StaticPageLayout'
import SEO from '../components/SEO'
import { pageMeta } from '../lib/pageMeta'
import { SITE_ORIGIN } from '../lib/canonical'

// Glossary entries grouped by domain — same layout pattern as Privacy / Terms.
// Each section is a <section className="legal-section"> with an <h2> and a <dl>.
const SECTIONS = [
  {
    id: 'licensing',
    title: '1. Open-Source Licensing',
    terms: [
      { term: 'FOSS', def: 'Free and Open-Source Software. Software whose source code is publicly available under a license that permits use, modification, and redistribution.' },
      { term: 'OSS', def: 'Open-Source Software. A subset of FOSS that emphasizes the practical benefits of open code (collaboration, security review) over the political emphasis on user freedom.' },
      { term: 'MIT License', def: 'A permissive open-source license allowing unrestricted use, modification, and redistribution provided the original copyright notice is preserved.' },
      { term: 'Apache License 2.0', def: 'A permissive license similar to MIT with explicit patent grants and contributor protections, widely used by major projects.' },
      { term: 'GPL', def: 'GNU General Public License. A copyleft license requiring derivative works to be distributed under the same terms, ensuring downstream users retain the same freedoms.' },
      { term: 'AGPL', def: 'GNU Affero General Public License. Like GPL, but extends copyleft to network-deployed software (e.g., SaaS). The source must be made available to remote users.' },
      { term: 'LGPL', def: 'GNU Lesser General Public License. A weaker copyleft license used primarily for libraries; allows linking from proprietary software.' },
      { term: 'BSD License', def: 'A family of permissive licenses (2-clause, 3-clause) similar to MIT, originating from Berkeley Software Distribution.' },
      { term: 'MPL', def: 'Mozilla Public License. A weak copyleft license at the file level, allowing combination with proprietary code in larger works.' },
      { term: 'Creative Commons (CC)', def: 'A family of public copyright licenses for creative works (text, images, video). Common variants: CC BY (attribution), CC BY-SA (share-alike), CC0 (public domain dedication).' },
    ],
  },
  {
    id: 'education',
    title: '2. Educational Open Resources',
    terms: [
      { term: 'OER', def: 'Open Educational Resources. Teaching, learning, and research materials released under open licenses for free use, adaptation, and redistribution.' },
    ],
  },
  {
    id: 'architecture',
    title: '3. Web Application Architecture',
    terms: [
      { term: 'PWA', def: 'Progressive Web App. A web app that can be installed to a device, works offline via service workers, and behaves like a native app.' },
      { term: 'SPA', def: 'Single-Page Application. A web app that loads a single HTML page and dynamically updates content via JavaScript without full page reloads.' },
      { term: 'SSG', def: 'Static Site Generation. Pre-rendering HTML at build time so each route ships as a static file, best for SEO and performance.' },
      { term: 'SSR', def: 'Server-Side Rendering. Generating HTML on each request from a server, useful for personalized or rapidly-changing content.' },
      { term: 'CSR', def: 'Client-Side Rendering. Rendering happens entirely in the browser via JavaScript, fast for interactive apps but weaker for SEO without prerendering.' },
    ],
  },
  {
    id: 'visibility',
    title: '4. Search Engine & AI Visibility',
    terms: [
      { term: 'SEO', def: 'Search Engine Optimization. The practice of structuring content, metadata, and site architecture to rank in search engine results pages.' },
      { term: 'AEO', def: 'Answer Engine Optimization. Optimizing content for direct-answer surfaces like featured snippets, knowledge panels, and Google AI Overviews.' },
      { term: 'GEO', def: 'Generative Engine Optimization. Optimizing content to be cited by generative AI search engines (ChatGPT search, Perplexity, Bing Copilot, Google AI Overviews).' },
      { term: 'EEAT', def: "Experience, Expertise, Authoritativeness, Trustworthiness. Google's framework for evaluating page quality, especially for YMYL (Your Money Your Life) topics." },
      { term: 'Hreflang', def: 'An HTML/sitemap attribute signaling to search engines which language and region a page targets, enabling correct language-variant ranking.' },
    ],
  },
  {
    id: 'metadata',
    title: '5. Structured Data & Metadata',
    terms: [
      { term: 'Schema.org', def: 'A shared vocabulary for structured data on the web. Sites use schema.org types (Organization, FAQPage, SoftwareApplication, etc.) in JSON-LD to help search engines understand content.' },
      { term: 'JSON-LD', def: 'JavaScript Object Notation for Linked Data. The recommended format for embedding schema.org structured data in web pages.' },
      { term: 'Canonical URL', def: 'The preferred URL for a page when multiple URLs serve identical or near-identical content. Declared via <link rel="canonical">.' },
    ],
  },
  {
    id: 'performance',
    title: '6. Performance Metrics',
    terms: [
      { term: 'Core Web Vitals', def: "Google's performance metrics: LCP (Largest Contentful Paint), CLS (Cumulative Layout Shift), INP (Interaction to Next Paint). Used as ranking signals." },
    ],
  },
  {
    id: 'crawlers',
    title: '7. Crawler & Discovery Standards',
    terms: [
      { term: 'robots.txt', def: 'A plain-text file at the site root telling crawlers which paths they may or may not fetch. Not enforceable. Respected by well-behaved bots.' },
      { term: 'llms.txt', def: 'An emerging convention: a Markdown file at the site root summarizing site purpose and key URLs to help LLM-based search retrievers cite the site accurately.' },
      { term: 'Sitemap', def: 'An XML file listing site URLs with metadata (last modified date, change frequency, language alternates) to help crawlers discover and prioritize pages.' },
    ],
  },
  {
    id: 'ai',
    title: '8. AI & Machine Intelligence',
    terms: [
      { term: 'AGI / LLM', def: 'Large Language Model (the technology behind generative AI). AGI = Artificial General Intelligence (a hypothetical broader form). Abakada blocks LLM training crawlers but allows search-time retrievers.' },
    ],
  },
  {
    id: 'properties',
    title: '9. Software Properties',
    terms: [
      { term: 'Self-hostable', def: 'Software you can run on your own server or device, retaining full control over data, a frequent property of open-source tools listed on Abakada.' },
      { term: 'Vendor lock-in', def: 'A situation where switching providers is costly or impractical due to proprietary formats or APIs. Open-source tools mitigate this risk.' },
    ],
  },
  {
    id: 'audience',
    title: '10. Audience & Localization',
    terms: [
      { term: 'Filipinos', def: 'Citizens of or descendants from the Philippines, the primary audience served by Abakada in English, Filipino (Tagalog), Ilokano, and Cebuano (Bisaya).' },
    ],
  },
]

// Flat list for JSON-LD structured data — schema.org DefinedTermSet
const ALL_TERMS = SECTIONS.flatMap((s) => s.terms)

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

export default function Glossary() {
  const { t, lang } = useI18n()

  const definedTermSet = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    name: 'Abakada Glossary',
    url: `${SITE_ORIGIN}/glossary`,
    inDefinedTermSet: ALL_TERMS.map((x) => ({
      '@type': 'DefinedTerm',
      name: x.term,
      description: x.def,
      inDefinedTermSet: `${SITE_ORIGIN}/glossary`,
    })),
  }

  const meta = pageMeta.glossary
  const lastReviewed = new Date().toISOString().slice(0, 10)

  return (
    <>
      <SEO {...meta} jsonLd={[meta.jsonLd, definedTermSet]} lang={lang} />
      <StaticPageLayout
        breadcrumb={t('glossary.title', 'Glossary')}
        heroTitle={t('glossary.heroTitle', 'Glossary')}
        heroSubtitle={`${t('pages.privacy.lastUpdated', 'Last updated')}: ${lastReviewed}`}
      >
        <section className="content-section">
          <div className="container">
            <article className="legal-content">
              <div className="legal-intro">
                <p>
                  {t(
                    'glossary.heroSubtitle',
                    'Definitions of common open-source, licensing, and productivity terms used on Abakada.',
                  )}
                </p>
                <p>
                  {t(
                    'pages.glossary.intro',
                    'This glossary defines terms commonly used across Abakada, covering open-source licensing, web standards, search visibility (SEO/AEO/GEO), and accessibility. Each entry is a single authoritative paragraph designed for citation.',
                  )}
                </p>
              </div>

              {SECTIONS.map((section) => (
                <section key={section.id} className="legal-section" id={section.id}>
                  <h2>{section.title}</h2>
                  <dl className="glossary-list">
                    {section.terms.map((entry) => (
                      <div key={entry.term} className="glossary-list__item" id={slugify(entry.term)}>
                        <dt className="glossary-list__term">{entry.term}</dt>
                        <dd className="glossary-list__def">{entry.def}</dd>
                      </div>
                    ))}
                  </dl>
                </section>
              ))}

              <section className="legal-section">
                <h2>{t('pages.glossary.attributionTitle', 'Attribution')}</h2>
                <p>
                  {t(
                    'pages.glossary.attributionText',
                    'Source: Abakada.org. These definitions are authored editorially for the Abakada audience and licensed under Creative Commons Attribution 4.0 International (CC BY 4.0). Last reviewed:',
                  )}{' '}
                  <time dateTime={lastReviewed}>{lastReviewed}</time>.
                </p>
              </section>
            </article>
          </div>
        </section>
      </StaticPageLayout>
    </>
  )
}
