var pdfDoc = null,
    pageNum = 1,
    pageRendering = false,
    pageNumPending = null,
    canvas = document.getElementById("can_arquivo"),
    ctx = canvas.getContext('2d');

var base64 = sessionStorage.getItem("arquivo").split(",");

$(function(){
    $("#btn_proximo").hide();
    $("#btn_anterior").hide();
    $("#img_arquivo").hide();
    $("#can_arquivo").hide();
    $("#btn_cancelar").click(function(){
        window.location='index_home.html';
    });

    $("#btn_enviar").click(function(){
        window.location='envio.html';
    });

    if(sessionStorage.getItem("mine") == "application/pdf"){
        carregarPDF();
    }else{
        carregarImg();
    }
});

function carregarImg(){
    console.log("pre_envio....... carregarImg()........");
    // var MAX_WIDTH = $("#index-main-div-id").width();
    var MAX_WIDTH = 1000;
    // var MAX_HEIGHT = $("#index-main-div-id").height();
    // var MAX_HEIGHT = $(window).height();

    console.log("MAX_WIDTH: " + MAX_WIDTH);
    // console.log("MAX_HEIGHT: " + MAX_HEIGHT);

    $("#img_arquivo").show();
    $("#img_arquivo").attr("src", sessionStorage.getItem("arquivo"));

    $("#img_arquivo").on('load', function() {
        console.log("image has loaded....");

        var width = $("#img_arquivo").width();
        // var height = $("#img_arquivo").height();
        var height = $("#img_arquivo").width() * ($("#img_arquivo").height() / $("#img_arquivo").width());
    
        console.log("antes width: " + width);
        console.log("antes height: " + height);
    
        if (width > MAX_WIDTH) {
            console.log("width > MAX_WIDTH...");
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
        } else {
            console.log("else...");
            if (height > MAX_HEIGHT) {
                console.log("height > MAX_HEIGHT......");
                width *= MAX_HEIGHT / height;
                height = MAX_HEIGHT;
            }
        }
    
        console.log("depois width: " + width);
        console.log("depois height: " + height);

        // $("#img_arquivo").css("width", width);
        // $("#img_arquivo").css("height", height);

    });

    console.log("..... $(#img_arquivo).show() .....");
}

function carregarPDF(){
    $("#can_arquivo").show();
    var pdfData = window.atob(base64[1]);
    var pdfjsLib = window['pdfjs-dist/build/pdf'];

    pdfjsLib.GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';

    var loadingTask = pdfjsLib.getDocument({data: pdfData});

    loadingTask.promise.then(function(pdf) {
        if(pdf.numPages > 1){
            $("#btn_proximo").show();
            $("#btn_anterior").show();
        }
        // Colocar na primeira pagina
        var pageNumber = 1;
        pdf.getPage(pageNumber).then(function(page) {
          var scale = 1.5;
          var viewport = page.getViewport(scale);
      
          // Preparar o Canvas para o tamanho do documento
          var canvas = document.getElementById("can_arquivo");
          var context = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;
      
          // Desenhar PDF
          var renderContext = {
            canvasContext: context,
            viewport: viewport
          };
          var renderTask = page.render(renderContext);
          renderTask.then(function () {
            console.log('Page rendered');
          });
        });
      }, function (reason) {
        // Erro
        console.error(reason);
      });
}
