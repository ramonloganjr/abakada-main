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
import { STUDENT_GOALS, toolsForGoal } from '../lib/studentGoals'

const START_HERE_PATH = 'digital-foundations'

// Free-vs-paid swaps students immediately recognise. Free tool linked to its page.
const SWAP_PAIRS = [
  ['Microsoft Office', 'LibreOffice', 'libreoffice'],
  ['Adobe Photoshop', 'GIMP', 'gimp'],
  ['Adobe Illustrator', 'Inkscape', 'inkscape'],
  ['Adobe Premiere', 'Kdenlive', 'kdenlive'],
  ['Evernote', 'Joplin', 'joplin'],
]

const TRUST = [
  ['free', '100% free'],
  ['noAccount', 'No account needed'],
  ['offline', 'Works offline'],
]

const TIPS = [
  ['Keep notes in one place', 'Pick one notes app (like Joplin or Obsidian) and put everything there, so you can always find it later.'],
  ['Back up your work', 'Save important files to a free cloud like Nextcloud, or keep a copy on a USB drive, so you never lose a deadline.'],
  ['Learn a few shortcuts', 'A handful of keyboard shortcuts (copy, paste, undo, save) will save you hours over a school year.'],
  ['Work offline when data is low', 'Most tools here run without internet. Download once and keep working even when you’re out of data.'],
]

const FAQ = [
  ['Do I have to pay for anything?', 'No. Every tool here is free and open-source. There are no trials that expire and no hidden fees.'],
  ['Do I need to make an account?', 'No account is needed to use Abakada, and most tools work without signing up. Some optional cloud features may offer a free account.'],
  ['Will these work on my phone?', 'Many do, and some are phone-first. Each tool page lists the platforms it supports. Look for Android or iOS.'],
  ['Can I use these for schoolwork?', 'Yes. These tools create standard files (documents, images, video) you can submit anywhere, perfect for reports, projects, and presentations.'],
]

