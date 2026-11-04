// ARGO MOSAIC service worker — scoped to /Argo-Mosaic/ only.
const APP_BASE = '/Argo-Mosaic/';
const CACHE_PREFIX = 'argo-mosaic-';
const CACHE_NAME = CACHE_PREFIX + 'v2';
const APP_SHELL = [
  APP_BASE,
  APP_BASE + 'index.html',
  APP_BASE + 'manifest.json',
  APP_BASE + 'assets/aistudio/Argo_Mosaic_Logo_Transparente_0aa6f2ad.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
        .map((key) => caches.delete(key))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin || !url.pathname.startsWith(APP_BASE)) return;
  if (url.pathname.startsWith(APP_BASE + 'api/') || url.pathname.startsWith(APP_BASE + 'uploads/')) return;

  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).catch(() => caches.match(APP_BASE + 'index.html')));
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => {
      if (response.ok && event.request.method === 'GET') {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
      }
      return response;
    }))
  );
});
