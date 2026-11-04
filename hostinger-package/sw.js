// ARGO MOSAIC service worker. All paths and cache entries are scoped to this app.
const APP_BASE = '/Argo-Mosaic/';
const CACHE_PREFIX = 'argo-mosaic-';
const CACHE_NAME = 'argo-mosaic-v2';
const APP_SHELL = [
  APP_BASE,
  APP_BASE + 'index.html',
  APP_BASE + 'manifest.json',
  APP_BASE + 'assets/aistudio/Argo_Mosaic_Logo_Transparente_0aa6f2ad.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .catch((error) => {
        // A missing optional shell asset must not prevent the app from updating.
        console.warn('ARGO MOSAIC app-shell cache skipped:', error);
      })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys
        .filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
        .map((key) => caches.delete(key))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Never cache API calls, uploads, mutations, or cross-origin requests.
  if (
    request.method !== 'GET' ||
    url.origin !== self.location.origin ||
    url.pathname.startsWith(APP_BASE + 'api/') ||
    url.pathname.startsWith(APP_BASE + 'uploads/')
  ) return;

  // App navigation is network-first so users do not get a stale blank shell.
  if (request.mode === 'navigate' && url.pathname.startsWith(APP_BASE)) {
    event.respondWith(
      fetch(request).then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(APP_BASE + 'index.html', copy));
        }
        return response;
      }).catch(async () => {
        const cache = await caches.open(CACHE_NAME);
        return (await cache.match(APP_BASE + 'index.html')) || Response.error();
      })
    );
    return;
  }

  // Cache app assets, refresh them from the network, and fall back only to this app's cache.
  if (url.pathname.startsWith(APP_BASE)) {
    event.respondWith(
      fetch(request).then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return response;
      }).catch(async () => {
        const cache = await caches.open(CACHE_NAME);
        return (await cache.match(request)) || Response.error();
      })
    );
  }
});
