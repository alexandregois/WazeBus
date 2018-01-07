/*
 * Please see the included README.md file for license terms and conditions.
 */


// This file is a suggested starting place for your code.
// It is completely optional and not required.
// Note the reference that includes it in the index.html file.


/*jslint browser:true, devel:true, white:true, vars:true */
/*global $:false, intel:false app:false, dev:false, cordova:false */



// This file contains your event handlers, the center of your application.
// NOTE: see app.initEvents() in init-app.js for event handler initialization code.

// function myEventHandler() {
//     "use strict" ;
// // ...event handler code here...
// }


// ...additional event handlers here...


//var Id_Config = 7; // TCI
//var Id_Config = 6; // BARRETO
var Id_Config = 50; // SALINEIRA


var distanciaPonto = 1000;
var tempoChegada = 0;
var idTipoVeiculo = 0;


var strWCF = "http://ws.globalbus.com.br/WcfMobile.svc/";

var strDestino = null;
var latitudeDestino = null;
var longitudeDestino = null;

var latitudeUsuario = null;
var longitudeUsuario = null;

var strEnderecoGeocode = null;

var posicao = function (position) {};

var Id_Rota = null;
var Id_PontoEmbarque = null;

var strVeiculoEscolhido = null;

var strTelaAnterior = null;

intTelaAtual = null;
intTelaAnterior = null;
//intTela = 1 /Destino
//intTela = 2 /Ponto Destino
//intTela = 3 /Origem 
//intTela = 4 /Ponto Origem
//intTela = 5 /Tipo Onibus
//intTela = 6 /Proximos Horarios
//intTela = 7 /Rota
//intTela = 8 /Mapa


var descricao_PontoDesembarque = null;

var latitude_PontoDesembarque = null;
var longitude_PontoDesembarque = null;


var pontosRota = null;
/*"-22.8958;-42.042|-22.8963;-42.0417|-22.8967;-42.0411|-22.8988;-42.0386|-22.9012;-42.0358|-22.9021;-42.0348|-22.9025;-42.0344|-22.9031;-42.0339|-22.9039;-42.0339|-22.9044;-42.034|-22.9048;-42.0342|-22.9097;-42.0362|-22.9154;-42.0383|-22.9211;-42.0405|-22.9224;-42.0408|-22.9238;-42.041|-22.9266;-42.041|-22.9331;-42.0408|-22.934;-42.0408|-22.9345;-42.0407|-22.9371;-42.0402|-22.9376;-42.0402|-22.9384;-42.0404|-22.9389;-42.0406|-22.9399;-42.0413|-22.9433;-42.0454|-22.9462;-42.0489|-22.9466;-42.0492|-22.9469;-42.0493|-22.9477;-42.0495|-22.9482;-42.0494|-22.9486;-42.049|-22.9489;-42.0483|-22.9496;-42.0471|-22.9517;-42.0435|-22.9547;-42.0391|-22.956;-42.037|-22.9559;-42.036|-22.9553;-42.0314|-22.9553;-42.0307|-22.9556;-42.0292|-22.9563;-42.0277|-22.9566;-42.0274|-22.957;-42.0272|-22.9581;-42.0268|-22.9587;-42.0263|-22.9601;-42.0262|-22.9614;-42.0265|-22.9618;-42.0271|-22.9622;-42.0274|-22.9627;-42.0272|-22.9633;-42.0271|-22.9637;-42.0272|-22.9641;-42.0275|-22.9648;-42.0293";*/

var arrayPontosRota = null; //pontosRota.split("|");


document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    //document.addEventListener("backbutton", onBackKeyDown, false);
    checkConnection();
}

function checkConnection() {
    var networkState = navigator.connection.type;
    var states = {};
    states[Connection.UNKNOWN] = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI] = 'WiFi connection';
    states[Connection.CELL_2G] = 'Cell 2G connection';
    states[Connection.CELL_3G] = 'Cell 3G connection';
    states[Connection.CELL_4G] = 'Cell 4G connection';
    states[Connection.CELL] = 'Cell generic connection';
    states[Connection.NONE] = 'No network connection';

    if (
        (states[networkState]) == states[Connection.NONE] || (states[networkState]) == states[Connection.UNKNOWN]
    ) {
        alert('Não é possível a utilização sem conexão de internet. O aplicativo será fechado.');
        navigator.app.exitApp();
    }
}

document.addEventListener("backbutton", onBackKeyDown, false);


document.addEventListener("intel.xdk.device.hardware.back", function () {

    if (strTelaAnterior == "MapaInicio")
        MapaInicio();

    if (strTelaAnterior == "Places")
        AbrirParaOnde();

    if (strTelaAnterior == "TipoOnibus")
        MontaTelaTipoOnibus();
    
    if (strTelaAnterior == "Horarios")
        VoltarTrajeto();


}, false);

function BotaoVoltar() {
    
    if (strTelaAnterior == "MapaInicio")
        MapaInicio();

    if (strTelaAnterior == "Places")
        AbrirParaOnde();

    if (strTelaAnterior == "TipoOnibus")
        MontaTelaTipoOnibus();
    
    if (strTelaAnterior == "Horarios")
        VoltarTrajeto();
}

function onBackKeyDown() {
    // Handle the back button
    //alert("Click Botao Voltar");

    if (strTelaAnterior == "MapaInicio")
        MapaInicio();

    if (strTelaAnterior == "Places")
        AbrirParaOnde();

    if (strTelaAnterior == "TipoOnibus")
        MontaTelaTipoOnibus();
    
    if (strTelaAnterior == "Horarios")
        VoltarTrajeto();
    
}

function FecharAPP() {
    navigator.app.exitApp();
}

function distance(lat1, lon1, lat2, lon2) {
    var p = 0.017453292519943295; // Math.PI / 180
    var c = Math.cos;
    var a = 0.5 - c((lat2 - lat1) * p) / 2 +
        c(lat1 * p) * c(lat2 * p) *
        (1 - c((lon2 - lon1) * p)) / 2;

    return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
}

function refreshPage() {
    jQuery.mobile.changePage(window.location.href, {
        allowSamePageTransition: true,
        transition: 'none',
        reloadPage: true
    });
}

function checkTodos() {

    if (document.getElementById("chkTodos").checked === true) {

        document.getElementById("chkAcessibilidade").checked = false;
        document.getElementById("chkArCondicionado").checked = false;
    }
}

function formatSeconds(seconds) {

    var date = new Date(1970, 0, 1);
    date.setSeconds(seconds);
    return date.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
}

function clickListaHorarios() {

    $("#listaHorarios li").click(function () {

        latitudePonto = $(this).attr('latitudePonto');
        longitudePonto = $(this).attr('longitudePonto');

        latitudeUsuario = $(this).attr('latitudeUsuario');
        longitudeUsuario = $(this).attr('longitudeUsuario');

        //MontaRota();

    });
}

function getMinutesBetweenDates(startDate, endDate) {
    var diff = endDate.getTime() - startDate.getTime();
    return (diff / 60000);
}

