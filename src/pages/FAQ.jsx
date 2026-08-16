import { Link } from 'react-router-dom'
import { useI18n } from '../contexts/I18nContext'
import StaticPageLayout from '../components/StaticPageLayout'
import SEO from '../components/SEO'
import Icon from '../components/Icon'
import { pageMeta } from '../lib/pageMeta'
import { catalogToolCount } from '../lib/catalog'
import { fillTemplate } from '../lib/template'

const FAQ_ITEMS = [
  { q: 'What is Abakada?', a: 'Abakada is a free, curated directory of {count} open-source productivity tools designed specifically for Filipino students, scholars, educators, and professionals. We help bridge the digital divide by providing access to powerful software alternatives that cost nothing.' },
  { q: 'Are all the tools really free?', a: 'Yes. Every tool listed on Abakada is free and open-source. We do not list paid software, freemium-only products, or trialware. If a tool ever changes its license to something proprietary or paid-only, we remove it.' },
  { q: 'What does "open source" mean?', a: 'Open-source software has its source code publicly available for anyone to view, modify, and redistribute under a recognized license (e.g., MIT, GPL, Apache, AGPL). This guarantees transparency, security through community review, and freedom from vendor lock-in.' },
  { q: 'How do you select tools for the directory?', a: 'Each tool is reviewed against five criteria: (1) relevance to Filipino learners, (2) project maturity and active maintenance, (3) security posture and license clarity, (4) documentation quality and accessibility, and (5) community adoption. Paid tools, abandoned projects, and AI-generated submissions without human review are rejected.' },
  { q: 'Can I use these tools offline?', a: 'Many tools work fully offline after installation. We indicate platform compatibility (Windows, macOS, Linux, Web, Android, iOS) for every tool so you can find options that match your hardware and connectivity. Abakada itself is a Progressive Web App and works offline once installed.' },
  { q: 'Which licenses do you accept?', a: 'We accept widely recognized OSI-approved licenses (MIT, Apache 2.0, BSD, GPL, LGPL, AGPL, MPL) and Creative Commons licenses for content (CC BY, CC BY-SA). We do not list "source-available" tools that restrict commercial use or "fair source" tools with non-commercial clauses.' },
  { q: 'What languages does Abakada support?', a: 'Abakada is fully translated into English (en), Filipino/Tagalog (tl), Ilokano (ilo), and Bisaya/Cebuano (bis). Tool listings, navigation, and learning paths are all localized. We welcome contributions for additional Philippine languages.' },
  { q: 'Is Abakada accessible?', a: 'Abakada follows WCAG 2.1 AA guidelines: keyboard navigation, semantic landmarks, ARIA labels, sufficient color contrast in both light and dark themes, and screen-reader-friendly markup. Report accessibility issues to hello@abakada.org.' },
  { q: 'How does Abakada handle AI training crawlers?', a: 'Abakada blocks AI training crawlers (GPTBot, anthropic-ai, CCBot, Google-Extended, Applebot-Extended, PerplexityBot, Bytespider, and others) via robots.txt. We allow real-time search retrievers (Googlebot, Bingbot, DuckDuckBot, Applebot) so users can still discover us via search and AI overviews. Our content is licensed for human readers and downstream open-source integrations, not for opaque LLM training datasets.' },
  { q: 'Does Abakada use AI to write content?', a: 'No. All tool reviews, descriptions, and learning-path content are written and verified by human contributors. AI-generated submissions without explicit human review and disclosure are rejected per our contributing guidelines.' },
  { q: 'How can I contribute?', a: 'Open an issue or pull request on the Abakada GitHub repository (github.com/ramonloganjr/abakada-main). You can suggest new tools, fix outdated information, improve translations, write learning-path content, or contribute code. We also welcome contributions for accessibility, documentation, and design.' },
  { q: 'Is Abakada affiliated with any government agency?', a: 'No. Abakada is an independent, volunteer-driven project. We are not affiliated with any government agency, educational institution, or commercial entity. We accept no paid placements and do not run advertising.' },
  { q: 'How is Abakada funded?', a: 'Abakada is currently self-funded by founder Ramon Logan Jr. and runs on volunteer time. We accept in-kind partnerships (hosting credits, FOSS project sponsorships, educational partnerships) but do not accept paid editorial placement.' },
  { q: 'Does Abakada use cookies or track me?', a: 'We use Google Analytics 4 with anonymized IP addresses to understand aggregate usage patterns. No personal data is stored on our servers. We do not run advertising trackers, third-party pixels, or cross-site tracking. See our Privacy Policy for full details.' },
  { q: 'How can my school or organization partner with Abakada?', a: 'We partner with schools, NGOs, and FOSS projects in four tiers: Technology, Educational, Content, and Community partners. Email partnerships@abakada.org or visit our Partnerships page to start a conversation.' },
  { q: 'How often is the tool directory updated?', a: 'Tool data is reviewed quarterly at minimum, with high-traffic categories reviewed more frequently. The "Last reviewed" date on each tool page reflects the most recent verification. Report broken or outdated entries via the Contact page.' },
  { q: 'Can I request takedown of a tool listing?', a: 'Maintainers of listed tools can request takedown by emailing hello@abakada.org with proof of ownership. Removal happens within 7 days. Trademark, defamation, or copyright concerns are addressed under the same process.' },
  { q: 'Where can I see comparisons between tools?', a: 'Use the Compare feature (/compare) to view side-by-side comparisons of any 2-4 tools: features, supported platforms, license type, and editorial notes. Comparisons are particularly useful for choosing between similar tools (e.g., LibreOffice vs. ONLYOFFICE).' },
]

const QuestionIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="10"/>
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
)

export default function FAQ() {
  const { t, lang } = useI18n()

  // FAQ_ITEMS stays the English source of truth and doubles as the per-item
  // fallback, so the page still renders if a bundle fails to load. The catalog
  // size is interpolated rather than baked in, so the sentence tracks the data
  // in all four languages instead of being retyped whenever a tool is added.
  const items = FAQ_ITEMS.map((item, i) => ({
    q: t(`pages.faq.items.q${i + 1}`, item.q),
    a: fillTemplate(t(`pages.faq.items.a${i + 1}`, item.a), { count: catalogToolCount() }),
  }))

  // Structured data follows the active language so search engines index the
  // localized answers rather than always seeing English.
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: lang === 'bis' ? 'ceb' : lang,
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }
  const meta = pageMeta.faq
  return (
    <>
    <SEO {...meta} jsonLd={[meta.jsonLd, faqJsonLd]} lang={lang} />
    <StaticPageLayout
      breadcrumb={t('breadcrumb.faq', 'FAQ')}
      heroTitle={t('pages.faq.heroTitle', 'Frequently Asked Questions')}
      heroSubtitle={t('pages.faq.heroSubtitle', 'Everything you need to know about Abakada and how to make the most of our open-source tools directory.')}
    >
      <section className="content-section">
        <div className="container">
          {/* Contextual pointer to the full documentation center */}
          <div className="guide-callout">
            <p className="guide-callout__text">
              {t('pages.faq.guideCallout', 'New to Abakada? The Platform Guide explains everything step by step, from your first visit to offline classrooms.')}
            </p>
            <Link to="/guide" className="guide-callout__cta">
              <Icon name="book-open-text" collection="category" size={16} />
              {t('common.readGuide', 'Read the Platform Guide')}
            </Link>
          </div>
          <div className="faq-grid">
            {items.map((item, i) => (
              <div key={i} className="faq-item">
                <h3 className="faq-item__question"><QuestionIcon />{item.q}</h3>
                <p className="faq-item__answer">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="content-section content-section--highlight">
        <div className="container">
          <div className="developer-block">
            <div className="developer-block__header">
              <div className="developer-block__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
              </div>
              <div>
                <span className="developer-block__label">Meet the Developer</span>
                <h2 className="developer-block__name"><a href="https://ramonloganjr.com" target="_blank" rel="noopener">Ramon Logan Jr.</a></h2>
              </div>
            </div>
            <div className="developer-block__content">
              <p><a href="https://ramonloganjr.com" target="_blank" rel="noopener">Ramon Logan Jr.</a> is the developer behind Abakada and <a href="https://bettersolano.org" target="_blank" rel="noopener">BetterSolano.org</a>. He also built <a href="https://hivcareph.org/" target="_blank" rel="noopener">HIV Care Philippines</a>, a community-built digital resource designed to help people locate Department of Health (DOH)-designated HIV treatment hubs and primary care clinics across the Philippines. Based in the United Arab Emirates, he works in IT and practices full-stack development.</p>
              <p>He also started <a href="https://hellopinas.com" target="_blank" rel="noopener">HelloPinas.com</a>, a digital solutions agency, and contributes to <a href="https://bettergov.ph" target="_blank" rel="noopener">BetterGov.ph</a>, a volunteer-driven civic-tech effort focused on improving access to local government information in the Philippines.</p>
              <p>Abakada is also dedicated to his family, Alison, Nana, and their baby.</p>
              <div className="developer-block__highlight">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>
                <p>Ramon has made Abakada open source under <strong>MIT | CC BY 4.0</strong> to empower community-driven development. Contributions are warmly welcomed from everyone.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="content-section content-section--cta">
        <div className="container">
          <div className="cta-block">
            <h2 className="cta-block__title">{t('cta.title', 'Ready to Explore?')}</h2>
            <p className="cta-block__text">{t('cta.text', 'Discover hundreds of free and open-source productivity tools.')}</p>
            <div className="cta-block__actions">
              <Link to="/" className="btn btn--primary">{t('cta.browseTools', 'Browse All Tools')}</Link>
              <Link to="/contact" className="btn btn--secondary">{t('cta.getInTouch', 'Get in Touch')}</Link>
            </div>
          </div>
        </div>
      </section>
    </StaticPageLayout>
    </>
  )
}
