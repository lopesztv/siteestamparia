if ("serviceWorker" in navigator) {

    window.addEventListener("load", function() {

        navigator.serviceWorker
            .register("service-worker.js")
            .then(function(registro) {

                console.log("PWA ativado!");

            })
            .catch(function(erro) {

                console.error(
                    "Erro ao ativar o PWA:",
                    erro
                );

            });

    });

}
