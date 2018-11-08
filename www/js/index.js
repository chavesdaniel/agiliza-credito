var operacoesClienteObject = {};
operacoesClienteObject.isReady = false;

var valorClicadoParaComparacao = 0;

$(function(){

    if(verificarAcesso()) {
        getOperacoesCliente();
    }
    else {
        //console.log("erro ao trazer dados do usuario logado");
        window.location='index.html';
    }

    $("#fil_galeria").hide();
    $("#fil_galeria").change(function(event){
        console.log("fil_galeria change.....");
        const leitorArquivo = new FileReader();
        const file = event.target.files[0];

        sessionStorage.setItem("mine", file.type);
        
        leitorArquivo.onload = (e) => {
            console.log("leitorArquivo.onload........");
            var img = document.createElement("img");
            img.onload = () => {
                console.log("img.onload.....");

                var canvas = document.createElement('canvas');
                var ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0);

                var MAX_WIDTH = 1000;;
                // var MAX_HEIGHT = $("#index-main-div-id").height();
                // var MAX_HEIGHT = $(window).height();

                var imgWidth = this.width;
                var imghHeight = this.height;

                console.log("imgWidth: " + imgWidth);
                console.log("imghHeight: " + imghHeight);

                var height = imgWidth * (imghHeight / imgWidth);
                console.log("var height: " + height);
          
                // if (width > height) {
                //   if (width > MAX_WIDTH) {
                //     height *= MAX_WIDTH / width;
                //     width = MAX_WIDTH;
                //   }
                // } else {
                //   if (height > MAX_HEIGHT) {
                //     width *= MAX_HEIGHT / height;
                //     height = MAX_HEIGHT;
                //   }
                // }
                canvas.width = imgWidth;
                canvas.height = height;
                var ctx = canvas.getContext("2d");
                ctx.drawImage(this, 0, 0, imgWidth, height);
                var imgAsDataURL = canvas.toDataURL("image/png");

                // Save image into sessionStorage
                try {
                    console.log("saving imgAsDataURL....");
                    sessionStorage.setItem("arquivo", imgAsDataURL);
                    window.location='pre_envio.html';
                }
                catch (e) {
                    console.log("Storage failed: " + e);
                }

            }
            img.src = e.target.result;
        }
        leitorArquivo.readAsDataURL(file);

        // leitorArquivo.onloadend = function(){
        //     sessionStorage.setItem("arquivo", leitorArquivo.result);
        //     window.location='pre_envio.html';
        // }
    });
    
    $("#lnk_enviar").click(function(event){
        event.preventDefault();
        mixpanel.track("Link_Enviar_Docs");
        $("#fil_galeria").trigger("click");
    });

    $("#mpLogoHome").click(function(){
        mixpanel.track("Home_Logo");
    });
    $("#mpLinkDashboard").click(function(){
        mixpanel.track("Link_Dashboard");
    });

    $("#mpLinkMensagens").click(function(){
        mixpanel.track("Link_Visualizar_Mensagens");
    });

    $("#mpLinkSair").click(function(){
        mixpanel.track("Link_Sair");
    });
});

var dadosDoCliente;

