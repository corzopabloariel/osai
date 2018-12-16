if(userDATOS.verificar(1)) {
  app = angular.module('simat-app',[,'ngRoute','ngSanitize']);

  /**
   *
   */
  app.config( function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'layouts/index.html',
        controller : 'index'
      })
      .when('/perfil', {
        templateUrl: 'layouts/perfil.html',
        controller : 'perfil'
      })
  });
  /**
   * Carga principal de entidades
   */
  app.controller('jsonController', ['$scope', '$http', '$timeout', function($scope, $http, $timeout) {
    let session = userDATOS.session();
    $("#user_name").text(session.user);
  }]);
  /**
   * Acciones de vista HOME
   */
  app.controller("index", function ($scope) {
    $("#ubicacion").text("home");
    let session = userDATOS.session();
    let data = userDATOS.busqueda_paginado({"id_usuario_osai":session.id},"osai_cliente",false,"index");
    let html = "";
    let html_seccion = "";
    let OBJ_tipo = {"0": "Noticia recomenda"};
    let ARR_secciones = {};
    if(data.data !== null) {
      for(var i in data.data) {
        aux = userDATOS.busqueda(data.data[i]["id_noticia"],"noticia");
        medio = userDATOS.busqueda(aux.data["id_medio"],"medio");
        tipo = data.data[i]["tipo_aviso"];
        if(ARR_secciones[aux.data.id_seccion] === undefined) {
          ARR_secciones[aux.data.id_seccion] = {};
          ARR_secciones[aux.data.id_seccion]["nombre"] = "";
          ARR_secciones[aux.data.id_seccion]["cantidad"] = 0;
          if(aux.data.id_seccion == 1) ARR_secciones[aux.data.id_seccion]["nombre"] = "SIN SECCIÓN";
          else {
            seccion = userDATOS.busqueda(aux.data.id_seccion,"seccion");
            ARR_secciones[aux.data.id_seccion]["nombre"] = seccion.data.nombre;
          }
        }
        ARR_secciones[aux.data.id_seccion]["cantidad"] ++;
        ////--------------------
        date = data.data[i]["autofecha"];
        url = aux.data.url;
        image = medio.data.image;
        body = aux.data.cuerpo;
        titulo = aux.data.titulo;
        texto = $(body).text();
        texto = texto.trim();
        subtexto = texto.substring(0,200) + " [...]";

        html += '<div class="card shadow-sm position-relative">';
          if(OBJ_tipo[tipo] !== undefined) {
            html += '<div class="position-absolute shadow-sm bg-light p-2 text-uppercase rounded-top" style="font-size: .7em;left: 2em;top: -15px;">';
              html += '<p class="m-0"><i class="fas fa-asterisk text-warning"></i> ' + OBJ_tipo[tipo] + '</p>';
            html += '</div>';
          }
          html += '<div class="card-body">';
            html += '<img src="' + image + '"  onError="this.src=\'../assets/images/no-img.png\'" class="float-left mr-2 mt-2 mb-2" style="height:24px; "/>';
            html += '<h5 class="card-title text-uppercase font-italic">' + titulo + '</h5>';
            html += '<p class="card-text">' + subtexto + '</p>';
          html += '</div>';
          html += '<div class="card-footer text-muted">';
            html += '<small class="mr-2"><i class="fas fa-globe-americas"></i> ' + date + '</small>';
            html += '<small class="mr-2"><a><i class="fas fa-link"></i> informe</a></small>';
            html += '<small class="mr-2"><a href="' + url + '" target="blank"><i class="fas fa-external-link-alt"></i> noticia</a></small>';
            html += '<small class=""><i class="fas fa-tag"></i> ' + ARR_secciones[aux.data.id_seccion]["nombre"] + '</small>';
          html += '</div>';
        html += '</div>';
      }
    }
    // for(var i in ARR_secciones)
    //   html_seccion += '<li class="list-group-item d-flex justify-content-between align-items-center bg-transparent p-2"><p class="m-0 text-truncate">' + ARR_secciones[i]["nombre"] + '</p><span class="badge bg-blue text-white badge-pill">' + ARR_secciones[i]["cantidad"] + '</span></li>';
    //
    // $("#secciones").find("ul").html(html_seccion);
    $("#section_body").html(html);
  });
  /**
   * Acciones de vista PERFIL
   */
  app.controller("perfil", function ($scope) {
    $("#ubicacion").text("perfil");
    let session = userDATOS.session();
    let data = userDATOS.busqueda_paginado({"id_usuario_osai":session.id,"tipo_aviso":1},"osai_cliente",false,"perfil");
    let html = "";console.log(data);
    let html_seccion = "";
    if(data.data !== null) {
      if(data.data.length == 0) {
        $("#section_body").removeClass("card-columns");
        html += '<div class="card shadow-sm position-relative">';
          html += '<div class="card-body">';
            html += '<p class="m-0 text-uppercase text-center">nada para mostrar</p>';
          html += '</div>';
        html += '</div>';
      } else {
        $("#section_body").addClass("card-columns");
        for(var i in data.data) {
          aux = userDATOS.busqueda(data.data[i]["id_noticia"],"noticia");
          medio = userDATOS.busqueda(aux.data["id_medio"],"medio");
          tipo = data.data[i]["tipo_aviso"];
          seccion = "";
          if(aux.data.id_seccion == 1) seccion = "SIN SECCIÓN";
          else {
            seccion_aux = userDATOS.busqueda(aux.data.id_seccion,"seccion");
            seccion = seccion_aux.data.nombre;
          }
          ////--------------------
          date = data.data[i]["autofecha"];
          url = aux.data.url;
          image = medio.data.image;
          body = aux.data.cuerpo;
          titulo = aux.data.titulo;
          texto = $(body).text();
          texto = texto.trim();
          subtexto = texto.substring(0,200) + " [...]";

          html += '<div class="card shadow-sm position-relative">';
            html += '<div class="card-body">';
              html += '<img src="' + image + '"  onError="this.src=\'../assets/images/no-img.png\'" class="float-left mr-2 mt-2 mb-2" style="height:24px; "/>';
              html += '<h5 class="card-title text-uppercase font-italic">' + titulo + '</h5>';
              html += '<p class="card-text">' + subtexto + '</p>';
            html += '</div>';
            html += '<div class="card-footer text-muted">';
              html += '<small class="mr-2"><i class="fas fa-globe-americas"></i> ' + date + '</small><br/>';
              html += '<small class="mr-2"><a><i class="fas fa-link"></i> informe</a></small>';
              html += '<small><a href="' + url + '" target="blank"><i class="fas fa-external-link-alt"></i> noticia</a></small><br/>';
              html += '<small class=""><i class="fas fa-tag"></i> ' + seccion + '</small>';
            html += '</div>';
          html += '</div>';
        }
      }
    }

    $("#section_body").html(html);
  });
} else window.location = "index.html";
$(document).ready(function() {
  let bgheader = $(".bg-img").outerHeight();
  let header = $("header").outerHeight();
  let secciones = $("#secciones");
  $(window).scroll(function() {
    if($(this).scrollTop() > bgheader - header) secciones.css({top:$(this).scrollTop() - bgheader + header});
    else secciones.css({top: 0});
  });
});
