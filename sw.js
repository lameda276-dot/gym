// sw.js — hace que la app abra sin señal (el gym es sótano para el 4G).
// Estrategia: red primero, cache de respaldo. Así en casa con wifi siempre
// baja la última versión y en el gym sin datos abre igual la última que vio.
const CACHE = "gym-v2";
const ARCHIVOS = ["./", "./index.html", "./manifest.json", "./icon-180.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARCHIVOS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  // borra caches de versiones anteriores, si no la app se queda congelada en una vieja
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request)
      .then(r => {
        const copia = r.clone();
        caches.open(CACHE).then(c => c.put(e.request, copia)).catch(() => {});
        return r;
      })
      .catch(() => caches.match(e.request).then(r => r || caches.match("./index.html")))
  );
});
