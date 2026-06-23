import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useI18n } from '../contexts/I18nContext'
import { useProfile } from '../hooks/useProfile'
import { useLiteMode } from '../hooks/useLiteMode'
import StaticPageLayout from '../components/StaticPageLayout'
import Icon from '../components/Icon'
import SEO from '../components/SEO'
import { getPacks, onChange } from '../lib/progressStore'
import { removePack, formatBytes } from '../lib/offlinePacks'

// Dependency-free radar polygon for the skill-domain chart.
function radarPoint(cx, cy, r, value, index, count) {
  const angle = (-90 + (360 / count) * index) * (Math.PI / 180)
  return [cx + Math.cos(angle) * r * value, cy + Math.sin(angle) * r * value]
}

function CompetencyRadar({ competencies }) {
  const SIZE = 220
  const C = SIZE / 2
  const R = 86
  const n = competencies.length
  const rings = [0.34, 0.67, 1]

  const dataPts = competencies
    .map((c, i) => radarPoint(C, C, R, Math.max(c.value, 0.04), i, n).join(','))
    .join(' ')

  return (
    <svg className="radar" viewBox={`0 0 ${SIZE} ${SIZE}`} role="img" aria-label="Skill domains explored">
      {rings.map((ring, ri) => (
        <polygon
          key={ri}
          className="radar__ring"
          points={competencies.map((_, i) => radarPoint(C, C, R, ring, i, n).join(',')).join(' ')}
        />
      ))}
      {competencies.map((_, i) => {
        const [x, y] = radarPoint(C, C, R, 1, i, n)
        return <line key={i} className="radar__spoke" x1={C} y1={C} x2={x} y2={y} />
      })}
      <polygon className="radar__data" points={dataPts} />
      {competencies.map((c, i) => {
        const [x, y] = radarPoint(C, C, R, Math.max(c.value, 0.04), i, n)
        return <circle key={i} className={`radar__dot${c.explored > 0 ? ' is-on' : ''}`} cx={x} cy={y} r={c.explored > 0 ? 3.2 : 2} />
      })}
    </svg>
  )
}

