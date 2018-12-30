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
      .when('/mis_noticias', {
        templateUrl: 'layouts/perfil.html',
        controller : 'noticias'
      })
      .when('/agenda_nacional', {
        templateUrl: 'layouts/agenda.html',
        controller : 'agenda'
      })
      .when('/notificaciones', {
        templateUrl: 'layouts/notificaciones.html',
        controller : 'notificaciones'
      })
      .when('/configuracion', {
        templateUrl: 'layouts/configuracion.html',
        controller : 'configuracion'
      })
  });
  /**
   * Carga principal de entidades
   */
  app.controller('jsonController', ['$scope', '$http', '$timeout', function($scope, $http, $timeout) {
    let session = userDATOS.session();
    $("#user_name").text(session.user);

    $scope.$on('$viewContentLoaded', function(){
      $(function () {
        $('[data-toggle="tooltip"]').tooltip();
      });
    });
  }]);
  /**
   * Acciones de vista HOME
   */
  app.controller("index", function ($scope) {
    userDATOS.nav("#!");
    if(window["name_index"] !== undefined) window["name_index"] = undefined;
    userDATOS.mostrar = function(append = false) {
      let session = userDATOS.session();
      if(append) $("#cargando").show();
      userDATOS.busqueda_paginado({"values":{"id_usuario_osai":session.id},"entidad":"osai_cliente","name":"index"},function(data) {
        let html = "";
        let html_seccion = "";
        let OBJ_tipo = {"0": "Noticia recomenda"};
        let ARR_secciones = {};
        if(data.data !== null) {
          for(var i in data.data) {
            userDATOS.busqueda({"value":data.data[i]["id_noticia"],"entidad":"noticia"},function(aux) {
              userDATOS.busqueda({"value":aux.data["id_medio"],"entidad":"medio"},function(medio) {
                tipo = data.data[i]["tipo_aviso"];
                if(ARR_secciones[aux.data.id_seccion] === undefined) {
                  ARR_secciones[aux.data.id_seccion] = {};
                  ARR_secciones[aux.data.id_seccion]["nombre"] = "";
                  ARR_secciones[aux.data.id_seccion]["cantidad"] = 0;
                  if(aux.data.id_seccion == 1) ARR_secciones[aux.data.id_seccion]["nombre"] = "SIN SECCIÓN";
                  else {
                    seccion = null;
                    userDATOS.busqueda({"value":aux.data.id_seccion,"entidad":"seccion"},function(d) {
                      seccion = d;
                    });
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

                html += '<div class="card rounded-0 position-relative">';
                  if(OBJ_tipo[tipo] !== undefined) {
                    html += '<div class="card-header p-3 text-uppercase" style="font-size: .7em;">';
                      html += '<p class="m-0"><i class="fas fa-asterisk text-warning"></i> ' + OBJ_tipo[tipo] + '</p>';
                    html += '</div>';
                  }
                  html += '<div class="card-body p-3">';
                    html += '<img src="' + image + '"  onError="this.src=\'../assets/images/no-img.png\'" class="d-block mx-auto my-1" style="height:24px; "/>';
                    html += '<h5 class="card-title text-uppercase font-italic" style="font-size:90%">' + titulo + '</h5>';
                    html += '<p class="card-text">' + subtexto + '</p>';
                  // html += '</div>';
                    html += '<hr/>';
                  // html += '<div class="card-footer text-muted">';
                    html += '<p class="card-text text-truncate">';
                      html += '<small class="info-oculta text-muted border-right pr-2 mr-2"><i class="fas fa-globe-americas"></i><span class="ml-1">' + dates.string(new Date(date)) + '</span></small>';
                      html += '<small data-animation="true" data-html="true" data-toggle="tooltip" data-placement="top" title="MOSTRAR PROCESO<br/>DE NOTICIA" class="text-muted border-right pr-2 mr-2"><a class="text-primary"><i class="fas fa-file-alt mr-1"></i>proceso</a></small>';
                      if(url !== null)
                        html += '<small data-animation="true" data-html="true" data-toggle="tooltip" data-placement="top" title="IR A LA NOTICIA<br/>- link externo -" class="text-muted border-right pr-2 mr-2"><a class="text-primary" href="' + url + '" target="blank"><i class="fas fa-external-link-alt mr-1"></i>noticia</a></small>';
                      html += '<small data-animation="true" data-html="true" data-toggle="tooltip" data-placement="top" title="SECCIÓN: ' + ARR_secciones[aux.data.id_seccion]["nombre"] + '" class="info-oculta text-muted"><i class="fas fa-tag"></i><span class="ml-1">' + ARR_secciones[aux.data.id_seccion]["nombre"] + '</span></small>';
                    html += '</p>';
                  html += '</div>';
                html += '</div>';

                if(!append) {
                  if($("#section_body").find(".loading").length) {
                    $("#section_body").addClass("card-columns");
                    $("#section_body").html("");
                  }
                  $("#section_body").html(html);
                } else {
                  $("#cargando").hide();
                  $("#section_body").append(html);
                }
                $("#section_body").find('[data-toggle="tooltip"]').tooltip();
              }, true);
            }, true);
          }
        }
      },true);
    }
    userDATOS.mostrar();
  });
  /**
   * Acciones de vista MIS NOTICIAS
   */
  app.controller("noticias", function ($scope) {
    userDATOS.nav("#!mis_noticias");
    if(window["name_perfil"] !== undefined) window["name_perfil"] = undefined;
    userDATOS.mostrar = function(append = false) {
      let session = userDATOS.session();
      if(append) $("#cargando").show();
      userDATOS.busqueda_paginado({"values":{"id_usuario_osai":session.id,"tipo_aviso":1},"entidad":"osai_cliente","name":"perfil"},function(data) {
        let html = "";
        let html_seccion = "";
        if(data.data !== null) {
          if(data.data.length == 0) {
            $("#section_body").removeClass("card-columns");
            html += '<div class="p-4 mt-4">';
              html += '<p class="m-0 text-uppercase text-center" style="font-size:1.3em">nada para mostrar</p>';
              html += '<p class="text-uppercase text-center">sin noticias</p>'
              html += '<img src="assets/img/notice-icon.png" class="w-50 d-block mx-auto"/>';
            html += '</div>';
          } else {
            $("#section_body").addClass("card-columns");
            for(var i in data.data) {
              aux = null;
              userDATOS.busqueda({"value":data.data[i]["id_noticia"],"entidad":"noticia"},function(d) {
                aux = d;
              });
              medio = null;
              userDATOS.busqueda({"value":aux.data["id_medio"],"entidad":"medio"},function(d) {
                medio = d;
              });
              tipo = data.data[i]["tipo_aviso"];
              seccion = "";
              if(aux.data.id_seccion == 1) seccion = "SIN SECCIÓN";
              else {
                seccion_aux = null;
                userDATOS.busqueda({"value":aux.data.id_seccion,"entidad":"seccion"},function(d) {
                  seccion_aux = d;
                });
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

              html += '<div class="card rounded-0 position-relative">';
                html += '<div class="card-body p-3">';
                  html += '<img src="' + image + '"  onError="this.src=\'../assets/images/no-img.png\'" class="float-left mr-2 mt-2 mb-2" style="height:24px; "/>';
                  html += '<h5 class="card-title text-uppercase font-italic">' + titulo + '</h5>';
                  html += '<p class="card-text">' + subtexto + '</p>';
                  html += '<hr/>';
                  html += '<p class="card-text"><small class="text-muted mr-2"><i class="fas fa-globe-americas"></i> ' + dates.string(new Date(date)) + '</small></p>';
                  html += '<p class="card-text"><small class="text-muted mr-2"><a class="text-primary"><i class="fas fa-file-alt"></i> proceso</a> | <a class="text-primary" href="' + url + '" target="blank"><i class="fas fa-external-link-alt"></i> noticia</a></small></p>';
                  html += '<p class="card-text"><small class="text-muted"><i class="fas fa-tag"></i> ' + seccion + '</small></p>';
                html += '</div>';
              html += '</div>';
            }
          }
        }
        if(!append)
          $("#section_body").html(html);
        else {
          $("#cargando").hide();
          $("#section_body").append(html);
        }
      },true);
    }
    userDATOS.mostrar();
  });
  /**
   * Acciones de vista AGENDA NACIONAL
   */
  app.controller("agenda", function ($scope) {
    if(window["name_agenda"] !== undefined) window["name_agenda"] = undefined;
    userDATOS.nav("#!agenda_nacional");
    userDATOS.mostrar = function(append = false) {
      if(append) $("#cargando").show();
      userDATOS.busqueda_agenda(function(data) {
        let html = "";
        let html_seccion = "";
        if(data.data !== null) {
          if(data.data.length == 0 && window["name_agenda"] === undefined) {
            if(window["name_agenda"] > 0) {
              $("#cargando").hide();
              return false;
            }
            $("#section_body").removeClass("card-columns");
            html += '<div class="p-4 mt-4 sinCuerpo">';
              html += '<p class="m-0 text-uppercase text-center" style="font-size:1.3em">nada para mostrar</p>';
              html += '<p class="text-uppercase text-center">sin noticias</p>'
              html += '<img src="assets/img/notice-icon.png" class="w-50 d-block mx-auto"/>';
            html += '</div>';
          } else {
            for(var i in data.data) {
              userDATOS.busqueda({"value":data.data[i]["id_noticia"],"entidad":"noticia"},function(aux) {
                userDATOS.busqueda({"value":aux.data["id_medio"],"entidad":"medio"},function(medio) {
                  tipo = data.data[i]["tipo_aviso"];
                  seccion = "";
                  if(aux.data.id_seccion == 1) seccion = "SIN SECCIÓN";
                  else {
                    seccion_aux = null;
                    userDATOS.busqueda({"value":aux.data.id_seccion,"entidad":"seccion"},function(d) {
                      seccion_aux = d;
                    });
                    seccion = seccion_aux.data.nombre;
                  }
                  ////--------------------
                  date = data.data[i]["autofecha"];
                  url = aux.data.url;
                  image = medio.data.image;
                  body = aux.data.cuerpo;
                  titulo = aux.data.titulo;
                  try {
                    texto = $(body).text(); 
                  } catch (error) {
                    texto = body;
                  }
                  texto = texto.trim();
                  subtexto = texto.substring(0,200) + " [...]";

                  html = '<div class="card rounded-0 position-relative">';
                    html += '<div class="card-body p-3">';
                      html += '<img src="' + image + '"  onError="this.src=\'../assets/images/no-img.png\'" class="float-left mr-2 mt-2 mb-2" style="height:24px; "/>';
                      html += '<h5 class="card-title text-uppercase font-italic">' + titulo + '</h5>';
                      html += '<p class="card-text">' + subtexto + '</p>';
                      html += '<hr/>';
                      html += '<p class="card-text text-truncate">';
                        html += '<small class="info-oculta text-muted border-right pr-2 mr-2"><i class="fas fa-globe-americas"></i><span class="ml-1">' + dates.string(new Date(date)) + '</span></small>';
                        html += '<small data-animation="true" data-html="true" data-toggle="tooltip" data-placement="top" title="MOSTRAR PROCESO<br/>DE NOTICIA" class="text-muted border-right pr-2 mr-2"><a class="text-primary"><i class="fas fa-file-alt mr-1"></i>proceso</a></small>';
                        if(url !== null)
                          html += '<small data-animation="true" data-html="true" data-toggle="tooltip" data-placement="top" title="IR A LA NOTICIA<br/>- link externo -" class="text-muted border-right pr-2 mr-2"><a class="text-primary" href="' + url + '" target="blank"><i class="fas fa-external-link-alt mr-1"></i>noticia</a></small>';
                        html += '<small data-animation="true" data-html="true" data-toggle="tooltip" data-placement="top" title="SECCIÓN: ' + seccion + '" class="info-oculta text-muted"><i class="fas fa-tag"></i><span class="ml-1">' + seccion + '</span></small>';
                      html += '</p>';
                    html += '</div>';
                  html += '</div>';
                });
                if(!append) {
                  if($("#section_body").find(".loading").length) {
                    $("#section_body").addClass("card-columns");
                    $("#section_body").html("");
                  }
                  $("#section_body").append(html);
                } else {
                  $("#cargando").hide();
                  $("#section_body").append(html);
                }
                $("#section_body").find('[data-toggle="tooltip"]').tooltip();
              },true);
            }
          }
        }
      },true);
    }
    userDATOS.mostrar();
  });
  /**
   * Acciones de vista NOTIFICACIONES
   */
  app.controller("notificaciones", function ($scope) {
    userDATOS.nav("#!notificaciones");
  });
  /**
   * Acciones de vista CONFIGURACION
   */
  app.controller("configuracion", function ($scope) {
    userDATOS.nav("#!configuracion");
  });

} else window.location = "index.html";
$(document).ready(function() {
  $(window).scroll(function() {
    if($(this).scrollTop() == $(document).height() - $(window).height()) {
      if($("#menu a:not([href])").data("href") == "#!agenda_nacional") {
        userDATOS.mostrar(true);
      }
    }
  });

  $("body").on("click",".info-oculta",function() {
    $(this).find("span").toggle(500, function() {
      if($(this).is(":visible"))
        userDATOS.notificacion("Mostrando información")
      else
        userDATOS.notificacion("Ocultando información")
    });
  });
});
