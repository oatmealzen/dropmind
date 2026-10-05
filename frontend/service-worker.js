const CACHE_NAME = "dropmind-shell-v2";

const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/css/dropmind.css",
  "/config.js",
  "/js/app/dropmind-app.js",
  "/dany-framework/frontend/core/selection-manager.js",
  "/dany-framework/frontend/data/api-client.js",
  "/dany-framework/frontend/interaction/long-press.js",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") {
    return;
  }

  if (event.request.url.includes("/api/")) {
    return; // Non tocchiamo le API
  }

  event.respondWith(
    fetch(event.request)
      .then(response => {
        const copy = response.clone();

        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, copy);
        });

        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
