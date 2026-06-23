import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useI18n } from '../contexts/I18nContext'
import StaticPageLayout from '../components/StaticPageLayout'
import SEO from '../components/SEO'
import Icon from '../components/Icon'
import { buildToolMeta } from '../lib/pageMeta'
import { isSafeUrl } from '../lib/url'
import { getInstallBuckets, formatPlatformList } from '../lib/install'

const TODAY = new Date().toISOString().slice(0, 10)

// English fallback copy for each install bucket. `t()` overrides these per language;
// {name} and {platforms} are interpolated at render time. Steps are newline-split.
const INSTALL_TITLES = {
  web: 'In your web browser',
  desktop: 'On your computer ({platforms})',
  mobile: 'On your phone or tablet ({platforms})',
  runtime: 'Via a package manager ({platforms})',
  server: 'On your own server ({platforms})',
  generic: 'Get {name}',
}

const INSTALL_STEPS = {
  web: 'No installation needed. {name} runs right in your browser.\nUse the “Visit official site” button above to open it.\nSome web apps offer a free account so you can save your work.',
  desktop: 'Click “Visit official site” above to open the official {name} website.\nDownload the version for your system ({platforms}).\nOpen the downloaded file and follow the on-screen steps.\nLaunch {name} from your apps. You’re ready to go.',
  mobile: 'Open your device’s app store, or the official {name} site.\nSearch for “{name}” and tap Install.\nOpen the app and follow the quick setup.',
  runtime: '{name} installs through a package manager for {platforms}.\nFollow the official documentation for the exact install command.\nRun {name} from your terminal to confirm it works.',
  server: '{name} is self-hosted. You run it on a server you control ({platforms}).\nFollow the official deployment guide for your environment.\nSee the documentation for configuration, security, and updates.',
  generic: 'Click “Visit official site” above to open the {name} website.\nFollow the installation instructions there for your platform.',
}

function fillTemplate(str, vars) {
  return str.replace(/\{(\w+)\}/g, (_, key) => (vars[key] != null ? vars[key] : `{${key}}`))
}

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

export default function ToolDetail({ toolsData = { tools: [], categories: [] }, hasToolsData = false }) {
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
    // If tools data never loaded successfully, the tool may still exist —
    // show a recoverable error instead of a permanent "not found" page.
    if (!hasToolsData) {
      return (
        <StaticPageLayout breadcrumb={t('common.error', 'Error')} heroTitle="">
          <section className="content-section">
            <div className="container">
              <p>Could not load tool data. Check your connection and try again.</p>
              <button type="button" className="btn btn--primary" onClick={() => window.location.reload()}>
                Retry
              </button>
            </div>
          </section>
        </StaticPageLayout>
      )
    }

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
  const installBuckets = getInstallBuckets(tool)

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
                {tool.alternatives_to?.length > 0 && (
                  <p className="tool-detail__alternative">
                    <Icon name="refresh" collection="ui" size={15} />
                    {t('tools.freeAlternativeTo', 'A free, open-source alternative to')}{' '}
                    <strong>{tool.alternatives_to.join(', ')}</strong>
                  </p>
                )}
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

              <div className="tool-detail__actions">
                {isSafeUrl(tool.website) && (
                  <a className="btn btn--primary" href={tool.website} target="_blank" rel="noopener noreferrer">
                    {t('tools.visitSite', 'Visit official site')}
                    <Icon name="external-link" collection="ui" size={15} />
                  </a>
                )}
                {isSafeUrl(tool.web_try_url) && (
                  <a className="btn btn--try-browser" href={tool.web_try_url} target="_blank" rel="noopener noreferrer">
                    <Icon name="play-circle" collection="ui" size={15} />
                    {t('tools.tryInBrowser', 'Try in browser, no install')}
                  </a>
                )}
                {isSafeUrl(tool.repo_url) && (
                  <a className="btn btn--secondary" href={tool.repo_url} target="_blank" rel="noopener noreferrer">
                    <Icon name="github" collection="ui" size={15} />
                    {t('tools.viewSource', 'View source')}
                  </a>
                )}
              </div>

              {/* How to install — generated, platform-aware guidance (review R11.1).
                  Native <details> for an accessible, zero-JS disclosure. */}
              <details className="install-guide">
                <summary className="install-guide__summary">
                  <Icon name="download" collection="ui" size={16} />
                  <span>{fillTemplate(t('install.title', 'How to install {name}'), { name: tool.name })}</span>
                  <Icon name="chevron-down" collection="ui" size={16} className="install-guide__chevron" />
                </summary>
                <div className="install-guide__body">
                  {installBuckets.map((bucket) => {
                    const vars = { name: tool.name, platforms: formatPlatformList(bucket.platforms) }
                    const title = fillTemplate(t(`install.${bucket.id}.title`, INSTALL_TITLES[bucket.id]), vars)
                    const steps = fillTemplate(t(`install.${bucket.id}.steps`, INSTALL_STEPS[bucket.id]), vars).split('\n')
                    return (
                      <div key={bucket.id} className="install-guide__group">
                        <h3 className="install-guide__group-title">{title}</h3>
                        <ol className="install-guide__steps">
                          {steps.map((s, i) => <li key={i}>{s}</li>)}
                        </ol>
                      </div>
                    )
                  })}
                  <p className="install-guide__note">
                    {t('install.safetyNote', 'Always download from the official site linked above. Abakada only lists free, open-source software.')}
                  </p>
                </div>
              </details>

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
                        <Link to={`/tools/${r.id}`}><strong>{r.name}</strong>: {r.tagline}</Link>
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
