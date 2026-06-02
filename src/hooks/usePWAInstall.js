import { useEffect, useState } from 'react'

// Shared install state lives at module scope so every consumer (header button,
// sidebar action, install banner) reflects the same status. Previously each hook
// instance kept its own copy, so installing from one surface left stale "Install"
// buttons on the others.
let deferredPrompt = null
let installed = false
const subscribers = new Set()

function notify() {
  for (const cb of subscribers) cb()
}

function isStandalone() {
  if (typeof window === 'undefined') return false
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true // iOS Safari
  )
}

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt = e
    notify()
  })
  window.addEventListener('appinstalled', () => {
    deferredPrompt = null
    installed = true
    notify()
  })
}

export function usePWAInstall() {
  // Re-render this consumer whenever the shared state changes.
  const [, forceRender] = useState(0)
  useEffect(() => {
    const cb = () => forceRender((n) => n + 1)
    subscribers.add(cb)
    return () => subscribers.delete(cb)
  }, [])

  const standalone = isStandalone()
  const canInstall = !installed && !standalone && Boolean(deferredPrompt)

  const triggerInstall = async () => {
    if (!deferredPrompt) return null
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    deferredPrompt = null
    if (outcome === 'accepted') installed = true
    notify()
    return outcome
  }

  return { canInstall, isStandalone: standalone, triggerInstall }
}
