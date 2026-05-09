import { Link } from 'react-router-dom'
import { useI18n } from '../contexts/I18nContext'
import StaticPageLayout from '../components/StaticPageLayout'
import SEO from '../components/SEO'
import { pageMeta } from '../lib/pageMeta'

const PAGES = [
  { to: '/', titleKey: 'pages.sitemap.pages.home.title', descKey: 'pages.sitemap.pages.home.desc', title: 'Home — All Tools', description: 'Browse 1,000+ free open-source tools' },
  { to: '/about', titleKey: 'pages.sitemap.pages.about.title', descKey: 'pages.sitemap.pages.about.desc', title: 'About Us', description: 'Our mission and story' },
  { to: '/official-partners', titleKey: 'pages.sitemap.pages.officialPartners.title', descKey: 'pages.sitemap.pages.officialPartners.desc', title: 'Official Partners', description: 'Organizations supporting Abakada' },
  { to: '/partnerships', titleKey: 'pages.sitemap.pages.partnerships.title', descKey: 'pages.sitemap.pages.partnerships.desc', title: 'Partnerships', description: 'Partner with Abakada' },
  { to: '/partnership-deck', titleKey: 'pages.sitemap.pages.partnershipDeck.title', descKey: 'pages.sitemap.pages.partnershipDeck.desc', title: 'Partnership Deck', description: 'Full presentation deck for prospective partners' },
  { to: '/contact', titleKey: 'pages.sitemap.pages.contact.title', descKey: 'pages.sitemap.pages.contact.desc', title: 'Contact', description: 'Get in touch with the team' },
  { to: '/faq', titleKey: 'pages.sitemap.pages.faq.title', descKey: 'pages.sitemap.pages.faq.desc', title: 'FAQ', description: 'Frequently asked questions' },
  { to: '/glossary', titleKey: 'pages.sitemap.pages.glossary.title', descKey: 'pages.sitemap.pages.glossary.desc', title: 'Glossary', description: 'Open-source, licensing, and productivity definitions' },
  { to: '/privacy', titleKey: 'pages.sitemap.pages.privacy.title', descKey: 'pages.sitemap.pages.privacy.desc', title: 'Privacy Policy', description: 'How we handle your data' },
  { to: '/terms', titleKey: 'pages.sitemap.pages.terms.title', descKey: 'pages.sitemap.pages.terms.desc', title: 'Terms of Use', description: 'Terms governing access to and use of the Site' },
  { to: '/sitemap', titleKey: 'pages.sitemap.pages.sitemap.title', descKey: 'pages.sitemap.pages.sitemap.desc', title: 'Sitemap', description: 'Overview of all pages' },
]

const FEATURES = [
  {
    to: '/bookmarks',
    titleKey: 'pages.sitemap.features.bookmarks.title',
    descKey: 'pages.sitemap.features.bookmarks.desc',
    title: 'Bookmarks',
    description: 'Your saved tools, accessible offline',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
      </svg>
    ),
  },
  {
    to: '/compare',
    titleKey: 'pages.sitemap.features.compare.title',
    descKey: 'pages.sitemap.features.compare.desc',
    title: 'Comparison Tools',
    description: 'Side-by-side tool comparison (up to 4 tools)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="7" height="18" rx="1"/><rect x="14" y="3" width="7" height="18" rx="1"/>
      </svg>
    ),
  },
  {
    to: '/learning-paths',
    titleKey: 'pages.sitemap.features.learningPaths.title',
    descKey: 'pages.sitemap.features.learningPaths.desc',
    title: 'Learning Paths',
    description: 'Guided tracks by role and skill level',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
      </svg>
    ),
    children: [
      { to: '/learning-paths/digital-foundations', title: 'Digital Foundations', description: 'First-time computer and internet users' },
      { to: '/learning-paths/research-starter', title: 'Research Starter Kit', description: 'Tools for students and academics' },
      { to: '/learning-paths/student-productivity', title: 'Student Productivity Pack', description: 'Stay organized and get more done' },
      { to: '/learning-paths/teacher-digital-classroom', title: "Teacher's Digital Classroom", description: 'Tools for educators' },
      { to: '/learning-paths/remote-collaboration', title: 'Remote Team Collaboration', description: 'Work together from anywhere' },
      { to: '/learning-paths/workplace-pro', title: 'Workplace Productivity for Professionals', description: 'Pro-level workflows' },
      { to: '/learning-paths/self-directed-learner', title: "Self-Directed Learner's Toolkit", description: 'Build your own curriculum' },
      { to: '/learning-paths/beginner-coding', title: 'Beginner Coding Path', description: 'Core tools for new developers' },
      { to: '/learning-paths/designer-toolkit', title: "Designer's Toolkit", description: 'Tools for designers' },
      { to: '/learning-paths/accountant-essentials', title: "Accountant's Essentials", description: 'Tools for accountants' },
    ],
  },
]

