import { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useI18n } from '../contexts/I18nContext'
import StaticPageLayout from '../components/StaticPageLayout'
import SEO from '../components/SEO'
import Icon from '../components/Icon'
import ToolCard from '../components/ToolCard'
import BrandLoader from '../components/BrandLoader'
import { pageMeta } from '../lib/pageMeta'
import { langPrefix } from '../lib/canonical'
import { k12Strands, findStrand, pathsForStrand } from '../lib/curriculum'

const TEACHER_PATH_ID = 'teacher-digital-classroom'

// Dependable, broadly-useful classroom tools (verified IDs in tools.json).
const CLASSROOM_KIT_IDS = ['libreoffice', 'gimp', 'inkscape', 'audacity', 'vlc', 'obs-studio']

const VALUE_PROPS = [
  { id: 'aligned', icon: 'list-checks', coll: 'ui' },
  { id: 'free', icon: 'award', coll: 'ui' },
  { id: 'safe', icon: 'shield-check', coll: 'category' },
  { id: 'hardware', icon: 'cpu', coll: 'category' },
]

const VALUE_FALLBACK = {
  aligned: ['Curriculum-aligned', 'Mapped to DepEd Senior High School strands, so you can find tools that fit what you already teach.'],
  free: ['Zero cost, zero licenses', 'Every tool is free and open-source — no subscriptions, no license keys, no procurement paperwork.'],
  safe: ['Safe for students', 'No student accounts and no tracking required. Review our privacy approach anytime.'],
  hardware: ['Runs on modest hardware', 'Lightweight tools that work on older PCs and offline — built for schools with limited connectivity.'],
}

const GUIDE_STEPS = [
  ['Start with one tool', 'Pick a single tool that maps to your next lesson — LibreOffice Writer for worksheets, or GIMP for image editing — instead of changing everything at once.'],
  ['Model it first', 'Demonstrate the tool yourself on a projector or shared screen so students see the workflow before they try it.'],
  ['Give a small, real task', 'Have students produce something they would have made anyway — a report, a poster, an audio clip — using the free tool.'],
  ['Point to the official help', 'Each tool page links to the official site and documentation. Encourage students to learn to find answers themselves.'],
]

const PARENT_FAQ = [
  ['Is this software safe for my child?', 'Yes. Every tool is open-source and reviewed before listing, and we link only to official download sites. Open-source code can be publicly inspected, which is one reason schools and governments worldwide trust it.'],
  ['Does my child need to create an account?', 'No. Abakada requires no sign-up, and the tools we highlight for classrooms can be used without creating accounts. Some optional online services may offer a free account to save work.'],
  ['Will these run on our home computer?', 'Almost certainly. We prioritise tools that run on Windows, macOS, and Linux, including older and lower-spec machines, and many work offline.'],
  ['Is Abakada endorsed by DepEd?', 'Abakada is an independent, volunteer-driven project. We align our learning paths to DepEd Senior High School strands for relevance, but we are not an official DepEd program.'],
]

