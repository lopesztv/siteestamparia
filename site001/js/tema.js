(function() {
    var temaSalvo = localStorage.getItem("temaEstamparia");
    document.documentElement.setAttribute(
        "data-tema",
        temaSalvo === "escuro" ? "escuro" : "claro"
    );
})();

function definirTema(tema) {
    var temaValido = tema === "escuro" ? "escuro" : "claro";
    document.documentElement.setAttribute("data-tema", temaValido);
    localStorage.setItem("temaEstamparia", temaValido);
}