function listarHorarios() {

    //strTelaAnterior = "TipoOnibus";
    strTelaAnterior = "Places";

    document.getElementById("btnHorarios").style.backgroundImage = "url('images/imgBotao0.jpg')";

    var mapHeight = screen.height;
    var mapWidth = screen.width;

    if (mapWidth > 350) {

        document.getElementById("divHorarioDestinos").style.marginTop = "-7px";
        document.getElementById("divHorarioDestinos").style.height = "59px";
        document.getElementById("divHorarioLabelDestino").style.height = "25px";
        document.getElementById("divHorarioLabelEndereco").style.height = "30px";

        document.getElementById("lblHorarioDestinoSelecionado").innerHTML = "Destino:";
        document.getElementById("lblHorarioPontoDestinoSelecionado").innerHTML = strDestino;


    } else {
        document.getElementById("lblHorarioDestinoSelecionado").innerHTML = "Destino: "; //+ strDestino;
        document.getElementById("divHorarioLabelDestino").style.height = "25px";
        document.getElementById("divHorarioLabelEndereco").style.height = "30px";
        document.getElementById("divHorarioDestinos").style.marginTop = "-7px";
        document.getElementById("divHorarioDestinos").style.height = "57px";
        document.getElementById("lblHorarioPontoDestinoSelecionado").innerHTML = strDestino;
    }



    $('#divProgressHorarios').show();

    $("#pageTipoOnibus").hide();
    $("#pageRota").hide();

    $("#pageHorarios").show();
    $("#uib_pageHorarios").show();

    var distancia = 0;

    $('#divListaHorarios ul').empty();


    strVeiculoEscolhido = null;


    var count = 0;

    var strURL = "";

    strURL = strWCF + "ListaPontoProximoPorRotaDestinoInformado?Id_Config=" + Id_Config +
        "&PassageiroLatitude=" + latitudeUsuario + "&PassageiroLongitude=" + longitudeUsuario + "&DestinoLatitude=" + latitudeDestino + "&DestinoLongitude=" + longitudeDestino + "&Id_Cliente=0&TipoVeiculo=" + idTipoVeiculo + "&DistanciaMetros=1000;


    $.ajax({
        type: "GET",
        url: strURL,
        dataType: "json"
    }).done(function (data) {

        $.each(data.Dados, function (i, x) {

            var distanciaUsuarioPonto = x.DistanciaUsuario_PontoProximo | 0;
            var distanciaVeiculoPonto = x.DistanciaVeiculo_PontoProximo | 0;


            if (x.Mensagem === null || x.Mensagem === undefined) {

                var numeroPainel = null;

                if (x.NumeroPainel === null || x.NumeroPainel === undefined) {
                    numeroPainel = "";
                } else {
                    numeroPainel = x.NumeroPainel;
                }


                var RotaPainel = null;

                if (x.RotaPainel === null || x.RotaPainel === undefined) {
                    RotaPainel = x.DescricaoPontoProximo;
                } else
                    RotaPainel = x.RotaPainel;



                //Troca o Nome do Ponto pela Descricao
                var strPonto = null;

                if (Id_Config === 7)
                    strPonto = x.NomePontoProximo;
                else
                    strPonto = x.DescricaoPontoProximo;


                var strColor = null;
                var today = new Date();
                var dataPosicao = new Date(parseInt(x.DataUltimaPosicao.substr(6)));

                var intDiffDate = 0;
                //getMinutesBetweenDates(startDate, endDate);      
                intDiffDate = getMinutesBetweenDates(dataPosicao, today);



                var htmlPonto = null;
                var htmlDistanciaPonto = null;
                var htmlNumeroCarro = null;
                var htmlChegadaPrevista = null;


                $('#divProgressHorarios').hide();


                var strLabelVista = numeroPainel + " " + RotaPainel;


                htmlPonto = "<div style='text-align:left;font-size:20px; margin-top:27px; height:75px; margin-left:37px;'><div style='margin-left:5px;'><img src='images/iconeOpcao.png' width='33px'></div><div style='font-size:30px; margin-left:47px; margin-top:-37px;'> " + distanciaUsuarioPonto + " m</div><div style='font-size:14px; margin-left:49px; margin-top:5px;'>Distância até o ponto</div></div>";

                htmlDistanciaPonto = "<div style='text-align:left;font-size:20px; height:75px; margin-left:37px;'><div style='margin-left:5px;'><img src='images/iconeDistancia.png' width='33px'></div><div style='font-size:30px; margin-left:47px; margin-top:-37px;'> " + distanciaVeiculoPonto + " m</div><div style='font-size:14px; margin-left:49px; margin-top:5px;'>Distância do veículo ao ponto</div></div>";

                if (strLabelVista.length > 15) { //23

                    htmlNumeroCarro = "<div style='text-align:left;font-size:20px; height:105px; margin-left:37px;'><div style='margin-left:5px;'><img src='images/NumeroCarro.png' width='33px'></div><div style='font-size:27px; margin-left:47px; margin-top:-39px;'> " + strLabelVista + "</div><div style='font-size:14px; margin-left:49px; margin-top:5px;'>Carro</div></div>"
                    
                } else {

                    htmlNumeroCarro = "<div style='text-align:left;font-size:20px; height:75px; margin-left:37px;'><div style='margin-left:5px;'><img src='images/NumeroCarro.png' width='33px'></div><div style='font-size:27px; margin-left:47px; margin-top:-39px;'> " + strLabelVista + "</div><div style='font-size:14px; margin-left:49px; margin-top:5px;'>Carro</div></div>"
                }



                htmlChegadaPrevista = "<div style='text-align:left;font-size:20px; height:75px; margin-left:37px;'><div style='margin-left:5px;'><img src='images/iconeTempo.png' width='33px'></div><div style='font-size:30px; margin-left:47px; margin-top:-37px;'> " + x.VeiculoTempoChegada_PontoProximoFormatado + "</div><div style='font-size:14px; margin-left:49px; margin-top:5px;'>Chegada prevista ao ponto</div></div>"


                if ((x.Veiculo !== null) || (x.Veiculo !== undefined)) {

                    //Tempo Chegada ao Ponto    
                    if ((x.VeiculoTempoChegada_PontoProximo) > tempoChegada) {

                        $('#divListaHorarios ul').append("<li latitudeUsuario=" + latitudeUsuario + " longitudeUsuario=" + longitudeUsuario + " latitudePonto=" + x.LatitudePontoProximo + " longitudePonto=" + x.LongitudePontoProximo + " Id_Rota=" + x.Id_Rota + " Id_PontoProximo=" + x.Id_PontoProximo + " Veiculo=" + x.Veiculo + "><div style='width:100%;' id='divEnderecoPonto'><div style='margin-left:11px;'><img src='images/PontodeOnibus.png' width='17px'></div><div style='font-size:16px; margin-left:45px; margin-top:-45px;'>" + strPonto + "</div></div>" + htmlPonto + htmlDistanciaPonto + htmlNumeroCarro + htmlChegadaPrevista + "</li>");

                    }
                }

                var strVeiculo = x.Veiculo;

                if (strVeiculo === null) {


                    var _dt = new Date(parseInt(x.DataPartidaPrevisto.substr(6)));

                    var dtMinutes = _dt.getMinutes();
                    var dtMes = _dt.getMonth() + 1;
                    var strMinutes = null;


                    //if (dtMinutes == 0) {
                    if (dtMinutes.toString().length == 1) {
                        strMinutes = '0' + dtMinutes;
                    } else
                        strMinutes = dtMinutes;


                    var dataPartidaFormatada = [_dt.getDate(), _dt.getMonth() + 1, _dt.getFullYear()].join('/') + ' às ' + [_dt.getHours(), strMinutes].join(':');

                    var distanciaUser = (distance(latitudeUsuario, longitudeUsuario, x.LatitudePontoProximo, x.LongitudePontoProximo) | 0);


                    $('#divProgressHorarios').hide();


                    htmlPonto = "<div style='text-align:left;font-size:20px; margin-top:27px; height:75px; margin-left:37px;'><div style='margin-left:5px;'><img src='images/iconeOpcao.png' width='33px'></div><div style='font-size:30px; margin-left:47px; margin-top:-41px;'> " + distanciaUsuarioPonto + " m</div><div style='font-size:14px; margin-left:49px; margin-top:5px;'>Distância até o ponto</div></div>";

                    htmlDistanciaPonto = "<div style='text-align:left;font-size:20px; height:75px; margin-left:37px;'><div style='margin-left:5px;'><img src='images/iconeDistancia.png' width='33px'></div><div style='font-size:30px; margin-left:47px; margin-top:-41px;'> " + distanciaVeiculoPonto + " m</div><div style='font-size:14px; margin-left:49px; margin-top:5px;'>Distância do veículo ao ponto</div></div>";

                    if (strLabelVista.length > 23) {

                        htmlNumeroCarro = "<div style='text-align:left;font-size:20px; height:135px; margin-left:37px;'><div style='margin-left:5px;'><img src='images/NumeroCarro.png' width='33px'></div><div style='font-size:22px; margin-left:47px; margin-top:-35px;'> " + strLabelVista + "</div><div style='font-size:14px; margin-left:49px; margin-top:5px;'></div></div>"
                    } else {
                        htmlNumeroCarro = "<div style='text-align:left;font-size:20px; height:75px; margin-left:37px;'><div style='margin-left:5px;'><img src='images/NumeroCarro.png' width='33px'></div><div style='font-size:22px; margin-left:47px; margin-top:-35px;'> " + strLabelVista + "</div><div style='font-size:14px; margin-left:49px; margin-top:5px;'></div></div>"
                    }


                    htmlChegadaPrevista = "<div style='text-align:left;font-size:20px; height:75px; margin-left:37px;'><div style='margin-left:5px;'><img src='images/iconeTempo.png' width='33px'></div><div style='font-size:22px; margin-left:47px; margin-top:-37px;'> " + dataPartidaFormatada + "</div><div style='font-size:14px; margin-left:49px; margin-top:5px;'>Próxima saída do terminal</div></div>"



                    $('#divListaHorarios ul').append("<li latitudeUsuario=" + latitudeUsuario + " longitudeUsuario=" + longitudeUsuario + " latitudePonto=" + x.LatitudePontoProximo + " longitudePonto=" + x.LongitudePontoProximo + " Id_Rota=" + x.Id_Rota + " Id_PontoProximo=" + x.Id_PontoProximo + " Veiculo=" + strVeiculo + "><div style='width:100%;' id='divEnderecoPonto'><div style='margin-left:11px;'><img src='images/PontodeOnibus.png' width='17px'></div><div style='font-size:16px; margin-left:45px; margin-top:-45px;'>" + strPonto + "</div></div>" + htmlPonto + htmlNumeroCarro + htmlChegadaPrevista + "</li>");


                }


            } else {


                $('#divProgressHorarios').hide();


                $('#divListaHorarios ul').append("<li latitudeUsuario=" + latitudeUsuario + " longitudeUsuario=" + longitudeUsuario + " latitudePonto=" + x.LatitudePontoProximo + " longitudePonto=" + x.LongitudePontoProximo + " Id_Rota=" + x.Id_Rota + " Id_PontoProximo=" + x.Id_PontoProximo + " Veiculo=" + strVeiculo + "><div style='color:red; padding-top:15px; text-align:center;'>" + x.Mensagem + "</div></li>");

                $("#lblSelecionePonto").hide();
                document.getElementById("lblSelecionePonto").innerHTML = "";

            }


        });

        MontaRotaClick();


        $('#divListaHorarios ul').append("<li></li>");
        $('#divListaHorarios ul').append("<li></li>");
        $('#divListaHorarios ul').append("<li></li>");

        $('#divProgressHorarios').hide();
        $('#divListaHorarios').show();

        count = $("#listaHorarios").length;

    });


    count = $("#divListaHorarios ul").length;


    if (count < 1) {

        $("#lblSelecionePonto").hide();
        document.getElementById("lblSelecionePonto").innerHTML = "";

        $('#divListaHorarios ul').empty();
        $('#listaHorarios').empty();

        $('#divListaHorarios ul').append("<li><div style='color:red; padding-top:-15px;'>Não há horários para o destino escolhido.</div></li>");

    }

}

