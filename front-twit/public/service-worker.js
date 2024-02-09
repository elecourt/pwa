importScripts('/idb.js')
const APP_SHELL_CACHE = "app-shell";
 
const APP_SHELL_FILES = [
    "/",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css",
    "/favicon.ico",
    "/static/css/main.e6c13ad2.css",
    "/static/css/main.e6c13ad2.css.map",
    "/static/js/main.5e6879ff.js",
    "/static/js/main.5e6879ff.js.map",
    "/manifest.json",
];
 
const ROOT_URL = "http://127.0.0.1:3000";
const TWEET_DATA_CACHE = "tweet-data";
const BACKEND_URL = 'http://localhost:9000/api';
 
 
self.addEventListener('install',function(event){
    event.waitUntil(
            caches.open(APP_SHELL_CACHE).then(function(cache){
                cache.addAll(APP_SHELL_FILES);
            })
        );
});
 
self.addEventListener('activate',function(event){
    console.log("Activation ...");
});
 
self.addEventListener('fetch',function(event){
    if(event.request.method !== 'GET'){
        return;
    }
    if(APP_SHELL_FILES.includes(event.request.url.replace(ROOT_URL,""))){
        event.respondWith(getFromCache(APP_SHELL_CACHE, event.request));
    }else if(event.request.url.startsWith(BACKEND_URL)){  
        event.respondWith(getFromCacheOrNetwork(TWEET_DATA_CACHE, event.request));
    }
});
 
self.addEventListener('sync', function(event){
    if(event.tag === 'sync-new-post'){
        idb.openDB('twwetsmessage',1).then(function(database){
            database.getAll('tweets').then(function(tweets){
                for(const tweet of tweets){
                    console.log(tweets,tweet)
                    fetch(
                        BACKEND_URL + "/tweets",
                        {
                            method:"POST",
                            body: JSON.stringify(
                                {
                                'title': tweet.title,
                                'message': tweet.message
                            }),
                            headers: {'Content-Type': "application/json"}
                        }
                    ).then(function(response){
                        if(response.ok){
                            database.delete('tweets',tweet.id);
                            console.log("delete tweet for local base");
                        }else{
                            console.log("Couldn't sync a post")
                        }
                    })
                }
            })
        })
    }
});
 
self.addEventListener('push', function(event){
    console.log("Received push notification", event);
 
    const notificationData = event.data.json();
    self.registration.showNotification(
        notificationData.title,
        {
            body: notificationData.body,
            action:[
                {
                    "title": "Consult",
                    "action":"open",
                },
                {
                    "title": "Ignore",
                    "action":"Ignore",
                }
            ]
        }
    );
})
 
self.addEventListener('notificationClick', function(event){
 
    switch(event.action){
        case "cancel":
            break;
        case "open":
        default:
            event.waitUntil(
                client.allMatch().then(function(tabs){
                    if(tabs.length){
                        tabs[0].focus();
                    }else{
                        client.openWindow(ROOT_URL)
                    }
                })
            );
        break;
    }
});
 
function getFromCache(cacheName, request){
    console.log("get cache "+request.url)
    return caches.open(cacheName).then(function(cache){
        return cache.match(request).then(function(cachedResult){
            if(cachedResult){
                // recupère depuis le cache
                console.log("Fetch form cache " + request.url)
                return cachedResult;
            }else{
                console.error("Couldn't fetch" + request.url + "from network")
            }
        })
 
    });
}
 
function getFromCacheOrNetwork(cacheName, request){
   
    return caches.open(cacheName).then(function(cache){      
        return fetch(request).then(function(networkResult){
            // recupère depuis le network
            cache.put(request.url, networkResult.clone());
            return networkResult;
        }).catch(function(error){
            return cache.match(request).then(function(cachedResult){
                if(cachedResult){
                    // recupère depuis le cache
                    console.error("Fetch form cache " + request.url)
                    return cachedResult;
                }else{
                    console.log("Error fetching" + request.url, error);
                }
            });
        });
    });
}
 
/*
POST HORS LIGNE
1 stock le post dans idb
2 emet sync event
.... Attente d'internet
3 Evenement sync réceptionné
4 Lire idb
5 Fetch POST dans Backend
6 Vider la idb
*/
 
/*
nav         sw      function   network
|
---->       |
            | chechk URL
            ----------> if cache
            return cache|
                <-------
                        |
                        else
                        | call
                        ----->  |
                                |
                        data    |
                        <-------
                        |
                        |
                    met en cache
                data    |
                <--------
    data    |
<-------
*/
 
/*
NOTIFICATION
1. demande au user autorisation
2. créer abonnement sécurisé
3. enregistrée l'abonnement en DB
4. serveur peut envoyer des event push (web-push js)
grace à la clef privé
5. serviceWorker réceptionne les notifs
*/