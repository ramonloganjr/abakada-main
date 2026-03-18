import { Link } from 'react-router-dom'
import { useI18n } from '../contexts/I18nContext'
import StaticPageLayout from '../components/StaticPageLayout'

const PAGES = [
  { to: '/', title: 'Home — All Tools', description: 'Browse 1,000+ free open-source tools' },
  { to: '/about', title: 'About Us', description: 'Our mission and story' },
  { to: '/official-partners', title: 'Official Partners', description: 'Organizations supporting Abakada' },
  { to: '/partnerships', title: 'Partnerships', description: 'Partner with Abakada' },
  { to: '/partnership-deck', title: 'Partnership Deck', description: 'Partnership presentation deck' },
  { to: '/contact', title: 'Contact', description: 'Get in touch with the team' },
  { to: '/faq', title: 'FAQ', description: 'Frequently asked questions' },
  { to: '/privacy', title: 'Privacy Policy', description: 'How we handle your data' },
  { to: '/sitemap', title: 'Sitemap', description: 'Overview of all pages' },
]

const FEATURES = [
  {
    to: '/bookmarks',
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
    title: 'Compare Tools',
    description: 'Side-by-side tool comparison',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="7" height="18" rx="1"/><rect x="14" y="3" width="7" height="18" rx="1"/>
      </svg>
    ),
  },
  {
    to: '/learning-paths',
    title: 'Learning Paths',
    description: 'Guided tracks by role and skill level',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
      </svg>
    ),
    children: [
      { to: '/learning-paths/research-starter', title: 'Research Starter Kit', description: 'Tools for students and academics' },
      { to: '/learning-paths/student-productivity', title: 'Student Productivity Pack', description: 'Stay organized and get more done' },
      { to: '/learning-paths/teacher-digital-classroom', title: "Teacher's Digital Classroom", description: 'Tools for educators' },
      { to: '/learning-paths/beginner-coding', title: 'Beginner Coding Path', description: 'Core tools for developers' },
      { to: '/learning-paths/designer-toolkit', title: "Designer's Toolkit", description: 'Tools for designers' },
      { to: '/learning-paths/accountant-essentials', title: "Accountant's Essentials", description: 'Tools for accountants' },
    ],
  },
]

const CATEGORIES = [
  { to: '/#doc-processing', title: 'Document Processing' },
  { to: '/#design', title: 'Design & Images' },
  { to: '/#notes', title: 'Note-taking' },
  { to: '/#development', title: 'Development Tools' },
  { to: '/#ai-ml', title: 'AI & Machine Learning' },
  { to: '/#devops', title: 'DevOps & Infrastructure' },
  { to: '/#database', title: 'Database Tools' },
  { to: '/#security-tools', title: 'Security Tools' },
  { to: '/#media', title: 'Media' },
  { to: '/#writing', title: 'Writing' },
  { to: '/#project', title: 'Project Management' },
  { to: '/#communication', title: 'Communication' },
  { to: '/#education', title: 'Education & Teaching' },
]

export default function Sitemap() {
  const { t } = useI18n()
  return (
    <StaticPageLayout
      breadcrumb={t('breadcrumb.sitemap', 'Sitemap')}
      heroTitle={t('pages.sitemap.heroTitle', 'Sitemap')}
      heroSubtitle="A complete overview of all pages on Abakada."
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
                <h2 className="sitemap-section__title">Main Pages</h2>
                <p className="sitemap-section__subtitle">All primary pages on Abakada</p>
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
                    <p className="sitemap-card__title">{page.title}</p>
                    <p className="sitemap-card__description">{page.description}</p>
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
                <h2 className="sitemap-section__title">Features</h2>
                <p className="sitemap-section__subtitle">Platform tools and interactive features</p>
              </div>
            </div>
            <div className="sitemap-grid sitemap-grid--pages">
              {FEATURES.map(feat => (
                <div key={feat.to} className="sitemap-feature-group">
                  <Link to={feat.to} className="sitemap-card">
                    <div className="sitemap-card__icon">{feat.icon}</div>
                    <div className="sitemap-card__content">
                      <p className="sitemap-card__title">{feat.title}</p>
                      <p className="sitemap-card__description">{feat.description}</p>
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
                <h2 className="sitemap-section__title">Tool Categories</h2>
                <p className="sitemap-section__subtitle">Browse tools by category</p>
              </div>
            </div>
            <div className="sitemap-grid sitemap-grid--pages">
              {CATEGORIES.map(cat => (
                <Link key={cat.to} to={cat.to} className="sitemap-card">
                  <div className="sitemap-card__content">
                    <p className="sitemap-card__title">{cat.title}</p>
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
  )
}
