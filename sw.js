// sw.js — hace que la app abra sin señal (el gym es sótano para el 4G).
// Estrategia: red primero, cache de respaldo. Así en casa con wifi siempre
// baja la última versión y en el gym sin datos abre igual la última que vio.
const CACHE = "gym-v4";
const ARCHIVOS = ["./", "./index.html", "./arsenal.js", "./manifest.json", "./icon-180.png"];

// Fotos de la guía: caché aparte que sobrevive a las versiones (no cambian).
// Al activar se bajan las de la rutina y las miniaturas del arsenal (~0,5 MB), así el gym
// funciona sin señal; las demás fotos del arsenal se guardan la primera vez que se abren,
// y al cambiar un ejercicio la app pide las suyas para que queden guardadas.
const FOTOS = "gym-fotos-1";
const RUTINA_IDS = ["Barbell_Bench_Press_-_Medium_Grip", "Butterfly", "Cable_Rope_Overhead_Triceps_Extension", "Calf_Press_On_The_Leg_Press_Machine", "Dumbbell_Bicep_Curl", "Dumbbell_Shrug", "Flat_Bench_Lying_Leg_Raise", "Front_Dumbbell_Raise", "Goblet_Squat", "Hammer_Curls", "Incline_Dumbbell_Press", "Leg_Extensions", "Leg_Press", "Leverage_Shoulder_Press", "Lying_Leg_Curls", "Lying_T-Bar_Row", "Plank", "Reverse_Machine_Flyes", "Side_Lateral_Raise", "Stiff-Legged_Dumbbell_Deadlift", "Tricep_Dumbbell_Kickback", "Triceps_Pushdown", "Wide-Grip_Lat_Pulldown"];
const ARSENAL_IDS = ["Ab_Crunch_Machine", "Ab_Roller", "Air_Bike", "Arnold_Dumbbell_Press", "Barbell_Bench_Press_-_Medium_Grip", "Barbell_Curl", "Barbell_Deadlift", "Barbell_Glute_Bridge", "Barbell_Hip_Thrust", "Barbell_Incline_Bench_Press_-_Medium_Grip", "Barbell_Lunge", "Barbell_Shrug", "Barbell_Squat", "Barbell_Walking_Lunge", "Bench_Dips", "Bent_Over_Barbell_Row", "Bent_Over_Two-Arm_Long_Bar_Row", "Bent_Over_Two-Dumbbell_Row", "Bodyweight_Squat", "Bodyweight_Walking_Lunge", "Box_Squat", "Butterfly", "Cable_Chest_Press", "Cable_Crossover", "Cable_Crunch", "Cable_Hammer_Curls_-_Rope_Attachment", "Cable_Lying_Triceps_Extension", "Cable_One_Arm_Tricep_Extension", "Cable_Rear_Delt_Fly", "Cable_Rope_Overhead_Triceps_Extension", "Cable_Shoulder_Press", "Cable_Shrugs", "Calf_Press", "Calf_Press_On_The_Leg_Press_Machine", "Chin-Up", "Close-Grip_Barbell_Bench_Press", "Close-Grip_Dumbbell_Press", "Close-Grip_Front_Lat_Pulldown", "Concentration_Curls", "Cross_Body_Hammer_Curl", "Crunches", "Dead_Bug", "Decline_Barbell_Bench_Press", "Decline_Crunch", "Decline_Dumbbell_Bench_Press", "Dip_Machine", "Dips_-_Chest_Version", "Dips_-_Triceps_Version", "Drag_Curl", "Dumbbell_Alternate_Bicep_Curl", "Dumbbell_Bench_Press", "Dumbbell_Bicep_Curl", "Dumbbell_Flyes", "Dumbbell_Incline_Row", "Dumbbell_Lunges", "Dumbbell_Rear_Lunge", "Dumbbell_Seated_One-Leg_Calf_Raise", "Dumbbell_Shoulder_Press", "Dumbbell_Shrug", "Dumbbell_Side_Bend", "Dumbbell_Squat", "Dumbbell_Step_Ups", "EZ-Bar_Skullcrusher", "External_Rotation_with_Cable", "Face_Pull", "Flat_Bench_Cable_Flyes", "Flat_Bench_Leg_Pull-In", "Flat_Bench_Lying_Leg_Raise", "Front_Cable_Raise", "Front_Dumbbell_Raise", "Front_Plate_Raise", "Front_Squat_Clean_Grip", "Glute_Kickback", "Goblet_Squat", "Good_Morning", "Hack_Squat", "Hammer_Curls", "Hammer_Grip_Incline_DB_Bench_Press", "Hanging_Leg_Raise", "High_Cable_Curls", "Hyperextensions_Back_Extensions", "Incline_Cable_Flye", "Incline_Dumbbell_Curl", "Incline_Dumbbell_Flyes", "Incline_Dumbbell_Press", "Inverted_Row", "Leg_Extensions", "Leg_Press", "Leverage_Chest_Press", "Leverage_High_Row", "Leverage_Incline_Chest_Press", "Leverage_Iso_Row", "Leverage_Shoulder_Press", "Low_Cable_Crossover", "Lying_Dumbbell_Tricep_Extension", "Lying_Leg_Curls", "Lying_T-Bar_Row", "Machine_Bicep_Curl", "Machine_Preacher_Curls", "Machine_Shoulder_Military_Press", "Machine_Triceps_Extension", "Narrow_Stance_Leg_Press", "Oblique_Crunches", "One-Arm_Dumbbell_Row", "One-Arm_Side_Laterals", "One-Legged_Cable_Kickback", "One_Arm_Lat_Pulldown", "Pallof_Press", "Plank", "Plie_Dumbbell_Squat", "Preacher_Curl", "Pull_Through", "Pullups", "Push-Ups_-_Close_Triceps_Position", "Push-Ups_With_Feet_Elevated", "Pushups", "Rack_Pulls", "Reverse_Barbell_Curl", "Reverse_Crunch", "Reverse_Flyes", "Reverse_Grip_Triceps_Pushdown", "Reverse_Machine_Flyes", "Romanian_Deadlift", "Rope_Straight-Arm_Pulldown", "Russian_Twist", "Seated_Bent-Over_Rear_Delt_Raise", "Seated_Cable_Rows", "Seated_Calf_Raise", "Seated_Dumbbell_Press", "Seated_Leg_Curl", "Seated_One-arm_Cable_Pulley_Rows", "Seated_Side_Lateral_Raise", "Seated_Triceps_Press", "Side_Bridge", "Side_Lateral_Raise", "Single-Leg_Leg_Extension", "Single_Leg_Glute_Bridge", "Smith_Machine_Bench_Press", "Smith_Machine_Bent_Over_Row", "Smith_Machine_Calf_Raise", "Smith_Machine_Incline_Bench_Press", "Smith_Machine_Leg_Press", "Smith_Machine_Overhead_Shoulder_Press", "Smith_Machine_Squat", "Smith_Machine_Stiff-Legged_Deadlift", "Spider_Curl", "Split_Squat_with_Dumbbells", "Standing_Barbell_Calf_Raise", "Standing_Biceps_Cable_Curl", "Standing_Cable_Wood_Chop", "Standing_Calf_Raises", "Standing_Dumbbell_Calf_Raise", "Standing_Dumbbell_Triceps_Extension", "Standing_Dumbbell_Upright_Row", "Standing_Leg_Curl", "Standing_Low-Pulley_Deltoid_Raise", "Standing_Military_Press", "Stiff-Legged_Barbell_Deadlift", "Stiff-Legged_Dumbbell_Deadlift", "Straight-Arm_Dumbbell_Pullover", "Straight-Arm_Pulldown", "Sumo_Deadlift", "T-Bar_Row_with_Handle", "Thigh_Abductor", "Thigh_Adductor", "Tricep_Dumbbell_Kickback", "Triceps_Pushdown", "Triceps_Pushdown_-_Rope_Attachment", "Triceps_Pushdown_-_V-Bar_Attachment", "Underhand_Cable_Pulldowns", "Upright_Barbell_Row", "V-Bar_Pulldown", "Wide-Grip_Barbell_Bench_Press", "Wide-Grip_Lat_Pulldown", "Zottman_Curl"];
const LISTA_FOTOS = RUTINA_IDS.flatMap(i => ["./ej/" + i + "_0.jpg", "./ej/" + i + "_1.jpg"])
  .concat(ARSENAL_IDS.map(i => "./ej/t/" + i + ".jpg"));

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
