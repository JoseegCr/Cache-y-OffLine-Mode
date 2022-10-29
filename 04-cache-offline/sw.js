const CACHE_NAME = 'cache-1';

self.addEventListener('install', e => {
    const cacheProm = caches.open('CACHE_NAME').then(cache => {
        cache.addAll([
            '/',
            '/index.html',
            '/css/style.css',
            '/img/main.jpg',
            'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css',
            '/js/app.js'
        ]);
    });

    e.waitUntil(cacheProm);

});


self.addEventListener('fetch', e => {
    e.respondWith(caches.match(e.request));

    const respuesta = caches.match(e.request).then(res => {
       if (res) return res;

       console.log('No ta', e.request.url);

       return fetch(e.request)
           .then(newResp => {

               caches.open(CACHE_NAME).
               then(cache => {
                   cache.put(e.request, newResp);
               });
               return newResp.clone();
           });
   });

   e.respondWith(respuesta);
   //e.respondWith(caches.match(e.request));
});


