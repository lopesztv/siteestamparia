(function() {
    var temaSalvo = "claro";
    try { temaSalvo = localStorage.getItem("temaEstamparia") === "escuro" ? "escuro" : "claro"; } catch (erro) {}
    aplicarTema(temaSalvo);
})();

function aplicarTema(tema) {
    var temaValido = tema === "escuro" ? "escuro" : "claro";
    document.documentElement.setAttribute("data-tema", temaValido);
    var metaTema = document.querySelector('meta[name="theme-color"]');
    if (metaTema) metaTema.setAttribute("content", temaValido === "escuro" ? "#09070d" : "#f0e7fb");
}

function definirTema(tema) {
    aplicarTema(tema);
    try { localStorage.setItem("temaEstamparia", tema === "escuro" ? "escuro" : "claro"); } catch (erro) {}
}
