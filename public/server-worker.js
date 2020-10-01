const FILES_TO_CACHE = [
    "/",
    "/index.html",
    "/index.js",
    "/db.js",
    "/style.css",
];

const CACHE_NAME = "static-cache";
const DATA_CACHE_NAME = "data-cache";

//Installing the Service Worker
self.addEventListener("install", (evt) => {
    evt.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("Your files have successfully been pre-cached");
            return cache.addAll(FILES_TO_CACHE);
        })
    );
    self.skipWaiting();
});
