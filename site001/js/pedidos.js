```javascript
function salvarPedido(pedido) {

    var resultado =
        document.getElementById("resultado");

    resultado.innerHTML = `

        <div class="info">

            <strong>Pedido criado com sucesso!</strong>

        </div>

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

            <strong>Data de Entrega:</strong>

            ${pedido.dataEntrega}

        </div>

        <div class="observacao">

            <strong>Observações:</strong>

            <p>${pedido.observacoes}</p>

        </div>

    `;

}
```



carregarPedidos();
```