export default function Progress({ toolsData = { tools: [], categories: [] } }) {
  const { t, lang } = useI18n()
  const [toolkits, setToolkits] = useState([])
  const [packs, setPacks] = useState(() => getPacks())

  useEffect(() => {
    let cancelled = false
    fetch('/assets/data/learning-paths.json')
      .then((r) => (r.ok ? r.json() : { toolkits: [] }))
      .then((lp) => { if (!cancelled) setToolkits(lp.toolkits || []) })
      .catch(() => {})
    return () => { cancelled = true }
  }, [])

  useEffect(() => onChange(() => setPacks(getPacks())), [])

  const profile = useProfile({ toolkits, tools: toolsData.tools })
  const { liteMode, pref, setPref, auto } = useLiteMode()

  const toolkitById = (id) => toolkits.find((tk) => tk.id === id)
  const packEntries = Object.entries(packs)
  const totalOfflineBytes = packEntries.reduce((n, [, m]) => n + (m.bytes || 0), 0)

  const lvl = profile.level

  return (
    <>
      <SEO
        title={t('progress.seoTitle', 'My Progress')}
        description={t('progress.seoDesc', 'Track your digital-skills journey: levels, streaks, badges, skill domains, and offline downloads.')}
        pathname="/progress"
        lang={lang}
        noindex
      />
      <StaticPageLayout
        breadcrumb={t('progress.breadcrumb', 'My Progress')}
        heroTitle={t('progress.title', 'My Learning Journey')}
        heroSubtitle={t('progress.subtitle', 'Everything here is stored privately on this device. No account, no sign-in.')}
      >
        <section className="section dash">
          <div className="container">

            {!profile.hasAnyProgress ? (
              <div className="dash-empty">
                <span className="dash-empty__icon" aria-hidden="true"><Icon name="compass" collection="ui" size={32} /></span>
                <h2 className="dash-empty__title">{t('progress.emptyTitle', 'Your journey starts here')}</h2>
                <p className="dash-empty__desc">{t('progress.emptyDesc', 'Pick a learning path and explore your first tool. Your level, streak, and badges will appear here as you go.')}</p>
                <Link to="/learning-paths" className="btn btn--primary">
                  <Icon name="graduation-cap" collection="category" size={16} />
                  {t('progress.emptyCta', 'Browse learning paths')}
                </Link>
              </div>
            ) : (
              <>
                {/* ── Level + streak hero ── */}
                <div className="dash-hero">
                  <div className="dash-level">
                    <div className="dash-level__ring" role="img" aria-label={`${lvl.pct}% to next level`}>
                      <svg viewBox="0 0 120 120" width="120" height="120">
                        <circle cx="60" cy="60" r="52" fill="none" stroke="var(--border-secondary)" strokeWidth="9" />
                        <circle
                          cx="60" cy="60" r="52" fill="none"
                          stroke="var(--accent-primary)" strokeWidth="9" strokeLinecap="round"
                          strokeDasharray={`${(lvl.pct / 100) * 326.7} 326.7`}
                          transform="rotate(-90 60 60)"
                          style={{ transition: 'stroke-dasharray 0.7s cubic-bezier(0.16,1,0.3,1)' }}
                        />
                      </svg>
                      <div className="dash-level__num"><strong>{lvl.level}</strong><span>{t('progress.levelWord', 'Level')}</span></div>
                    </div>
                    <div className="dash-level__copy">
                      <span className="dash-level__name">{t(`progress.level.${lvl.name.toLowerCase()}`, lvl.name)}</span>
                      <span className="dash-level__xp">
                        {profile.xp.toLocaleString()} {t('progress.xp', 'XP')}
                        {lvl.next != null && (
                          <> · {(lvl.next - profile.xp).toLocaleString()} {t('progress.toNext', 'to next level')}</>
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="dash-streak" title={t('progress.streakHint', 'Days in a row you have learned something')}>
                    <span className={`dash-streak__flame${profile.streak.activeToday ? ' is-active' : ''}`} aria-hidden="true">
                      <Icon name="zap" collection="ui" size={22} />
                    </span>
                    <strong>{profile.streak.current}</strong>
                    <span>{t('progress.dayStreak', 'day streak')}</span>
                    {profile.streak.longest > profile.streak.current && (
                      <span className="dash-streak__best">{t('progress.best', 'best')}: {profile.streak.longest}</span>
                    )}
                  </div>
                </div>

                {/* ── Continue learning ── */}
                {profile.continuePath && (
                  <Link to={`/learning-paths/${profile.continuePath.id}`} className="dash-continue">
                    <span className="dash-continue__icon" aria-hidden="true"><Icon name={profile.continuePath.icon} collection="ui" size={22} /></span>
                    <span className="dash-continue__body">
                      <span className="dash-continue__label">{t('progress.continue', 'Continue where you left off')}</span>
                      <strong className="dash-continue__title">{profile.continuePath.title}</strong>
                      <span className="dash-continue__bar"><span style={{ width: `${profile.continuePath.pct}%` }} /></span>
                    </span>
                    <span className="dash-continue__pct">{profile.continuePath.pct}%</span>
                  </Link>
                )}

                {/* ── Headline stats ── */}
                <div className="dash-stats">
                  {[
                    { icon: 'wrench', value: profile.totalToolsExplored, label: t('progress.statTools', 'tools explored') },
                    { icon: 'list-checks', value: profile.totalTasksDone, label: t('progress.statTasks', 'tasks done') },
                    { icon: 'check-circle', value: profile.stagesCompleted, label: t('progress.statStages', 'stages cleared') },
                    { icon: 'award', value: profile.pathsCompleted, label: t('progress.statPaths', 'paths completed') },
                  ].map((s) => (
                    <div className="dash-stat" key={s.label}>
                      <Icon name={s.icon} collection="ui" size={18} />
                      <strong>{s.value}</strong>
                      <span>{s.label}</span>
                    </div>
                  ))}
                </div>

                {/* ── Skill domains + badges ── */}
                <div className="dash-grid">
                  <div className="dash-card">
                    <h2 className="dash-card__title"><Icon name="target" collection="ui" size={16} />{t('progress.domains', 'Skill domains')}</h2>
                    <div className="dash-radar-wrap">
                      <CompetencyRadar competencies={profile.competencies} />
                      <ul className="dash-radar-legend">
                        {profile.competencies.map((c) => (
                          <li key={c.group} className={c.explored > 0 ? 'is-on' : ''}>
                            <Icon name={c.icon} collection="ui" size={14} />
                            <span className="dash-radar-legend__label">{t(`groups.${c.group}`, c.label)}</span>
                            <span className="dash-radar-legend__count">{c.explored}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="dash-card">
                    <h2 className="dash-card__title">
                      <Icon name="award" collection="ui" size={16} />{t('progress.badges', 'Badges')}
                      <span className="dash-card__meta">{profile.earnedBadgeIds.length}/{profile.badges.length}</span>
                    </h2>
                    <ul className="dash-badges">
                      {profile.badges.map((b) => (
                        <li key={b.id} className={`dash-badge${b.earned ? ' is-earned' : ' is-locked'}`} title={b.desc}>
                          <span className="dash-badge__icon" aria-hidden="true"><Icon name={b.icon} collection="ui" size={20} /></span>
                          <span className="dash-badge__label">{t(`progress.badge.${b.id}`, b.label)}</span>
                          <span className="dash-badge__desc">{t(`progress.badgeDesc.${b.id}`, b.desc)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* ── Per-path progress ── */}
                {profile.perPath.some((p) => p.started) && (
                  <div className="dash-card">
                    <h2 className="dash-card__title"><Icon name="route" collection="ui" size={16} />{t('progress.yourPaths', 'Your paths')}</h2>
                    <ul className="dash-paths">
                      {profile.perPath.filter((p) => p.started).sort((a, b) => b.pct - a.pct).map((p) => (
                        <li key={p.id}>
                          <Link to={`/learning-paths/${p.id}`} className="dash-path">
                            <span className="dash-path__icon" aria-hidden="true"><Icon name={p.icon} collection="ui" size={18} /></span>
                            <span className="dash-path__main">
                              <span className="dash-path__title">{p.title}{p.completed && <Icon name="check-circle" collection="ui" size={14} />}</span>
                              <span className="dash-path__bar"><span style={{ width: `${p.pct}%` }} /></span>
                            </span>
                            <span className="dash-path__pct">{p.pct}%</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}

            {/* ── Offline & data (always shown) ── */}
            <div className="dash-card dash-offline">
              <h2 className="dash-card__title"><Icon name="download" collection="ui" size={16} />{t('progress.offlineTitle', 'Offline & data')}</h2>

              <div className="dash-lite">
                <div className="dash-lite__copy">
                  <strong>{t('progress.liteTitle', 'Lite mode')}</strong>
                  <p>{t('progress.liteDesc', 'Save data and speed up older phones by skipping heavy visuals.')}</p>
                </div>
                <div className="dash-lite__seg" role="group" aria-label={t('progress.liteTitle', 'Lite mode')}>
                  {[
                    { v: 'auto', label: t('progress.liteAuto', 'Auto') },
                    { v: 'on', label: t('progress.liteOn', 'On') },
                    { v: 'off', label: t('progress.liteOff', 'Off') },
                  ].map((o) => (
                    <button
                      key={o.v}
                      type="button"
                      className={`dash-lite__opt${pref === o.v ? ' is-active' : ''}`}
                      aria-pressed={pref === o.v}
                      onClick={() => setPref(o.v)}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>
              <p className="dash-lite__state">
                {pref === 'auto'
                  ? (auto
                    ? t('progress.liteAutoOn', 'Auto: on (slow connection detected)')
                    : t('progress.liteAutoOff', 'Auto: off (good connection)'))
                  : liteMode ? t('progress.liteIsOn', 'Lite mode is on') : t('progress.liteIsOff', 'Lite mode is off')}
              </p>

              <div className="dash-packs">
                <div className="dash-packs__head">
                  <strong>{t('progress.downloads', 'Downloaded for offline')}</strong>
                  {packEntries.length > 0 && <span className="dash-packs__total">{formatBytes(totalOfflineBytes)}</span>}
                </div>
                {packEntries.length === 0 ? (
                  <p className="dash-packs__empty">{t('progress.noDownloads', 'No paths downloaded yet. Open a learning path and tap “Download for offline” to study without a connection.')}</p>
                ) : (
                  <ul className="dash-packs__list">
                    {packEntries.map(([id, m]) => {
                      const tk = toolkitById(id)
                      return (
                        <li key={id} className="dash-pack">
                          <Icon name={tk?.icon || 'graduation-cap'} collection="ui" size={18} />
                          <span className="dash-pack__title">{tk?.title || id}</span>
                          <span className="dash-pack__size">{formatBytes(m.bytes || 0)}</span>
                          <button type="button" className="dash-pack__remove" onClick={() => removePack(id)}>
                            {t('progress.remove', 'Remove')}
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>
            </div>

          </div>
        </section>
      </StaticPageLayout>
    </>
  )
}
