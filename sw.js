// install service worker
// self inside the SW refers to itself the SW

const staticCacheName = "site-static-v2";
const assets = [
  "/",
  "/index.html",
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
  //console.log("Service Worker now activated!", evt);
  // Delete old caches
  evt.waitUntil(
    // get all the caches and delete old caches
    caches.keys().then(keys => {
      //console.log(keys);
      // deleting these keys is an async task so we need to return a promise
      return Promise.all(
        keys
          .filter(key => key !== staticCacheName)
          .map(key => caches.delete(key))
      );
    })
  );
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
