var API_PEDIDOS = "https://sheetdb.io/api/v1/f2rep5lfrfp1p";
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
    var leitor=new FileReader(); leitor.onload=function(e){pedido.imagem=e.target.result;enviar();}; leitor.onerror=function(){botao.disabled=false;botao.textContent="Criar pedido";alert("Não foi possível ler a imagem selecionada.");}; leitor.readAsDataURL(arquivo);
}
function salvarPedido(p) {
    return fetch(API_PEDIDOS,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({data:[p]})}).then(function(r){return r.text().then(function(t){var corpo;try{corpo=t?JSON.parse(t):{};}catch(e){corpo={message:t};}if(!r.ok)throw new Error((corpo.error||corpo.message||"Serviço de pedidos indisponível (HTTP "+r.status+")."));return corpo;});});
}
function adicionarInfo(alvo,titulo,valor){var d=document.createElement("div"),s=document.createElement("strong");d.className="info";s.textContent=titulo;d.appendChild(s);d.appendChild(document.createTextNode(valor||"—"));alvo.appendChild(d);}
function mostrarPedido(p){var r=document.getElementById("resultado");r.replaceChildren();adicionarInfo(r,"Nome do serviço",p.nomeServico);adicionarInfo(r,"Quantidade",p.quantidade+" peças");adicionarInfo(r,"Tamanhos","P: "+p.tamanhoP+" | M: "+p.tamanhoM+" | G: "+p.tamanhoG+" | GG: "+p.tamanhoGG);adicionarInfo(r,"Cor da malha",p.corMalha);adicionarInfo(r,"Data de entrega",p.dataEntrega);adicionarInfo(r,"Observações",p.observacoes);if(p.imagem){var img=document.createElement("img");img.src=p.imagem;img.alt="Arte do pedido";r.appendChild(img);}var aviso=document.createElement("p");aviso.className="sucesso";aviso.textContent="Pedido criado. Voltando ao menu…";r.appendChild(aviso);setTimeout(function(){window.location.href="hall.html";},3000);}
function voltarHall(){window.location.href="hall.html";}
