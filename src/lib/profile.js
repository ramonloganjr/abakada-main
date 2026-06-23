// @ts-check
// Pure functions that turn the raw, scattered learner state (explored tools,
// completed tasks, activity days, downloaded packs) into a single derived
// profile: XP, level, streaks, a competency radar, badges and a "continue where
// you left off" suggestion. No React, no storage, no DOM — trivially testable
// and reused by useProfile().

import { CATEGORY_GROUPS, GROUP_LABELS, GROUP_ICONS } from './categoryGroups'

// XP weights. Tuned so meaningful effort (finishing a path) clearly outweighs
// incidental clicks, while every small action still moves the needle.
export const XP = {
  perToolExplored: 10,
  perTaskDone: 15,
  perStageComplete: 40,
  perPathComplete: 150,
}

// The journey ladder mirrors the platform's North Star: a learner climbs from
// consuming tools to creating with them to contributing back to FOSS.
export const LEVELS = [
  { min: 0, name: 'Newcomer' },
  { min: 120, name: 'Explorer' },
  { min: 360, name: 'Builder' },
  { min: 800, name: 'Creator' },
  { min: 1600, name: 'Contributor' },
  { min: 3200, name: 'Advocate' },
]

// Tools explored within a domain to count it as "mastered" on the radar. Small
// on purpose: the audience is beginners, and early wins should fill the chart.
const MASTERY_TARGET = 6

/**
 * @param {number} xp
 * @returns {{ level: number, name: string, floor: number, next: number | null, into: number, span: number, pct: number }}
 */
export function levelFromXp(xp) {
  let idx = 0
  for (let i = 0; i < LEVELS.length; i++) {
    if (xp >= LEVELS[i].min) idx = i
  }
  const floor = LEVELS[idx].min
  const next = idx + 1 < LEVELS.length ? LEVELS[idx + 1].min : null
  const span = next == null ? 0 : next - floor
  const into = xp - floor
  const pct = next == null ? 100 : Math.min(100, Math.round((into / span) * 100))
  return { level: idx + 1, name: LEVELS[idx].name, floor, next, into, span, pct }
}

/**
 * Longest run of consecutive calendar days ending today (or yesterday — we don't
 * break a streak until a full day has been missed).
 * @param {string[]} days sorted unique YYYY-MM-DD stamps
 * @param {string} today YYYY-MM-DD
 * @returns {{ current: number, longest: number, activeToday: boolean }}
 */
export function computeStreak(days, today) {
  if (!days.length) return { current: 0, longest: 0, activeToday: false }
  const set = new Set(days)
  const dayMs = 86400000
  const toDate = (s) => new Date(s + 'T00:00:00')
  const fmt = (d) => {
    const off = d.getTimezoneOffset()
    return new Date(d.getTime() - off * 60000).toISOString().slice(0, 10)
  }

  const activeToday = set.has(today)
  const todayDate = toDate(today)
  const yesterday = fmt(new Date(todayDate.getTime() - dayMs))

  // Current streak counts back from today, or from yesterday if nothing yet today.
  let current = 0
  let anchor = activeToday ? today : (set.has(yesterday) ? yesterday : null)
  if (anchor) {
    let cursor = toDate(anchor)
    while (set.has(fmt(cursor))) {
      current++
      cursor = new Date(cursor.getTime() - dayMs)
    }
  }

  // Longest streak anywhere in the log.
  let longest = 0
  const sorted = [...set].sort()
  let run = 0
  let prev = null
  for (const s of sorted) {
    if (prev && toDate(s).getTime() - toDate(prev).getTime() === dayMs) run++
    else run = 1
    if (run > longest) longest = run
    prev = s
  }

  return { current, longest, activeToday }
}

/**
 * Build the full derived profile.
 * @param {object} args
 * @param {Record<string,string[]>} args.exploredByToolkit
 * @param {Record<string,string[]>} args.tasksByToolkit
 * @param {string[]} args.activityDays
 * @param {Record<string, any>} args.packs
 * @param {string|null} args.recentToolkit
 * @param {string} args.today
 * @param {Array<any>} args.toolkits   learning-paths.json toolkits
 * @param {Array<any>} args.tools      tools.json tools
 */
