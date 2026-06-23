import { useState, useEffect, useCallback } from 'react'
import { useLowBandwidth } from './useLowBandwidth'

const LITE_KEY = 'abakada_lite_mode' // 'auto' | 'on' | 'off'
const EVENT = 'abakada:lite-mode'

function readPref() {
  try {
    const v = localStorage.getItem(LITE_KEY)
    return v === 'on' || v === 'off' ? v : 'auto'
  } catch { return 'auto' }
}

function writePref(v) {
  try { localStorage.setItem(LITE_KEY, v) } catch { /* private mode */ }
  try { window.dispatchEvent(new Event(EVENT)) } catch { /* no-op */ }
}

/**
 * Lite mode = a deliberate low-data / low-end-device experience. It is ON when
 * the user explicitly turns it on, OR ('auto') when the device reports Save-Data
 * or a 2G-class connection. Disabling heavy visuals (carousel, decorative
 * backgrounds, blur, large motion) cuts both bytes and render cost on cheap
 * phones — the core audience.
 *
 * @returns {{ liteMode: boolean, pref: 'auto'|'on'|'off', setPref: Function, auto: boolean }}
 */
export function useLiteMode() {
  const { isLowBandwidth, saveData } = useLowBandwidth()
  const [pref, setPrefState] = useState(readPref)

  // Keep in sync if another component (e.g. the dashboard toggle) changes it.
  useEffect(() => {
    const sync = () => setPrefState(readPref())
    window.addEventListener(EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  const auto = isLowBandwidth || saveData
  const liteMode = pref === 'on' || (pref === 'auto' && auto)

  const setPref = useCallback((v) => {
    setPrefState(v)
    writePref(v)
  }, [])

  return { liteMode, pref, setPref, auto }
}
