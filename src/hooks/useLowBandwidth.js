import { useState, useEffect, useCallback, useRef } from 'react'

export function useLowBandwidth() {
  // navigator.connection is a stable object reference; hold it in a ref so
  // useCallback and useEffect dependency arrays stay empty/stable.
  const connectionRef = useRef(
    typeof navigator !== 'undefined' ? navigator.connection : undefined
  )

  const getState = useCallback(() => {
    const conn = connectionRef.current
    if (!conn) return { isLowBandwidth: false, saveData: false }
    const effectiveType = conn.effectiveType || ''
    return {
      isLowBandwidth: effectiveType === '2g' || effectiveType === 'slow-2g',
      saveData: conn.saveData === true,
    }
  }, [])

  const [state, setState] = useState(getState)

  useEffect(() => {
    const conn = connectionRef.current
    if (!conn) return
    const handler = () => setState(getState())
    conn.addEventListener('change', handler)
    return () => conn.removeEventListener('change', handler)
  }, [getState])

  return state
}
