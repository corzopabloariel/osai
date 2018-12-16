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
  window.user = userDATOS.user();
  userDATOS.verificarNotificacion();
  if(window.variables["usuario"] === undefined) window.variables["usuario"] = new Pyrus("usuario",false);
  if(window.variables["usuario_nivel"] === undefined) window.variables["usuario_nivel"] = new Pyrus("usuario_nivel");

  if(window.usuario === undefined) {
    uu = window.variables.usuario_nivel.busqueda("nivel",window.user["nivel"]);
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
      $scope.noticias = userDATOS.noticiasVALOR();
    }

    this.option = function($scope) {
      // $scope.secciones = window.variables.seccion.resultado;
      $scope.temas = window.variables.attr_temas.resultado;
      $scope.instituciones = window.variables.attr_institucion.resultado;
      $scope.calificacion = window.variables.calificacion.resultado;
      $scope.clientes = window.variables.cliente.resultado;
      $scope.medios = window.variables.medio.resultado;
      $scope.mediosAlcance = window.variables.medio_tipo.resultado;
      $scope.periodistas = window.variables.periodista.resultado;
      $scope.mediosTipo = {1:{id:"1",nombre:"Medios papel"},2:{id:"2",nombre:"Medio web"}}
    }

    this.listador = function(e,n) {
      userDATOS.listador("#" + e,window.variables[e],true,n);
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
      userDATOS.listador("#medio_destaque",window.variables["medio_destaque"],true,2);
    }
    function periodista() {
      userDATOS.listador("#periodista",window.variables["periodista"],true,4);
    }
    function seccion() {
      userDATOS.listador("#seccion",window.variables["seccion"],true,5);
    }
    function attr_temas() {
      userDATOS.listador("#attr_temas",window.variables["attr_temas"],true,6);
    }
    function attr_calificacion() {
      userDATOS.listador("#attr_calificacion",window.variables["calificacion"],true,7);
    }
    function medio() {
      userDATOS.listador("#medio",window.variables["medio"],true,8);
    }
    function attr_alianza() {
      userDATOS.listador("#attr_alianza",window.variables["attr_alianza"],true,9);
    }
    function attr_campo() {
      userDATOS.listador("#attr_campo",window.variables["attr_campo"],true,10);
    }
    function attr_cargo() {
      userDATOS.listador("#attr_cargo",window.variables["attr_cargo"],true,11);
    }
    function attr_nivel() {
      userDATOS.listador("#attr_nivel",window.variables["attr_nivel"],true,12);
    }
    function attr_partido() {
      userDATOS.listador("#attr_partido",window.variables["attr_partido"],true,13);
    }
    function attr_poder() {
      userDATOS.listador("#attr_poder",window.variables["attr_poder"],true,14);
    }
  });
  app.config( function($routeProvider) {
    $routeProvider
    .when('/', {
      templateUrl: 'assets/views/' + window.usuario.vistasACTIVAS.noticias,
      controller : window.usuario.controller.noticias
    })
    .when('/extractores', {
      templateUrl: 'assets/views/' + window.usuario.vistasACTIVAS.extractores,
      controller : window.usuario.controller.extractores
    })
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
   * Carga principal de entidades
   */
  app.controller('jsonController', ['$scope', '$http', '$timeout', 'service_simat', 'factory_simat', function($scope, $http, $timeout, service_simat, factory_simat) {
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
      // $(".scroll-osai, .body, #tabla_notificacion, #tabla_notificacion_viejas").niceScroll();
    });
    $scope.notificaciones = {}
    $scope.notificacionTOTAL = 0;
    // $scope.notificaciones[1] = {"mensaje":"BBBB"}

    $scope.tipo_user = window.usuario["tipo"];
    if(window.variables["medio_tipo"] === undefined) window.variables["medio_tipo"] = new Pyrus("medio_tipo");
    if(window.variables["medio_destaque"] === undefined) window.variables["medio_destaque"] = new Pyrus("medio_destaque",true,true);

    if(window.variables["seccion"] === undefined) window.variables["seccion"] = new Pyrus("seccion",true,true);
    if(window.variables["attr_temas"] === undefined) window.variables["attr_temas"] = new Pyrus("attr_temas",true,true);
    if(window.variables["attr_institucion"] === undefined) window.variables["attr_institucion"] = new Pyrus("attr_institucion",true,true);
    if(window.variables["attr_alianza"] === undefined) window.variables["attr_alianza"] = new Pyrus("attr_alianza",true,true);
    if(window.variables["attr_campo"] === undefined) window.variables["attr_campo"] = new Pyrus("attr_campo",true,true);
    if(window.variables["attr_cargo"] === undefined) window.variables["attr_cargo"] = new Pyrus("attr_cargo",true,true);
    if(window.variables["attr_nivel"] === undefined) window.variables["attr_nivel"] = new Pyrus("attr_nivel",true,true);
    if(window.variables["attr_partido"] === undefined) window.variables["attr_partido"] = new Pyrus("attr_partido",true,true);
    if(window.variables["attr_poder"] === undefined) window.variables["attr_poder"] = new Pyrus("attr_poder",true,true);


    if(window.variables["calificacion"] === undefined) window.variables["calificacion"] = new Pyrus("calificacion",true,true);
    if(window.variables["alarma"] === undefined) window.variables["alarma"] = new Pyrus("alarma",true,true);

    if(window.variables["notificacion"] === undefined) window.variables["notificacion"] = new Pyrus("notificacion",false);
    if(window.variables["noticia"] === undefined) window.variables["noticia"] = new Pyrus("noticia", false);
    if(window.variables["noticias"] === undefined) window.variables["noticias"] = new Pyrus("noticias", false);
    if(window.variables["noticiasactor"] === undefined) window.variables["noticiasactor"] = new Pyrus("noticiasactor",false);
    if(window.variables["noticiascliente"] === undefined) window.variables["noticiascliente"] = new Pyrus("noticiascliente",false);
    if(window.variables["noticiasproceso"] === undefined) window.variables["noticiasproceso"] = new Pyrus("noticiasproceso",false);
    if(window.variables["noticiasinstitucion"] === undefined) window.variables["noticiasinstitucion"] = new Pyrus("noticiasinstitucion",false);

    $scope.submitUsuario = function(t) {
      let modal = $("#modalUsuario");
      if(t.claveActual == "" || t.claveNueva == "") {
        userDATOS.validar("#modalUsuario");
        userDATOS.notificacion("Faltan datos","error");
      } else {
        let user = userDATOS.user();
        let u = userDATOS.busqueda(user.id,"usuario");
        if(u.pass == md5(t.claveActual)) {
          u.cantidad = t.claveNueva.length
          u.pass = md5(t.claveNueva);
          window.variables.usuario.guardar_1(u);
          modal.find("input").val("");
          modal.modal("hide");
          userDATOS.notificacion("Datos cambiados","success");
        } else userDATOS.notificacion("Datos incorrectos","error");
      }
    }

    if(window.variables["cliente"] === undefined) window.variables["cliente"] = new Pyrus("cliente");
    if(window.variables["actor"] === undefined) window.variables["actor"] = new Pyrus("actor");
    if(window.variables["medio"] === undefined) window.variables["medio"] = new Pyrus("medio");
    if(window.variables["periodista"] === undefined) window.variables["periodista"] = new Pyrus("periodista");
    // if(window.variables["instancias"] === undefined) window.variables["instancias"] = new Pyrus("instancias");

    if(window.contenido["medio"] === undefined) window.contenido["medio"] = {};
    for(var i in window.variables.medio.resultado) {
      r = window.variables.medio.resultado[i];

      if(window.contenido["medio"][r.id] === undefined) {
        window.contenido["medio"][r.id] = {};
        window.contenido["medio"][r.id]["nombre"] = r.medio;
        window.contenido["medio"][r.id]["nombreCorto"] = r.nombre;
        window.contenido["medio"][r.id]["logo"] = r.image;
        window.contenido["medio"][r.id]["tipo"] = window.variables.medio_tipo.mostrar_1(r.id_medio_tipo)
      }
    }
    userDATOS.eliminarNoticiaMODAL = function() {
      $.MessageBox({
        buttonDone  : "Si",
        buttonFail  : "No",
        message   : "¿Está seguro de eliminar la <strong>noticia</strong>?"
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

    /**
     *
     */
    $scope.noticiasNUMEROS = function($scope) {
      $scope.$apply(function () {
         $scope.noticias = userDATOS.noticiasVALOR();
      });
    }
    $scope.eliminarNoticia = function() {
      $.MessageBox({
        buttonDone  : "Si",
        buttonFail  : "No",
        message   : "¿Está seguro de eliminar la <strong>noticia</strong>?"
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
        $('*[data-vista="notificacion"][data-toggle="dropdown"]').find("*[data-id='" + window.notificacionNUEVA + "']").find("p:last-child").html("<strong class='mr-1'>Estado:</strong>ELIMINADO");
        window.noticiaNUEVA = undefined;
        window.notificacionNUEVA = undefined;//ID
      })
    }
    /**
     *
     */
    $scope.procesarNoticia = function() {
      $.MessageBox({
        buttonDone  : "Si",
        buttonFail  : "No",
        message   : "¿Está seguro de pasar a relevar la <strong>noticia</strong>?"
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
        $('*[data-vista="notificacion"][data-toggle="dropdown"]').find("*[data-id='" + window.notificacionNUEVA + "']").find("p:last-child").html("<strong class=\"mr-1\">Estado:</strong>RELEVADO");
        $("#modalNoticia").modal("hide")
        window.noticiaNUEVA = undefined;
        window.notificacionNUEVA = undefined;//ID
      });
    }
    /**
     *
     */
    $scope.pasarNoticia = function() {
      let osai_usuario = userDATOS.busqueda(window.notificacionOBJ.id_cliente,"osai_usuario",false,"id_cliente");
      let cliente = userDATOS.busqueda(window.notificacionOBJ.id_cliente,"cliente");

      if(osai_usuario === null) {
        userDATOS.notificacion("<p class='m-0'>No hay CLIENTE FINAL asociado a <strong>" + cliente.nombre + "</strong></p><p class='m-0'>Genere usuario en el <i>MÓDULO CLIENTE</i></p>","error",false);
        return false;
      }
      
      clientes_osai = userDATOS.busquedaTabla("osai_usuario");//CLIENTES FINALES
      let defaultValue = null;
      let OBJ_clientes_osai = {};//CLIENTES FINALES <-- relacionado con --> UNIDAD DE ANALISIS
      for(var i in clientes_osai) {
        if(OBJ_clientes_osai[i] === undefined) {  
          OBJ_clientes_osai[i] = "";
          u = window.variables.cliente.resultado[clientes_osai[i]["id_cliente"]];
          if(clientes_osai[i]["id_cliente"] == cliente.id)
            defaultValue = i;
          OBJ_clientes_osai[i] = clientes_osai[i]["user"] + " (" + u["nombre"] + ")";
        }
      }
      //////////
      $.MessageBox({
        buttonDone  : "PASAR",
        buttonFail  : "CANCELAR",
        message : "<h2 class='m-0'>Pasar noticia</h2><p class='m-0'>Se pasará de forma inmediata al cliente </p>",
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
            userDATOS.notificacion("Faltan datos","error")
            return false;
          }
        }
      }).done(function(data){
        userDATOS.notificacion("Noticia pasada al cliente");
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

        // $('*[data-vista="notificacion"][data-toggle="dropdown"]').find("*[data-id='" + window.notificacionNUEVA + "']").removeClass("bg-white");
        // $('*[data-vista="notificacion"][data-toggle="dropdown"]').find("*[data-id='" + window.notificacionNUEVA + "']").addClass("bg-warning");
        // $('*[data-vista="notificacion"][data-toggle="dropdown"]').find("*[data-id='" + window.notificacionNUEVA + "']").find("p:last-child").html("<strong class=\"mr-1\">Estado:</strong>PASADO");

        // userDATOS.change(window.noticiaNUEVA.id,"noticia","relevado",11,0,true);
        // userDATOS.change(window.noticiaNUEVA.id_noticia,"noticias","moderado",11,0,true);
        // userDATOS.change(window.noticiaNUEVA.id_noticia,"noticias","id_notificacion",window.notificacionNUEVA,0,true);
        // userDATOS.log(window.user_id,"Notificación abierta y noticia nueva pasada",0,window.notificacionNUEVA,"notificacion");
        // //userDATOS.change = function(id, tabla, column, value, massive = 0, asy = false) {

        // $scope.noticiasNUMEROS(angular.element("#menu_noticias").scope());
        
        // $("#modalNoticia").modal("hide")
        // window.noticiaNUEVA = undefined;
        // window.notificacionNUEVA = undefined;
      })
    }
    /**
     * FUNCIÓN DESTINADA PARA VER LA NOTIFICACIÓN DE UNA NOTICIA NUEVA
     * EN DONDE UN CLIENTE O ALARMA SON NOMBRADOS
     */
    $scope.verNoticiaNueva = function(id) {
      try {
        let o = userDATOS.busquedaAlerta(id);//Retorna NOTICIA/
        window.noticiaNUEVA = o;
        window.notificacionNUEVA = id;
        window.notificacionOBJ = userDATOS.busqueda(id,"notificacion");
        if($scope.notificaciones[id]["leido"] == undefined) {
          $scope.notificaciones[id]["leido"] = 1;
          $scope.notificacionTOTAL --;
          // scopeNoticias(angular.element("*[ng-controller=\"jsonController\"]").scope(),id,"leido","estado");
        }
        html = o.cuerpo;
        var SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
        while (SCRIPT_REGEX.test(html))
            html = html.replace(SCRIPT_REGEX, "");
            console.log(window.notificacionOBJ);
        $("#modalNoticia").find(".modal-notificacion").html("<p class='m-0'>" + window.notificacionOBJ.mensaje + "<span class='badge badge-warning mx-2'>alerta</span><span onclick='userDATOS.mostrarAtributos(this)' class='text-uppercase cursor-pointer'>[ver atributos]</span></p>");
        $("#modalNoticia").find(".modal-title").html(o.titulo);
        $("#modalNoticia").find(".modal-body").html(html);
        $("#modalNoticia").modal("show");
      }
      catch (e) {
        userDATOS.notificacion("Ocurrió un error de parseo. Reintente","warning",false);
      }
    }
    // REVISAR
    $scope.eliminar = function() {
      let noticia = tabla_noticia.rows( { selected: true } ).data()[0]
      $.MessageBox({
        buttonDone  : "Si",
        buttonFail  : "No",
        message   : "¿Está seguro de desechar la noticia?<br/><small>Será visible para el relevo</small>"
      }).done(function(){
        userDATOS.change(noticia.id,"noticia","elim",1,);
        userDATOS.change(noticia.id_noticia,"noticias","elim",1);
        userDATOS.log(window.user_id,"Baja de registro",0,noticia.id,"noticia",1);
        userDATOS.log(window.user_id,"Baja de registro",0,noticia.id_noticia,"noticias",1);

        tabla_noticia.row(".selected").remove().draw();
        userDATOS.pantalla_cerrarSIMPLE();
        userDATOS.notificacion("Noticia desechada","success");
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
        // if($("#select_periodista").val() == "") {
        //   $("#select_periodista").addClass("has-error");
        //   if(msj_err != "") msj_err += " / ";
        //   msj_err += "Autor";
        //   flag_variables = false;
        // }
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
      // if(window.ARR_actor !== undefined) {
      //   if(Object.keys(window.ARR_actor).length == 0) flag_variables = false;
      // } else flag_variables = false;

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
            fecha = fecha.replace("T"," ");
            OBJ_noticia["fecha"] = fecha;
            OBJ_noticia["data"] = {};
            OBJ_noticia["data"]["titulo"] = $("#frm_titulo").text();
            if($("#frm_subtitulo").text() != "") OBJ_noticia["data"]["bajada"] = $("#frm_subtitulo").text();
            OBJ_noticia["data"]["fecha"] = fecha
            OBJ_noticia["data"]["autor"] = $("#select_periodista option[value='" + select_periodista.value + "']").text();
            OBJ_noticia["data"]["cuerpo"] = (window.cuerpoPEGADO === undefined ? $(".note-editable").html() : window.cuerpoPEGADO);
            OBJ_noticia["data"]["categoria"] = window.variables.seccion.mostrar_1(select_seccion.value);
            accion = window.variables.noticias.guardar_1(OBJ_noticia);
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
            accion_not = window.variables.noticia.guardar_1(OBJ_noticia);
            userDATOS.log(window.user_id,"Alta de registro y proceso",0,accion.id,"noticia");
            //

            OBJ_data["select_medioTipo"] = select_medioTipo.value;
            OBJ_data["select_destaque"] = select_destaque.value;

            // let periodista = userDATOS.busquedaPeriodista(window.noticiaSELECCIONADA.id_noticia);

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
              window.variables.noticiasactor.guardar_1({"id":"nulo","id_noticia": accion.id,"id_actor": i,"data": window.ARR_actor[i]})
            for(var i in window.ARR_cliente) {//
              window.variables.noticiascliente.guardar_1({"id":"nulo","id_noticia": accion.id,"id_cliente": i,"valoracion": JSON.stringify(window.ARR_cliente[i]["valoracion"]),"tema": JSON.stringify(window.ARR_cliente[i]["tema"])})
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
              window.variables.noticiasinstitucion.guardar_1({"id":"nulo","id_noticia": accion.id,"id_institucion": i,"data": window.ARR_institucion[i]})

            window.variables.noticiasproceso.guardar_1({"id":"nulo","id_noticia": accion.id,"id_usuario":window.user_id,"data": OBJ_data});
            // LIMPIO VARIABLES
            window.cuerpoPEGADO = undefined;
            userDATOS.pantalla_OFF();
            userDATOS.notificacion("Noticia guardada y procesada","success");
            scopeNoticias(angular.element($("#menu_noticias")).scope(),"total",1);
            scopeNoticias(angular.element($("#menu_noticias")).scope(),"procesadas",1);
          }).fail(function(){});
        } else userDATOS.notificacion("<p class='m-0'><strong>Faltan datos</strong></p><p class='m-0'>" + msj_err+ "</p>","error");
      } else {
        let periodista = userDATOS.busquedaPeriodista(window.noticiaSELECCIONADA.id_noticia);
        if(flag_variables) {
          mssg = (reprocesar ? "¿Está seguro de reprocesar la <strong>noticia</strong>?<br/>Se desechará toda la información previa" : "¿Está seguro de aplicar el proceso a la noticia?");
          $.MessageBox({
            buttonDone  : "Si",
            buttonFail  : "No",
            message   : mssg
          }).done(function(){
            let n_proceso = new Pyrus("proceso",false);
            let obj_proceso = n_proceso.objetoLimpio();
            let OBJ_data = {}
            let cuerpo = $(".note-editable").html();//guardo cuerpo de noticias con ETIQUETAS
            if(reprocesar) {
              let noticiaproceso = userDATOS.busqueda(window.noticiaSELECCIONADA.id_noticia,"noticiasproceso",false,"id_noticia");
              let ARR_proceso = userDATOS.busqueda(window.noticiaSELECCIONADA.id_noticia,"proceso",false,"id_noticia",0);
              let ARR_actores = userDATOS.busqueda(window.noticiaSELECCIONADA.id_noticia,"noticiasactor",false,"id_noticia",0);
              let ARR_clientes = userDATOS.busqueda(window.noticiaSELECCIONADA.id_noticia,"noticiascliente",false,"id_noticia",0);
              let ARR_instituciones = userDATOS.busqueda(window.noticiaSELECCIONADA.id_noticia,"noticiasinstitucion",false,"id_noticia",0);
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

              window.variables.noticiasproceso.guardar_1({"id":"nulo","did":did,"id_noticia": window.noticiaSELECCIONADA.id_noticia,"id_usuario":window.user_id,"data": procesoDATA});
              for(var i in window.ARR_actor)//ACTORES mencionados en la noticia
                window.variables.noticiasactor.guardar_1({"id":"nulo","did":did,"id_noticia": window.noticiaSELECCIONADA.id_noticia,"id_actor": i,"data": window.ARR_actor[i]})
              for(var i in window.ARR_cliente) {
                window.variables.noticiascliente.guardar_1({"id":"nulo","did":did,"id_noticia": window.noticiaSELECCIONADA.id_noticia,"id_cliente": i,"valoracion": JSON.stringify(window.ARR_cliente[i]["valoracion"]),"tema": JSON.stringify(window.ARR_cliente[i]["tema"])})
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
                window.variables.noticiasinstitucion.guardar_1({"id":"nulo","did":did,"id_noticia": window.noticiaSELECCIONADA.id_noticia,"id_institucion": i,"data": window.ARR_institucion[i]})
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
              window.variables.noticiasproceso.guardar_1({"id":"nulo","id_noticia": window.noticiaSELECCIONADA.id_noticia,"id_usuario":window.user_id,"data": OBJ_data});
              for(var i in window.ARR_actor)//ACTORES mencionados en la noticia
                window.variables.noticiasactor.guardar_1({"id":"nulo","id_noticia": window.noticiaSELECCIONADA.id_noticia,"id_actor": i,"data": window.ARR_actor[i]})
              id_cliente = 0;
              for(var i in window.ARR_cliente) {
                window.variables.noticiascliente.guardar_1({"id":"nulo","id_noticia": window.noticiaSELECCIONADA.id_noticia,"id_cliente": i,"valoracion": JSON.stringify(window.ARR_cliente[i]["valoracion"]),"tema": JSON.stringify(window.ARR_cliente[i]["tema"])})
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
                window.variables.noticiasinstitucion.guardar_1({"id":"nulo","id_noticia": window.noticiaSELECCIONADA.id_noticia,"id_institucion": i,"data": window.ARR_institucion[i]})
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
        } else userDATOS.notificacion("<p class='m-0'><strong>Faltan datos</strong></p><p class='m-0'>" + msj_err+ "</p>","error");
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

    userDATOS.listador("#t_institucion",window.variables["attr_institucion"],true);
    userDATOS.submit = function(t) {
      let e = $("#" + t.id).data("tipo");
      if(userDATOS.validar("#" + t.id)) {
        let a = window.variables.attr_institucion.objeto["GUARDADO_ATTR"];
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

        accion = window.variables.attr_institucion.guardar_1(OBJ);//
        if(accion.id !== null && accion.flag) {//
          window.variables[e].reload(false);//recargo contenido asy, por si se necesita
          let elemento = userDATOS.busqueda(accion.id,e);//traigo el nuevo registro

          let row = window.variables[e].getContenidoDATATABLEsimple(elemento);
          if(OBJ.id == "nulo") {
            userDATOS.log(window.user_id,"Alta de registro",0,accion.id,"attr_institucion");
            window["tabla_0"].row.add(row).draw().node();//agrego sin recargar sitio
          } else {
            userDATOS.log(window.user_id,"Edición de registro",0,accion.id,"attr_institucion");
            window["tabla_0"].row('.selected').data(row).draw();//reemplazo
          }
          //userDATOS.listador("#" + e,window.variables[e],false,dataT[e]);
          $("#modal").modal("hide");

        } else userDATOS.notificacion("Datos repetidos","error");
      } else userDATOS.notificacion("Faltan datos","error");
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
      } else userDATOS.notificacion("Faltan datos de búsqueda","error");
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
      let osai_cliente = userDATOS.busqueda(row.id,"osai_cliente",false,"id_noticia",0)//<-- OJO / uso id de -->--> NOTICIA <--<--
      let mssg = "<p class='text-uppercase m-0 text-center'>¿Está seguro de publicar la <strong>noticia</strong> seleccionada?</p>";
      $.MessageBox({
        buttonDone  : "Si",
        buttonFail  : "No",
        message     : mssg
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
        let a = window.variables[e].objeto["GUARDADO_ATTR"];
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

        accion = window.variables[e].guardar_1(OBJ);//
        if(accion.id !== null && accion.flag) {//
          window.variables[e].reload(false);//recargo contenido asy, por si se necesita
          let elemento = userDATOS.busqueda(accion.id,e);//traigo el nuevo registro

          let row = window.variables[e].getContenidoDATATABLEsimple(elemento);
          if(OBJ.id == "nulo") {
            userDATOS.log(window.user_id,"Alta de registro",0,accion.id,e);
            window["tabla_" + dataT[e]].row.add(row).draw().node();//agrego sin recargar sitio
          } else {
            userDATOS.log(window.user_id,"Edición de registro",0,accion.id,e);
            window["tabla_" + dataT[e]].row('.selected').data(row).draw();//reemplazo
          }
          //userDATOS.listador("#" + e,window.variables[e],false,dataT[e]);
          $("#modal").modal("hide");

        } else userDATOS.notificacion("Datos repetidos","error");
      } else userDATOS.notificacion("Faltan datos","error");
    }
  });
  /**
   * Acciones de vista EXTRACTORES
   * Solo accedido por usuarios nivel 1 y 2
   */
  app.controller("extractores", function ($scope) {
    $(".nav_ul a").closest("ul").find(".active").removeClass("active");
    $(".nav_ul a[data-url='extractores']").addClass("active");
    //$("#div").addClass("d-none");
    let ext = userDATOS.busquedaExtraccion();
    $scope.medios = window.variables.medio.resultado;
    $scope.extraccion = (ext.fecha).replace("T"," ");
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
          if(min == "" || max == "" || uni == "") userDATOS.notificacion("Faltan datos. <strong>Fechas</strong> y <strong>Unidad de análisis</strong><br/>no pueden quedar vacio","error");
          else {
              window.localStorage.setItem("fecha_min", min);
              window.localStorage.setItem("fecha_max", max);
              window.localStorage.setItem("unidad", uni);

              let win = window.open(href, '_blank');
              win.focus();
          }
        } else {
          if(min == "" || max == "") userDATOS.notificacion("Faltan datos. Las <strong>Fechas</strong> no pueden quedar vacias","error");
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
    //$("#div").addClass("d-none");

    userDATOS.listador("#t_clientes",window.variables["cliente"],false);

    userDATOS.submit = function(t) {
      let e = $("#" + t.id).data("tipo");
      if(userDATOS.validar("#" + t.id)) {
        let a = window.variables["cliente"].objeto["GUARDADO_ATTR"];
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
        accion = window.variables.cliente.guardar_1(OBJ);//
        if(accion.id !== null && accion.flag) {//
          window.variables.cliente.reload();//vuelvo a trear todos los datos
          let elemento = userDATOS.busqueda(accion.id,"cliente");//traigo el nuevo registro

          let row = window.variables.cliente.getContenidoDATATABLEsimple(elemento);
          if(OBJ.id == "nulo")
            window["tabla_0"].row.add(row).draw().node();//agrego sin recargar sitio
          else
            window["tabla_0"].row('.selected').data(row).draw();//reemplazo
          $("#modal").modal("hide");
          //service_simat.option($scope);
        } else userDATOS.notificacion("Datos repetidos","error");
      } else userDATOS.notificacion("Faltan datos","error");
    }

    userDATOS.usuarioOSAI = function() {
      let row = tabla_0.rows(".selected").data()[0];

      let osai_usuario = userDATOS.busqueda(row.id,"osai_usuario",false,"id_cliente");
      if(osai_usuario == false) return false;
      if(osai_usuario !== null) {
        $.MessageBox({
          buttonDone  : "CAMBIAR",
          buttonFail  : "Cancelar",
          message : "<h3 class='m-0'>Usuario: " + osai_usuario.user + "</h3><button onclick='userDATOS.estadoClienteFinal(" + osai_usuario.activo + ");' class='btn btn-block my-2 text-uppercase " + (osai_usuario.activo ? "btn-danger" : "btn-success") + "'>" + (osai_usuario.activo ? "desactivar" : "activar") + "</button><p class='m-0'>Resetear contraseña del <strong>CLIENTE</strong></p>",
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
              userDATOS.notificacion("Las contraseñas no coinciden","error")
              return false;
            }
          }
        }).done(function(data, button){
          userDATOS.change(osai_usuario.id,"osai_usuario","pass",md5(data.password1));
          userDATOS.notificacion("Contraseña cambiada");
          userDATOS.log(window.user_id,"Alta de registro / [USER] " + data.user + " / [PASS] " + data.password1,0,osai_usuario.id,"osai_usuario");
        });
        return false;
      }
      $.MessageBox({
        buttonDone  : "CREAR",
        buttonFail  : "Cancelar",
        message : "<h2 class='m-0'>Creación de usuario</h2><p class='m-0'>Usuario para el sector <strong>CLIENTE</strong></p>",
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
            userDATOS.notificacion("Faltan datos","error");
            return false;
          }
          if(data.password1 != data.password2) {
            userDATOS.notificacion("Las contraseñas no coinciden","error")
            return false;
          }

          aux = userDATOS.busqueda(data.user,"osai_usuario",false,"user");
          if(aux !== null) {
            userDATOS.notificacion("Usuario en uso","error")
            return false;
          }
        }
      }).done(function(data, button){
        aux = {};
        aux["id_cliente"] = row.id;
        aux["user"] = data.user;
        aux["pass"] = md5(data.password1);
        i = userDATOS.insertDatos("osai_usuario",aux)
        userDATOS.notificacion("Usuario creado");
        userDATOS.log(window.user_id,"Alta de registro / [USER] " + data.user + " / [PASS] " + data.password1,0,i,"osai_usuario");
        window.variables.cliente.reload();
        userDATOS.listador("#t_clientes",window.variables["cliente"],false);
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

    userDATOS.listador("#t_actores",window.variables["actor"]);
    userDATOS.submit = function(t) {
      if(userDATOS.validar("#" + t.id)) {
        let a = window.variables["actor"].objeto["GUARDADO_ATTR"]
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
        accion = window.variables.actor.guardar_1(OBJ);//
        if(accion.id !== null && accion.flag) {//
          window.variables.actor.reload();//vuelvo a trear todos los datos
          let elemento = userDATOS.busqueda(accion.id,"actor");//traigo el nuevo registro

          let row = window.variables.actor.getContenidoDATATABLEsimple(elemento);
          if(OBJ.id == "nulo") {
            userDATOS.log(window.user_id,"Alta de registro",0,accion.id,"actor");
            window["tabla_0"].row.add(row).draw().node();//agrego sin recargar sitio
          } else {
            userDATOS.log(window.user_id,"Edición de registro",0,accion.id,"actor");
            window["tabla_0"].row('.selected').data(row).draw();//reemplazo
          }
          $("#modal").modal("hide");
          window.ATTR = undefined;
        } else userDATOS.notificacion("Datos repetidos","error");
      } else userDATOS.notificacion("Faltan datos","error");
    }
    //$("#div").addClass("d-none");
  });
  /**
   * Acciones de vista USUARIOS
   * Solo accedido por usuarios nivel 1 y 2
   */
  app.controller("usuarios", function ($scope) {
    $(".nav_ul a").closest("ul").find(".active").removeClass("active");
    let ua = userDATOS.user();
    $.ajax({
       type: 'POST',
       url: "lib/cliente.php",
       dataType: 'json',
       async: false,
       data: { tipo: "usuarios" }
    }).done(function(msg) {
      window.variables.usuario.resultado = msg;
    });
    delete window.variables.usuario.resultado[ua.id];
    for(var i in window.variables.usuario.resultado) {
      if(parseInt(window.variables.usuario.resultado[i]["nivel"]) < parseInt(window.usuario.nivel))
        delete window.variables.usuario.resultado[i];//saco de la vista los usuarios con nivel superior
    }
    let ARR_btn = [];
    ARR_btn.push({
				text: '<i class="fas fa-plus"></i>',
				className: 'btn-primary',
				action: function ( e, dt, node, config ) {
					window["tabla_0"].rows('.selected').deselect();
					userDATOS.addUsuario(window["tabla_0"],window.variables.usuario);
				}
		});
    ARR_btn.push({
				extend: 'selected',
				text: '<i class="fas fa-eye"></i>',
				className: 'btn-dark',
				action: function ( e, dt, node, config ) {
					let rows = dt.rows( { selected: true } ).count();
					userDATOS.showUsuario(window["tabla_0"],window.variables.usuario);
				}
			});
    ARR_btn.push({
				extend: 'selected',
				text: '<i class="fas fa-ban"></i>',
				className: 'btn-warning',
				action: function ( e, dt, node, config ) {
					let rows = dt.rows( { selected: true } ).count();
					userDATOS.bloquearUsuario(window["tabla_0"],window.variables.usuario);
				}
			});
    userDATOS.listador("#t_usuarios",window.variables.usuario,true,0,ARR_btn,["delete"]);//target / VAR Pyrus / busqueda / id tabla / btn adicional / ARR btn default
    userDATOS.submit = function(t) {
      if(userDATOS.validar("#" + t.id)) {
        let a = window.variables["usuario"].objeto["GUARDADO_ATTR"]
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
        accion = window.variables.usuario.guardar_1(OBJ);
        if(accion.id !== null && accion.flag) {//
          //window.variables["usuario"].reload();//vuelvo a trear todos los datos
          let row = [];
          let e = userDATOS.busqueda(accion.id,"usuario");//el dato nuevo
          userDATOS.log(window.user_id,"Alta de registro",0,e.id,"usuario");
          row.push(e.id);
          row.push(e.user);
          row.push(window.variables.usuario_nivel.mostrar_1(e.nivel));
          row.push("Activo");
          window["tabla_0"].row.add(row).draw().node();//agrego sin recargar sitio
          //userDATOS.listador("#t_usuarios",window.variables.usuario,true,0,ARR_btn,["delete"]);//target / VAR Pyrus / busqueda / id tabla / btn adicional / ARR btn default
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
    let CLIENTES_alarmas = {};
    let ARR_alarmas = window.variables.alarma.busqueda("id_cliente",0,0);
    // la alarma busca por clientes activos, si no se encuentran seteados los agrega
    for(var i in window.variables.cliente.resultado) {
      let o = window.variables.alarma.busqueda("id_cliente",window.variables.cliente.resultado[i]["id"]);
      CLIENTES_alarmas[window.variables.cliente.resultado[i]["id"]] = {};
      CLIENTES_alarmas[window.variables.cliente.resultado[i]["id"]]["id"] = window.variables.cliente.resultado[i]["id"];
      CLIENTES_alarmas[window.variables.cliente.resultado[i]["id"]]["nombre"] = window.variables.cliente.resultado[i]["nombre"];
      if(o === undefined) {
        o = window.variables.alarma.objetoLimpio();
        o.estado = "0";
        o.id_cliente = window.variables.cliente.resultado[i]["id"];
        delete o["atributos"];
        accion = window.variables.alarma.guardar_1(o);
        aux = userDATOS.busqueda(accion.id,"alarma");//Agrego en el array precargado
        window.variables.alarma.resultado[aux["id"]] = aux;

        CLIENTES_alarmas[window.variables.cliente.resultado[i]["id"]]["atributos"] = [];
        CLIENTES_alarmas[window.variables.cliente.resultado[i]["id"]]["atributos_negativos"] = {};
        CLIENTES_alarmas[window.variables.cliente.resultado[i]["id"]]["estado"] = 0;
        CLIENTES_alarmas[window.variables.cliente.resultado[i]["id"]]["id_alarma"] = accion.id;
      } else {
        CLIENTES_alarmas[window.variables.cliente.resultado[i]["id"]]["atributos"] = userDATOS.parseJSON(o.atributos);
        if(o.atributos_negativos === null) {
          CLIENTES_alarmas[window.variables.cliente.resultado[i]["id"]]["atributos_negativos"] = {};
          arr = CLIENTES_alarmas[window.variables.cliente.resultado[i]["id"]]["atributos"];
          for(var x in arr)
            CLIENTES_alarmas[window.variables.cliente.resultado[i]["id"]]["atributos_negativos"][arr[x]] = []
        } else {
          CLIENTES_alarmas[window.variables.cliente.resultado[i]["id"]]["atributos_negativos"] = userDATOS.parseJSON(o.atributos_negativos);
          for(var x in CLIENTES_alarmas[window.variables.cliente.resultado[i]["id"]]["atributos_negativos"])
            CLIENTES_alarmas[window.variables.cliente.resultado[i]["id"]]["atributos_negativos"][x] = userDATOS.parseJSON(CLIENTES_alarmas[window.variables.cliente.resultado[i]["id"]]["atributos_negativos"][x])
        }
        CLIENTES_alarmas[window.variables.cliente.resultado[i]["id"]]["estado"] = o.estado;
        CLIENTES_alarmas[window.variables.cliente.resultado[i]["id"]]["id_alarma"] = o.id;
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
        let a = window.variables.alarma.objeto["GUARDADO_ATTR"];
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
        accion = window.variables.alarma.guardar_1(OBJ);
        if(accion.id !== null && accion.flag) {
          on = userDATOS.busqueda(accion.id,"alarma");
          userDATOS.log(window.user_id,"Se agregó alarma (" + on.nombre + ")",0,accion.id,"alarma");
          window.variables.alarma.resultado[on.id] = on;
          angular.element($("#alarmasF")).scope().alarmas[on.id] = on;
          modal.modal("hide");
        } else userDATOS.notificacion("Datos repetidos","error");
      } else userDATOS.notificacion("Faltan datos","error");
    }
    $scope.alarmas = OBJ_alarmas;
    $scope.deleteAlarma = function(o) {
      $.MessageBox({
        buttonDone  : "Si",
        buttonFail  : "No",
        message   : "¿Está seguro de eliminar <strong>alarma</strong>?"
      }).done(function(){
        delete angular.element($("#alarmasF")).scope().alarmas[o.id];
        delete window.variables.alarma.resultado[o.id];
        $("div[data-id='" + o.id + "']").remove();
        o.elim = 1;
        delete o["atributos"];
        accion = window.variables.alarma.guardar_1(o);
        userDATOS.log(window.user_id,"Se eliminó alarma (" + o.nombre + ")",0,accion.id,"alarma",1);
      });
    }
    $scope.submitAlarma = function(t,o) {
      if(angular.element($("#alarmasF")).scope().alarmas[o.id]["atributos"].indexOf(t.text) < 0) {
        angular.element($("#alarmasF")).scope().alarmas[o.id]["atributos"].push(t.text);

        accion = window.variables.alarma.guardar_1(angular.element($("#alarmasF")).scope().alarmas[o.id]);
        angular.element($("#alarmasF")).scope().alarmas[o.id]["atributos"] = userDATOS.parseJSON(angular.element($("#alarmasF")).scope().alarmas[o.id]["atributos"]);
        userDATOS.log(window.user_id,"Se agregó atributo a la alarma " + o.nombre + " (" + t.text + ")",0,accion.id,"alarma");
        t.text = "";
      } else userDATOS.notificacion("Dato duplicado","error");
    }
    $scope.deleteATTRalarma = function(i,o) {
      text = angular.element($("#alarmasF")).scope().alarmas[o.id]["atributos"][i];
      angular.element($("#alarmasF")).scope().alarmas[o.id]["atributos"].splice(i,1);
      accion = window.variables.alarma.guardar_1(angular.element($("#alarmasF")).scope().alarmas[o.id]);
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

      accion = window.variables.alarma.guardar_1(o);
      userDATOS.log(window.user_id,"Alarma de " + o.nombre + " (" +(o.estado == "0" ? "APAGADA" : "ENCENDIDA")+ ")",0,accion.id,"alarma");
      angular.element($("#alarmasF")).scope().alarmas[o.id]["estado"] = o.estado;
      angular.element($("#alarmasF")).scope().alarmas[o.id]["atributos"] = userDATOS.parseJSON(angular.element($("#alarmasF")).scope().alarmas[o.id]["atributos"]);
      window.variables.alarma.resultado[o.id]["estado"] = o.estado;
    }
    $scope.submit = function(t, cliente) {
      if(angular.element($("#alarmas")).scope().alarmasCLIENTE[cliente.id].atributos.indexOf(t.text) < 0) {
        angular.element($("#alarmas")).scope().alarmasCLIENTE[cliente.id].atributos.push(t.text);
        let o = window.variables.alarma.busqueda("id",cliente.id_alarma);
        o.atributos = angular.element($("#alarmas")).scope().alarmasCLIENTE[cliente.id].atributos;
        accion = window.variables.alarma.guardar_1(o);

        window.variables.alarma.resultado[accion["id"]] = o;

        userDATOS.log(window.user_id,"Se agregó atributo a " + cliente.nombre + "(" + t.text + ")",0,accion.id,"alarma");
        t.text = "";
      } else userDATOS.notificacion("Dato duplicado","error");
    }
    $scope.alarma = function(cliente) {
      cliente.estado = (cliente.estado == 0 ? 1 : 0);
      angular.element($("#alarmas")).scope().alarmasCLIENTE[cliente.id]
      o = window.variables.alarma.busqueda("id",cliente.id_alarma);
      o.estado = cliente.estado
      accion = window.variables.alarma.guardar_1(o);
      userDATOS.log(window.user_id,"Alarma de " + cliente.nombre + " (" +(cliente.estado == "0" ? "APAGADA" : "ENCENDIDA")+ ")",0,accion.id,"alarma");
      window.variables.alarma.resultado[o.id] = o;
    }
    $scope.delete = function(i, cliente) {
      let text = angular.element($("#alarmas")).scope().alarmasCLIENTE[cliente.id]["atributos"][i];
      angular.element($("#alarmas")).scope().alarmasCLIENTE[cliente.id]["atributos"].splice(i,1);
      let o = window.variables.alarma.busqueda("id",cliente.id_alarma);
      o.atributos = angular.element($("#alarmas")).scope().alarmasCLIENTE[cliente.id]["atributos"];
      accion = window.variables.alarma.guardar_1(o);
      userDATOS.log(window.user_id,"Se quito atributo a " + cliente.nombre + " (" + text + ")",0,accion.id,"alarma",1);
    }
    userDATOS.removeATTRnegativo = function(e,tipo) {
      let li = $(e).closest("li");
      let li_li = li.closest("li");
      let elem = angular.element(li_li).scope();
      let i = li.index() - 1;//En la primera pos. se encuentra el input

      elem.$parent[tipo]["atributos_negativos"][elem.attr].splice(i,1);
      li.remove();

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

        $(e).val("");
      } else userDATOS.notificacion("Elemento existente","error");

    }
    userDATOS.atributoNegativo = function(e,tipo) {
      let li = $(e).closest("li");
      let elem = angular.element(li).scope();
      let data = null;
      console.log(elem);
      console.log( elem.$parent[tipo]["atributos_negativos"]);
        data = elem.$parent[tipo]["atributos_negativos"][elem.attr];
        console.log(data);
      let html = "";
      if(parseInt($(e).data("estado"))) {
        $(e).removeClass("text-warning");
        li.find("ul").remove();
        $(e).data("estado","0");

        let o = null;
        if(tipo == "cliente")
          o = window.variables.alarma.busqueda("id",elem.$parent.cliente.id_alarma);
        else
          o = window.variables.alarma.busqueda("id",elem.$parent.id);
        o.atributos_negativos = elem.$parent[tipo]["atributos_negativos"];
        accion = window.variables.alarma.guardar_1(o);
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
    $scope.unidadSELECT = window.variables.cliente.resultado;
    $(".select__2").select2();

    scopeNoticias = function($scope) {
      $scope.$apply(function () {
          $scope.noticias = userDATOS.noticiasVALOR();
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
      flag = false;
      for(var i in data) {
        if(data[i] != "") flag = true;
      }
      if(flag) {
        tabla_noticia.destroy();
        $("#t_data").addClass("animate-flicker")
        setTimeout(function() {
          userDATOS.dataTableNOTICIAS2("#t_data",data)
        },500);
      } else userDATOS.notificacion("Faltan datos de búsqueda","error");
      //tabla_noticia.draw();
    });
    $("#btn_limpiar").on("click",function() {
      let minDateFilter = $('#fecha_min').val();
      let maxDateFilter = $('#fecha_max').val();
      let medioFilter = $('#select_medioNOTICIA').val();
      let medioTipoFilter = $('#select_medioTipoNOTICIA').val();
      let tituloFilter = $('#titulo').val();
      let seccionFilter = $('#select_seccion').val();
      data = {"moderado":1,"minDateFilter":minDateFilter,"maxDateFilter":maxDateFilter,"medioFilter":medioFilter,"medioTipoFilter":medioTipoFilter,"tituloFilter":tituloFilter,"seccionFilter":JSON.stringify(seccionFilter)}
      flag = false;
      for(var i in data) {
        if(data[i] != "") flag = true;
      }
      if(flag) {
        $("#fecha_min").val("");
        $("#fecha_max").val("");
        $("#titulo").val("");
        if($("#select_medioTipoNOTICIA").val() != "")
          $("#select_medioTipoNOTICIA").val("").trigger("change");
        if($("#select_medioNOTICIA").val() != "")
          $("#select_medioNOTICIA").val("").trigger("change");

        if($("#select_seccion").length != 0)
          $("#select_seccion").empty().trigger("change")

        $("#select_medioNOTICIA,#select_medioTipoNOTICIA,#select_seccion").select2();
        tabla_noticia.destroy();
        $("#t_data").addClass("animate-flicker")
        setTimeout(function() {
          userDATOS.dataTableNOTICIAS2("#t_data",{"moderado":1})
        },500);
      }
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
      if(window.noticiasCHECKED == null) userDATOS.notificacion("No se seleccionó ninguna noticia","error");
      else if(Object.keys(window.noticiasCHECKED).length == 0) userDATOS.notificacion("No se seleccionó ninguna noticia","error");
      else {
        if(Object.keys(window.noticiasCHECKED).length == 1) mssg = "¿Está seguro de eliminar la <strong>noticia</strong> seleccionada?";
        else mssg = "¿Está seguro de eliminar las <strong>noticias</strong> seleccionadas?<br/>Total: " + Object.keys(window.noticiasCHECKED).length
        $.MessageBox({
          buttonDone  : "Si",
          buttonFail  : "No",
          message   : mssg
        }).done(function(){
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
      if(window.noticiasCHECKED == null) userDATOS.notificacion("No se seleccionó ninguna noticia","error");
      else if(Object.keys(window.noticiasCHECKED).length == 0) userDATOS.notificacion("No se seleccionó ninguna noticia","error");
      else {
        let select = $("<select multiple>", {
            css : {
                "width"         : "100%",
                "margin-top"    : "1rem"
            }
        });
        let arr = {};
        for(var i in window.variables.cliente.resultado)
        	if(arr[window.variables.cliente.resultado[i]["id"]] === undefined) arr[window.variables.cliente.resultado[i]["id"]] = window.variables.cliente.resultado[i]["nombre"]
        for(var i in arr)
          select.append("<option value='" + i + "'>" + arr[i] + "</option>");

        if(Object.keys(window.noticiasCHECKED).length == 1) mssg = "¿Está seguro de relevar la <strong>noticia</strong> seleccionada?";
        else mssg = "¿Está seguro de relevar las <strong>noticias</strong> seleccionadas?<br/>Total: " + Object.keys(window.noticiasCHECKED).length
        $.MessageBox({
          buttonDone  : "Si",
          buttonFail  : "No",
          message   : mssg,
          input   : select
        }).done(function(data){
          if($('tbody input[type="checkbox"]:checked').length == 1) {
            $('tbody input[type="checkbox"]:checked').each(function(){
                let o = userDATOS.busqueda($(this).val(),"noticia");
                let new_r = new Pyrus("noticiarelevo",false);
                for(var i in data) {
                  let nr = new_r.objetoLimpio();
                  nr["did_noticia"] = $(this).val();
                  nr["id_noticia"] = o.id_noticia;
                  nr["id_usuario"] = window.user_id;
                  nr["id_cliente"] = data[i];
                  new_r.guardar_1(nr);
                }//aca
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
    $(".body > aside .nav_ul a[data-url='noticias']").closest("ul").find(".active").removeClass("active");
    $(".body > aside .nav_ul a[data-url='noticias']").addClass("active");

    service_simat.noticias($scope);
    factory_simat.load("noticias4");
    service_simat.option($scope);

    selectMEDIOS = userDATOS.noticiasSELECT("procesada");

    $scope.mediosSELECT = selectMEDIOS.medio;
    $scope.mediostipoSELECT = selectMEDIOS.medio_tipo;
    $scope.seccionSELECT = selectMEDIOS.seccion;
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
      } else userDATOS.notificacion("Faltan datos de búsqueda","error");
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
      let clientes = userDATOS.busqueda(row.id,"proceso",false,"did_noticia",0);
      let clientes_osai = userDATOS.busquedaTabla("osai_usuario");//CLIENTES FINALES

      let noticia = tabla_noticia.rows(".selected").data()[0];
      let OBJ_clientes = {};
      for(var x in clientes) {
      	if(OBJ_clientes[clientes[x]["id_cliente"]] === undefined)
      		OBJ_clientes[clientes[x]["id_cliente"]] = 1;
      }
      let OBJ_clientes_osai = {};//CLIENTES FINALES <-- relacionado con --> UNIDAD DE ANALISIS
      for(var i in clientes_osai) {
        if(OBJ_clientes_osai[i] === undefined) {
          OBJ_clientes_osai[i] = {};
          OBJ_clientes_osai[i]["cliente_final"] = clientes_osai[i]["user"];
          OBJ_clientes_osai[i]["unidad_analisis"] = {};
          OBJ_clientes_osai[i]["estado"] = 0;
        }
        aux = userDATOS.busqueda(i,"osai_usuariounidad",false,"id_usuario_osai",0);
        for(var j in aux) {
          if(OBJ_clientes[aux[j]["id_cliente_osai"]] !== undefined) OBJ_clientes_osai[i]["estado"] = 1;
          u = window.variables.cliente.resultado[aux[j]["id_cliente_osai"]];
          OBJ_clientes_osai[i]["unidad_analisis"][aux[j]["id_cliente_osai"]] = u["nombre"];
        }
      }
      /**
       * ESTADOS DE UNA NOTICIA <-- OJO, no confundir con TIPO DE NOTICIA (NUEVA/VIEJA)
       * - 0: Default
       * - 1: Relevado
       * - 2: Procesada
       * - 3: Pre Publicación
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
      let mssg = "<p class='text-uppercase text-center'>¿Está seguro de pre publicar la <strong>noticia</strong> seleccionada?</p>";
      mssg += "<p class='text-uppercase mt-2 mb-0 text-center'><strong>clientes finales</strong></p>";
      let opt = []
      let select = $("<select multiple required>", {
          css : {
              "width"         : "100%",
              "margin-top"    : "1rem"
          }
      });
      let arr = {};
      // for(var i in window.variables.cliente.resultado)
      // 	if(arr[window.variables.cliente.resultado[i]["id"]] === undefined) arr[window.variables.cliente.resultado[i]["id"]] = window.variables.cliente.resultado[i]["nombre"]
      for(var i in OBJ_clientes_osai) {
        if(OBJ_clientes_osai[i]["estado"]) {
          opt.push(i);
          mssg += "<p class='mb-0 ml-2'>" + OBJ_clientes_osai[i]["cliente_final"] + "</p>";
          select.append("<option value='" + i + "' hidden>" + OBJ_clientes_osai[i]["cliente_final"] + "</option>");
        } else {
          select.append("<option value='" + i + "'>" + OBJ_clientes_osai[i]["cliente_final"] + "</option>");
        }
      }

      $.MessageBox({
        buttonDone  : "Si",
        buttonFail  : "No",
        message     : mssg,
        input       : select,
        filterDone  : function(data) {
        }
      }).done(function(data){
        mssg = "";
        if(data.length == 0) mssg = "Noticia lista para publicar en el CLIENTE FINAL.<br/>Para terminar, dirijase a <strong>CLIPPING</strong>";
        else mssg = "Noticia lista para publicar en los CLIENTES FINALES seleccionados.<br/>Para terminar, dirijase a <strong>CLIPPING</strong>";
        userDATOS.notificacion(mssg,"info",false);
        userDATOS.notificacion("La tabla y filtros se resetearan","warning",false);

        setTimeout(function() {
          for(var i in data) {//<-- CLIENTES que puede interarsarle / Publicado en el INDEX
            aux = {};
            aux["id_noticia"] = noticia.id;//TABLA noticia <-- OJO
            aux["id_usuario_osai"] = data[i];
            x = userDATOS.insertDatos("osai_cliente",aux);
            userDATOS.log(window.user_id,"NOTICIA pre publicada",0,x,"osai_cliente");
          }
          for(var i in opt) {//<-- CLIENTES valorados en la noticia / Publicado en el INDEX y MURO
            aux = {};
            aux["id_noticia"] = noticia.id;//TABLA noticia <-- OJO
            aux["id_usuario_osai"] = opt[i];
            aux["tipo_aviso"] = 1;
            x = userDATOS.insertDatos("osai_cliente",aux);
            userDATOS.log(window.user_id,"NOTICIA pre publicada",0,x,"osai_cliente");
          }
          userDATOS.change(noticia.id,"noticia","estado",3);
          tabla_noticia.draw();

          selectMEDIOS = userDATOS.noticiasSELECT("procesada");

          angular.element($(".submenu")).scope().mediosSELECT = selectMEDIOS.medio;
          angular.element($(".submenu")).scope().mediostipoSELECT = selectMEDIOS.medio_tipo;
          angular.element($(".submenu")).scope().seccionSELECT = selectMEDIOS.seccion;
          angular.element($(".submenu")).scope().unidadSELECT = selectMEDIOS.unidad;
          scopeNoticias(angular.element($(".submenu")).scope(),"procesadas",-1);
        },500);
      });
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
          let a = window.variables.attr_institucion.objeto["GUARDADO_ATTR"];
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

          accion = window.variables.attr_institucion.guardar_1(OBJ);//
          if(accion.id !== null && accion.flag) {//
            // window.variables[e].reload(false);//recargo contenido asy, por si se necesita
            userDATOS.log(window.user_id,"Alta de registro",0,accion.id,"attr_institucion");
            let elemento = userDATOS.busqueda(accion.id,"attr_institucion");//traigo el nuevo registro
            if(window.variables.attr_institucion.resultado[elemento.id] === undefined) {
              window.variables.attr_institucion.resultado[elemento.id] = elemento;
              $("#modal").modal("hide");
              return_ = "institucion"
            }
          } else userDATOS.notificacion("Datos repetidos","error");
        } else if($("#" + t.id).data("tipo") == "actorCREATE") {
          let a = window.variables["actor"].objeto["GUARDADO_ATTR"]
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
          accion = window.variables.actor.guardar_1(OBJ);//
          if(accion.id !== null && accion.flag) {//
            userDATOS.log(window.user_id,"Alta de registro",0,accion.id,"actor");
            let elemento = userDATOS.busqueda(accion.id,"actor");//traigo el nuevo registro
            if(window.variables.actor.resultado[elemento.id] === undefined) {
              window.variables.actor.resultado[elemento.id] = elemento;
              $("#modal").modal("hide");
              return_ = "actor"
            }
            window.ATTR = undefined;
          } else userDATOS.notificacion("Datos repetidos","error");
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
        buttonDone  : "Si",
        buttonFail  : "No",
        message   : "¿Está seguro de eliminar el <strong>proceso de la noticia</strong>?<br/>La noticia volverá al apartado <strong>A procesar</strong>"
      }).done(function(){
        let noticia = tabla_noticia.row('.selected').data();
        let noticiaSELECCIONADA = userDATOS.busqueda(noticia.id,"noticia");
        let noticiaproceso = userDATOS.busqueda(noticiaSELECCIONADA.id_noticia,"noticiasproceso",false,"id_noticia");
        let proceso = userDATOS.busqueda(noticiaSELECCIONADA.id_noticia,"proceso",false,"id_noticia");
        let actores = userDATOS.busqueda(noticiaSELECCIONADA.id_noticia,"noticiasactor",false,"id_noticia",0);
        let clientes = userDATOS.busqueda(noticiaSELECCIONADA.id_noticia,"noticiascliente",false,"id_noticia",0);
        let instituciones = userDATOS.busqueda(noticiaSELECCIONADA.id_noticia,"noticiasinstitucion",false,"id_noticia",0);
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
        message   : "¿Está seguro de eliminar la <strong>noticia</strong>?<br/>Al confirmar, se eliminará todo proceso relacionado"
      }).done(function(){
        let noticia = tabla_noticia.row('.selected').data();
        let noticiaSELECCIONADA = userDATOS.busqueda(noticia.id,"noticia");
        let noticiaproceso = userDATOS.busqueda(noticiaSELECCIONADA.id_noticia,"noticiasproceso",false,"id_noticia");
        let proceso = userDATOS.busqueda(noticiaSELECCIONADA.id_noticia,"proceso",false,"id_noticia");
        let actores = userDATOS.busqueda(noticiaSELECCIONADA.id_noticia,"noticiasactor",false,"id_noticia",0);
        let clientes = userDATOS.busqueda(noticiaSELECCIONADA.id_noticia,"noticiascliente",false,"id_noticia",0);
        let instituciones = userDATOS.busqueda(noticiaSELECCIONADA.id_noticia,"noticiasinstitucion",false,"id_noticia",0);
        let procesoDATA = userDATOS.parseJSON(noticiaproceso.data);

        let periodista = userDATOS.busqueda(noticiaSELECCIONADA.id_noticia,"noticiaperiodista",false,"id_noticia");

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
      $.MessageBox({
        buttonDone  : "Si",
        buttonFail  : "No",
        message   : "¿Está seguro de editar el proceso de la noticia?"
      }).done(function(){
        $(b).parent().append('<button onclick="userDATOS.guardarEdicion(this)" class="btn btn-sm btn-success position-absolute" style="left: 15px;top: 20px;"><i class="fas fa-check"></i></button>');
        $(b).remove();
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
      userDATOS.modal(null,window.variables.attr_institucion,"institucionCREATE");
    }
    userDATOS.createActor = function() {
      userDATOS.modal(null,window.variables.actor,"actorCREATE");
    }

    $scope.unidadAnalisis = function(index_ = -1) {
      let OBJ_datos = {1: "Favor",2: "Neutro",3:"Contra"};
      if(window.noticiaSELECCIONADAeditar === undefined) {
        modal = $("#modal");
        modal.find(".modal-title").text("UNIDAD DE ANÁLISIS")
        for(var i in window.ARR_cliente) {
          // cliente = userDATOS.busqueda(i,"cliente");
          html = "";
          html += "<article class='text-dark border-bottom mb-2'>";
            html += "<h4 class='text-center'>" + window.variables.cliente.mostrar_1(i) + "</h4>";
            html += "<div class='row'>";
              html += "<div class='col-6'>";
                if(window.ARR_cliente[i]["valoracion"] !== null) {
                  html += "<p style='font-size:1.5em;' class='m-0 text-center'>VALORACION</p>"
                  for(var x in window.ARR_cliente[i]["valoracion"]) {
                    id = x.substr(4);
                    STR_class = "";
                    if(parseInt(window.ARR_cliente[i]["valoracion"][x]) == 1) STR_class = "bg-success text-white";
                    if(parseInt(window.ARR_cliente[i]["valoracion"][x]) == 2) STR_class = "bg-warning";
                    if(parseInt(window.ARR_cliente[i]["valoracion"][x]) == 3) STR_class = "bg-danger text-white";
                    texto = window.variables.calificacion.mostrar_1(id).split(" (");
                    html += "<p style='font-size:1.5em;' class='m-0 pl-1 pr-1 " + STR_class + "'>" + texto[0] + " " + "</p>"
                  }
                }
              html += "</div>";
              html += "<div class='col-6'>";
                if(window.ARR_cliente[i]["tema"] !== null) {
                  html += "<p style='font-size:1.5em;' class='m-0 text-center'>TEMA</p>"
                  for(var x in window.ARR_cliente[i]["tema"]) {
                    if(x == "texto") continue;
                    if(window.ARR_cliente[i]["tema"][x] !== null) {
                      if(window.ARR_cliente[i]["tema"][x]["DESACTIVADO"] !== undefined) delete window.ARR_cliente[i]["tema"][x]
                    }
                    id = x.substr(9);
                    STR_class = "";
                    if(parseInt(window.ARR_cliente[i]["tema"][x]["valor"]) == 1) STR_class = "bg-success text-white";
                    if(parseInt(window.ARR_cliente[i]["tema"][x]["valor"]) == 0) STR_class = "bg-warning";
                    if(parseInt(window.ARR_cliente[i]["tema"][x]["valor"]) == -1) STR_class = "bg-danger text-white";

                    html += "<p style='font-size:1.5em;' class='m-0 pl-1 pr-1 " + STR_class + "'>" + window.variables.attr_temas.mostrar_1(id) + " " + "</p>"
                  }
                }
              html += "</div>";
            html += "</div>";
          html += "</article>";

          modal.find(".modal-body").append(html);
        }
        modal.modal("show")
      } else {
        window.valoracionARR = undefined;
        $("#modal").find(".close").removeClass("d-none");

        if(window.index_cliente === undefined) window.index_cliente = 0;
        let OBJ_p = new Pyrus();
        flag = true;
        // if(window.noticiaSELECCIONADA !== undefined) {
        //   if(parseInt(window.noticiaSELECCIONADA.estado) == 2) flag = false;
        // }
        html = "";btn = "";
        if(flag) {
          //
          // btn = "<button class=\"btn btn-block text-uppercase\">establecer</button>";
          html += '<div class="row mb-3">';
            html += "<div class='col'>";
              html += "<button type='button' onclick='userDATOS.addUnidad();' class='btn btn-block btn-primary text-uppercase'>nueva unidad</button>";
            html += "</div>";
          html += "</div>";
        }

        html += '<div class="row">';
          html += "<div class='col'>";
            html += "<table class='table m-0' id='modal-table-unidad'>";
              html += "<tbody>";
              flag = false;
              if(window.ARR_cliente !== undefined) {
                for(var i in window.ARR_cliente) {
                  if(index_ == 0) {
                    window.index_cliente ++;
                    tr = window.index_cliente;
                    html += "<tr>" +
                        '<td onclick="userDATOS.removeUnidad(this);" style="width:24px;" class="bg-danger text-white position-relative cursor-pointer"><span class="position-absolute w-100 text-center" style="left:0; top: calc(50% - 10.5px);"><i class="fas fa-times"></i></span></td>' +
                        '<td style="width:226px">' + window.variables.cliente.select({"NECESARIO":1,"NOMBRE":"Unidad a analizar"},"frm_cliente-" + tr,"form-control",{"onchange":"'userDATOS.unidadUnico(this);'"},null,i) + '</td>' +
                        '<td><div class="rounded bg-light p-2 text-center border text-uppercase">sin acción</div></td>' +
                        '<td style="width:250px;"><div class="border p-2 text-truncate text-uppercase">sin temas</div></td>' +
                        '<td onclick="userDATOS.updateUnidad(this);" style="width:24px;" class="bg-success text-white position-relative cursor-pointer"><span class="position-absolute w-100 text-center" style="left:0; top: calc(50% - 10.5px);"><i class="fas fa-edit"></i></span></td>';
                    html += "</tr>";
                  } else {
                    // if(window.ARR_cliente[i]["nuevo"] !== undefined) delete window.ARR_cliente[i];
                    //else {
                      window.index_cliente ++;
                      tr = window.index_cliente;

                      html += "<tr>" +
                          '<td onclick="userDATOS.removeUnidad(this);" style="width:24px;" class="bg-danger text-white position-relative cursor-pointer"><span class="position-absolute w-100 text-center" style="left:0; top: calc(50% - 10.5px);"><i class="fas fa-times"></i></span></td>' +
                          '<td style="width:226px">' + window.variables["cliente"].select({"NECESARIO":1,"NOMBRE":"Unidad a analizar"},"frm_cliente-" + tr,"form-control",{"onchange":"'userDATOS.unidadUnico(this);'"}) + '</td>' +
                          '<td><div class="rounded bg-light p-2 text-center border text-uppercase">sin acción</div></td>' +
                          '<td style="width:250px;"><div class="border p-2 text-truncate text-uppercase">sin temas</div></td>' +
                          '<td onclick="userDATOS.updateUnidad(this);" style="width:24px;" class="bg-success text-white position-relative cursor-pointer"><span class="position-absolute w-100 text-center" style="left:0; top: calc(50% - 10.5px);"><i class="fas fa-edit"></i></span></td>';
                      html += "</tr>";

                  }
                }
                if(Object.keys(ARR_cliente).length == 0) flag = true;
              } else flag = true;
              if(flag) {
                window.index_cliente ++;
                tr = window.index_cliente;

                html += "<tr>" +
                    '<td onclick="userDATOS.removeUnidad(this);" style="width:24px;" class="bg-danger text-white position-relative cursor-pointer"><span class="position-absolute w-100 text-center" style="left:0; top: calc(50% - 10.5px);"><i class="fas fa-times"></i></span></td>' +
                    '<td style="width:226px">' + window.variables["cliente"].select({"NECESARIO":1,"NOMBRE":"Unidad a analizar"},"frm_cliente-" + tr,"form-control",{"onchange":"'userDATOS.unidadUnico(this);'"}) + '</td>' +
                    '<td><div class="rounded bg-light p-2 text-center border text-uppercase">sin acción</div></td>' +
                    '<td style="width:250px;"><div class="border p-2 text-truncate text-uppercase">sin temas</div></td>' +
                    '<td onclick="userDATOS.updateUnidad(this);" style="width:24px;" class="bg-success text-white position-relative cursor-pointer"><span class="position-absolute w-100 text-center" style="left:0; top: calc(50% - 10.5px);"><i class="fas fa-edit"></i></span></td>';
                html += "</tr>";
              }
              html += "</tbody>";
            html += "</table>";
          html += "</div>";
        html += "</div>";

        $("#modal").addClass("bd-example-modal-lg");
        $("#modal").find(".modal-dialog").addClass("modal-lg");
        userDATOS.modalNOTICIA(html,btn,{tipo:"cliente",nombre:"Unidad de Análisis"},(index_ == -1 ? null : 0))//ACAa
      }
    }
    $scope.institucion = function() {

      if(window.noticiaSELECCIONADAeditar === undefined) {
        modal = $("#modal");
        modal.find(".modal-title").text("INSTITUCIONES");
        html = "";
        html += "<table class='table w-100 text-dark'>";
        html += "<thead>";
          html += "<th>INSTITUCIÓN</th>";
          html += "<th class='text-center'>EMISOR</th>";
          html += "<th class='text-center'>VALORACIÓN</th>";
        html += "</thead>";
        html += "<tbody>";
        for(var i in window.ARR_institucion) {
          html += "<tr>";
            html += "<td>" + window.variables.attr_institucion.mostrar_1(i) + "</td>";
            emisor = "";
            if(parseInt(window.ARR_institucion[i]["frm_emisor"]) == 1) emisor = "SI";
            if(parseInt(window.ARR_institucion[i]["frm_emisor"]) == 0) emisor = "NO";
            html += "<td class='text-center'>" + emisor + "</td>"
            STR_class = "";
            if(parseInt(window.ARR_institucion[i]["frm_valor"]) == 1) STR_class = "<p class='m-0 p-2 bg-success text-white'>POSITIVO</p>";
            if(parseInt(window.ARR_institucion[i]["frm_valor"]) == 0) STR_class = "<p class='m-0 p-2 bg-warning'>NEUTRO</p>";
            if(parseInt(window.ARR_institucion[i]["frm_valor"]) == -1) STR_class = "<p class='m-0 p-2 bg-danger text-white'>NEGATIVO</p>";
            html += "<td class='p-0 text-center'>" + STR_class + "</td>"
          html += "</tr>";
        }
        html += "</tbody>";
        html += "</table>";
        modal.find(".modal-body").append(html);
        modal.modal("show")
      } else {
        if(window.index_institucion === undefined) window.index_institucion = 0;
        html = "";btn = "";
        flag = true;
        if(window.noticiaSELECCIONADA !== undefined && window.noticiaSELECCIONADAeditar === undefined) {
          if(parseInt(window.noticiaSELECCIONADA.estado) == 2) flag = false;
        }
        if(flag) {
          btn = "<button class=\"btn btn-block text-uppercase\">establecer</button>";
          html += '<div class="row mb-3 justify-content-center">';
            html += "<div class='col-6'>";
              html += "<button type='button' onclick='userDATOS.addInstitucion();' class='btn btn-block btn-primary text-uppercase'>nueva institución</button>";
            html += "</div>";
            if(parseInt(window.usuario.nivel) != 4) {
              html += "<div class='col-6'>";
                html += "<button type='button' onclick='userDATOS.createInstitucion();' class='btn btn-block btn-success text-uppercase'>crear institución</button>";
              html += "</div>";
            }
          html += "</div>";
        }
        html += '<div class="row">';
          html += "<div class='col'>";
            html += "<table class='table m-0' id='modal-table-institucion'>";
            if(window.ARR_institucion !== undefined) {//ARRAY de Objetos de los actores involucrados en la nota
              for(var i in window.ARR_institucion) {
                window.index_institucion ++;
                tr = window.index_institucion;
                html += "<tr>" +
                  '<td onclick="userDATOS.removeInstitucion(this);" style="width:24px;" class="bg-danger text-white position-relative cursor-pointer"><span class="position-absolute w-100 text-center" style="left:0; top: calc(50% - 10.5px);"><i class="fas fa-times"></i></span></td>' +
                  '<td style="width:180px">' + window.variables.attr_institucion.select({"NECESARIO":1,"NOMBRE":"Institución"},"frm_institucion-" + tr,"form-control",{"onchange":"'userDATOS.institucionUnico(this);'"},null,i) + '</td>' +
                  '<td><div class="d-flex justify-content-center w-100 custom-control custom-checkbox m-0 pt-2 pb-2"><input class="custom-control-input m-0" type="checkbox" data-check="emisor" value="1" name="frm_emisor-' + tr + '" id="emisor_' + tr + '" /><label for="emisor_' + tr + '" class="custom-control-label">Emisor</label></div></td>' +

                  '<td class="d-flex justify-content-center">' +
                      '<div class="custom-control custom-radio custom-control-inline pb-2 pt-2 mr-2"><input class="custom-control-input" type="radio" name="frm_valor-' + tr + '" value="1" data-check="" id="pos_' + tr + '" /><label class="custom-control-label text-success" for="pos_' + tr + '">Positivo</label></div>' +
                      '<div class="custom-control custom-radio custom-control-inline pb-2 pt-2 mr-2"><input class="custom-control-input" type="radio" name="frm_valor-' + tr + '" value="0" data-check="" id="neu_' + tr + '" /><label class="custom-control-label text-warning" for="neu_' + tr + '">Neutro</label></div>' +
                      '<div class="custom-control custom-radio custom-control-inline pb-2 pt-2 mr-0"><input class="custom-control-input" type="radio" name="frm_valor-' + tr + '" value="-1" data-check="" id="neg_' + tr + '" /><label class="custom-control-label text-danger" for="neg_' + tr + '">Negativo</label></div>' +
                  '</td>';
                html += "</tr>";
              }
            } else {
              window.index_institucion ++;
              tr = window.index_institucion;

              html += "<tr>" +
                  '<td onclick="userDATOS.removeInstitucion(this);" style="width:24px;" class="bg-danger text-white position-relative cursor-pointer"><span class="position-absolute w-100 text-center" style="left:0; top: calc(50% - 10.5px);"><i class="fas fa-times"></i></span></td>' +
                  '<td style="width:180px">' + window.variables.attr_institucion.select({"NECESARIO":1,"NOMBRE":"Institución"},"frm_institucion-" + tr,"form-control",{"onchange":"'userDATOS.institucionUnico(this);'"}) + '</td>' +
                  '<td><div class="d-flex justify-content-center w-100 custom-control custom-checkbox m-0 pt-2 pb-2"><input class="custom-control-input m-0" type="checkbox" data-check="emisor" value="1" name="frm_emisor-' + tr + '" id="emisor_' + tr + '" /><label for="emisor_' + tr + '" class="custom-control-label">Emisor</label></div></td>' +
                  '<td class="d-flex justify-content-center">' +
                      '<div class="custom-control custom-radio custom-control-inline pb-2 pt-2 mr-2"><input class="custom-control-input" type="radio" name="frm_valor-' + tr + '" value="1" data-check="" id="pos_' + tr + '" /><label class="custom-control-label text-success" for="pos_' + tr + '">Positivo</label></div>' +
                      '<div class="custom-control custom-radio custom-control-inline pb-2 pt-2 mr-2"><input class="custom-control-input" type="radio" name="frm_valor-' + tr + '" value="0" data-check="" id="neu_' + tr + '" /><label class="custom-control-label text-warning" for="neu_' + tr + '">Neutro</label></div>' +
                      '<div class="custom-control custom-radio custom-control-inline pb-2 pt-2 mr-0"><input class="custom-control-input" type="radio" name="frm_valor-' + tr + '" value="-1" data-check="" id="neg_' + tr + '" /><label class="custom-control-label text-danger" for="neg_' + tr + '">Negativo</label></div>' +
                  '</td>';
              html += "</tr>";
            }
              html += "</tbody>";
            html += "</table>";
          html += "</div>";
        html += "</div>";

        $("#modal").addClass("bd-example-modal-lg");
        $("#modal").find(".modal-dialog").addClass("modal-lg");
        userDATOS.modalNOTICIA(html,btn,{tipo:"institucion",nombre:"Instituciones"});
      }
    }
    $scope.actor = function(index_ = -1) {
      if(window.noticiaSELECCIONADAeditar === undefined) {
        modal = $("#modal");
        modal.find(".modal-title").text("ACTORES");
        html = "";
        html += "<table class='table w-100 text-dark'>";
        html += "<thead>";
          html += "<th>ACTOR</th>";
          html += "<th class='text-center'>EMISOR</th>";
          html += "<th class='text-center'>IMAGEN</th>";
          html += "<th class='text-center'>VALORACIÓN</th>";
        html += "</thead>";
        html += "<tbody>";
        for(var i in window.ARR_actor) {
          html += "<tr>";
            html += "<td>" + window.variables.actor.mostrar_1(i) + "</td>";
            emisor = "";
            if(parseInt(window.ARR_actor[i]["frm_emisor"]) == 1) emisor = "SI";
            if(parseInt(window.ARR_actor[i]["frm_emisor"]) == 0) emisor = "NO";
            html += "<td class='text-center'>" + emisor + "</td>"
            img = "";
            if(parseInt(window.ARR_actor[i]["frm_img"]) == 1) img = "SI";
            if(parseInt(window.ARR_actor[i]["frm_img"]) == 0) img = "NO";
            html += "<td class='text-center'>" + img + "</td>"
            STR_class = "";
            if(parseInt(window.ARR_actor[i]["frm_valor"]) == 1) STR_class = "<p class='m-0 p-2 bg-success text-white'>POSITIVO</p>";
            if(parseInt(window.ARR_actor[i]["frm_valor"]) == 0) STR_class = "<p class='m-0 p-2 bg-warning'>NEUTRO</p>";
            if(parseInt(window.ARR_actor[i]["frm_valor"]) == -1) STR_class = "<p class='m-0 p-2 bg-danger text-white'>NEGATIVO</p>";
            html += "<td class='p-0 text-center'>" + STR_class + "</td>"
          html += "</tr>";
        }
        html += "</tbody>";
        html += "</table>";
        modal.find(".modal-body").append(html);
        modal.modal("show")
      } else {
        if(window.index_actor === undefined) window.index_actor = 0;
        flag = true;
        if(window.noticiaSELECCIONADA !== undefined) {
          if(parseInt(window.noticiaSELECCIONADA.estado) == 2 && window.noticiaSELECCIONADAeditar === undefined) flag = false;
        }
        html = "";btn = "";
        if(flag) {
          //
          btn = (index_ == -1 ? "<button class=\"btn btn-block text-uppercase\">establecer</button>" : "<button class=\"btn btn-block text-uppercase\">editar</button>");
          html += '<div class="row mb-3 justify-content-center">';
            html += "<div class='col-6'>";
              html += "<button type='button' onclick='userDATOS.addActor();' class='btn btn-block btn-primary text-uppercase'>nuevo actor</button>";
            html += "</div>";
            if(parseInt(window.usuario.nivel) != 4) {
              html += "<div class='col-6'>";
                html += "<button type='button' onclick='userDATOS.createActor();' class='btn btn-block btn-success text-uppercase'>crear actor</button>";
              html += "</div>";
            }
          html += "</div>";
        }

        html += '<div class="row">';
          html += "<div class='col'>";
            html += "<table class='table m-0' id='modal-table-actor'>";
              html += "<tbody>";
              if(window.ARR_actor !== undefined) {//ARRAY de Objetos de los actores involucrados en la nota
                for(var i in window.ARR_actor) {
                  window.index_actor ++;
                  tr = window.index_actor;
                  html += "<tr>" +
                      '<td onclick="userDATOS.removeActor(this);" style="width:24px;" class="bg-danger text-white position-relative cursor-pointer"><span class="position-absolute w-100 text-center" style="left:0; top: calc(50% - 10.5px);"><i class="fas fa-times"></i></span></td>' +
                      '<td style="width:156px">' + window.variables.actor.select({"NECESARIO":1,"NOMBRE":"Actor"},"frm_actor-" + tr,"form-control",{"onchange":"'userDATOS.actorUnico(this);'"},null,i) + '</td>' +
                      '<td><div class="d-flex justify-content-center w-100 custom-control custom-checkbox m-0 pt-2 pb-2"><input class="custom-control-input m-0" type="checkbox" data-check="img" value="1" name="frm_img-' + tr + '" id="img_' + tr + '" /><label for="img_' + tr + '" class="custom-control-label">Imagen</label></div></td>' +
                      '<td><div class="d-flex justify-content-center w-100 custom-control custom-checkbox m-0 pt-2 pb-2"><input class="custom-control-input m-0" type="checkbox" data-check="emisor" value="1" name="frm_emisor-' + tr + '" id="emisor_' + tr + '" /><label for="emisor_' + tr + '" class="custom-control-label">Emisor</label></div></td>' +
                      '<td class="d-flex justify-content-center">' +
                          '<div class="custom-control custom-radio custom-control-inline pb-2 pt-2 mr-2"><input class="custom-control-input" type="radio" name="frm_valor-' + tr + '" value="1" data-check="" id="pos_' + tr + '" /><label class="custom-control-label text-success" for="pos_' + tr + '">Positivo</label></div>' +
                          '<div class="custom-control custom-radio custom-control-inline pb-2 pt-2 mr-2"><input class="custom-control-input" type="radio" name="frm_valor-' + tr + '" value="0" data-check="" id="neu_' + tr + '" /><label class="custom-control-label text-warning" for="neu_' + tr + '">Neutro</label></div>' +
                          '<div class="custom-control custom-radio custom-control-inline pb-2 pt-2 mr-0"><input class="custom-control-input" type="radio" name="frm_valor-' + tr + '" value="-1" data-check="" id="neg_' + tr + '" /><label class="custom-control-label text-danger" for="neg_' + tr + '">Negativo</label></div>' +
                      '</td>';
                  html += "</tr>";
                }
              } else {
                window.index_actor ++;
                tr = window.index_actor;

                html += "<tr>" +
                    '<td onclick="userDATOS.removeActor(this);" style="width:24px;" class="bg-danger text-white position-relative cursor-pointer"><span class="position-absolute w-100 text-center" style="left:0; top: calc(50% - 10.5px);"><i class="fas fa-times"></i></span></td>' +
                    '<td style="width:156px">' + window.variables["actor"].select({"NECESARIO":1,"NOMBRE":"Actor"},"frm_actor-" + tr,"form-control",{"onchange":"'userDATOS.actorUnico(this);'"}) + '</td>' +
                    '<td><div class="d-flex justify-content-center w-100 custom-control custom-checkbox m-0 pt-2 pb-2"><input class="custom-control-input m-0" type="checkbox" data-check="img" value="1" name="frm_img-' + tr + '" id="img_' + tr + '" /><label for="img_' + tr + '" class="custom-control-label">Imagen</label></div></td>' +
                    '<td><div class="d-flex justify-content-center w-100 custom-control custom-checkbox m-0 pt-2 pb-2"><input class="custom-control-input m-0" type="checkbox" data-check="emisor" value="1" name="frm_emisor-' + tr + '" id="emisor_' + tr + '" /><label for="emisor_' + tr + '" class="custom-control-label">Emisor</label></div></td>' +
                    '<td class="d-flex justify-content-center">' +
                        '<div class="custom-control custom-radio custom-control-inline pb-2 pt-2 mr-2"><input class="custom-control-input" type="radio" name="frm_valor-' + tr + '" value="1" data-check="" id="pos_' + tr + '" /><label class="custom-control-label text-success" for="pos_' + tr + '">Positivo</label></div>' +
                        '<div class="custom-control custom-radio custom-control-inline pb-2 pt-2 mr-2"><input class="custom-control-input" type="radio" name="frm_valor-' + tr + '" value="0" data-check="" id="neu_' + tr + '" /><label class="custom-control-label text-warning" for="neu_' + tr + '">Neutro</label></div>' +
                        '<div class="custom-control custom-radio custom-control-inline pb-2 pt-2 mr-0"><input class="custom-control-input" type="radio" name="frm_valor-' + tr + '" value="-1" data-check="" id="neg_' + tr + '" /><label class="custom-control-label text-danger" for="neg_' + tr + '">Negativo</label></div>' +
                    '</td>';
                html += "</tr>";
              }
              html += "</tbody>";
            html += "</table>";
          html += "</div>";
        html += "</div>";

        $("#modal").addClass("bd-example-modal-lg");
        $("#modal").find(".modal-dialog").addClass("modal-lg");
        userDATOS.modalNOTICIA(html,btn,{tipo:"actor",nombre:"Actores"});
      }
    }
  });
  /**
   * Acciones de vista PROCESAR
   * Solo accedido por usuarios nivel 1 y 2
   */
  app.controller("procesar", function ($scope,$timeout,service_simat,factory_simat) {
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

    service_simat.option($scope);

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
      flag = false;
      for(var i in data) {
        if(data[i] != "") flag = true;
      }
      if(flag) {
        tabla_noticia.destroy();
        $("#t_data").addClass("animate-flicker")
        setTimeout(function() {
          userDATOS.dataTableNOTICIAS("#t_data",data)
        },500)
      } else userDATOS.notificacion("Faltan datos de búsqueda","error");
      //tabla_noticia.draw();
    })
    $("#btn_limpiar").on("click",function() {
      let minDateFilter = $('#fecha_min').val();
      let maxDateFilter = $('#fecha_max').val();
      let medioFilter = $('#select_medioNOTICIA').val();
      let medioTipoFilter = $('#select_medioTipoNOTICIA').val();
      let tituloFilter = $('#titulo').val();
      let seccionFilter = $('#select_seccionBUSCADOR').val();
      data = {"moderado":1,"minDateFilter":minDateFilter,"maxDateFilter":maxDateFilter,"medioFilter":medioFilter,"medioTipoFilter":medioTipoFilter,"tituloFilter":tituloFilter,"seccionFilter":JSON.stringify(seccionFilter)}
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
          userDATOS.dataTableNOTICIAS("#t_data",{"moderado":1});
        },500);
      }
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
          let a = window.variables.attr_institucion.objeto["GUARDADO_ATTR"];
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

          accion = window.variables.attr_institucion.guardar_1(OBJ);//
          if(accion.id !== null && accion.flag) {//
            // window.variables[e].reload(false);//recargo contenido asy, por si se necesita
            userDATOS.log(window.user_id,"Alta de registro",0,accion.id,"attr_institucion");
            let elemento = userDATOS.busqueda(accion.id,"attr_institucion");//traigo el nuevo registro
            if(window.variables.attr_institucion.resultado[elemento.id] === undefined) {
              window.variables.attr_institucion.resultado[elemento.id] = elemento;
              $("#modal").modal("hide");
              return_ = "institucion"
            }
          } else userDATOS.notificacion("Datos repetidos","error");
        } else if($("#" + t.id).data("tipo") == "actorCREATE") {
          let a = window.variables["actor"].objeto["GUARDADO_ATTR"]
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
          accion = window.variables.actor.guardar_1(OBJ);//
          if(accion.id !== null && accion.flag) {//
            userDATOS.log(window.user_id,"Alta de registro",0,accion.id,"actor");
            let elemento = userDATOS.busqueda(accion.id,"actor");//traigo el nuevo registro
            if(window.variables.actor.resultado[elemento.id] === undefined) {
              window.variables.actor.resultado[elemento.id] = elemento;
              $("#modal").modal("hide");
              return_ = "actor"
            }
            window.ATTR = undefined;
          } else userDATOS.notificacion("Datos repetidos","error");
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

    userDATOS.modalCLIENTE = function(i) {
      $scope.unidadAnalisis(i)
    }
    userDATOS.modalACTOR = function(i) {
      $scope.actor(i)
    }
    userDATOS.createInstitucion = function() {
      userDATOS.modal(null,window.variables.attr_institucion,"institucionCREATE");
    }
    userDATOS.createActor = function() {
      userDATOS.modal(null,window.variables.actor,"actorCREATE");
    }

    $scope.buscar = function() {
      userDATOS.notificacion("Buscando <strong>ACTORES</strong>","info",false);
      userDATOS.notificacion("Buscando <strong>INSTITUCIONES</strong>","info",false);
      userDATOS.procesar_noticia(function(resultado) {
        setTimeout(function() {
          if(resultado["actores"] === undefined) userDATOS.notificacion("<strong>ACTORES</strong> no detectados","warning");
          else {
            if(Object.keys(resultado["actores"]).length == 0) userDATOS.notificacion("<strong>ACTORES</strong> no detectados","warning");
            else userDATOS.notificacion("<strong>ACTORES</strong> encontrados","success");
          }
          if(resultado["instituciones"] === undefined) userDATOS.notificacion("<strong>INSTITUCIONES</strong> no detectadas","warning");
          else {
            if(Object.keys(resultado["instituciones"]).length == 0) userDATOS.notificacion("<strong>INSTITUCIONES</strong> no detectadas","warning");
            else userDATOS.notificacion("<strong>INSTITUCIONES</strong> encontradas","success");
          }
        },1000);
      });
    }
    $scope.unidadAnalisis = function(index_ = -1) {
      window.valoracionARR = undefined;
      $("#modal").find(".close").removeClass("d-none");

      if(window.index_cliente === undefined) window.index_cliente = 0;
      let OBJ_p = new Pyrus();
      let OBJ_datos = {1: "Favor",2: "Neutro",3:"Contra"};
      flag = true;
      if(window.noticiaSELECCIONADA !== undefined) {
        if(parseInt(window.noticiaSELECCIONADA.estado) == 2) flag = false;
      }
      html = "";btn = "";
      if(flag) {
        //
        // btn = "<button class=\"btn btn-block text-uppercase\">establecer</button>";
        html += '<div class="row mb-3 justify-content-center">';
          html += "<div class='col-6'>";
            html += "<button type='button' onclick='userDATOS.addUnidad();' class='btn btn-block btn-primary text-uppercase'>nueva unidad</button>";
          html += "</div>";
        html += "</div>";
      }

      html += '<div class="row">';
        html += "<div class='col'>";
          html += "<table class='table m-0' id='modal-table-unidad'>";
            html += "<tbody>";
            flag = false;
            if(window.ARR_cliente !== undefined) {
              for(var i in window.ARR_cliente) {
                if(index_ == 0) {
                  window.index_cliente ++;
                  tr = window.index_cliente;
                  html += "<tr>" +
                      '<td onclick="userDATOS.removeUnidad(this);" style="width:24px;" class="bg-danger text-white position-relative cursor-pointer"><span class="position-absolute w-100 text-center" style="left:0; top: calc(50% - 10.5px);"><i class="fas fa-times"></i></span></td>' +
                      '<td style="width:226px">' + window.variables.cliente.select({"NECESARIO":1,"NOMBRE":"Unidad a analizar"},"frm_cliente-" + tr,"form-control",{"onchange":"'userDATOS.unidadUnico(this);'"},null,i) + '</td>' +
                      '<td><div class="rounded bg-light p-2 text-center border text-uppercase">sin acción</div></td>' +
                      '<td style="width:250px;"><div class="border p-2 text-truncate text-uppercase">sin temas</div></td>' +
                      '<td onclick="userDATOS.updateUnidad(this);" style="width:24px;" class="bg-success text-white position-relative cursor-pointer"><span class="position-absolute w-100 text-center" style="left:0; top: calc(50% - 10.5px);"><i class="fas fa-edit"></i></span></td>';
                  html += "</tr>";
                } else {
                  // if(window.ARR_cliente[i]["nuevo"] !== undefined) delete window.ARR_cliente[i];
                  //else {
                    window.index_cliente ++;
                    tr = window.index_cliente;

                    html += "<tr>" +
                        '<td onclick="userDATOS.removeUnidad(this);" style="width:24px;" class="bg-danger text-white position-relative cursor-pointer"><span class="position-absolute w-100 text-center" style="left:0; top: calc(50% - 10.5px);"><i class="fas fa-times"></i></span></td>' +
                        '<td style="width:226px">' + window.variables["cliente"].select({"NECESARIO":1,"NOMBRE":"Unidad a analizar"},"frm_cliente-" + tr,"form-control",{"onchange":"'userDATOS.unidadUnico(this);'"}) + '</td>' +
                        '<td><div class="rounded bg-light p-2 text-center border text-uppercase">sin acción</div></td>' +
                        '<td style="width:250px;"><div class="border p-2 text-truncate text-uppercase">sin temas</div></td>' +
                        '<td onclick="userDATOS.updateUnidad(this);" style="width:24px;" class="bg-success text-white position-relative cursor-pointer"><span class="position-absolute w-100 text-center" style="left:0; top: calc(50% - 10.5px);"><i class="fas fa-edit"></i></span></td>';
                    html += "</tr>";

                }
              }
              if(Object.keys(ARR_cliente).length == 0) flag = true;
            } else flag = true;
            if(flag) {
              window.index_cliente ++;
              tr = window.index_cliente;

              html += "<tr>" +
                  '<td onclick="userDATOS.removeUnidad(this);" style="width:24px;" class="bg-danger text-white position-relative cursor-pointer"><span class="position-absolute w-100 text-center" style="left:0; top: calc(50% - 10.5px);"><i class="fas fa-times"></i></span></td>' +
                  '<td style="width:226px">' + window.variables["cliente"].select({"NECESARIO":1,"NOMBRE":"Unidad a analizar"},"frm_cliente-" + tr,"form-control",{"onchange":"'userDATOS.unidadUnico(this);'"}) + '</td>' +
                  '<td><div class="rounded bg-light p-2 text-center border text-uppercase">sin acción</div></td>' +
                  '<td style="width:250px;"><div class="border p-2 text-truncate text-uppercase">sin temas</div></td>' +
                  '<td onclick="userDATOS.updateUnidad(this);" style="width:24px;" class="bg-success text-white position-relative cursor-pointer"><span class="position-absolute w-100 text-center" style="left:0; top: calc(50% - 10.5px);"><i class="fas fa-edit"></i></span></td>';
              html += "</tr>";
            }
            html += "</tbody>";
          html += "</table>";
        html += "</div>";
      html += "</div>";

      $("#modal").addClass("bd-example-modal-lg");
      $("#modal").find(".modal-dialog").addClass("modal-lg");
      userDATOS.modalNOTICIA(html,btn,{tipo:"cliente",nombre:"Unidad de Análisis"},(index_ == -1 ? null : 0))//ACAa
    }
    $scope.institucion = function() {
      if(window.index_institucion === undefined) window.index_institucion = 0;

      html = "";btn = "";
      flag = true;
      if(window.noticiaSELECCIONADA !== undefined) {
        if(parseInt(window.noticiaSELECCIONADA.estado) == 2) flag = false;
      }
      if(flag) {
        btn = "<button class=\"btn btn-block text-uppercase\">establecer</button>";
        html += '<div class="row mb-3 justify-content-center">';
          html += "<div class='col-6'>";
            html += "<button type='button' onclick='userDATOS.addInstitucion();' class='btn btn-block btn-primary text-uppercase'>nueva institución</button>";
          html += "</div>";
          if(parseInt(window.usuario.nivel) != 4) {
            html += "<div class='col-6'>";
              html += "<button type='button' onclick='userDATOS.createInstitucion();' class='btn btn-block btn-success text-uppercase'>crear institución</button>";
            html += "</div>";
          }
        html += "</div>";
      }
      html += '<div class="row">';
        html += "<div class='col'>";
          html += "<table class='table m-0' id='modal-table-institucion'>";
          if(window.ARR_institucion !== undefined) {//ARRAY de Objetos de los actores involucrados en la nota
            for(var i in window.ARR_institucion) {
              window.index_institucion ++;
              tr = window.index_institucion;
              html += "<tr>" +
                '<td onclick="userDATOS.removeInstitucion(this);" style="width:24px;" class="bg-danger text-white position-relative cursor-pointer"><span class="position-absolute w-100 text-center" style="left:0; top: calc(50% - 10.5px);"><i class="fas fa-times"></i></span></td>' +
                '<td style="width:180px">' + window.variables.attr_institucion.select({"NECESARIO":1,"NOMBRE":"Institución"},"frm_institucion-" + tr,"form-control",{"onchange":"'userDATOS.institucionUnico(this);'"},null,i) + '</td>' +
                '<td><div class="d-flex justify-content-center w-100 custom-control custom-checkbox m-0 pt-2 pb-2"><input class="custom-control-input m-0" type="checkbox" data-check="emisor" value="1" name="frm_emisor-' + tr + '" id="emisor_' + tr + '" /><label for="emisor_' + tr + '" class="custom-control-label">Emisor</label></div></td>' +

                '<td class="d-flex justify-content-center">' +
                    '<div class="custom-control custom-radio custom-control-inline pb-2 pt-2 mr-2"><input class="custom-control-input" type="radio" name="frm_valor-' + tr + '" value="1" data-check="" id="pos_' + tr + '" /><label class="custom-control-label text-success" for="pos_' + tr + '">Positivo</label></div>' +
                    '<div class="custom-control custom-radio custom-control-inline pb-2 pt-2 mr-2"><input class="custom-control-input" type="radio" name="frm_valor-' + tr + '" value="0" data-check="" id="neu_' + tr + '" /><label class="custom-control-label text-warning" for="neu_' + tr + '">Neutro</label></div>' +
                    '<div class="custom-control custom-radio custom-control-inline pb-2 pt-2 mr-0"><input class="custom-control-input" type="radio" name="frm_valor-' + tr + '" value="-1" data-check="" id="neg_' + tr + '" /><label class="custom-control-label text-danger" for="neg_' + tr + '">Negativo</label></div>' +
                '</td>';
              html += "</tr>";
            }
          } else {
            window.index_institucion ++;
            tr = window.index_institucion;

            html += "<tr>" +
                '<td onclick="userDATOS.removeInstitucion(this);" style="width:24px;" class="bg-danger text-white position-relative cursor-pointer"><span class="position-absolute w-100 text-center" style="left:0; top: calc(50% - 10.5px);"><i class="fas fa-times"></i></span></td>' +
                '<td style="width:180px">' + window.variables["attr_institucion"].select({"NECESARIO":1,"NOMBRE":"Institución"},"frm_institucion-" + tr,"form-control",{"onchange":"'userDATOS.institucionUnico(this);'"}) + '</td>' +
                '<td><div class="d-flex justify-content-center w-100 custom-control custom-checkbox m-0 pt-2 pb-2"><input class="custom-control-input m-0" type="checkbox" data-check="emisor" value="1" name="frm_emisor-' + tr + '" id="emisor_' + tr + '" /><label for="emisor_' + tr + '" class="custom-control-label">Emisor</label></div></td>' +
                '<td class="d-flex justify-content-center">' +
                    '<div class="custom-control custom-radio custom-control-inline pb-2 pt-2 mr-2"><input class="custom-control-input" type="radio" name="frm_valor-' + tr + '" value="1" data-check="" id="pos_' + tr + '" /><label class="custom-control-label text-success" for="pos_' + tr + '">Positivo</label></div>' +
                    '<div class="custom-control custom-radio custom-control-inline pb-2 pt-2 mr-2"><input class="custom-control-input" type="radio" name="frm_valor-' + tr + '" value="0" data-check="" id="neu_' + tr + '" /><label class="custom-control-label text-warning" for="neu_' + tr + '">Neutro</label></div>' +
                    '<div class="custom-control custom-radio custom-control-inline pb-2 pt-2 mr-0"><input class="custom-control-input" type="radio" name="frm_valor-' + tr + '" value="-1" data-check="" id="neg_' + tr + '" /><label class="custom-control-label text-danger" for="neg_' + tr + '">Negativo</label></div>' +
                '</td>';
            html += "</tr>";
          }
            html += "</tbody>";
          html += "</table>";
        html += "</div>";
      html += "</div>";

      $("#modal").addClass("bd-example-modal-lg");
      $("#modal").find(".modal-dialog").addClass("modal-lg");
      userDATOS.modalNOTICIA(html,btn,{tipo:"institucion",nombre:"Instituciones"});
    }
    $scope.actor = function(index_ = -1) {
      if(window.index_actor === undefined) window.index_actor = 0;
      flag = true;
      if(window.noticiaSELECCIONADA !== undefined) {
        if(parseInt(window.noticiaSELECCIONADA.estado) == 2) flag = false;
      }
      html = "";btn = "";
      if(flag) {
        //
        btn = (index_ == -1 ? "<button class=\"btn btn-block text-uppercase\">establecer</button>" : "<button class=\"btn btn-block text-uppercase\">editar</button>");
        html += '<div class="row mb-3 justify-content-center">';
          html += "<div class='col-6'>";
            html += "<button type='button' onclick='userDATOS.addActor();' class='btn btn-block btn-primary text-uppercase'>nuevo actor</button>";
          html += "</div>";
          if(parseInt(window.usuario.nivel) != 4) {
            html += "<div class='col-6'>";
              html += "<button type='button' onclick='userDATOS.createActor();' class='btn btn-block btn-success text-uppercase'>crear actor</button>";
            html += "</div>";
          }
        html += "</div>";
      }

      html += '<div class="row">';
        html += "<div class='col'>";
          html += "<table class='table m-0' id='modal-table-actor'>";
            html += "<tbody>";
            if(window.ARR_actor !== undefined) {//ARRAY de Objetos de los actores involucrados en la nota
              for(var i in window.ARR_actor) {
                window.index_actor ++;
                tr = window.index_actor;
                html += "<tr>" +
                    '<td onclick="userDATOS.removeActor(this);" style="width:24px;" class="bg-danger text-white position-relative cursor-pointer"><span class="position-absolute w-100 text-center" style="left:0; top: calc(50% - 10.5px);"><i class="fas fa-times"></i></span></td>' +
                    '<td style="width:156px">' + window.variables.actor.select({"NECESARIO":1,"NOMBRE":"Actor"},"frm_actor-" + tr,"form-control",{"onchange":"'userDATOS.actorUnico(this);'"},null,i) + '</td>' +
                    '<td><div class="d-flex justify-content-center w-100 custom-control custom-checkbox m-0 pt-2 pb-2"><input class="custom-control-input m-0" type="checkbox" data-check="img" value="1" name="frm_img-' + tr + '" id="img_' + tr + '" /><label for="img_' + tr + '" class="custom-control-label">Imagen</label></div></td>' +
                    '<td><div class="d-flex justify-content-center w-100 custom-control custom-checkbox m-0 pt-2 pb-2"><input class="custom-control-input m-0" type="checkbox" data-check="emisor" value="1" name="frm_emisor-' + tr + '" id="emisor_' + tr + '" /><label for="emisor_' + tr + '" class="custom-control-label">Emisor</label></div></td>' +
                    '<td class="d-flex justify-content-center">' +
                        '<div class="custom-control custom-radio custom-control-inline pb-2 pt-2 mr-2"><input class="custom-control-input" type="radio" name="frm_valor-' + tr + '" value="1" data-check="" id="pos_' + tr + '" /><label class="custom-control-label text-success" for="pos_' + tr + '">Positivo</label></div>' +
                        '<div class="custom-control custom-radio custom-control-inline pb-2 pt-2 mr-2"><input class="custom-control-input" type="radio" name="frm_valor-' + tr + '" value="0" data-check="" id="neu_' + tr + '" /><label class="custom-control-label text-warning" for="neu_' + tr + '">Neutro</label></div>' +
                        '<div class="custom-control custom-radio custom-control-inline pb-2 pt-2 mr-0"><input class="custom-control-input" type="radio" name="frm_valor-' + tr + '" value="-1" data-check="" id="neg_' + tr + '" /><label class="custom-control-label text-danger" for="neg_' + tr + '">Negativo</label></div>' +
                    '</td>';
                html += "</tr>";
              }
            } else {
              window.index_actor ++;
              tr = window.index_actor;

              html += "<tr>" +
                  '<td onclick="userDATOS.removeActor(this);" style="width:24px;" class="bg-danger text-white position-relative cursor-pointer"><span class="position-absolute w-100 text-center" style="left:0; top: calc(50% - 10.5px);"><i class="fas fa-times"></i></span></td>' +
                  '<td style="width:156px">' + window.variables["actor"].select({"NECESARIO":1,"NOMBRE":"Actor"},"frm_actor-" + tr,"form-control",{"onchange":"'userDATOS.actorUnico(this);'"}) + '</td>' +
                  '<td><div class="d-flex justify-content-center w-100 custom-control custom-checkbox m-0 pt-2 pb-2"><input class="custom-control-input m-0" type="checkbox" data-check="img" value="1" name="frm_img-' + tr + '" id="img_' + tr + '" /><label for="img_' + tr + '" class="custom-control-label">Imagen</label></div></td>' +
                  '<td><div class="d-flex justify-content-center w-100 custom-control custom-checkbox m-0 pt-2 pb-2"><input class="custom-control-input m-0" type="checkbox" data-check="emisor" value="1" name="frm_emisor-' + tr + '" id="emisor_' + tr + '" /><label for="emisor_' + tr + '" class="custom-control-label">Emisor</label></div></td>' +
                  '<td class="d-flex justify-content-center">' +
                      '<div class="custom-control custom-radio custom-control-inline pb-2 pt-2 mr-2"><input class="custom-control-input" type="radio" name="frm_valor-' + tr + '" value="1" data-check="" id="pos_' + tr + '" /><label class="custom-control-label text-success" for="pos_' + tr + '">Positivo</label></div>' +
                      '<div class="custom-control custom-radio custom-control-inline pb-2 pt-2 mr-2"><input class="custom-control-input" type="radio" name="frm_valor-' + tr + '" value="0" data-check="" id="neu_' + tr + '" /><label class="custom-control-label text-warning" for="neu_' + tr + '">Neutro</label></div>' +
                      '<div class="custom-control custom-radio custom-control-inline pb-2 pt-2 mr-0"><input class="custom-control-input" type="radio" name="frm_valor-' + tr + '" value="-1" data-check="" id="neg_' + tr + '" /><label class="custom-control-label text-danger" for="neg_' + tr + '">Negativo</label></div>' +
                  '</td>';
              html += "</tr>";
            }
            html += "</tbody>";
          html += "</table>";
        html += "</div>";
      html += "</div>";

      $("#modal").addClass("bd-example-modal-lg");
      $("#modal").find(".modal-dialog").addClass("modal-lg");
      userDATOS.modalNOTICIA(html,btn,{tipo:"actor",nombre:"Actores"});
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
      flag = false;
      for(var i in data) {
        if(data[i] != "") flag = true;
      }
      if(flag) {
        tabla_noticia.destroy();
        $("#t_data").addClass("animate-flicker")
        setTimeout(function() {
          userDATOS.dataTableNOTICIAS("#t_data",data)
        },500)
      } else userDATOS.notificacion("Faltan datos de búsqueda","error");
      //tabla_noticia.draw();
    });
    $("#btn_limpiar").on("click",function() {
      let minDateFilter = $('#fecha_min').val();
      let maxDateFilter = $('#fecha_max').val();
      let medioFilter = $('#select_medioNOTICIA').val();
      let medioTipoFilter = $('#select_medioTipoNOTICIA').val();
      let tituloFilter = $('#titulo').val();
      let seccionFilter = $('#select_seccion').val();
      data = {"minDateFilter":minDateFilter,"maxDateFilter":maxDateFilter,"medioFilter":medioFilter,"medioTipoFilter":medioTipoFilter,"tituloFilter":tituloFilter,"seccionFilter":JSON.stringify(seccionFilter)}
      flag = false;
      for(var i in data) {
        if(data[i] != "") flag = true;
      }
      if(flag) {
        $("#fecha_min").val("");
        $("#fecha_max").val("");
        $("#titulo").val("");
        if($("#select_medioTipoNOTICIA").val() != "")
          $("#select_medioTipoNOTICIA").val("").trigger("change");
        if($("#select_medioNOTICIA").val() != "")
          $("#select_medioNOTICIA").val("").trigger("change");

        if($("#select_seccion").length != 0)
          $("#select_seccion").empty().trigger("change")

        $("#select_medioNOTICIA,#select_medioTipoNOTICIA,#select_seccion").select2();
        tabla_noticia.destroy();
        $("#t_data").addClass("animate-flicker")
        setTimeout(function() {
          userDATOS.dataTableNOTICIAS("#t_data");
        },500);
      }
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
        userDATOS.notificacion("Sin conectividad.<br/>Verifique conexión","warning",false);
      } else if (jqXHR.status == 404) {
        userDATOS.notificacion("Error 404<br/>Página no encontrada","warning",false);
      } else if (jqXHR.status == 500) {
        userDATOS.notificacion("Error 500<br/>Error interno del servidor","warning",false);
      } else if (textStatus === 'parsererror') {
        userDATOS.notificacion("Error de parseo","warning",false);
      } else if (textStatus === 'timeout') {
        userDATOS.notificacion("Error","warning",false);
      } else if (textStatus === 'abort') {
        userDATOS.notificacion("Operación abortada","error",false);
      } else {
        userDATOS.notificacion("Error","error",false);
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
  }).on('dblclick', '#t_data tbody tr', function () {
      $("div").removeClass("d-none");
      tabla_noticia.row( this ).select();

      relevado = $("#t_data").data("tipo")
      console.log("ACCESO A DISTRIBUIDOR");
      userDATOS.distribuidorNOTICIA(relevado);
      //},0)
  }).on('dblclick', '#t_data2 tbody tr', function () {
      $("div").removeClass("d-none");
      tabla_noticia.row( this ).select();
      //setTimeout(function(){
        userDATOS.distribuidorNOTICIA();
  }).on('dblclick', '#t_data3 tbody tr', function () {
      $("div").removeClass("d-none");
      tabla_noticia.row( this ).select();
        userDATOS.distribuidorNOTICIA("1");
  }).on("mouseover","*[data-toggle=\"tooltip\"]",function() {
    $(this).append("<div class=\"position-absolute shadow text-dark w-100 p-2 bg-light border\" style=\"left:0; top:" + $(this).outerHeight() + "px;\"></div>");
    $(this).find("div").html("<h2 class=\"text-center text-uppercase font-weight-light\">valoración</h2>" + $(this).data("title"));
  }).on("mouseout","*[data-toggle=\"tooltip\"]",function() {
    $(this).find("div").remove();
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
    let m = window.variables.medio.busqueda("id",$(this).val());
    let d = window.variables.medio_destaque.busqueda("id_medio",$(this).val(),0);
    let secciones = userDATOS.busqueda($(this).val(),"seccion",false,"id_medio",0)
    let s = $("#select_destaque");
    let ss = $("#select_seccion");
    s.html("");
    if(d.length == 0)
      s.append("<option value=''>SIN ESPECIFICAR</option>");
    else {
      s.append("<option value=''></option>");
      for(var i in d)
        s.append("<option value='" + d[i].id + "'>" + d[i].lugar + " - " + d[i].destaque + " (" + d[i].referencia + ")</option>");
    }
    s.select2();

    if(m !== undefined) {
      if(m.id_medio_tipo != "0") {
        $("#select_medioAlcance").val(m.id_medio_tipo).trigger("change");
        $("#select_medioAlcance").attr("disabled",true);
        $("#select_medioAlcance").select2();
      }
    } else {
      $("#select_medioAlcance").removeAttr("disabled");
      $("#select_medioAlcance").select2();
    }
    /////////// SECCIONES
    ss.html("<option value=''></option>");
    ss.append("<option value='1'>SIN SECCIÓN</option>");
    for(var i in secciones) ss.append("<option value='" + i + "'>" + secciones[i]["nombre"] + "</option>")
    if(window.noticiaSELECCIONADA !== undefined)
      ss.val(window.noticiaSELECCIONADA.id_seccion).trigger("change");
  }).on('change','section thead input[type="checkbox"]', function(){
    if(window.noticiasCHECKED === null) window.noticiasCHECKED = {}
    if($(this).is(":checked")) {
      $('section tbody input[type="checkbox"]:checked').each(function(){
        if(window.noticiasCHECKED[$(this).val()] === undefined)
          window.noticiasCHECKED[$(this).val()] = "";
      })
      // userDATOS.notificacion("<strong>ATENCIÓN</strong> se marcarán solo las noticias en la vista")
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
  }).on('change','#t_data tbody input[type="checkbox"]', function(){
    if(window.noticiasCHECKED === null) window.noticiasCHECKED = {}
    if($(this).is(":checked")) {
      if(window.noticiasCHECKED[$(this).val()] === undefined)
        window.noticiasCHECKED[$(this).val()] = "";
    } else {
      if(window.noticiasCHECKED[$(this).val()] !== undefined)
        delete window.noticiasCHECKED[$(this).val()];
    }
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
    if($('#modal').find(".select__2").length) $('#modal').find(".select__2").select2()
  });
  $('#modal').on('hidden.bs.modal', function (e) {
    $("#modal").removeClass("bd-example-modal-lg");
    $("#modal").find(".modal-dialog").removeClass("modal-lg");
    $('#modal').find(".modal-body").html("");
    $('#modal').find(".modal-footer").html("");
    $("#modal").find(".close").removeClass("d-none");

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

  function clienteEVENT(e) {
    // Usar Function para traer notificaciones
    // e.data = id_notificacion insertada
    intNotificacion = parseInt($('*[data-notificacion="numero"]').text());
    intNotificacion ++;
    $.get("/lib/servidorCAMBIO.php?tipo=noticia&id_noticia=" + e.lastEventId,function(m){});
    // if(window["notificacionACTIVA"] === undefined) {
    //   window["notificacionACTIVA"] = 0;//
    //   userDATOS.verificarNotificacion(0,"#tabla_notificacion");
    // } else {
    //   window["notificacionACTIVA"] ++;
    //   if(window["notificacionACTIVA"] == 20)
    //     userDATOS.verificarNotificacion(0,"#tabla_notificacion");
    //   else
    //     userDATOS.verificarNotificacion(1,"#tabla_notificacion");
    // }
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
      html += "</div>";
    html += "</div>";
    $.get("/lib/servidorCAMBIO.php?tipo=noticiaRELEVADA&id_noticia=" + e.lastEventId,function(m){});
    if(window["noticiaRELEVADA"] === undefined) {
      window["noticiaRELEVADA"] = 1;
      $("#tabla_notificacion").html(html);
    } else {
      window["noticiaRELEVADA"] ++
      $("#tabla_notificacion").append(html);
    }
    angular.element("*[ng-controller=\"jsonController\"]").scope().noticiasNUMEROS(angular.element("#menu_noticias").scope());
    $('*[data-notificacion="numero"]').text(parseInt(n) + parseInt(window["noticiaRELEVADA"]));
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
