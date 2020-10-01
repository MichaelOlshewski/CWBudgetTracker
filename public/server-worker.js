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

//Fetching files
self.addEventListener("fetch", (evt) => {
    if (evt.request.url.includes("/api/")) {
        console.log("[Service Worker] Fetch (data)", evt.request.url);
        evt.respondWith(
            caches.open(DATA_CACHE_NAME).then((cache) => {
                return fetch(evt.request)
                    .then((response) => {
                        if (response.status === 200) {
                            cache.put(evt.request.url, response.clone());
                        }
                        return response;
                    })
                    .catch((err) => {
                        return cache.match(evt.request);
                    });
            })
        );
        return;
    }

    evt.respondWith(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.match(evt.request).then((response) => {
                return response || fetch(evt.request);
            });
        })
    );
});
