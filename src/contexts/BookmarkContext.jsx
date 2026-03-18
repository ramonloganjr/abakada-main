import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useI18n } from './I18nContext'

const STORAGE_KEY = 'abakada_bookmarks'

const BookmarkContext = createContext(null)

// Queue a bookmark operation to IndexedDB for background sync (Req 6.1)
async function queueBookmarkOp(toolId, action) {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('abakada-sync-db', 1)
    req.onupgradeneeded = (e) => {
      e.target.result.createObjectStore('bookmark-queue', { keyPath: 'id' })
    }
    req.onsuccess = (e) => {
      const db = e.target.result
      const tx = db.transaction('bookmark-queue', 'readwrite')
      const store = tx.objectStore('bookmark-queue')
      const op = { id: crypto.randomUUID(), toolId, action }
      const addReq = store.add(op)
      addReq.onsuccess = () => resolve()
      addReq.onerror = (err) => reject(err.target.error)
    }
    req.onerror = (e) => reject(e.target.error)
  })
}

function safeLocalStorage() {
  try {
    localStorage.setItem('__test__', '1')
    localStorage.removeItem('__test__')
    return {
      get: () => {
        try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } catch { return [] }
      },
      set: (val) => {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(val)) } catch {}
      },
      available: true,
    }
  } catch {
    return { get: () => [], set: () => {}, available: false }
  }
}

export function BookmarkProvider({ children }) {
  const { t } = useI18n()
  const [storage] = useState(() => safeLocalStorage())
  const [bookmarks, setBookmarks] = useState(() => storage.get())
  const [storageUnavailable] = useState(!storage.available)
  const [noticeDismissed, setNoticeDismissed] = useState(false)

  useEffect(() => {
    storage.set(bookmarks)
  }, [bookmarks, storage])

  const addBookmark = useCallback((id) => {
    // Optimistic state update regardless of online/offline status
    setBookmarks(prev => prev.includes(id) ? prev : [...prev, id])

    // If offline and Background Sync is supported, queue for later sync (Req 6.1)
    if (!navigator.onLine && 'serviceWorker' in navigator && 'SyncManager' in window) {
      queueBookmarkOp(id, 'add')
        .then(() => navigator.serviceWorker.ready.then(reg => reg.sync.register('abakada-bookmark-sync')))
        .catch(() => {
          // Fallback: synchronous localStorage update already handled by useEffect
        })
    }
    // Otherwise: synchronous behavior via useEffect (Req 6.3)
  }, [])

  const removeBookmark = useCallback((id) => {
    // Optimistic state update regardless of online/offline status
    setBookmarks(prev => prev.filter(b => b !== id))

    // If offline and Background Sync is supported, queue for later sync (Req 6.1)
    if (!navigator.onLine && 'serviceWorker' in navigator && 'SyncManager' in window) {
      queueBookmarkOp(id, 'remove')
        .then(() => navigator.serviceWorker.ready.then(reg => reg.sync.register('abakada-bookmark-sync')))
        .catch(() => {
          // Fallback: synchronous localStorage update already handled by useEffect
        })
    }
    // Otherwise: synchronous behavior via useEffect (Req 6.3)
  }, [])

  const isBookmarked = useCallback((id) => {
    return bookmarks.includes(id)
  }, [bookmarks])

  return (
    <BookmarkContext.Provider value={{ bookmarks, addBookmark, removeBookmark, isBookmarked }}>
      {storageUnavailable && !noticeDismissed && (
        <div className="storage-notice" role="alert">
          <span>{t('bookmark.storageUnavailable', "Bookmarks won't be saved — storage is unavailable in this session")}</span>
          <button
            type="button"
            className="storage-notice__dismiss"
            aria-label={t('common.dismiss', 'Dismiss')}
            onClick={() => setNoticeDismissed(true)}
          >
            ×
          </button>
        </div>
      )}
      {children}
    </BookmarkContext.Provider>
  )
}

export function useBookmarks() {
  const ctx = useContext(BookmarkContext)
  if (!ctx) throw new Error('useBookmarks must be used within a BookmarkProvider')
  return ctx
}
