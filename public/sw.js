// Service worker: keeps the app installable + offline-capable WITHOUT serving
// stale data. Network-first for same-origin; cross-origin (Supabase API,
// external images) is never intercepted so live data is always fresh.
const CACHE = "bindu-v2";
const APP_SHELL = ["/", "/index.html", "/manifest.webmanifest"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
      )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Never touch cross-origin requests (Supabase REST API, external images).
  // Letting them go straight to the network guarantees live, fresh data.
  if (url.origin !== self.location.origin) return;

  // Same-origin (app shell, JS/CSS, poster SVGs): network-first with a cache
  // fallback — always fresh when online, still works offline.
  event.respondWith(
    fetch(request)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(request, copy));
        return res;
      })
      .catch(() =>
        caches.match(request).then((cached) => cached || caches.match("/index.html"))
      )
  );
});
