if(window.variables === undefined) window.variables = {};
if(window.contenido === undefined) window.contenido = {};

function noF5() {
  var tecla = window.event.keyCode;
  if(tecla == 116) {
    event.keyCode=0;
    event.returnValue=false;
  }
}

if(userDATOS.verificar(1)) {
  const pyrusSeccion = new Pyrus("seccion",false);
  const pyrusNoticia = new Pyrus("noticia",false);
  const pyrusNoticias = new Pyrus("noticias",false);
  const pyrusNoticiasActor = new Pyrus("noticiasactor",false);
  const pyrusNoticiasCliente = new Pyrus("noticiascliente",false);
  const pyrusNoticiasInstitucion = new Pyrus("noticiasinstitucion",false);
  const pyrusNoticiasProceso = new Pyrus("noticiasproceso",false);
  const pyrusInstitucion = new Pyrus("attr_institucion",false);
  const pyrusCliente = new Pyrus("cliente",false);
  const pyrusActor = new Pyrus("actor",false);
  const pyrusUsuario = new Pyrus("usuario",false);
  const pyrusUsuarioNivel = new Pyrus("usuario_nivel",false);
  const pyrusAlarma = new Pyrus("alarma",false);
  const pyrusMedioDestaque = new Pyrus("medio_destaque",false);
  const pyrusPeriodista = new Pyrus("periodista",false);
  const pyrusTemas = new Pyrus("attr_temas",false);
  const pyrusCalificacion = new Pyrus("calificacion",false);
  const pyrusMedio = new Pyrus("medio",false);
  const pyrusAlianza = new Pyrus("attr_alianza",false);
  const pyrusCampo = new Pyrus("attr_campo",false);
  const pyrusCargo = new Pyrus("attr_cargo",false);
  const pyrusNivel = new Pyrus("attr_nivel",false);
  const pyrusPartido = new Pyrus("attr_partido",false);
  const pyrusPoder = new Pyrus("attr_poder",false);
  const pyrusDestaque = new Pyrus("attr_destaque",false);

  window.user = userDATOS.user();
  userDATOS.verificarNotificacion();

  if(window.usuario === undefined) {
    uu = pyrusUsuarioNivel.busqueda("nivel",window.user["nivel"]);
    window.usuario = userDATOS.parseJSON(uu.data);
    window.usuario["nivel"] = window.user["nivel"];
    window.usuario["tipo"] = uu.nombre

    if(window.usuario.vistasDESACTIVADAS !== null) {
      for(var i in window.usuario.vistasDESACTIVADAS) {
        if(window.usuario.vistasACTIVAS[window.usuario.vistasDESACTIVADAS[i]] === undefined)
          window.usuario.vistasACTIVAS[window.usuario.vistasDESACTIVADAS[i]] = "none.html";
        if(window.usuario.controller[window.usuario.vistasDESACTIVADAS[i]] === undefined)
          window.usuario.controller[window.usuario.vistasDESACTIVADAS[i]] = "none";
        $("*[data-vista='" + window.usuario.vistasDESACTIVADAS[i] + "']").remove();
      }
    }
    if(window.usuario["nivel"] == 4) $(".notificacion_anterior").remove();
    // if(window.usuario["nivel"] > 2) $("*[data-vista='informe']").remove();
  }
  $("#user-log").text(user["user"])
  app = angular.module('simat-app',[,'ngRoute','ngSanitize']);

  app.service('service_simat', function() {
    this.noticias = function($scope) {
      $scope.noticias = null;
      userDATOS.noticiasVALOR(function(d) {
        $scope.noticias = d;
      });
    }
  })

  app.factory('factory_simat',function($timeout) {
    return({
      load:load
    })

    function load(action) {
      $timeout( eval(action), 0 );
    }

    function noticias() {
      //let datos = ARR_datos.filter(function(x) { return x["moderado"] == relevado; });
      userDATOS.dataTableNOTICIAS("#t_data")//TODAS las noticias
    }
    function noticias2() {// relevar
      userDATOS.dataTableNOTICIAS2("#t_data")
    }
    function noticias3() {// a procesar
      userDATOS.dataTableNOTICIAS("#t_data",{"moderado":1})
    }
    function noticias4() {// procesadas
      userDATOS.dataTableNOTICIAS3("#t_data",{"estado":2})
    }
    function clipping() {// procesadas
      userDATOS.dataTableNOTICIAS4("#t_data");
    }

    function medio_destaque() {
      userDATOS.listador("#medio_destaque",pyrusMedioDestaque,true,2);
    }
    function periodista() {
      userDATOS.listador("#periodista",pyrusPeriodista,true,4);
    }
    function seccion() {
      userDATOS.listador("#seccion",pyrusSeccion,true,5);
    }
    function attr_temas() {
      userDATOS.listador("#attr_temas",pyrusTemas,true,6);
    }
    function attr_calificacion() {
      userDATOS.listador("#attr_calificacion",pyrusCalificacion,true,7);
    }
    function medio() {
      userDATOS.listador("#medio",pyrusMedio,true,8);
    }
    function attr_alianza() {
      userDATOS.listador("#attr_alianza",pyrusAlianza,true,9);
    }
    function attr_campo() {
      userDATOS.listador("#attr_campo",pyrusCampo,true,10);
    }
    function attr_cargo() {
      userDATOS.listador("#attr_cargo",pyrusCargo,true,11);
    }
    function attr_nivel() {
      userDATOS.listador("#attr_nivel",pyrusNivel,true,12);
    }
    function attr_partido() {
      userDATOS.listador("#attr_partido",pyrusPartido,true,13);
    }
    function attr_poder() {
      userDATOS.listador("#attr_poder",pyrusPoder,true,14);
    }
  });
  /** Rutas de la aplicación */
  app.config( function($routeProvider) {
    $routeProvider
    .when('/', {
      templateUrl: 'assets/views/' + window.usuario.vistasACTIVAS.noticias,
      controller : window.usuario.controller.noticias
    })
    // .when('/extractores', {
    //   templateUrl: 'assets/views/' + window.usuario.vistasACTIVAS.extractores,
    //   controller : window.usuario.controller.extractores
    // })
    .when('/relevo', {
      templateUrl: 'assets/views/' + window.usuario.vistasACTIVAS.relevo,
      controller : window.usuario.controller.relevo
    })
    .when('/procesar', {
      templateUrl: 'assets/views/' + window.usuario.vistasACTIVAS.procesar,
      controller : window.usuario.controller.procesar
    })
    .when('/actores', {
      templateUrl: 'assets/views/' + window.usuario.vistasACTIVAS.actores,
      controller : window.usuario.controller.actores
    })
    .when('/clientes', {
      templateUrl: 'assets/views/' + window.usuario.vistasACTIVAS.clientes,
      controller : window.usuario.controller.clientes
    })
    .when('/ajustes', {
      templateUrl: 'assets/views/' + window.usuario.vistasACTIVAS.ajustes,
      controller : window.usuario.controller.ajustes
    })
    .when('/usuarios', {
      templateUrl: 'assets/views/' + window.usuario.vistasACTIVAS.usuarios,
      controller : window.usuario.controller.usuarios
    })
    .when('/alertas', {
      templateUrl: 'assets/views/' + window.usuario.vistasACTIVAS.alertas,
      controller : window.usuario.controller.alertas
    })
    .when('/procesadas', {
      templateUrl: 'assets/views/' + window.usuario.vistasACTIVAS.procesadas,
      controller : window.usuario.controller.procesadas
    })
    .when('/instituciones', {
      templateUrl: 'assets/views/' + window.usuario.vistasACTIVAS.instituciones,
      controller : window.usuario.controller.instituciones
    })
    .when('/eliminado', {
      templateUrl: 'assets/views/' + window.usuario.vistasACTIVAS.eliminado,
      controller : window.usuario.controller.eliminado
    })
    .when('/notificaciones', {
      templateUrl: 'assets/views/' + window.usuario.vistasACTIVAS.notificaciones,
      controller : window.usuario.controller.notificaciones
    })
    .when('/informes', {
      templateUrl: 'assets/views/' + window.usuario.vistasACTIVAS.informes,
      controller : window.usuario.controller.informes
    })
    .when('/clipping', {
      templateUrl: 'assets/views/clipping.html',
      controller : 'clipping'
    })
  });
  /**
   * Carga principal de la aplicación
   */
  app.controller('jsonController', ['$scope', '$http', '$timeout', '$location', 'service_simat', 'factory_simat', function($scope, $http, $timeout, $location, service_simat, factory_simat) {
    h = $("#ul_nav_header").prev().outerHeight();
    $("#ul_nav_header").css({marginTop:h});
    $scope.isViewLoading = false;
    $scope.$on('$routeChangeStart', function() {
      $scope.isViewLoading = true;
      $("#clipping").removeClass("d-none");
    });
    $scope.$on('$routeChangeSuccess', function() {
      $scope.isViewLoading = false;
    });
    $scope.$on('$routeChangeError', function() {
      $scope.isViewLoading = false;
    });
    $scope.$on('$viewContentLoaded', function(){
      $(function () {
        $('[data-toggle="tooltip"]').tooltip()
      });
    });
    //////
    /** Búsqueda de última hora de extracción */
    let ext = userDATOS.busquedaExtraccion();
    $("*[data-vista='extractores'] span").html('<i class="far fa-clock mr-1"></i>' + dates.string(new Date(ext.fecha), 0));

    $scope.notificaciones = {}
    $scope.notificacionTOTAL = 0;

    $scope.tipo_user = window.usuario["tipo"];
    $scope.acceso = (window.user.last === null ? "Sin registro" : dates.string(new Date(window.user.last),0));

    userDATOS.eliminarNoticiaMODAL = function() {
      $.MessageBox({
        buttonDone  : strings.btn.si,
        buttonFail  : strings.btn.no,
        message   : strings.noticia.eliminar[0]
      }).done(function(){
        userDATOS.change(window.noticiaNUEVA.id,"noticia","elim",1);
        userDATOS.change(window.noticiaNUEVA.id_noticia,"noticias","elim",2);//para que lo agarre el EventSource
        userDATOS.change(window.notificacionNUEVA,"notificacion","id_usuario",window.user_id,0,true)
        userDATOS.change(window.notificacionNUEVA,"notificacion","eliminado",1,0,true)
        userDATOS.log(window.user_id,"Notificación abierta y noticia eliminada",0,window.notificacionNUEVA,"notificacion");
        userDATOS.log(window.user_id,"Baja de registro",0,id,"noticias",1);
        $("#modalNoticia").modal("hide")
        window.noticiaNUEVA = undefined;
        window.notificacionNUEVA = undefined;//ID
      });
    }

    $scope.noticiasNUMEROS = function($scope) {
      $scope.$apply(function () {
        $scope.noticias = null;
        userDATOS.noticiasVALOR(function(d) {
          $scope.noticias = d;
        });
      });
    }
    /** Función para la baja lógica de noticia */
    $scope.eliminarNoticia = function() {
      $.MessageBox({
        buttonDone  : strings.btn.si,
        buttonFail  : strings.btn.no,
        message   : strings.noticia.eliminar[0]
      }).done(function(){
        userDATOS.change(window.noticiaNUEVA.id,"noticia","elim",1,0,true);
        userDATOS.change(window.noticiaNUEVA.id_noticia,"noticias","elim",2,0,true);
        userDATOS.change(window.notificacionNUEVA,"notificacion","id_usuario",window.user_id,0,true);
        userDATOS.change(window.notificacionNUEVA,"notificacion","eliminado",1,0,true);
        userDATOS.log(window.user_id,"Notificación abierta y noticia eliminada",0,window.notificacionNUEVA,"notificacion");
        //userDATOS.change = function(id, tabla, column, value, massive = 0, asy = false) {
        userDATOS.log(window.user_id,"Baja de registro nuevo",0,window.noticiaNUEVA.id,"noticia",1);
        userDATOS.log(window.user_id,"Baja de registro nuevo",0,window.noticiaNUEVA.id_noticia,"noticias",1);

        $("#modalNoticia").modal("hide");

        $scope.noticiasNUMEROS(angular.element("#menu_noticias").scope());
        $('*[data-vista="notificacion"][data-toggle="dropdown"]').find("*[data-id='" + window.notificacionNUEVA + "']").removeClass("bg-white");
        $('*[data-vista="notificacion"][data-toggle="dropdown"]').find("*[data-id='" + window.notificacionNUEVA + "']").addClass("bg-danger text-white");
        $('*[data-vista="notificacion"][data-toggle="dropdown"]').find("*[data-id='" + window.notificacionNUEVA + "']").find("p:nth-child(3)").html("<strong class='mr-1'>Estado:</strong>ELIMINADO");
        window.noticiaNUEVA = undefined;
        window.notificacionNUEVA = undefined;//ID
      })
    }
    /** Función para procesar una noticia */
    $scope.procesarNoticia = function() {
      $.MessageBox({
        buttonDone  : strings.btn.si,
        buttonFail  : strings.btn.no,
        message   : strings.noticia.relevar
      }).done(function(){
        userDATOS.change(window.noticiaNUEVA.id,"noticia","relevado",1,0,true);
        userDATOS.change(window.noticiaNUEVA.id_noticia,"noticias","moderado",2,0,true);//para que lo agarre el EventSource
        userDATOS.change(window.noticiaNUEVA.id_noticia,"noticias","id_notificacion",window.notificacionNUEVA,0,true);
        userDATOS.change(window.notificacionNUEVA,"notificacion","id_usuario",window.user_id,0,true);
        userDATOS.change(window.notificacionNUEVA,"notificacion","procesar",1,0,true);
        userDATOS.log(window.user_id,"Notificación abierta y noticia nueva relevada",0,window.notificacionNUEVA,"notificacion");
        //userDATOS.change = function(id, tabla, column, value, massive = 0, asy = false) {
        userDATOS.log(window.user_id,"Relevo de registro nuevo",0,window.noticiaNUEVA.id,"noticia");
        userDATOS.log(window.user_id,"Relevo de registro nuevo",0,window.noticiaNUEVA.id_noticia,"noticias");

        let new_r = new Pyrus("noticiarelevo",false);
        let nr = new_r.objetoLimpio();
        nr["did_noticia"] = window.noticiaNUEVA.id;
        nr["id_noticia"] = window.noticiaNUEVA.id_noticia;
        nr["id_usuario"] = window.user_id;
        nr["id_cliente"] = 0;
        new_r.guardar_1(nr);
        $scope.noticiasNUMEROS(angular.element("#menu_noticias").scope());
        $('*[data-vista="notificacion"][data-toggle="dropdown"]').find("*[data-id='" + window.notificacionNUEVA + "']").removeClass("bg-white");
        $('*[data-vista="notificacion"][data-toggle="dropdown"]').find("*[data-id='" + window.notificacionNUEVA + "']").addClass("bg-warning");
        $('*[data-vista="notificacion"][data-toggle="dropdown"]').find("*[data-id='" + window.notificacionNUEVA + "']").find("p:nth-child(3)").html("<strong class=\"mr-1\">Estado:</strong>RELEVADO");
        $("#modalNoticia").modal("hide")
        window.noticiaNUEVA = undefined;
        window.notificacionNUEVA = undefined;//ID
      });
    }
    /**
     *
     */
    $scope.pasarNoticia = function() {
      let osai_usuario = null;
      userDATOS.busqueda({"value":window.notificacionOBJ.id_cliente,"tabla":"osai_usuario","column":"id_cliente"}, function(d) {
        osai_usuario = d;
      });
      let cliente = null;
      userDATOS.busqueda({"value":window.notificacionOBJ.id_cliente,"tabla":"cliente"}, function(d) {
        cliente = d;
      });

      if(osai_usuario === null) {
        userDATOS.notificacion(strings.noClienteFinal(cliente.nombre),"error",false);
        return false;
      }
      
      clientes_osai = null;
      userDATOS.busquedaTabla("osai_usuario", function(d) {
        clientes_osai = d;
      });//CLIENTES FINALES
      let defaultValue = null;
      let OBJ_clientes_osai = {};//CLIENTES FINALES <-- relacionado con --> UNIDAD DE ANALISIS
      for(var i in clientes_osai) {
        if(OBJ_clientes_osai[i] === undefined) {  
          OBJ_clientes_osai[i] = "";
          u = null;
          userDATOS.busqueda({"value":clientes_osai[i]["id_cliente"],"tabla":"cliente"}, function(d) {
            u = d; 
          });
          if(clientes_osai[i]["id_cliente"] == cliente.id)
            defaultValue = i;
          OBJ_clientes_osai[i] = clientes_osai[i]["user"] + " (" + u["nombre"] + ")";
        }
      }
      //////////
      $.MessageBox({
        buttonDone  : strings.btn.pasar,
        buttonFail  : strings.btn.cancelar,
        message : strings.messege.pasar,
        // input: select,
        input   : { 
          input_detalle  : {
            type         : "texts",
            label        : "Detalle (máx. 200 caracteres):",
            title        : "Detalle de la notificación",
            maxlength    : 200
          },
          select_tipoAlerta : {
            type         : "select",
            label        : "Seleccione tipo de alerta",
            title        : "TIPO DE ALERTA",
            options      : {1: "Amarilla", 2: "Naranja", 3: "Rojo"}
          },
          select_tipo : {
            type         : "selects",
            label        : "Seleccione Cliente final",
            title        : "cliente final",
            options      : OBJ_clientes_osai,
            default      : 3
          },
        },
        top     : "auto",
        filterDone      : function(data){
          if(data.input_detalle == "" || data.select_tipoAlerta === null || data.select_tipo.length == 0) {
            userDATOS.notificacion(strings.faltan.datos,"error")
            return false;
          }
        }
      }).done(function(data){
        userDATOS.notificacion(strings.noticia.pasada);
        $("#modalNoticia .btn-success,#modalNoticia .btn-danger").addClass("d-none");
        for(var x in data.select_tipo) {
          nivel = data.select_tipoAlerta;
          mensaje = data.input_detalle;
          id_usuario = window.user_id;//USUARIO de OSAI que generó esto
          id_cliente = window.notificacionOBJ.id_cliente;//CLIENTE de OSAI
          id_usuario_osai = data.select_tipo[x];//USUARIO de CLIENTE FINAL de OSAI
          id_noticia = window.notificacionOBJ.id_noticia;//NOTICIA afectada
          userDATOS.insertDatos("osai_notificacion",{"id_usuario":id_usuario,"id_noticia":id_noticia,"id_usuario_osai":id_usuario_osai,"mensaje": mensaje,"nivel": nivel,"estado": 1});
        }
        userDATOS.log(window.user_id,"Notificación pasada directamente al CLIENTE",0,window.noticiaNUEVA.id,"noticia");
        userDATOS.log(window.user_id,"Notificación pasada directamente al CLIENTE",0,window.noticiaNUEVA.id_noticia,"noticias");
        userDATOS.change(window.notificacionNUEVA,"notificacion","id_usuario",window.user_id,0,true);
        userDATOS.change(window.notificacionNUEVA,"notificacion","pasado",1,0,true);
        userDATOS.change(window.notificacionUsuario,"notificacion_usuario","pasado",1,0,true);
      })
    }
    /**
     * FUNCIÓN DESTINADA PARA VER LA NOTIFICACIÓN DE UNA NOTICIA NUEVA
     * EN DONDE UN CLIENTE O ALARMA SON NOMBRADOS
     */
    $scope.verNoticiaNueva = function(id) {
      try {
        let o = null;
        userDATOS.busquedaAlerta({"id":id}, function(d) {
          o = d;
        });//Retorna NOTICIA/
        window.noticiaNUEVA = o;
        window.notificacionNUEVA = id;
        if($scope.notificaciones[id]["leido"] == undefined) {
          window.notificacionOBJ = null;
          userDATOS.busqueda({"value":id,"tabla":"notificacion"}, function(d) {
            window.notificacionOBJ = d;
          });
          $scope.notificaciones[id]["leido"] = 1;
          $scope.notificacionTOTAL --;
          // scopeNoticias(angular.element("*[ng-controller=\"jsonController\"]").scope(),id,"leido","estado");
        }
        html = o.cuerpo;
        var SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
        while (SCRIPT_REGEX.test(html))
            html = html.replace(SCRIPT_REGEX, "");
        $("#modalNoticia").find(".modal-notificacion").html("<p class='m-0'>" + window.notificacionOBJ.mensaje + "<span class='badge badge-warning mx-2'>alerta</span><span onclick='userDATOS.mostrarAtributos(this)' class='text-uppercase cursor-pointer'>[ver atributos]</span></p>");
        $("#modalNoticia").find(".modal-title").html(o.titulo);
        $("#modalNoticia").find(".modal-body").html(html);
        $("#modalNoticia").modal("show");
      }
      catch (e) {
        userDATOS.notificacion(strings.error.parseo,"warning",false);
      }
    }
    // REVISAR
    $scope.eliminar = function() {
      let noticia = tabla_noticia.rows( { selected: true } ).data()[0]
      $.MessageBox({
        buttonDone  : strings.btn.si,
        buttonFail  : strings.btn.no,
        message   : strings.noticia.eliminar[1]
      }).done(function(){
        userDATOS.change(noticia.id,"noticia","elim",1,);
        userDATOS.change(noticia.id_noticia,"noticias","elim",1);
        userDATOS.log(window.user_id,"Baja de registro",0,noticia.id,"noticia",1);
        userDATOS.log(window.user_id,"Baja de registro",0,noticia.id_noticia,"noticias",1);

        tabla_noticia.row(".selected").remove().draw();
        userDATOS.pantalla_cerrarSIMPLE();
        userDATOS.notificacion(strings.noticia.desechada,"success");
      });
    }
    /**
     * GUARDAR proceso de noticia
     */
    $scope.procesar = function(reprocesar = 0) {
      flag_variables = true;
      let msj_err = "";

      if(window.noticiaSELECCIONADA !== undefined) {//Noticia existente
        if($("#select_medio").val() == "") {
          $("#select_medio").addClass("has-error")
          $("#select_medio").select2();
          msj_err += "Medio ";
          flag_variables = false;
        }
        if($("#select_destaque").val() == "") {
          $("#select_destaque").addClass("has-error")
          $("#select_destaque").select2();
          if(msj_err != "") msj_err += " / ";
          msj_err += "Destaque";
          flag_variables = false;
        }
        if(window.ARR_cliente !== undefined) {
          if(Object.keys(window.ARR_cliente).length == 0) {
            if(msj_err != "") msj_err += " / ";
            msj_err += "Unidad de análisis"
            flag_variables = false;
          } else flag_variables = true;
        } else {
          if(msj_err != "") msj_err += " / ";
          msj_err += "Unidad de análisis"
          flag_variables = false;
        }
      } else {
        if($("#frm_titulo").text() == "") {
          $("#frm_titulo").addClass("has-error")
          msj_err += "Título";
          flag_variables = false;
        }
        if($("*[name='frm_fecha']").val() == "") {
          $("*[name='frm_fecha']").addClass("has-error");
          if(msj_err != "") msj_err += " / ";
          msj_err += "Fecha";
          flag_variables = false;
        }
        if($("#select_medio").val() == "") {
          $("#select_medio").addClass("has-error")
          $("#select_medio").select2();
          if(msj_err != "") msj_err += " / ";
          msj_err += "Medio";
          flag_variables = false;
        }
        if($("#select_destaque").val() == "") {
          $("#select_destaque").addClass("has-error")
          $("#select_destaque").select2();
          if(msj_err != "") msj_err += " / ";
          msj_err += "Destaque";
          flag_variables = false;
        }
        if(window.ARR_cliente !== undefined) {
          if(Object.keys(window.ARR_cliente).length == 0) {
            if(msj_err != "") msj_err += " / ";
            msj_err += "Unidad de análisis"
            flag_variables = false;
          } else flag_variables = true;
        } else {
          if(msj_err != "") msj_err += " / ";
          msj_err += "Unidad de análisis"
          flag_variables = false;
        }
      }
      if(window.noticiaSELECCIONADA === undefined) {//NUEVA noticia
        if(flag_variables) {
          $.MessageBox({
            buttonDone  : "Si",
            buttonFail  : "No",
            message   : "¿Está seguro de guardar y procesar la noticia?"
          }).done(function(){
            let OBJ_data = {}
            let OBJ_noticia = {}
            let n_proceso = new Pyrus("proceso",false);
            let obj_proceso = n_proceso.objetoLimpio();

            // GUARDO en tabla noticias
            OBJ_noticia["id"] = "nulo";
            OBJ_noticia["estado"] = "2";
            OBJ_noticia["moderado"] = "1";
            OBJ_noticia["titulo"] = $("#frm_titulo").text();
            OBJ_noticia["url"] = $("*[name='frm_url']").val();
            fecha = $("*[name='frm_fecha']").val();
            if(fecha == "") fecha = dates.string(new Date(), 1, "aaaammdd");
            else fecha = fecha.replace("T"," ");
            OBJ_noticia["fecha"] = fecha;
            OBJ_noticia["data"] = {};
            OBJ_noticia["data"]["titulo"] = $("#frm_titulo").text();
            if($("#frm_subtitulo").text() != "") OBJ_noticia["data"]["bajada"] = $("#frm_subtitulo").text();
            OBJ_noticia["data"]["fecha"] = fecha
            OBJ_noticia["data"]["autor"] = $("#select_periodista option[value='" + select_periodista.value + "']").text();
            OBJ_noticia["data"]["cuerpo"] = (window.cuerpoPEGADO === undefined ? $(".note-editable").html() : window.cuerpoPEGADO);
            OBJ_noticia["data"]["categoria"] = pyrusSeccion.mostrar_1(select_seccion.value);
            accion = pyrusNoticias.guardar_1(OBJ_noticia);
            userDATOS.log(window.user_id,"Alta base de registro",0,accion.id,"noticias");
            // GUARDO en tabla noticia
            cuerpo = $(".note-editable").html();
            OBJ_noticia = {}
            OBJ_noticia["id"] = "nulo";
            OBJ_noticia["id_noticia"] = accion.id;
            OBJ_noticia["id_medio"] = select_medio.value;
            OBJ_noticia["id_medio_tipo"] = select_medioTipo.value;
            OBJ_noticia["id_seccion"] = select_seccion.value;
            OBJ_noticia["estado"] = "2";
            OBJ_noticia["relevado"] = "1";
            OBJ_noticia["nueva"] = "0";
            OBJ_noticia["fecha"] = fecha;
            OBJ_noticia["url"] = $("*[name='frm_url']").val();
            OBJ_noticia["video"] = $("#video_noticia input").val();
            OBJ_noticia["titulo"] = $("#frm_titulo").text();
            OBJ_noticia["cuerpo"] = cuerpo;
            accion_not = pyrusNoticia.guardar_1(OBJ_noticia);
            userDATOS.log(window.user_id,"Alta de registro y proceso",0,accion.id,"noticia");
            //

            OBJ_data["select_medioTipo"] = select_medioTipo.value;
            OBJ_data["select_destaque"] = select_destaque.value;
            np = new Pyrus("noticiaperiodista",false);
            o = np.objetoLimpio();
            o["id_periodista"] = select_periodista.value;
            o["id_noticia"] = accion.id;
            np.guardar_1(o);

            OBJ_data["noticiaATTR"] = [];
            for(var i in window.ARR_atributos) {
              if(OBJ_data["noticiaATTR"].indexOf(i) < 0)
                OBJ_data["noticiaATTR"].push(i);//ATRIBUTOS asociados a la noticia
            }

            for(var i in window.ARR_actor)//ACTORES mencionados en la noticia
              pyrusNoticiasActor.guardar_1({"id":"nulo","id_noticia": accion.id,"id_actor": i,"data": window.ARR_actor[i]})
            for(var i in window.ARR_cliente) {//
              pyrusNoticiasCliente.guardar_1({"id":"nulo","id_noticia": accion.id,"id_cliente": i,"valoracion": JSON.stringify(window.ARR_cliente[i]["valoracion"]),"tema": JSON.stringify(window.ARR_cliente[i]["tema"])})
              //proceso
              obj_proceso["id_noticia"] = accion.id;
              obj_proceso["did_noticia"] = accion_not.id;
              obj_proceso["id_usuario"] = window.user_id;
              obj_proceso["id_cliente"] = i;
              obj_proceso["cuerpo_noticia"] = cuerpo;
              accion_pro = n_proceso.guardar_1(obj_proceso);
              userDATOS.log(window.user_id,"Alta de proceso",0,accion_pro.id,"proceso");
            }
            for(var i in window.ARR_institucion)//INSTITUCIONES mencionados en la noticia
              pyrusNoticiasInstitucion.guardar_1({"id":"nulo","id_noticia": accion.id,"id_institucion": i,"data": window.ARR_institucion[i]})

            pyrusNoticiasProceso.guardar_1({"id":"nulo","id_noticia": accion.id,"id_usuario":window.user_id,"data": OBJ_data});
            // LIMPIO VARIABLES
            window.cuerpoPEGADO = undefined;
            userDATOS.pantalla_OFF();
            userDATOS.notificacion("Noticia guardada y procesada","success");
            scopeNoticias(angular.element($("#menu_noticias")).scope(),"total",1);
            scopeNoticias(angular.element($("#menu_noticias")).scope(),"procesadas",1);
          }).fail(function(){});
        } else userDATOS.notificacion("<p class='m-0'><strong>Faltan datos</strong></p><p class='m-0'>" + msj_err+ "</p>","error");
      } else {
        let periodista = null;
        userDATOS.busquedaPeriodista(window.noticiaSELECCIONADA.id_noticia, function(d) {
          periodista = d;
        });
        if(flag_variables) {
          $.MessageBox({
            buttonDone  : strings.btn.si,
            buttonFail  : strings.btn.no,
            message   : strings.noticia.procesar[2]((reprocesar ? strings.noticia.procesar[0] : strings.noticia.procesar[1]))
          }).done(function(){//
            let n_proceso = new Pyrus("proceso",false);
            let obj_proceso = n_proceso.objetoLimpio();
            let OBJ_data = {}
            userDATOS.change(noticiaSELECCIONADA.id,"noticia","estado",2);//CAMBIO estado
            let cuerpo = $(".note-editable").html();//guardo cuerpo de noticias con ETIQUETAS
            if(reprocesar) {
              let noticiaproceso = userDATOS.busqueda({"value":window.noticiaSELECCIONADA.id_noticia,"tabla":"noticiasproceso","column":"id_noticia"}, function(d) {
                noticiaproceso = d;
              });
              let ARR_proceso = userDATOS.busqueda({"value":window.noticiaSELECCIONADA.id_noticia,"tabla":"proceso","column":"id_noticia","retorno":0}, function(d) {
                ARR_proceso = d;
              });
              let ARR_actores = userDATOS.busqueda({"value":window.noticiaSELECCIONADA.id_noticia,"tabla":"noticiasactor","column":"id_noticia","retorno":0}, function(d) {
                ARR_actores = d;
              });
              let ARR_clientes = userDATOS.busqueda({"value":window.noticiaSELECCIONADA.id_noticia,"tabla":"noticiascliente","column":"id_noticia","retorno":0}, function(d) {
                ARR_clientes = d;
              });
              let ARR_instituciones = userDATOS.busqueda({"value":window.noticiaSELECCIONADA.id_noticia,"tabla":"noticiasinstitucion","column":"id_noticia","retorno":0}, function(d) {
                ARR_instituciones = d;
              });
              let procesoDATA = userDATOS.parseJSON(noticiaproceso.data);
              let did = parseInt(window.noticiaSELECCIONADA.did) + 1;//Identificador de elementos en tablas con registros múltiples
              userDATOS.change(window.noticiaSELECCIONADA.id,"noticia","did",did);

              userDATOS.log(window.user_id,"Reproceso de elemento",0,window.noticiaSELECCIONADA.id_noticia,"noticias",1);
              userDATOS.log(window.user_id,"Reproceso de elemento",0,window.noticiaSELECCIONADA.id,"noticia",1);
              for(var i in ARR_proceso)
                userDATOS.change(i,"proceso","elim","1");
              if(noticiaproceso !== null)
                userDATOS.change(noticiaproceso.id,"noticiasproceso","elim","1");
              for(var i in ARR_actores)
                userDATOS.change(i,"noticiasactor","elim","1");
              for(var i in ARR_clientes)
                userDATOS.change(i,"noticiascliente","elim","1");
              for(var i in ARR_instituciones)
                userDATOS.change(i,"noticiasinstitucion","elim","1");
              //
              procesoDATA["select_medioTipo"] = select_medioTipo.value;
              procesoDATA["select_destaque"] = select_destaque.value;
              procesoDATA["noticiaATTR"] = [];
              for(var i in window.ARR_atributos) {
                if(procesoDATA["noticiaATTR"].indexOf(i) < 0)
                  procesoDATA["noticiaATTR"].push(i);//ATRIBUTOS asociados a la noticia
              }
              if($("#select_periodista").is(":visible")) {
                if(periodista !== null) userDATOS.change(periodista.id_notp,"noticiaperiodista","elim",1);
                np = new Pyrus("noticiaperiodista",false);
                o = np.objetoLimpio();
                o["did"] = did;
                o["id_periodista"] = select_periodista.value;
                o["id_noticia"] = window.noticiaSELECCIONADA.id_noticia;
                np.guardar_1(o);
              }
              if($("#select_seccion").is(":visible"))
                userDATOS.change(window.noticiaSELECCIONADA.id,"noticia","id_seccion",select_seccion.value);

              pyrusNoticiasProceso.guardar_1({"id":"nulo","did":did,"id_noticia": window.noticiaSELECCIONADA.id_noticia,"id_usuario":window.user_id,"data": procesoDATA});
              for(var i in window.ARR_actor)//ACTORES mencionados en la noticia
                pyrusNoticiasActor.guardar_1({"id":"nulo","did":did,"id_noticia": window.noticiaSELECCIONADA.id_noticia,"id_actor": i,"data": window.ARR_actor[i]})
              for(var i in window.ARR_cliente) {
                pyrusNoticiasCliente.guardar_1({"id":"nulo","did":did,"id_noticia": window.noticiaSELECCIONADA.id_noticia,"id_cliente": i,"valoracion": JSON.stringify(window.ARR_cliente[i]["valoracion"]),"tema": JSON.stringify(window.ARR_cliente[i]["tema"])})
                //proceso
                obj_proceso["did"] = did;
                obj_proceso["id_noticia"] = window.noticiaSELECCIONADA.id_noticia;
                obj_proceso["did_noticia"] = window.noticiaSELECCIONADA.id;
                obj_proceso["id_usuario"] = window.user_id;
                obj_proceso["id_cliente"] = i;
                obj_proceso["cuerpo_noticia"] = cuerpo;
                accion = n_proceso.guardar_1(obj_proceso);
                userDATOS.log(window.user_id,"Alta de proceso",0,accion.id,"proceso");
              }
              for(var i in window.ARR_institucion)//INSTITUCIONES mencionados en la noticia
                pyrusNoticiasInstitucion.guardar_1({"id":"nulo","did":did,"id_noticia": window.noticiaSELECCIONADA.id_noticia,"id_institucion": i,"data": window.ARR_institucion[i]})
              //
              if($("#video_noticia input").val() != "") userDATOS.change(window.noticiaSELECCIONADA.id,"noticia","video",$("#video_noticia input").val());
              userDATOS.pantalla_OFF();
              userDATOS.notificacion("Noticia reprocesada","success");
            } else {
              OBJ_data["select_medioTipo"] = select_medioTipo.value;
              OBJ_data["select_destaque"] = select_destaque.value;
              if($("#select_periodista").is(":visible")) {
                if(periodista !== null)
                  userDATOS.change(periodista.id_notp,"noticiaperiodista","id_periodista",select_periodista.value);
              }
              if($("#select_seccion").is(":visible")) {
                userDATOS.change(window.noticiaSELECCIONADA.id,"noticia","id_seccion",select_seccion.value);
              }
              OBJ_data["noticiaATTR"] = [];

              // ID de tabla noticia
              userDATOS.change(window.noticiaSELECCIONADA.id,"noticia","estado",2);
              userDATOS.change(window.noticiaSELECCIONADA.id_noticia,"noticias","estado",2);

              for(var i in window.ARR_atributos) {
                if(OBJ_data["noticiaATTR"].indexOf(i) < 0)
                  OBJ_data["noticiaATTR"].push(i);//ATRIBUTOS asociados a la noticia
              }
              pyrusNoticiasProceso.guardar_1({"id":"nulo","id_noticia": window.noticiaSELECCIONADA.id_noticia,"id_usuario":window.user_id,"data": OBJ_data});
              for(var i in window.ARR_actor)//ACTORES mencionados en la noticia
                pyrusNoticiasActor.guardar_1({"id":"nulo","id_noticia": window.noticiaSELECCIONADA.id_noticia,"id_actor": i,"data": window.ARR_actor[i]})
              id_cliente = 0;
              for(var i in window.ARR_cliente) {
                pyrusNoticiasCliente.guardar_1({"id":"nulo","id_noticia": window.noticiaSELECCIONADA.id_noticia,"id_cliente": i,"valoracion": JSON.stringify(window.ARR_cliente[i]["valoracion"]),"tema": JSON.stringify(window.ARR_cliente[i]["tema"])})
                //proceso
                obj_proceso["id_noticia"] = window.noticiaSELECCIONADA.id_noticia;
                obj_proceso["did_noticia"] = window.noticiaSELECCIONADA.id;
                obj_proceso["id_usuario"] = window.user_id;
                obj_proceso["id_cliente"] = i;
                obj_proceso["cuerpo_noticia"] = cuerpo;
                accion = n_proceso.guardar_1(obj_proceso);
                userDATOS.log(window.user_id,"Alta de proceso",0,accion.id,"proceso");
              }
              for(var i in window.ARR_institucion)//INSTITUCIONES mencionados en la noticia
                pyrusNoticiasInstitucion.guardar_1({"id":"nulo","id_noticia": window.noticiaSELECCIONADA.id_noticia,"id_institucion": i,"data": window.ARR_institucion[i]})
              //
              if($("#video_noticia input").val() != "") userDATOS.change(window.noticiaSELECCIONADA.id,"noticia","video",$("#video_noticia input").val());
              userDATOS.log(window.user_id,"Cambio de estado",0,window.noticiaSELECCIONADA.id,"noticia");
              userDATOS.log(window.user_id,"Cambio de estado",0,window.noticiaSELECCIONADA.id_noticia,"noticias");
              // LIMPIO VARIABLES
              tabla_noticia.rows(".selected").remove().draw();
              userDATOS.pantalla_OFF();
              userDATOS.notificacion("Noticia procesada","success");
              scopeNoticias(angular.element($("#menu_noticias")).scope(),"relevo",-1);
              scopeNoticias(angular.element($("#menu_noticias")).scope(),"procesar",-1);
              scopeNoticias(angular.element($("#menu_noticias")).scope(),"procesadas",1);
            }
          }).fail(function(){});
        } else userDATOS.notificacion(strings.faltan.datosMssg(msj_err),"error");
      }
    }

    /**
     * CAMBIA ESTADOS DEL OBJETO DE NOTIFICACIONES
     * LEIDO O NO - SIRVE PARA ACTUALIZAR LA VISTA
     */
    scopeNoticias = function($scope,key,value,tipo = "cantidad") {
      $scope.$apply(function () {
        if(tipo == "cantidad") {
        	$scope.noticias[key] = parseInt($scope.noticias[key]) + parseInt(value);
        } else if(tipo == "estado") {

        }
      });
    }
  }]);
  /**
   * Acceso a un area no autorizada
   */
  app.controller("none", function ($scope,factory_simat) {
    window.location = "http://93.188.164.27/principal.html";
  });
  app.filter('reverse', function() {
    return function(items) {
      return items.slice().reverse();
    };
  });
  app.filter('objLength', function() {
     return function(object) {
       return Object.keys(object).length;
     }
  });
  /**
   * Acciones de vista INSTITUCION
   * Solo accedido por usuarios nivel 1 y 2
   */
  app.controller("institucion", function ($scope,service_simat,factory_simat) {
    $(".nav_ul a").closest("ul").find(".active").removeClass("active");
    $(".nav_ul a[data-url='institucion']").addClass("active");

    userDATOS.listador("#t_institucion",pyrusInstitucion,true);
    userDATOS.submit = function(t) {
      let e = $("#" + t.id).data("tipo");
      if(userDATOS.validar("#" + t.id)) {
        let a = pyrusInstitucion.objeto["GUARDADO_ATTR"];
        let OBJ = {}
        for(var j in a) {
          OBJ[j] = null;

          if(a[j]["TIPO"] == "nulo")
            OBJ[j] = (t["frm_" + j].value == "" ? a[j]["TIPO"] : t["frm_" + j].value);
          if(a[j]["TIPO"] == "normal") {
            if(t["frm_" + j] === undefined) continue;
            OBJ[j] = t["frm_" + j].value;
          }
          if(a[j]["TIPO"] == "array") {
            OBJ[j] = [];
            for(var x in window[a[j]["VAR"]])
              OBJ[j].push(x)
          }
        }
        $("#" + t.id).find("input","button","select").attr("disabled")

        accion = pyrusInstitucion.guardar_1(OBJ);//
        if(accion.id !== null && accion.flag) {//
          let elemento = null;
          userDATOS.busqueda({"value":accion.id,"tabla":e}, function(d) {
            elemento = d;
          });//traigo el nuevo registro

          window["tabla_0"].draw();//agrego sin recargar sitio
          if(OBJ.id == "nulo") {
            userDATOS.log(window.user_id,"Alta de registro",0,accion.id,"attr_institucion");
          } else {
            userDATOS.log(window.user_id,"Edición de registro",0,accion.id,"attr_institucion");
          }
          $("#modal").modal("hide");

        } else userDATOS.notificacion(strings.repetidoDatos,"error");
      } else userDATOS.notificacion(strings.faltan.datos,"error");
    }
  });
  /**
   * Acciones de vista CLIPPING
   * Solo accedido por usuarios nivel 1 y 2
   */
  app.controller("clipping", function ($scope,service_simat,factory_simat) {
    $(".nav_ul a").closest("ul").find(".active").removeClass("active");
    $("#clipping").addClass("d-none");

    factory_simat.load("clipping");

    selectMEDIOS = userDATOS.noticiasSELECT("clipping");

    $scope.mediosSELECT = selectMEDIOS.medio;
    $scope.unidadSELECT = selectMEDIOS.unidad;
    $(".select__2").select2();

    $("#btn_filtro").on("click",function() {
      let minDateFilter = $('#fecha_min').val();
      let maxDateFilter = $('#fecha_max').val();
      let medioFilter = $('#select_medioNOTICIA').val();
      let medioTipoFilter = $('#select_medioTipoNOTICIA').val();
      let tituloFilter = $('#titulo').val();
      let seccionFilter = $('#select_seccionBUSCADOR').val();
      let unidadFilter = $("#select_unidadNOTICIA").val();
      data = {"estado":2,"minDateFilter":minDateFilter,"maxDateFilter":maxDateFilter,"medioFilter":medioFilter,"medioTipoFilter":medioTipoFilter,"tituloFilter":tituloFilter,"seccionFilter":JSON.stringify(seccionFilter),"unidadFilter":unidadFilter}
      flag = false;
      for(var i in data) {
        if(data[i] != "") flag = true;
      }
      if(flag) {
        tabla_noticia.destroy();
        $("#t_data").addClass("animate-flicker")
        setTimeout(function() {
          userDATOS.dataTableNOTICIAS3("#t_data",data)
        },500)
      } else userDATOS.notificacion(strings.faltan.datosBuqueda,"error");
    })

    $("#btn_limpiar").on("click",function() {
      let minDateFilter = $('#fecha_min').val();
      let maxDateFilter = $('#fecha_max').val();
      let medioFilter = $('#select_medioNOTICIA').val();
      let medioTipoFilter = $('#select_medioTipoNOTICIA').val();
      let tituloFilter = $('#titulo').val();
      let seccionFilter = $('#select_seccionBUSCADOR').val();
      data = {"estado":2,"minDateFilter":minDateFilter,"maxDateFilter":maxDateFilter,"medioFilter":medioFilter,"medioTipoFilter":medioTipoFilter,"tituloFilter":tituloFilter,"seccionFilter":JSON.stringify(seccionFilter)}
      flag = false;
      for(var i in data) {
        if(data[i] != "") flag = true;
      }
      if(flag) {
        $("#fecha_min").val("");
        $("#fecha_max").val("");
        $("#titulo").val("");
        selectMEDIOS = userDATOS.noticiasSELECT("procesar");
        $("#select_medioNOTICIA").html("<option value=''></option>");
        for(var i in m.medio)
          $("#select_medioNOTICIA").append("<option value='" + i + "'>" + m.medio[i] + "</option>");

        $("#select_medioTipoNOTICIA").html("<option value=''></option>");
        for(var i in m.medio_tipo)
          $("#select_medioTipoNOTICIA").append("<option value='" + i + "'>" + m.medio_tipo[i] + "</option>");

        $("#select_seccionBUSCADOR").html("<option value=''></option>");
        for(var i in m.seccion)
          $("#select_seccionBUSCADOR").append("<option value='" + i + "'>" + m.seccion[i] + "</option>");

        $("#select_unidadNOTICIA").html("<option value=''></option>");
        for(var i in m.unidad)
          $("#select_unidadNOTICIA").append("<option value='" + i + "'>" + m.unidad[i] + "</option>");

        $("#select_medioNOTICIA,#select_medioTipoNOTICIA,#select_seccionBUSCADOR,#select_unidadNOTICIA").select2();

        tabla_noticia.destroy();
        $("#t_data").addClass("animate-flicker")
        setTimeout(function() {
          userDATOS.dataTableNOTICIAS3("#t_data",{"estado":2})
        },500);
      }
    })

    $("#select_medioNOTICIA").on("change",function() {
      medio = $("#select_medioNOTICIA").val();
      medioTipo = "";
      seccion = "";
      unidad = $("#select_unidadNOTICIA").val();
      m = userDATOS.noticiasSELECT("clipping",{"medio":medio,"mediotipo":medioTipo,"seccion":seccion,"unidad":unidad})

      if(unidad == "") {
        $("#select_unidadNOTICIA").html("<option value=''></option>");
        for(var i in m.unidad)
          $("#select_unidadNOTICIA").append("<option value='" + i + "'>" + m.unidad[i] + "</option>");
      }
      $("#select_unidadNOTICIA").select2();
    })
    $("#select_unidadNOTICIA").on("change",function() {
      medio = $("#select_medioNOTICIA").val();
      medioTipo = "";
      seccion = "";
      unidad = $("#select_unidadNOTICIA").val();
      m = userDATOS.noticiasSELECT("clipping",{"medio":medio,"mediotipo":medioTipo,"seccion":seccion,"unidad":unidad})

      if(medio == "") {
        $("#select_medioNOTICIA").html("<option value=''></option>");
        for(var i in m.medio)
          $("#select_medioNOTICIA").append("<option value='" + i + "'>" + m.medio[i] + "</option>");
      }

      $("#select_medioNOTICIA").select2()
    });
    scopeNoticias = function($scope,key,value) {
      $scope.$apply(function () {
      	$scope.noticias[key] = $scope.noticias[key] + value;
      });
    }

    userDATOS.publicarNOTICIA = function() {
      let row = tabla_noticia.rows(".selected").data()[0];
      if(parseInt(row.estado_num) == 4) {
        userDATOS.notificacion("Noticia publicada");
        return false;
      }
      let osai_cliente = null;
      userDATOS.busqueda({"value":row.id,"tabla":"osai_cliente","column":"id_noticia","retorno":0}, function(d) {
        osai_cliente = d;
      })//<-- OJO / uso id de -->--> NOTICIA <--<--
      $.MessageBox({
        buttonDone  : strings.btn.si,
        buttonFail  : strings.btn.no,
        message     : strings.noticia.publicar
      }).done(function(){
        userDATOS.change(row.id,"noticia","estado",4);

        //Cambio columna ID USUARIO para indicar quien lo hizo
        for(var i in osai_cliente) {
          userDATOS.change(i,"osai_cliente","id_usuario",window.user_id);
          userDATOS.log(window.user_id,"Noticia publicada en CLIENTE",0,i,"osai_cliente")
        }
        tabla_noticia.draw();
      });
    }

    
    userDATOS.clippingNOTICIA = function() {
      let row = tabla_noticia.rows(".selected").data()[0];
      let noticia = null;
      let clientes = null;
      let idAgendaNacional = 12//
      let proceso = [];
      let procesos = null;
      let msg = "";
      userDATOS.busqueda({"value":row.id,"tabla":"noticia"}, function(d) {
        noticia = d;
      });
      userDATOS.busqueda({"value":row.id,"tabla":"proceso","column":"did_noticia","retorno":0}, function(d) {
        procesos = d;
      });
      for(var i in procesos) {
        console.log(procesos[i])
        if(parseInt(procesos[i]["id_cliente"]) == idAgendaNacional) {
          userDATOS.busqueda({"value":idAgendaNacional,"tabla":"cliente"},function(cliente) {
            msg = "<p class='m-0 text-center'>Noticia procesada en <strong>" + cliente.nombre + "</strong></p>";
          });
          continue;
        }
        proceso.push(d.id_cliente);
      }
      /**
       * ESTADOS DE UNA NOTICIA <-- OJO, no confundir con TIPO DE NOTICIA (NUEVA/VIEJA)
       * - 0: Default
       * - 1: Relevado
       * - 2: Procesada
       * - 3: Publicada
       * - 4: Publicada
       */
      if(parseInt(noticia.estado_num) == 3) {
        userDATOS.notificacion("Noticia pre publicada en CLIENTE/S");
        return false;
      }
      if(parseInt(noticia.estado_num) == 4) {
        userDATOS.notificacion("Noticia publicada en CLIENTE/S");
        return false;
      }
      
      userDATOS.busquedaUsuariosFinales(function(clientes) {
        for(var i in proceso) {
          if(clientes[proceso[i]] !== undefined) {
            msg += "<p class='m-0'>" + clientes[proceso[i]] + "</p>";
            delete clientes[proceso[i]];
          }
        }
        $.MessageBox({
          buttonDone  : strings.btn.si,
          buttonFail  : strings.btn.no,
          message     : strings.noticia.prePublicar(msg),
          input   : { 
            input_detalle  : {
              type         : "texts",
              label        : "Descripción (máx. 200 caracteres):",
              title        : "Descripción de la noticia",
              maxlength    : 200
            },
            select_tipo : {
              type         : "selects",
              label        : "Seleccione Cliente final para publicar",
              title        : "cliente final",
              options      : clientes.data,
              default      : proceso
            },
          },
          filterDone  : function(data) {
            if(data.input_detalle == "")
              return "Descripción necesaria"
          }
        }).done(function(data){
          userDATOS.notificacion((data.select_tipo.length == 0 ? strings.noticia.publicar[1] : strings.noticia.publicar[2]),"info",false);
          userDATOS.notificacion(strings.tablaReseteo,"warning",false);
          userDATOS.change(noticia.id,"noticia","estado",3);
          id_usuario = window.user_id;//USUARIO de OSAI que generó esto
          setTimeout(function() {
            clientesFinales = proceso.concat(data.select_tipo);
            for(var i in clientesFinales) {//<-- CLIENTES que puede interarsarle / Publicado en el INDEX
              aux = {};
              aux["id_noticia"] = noticia.id;//TABLA noticia <-- OJO
              aux["id_usuario_osai"] = clientesFinales[i];
              x = null;
              userDATOS.insertDatos("osai_cliente",aux,function(x) {
                userDATOS.log(window.user_id,"NOTICIA publicada",0,x,"osai_cliente");
              },true);
              userDATOS.insertDatos("osai_notificacion",
                {"id_usuario":id_usuario,
                "id_noticia":noticia.id,
                "id_usuario_osai":clientesFinales[i],
                "mensaje": data.input_detalle,
                "nivel": 0,
                "estado": 1});
            }

            selectMEDIOS = userDATOS.noticiasSELECT("clipping");
            tabla_noticia.draw();
            angular.element($(".submenu")).scope().mediosSELECT = selectMEDIOS.medio;
            angular.element($(".submenu")).scope().mediostipoSELECT = selectMEDIOS.medio_tipo;
            angular.element($(".submenu")).scope().seccionSELECT = selectMEDIOS.seccion;
            angular.element($(".submenu")).scope().unidadSELECT = selectMEDIOS.unidad;
          },500);
        });
      },true);
    }
  });
  /**
   * Acciones de vista AJUSTES
   * Solo accedido por usuarios nivel 1 y 2
   */
  app.controller("ajustes", function ($scope,service_simat,factory_simat) {
    $(".nav_ul a").closest("ul").find(".active").removeClass("active");
    let dataT = {}
    dataT["medio_destaque"] = 2;
    dataT["periodista"] = 4;
    dataT["seccion"] = 5;
    dataT["attr_temas"] = 6;
    dataT["calificacion"] = 7;
    dataT["medio"] = 8;
    dataT["attr_alianza"] = 9;
    dataT["attr_campo"] = 10;
    dataT["attr_cargo"] = 11;
    dataT["attr_nivel"] = 12;
    dataT["attr_partido"] = 13;
    dataT["attr_poder"] = 14;


    $scope.tablasNOTICIAS = [
      {"nombre":"Sección","id":"seccion"},
      {"nombre":"Periodista","id":"periodista"},
      {"nombre":"Temas","id":"attr_temas"},
      {"nombre":"Medio","id":"medio"}];
    $scope.tablasACTOR = [
      {"nombre":"Calificación","id":"attr_calificacion"},
      {"nombre":"Alianza electoral","id":"attr_alianza"},
      {"nombre":"Campo","id":"attr_campo"},
      {"nombre":"Cargo","id":"attr_cargo"},
      {"nombre":"Nivel","id":"attr_nivel"},
      {"nombre":"Partido político","id":"attr_partido"},
      {"nombre":"Poder","id":"attr_poder"}];

    factory_simat.load("medio_destaque")
    factory_simat.load("periodista")
    factory_simat.load("seccion")
    factory_simat.load("attr_temas")
    factory_simat.load("attr_calificacion")
    factory_simat.load("medio")
    factory_simat.load("attr_alianza")
    factory_simat.load("attr_campo")
    factory_simat.load("attr_cargo")
    factory_simat.load("attr_nivel")
    factory_simat.load("attr_partido")
    factory_simat.load("attr_poder")
      
    userDATOS.submit = function(t) {
      let e = $("#" + t.id).data("tipo");
      if(userDATOS.validar("#" + t.id)) {
        let pyrusObjeto = new Pyrus(e,false);
        let a = pyrusObjeto.objeto["GUARDADO_ATTR"];
        let OBJ = {}
        for(var j in a) {
          OBJ[j] = null;

          if(a[j]["TIPO"] == "nulo")
            OBJ[j] = (t["frm_" + j].value == "" ? a[j]["TIPO"] : t["frm_" + j].value);
          if(a[j]["TIPO"] == "normal") {
            if(t["frm_" + j] === undefined) continue;
            OBJ[j] = t["frm_" + j].value;
          }
          if(a[j]["TIPO"] == "array") {
            OBJ[j] = [];
            for(var x in window[a[j]["VAR"]])
              OBJ[j].push(x)
          }
        }
        $("#" + t.id).find("input","button","select").attr("disabled")

        accion = pyrusObjeto.guardar_1(OBJ);//
        if(accion.id !== null && accion.flag) {//
          let elemento = null;
          userDATOS.busqueda({"value":accion.id,"tabla":e},function(d) {
            elemento = d
          });//traigo el nuevo registro
          window["tabla_" + dataT[e]].draw();//agrego sin recargar sitio
          if(OBJ.id == "nulo")
            userDATOS.log(window.user_id,"Alta de registro",0,accion.id,e);
          else
            userDATOS.log(window.user_id,"Edición de registro",0,accion.id,e);
          
          $("#modal").modal("hide");

        } else userDATOS.notificacion(strings.repetidoDatos,"error");
      } else userDATOS.notificacion(strings.faltan.datos,"error");
    }
  });
  /**
   * Acciones de vista ELIMINADO
   * Solo accedido por usuarios nivel 1 y 2
   */
  app.controller("eliminado", function ($scope) {
    $(".nav_ul a").closest("ul").find(".active").removeClass("active");

    userDATOS.dataTableNOTICIASeliminadas("#t_data_e")
  });
  /**
   * Acciones de vista NOTIFICACIONES
   * Solo accedido por usuarios nivel 1 y 2
   */
  app.controller("notificaciones", function ($scope) {
    $(".nav_ul a").closest("ul").find(".active").removeClass("active");

    userDATOS.dataTableNOTIFICACIONES("#t_data_e")
  });
  /**
   * Acciones de vista INFORMES
   * Solo accedido por usuarios nivel 1 y 2
   */
  app.controller("informes", function ($scope) {
    $(".nav_ul a").closest("ul").find(".active").removeClass("active");
    select = userDATOS.noticiasSELECT("procesadas");
    $scope.unidad = select.unidad;
    $(".select__2").select2();

    $(document).ready(function(){
      window.localStorage.clear()
      $("tbody a").on("click",function(e) {
        e.preventDefault();
        href = $(this).attr("href");
        min = $("#fecha_min").val();
        max = $("#fecha_max").val();
        uni = $("#select_unidad").val();
        if($(this).data("tipo") == "fecha_unidad") {
          if(min == "" || max == "" || uni == "")
            userDATOS.notificacion(strings.faltan.especifico[0],"error");
          else {
              window.localStorage.setItem("fecha_min", min);
              window.localStorage.setItem("fecha_max", max);
              window.localStorage.setItem("unidad", uni);

              let win = window.open(href, '_blank');
              win.focus();
          }
        } else {
          if(min == "" || max == "")
            userDATOS.notificacion(strings.faltan.especifico[1],"error");
          else {
              window.localStorage.setItem("fecha_min", min);
              window.localStorage.setItem("fecha_max", max);
              window.localStorage.setItem("version",$(this).data("version"));
              let win = window.open(href, '_blank');
              win.focus();
          }
        }
        return false;
      })
    })
    //si utilizo actores emisores, puedo vincularlos a los temas, por campo
    /**
     * Cada ACTOR está vinculado con un [CLIENTE/UNIDAD DE ANÁLISIS]
     * Los temas se encuentran en UNIDAD de ANÁLISIS
     * hay que vincularlos para generar el grafico de globos
     **
     * Se va a poder seleccionar por ACTOR
     */
  });
  /**
   * Acciones de vista CLIENTES
   * Solo accedido por usuarios nivel 1 y 2
   */
  app.controller("clientes", function ($scope) {
    $(".nav_ul a").closest("ul").find(".active").removeClass("active");
    $(".nav_ul a[data-url='clientes']").addClass("active");

    let agendas = null;
    userDATOS.busqueda({"value":1,"tabla":"cliente","column":"todos","retorno":0}, function(d) {
      agendas = d;
    });
    let htmlAgendaContenedor = "";
    for(var i in agendas) {
      htmlAgendaContenedor += "<p class='text-left m-0'>" + agendas[i]["nombre"] + "<i class='text-success ml-2 fas fa-check-circle'></i></p>";
    }
    if(htmlAgendaContenedor == "") htmlAgendaContenedor = "<p class='text-center m-0 text-uppercase'>sin agendas</p>"
    $scope.htmlAgenda = htmlAgendaContenedor;

    userDATOS.listador("#t_clientes",pyrusCliente,false);

    userDATOS.submit = function(t) {
      let e = $("#" + t.id).data("tipo");
      if(userDATOS.validar("#" + t.id)) {
        let a = pyrusCliente.objeto["GUARDADO_ATTR"];
        let OBJ = {}
        for(var j in a) {
          OBJ[j] = null;

          if(a[j]["TIPO"] == "nulo")
            OBJ[j] = (t["frm_" + j].value == "" ? a[j]["TIPO"] : t["frm_" + j].value);
          if(a[j]["TIPO"] == "normal") {
            if(t["frm_" + j] === undefined) continue;
            OBJ[j] = t["frm_" + j].value;
          }
          if(a[j]["TIPO"] == "array") {
            OBJ[j] = [];
            for(var x in window[a[j]["VAR"]])
              OBJ[j].push(x)
          }
        }
        $("#" + t.id).find("input","button","select").attr("disabled")
        accion = pyrusCliente.guardar_1(OBJ);//
        if(accion.id !== null && accion.flag) {//
          let elemento = null;
          userDATOS.busqueda({"value":accion.id,"tabla":"cliente"},function(d) {
            elemento = d;
          });//traigo el nuevo registro
          window["tabla_0"].destroy();
          $("#t_clientes").remove();
          $(".container fieldset:last-child .card-body").append('<table class="table table-hover w-100" id="t_clientes"></table>');
          userDATOS.listador("#t_clientes",pyrusCliente,false);
          $("#modal").modal("hide");
          //service_simat.option($scope);
        } else userDATOS.notificacion(strings.repetidoDatos,"error");
      } else userDATOS.notificacion(strings.faltan.datos,"error");
    }

    userDATOS.usuarioOSAI = function() {
      let row = tabla_0.rows(".selected").data()[0];

      let osai_usuario = null;
      userDATOS.busqueda({"value":row.id,"tabla":"osai_usuario","column":"id_cliente"}, function(d) {
        osai_usuario = d;
      });
      if(osai_usuario == false) return false;
      if(osai_usuario !== null) {
        $.MessageBox({
          buttonDone  : strings.btn.cambiar,
          buttonFail  : strings.btn.cancelar,
          message : strings.usuario.existente(osai_usuario.user,osai_usuario.activo),
          input   : {
              password1 : {
                  type         : "password",
                  label        : "CONTRASEÑA:",
                  title        : "Contraseña"
              },
              password2 : {
                  type         : "password",
                  label        : "CONTRASEÑA (repita):",
                  title        : "Contraseña"
              }
          },
          top     : "auto",
          filterDone      : function(data){
            if(data.password1 != data.password2) {
              userDATOS.notificacion(strings.contrasela.noCoinciden,"error")
              return false;
            }
          }
        }).done(function(data, button){
          userDATOS.change(osai_usuario.id,"osai_usuario","pass",md5(data.password1));
          userDATOS.notificacion(strings.contrasela.cambiada);
          userDATOS.log(window.user_id,"Alta de registro / [USER] " + data.user + " / [PASS] " + data.password1,0,osai_usuario.id,"osai_usuario");
        });
        return false;
      }
      $.MessageBox({
        buttonDone  : strings.btn.crear,
        buttonFail  : strings.btn.cancelar,
        message : strings.usuario.nuevo,
        input   : {
            user    : {
                type         : "text",
                label        : "USUARIO",
                title        : "Usuario del CLIENTE FINAL",
                maxlength    : 30
            },
            password1 : {
                type         : "password",
                label        : "CONTRASEÑA:",
                title        : "Contraseña"
            },
            password2 : {
                type         : "password",
                label        : "CONTRASEÑA (repita):",
                title        : "Contraseña"
            }
        },
        top     : "auto",
        filterDone      : function(data){
          if(data.user === "" || data.password1 === "") {
            userDATOS.notificacion(strings.faltan.datos,"error");
            return false;
          }
          if(data.password1 != data.password2) {
            userDATOS.notificacion(strings.contrasela.noCoinciden,"error")
            return false;
          }

          aux = null;
          userDATOS.busqueda({"value":data.user,"tabla":"osai_usuario","column":"user"}, function(d) {
            aux = d;
          });
          if(aux !== null) {
            userDATOS.notificacion(strings.usuario.ocupado,"error")
            return false;
          }
        }
      }).done(function(data, button){
        aux = {};
        aux["id_cliente"] = row.id;
        aux["user"] = data.user;
        aux["pass"] = md5(data.password1);
        userDATOS.insertDatos("osai_usuario",aux)
        userDATOS.notificacion(strings.usuario.creado);
        userDATOS.log(window.user_id,"Alta de registro / [USER] " + data.user + " / [PASS] " + data.password1,0,i,"osai_usuario");

        window["tabla_0"].destroy();
        $("#t_clientes").remove();
        $(".container fieldset:last-child .card-body").append('<table class="table table-hover w-100" id="t_clientes"></table>');
        userDATOS.listador("#t_clientes",pyrusCliente,false);
      });
    }
  });
  /**
   * Acciones de vista ACTORES
   * Solo accedido por usuarios nivel 1 y 2
   */
  app.controller("actores", function ($scope) {
    $(".nav_ul a").closest("ul").find(".active").removeClass("active");
    $(".nav_ul a[data-url='actores']").addClass("active");

    userDATOS.listador("#t_actores",pyrusActor);
    userDATOS.submit = function(t) {
      if(userDATOS.validar("#" + t.id)) {
        let a = pyrusActor.objeto["GUARDADO_ATTR"]
        let OBJ = {}
        for(var j in a) {
          OBJ[j] = null;

          if(a[j]["TIPO"] == "nulo")
            OBJ[j] = (t["frm_" + j].value == "" ? a[j]["TIPO"] : t["frm_" + j].value);
          if(a[j]["TIPO"] == "normal") {
            if(t["frm_" + j] === undefined) continue;
            OBJ[j] = $("#frm_" + j).val();
          }
          if(a[j]["TIPO"] == "array") {
            OBJ[j] = [];
            for(var x in window[a[j]["VAR"]])
              OBJ[j].push(x)
          }
        }
        $("#" + t.id).find("input","button","select").attr("disabled")
        accion = pyrusActor.guardar_1(OBJ);//
        if(accion.id !== null && accion.flag) {//
          let elemento = null;
          userDATOS.busqueda({"value":accion.id,"tabla":"actor"}, function(d) {
            elemento = d;
          });//traigo el nuevo registro

          window["tabla_0"].draw();//agrego sin recargar sitio
          if(OBJ.id == "nulo") {
            userDATOS.log(window.user_id,"Alta de registro",0,accion.id,"actor");
          } else {
            userDATOS.log(window.user_id,"Edición de registro",0,accion.id,"actor");
          }
          $("#modal").modal("hide");
          window.ATTR = undefined;
        } else userDATOS.notificacion(strings.repetidoDatos,"error");
      } else userDATOS.notificacion(strings.faltan.datos,"error");
    }
  });
  /**
   * Acciones de vista USUARIOS
   * Solo accedido por usuarios nivel 1 y 2
   */
  app.controller("usuarios", function ($scope) {
    $(".nav_ul a").closest("ul").find(".active").removeClass("active");
    let ua = userDATOS.user();
    
    let ARR_btn = [];
    let btn = [];
    if(parseInt(window.user.nivel) <= 2) btn.push("delete");
    if(parseInt(window.user.nivel) <= 3) {
      ARR_btn.push({
          text: '<i class="fas fa-plus"></i>',
          className: 'btn-primary',
          action: function ( e, dt, node, config ) {
            window["tabla_0"].rows('.selected').deselect();
            userDATOS.addUsuario(window["tabla_0"],pyrusUsuario);
          }
      });
      ARR_btn.push({
          extend: 'selected',
          text: '<i class="fas fa-eye"></i>',
          className: 'btn-dark',
          action: function ( e, dt, node, config ) {
            let rows = dt.rows( { selected: true } ).count();
            userDATOS.showUsuario(window["tabla_0"],pyrusUsuario);
          }
        });
      ARR_btn.push({
          extend: 'selected',
          text: '<i class="fas fa-ban"></i>',
          className: 'btn-warning',
          action: function ( e, dt, node, config ) {
            let rows = dt.rows( { selected: true } ).count();
            userDATOS.bloquearUsuario(window["tabla_0"],pyrusUsuario);
          }
        });
    }
    userDATOS.listador("#t_usuarios",pyrusUsuario,true,0,ARR_btn,btn);//target / VAR Pyrus / busqueda / id tabla / btn adicional / ARR btn default
    userDATOS.submit = function(t) {
      if(userDATOS.validar("#" + t.id)) {
        let a = pyrusUsuario.objeto["GUARDADO_ATTR"]
        let OBJ = {}
        for(var j in a) {
          OBJ[j] = null;
          if(a[j]["TIPO"] == "nulo")
            OBJ[j] = (t["frm_" + j].value == "" ? a[j]["TIPO"] : t["frm_" + j].value);
          if(a[j]["TIPO"] == "normal") {
            if(t["frm_" + j] === undefined) continue;
            OBJ[j] = t["frm_" + j].value;
          }
        }
        OBJ["pass"] = md5("12345678");
        OBJ["cantidad"] = "8";

        $("#" + t.id).find("input","button","select").attr("disabled")
        accion = pyrusUsuario.guardar_1(OBJ);
        if(accion.id !== null && accion.flag) {//
          let row = [];
          let e = null;
          userDATOS.busqueda({"value":accion.id,"tabla":"usuario"},function(d) {
            e = d;
          });//el dato nuevo
          userDATOS.log(window.user_id,"Alta de registro",0,e.id,"usuario");
          
          window["tabla_0"].draw();//agrego sin recargar sitio
          $("#modal").modal("hide");
        } else userDATOS.notificacion("Datos repetidos","error");
      } else userDATOS.notificacion("Faltan datos","error");
    }
    //$("#div").addClass("d-none");
  });
  /**
   * Acciones de vista ALERTAS
   * Solo accedido por usuarios nivel 1 y 2
   */
  app.controller("alertas", function ($scope) {
    $(".nav_ul a").closest("ul").find(".active").removeClass("active");
    let atributos = {};
    let OBJ_alarmas = {};
    let clientes = null;
    userDATOS.busquedaTabla("cliente",function(d) {
      clientes = d;
    });
    let CLIENTES_alarmas = {};
    let ARR_alarmas = null;
    userDATOS.busqueda({"value":0,"tabla":"alarma","column":"id_cliente","retorno":0}, function(d) {
      ARR_alarmas = d;
    });
    // la alarma busca por clientes activos, si no se encuentran seteados los agrega
    for(var i in clientes) {
      if(parseInt(clientes[i]["todos"])) continue;
      let o = null;
      userDATOS.busqueda({"value":clientes[i]["id"],"tabla":"alarma","column":"id_cliente"}, function(d) {
        o = d;
      });
      CLIENTES_alarmas[clientes[i]["id"]] = {};
      CLIENTES_alarmas[clientes[i]["id"]]["id"] = clientes[i]["id"];
      CLIENTES_alarmas[clientes[i]["id"]]["nombre"] = clientes[i]["nombre"];
      if(o === null) {
        o = pyrusAlarma.objetoLimpio();
        o.estado = "0";
        o.id_cliente = clientes[i]["id"];
        delete o["atributos"];
        accion = pyrusAlarma.guardar_1(o);
        aux = null;
        userDATOS.busqueda({"value":accion.id,"tabla":"alarma"}, function(d) {
          aux = d;
        });//Agrego en el array precargado

        CLIENTES_alarmas[clientes[i]["id"]]["atributos"] = [];
        CLIENTES_alarmas[clientes[i]["id"]]["atributos_negativos"] = {};
        CLIENTES_alarmas[clientes[i]["id"]]["estado"] = 0;
        CLIENTES_alarmas[clientes[i]["id"]]["id_alarma"] = accion.id;
      } else {
        CLIENTES_alarmas[clientes[i]["id"]]["atributos"] = userDATOS.parseJSON(o.atributos);
        if(o.atributos_negativos === null) {
          CLIENTES_alarmas[clientes[i]["id"]]["atributos_negativos"] = {};
          arr = CLIENTES_alarmas[clientes[i]["id"]]["atributos"];
          for(var x in arr)
            CLIENTES_alarmas[clientes[i]["id"]]["atributos_negativos"][arr[x]] = []
        } else {
          if(o.atributos_negativos == "" || o.atributos_negativos === null)
            CLIENTES_alarmas[clientes[i]["id"]]["atributos_negativos"] = ""
          else {
            CLIENTES_alarmas[clientes[i]["id"]]["atributos_negativos"] = userDATOS.parseJSON(o.atributos_negativos);
            for(var x in CLIENTES_alarmas[clientes[i]["id"]]["atributos_negativos"])
              CLIENTES_alarmas[clientes[i]["id"]]["atributos_negativos"][x] = userDATOS.parseJSON(CLIENTES_alarmas[clientes[i]["id"]]["atributos_negativos"][x])
          }
        }
        CLIENTES_alarmas[clientes[i]["id"]]["estado"] = o.estado;
        CLIENTES_alarmas[clientes[i]["id"]]["id_alarma"] = o.id;
      }
    }
    for(var i in ARR_alarmas) {
      if(!Array.isArray(ARR_alarmas[i]["atributos"])) {
        if(ARR_alarmas[i]["atributos"] === null) ARR_alarmas[i]["atributos"] = [];
        else ARR_alarmas[i]["atributos"] = userDATOS.parseJSON(ARR_alarmas[i]["atributos"]);

        if(ARR_alarmas[i]["atributos_negativos"] === null) {
            ARR_alarmas[i]["atributos_negativos"] = {};
            for(var x in ARR_alarmas[i]["atributos"])
              ARR_alarmas[i]["atributos_negativos"][ARR_alarmas[i]["atributos"][x]] = [];
        } else {
          ARR_alarmas[i]["atributos_negativos"] = userDATOS.parseJSON(ARR_alarmas[i]["atributos_negativos"]);
          for(var x in ARR_alarmas[i]["atributos_negativos"])
            ARR_alarmas[i]["atributos_negativos"][x] = userDATOS.parseJSON(ARR_alarmas[i]["atributos_negativos"][x]);
        }
      }
      if(OBJ_alarmas[ARR_alarmas[i]["id"]] === undefined) OBJ_alarmas[ARR_alarmas[i]["id"]] = ARR_alarmas[i];
    }

    userDATOS.submit = function(t) {
      if(userDATOS.validar("#" + t.id)) {
        let a = pyrusAlarma.objeto["GUARDADO_ATTR"];
        let modal = $("#modal");
        let OBJ = {};
        
        for(var j in a) {
          OBJ[j] = null;

          if(a[j]["TIPO"] == "nulo")
            OBJ[j] = (t["frm_" + j].value == "" ? a[j]["TIPO"] : t["frm_" + j].value);
          if(a[j]["TIPO"] == "normal") {
            if(t["frm_" + j] === undefined) continue;
            OBJ[j] = t["frm_" + j].value;
          }
          if(a[j]["TIPO"] == "valor")
            OBJ[j] = a[j]["VALOR"];
        }
        accion = pyrusAlarma.guardar_1(OBJ);
        if(accion.id !== null && accion.flag) {
          on = null;
          userDATOS.busqueda({"value":accion.id,"tabla":"alarma"}, function(d) {
            on = d;
          });
          userDATOS.log(window.user_id,"Se agregó alarma (" + on.nombre + ")",0,accion.id,"alarma");
          angular.element($("#alarmasF")).scope().alarmas[on.id] = on;
          modal.modal("hide");
        } else userDATOS.notificacion(strings.repetidoDatos,"error");
      } else userDATOS.notificacion(strings.faltan.datos,"error");
    }
    $scope.alarmas = OBJ_alarmas;
    $scope.deleteAlarma = function(o) {
      $.MessageBox({
        buttonDone  : strings.btn.si,
        buttonFail  : strings.btn.no,
        message   : strings.eliminar.alarma
      }).done(function(){
        delete angular.element($("#alarmasF")).scope().alarmas[o.id];
        $("div[data-id='" + o.id + "']").remove();
        o.elim = 1;
        delete o["atributos"];
        accion = pyrusAlarma.guardar_1(o);
        userDATOS.log(window.user_id,"Se eliminó alarma (" + o.nombre + ")",0,accion.id,"alarma",1);
      });
    }
    $scope.submitAlarma = function(t,o) {
      if(angular.element($("#alarmasF")).scope().alarmas[o.id]["atributos"].indexOf(t.text) < 0) {
        angular.element($("#alarmasF")).scope().alarmas[o.id]["atributos"].push(t.text);

        accion = pyrusAlarma.guardar_1(angular.element($("#alarmasF")).scope().alarmas[o.id]);
        angular.element($("#alarmasF")).scope().alarmas[o.id]["atributos"] = userDATOS.parseJSON(angular.element($("#alarmasF")).scope().alarmas[o.id]["atributos"]);
        userDATOS.log(window.user_id,"Se agregó atributo a la alarma " + o.nombre + " (" + t.text + ")",0,accion.id,"alarma");
        t.text = "";
      } else userDATOS.notificacion(strings.repetidoDatos,"error");
    }
    $scope.deleteATTRalarma = function(i,o) {
      text = angular.element($("#alarmasF")).scope().alarmas[o.id]["atributos"][i];
      angular.element($("#alarmasF")).scope().alarmas[o.id]["atributos"].splice(i,1);
      accion = pyrusAlarma.guardar_1(angular.element($("#alarmasF")).scope().alarmas[o.id]);
      angular.element($("#alarmasF")).scope().alarmas[o.id]["atributos"] = userDATOS.parseJSON(angular.element($("#alarmasF")).scope().alarmas[o.id]["atributos"]);
      userDATOS.log(window.user_id,"Se quito atributo de la alarma " + o.nombre + " (" + text + ")",0,accion.id,"alarma",1);
    }

    $scope.addPalabra = function() {
      let modal = $("#modal");
      html = "";
      modal.find(".modal-title").text("ALARMA");

      html += "<div class=\"form-group mb-0\">" +
        '<div class="row">' +
          '<div class="col">' +
            '<input type="hidden" name="frm_id" value="">' +
            '<input required="true" type="text" class="form-control" name="frm_nombre" placeholder="Nombre">' +
          '</div>' +
        '</div>';
      btn = "<button class=\"btn btn-block text-uppercase\">Agregar</button>";
      modal.find(".modal-body").html(html)
      modal.find(".modal-footer").html(btn);
      modal.modal("show")
    }

    $scope.alarmasCLIENTE = CLIENTES_alarmas;
    $scope.estadoAlarma = function(o) {
      o.estado = (o.estado == 0 ? 1 : 0);

      accion = pyrusAlarma.guardar_1(o);
      userDATOS.log(window.user_id,"Alarma de " + o.nombre + " (" +(o.estado == "0" ? "APAGADA" : "ENCENDIDA")+ ")",0,accion.id,"alarma");
      angular.element($("#alarmasF")).scope().alarmas[o.id]["estado"] = o.estado;
      angular.element($("#alarmasF")).scope().alarmas[o.id]["atributos"] = userDATOS.parseJSON(angular.element($("#alarmasF")).scope().alarmas[o.id]["atributos"]);
    }
    $scope.submit = function(t, cliente) {
      if(angular.element($("#alarmas")).scope().alarmasCLIENTE[cliente.id].atributos.indexOf(t.text) < 0) {
        angular.element($("#alarmas")).scope().alarmasCLIENTE[cliente.id].atributos.push(t.text);
        let o = null;
        userDATOS.busqueda({"value":cliente.id_alarma,"tabla":"alarma"}, function(d) {
          o = d;
        });
        o.atributos = angular.element($("#alarmas")).scope().alarmasCLIENTE[cliente.id].atributos;
        accion = pyrusAlarma.guardar_1(o);

        userDATOS.log(window.user_id,"Se agregó atributo a " + cliente.nombre + "(" + t.text + ")",0,accion.id,"alarma");
        t.text = "";
      } else userDATOS.notificacion(strings.repetidoDatos,"error");
    }
    $scope.alarma = function(cliente) {
      cliente.estado = (cliente.estado == 0 ? 1 : 0);
      angular.element($("#alarmas")).scope().alarmasCLIENTE[cliente.id]
      o = null;
      userDATOS.busqueda({"value":cliente.id_alarma,"tabla":"alarma"}, function(d) {
        o = d;
      });
      o.estado = cliente.estado
      accion = pyrusAlarma.guardar_1(o);
      userDATOS.log(window.user_id,"Alarma de " + cliente.nombre + " (" +(cliente.estado == "0" ? "APAGADA" : "ENCENDIDA")+ ")",0,accion.id,"alarma");
      
    }
    $scope.delete = function(i, cliente) {
      let text = angular.element($("#alarmas")).scope().alarmasCLIENTE[cliente.id]["atributos"][i];
      angular.element($("#alarmas")).scope().alarmasCLIENTE[cliente.id]["atributos"].splice(i,1);
      let o = null;
      userDATOS.busqueda({"value":cliente.id_alarma,"tabla":"alarma"}, function(d) {
        o = d;
      });
      o.atributos = angular.element($("#alarmas")).scope().alarmasCLIENTE[cliente.id]["atributos"];
      accion = pyrusAlarma.guardar_1(o);
      userDATOS.log(window.user_id,"Se quito atributo a " + cliente.nombre + " (" + text + ")",0,accion.id,"alarma",1);
    }
    userDATOS.removeATTRnegativo = function(e,tipo) {
      let li = $(e).closest("li");
      let li_li = li.closest("li");
      let elem = angular.element(li_li).scope();
      let i = li.index() - 1;//En la primera pos. se encuentra el input

      elem.$parent[tipo]["atributos_negativos"][elem.attr].splice(i,1);
      li.remove();
      let o = null;
      userDATOS.busqueda({"value":elem.$parent[tipo].id_alarma,"tabla":"alarma"}, function(d) {
        o = d;
      });
      o.atributos_negativos = elem.$parent[tipo]["atributos_negativos"];
      accion = pyrusAlarma.guardar_1(o);
    }
    userDATOS.addATTRnegativo = function(e,tipo) {
      let li = $(e).closest("li");
      let li_li = li.closest("li");
      let data = $(e).val();
      let elem = angular.element(li_li).scope();

      if(elem.$parent[tipo]["atributos_negativos"][elem.attr].indexOf(data) < 0) {
        let span = '<span class="float-right"><i onclick="userDATOS.removeATTRnegativo(this,\'' + tipo + '\')" class="fas fa-trash-alt text-danger cursor-pointer"></i></span>';
        li.parent().append("<li class='list-group-item bg-light'>" + data + span + "</li>");
        elem.$parent[tipo]["atributos_negativos"][elem.attr].push(data);
        
        let o = null;
        userDATOS.busqueda({"value":elem.$parent[tipo].id_alarma,"tabla":"alarma"}, function(d) {
          o = d;
        });
        o.atributos_negativos = elem.$parent[tipo]["atributos_negativos"];
        accion = pyrusAlarma.guardar_1(o);
        $(e).val("");
      } else userDATOS.notificacion(strings.elementoExistente,"error");

    }
    userDATOS.atributoNegativo = function(e,tipo) {
      let li = $(e).closest("li");
      let elem = angular.element(li).scope();
      let data = null;
      data = elem.$parent[tipo]["atributos_negativos"][elem.attr];
      let html = "";
      if(parseInt($(e).data("estado"))) {
        $(e).removeClass("text-warning");
        li.find("ul").remove();
        $(e).data("estado","0");

        let o = null;
        if(tipo == "cliente") {
          userDATOS.busqueda({"value":elem.$parent.cliente.id_alarma,"tabla":"alarma"}, function(d) {
            o = d
          });
        } else {
          userDATOS.busqueda({"value":elem.$parent.id,"tabla":"alarma"}, function(d) {
            o = d
          });
        }
        o.atributos_negativos = elem.$parent[tipo]["atributos_negativos"];
        accion = pyrusAlarma.guardar_1(o);
        if(tipo == "alarmaF") {
          o["atributos"] = userDATOS.parseJSON(o["atributos"]);

          o["atributos_negativos"] = userDATOS.parseJSON(o["atributos_negativos"]);
          for(var x in o["atributos_negativos"])
            o["atributos_negativos"][x] = userDATOS.parseJSON(o["atributos_negativos"][x]);

        }
      } else {
        $(e).data("estado","1");
        $(e).addClass("text-warning");
        html += '<ul class="list-group list-group-flush mt-2">';
          html += '<li class="list-group-item p-0 border-0" style="z-index:10">';
            html += '<input onkeypress="if(event.charCode == 13) userDATOS.addATTRnegativo(this,\'' + tipo + '\');" type="text" class="form-control rounded-0" name="frm_nombre" placeholder="Atributo negativo">';
          html += '</li>';
          for(var i in data) {
            span = '<span class="float-right"><i onclick="userDATOS.removeATTRnegativo(this,\'' + tipo + '\')" class="fas fa-trash-alt text-danger cursor-pointer"></i></span>';
            html += "<li class='list-group-item bg-light'>" + data[i] + span + "</li>";
          }
        html += '</ul>';
        li.append(html);
        li.find("input").focus();

      }
    }
    //$("#div").addClass("d-none");
  });
  /**
   * Acciones de vista RELEVO
   * Solo accedido por usuarios nivel 1 y 2
   */
  app.controller("relevo", function ($scope,$timeout,service_simat,factory_simat) {
    $(".body > aside .nav_ul a[data-url='noticias']").closest("ul").find(".active").removeClass("active");
    $(".body > aside .nav_ul a[data-url='noticias']").addClass("active");
    factory_simat.load("noticias2");
    service_simat.noticias($scope);
    window.noticiasCHECKED = {};

    selectMEDIOS = userDATOS.noticiasSELECT("relevo");
    $scope.mediosSELECT = selectMEDIOS.medio;
    $scope.mediostipoSELECT = selectMEDIOS.medio_tipo;
    $scope.seccionSELECT = selectMEDIOS.seccion;
    $scope.unidadSELECT = null;
    userDATOS.busquedaTabla("cliente", function(d) {
      $scope.unidadSELECT = d;
    });
    $(".select__2").select2();

    scopeNoticias = function($scope) {
      $scope.$apply(function () {
          $scope.noticias = null;
          userDATOS.noticiasVALOR(function(d) {
            $scope.noticias = d;
          });
      });
    }

    $("#btn_filtro").on("click",function() {
      let minDateFilter = $('#fecha_min').val();
      let maxDateFilter = $('#fecha_max').val();
      let medioFilter = $('#select_medioNOTICIA').val();
      let medioTipoFilter = $('#select_medioTipoNOTICIA').val();
      let tituloFilter = $('#titulo').val();
      let seccionFilter = $('#select_seccion').val();
      data = {"moderado":1,"minDateFilter":minDateFilter,"maxDateFilter":maxDateFilter,"medioFilter":medioFilter,"medioTipoFilter":medioTipoFilter,"tituloFilter":tituloFilter,"seccionFilter":JSON.stringify(seccionFilter)}
      if(minDateFilter == "" && maxDateFilter == "" && medioFilter == "" && medioTipoFilter == "" && tituloFilter == "" && seccionFilter.length == 0 && unidadFilter == "") {
        userDATOS.notificacion(strings.faltan.datosBusqueda,"error");
        return false;
      }
      if(minDateFilter != "" && maxDateFilter != "") {
        if(dates.compare(dates.convert(maxDateFilter),dates.convert(minDateFilter)) < 0) {
          userDATOS.notificacion(strings.error.fechas,"error");
          return false;
        }
      }
      tabla_noticia.destroy();
      $("#t_data").addClass("animate-flicker")
      setTimeout(function() {
        userDATOS.dataTableNOTICIAS2("#t_data",data)
      },500);
      //tabla_noticia.draw();
    });
    $("#btn_limpiar").on("click",function() {
      $("#fecha_min").val("");
      $("#fecha_max").val("");
      $("#titulo").val("");
      if($("#select_seccion").val().length == 0)
        $("#select_seccion").empty().trigger("change");
      if($("#select_medioTipoNOTICIA").val() != "")
        $("#select_medioTipoNOTICIA").val("").trigger("change");
      if($("#select_medioNOTICIA").val() != "")
        $("#select_medioNOTICIA").val("").trigger("change");

      $("#select_medioNOTICIA,#select_medioTipoNOTICIA,#select_seccion").select2();
      tabla_noticia.destroy();
      $("#t_data").addClass("animate-flicker")
      setTimeout(function() {
        userDATOS.dataTableNOTICIAS2("#t_data",{"moderado":1})
      },50);
    })
    $("#select_medioNOTICIA").on("change",function() {
      medio = $("#select_medioNOTICIA").val();
      medioTipo = $("#select_medioTipoNOTICIA").val();
      seccion = $("#select_seccion").val();
      m = userDATOS.noticiasSELECT("relevo",{"medio":medio,"mediotipo":medioTipo,"seccion":seccion})

      if(medioTipo == "") {
        $("#select_medioTipoNOTICIA").html("<option value=''></option>");
        for(var i in m.medio_tipo)
          $("#select_medioTipoNOTICIA").append("<option value='" + i + "'>" + m.medio_tipo[i] + "</option>");
      }

      if(seccion.length == 0) {
        $("#select_seccion").html("<option value=''></option>");
        for(var i in m.seccion)
          $("#select_seccion").append("<option value='" + i + "'>" + m.seccion[i] + "</option>");
      }
      $("#select_medioTipoNOTICIA option[value=''],#select_seccion option[value='']").removeAttr("disabled");
      $("#select_medioTipoNOTICIA,#select_seccion").select2()
    })
    $("#select_medioTipoNOTICIA").on("change",function() {
      medio = $("#select_medioNOTICIA").val();
      medioTipo = $("#select_medioTipoNOTICIA").val();
      seccion = $("#select_seccion").val();
      m = userDATOS.noticiasSELECT("relevo",{"medio":medio,"mediotipo":medioTipo,"seccion":seccion})

      if(medio == "") {
        $("#select_medioNOTICIA").html("<option value=''></option>");
        for(var i in m.medio)
          $("#select_medioNOTICIA").append("<option value='" + i + "'>" + m.medio[i] + "</option>");
      }

      if(seccion.length == 0) {
        $("#select_seccion").html("<option value=''></option>");
        for(var i in m.seccion)
          $("#select_seccion").append("<option value='" + i + "'>" + m.seccion[i] + "</option>");
      }
      $("#select_medioNOTICIA option[value=''],#select_seccion option[value='']").removeAttr("disabled");
      $("#select_medioNOTICIA,#select_seccion").select2()
    })
    $("#select_seccion").on("change",function() {
      medio = $("#select_medioNOTICIA").val();
      medioTipo = $("#select_medioTipoNOTICIA").val();
      seccion = $("#select_seccion").val();
      m = userDATOS.noticiasSELECT("relevo",{"medio":medio,"mediotipo":medioTipo,"seccion":seccion})

      if(medio == "") {
        $("#select_medioNOTICIA").html("<option value=''></option>");
        for(var i in m.medio)
          $("#select_medioNOTICIA").append("<option value='" + i + "'>" + m.medio[i] + "</option>");
      }

      if(medioTipo == "") {
        $("#select_medioTipoNOTICIA").html("<option value=''></option>");
        for(var i in m.medio_tipo)
          $("#select_medioTipoNOTICIA").append("<option value='" + i + "'>" + m.medio_tipo[i] + "</option>");
      }

      $("#select_medioNOTICIA option[value=''],#select_medioTipoNOTICIA option[value='']").removeAttr("disabled");
      $("#select_medioNOTICIA,#select_medioTipoNOTICIA").select2()
    })

    userDATOS.eliminarNOTICIA = function() {
      if(window.noticiasCHECKED == null) userDATOS.notificacion(strings.noticia.sinSeleccion,"error");
      else if(Object.keys(window.noticiasCHECKED).length == 0) userDATOS.notificacion(strings.noticia.sinSeleccion,"error");
      else {
        $.MessageBox({
          buttonDone  : strings.btn.si,
          buttonFail  : strings.btn.no,
          message   : (Object.keys(window.noticiasCHECKED).length == 1 ? strings.noticia.seleccion[0] : strings.noticia.seleccion[1](Object.keys(window.noticiasCHECKED).length))
        }).done(function(data){
          changeM = {"ids":Object.keys(window.noticiasCHECKED),"data":data,"tipo":"eliminar"}
          userDATOS.change(changeM,"noticia","elim",1,1);
          scopeNoticias(angular.element($("#menu_noticias")).scope());
          tabla_noticia.draw();
          // }
          window.noticiasCHECKED = {};
        }).fail(function(){});
      }
    }

    userDATOS.relevarNOTICIA = function() {
      let clientes = null;
      userDATOS.busquedaTabla("cliente", function(d) {
        clientes = d;
      });
      if(window.noticiasCHECKED == null) userDATOS.notificacion(strings.noticia.sinSeleccion,"error");
      else if(Object.keys(window.noticiasCHECKED).length == 0) userDATOS.notificacion(strings.noticia.sinSeleccion,"error");
      else {
        let select = $("<select multiple>", {
            css : {
                "width"         : "100%",
                "margin-top"    : "1rem"
            }
        });
        let arr = {};
        for(var i in clientes)
        	if(arr[clientes[i]["id"]] === undefined) arr[clientes[i]["id"]] = clientes[i]["nombre"];
        for(var i in arr)
          select.append("<option value='" + i + "'>" + arr[i] + "</option>");

        $.MessageBox({
          buttonDone  : strings.btn.si,
          buttonFail  : strings.btn.no,
          message   : (Object.keys(window.noticiasCHECKED).length == 1 ? mssg = strings.noticia.relevo[0] : strings.noticia.relevo[1](Object.keys(window.noticiasCHECKED).length)),
          input   : select
        }).done(function(data){
          if($('tbody input[type="checkbox"]:checked').length == 1) {
            $('tbody input[type="checkbox"]:checked').each(function(){
                let o = null;
                userDATOS.busqueda({"value":$(this).val(),"tabla":"noticia"}, function(d) {
                  o = d;
                });
                let new_r = new Pyrus("noticiarelevo",false);
                for(var i in data) {
                  let nr = new_r.objetoLimpio();
                  nr["did_noticia"] = $(this).val();
                  nr["id_noticia"] = o.id_noticia;
                  nr["id_usuario"] = window.user_id;
                  nr["id_cliente"] = data[i];
                  new_r.guardar_1(nr);
                }
                userDATOS.change(o.id_noticia,"noticias","moderado",1);
                userDATOS.log(window.user_id,"Relevo de noticia",0,o.id_noticia,"noticias");

                userDATOS.change(o.id,"noticia","relevado",1);
                userDATOS.log(window.user_id,"Relevo de noticia",0,$(this).val(),"noticia");

                tabla_noticia.row( $(this).closest("tr") ).remove().draw();
                scopeNoticias(angular.element($("#menu_noticias")).scope());
            });
          } else {
            changeM = {"ids":Object.keys(window.noticiasCHECKED),"data":data,"tipo":"relevo"}
            userDATOS.change(changeM,"noticia","relevado",1,1);
            scopeNoticias(angular.element($("#menu_noticias")).scope());
            tabla_noticia.draw();
          }
          window.noticiasCHECKED = {};
        }).fail(function(){});
      }
    }
  });
  /**
   * Acciones de vista PROCESADAS
   * Solo accedido por usuarios nivel 1 y 2
   */
  app.controller("procesadas", function ($scope,$timeout,service_simat,factory_simat) {
    window.vista = "procesadas";
    $(".body > aside .nav_ul a[data-url='noticias']").closest("ul").find(".active").removeClass("active");
    $(".body > aside .nav_ul a[data-url='noticias']").addClass("active");

    service_simat.noticias($scope);
    factory_simat.load("noticias4");
    userDATOS.selectOption("select_medio","medio","medio");
    userDATOS.selectOption("select_medioAlcance","medio_tipo");
    userDATOS.selectOption("select_periodista","periodista");
    userDATOS.selectOption("select_medioTipo","");

    selectMEDIOS = userDATOS.noticiasSELECT("procesada");

    $scope.mediosSELECT = selectMEDIOS.medio;
    $scope.mediostipoSELECT = selectMEDIOS.medio_tipo;
    $scope.seccionSELECT = selectMEDIOS.seccion;
    $scope.unidadSELECT = selectMEDIOS.unidad;
    $(".select__2").select2();
    userDATOS.selectOption("select_medio","medio","medio");
    userDATOS.selectOption("select_medioAlcance","medio_tipo");
    userDATOS.selectOption("select_periodista","periodista");
    userDATOS.selectOption("select_medioTipo","");

    $("#btn_filtro").on("click",function() {
      let minDateFilter = $('#fecha_min').val();
      let maxDateFilter = $('#fecha_max').val();
      let medioFilter = $('#select_medioNOTICIA').val();
      let medioTipoFilter = $('#select_medioTipoNOTICIA').val();
      let tituloFilter = $('#titulo').val();
      let seccionFilter = $('#select_seccionBUSCADOR').val();
      let unidadFilter = $("#select_unidadNOTICIA").val();
      data = {"estado":2,"minDateFilter":minDateFilter,"maxDateFilter":maxDateFilter,"medioFilter":medioFilter,"medioTipoFilter":medioTipoFilter,"tituloFilter":tituloFilter,"seccionFilter":JSON.stringify(seccionFilter),"unidadFilter":unidadFilter}
      if(minDateFilter == "" && maxDateFilter == "" && medioFilter == "" && medioTipoFilter == "" && tituloFilter == "" && seccionFilter.length == 0 && unidadFilter == "") {
        userDATOS.notificacion(strings.faltan.datosBusqueda,"error");
        return false;
      }
      if(minDateFilter != "" && maxDateFilter != "") {
        if(dates.compare(dates.convert(maxDateFilter),dates.convert(minDateFilter)) < 0) {
          userDATOS.notificacion(strings.error.fechas,"error");
          return false;
        }
      }
      tabla_noticia.destroy();
      $("#t_data").html("");
      $("#t_data").addClass("animate-flicker")
      setTimeout(function() {
        userDATOS.dataTableNOTICIAS3("#t_data",data)
      },500)
    })

    $("#btn_limpiar").on("click",function() {
      $("#fecha_min").val("");
      $("#fecha_max").val("");
      $("#titulo").val("");
      if($("#select_seccionBUSCADOR").val().length == 0)
        $("#select_seccionBUSCADOR").empty().trigger("change");
      if($("#select_medioTipoNOTICIA").val() != "")
        $("#select_medioTipoNOTICIA").val("").trigger("change");
      if($("#select_medioNOTICIA").val() != "")
        $("#select_medioNOTICIA").val("").trigger("change");

      $("#select_medioNOTICIA,#select_medioTipoNOTICIA,#select_seccionBUSCADOR").select2();
      tabla_noticia.destroy();
      $("#t_data").addClass("animate-flicker")
      setTimeout(function() {
        userDATOS.dataTableNOTICIAS3("#t_data",{"estado":2})
      },50);
    })

    $("#select_medioNOTICIA").on("change",function() {
      medio = $("#select_medioNOTICIA").val();
      medioTipo = $("#select_medioTipoNOTICIA").val();
      seccion = $("#select_seccionBUSCADOR").val();
      unidad = $("#select_unidadNOTICIA").val();
      m = userDATOS.noticiasSELECT("procesar",{"medio":medio,"mediotipo":medioTipo,"seccion":seccion,"unidad":unidad})

      if(medioTipo == "") {
        $("#select_medioTipoNOTICIA").html("<option value=''></option>");
        for(var i in m.medio_tipo)
          $("#select_medioTipoNOTICIA").append("<option value='" + i + "'>" + m.medio_tipo[i] + "</option>");
      }

      if(seccion.length == 0) {
        $("#select_seccionBUSCADOR").html("<option value=''></option>");
        for(var i in m.seccion)
          $("#select_seccionBUSCADOR").append("<option value='" + i + "'>" + m.seccion[i] + "</option>");
      }

      if(unidad == "") {
        $("#select_unidadNOTICIA").html("<option value=''></option>");
        for(var i in m.unidad)
          $("#select_unidadNOTICIA").append("<option value='" + i + "'>" + m.unidad[i] + "</option>");
      }
      $("#select_medioTipoNOTICIA,#select_seccionBUSCADOR,#select_unidadNOTICIA").select2();
    })
    $("#select_medioTipoNOTICIA").on("change",function() {
      medio = $("#select_medioNOTICIA").val();
      medioTipo = $("#select_medioTipoNOTICIA").val();
      seccion = $("#select_seccionBUSCADOR").val();
      unidad = $("#select_unidadNOTICIA").val();
      m = userDATOS.noticiasSELECT("procesar",{"medio":medio,"mediotipo":medioTipo,"seccion":seccion,"unidad":unidad})

      if(medio == "") {
        $("#select_medioNOTICIA").html("<option value=''></option>");
        for(var i in m.medio)
          $("#select_medioNOTICIA").append("<option value='" + i + "'>" + m.medio[i] + "</option>");
      }

      if(seccion.length == 0) {
        $("#select_seccionBUSCADOR").html("<option value=''></option>");
        for(var i in m.seccion)
          $("#select_seccionBUSCADOR").append("<option value='" + i + "'>" + m.seccion[i] + "</option>");
      }

      if(unidad == "") {
        $("#select_unidadNOTICIA").html("<option value=''></option>");
        for(var i in m.unidad)
          $("#select_unidadNOTICIA").append("<option value='" + i + "'>" + m.unidad[i] + "</option>");
      }
      $("#select_medioNOTICIA,#select_seccionBUSCADOR,#select_unidadNOTICIA").select2()
    })
    $("#select_seccionBUSCADOR").on("change",function() {
      medio = $("#select_medioNOTICIA").val();
      medioTipo = $("#select_medioTipoNOTICIA").val();
      seccion = $("#select_seccionBUSCADOR").val();
      unidad = $("#select_unidadNOTICIA").val();
      m = userDATOS.noticiasSELECT("procesar",{"medio":medio,"mediotipo":medioTipo,"seccion":seccion,"unidad":unidad})

      if(medio == "") {
        $("#select_medioNOTICIA").html("<option value=''></option>");
        for(var i in m.medio)
          $("#select_medioNOTICIA").append("<option value='" + i + "'>" + m.medio[i] + "</option>");
      }

      if(medioTipo == "") {
        $("#select_medioTipoNOTICIA").html("<option value=''></option>");
        for(var i in m.medio_tipo)
          $("#select_medioTipoNOTICIA").append("<option value='" + i + "'>" + m.medio_tipo[i] + "</option>");
      }

      if(unidad == "") {
        $("#select_unidadNOTICIA").html("<option value=''></option>");
        for(var i in m.unidad)
          $("#select_unidadNOTICIA").append("<option value='" + i + "'>" + m.unidad[i] + "</option>");
      }

      $("#select_medioNOTICIA,#select_medioTipoNOTICIA,#select_unidadNOTICIA").select2()
    });
    $("#select_unidadNOTICIA").on("change",function() {
      medio = $("#select_medioNOTICIA").val();
      medioTipo = $("#select_medioTipoNOTICIA").val();
      seccion = $("#select_seccionBUSCADOR").val();
      unidad = $("#select_unidadNOTICIA").val();
      m = userDATOS.noticiasSELECT("procesar",{"medio":medio,"mediotipo":medioTipo,"seccion":seccion,"unidad":unidad})

      if(medio == "") {
        $("#select_medioNOTICIA").html("<option value=''></option>");
        for(var i in m.medio)
          $("#select_medioNOTICIA").append("<option value='" + i + "'>" + m.medio[i] + "</option>");
      }

      if(medioTipo == "") {
        $("#select_medioTipoNOTICIA").html("<option value=''></option>");
        for(var i in m.medio_tipo)
          $("#select_medioTipoNOTICIA").append("<option value='" + i + "'>" + m.medio_tipo[i] + "</option>");
      }

      if(seccion.length == 0) {
        $("#select_seccionBUSCADOR").html("<option value=''></option>");
        for(var i in m.seccion)
          $("#select_seccionBUSCADOR").append("<option value='" + i + "'>" + m.seccion[i] + "</option>");
      }

      $("#select_medioNOTICIA,#select_medioTipoNOTICIA,#select_seccionBUSCADOR").select2()
    });
    scopeNoticias = function($scope,key,value) {
      $scope.$apply(function () {
      	$scope.noticias[key] = $scope.noticias[key] + value;
      });
    }
    /**
     * Mostrar CLIENTES FINALES en donde publicar en MURO DE NOTICIAS
     */
    userDATOS.clippingNOTICIA = function() {
      let row = tabla_noticia.rows(".selected").data()[0];
      let noticia = null;
      let clientes = null;
      let idAgendaNacional = 12//
      let proceso = [];
      let procesos = null;
      let msg = "";
      userDATOS.busqueda({"value":row.id,"tabla":"noticia"}, function(noticia) {

        if(parseInt(noticia.estado_num) == 3) {
          userDATOS.notificacion("Noticia pre publicada en CLIENTE/S");
          return false;
        }
        if(parseInt(noticia.estado_num) == 4) {
          userDATOS.notificacion("Noticia publicada en CLIENTE/S");
          return false;
        }
        userDATOS.busqueda({"value":row.id,"tabla":"proceso","column":"did_noticia","retorno":0}, function(procesos) {
          for(var i in procesos) {
            if(parseInt(procesos[i]["id_cliente"]) == idAgendaNacional) {
              userDATOS.busqueda({"value":idAgendaNacional,"tabla":"cliente"},function(cliente) {
                msg = "<p class='m-0 text-center'>Noticia procesada en <strong>" + cliente.nombre + "</strong></p>";
              });
              continue;
            }
            proceso.push(procesos[i]["id_cliente"]);
          }

          
          userDATOS.busquedaUsuariosFinales(function(clientes) {
            for(var i in proceso) {
              if(clientes[proceso[i]] !== undefined) {
                msg += "<p class='m-0'>" + clientes[proceso[i]] + "</p>";
                delete clientes[proceso[i]];
              }
            }
            $.MessageBox({
              buttonDone  : strings.btn.si,
              buttonFail  : strings.btn.no,
              message     : strings.noticia.prePublicar(msg),
              input   : { 
                input_detalle  : {
                  type         : "texts",
                  label        : "Descripción (máx. 200 caracteres):",
                  title        : "Descripción de la noticia",
                  maxlength    : 200
                },
                select_tipo : {
                  type         : "selects",
                  label        : "Seleccione Cliente final para publicar",
                  title        : "cliente final",
                  options      : clientes.data,
                  default      : proceso
                },
              },
              filterDone  : function(data) {
                if(data.input_detalle == "")
                  return "Descripción necesaria"
              }
            }).done(function(data){
              userDATOS.notificacion((data.select_tipo.length == 0 ? strings.noticia.publicar[1] : strings.noticia.publicar[2]),"info",false);
              userDATOS.notificacion(strings.tablaReseteo,"warning",false);
              userDATOS.change(noticia.id,"noticia","estado",3);
              id_usuario = window.user_id;//USUARIO de OSAI que generó esto
              
              setTimeout(function() {
              //   data.forEach(cliente => {//<-- CLIENTES que puede interarsarle / Publicado en el INDEX
              //     aux = {};
              //     aux["id_noticia"] = noticia.id;//TABLA noticia <-- OJO
              //     aux["id_usuario_osai"] = cliente;
              //     /** 
              //      * Si se encuentra dentro del ARRAY proceso, significa que la noticia que se proceso
              //      * va dirigida al usuario seleccionado -> Se agrega el flag tipo_aviso = 1
              //      */
              //     if(proceso.includes(cliente))
              //       aux["tipo_aviso"] = 1;
                  
              //     userDATOS.insertDatos("osai_cliente",aux,function(id_osai_cliente) {
              //       userDATOS.log(window.user_id,"NOTICIA publicada",0,id_osai_cliente,"osai_cliente");
              //     },true);
              //     userDATOS.insertDatos("osai_notificacion",
              //       {"id_usuario":id_usuario,
              //       "id_noticia":noticia.id,
              //       "id_usuario_osai":cliente,
              //       "mensaje": data.input_detalle,
              //       "nivel": 0,
              //       "estado": 1});
              //   });

                selectMEDIOS = userDATOS.noticiasSELECT("procesada");
                tabla_noticia.draw();
                angular.element($(".submenu")).scope().mediosSELECT = selectMEDIOS.medio;
                angular.element($(".submenu")).scope().mediostipoSELECT = selectMEDIOS.medio_tipo;
                angular.element($(".submenu")).scope().seccionSELECT = selectMEDIOS.seccion;
                angular.element($(".submenu")).scope().unidadSELECT = selectMEDIOS.unidad;
                scopeNoticias(angular.element($(".submenu")).scope(),"procesadas",-1);
              },500);
            });
          },true);
        }, true);
      }, true);
    }

    userDATOS.submit = function(t) {
      let OBJ_data = {};
      let aux = $( t ).serializeArray();
      let flag = true;
      let return_ = null;
      if(userDATOS.validar("#" + t.id)) {
        if($("#" + t.id).data("tipo") == "clienteUnidad") {
          for(var i in aux)
            OBJ_data[aux[i]["name"]] = aux[i]["value"];
          frm_unidad = OBJ_data["frm_unidad"];
          delete OBJ_data["frm_unidad"];
          for(var i in window.ARR_cliente[frm_unidad]["valoracion"]) {
            window.ARR_cliente[frm_unidad]["valoracion"][i] = OBJ_data[i];
            delete OBJ_data[i];
          }

          window.ARR_cliente[frm_unidad]["tema"]["texto"] = "";
          $("#attr_temas").find("tr").each(function() {
            tr = $(this);
            if(window.ARR_cliente[frm_unidad]["nueva"] !== undefined) delete window.ARR_cliente[frm_unidad]["nueva"];
            if(window.ARR_cliente[frm_unidad]["tema"] === null) window.ARR_cliente[frm_unidad]["tema"] = {}
            if(window.ARR_cliente[frm_unidad]["tema"]["frm_tema_" + tr.find("td:nth-child(2) select").val()] === null) {
              window.ARR_cliente[frm_unidad]["tema"]["frm_tema_" + tr.find("td:nth-child(2) select").val()] = {};
              window.ARR_cliente[frm_unidad]["tema"]["frm_tema_" + tr.find("td:nth-child(2) select").val()]["valor"] = 0;
            }
            delete window.ARR_cliente[frm_unidad]["tema"]["frm_tema_" + tr.find("td:nth-child(2) select").val()]["NUEVO"]
            if(window.ARR_cliente[frm_unidad]["tema"]["frm_tema_" + tr.find("td:nth-child(2) select").val()]["DESACTIVADO"] === undefined) {
              if(window.ARR_cliente[frm_unidad]["tema"]["texto"] != "") window.ARR_cliente[frm_unidad]["tema"]["texto"] += ", ";
              title = "";
              switch (parseInt(tr.find("td:nth-child(3) input:checked").val())) {
                case 1:
                  title = "POSITIVO";
                  break;
                case 0:
                  title = "NEUTRO";
                  break;
                case -1:
                  title = "NEGATIVO";
                  break;
              }
              window.ARR_cliente[frm_unidad]["tema"]["texto"] += "<span title='" + title + "'>" + tr.find("td:nth-child(2) select option[value='" + tr.find("td:nth-child(2) select").val() + "']").text() + "</span>"
              window.ARR_cliente[frm_unidad]["tema"]["frm_tema_" + tr.find("td:nth-child(2) select").val()]["valor"] = tr.find("td:nth-child(3) input:checked").val();
            } else delete window.ARR_cliente[frm_unidad]["tema"]["frm_tema_" + tr.find("td:nth-child(2) select").val()];
          });
          flag = false
        } else if($("#" + t.id).data("tipo") == "actor") {
          $("#modal-table-actor").find("td:nth-child(2) select").each(function() {
            tr = $(this).closest("tr");
            window.ARR_actor[$(this).val()]["frm_emisor"] = (tr.find("td:nth-child(4) input").is(":checked") ? "1" : "0");
            window.ARR_actor[$(this).val()]["frm_img"] = (tr.find("td:nth-child(3) input").is(":checked") ? "1" : "0");
            window.ARR_actor[$(this).val()]["frm_valor"] = tr.find("td:nth-child(5) input:checked").val();
            window.ARR_actor[$(this).val()]["ACTIVO"] = 1
          });
          for(var i in window.ARR_actor) {
            if(window.ARR_actor[i]["ACTIVO"] !== undefined) delete window.ARR_actor[i]["ACTIVO"];
            else delete window.ARR_actor[i];
          }
        } else if($("#" + t.id).data("tipo") == "institucion") {
          $("#modal-table-institucion").find("td:nth-child(2) select").each(function() {
            tr = $(this).closest("tr");
            window.ARR_institucion[$(this).val()]["frm_emisor"] = (tr.find("td:nth-child(3) input").is(":checked") ? "1" : "0");
            window.ARR_institucion[$(this).val()]["frm_valor"] = tr.find("td:nth-child(4) input:checked").val();
            window.ARR_institucion[$(this).val()]["ACTIVO"] = 1
          });
          for(var i in window.ARR_institucion) {
            if(window.ARR_institucion[i]["ACTIVO"] !== undefined) delete window.ARR_institucion[i]["ACTIVO"];
            else delete window.ARR_institucion[i];
          }
        } else if($("#" + t.id).data("tipo") == "institucionCREATE") {
          let a = pyrusInstitucion.objeto["GUARDADO_ATTR"];
          let OBJ = {}
          for(var j in a) {
            OBJ[j] = null;

            if(a[j]["TIPO"] == "nulo")
              OBJ[j] = (t["frm_" + j].value == "" ? a[j]["TIPO"] : t["frm_" + j].value);
            if(a[j]["TIPO"] == "normal") {
              if(t["frm_" + j] === undefined) continue;
              OBJ[j] = t["frm_" + j].value;
            }
            if(a[j]["TIPO"] == "array") {
              OBJ[j] = [];
              for(var x in window[a[j]["VAR"]])
                OBJ[j].push(x)
            }
          }
          $("#" + t.id).find("input","button","select").attr("disabled")

          accion = pyrusInstitucion.guardar_1(OBJ);//
          if(accion.id !== null && accion.flag) {//
            userDATOS.log(window.user_id,"Alta de registro",0,accion.id,"attr_institucion");
            let elemento = null;
            userDATOS.busqueda({"value":accion.id,"tabla":"attr_institucion"},function(d) {
              elemento = d;
            });//traigo el nuevo registro
            if(elemento === null) {
              $("#modal").modal("hide");
              return_ = "institucion"
            }
          } else userDATOS.notificacion(strings.repetidoDatos,"error");
        } else if($("#" + t.id).data("tipo") == "actorCREATE") {
          let a = pyrusActor.objeto["GUARDADO_ATTR"]
          let OBJ = {}
          for(var j in a) {
            OBJ[j] = null;

            if(a[j]["TIPO"] == "nulo")
              OBJ[j] = (t["frm_" + j].value == "" ? a[j]["TIPO"] : t["frm_" + j].value);
            if(a[j]["TIPO"] == "normal") {
              if(t["frm_" + j] === undefined) continue;
              OBJ[j] = t["frm_" + j].value;
            }
            if(a[j]["TIPO"] == "array") {
              OBJ[j] = [];
              for(var x in window[a[j]["VAR"]])
                OBJ[j].push(x)
            }
          }
          $("#" + t.id).find("input","button","select").attr("disabled")
          accion = pyrusActor.guardar_1(OBJ);//
          if(accion.id !== null && accion.flag) {//
            userDATOS.log(window.user_id,"Alta de registro",0,accion.id,"actor");
            let elemento = null;
            userDATOS.busqueda({"value":accion.id,"tabla":"actor"},function(d) {
              elemento = d;
            });//traigo el nuevo registro
            if(elemento === null) {
              $("#modal").modal("hide");
              return_ = "actor"
            }
            window.ATTR = undefined;
          } else userDATOS.notificacion(strings.repetidoDatos,"error");
        }
        if(return_ === null) {
          if(flag) $("#modal").modal("hide");
          else angular.element($("#btn_cliente")).scope().unidadAnalisis(0)
        } else {
          if(return_ == "institucion") {
            angular.element($('#pantalla')).scope()["institucion"]()
            $("#modal").find(".select__2").select2()
          }
          if(return_ == "actor") {
            angular.element($('#pantalla')).scope()["actor"]()
            $("#modal").find(".select__2").select2()
          }
        }
      }
    }
    userDATOS.eliminarNOTICIAproceso = function() {
      $.MessageBox({
        buttonDone  : strings.btn.si,
        buttonFail  : strings.btn.no,
        message   : strings.noticia.eliminar[2]
      }).done(function(){
        let noticia = tabla_noticia.row('.selected').data();
        let noticiaSELECCIONADA = null;
        userDATOS.busqueda({"value":noticia.id,"tabla":"noticia"},function(d) {
          noticiaSELECCIONADA = d;
        });
        let noticiaproceso = null;
        userDATOS.busqueda({"value":noticiaSELECCIONADA.id_noticia,"tabla":"noticiasproceso","column":"id_noticia"},function() {
          noticiaproceso = d;
        });
        let proceso = null;
        userDATOS.busqueda({"value":noticiaSELECCIONADA.id_noticia,"tabla":"proceso","column":"id_noticia"},function() {
          proceso = d;
        });
        let actores = null;
        userDATOS.busqueda({"value":noticiaSELECCIONADA.id_noticia,"tabla":"noticiasactor","column":"id_noticia","retorno":0}, function(d) {
          actores = d;
        });
        let clientes = null;
        userDATOS.busqueda({"value":noticiaSELECCIONADA.id_noticia,"tabla":"noticiascliente","column":"id_noticia","retorno":0}, function(d) {
          clientes = d;
        });
        let instituciones = null;
        userDATOS.busqueda({"value":noticiaSELECCIONADA.id_noticia,"tabla":"noticiasinstitucion","column":"id_noticia","retorno":0}, function(d) {
          instituciones = d;
        });
        let procesoDATA = userDATOS.parseJSON(noticiaproceso.data);
        userDATOS.change(noticiaSELECCIONADA.id,"noticia","estado",0);
        userDATOS.change(noticiaSELECCIONADA.id_noticia,"noticias","estado",0);
        userDATOS.log(window.user_id,"Baja de proceso",0,noticiaSELECCIONADA.id_noticia,"noticias",1);
        userDATOS.log(window.user_id,"Baja de proceso",0,noticiaSELECCIONADA.id,"noticia",1);
        if(proceso !== null) {
          userDATOS.change(proceso.id,"proceso","elim","1");
          userDATOS.change(proceso.id,"proceso","did","-1");//para que no lo agarre en un posible recupero de noticias
        }
        if(noticiaproceso !== null) {
          userDATOS.change(noticiaproceso.id,"noticiasproceso","elim","1");
          userDATOS.change(noticiaproceso.id,"noticiasproceso","did","-1");
        }
        if(actores !== null) {
          for(var i in actores) {
            userDATOS.change(i,"noticiasactor","elim","1");
            userDATOS.change(i,"noticiasactor","did","-1");
          }
        }
        if(clientes !== null) {
          for(var i in clientes) {
            userDATOS.change(i,"noticiascliente","elim","1");
            userDATOS.change(i,"noticiascliente","did","-1");
          }
        }
        if(instituciones !== null) {
          for(var i in instituciones) {
            userDATOS.change(i,"noticiasinstitucion","elim","1");
            userDATOS.change(i,"noticiasinstitucion","did","-1");
          }
        }

        tabla_noticia.row('.selected').remove().draw();
        scopeNoticias(angular.element($("#menu_noticias")).scope(),"procesar",1);
        scopeNoticias(angular.element($("#menu_noticias")).scope(),"procesadas",-1);
      });
    }
    userDATOS.eliminarNOTICIAprocesada = function() {
      $.MessageBox({
        buttonDone  : "Si",
        buttonFail  : "No",
        message   : strings.noticia.eliminar[3]
      }).done(function(){
        let noticia = tabla_noticia.row('.selected').data();
        let procesoDATA = userDATOS.parseJSON(noticiaproceso.data);

        let noticiaSELECCIONADA = null;
        userDATOS.busqueda({"value":noticia.id,"tabla":"noticia"},function(d) {
          noticiaSELECCIONADA = d;
        });
        let noticiaproceso = null;
        userDATOS.busqueda({"value":noticiaSELECCIONADA.id_noticia,"tabla":"noticiasproceso","column":"id_noticia"},function() {
          noticiaproceso = d;
        });
        let proceso = null;
        userDATOS.busqueda({"value":noticiaSELECCIONADA.id_noticia,"tabla":"proceso","column":"id_noticia"},function() {
          proceso = d;
        });
        let actores = null;
        userDATOS.busqueda({"value":noticiaSELECCIONADA.id_noticia,"tabla":"noticiasactor","column":"id_noticia","retorno":0}, function(d) {
          actores = d;
        });
        let clientes = null;
        userDATOS.busqueda({"value":noticiaSELECCIONADA.id_noticia,"tabla":"noticiascliente","column":"id_noticia","retorno":0}, function(d) {
          clientes = d;
        });
        let instituciones = null;
        userDATOS.busqueda({"value":noticiaSELECCIONADA.id_noticia,"tabla":"noticiasinstitucion","column":"id_noticia","retorno":0}, function(d) {
          instituciones = d;
        });

        let periodista = null;
        userDATOS.busqueda({"value":noticiaSELECCIONADA.id_noticia,"tabla":"noticiaperiodista","column":"id_noticia"}, function(d) {
          periodista = d;
        });

        userDATOS.change(noticiaSELECCIONADA.id,"noticia","elim",1);
        userDATOS.change(noticiaSELECCIONADA.id_noticia,"noticias","elim",1);
        userDATOS.log(window.user_id,"Baja de registro",0,noticiaSELECCIONADA.id_noticia,"noticias",1);
        userDATOS.log(window.user_id,"Baja de registro",0,noticiaSELECCIONADA.id,"noticia",1);

        if(periodista !== null) {
          userDATOS.change(periodista.id,"noticiaperiodista","elim","1");
        }
        if(proceso !== null) {
          userDATOS.change(proceso.id,"proceso","elim","1");
        }
        if(noticiaproceso !== null) {
          userDATOS.change(noticiaproceso.id,"noticiasproceso","elim","1");
        }
        if(actores !== null) {
          for(var i in actores) {
            userDATOS.change(i,"noticiasactor","elim","1");
          }
        }
        if(clientes !== null) {
          for(var i in clientes) {
            userDATOS.change(i,"noticiascliente","elim","1");
          }
        }
        if(instituciones !== null) {
          for(var i in instituciones) {
            userDATOS.change(i,"noticiasinstitucion","elim","1");
          }
        }

        tabla_noticia.row('.selected').remove().draw();
        scopeNoticias(angular.element($("#menu_noticias")).scope(),"total",-1);
        scopeNoticias(angular.element($("#menu_noticias")).scope(),"procesadas",-1);
      });
    }
    userDATOS.guardarEdicion = function(b) {
      angular.element("*[ng-controller=\"jsonController\"]").scope().procesar(1);
    }
    userDATOS.permitirEditar = function(b) {
      let aux = null;
      userDATOS.busqueda({"value":window.noticiaSELECCIONADA.id,"tabla":"noticia"}, function(d) {
        aux = d;
      });
      if(parseInt(aux.estado) == 6) {
        userDATOS.notificacion(strings.noticia.abierta[0],"warning",false);
        return false;
      }
      $.MessageBox({
        buttonDone  : "Si",
        buttonFail  : "No",
        message   : strings.noticia.editar[0]
      }).done(function(){
        $(b).parent().append('<button onclick="userDATOS.guardarEdicion(this)" class="btn btn-sm btn-success position-absolute" style="left: 15px;top: 20px;"><i class="fas fa-check"></i></button>');
        $(b).remove();
        userDATOS.change(noticiaSELECCIONADA.id,"noticia","estado",6);//CAMBIO estado
        window.noticiaSELECCIONADAeditar = true;
        $("#form_ATTR,.attr_noticias").removeClass("d-none");
        $(".select__2").removeAttr("disabled");
        $("#select_medio,#select_medioAlcance").attr("disabled",true);
        $(".select__2").select2();
        $("#periodista_noticia").addClass("d-none");
        $("#select_periodista").closest(".input-group").removeClass("d-none");
        $("#select_periodista").closest(".input-group").addClass("d-flex");

        if(window.noticiaSELECCIONADA.video === null) {
          $("#video_noticia").removeClass("d-none");
          $("#video_noticia").find("div").html("<input placeholder='Link de video' name='frm_video' type='text' class='form-control' />");
        } else $("#video_noticia").find("div").html("<input placeholder='Link de video' name='frm_video' type='text' class='form-control' value='" + window.noticiaSELECCIONADA.video + "' />");
      });
    }

    userDATOS.createInstitucion = function() {
      userDATOS.modal(null,pyrusInstitucion,"institucionCREATE");
    }
    userDATOS.createActor = function() {
      userDATOS.modal(null,pyrusActor,"actorCREATE");
    }
    // V. PROCESADAS
    /**
     * Función que maneja las unidades de análisis o agenda de la noticia
     * Además, los temas y valoraciones que correspondan de cada uno
     * Actualizado
     */
    $scope.unidadAnalisis = function() {
      window.valoracionARR = undefined;
      let modal = $("#modal");
      userDATOS.busquedaTabla("cliente", function(clientes) {
        let selectCliente = "";
        selectCliente += "<option value=''></option>";
        let optionCliente = "";
        modal.find(".modal-title").text("UNIDAD DE ANÁLISIS");
        modal.find(".modal-dialog").addClass("modal-lg")
        modal.find(".modal-body").addClass("py-0");
        modal.find(".modal-body").append("<div class='modal-container'></div>");

        for(var i in clientes) {
          if(parseInt(clientes[i]["todos"])) selectCliente += "<optgroup label='AGENDA'><option value='" + i + "'>" + clientes[i]["nombre"] + "</option></optgroup>";
          else optionCliente += "<option value='" + i + "'>" + clientes[i]["nombre"] + "</option>";
        }
        selectCliente += "<optgroup label='UNIDAD DE ANÁLISIS'>" + optionCliente + "</optgroup>";
        selectCliente += "</select>";
        flag = true;
        if(window.noticiaSELECCIONADA !== undefined) {
          if(parseInt(window.noticiaSELECCIONADA.estado) == 2 && window.noticiaSELECCIONADAeditar === undefined) flag = false;
        }
        html = "";btn = "";
        html += '<div class="row">';
          html += "<div class='col-7 py-2'>";
            if(flag) {
              html += "<button type='button' onclick='userDATOS.addUnidad();' class='btn mx-auto d-block mb-2 btn-primary text-uppercase'>nueva unidad</button>";
            }
            html += '<div class="row">';
              html += "<div class='col'>";
                html += "<table class='table m-0' id='modal-table-unidad'>";
                  html += "<tbody>";
                    html += "<tr class='d-none'>" +
                        '<td class="px-0 ' + (window.noticiaSELECCIONADAeditar === undefined ? "d-none" : "") + '"><button type="button" class="btn bg-danger rounded-0 text-white" onclick="userDATOS.removeUnidad(this);"><i class="fas fa-times"></i></button></td>' +
                        '<td style="width:100%">' + "<select class='select__2 w-100' data-allow-clear='true' data-placeholder='SELECCIONE' required='true' name='frm_cliente-1' id='frm_cliente-0' onchange='userDATOS.unidadUnico(this);'>" + selectCliente + '</td>' +
                        '<td class="px-0"><button type="button" disabled class="btn bg-success rounded-0 text-white" onclick="userDATOS.updateUnidad(this);"><i class="fas fa-angle-right"></i></button></td>';
                    html += "</tr>";
                    html += "<tr>";
                        html += '<td class="px-0 ' + (window.noticiaSELECCIONADAeditar === undefined ? "d-none" : "") + '"><button type="button" class="btn bg-danger rounded-0 text-white" onclick="userDATOS.removeUnidad(this);"><i class="fas fa-times"></i></button></td>';
                      html += '<td style="width:100%">' + "<select class='select__2 w-100' data-allow-clear='true' data-placeholder='SELECCIONE' required='true' name='frm_cliente-1' id='frm_cliente-1' onchange='userDATOS.unidadUnico(this);'>" + selectCliente + '</td>';
                      html += '<td class="px-0"><button type="button" disabled class="btn bg-success rounded-0 text-white" onclick="userDATOS.updateUnidad(this);"><i class="fas fa-angle-right"></i></button></td>';
                    html += "</tr>";
                  
                  html += "</tbody>";
                html += "</table>";
              html += "</div>";
            html += "</div>";
          html += "</div>";
          html += "<div class='col-5 p-2 bg-light border-left d-flex'>";
            html += "<div class='align-self-center text-center text-uppercase w-100'>Seleccione unidad<i class='ml-2 fas fa-edit'></i></div>";
          html += "</div>";
        html += "</div>";
        
        modal.find(".modal-container").html(html);
        if(window.noticiaSELECCIONADAeditar !== undefined)
          modal.find(".modal-footer").html("<p class='m-0 text-muted'>Los elementos trabajados en este modal <strong>no necesitan confirmación</strong>, una vez seleccionados quedan preguardados</p>")
        modal.modal("show");
        
        if(window.ARR_cliente !== undefined) {
          for(var i in window.ARR_cliente) {
            $("#modal-table-unidad tr:last-child() td:nth-child(2)").find("select option[value='" + i + "']").removeAttr("disabled");
            $("#modal-table-unidad tr:last-child() td:nth-child(2)").find("select").val(i).trigger("change");
            if(window.noticiaSELECCIONADAeditar === undefined)
              $("#modal-table-unidad tr:last-child() td:nth-child(2)").find("select").attr("disabled",true);
            userDATOS.addUnidad();
          }
          if(window.noticiaSELECCIONADAeditar === undefined)
            $("#modal-table-unidad tr:last-child()").remove();
        }
      });
    }
    /**
     * Función que maneja a instituciones dentro de una noticia
     * Actualizado
     */
    $scope.institucion = function() {
      let modal = $("#modal");
      let selectInstitucion = "<select style='width:100%' class='select__2 w-100' data-allow-clear='true' data-placeholder='Institución' required='true' name='frm_institucion-1' onchange='userDATOS.institucionUnico(this);'>";
      let optionInstitucion = "<option value=''></option>";
      let instituciones = null;
      userDATOS.busquedaTabla("attr_institucion", function(d) {
        instituciones = d;
      });
      modal.find(".modal-title").text("INSTITUCIONES");
      for(var i in instituciones) 
        optionInstitucion += "<option value='" + i + "'>" + instituciones[i]["nombre"] + "</option>";
      selectInstitucion += optionInstitucion;
      selectInstitucion += "</select>";
      html = "";btn = "";
      flag = true;
      if(window.noticiaSELECCIONADA !== undefined) {
        if(parseInt(window.noticiaSELECCIONADA.estado) == 2) flag = false;
      }
      if(flag) {
        html += '<div class="d-flex justify-content-center mb-3">';
          html += '<div class="btn-group" role="group" aria-label="Botones">';
            html += "<button type='button' onclick='userDATOS.addInstitucion();' class='btn btn-primary text-uppercase'>nuevo institución</button>";
            if(parseInt(window.usuario.nivel) != 4)
              html += "<button type='button' onclick='userDATOS.createInstitucion();' class='btn btn-success text-uppercase'>crear institución</button>";
          html += "</div>";
        html += "</div>";
      }
      option = '<div class="btn-group" role="group" aria-label="Valoración">'
        option += '<label class="mb-0 btn bg-light disabled"><input disabled="true" onchange="userDATOS.optionInstitucion(this,1);" type="radio" name="frm_valor-1" value="1" /></label>';
        option += '<label class="mb-0 btn bg-light disabled"><input disabled="true" onchange="userDATOS.optionInstitucion(this,1);" type="radio" name="frm_valor-1" value="0" /></label>';
        option += '<label class="mb-0 btn bg-light disabled"><input disabled="true" onchange="userDATOS.optionInstitucion(this,1);" type="radio" name="frm_valor-1" value="-1" /></label>';
      option += '</div>';
      html += '<div class="row">';
        html += "<div class='col'>";
          html += "<table class='table m-0' id='modal-table-institucion'>";
            html += "<tbody>";

            html += "<tr class='d-none'>";
              html += '<td class="px-0 ' + (window.noticiaSELECCIONADAeditar === undefined ? "d-none" : "") + '"><button type="button" class="btn bg-danger rounded-0 text-white" onclick="userDATOS.removeInstitucion(this);"><i class="fas fa-times"></i></button></td>';
              html += '<td class="w-50">';
                html += "<select style='width:100%' class='select__2 w-100' data-allow-clear='true' data-placeholder='Institución' required='true' name='frm_institucion-0' onchange='userDATOS.institucionUnico(this);'>" + optionInstitucion + "</select>";
              html += '</td>';
              html += '<td class="px-0 w-50">';
                html += '<div class="d-flex align-items-center justify-content-end">';
                  html += '<div class="border-right pr-2 mr-2">';
                    html += '<label class="m-0 d-block w-100 text-uppercase position-relative"><input onchange="userDATOS.optionInstitucion(this,0);" disabled="true" class="position-absolute" style="bottom:2px; left: -15px;" type="checkbox" data-check="emisor" value="1" name="frm_emisor-1" />Emisor</label>';
                  html += '</div>';
                  html += '<div class="btn-group" role="group" aria-label="Valoración">'
                    html += '<label class="mb-0 btn bg-light disabled"><input disabled="true" onchange="userDATOS.optionInstitucion(this,1);" type="radio" name="frm_valor-0" value="1" /></label>';
                    html += '<label class="mb-0 btn bg-light disabled"><input disabled="true" onchange="userDATOS.optionInstitucion(this,1);" type="radio" name="frm_valor-0" value="0" /></label>';
                    html += '<label class="mb-0 btn bg-light disabled"><input disabled="true" onchange="userDATOS.optionInstitucion(this,1);" type="radio" name="frm_valor-0" value="-1" /></label>';
                  html += '</div>';
                html += '</div>';
              html += '</td>';
            html += "</tr>";

            html += "<tr>";
              html += '<td class="px-0 ' + (window.noticiaSELECCIONADAeditar === undefined ? "d-none" : "") + '"><button type="button" class="btn bg-danger rounded-0 text-white" onclick="userDATOS.removeInstitucion(this);"><i class="fas fa-times"></i></button></td>';
              html += '<td class="w-50">';
                html += selectInstitucion;
              html += '</td>';
              html += '<td class="px-0 w-50">';
                html += '<div class="d-flex align-items-center justify-content-end">';
                  html += '<div class="border-right pr-2 mr-2">';
                    html += '<label class="m-0 d-block w-100 text-uppercase position-relative"><input onchange="userDATOS.optionInstitucion(this,0);" disabled="true" class="position-absolute" style="bottom:2px; left: -15px;" type="checkbox" data-check="emisor" value="1" name="frm_emisor-1" />Emisor</label>';
                  html += '</div>';
                  html += option;
                html += '</div>';
              html += '</td>';
            html += "</tr>";
          
            html += "</tbody>";
          html += "</table>";
        html += "</div>";
      html += "</div>";
      
      modal.find(".modal-body").html(html);
      if(window.noticiaSELECCIONADAeditar !== undefined)
        modal.find(".modal-footer").html("<p class='m-0 text-muted'>Los elementos trabajados en este modal <strong>no necesitan confirmación</strong>, una vez seleccionados quedan preguardados</p>")
      modal.modal("show");

      
      if(window.ARR_institucion !== undefined) {
        for(var i in window.ARR_institucion) {
          $("#modal-table-institucion tr:last-child() td:nth-child(2)").find("select option[value='" + i + "']").removeAttr("disabled");
          $("#modal-table-institucion tr:last-child() td:nth-child(2)").find("select").val(i).trigger("change");

          emisorTR = $("#modal-table-institucion tr:last-child()").find("td:last-child() > div > div:first-child label")[0];
          if(parseInt(window.ARR_institucion[i]["frm_emisor"]))
            emisorTR.children[0].checked = true;

          valoracionTR = $("#modal-table-institucion tr:last-child()").find("td:last-child() > div > div:last-child");
          $(valoracionTR).find("input[value='" + window.ARR_institucion[i]["frm_valor"] + "']").attr("checked",true);
          
          if(window.noticiaSELECCIONADAeditar === undefined) {
            $("#modal-table-institucion tr:last-child() td:nth-child(2)").find("select").attr("disabled",true);
            $("#modal-table-institucion tr:last-child()").find("input").attr("disabled",true);
            $("#modal-table-institucion tr:last-child()").find("label.btn").addClass("disabled");
          }
          userDATOS.addInstitucion();
        }
        if(window.noticiaSELECCIONADAeditar === undefined)
          $("#modal-table-institucion tr:last-child()").remove();
      }
    }
    /**
     * Función que maneja a actores dentro de una noticia
     * ACTUALIZADO
     */
    $scope.actor = function() {
      let modal = $("#modal");
      let actores = null;
      userDATOS.busquedaTabla("actor", function(d) {
        actores = d;
      });
      let selectActor = "<select style='width:100%' class='select__2 w-100' data-allow-clear='true' data-placeholder='Actor' required='true' name='frm_actor-1' onchange='userDATOS.actorUnico(this);'>";
      let optionActor = "<option value=''></option>";
      modal.find(".modal-title").text("ACTORES");
      for(var i in actores)
        optionActor += "<option value='" + i + "'>" + actores[i]["nombre"] + "</option>";
      selectActor += optionActor;
      selectActor += "</select>";
      flag = true;
      if(window.noticiaSELECCIONADA !== undefined) {
        if(parseInt(window.noticiaSELECCIONADA.estado) == 2) flag = false;
      }
      html = "";btn = "";
      if(flag) {
        //
        html += '<div class="d-flex justify-content-center mb-3">';
          html += '<div class="btn-group" role="group" aria-label="Valoración">';
            html += "<button type='button' onclick='userDATOS.addActor();' class='btn btn-primary text-uppercase'>nuevo actor</button>";
            if(parseInt(window.usuario.nivel) != 4)
              html += "<button type='button' onclick='userDATOS.createActor();' class='btn btn-success text-uppercase'>crear actor</button>";
          html += "</div>";
        html += "</div>";
      }
      option = '<div class="btn-group" role="group" aria-label="Valoración">'
        option += '<label class="mb-0 btn bg-light disabled"><input disabled="true" onchange="userDATOS.optionActor(this,1);" type="radio" name="frm_valor-1" value="1" /></label>';
        option += '<label class="mb-0 btn bg-light disabled"><input disabled="true" onchange="userDATOS.optionActor(this,1);" type="radio" name="frm_valor-1" value="0" /></label>';
        option += '<label class="mb-0 btn bg-light disabled"><input disabled="true" onchange="userDATOS.optionActor(this,1);" type="radio" name="frm_valor-1" value="-1" /></label>';
      option += '</div>';
      //////
      html += '<div class="row">';
        html += "<div class='col'>";
          html += "<table class='table m-0' id='modal-table-actor'>";
            html += "<tbody>";
              html += "<tr class='d-none'>";
                html += '<td class="px-0 ' + (window.noticiaSELECCIONADAeditar === undefined ? "d-none" : "") + '"><button type="button" class="btn bg-danger rounded-0 text-white" onclick="userDATOS.removeActor(this);"><i class="fas fa-times"></i></button></td>';
                html += '<td class="w-50">';
                  html += "<select style='width:100%' class='select__2 w-100' data-allow-clear='true' data-placeholder='Actor' required='true' name='frm_actor-0' onchange='userDATOS.actorUnico(this);'>" + optionActor + "</select>"; 
                html += '</td>';
                html += '<td class="px-0 w-50">';
                  html += '<div class="d-flex align-items-center justify-content-end">';
                    html += '<div class="border-right pr-2 mr-2">';
                      html += '<label class="m-0 d-block border-bottom w-100 text-uppercase position-relative"><input onchange="userDATOS.optionActor(this,0);" disabled="true" class="position-absolute" style="bottom:2px; left: -15px;" type="checkbox" data-check="img" value="1" name="frm_img-0" />Imagen</label>';
                      html += '<label class="m-0 d-block w-100 text-uppercase position-relative"><input onchange="userDATOS.optionActor(this,0);" disabled="true" class="position-absolute" style="bottom:2px; left: -15px;" type="checkbox" data-check="emisor" value="1" name="frm_emisor-0" />Emisor</label>';
                    html += '</div>';
                    html += '<div class="btn-group" role="group" aria-label="Valoración">';
                      html += '<label class="mb-0 btn bg-light disabled"><input disabled="true" onchange="userDATOS.optionActor(this,1);" type="radio" name="frm_valor-0" value="1" /></label>';
                      html += '<label class="mb-0 btn bg-light disabled"><input disabled="true" onchange="userDATOS.optionActor(this,1);" type="radio" name="frm_valor-0" value="0" /></label>';
                      html += '<label class="mb-0 btn bg-light disabled"><input disabled="true" onchange="userDATOS.optionActor(this,1);" type="radio" name="frm_valor-0" value="-1" /></label>';
                    html += '</div>';
                  html += '</div>';
                html += '</td>';
              html += "</tr>";
              ////////
              html += "<tr>";
                html += '<td class="px-0 ' + (window.noticiaSELECCIONADAeditar === undefined ? "d-none" : "") + '"><button type="button" class="btn bg-danger rounded-0 text-white" onclick="userDATOS.removeActor(this);"><i class="fas fa-times"></i></button></td>';
                html += '<td class="w-50">';
                  html += selectActor; 
                html += '</td>';
                html += '<td class="px-0 w-50">';
                  html += '<div class="d-flex align-items-center justify-content-end">';
                    html += '<div class="border-right pr-2 mr-2">';
                      html += '<label class="m-0 d-block border-bottom w-100 text-uppercase position-relative"><input onchange="userDATOS.optionActor(this,0);" disabled="true" class="position-absolute" style="bottom:2px; left: -15px;" type="checkbox" data-check="img" value="1" name="frm_img-1" />Imagen</label>';
                      html += '<label class="m-0 d-block w-100 text-uppercase position-relative"><input onchange="userDATOS.optionActor(this,0);" disabled="true" class="position-absolute" style="bottom:2px; left: -15px;" type="checkbox" data-check="emisor" value="1" name="frm_emisor-1" />Emisor</label>';
                    html += '</div>';
                    html += option;
                  html += '</div>';
                html += '</td>';
              html += "</tr>";
            html += "</tbody>";
          html += "</table>";
        html += "</div>";
      html += "</div>";

      modal.find(".modal-body").html(html);
      if(window.noticiaSELECCIONADAeditar !== undefined)
        modal.find(".modal-footer").html("<p class='m-0 text-muted'>Los elementos trabajados en este modal <strong>no necesitan confirmación</strong>, una vez seleccionados quedan preguardados</p>")
      modal.modal("show");

      if(window.ARR_actor !== undefined) {
        for(var i in window.ARR_actor) {
          $("#modal-table-actor tr:last-child() td:nth-child(2)").find("select option[value='" + i + "']").removeAttr("disabled");
          $("#modal-table-actor tr:last-child() td:nth-child(2)").find("select").val(i).trigger("change");

          imagenTR = $("#modal-table-actor tr:last-child()").find("td:last-child() > div > div:first-child label:first-child()")[0];
          if(parseInt(window.ARR_actor[i]["frm_img"]))
            imagenTR.children[0].checked = true;

          emisorTR = $("#modal-table-actor tr:last-child()").find("td:last-child() > div > div:first-child label:last-child()")[0];
          if(parseInt(window.ARR_actor[i]["frm_emisor"]))
            emisorTR.children[0].checked = true;

          valoracionTR = $("#modal-table-actor tr:last-child()").find("td:last-child() > div > div:last-child");
          $(valoracionTR).find("input[value='" + window.ARR_actor[i]["frm_valor"] + "']").attr("checked",true);
          
          if(window.noticiaSELECCIONADAeditar === undefined) {
            $("#modal-table-actor tr:last-child()").find("input").attr("disabled",true);
            $("#modal-table-actor tr:last-child()").find("label.btn").addClass("disabled");
          }
          userDATOS.addActor();
        }
        if(window.noticiaSELECCIONADAeditar === undefined)
          $("#modal-table-actor tr:last-child()").remove()
      }
    }
  });
  /**
   * Acciones de vista PROCESAR
   * Solo accedido por usuarios nivel 1 y 2
   */
  app.controller("procesar", function ($scope,$timeout,service_simat,factory_simat) {
    window.vista = "procesar";
    $(".body > aside .nav_ul a[data-url='noticias']").closest("ul").find(".active").removeClass("active");
    $(".body > aside .nav_ul a[data-url='noticias']").addClass("active");
    service_simat.noticias($scope);

    factory_simat.load("noticias3");

    selectMEDIOS = userDATOS.noticiasSELECT("procesar");

    $scope.mediosSELECT = selectMEDIOS.medio;
    $scope.mediostipoSELECT = selectMEDIOS.medio_tipo;
    $scope.seccionSELECT = selectMEDIOS.seccion;
    $scope.unidadSELECT = selectMEDIOS.unidad;
    $(".select__2").select2();

    userDATOS.selectOption("select_medio","medio","medio");
    userDATOS.selectOption("select_medioAlcance","medio_tipo");
    userDATOS.selectOption("select_periodista","periodista");
    userDATOS.selectOption("select_medioTipo","");
    // service_simat.option($scope);

    $(".note-editable").bind({
      paste : function() {
    		setTimeout(function() {
    			window.cuerpoPEGADO = $(".note-editable").html();
    		}, 0 | Math.random() * 100);
      }
    });

    $("#btn_filtro").on("click",function() {
      let minDateFilter = $('#fecha_min').val();
      let maxDateFilter = $('#fecha_max').val();
      let medioFilter = $('#select_medioNOTICIA').val();
      let medioTipoFilter = $('#select_medioTipoNOTICIA').val();
      let tituloFilter = $('#titulo').val();
      let seccionFilter = $('#select_seccionBUSCADOR').val();
      let unidadFilter = $("#select_unidadNOTICIA").val();
      data = {"moderado":1,"minDateFilter":minDateFilter,"maxDateFilter":maxDateFilter,"medioFilter":medioFilter,"medioTipoFilter":medioTipoFilter,"tituloFilter":tituloFilter,"seccionFilter":JSON.stringify(seccionFilter),"unidadFilter":unidadFilter}
      if(minDateFilter == "" && maxDateFilter == "" && medioFilter == "" && medioTipoFilter == "" && tituloFilter == "" && seccionFilter.length == 0 && unidadFilter == "") {
        userDATOS.notificacion(strings.faltan.datosBusqueda,"error");
        return false;
      }
      if(minDateFilter != "" && maxDateFilter != "") {
        if(dates.compare(dates.convert(maxDateFilter),dates.convert(minDateFilter)) < 0) {
          userDATOS.notificacion(strings.error.fechas,"error");
          return false;
        }
      }
      tabla_noticia.destroy();
      $("#t_data").html("");
      $("#t_data").addClass("animate-flicker")
      setTimeout(function() {
        userDATOS.dataTableNOTICIAS("#t_data",data)
      },500);
      //tabla_noticia.draw();
    })
    $("#btn_limpiar").on("click",function() {
      $("#fecha_min").val("");
      $("#fecha_max").val("");
      $("#titulo").val("");

      
      if($("#select_seccionBUSCADOR").val().length == 0)
        $("#select_seccionBUSCADOR").empty().trigger("change");
      if($("#select_unidadNOTICIA").val().length == 0)
        $("#select_unidadNOTICIA").empty().trigger("change");
        
      if($("#select_medioTipoNOTICIA").val() != "")
        $("#select_medioTipoNOTICIA").val("").trigger("change");
      if($("#select_medioNOTICIA").val() != "")
        $("#select_medioNOTICIA").val("").trigger("change");

      tabla_noticia.destroy();
      $("#t_data").html("");
      $("#t_data").addClass("animate-flicker")
      setTimeout(function() {
        userDATOS.dataTableNOTICIAS("#t_data",{"moderado":1});
      },50);
    })
    $("#select_medioNOTICIA").on("change",function() {
      medio = $("#select_medioNOTICIA").val();
      medioTipo = $("#select_medioTipoNOTICIA").val();
      seccion = $("#select_seccionBUSCADOR").val();
      unidad = $("#select_unidadNOTICIA").val();
      m = userDATOS.noticiasSELECT("procesar",{"medio":medio,"mediotipo":medioTipo,"seccion":seccion,"unidad":unidad})

      if(medioTipo == "") {
        $("#select_medioTipoNOTICIA").html("<option value=''></option>");
        for(var i in m.medio_tipo)
          $("#select_medioTipoNOTICIA").append("<option value='" + i + "'>" + m.medio_tipo[i] + "</option>");
      }

      if(seccion.length == 0) {
        $("#select_seccionBUSCADOR").html("<option value=''></option>");
        for(var i in m.seccion)
          $("#select_seccionBUSCADOR").append("<option value='" + i + "'>" + m.seccion[i] + "</option>");
      }

      if(unidad == "") {
        $("#select_unidadNOTICIA").html("<option value=''></option>");
        for(var i in m.unidad)
          $("#select_unidadNOTICIA").append("<option value='" + i + "'>" + m.unidad[i] + "</option>");
      }
      $("#select_medioTipoNOTICIA,#select_seccionBUSCADOR,#select_unidadNOTICIA").select2();
    })
    $("#select_medioTipoNOTICIA").on("change",function() {
      medio = $("#select_medioNOTICIA").val();
      medioTipo = $("#select_medioTipoNOTICIA").val();
      seccion = $("#select_seccionBUSCADOR").val();
      unidad = $("#select_unidadNOTICIA").val();
      m = userDATOS.noticiasSELECT("procesar",{"medio":medio,"mediotipo":medioTipo,"seccion":seccion,"unidad":unidad})

      if(medio == "") {
        $("#select_medioNOTICIA").html("<option value=''></option>");
        for(var i in m.medio)
          $("#select_medioNOTICIA").append("<option value='" + i + "'>" + m.medio[i] + "</option>");
      }

      if(seccion.length == 0) {
        $("#select_seccionBUSCADOR").html("<option value=''></option>");
        for(var i in m.seccion)
          $("#select_seccionBUSCADOR").append("<option value='" + i + "'>" + m.seccion[i] + "</option>");
      }

      if(unidad == "") {
        $("#select_unidadNOTICIA").html("<option value=''></option>");
        for(var i in m.unidad)
          $("#select_unidadNOTICIA").append("<option value='" + i + "'>" + m.unidad[i] + "</option>");
      }
      $("#select_medioNOTICIA,#select_seccionBUSCADOR,#select_unidadNOTICIA").select2()
    })
    $("#select_seccionBUSCADOR").on("change",function() {
      medio = $("#select_medioNOTICIA").val();
      medioTipo = $("#select_medioTipoNOTICIA").val();
      seccion = $("#select_seccionBUSCADOR").val();
      unidad = $("#select_unidadNOTICIA").val();
      m = userDATOS.noticiasSELECT("procesar",{"medio":medio,"mediotipo":medioTipo,"seccion":seccion,"unidad":unidad})

      if(medio == "") {
        $("#select_medioNOTICIA").html("<option value=''></option>");
        for(var i in m.medio)
          $("#select_medioNOTICIA").append("<option value='" + i + "'>" + m.medio[i] + "</option>");
      }

      if(medioTipo == "") {
        $("#select_medioTipoNOTICIA").html("<option value=''></option>");
        for(var i in m.medio_tipo)
          $("#select_medioTipoNOTICIA").append("<option value='" + i + "'>" + m.medio_tipo[i] + "</option>");
      }

      if(unidad == "") {
        $("#select_unidadNOTICIA").html("<option value=''></option>");
        for(var i in m.unidad)
          $("#select_unidadNOTICIA").append("<option value='" + i + "'>" + m.unidad[i] + "</option>");
      }

      $("#select_medioNOTICIA,#select_medioTipoNOTICIA,#select_unidadNOTICIA").select2()
    });
    $("#select_unidadNOTICIA").on("change",function() {
      medio = $("#select_medioNOTICIA").val();
      medioTipo = $("#select_medioTipoNOTICIA").val();
      seccion = $("#select_seccionBUSCADOR").val();
      unidad = $("#select_unidadNOTICIA").val();
      m = userDATOS.noticiasSELECT("procesar",{"medio":medio,"mediotipo":medioTipo,"seccion":seccion,"unidad":unidad})

      if(medio == "") {
        $("#select_medioNOTICIA").html("<option value=''></option>");
        for(var i in m.medio)
          $("#select_medioNOTICIA").append("<option value='" + i + "'>" + m.medio[i] + "</option>");
      }

      if(medioTipo == "") {
        $("#select_medioTipoNOTICIA").html("<option value=''></option>");
        for(var i in m.medio_tipo)
          $("#select_medioTipoNOTICIA").append("<option value='" + i + "'>" + m.medio_tipo[i] + "</option>");
      }

      if(seccion.length == 0) {
        $("#select_seccionBUSCADOR").html("<option value=''></option>");
        for(var i in m.seccion)
          $("#select_seccionBUSCADOR").append("<option value='" + i + "'>" + m.seccion[i] + "</option>");
      }

      $("#select_medioNOTICIA,#select_medioTipoNOTICIA,#select_seccionBUSCADOR").select2()
    });

    userDATOS.submit = function(t) {
      let OBJ_data = {};
      let aux = $( t ).serializeArray();
      let flag = true;
      let return_ = null;
      if(userDATOS.validar("#" + t.id)) {
        if($("#" + t.id).data("tipo") == "institucionCREATE") {
          let a = pyrusInstitucion.objeto["GUARDADO_ATTR"];
          let OBJ = {}
          for(var j in a) {
            OBJ[j] = null;

            if(a[j]["TIPO"] == "nulo")
              OBJ[j] = (t["frm_" + j].value == "" ? a[j]["TIPO"] : t["frm_" + j].value);
            if(a[j]["TIPO"] == "normal") {
              if(t["frm_" + j] === undefined) continue;
              OBJ[j] = t["frm_" + j].value;
            }
            if(a[j]["TIPO"] == "array") {
              OBJ[j] = [];
              for(var x in window[a[j]["VAR"]])
                OBJ[j].push(x)
            }
          }
          $("#" + t.id).find("input","button","select").attr("disabled")

          accion = pyrusInstitucion.guardar_1(OBJ);//
          if(accion.id !== null && accion.flag) {//
            userDATOS.log(window.user_id,"Alta de registro",0,accion.id,"attr_institucion");
            let elemento = null;
            userDATOS.busqueda({"value":accion.id,"tabla":"attr_institucion"},function(d) {
              elemento = d;
            });//traigo el nuevo registro
            if(elemento === null) {
              $("#modal").modal("hide");
              return_ = "institucion"
            }
          } else userDATOS.notificacion(strings.repetidoDatos,"error");
        } else if($("#" + t.id).data("tipo") == "actorCREATE") {
          let a = pyrusActor.objeto["GUARDADO_ATTR"]
          let OBJ = {}
          for(var j in a) {
            OBJ[j] = null;

            if(a[j]["TIPO"] == "nulo")
              OBJ[j] = (t["frm_" + j].value == "" ? a[j]["TIPO"] : t["frm_" + j].value);
            if(a[j]["TIPO"] == "normal") {
              if(t["frm_" + j] === undefined) continue;
              OBJ[j] = t["frm_" + j].value;
            }
            if(a[j]["TIPO"] == "array") {
              OBJ[j] = [];
              for(var x in window[a[j]["VAR"]])
                OBJ[j].push(x)
            }
          }
          $("#" + t.id).find("input","button","select").attr("disabled")
          accion = pyrusActor.guardar_1(OBJ);//
          if(accion.id !== null && accion.flag) {//
            userDATOS.log(window.user_id,"Alta de registro",0,accion.id,"actor");
            let elemento = null;
            userDATOS.busqueda({"value":accion.id,"tabla":"actor"}, function(d) {
              elemento = d;
            });//traigo el nuevo registro
            if(elemento === null) {
              $("#modal").modal("hide");
              return_ = "actor"
            }
            window.ATTR = undefined;
          } else userDATOS.notificacion(strings.repetidoDatos,"error");
        }
        if(return_ === null) {
          if(flag) $("#modal").modal("hide");
          else angular.element($("#btn_cliente")).scope().unidadAnalisis(0)
        } else {
          if(return_ == "institucion") {
            angular.element($('#pantalla')).scope()["institucion"]()
            $("#modal").find(".select__2").select2()
          }
          if(return_ == "actor") {
            angular.element("#pantalla").scope().actor()
          }
        }
      }
    }

    userDATOS.modalCLIENTE = function(i) {
      $scope.unidadAnalisis(i)
    }
    userDATOS.modalACTOR = function(i) {
      $scope.actor(i)
    }
    userDATOS.createInstitucion = function() {
      userDATOS.modal(null,pyrusInstitucion,"institucionCREATE");
    }
    userDATOS.createActor = function() {
      userDATOS.modal(null,pyrusActor,"actorCREATE");
    }

    $scope.buscar = function() {
      userDATOS.notificacion(strings.buscando.actores,"info",false);
      userDATOS.notificacion(strings.buscando.instituciones,"info",false);
      userDATOS.procesar_noticia(function(resultado) {
        setTimeout(function() {
          if(resultado["actores"] === undefined) userDATOS.notificacion(strings.busquedaSinResultado.actores,"warning");
          else {
            if(Object.keys(resultado["actores"]).length == 0) userDATOS.notificacion(strings.busquedaSinResultado.actores,"warning");
            else userDATOS.notificacion(strings.busquedaConResultado.actores,"success");
          }
          if(resultado["instituciones"] === undefined) userDATOS.notificacion(strings.busquedaSinResultado.instituciones,"warning");
          else {
            if(Object.keys(resultado["instituciones"]).length == 0) userDATOS.notificacion(strings.busquedaSinResultado.instituciones,"warning");
            else userDATOS.notificacion(strings.busquedaConResultado.instituciones,"success");
          }
        },1000);
      });
    }
    // V. PROCESAR
    /**
     * Función que maneja las unidades de análisis o agenda de la noticia
     * Además, los temas y valoraciones que correspondan de cada uno
     * Actualizado
     */
    $scope.unidadAnalisis = function() {
      window.valoracionARR = undefined;
      let modal = $("#modal");
      userDATOS.busquedaTabla("cliente", function(clientes) {
        let selectCliente = "";
        selectCliente += "<option value=''></option>";
        let optionCliente = "";
        modal.find(".modal-title").text("UNIDAD DE ANÁLISIS");
        modal.find(".modal-dialog").addClass("modal-lg")
        modal.find(".modal-body").addClass("py-0");
        modal.find(".modal-body").append("<div class='modal-container'></div>");

        for(var i in clientes) {
          if(parseInt(clientes[i]["todos"])) selectCliente += "<optgroup label='AGENDA'><option value='" + i + "'>" + clientes[i]["nombre"] + "</option></optgroup>";
          else optionCliente += "<option value='" + i + "'>" + clientes[i]["nombre"] + "</option>";
        }
        selectCliente += "<optgroup label='UNIDAD DE ANÁLISIS'>" + optionCliente + "</optgroup>";
        selectCliente += "</select>";
        flag = true;
        if(window.noticiaSELECCIONADA !== undefined) {
          if(parseInt(window.noticiaSELECCIONADA.estado) == 2) flag = false;
        }
        html = "";btn = "";
        html += '<div class="row">';
          html += "<div class='col-7 py-2'>";
            if(flag) {
              html += "<button type='button' onclick='userDATOS.addUnidad();' class='btn mx-auto d-block mb-2 btn-primary text-uppercase'>nueva unidad</button>";
            }
            html += '<div class="row">';
              html += "<div class='col'>";
                html += "<table class='table m-0' id='modal-table-unidad'>";
                  html += "<tbody>";
                    html += "<tr class='d-none'>" +
                        '<td class="px-0"><button type="button" class="btn bg-danger rounded-0 text-white" onclick="userDATOS.removeUnidad(this);"><i class="fas fa-times"></i></button></td>' +
                        '<td style="width:100%">' + "<select class='select__2 w-100' data-allow-clear='true' data-placeholder='SELECCIONE' required='true' name='frm_cliente-1' id='frm_cliente-0' onchange='userDATOS.unidadUnico(this);'>" + selectCliente + '</td>' +
                        '<td class="px-0"><button type="button" disabled class="btn bg-success rounded-0 text-white" onclick="userDATOS.updateUnidad(this);"><i class="fas fa-angle-right"></i></button></td>';
                    html += "</tr>";
                    html += "<tr>" +
                        '<td class="px-0"><button type="button" class="btn bg-danger rounded-0 text-white" onclick="userDATOS.removeUnidad(this);"><i class="fas fa-times"></i></button></td>' +
                        '<td style="width:100%">' + "<select class='select__2 w-100' data-allow-clear='true' data-placeholder='SELECCIONE' required='true' name='frm_cliente-1' id='frm_cliente-1' onchange='userDATOS.unidadUnico(this);'>" + selectCliente + '</td>' +
                        '<td class="px-0"><button type="button" disabled class="btn bg-success rounded-0 text-white" onclick="userDATOS.updateUnidad(this);"><i class="fas fa-angle-right"></i></button></td>';
                    html += "</tr>";
                  
                  html += "</tbody>";
                html += "</table>";
              html += "</div>";
            html += "</div>";
          html += "</div>";
          html += "<div class='col-5 p-2 bg-light border-left d-flex'>";
            html += "<div class='align-self-center text-center text-uppercase w-100'>Seleccione unidad<i class='ml-2 fas fa-edit'></i></div>";
          html += "</div>";
        html += "</div>";
        
        modal.find(".modal-container").html(html);
        modal.find(".modal-footer").html("<p class='m-0 text-muted'>Los elementos trabajados en este modal <strong>no necesitan confirmación</strong>, una vez seleccionados quedan preguardados</p>")
        modal.modal("show");
        
        if(window.ARR_cliente !== undefined) {
          for(var i in window.ARR_cliente) {
            $("#modal-table-unidad tr:last-child() td:nth-child(2)").find("select option[value='" + i + "']").removeAttr("disabled");
            $("#modal-table-unidad tr:last-child() td:nth-child(2)").find("select").val(i).trigger("change");
            userDATOS.addUnidad();
          }
        }
      });
    }
    /**
     * Función que maneja a instituciones dentro de una noticia
     * Actualizado
     */
    $scope.institucion = function() {
      let modal = $("#modal");
      let selectInstitucion = "<select style='width:100%' class='select__2 w-100' data-allow-clear='true' data-placeholder='Institución' required='true' name='frm_institucion-1' onchange='userDATOS.institucionUnico(this);'>";
      let optionInstitucion = "<option value=''></option>";
      let instituciones = null;
      userDATOS.busquedaTabla("attr_institucion", function(d) {
        instituciones = d;
      });
      modal.find(".modal-title").text("INSTITUCIONES");
      for(var i in instituciones) 
        optionInstitucion += "<option value='" + i + "'>" + instituciones[i]["nombre"] + "</option>";
      selectInstitucion += optionInstitucion;
      selectInstitucion += "</select>";
      html = "";btn = "";
      flag = true;
      if(window.noticiaSELECCIONADA !== undefined) {
        if(parseInt(window.noticiaSELECCIONADA.estado) == 2) flag = false;
      }
      if(flag) {
        html += '<div class="d-flex justify-content-center mb-3">';
          html += '<div class="btn-group" role="group" aria-label="Botones">';
            html += "<button type='button' onclick='userDATOS.addInstitucion();' class='btn btn-primary text-uppercase'>nuevo institución</button>";
            if(parseInt(window.usuario.nivel) != 4)
              html += "<button type='button' onclick='userDATOS.createInstitucion();' class='btn btn-success text-uppercase'>crear institución</button>";
          html += "</div>";
        html += "</div>";
      }
      option = '<div class="btn-group" role="group" aria-label="Valoración">'
        option += '<label class="mb-0 btn bg-light disabled"><input disabled="true" onchange="userDATOS.optionInstitucion(this,1);" type="radio" name="frm_valor-1" value="1" /></label>';
        option += '<label class="mb-0 btn bg-light disabled"><input disabled="true" onchange="userDATOS.optionInstitucion(this,1);" type="radio" name="frm_valor-1" value="0" /></label>';
        option += '<label class="mb-0 btn bg-light disabled"><input disabled="true" onchange="userDATOS.optionInstitucion(this,1);" type="radio" name="frm_valor-1" value="-1" /></label>';
      option += '</div>';
      html += '<div class="row">';
        html += "<div class='col'>";
          html += "<table class='table m-0' id='modal-table-institucion'>";
            html += "<tbody>";

            html += "<tr class='d-none'>";
              html += '<td class="px-0"><button type="button" class="btn bg-danger rounded-0 text-white" onclick="userDATOS.removeInstitucion(this);"><i class="fas fa-times"></i></button></td>';
              html += '<td class="w-50">';
                html += "<select style='width:100%' class='select__2 w-100' data-allow-clear='true' data-placeholder='Institución' required='true' name='frm_institucion-0' onchange='userDATOS.institucionUnico(this);'>" + optionInstitucion + "</select>";
              html += '</td>';
              html += '<td class="px-0 w-50">';
                html += '<div class="d-flex align-items-center justify-content-end">';
                  html += '<div class="border-right pr-2 mr-2">';
                    html += '<label class="m-0 d-block w-100 text-uppercase position-relative"><input onchange="userDATOS.optionInstitucion(this,0);" disabled="true" class="position-absolute" style="bottom:2px; left: -15px;" type="checkbox" data-check="emisor" value="1" name="frm_emisor-1" />Emisor</label>';
                  html += '</div>';
                  html += '<div class="btn-group" role="group" aria-label="Valoración">'
                    html += '<label class="mb-0 btn bg-light disabled"><input disabled="true" onchange="userDATOS.optionInstitucion(this,1);" type="radio" name="frm_valor-0" value="1" /></label>';
                    html += '<label class="mb-0 btn bg-light disabled"><input disabled="true" onchange="userDATOS.optionInstitucion(this,1);" type="radio" name="frm_valor-0" value="0" /></label>';
                    html += '<label class="mb-0 btn bg-light disabled"><input disabled="true" onchange="userDATOS.optionInstitucion(this,1);" type="radio" name="frm_valor-0" value="-1" /></label>';
                  html += '</div>';
                html += '</div>';
              html += '</td>';
            html += "</tr>";

            html += "<tr>";
              html += '<td class="px-0"><button type="button" class="btn bg-danger rounded-0 text-white" onclick="userDATOS.removeInstitucion(this);"><i class="fas fa-times"></i></button></td>';
              html += '<td class="w-50">';
                html += selectInstitucion;
              html += '</td>';
              html += '<td class="px-0 w-50">';
                html += '<div class="d-flex align-items-center justify-content-end">';
                  html += '<div class="border-right pr-2 mr-2">';
                    html += '<label class="m-0 d-block w-100 text-uppercase position-relative"><input onchange="userDATOS.optionInstitucion(this,0);" disabled="true" class="position-absolute" style="bottom:2px; left: -15px;" type="checkbox" data-check="emisor" value="1" name="frm_emisor-1" />Emisor</label>';
                  html += '</div>';
                  html += option;
                html += '</div>';
              html += '</td>';
            html += "</tr>";
          
            html += "</tbody>";
          html += "</table>";
        html += "</div>";
      html += "</div>";
      
      modal.find(".modal-body").html(html);
      modal.find(".modal-footer").html("<p class='m-0 text-muted'>Los elementos trabajados en este modal <strong>no necesitan confirmación</strong>, una vez seleccionados quedan preguardados</p>")
      modal.modal("show");

      
      if(window.ARR_institucion !== undefined) {
        for(var i in window.ARR_institucion) {
          $("#modal-table-institucion tr:last-child() td:nth-child(2)").find("select option[value='" + i + "']").removeAttr("disabled");
          $("#modal-table-institucion tr:last-child() td:nth-child(2)").find("select").val(i).trigger("change");

          emisorTR = $("#modal-table-institucion tr:last-child()").find("td:last-child() > div > div:first-child label")[0];
          if(parseInt(window.ARR_institucion[i]["frm_emisor"]))
            emisorTR.children[0].checked = true;

          valoracionTR = $("#modal-table-institucion tr:last-child()").find("td:last-child() > div > div:last-child");
          $(valoracionTR).find("input[value='" + window.ARR_institucion[i]["frm_valor"] + "']").attr("checked",true);
          userDATOS.addInstitucion();
        }
      }
    }
    /**
     * Función que maneja a actores dentro de una noticia
     * ACTUALIZADO
     */
    $scope.actor = function() {
      let modal = $("#modal");
      let actores = null;
      userDATOS.busquedaTabla("actor",function(d) {
        actores = d;
      });
      let selectActor = "<select style='width:100%' class='select__2 w-100' data-allow-clear='true' data-placeholder='Actor' required='true' name='frm_actor-1' onchange='userDATOS.actorUnico(this);'>";
      let optionActor = "<option value=''></option>";
      modal.find(".modal-title").text("ACTORES");
      for(var i in actores)
        optionActor += "<option value='" + i + "'>" + actores[i]["nombre"] + "</option>";
      selectActor += optionActor;
      selectActor += "</select>";
      flag = true;
      if(window.noticiaSELECCIONADA !== undefined) {
        if(parseInt(window.noticiaSELECCIONADA.estado) == 2) flag = false;
      }
      html = "";btn = "";
      if(flag) {
        //
        html += '<div class="d-flex justify-content-center mb-3">';
          html += '<div class="btn-group" role="group" aria-label="Valoración">';
            html += "<button type='button' onclick='userDATOS.addActor();' class='btn btn-primary text-uppercase'>nuevo actor</button>";
            if(parseInt(window.usuario.nivel) != 4)
              html += "<button type='button' onclick='userDATOS.createActor();' class='btn btn-success text-uppercase'>crear actor</button>";
          html += "</div>";
        html += "</div>";
      }
      option = '<div class="btn-group" role="group" aria-label="Valoración">'
        option += '<label class="mb-0 btn bg-light disabled"><input disabled="true" onchange="userDATOS.optionActor(this,1);" type="radio" name="frm_valor-1" value="1" /></label>';
        option += '<label class="mb-0 btn bg-light disabled"><input disabled="true" onchange="userDATOS.optionActor(this,1);" type="radio" name="frm_valor-1" value="0" /></label>';
        option += '<label class="mb-0 btn bg-light disabled"><input disabled="true" onchange="userDATOS.optionActor(this,1);" type="radio" name="frm_valor-1" value="-1" /></label>';
      option += '</div>';
      //////
      html += '<div class="row">';
        html += "<div class='col'>";
          html += "<table class='table m-0' id='modal-table-actor'>";
            html += "<tbody>";
              html += "<tr class='d-none'>";
                html += '<td class="px-0"><button type="button" class="btn bg-danger rounded-0 text-white" onclick="userDATOS.removeActor(this);"><i class="fas fa-times"></i></button></td>';
                html += '<td class="w-50">';
                  html += "<select style='width:100%' class='select__2 w-100' data-allow-clear='true' data-placeholder='Actor' required='true' name='frm_actor-0' onchange='userDATOS.actorUnico(this);'>" + optionActor + "</select>"; 
                html += '</td>';
                html += '<td class="px-0 w-50">';
                  html += '<div class="d-flex align-items-center justify-content-end">';
                    html += '<div class="border-right pr-2 mr-2">';
                      html += '<label class="m-0 d-block border-bottom w-100 text-uppercase position-relative"><input onchange="userDATOS.optionActor(this,0);" disabled="true" class="position-absolute" style="bottom:2px; left: -15px;" type="checkbox" data-check="img" value="1" name="frm_img-0" />Imagen</label>';
                      html += '<label class="m-0 d-block w-100 text-uppercase position-relative"><input onchange="userDATOS.optionActor(this,0);" disabled="true" class="position-absolute" style="bottom:2px; left: -15px;" type="checkbox" data-check="emisor" value="1" name="frm_emisor-0" />Emisor</label>';
                    html += '</div>';
                    html += '<div class="btn-group" role="group" aria-label="Valoración">';
                      html += '<label class="mb-0 btn bg-light disabled"><input disabled="true" onchange="userDATOS.optionActor(this,1);" type="radio" name="frm_valor-0" value="1" /></label>';
                      html += '<label class="mb-0 btn bg-light disabled"><input disabled="true" onchange="userDATOS.optionActor(this,1);" type="radio" name="frm_valor-0" value="0" /></label>';
                      html += '<label class="mb-0 btn bg-light disabled"><input disabled="true" onchange="userDATOS.optionActor(this,1);" type="radio" name="frm_valor-0" value="-1" /></label>';
                    html += '</div>';
                  html += '</div>';
                html += '</td>';
              html += "</tr>";
              ////////
              html += "<tr>";
                html += '<td class="px-0"><button type="button" class="btn bg-danger rounded-0 text-white" onclick="userDATOS.removeActor(this);"><i class="fas fa-times"></i></button></td>';
                html += '<td class="w-50">';
                  html += selectActor; 
                html += '</td>';
                html += '<td class="px-0 w-50">';
                  html += '<div class="d-flex align-items-center justify-content-end">';
                    html += '<div class="border-right pr-2 mr-2">';
                      html += '<label class="m-0 d-block border-bottom w-100 text-uppercase position-relative"><input onchange="userDATOS.optionActor(this,0);" disabled="true" class="position-absolute" style="bottom:2px; left: -15px;" type="checkbox" data-check="img" value="1" name="frm_img-1" />Imagen</label>';
                      html += '<label class="m-0 d-block w-100 text-uppercase position-relative"><input onchange="userDATOS.optionActor(this,0);" disabled="true" class="position-absolute" style="bottom:2px; left: -15px;" type="checkbox" data-check="emisor" value="1" name="frm_emisor-1" />Emisor</label>';
                    html += '</div>';
                    html += option;
                  html += '</div>';
                html += '</td>';
              html += "</tr>";
            html += "</tbody>";
          html += "</table>";
        html += "</div>";
      html += "</div>";

      modal.find(".modal-body").html(html);
      modal.find(".modal-footer").html("<p class='m-0 text-muted'>Los elementos trabajados en este modal <strong>no necesitan confirmación</strong>, una vez seleccionados quedan preguardados</p>")
      modal.modal("show");

      if(window.ARR_actor !== undefined) {
        for(var i in window.ARR_actor) {
          $("#modal-table-actor tr:last-child() td:nth-child(2)").find("select option[value='" + i + "']").removeAttr("disabled");
          $("#modal-table-actor tr:last-child() td:nth-child(2)").find("select").val(i).trigger("change");

          imagenTR = $("#modal-table-actor tr:last-child()").find("td:last-child() > div > div:first-child label:first-child()")[0];
          if(parseInt(window.ARR_actor[i]["frm_img"]))
            imagenTR.children[0].checked = true;

          emisorTR = $("#modal-table-actor tr:last-child()").find("td:last-child() > div > div:first-child label:last-child()")[0];
          if(parseInt(window.ARR_actor[i]["frm_emisor"]))
            emisorTR.children[0].checked = true;

          valoracionTR = $("#modal-table-actor tr:last-child()").find("td:last-child() > div > div:last-child");
          $(valoracionTR).find("input[value='" + window.ARR_actor[i]["frm_valor"] + "']").attr("checked",true);
          userDATOS.addActor();
        }
      }
    }

    userDATOS.deleteOBJ = function(o,i) {
      delete o[i];
    }
  });
  /**
   * Acciones de vista NOTICIAS
   * Solo accedido por usuarios nivel 1 y 2
   */
  app.controller("noticias", function ($scope,$timeout,service_simat,factory_simat) {
    $(".nav_ul a").closest("ul").find(".active").removeClass("active");
    $(".nav_ul a[data-url='noticias']").addClass("active");

    service_simat.noticias($scope);

    selectMEDIOS = userDATOS.noticiasSELECT();
    $scope.mediosSELECT = selectMEDIOS.medio;
    $scope.mediostipoSELECT = selectMEDIOS.medio_tipo;
    $scope.seccionSELECT = selectMEDIOS.seccion;

    $(".select__2").select2()
    factory_simat.load("noticias");

    $("#btn_filtro").on("click",function() {
      let minDateFilter = $('#fecha_min').val();
      let maxDateFilter = $('#fecha_max').val();
      let medioFilter = $('#select_medioNOTICIA').val();
      let medioTipoFilter = $('#select_medioTipoNOTICIA').val();
      let tituloFilter = $('#titulo').val();
      let seccionFilter = $('#select_seccion').val();
      data = {"minDateFilter":minDateFilter,"maxDateFilter":maxDateFilter,"medioFilter":medioFilter,"medioTipoFilter":medioTipoFilter,"tituloFilter":tituloFilter,"seccionFilter":JSON.stringify(seccionFilter)}
      if(minDateFilter == "" && maxDateFilter == "" && medioFilter == "" && medioTipoFilter == "" && tituloFilter == "" && seccionFilter.length == 0 && unidadFilter == "") {
        userDATOS.notificacion(strings.faltan.datosBusqueda,"error");
        return false;
      }
      if(minDateFilter != "" && maxDateFilter != "") {
        if(dates.compare(dates.convert(maxDateFilter),dates.convert(minDateFilter)) < 0) {
          userDATOS.notificacion(strings.error.fechas,"error");
          return false;
        }
      }
      
      tabla_noticia.destroy();
      $("#t_data").html("");
      $("#t_data").addClass("animate-flicker");
      setTimeout(function() {
        userDATOS.dataTableNOTICIAS("#t_data",data);
      },500);
    });
    $("#btn_limpiar").on("click",function() {
      $("#fecha_min").val("");
      $("#fecha_max").val("");
      $("#titulo").val("");
      if($("#select_seccion").val().length == 0)
        $("#select_seccion").empty().trigger("change");
      if($("#select_medioTipoNOTICIA").val() != "")
        $("#select_medioTipoNOTICIA").val("").trigger("change");
      if($("#select_medioNOTICIA").val() != "")
        $("#select_medioNOTICIA").val("").trigger("change");

      $("#select_medioNOTICIA,#select_medioTipoNOTICIA,#select_seccion").select2();
      
      tabla_noticia.destroy();
      $("#t_data").html("");
      $("#t_data").addClass("animate-flicker");
      setTimeout(function() {
        userDATOS.dataTableNOTICIAS("#t_data");
      },50);
    })
    $("#select_medioNOTICIA").on("change",function() {
      medio = $("#select_medioNOTICIA").val();
      medioTipo = $("#select_medioTipoNOTICIA").val();
      seccion = $("#select_seccion").val();
      m = userDATOS.noticiasSELECT("noticia",{"medio":medio,"mediotipo":medioTipo,"seccion":seccion})

      if(medioTipo == "") {
        $("#select_medioTipoNOTICIA").html("<option value=''></option>");
        for(var i in m.medio_tipo)
          $("#select_medioTipoNOTICIA").append("<option value='" + i + "'>" + m.medio_tipo[i] + "</option>");
      }

      if(seccion.length == 0) {
        $("#select_seccion").html("<option value=''></option>");
        for(var i in m.seccion)
          $("#select_seccion").append("<option value='" + i + "'>" + m.seccion[i] + "</option>");
      }
      $("#select_medioTipoNOTICIA option[value=''],#select_seccion option[value='']").removeAttr("disabled");
      $("#select_medioTipoNOTICIA,#select_seccion").select2()
    })
    $("#select_medioTipoNOTICIA").on("change",function() {
      medio = $("#select_medioNOTICIA").val();
      medioTipo = $("#select_medioTipoNOTICIA").val();
      seccion = $("#select_seccion").val();
      m = userDATOS.noticiasSELECT("noticia",{"medio":medio,"mediotipo":medioTipo,"seccion":seccion})

      if(medio == "") {
        $("#select_medioNOTICIA").html("<option value=''></option>");
        for(var i in m.medio)
          $("#select_medioNOTICIA").append("<option value='" + i + "'>" + m.medio[i] + "</option>");
      }

      if(seccion.length == 0) {
        $("#select_seccion").html("<option value=''></option>");
        for(var i in m.seccion)
          $("#select_seccion").append("<option value='" + i + "'>" + m.seccion[i] + "</option>");
      }
      $("#select_medioNOTICIA option[value=''],#select_seccion option[value='']").removeAttr("disabled");
      $("#select_medioNOTICIA,#select_seccion").select2()
    })
    $("#select_seccion").on("change",function() {
      medio = $("#select_medioNOTICIA").val();
      medioTipo = $("#select_medioTipoNOTICIA").val();
      seccion = $("#select_seccion").val();
      m = userDATOS.noticiasSELECT("noticia",{"medio":medio,"mediotipo":medioTipo,"seccion":seccion})

      if(medio == "") {
        $("#select_medioNOTICIA").html("<option value=''></option>");
        for(var i in m.medio)
          $("#select_medioNOTICIA").append("<option value='" + i + "'>" + m.medio[i] + "</option>");
      }

      if(medioTipo == "") {
        $("#select_medioTipoNOTICIA").html("<option value=''></option>");
        for(var i in m.medio_tipo)
          $("#select_medioTipoNOTICIA").append("<option value='" + i + "'>" + m.medio_tipo[i] + "</option>");
      }

      $("#select_medioNOTICIA option[value=''],#select_medioTipoNOTICIA option[value='']").removeAttr("disabled");
      $("#select_medioNOTICIA,#select_medioTipoNOTICIA").select2()
    })
    //$("#div").addClass("d-none");
  });
} else window.location = "index.html";

