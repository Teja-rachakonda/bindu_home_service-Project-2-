// Self-destructing service worker. A live sales tool must always show fresh
// data, so we no longer cache anything. This SW unregisters itself and clears
// every cache, then reloads open tabs — undoing any previously-installed SW
// on visitors' devices automatically.
self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
      await self.registration.unregister();
      const clients = await self.clients.matchAll({ type: "window" });
      clients.forEach((c) => c.navigate(c.url));
    })()
  );
});

// Pass-through: never intercept, never cache.
self.addEventListener("fetch", () => {});
