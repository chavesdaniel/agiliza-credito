$(function(){
    verificarMensagem();
})

function verificarMensagem(){
    var link = "https://agiliza-apis.labbs.com.br/api/mensagens/"+sessionStorage.getItem("cnpj");
    $.ajax({
        url: link,
        dataType: "json",
        type: 'GET'
    }).done(function(dados) {
        contarMensagens(dados);
    }).fail(function() {
        console.log("error");
    });
}

function contarMensagens(dados){
    var quantidade = 0;
    for (var key in dados) {
        if(dados[key].lida == "0"){
            quantidade++;
        }
    }

    $("#bad_mensagem").html(quantidade);
}