function checkAr() {

    if (document.getElementById("chkArCondicionado").checked === true) {
        //alert("ppppp");
        document.getElementById("chkAcessibilidade").checked = false;
        document.getElementById("chkTodos").checked = false;
    }
}

function checkAcessibilidade() {

    if (document.getElementById("chkAcessibilidade").checked === true) {

        //alert("ppppp");
        document.getElementById("chkTodos").checked = false;
        document.getElementById("chkArCondicionado").checked = false;
    }
}

function Destino(id_GrupoPontoParada, nome) {
    this.Nome = nome;
    this.Id_GrupoPontoParada = id_GrupoPontoParada;
}

function PontoParada(PontoParada, Id_Rota, Id_PontoReferencia, NomePontoParada, DescricaoPontoParada, Latitude, Longitude, Distancia) {
    this.PontoParada = PontoParada;
    this.Id_Rota = Id_Rota;
    this.Id_PontoReferencia = Id_PontoReferencia;
    this.NomePontoParada = NomePontoParada;
    this.DescricaoPontoParada = DescricaoPontoParada;
    this.Latitude = Latitude;
    this.Longitude = Longitude;
    this.Distancia = Distancia;
}

function Posicao(Latitude, Longitude) {
    this.Latitude = Latitude;
    this.Longitude = Longitude;
}

function MontaPasso1() {

    $("#mainPage").hide();
    $("#pageOrigem").hide();

    $("#pagePasso1").show();
    $("#uib_mainPasso1").show();

    document.getElementById("chkGps").checked = true;
    document.getElementById("chkOrigem").checked = false;

    document.getElementById("chk1km").checked = true;
    document.getElementById("chk25km").checked = false;
    document.getElementById("chkAcimakm").checked = false;

    document.getElementById("chk30s").checked = true;
    document.getElementById("chk15m").checked = false;

}

function FiltrarDestinos() {

    //alert("Input box changed");

    var valThis = $("#txtBuscar").val().toLowerCase();

    if (valThis === "") {
        $('#listaDestinos').show();
    } else {

        $('#listaDestinos li').each(function () {
            var text = $(this).text().toLowerCase();
            (text.indexOf(valThis) >= 0) ? $(this).show(): $(this).hide();
        });
    }

}

function FiltrarOrigem() {

    //alert("Input box changed");

    var valThis = $("#txtBuscarOrigem").val().toLowerCase();

    //alert(valThis);

    if (valThis === "") {
        $('#listaOrigem').show();
    } else {

        $('#listaOrigem li').each(function () {
            var text = $(this).text().toLowerCase();
            (text.indexOf(valThis) >= 0) ? $(this).show(): $(this).hide();
        });
    }

}

function FiltrarPontosDestino() {

    var valThis = $("#txtBuscarPontos").val().toLowerCase();

    //alert(valThis);

    if (valThis === "") {
        $('#listaPontos').show();
    } else {

        $('#listaPontos li').each(function () {
            var text = $(this).text().toLowerCase();
            (text.indexOf(valThis) >= 0) ? $(this).show(): $(this).hide();
        });
    }

}

function FiltrarPontosOrigem() {

    //alert("Input box changed");

    var valThis = $("#txtBuscarPontosOrigem").val().toLowerCase();

    if (valThis === "") {
        $('#listaPontosOrigem').show();
    } else {

        $('#listaPontosOrigem li').each(function () {
            var text = $(this).text().toLowerCase();
            (text.indexOf(valThis) >= 0) ? $(this).show(): $(this).hide();
        });
    }

}

function AbrirBuscaEndereco(ObjValue) {

    $('#divListaEndereco ul').remove('li');
    $('#listaEndereco').empty();


    $("#txtBuscarEndereco").value == "";
    $("#divProgressEndereco").hide();


    if (ObjValue == 1) {

        $("#pageOrigem").hide();

        //Elementos da Page Localizacao.
        $("#pageLocalizacao").show();

        $("#uib_pagelocalizacao").hide();
        $("#headerPageLocalizacao").hide();



        document.getElementById("txtBuscarEndereco").onkeyup =
            function () {
                GetGooglePlaces(1)
            };

        document.getElementById("btnCancelarBuscarEndereco").onclick = function () {
            CancelarBuscaEndereco(1);
        };

        document.getElementById("btnBuscarEndereco").onclick = function () {
            GetGooglePlaces(1)
        };


    } else {

        $("#pageOrigem").hide();

        //Elementos da Page Localizacao.
        $("#pageLocalizacao").show();
        $("#uib_pagelocalizacao").hide();
        $("#headerPageLocalizacao").hide();


        document.getElementById("txtBuscarEndereco").onkeyup =
            function () {
                GetGooglePlaces(2)
            };


        document.getElementById("btnCancelarBuscarEndereco").onclick = function () {
            CancelarBuscaEndereco(2);
        };

        document.getElementById("btnBuscarEndereco").onclick = function () {
            //GetLatLongOpenStreet(2);
            //GetLatLongGoogle(2);
            GetGooglePlaces(2);

        };

    }


    return;

}

function CancelarBuscaEndereco(ObjValue) {

    $("#txtBuscarEndereco").value = "";


    if (ObjValue == 1) {

        $("#pageLocalizacao").hide();

        //Elementos da Page Localizacao Inicio.
        $("#pageOrigem").show();
        $("#uib_pageOrigem").show();

        $("#divListaOrigem").show();
        $("#listaOrigem").show();

        GetOrigem();


    } else {

        $("#pageLocalizacao").hide();

        //Elementos da Page Localizacao Inicio.
        $("#mainPage").show();
        $("#uib_mainpage").show();

        $("#divListaDestinos").show();
        $("#listaDestinos").show();

        GetDestinos();
    }


}

function clickListaPontosOrigem() {


    document.getElementById("txtBuscarPontosOrigem").value = "";


    $("#listaPontosOrigem li").click(function () {

        $("#txtBuscarPontosOrigem").value = "";
        document.getElementById("txtBuscarPontosOrigem").value = "";


        $("#pagePontosOrigem").hide();
        $("#mainPage").show();


        latitudeOrigem = null;
        longitudeOrigem = null;


        latitudeOrigem = $(this).attr('latitude');
        longitudeOrigem = $(this).attr('longitude');


        GetDestinos($(this).attr('latitude'), $(this).attr('longitude'));

    });


}

function GetGooglePlaces(ObjValue) {

    var strEndereco = ObjValue;

    var strURL = "https://maps.googleapis.com/maps/api/place/nearbysearch/xml?location=" + latitudeUsuario + "," + longitudeUsuario + "&radius=50000&name=" + strEndereco + "&key=AIzaSyDJPhPokQKLLxesa0dKy3277vSPDccIIuo";


    setTimeout(function () {

        $.ajax({
            type: "GET",
            url: strURL,
            dataType: "xml"
        }).success(function (xml) {

            $("#divProgressEndereco").hide();

            $('#divListaEndereco ul').remove('li');
            $('#listaEndereco').empty();


            $(xml).find('result').each(function () {

                var name = $(this).children('name').text();
                var endereco = $(this).children('vicinity').text();

                //document.getElementById("divLabelPosicaoAtual").innerHTML = $(this).children('name').text();

                var mapHeight = screen.height;
                var mapWidth = screen.width;

                if (mapWidth > 350) {
                    if (name.length > 35)
                        name = name.substring(0, 35) + "..."

                    if (endereco.length > 85)
                        endereco = endereco.substring(0, 85) + "..."

                } else {
                    if (name.length > 30)
                        name = name.substring(0, 27) + "..."

                    if (endereco.length > 65)
                        endereco = endereco.substring(0, 55) + "..."
                }

                var lat = $(this).children('geometry').children('location').children('lat').text();
                var long = $(this).children('geometry').children('location').children('lng').text();


                latitudeDestino = lat;
                longitudeDestino = long;

                if (endereco == "" || endereco.length < 50) {
                    $('#divListaEndereco ul').append("<li Latitude='" + latitudeDestino + "' Longitude='" + longitudeDestino + "' Valor='" + name + "'><div><img src='images/iconeOpcao.png' width='25px'></div><div style='padding-left:37px; float:left; margin-top:-33px; margin-right:15px;'>" + name + "</br>" + endereco + "</li>");
                } else {
                    $('#divListaEndereco ul').append("<li Latitude='" + latitudeDestino + "' Longitude='" + longitudeDestino + "' Valor='" + name + "'><div><img src='images/iconeOpcao.png' width='25px'></div><div style='padding-left:37px; float:left; margin-top:-41px; margin-right:15px;'>" + name + "</br>" + endereco + "</li>");
                }


                clickListaGoogleDestinos();

            });

            $('#divListaEndereco ul').append("<li></li>");
            $('#divListaEndereco ul').append("<li></li>");
            $('#divListaEndereco ul').append("<li></li>");
            $('#divListaEndereco ul').append("<li></li>");
            $('#divListaEndereco ul').append("<li></li>");


        }).fail(function () {

            $("#divProgressEndereco").hide();

            alert("Informação não encontrada.");
            return;
        });

    }, 1000);

}

