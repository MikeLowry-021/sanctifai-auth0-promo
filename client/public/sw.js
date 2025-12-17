const CACHE_NAME = 'sanctifai-v1.1';
const RUNTIME_CACHE = 'sanctifai-runtime';

// Minimal assets to cache for offline shell
const PRECACHE_ASSETS = [
  '/',
  '/offline.html',
  '/logo-full.png',
  '/logo-icon.png',
  '/cover-banner.png'
];

// Install event - precache core assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== RUNTIME_CACHE)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - network-first strategy with runtime cache fallback
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  // Skip API calls - always use network
  if (event.request.url.includes('/api/')) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clone response to cache it
        const responseToCache = response.clone();
        caches.open(RUNTIME_CACHE).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return response;
      })
      .catch(() => {
        // Network failed, try cache
        return caches.match(event.request).then((cached) => {
          if (cached) return cached;
          
          // If still no match, return offline page
          return caches.match('/offline.html');
        });
      })
  );
});
