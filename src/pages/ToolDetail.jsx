import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useI18n } from '../contexts/I18nContext'
import StaticPageLayout from '../components/StaticPageLayout'
import SEO from '../components/SEO'
import { buildToolMeta } from '../lib/pageMeta'

const TODAY = new Date().toISOString().slice(0, 10)

function buildFAQ(tool) {
  const name = tool.name
  const license = tool.license || 'an open-source license'
  const platforms = (tool.platforms || []).join(', ') || 'multiple platforms'
  return [
    {
      q: `What is ${name}?`,
      a: tool.description || `${name} is a free, open-source tool listed in the Abakada directory.`,
    },
    {
      q: `Is ${name} free?`,
      a: `Yes. ${name} is free and open-source, distributed under ${license}. Abakada only lists tools that are free in both cost and license.`,
    },
    {
      q: `Which platforms does ${name} support?`,
      a: `${name} runs on ${platforms}. See the official site for installation instructions per platform.`,
    },
    {
      q: `Where can I download ${name}?`,
      a: `Visit the official ${name} project site at ${tool.website || 'the link in this page'} for downloads and documentation.`,
    },
  ]
}

export default function ToolDetail({ toolsData = { tools: [], categories: [] } }) {
  const { toolId } = useParams()
  const { t, lang } = useI18n()

  const tool = useMemo(
    () => toolsData.tools.find((x) => x.id === toolId),
    [toolsData.tools, toolId],
  )

  const related = useMemo(() => {
    if (!tool) return []
    return toolsData.tools
      .filter((x) => x.id !== tool.id && x.category === tool.category)
      .slice(0, 6)
  }, [toolsData.tools, tool])

  if (!tool) {
    return (
      <StaticPageLayout breadcrumb={t('tools.notFound', 'Tool not found')} heroTitle={t('tools.notFound', 'Tool not found')}>
        <section className="content-section">
          <div className="container">
            <p>{t('tools.notFoundDesc', 'We could not find that tool. It may have been removed or renamed.')}</p>
            <Link to="/" className="btn btn--primary">{t('cta.browseTools', 'Browse all tools')}</Link>
          </div>
        </section>
      </StaticPageLayout>
    )
  }

  const meta = buildToolMeta(tool)
  const faq = buildFAQ(tool)
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
  const lastReviewed = tool.lastReviewed || TODAY

  return (
    <>
      <SEO {...meta} jsonLd={[...(Array.isArray(meta.jsonLd) ? meta.jsonLd : [meta.jsonLd]), faqLd]} lang={lang} />
      <StaticPageLayout breadcrumb={tool.name} heroTitle={tool.name} heroSubtitle={tool.tagline || ''}>
        <section className="content-section">
          <div className="container">
            <article className="tool-detail">
              <header className="tool-detail__header">
                <p className="tool-detail__definition">
                  <strong>{tool.name}</strong> is a free, open-source {tool.category || 'productivity'} tool
                  {tool.license ? ` distributed under ${tool.license}` : ''}. {tool.description || ''}
                </p>
                <p className="tool-detail__byline">
                  <time dateTime={lastReviewed}>Last reviewed {lastReviewed}</time>
                  {' · Reviewed by Ramon Logan Jr. for Abakada.'}
                </p>
              </header>

              <dl className="tool-detail__meta">
                {tool.license ? (<><dt>{t('tools.license', 'License')}</dt><dd>{tool.license}</dd></>) : null}
                {tool.platforms?.length ? (<><dt>{t('tools.platforms', 'Platforms')}</dt><dd>{tool.platforms.join(', ')}</dd></>) : null}
                {tool.category ? (<><dt>{t('tools.category', 'Category')}</dt><dd>{tool.category}</dd></>) : null}
                {tool.tags?.length ? (<><dt>{t('tools.tags', 'Tags')}</dt><dd>{tool.tags.join(', ')}</dd></>) : null}
              </dl>

              {tool.website ? (
                <p className="tool-detail__cta">
                  <a className="btn btn--primary" href={tool.website} target="_blank" rel="noopener noreferrer">
                    {t('tools.visitSite', 'Visit official site')} →
                  </a>
                </p>
              ) : null}

              <section className="tool-detail__faq">
                <h2>{t('tools.faqTitle', 'Frequently asked questions')}</h2>
                {faq.map((item, i) => (
                  <div key={i} className="faq-item">
                    <h3 className="faq-item__question">{item.q}</h3>
                    <p className="faq-item__answer">{item.a}</p>
                  </div>
                ))}
              </section>

              {related.length ? (
                <section className="tool-detail__related">
                  <h2>{t('tools.relatedTitle', 'Related tools')}</h2>
                  <ul className="tool-detail__related-list">
                    {related.map((r) => (
                      <li key={r.id}>
                        <Link to={`/tools/${r.id}`}><strong>{r.name}</strong> — {r.tagline}</Link>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              <p className="tool-detail__source">
                Source: Abakada.org · Last reviewed <time dateTime={lastReviewed}>{lastReviewed}</time>
              </p>
            </article>
          </div>
        </section>
      </StaticPageLayout>
    </>
  )
}
