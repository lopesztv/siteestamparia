function carregarPedidos() {

    var pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];

    var lista = document.getElementById("listaPedidos");

    if (pedidos.length == 0) {
        lista.innerHTML = "<p>Nenhum pedido cadastrado.</p>";
        return;
    }

    lista.innerHTML = "";

    for (var i = 0; i < pedidos.length; i++) {

        var pedido = pedidos[i];

        lista.innerHTML += `
            <div class="pedido">

                <h3>${pedido.nomeServico}</h3>

                <p>
                    <strong>Quantidade:</strong>
                    ${pedido.quantidade} peças
                </p>

                <p>
                    <strong>Tamanhos:</strong>
                    P: ${pedido.tamanhoP} |
                    M: ${pedido.tamanhoM} |
                    G: ${pedido.tamanhoG} |
                    GG: ${pedido.tamanhoGG}
                </p>

                <p>
                    <strong>Cor da Malha:</strong>
                    ${pedido.corMalha}
                </p>

                <p>
                    <strong>Data de Entrega:</strong>
                    ${pedido.dataEntrega}
                </p>

                <p>
                    <strong>Observações:</strong>
                    ${pedido.observacoes}
                </p>

                ${
                    pedido.imagem
                    ? `<img src="${pedido.imagem}" width="250">`
                    : "<p>Nenhuma imagem.</p>"
                }

                <button onclick="excluirPedido(${i})">
                    Excluir Pedido
                </button>

            </div>
        `;
    }
}


function excluirPedido(indice) {

    var pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];

    pedidos.splice(indice, 1);

    localStorage.setItem(
        "pedidos",
        JSON.stringify(pedidos)
    );

    carregarPedidos();
}


function voltarHall() {

    window.location.href = "hall.html";

}


carregarPedidos();