(function() {
    var eventoInstalacao = null;
    var botao = document.getElementById("instalarApp");
    var status = document.getElementById("statusInstalacao");
    var iOS = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

    if ("serviceWorker" in navigator) {
        window.addEventListener("load", function() {
            navigator.serviceWorker.register("service-worker.js", { scope: "./" })
                .catch(function(erro) { console.error("Não foi possível ativar o modo offline:", erro); });
        });
    }

    if (!botao) return;
    var standalone = window.matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
    if (standalone) return;
    if (iOS) botao.hidden = false;

    window.addEventListener("beforeinstallprompt", function(evento) {
        evento.preventDefault();
        eventoInstalacao = evento;
        botao.hidden = false;
    });

    botao.addEventListener("click", function() {
        if (!eventoInstalacao) {
            if (iOS) status.textContent = "No Safari, toque em Compartilhar e escolha ‘Adicionar à Tela de Início’.";
            return;
        }
        eventoInstalacao.prompt();
        eventoInstalacao.userChoice.then(function(escolha) {
            status.textContent = escolha.outcome === "accepted" ? "Aplicativo instalado." : "Instalação cancelada.";
            eventoInstalacao = null;
        });
    });

    window.addEventListener("appinstalled", function() {
        botao.hidden = true;
        status.textContent = "Aplicativo instalado.";
    });
})();