export function computeProfile({
  exploredByToolkit = {},
  tasksByToolkit = {},
  activityDays = [],
  packs = {},
  recentToolkit = null,
  today,
  toolkits = [],
  tools = [],
}) {
  const toolById = new Map(tools.map((t) => [t.id, t]))

  // Union of every tool the learner has explored across all paths.
  const exploredUnion = new Set()
  Object.values(exploredByToolkit).forEach((ids) => ids.forEach((id) => exploredUnion.add(id)))

  const totalToolsExplored = exploredUnion.size
  const totalTasksDone = Object.values(tasksByToolkit).reduce((n, arr) => n + arr.length, 0)

  // Per-path completion + stage completion (needs the toolkit definitions).
  const perPath = []
  let stagesCompleted = 0
  let pathsCompleted = 0
  let pathsStarted = 0

  toolkits.forEach((tk) => {
    const explored = new Set(exploredByToolkit[tk.id] || [])
    const stages = tk.stages || []
    const allToolIds = [...new Set(stages.flatMap((s) => s.toolIds || []))]
    const total = allToolIds.length
    const done = allToolIds.filter((id) => explored.has(id)).length
    const pct = total > 0 ? Math.round((done / total) * 100) : 0

    let stagesDoneInPath = 0
    stages.forEach((s) => {
      const ids = s.toolIds || []
      if (ids.length > 0 && ids.every((id) => explored.has(id))) stagesDoneInPath++
    })
    stagesCompleted += stagesDoneInPath

    const completed = total > 0 && done === total
    if (completed) pathsCompleted++
    if (done > 0) pathsStarted++

    perPath.push({
      id: tk.id,
      title: tk.title,
      icon: tk.icon || 'box',
      total,
      explored: done,
      pct,
      completed,
      started: done > 0,
      stagesDone: stagesDoneInPath,
      stagesTotal: stages.length,
    })
  })

  const xp =
    totalToolsExplored * XP.perToolExplored +
    totalTasksDone * XP.perTaskDone +
    stagesCompleted * XP.perStageComplete +
    pathsCompleted * XP.perPathComplete

  const level = levelFromXp(xp)
  const streak = computeStreak(activityDays, today)

  // Competency radar: explored tools rolled up into the seven domains.
  const availableByGroup = {}
  tools.forEach((t) => {
    for (const g of CATEGORY_GROUPS) {
      if (g.categories.includes(t.category)) { availableByGroup[g.id] = (availableByGroup[g.id] || 0) + 1; break }
    }
  })
  const exploredByGroup = {}
  exploredUnion.forEach((id) => {
    const tool = toolById.get(id)
    if (!tool) return
    for (const g of CATEGORY_GROUPS) {
      if (g.categories.includes(tool.category)) { exploredByGroup[g.id] = (exploredByGroup[g.id] || 0) + 1; break }
    }
  })
  const competencies = CATEGORY_GROUPS.map((g) => {
    const explored = exploredByGroup[g.id] || 0
    return {
      group: g.id,
      label: GROUP_LABELS[g.id] || g.id,
      icon: GROUP_ICONS[g.id] || 'box',
      explored,
      available: availableByGroup[g.id] || 0,
      // 0..1 for the radar geometry.
      value: Math.min(explored / MASTERY_TARGET, 1),
    }
  })
  const domainsTouched = competencies.filter((c) => c.explored > 0).length

  const packCount = Object.keys(packs).length

  const badges = computeBadges({
    totalToolsExplored,
    totalTasksDone,
    stagesCompleted,
    pathsCompleted,
    domainsTouched,
    packCount,
    streak,
  })

  // "Continue learning": prefer the most recently touched, still-unfinished path;
  // otherwise the started path closest to completion.
  let continuePath = null
  const byId = (id) => perPath.find((p) => p.id === id)
  const recent = recentToolkit ? byId(recentToolkit) : null
  if (recent && recent.started && !recent.completed) {
    continuePath = recent
  } else {
    const candidates = perPath.filter((p) => p.started && !p.completed).sort((a, b) => b.pct - a.pct)
    continuePath = candidates[0] || null
  }

  return {
    xp,
    level,
    streak,
    totalToolsExplored,
    totalTasksDone,
    stagesCompleted,
    pathsCompleted,
    pathsStarted,
    competencies,
    domainsTouched,
    perPath,
    continuePath,
    packCount,
    badges,
    earnedBadgeIds: badges.filter((b) => b.earned).map((b) => b.id),
    hasAnyProgress: totalToolsExplored > 0 || totalTasksDone > 0,
  }
}

/**
 * Achievement definitions, evaluated against the computed metrics. Pure.
 */
export function computeBadges(m) {
  /** @type {Array<{id:string,label:string,desc:string,icon:string,earned:boolean}>} */
  const defs = [
    { id: 'first-steps', icon: 'sparkles', label: 'First Steps', desc: 'Explore your first tool', earned: m.totalToolsExplored >= 1 },
    { id: 'explorer', icon: 'compass', label: 'Explorer', desc: 'Explore 10 tools', earned: m.totalToolsExplored >= 10 },
    { id: 'toolsmith', icon: 'wrench', label: 'Toolsmith', desc: 'Explore 25 tools', earned: m.totalToolsExplored >= 25 },
    { id: 'hands-on', icon: 'list-checks', label: 'Hands-On', desc: 'Finish 10 practice tasks', earned: m.totalTasksDone >= 10 },
    { id: 'stage-clear', icon: 'check-circle', label: 'Stage Clear', desc: 'Complete a full stage', earned: m.stagesCompleted >= 1 },
    { id: 'path-finisher', icon: 'award', label: 'Path Finisher', desc: 'Complete a whole learning path', earned: m.pathsCompleted >= 1 },
    { id: 'scholar', icon: 'graduation-cap', label: 'Scholar', desc: 'Complete 3 learning paths', earned: m.pathsCompleted >= 3 },
    { id: 'well-rounded', icon: 'target', label: 'Well-Rounded', desc: 'Touch 4 different skill domains', earned: m.domainsTouched >= 4 },
    { id: 'offline-ready', icon: 'download', label: 'Offline Ready', desc: 'Download a path for offline learning', earned: m.packCount >= 1 },
    { id: 'streak-3', icon: 'zap', label: 'Warming Up', desc: 'Learn 3 days in a row', earned: m.streak.current >= 3 || m.streak.longest >= 3 },
    { id: 'streak-7', icon: 'zap', label: 'Consistent', desc: 'Learn 7 days in a row', earned: m.streak.current >= 7 || m.streak.longest >= 7 },
    { id: 'streak-30', icon: 'star', label: 'Unstoppable', desc: 'Learn 30 days in a row', earned: m.streak.current >= 30 || m.streak.longest >= 30 },
  ]
  return defs
}
