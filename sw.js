// Service Worker for CARB VIN Check PWA
const CACHE_NAME = 'carb-vin-check-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/apple-touch-icon.png'
];

// Install event - cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache.map(url => new Request(url, { cache: 'no-cache' })))
          .catch(err => {
            console.error('Cache addAll error:', err.message);
            console.error('Failed to cache one or more resources. App may not work fully offline.');
            // Don't fail installation if some resources can't be cached
            return Promise.resolve();
          });
      })
      .catch(err => {
        console.error('Failed to open cache during install:', err.message);
        // Log but continue - app will work without cache
        return Promise.resolve();
      })
  );
  self.skipWaiting();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        // Fetch from network
        return fetch(event.request)
          .then(response => {
            // Check if valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            // Cache the new response (with error handling)
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              })
              .catch(err => {
                console.error('Failed to cache response:', err.message);
                // Continue without caching - non-critical error
              });

            return response;
          })
          .catch(err => {
            console.error('Fetch failed for', event.request.url, ':', err.message);
            // Return a fallback response for offline scenarios
            return new Response(
              JSON.stringify({
                error: 'Network request failed',
                message: 'You appear to be offline. Please check your connection.',
                offline: true
              }),
              {
                status: 503,
                statusText: 'Service Unavailable',
                headers: {'Content-Type': 'application/json'}
              }
            );
          });
      })
      .catch(err => {
        console.error('Cache match failed for', event.request.url, ':', err.message);
        // If cache fails, try network directly
        return fetch(event.request).catch(fetchErr => {
          console.error('Network fetch also failed:', fetchErr.message);
          return new Response(
            JSON.stringify({
              error: 'Service unavailable',
              message: 'Unable to retrieve cached or fresh content.',
              offline: true
            }),
            {
              status: 503,
              statusText: 'Service Unavailable',
              headers: {'Content-Type': 'application/json'}
            }
          );
        });
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName).catch(err => {
                console.error('Failed to delete cache', cacheName, ':', err.message);
                // Continue activation even if cache deletion fails
                return Promise.resolve();
              });
            }
          })
        );
      })
      .catch(err => {
        console.error('Failed to retrieve cache keys during activation:', err.message);
        // Continue activation even if cache cleanup fails
        return Promise.resolve();
      })
  );
  self.clients.claim();
});
