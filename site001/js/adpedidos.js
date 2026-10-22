var API_PEDIDOS = "https://sheetdb.io/api/v1/f2rep5lfrfp1p";
var LIMITE_ARTE_CARACTERES = 38000;

function abrirImagem(arquivo) {
    return new Promise(function(resolve, reject) {
        var imagem = new Image();
        var url = URL.createObjectURL(arquivo);
        imagem.onload = function() { URL.revokeObjectURL(url); resolve(imagem); };
        imagem.onerror = function() { URL.revokeObjectURL(url); reject(new Error("Não foi possível abrir esta imagem.")); };
        imagem.src = url;
    });
}

function prepararImagem(arquivo) {
    return abrirImagem(arquivo).then(function(imagem) {
        var canvas = document.createElement("canvas");
        var contexto = canvas.getContext("2d");
        if (!contexto) throw new Error("Este navegador não conseguiu preparar a imagem.");

        var tamanhos = [1000, 800, 640, 512, 400, 320, 256, 192, 128];
        var qualidades = [0.72, 0.56, 0.4, 0.28, 0.18];
        var melhor = "";
        for (var i = 0; i < tamanhos.length; i++) {
            var escala = Math.min(1, tamanhos[i] / Math.max(imagem.naturalWidth, imagem.naturalHeight));
            canvas.width = Math.max(1, Math.round(imagem.naturalWidth * escala));
            canvas.height = Math.max(1, Math.round(imagem.naturalHeight * escala));
            contexto.clearRect(0, 0, canvas.width, canvas.height);
            contexto.drawImage(imagem, 0, 0, canvas.width, canvas.height);

            for (var j = 0; j < qualidades.length; j++) {
                var dado = canvas.toDataURL("image/webp", qualidades[j]);
                if (!dado.startsWith("data:image/webp")) {
                    contexto.fillStyle = "#ffffff";
                    contexto.globalCompositeOperation = "destination-over";
                    contexto.fillRect(0, 0, canvas.width, canvas.height);
                    contexto.globalCompositeOperation = "source-over";
                    dado = canvas.toDataURL("image/jpeg", qualidades[j]);
                }
                melhor = dado;
                if (dado.length <= LIMITE_ARTE_CARACTERES) return dado;
            }
        }
        if (melhor.length > LIMITE_ARTE_CARACTERES) {
            throw new Error("A imagem ainda ficou grande demais para a planilha. Escolha uma imagem mais simples ou menor.");
        }
        return melhor;
    });
}

function criarPedido() {
    var nome=document.getElementById("nomeServico").value.trim(), quantidade=Number(document.getElementById("quantidade").value), cor=document.getElementById("corMalha").value.trim(), entrega=document.getElementById("dataEntrega").value;
    var arquivo=document.getElementById("arte").files[0], botao=document.getElementById("criarPedido");
    if (!nome || !cor || !entrega || !Number.isInteger(quantidade) || quantidade<1) { alert("Informe o nome do serviço, a quantidade (número inteiro maior que zero), a cor e a data de entrega."); return; }
    if (arquivo && !/^image\//i.test(arquivo.type)) { alert("Selecione um arquivo de imagem válido."); return; }
    if (arquivo && arquivo.size>2*1024*1024) { alert("A imagem deve ter no máximo 2 MB para envio."); return; }
    var partes=entrega.split("-");
    var pedido={id:Date.now(),nomeServico:nome,quantidade:String(quantidade),tamanhoP:document.getElementById("tamanhoP").value||"0",tamanhoM:document.getElementById("tamanhoM").value||"0",tamanhoG:document.getElementById("tamanhoG").value||"0",tamanhoGG:document.getElementById("tamanhoGG").value||"0",corMalha:cor,dataEntrega:partes[2]+"/"+partes[1]+"/"+partes[0],observacoes:document.getElementById("observacoes").value.trim(),imagem:""};
    botao.disabled=true; botao.textContent="Salvando…";
    function enviar(){ salvarPedido(pedido).then(function(){ mostrarPedido(pedido); }).catch(function(e){ alert("Não foi possível criar o pedido: "+e.message); }).finally(function(){botao.disabled=false;botao.textContent="Criar pedido";}); }
    if (!arquivo) { enviar(); return; }
    botao.textContent="Preparando imagem…";
    prepararImagem(arquivo).then(function(imagem){pedido.imagem=imagem;botao.textContent="Salvando…";enviar();}).catch(function(e){botao.disabled=false;botao.textContent="Criar pedido";alert(e.message);});
}
function salvarPedido(p) {
    return fetch(API_PEDIDOS,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({data:[p]})}).then(function(r){return r.text().then(function(t){var corpo;try{corpo=t?JSON.parse(t):{};}catch(e){corpo={message:t};}if(!r.ok)throw new Error((corpo.error||corpo.message||"Serviço de pedidos indisponível (HTTP "+r.status+")."));return corpo;});});
}
function adicionarInfo(alvo,titulo,valor){var d=document.createElement("div"),s=document.createElement("strong");d.className="info";s.textContent=titulo;d.appendChild(s);d.appendChild(document.createTextNode(valor||"—"));alvo.appendChild(d);}
function mostrarPedido(p){var r=document.getElementById("resultado");r.replaceChildren();adicionarInfo(r,"Nome do serviço",p.nomeServico);adicionarInfo(r,"Quantidade",p.quantidade+" peças");adicionarInfo(r,"Tamanhos","P: "+p.tamanhoP+" | M: "+p.tamanhoM+" | G: "+p.tamanhoG+" | GG: "+p.tamanhoGG);adicionarInfo(r,"Cor da malha",p.corMalha);adicionarInfo(r,"Data de entrega",p.dataEntrega);adicionarInfo(r,"Observações",p.observacoes);if(p.imagem){var img=document.createElement("img");img.src=p.imagem;img.alt="Arte do pedido";r.appendChild(img);}var aviso=document.createElement("p");aviso.className="sucesso";aviso.textContent="Pedido criado. Voltando ao menu…";r.appendChild(aviso);setTimeout(function(){window.location.href="hall.html";},3000);}
function voltarHall(){window.location.href="hall.html";}
