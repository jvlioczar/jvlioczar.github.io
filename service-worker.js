/* BiblioVerse — service worker único (escopo /), cobre o hub e todas as bibliotecas.
   Rede primeiro, cache como reserva: o conteúdo nunca fica velho quando há conexão. */
const VERSION = 'bv-2026-11-07';
const SHELL = ['/', '/styles.css', '/script.js', '/superbar.js', '/manifest.webmanifest'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL).catch(() => {})).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;
  e.respondWith(
    fetch(req).then(res => {
      if (res && res.ok) { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); }
      return res;
    }).catch(async () => {
      const hit = await caches.match(req);
      if (hit) return hit;
      if (req.mode === 'navigate') {
        // página da biblioteca ainda não visitada offline: tenta a raiz da pasta, depois o hub
        const dir = url.pathname.replace(/[^/]*$/, '');
        return (await caches.match(dir)) || (await caches.match('/')) || Response.error();
      }
      return Response.error();
    })
  );
});