function GetLatLongGoogle(ObjValue) {


    var strEndereco = ObjValue;

    var strURL = "https://maps.googleapis.com/maps/api/geocode/xml?address=" + strEndereco + ",brazil&key=AIzaSyDJPhPokQKLLxesa0dKy3277vSPDccIIuo";

    $("#divProgressEndereco").show();


    setTimeout(function () {

        $.ajax({
            type: "GET",
            url: strURL,
            dataType: "xml"
        }).done(function (xml) {


            $(xml).find('result').each(function () {

                $("#divProgressEndereco").hide();

                $('#divListaEndereco ul').remove('li');
                $('#listaEndereco').empty();

                var strEnderecoCompleto = $(this).children('formatted_address').text();

                //document.getElementById("divLabelPosicaoAtual").innerHTML = $(this).children('geometry').children('location').children('lat').text();

                latitudeDestino = $(this).children('geometry').children('location').children('lat').text();
                longitudeDestino = $(this).children('geometry').children('location').children('lat').text();

                $('#divListaEndereco ul').append("<li Latitude='" + latitudeDestino + "' Longitude='" + longitudeDestino + "' Valor='" + strEnderecoCompleto + "'><div><img src='images/iconeOpcao.png' width='25px'></div><div style='padding-left:37px; float:left; margin-top:-31px;'>" + strEnderecoCompleto + "</li>");

                clickListaGoogleDestinos();

            });

        }).fail(function () {

            $("#divProgressEndereco").hide();
            alert("Informação não encontrada.");
            return;
        });

    }, 1000);


}

function GetEnderecoGoogle(Latitude, Longitude) {


    var strURL = "https://maps.googleapis.com/maps/api/geocode/xml?latlng=" + Latitude + "," + Longitude + "&key=AIzaSyDJPhPokQKLLxesa0dKy3277vSPDccIIuo";

    $("#divProgressEndereco").show();
    $("#divMapaTela2").hide();

    setTimeout(function () {

        $.ajax({
            type: "GET",
            url: strURL,
            dataType: "xml"
        }).done(function (xml) {

            var strEnderecoCompleto = $(xml).find('result').children('formatted_address').text();

            if (strEnderecoCompleto.indexOf("Unnamed") > -1)
                document.getElementById("divLabelPosicaoAtual").innerHTML = strEnderecoCompleto.replace("Unnamed Road, ", "").substr(0, 21) + "...";
            else
                document.getElementById("divLabelPosicaoAtual").innerHTML = strEnderecoCompleto.substr(0, 21) + "...";

            $("#divProgressEndereco").hide();
            $("#divMapaTela2").show();

        }).fail(function () {
            $("#divProgressEndereco").hide();
        });

    }, 100);

}

function GetEnderecoGoogle2(Latitude, Longitude) {


    var strURL = "https://maps.googleapis.com/maps/api/geocode/xml?latlng=" + Latitude + "," + Longitude + "&key=AIzaSyDJPhPokQKLLxesa0dKy3277vSPDccIIuo";

    $("#divProgressEndereco").show();
    $("#divMapaTela2").hide();
    
    
    var image = {
        url: 'images/pedestre32.png', // image is 512 x 512
        size: new google.maps.Size(32, 32)
    };
    

    setTimeout(function () {

        $.ajax({
            type: "GET",
            url: strURL,
            dataType: "xml"
        }).done(function (xml) {

            var strEnderecoCompleto = $(xml).find('result').children('formatted_address').text();

            if (strEnderecoCompleto.indexOf("Unnamed") > -1)
                document.getElementById("divLabelPosicaoAtual").innerHTML = strEnderecoCompleto.replace("Unnamed Road, ", "").substr(0, 21) + "...";
            else
                document.getElementById("divLabelPosicaoAtual").innerHTML = strEnderecoCompleto.substr(0, 21) + "...";


            var mapProp = {
                center: new google.maps.LatLng(Latitude, Longitude),
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                disableDefaultUI: true,
                streetViewControl: false,
                scaleControl: false,
                scrollwheel: false,
                zoomControl: false,
                draggable: false,
                disableDoubleClickZoom: true
            };


            var mapHeight = screen.height;
            var mapWidth = screen.width;

            document.getElementById("divMapaTela2").style.height = mapHeight + "px";
            document.getElementById("divMapaTela2").style.width = mapWidth + "px";


            var map = new google.maps.Map(document.getElementById("divMapaTela2"), mapProp);

            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(Latitude, Longitude),
                icon: image,
                draggable: false
            });

            marker.setMap(map);


            google.maps.event.addListener(map, 'dblclick', function (evt) {
                latitudeUsuario = evt.latLng.lat().toFixed(5);
                longitudeUsuario = evt.latLng.lng().toFixed(5);

                marker.setMap(null);

                map.setCenter(new google.maps.LatLng(Latitude, Longitude));

                marker = new google.maps.Marker({
                    position: new google.maps.LatLng(Latitude, Longitude),
                    icon: image,
                    draggable: true,
                    map: map
                });


            });


            $('#divProgressEndereco').hide();
            $('#divMapaTela2').show();


        }).fail(function () {
            $("#divProgressEndereco").hide();
        });

    }, 100);
    
    
    $('#divProgressEndereco').hide();
    $('#divMapaTela2').show();

}

function clickListaEnderecoOrigem(Objeto) {

    //document.getElementById("txtBuscarEndereco").value = "";

    $("#listaEndereco li").click(function () {

        strEnderecoGeocode = $(this).attr('Nome');
        //AtivaTelaDestinoEndereco($(this).attr('Nome'));

    });
}

function clickListaEnderecoDestino(Objeto) {

    //document.getElementById("txtBuscarEndereco").value = "";

    $("#listaEndereco li").click(function () {

        strEnderecoGeocode = $(this).attr('Nome');
        AtivaTelaTipoOnibus($(this).attr('Nome'));

    });
}

function GetLatLongOpenStreet(ObjValue) {


    var strEndereco = "";

    $("#divProgressEndereco").hide();

    strEndereco = $("#txtBuscarEndereco").val();

    if (strEndereco === "") {
        alert("Informe seu endereço.");
        return;
    }


    var strURLGeocode = "http://nominatim.openstreetmap.org/search.php?q=" + strEndereco + "&format=json&limit=1";


    $.ajax({
        type: "GET",
        url: strURLGeocode,
        dataType: "text"
    }).done(function (data) {


        $("#divProgressEndereco").show();

        $('#divListaEndereco ul').remove('li');

        $('#listaEndereco').empty();


        var intPosLat = data.indexOf('"lat"') + 7;
        var intPosLong = data.indexOf('"lon"') + 7;


        var intEnderecoFormatado = data.indexOf('"display_name"') + 16;

        var intGeometry = data.indexOf('"class"');

        var strEnderecoFormatado = data.substr(intEnderecoFormatado, (intGeometry - 2) - intEnderecoFormatado);


        if (ObjValue == 1) {

            latitudeOrigem = data.substr(intPosLat, 10);
            longitudeOrigem = data.substr(intPosLong, 10);

            $('#divListaEndereco ul').append("<li latitudeOrigem='" + latitudeOrigem + "' longitudeOrigem='" + longitudeOrigem + "'><div><img src='images/iconeOpcao.png' width='25px'></div><div style='padding-left:37px; float:left; margin-top:-45px;'>" + strEnderecoFormatado + "</li>");

            $("#divProgressEndereco").hide();

            //AtivaTelaDestinoEndereco();

            clickListaEnderecoOrigem(strEndereco);


        } else {

            latitudeDestino = data.substr(intPosLat, 10);
            longitudeDestino = data.substr(intPosLong, 10);
            //AtivaTelaProximosHorarios(strEndereco);

            $('#divListaEndereco ul').append("<li latitudeOrigem='" + latitudeDestino + "' longitudeOrigem='" + longitudeDestino + "'><div><img src='images/iconeOpcao.png' width='25px'></div><div style='padding-left:37px; float:left; margin-top:-45px;'>" + strEnderecoFormatado + "</li>");

            $("#divProgressEndereco").hide();

            //AtivaTelaProximosHorarios(strEndereco);

            clickListaEnderecoDestino(strEndereco);


            $("#pagePontos").hide();

            strEnderecoGeocode = strEndereco;

        }

    }).fail(function () {

        alert("Informação não encontrada.");

    });

}

