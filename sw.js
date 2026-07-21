self.addEventListener('install', event => {
  event.waitUntil(caches.open('diet-v1').then(cache => {
    return cache.addAll([
      './index.html',
      './manifest.json',
      './icon.svg',
      './data/dishes.json',
      './data/rules.json',
      './data/ingredients.json'
    ]);
  }));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', event => {
  if (event.request.url.includes('/api/')) return; // Don't cache API
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request).then(response => {
        if (!response || response.status !== 200 || response.type !== 'basic') return response;
        const clone = response.clone();
        caches.open('diet-v1').then(cache => cache.put(event.request, clone));
        return response;
      });
    })
  );
});
