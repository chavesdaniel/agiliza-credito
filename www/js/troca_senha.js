$(function(){
    $("#spn_msg").hide();
    $("#btn_enviar").click(function(event){
        event.preventDefault();
        trocarSenha();
    });
})

function trocarSenha(){
    if($("#txt_senha").val() == $("#txt_resenha").val()){

    }else{
        $("#spn_msg").html("Senha diferente enre os campos.");
        $("#spn_msg").show();
    }
}