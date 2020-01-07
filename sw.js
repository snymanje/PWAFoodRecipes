// install service worker
// self inside the SW refers to itself the SW

const staticCacheName = "site-static";
const assets = [
  "/",
  "/index.html",
  "/pages/about.html",
  "/pages/contact.html",
  "/js/app.js",
  "/js/ui.js",
  "/js/materialize.min.js",
  "/css/styles.css",
  "/css/materialize.min.css",
  "/img/dish.png",
  "https://fonts.googleapis.com/icon?family=Material+Icons",
  "https://fonts.gstatic.com/s/materialicons/v48/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2"
];

self.addEventListener("install", evt => {
  //console.log('Service Worker now installed!', event)
  evt.waitUntil(
    caches
      .open(staticCacheName)
      .then(cache => {
        // Adds a single item
        // cache.add()
        cache.addAll(assets);
      })
      .catch(err => {
        console.log(err);
      })
  );
});

// listen for the activate event
self.addEventListener("activate", evt => {
  console.log("Service Worker now activated!", evt);
});

// fetch events
self.addEventListener("fetch", evt => {
  //console.log("fetch event", evt);
  evt.respondWith(
    caches.match(evt.request).then(cacheRes => {
      return cacheRes || fetch(evt.request);
    })
  );
});
