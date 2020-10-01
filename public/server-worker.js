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

//Activating Service Worker
self.addEventListener("activate", (evt) => {
    evt.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(
                keyList.map((key) => {
                    if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
                        console.log("Deleting Old Caches Data", key);
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    self.clients.claim();
});