//intTela = 1 /Destino
//intTela = 2 /Ponto Destino
//intTela = 3 /Origem 
//intTela = 4 /Ponto Origem
//intTela = 5 /Tipo Onibus
//intTela = 6 /Proximos Horarios
//intTela = 7 /Rota
//intTela = 8 /Mapa

function TelaMapa() {
    intTelaAtual = 8;
    intTelaAnterior = 7;
}

function TelaRota() {
    intTelaAtual = 7;
    intTelaAnterior = 6;
}

function TelaHorarios() {
    intTelaAtual = 6;
    intTelaAnterior = 5;
}

function TelaTipoOnibus() {
    intTelaAtual = 5;
    intTelaAnterior = 1;
}

function RetornaAcessoAPP() {

    strURL = strWCF + "RetornaAcessoAPP?Id_Config=" + Id_Config;

    $.ajax({
        type: "GET",
        url: strURL,
        dataType: "json"
    }).done(function (data) {

        if (data == false) {

            alert('Erro de acesso a dados. Favor contactar o suporte do aplicativo.');
            navigator.app.exitApp();

        } else {

            $("#mainPage").hide();
            $("#pageOrigem").hide();

            $("#pagePasso1").show();
            $("#uib_mainPasso1").show();
        }

    });


}

function MontaRota() {


    $("#pageMapa").hide();
    $("#pageMapaTrajeto").hide();

    $("#pageHorarios").hide();
    $("#uib_pageHorarios").hide();
    $("#divRetornoHorarios").hide();
    $("lblDestinoHorarios").hide();
    $("lblPontoDestinoHorarios").hide();


    $("#pageRota").show();
    $("#uib_pageRota").show();

    $("#divRetornoRota").show();


    $('#divListaRota ul').empty();


    var strRetorno = "Rota até o ponto escolhido ultrapassa 700 metros.";

    var distancia = distance(latitudeUsuario, longitudeUsuario, latitudePonto, longitudePonto);


    $('#divProgressRota').show();



    document.getElementById("labelMapaPonto").onclick =
        function () {
            MontaTrajetoVeiculo();
        };




    var strURL = null;

    strURL = strWCF + "RetornaTrajeto?LatitudeTurista=" + latitudeUsuario + "&LongitudeTurista=" + longitudeUsuario + "&LatitudePonto=" + latitudePonto + "&LongitudePonto=" + longitudePonto + "&Culture=pt-BR";



    $.ajax({
        type: "GET",
        url: strURL,
        dataType: "json"
    }).done(function (data) {

        $.each(data.Dados, function (i, x) {

            var strRota = null;

            if (x.Rota.indexOf("Chegada") > -1) {
                //strRota = x.Rota.replace("em End", "");
                strRota = "Chegada"
            } else {

                if (x.Rota.indexOf("Start") > -1) {
                    strRota = "1 - Início";
                } else {
                    strRota = x.Rota;
                }

            }

            //$('#divListaRota ul').append("<li><p>&#9728; " + strRota + "</p></li>");
            $('#divListaRota ul').append("<li><p>" + strRota + "</p></li>");


        });


        $('#divListaRota ul').append("<li></li>");
        $('#divListaRota ul').append("<li></li>");


        $('#listaRota').show();
        $('#divListaRota').show();
        $('#divProgressRota').hide();

    });


}

function MontaRotaClick() {


    $("#listaHorarios li").click(function () {

        latitudePonto = $(this).attr('latitudePonto');
        longitudePonto = $(this).attr('longitudePonto');

        Id_PontoEmbarque = $(this).attr('Id_PontoProximo');

        Id_Rota = $(this).attr('Id_Rota');

        strVeiculoEscolhido = $(this).attr('Veiculo');

        //MontaRota();
        MontaTrajetoVeiculo();

    });

}

function MontaMapa() {


    //Mapa
    intTelaAtual = 8;
    intTelaAnterior = 7;

    //Rota
    //intTelaAtual = 7;
    //intTelaAnterior = 6;


    $("#pageHorarios").hide();

    $("#pageRota").hide();

    $("#pageMapa").show();
    $("#uib_pageMapa").show();
    $("#divPontoDestinoMapa").show();


    var dbLat = null;
    var dbLong = null;


    if (isGPS == 1) {

        dbLat = latitudeUsuario;
        dbLong = longitudeUsuario;

    } else {

        dbLat = latitudeOrigem;
        dbLong = longitudeOrigem;
    }


    //$("#divMapa").html("<iframe width='100%' height='115%' frameborder='0' style='border:0; margin-top: -117px;' src='https://www.google.com/maps/embed/v1/directions?origin=" + dbLat + //"," + dbLong + "&destination=" + latitudePonto + "," + longitudePonto + "&key=AIzaSyBa40l7L3ZXfFlwSofyBOWK_6v3wrYLB64&zoom=14&mode=walking\' allowfullscreen></iframe>");

    $("#divMapa").html("<iframe width='100%' height='115%' frameborder='0' style='border:0; margin-top: -117px;' src='https://www.google.com/maps/embed/v1/directions?origin=" + dbLat + "," + dbLong + "&destination=" + latitudePonto + "," + longitudePonto + "&key=AIzaSyDJPhPokQKLLxesa0dKy3277vSPDccIIuo&zoom=14&mode=walking\' allowfullscreen></iframe>");


}

function check25km() {

    distanciaPonto = 10000;

}

function checkAr() {

    if (document.getElementById("btnAr").style.backgroundColor === "rgb(0, 175, 239)") {
        document.getElementById("btnAr").style.backgroundImage = "url('images/arCinza-125.png')";
        document.getElementById("btnAr").style.backgroundColor = "#bfbfbf";
        document.getElementById("btnTodos").style.backgroundColor = "#bfbfbf";

    } else {
        document.getElementById("btnAr").style.backgroundImage = "url('images/arAzul-125.png')";
        document.getElementById("btnAr").style.backgroundColor = "#00afef";
        document.getElementById("btnTodos").style.backgroundColor = "#bfbfbf";

        //idTipoVeiculo = 2;

    }


    /*if (document.getElementById("imgAr").src.indexOf("Azul") > -1) {
        document.getElementById("imgAr").src = "images/arCinza.png";
        document.getElementById("imgTodos").src = "images/TodosCinza.png";

    } else {
        document.getElementById("imgAr").src = "images/arAzul.png";
        document.getElementById("imgTodos").src = "images/TodosCinza.png";

        idTipoVeiculo = 2;

    }*/
}

function checkTodos() {


    if (document.getElementById("btnTodos").style.backgroundColor === "rgb(0, 175, 239)") {
        //if (document.getElementById("btnTodos").style.backgroundColor.indexOf("#bfbfbf") > -1) {
        document.getElementById("btnTodos").style.backgroundColor = "#bfbfbf";
        document.getElementById("btnAr").style.backgroundImage = "url('images/arCinza-125.png')";

    } else {
        document.getElementById("btnTodos").style.backgroundColor = "#00afef";
        document.getElementById("btnAr").style.backgroundImage = "url('images/arCinza-125.png')";
        document.getElementById("btnAr").style.backgroundColor = "#bfbfbf";

        idTipoVeiculo = 0;

    }


    /*if (document.getElementById("imgTodos").src.indexOf("Azul") > -1) {
        document.getElementById("imgTodos").src = "images/TodosCinza.png";
        document.getElementById("imgAr").src = "images/arCinza.png";

    } else {
        document.getElementById("imgTodos").src = "images/TodosAzul.png";
        document.getElementById("imgAr").src = "images/arCinza.png";

        idTipoVeiculo = 0;

    }*/

}

