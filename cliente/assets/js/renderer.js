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
    let ARR_secciones = {};
    if(window["name_index"] !== undefined) window["name_index"] = undefined;
    userDATOS.mostrar = function(append = false) {
      let session = userDATOS.session();
      if(append) $("#cargando").show();
      userDATOS.busqueda_paginado({"values":{"id_usuario_osai":session.id},"entidad":"osai_cliente","name":"index"},function(data) {
        let html = "";
        let html_seccion = "";
        let OBJ_tipo = {"0": "Noticia recomenda"};
        if(data.data !== null) {
          $.each( data.data, function( key, value ) {
            userDATOS.busqueda({"value":value["id_noticia"],"entidad":"noticia"},function(aux) {
              userDATOS.busqueda({"value":aux.data["id_medio"],"entidad":"medio"},function(medio) {
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
                seccion = ARR_secciones[aux.data.id_seccion]["nombre"];
                ////--------------------
                date = value["autofecha"];
                tipo = value["tipo_aviso"];
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
                      html += '<small data-animation="true" data-html="true" data-toggle="tooltip" data-placement="top" title="SECCIÓN: ' + seccion + '" class="info-oculta text-muted"><i class="fas fa-tag"></i><span class="ml-1">' + seccion + '</span></small>';
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
          });
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
    let ARR_secciones = {};
    let ARR_medios = {};
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
            $("#section_body").append(html);
          } else {
            // $("#section_body").addClass("card-columns");
            $.each( data.data, function( key, value ) {
              userDATOS.busqueda({"value":value["id_noticia"],"entidad":"noticia"},function(aux) {
                userDATOS.busqueda({"value":aux.data["id_medio"],"entidad":"medio"},function(medio) {
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
                  if(ARR_medios[aux.data.id_medio] === undefined) {
                    ARR_medios[aux.data.id_medio] = {};
                    ARR_medios[aux.data.id_medio]["nombre"] = medio.data.medio;
                    ARR_medios[aux.data.id_medio]["cantidad"] = 0;
                  }
                  ARR_medios[aux.data.id_medio]["cantidad"] ++;
                  ARR_secciones[aux.data.id_seccion]["cantidad"] ++;
                  seccion = ARR_secciones[aux.data.id_seccion]["nombre"];
                  ////--------------------
                  date = value["autofecha"];
                  tipo = value["tipo_aviso"];
                  url = aux.data.url;
                  image = medio.data.image;
                  body = aux.data.cuerpo;
                  titulo = aux.data.titulo;
                  texto = $(body).text();
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
                  if(!append) {
                    if($("#section_body").find(".loading").length) {
                      htmlBody = "";
                      htmlBody += "<div class='row'>";
                        htmlBody += "<div class='col-3'>";
                          htmlBody += '<h3 class="text-uppercase mb-0 px-3 py-2 text-white bg-primary">secciones</h3>';
                          htmlBody += "<ul id='ulSeccion' class='list-group mb-3'></ul>";
                          
                          htmlBody += '<h3 class="text-uppercase mb-0 px-3 py-2 text-white bg-success">medios</h3>';
                          htmlBody += "<ul id='ulMedio' class='list-group'></ul>";
                        htmlBody += "</div>";
                        htmlBody += "<div class='col-9 card-columns'></div>";
                      htmlBody += "</div>";
                      $("#section_body").html(htmlBody);
                    }
                    $("#section_body").find("> .row > div:last-child()").html(html);
                  } else {
                    $("#cargando").hide();
                    $("#section_body").find("> .row > div:last-child()").append(html);
                  }
                  $.each( ARR_secciones, function( k, v ) {
                    if(!$("#ulSeccion").find("li[data-id='" + k + "']").length)
                      $("#ulSeccion").append('<li data-id="' + k + '" class="list-group-item rounded-0 d-flex justify-content-between align-items-center">' + v.nombre + '<span class="badge badge-primary badge-pill">' + v.cantidad + '</span></li>');
                  });
                  $.each( ARR_medios, function( k, v ) {
                    if(!$("#ulMedio").find("li[data-id='" + k + "']").length)
                      $("#ulMedio").append('<li data-id="' + k + '" class="list-group-item rounded-0 d-flex justify-content-between align-items-center">' + v.nombre + '<span class="badge badge-success badge-pill">' + v.cantidad + '</span></li>');
                  });
                },true);
              },true);
            });
          }
        }
      },true);
    }
    userDATOS.mostrar();
  });
  /*
  FALTA
    - mostrar proceso
    - mostrar proceso con detalla (desde mis noticas)
    - notificaciones con filtro de colores
  */
  /**
   * Acciones de vista AGENDA NACIONAL
   */
  app.controller("agenda", function ($scope) {
    let ARR_secciones = {};
    let ARR_medios = {};
    if(window["filtro"] !== undefined) window["filtro"] = undefined;
    if(window["name_agenda"] !== undefined) window["name_agenda"] = undefined;
    userDATOS.nav("#!agenda_nacional");
    userDATOS.mostrar = function(append = false) {
      data = {"id":12};
      if(window["filtro"] !== undefined) {
        data = window["filtro"];
      }
      if(append) $("#cargando").show();
      userDATOS.busqueda_agenda(data,function(data) {
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
            $("#section_body").append(html);
          } else {
            $.each( data.data, function( key, value ) {
              userDATOS.busqueda({"value":value["id_noticia"],"entidad":"noticia"},function(aux) {
                userDATOS.busqueda({"value":aux.data["id_medio"],"entidad":"medio"},function(medio) {
                  if(ARR_secciones[aux.data.id_seccion] === undefined) {
                    ARR_secciones[aux.data.id_seccion] = {};
                    ARR_secciones[aux.data.id_seccion]["nombre"] = "";
                    ARR_secciones[aux.data.id_seccion]["cantidad"] = 0;
                    ARR_secciones[aux.data.id_seccion]["medio"] = aux.data.id_medio;
                    if(aux.data.id_seccion == 1) {
                      ARR_secciones[aux.data.id_seccion]["nombre"] = "SIN SECCIÓN";
                      ARR_secciones[aux.data.id_seccion]["medio"] = [];
                    } else {
                      seccion = null;
                      userDATOS.busqueda({"value":aux.data.id_seccion,"entidad":"seccion"},function(d) {
                        seccion = d;
                      });
                      ARR_secciones[aux.data.id_seccion]["nombre"] = seccion.data.nombre;
                    }
                  }
                  if(aux.data.id_seccion == 1) {
                    if(ARR_secciones[aux.data.id_seccion]["medio"].indexOf(parseInt(aux.data.id_medio)) < 0)
                      ARR_secciones[aux.data.id_seccion]["medio"].push(parseInt(aux.data.id_medio));
                  }
                  if(ARR_medios[aux.data.id_medio] === undefined) {
                    ARR_medios[aux.data.id_medio] = {};
                    ARR_medios[aux.data.id_medio]["nombre"] = medio.data.medio;
                    ARR_medios[aux.data.id_medio]["cantidad"] = 0;
                    ARR_medios[aux.data.id_medio]["secciones"] = [];
                  }
                  ARR_secciones[aux.data.id_seccion]["cantidad"] ++;
                  ARR_medios[aux.data.id_medio]["cantidad"] ++;
                  if(ARR_medios[aux.data.id_medio]["secciones"].indexOf(aux.data.id_seccion) < 0)
                    ARR_medios[aux.data.id_medio]["secciones"].push(aux.data.id_seccion);
                  seccion = ARR_secciones[aux.data.id_seccion]["nombre"];
                  ////--------------------
                  date = value["autofecha"];
                  tipo = value["tipo_aviso"];
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
                  
                  if(!append) {
                    if($("#section_body").find(".loading").length) {
                      htmlBody = "";
                      htmlBody += "<div class='row'>";
                        htmlBody += "<div class='col-3'>";
                          htmlBody += '<h3 class="text-uppercase mb-0 px-3 py-2 text-white bg-primary">secciones</h3>';
                          htmlBody += "<ul id='ulSeccion' class='list-group mb-3'></ul>";
                          
                          htmlBody += '<h3 class="text-uppercase mb-0 px-3 py-2 text-white bg-success">medios</h3>';
                          htmlBody += "<ul id='ulMedio' class='list-group'></ul>";
                        htmlBody += "</div>";
                        htmlBody += "<div class='col-9 card-columns'></div>";
                      htmlBody += "</div>";
                      $("#section_body").html(htmlBody);
                    }
                    $("#section_body").find("> .row > div:last-child()").append(html);
                  } else {
                    $("#cargando").hide();
                    $("#section_body").find("> .row > div:last-child()").append(html);
                  }
                  $.each( ARR_secciones, function( k, v ) {
                    if($("#ulSeccion").find("li[data-id='" + k + "']").length)
                      $("#ulSeccion").find("li[data-id='" + k + "'] span:last-child()").text(v.cantidad);
                    else {
                      if(parseInt(k) == 1)
                        $("#ulSeccion").append('<li data-id="' + k + '" data-idmedio="' + JSON.stringify(v.medio) + '" class="list-group-item rounded-0 d-flex justify-content-between align-items-center"><span class="text-truncate">' + v.nombre + '</span><span class="badge badge-primary badge-pill">' + v.cantidad + '</span></li>');
                      else
                        $("#ulSeccion").append('<li data-id="' + k + '" data-idmedio="' + v.medio + '" class="list-group-item rounded-0 d-flex justify-content-between align-items-center"><span class="text-truncate">' + v.nombre + '</span><span class="badge badge-primary badge-pill">' + v.cantidad + '</span></li>');
                    }
                  });
                  $.each( ARR_medios, function( k, v ) {
                    if($("#ulMedio").find("li[data-id='" + k + "']").length)
                      $("#ulMedio").find("li[data-id='" + k + "'] span:last-child()").text(v.cantidad);
                    else
                      $("#ulMedio").append('<li data-id="' + k + '" class="list-group-item rounded-0 d-flex justify-content-between align-items-center"><span class="text-truncate">' + v.nombre + '</span><span class="badge badge-success badge-pill">' + v.cantidad + '</span></li>');
                  });
                  $("#section_body").find('[data-toggle="tooltip"]').tooltip();
                });
              },true);
            });
          }
        }
      },true);
    }
    userDATOS.mostrar();
    /** */
    userDATOS.change = function(t) {
      let elemento = $(t);
      let section = elemento.closest("section");
      userDATOS.busqueda_medios({"id":12,"desde": $("#fechaDesde").val(),"hasta": $("#fechaHasta").val(),"medio":elemento.val()},function(data) {
        if(elemento.val().length == 0)
          userDATOS.select2("#select_seccion",null,0,1);
        else
          userDATOS.select2("#select_seccion",data.data.seccion,1);
        
        if(window.filtro !== undefined && window.filtroTrigger !== undefined) {
          $("#select_seccion").val(window.filtro.secciones);
        } else window.filtroTrigger = undefined;
        if(window.secciones !== undefined)
          $("#select_seccion").val(window.secciones);
        userDATOS.totalRegistros({"id": 12,"desde": $("#fechaDesde").val(),"hasta": $("#fechaHasta").val(),"medios": $("#select_medio").val(),"secciones": $("#select_seccion").val()}, function(data) {
          if(data.data == 0) {
            section.find(".alert.alert-danger").html("Sin registros disponibles");
            section.find(".alert.alert-danger").removeClass("d-none");
          } else {
            section.find("button").removeAttr("disabled");
            section.find(".alert.alert-success").html("Registros totales disponibles " + data.data);
            section.find(".alert.alert-success").removeClass("d-none");
            // id = 12 equivale al identificador de AGENDA NACIONAL
          }
        },true);
      },true);
    }
    /** */
    userDATOS.fechas = function(t, tipo) {
      let fechaDesde = null;
      let fechaHasta = null;
      let elemento = $(t);
      let section = elemento.closest("section");
      if(tipo == 1) {
        fechaDesde = elemento.val();
        fechaHasta = $("#fechaHasta").val();
      } else if(tipo == 2) {
        fechaDesde = $("#fechaDesde").val();
        fechaHasta = elemento.val();
      }
      section.find(".alert.alert-success, .alert.alert-danger").addClass("d-none");
      section.find("button").attr("disabled",true);
      if(fechaDesde == "" && fechaHasta == "") {
        section.find("button").removeAttr("disabled");
        return false;
      }
      if(fechaDesde != "" && fechaHasta != "") {
        if(dates.compare(new Date(fechaDesde),new Date(fechaHasta)) == 1) {
          userDATOS.notificacion("La fecha DESDE no puede ser mayor","error",true,"mini",2500);
          return false;
        }
      }
      userDATOS.totalRegistros({"id": 12,"desde": fechaDesde,"hasta": fechaHasta,"medios": $("#select_medio").val(),"secciones": $("#select_seccion").val()}, function(data) {
        if(data.data == 0) {
          section.find(".alert.alert-danger").html("Sin registros disponibles");
          section.find(".alert.alert-danger").removeClass("d-none");
        } else {
          section.find("button").removeAttr("disabled");
          section.find(".alert.alert-success").html("Registros totales disponibles " + data.data);
          section.find(".alert.alert-success").removeClass("d-none");
          medios = $("#select_medio").val();
          window["secciones"] = $("#select_seccion").val();
          // id = 12 equivale al identificador de AGENDA NACIONAL
          userDATOS.busqueda_medios({"id":12,"desde": fechaDesde,"hasta": fechaHasta},function(data) {
            userDATOS.select2("#select_seccion",null,0,1);
            userDATOS.select2("#select_medio",data.data.medio,1,1);
            $("#select_medio").val(medios).trigger("change");
          },true);
        }
      },true);
    }
    /** */
    userDATOS.filtroLimpiar = function(t) {
      userDATOS.messagebox('<p class="m-0">¿Está seguro de reestablecer el contenido?</p>',
      function() {
        window.filtro = undefined;
        userDATOS.modal('#modal',null,null,0);
        $("#section_body").html('<div class="text-center d-flex justify-content-center"><span class="text-uppercase d-flex align-items-center">cargando</span><div class="loading"><div></div><div></div><div></div></div></div>');
        ARR_secciones = {};
        ARR_medios = {};
        if(window["name_agenda"] !== undefined) window["name_agenda"] = undefined;
        userDATOS.mostrar();
      });
    }
    /** */
    userDATOS.filtro = function(t, inicio = 1) {
      if(inicio) {
        html = "";
        html += '<fieldset class="p-2 mt-3 border border-dark">';
          html += '<legend class="text-uppercase d-inline-block px-2 py-1 border border-dark" style="width:auto;"><i class="fas fa-calendar"></i></legend>';
          html += '<div class="row">';
            html += '<div class="col-6">';
              html += '<input id="fechaDesde" onchange="userDATOS.fechas(this,1);" data-animation="true" data-html="true" data-toggle="tooltip" data-placement="top" title="Fecha <string>DESDE</strong>" class="form-control" type="date" />';
            html += '</div>';
            html += '<div class="col-6">';
              html += '<input id="fechaHasta" onchange="userDATOS.fechas(this,2);" data-animation="true" data-html="true" data-toggle="tooltip" data-placement="top" title="Fecha <string>HASTA</strong>" class="form-control" type="date" />';
            html += '</div>';
          html += '</div>';
        html += '</fieldset>';
        
        html += '<fieldset class="p-2 mt-3 border border-dark">';
          html += '<legend class="text-uppercase d-inline-block px-2 py-1 border border-dark" style="width:auto;"><i class="fas fa-newspaper"></i><i class="fas fa-tags ml-2"></i></legend>';
          html += '<div class="row">';
            html += '<div class="col-12">';
              html += '<select onchange="userDATOS.change(this);" id="select_medio" name="select_medio[]" multiple="multiple" disabled="true" class="form-control w-100 select__2" data-tags="true" data-placeholder="MEDIOS">';
                html += '<option value=""></option>';
              html += '</select>';
            html += '</div>';
          html += '</div>';
          html += '<div class="row mt-2">';
            html += '<div class="col-12">';
              html += '<select id="select_seccion" name="select_seccion[]" multiple="multiple" class="form-control w-100 select__2" data-tags="true" data-allow-clear="true" data-placeholder="SECCIONES">';
                html += '<option value="">SELECCIONE MEDIO/S</option>';
              html += '</select>';
            html += '</div>';
          html += '</div>';
        html += '</fieldset>';
        html += '<div class="alert alert-secondary mt-4" role="alert">';
          html += 'Si selecciona fechas, el sistema le indicará si hay registros disponibles sin necesidad de clickar el boton <strong>filtrar</strong>';
        html += '</div>';
        html += '<div class="alert alert-success d-none" role="alert"></div>';
        html += '<div class="alert alert-danger d-none" role="alert"></div>';

        html += '<button onclick="userDATOS.filtro(this,0);" class="btn btn-block btn-lg btn-primary text-uppercase mt-4" type="button">Filtrar</button>';
        if(window["filtro"] !== undefined)
          html += '<button onclick="userDATOS.filtroLimpiar(this);" class="btn btn-block btn-lg btn-success text-uppercase mt-2" type="button">reestablecer</button>';

        userDATOS.modal("#modal",html,"filtro - agenda nacional");
        userDATOS.busqueda_medios({"id":12},function(data) {
          userDATOS.select2("#select_seccion",null,0,1);
          userDATOS.select2("#select_medio",data.data.medio);
          if(window.filtro !== undefined) {
            $("#fechaDesde").val(window.filtro.desde);
            $("#fechaHasta").val(window.filtro.hasta);
            $("#select_medio").val(window.filtro.medios).trigger("change");
            window["filtroTrigger"] = 1;
          }
        },true);
      } else {
        if(window["filtro"] === undefined) {
          if($("#select_medio").val().length == 0 && $("#select_seccion").val().length == 0 && $("#fechaDesde").val() == "" && $("#fechaHasta").val() == "") {
            userDATOS.notificacion("Faltan datos de búsqueda.","error");
            return false;
          }
          window["filtro"] = {};
          window["filtro"]["id"] = 12;
          window["filtro"]["desde"] = $("#fechaDesde").val();
          window["filtro"]["hasta"] = $("#fechaHasta").val();
          window["filtro"]["medios"] = $("#select_medio").val();//ARRAY
          window["filtro"]["secciones"] = $("#select_seccion").val();//ARRAY
          //Reiniciamos el paginado de busqueda y relanzamos la función
          userDATOS.modal('#modal',null,null,0);
          $("#section_body").html('<div class="text-center d-flex justify-content-center"><span class="text-uppercase d-flex align-items-center">cargando</span><div class="loading"><div></div><div></div><div></div></div></div>');
          ARR_secciones = {};
          ARR_medios = {};
          if(window["name_agenda"] !== undefined) window["name_agenda"] = undefined;
          userDATOS.mostrar();
        }
      }
    }
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

  $("body").on("click","li.lobibox-notify-info a",function(e) {
    e.preventDefault();
  })
});
