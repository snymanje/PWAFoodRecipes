// first check if SW is available in browser
if ("serviceWorker" in navigator) {
  // Register the SW
  navigator.serviceWorker
    .register("/sw.js")
    .then(reg => console.log("Service Worker Registered", reg))
    .catch(err => console.log("Service NOT Registered", err));
}