function MapaInicio() {

    latitudeUsuario = null;
    longitudeUsuario = null;

    document.getElementById("txtBuscarEndereco").innerHTML = "";


    $("#divAlerta").hide();

    $("#mainPage").hide();
    $("#pageOrigem").hide();
    $("#pagePasso1").hide();
    $("#pageLocalizacao").hide();
    $("#imgSetaVoltarMapaInicio").hide();

    $("#pageMapaInicio").show();


    $("#headerMapaInicio").hide();
    $("#linhaMapaInicio").hide();
    $("#divMapaInicio").hide();
    $("#divParaOnde").hide();


    $('#divProgressMapaInicio').show();


    var mapHeight = screen.height;
    var mapWidth = screen.width;

    if (mapWidth > 550) {
        document.getElementById("divLoc1").style.width = 355 + "px";
        document.getElementById("divLoc2").style.width = 355 + "px";
    }


    setTimeout(function () {

        $('#divProgressMapaInicio').hide();

        $("#headerMapaInicio").show();
        $("#linhaMapaInicio").show();
        $("#divMapaInicio").show();
        $("#divParaOnde").show();

        var image = {
            url: 'images/pedestre32.png', // image is 512 x 512
            size: new google.maps.Size(32, 32)
        };

        document.addEventListener("deviceready", function () {

            navigator.geolocation.getCurrentPosition(function (position) {

                var mapProp = {
                    center: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
                    zoom: 15,
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    disableDefaultUI: true,
                    streetViewControl: false,
                    scaleControl: false,
                    scrollwheel: false,
                    zoomControl: false,
                    draggable: true,
                    disableDoubleClickZoom: true
                };

                var map = new google.maps.Map(document.getElementById("divMapaInicio"), mapProp);


                document.getElementById("divMapaInicio").style.height = mapHeight + "px";
                document.getElementById("divMapaInicio").style.width = mapWidth + "px";


                latitudeUsuario = position.coords.latitude;
                longitudeUsuario = position.coords.longitude;

                //document.getElementById("divLabelParaOnde").innerHTML= latitudeUsuario + " / " + longitudeUsuario; //mapHeight + " / " + mapWidth;        


                var map = new google.maps.Map(document.getElementById("divMapaInicio"), mapProp);

                var mapaLabel = 'VOCÊ ESTÁ AQUI.';

                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
                    /*labelContent: mapaLabel,
                    labelClass: 'map-custom-labels',*/
                    icon: image,
                    draggable: false
                });

                marker.addListener('click', toggleBounce(marker));

                google.maps.event.addListener(marker, 'dragend', function (evt) {
                    latitudeUsuario = evt.latLng.lat().toFixed(5);
                    longitudeUsuario = evt.latLng.lng().toFixed(5);
                });

                marker.setMap(map);


            }, function (error) {

                /*                
                if (error.code == PositionError.PERMISSION_DENIED) {
                    alert("App sem permissão para usar o GPS");
                } else if (error.code == PositionError.POSITION_UNAVAILABLE) {
                    alert("Nenhum GPS encontrado");
                } else if (error.code == PositionError.TIMEOUT) {
                    alert("Está demorando muito para encontrar a localização");
                } else {
                    alert("Ocorreu um erro desconhecido");
                }                  
                */

                document.getElementById("divAlerta").innerHTML = "Nenhum GPS encontrado";


                var mapProp = {
                    center: new google.maps.LatLng(-22.870332, -43.161476),
                    zoom: 7,
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    disableDefaultUI: true,
                    streetViewControl: false,
                    scaleControl: false,
                    scrollwheel: false,
                    zoomControl: false,
                    draggable: false,
                    disableDoubleClickZoom: true
                };

                var map = new google.maps.Map(document.getElementById("divMapaInicio"), mapProp);

                var mapHeight = screen.height;
                var mapWidth = screen.width;

                document.getElementById("divMapaInicio").style.height = mapHeight + "px";
                document.getElementById("divMapaInicio").style.width = mapWidth + "px";


                document.getElementById("divAlerta").style.marginTop = (mapHeight - 210) + "px";
                $("#divAlerta").show();


                var map = new google.maps.Map(document.getElementById("divMapaInicio"), mapProp);


            }, {

                maximumAge: 3000,
                timeout: 5000,
                enableHighAccuracy: true

            });

        }, false);

    }, 1000);

}

function toggleBounce(marker) {
    if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
    } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);

    }
}

function AbrirParaOnde() {

    $('#divListaEndereco ul').remove('li');
    $('#listaEndereco').empty();

    $("#txtBuscarEndereco").val('');

    $("#divProgressEndereco").hide();

    $("#pageMapaInicio").hide();
    $("#pageTipoOnibus").hide();
    
    $("#pageHorarios").hide();

    //Elementos da Page Localizacao.
    $("#pageLocalizacao").show();


    strTelaAnterior = "MapaInicio";


    sleep(1000);


    /*if (latitudeUsuario == null) {
        document.getElementById("divLabelPosicaoAtual").innerHTML = "Escolha sua Posição";
        MapaTela2SemGps();
    }*/
    
    document.getElementById("txtBuscarEndereco").focus();


    document.getElementById("divLabelPosicaoAtual").onclick =
        function () {
            MapaTela2SemGps();
        };


    document.getElementById("txtBuscarEndereco").onclick =
        function () {
            if (latitudeUsuario == null) {

                setTimeout(function () {

                    document.addEventListener("deviceready", function () {
                        navigator.geolocation.getCurrentPosition(function (position) {

                            latitudeUsuario = position.coords.latitude;
                            longitudeUsuario = position.coords.longitude;

                            document.getElementById("txtBuscarEndereco").onkeyup =
                                function () {
                                    GetGoogleDestinos();
                                };


                        }, function (error) {

                            alert("Escolha sua posição no mapa.");
                            return;

                        }, {

                            maximumAge: 3000,
                            timeout: 5000,
                            enableHighAccuracy: true

                        });

                    }, false);

                }, 1000);

            } else {
                document.getElementById("txtBuscarEndereco").onkeyup =
                    function () {
                        GetGoogleDestinos();
                    };
            }
        };

}

function GetGoogleDestinos() {

    var strEndereco = "";

    $("#divProgressEndereco").hide();
    $("#divMapaTela2").hide();

    strEndereco = $("#txtBuscarEndereco").val();

    if (strEndereco === "") {
        $('#divListaEndereco ul').remove('li');
        $('#listaEndereco').empty();
        //alert("Informe seu endereço.");
        return;
    }

    if (strEndereco.length > 5) {

        if (
            strEndereco.toLowerCase().indexOf("rua") > -1 ||
            strEndereco.toLowerCase().indexOf("avenida") > -1 ||
            strEndereco.toLowerCase().indexOf("travessa") > -1 ||
            strEndereco.toLowerCase().indexOf("estrada") > -1 ||
            strEndereco.toLowerCase().indexOf("rodovia") > -1 ||
            strEndereco.toLowerCase().indexOf("av.") > -1 ||
            strEndereco.toLowerCase().indexOf("estr.") > -1

        ) {
            if (strEndereco.length > 9) {
                GetLatLongGoogle(strEndereco);
            }

        } else {
            GetGooglePlaces(strEndereco);
        }

        $('#uib_pageLocalizacao').show();
        $('#divListaEndereco').show();
        $('#listaEndereco').show();
    }

}

function MapaTela2SemGps() {


    $("#divAlerta").hide();

    $("#mainPage").hide();
    $("#pageOrigem").hide();
    $("#imgSetaVoltarMapaInicio").hide();

    $("#divListaEndereco").hide();
    $('#listaEndereco').hide();

    $('#divProgressEndereco').show();


    var image = {
        url: 'images/pedestre32.png', // image is 512 x 512
        size: new google.maps.Size(32, 32)
    };


    setTimeout(function () {

        document.addEventListener("deviceready", function () {

            navigator.geolocation.getCurrentPosition(function (position) {

                latitudeUsuario = position.coords.latitude;
                longitudeUsuario = position.coords.longitude;

                GetEnderecoGoogle2(latitudeUsuario, longitudeUsuario);

            }, function (error) {


                document.addEventListener("deviceready", function () {

                    var mapProp = {
                        center: new google.maps.LatLng(-22.870332, -43.161476),
                        zoom: 9,
                        mapTypeId: google.maps.MapTypeId.ROADMAP,
                        disableDefaultUI: true,
                        streetViewControl: false,
                        scaleControl: true,
                        scrollwheel: false,
                        zoomControl: true,
                        draggable: true,
                        disableDoubleClickZoom: false
                    };

                    //var map = new google.maps.Map(document.getElementById("divMapaTela2"), mapProp);

                    var mapHeight = screen.height;
                    var mapWidth = screen.width;

                    document.getElementById("divMapaTela2").style.height = mapHeight + "px";
                    document.getElementById("divMapaTela2").style.width = mapWidth + "px";


                    var map = new google.maps.Map(document.getElementById("divMapaTela2"), mapProp);

                    var marker = new google.maps.Marker({
                        position: new google.maps.LatLng(-22.870332, -43.161476),
                        icon: image,
                        draggable: false
                    });

                    //marker.addListener('click', toggleBounce(marker));

                    marker.setMap(map);


                    google.maps.event.addListener(map, 'dblclick', function (evt) {
                        latitudeUsuario = evt.latLng.lat().toFixed(5);
                        longitudeUsuario = evt.latLng.lng().toFixed(5);

                        GetEnderecoGoogle(latitudeUsuario, longitudeUsuario);

                        marker.setMap(null);

                        map.setCenter(new google.maps.LatLng(latitudeUsuario, longitudeUsuario));

                        marker = new google.maps.Marker({
                            position: new google.maps.LatLng(latitudeUsuario, longitudeUsuario),
                            icon: image,
                            draggable: true,
                            map: map
                        });


                    });


                    $('#divProgressEndereco').hide();
                    $('#divMapaTela2').show();


                }, false);
                

            }, {

                maximumAge: 3000,
                timeout: 5000,
                enableHighAccuracy: true

            });

        }, false);


    }, 1000);


}

