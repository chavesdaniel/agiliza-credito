var base64 = sessionStorage.getItem("arquivo").split(",");

$(function(){
    enviarArquivo();
})

function enviarArquivo(){
    var horaAtual = new Date().getTime();

    var formData = new FormData();
    formData.append("file", this.base64ToBlob(base64[1], 
                    sessionStorage.getItem("mine")), sessionStorage.getItem("cnpj")+
                    "_"+horaAtual.toString());

    var xhr = new XMLHttpRequest();
    var sofar = 0;
    var thisvalue = 0;
    var tela = document.getElementById("cv_progresso");
    var ctx = tela.getContext("2d");
    var canvas_size = [128, 128];
    var radius = Math.min(canvas_size[0], canvas_size[1]) / 2;
    var center = [150/2, 150/2]; 
    var color = "yellow";
    var imagem = new Image();
    ctx.beginPath();
    imagem.src = "./icons/icon-128x128.png";
    imagem.onload = function() {
        ctx.drawImage(imagem,10,10);
    }


    xhr.addEventListener("progress", updateProgress);
    xhr.addEventListener("load", transferComplete);
    xhr.addEventListener("error", transferFailed);
    xhr.addEventListener("abort", transferCanceled);

    xhr.onprogress = function (event) {
        //$("#spn_porcentage").html((event.loaded/event.total)*100+"%");
        thisvalue = event.loaded / event.total;
        ctx.arc(center[0], center[1], radius, Math.PI * (- 0.5 + 2 * sofar),           
            Math.PI * (- 0.5 + 2 * (sofar + thisvalue)),false);   
        ctx.closePath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 7;
        ctx.stroke();        
        sofar += thisvalue;
    }

    xhr.onload = function(){
        sessionStorage.setItem("arquivo", "");
        setInterval(function(){ window.location='index_home.html'; }, 2000);
    }

    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
          ctx.clearRect(0, 0, 150, 150);
          imagem.src = "./imagens/progresso-concluido.png";
          imagem.onload = function() {
              ctx.drawImage(imagem,10,10);
          }
          $("#spn_mensagem").html("Documento enviado");
        }
    }
  

    function transferFailed(evt) {
        console.log("An error occurred while transferring the file.");
        bootstrap_alert.warning("Problema no envio do arquivo");
      }

    xhr.open("POST", "https://agiliza-apis.labbs.com.br/api/upload");
    //xhr.open("POST", "http://localhost:8080/api/upload");
    xhr.send(formData);
}

function base64ToBlob(base64, mime){
    mime = mime || '';
    var sliceSize = 1024;
    var byteChars = window.atob(base64);
    var byteArrays = [];

    for (var offset = 0, len = byteChars.length; offset < len; offset += sliceSize) {
        var slice = byteChars.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, {type: mime});
}

bootstrap_alert = function() {}
bootstrap_alert.warning = function(message) {
    $('#envioProgressId').html('<div class="alert alert-danger fade show"><a class="close" data-dismiss="alert">×</a><span>'+message+'</span></div>').fadeIn("300");
}