function montarGraficoDonut(objetoClienteFormatado, sliceSelecionado) {
    console.log("objetoClienteFormatado>>>> " + JSON.stringify(objetoClienteFormatado));

    // var donutCenterContent = returnFillDonutContentItem(objetoClienteFormatado.valoresFormatados[0]);

    chart = new Chartist.Pie('.ct-chart', {
        series: objetoClienteFormatado.porcentagensGraficoDonut,
        labels: [1, 2, 3, 4]
      }, {
        chartPadding: 30,
        donut: true,
        showLabel: false,
        donutWidth: 17,
        plugins: [
			Chartist.plugins.fillDonut({
				items: [{
                    content: 
                    '<div style="position: absolute;transform: translate(-50%, -70%)">'+
                    '<span id="doughnut-center-number-id" class="doughnut-center-number">1,6<span class="doughnut-center-number-sufix">mi</span></span>' + 
                    '<br/>' + 
                    '<span id="doughnut-center-slice-type-text-id" class="doughnut-center-slice-type-text">Financiamentos</span>' +
                    '<br/>' + 
                    '<span id="doughnut-center-slice-type-text-to-detail-id" class="doughnut-center-slice-type-text-to-detail">DETALHAR</span>'+
					'</div>'
				}]
			})
		],
		width: $(document).width()/2,
		height: $(document).height()/2
      });


      let valueWithSufixHTML = objetoClienteFormatado.totalFormatado.value+'<span id="donut-sufix-id" class="donut-value-number-sufix">'+objetoClienteFormatado.totalFormatado.suffix+'</span>';
      let tipoOperacaoHTML = "crédito utilizado";
      $("#donut-value-id").html(valueWithSufixHTML);
      $("#donut-type-id").html(tipoOperacaoHTML);

      chart.on('draw', function(data) {
        if(data.type === 'slice') {
          // Get the total path length in order to use for dash array animation
          var pathLength = data.element._node.getTotalLength();
      
          // Set a dasharray that matches the path length as prerequisite to animate dashoffset
          data.element.attr({
            'stroke-dasharray': pathLength + 'px ' + pathLength + 'px'
          });

          // Create animation definition while also assigning an ID to the animation for later sync usage
          var animationDefinition = {
            'stroke-dashoffset': {
              id: 'anim' + data.index,
              dur: 300,
              from: -pathLength + 'px',
              to:  '0px',
              easing: Chartist.Svg.Easing.easeOutQuint,
              // We need to use `fill: 'freeze'` otherwise our animation will fall back to initial (not visible)
              fill: 'freeze'
            }
          };

          // If this was not the first slice, we need to time the animation so that it uses the end sync event of the previous animation
          if(data.index !== 0) {
            animationDefinition['stroke-dashoffset'].begin = 'anim' + (data.index - 1) + '.end';
          }
      
          // We need to set an initial value before the animation starts as we are not in guided mode which would do that for us
          data.element.attr({
            'stroke-dashoffset': -pathLength + 'px'
          });
      
          // We can't use guided mode as the animations need to rely on setting begin manually
          // See http://gionkunz.github.io/chartist-js/api-documentation.html#chartistsvg-function-animate
          data.element.animate(animationDefinition, false);
          
        }
      });

      chart.on("created", function () {
        // attach the necessary events to the nodes:
        $('.ct-chart-donut .ct-slice-donut').click(function () {
            // $(this).css("stroke-width","40px");

            var actualStrokeWidth = $(this).css("stroke-width");
            var isGrowth = false;


            var w = window,
            d = document,
            e = d.documentElement,
            g = d.getElementsByTagName('body')[0],
            x = w.innerWidth || e.clientWidth || g.clientWidth,
            y = w.innerHeight|| e.clientHeight|| g.clientHeight;
    
            var result = (x*3)/100;

            // if(actualStrokeWidth == result) {
            if(actualStrokeWidth == "30px") {
              isGrowth = false;
            }
            else {
              isGrowth = true;
            }

            let toDiminute = result - 10;
            
            if(isGrowth) {
              $(this).css({"stroke-width": "30px",
              "-webkit-transition": "stroke-width .15s ease-out", 
              "-moz-transition": "stroke-width .15s ease-out", 
              "-o-transition": "stroke-width .15s ease-out",
              "transition": "stroke-width .15s ease-out"});
            }
            else {
                $('.ct-chart-donut .ct-slice-donut').each(function(){                  
                    $(this).css({"stroke-width": "30px",
                          "-webkit-transition": "stroke-width .15s ease-out", 
                          "-moz-transition": "stroke-width .15s ease-out", 
                          "-o-transition": "stroke-width .15s ease-out",
                          "transition": "stroke-width .15s ease-out",
                          "filter":"drop-shadow(0 0 0 #1f1f14)"});
                      
                });

              $(this).css({"stroke-width": "53px",
              "-webkit-transition": "stroke-width .15s ease-out", 
              "-moz-transition": "stroke-width .15s ease-out", 
              "-o-transition": "stroke-width .15s ease-out",
              "transition": "stroke-width .15s ease-out"});
            }
            //console.log(">>>>> valorClicadoParaComparacao antes: " + valorClicadoParaComparacao);
            var val = $(this).attr("ct:value");
            

            if(valorClicadoParaComparacao != val) {
                var donutSliceSelected = (objetoClienteFormatado.porcentagensGraficoDonut.indexOf(parseFloat(val)));
                let valueWithSufixHTML = objetoClienteFormatado.valoresFormatados[donutSliceSelected].value+'<span id="donut-sufix-id" class="donut-value-number-sufix">'+objetoClienteFormatado.valoresFormatados[donutSliceSelected].suffix+'</span>';
                let tipoOperacaoHTML = objetoClienteFormatado.tipoOperacoes[donutSliceSelected];
                let saldoDevedorHTML = "saldo devedor";
                //console.log("tipoOperacaoHTML: " + tipoOperacaoHTML);
                $("#donut-value-id").html(valueWithSufixHTML);
                $("#donut-type-id").html(tipoOperacaoHTML);
                $("#saldo-devedor-id").html(saldoDevedorHTML);
                valorClicadoParaComparacao = val;
            }
            else {
                let valueWithSufixHTML = objetoClienteFormatado.totalFormatado.value+'<span id="donut-sufix-id" class="donut-value-number-sufix">'+objetoClienteFormatado.totalFormatado.suffix+'</span>';
                let tipoOperacaoHTML = "crédito utilizado";
                let saldoDevedorHTML = "";
                $("#donut-value-id").html(valueWithSufixHTML);
                $("#donut-type-id").html(tipoOperacaoHTML);
                $("#saldo-devedor-id").html(saldoDevedorHTML);
                valorClicadoParaComparacao = 0;
            }

            changeDonutContent(chart, val, objetoClienteFormatado);
        });
    });
}