export default function Students({ toolsData = { tools: [], categories: [] } }) {
  const { t, lang } = useI18n()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const [toolkits, setToolkits] = useState([])
  const [pathsLoading, setPathsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetch('/assets/data/learning-paths.json')
      .then((r) => (r.ok ? r.json() : { toolkits: [] }))
      .then((lp) => { if (!cancelled) { setToolkits(lp.toolkits || []); setPathsLoading(false) } })
      .catch(() => { if (!cancelled) setPathsLoading(false) })
    return () => { cancelled = true }
  }, [])

  const base = langPrefix(lang)

  // Goal browser is URL-driven (?do=write) so a goal view is shareable.
  const requested = searchParams.get('do')
  const activeGoalId = STUDENT_GOALS.some((g) => g.id === requested) ? requested : STUDENT_GOALS[0].id
  const goalTools = useMemo(() => toolsForGoal(toolsData.tools, activeGoalId), [toolsData.tools, activeGoalId])

  const studentPaths = useMemo(() => {
    const matched = toolkits.filter((tk) => Array.isArray(tk.audiences) && tk.audiences.includes('student'))
    // Surface the absolute-beginner path first.
    return matched.sort((a, b) => (a.id === START_HERE_PATH ? -1 : b.id === START_HERE_PATH ? 1 : 0))
  }, [toolkits])

  const swaps = useMemo(() => {
    const ids = new Set((toolsData.tools || []).map((tl) => tl.id))
    return SWAP_PAIRS.filter(([, , id]) => ids.has(id))
  }, [toolsData.tools])

  function selectGoal(id) {
    setSearchParams({ do: id }, { replace: true })
  }

  function scrollToGoals() {
    const el = document.getElementById('stu-goals')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <SEO {...pageMeta.students} lang={lang} />
      <StaticPageLayout
        breadcrumb={t('pages.students.breadcrumb', 'For Students')}
        heroTitle={t('pages.students.heroTitle', 'Free Tools for Every Filipino Student')}
        heroSubtitle={t('pages.students.heroSubtitle', 'Everything you need for school (writing, presentations, photos, video, coding, and study) without paying for a single app.')}
      >
        {/* Hero actions + trust */}
        <section className="content-section stu-intro">
          <div className="container">
            <div className="stu-actions">
              <Link to={`${base}/learning-paths/${START_HERE_PATH}`} className="btn btn--primary">
                <Icon name="sprout" collection="ui" size={16} />
                {t('pages.students.ctaBasics', 'Start with the basics')}
              </Link>
              <button type="button" className="btn btn--secondary" onClick={scrollToGoals}>
                <Icon name="search" collection="ui" size={16} />
                {t('pages.students.ctaByTask', 'Find tools by task')}
              </button>
            </div>
            <ul className="stu-trust" aria-label={t('pages.students.trustLabel', 'Why students use Abakada')}>
              {TRUST.map(([id, fb]) => (
                <li key={id} className="stu-trust__item">
                  <Icon name="check" collection="ui" size={15} />
                  {t(`pages.students.trust.${id}`, fb)}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Goal browser */}
        <section className="content-section" id="stu-goals" aria-labelledby="stu-goals-title">
          <div className="container">
            <h2 id="stu-goals-title" className="edu-section__title">{t('pages.students.goalsTitle', 'What do you want to do?')}</h2>
            <p className="edu-section__subtitle">{t('pages.students.goalsSubtitle', 'Pick a task and we’ll show free tools that do the job.')}</p>

            <div className="edu-strands" role="group" aria-label={t('pages.students.goalsTitle', 'What do you want to do?')}>
              {STUDENT_GOALS.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  className={`edu-strand stu-goal${g.id === activeGoalId ? ' edu-strand--active' : ''}`}
                  aria-pressed={g.id === activeGoalId}
                  onClick={() => selectGoal(g.id)}
                >
                  <Icon name={g.icon} collection={g.coll} size={15} />
                  {t(`pages.students.goals.${g.id}`, g.id)}
                </button>
              ))}
            </div>

            <div className="grid grid--tools stu-goal__grid" aria-live="polite">
              {goalTools.map((tool) => {
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

        {/* Learning paths for students */}
        <section className="content-section" aria-labelledby="stu-paths-title">
          <div className="container">
            <h2 id="stu-paths-title" className="edu-section__title">{t('pages.students.pathsTitle', 'Learning paths made for students')}</h2>
            <p className="edu-section__subtitle">{t('pages.students.pathsSubtitle', 'Step-by-step toolkits that take you from zero to confident.')}</p>
            {pathsLoading ? (
              <BrandLoader variant="block" />
            ) : (
              <div className="edu-paths stu-paths">
                {studentPaths.map((tk) => (
                  <Link key={tk.id} to={`${base}/learning-paths/${tk.id}`} className="edu-path-card">
                    <span className="edu-path-card__icon" aria-hidden="true">
                      <Icon name={tk.icon || 'route'} collection="ui" size={20} />
                    </span>
                    <span className="edu-path-card__body">
                      <span className="edu-path-card__title">
                        {tk.title}
                        {tk.id === START_HERE_PATH && (
                          <span className="stu-badge">{t('pages.students.startHere', 'Start here')}</span>
                        )}
                      </span>
                      <span className="edu-path-card__tagline">{tk.tagline}</span>
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Free instead of paid */}
        {swaps.length > 0 && (
          <section className="content-section" aria-labelledby="stu-swap-title">
            <div className="container">
              <h2 id="stu-swap-title" className="edu-section__title">{t('pages.students.altTitle', 'Free instead of paid')}</h2>
              <p className="edu-section__subtitle">{t('pages.students.altSubtitle', 'Swap expensive apps for free ones that do the same job.')}</p>
              <div className="stu-swap">
                {swaps.map(([paid, free, id]) => (
                  <Link key={id} to={`${base}/tools/${id}`} className="stu-swap__item">
                    <span className="stu-swap__free">{free}</span>
                    <span className="stu-swap__instead">{t('pages.students.altReplaces', 'instead of')} {paid}</span>
                    <Icon name="arrow-right" collection="ui" size={15} />
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Study smarter tips */}
        <section className="content-section" aria-labelledby="stu-tips-title">
          <div className="container">
            <h2 id="stu-tips-title" className="edu-section__title">{t('pages.students.tipsTitle', 'Study smarter')}</h2>
            <ol className="edu-guide">
              {TIPS.map(([titleFb, textFb], i) => (
                <li key={i} className="edu-guide__step">
                  <span className="edu-guide__num" aria-hidden="true">{i + 1}</span>
                  <div>
                    <h3 className="edu-guide__step-title">{t(`pages.students.tips.tip${i + 1}.title`, titleFb)}</h3>
                    <p className="edu-guide__step-text">{t(`pages.students.tips.tip${i + 1}.text`, textFb)}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Student FAQ */}
        <section className="content-section edu-parents" aria-labelledby="stu-faq-title">
          <div className="container">
            <h2 id="stu-faq-title" className="edu-section__title">{t('pages.students.faqTitle', 'Student questions')}</h2>
            <div className="edu-faq">
              {FAQ.map(([qFb, aFb], i) => (
                <details key={i} className="edu-faq__item">
                  <summary className="edu-faq__q">
                    <span>{t(`pages.students.faq.q${i + 1}`, qFb)}</span>
                    <Icon name="chevron-down" collection="ui" size={16} className="edu-faq__chevron" />
                  </summary>
                  <p className="edu-faq__a">{t(`pages.students.faq.a${i + 1}`, aFb)}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="content-section" aria-labelledby="stu-cta-title">
          <div className="container">
            <div className="edu-cta">
              <h2 id="stu-cta-title" className="edu-cta__title">{t('pages.students.ctaTitle', 'Ready to level up?')}</h2>
              <p className="edu-cta__text">{t('pages.students.ctaText', 'Browse the full library, or follow a guided path and earn a certificate.')}</p>
              <div className="edu-cta__actions">
                <Link to={`${base}/`} className="btn btn--primary">
                  <Icon name="layout-grid" size={15} />
                  {t('pages.students.ctaBrowse', 'Browse all tools')}
                </Link>
                <Link to={`${base}/learning-paths`} className="btn btn--secondary">
                  <Icon name="graduation-cap" collection="category" size={15} />
                  {t('pages.students.ctaPaths', 'Explore learning paths')}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </StaticPageLayout>
    </>
  )
}
