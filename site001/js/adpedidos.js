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

    var pedidos =
        JSON.parse(
            localStorage.getItem("pedidos")
        ) || [];


    pedidos.push(pedido);


    localStorage.setItem(
        "pedidos",
        JSON.stringify(pedidos)
    );


    mostrarPedido(pedido);

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