function novoChart(){
	montarGraficoDonut(dadosDoCliente);
}

function verificarAcesso(){
    if(sessionStorage.getItem("cnpj") === null || sessionStorage.getItem("cnpj") === undefined || sessionStorage.getItem("cnpj") === ""){
        return false;
    } else {
        return true;
    }
}

function obterDadosCliente(dados){
    for (var key in dados) {
        if (dados.hasOwnProperty(key)) {
            if(dados[key].cnpj == sessionStorage.getItem("cnpj")){
                //console.log("investimentos: " + dados[key].investimentos);
                //console.log("dados[key]: " + JSON.stringify(dados[key]));
                return dados[key].investimentos;
            }
        }
    }
}

const getOperacoesCliente = async function() {
    let cnpjCliente = sessionStorage.getItem("cnpj");
    let urlGetOperacoes = "https://agiliza-apis.labbs.com.br/api/operacoes/" +  cnpjCliente;

    $.ajax({
        url: urlGetOperacoes,
        dataType: "json",
        type: 'GET'
    }).done(function(dados) {
        //console.log("getOperacoesCliente, retorno ajax: " + JSON.stringify(dados));
        console.log("montarObjetoOperacoesCliente(dados)>>>>> " + JSON.stringify(montarObjetoOperacoesCliente(dados)));
        montarGraficoDonut(montarObjetoOperacoesCliente(dados));
        dadosDoCliente = montarObjetoOperacoesCliente(dados);
    }).fail(function() {
        //console.log("error getting dados_clientes");
    });
}