// Top tool categories — IDs match `public/assets/data/tools.json` so anchors resolve.
const CATEGORIES = [
  { to: '/#doc-processing', id: 'doc-processing', label: 'Document Processing' },
  { to: '/#design', id: 'design', label: 'Design & Images' },
  { to: '/#notes', id: 'notes', label: 'Note-taking' },
  { to: '/#development', id: 'development', label: 'Development Tools' },
  { to: '/#ai-ml', id: 'ai-ml', label: 'AI & Machine Learning' },
  { to: '/#devops', id: 'devops', label: 'DevOps & Infrastructure' },
  { to: '/#database', id: 'database', label: 'Database Tools' },
  { to: '/#security-tools', id: 'security-tools', label: 'Security Tools' },
  { to: '/#media', id: 'media', label: 'Media Players & Editors' },
  { to: '/#writing', id: 'writing', label: 'Writing & Publishing' },
  { to: '/#project', id: 'project', label: 'Project Management' },
  { to: '/#communication', id: 'communication', label: 'Communication' },
  { to: '/#education', id: 'education', label: 'Education & Teaching' },
  { to: '/#privacy', id: 'privacy', label: 'Privacy' },
  { to: '/#audio', id: 'audio', label: 'Audio Production' },
  { to: '/#video', id: 'video', label: 'Video Production' },
]

export default function Sitemap() {
  const { t, lang } = useI18n()
  return (
    <>
    <SEO {...pageMeta.sitemap} lang={lang} />
    <StaticPageLayout
      breadcrumb={t('breadcrumb.sitemap', 'Sitemap')}
      heroTitle={t('pages.sitemap.heroTitle', 'Sitemap')}
      heroSubtitle={t('pages.sitemap.heroSubtitle', 'A complete overview of every page, feature, learning path, and category available on Abakada.')}
    >
      <section className="content-section">
        <div className="container">
          <div className="sitemap-section">
            <div className="sitemap-section__header">
              <div className="sitemap-section__icon sitemap-section__icon--pages">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
              </div>
              <div>
                <h2 className="sitemap-section__title">{t('pages.sitemap.mainPagesTitle', 'Main Pages')}</h2>
                <p className="sitemap-section__subtitle">{t('pages.sitemap.mainPagesSubtitle', 'All primary pages on Abakada')}</p>
              </div>
            </div>
            <div className="sitemap-grid sitemap-grid--pages">
              {PAGES.map(page => (
                <Link key={page.to} to={page.to} className="sitemap-card">
                  <div className="sitemap-card__icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                    </svg>
                  </div>
                  <div className="sitemap-card__content">
                    <p className="sitemap-card__title">{t(page.titleKey, page.title)}</p>
                    <p className="sitemap-card__description">{t(page.descKey, page.description)}</p>
                  </div>
                  <svg className="sitemap-card__arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </Link>
              ))}
            </div>
          </div>

          <div className="sitemap-section">
            <div className="sitemap-section__header">
              <div className="sitemap-section__icon sitemap-section__icon--features">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                </svg>
              </div>
              <div>
                <h2 className="sitemap-section__title">{t('pages.sitemap.featuresTitle', 'Features')}</h2>
                <p className="sitemap-section__subtitle">{t('pages.sitemap.featuresSubtitle', 'Platform tools and interactive features')}</p>
              </div>
            </div>
            <div className="sitemap-grid sitemap-grid--pages">
              {FEATURES.map(feat => (
                <div key={feat.to} className="sitemap-feature-group">
                  <Link to={feat.to} className="sitemap-card">
                    <div className="sitemap-card__icon">{feat.icon}</div>
                    <div className="sitemap-card__content">
                      <p className="sitemap-card__title">{t(feat.titleKey, feat.title)}</p>
                      <p className="sitemap-card__description">{t(feat.descKey, feat.description)}</p>
                    </div>
                    <svg className="sitemap-card__arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </Link>
                  {feat.children && (
                    <div className="sitemap-feature-children">
                      {feat.children.map(child => (
                        <Link key={child.to} to={child.to} className="sitemap-card sitemap-card--child">
                          <div className="sitemap-card__content">
                            <p className="sitemap-card__title">{child.title}</p>
                            <p className="sitemap-card__description">{child.description}</p>
                          </div>
                          <svg className="sitemap-card__arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M5 12h14M12 5l7 7-7 7"/>
                          </svg>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="sitemap-section">
            <div className="sitemap-section__header">
              <div className="sitemap-section__icon sitemap-section__icon--tools">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                  <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                </svg>
              </div>
              <div>
                <h2 className="sitemap-section__title">{t('pages.sitemap.categoriesTitle', 'Tool Categories')}</h2>
                <p className="sitemap-section__subtitle">{t('pages.sitemap.categoriesSubtitle', 'Browse tools by category')}</p>
              </div>
            </div>
            <div className="sitemap-grid sitemap-grid--pages">
              {CATEGORIES.map(cat => (
                <Link key={cat.to} to={cat.to} className="sitemap-card">
                  <div className="sitemap-card__content">
                    <p className="sitemap-card__title">{t(`categories.${cat.id}`, cat.label)}</p>
                  </div>
                  <svg className="sitemap-card__arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </StaticPageLayout>
    </>
  )
}
