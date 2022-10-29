const CACHE_STATIC_NAME = 'static-v2';
const CACHE_DYNAMIC_NAME = 'dynamic-v1';
const CACHE_INMUTABLE_NAME = 'inmutable-v1';

const CACHE_DYNAMIC_LIMIT = 50;

function limpiarCache(cacheName, numeroItems) {

    caches.open(cacheName)
        .then(cache => {
            return cache.keys()
                .then(keys => 
                    {

                    if (keys.length > numeroItems) 
                    {
                        cache.delete(keys[0]).then(limpiarCache(cacheName, numeroItems));
                    }
                    });
        });
}


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

    const respuesta = fetch(e.request).then(res => {
        if (!res) return caches.match(e.request);
        console.log('Fetch', res);
        caches.open(CACHE_DYNAMIC_NAME)
            .then(cache => {
                cache.put(e.request, res);
                limpiarCache(CACHE_DYNAMIC_NAME, CACHE_DYNAMIC_LIMIT);
           });
           return res.clone();
        }).catch(err => {
            return caches.match(e.request);
   });

   e.respondWith(respuesta);
 
});


