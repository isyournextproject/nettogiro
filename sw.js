/* Service worker minimale: rete prima di tutto, cache solo come rete di sicurezza.
   Per un'app di calcolo fiscale è meglio rischiare "nessuna connessione" che
   mostrare per sbaglio una versione vecchia con percentuali superate. */
const CACHE = 'nettogiro-v3';
const SHELL = ['./', './index.html', './manifest.json',
               './Icon/icon-192.png', './Icon/icon-512.png', './Icon/icon-512-maskable.png',
               './Avatar/av1.png','./Avatar/av2.png','./Avatar/av3.png','./Avatar/av4.png',
               './Avatar/av5.png','./Avatar/av6.png','./Avatar/av7.png','./Avatar/av8.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
  );
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
      return res;
    }).catch(() => caches.match(e.request))
  );
});
