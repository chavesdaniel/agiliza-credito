$("#loginMessageId").hide();
$(function(){
    var erroLogin = false;

    $("#txt_cnpj").mask('00.000.000/0000-00', {reverse: true});

    $("[data-hide]").on("click touch", function(){
        $(this).closest("." + $(this).attr("data-hide")).fadeOut("300");
    });
    obterCNPJ();
    if (typeof(Storage) !== "undefined") {
        sessionStorage.setItem("cnpj", "");
    } else {
        $("#spn_msg").html("Desculpe, seu navegador não suporta armazenamento na web.");
    }

    var headers = new Headers();
    headers.append('Service-Worker-Allowed', 'site/');

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js')
          .then(function () {
            console.log('service worker registrado');
          })
          .catch(function () {
            console.warn('service worker falhou');
          });
      }

    $("#btn_entrar").click(function(event){
        console.log("btn_entrar click...");

        event.preventDefault();
        var cnpj = $("#txt_cnpj").val().replace(/\./g, "").replace("/","").replace("-","");
        if($("#txt_senha").val() != "" && cnpj != ""){
            agilizaAPI(cnpj, "senha");
        }
        else {
            console.log("else gilizaAPI");
            bootstrap_alert.warning("Por favor, informe login e senha.");
            if(erroLogin) {
                bootstrap_alert.warning("Oooops! Houve um erro em seu login.");
                erroLogin = false;
            }
            
        }
    });

    // $("#txt_cnpj").on("keyup", function(){
    //     $(this).val(
    //         $(this).val()
    //         .replace(/\D/g, '')
    //         .replace(/^(\d{2})(\d{3})?(\d{3})?(\d{4})?(\d{2})?/, "$1.$2.$3/$4-$5"));
    // });

});

function obterCNPJ(){
    var query = location.search.slice(1);
    var partes = query.split('&');
    var data = {};
    partes.forEach(function (parte) {
        var chaveValor = parte.split('=');
        var chave = chaveValor[0];
        var valor = chaveValor[1];
        data[chave] = valor;
    });
    if(data["chave"] != "" && typeof(data["chave"]) != "undefined"){
        agilizaAPI(data["chave"], "cnpj");
    }
}

function obterSenha(cnpj, dados){
    for (var key in dados) {
        if (dados.hasOwnProperty(key)) {
            if(dados[key].cnpj == cnpj){
                return dados[key].senha;
            }
        }
    }
    return "";
}

function obterCNPJ(mci, dados){
    for (var key in dados) {
        if (dados.hasOwnProperty(key)) {
            if(dados[key].mci == mci){
                return dados[key].cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
            }
        }
    }
    return "";
}

function agilizaAPI(dado, funcao){
    //var link = "http://localhost:8080/api/clientes";
    var link = "https://agiliza-apis.labbs.com.br/api/clientes";
    erroLogin = false;
    $.ajax({
        url: link,
        dataType: "json",
        type: 'GET'
    }).done(function(dados) {
        switch(funcao){
            case "cnpj":
                $("#txt_cnpj").val(obterCNPJ(dado, dados));
                break;
            case "senha":
                if($("#txt_senha").val() == obterSenha(dado, dados)){
                    sessionStorage.setItem("cnpj", dado);

                    // Analytics - Login OK
                    mixpanel.track("Login_Efetuado");
                    erroLogin = false;
                    $("#loginMessageId").fadeOut("300");
                    gravarAcesso();
                    window.location='index_home.html';
                }
            else {
                erroLogin = true;
                bootstrap_alert.warning("Houve um erro na validação do login.");
                // $(".alert").fadeIn("300");
                // Analytics - Erro Senha
                mixpanel.track("Erro_Login");
            }
                break;
        }  


    }).fail(function() {
        console.log("error");
    });
}

function gravarAcesso(){
    var link = "https://agiliza-apis.labbs.com.br/api/acesso/";
    var resposta = {};
    resposta.cnpj = $("#txt_cnpj").val();
    resposta.data = new Date();

    $.ajax({
        method: "POST",
        url: link,
        data: resposta,
        success: function() {
            console.log("Enviado com sucesso");
        },
        error: function(){
            console.log("Erro ao enviar");
        }
    })
}

bootstrap_alert = function() {}
bootstrap_alert.warning = function(message) {
    $('#loginMessageId').html('<div class="alert alert-danger fade show"><a class="close" data-dismiss="alert">×</a><span>'+message+'</span></div>').fadeIn("300");
}