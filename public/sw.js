const CACHE_NAME = 'abakada-v2';
// Bump CACHE_NAME on every deploy to invalidate stale caches.
// In a CI/CD pipeline, inject the build hash here automatically.

// App shell assets to pre-cache on install
const APP_SHELL = [
  '/',
  '/index.html',
  '/offline.html',
  '/assets/fonts/inter-v13-latin-regular.woff2',
  '/assets/fonts/inter-v13-latin-500.woff2',
  '/assets/fonts/inter-v13-latin-600.woff2',
  '/assets/fonts/inter-v13-latin-700.woff2',
];

// Install: pre-cache app shell and activate immediately
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

// Activate: claim clients and purge stale caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: route requests to the appropriate caching strategy
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  const pathname = url.pathname;

  // Stale-while-revalidate for tools.json (Req 3.4, 2.5)
  if (pathname.endsWith('tools.json')) {
    event.respondWith(staleWhileRevalidate(event.request));
    return;
  }

  // Cache-first for pre-cached app shell and static assets (Req 2.2)
  if (
    APP_SHELL.includes(pathname) ||
    pathname.startsWith('/assets/fonts/') ||
    pathname.match(/\.(js|css)$/)
  ) {
    event.respondWith(cacheFirst(event.request));
    return;
  }

  // Network-first with cache fallback for everything else (Req 2.3, 2.4)
  event.respondWith(networkFirstWithFallback(event.request));
});

// Cache-first: serve from cache, fall back to network
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  if (response.ok) {
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, response.clone());
  }
  return response;
}

// Network-first: try network, fall back to cache, then offline page
async function networkFirstWithFallback(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;

    // Return offline fallback page
    const offlinePage = await caches.match('/offline.html');
    return offlinePage || new Response('You are offline.', {
      status: 503,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
}

// Background Sync: replay queued bookmark operations (Req 6.1, 6.2)
self.addEventListener('sync', (event) => {
  if (event.tag === 'abakada-bookmark-sync') {
    event.waitUntil(replayBookmarkQueue());
  }
});

function openSyncDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('abakada-sync-db', 1);
    req.onupgradeneeded = (e) => {
      e.target.result.createObjectStore('bookmark-queue', { keyPath: 'id' });
    };
    req.onsuccess = (e) => resolve(e.target.result);
    req.onerror = (e) => reject(e.target.error);
  });
}

async function replayBookmarkQueue() {
  const db = await openSyncDB();

  // Read all queued operations
  const ops = await new Promise((resolve, reject) => {
    const tx = db.transaction('bookmark-queue', 'readonly');
    const req = tx.objectStore('bookmark-queue').getAll();
    req.onsuccess = (e) => resolve(e.target.result);
    req.onerror = (e) => reject(e.target.error);
  });

  for (const op of ops) {
    // Apply the operation using Cache Storage as a proxy (SW can't access localStorage directly)
    // and notify clients to apply the updated bookmarks list to their localStorage
    try {
      const bookmarksCache = await caches.open(CACHE_NAME);
      const cachedResponse = await bookmarksCache.match('/__bookmarks__');
      let bookmarks = [];
      if (cachedResponse) {
        bookmarks = await cachedResponse.json();
      }

      if (op.action === 'add') {
        if (!bookmarks.includes(op.toolId)) bookmarks.push(op.toolId);
      } else if (op.action === 'remove') {
        bookmarks = bookmarks.filter((id) => id !== op.toolId);
      }

      await bookmarksCache.put(
        '/__bookmarks__',
        new Response(JSON.stringify(bookmarks), {
          headers: { 'Content-Type': 'application/json' },
        })
      );

      // Notify all clients to sync their localStorage
      const allClients = await self.clients.matchAll({ includeUncontrolled: true });
      for (const client of allClients) {
        client.postMessage({ type: 'BOOKMARK_SYNC', bookmarks });
      }
    } catch {
      // If replay fails, leave in queue to retry
      continue;
    }

    // Delete the operation from the queue after successful replay
    await new Promise((resolve, reject) => {
      const tx = db.transaction('bookmark-queue', 'readwrite');
      const req = tx.objectStore('bookmark-queue').delete(op.id);
      req.onsuccess = () => resolve();
      req.onerror = (e) => reject(e.target.error);
    });
  }
}

// Handle SKIP_WAITING message from the app to activate new SW immediately
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

// Stale-while-revalidate: serve cache immediately, refresh in background
async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);

  // Kick off background network fetch to update cache
  const networkFetch = fetch(request).then((response) => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(() => null);

  // Return cached version immediately if available, otherwise wait for network
  return cached || networkFetch;
}
