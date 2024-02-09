const PRECACHE_NAME = 'app-shell';
const BLOG_DATA_CACHE = 'blog-data';

const ROOT_URL = "http://localhost:3000";

const APP_SHEL_FILES = [
    '/',
    "/assets/index-b335ae04.js",
    "/assets/index-c3469170.css",
    "/manifest.json",
];

self.addEventListener('install', function(event){
    console.log("Installation...");

    // Pre-acching : Mise en cache des fichiers indispensables
    //On utilise waitUntil pour être sur que tous les fichiers sont mis en cache avant de passer à la suite
    event.waitUntil(
        caches.open(PRECACHE_NAME).then(function(cache){
        cache.addAll(APP_SHEL_FILES);
        })
    );
});

self.addEventListener('activate', function(event){
    console.log("Activation ...");
});

// Cache only strategy
function getFromCache(cacheName, request) {
    return caches.open(cacheName).then(
        function(cache){
            return cache.match(request).then(function(cachedResult){
                if(cachedResult){
                    console.log("Returned from cache" + request.url);
                    return cachedResult;
                } else {
                    console.error("Couldn't fetch" + request.url + "from")
                }
            })
        }
    );
}

//Retourne l'image de placeholder enregistré dans le pré-cache
function getPlaceHolder(){
    return caches.open(PRECACHE_NAME).then(function(cache){
        return cache.match('https://abs.twimg.com/responsive-web/client-web/icon-default.522d363a.png');
    });
}

function getFromNetworkOrCache(cacheName, request) {
    return caches.open(cacheName).then(function(cache){
        return fetch(request).then(function(networkResponse){
            console.log("Got from network");
            cache.put(request, networkResponse.clone());
            return networkResponse;
        }).catch(function(error){
            return cache.match(request).then(function(cachedResponse){
                if(cachedResponse){
                    console.log("Got from cache");
                    return cachedResponse;
                } else {
                    console.error("Couldn't fetch posts");
                }
            })
        })
    })
}

function getFromCacheOrNetwork(cacheName, request, onError = null){
    return caches.open(cacheName).then(function(cache){
            return cache.match(request).then(function(cachedResult){
                if(cachedResult){
                    console.log("Returned from cache" + request.url);
                    return cachedResult;
                } else {
                    return fetch(request).then(function(networkResult){
                        cache.put(request.url, networkResult.clone());
                        return networkResult;
                    }).catch(function(error){
                        console.log("Error fetching " + request.url, error);
                        if(onError){
                            return onError();
                        }
                    })
                }
            })
        }
    );
}

// Evenement appelé à chaque requete HTTP (cahrgement initial + fetch ultime)
self.addEventListener('fetch', function(event){
    console.log(event.request.url, ROOT_URL);
    // Si on cherche un fichier du pre cache => CACHE ONLY
    //Request.url = http://localhost/blabla.file
    //File dans le cache = /blabla.file
    //Donc on utilise un replace pour retirer les parties indésirables
    if(APP_SHEL_FILES.includes(event.request.url.replace(ROOT_URL, ''))){
        console.log(event.request.url);
        event.respondWith(getFromCache(PRECACHE_NAME, event.request));
    }
    else if(event.request.url.startsWith('http://localhost:8081')){
        event.respondWith(getFromNetworkOrCache(BLOG_DATA_CACHE, event.request));
    }
    // Sinon je fais une requête classique
    else {
        event.respondWith(fetch(event.request));
    }
});