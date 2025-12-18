const CACHE_NAME = 'ecoloop-cache-v1';
const URLS_TO_CACHE = [
    '/',
    '/manifest.json',
    '/icon-192x192.png',
    '/icon-512x512.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(URLS_TO_CACHE);
            })
    );
});

self.addEventListener('fetch', (event) => {
    // Only handle GET requests
    if (event.request.method !== 'GET') return;

    // Don't intercept API calls or next.js dynamic data generally, 
    // but for safety, we'll use a network-first strategy for everything 
    // except specifically cached static assets if we wanted to be very stricter.
    // Here, we use a Stale-While-Revalidate or Network-First.
    // For a generic "offline homepage" support, we can try cache first for the cache list, network for others.

    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                return fetch(event.request).then(
                    (response) => {
                        // Check if we received a valid response
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // IMPORTANT: Clone the response. A response is a stream
                        // and because we want the browser to consume the response
                        // as well as the cache consuming the response, we need
                        // to clone it so we have two streams.
                        // We are NOT aggressively caching everything here to avoid issues.
                        // basic caching for visited pages could be added but let's stick to minimum.
                        return response;
                    }
                );
            })
    );
});

self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
