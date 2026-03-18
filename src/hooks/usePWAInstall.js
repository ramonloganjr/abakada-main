import { useState, useEffect, useRef } from 'react'

export function usePWAInstall() {
  const deferredPrompt = useRef(null)

  const isStandalone =
    typeof window !== 'undefined' &&
    window.matchMedia('(display-mode: standalone)').matches

  const [canInstall, setCanInstall] = useState(false)

  useEffect(() => {
    if (isStandalone) return

    const handler = (e) => {
      e.preventDefault()
      deferredPrompt.current = e
      setCanInstall(true)
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [isStandalone])

  const triggerInstall = async () => {
    if (!deferredPrompt.current) return null
    deferredPrompt.current.prompt()
    const { outcome } = await deferredPrompt.current.userChoice
    deferredPrompt.current = null
    setCanInstall(false)
    return outcome
  }

  return { canInstall, isStandalone, triggerInstall }
}
