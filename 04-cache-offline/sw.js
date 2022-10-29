const CACHE_STATIC_NAME = 'static-v1';
const CACHE_DYNAMIC_NAME = 'dynamic-v1';
const CACHE_INMUTABLE_NAME = 'inmutable-v1';


self.addEventListener('install', e => {
    const cacheProm = caches.open('CACHE_STATIC_NAME').then(cache => {
        cache.addAll([
            '/',
            '/index.html',
            '/css/style.css',
            '/img/main.jpg',
             '/js/app.js'
        ]);
    });

    e.waitUntil(cacheProm);

    const cacheInmutable = caches.open(CACHE_INMUTABLE_NAME).then(cache => cache.add('https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css'));
    e.waitUntil(Promise.all([cacheProm, cacheInmutable]));

});


self.addEventListener('fetch', e => {
    e.respondWith(caches.match(e.request));

    const respuesta = caches.match(e.request).then(res => {
       if (res) return res;

       console.log('No ta', e.request.url);

       return fetch(e.request)
           .then(newResp => {

               caches.open(CACHE_DYNAMIC_NAME).
               then(cache => {
                   cache.put(e.request, newResp);
               });
               return newResp.clone();
           });
   });

   e.respondWith(respuesta);
   //e.respondWith(caches.match(e.request));
});


