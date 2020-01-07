// install service worker
// self inside the SW refers to itself the SW

self.addEventListener('install', (event) => {
    console.log('Service Worker now installed!', event)
})

// listen for the activate event
self.addEventListener('activate', (event) => {
    console.log('Service Worker now activated!', event)
})

// fetch events
self.addEventListener('fetch', evt => {
    console.log('fetch event', evt)
})