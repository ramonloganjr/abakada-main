import { useEffect, useState } from 'react'

// Shared loader for the GA4 visitor count (public/assets/data/visitors.json,
// refreshed by a scheduled GitHub Action). Returns a formatted date string so
// callers can render "Updated 12 Jun 2026" without re-implementing the parsing.
//
// The counter is non-critical: on any failure we degrade gracefully (totalUsers
// stays null so the caller can hide the badge) and leave a console breadcrumb so
// a future path/deploy regression stays visible.
export function useVisitorCount() {
  const [totalUsers, setTotalUsers] = useState(null)
  const [updatedDate, setUpdatedDate] = useState('')

  useEffect(() => {
    let cancelled = false
    fetch('/assets/data/visitors.json')
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status} fetching visitors.json`)
        return r.json()
      })
      .then(d => {
        if (cancelled || !(d.totalUsers > 0)) return
        setTotalUsers(d.totalUsers)
        const raw = d.updatedAt ? new Date(d.updatedAt) : new Date()
        const day = raw.getUTCDate().toString().padStart(2, '0')
        const mon = raw.toLocaleDateString('en-GB', { month: 'short', timeZone: 'UTC' })
        const yr = raw.getUTCFullYear()
        setUpdatedDate(`${day} ${mon} ${yr}`)
      })
      .catch(err => { console.warn('[visitors] count unavailable:', err.message) })
    return () => { cancelled = true }
  }, [])

  return { totalUsers, updatedDate }
}
