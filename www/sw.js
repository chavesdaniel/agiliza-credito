var CACHE_VERSION = '1.2';
var PRECACHE_URLS = [
  '/'
]

self.addEventListener('install', event => { 
  self.skipWaiting(); 
  function onInstall(){
    console.log("Instalado ", CACHE_VERSION);
    return caches.open(CACHE_VERSION).then(function(cache){
      console.log("Pré cache ", PRECACHE_URLS);
      return cache.addAll(PRECACHE_URLS);
    })
  }
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

self.addEventListener('activate', function(event) {

  var cacheWhitelist = [CACHE_VERSION];

  event.waitUntil(
    caches.keys(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) == -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
