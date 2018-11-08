$(function(){
    verificarAceso();
    $("#fil_galeria").hide();
    $("#fil_galeria").change(function(event){
        const leitorArquivo = new FileReader();
        const file = event.target.files[0];

        sessionStorage.setItem("mine", file.type);
        leitorArquivo.readAsDataURL(file);

        leitorArquivo.onloadend = function(){
            sessionStorage.setItem("arquivo", leitorArquivo.result);
            window.location='pre_envio.html';
        }
    });

    $("#lnk_enviar").click(function(event){
        event.preventDefault();
        $("#fil_galeria").trigger("click");
    });

    $(".mensagem-rodape").click(function(){
        console.log("teste");
    });

    $("#btn_enviar_resposta").click(function(){
        responderMensagem();
    });

    $("#div_mensagens").on("click",".mensagem-rodape", function(event){
        event.preventDefault();
        $("#p_corpo_mensagem").text($(this).attr("data-msg"));
        $("#h_titulo_mensagem").text($(this).attr("data-titulo"));
        $("#btn_enviar_resposta").attr("data-id", $(this).attr("data-id"));
        $("#mod_mensagem").show();
	});;
});

function verificarAceso(){
    if(sessionStorage.getItem("cnpj") === null || sessionStorage.getItem("cnpj") === ""){
        window.location='index.html';
    }else{
        obterMensagens();
    }
}

function obterMensagens(){
    var link = "https://agiliza-apis.labbs.com.br/api/mensagens/"+sessionStorage.getItem("cnpj");
    $.ajax({
        url: link,
        dataType: "json",
        type: 'GET'
    }).done(function(dados) {
        formatarMensagens(dados);
    }).fail(function() {
        console.log("error");
    });
}

function responderMensagem(){
    var link = "https://agiliza-apis.labbs.com.br/api/resposta/";
    var resposta = {};
    resposta.cnpj = sessionStorage.getItem("cnpj");
    resposta.resposta = $("#txt_resposta").val();
    resposta.id_pergunta = $("#btn_enviar_resposta").attr("data-id");

    $.ajax({
        method: "POST",
        url: link,
        data: resposta,
        success: function() {
            alert("Enviado com sucesso");
        },
        error: function(){
            alert("Erro ao enviar");
        }
    })
}
/*
function marcarMensagemComoLida(mensagem){
    var link = "https://agiliza-apis.labbs.com.br/api/mensagens/";
    $.ajax({
        method: "PUT",
        url: link,
        data: mensagem
    })
    .done(function(msg) {
       console.log(mensagem); 
    });
}
*/
function formatarMensagens(dados){
    var classe_cabecalho = "";
    var classe_corpo = "";
    var primeiro = true; 
    for (var key in dados) {
        if(primeiro){
            $("#div_mensagens").html("");
            primeiro = false;
        }
        classe_cabecalho = "mensagem-cabecalho";
        classe_corpo = "mensagem-corpo";
        if (dados.hasOwnProperty(key)) {
            if(dados[key].lida == "1"){
                classe_cabecalho = "mensagem-lida-cabecalho'";
                classe_corpo = "mensagem-lida-corpo";
            }
            var html = "<div class='mensagem'>"+
            "<div class='row'>"+
                    "<div class='col-md-1 col-1'>"+
                        "<img src='icons/"+dados[key].imagem+"' class='float-right mensagem-icone'>"+
                    "</div>"+
                    "<div class='col-md-11 col-11'>"+
                        "<span class='"+classe_cabecalho+"'>"+dados[key].titulo+"</span>"+
                        "<span class='"+classe_corpo+"'>"+dados[key].msg+"</span>"+
                    "</div>"+
                "</div>"+
                "<div class='row'>"+
                    "<div class='col-md-12 col-12 text-right'>"+
                        "<a data-id='"+dados[key]._id+"' data-titulo='"+dados[key].titulo+"' data-msg='"+dados[key].msg+"' href='#' data-toggle='modal' data-target='#mod_mensagem' class='mensagem-rodape'>"+dados[key].msg_link+"</a>"+
                    "</div>"+
                "</div>"+
            "</div>";
            $("#div_mensagens").append(html);
        }
    }
}

function receitaWS(){
    var link = "http://www.receitaws.com.br/v1/cnpj/"+sessionStorage.getItem("cnpj")+"?callback=JSONP_CALLBACK"; 
    $.ajax({
        url: link,
        dataType: "jsonp"
    });
}

function JSONP_CALLBACK(json){
    console.log(json.qsa);
}