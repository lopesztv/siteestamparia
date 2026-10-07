function entrar() {

    var usuario = document.getElementById("usuario").value;

    var senha = document.getElementById("senha").value;


    if (usuario == "admin" && senha == "1234") {

        window.location.href = "hall.html";

    } else {

        document.getElementById("mensagem").innerHTML =
            "Usuário ou senha incorretos.";

    }

}


document.addEventListener("keydown", function(event) {

    if (event.key == "Enter") {

        entrar();

    }

});