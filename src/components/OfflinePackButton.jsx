import { useState, useEffect, useCallback } from 'react'
import { useI18n } from '../contexts/I18nContext'
import { useLowBandwidth } from '../hooks/useLowBandwidth'
import Icon from './Icon'
import {
  offlineSupported,
  computePackUrls,
  estimatePackBytes,
  formatBytes,
  downloadPack,
  removePack,
} from '../lib/offlinePacks'
import { getPacks, onChange } from '../lib/progressStore'

/**
 * "Download this path for offline learning" control. Caches every page + data
 * file the pathway needs into a durable bucket so the learner can study with no
 * connection. Resilient and honest: shows the estimated size up front (it
 * matters on 2G), real progress while downloading, and a remove option after.
 */
export default function OfflinePackButton({ toolkit }) {
  const { t, lang } = useI18n()
  const { isLowBandwidth, saveData } = useLowBandwidth()
  const [pack, setPack] = useState(() => getPacks()[toolkit?.id] || null)
  const [progress, setProgress] = useState(null) // { done, total } while downloading
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(false)

  // Keep in sync with the registry (e.g. removed from the dashboard).
  useEffect(() => onChange(() => setPack(getPacks()[toolkit?.id] || null)), [toolkit?.id])

  const estBytes = estimatePackBytes(computePackUrls(toolkit, lang))

  const handleDownload = useCallback(async () => {
    if (busy) return
    setBusy(true)
    setError(false)
    setProgress({ done: 0, total: 1 })
    try {
      const res = await downloadPack(toolkit, {
        lang,
        onProgress: (done, total) => setProgress({ done, total }),
      })
      if (!res.ok) setError(true)
    } catch {
      setError(true)
    } finally {
      setBusy(false)
      setProgress(null)
    }
  }, [busy, toolkit, lang])

  const handleRemove = useCallback(async () => {
    setBusy(true)
    try { await removePack(toolkit.id) } finally { setBusy(false) }
  }, [toolkit])

  if (!offlineSupported()) return null

  // Downloaded state.
  if (pack && !busy) {
    return (
      <div className="offline-pack offline-pack--ready">
        <span className="offline-pack__status">
          <Icon name="check-circle" collection="ui" size={16} />
          <span>
            <strong>{t('learningPaths.availableOffline', 'Available offline')}</strong>
            <span className="offline-pack__meta"> · {formatBytes(pack.bytes || estBytes)}</span>
          </span>
        </span>
        <button type="button" className="offline-pack__remove" onClick={handleRemove}>
          {t('learningPaths.removeDownload', 'Remove')}
        </button>
      </div>
    )
  }

  // Downloading state.
  if (busy && progress) {
    const pct = progress.total ? Math.round((progress.done / progress.total) * 100) : 0
    return (
      <div className="offline-pack offline-pack--busy" aria-live="polite">
        <div className="offline-pack__progress" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
          <div className="offline-pack__progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <span className="offline-pack__busy-label">
          <Icon name="download" collection="ui" size={14} />
          {t('learningPaths.downloading', 'Downloading…')} {pct}%
        </span>
      </div>
    )
  }

  // Idle / offer state.
  return (
    <div className="offline-pack">
      <button type="button" className="offline-pack__btn btn btn--secondary btn--sm" onClick={handleDownload} disabled={busy}>
        <Icon name="download" collection="ui" size={14} />
        {t('learningPaths.downloadForOffline', 'Download for offline')}
        <span className="offline-pack__size">~{formatBytes(estBytes)}</span>
      </button>
      {(isLowBandwidth || saveData) && (
        <p className="offline-pack__hint">
          <Icon name="info" collection="ui" size={12} />
          {t('learningPaths.offlineHintSlow', 'On a slow connection? Download once on Wi-Fi, then learn anywhere.')}
        </p>
      )}
      {error && (
        <p className="offline-pack__error" role="alert">
          {t('learningPaths.downloadError', 'Some files could not be saved. Check your connection and try again.')}
        </p>
      )}
    </div>
  )
}
