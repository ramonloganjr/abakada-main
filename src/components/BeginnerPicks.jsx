import { useMemo } from 'react'
import { useI18n } from '../contexts/I18nContext'
import { BEGINNER_PICK_IDS } from '../lib/beginnerPicks'
import ToolCard from './ToolCard'
import Icon from './Icon'

// "New to open source? Start here" (review R3.5). A short, curated row of the most
// approachable everyday tools so a first-time visitor has an obvious, low-anxiety
// entry point instead of facing the full 1,288-tool grid cold. Reuses ToolCard so
// the cards stay pixel-identical to the main grid, and resolves the curated IDs
// against live data — if none resolve, the section renders nothing.
export default function BeginnerPicks({ tools, categories, onToolClick }) {
  const { t } = useI18n()

  const picks = useMemo(() => {
    const byId = new Map(tools.map(tool => [tool.id, tool]))
    return BEGINNER_PICK_IDS.map(id => byId.get(id)).filter(Boolean)
  }, [tools])

  if (picks.length === 0) return null

  return (
    <section className="beginner-picks" aria-labelledby="beginner-picks-title">
      <div className="container">
        <div className="beginner-picks__header">
          <span className="beginner-picks__eyebrow">
            <Icon name="sprout" collection="ui" size={15} />
            {t('beginnerPicks.eyebrow', 'New to open source?')}
          </span>
          <h2 id="beginner-picks-title" className="beginner-picks__title">
            {t('beginnerPicks.title', 'Start here: friendly, free replacements for apps you already know')}
          </h2>
          <p className="beginner-picks__subtitle">
            {t('beginnerPicks.subtitle', 'Hand-picked, easy-to-install tools that do the job of popular paid software, at no cost.')}
          </p>
        </div>
        <div className="grid grid--tools beginner-picks__grid">
          {picks.map(tool => {
            const cat = categories.find(c => c.id === tool.category)
            return (
              <ToolCard
                key={tool.id}
                tool={tool}
                categoryIcon={cat?.icon}
                onClick={onToolClick}
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}