function MontaTelaTipoOnibus() {

    $("#pageLocalizacao").hide();
    $("#pageMapaInicio").hide();
    $("#pageHorarios").hide();


    $("#pageTipoOnibus").show();
    $("#uib_pageTipoOnibus").show();

    strTelaAnterior = "Places";

    //document.getElementById("imgTodos").src = "images/TodosCinza.png";
    //document.getElementById("imgAr").src = "images/arCinza.png";


    var mapHeight = screen.height;
    var mapWidth = screen.width;

    if (strDestino.length > 45)
        strDestino = strDestino.substring(0, 43) + "..."


    if (mapWidth > 350) {

        if (strDestino.length > 45)
            strDestino = strDestino.substring(0, 43) + "..."

        document.getElementById("divDestinos").style.marginTop = "-7px";
        document.getElementById("divDestinos").style.height = "59px";
        document.getElementById("divLabelDestino").style.height = "25px";
        document.getElementById("divLabelEndereco").style.height = "30px";

        document.getElementById("lblDestinoSelecionado").innerHTML = "Destino:";
        document.getElementById("lblPontoDestinoSelecionado").innerHTML = strDestino;

        document.getElementById("div1").style.marginTop = "25px";
        document.getElementById("div3").style.marginTop = "65px";
        document.getElementById("div2").style.marginLeft = "9px";
        document.getElementById("divBtnHorarios").style.marginTop = "75px";

    } else {

        if (strDestino.length > 45)
            strDestino = strDestino.substring(0, 37) + "..."

        document.getElementById("lblDestinoSelecionado").innerHTML = "Destino: "; //+ strDestino;
        document.getElementById("divLabelDestino").style.height = "25px";
        document.getElementById("divLabelEndereco").style.height = "30px";
        document.getElementById("divDestinos").style.marginTop = "-7px";
        document.getElementById("divDestinos").style.height = "57px";
        document.getElementById("lblPontoDestinoSelecionado").innerHTML = strDestino;
    }
    
    
    listarHorarios();
}

function clickListaGoogleDestinos() {

    //document.getElementById("txtBuscarEndereco").value = "";

    $("#listaEndereco li").click(function () {

        strDestino = $(this).attr('Valor');
        latitudeDestino = $(this).attr('Latitude');
        longitudeDestino = $(this).attr('Longitude');

        MontaTelaTipoOnibus();
        
        //listarHorarios();

    });

}

function MapaTelaTrajetoSemVeiculo(LatUsuario, LongUsuario, LatEmbarque, LongEmbarque, LatDestino, LongDestino, LatDesembarque, LongDesembarque) {


    LatUsuario = latitudeUsuario;
    LongUsuario = longitudeUsuario;
    LatEmbarque = latitudePonto;
    LongEmbarque = longitudePonto;
    LatDestino = latitudeDestino;
    LongDestino = longitudeDestino;


    LatDesembarque = latitude_PontoDesembarque;
    LongDesembarque = longitude_PontoDesembarque;


    $("#pageMapaInicio").hide();
    $("#pageLocalizacao").hide();
    $("#pageHorarios ").hide();
    $("#pageMapa").hide();
    $("#pageRota").hide();

    $('#pageMapaTrajeto').show();


    $('#divProgressMapaTrajeto').show();


    setTimeout(function () {

        var imageUsuario = {
            url: 'images/pedestre32.png', // image is 512 x 512
            size: new google.maps.Size(32, 32)
        };

        var imageEmbarque = {
            url: 'images/iconeDistancia32.png', // image is 512 x 512
            size: new google.maps.Size(32, 32)
        };


        document.addEventListener("deviceready", function () {

            var mapProp = {
                center: new google.maps.LatLng(LatUsuario, LongUsuario), //(LatDesembarque, LongDesembarque),
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                disableDefaultUI: true,
                streetViewControl: false,
                scaleControl: true,
                scrollwheel: false,
                zoomControl: true,
                draggable: true,
                disableDoubleClickZoom: true
            };

            var map = new google.maps.Map(document.getElementById("divMapaTrajeto"), mapProp);

            var mapHeight = screen.height;
            var mapWidth = screen.width;

            mapHeight = mapHeight - ((mapHeight / 100) * 8);

            document.getElementById("divMapaTrajeto").style.height = mapHeight + "px";
            document.getElementById("divMapaTrajeto").style.width = mapWidth + "px";

            var map = new google.maps.Map(document.getElementById("divMapaTrajeto"), mapProp);

            //CRIA O TRAJETO ATÉ O PONTO PROXIMO
            var directionsService = new google.maps.DirectionsService();
            var directionsRenderer = new google.maps.DirectionsRenderer({
                suppressMarkers: true,
                preserveViewport: true,
                polylineOptions: {
                    strokeColor: "#CC0000"
                }
            });
            directionsRenderer.setMap(map);


            var request = { // Novo objeto google.maps.DirectionsRequest, contendo:
                origin: new google.maps.LatLng(LatUsuario, LongUsuario),
                destination: new google.maps.LatLng(LatEmbarque, LongEmbarque),
                travelMode: google.maps.TravelMode.WALKING
            };

            directionsService.route(request, function (response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    directionsRenderer.setDirections(response);
                }
            });


            var markerUsuario = new google.maps.Marker({
                position: new google.maps.LatLng(LatUsuario, LongUsuario),
                icon: {
                    url: 'images/pedestre32.png',
                    size: new google.maps.Size(32, 32),
                    anchor: new google.maps.Point(4, 32)
                },
                draggable: false,
                map: map
            });
            var markerUsuario2 = new google.maps.Marker({
                position: new google.maps.LatLng(LatUsuario, LongUsuario),
                icon: {
                    url: 'images/pedestre32.png', // image is 512 x 512
                    size: new google.maps.Size(64, 64),
                    anchor: new google.maps.Point(-16, 32)
                },
                draggable: false
            });


            var markerPontoEmbarque = new google.maps.Marker({
                position: new google.maps.LatLng(LatEmbarque, LongEmbarque),
                icon: {
                    url: 'images/iconeDistancia32.png', // image is 512 x 512
                    size: new google.maps.Size(32, 32)
                        //,anchor: new google.maps.Point(16, 16)
                },
                draggable: false,
                map: map
            });
            var markerPontoEmbarque2 = new google.maps.Marker({
                position: new google.maps.LatLng(LatEmbarque, LongEmbarque),
                icon: {
                    url: 'images/iconeDistancia32.png', // image is 512 x 512
                    size: new google.maps.Size(64, 64)
                        //,anchor: new google.maps.Point(32, 32)
                },
                draggable: false
            });


            google.maps.event.addListener(map, 'zoom_changed', function () {
                //var zoom = map.getZoom();

                if (map.getZoom() > 19) {
                    markerUsuario.setMap(null);
                    markerPontoEmbarque.setMap(null);

                    markerUsuario2.setMap(map);
                    markerPontoEmbarque2.setMap(map);

                } else {
                    markerUsuario.setMap(map);
                    markerPontoEmbarque.setMap(map);

                    markerUsuario2.setMap(null);
                    markerPontoEmbarque2.setMap(null);
                }

            });


            $('#divProgressMapaTrajeto').hide();
            $('#divMapaTrajeto').show();


        }, false);

    }, 1000);

}