export default function Educators({ toolsData = { tools: [], categories: [] } }) {
  const { t, lang } = useI18n()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const [data, setData] = useState({ toolkits: [] })
  const [curriculum, setCurriculum] = useState({ categories: [], strands: [] })
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    let cancelled = false
    Promise.all([
      fetch('/assets/data/learning-paths.json').then((r) => {
        if (!r.ok) throw new Error(`learning-paths.json: HTTP ${r.status}`)
        return r.json()
      }),
      fetch('/assets/data/curriculum.json').then((r) => (r.ok ? r.json() : { strands: [] })).catch(() => ({ strands: [] })),
    ])
      .then(([lp, cur]) => {
        if (cancelled) return
        setData({ toolkits: lp.toolkits || [] })
        setCurriculum(cur || { strands: [] })
        setLoading(false)
      })
      .catch((err) => {
        if (cancelled) return
        console.error('[educators] failed to load data:', err.message)
        setLoadError(true)
        setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  const strands = useMemo(() => k12Strands(curriculum), [curriculum])

  // Selected strand is URL-driven (?strand=STEM) so a teacher can copy and share
  // the link and have students land on the same view (review R7.3).
  const requested = searchParams.get('strand')
  const activeStrandId = strands.some((s) => s.id === requested) ? requested : strands[0]?.id
  const activeStrand = findStrand(curriculum, activeStrandId)
  const matchingPaths = useMemo(
    () => pathsForStrand(data.toolkits, activeStrandId),
    [data.toolkits, activeStrandId],
  )

  const teacherPath = useMemo(
    () => data.toolkits.find((tk) => tk.id === TEACHER_PATH_ID),
    [data.toolkits],
  )

  const kitTools = useMemo(() => {
    const byId = new Map((toolsData.tools || []).map((tool) => [tool.id, tool]))
    return CLASSROOM_KIT_IDS.map((id) => byId.get(id)).filter(Boolean)
  }, [toolsData.tools])

  function selectStrand(id) {
    setSearchParams({ strand: id }, { replace: true })
  }

  function copyClassroomLink() {
    const url = window.location.href
    const done = () => { setCopied(true); setTimeout(() => setCopied(false), 2000) }
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url).then(done).catch(done)
    } else {
      done()
    }
  }

  const base = langPrefix(lang)
  const difficultyLabel = (d) => t(`learningPaths.${d}`, d ? d[0].toUpperCase() + d.slice(1) : '')

  return (
    <>
      <SEO {...pageMeta.educators} lang={lang} />
      <StaticPageLayout
        breadcrumb={t('pages.educators.breadcrumb', 'For Educators')}
        heroTitle={t('pages.educators.heroTitle', 'Free, Curriculum-Aligned Tools for Filipino Classrooms')}
        heroSubtitle={t('pages.educators.heroSubtitle', 'Equip your students with professional software that costs nothing, needs no licenses, and runs on the computers your school already has.')}
      >
        {/* Value propositions */}
        <section className="content-section edu-values" aria-labelledby="edu-values-title">
          <div className="container">
            <h2 id="edu-values-title" className="edu-section__title">
              {t('pages.educators.valuesTitle', 'Built for the realities of Philippine classrooms')}
            </h2>
            <div className="edu-values__grid">
              {VALUE_PROPS.map((v) => {
                const [titleFb, textFb] = VALUE_FALLBACK[v.id]
                return (
                  <div key={v.id} className="edu-value">
                    <span className="edu-value__icon" aria-hidden="true">
                      <Icon name={v.icon} collection={v.coll} size={22} />
                    </span>
                    <h3 className="edu-value__title">{t(`pages.educators.value.${v.id}.title`, titleFb)}</h3>
                    <p className="edu-value__text">{t(`pages.educators.value.${v.id}.text`, textFb)}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* DepEd strand → learning-path browser */}
        <section className="content-section edu-browser" aria-labelledby="edu-browser-title">
          <div className="container">
            <div className="edu-browser__head">
              <h2 id="edu-browser-title" className="edu-section__title">
                {t('pages.educators.browserTitle', 'Find tools for your strand')}
              </h2>
              <p className="edu-section__subtitle">
                {t('pages.educators.browserSubtitle', 'Choose a DepEd Senior High School strand to see learning paths matched to its curriculum.')}
              </p>
            </div>

            {loadError ? (
              <p className="edu-browser__error" role="alert">
                {t('pages.educators.loadError', 'We couldn’t load curriculum data right now. Please refresh the page.')}
              </p>
            ) : loading ? (
              <BrandLoader variant="block" />
            ) : (
              <>
                <div className="edu-strands" role="group" aria-label={t('pages.educators.strandGroupLabel', 'DepEd Senior High School strands')}>
                  {strands.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      className={`edu-strand${s.id === activeStrandId ? ' edu-strand--active' : ''}`}
                      aria-pressed={s.id === activeStrandId}
                      onClick={() => selectStrand(s.id)}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>

                {activeStrand && (
                  <div className="edu-browser__results" aria-live="polite">
                    <div className="edu-browser__strand-info">
                      <h3 className="edu-browser__strand-name">{activeStrand.fullName || activeStrand.label}</h3>
                      <p className="edu-browser__strand-desc">{activeStrand.description}</p>
                      <button
                        type="button"
                        className="btn btn--secondary btn--sm edu-browser__share"
                        onClick={copyClassroomLink}
                      >
                        <Icon name={copied ? 'check' : 'share-2'} collection={copied ? 'ui' : 'category'} size={14} />
                        {copied ? t('pages.educators.browserShared', 'Link copied!') : t('pages.educators.browserShare', 'Copy classroom link')}
                      </button>
                      <p className="edu-browser__share-hint">
                        {t('pages.educators.browserShareHint', 'Share this link so your students open the same strand.')}
                      </p>
                    </div>

                    {matchingPaths.length > 0 ? (
                      <div className="edu-paths">
                        {matchingPaths.map((tk) => (
                          <Link key={tk.id} to={`${base}/learning-paths/${tk.id}`} className="edu-path-card">
                            <span className="edu-path-card__icon" aria-hidden="true">
                              <Icon name={tk.icon || 'route'} collection="ui" size={20} />
                            </span>
                            <span className="edu-path-card__body">
                              <span className="edu-path-card__title">{tk.title}</span>
                              <span className="edu-path-card__tagline">{tk.tagline}</span>
                            </span>
                            {tk.difficulty && (
                              <span className={`edu-path-card__level edu-path-card__level--${tk.difficulty}`}>
                                {difficultyLabel(tk.difficulty)}
                              </span>
                            )}
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <p className="edu-browser__empty">{t('pages.educators.browserEmpty', 'No learning paths are mapped to this strand yet.')}</p>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* Featured: Teacher's Digital Classroom */}
        {teacherPath && (
          <section className="content-section" aria-labelledby="edu-featured-title">
            <div className="container">
              <div className="edu-featured">
                <div className="edu-featured__content">
                  <span className="edu-featured__label">
                    <Icon name="presentation" collection="ui" size={14} />
                    {t('pages.educators.featuredLabel', 'Featured for teachers')}
                  </span>
                  <h2 id="edu-featured-title" className="edu-featured__title">{teacherPath.title}</h2>
                  <p className="edu-featured__tagline">{teacherPath.tagline}</p>
                  {Array.isArray(teacherPath.outcomes) && teacherPath.outcomes.length > 0 && (
                    <ul className="edu-featured__outcomes">
                      {teacherPath.outcomes.slice(0, 3).map((o, i) => (
                        <li key={i}><Icon name="check" collection="ui" size={14} />{o}</li>
                      ))}
                    </ul>
                  )}
                  <Link to={`${base}/learning-paths/${teacherPath.id}`} className="btn btn--primary">
                    {t('pages.educators.featuredCta', 'Open the Teacher’s Digital Classroom')}
                    <Icon name="arrow-right" collection="ui" size={15} />
                  </Link>
                </div>
                <div className="edu-featured__art" aria-hidden="true">
                  <Icon name={teacherPath.icon || 'presentation'} collection="ui" size={64} />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Classroom starter kit */}
        {kitTools.length > 0 && (
          <section className="content-section" aria-labelledby="edu-kit-title">
            <div className="container">
              <h2 id="edu-kit-title" className="edu-section__title">{t('pages.educators.kitTitle', 'Classroom starter kit')}</h2>
              <p className="edu-section__subtitle">
                {t('pages.educators.kitSubtitle', 'Dependable, free tools that cover most classroom needs — from documents and worksheets to images, audio, and recording lessons.')}
              </p>
              <div className="grid grid--tools edu-kit__grid">
                {kitTools.map((tool) => {
                  const cat = (toolsData.categories || []).find((c) => c.id === tool.category)
                  return (
                    <ToolCard
                      key={tool.id}
                      tool={tool}
                      categoryIcon={cat?.icon}
                      onClick={(tl) => navigate(`${base}/tools/${tl.id}`)}
                    />
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {/* How to introduce FOSS to students */}
        <section className="content-section" aria-labelledby="edu-guide-title">
          <div className="container">
            <h2 id="edu-guide-title" className="edu-section__title">
              {t('pages.educators.guideTitle', 'How to introduce open source to your students')}
            </h2>
            <ol className="edu-guide">
              {GUIDE_STEPS.map(([titleFb, textFb], i) => (
                <li key={i} className="edu-guide__step">
                  <span className="edu-guide__num" aria-hidden="true">{i + 1}</span>
                  <div>
                    <h3 className="edu-guide__step-title">{t(`pages.educators.guide.step${i + 1}.title`, titleFb)}</h3>
                    <p className="edu-guide__step-text">{t(`pages.educators.guide.step${i + 1}.text`, textFb)}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Parent FAQ */}
        <section className="content-section edu-parents" aria-labelledby="edu-parents-title">
          <div className="container">
            <h2 id="edu-parents-title" className="edu-section__title">{t('pages.educators.parentTitle', 'For parents')}</h2>
            <p className="edu-section__subtitle">{t('pages.educators.parentSubtitle', 'Quick answers to the questions families ask most.')}</p>
            <div className="edu-faq">
              {PARENT_FAQ.map(([qFb, aFb], i) => (
                <details key={i} className="edu-faq__item">
                  <summary className="edu-faq__q">
                    <span>{t(`pages.educators.parent.q${i + 1}`, qFb)}</span>
                    <Icon name="chevron-down" collection="ui" size={16} className="edu-faq__chevron" />
                  </summary>
                  <p className="edu-faq__a">{t(`pages.educators.parent.a${i + 1}`, aFb)}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="content-section" aria-labelledby="edu-cta-title">
          <div className="container">
            <div className="edu-cta">
              <h2 id="edu-cta-title" className="edu-cta__title">{t('pages.educators.ctaTitle', 'Bring Abakada to your school')}</h2>
              <p className="edu-cta__text">
                {t('pages.educators.ctaText', 'We work with schools, ALS centers, and LGUs to run digital-literacy sessions and curate tools for your context.')}
              </p>
              <div className="edu-cta__actions">
                <Link to={`${base}/partnerships`} className="btn btn--primary">
                  <Icon name="users" collection="ui" size={15} />
                  {t('pages.educators.ctaPartner', 'Explore partnerships')}
                </Link>
                <Link to={`${base}/contact`} className="btn btn--secondary">
                  <Icon name="message-circle" collection="category" size={15} />
                  {t('pages.educators.ctaContact', 'Contact our team')}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </StaticPageLayout>
    </>
  )
}
