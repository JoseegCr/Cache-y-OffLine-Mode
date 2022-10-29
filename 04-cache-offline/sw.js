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
            '/img/no-img.jpg',
             '/js/app.js'
        ]);
    });

    e.waitUntil(cacheProm);

    const cacheInmutable = caches.open(CACHE_INMUTABLE_NAME).then(cache => cache.add('https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css'));
    e.waitUntil(Promise.all([cacheProm, cacheInmutable]));

});


self.addEventListener('fetch', e => {
    e.respondWith(caches.match(e.request));

    const respuesta = new Promise((resolve, reject) => {

        let rechazada = false;
        const falloUnaVez = () => {
            if (rechazada) {
                if (/\.(png|jpg)$/i.test(e.request.url)) {
                    resolve(caches.match('/img/no-image.jpg'));
                } else {
                    reject('No se encontro respuesta');
                }
            } else {
                rechazada = true;
            }
        };

        fetch(e.request).then(res => {
            res.ok ? resolve(res) : falloUnaVez();
        }).catch(falloUnaVez);

        caches.match(e.request).then(res => {
            res ? resolve(res) : falloUnaVez();
        }).catch(falloUnaVez);

    });
           

   e.respondWith(respuesta);
 
});