function montarObjetoOperacoesCliente(responseAPI) {
    console.log(responseAPI);
    let operacoesClienteReady = {};

    operacoesClienteReady.total = 0;
    operacoesClienteReady.totalFormatado = "";
    operacoesClienteReady.porcentagensGraficoDonut = new Array();
    operacoesClienteReady.valoresFormatados = new Array();
    operacoesClienteReady.tipoOperacoes = new Array();

    responseAPI.forEach(function(elemento) {
        var elementWithoutCurrency;
        var elementWithoutDots;
        if(typeof elemento.saldo_devedor != "number") {
            var pattern = "R$ ";
            console.log("elemento.saldo_devedor.substring: " + elemento.saldo_devedor.replace(pattern, ''));
            elementWithoutCurrency = elemento.saldo_devedor.replace(pattern, '');
            elementWithoutDots = elementWithoutCurrency.replace('.', '');
            console.log(">>>>>>>>>>> elementWithoutCurrency and Dots: " + elementWithoutDots);
        }
        operacoesClienteReady.total += parseFloat(elementWithoutDots);
    });

    let totalUmaCasaDecimal = preciseRound(operacoesClienteReady.total, 1);
    operacoesClienteReady.totalFormatado = abbreviateNumber(totalUmaCasaDecimal,1);

    responseAPI.forEach(function(elemento) {
        var elementWithoutCurrency;
        var elementWithoutDots;
        if(typeof elemento.saldo_devedor != "number") {
            var pattern = "R$ ";
            console.log("elemento.saldo_devedor.substring: " + elemento.saldo_devedor.replace(pattern, ''));
            elementWithoutCurrency = elemento.saldo_devedor.replace(pattern, '');
            elementWithoutDots = elementWithoutCurrency.replace('.', '');
            console.log(">>>>>>>>>>> elementWithoutCurrency and Dots: " + elementWithoutDots);
        }

        operacoesClienteReady.porcentagensGraficoDonut.push(parseFloat(elementWithoutDots)/operacoesClienteReady.total * 100);
        let saldoDevedorUmaCasaDecimal = preciseRound(parseFloat(elementWithoutDots), 1);

        operacoesClienteReady.valoresFormatados.push(abbreviateNumber(saldoDevedorUmaCasaDecimal,1));
        operacoesClienteReady.tipoOperacoes.push(elemento.linha);
    });

    operacoesCliente = operacoesClienteReady;
    operacoesClienteReady.isReady = true;

    //console.log(">>>>>>> totalFormatado: " + JSON.stringify(operacoesClienteReady.totalFormatado));

    return operacoesClienteReady;
}

// function formatarDadosParaPlotarDonut(dadosParaFormatar) {
//     let total = 0;
//     let porcentagensGraficoDonut = new Array();

//     dadosParaFormatar.forEach(function(elemento) {
//         total += parseFloat(elemento.saldo_devedor);
//     });
//     console.log(">>>>>> formatarDados, total:" + total);

//     dadosParaFormatar.forEach(function(elemento) {
//         porcentagensGraficoDonut.push(parseFloat(elemento.saldo_devedor)/total * 100);
//     });

//     return porcentagensGraficoDonut;
    
// };

function preciseRound(num, dec){
 
    if ((typeof num !== 'number') || (typeof dec !== 'number')) 
        return false; 
  
    var num_sign = num >= 0 ? 1 : -1;
      
    return (Math.round((num*Math.pow(10,dec))+(num_sign*0.0001))/Math.pow(10,dec)).toFixed(dec);
}

function abbreviateNumber(number, decPlaces) {
    // 2 decimal places => 100, 3 => 1000, etc
    decPlaces = Math.pow(10,decPlaces);

    let abreviateNumberObject = {};

    // Enumerate number abbreviations
    var abbrev = [ "mil", "mi", "bi", "tri" ];

    // Go through the array backwards, so we do the largest first
    for (var i=abbrev.length-1; i>=0; i--) {

        // Convert array index to "1000", "1000000", etc
        var size = Math.pow(10,(i+1)*3);

        // If the number is bigger or equal do the abbreviation
        if(size <= number) {
             // Here, we multiply by decPlaces, round, and then divide by decPlaces.
             // This gives us nice rounding to a particular decimal place.
             number = Math.round(number*decPlaces/size)/decPlaces;

             // Handle special case where we round up to the next abbreviation
             if((number == 1000) && (i < abbrev.length - 1)) {
                 number = 1;
                 i++;
             }

             // Add the letter for the abbreviation
             abreviateNumberObject.value = number;
             abreviateNumberObject.suffix = abbrev[i];
             number += abbrev[i];

             // We are done... stop
             break;
        }
    }

    // return number;
    return abreviateNumberObject;
}
