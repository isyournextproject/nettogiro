/* Service worker minimale: rete prima di tutto, cache solo come rete di sicurezza.
   Per un'app di calcolo fiscale è meglio rischiare "nessuna connessione" che
   mostrare per sbaglio una versione vecchia con percentuali superate. */
const CACHE = 'nettogiro-v2';
const SHELL = ['./', './index.html', './manifest.json',
               './icons/icon-192.png', './icons/icon-512.png',
               './avatars/av1.png','./avatars/av2.png','./avatars/av3.png','./avatars/av4.png',
               './avatars/av5.png','./avatars/av6.png','./avatars/av7.png','./avatars/av8.png'];

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
