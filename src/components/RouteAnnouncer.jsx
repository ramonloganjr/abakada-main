import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'

// SPA accessibility (review item 6): client-side navigation doesn't reload the
// page, so screen readers are never told the view changed and keyboard focus is
// left on the old (now-gone) control. On each route change we (1) announce the
// new page title via a polite live region and (2) move focus to <main>, so AT
// users land at the start of the new content.
export default function RouteAnnouncer() {
  const { pathname } = useLocation()
  const [message, setMessage] = useState('')
  const firstRender = useRef(true)

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return // don't steal focus / announce on the very first paint
    }
    // Wait a tick so the new route renders and react-helmet updates <title>.
    const id = setTimeout(() => {
      setMessage(document.title || 'Page loaded')
      const main = document.getElementById('main-content')
      if (main) {
        main.setAttribute('tabindex', '-1')
        main.focus({ preventScroll: true })
      }
    }, 150)
    return () => clearTimeout(id)
  }, [pathname])

  return (
    <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
      {message}
    </div>
  )
}
