function supabaseHeaders() {
    if (!window.SUPABASE_URL || window.SUPABASE_URL.indexOf("SEU-PROJETO") !== -1 || !window.SUPABASE_ANON_KEY || window.SUPABASE_ANON_KEY.indexOf("SUA_CHAVE") !== -1) {
        throw new Error("Configure a URL e a chave anon do Supabase em js/supabase-config.js.");
    }
    return { "apikey": window.SUPABASE_ANON_KEY, "Authorization": "Bearer " + window.SUPABASE_ANON_KEY, "Content-Type": "application/json" };
}
function urlPedidos(query) { return window.SUPABASE_URL.replace(/\/$/, "") + "/rest/v1/pedidos" + (query || ""); }
function valorMes(date) { return date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, "0"); }
function inicializarFiltroMes() {
    var campo = document.getElementById("filtroMes");
    campo.value = valorMes(new Date());
    campo.addEventListener("change", carregarPedidos);
    document.getElementById("mesAnterior").addEventListener("click", function() { alterarMes(-1); });
    document.getElementById("mesProximo").addEventListener("click", function() { alterarMes(1); });
}
function alterarMes(deslocamento) {
    var campo = document.getElementById("filtroMes");
    if (!/^\d{4}-\d{2}$/.test(campo.value)) campo.value = valorMes(new Date());
    var partes = campo.value.split("-");
    var data = new Date(Number(partes[0]), Number(partes[1]) - 1 + deslocamento, 1);
    campo.value = valorMes(data);
    carregarPedidos();
}
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
function abrirImagemPedido(src, descricao, origem) {
    var visualizador = document.getElementById("visualizadorImagem");
    if (!visualizador) {
        visualizador = document.createElement("div");
        visualizador.id = "visualizadorImagem";
        visualizador.className = "visualizador-imagem";
        visualizador.setAttribute("role", "dialog");
        visualizador.setAttribute("aria-modal", "true");
        visualizador.setAttribute("aria-label", "Imagem ampliada do pedido");
        visualizador.hidden = true;
        var fechar = document.createElement("button");
        fechar.type = "button"; fechar.className = "fechar-visualizador"; fechar.textContent = "×"; fechar.setAttribute("aria-label", "Fechar imagem");
        var imagem = document.createElement("img"); imagem.id = "imagemAmpliada";
        visualizador.appendChild(fechar); visualizador.appendChild(imagem); document.body.appendChild(visualizador);
        fechar.addEventListener("click", fecharImagemPedido);
        visualizador.addEventListener("click", function(evento) { if (evento.target === visualizador) fecharImagemPedido(); });
        document.addEventListener("keydown", function(evento) {
            if (visualizador.hidden) return;
            if (evento.key === "Escape") fecharImagemPedido();
            if (evento.key === "Tab") { evento.preventDefault(); fechar.focus(); }
        });
    }
    window.imagemPedidoFocoAnterior = origem;
    var ampliada = document.getElementById("imagemAmpliada");
    ampliada.src = src; ampliada.alt = descricao;
    visualizador.hidden = false;
    visualizador.querySelector("button").focus();
}
function fecharImagemPedido() {
    var visualizador = document.getElementById("visualizadorImagem");
    if (!visualizador || visualizador.hidden) return;
    visualizador.hidden = true;
    document.getElementById("imagemAmpliada").removeAttribute("src");
    if (window.imagemPedidoFocoAnterior) window.imagemPedidoFocoAnterior.focus();
}
function criarBarraStatus(pedido) {
    var area = document.createElement("div"), rotulo = document.createElement("strong"), grupo = document.createElement("div"), aviso = document.createElement("span");
    var statusAtual = pedido.status || "TRANQUILO";
    area.className = "status-pedido";
    rotulo.className = "status-titulo"; rotulo.textContent = "Situação do pedido";
    grupo.className = "status-barra"; grupo.setAttribute("role", "group"); grupo.setAttribute("aria-label", "Situação do pedido");
    aviso.className = "status-aviso"; aviso.setAttribute("aria-live", "polite");
    ["PRIORIDADE", "TRANQUILO", "ESPERA"].forEach(function(status) {
        var botao = document.createElement("button");
        botao.type = "button"; botao.className = "status-opcao status-" + status.toLowerCase(); botao.textContent = status;
        botao.setAttribute("aria-pressed", statusAtual === status ? "true" : "false");
        botao.addEventListener("click", function() { salvarStatus(pedido.id, status, grupo, aviso); });
        grupo.appendChild(botao);
    });
    area.appendChild(rotulo); area.appendChild(grupo); area.appendChild(aviso);
    return area;
}
function salvarStatus(id, status, grupo, aviso) {
    var botoes = Array.prototype.slice.call(grupo.querySelectorAll("button"));
    var selecionado = botoes.find(function(botao) { return botao.getAttribute("aria-pressed") === "true"; });
    if (selecionado && selecionado.textContent === status) return;
    botoes.forEach(function(botao) { botao.disabled = true; });
    aviso.textContent = "Salvando…";
    var headers;
    try { headers = supabaseHeaders(); } catch (e) { aviso.textContent = e.message; botoes.forEach(function(botao) { botao.disabled = false; }); return; }
    fetch(urlPedidos("?id=eq." + encodeURIComponent(id)), { method: "PATCH", headers: Object.assign({}, headers, { "Prefer": "return=minimal" }), body: JSON.stringify({ status: status }) })
      .then(function(r) { return r.text().then(function(t) { if (!r.ok) { var body; try { body = t ? JSON.parse(t) : {}; } catch (e) { body = {}; } throw new Error(body.message || "Falha ao atualizar o status (" + r.status + ")."); } }); })
      .then(function() { botoes.forEach(function(botao) { botao.setAttribute("aria-pressed", botao.textContent === status ? "true" : "false"); }); aviso.textContent = "Salvo"; })
      .catch(function(e) { console.error(e); aviso.textContent = "Não foi possível salvar."; alert("Não foi possível atualizar o status: " + e.message); })
      .finally(function() { botoes.forEach(function(botao) { botao.disabled = false; }); });
}
function carregarPedidos() {
    var campoMes = document.getElementById("filtroMes");
    if (!/^\d{4}-\d{2}$/.test(campoMes.value)) campoMes.value = valorMes(new Date());
    var partesMes = campoMes.value.split("-");
    var inicioMes = new Date(Number(partesMes[0]), Number(partesMes[1]) - 1, 1);
    var inicioProximoMes = new Date(Number(partesMes[0]), Number(partesMes[1]), 1);
    var nomeMes = new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(inicioMes);
    document.getElementById("mesSelecionado").textContent = "Pedidos de " + nomeMes;
    var lista = document.getElementById("listaPedidos");
    lista.textContent = "Carregando pedidos…";
    var headers;
    try { headers = supabaseHeaders(); } catch (e) { lista.textContent = e.message; return; }
    var parametros = new URLSearchParams();
    parametros.set("select", "*");
    parametros.set("and", "(createdAt.gte." + inicioMes.toISOString() + ",createdAt.lt." + inicioProximoMes.toISOString() + ")");
    parametros.set("order", "id.desc");
    fetch(urlPedidos("?" + parametros.toString()), { headers: headers })
      .then(function(r) { return r.json().then(function(body) { if (!r.ok) throw new Error(body.message || "Falha ao consultar pedidos (" + r.status + ")."); return body; }); })
      .then(function(pedidos) {
        if (!Array.isArray(pedidos)) throw new Error("A resposta recebida não está no formato esperado.");
        lista.replaceChildren();
        if (!pedidos.length) { var vazio = document.createElement("p"); vazio.className = "sem-pedidos"; vazio.textContent = "Nenhum pedido cadastrado neste mês."; lista.appendChild(vazio); return; }
        pedidos.forEach(function(p) {
            var card = document.createElement("article"), h = document.createElement("h3"); card.className = "pedido"; h.textContent = textoSeguro(p.nomeServico, "Pedido sem nome"); card.appendChild(h);
            campoPedido(card, "Pedido feito em", p.createdAt ? new Date(p.createdAt).toLocaleDateString("pt-BR") : "Data não disponível");
            campoPedido(card, "Quantidade", textoSeguro(p.quantidade) + " peças");
            campoPedido(card, "Tamanhos", "P: " + textoSeguro(p.tamanhoP, "0") + " | M: " + textoSeguro(p.tamanhoM, "0") + " | G: " + textoSeguro(p.tamanhoG, "0") + " | GG: " + textoSeguro(p.tamanhoGG, "0"));
            campoPedido(card, "Cor da malha", p.corMalha); campoPedido(card, "Data de entrega", formatarDataEntrega(p.dataEntrega)); campoPedido(card, "Observações", p.observacoes);
            card.appendChild(criarBarraStatus(p));
            if (typeof p.imagem === "string" && /^data:image\/(png|jpeg|webp|gif);base64,/i.test(p.imagem)) { var img = document.createElement("img"); img.src = p.imagem; img.alt = "Arte do pedido " + textoSeguro(p.nomeServico); img.loading = "lazy"; img.className = "imagem-ampliavel"; img.tabIndex = 0; img.setAttribute("role", "button"); img.setAttribute("aria-label", "Ampliar arte do pedido " + textoSeguro(p.nomeServico)); img.addEventListener("click", function() { abrirImagemPedido(img.src, img.alt, img); }); img.addEventListener("keydown", function(evento) { if (evento.key === "Enter" || evento.key === " ") { evento.preventDefault(); abrirImagemPedido(img.src, img.alt, img); } }); card.appendChild(img); }
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
inicializarFiltroMes();
carregarPedidos();
