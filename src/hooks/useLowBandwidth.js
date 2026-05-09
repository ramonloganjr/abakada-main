import { useState, useEffect } from 'react'

export function useLowBandwidth() {
  const connection = typeof navigator !== 'undefined' ? navigator.connection : undefined

  const getState = () => {
    if (!connection) return { isLowBandwidth: false, saveData: false }
    const effectiveType = connection.effectiveType || ''
    return {
      isLowBandwidth: effectiveType === '2g' || effectiveType === 'slow-2g',
      saveData: connection.saveData === true,
    }
  }

  const [state, setState] = useState(getState)

  useEffect(() => {
    if (!connection) return
    const handler = () => setState(getState())
    connection.addEventListener('change', handler)
    return () => connection.removeEventListener('change', handler)
  }, [])

  return state
}
