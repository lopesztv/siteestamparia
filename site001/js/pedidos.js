function carregarPedidos() {

    var lista =
        document.getElementById("listaPedidos");


    fetch("https://sheetdb.io/api/v1/f2rep5lfrfp1p")

        .then(function(resposta) {

            if (!resposta.ok) {

                throw new Error(
                    "Não foi possível buscar os pedidos."
                );

            }

            return resposta.json();

        })

        .then(function(pedidos) {

            console.log("Pedidos recebidos:", pedidos);


            if (pedidos.length == 0) {

                lista.innerHTML =
                    "<p>Nenhum pedido cadastrado.</p>";

                return;

            }


            lista.innerHTML = "";


            for (var i = 0; i < pedidos.length; i++) {

                var pedido = pedidos[i];


                lista.innerHTML += `

                    <div class="pedido">

                        <h3>
                            ${pedido.nomeServico}
                        </h3>


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

                            ? `
                                <p>
                                    <strong>
                                        Arte do Serviço:
                                    </strong>
                                </p>

                                <img
                                    src="${pedido.imagem}"
                                    width="250"
                                >
                              `

                            : `
                                <p>
                                    Nenhuma imagem.
                                </p>
                              `
                        }


                        <button
                            onclick="excluirPedido('${pedido.id}')"
                        >
                            Excluir Pedido
                        </button>

                    </div>

                `;

            }

        })

        .catch(function(erro) {

            console.error(
                "Erro ao carregar pedidos:",
                erro
            );


            lista.innerHTML = `

                <p>
                    Não foi possível carregar os pedidos.
                </p>

            `;

        });

}


/*
    EXCLUIR PEDIDO
*/

function excluirPedido(id) {

    var confirmar =
        confirm("Deseja realmente excluir este pedido?");


    if (!confirmar) {

        return;

    }


    fetch(
        "https://sheetdb.io/api/v1/f2rep5lfrfp1p/id/" + id,
        {

            method: "DELETE"

        }
    )

    .then(function(resposta) {

        if (!resposta.ok) {

            throw new Error(
                "Não foi possível excluir o pedido."
            );

        }

        return resposta.json();

    })

    .then(function(resultado) {

        console.log(
            "Pedido excluído:",
            resultado
        );


        carregarPedidos();

    })

    .catch(function(erro) {

        console.error(
            "Erro ao excluir:",
            erro
        );

        alert(
            "Não foi possível excluir o pedido."
        );

    });

}


/*
    VOLTAR PARA O HALL
*/

function voltarHall() {

    window.location.href =
        "hall.html";

}


/*
    CARREGA OS PEDIDOS
    ASSIM QUE A PÁGINA ABRE
*/

carregarPedidos();
