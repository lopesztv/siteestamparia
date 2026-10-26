function supabaseHeaders() {
    if (!window.SUPABASE_URL || window.SUPABASE_URL.indexOf("SEU-PROJETO") !== -1 || !window.SUPABASE_ANON_KEY || window.SUPABASE_ANON_KEY.indexOf("SUA_CHAVE") !== -1) {
        throw new Error("Configure a URL e a chave anon do Supabase em js/supabase-config.js.");
    }
    return { "apikey": window.SUPABASE_ANON_KEY, "Authorization": "Bearer " + window.SUPABASE_ANON_KEY, "Content-Type": "application/json" };
}
function urlPedidos(query) { return window.SUPABASE_URL.replace(/\/$/, "") + "/rest/v1/pedidos" + (query || ""); }
function textoSeguro(valor, padrao) {
    return valor === undefined || valor === null || String(valor).trim() === "" ? (padrao || "—") : String(valor);
}
function formatarDataEntrega(valor) {
    if (!valor) return "—";
    var iso = String(valor).match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
    return iso ? iso[3].padStart(2, "0") + "/" + iso[2].padStart(2, "0") + "/" + iso[1] : String(valor);
}
function campoPedido(cartao, titulo, valor) {
    var p = document.createElement("p"), strong = document.createElement("strong");
    strong.textContent = titulo + ": "; p.appendChild(strong); p.appendChild(document.createTextNode(textoSeguro(valor))); cartao.appendChild(p);
}
function carregarPedidos() {
    var lista = document.getElementById("listaPedidos");
    lista.textContent = "Carregando pedidos…";
    var headers;
    try { headers = supabaseHeaders(); } catch (e) { lista.textContent = e.message; return; }
    fetch(urlPedidos("?select=*&order=id.desc"), { headers: headers })
      .then(function(r) { return r.json().then(function(body) { if (!r.ok) throw new Error(body.message || "Falha ao consultar pedidos (" + r.status + ")."); return body; }); })
      .then(function(pedidos) {
        if (!Array.isArray(pedidos)) throw new Error("A resposta recebida não está no formato esperado.");
        lista.replaceChildren();
        if (!pedidos.length) { var vazio = document.createElement("p"); vazio.className = "sem-pedidos"; vazio.textContent = "Nenhum pedido cadastrado ainda."; lista.appendChild(vazio); return; }
        pedidos.forEach(function(p) {
            var card = document.createElement("article"), h = document.createElement("h3"); card.className = "pedido"; h.textContent = textoSeguro(p.nomeServico, "Pedido sem nome"); card.appendChild(h);
            campoPedido(card, "Pedido feito em", p.createdAt ? new Date(p.createdAt).toLocaleDateString("pt-BR") : "Data não disponível");
            campoPedido(card, "Quantidade", textoSeguro(p.quantidade) + " peças");
            campoPedido(card, "Tamanhos", "P: " + textoSeguro(p.tamanhoP, "0") + " | M: " + textoSeguro(p.tamanhoM, "0") + " | G: " + textoSeguro(p.tamanhoG, "0") + " | GG: " + textoSeguro(p.tamanhoGG, "0"));
            campoPedido(card, "Cor da malha", p.corMalha); campoPedido(card, "Data de entrega", formatarDataEntrega(p.dataEntrega)); campoPedido(card, "Observações", p.observacoes);
            if (typeof p.imagem === "string" && /^data:image\/(png|jpeg|webp|gif);base64,/i.test(p.imagem)) { var img = document.createElement("img"); img.src = p.imagem; img.alt = "Arte do pedido " + textoSeguro(p.nomeServico); img.loading = "lazy"; card.appendChild(img); }
            var btn = document.createElement("button"); btn.type = "button"; btn.className = "excluir"; btn.textContent = "Excluir pedido"; btn.addEventListener("click", function() { excluirPedido(p.id); }); card.appendChild(btn); lista.appendChild(card);
        });
      }).catch(function(e) { console.error(e); lista.textContent = "Não foi possível carregar os pedidos. " + e.message; });
}
function excluirPedido(id) {
    if (!confirm("Deseja realmente excluir este pedido?")) return;
    var headers;
    try { headers = supabaseHeaders(); } catch (e) { alert(e.message); return; }
    fetch(urlPedidos("?id=eq." + encodeURIComponent(id)), { method: "DELETE", headers: headers })
      .then(function(r) { return r.text().then(function(t) { if (!r.ok) throw new Error(t || "Falha ao excluir pedido (" + r.status + ")."); }); })
      .then(carregarPedidos).catch(function(e) { console.error(e); alert("Não foi possível excluir o pedido: " + e.message); });
}
function voltarHall() { window.location.href = "hall.html"; }
carregarPedidos();
