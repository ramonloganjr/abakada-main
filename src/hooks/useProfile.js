import { useState, useEffect, useCallback } from 'react'
import {
  getAllProgress,
  getActivityDays,
  getPacks,
  getRecentToolkit,
  onChange,
  todayISO,
} from '../lib/progressStore'
import { computeProfile } from '../lib/profile'

/**
 * Reactive learner profile. Recomputes whenever any progress/pack/activity state
 * changes (this tab or another), and whenever the catalogue/toolkit data passed
 * in changes. Everything is client-side; there is no network or account.
 *
 * @param {{ toolkits?: any[], tools?: any[] }} data
 */
export function useProfile({ toolkits = [], tools = [] } = {}) {
  const build = useCallback(() => {
    const { exploredByToolkit, tasksByToolkit } = getAllProgress()
    return computeProfile({
      exploredByToolkit,
      tasksByToolkit,
      activityDays: getActivityDays(),
      packs: getPacks(),
      recentToolkit: getRecentToolkit(),
      today: todayISO(),
      toolkits,
      tools,
    })
  }, [toolkits, tools])

  const [profile, setProfile] = useState(build)

  useEffect(() => {
    // Recompute when inputs (data) change.
    setProfile(build())
    // And whenever stored learner state changes.
    return onChange(() => setProfile(build()))
  }, [build])

  return profile
}
