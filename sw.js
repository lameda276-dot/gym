// sw.js — hace que la app abra sin señal (el gym es sótano para el 4G).
// Estrategia: red primero, cache de respaldo. Así en casa con wifi siempre
// baja la última versión y en el gym sin datos abre igual la última que vio.
const CACHE = "gym-v3";
const ARCHIVOS = ["./", "./index.html", "./manifest.json", "./icon-180.png"];

// Fotos de la guía de ejercicios: caché aparte que sobrevive a las versiones (no cambian),
// y se bajan todas al activar, así funcionan en el gym aunque nunca se hayan abierto.
const FOTOS = "gym-fotos-1";
const LISTA_FOTOS = [
  "Barbell_Bench_Press_-_Medium_Grip_0.jpg",
  "Barbell_Bench_Press_-_Medium_Grip_1.jpg",
  "Butterfly_0.jpg",
  "Butterfly_1.jpg",
  "Cable_Rope_Overhead_Triceps_Extension_0.jpg",
  "Cable_Rope_Overhead_Triceps_Extension_1.jpg",
  "Calf_Press_On_The_Leg_Press_Machine_0.jpg",
  "Calf_Press_On_The_Leg_Press_Machine_1.jpg",
  "Dumbbell_Bicep_Curl_0.jpg",
  "Dumbbell_Bicep_Curl_1.jpg",
  "Dumbbell_Shrug_0.jpg",
  "Dumbbell_Shrug_1.jpg",
  "Flat_Bench_Lying_Leg_Raise_0.jpg",
  "Flat_Bench_Lying_Leg_Raise_1.jpg",
  "Front_Dumbbell_Raise_0.jpg",
  "Front_Dumbbell_Raise_1.jpg",
  "Goblet_Squat_0.jpg",
  "Goblet_Squat_1.jpg",
  "Hammer_Curls_0.jpg",
  "Hammer_Curls_1.jpg",
  "Incline_Dumbbell_Press_0.jpg",
  "Incline_Dumbbell_Press_1.jpg",
  "Leg_Extensions_0.jpg",
  "Leg_Extensions_1.jpg",
  "Leg_Press_0.jpg",
  "Leg_Press_1.jpg",
  "Leverage_Iso_Row_0.jpg",
  "Leverage_Iso_Row_1.jpg",
  "Leverage_Shoulder_Press_0.jpg",
  "Leverage_Shoulder_Press_1.jpg",
  "Lying_Leg_Curls_0.jpg",
  "Lying_Leg_Curls_1.jpg",
  "Plank_0.jpg",
  "Plank_1.jpg",
  "Reverse_Machine_Flyes_0.jpg",
  "Reverse_Machine_Flyes_1.jpg",
  "Side_Lateral_Raise_0.jpg",
  "Side_Lateral_Raise_1.jpg",
  "Stiff-Legged_Dumbbell_Deadlift_0.jpg",
  "Stiff-Legged_Dumbbell_Deadlift_1.jpg",
  "Tricep_Dumbbell_Kickback_0.jpg",
  "Tricep_Dumbbell_Kickback_1.jpg",
  "Triceps_Pushdown_0.jpg",
  "Triceps_Pushdown_1.jpg",
  "Wide-Grip_Lat_Pulldown_0.jpg",
  "Wide-Grip_Lat_Pulldown_1.jpg"
].map(f => "./ej/" + f);

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARCHIVOS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  // borra caches de versiones anteriores, si no la app se queda congelada en una vieja
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k !== CACHE && k !== FOTOS).map(k => caches.delete(k))))
    .then(() => self.clients.claim())
    .then(() => bajarFotos()));
});

// solo las que faltan; si no hay red se intenta otra vez en la próxima activación o al verlas
function bajarFotos() {
  return caches.open(FOTOS).then(c => Promise.all(LISTA_FOTOS.map(u =>
    c.match(u).then(r => r || fetch(u).then(x => { if (x.ok) return c.put(u, x); }).catch(() => {}))
  ))).catch(() => {});
}

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  if (url.origin === location.origin && url.pathname.includes("/ej/")) {
    e.respondWith(caches.open(FOTOS).then(c => c.match(e.request).then(r => r || fetch(e.request).then(x => {
      if (x.ok) c.put(e.request, x.clone());
      return x;
    }))));
    return;
  }
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
