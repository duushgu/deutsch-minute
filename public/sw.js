const CACHE_NAME = 'deutsch-minute-v18';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './404.html',
  './manifest.webmanifest',
  './tomoo.webmanifest',
  './jijgee.webmanifest',
  './mongonchimeg.webmanifest',
  './tomoo/index.html',
  './jijgee/index.html',
  './mongonchimeg/index.html',
  './icon-192.svg',
  './icon-512.svg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.allSettled(
        ASSETS_TO_CACHE.map((url) => cache.add(url).catch(() => {}))
      );
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // 1. NEVER intercept non-GET requests (e.g. Firebase PUT/POST calls)
  if (event.request.method !== 'GET') {
    return;
  }

  // 2. NEVER intercept external API calls (e.g. Firebase RTDB, Google TTS)
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  const url = new URL(event.request.url);
  const isNavigation =
    event.request.mode === 'navigate' ||
    event.request.headers.get('accept')?.includes('text/html');

  // 3. Navigation / HTML requests: Network First, fallback to cache
  if (isNavigation) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          // If server returned 404 for /assets/ or broken path, recover gracefully
          if (networkResponse.status === 404 && url.pathname.includes('/assets')) {
            return caches.match('./404.html').then((fallback) => fallback || Response.redirect(self.location.origin + '/deutsch-minute/', 302));
          }
          if (networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          return caches.match(event.request).then((cached) => {
            if (cached) return cached;
            if (url.pathname.includes('tomoo')) {
              return caches.match('./tomoo/index.html');
            }
            if (url.pathname.includes('jijgee')) {
              return caches.match('./jijgee/index.html');
            }
            if (url.pathname.includes('mongonchimeg')) {
              return caches.match('./mongonchimeg/index.html');
            }
            return caches.match('./index.html');
          });
        })
    );
    return;
  }

  // 4. Audio files: Cache First, fetch and store if missing
  if (url.pathname.includes('/audio/')) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((networkResponse) => {
          if (networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // 5. Static assets (JS, CSS, SVGs): Stale-While-Revalidate
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => cached);

      return cached || fetchPromise;
    })
  );
});
