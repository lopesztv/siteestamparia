function entrar(evento) {
    if (evento) evento.preventDefault();
    var usuario = document.getElementById("usuario").value.trim();
    var senha = document.getElementById("senha").value;
    var mensagem = document.getElementById("mensagem");

    // Credenciais mantidas para compatibilidade com o fluxo atual.
    if (usuario === "admin" && senha === "1234") {
        window.location.href = "hall.html";
        return;
    }
    mensagem.textContent = "Usuário ou senha incorretos.";
    document.getElementById("senha").select();
}
