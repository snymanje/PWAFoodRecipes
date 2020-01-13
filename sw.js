// install service worker
// self inside the SW refers to itself the SW

const staticCacheName = "site-static-v11";
const dynamicCacheName = "site-dymanic-v11";

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
  "https://fonts.gstatic.com/s/materialicons/v48/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2",
  "/pages/fallback.html"
];

// cahce size limit function
const limitCacheSize = (name, size) => {
  caches.open(name).then(cache => {
    cache.keys().then(keys => {
      if (keys.length > size) {
        cache.delete(keys[0]).then(limitCacheSize(name, size));
      }
    });
  });
};

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
          .filter(key => key !== staticCacheName && key !== dynamicCacheName)
          .map(key => caches.delete(key))
      );
    })
  );
});

// fetch events
self.addEventListener("fetch", evt => {
  if (!evt.request.url.includes("firestore.googleapis.com")) {
    evt.respondWith(
      caches
        .match(evt.request)
        .then(cacheRes => {
          return (
            cacheRes ||
            fetch(evt.request).then(fetchRes => {
              return caches.open(dynamicCacheName).then(cache => {
                cache.put(evt.request.url, fetchRes.clone());
                limitCacheSize(dynamicCacheName, 20);
                return fetchRes;
              });
            })
          );
        })
        .catch(() => {
          if (evt.request.url.includes(".html"))
            return caches.match("/pages/fallback.html");
        })
    );
  }
});
