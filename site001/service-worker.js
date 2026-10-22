const CACHE_NAME = "estamparia-shell-v5";
const SHELL = [
  "./index.html", "./hall.html", "./adpedidos.html", "./pedidos.html", "./offline.html", "./manifest.json",
  "./imagens/icon192.png", "./imagens/icon512.png", "./imagens/apple-touch-icon.png",
  "./css/tema.css", "./css/login.css", "./css/hall.css", "./css/adpedidos.css", "./css/pedidos.css",
  "./js/tema.js", "./js/login.js", "./js/hall.js", "./js/adpedidos.js", "./js/pedidos.js", "./js/pwa.js"
];

self.addEventListener("install", function(event) {
  event.waitUntil(caches.open(CACHE_NAME).then(function(cache) {
    return cache.addAll(SHELL);
  }).then(function() { return self.skipWaiting(); }));
});

self.addEventListener("activate", function(event) {
  event.waitUntil(caches.keys().then(function(keys) {
    return Promise.all(keys.filter(function(key) {
      return key !== CACHE_NAME && (key.indexOf("estamparia-") === 0 || key === "sistema-pedidos-v2");
    }).map(function(key) { return caches.delete(key); }));
  }).then(function() { return self.clients.claim(); }));
});

self.addEventListener("fetch", function(event) {
  var request = event.request;
  var url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(fetch(request).then(function(response) {
      if (response.ok) {
        var copy = response.clone();
        return caches.open(CACHE_NAME).then(function(cache) { return cache.put(request, copy); }).then(function() { return response; }).catch(function() { return response; });
      }
      return response;
    }).catch(function() {
      return caches.match(request).then(function(cached) {
        if (cached) return cached;
        var startPage = url.pathname.endsWith("/") ? new URL("index.html", self.registration.scope).href : "./offline.html";
        return caches.match(startPage).then(function(start) { return start || caches.match("./offline.html"); });
      });
    }));
    return;
  }

  event.respondWith(caches.match(request).then(function(cached) {
    if (cached) return cached;
    return fetch(request).then(function(response) {
      if (response.ok) {
        var copy = response.clone();
        return caches.open(CACHE_NAME).then(function(cache) { return cache.put(request, copy); }).then(function() { return response; }).catch(function() { return response; });
      }
      return response;
    });
  }));
});
