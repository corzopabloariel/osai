if(userDATOS.verificar(1)) {
  app = angular.module('simat-app',[,'ngRoute','ngSanitize']);
  const session = userDATOS.session();
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
      .when('/mis_noticias/:noticiaID', {
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
  app.controller('jsonController', ['$rootScope', '$scope', '$location', '$http', '$timeout', function($rootScope, $scope, $location, $http, $timeout) {
    $("#user_name").text(session.user);

    $scope.$on('$viewContentLoaded', function(){
      $(function () {
        $('[data-toggle="tooltip"]').tooltip();
      });
    });

    $scope.direccion = function(dir) {
      console.log(dir);
      console.log($location.path())
      $location.path(dir);
      $scope.$apply();
    }
  }]);
  /**
   * Acciones de vista HOME
   */
  app.controller("index", function ($scope) {
    userDATOS.nav("#!");
    $scope.metricas = false;
    let ARR_secciones = {};
    let ARR_medios = {};
    if(window["name_index"] !== undefined) delete window["name_index"];
    userDATOS.mostrar = function(append = false) {
      if(append) $("#cargando").show();
      userDATOS.busqueda_paginado({"values":{"id_usuario_osai":session.id},"entidad":"osai_cliente","name":"index"},function(data) {
        let html = "";
        let html_seccion = "";
        let OBJ_tipo = {"0": "Noticia recomenda"};
        if(data.data.length != 0) {
          $.each( data.data, function( key, value ) {
            let promise = new Promise(function (resolve, reject) {
              userDATOS.busqueda({"value":value["id_noticia"],"entidad":"noticia"},function(noticia) {
                userDATOS.busqueda({"value":noticia.data.id_seccion,"entidad":"seccion"},function(seccion_) {
                  userDATOS.busqueda({"value":noticia.data["id_medio"],"entidad":"medio"},function(medio) {
                    tipo = value["tipo_aviso"];
                    //----------------
                    if(OBJ_tipo[tipo] === undefined) {//NOTICIA PROPIA
                      data = data = {
                        "idUnidad": session.id_cliente,
                        "idNoticia": noticia.data.id
                      };
                      userDATOS.ajax("verProceso",data,true,function(valores) {
                        valoracion = 0;
                        image = medio.data.image;
                        seccion = (seccion_.data === null ? "SIN SECCIÓN" : seccion_.data.nombre);
                        date = value["autofecha"];
                        url = noticia.data.url;
                        body = noticia.data.cuerpo;
                        titulo = noticia.data.titulo;
                        texto = $(body).text();
                        texto = texto.trim();
                        subtexto = `${texto.substring(0,200)} [...]`;

                        noticiasCliente = valores.data.noticiasCliente;
                        for(var x in noticiasCliente.valoracion)
                          valoracion += parseFloat(noticiasCliente.valoracion[x]["valoracion"]);
                        if(valoracion > 0)
                          span = "<span class='ml-2 badge badge-success'>POSITIVO</span>";
                        else if(valoracion == 0)
                          span = "<span class='ml-2 badge badge-warning'>NEUTRO</span>";
                        else
                          span = "<span class='ml-2 badge badge-danger'>NEGATIVO</span>";

                          html = '<div class="card rounded-0 position-relative">';
                            html += '<div class="card-body p-3">';
                              html += `<img src="${image}"  onError="this.src=\'../assets/images/no-img.png\'" class="d-block mx-auto my-1" style="height:24px; "/>`;
                              html += `<h5 class="card-title text-uppercase font-italic" style="font-size:90%">${titulo + span}</h5>`;
                              html += `<p class="card-text">${subtexto}</p>`;
                              html += '<hr/>';
                              html += '<p class="card-text text-truncate">';
                                html += `<small class="info-oculta text-muted border-right pr-2 mr-2"><i class="fas fa-globe-americas"></i><span class="ml-1">${dates.string(new Date(date))}</span></small>`;
                                html += `<small data-animation="true" data-html="true" data-toggle="tooltip" data-placement="top" title="VER NOTICIA" class="text-muted border-right pr-2 mr-2"><a href="noticia#${value["id_noticia"]}" data-link="interno" class="text-primary"><i class="fas fa-newspaper mr-1"></i>noticia</a></small>`;

                                if(url !== null)
                                  html += `<small data-animation="true" data-html="true" data-toggle="tooltip" data-placement="top" title="IR A LA NOTICIA<br/>- link externo -" class="text-muted border-right pr-2 mr-2"><a data-link="externo" class="text-primary" href="${url}" target="blank"><i class="fas fa-external-link-alt mr-1"></i>noticia</a></small>`;
                                html += `<small data-animation="true" data-html="true" data-toggle="tooltip" data-placement="top" title="SECCIÓN: ' + seccion + '" class="info-oculta text-muted"><i class="fas fa-tag"></i><span class="ml-1">${seccion}</span></small>`;
                              html += '</p>';
                            html += '</div>';
                          html += '</div>';
                          resolve(html);
                      });
                    } else {
                      image = medio.data.image;
                      seccion = (seccion_.data === null ? "SIN SECCIÓN" : seccion_.data.nombre);
                      date = value["autofecha"];
                      url = noticia.data.url;
                      body = noticia.data.cuerpo;
                      titulo = noticia.data.titulo;
                      texto = $(body).text();
                      texto = texto.trim();
                      subtexto = `${texto.substring(0,200)} [...]`;

                      html = '<div class="card rounded-0 position-relative">';
                        html += '<div class="card-header p-3 text-uppercase" style="font-size: .7em;">';
                          html += `<p class="m-0"><i class="fas fa-asterisk text-warning"></i> ${OBJ_tipo[tipo]}</p>`;
                        html += '</div>';

                        html += '<div class="card-body p-3">';
                          html += `<img src="${image}"  onError="this.src=\'../assets/images/no-img.png\'" class="d-block mx-auto my-1" style="height:24px; "/>`;
                          html += `<h5 class="card-title text-uppercase font-italic" style="font-size:90%">${titulo}</h5>`;
                          html += `<p class="card-text">${subtexto}</p>`;
                          html += '<hr/>';
                          html += '<p class="card-text text-truncate">';
                            html += `<small class="info-oculta text-muted border-right pr-2 mr-2"><i class="fas fa-globe-americas"></i><span class="ml-1">${dates.string(new Date(date))}</span></small>`;
                            if(OBJ_tipo[tipo] !== undefined)
                              html += `<small data-animation="true" data-html="true" data-toggle="tooltip" data-placement="top" title="VER NOTICIA" class="text-muted border-right pr-2 mr-2"><a href="recomendado#${value["id_noticia"]}" data-link="interno" class="text-primary"><i class="fas fa-newspaper mr-1"></i>noticia</a></small>`;

                            if(url !== null)
                              html += `<small data-animation="true" data-html="true" data-toggle="tooltip" data-placement="top" title="IR A LA NOTICIA<br/>- link externo -" class="text-muted border-right pr-2 mr-2"><a data-link="externo" class="text-primary" href="${url}" target="blank"><i class="fas fa-external-link-alt mr-1"></i>noticia</a></small>`;
                            html += '<small data-animation="true" data-html="true" data-toggle="tooltip" data-placement="top" title="SECCIÓN: ' + seccion + '" class="info-oculta text-muted"><i class="fas fa-tag"></i><span class="ml-1">' + seccion + '</span></small>';
                          html += '</p>';
                        html += '</div>';
                      html += '</div>';
                      resolve(html);
                    }
                  }, true); // END busqueda MEDIO
                }, true); // END busqueda SECCION
                delete window["scroll"];
              }, true); // END busqueda NOTICIA
            }); // END PROMISE

            promiseFunction = () => {
              promise
                .then(function(html) {
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
                })
            }
            promiseFunction();

          }); // for
        } else {
          $("#section_body").removeClass("card-columns");
          html += '<div class="p-4 mt-4">';
            html += '<p class="m-0 text-uppercase text-center" style="font-size:1.3em">nada para mostrar</p>';
            html += '<p class="text-uppercase text-center">sin noticias</p>'
            html += '<img src="assets/img/notice-icon.png" class="w-50 d-block mx-auto"/>';
          html += '</div>';
          $("#section_body").html(html);
        }
      },true);
    }
    userDATOS.mostrar();

    userDATOS.transfererDatosAGraficoUnMes = function(url){

      // obtengo la unidad de analisis desde userDATOS
      s = userDATOS.session();
      ua = s.id_cliente;
      // obtengo la fecha
      var today = new Date();
      var dd = today.getDate();
      var mm = today.getMonth()+1; //January is 0!
      var yyyy = today.getFullYear();
      if(dd<10) dd = '0'+dd
      if(mm<10) mm = '0'+mm
      str_today = yyyy + '-' + mm + '-' + dd;
      // resto un mes
      today.setMonth(today.getMonth() -1 );
      var dd = today.getDate();
      var mm = today.getMonth()+1; //January is 0!
      var yyyy = today.getFullYear();
      if(dd<10) dd = '0'+dd
      if(mm<10) mm = '0'+mm
      str_lastmonth = yyyy + '-' + mm + '-' + dd;

      var parametros = {"desde":str_lastmonth, "hasta":str_today, "ua":ua};
      window.parametros = parametros;
      window.open(`../${url}`,'blank');
      // w.variables = window.parametros;
      localStorage.setItem("parametros", JSON.stringify(window.parametros));
    };

    userDATOS.busqueda({"value":session.id,"entidad":"osai_grafico","column":"id_usuario_osai","retorno":0},function(data) {
      html = "";
      if(data.data.length == 0) {
        $scope.metricas = true;
        $scope.$digest();
        $("#contenedorMetricas").addClass("align-items-center");
      } else {
        $("#contenedorMetricas").removeClass("align-items-center");
        for(var i in data.data) {

          html += '<div class="card rounded-0 position-relative">';
            if(data.data[i]["image"] !== null)
              html += '<img src="' + data.data[i]["image"] + '"  onError="this.src=\'../assets/images/no-img.png\'" class="w-100 border-0 bg-light card-img-top"/>';
            html += '<div class="card-body">';
              html += '<h5 class="card-title mb-0">' + data.data[i]["titulo"] + '</h5>';
              html += '<p class="card-text">' + data.data[i]["descripcion"] + '</p>';
              // html += '<a onclick="event.preventDefault()" target="blank" href="grafico#' + i + '" class="btn btn-primary">Ver gráfico</a>'
              html += '<a onclick="event.preventDefault(); userDATOS.transfererDatosAGraficoUnMes(\'' + data.data[i]['url'] + '\')" href="#' + i + '" class="btn btn-primary">Ver gráfico</a>';
            html += '</div>';
          html += '</div>';
        }
        if(window.innerWidth <= 768) $("#knowledgegraphcontent").addClass("card-columns")
        $("#knowledgegraphcontent").html(html);
      }
    }, true);
    function ejecutarGrafico(){
			desde = document.getElementById("desde").value;
			hasta = document.getElementById("hasta").value;
			ua = document.getElementById("ua").value

			$.get("/lib/queryGraph.php?desde="+ desde + "&hasta="+ hasta + "&ua="+ ua,
				function(data){
					window.allData = JSON.parse( data );
					demoGraph( window.allData.grafico );
				});
    }
    // $.get("/lib/queryGraph.php?desde=2018-11-28&hasta=2018-12-29&ua=12",
    //   function(data){
    //     window.allData = JSON.parse( data );
    //     demoGraph( window.allData.grafico );
    //   });
  });
  /**
   * Acciones de vista MIS NOTICIAS
   */
  app.controller("noticias", function ($scope, $routeParams) {
    // if($(".tooltip").length)
    //   $(".tooltip").remove();//NO SE PORQUÉ queda enganchando el tooltip
    // if($routeParams["noticiaID"] !== undefined) {
    // }

    userDATOS.nav("#!mis_noticias");
    let ARR_secciones = {};
    let ARR_medios = {};
    if(window["name_perfil"] !== undefined) window["name_perfil"] = undefined;
    userDATOS.mostrar = function(append = false) {
      let data = {"id_usuario_osai":session.id,"tipo_aviso":1};
      if(window["filtro"] !== undefined) {
        data = window["filtro"];
        data["tipo_aviso"] = 1;
      }
      if(append) $("#cargando").show();
      userDATOS.busqueda_paginado({"values":data,"entidad":"osai_cliente","name":"perfil"},function(data) {
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
            $("#section_body").html(html);
          } else {
            // $("#section_body").addClass("card-columns");
            $.each( data.data, function( key, value ) {
              let promise = new Promise(function (resolve, reject) {
                userDATOS.busqueda({"value":value["id_noticia"],"entidad":"noticia"},function(noticia) {
                  userDATOS.busqueda({"value":noticia.data.id_seccion,"entidad":"seccion"},function(seccion_) {
                    userDATOS.busqueda({"value":noticia.data["id_medio"],"entidad":"medio"},function(medio) {
                      data = data = {
                        "idUnidad": session.id_cliente,
                        "idNoticia": noticia.data.id
                      };
                      userDATOS.ajax("verProceso",data,true,function(valores) {
                        valoracion = 0;
                        image = medio.data.image;
                        seccion = (seccion_.data === null ? "SIN SECCIÓN" : seccion_.data.nombre);
                        date = value["autofecha"];
                        tipo = value["tipo_aviso"];
                        url = noticia.data.url;

                        body = noticia.data.cuerpo;
                        titulo = noticia.data.titulo;
                        texto = $(body).text();
                        texto = texto.trim();
                        subtexto = texto.substring(0,200) + " [...]";
                        if(seccion_.data === null) {
                          if(ARR_secciones[1] === undefined) {
                            ARR_secciones[1] = [];
                            ARR_secciones[1]["nombre"] = seccion;
                            ARR_secciones[1]["cantidad"] = 0;
                          }
                          ARR_secciones[1]["cantidad"] ++;
                        } else {
                          if(ARR_secciones[seccion_.data.id] === undefined) {
                            ARR_secciones[seccion_.data.id] = [];
                            ARR_secciones[seccion_.data.id]["nombre"] = seccion;
                            ARR_secciones[seccion_.data.id]["cantidad"] = 0;
                          }
                          ARR_secciones[seccion_.data.id]["cantidad"] ++;
                        }
                        if(ARR_medios[medio.data.id] === undefined) {
                          ARR_medios[medio.data.id] = [];
                          ARR_medios[medio.data.id]["nombre"] = medio.data.medio;
                          ARR_medios[medio.data.id]["cantidad"] = 0;
                        }
                        ARR_medios[medio.data.id]["cantidad"] ++;
                        noticiasCliente = valores.data.noticiasCliente;
                        for(var x in noticiasCliente.valoracion)
                          valoracion += parseFloat(noticiasCliente.valoracion[x]["valoracion"]);
                        if(valoracion > 0)
                          span = "<span class='ml-2 badge badge-success'>POSITIVO</span>";
                        else if(valoracion == 0)
                          span = "<span class='ml-2 badge badge-warning'>NEUTRO</span>";
                        else
                          span = "<span class='ml-2 badge badge-danger'>NEGATIVO</span>";

                          html = '<div class="card rounded-0 position-relative">';
                            html += '<div class="card-body p-3">';
                              html += '<img src="' + image + '"  onError="this.src=\'../assets/images/no-img.png\'" class="d-block mx-auto my-1" style="height:24px; "/>';
                              html += '<h5 class="card-title text-uppercase font-italic" style="font-size:90%">' + titulo + span + '</h5>';
                              html += '<p class="card-text">' + subtexto + '</p>';
                              html += '<hr/>';
                              html += '<p class="card-text text-truncate">';
                                html += '<small class="info-oculta text-muted border-right pr-2 mr-2"><i class="fas fa-globe-americas"></i><span class="ml-1">' + dates.string(new Date(date)) + '</span></small>';
                                html += '<small data-animation="true" data-html="true" data-toggle="tooltip" data-placement="top" title="VER NOTICIA" class="text-muted border-right pr-2 mr-2"><a href="noticia#' + value["id_noticia"] + '" data-link="interno" class="text-primary"><i class="fas fa-newspaper mr-1"></i>noticia</a></small>';

                                if(url !== null)
                                  html += '<small data-animation="true" data-html="true" data-toggle="tooltip" data-placement="top" title="IR A LA NOTICIA<br/>- link externo -" class="text-muted border-right pr-2 mr-2"><a data-link="externo" class="text-primary" href="' + url + '" target="blank"><i class="fas fa-external-link-alt mr-1"></i>noticia</a></small>';
                                html += '<small data-animation="true" data-html="true" data-toggle="tooltip" data-placement="top" title="SECCIÓN: ' + seccion + '" class="info-oculta text-muted"><i class="fas fa-tag"></i><span class="ml-1">' + seccion + '</span></small>';
                              html += '</p>';
                            html += '</div>';
                          html += '</div>';

                          resolve(html)
                      });

                    });
                  }, true);
                  window["scroll"] = undefined;
                },true);// busqueda NOTICIA
              });//END PROMISE

              promiseFunction = () => {
                promise
                  .then(function(html) {
                    if(!append) {
                      if($("#section_body").find(".loading").length) {
                        htmlBody = "";
                        htmlBody += "<div class='row'>";
                          htmlBody += "<div class='col-12 col-lg-3'>";
                            htmlBody += "<div class='row'>";
                              htmlBody += "<div class='col-12 col-md-6 col-lg-12'>";
                                htmlBody += '<h3 class="text-uppercase cursor-pointer mb-0 px-3 py-2 text-white bg-primary" data-toggle="collapse" data-target="#ulSeccion">secciones<span class="float-right"><i class="fas fa-caret-up"></i></span></h3>';
                                htmlBody += "<ul id='ulSeccion' class='list-group collapse show'></ul>";
                              htmlBody += "</div>";
                              htmlBody += '<div class="w-100 pb-2 mb-2 d-none d-lg-block d-xl-none d-xl-block d-block d-sm-none"></div>';
                              htmlBody += "<div class='col-12 col-md-6 col-lg-12'>";
                                htmlBody += '<h3 class="text-uppercase cursor-pointer mb-0 px-3 py-2 text-white bg-success" data-toggle="collapse" data-target="#ulMedio">medios<span class="float-right"><i class="fas fa-caret-up"></i></span></h3>';
                                htmlBody += "<ul id='ulMedio' class='list-group collapse show'></ul>";
                              htmlBody += "</div>";
                            htmlBody += "</div>";
                          htmlBody += "</div>";
                          htmlBody += '<div class="w-100 border-bottom pb-3 mb-3 d-lg-none d-xl-none"></div>';
                          htmlBody += "<div class='col-12 col-lg-9 card-columns'></div>";
                        htmlBody += "</div>";
                        $("#section_body").html(htmlBody);
                      }
                      $("#section_body").find("> .row > div:last-child()").append(html);
                    } else {
                      $("#cargando").hide();
                      $("#section_body").find("> .row > div:last-child()").append(html);
                    }
                    $("#section_body").find('[data-toggle="tooltip"]').tooltip();
                    $.each( ARR_secciones, function( k, v ) {
                      if(!$("#ulSeccion").find("li[data-id='" + k + "']").length)
                        $("#ulSeccion").append('<li data-id="' + k + '" class="list-group-item rounded-0 d-flex justify-content-between align-items-center">' + v.nombre + '<span class="badge badge-primary badge-pill">' + v.cantidad + '</span></li>');
                    });
                    $.each( ARR_medios, function( k, v ) {
                      if(!$("#ulMedio").find("li[data-id='" + k + "']").length)
                        $("#ulMedio").append('<li data-id="' + k + '" class="list-group-item rounded-0 d-flex justify-content-between align-items-center">' + v.nombre + '<span class="badge badge-success badge-pill">' + v.cantidad + '</span></li>');
                    });
                  })
              }
              promiseFunction();
            });
          }
        }
      },true);
    }
    userDATOS.mostrar();
    /** */
    userDATOS.change = function(t, tipo = 1) {
      let elemento = $(t);
      let section = elemento.closest("section");

      if(tipo) {
        userDATOS.busqueda_medios({"id":session.id_cliente,"desde": $("#fechaDesde").val(),"hasta": $("#fechaHasta").val(),"medio":elemento.val()},function(data) {
          userDATOS.select2("#select_seccion",null,0,1);
          if(elemento.val().length != 0)
            userDATOS.select2("#select_seccion",data.data.seccion,1);

          if(window.filtro !== undefined && window.filtroTrigger !== undefined) {
            $("#select_seccion").val(window.filtro.secciones);
          } else window.filtroTrigger = undefined;
          if(window.secciones !== undefined) {
            $("#select_seccion").val(window.secciones).trigger("change");
            window["secciones"] = undefined;
          }
          userDATOS.totalRegistros({"id": session.id_cliente,"desde": $("#fechaDesde").val(),"hasta": $("#fechaHasta").val(),"medios": $("#select_medio").val(),"secciones": $("#select_seccion").val()}, function(data) {
            if(data.data == 0) {
              section.find(".alert.alert-danger").html("Sin registros disponibles");
              section.find(".alert.alert-danger").removeClass("d-none");
            } else {
              section.find("button").removeAttr("disabled");
              section.find(".alert.alert-success").html("Registros totales disponibles " + data.data);
              section.find(".alert.alert-success").removeClass("d-none");
            }
          },true);
        },true);
      } else {
        userDATOS.totalRegistros({"id": session.id_cliente,"desde": $("#fechaDesde").val(),"hasta": $("#fechaHasta").val(),"medios": $("#select_medio").val(),"secciones": $("#select_seccion").val()}, function(data) {
          if(data.data == 0) {
            section.find(".alert.alert-danger").html("Sin registros disponibles");
            section.find(".alert.alert-danger").removeClass("d-none");
          } else {
            section.find("button").removeAttr("disabled");
            section.find(".alert.alert-success").html("Registros totales disponibles " + data.data);
            section.find(".alert.alert-success").removeClass("d-none");
          }
        },true);
      }
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
      userDATOS.totalRegistros({"id": session.id_cliente,"desde": fechaDesde,"hasta": fechaHasta,"medios": $("#select_medio").val(),"secciones": $("#select_seccion").val()}, function(data) {
        if(data.data == 0) {
          section.find(".alert.alert-danger").html("Sin registros disponibles");
          section.find(".alert.alert-danger").removeClass("d-none");
        } else {
          section.find("button").removeAttr("disabled");
          section.find(".alert.alert-success").html("Registros totales disponibles " + data.data);
          section.find(".alert.alert-success").removeClass("d-none");
          medios = $("#select_medio").val();
          window["secciones"] = $("#select_seccion").val();
          userDATOS.busqueda_medios({"id":session.id_cliente,"desde": fechaDesde,"hasta": fechaHasta},function(data) {
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
        if(window["name_perfil"] !== undefined) window["name_perfil"] = undefined;
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
              html += '<input id="fechaDesde" onchange="userDATOS.fechas(this,1);" data-animation="true" data-html="true" data-toggle="tooltip" data-placement="top" title="Fecha <string>DESDE</strong>" class="form-control form-control-lg" type="date" />';
            html += '</div>';
            html += '<div class="col-6">';
              html += '<input id="fechaHasta" onchange="userDATOS.fechas(this,2);" data-animation="true" data-html="true" data-toggle="tooltip" data-placement="top" title="Fecha <string>HASTA</strong>" class="form-control form-control-lg" type="date" />';
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
              html += '<select onchange="userDATOS.change(this,0);" id="select_seccion" name="select_seccion[]" multiple="multiple" class="form-control w-100 select__2" data-tags="true" data-placeholder="SECCIONES">';
                html += '<option value="">SELECCIONE MEDIO/S</option>';
              html += '</select>';
            html += '</div>';
          html += '</div>';
        html += '</fieldset>';

        html += '<fieldset class="p-2 mt-3 border border-dark">';
          html += '<legend class="text-uppercase d-inline-block px-2 py-1 border border-dark" style="width:auto;"><i class="fas fa-terminal"></i></legend>';
          html += '<div class="row">';
            html += '<div class="col-12">';
              html += '<input id="titulo" class="form-control form-control-lg w-100" placeholder="TÍTULO">';
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

        userDATOS.modal("#modal",html,"filtro - mis noticias");
        userDATOS.busqueda_medios({"id":session.id_cliente},function(data) {
          userDATOS.select2("#select_seccion",null,0,1);
          userDATOS.select2("#select_medio",data.data.medio);
          if(window.filtro !== undefined) {
            if(window.filtro.desde != "")
              $("#fechaDesde").val(window.filtro.desde);
            if(window.filtro.hasta != "")
              $("#fechaHasta").val(window.filtro.hasta);
            if(window.filtro.medios.length > 0)
              $("#select_medio").val(window.filtro.medios).trigger("change");
            $("#titulo").val(window.filtro.titulo);
            window["filtroTrigger"] = 1;
          }
        },true);
      } else {
        if($("#select_medio").val().length == 0 && $("#select_seccion").val().length == 0 && $("#fechaDesde").val() == "" && $("#fechaHasta").val() == "" && $("#titulo").val() == "") {
          userDATOS.notificacion("Faltan datos de búsqueda.","error");
          return false;
        }
        window["filtro"] = {};
        window["filtro"]["id"] = session.id_cliente;
        window["filtro"]["desde"] = $("#fechaDesde").val();
        window["filtro"]["hasta"] = $("#fechaHasta").val();
        window["filtro"]["medios"] = $("#select_medio").val();//ARRAY
        window["filtro"]["secciones"] = $("#select_seccion").val();//ARRAY
        window["filtro"]["titulo"] = $("#titulo").val();
        //Reiniciamos el paginado de busqueda y relanzamos la función
        userDATOS.modal('#modal',null,null,0);
        $("#section_body").html('<div class="text-center d-flex justify-content-center"><span class="text-uppercase d-flex align-items-center">cargando</span><div class="loading"><div></div><div></div><div></div></div></div>');
        ARR_secciones = {};
        ARR_medios = {};
        if(window["name_perfil"] !== undefined) window["name_perfil"] = undefined;
        userDATOS.mostrar();
      }
    }
    /** */
    /** */
    $('body').on('hidden.bs.collapse','#ulSeccion,#ulMedio', function () {
      $(this).prev().find("span").html('<i class="fas fa-caret-down"></i>');
    }).on('show.bs.collapse','#ulSeccion,#ulMedio', function () {
      $(this).prev().find("span").html('<i class="fas fa-caret-up"></i>');
    });
  });
  /*
  FALTA
    - mostrar proceso
    - mostrar proceso con detalla (desde mis noticas)
  */
  /**
   * Acciones de vista AGENDA NACIONAL
   */
  app.controller("agenda", function ($scope) {
    let ARR_secciones = {};
    let ARR_medios = {};
    if(window["filtro"] !== undefined) window["filtro"] = undefined;
    if(window["name_agenda"] !== undefined) window["name_agenda"] = undefined;
    userDATOS.totalRegistros({"id": 12}, function(data) { $scope.total = data.data });
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
              let promise = new Promise(function (resolve, reject) {
                userDATOS.busqueda({"value":value["id_noticia"],"entidad":"noticia"},function(noticia) {
                  userDATOS.busqueda({"value":noticia.data.id_medio,"entidad":"medio"},function(medio) {
                    userDATOS.busqueda({"value":noticia.data.id_seccion,"entidad":"seccion"},function(seccion_) {
                      seccion = (seccion_.data === null ? "SIN SECCIÓN" : seccion_.data.nombre);
                      date = value["autofecha"];
                      tipo = value["tipo_aviso"];
                      url = noticia.data.url;
                      image = medio.data.image;
                      body = noticia.data.cuerpo;
                      titulo = noticia.data.titulo;

                      if(seccion_.data === null) {
                        if(ARR_secciones[1] === undefined) {
                          ARR_secciones[1] = [];
                          ARR_secciones[1]["nombre"] = seccion;
                          ARR_secciones[1]["cantidad"] = 0;
                        }
                        ARR_secciones[1]["cantidad"] ++;
                      } else {
                        if(ARR_secciones[seccion_.data.id] === undefined) {
                          ARR_secciones[seccion_.data.id] = [];
                          ARR_secciones[seccion_.data.id]["nombre"] = seccion;
                          ARR_secciones[seccion_.data.id]["cantidad"] = 0;
                        }
                        ARR_secciones[seccion_.data.id]["cantidad"] ++;
                      }
                      if(ARR_medios[medio.data.id] === undefined) {
                        ARR_medios[medio.data.id] = [];
                        ARR_medios[medio.data.id]["nombre"] = medio.data.medio;
                        ARR_medios[medio.data.id]["cantidad"] = 0;
                      }
                      ARR_medios[medio.data.id]["cantidad"] ++;

                      try {
                        texto = $(body).text();
                      } catch (error) {
                        texto = body;
                      }
                      texto = texto.trim();
                      if(texto.length > 200)
                        subtexto = texto.substring(0,200) + " [...]";
                      else
                        subtexto = texto;

                      html = '<div class="card rounded-0 position-relative">';
                        html += '<div class="card-body p-3">';
                          html += '<img src="' + image + '"  onError="this.src=\'../assets/images/no-img.png\'" class="d-block mx-auto mb-2" style="height:24px; "/>';
                          html += '<h5 class="card-title text-uppercase font-italic">' + titulo + '</h5>';
                          html += '<p class="card-text">' + subtexto + '</p>';
                          html += '<hr/>';
                          html += '<p class="card-text text-truncate">';
                            html += '<small class="info-oculta text-muted border-right pr-2 mr-2"><i class="fas fa-globe-americas"></i><span class="ml-1">' + dates.string(new Date(date)) + '</span></small>';
                            html += '<small data-animation="true" data-html="true" data-toggle="tooltip" data-placement="top" title="VER NOTICIA" class="text-muted border-right pr-2 mr-2"><a data-id="' + value["id"] + '" href="agenda#' + value["id_noticia"] + '" data-link="interno" class="text-primary"><i class="fas fa-newspaper mr-1"></i>noticia</a></small>';
                            if(url !== null)
                              html += '<small data-animation="true" data-html="true" data-toggle="tooltip" data-placement="top" title="IR A LA NOTICIA<br/>- link externo -" class="text-muted border-right pr-2 mr-2"><a data-link="externo" class="text-primary" href="' + url + '" target="blank"><i class="fas fa-external-link-alt mr-1"></i>noticia</a></small>';
                            html += '<small data-animation="true" data-html="true" data-toggle="tooltip" data-placement="top" title="SECCIÓN: ' + seccion + '" class="info-oculta text-muted"><i class="fas fa-tag"></i><span class="ml-1">' + seccion + '</span></small>';
                          html += '</p>';
                        html += '</div>';
                      html += '</div>';

                      resolve(html);
                    }, true);
                  });
                  window["scroll"] = undefined;
                },true);
              });//END PROMISE

              promiseFunction = () => {
                promise
                  .then(function(html) {
                    if(!append) {
                      if($("#section_body").find(".loading").length) {
                        htmlBody = "";
                        htmlBody += "<div class='row'>";
                          htmlBody += "<div class='col-12 col-lg-3'>";
                            htmlBody += "<div class='row'>";
                              htmlBody += "<div class='col-12 col-md-6 col-lg-12'>";
                                htmlBody += '<h3 class="text-uppercase cursor-pointer mb-0 px-3 py-2 text-white bg-primary" data-toggle="collapse" data-target="#ulSeccion">secciones<span class="float-right"><i class="fas fa-caret-up"></i></span></h3>';
                                htmlBody += "<ul id='ulSeccion' class='list-group collapse show'></ul>";
                              htmlBody += "</div>";
                              htmlBody += '<div class="w-100 pb-2 mb-2 d-none d-lg-block d-xl-none d-xl-block d-block d-sm-none"></div>';
                              htmlBody += "<div class='col-12 col-md-6 col-lg-12'>";
                                htmlBody += '<h3 class="text-uppercase cursor-pointer mb-0 px-3 py-2 text-white bg-success" data-toggle="collapse" data-target="#ulMedio">medios<span class="float-right"><i class="fas fa-caret-up"></i></span></h3>';
                                htmlBody += "<ul id='ulMedio' class='list-group collapse show'></ul>";
                              htmlBody += "</div>";
                            htmlBody += "</div>";
                          htmlBody += "</div>";
                          htmlBody += '<div class="w-100 border-bottom pb-3 mb-3 d-lg-none d-xl-none"></div>';
                          htmlBody += "<div class='col-12 col-lg-9 card-columns'></div>";
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
                        $("#ulSeccion").append('<li data-id="' + k + '" class="list-group-item rounded-0 d-flex justify-content-between align-items-center"><span class="text-truncate">' + v.nombre + '</span><span class="badge badge-primary badge-pill">' + v.cantidad + '</span></li>');
                      }
                    });
                    $.each( ARR_medios, function( k, v ) {
                      if($("#ulMedio").find("li[data-id='" + k + "']").length)
                        $("#ulMedio").find("li[data-id='" + k + "'] span:last-child()").text(v.cantidad);
                      else
                        $("#ulMedio").append('<li data-id="' + k + '" class="list-group-item rounded-0 d-flex justify-content-between align-items-center"><span class="text-truncate">' + v.nombre + '</span><span class="badge badge-success badge-pill">' + v.cantidad + '</span></li>');
                    });
                    $("#section_body").find('[data-toggle="tooltip"]').tooltip();
                  })
              }
              promiseFunction();
            });
          }
        }
      },true);
    }
    userDATOS.mostrar();
    /** */
    userDATOS.change = function(t, tipo = 1) {
      let elemento = $(t);
      let section = elemento.closest("section");

      if(tipo) {
        userDATOS.busqueda_medios({"id":12,"desde": $("#fechaDesde").val(),"hasta": $("#fechaHasta").val(),"medio":elemento.val()},function(data) {
          userDATOS.select2("#select_seccion",null,0,1);
          if(elemento.val().length != 0)
            userDATOS.select2("#select_seccion",data.data.seccion,1);

          if(window.filtro !== undefined && window.filtroTrigger !== undefined) {
            $("#select_seccion").val(window.filtro.secciones);
          } else window.filtroTrigger = undefined;
          if(window.secciones !== undefined) {
            $("#select_seccion").val(window.secciones).trigger("change");
            window["secciones"] = undefined;
          }
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
      } else {
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
        // userDATOS.busqueda_medios({"id":12,"desde": $("#fechaDesde").val(),"hasta": $("#fechaHasta").val(),"medios": $("#select_medio").val(),"secciones":elemento.val()},function(data) {
        // },true);
      }
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
              html += '<select onchange="userDATOS.change(this,0);" id="select_seccion" name="select_seccion[]" multiple="multiple" class="form-control w-100 select__2" data-tags="true" data-placeholder="SECCIONES">';
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
    /** */
    /** */
    $('body').on('hidden.bs.collapse','#ulSeccion,#ulMedio', function () {
      $(this).prev().find("span").html('<i class="fas fa-caret-down"></i>');
    }).on('show.bs.collapse','#ulSeccion,#ulMedio', function () {
      $(this).prev().find("span").html('<i class="fas fa-caret-up"></i>');
    });
  });
  /**
   * Acciones de vista NOTIFICACIONES
   */
  app.controller("notificaciones", function ($scope) {
    userDATOS.nav("#!notificaciones");
    let ARR_secciones = {};
    let ARR_medios = {};
    let medios = {"": ""};
    let bg_color = ["bg-secondary text-white","bg-warning","bg-intermedio text-white","bg-danger text-white"]//AMARILLO / NARANJA / ROJO
    $('[data-toggle="tooltip"]').tooltip();
    userDATOS.ajax("notificacionMedios",{"id": session.id}, true, function(data) {
      $("#fecha_min,#fecha_max,#select_tipoAlerta,#select_cantidad,#btn_filtro").removeAttr("disabled");
      userDATOS.select2("#select_medio",data.data);
    });
    /**
     * TABLA osai_notificacion
     * -> id_usuario / id_noticia / id_usuario_osai / nivel / mensaje / estado
     */
    if(window["name_notificacion"] !== undefined) window["name_notificacion"] = undefined;
    userDATOS.mostrar = function(append = false) {
      let data = {"id_usuario_osai":session.id};
      if(window["filtro"] !== undefined) {
        data = window["filtro"];
        data["id_usuario_osai"] = session.id_cliente;
      }
      if(append) $("#cargando").show();
      userDATOS.busqueda_paginado({"values":data,"entidad":"osai_notificacion","name":"notificacion"},function(data) {
        if(data.data !== null) {
          if(data.data.length == 0) {
            $("#section_body").removeClass("card-columns");
            html = '<div class="p-4 mt-4">';
              html += '<p class="m-0 text-uppercase text-center" style="font-size:1.3em">nada para mostrar</p>';
              html += '<p class="text-uppercase text-center">sin noticias</p>'
              html += '<img src="assets/img/notice-icon.png" class="w-50 d-block mx-auto"/>';
            html += '</div>';
            $("#section_body").html(html);
          } else {
            // $("#section_body").addClass("card-columns");
            $.each( data.data, function( key, value ) {
              userDATOS.busqueda({"value":value["id_noticia"],"entidad":"noticia"},function(noticia) {
                userDATOS.busqueda({"value":noticia.data.id_seccion,"entidad":"seccion"},function(seccion_) {
                  userDATOS.busqueda({"value":noticia.data["id_medio"],"entidad":"medio"},function(medio) {
                    seccion = (seccion_.data === null ? "SIN SECCIÓN" : seccion_.data.nombre);
                    image = medio.data.image;
                    estado = value["estado"];
                    date = value["autofecha"];
                    leido = value["leido"];
                    nivel = value["nivel"];
                    mensaje = value["mensaje"];
                    url = noticia.data.url;
                    body = noticia.data.cuerpo;
                    titulo = noticia.data.titulo;
                    texto = $(body).text();
                    texto = texto.trim();
                    subtexto = texto.substring(0,200) + " [...]";
                    html = '<div ' + (((parseInt(leido) == 1 && parseInt(nivel) != 0) || parseInt(nivel) == 0) ? 'style="opacity:.6;"' : '') + ' class="card rounded-0 position-relative ' + bg_color[nivel] + '">';
                      html += '<img src="' + image + '"  onError="this.src=\'../assets/images/no-img.png\'" class="card-img-top p-2 bg-white rounded-0"/>';
                      html += '<div class="card-body p-3">';
                        html += '<h5 class="card-title text-uppercase font-italic">' + titulo + '</h5>';
                        html += '<p class="card-text">' + mensaje + '</p>';
                        html += '<p class="card-text d-none">' + subtexto + '</p>';
                        html += '<hr/>';
                        html += '<p class="card-text text-truncate">';
                          html += '<small class="info-oculta border-right pr-2 mr-2"><i class="fas fa-globe-americas"></i><span class="ml-1">' + dates.string(new Date(date)) + '</span></small>';
                          if(parseInt(nivel) == 0)
                            html += '<small data-animation="true" data-html="true" data-toggle="tooltip" data-placement="top" title="VER NOTICIA" class="border-right pr-2 mr-2"><a style="color:inherit;" href="noticia#' + value["id_noticia"] + '" data-link="interno"><i class="fas fa-file-alt mr-1"></i>proceso</a></small>';
                          else
                            html += '<small data-animation="true" data-html="true" data-toggle="tooltip" data-placement="top" title="VER NOTICIA" class="border-right pr-2 mr-2"><a data-id="' + value["id"] + '" style="color:inherit;" href="ver#' + value["id_noticia"] + '" data-link="interno"><i class="fas fa-newspaper mr-1"></i>noticia</a></small>';
                          if(url !== null)
                            html += '<small data-animation="true" data-html="true" data-toggle="tooltip" data-placement="top" title="IR A LA NOTICIA<br/>- link externo -" class="border-right pr-2 mr-2"><a data-link="externo" style="color:inherit;" href="' + url + '" target="blank"><i class="fas fa-external-link-alt mr-1"></i>noticia</a></small>';
                          html += '<small data-animation="true" data-html="true" data-toggle="tooltip" data-placement="top" title="SECCIÓN: ' + seccion + '" class="info-oculta"><i class="fas fa-tag"></i><span class="ml-1">' + seccion + '</span></small>';
                        html += '</p>';
                      html += '</div>';
                      if(parseInt(leido) == 0 && parseInt(nivel) != 0) {
                        html += '<div class="card-footer text-center text-uppercase">';
                          html += 'sin leer'
                        html += '</div>';
                      }
                    html += '</div>';
                    if(!append) {
                      if($("#section_body").find(".loading").length) {
                        $("#section_body").html("");
                        if(window.innerWidth >= 992)
                          $("#section_body").addClass("card-columns");
                      }
                      $("#section_body").append(html);
                    } else {
                      $("#cargando").hide();
                      $("#section_body").append(html);
                    }
                    $("#section_body").find('[data-toggle="tooltip"]').tooltip();
                  }, true);
                }, true);
                ////--------------------
                window["scroll"] = undefined;
              },true);
            });
          }
        }
      },true);
    }
    userDATOS.mostrar();

    userDATOS.filtrar = function(t) {
      let fechaDesde = $("#fecha_min").val();
      let fechaHasta = $("#fecha_max").val();
      let medios = $("#select_medio").val();
      let tipo = $("#select_tipoAlerta").val();
      let cantidad = $("#select_cantidad").val();//Selecciona si trae sin importar su estado

      if(parseInt(cantidad) == 0 && tipo == "" && medios.length == 0 && fechaDesde == "" && fechaHasta == "") return false;
      window["filtro"] = {};
      window["filtro"]["medios"] = JSON.stringify(medios);
      window["filtro"]["desde"] = fechaDesde;
      window["filtro"]["hasta"] = fechaHasta;
      window["filtro"]["nivel"] = tipo;
      window["filtro"]["cantidad"] = cantidad;

      $("#section_body").removeClass("card-columns");
      $("#section_body").html('<div class="text-center d-flex justify-content-center"><span class="text-uppercase d-flex align-items-center">cargando</span><div class="loading"><div></div><div></div><div></div></div></div>');
      if(window["name_notificacion"] !== undefined) window["name_notificacion"] = undefined;
      userDATOS.mostrar();

    }
    $("#select_tipoAlerta").on("change",function() {
      switch(parseInt($(this).val())) {
        case 0:
          $(this).css({"backgroundColor": "#6c757d", "color": "#fff"});
        break;
        case 1:
          $(this).css({"backgroundColor": "#ffc107", "color": "#000"});
        break;
        case 2:
          $(this).css({"backgroundColor": "#ff8000", "color": "#fff"});
        break;
        case 3:
          $(this).css({"backgroundColor": "#dc3545", "color": "#fff"});
        break;
      }
    });
  });
  /**
   * Acciones de vista CONFIGURACION
   */
  app.controller("configuracion", function ($scope) {
    userDATOS.nav("#!configuracion");
    userDATOS.renderSubmit = function(data) {
      if(data.passwordNew_1 != data.passwordNew_2) {
        userDATOS.notificacion("Las contraseñas no coinciden","error");
        return false;
      }
      _return = null;
      userDATOS.busqueda({"value":session.id,"entidad":"osai_usuario"},function(user) {
        pyrusElemento = new Pyrus("osai_usuario");
        if(md5(data.passwordOld) != user.data.pass) {
          userDATOS.notificacion("Contraseña actual incorrecta","error",true,"mini",3500);
          _return = false;
          return false;
        }
        if(md5(data.passwordNew_1) == user.data.pass) {
          userDATOS.notificacion("La contraseña nueva tiene que ser distinta a la anterior","error",true,"mini",3500);
          _return = false;
          return false;
        }
        user.data.pass = md5(data.passwordNew_1);
        pyrusElemento.guardar_1(user.data, true);
        userDATOS.notificacion("Contraseña cambiada correctamente","default",false);
        _return = true;
      },false);
      return _return;
    }
    $('input[type="password"] + i').on('click', function() {
      $(this).toggleClass('fas fa-eye').toggleClass('fas fa-eye-slash');
      let typeInput = $(this).parent().find("input").attr("type");
      $(this).parent().find("input").attr("type",(typeInput == "text" ? "password" : "text"));
    });
  });

} else window.location = "index.html";
$(document).ready(function() {
  if(window.innerWidth < 576) {
    $("#dropdownMenu").css({"width": window.innerWidth - 10});
  }
  $(window).scroll(function() {
    if($(window).scrollTop() >= ($(document).height() - $(window).height() - 10)) {
      if($("#menu a:not([href])").data("href") == "#!agenda_nacional") {
        if(window["scroll"] == undefined) {
          window["scroll"] = 1;
          userDATOS.mostrar(true);
        }
      }
    }
    // userDATOS.notificacion("El scroll");
    // if ($(document).height() - $(window).height() == $(window).scrollTop()){
    //   userDATOS.notificacion("El scroll ha llegado al final");
    //   // Aqui tu petición Ajax
    // }
  });

  $("body").on("click",".info-oculta",function() {
    $(this).find("span").toggle(500, function() {
      // if($(this).is(":visible"))
      //   userDATOS.notificacion("Mostrando información")
      // else
      //   userDATOS.notificacion("Ocultando información")
    });
  });

  $("body").on("click","li.lobibox-notify-info a",function(e) {
    e.preventDefault();
  }).on("click","a[data-link=\"interno\"]", function(e) {
    // noticia#X -> noticias con proceso de la UNIDAD DE ANÁLISIS
    // recomendado#X -> solo trae datos básicos [OK]
    // ver#X -> solo trae datos básicos [OK]
    // agenda#X -> noticia con proceso de AGENDA NACIONAL
    e.preventDefault();
    let cargador = `<div class="w-100 align-self-center text-uppercase text-center">cargando<img class="d-inline-block ml-2" src="http://${servidor}/assets/images/loading_notificacion.gif" style="height: 30px;"></div>`;
    let value = $(this).attr("href");
    let aux = value.split("#");
    let noticias = null;
    let id = $(this).data("id");
    let card = $(this).closest(".card");
    let session = userDATOS.session();
    $("#noticiaProceso").find("> div").html(cargador);
    $("body").css({overflow:"hidden",paddingRight:"15px"});
    $("#noticiaProceso").show();
    $("#section_body").find('[data-toggle="tooltip"]').tooltip('dispose');

    userDATOS.busqueda({"value":aux[1],"entidad":"noticias"},function(noticia) {
      noticias = noticia.data;
      try {
        noticias.data = userDATOS.parseJSON(noticias.data);
      } catch (error) {

      }

      userDATOS.busqueda({"value":aux[1],"entidad":"noticia"},function(noticia) {
        seccion = medio = periodista = null;
        if(parseInt(noticia.data.id_seccion) == 1) seccion = "SIN SECCIÓN";
        else {
          userDATOS.busqueda({"value":noticia.data.id_seccion,"entidad":"seccion"},function(seccionBD) {
            seccion = seccionBD.data.nombre;
          });
        }
        userDATOS.busqueda({"value":noticia.data["id_medio"],"entidad":"medio"},function(medioBD) {
          medio = medioBD.data;
        });
        userDATOS.busqueda({"value":aux[1],"entidad":"noticiaperiodista","column":"id_noticia"},function(periodistaBD) {
          if(periodistaBD.data == null) periodista = "Sin periodista";
          else {
            userDATOS.busqueda({"value":periodistaBD.data.id_periodista,"entidad":"periodista"},function(periodistaBBD) {
              periodista = periodistaBBD.data.nombre;
            });
          }
        });
        url = "";
        if(noticia.data.url !== null)
          url = '<a data-link="externo" class="text-primary" href="' + noticia.data.url + '" target="blank"><i class="fas fa-external-link-alt mr-1"></i></a>';
        html = "";
        html += '<div class="w-100 position-relative">';
          html += '<div class="row d-none d-sm-block border-bottom bg-white w-100 position-fixed shadow" style="left:15px; top:0; z-index:100;">';
            if(aux[0] == "noticia")
              html += '<button onclick="userDATOS.verProceso(this, ' + session.id_cliente + ',' + noticia.data.id + ')" class="btn text-uppercase btn-success position-absolute" style="left: .5rem;top: .5rem;z-index: 10;"><i class="far fa-file-alt"></i></button>';
            if(aux[0] == "agenda")
              html += '<button onclick="userDATOS.verProceso(this, 12,' + noticia.data.id + ')" class="btn text-uppercase btn-success position-absolute" style="left: .5rem;top: .5rem;z-index: 10;"><i class="far fa-file-alt"></i></button>';
            html += '<button onclick="userDATOS.noticiaProcesoClose();" type="button" class="close position-absolute p-2" style="right:0px; top:0; z-index:2; outline: none;" aria-label="Close">';
              html += '<span aria-hidden="true" style="font-size: 3em;line-height: 18px;" class="font-weight-light text-dark">×</span>';
            html += '</button>';
            html += '<div class="col-12">';
              html += '<img src="' + medio.image + '" onError="this.src=\'../assets/images/no-img.png\'" class="d-block mx-auto my-1 w-50"/>';
              html += '<h2 class="mb-0 py-2 text-center">' + noticia.data.titulo + '</h2>';
              if(noticias.subtitulo !== undefined)
                html += '<h3 class="mb-0 py-2 text-center">' + noticias.subtitulo + '</h3>';

              html += '<p class="mb-0 text-center">' + medio.medio + ' | ' + seccion + ' | ' + periodista + ' | ' + dates.string(new Date(noticia.data.fecha),0) + (url != "" ? ' | ' + url : '') + '</p>';
            html += '</div>';
          html += '</div>';
          html += '<div class="row d-block d-sm-none border-bottom bg-white">';
            if(aux[0] == "noticia")
              html += '<button onclick="userDATOS.verProceso(this, ' + session.id_cliente + ',' + noticia.data.id + ')" class="btn text-uppercase btn-success position-absolute" style="left: .5rem;top: .5rem;z-index: 10;"><i class="far fa-file-alt"></i></button>';
            if(aux[0] == "agenda")
              html += '<button onclick="userDATOS.verProceso(this, 12,' + noticia.data.id + ')" class="btn text-uppercase btn-success position-absolute" style="left: .5rem;top: .5rem;z-index: 10;"><i class="far fa-file-alt"></i></button>';
            html += '<button onclick="userDATOS.noticiaProcesoClose();" type="button" class="close position-absolute p-2" style="right:0px; top:0; z-index:2; outline: none;" aria-label="Close">';
              html += '<span aria-hidden="true" style="font-size: 3em;line-height: 18px;" class="font-weight-light text-dark">×</span>';
            html += '</button>';
            html += '<div class="col-12">';
              html += '<img src="' + medio.image + '" onError="this.src=\'../assets/images/no-img.png\'" class="d-block mx-auto my-1 mt-3 w-50"/>';
              html += '<h2 class="mb-0 py-2 text-center">' + noticia.data.titulo + '</h2>';
              if(noticias.subtitulo !== undefined)
                html += '<h3 class="mb-0 py-2 text-center">' + noticias.subtitulo + '</h3>';

              html += '<p class="mb-0 text-center">' + medio.medio + ' | ' + seccion + ' | ' + periodista + ' | ' + dates.string(new Date(noticia.data.fecha),0) + (url != "" ? ' | ' + url : '') + '</p>';
            html += '</div>';
          html += '</div>';

          html += '<div class="row position-relative" style="overflow-y: auto;">';
            html += '<div class="col-12">';
              html += '<div data-proceso></div>';
              if(noticias.imagen !== undefined)
                html += '<img src="' + noticias.imagen + '" onError="this.src=\'../assets/images/no-img.png\'" class="d-block mx-auto my-1 w-75"/>';
              html += '<div class="pt-3">' + noticia.data.cuerpo + '</div>';
            html += '</div>';
          html += '</div>';
        html += '</div>';
        $("#noticiaProceso").click();
        $("#noticiaProceso").find("> div").html(html);
        setTimeout(() => {
          h = $("#noticiaProceso").find("> div").find("> div >.row:first-child()").height();
          if(window.innerWidth >= 720)
            $("#noticiaProceso").find("*[data-proceso]").closest(".row").css({top:h,height:"calc(100% - " + h + "px)"});
          if(aux[0] == "ver") {//NOTIFICACIONES -> cambia los flag necesarios
            userDATOS.busqueda({"value":id,"entidad":"osai_notificacion"},function(e) {
              if(parseInt(e.data.leido) == 1) return false;
              userDATOS.change({"entidad": "osai_notificacion", "id":id,"column":"leido","value":"1"},function(d) {
                card.find(".card-footer").remove();
                card.css({"opacity":".6"});
              }, true);
            },true);
          }
        }, 50);
      },true);
    },true);
  }).on("click","a[target=\"blank\"]", function(e) {
    e.preventDefault();
    let url = $(this).attr("href");
    let msg = '<p class="mb-0 text-center">Esta por abrir un link externo.<br/>¿Desea continuar?</p>';
    msg += '<p class="mb-0 text-center mt-2">-<small class="mx-2">Desbloquee la función de <strong>POP-UPS</strong></small>-</p>';
    userDATOS.messagebox(msg,function() {
      window.open(url, '_blank');
  		return false;
    });
  });


  /**
   * Eventos del SERVIDOR
   */
  window.evtSource = new EventSource("lib/server.php");
  window.evtSource.onopen = function(e) {
    console.log("CONEXIÓN establecida");
  };
  window.evtSource.onmessage = function(e) {};
  window.evtSource.addEventListener('notificacion', notificacionEVENT);

  function notificacionEVENT(e) {
    let aux = userDATOS.parseJSON(e.data);
    let notificacion = $("#dropdownMenu").closest("li");
    let cantidad = notificacion.find("> div > span").text();
    if(cantidad == 0)
      notificacion.find("> div > span").toggleClass("badge-secondary").toggleClass("badge-danger");
    cantidad = parseInt(cantidad) + 1;
    notificacion.find("> div > span").text(cantidad);

    mensaje = aux.mensaje;
    mensaje += '<span class="text-truncate d-block">' + aux["mensajeBD"] + '</span>';
    if(notificacion.find("> div ul li.nada").length)
      notificacion.find("> div ul").html('<li onclick="userDATOS.alerta(this);" data-id="' + e.lastEventId + '" class="list-group-item rounded-0 border-0">' + mensaje + '</li>');
    else
      notificacion.find("> div ul").append('<li onclick="userDATOS.alerta(this);" data-id="' + e.lastEventId + '" class="list-group-item rounded-0 border-0">' + mensaje + '</li>');
  }
});