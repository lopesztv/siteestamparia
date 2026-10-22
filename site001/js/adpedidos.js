function criarPedido() {

    var nomeServico =
        document.getElementById("nomeServico").value;

    var quantidade =
        document.getElementById("quantidade").value;

    var tamanhoP =
        document.getElementById("tamanhoP").value;

    var tamanhoM =
        document.getElementById("tamanhoM").value;

    var tamanhoG =
        document.getElementById("tamanhoG").value;

    var tamanhoGG =
        document.getElementById("tamanhoGG").value;

    var corMalha =
        document.getElementById("corMalha").value;

    var arte =
        document.getElementById("arte").files[0];

    var dataEntrega =
        document.getElementById("dataEntrega").value;

    var observacoes =
        document.getElementById("observacoes").value;


    if (
        nomeServico == "" ||
        quantidade == "" ||
        corMalha == "" ||
        dataEntrega == ""
    ) {

        alert("Preencha os campos obrigatórios.");

        return;
    }


    var partesData =
        dataEntrega.split("-");


    var dataFormatada =
        partesData[2] + "/" +
        partesData[1] + "/" +
        partesData[0];


    var pedido = {

        id: Date.now(),

        nomeServico: nomeServico,

        quantidade: quantidade,

        tamanhoP: tamanhoP,

        tamanhoM: tamanhoM,

        tamanhoG: tamanhoG,

        tamanhoGG: tamanhoGG,

        corMalha: corMalha,

        dataEntrega: dataFormatada,

        observacoes: observacoes,

        imagem: ""

    };


    if (arte) {

        var leitor =
            new FileReader();


        leitor.onload = function(event) {

            pedido.imagem =
                event.target.result;

            salvarPedido(pedido);

        };


        leitor.readAsDataURL(arte);

    } else {

        salvarPedido(pedido);

    }

}


function salvarPedido(pedido) {

    var dados = {
        data: [{
            id: String(pedido.id),
            nomeServico: pedido.nomeServico,
            quantidade: pedido.quantidade,
            tamanhoP: pedido.tamanhoP,
            tamanhoM: pedido.tamanhoM,
            tamanhoG: pedido.tamanhoG,
            tamanhoGG: pedido.tamanhoGG,
            corMalha: pedido.corMalha,
            dataEntrega: pedido.dataEntrega,
            observacoes: pedido.observacoes,
            imagem: pedido.imagem
        }]
    };


    fetch(
        "https://sheetdb.io/api/v1/f2rep5lfrfp1p",
        {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(dados)

        }
    )

    .then(function(resposta) {

        return resposta.text().then(function(texto) {
            var corpo;
            try {
                corpo = texto ? JSON.parse(texto) : {};
            } catch (erroParse) {
                corpo = { message: texto };
            }

            if (!resposta.ok) {
                throw new Error(
                    (corpo && (corpo.error || corpo.message)) ||
                    "SheetDB respondeu com HTTP " + resposta.status
                );
            }

            return corpo;
        });

    })

    .then(function(resultado) {

        console.log(
            "Pedido salvo no SheetsDB:",
            resultado
        );


        mostrarPedido(pedido);

    })

    .catch(function(erro) {

        console.error(
            "Erro ao salvar:",
            erro
        );


        alert("Não foi possível criar o pedido: " + erro.message);

    });

}


function mostrarPedido(pedido) {

    var resultado =
        document.getElementById("resultado");


    resultado.innerHTML = `

        <div class="info">

            <strong>Nome do Serviço:</strong>

            ${pedido.nomeServico}

        </div>


        <div class="info">

            <strong>Quantidade:</strong>

            ${pedido.quantidade} peças

        </div>


        <div class="info">

            <strong>Tamanhos:</strong>

            <p>P: ${pedido.tamanhoP}</p>

            <p>M: ${pedido.tamanhoM}</p>

            <p>G: ${pedido.tamanhoG}</p>

            <p>GG: ${pedido.tamanhoGG}</p>

        </div>


        <div class="info">

            <strong>Cor da Malha:</strong>

            ${pedido.corMalha}

        </div>


        <div class="info">

            <strong>Arte do Serviço:</strong>

            ${
                pedido.imagem

                ? `<img src="${pedido.imagem}" width="300">`

                : "Nenhuma imagem selecionada"
            }

        </div>


        <div class="info">

            <strong>Data de Entrega:</strong>

            ${pedido.dataEntrega}

        </div>


        <div class="observacao">

            <strong>Observações:</strong>

            <p>${pedido.observacoes}</p>

        </div>

    `;


    setTimeout(function() {

        window.location.href =
            "hall.html";

    }, 3000);

}


function voltarHall() {

    window.location.href =
        "hall.html";

}
