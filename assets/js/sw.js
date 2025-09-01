const CACHE_NAME = "bmi-calculator-v1.0.0";
const urlsToCache = [
  "/",
  "assets/css/styles.css",
  "assets/js/script.js",
  "assets/icons/favicon.png",
  "assets/icons/favicon.svg",
  "manifest.json",
  // Add other important assets
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached version or fetch from network
      return response || fetch(event.request);
    })
  );
});
