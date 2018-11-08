$(function(){
    if(!verificarAcesso()) {
        window.location='index.html';
    }

    $("#btn_enviar").click(function(event){
        event.preventDefault();
        mixpanel.track("Enviar_Feedback");
        enviarFeedback();
    });
})

function verificarAcesso(){
    if(sessionStorage.getItem("cnpj") === null || sessionStorage.getItem("cnpj") === undefined || sessionStorage.getItem("cnpj") === ""){
        return false;
    } else {
        return true;
    }
}

function enviarFeedback(){
    var link = "https://agiliza-apis.labbs.com.br/api/feedback/";
    var feedback = {};
    feedback.cnpj = sessionStorage.getItem("cnpj");
    feedback.mensagem = $("#txt_feedback").val();
    feedback.data = new Date();
    console.log(feedback.data);

    $.ajax({
        method: "POST",
        url: link,
        data: feedback,
        success: function() {
            alert("Enviado com sucesso.");
            $("#txt_feedback").val("");
        },
        error: function(){
            alert("Erro ao enviar.");
        }
    })
}