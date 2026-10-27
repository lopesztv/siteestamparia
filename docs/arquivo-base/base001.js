function criarPedido() {

    var nomeServico = document.getElementById("nomeServico").value;
    var quantidade = document.getElementById("quantidade").value;

    var tamanhoP = document.getElementById("tamanhoP").value;
    var tamanhoM = document.getElementById("tamanhoM").value;
    var tamanhoG = document.getElementById("tamanhoG").value;
    var tamanhoGG = document.getElementById("tamanhoGG").value;

    var corMalha = document.getElementById("corMalha").value;

    var arte = document.getElementById("arte").files[0];

    var imagemURL = "";

    if (arte) {
        imagemURL = URL.createObjectURL(arte);
    }

    var dataEntrega = document.getElementById("dataEntrega").value;

    var partesData = dataEntrega.split("-");

    var dataFormatada =
        partesData[2] + "/" +
        partesData[1] + "/" +
        partesData[0];

    var observacoes = document.getElementById("observacoes").value;

    var resultado = document.getElementById("resultado");


    resultado.innerHTML = `

        <div class="info">
            <strong>Nome do Serviço:</strong>
            ${nomeServico}
        </div>

        <div class="info">
            <strong>Quantidade:</strong>
            ${quantidade} peças
        </div>

        <div class="info">
            <strong>Tamanhos:</strong>
            <p>P: ${tamanhoP}</p>
            <p>M: ${tamanhoM}</p>
            <p>G: ${tamanhoG}</p>
            <p>GG: ${tamanhoGG}</p>
        </div>

        <div class="info">
            <strong>Cor da Malha:</strong>
            ${corMalha}
        </div>

        <div class="info">
            <strong>Arte do Serviço:</strong>

            ${
                imagemURL
                ? `<img src="${imagemURL}" width="300">`
                : "Nenhuma imagem selecionada"
            }

        </div>

        <div class="info">
            <strong>Data de Entrega:</strong>
            ${dataFormatada}
        </div>

        <div class="observacao">
            <strong>Observações:</strong>
            <p>${observacoes}</p>
        </div>

    `;

}