// INACTIVIDAD
$(document).idle({
  onIdle: function(){
    $('#status').toggleClass('idle').html('INACTIVO');
    if(window.noticiaSELECCIONADA !== undefined) {
      if(parseInt(window.noticiaSELECCIONADA.estado) == 1) {
        //Si hay una noticia y se encuentra abierta, antes de salir cambio de el estado para que quede suelta
        userDATOS.change(window.noticiaSELECCIONADA.id,"noticia","estado",0);
        userDATOS.change(window.noticiaSELECCIONADA.id_noticia,"noticias","estado",0);
      }
    }
    userDATOS.logout();
  },
  onActive: function(){
    $('#status').toggleClass('idle').html('ACTIVO');
  },
  onHide: function(){
    $('#visibility').toggleClass('idle').html('OCULTO');
  },
  onShow: function(){
    setTimeout(function(){
      $('#visibility').toggleClass('idle').html('VISIBLE');
    }, 250);
  },
  idle: (30 * 60 * 1000),
  keepTracking: true
});

$(document).ready(function() {

  h = parseFloat($("#ul_nav_header").css("marginTop")) + $("#ul_nav_header").outerHeight();
  $(window).scroll(function() {
    if($(this).scrollTop() == 0) $("#ul_nav_header").closest("aside").find("> div > div").removeClass("shadow-sm").removeClass("shadow");
    if($(this).scrollTop() > 1 && $(this).scrollTop() < h)
      $("#ul_nav_header").closest("aside").find("> div > div").removeClass("shadow").addClass("shadow-sm");
    else if($(this).scrollTop() >= h)
      $("#ul_nav_header").closest("aside").find("> div > div").removeClass("shadow-sm").addClass("shadow");
  });
  /////
  $('.dropdown-toggle').on('click', function (e) {
    $(this).next().toggle();
  });
  $('.dropdown-menu').on('click', function (e) {
    e.stopPropagation();
  });
  /////
  $.ajaxSetup({
    error: function( jqXHR, textStatus, errorThrown ) {
      if (jqXHR.status === 0) {
        // userDATOS.notificacion(strings.error.conexion,"warning",false);
      } else if (jqXHR.status == 404) {
        userDATOS.notificacion(strings.error[404],"warning",false);
      } else if (jqXHR.status == 500) {
        userDATOS.notificacion(strings.error[500],"warning",false);
      } else if (textStatus === 'parsererror') {
        userDATOS.notificacion(strings.error.parseo,"warning",false);
      } else if (textStatus === 'timeout') {
        userDATOS.notificacion(strings.error.tiempo,"warning",false);
      } else if (textStatus === 'abort') {
        userDATOS.notificacion(strings.error.cancelada,"error",false);
      } else {
        userDATOS.notificacion(strings.error.comun,"error",false);
      }
    }
  });
  /////
  if(history.forward(1))
    location.replace( history.forward(1) );

  $("body").on("focus",".has-error", function() {
    $(this).removeClass("has-error");
  }).on("focus",".has-error + *", function() {
    $(this).prev().removeClass("has-error");
  }).on('dblclick', '#t_data tbody tr,#t_data2 tbody tr,#t_data3 tbody tr', function () {
      $("div").removeClass("d-none");
      tabla_noticia.row( this ).select();
      $(".dt-buttons .btn-dark").click();
  }).on("keypress",".texto-numero", function(e) { //----->SOLO NUMEROS
    userDATOS.permite(e,'0123456789.,');
  }).on("keypress",".texto-password", function(e) { //----->SOLO NUMEROS
    userDATOS.permite(e,'0123456789qwertyuiopasdfghjklñzxcvbnmáéíóú');
  }).on("keypress",".texto-text", function(e) { //----->SOLO NUMEROS
    userDATOS.permite(e,'qwertyuiopasdfghjklñzxcvbnmáéíóú ,.-/()[]0123456789@');
  }).on("keypress",".texto-date", function(e) { //----->SOLO NUMEROS
    userDATOS.permite(e,'0123456789/');
  }).on("click",'#noticias-select-all', function(){
    var rows = tabla_noticia.rows({ 'search': 'applied' }).nodes();
    $('input[type="checkbox"]', rows).prop('checked', this.checked);
  }).on('change', '#select_medio', function() {
    userDATOS.busqueda({"value":$(this).val(),"tabla":"medio"},function(medio) {
      if(medio !== null) {
        if(medio.id_medio_tipo != "0") {
          $("#select_medioAlcance").val(medio.id_medio_tipo).trigger("change");
          $("#select_medioAlcance").attr("disabled",true);
          $("#select_medioAlcance").select2();
        }
      } else {
        $("#select_medioAlcance").removeAttr("disabled");
        $("#select_medioAlcance").val("").trigger("change");
        $("#select_medioAlcance").select2();
      }
    },true);
    userDATOS.busqueda({"value":$(this).val(),"tabla":"medio_destaque","column":"id_medio","retorno":0}, function(destaques) {
      let selectDestaque = $("#select_destaque");
      selectDestaque.html("");
      if(Object.keys(destaques).length == 0)
        selectDestaque.append("<option value=''>SIN ESPECIFICAR</option>");
      else {
        selectDestaque.append("<option value=''></option>");
        for(var i in destaques)
          selectDestaque.append("<option value='" + destaques[i].id + "'>" + destaques[i].lugar + " - " + destaques[i].destaque + " (" + destaques[i].referencia + ")</option>");
      }
      selectDestaque.select2();
    },true);
    userDATOS.busqueda({"value":$(this).val(),"tabla":"seccion","column":"id_medio","retorno":0}, function(secciones) {
      let selectSeccion = $("#select_seccion");
      selectSeccion.html("<option value=''></option>");
      selectSeccion.append("<option value='1'>SIN SECCIÓN</option>");
      for(var i in secciones) selectSeccion.append("<option value='" + i + "'>" + secciones[i]["nombre"] + "</option>")
      if(window.noticiaSELECCIONADA !== undefined)
        selectSeccion.val(window.noticiaSELECCIONADA.id_seccion).trigger("change");
      selectSeccion.select2();
    },true);
    
  }).on('change','section thead input[type="checkbox"]', function(){
    if(window.noticiasCHECKED === null) window.noticiasCHECKED = {}
    if($(this).is(":checked")) {
      $('section tbody input[type="checkbox"]:checked').each(function(){
        if(window.noticiasCHECKED[$(this).val()] === undefined)
          window.noticiasCHECKED[$(this).val()] = "";
      });
      var el = $('#noticias-select-all').get(0);
      if(el && el.checked && ('indeterminate' in el)){
        el.indeterminate = true;
      }
    } else {
      $('section tbody input[type="checkbox"]').each(function(){
        if(window.noticiasCHECKED[$(this).val()] !== undefined) {
          delete window.noticiasCHECKED[$(this).val()];
        }
      })
    }
    
    if(Object.keys(window.noticiasCHECKED).length == 0)
      $(".dt-buttons .btn-success, .dt-buttons .btn-danger").addClass("buttons-selected disabled");
    else
      $(".dt-buttons .btn-success, .dt-buttons .btn-danger").removeClass("buttons-selected disabled");
  }).on('change','#t_data tbody input[type="checkbox"]', function(){
    if(window.noticiasCHECKED === null) window.noticiasCHECKED = {}
    if($(this).is(":checked")) {
      if(window.noticiasCHECKED[$(this).val()] === undefined)
        window.noticiasCHECKED[$(this).val()] = "";
    } else {
      if(window.noticiasCHECKED[$(this).val()] !== undefined)
        delete window.noticiasCHECKED[$(this).val()];
    }

    if(Object.keys(window.noticiasCHECKED).length == 0)
      $(".dt-buttons .btn-success, .dt-buttons .btn-danger").addClass("buttons-selected disabled");
    else
      $(".dt-buttons .btn-success, .dt-buttons .btn-danger").removeClass("buttons-selected disabled");
  }).on("click", ".dropdown-menu", function (e) {
    $(this).parent().is(".open") && e.stopPropagation();
  }).on("change", "*[name='select_tipoAlerta']",function() {
    if(parseInt($(this).val()) == 1)
      $(this).css({"background":"#ffc107","color":"#000"});
    if(parseInt($(this).val()) == 2)
      $(this).css({"background":"#ff8000","color":"#fff"});
    if(parseInt($(this).val()) == 3)
      $(this).css({"background":"#dc3545","color":"#fff"});
  });
  /**
   *
   */
  $("#tabla_notificacion_viejas").on("scroll", function() {
    var ele = document.getElementById('tabla_notificacion_viejas');
    if(ele.scrollHeight - ele.scrollTop === ele.clientHeight) {
       userDATOS.verificarNotificacion("#tabla_notificacion_viejas",1);
    }
  });
 $("#tabla_notificacion").on("scroll", function() {
   var ele = document.getElementById('tabla_notificacion');
   if(ele.scrollHeight - ele.scrollTop === ele.clientHeight) {
      // userDATOS.verificarNotificacion(0,"#tabla_notificacion",1);
   }
 });
  /**
   *
   */
  $("#modalNoticia").on('hidden.bs.modal', function (e) {
    $('#modalNoticia').find(".modal-body").html("");
    $('#modalNoticia').find(".modal-title").html("");
  });
  $('#modal').on('shown.bs.modal', function (e) {
    if($('#modal').find(".select__2").length) $('#modal').find(".select__2").select2({width: 'resolve'});
  });
  $('#modal').on('hidden.bs.modal', function (e) {
    if($("#modal").find(".modal-body.py-0").length) $("#modal").find(".modal-body.py-0").removeClass("py-0");

    $("#modal").removeClass("bd-example-modal-lg");
    $("#modal").find(".modal-dialog").removeClass("modal-lg");
    $('#modal').find(".modal-body").html("");
    $('#modal').find(".modal-footer").html("");
    $("#modal").find(".close").removeClass("d-none");

    if(window.limpiarUnidad !== undefined) window.limpiarUnidad = undefined;

    if(window.usuarioTABLA !== undefined) window.usuarioTABLA = undefined;
    if(window.ARR_tema_prev !== undefined) window.ARR_tema_prev = undefined;
    if(window.actorTR !== undefined) window.actorTR = undefined;
    if(window.ARR_index_actor !== undefined) window.ARR_index_actor = undefined;
    if(window.index_actor !== undefined) window.index_actor = undefined;

    if(window.institucionTR !== undefined) window.institucionTR = undefined;
    if(window.ARR_index_institucion !== undefined) window.ARR_index_institucion = undefined;
    if(window.index_institucion !== undefined) window.index_institucion = undefined;
  });
  /**
   * Eventos del SERVIDOR
   */
  window.evtSource = new EventSource("lib/servidor.php");
  window.evtSource.onopen = function(e) {
    console.log("CONEXIÓN establecida");
  };
  window.evtSource.onmessage = function(e) {};

  window.evtSource.addEventListener('alarmaCliente', clienteEVENT);
  window.evtSource.addEventListener('noticiaRELEVADA',noticiaRELEVADA);
  // window.evtSource.addEventListener('relanzarNotificacion',relanzarNotificacion);

  // function relanzarNotificacion(e) {
  //   if(parseInt(window.user.nivel) == 4) return false;
  //   userDATOS.verificarNotificacion();
  // }
  function clienteEVENT(e) {
    // Usar Function para traer notificaciones
    // e.data = id_notificacion insertada
    if(parseInt(window.user.nivel) == 4) return false;
    intNotificacion = parseInt($('*[data-notificacion="numero"]').text());
    intNotificacion ++;
    $.get("/lib/servidorCAMBIO.php?tipo=noticia&id_noticia=" + e.lastEventId,function(m){});
    
    userDATOS.traerNotificacion(e.data,"#tabla_notificacion");
    $('*[data-notificacion="numero"]').text(intNotificacion);
  }
  function noticiaRELEVADA(e) {
    aux = userDATOS.parseJSON(e.data);
    
    n = $('*[data-notificacion="numero"]').text();
    html = "";
    html += "<div class='row'>";
      html += "<div class='col-12'>";
        html += "<p class='m-0 text-truncate'>Noticia Relevada</p>";
        html += "<p class='m-0 text-truncate' title='" + aux.titulo + "'><strong class='mr-1'>Título:</strong>" + aux.titulo + "</p>";
        html += "<p class='m-0 text-right'>" + dates.string(new Date(), 0) + "</p>";
      html += "</div>";
    html += "</div>";
    // $.get("/lib/servidorCAMBIO.php?tipo=noticiaRELEVADA&id_noticia=" + e.lastEventId,function(m){});
    if(window["noticiaRELEVADA"] === undefined) {
      window["noticiaRELEVADA"] = 1;
      $("#tabla_notificacion").html(html);
    } else {
      window["noticiaRELEVADA"] ++
      $("#tabla_notificacion").append(html);
    }
    angular.element("*[ng-controller=\"jsonController\"]").scope().noticiasNUMEROS(angular.element("#menu_noticias").scope());
    $('*[data-notificacion="numero"]').text(parseInt(n) + parseInt(window["noticiaRELEVADA"]));

    if(parseInt(window.user.nivel) == 4) {
      
    }
  }

  function scopeNotificacion($scope,number) {
    $scope.$apply(function () {
      $scope.notificacionTOTAL = number;
    });
  }
  function scopeNoticiaR($scope,id, t = 1) {
    $scope.$apply(function () {
      if(parseInt(t)) {
        if($scope.notificaciones[id] !== undefined) {
          if($scope.notificaciones[id]["leido"] !== undefined) $scope.notificaciones[id]["leido"] = 2
        } else {
          if(window.SCOPEnotificaciones[id] !== undefined) {
            $scope.notificaciones[id] = window.SCOPEnotificaciones[id];
            $scope.notificaciones[id]["leido"] = 2;
          }
        }
      } else {
        if($scope.notificaciones[id] !== undefined) {
          delete $scope.notificaciones[id];
        }
      }
    });
  }

  window.evtSource.onerror = function(e) {
    console.log(e);
  };
  //----------------
});
