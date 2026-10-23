var API_PEDIDOS = "https://sheetdb.io/api/v1/f2rep5lfrfp1p";
function textoSeguro(valor, padrao) {
    return valor === undefined || valor === null || String(valor).trim() === "" ? (padrao || "—") : String(valor);
}
function normalizarPedido(item) {
    if (item && item.A !== undefined) {
        if (item.A === "id" || item.B === "nomeServico") return null;
        return { id:item.A, nomeServico:item.B, quantidade:item.C, tamanhoP:item.D, tamanhoM:item.E, tamanhoG:item.F, tamanhoGG:item.G, corMalha:item.H, dataEntrega:item.I, observacoes:item.J, imagem:item.K };
    }
    return item;
}
function formatarDataEntrega(valor) {
    if (valor === undefined || valor === null || String(valor).trim() === "") return "—";
    var texto = String(valor).trim();
    var iso = texto.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
    if (iso) return iso[3].padStart(2, "0") + "/" + iso[2].padStart(2, "0") + "/" + iso[1];
    var brasileira = texto.match(/^(\d{1,2})[/.\-](\d{1,2})[/.\-](\d{4})$/);
    if (brasileira) return brasileira[1].padStart(2, "0") + "/" + brasileira[2].padStart(2, "0") + "/" + brasileira[3];
    var serial = Number(texto);
    if (Number.isFinite(serial) && serial > 0 && serial < 100000) {
        var data = new Date(Date.UTC(1899, 11, 30) + Math.floor(serial) * 86400000);
        return String(data.getUTCDate()).padStart(2, "0") + "/" + String(data.getUTCMonth() + 1).padStart(2, "0") + "/" + data.getUTCFullYear();
    }
    return texto;
}
function campoPedido(cartao, titulo, valor) {
    var p = document.createElement("p"), strong = document.createElement("strong");
    strong.textContent = titulo + ": "; p.appendChild(strong); p.appendChild(document.createTextNode(textoSeguro(valor))); cartao.appendChild(p);
}
function carregarPedidos() {
    var lista = document.getElementById("listaPedidos");
    lista.textContent = "Carregando pedidos…";
    fetch(API_PEDIDOS).then(function(r) { if (!r.ok) throw new Error("Falha ao consultar pedidos (" + r.status + ")."); return r.json(); })
      .then(function(dados) {
        if (!Array.isArray(dados)) throw new Error("A resposta recebida não está no formato esperado.");
        var pedidos = dados.map(normalizarPedido).filter(function(p) { return p && p.id !== undefined; });
        pedidos.sort(function(a,b) { return Number(b.id) - Number(a.id); });
        lista.replaceChildren();
        if (!pedidos.length) { var vazio = document.createElement("p"); vazio.className="sem-pedidos"; vazio.textContent="Nenhum pedido cadastrado ainda."; lista.appendChild(vazio); return; }
        pedidos.forEach(function(p) {
            var card=document.createElement("article"), h=document.createElement("h3"); card.className="pedido"; h.textContent=textoSeguro(p.nomeServico,"Pedido sem nome"); card.appendChild(h);
            var id=Number(p.id); campoPedido(card,"Pedido feito em",Number.isFinite(id) && id>0 ? new Date(id).toLocaleDateString("pt-BR") : "Data não disponível");
            campoPedido(card,"Quantidade",textoSeguro(p.quantidade)+" peças");
            campoPedido(card,"Tamanhos","P: "+textoSeguro(p.tamanhoP,"0")+" | M: "+textoSeguro(p.tamanhoM,"0")+" | G: "+textoSeguro(p.tamanhoG,"0")+" | GG: "+textoSeguro(p.tamanhoGG,"0"));
            campoPedido(card,"Cor da malha",p.corMalha); campoPedido(card,"Data de entrega",formatarDataEntrega(p.dataEntrega)); campoPedido(card,"Observações",p.observacoes);
            if (typeof p.imagem === "string" && /^data:image\/(png|jpeg|webp|gif);base64,/i.test(p.imagem)) { var img=document.createElement("img"); img.src=p.imagem; img.alt="Arte do pedido "+textoSeguro(p.nomeServico); img.loading="lazy"; card.appendChild(img); }
            var btn=document.createElement("button"); btn.type="button"; btn.className="excluir"; btn.textContent="Excluir pedido"; btn.addEventListener("click",function(){ excluirPedido(p.id); }); card.appendChild(btn); lista.appendChild(card);
        });
      }).catch(function(e) { console.error(e); lista.textContent="Não foi possível carregar os pedidos. Verifique sua conexão e tente novamente."; });
}
function excluirPedido(id) {
    if (!confirm("Deseja realmente excluir este pedido?")) return;
    fetch(API_PEDIDOS+"/id/"+encodeURIComponent(id),{method:"DELETE"}).then(function(r){if(!r.ok) throw new Error("Falha ao excluir pedido ("+r.status+")."); return r.text();})
      .then(carregarPedidos).catch(function(e){console.error(e);alert("Não foi possível excluir o pedido. Tente novamente.");});
}
function voltarHall(){ window.location.href="hall.html"; }
carregarPedidos();