function MapaTelaTrajeto(LatUsuario, LongUsuario, LatEmbarque, LongEmbarque, LatDestino, LongDestino, LatDesembarque, LongDesembarque) {

    //document.getElementById("lbl1").innerHTML = "TATATATATATA";


    LatUsuario = latitudeUsuario;
    LongUsuario = longitudeUsuario;
    LatEmbarque = latitudePonto;
    LongEmbarque = longitudePonto;
    LatDestino = latitudeDestino;
    LongDestino = longitudeDestino;


    LatDesembarque = latitude_PontoDesembarque;
    LongDesembarque = longitude_PontoDesembarque;


    $("#pageMapaInicio").hide();
    $("#pageLocalizacao").hide();
    $("#pageHorarios ").hide();
    $("#pageMapa").hide();
    $("#pageRota").hide();

    $('#pageMapaTrajeto').show();


    $('#divProgressMapaTrajeto').show();


    setTimeout(function () {

        var imageUsuario = {
            url: 'images/pedestre32.png', // image is 512 x 512
            size: new google.maps.Size(32, 32)
        };

        var imageEmbarque = {
            url: 'images/iconeDistancia32.png', // image is 512 x 512
            size: new google.maps.Size(32, 32)
        };


        document.addEventListener("deviceready", function () {

            var mapProp = {
                center: new google.maps.LatLng(LatUsuario, LongUsuario), //(LatDesembarque, LongDesembarque),
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                disableDefaultUI: true,
                streetViewControl: false,
                scaleControl: true,
                scrollwheel: false,
                zoomControl: true,
                draggable: true,
                disableDoubleClickZoom: true
            };

            var map = new google.maps.Map(document.getElementById("divMapaTrajeto"), mapProp);

            var mapHeight = screen.height;
            var mapWidth = screen.width;

            mapHeight = mapHeight - ((mapHeight / 100) * 8);

            document.getElementById("divMapaTrajeto").style.height = mapHeight + "px";
            document.getElementById("divMapaTrajeto").style.width = mapWidth + "px";

            var map = new google.maps.Map(document.getElementById("divMapaTrajeto"), mapProp);

            //CRIA O TRAJETO ATÉ O PONTO PROXIMO
            var directionsService = new google.maps.DirectionsService();
            var directionsRenderer = new google.maps.DirectionsRenderer({
                suppressMarkers: true,
                preserveViewport: true,
                polylineOptions: {
                    strokeColor: "#CC0000"
                }
            });
            directionsRenderer.setMap(map);


            var request = { // Novo objeto google.maps.DirectionsRequest, contendo:
                origin: new google.maps.LatLng(LatUsuario, LongUsuario),
                destination: new google.maps.LatLng(LatEmbarque, LongEmbarque),
                travelMode: google.maps.TravelMode.WALKING
            };

            directionsService.route(request, function (response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    directionsRenderer.setDirections(response);
                }
            });


            var markerUsuario = new google.maps.Marker({
                position: new google.maps.LatLng(LatUsuario, LongUsuario),
                icon: {
                    url: 'images/pedestre32.png',
                    size: new google.maps.Size(32, 32),
                    anchor: new google.maps.Point(4, 32)
                },
                draggable: false,
                map: map
            });
            var markerUsuario2 = new google.maps.Marker({
                position: new google.maps.LatLng(LatUsuario, LongUsuario),
                icon: {
                    url: 'images/pedestre32.png', // image is 512 x 512
                    size: new google.maps.Size(64, 64),
                    anchor: new google.maps.Point(-16, 32)
                },
                draggable: false
            });


            var markerPontoEmbarque = new google.maps.Marker({
                position: new google.maps.LatLng(LatEmbarque, LongEmbarque),
                icon: {
                    url: 'images/iconeDistancia32.png', // image is 512 x 512
                    size: new google.maps.Size(32, 32)
                        //,anchor: new google.maps.Point(16, 16)
                },
                draggable: false,
                map: map
            });
            var markerPontoEmbarque2 = new google.maps.Marker({
                position: new google.maps.LatLng(LatEmbarque, LongEmbarque),
                icon: {
                    url: 'images/iconeDistancia32.png', // image is 512 x 512
                    size: new google.maps.Size(64, 64)
                        //,anchor: new google.maps.Point(32, 32)
                },
                draggable: false
            });


            google.maps.event.addListener(map, 'zoom_changed', function () {
                //var zoom = map.getZoom();

                if (map.getZoom() > 19) {
                    markerUsuario.setMap(null);
                    markerPontoEmbarque.setMap(null);

                    markerUsuario2.setMap(map);
                    markerPontoEmbarque2.setMap(map);

                } else {
                    markerUsuario.setMap(map);
                    markerPontoEmbarque.setMap(map);

                    markerUsuario2.setMap(null);
                    markerPontoEmbarque2.setMap(null);
                }

            });

            //CRIA O POLYLINE DA ROTA

            if (arrayPontosRota == null) {
                setTimeout(function () {

                }, 3000);
            }


            var novoArrayPontosRota = [];

            novoArrayPontosRota.push(LatEmbarque + ";" + LongEmbarque);


            if (LatDesembarque == null) {
                setTimeout(function () {

                }, 3000);
            }


            for (var i = 0; i < arrayPontosRota.length; i++) {
                var address = arrayPontosRota[i];
                novoArrayPontosRota.push(arrayPontosRota[i]);
            }

            novoArrayPontosRota.push(LatDesembarque + ";" + LongDesembarque);

            arrayPontosRota = null;
            arrayPontosRota = novoArrayPontosRota;


            var waypoints = [];
            for (var i = 0; i < arrayPontosRota.length; i++) {
                var address = arrayPontosRota[i];
                if (address !== "") {
                    var coordenada = [];
                    coordenada = address.split(";");
                    var objLatLng = new google.maps.LatLng(coordenada[0], coordenada[1]);
                    waypoints.push(objLatLng);
                }
            }

            var flightPath = new google.maps.Polyline({
                path: waypoints,
                geodesic: true,
                strokeColor: '#339933',
                strokeOpacity: 1.0,
                strokeWeight: 3
            });

            //EXIBE O POLYLINE NO MAPA
            flightPath.setMap(map);




            //CRIA O TRAJETO DO PONTO ATÉ O DESTINO
            var directionsServiceDestino = new google.maps.DirectionsService();
            var directionsRendererDestino = new google.maps.DirectionsRenderer({
                suppressMarkers: true,
                preserveViewport: true,
                polylineOptions: {
                    strokeColor: "#8900ff"
                }
            });
            directionsRendererDestino.setMap(map);


            var requestDestino = { // Novo objeto google.maps.DirectionsRequest, contendo:
                origin: new google.maps.LatLng(LatDesembarque, LongDesembarque),
                destination: new google.maps.LatLng(LatDestino, LongDestino),
                travelMode: google.maps.TravelMode.WALKING
            };

            directionsServiceDestino.route(requestDestino, function (response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    directionsRendererDestino.setDirections(response);
                }
            });




            var markerDesembarque = new google.maps.Marker({
                position: new google.maps.LatLng(LatDesembarque, LongDesembarque),
                icon: {
                    url: 'images/iconeDistancia32.png', // image is 512 x 512
                    size: new google.maps.Size(32, 32),
                    anchor: new google.maps.Point(16, 16)
                },
                draggable: false,
                /*label: {
                    text: descricao_PontoDesembarque
                },*/
                map: map
            });
            var markerDesembarque2 = new google.maps.Marker({
                position: new google.maps.LatLng(LatDesembarque, LongDesembarque),
                icon: {
                    url: 'images/iconeDistancia32.png',
                    size: new google.maps.Size(64, 64),
                    anchor: new google.maps.Point(32, 32)
                },
                draggable: false //,
                    /*label: {
                        text: descricao_PontoDesembarque,
                        paddingTop: '-15px'


                    }*/
            });


            var markerDestino = new google.maps.Marker({
                position: new google.maps.LatLng(LatDestino, LongDestino),
                icon: {
                    url: 'images/iconeOpcao32.png',
                    size: new google.maps.Size(32, 32),
                    anchor: new google.maps.Point(16, 16)

                },
                draggable: false,
                map: map
            });
            var markerDestino2 = new google.maps.Marker({
                position: new google.maps.LatLng(LatDestino, LongDestino),
                icon: {
                    url: 'images/iconeOpcao32.png',
                    size: new google.maps.Size(64, 64),
                    anchor: new google.maps.Point(32, 32)
                },
                draggable: false
            });



            google.maps.event.addListener(map, 'zoom_changed', function () {
                //var zoom = map.getZoom();

                if (map.getZoom() > 19) {
                    markerDesembarque.setMap(null);
                    markerDestino.setMap(null);

                    markerDesembarque2.setMap(map);
                    markerDestino2.setMap(map);

                } else {
                    markerDesembarque.setMap(map);
                    markerDestino.setMap(map);

                    markerDesembarque2.setMap(null);
                    markerDestino2.setMap(null);
                }

            });


            $('#divProgressMapaTrajeto').hide();
            $('#divMapaTrajeto').show();



            document.getElementById("imgSetaVoltarTrajeto").onclick =
                function () {
                    listarHorarios();
                };



        }, false);

    }, 1000);

}

function MontaTrajetoVeiculo() {


    intTelaAtual = "Trajeto";
    
    strTelaAnterior = "Horarios";


    $("#pageMapaInicio").hide();
    $("#pageLocalizacao").hide();
    $("#pageHorarios ").hide();
    $("#pageMapa").hide();
    $("#pageRota").hide();

    $('#pageMapaTrajeto').show();


    var strURL = null;

    strURL = strWCF + "ListaPontosTrajeto?Id_Config=" + Id_Config + "&Id_Rota=" + Id_Rota + "&Id_PontoOrigem=" + Id_PontoEmbarque + "&LatitudeDestino=" + latitudeDestino + "&LongitudeDestino=" + longitudeDestino;

    setTimeout(function () {

        $.ajax({
            type: "GET",
            url: strURL,
            dataType: "json"
        }).done(function (data) {

            $.each(data.Dados, function (i, x) {

                if (i == "DestinoDescricao")
                    descricao_PontoDesembarque = x;

                if (i == "DestinoLatitude")
                    latitude_PontoDesembarque = x;

                if (i == "DestinoLongitude")
                    longitude_PontoDesembarque = x;

                if (i == "TrechoPontos") {
                    pontosRota = x;
                    arrayPontosRota = pontosRota.split("|");
                }

            });

            //if (strVeiculoEscolhido == "null")
            //MapaTelaTrajetoSemVeiculo();
            //else
            MapaTelaTrajeto();

        });


    }, 1000);

}

function BotaoHistoricoVerdeEscuro() {
    document.getElementById("btnHorarios").style.backgroundImage = "url('images/imgBotao1.jpg')";
}

function BotaoHistoricoVerdeClaro() {
    document.getElementById("btnHorarios").style.backgroundImage = "url('images/imgBotao0.jpg')";
}

function VoltarTrajeto() {
    $('#pageMapaTrajeto').hide();
    listarHorarios();
}

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}