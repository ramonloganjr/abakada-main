import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useI18n } from '../contexts/I18nContext'
import { useBookmarks } from '../contexts/BookmarkContext'
import StaticPageLayout from '../components/StaticPageLayout'
import ToolCard from '../components/ToolCard'
import ToolModal from '../components/ToolModal'

export default function Bookmarks({ toolsData = { tools: [], categories: [] } }) {
  const { t } = useI18n()
  const { bookmarks } = useBookmarks()
  const [selectedTool, setSelectedTool] = useState(null)

  const bookmarkedTools = toolsData.tools.filter(tool => bookmarks.includes(tool.id))
  const selectedCategory = toolsData.categories.find(c => c.id === selectedTool?.category)

  return (
    <StaticPageLayout
      breadcrumb={t('bookmarks.title', 'My Bookmarks')}
      heroTitle={t('bookmarks.title', 'My Bookmarks')}
    >
      <section className="section section--tools">
        <div className="container">
          {bookmarkedTools.length === 0 ? (
            <div className="empty-state" role="status">
              <div className="empty-state__content">
                <h3 className="empty-state__title">{t('bookmarks.empty', 'No bookmarks yet')}</h3>
                <p className="empty-state__description">{t('bookmarks.emptyDesc', 'Save tools you like to find them quickly.')}</p>
                <div className="empty-state__actions">
                  <Link to="/" className="empty-state__btn empty-state__btn--primary">
                    {t('bookmarks.browse', 'Browse Tools')}
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid--tools" id="tools-grid">
              {bookmarkedTools.map(tool => {
                const cat = toolsData.categories.find(c => c.id === tool.category)
                return (
                  <ToolCard
                    key={tool.id}
                    tool={tool}
                    categoryIcon={cat?.icon}
                    onClick={setSelectedTool}
                  />
                )
              })}
            </div>
          )}
        </div>
      </section>

      {selectedTool && (
        <ToolModal
          tool={selectedTool}
          categoryIcon={selectedCategory?.icon}
          onClose={() => setSelectedTool(null)}
        />
      )}
    </StaticPageLayout>
  )
}
