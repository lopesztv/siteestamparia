const CACHE_NAME = "sistema-pedidos-v1";

const ARQUIVOS = [
    "index.html",
    "hall.html",
    "adpedidos.html",
    "pedidos.html",
    "manifest.json"
];


self.addEventListener("install", function(event) {

    event.waitUntil(

        caches.open(CACHE_NAME)
            .then(function(cache) {

                return cache.addAll(ARQUIVOS);

            })

    );

});


self.addEventListener("activate", function(event) {

    event.waitUntil(

        caches.keys()
            .then(function(nomes) {

                return Promise.all(

                    nomes.map(function(nome) {

                        if (nome !== CACHE_NAME) {

                            return caches.delete(nome);

                        }

                    })

                );

            })

    );

});


self.addEventListener("fetch", function(event) {

    event.respondWith(

        caches.match(event.request)
            .then(function(resposta) {

                return resposta || fetch(event.request);

            })

    );

});
