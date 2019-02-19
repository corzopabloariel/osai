/** <VARIABLES> */
Lobibox.notify.OPTIONS.error.sound = "error";
Lobibox.notify.OPTIONS.info.sound = "info";
Lobibox.notify.OPTIONS.default.sound = "default";
Lobibox.notify.OPTIONS.success.sound = "success";
Lobibox.notify.OPTIONS.warning.sound = "warning";
/** </VARIABLES> */
const url_cliente = `http://${servidor}/cliente/lib/cliente.php`;
let userDATOS = {};

// <BASICO> //
/**
 * Función que usa la api Lobibox
 *@param mensaje STRING: texto que aparece en la notificación
 *@param tipo STRING: permite cambiar el color a la notificación
 *@param dlay BOOL: flag para mostrar el indicador de demora
 */
userDATOS.notificacion = function (mensaje,tipo = 'info',delayIndicator = true, size = 'mini', delay = 2500){
  // Available types 'default', 'warning', 'info', 'success', 'error'
  // Available size 'normal', 'mini', 'large'
  if(mensaje == "") return false;
  let types = {'default': "", 'warning': "Precaución", 'info': "Información", 'success': "Completo", 'error': "Error"};
  if(types[tipo] === undefined) {
    console.log("Tipo erroneo");
    return false;
  }
  let data = {
    'size': size,
    'icon': true,
    'iconSource': 'fontAwesome',
    'delayIndicator': delayIndicator,
    'delay': delay,
    'title': types[tipo],
    'showClass': 'fadeInDown',
    'hideClass': 'fadeUpDown',
    'msg': mensaje,
    'soundPath': '../assets/sounds/',
    'soundExt': '.ogg',
    'onClickUrl': null,
    'sound': true
  };
  Lobibox.notify(tipo,data);
};
/**
 * Función que usa la api Messagebox
 * @param msg STRING: texto que aparece en el cuadro
 * @param done FUNCTION: función que ejecuta si respuesta es afirmativa
 * @param fail FUNCTION: función que ejecuta si respuesta es negativa
 */
userDATOS.messagebox = function(msg, done, fail = null) {
  $.MessageBox({
		buttonDone  : "Si",
		buttonFail  : "No",
		message   : msg
  }).done(done)
    .fail((fail === null ? function() {} : fail));
}
/**
 * Función AJAX
 * @param action STRING: acción que va a realizar
 * @param data OBJ: datos necesarios de la búsqueda, varia de fución en función
 * @param asy BOOL: true o false
 * 
 */
userDATOS.ajax = function(action,data,asy,callBackOK) {
  $.ajax({
     type: 'POST',
     url: url_query_local_2,
     dataType: 'json',
     async: asy,
     data: { "accion": action, "data": data }
  }).done(function(msg) {
    if(data !== null) {
      if(data.paginado !== undefined) {
        if(Object.keys(msg.data).length == 0)
          window[data.paginado_name] --;
      }
    }
    callBackOK.call(this,msg);
  });
}
/** */
userDATOS.encodeBase64 = function( src ) {
    let _r = null;
    userDATOS.ajax("base64", {src : src }, false, function(data) {
        _r = data.data;
    });
    return _r;
}
const imgLoading = userDATOS.encodeBase64("../assets/images/loading.gif", "gif");
/**
 * Función para la navegación en la aplicación
 */
userDATOS.nav = function(href) {
  let a = $("#menu").find("a[data-href='" + href + "']");
  let contenedor = a.closest("div");
  
  let anterior = contenedor.find("a:not([href])")
  anterior.attr("href",anterior.data("href"));
  anterior.removeClass("active").addClass("effect-underline");

  a.removeClass("effect-underline").addClass("active");
  a.removeAttr("href");

  userDATOS.menu(0);
}
/**
 * Función para la búsqueda directo en la BD
 * @param value: valor a buscar
 * @param tabla STRING: tabla donde buscar
 * @param asy BOOL: Sincrónico / Asincrónico
 * @param colum STRING: columna específica - default ID
 * @param retorno INT: cantidad a retornar - != 1 :: TODO
 */
userDATOS.busqueda = function(values, callBackOK, asy = false) {
  let data = {
    "value": values.value,
    "entidad": values.entidad,
    "column": (values.column !== undefined ? values.column : "id"),
    "retorno": (values.retorno !== undefined ? values.retorno : 1)
  };
  userDATOS.ajax("search",data,asy,callBackOK);
}
/**
 *
 */
userDATOS.busqueda_paginado = function(values, callBackOK, asy = false) {
  let name = (values.name !== undefined ? values.name : "i");
  if(window["name_" + name] === undefined) window["name_" + name] = 0;
  else window["name_" + name] ++;
  let data = {
    "entidad": values.entidad,
    "values": values.values,
    "paginado": window["name_" + name],
    "paginado_name": "name_" + name
  }
  userDATOS.ajax("search_paginado",data,asy,callBackOK);
}
/**
 * Función para búsqueda de UNIDADES DE ANÁLISIS
 */
userDATOS.unidades = function(callBackOK, asy = false) {
  userDATOS.ajax("unidades",null,asy,callBackOK);
}
/**
 * Función para traer todos los medios involucrados
 */
userDATOS.busqueda_medios = function(values, callBackOK, asy = false) {
  let data = { 
    "tipo":"A"
  };
  if(values !== null) {
    data = userDATOS.extend(data,values);
  }
  userDATOS.ajax("medios",data,asy,callBackOK);
}
/**
 * Función para concatenar 2 objetos
 */
userDATOS.extend = function(objetoBase, objetoAnadir) {
  for (var key in objetoAnadir) {
    if (objetoAnadir.hasOwnProperty(key)) objetoBase[key] = objetoAnadir[key];
  }
  return objetoBase;
}
/**
 * 
 */
userDATOS.busqueda_agenda = function(values,callBackOK, asy = false) {
  let name = "agenda";
  if(window["name_" + name] === undefined) window["name_" + name] = 0;
  else window["name_" + name] ++;
  let data = {
    "paginado": window["name_" + name],
    "paginado_name": "name_" + name
  };
  if(values !== null)
    data = userDATOS.extend(data,values);
  userDATOS.ajax("agenda",data,asy,callBackOK);
}
/** */
userDATOS.totalRegistros = function(data, callBackOK, asy = false) {
  userDATOS.ajax("totalRegistros",data,asy,callBackOK);
}
/**  */
userDATOS.view = function(t,tipo,target) {
  let elemento = $(t);
  let cuerpo = $(target);
  
  if(cuerpo.find(".loading").length || cuerpo.find(".sinCuerpo").length) return false;
  elemento.removeClass("text-muted cursor-pointer").addClass("text-primary");
  elemento.closest("div").find("i[data-tipo='" + tipo + "']").removeClass("text-primary").addClass("text-muted cursor-pointer");
  if(tipo) cuerpo.addClass("card-columns");
  else cuerpo.removeClass("card-columns");
}
/** */
userDATOS.change = function(data, callBackOK, asy = false) {
  userDATOS.ajax("change",data,asy,callBackOK);
}
/** */
userDATOS.select2 = function(target,data = null,disabled = 1,empty = 0) {
  let select = {};
  if(empty)
    $(target).empty();
  if(data !== null)
    select["data"] = data;
  select["width"] = '100%';
  select["tags"] = true;
  select["theme"] = "bootstrap4";
  select["language"] = "es";
  // select["dir"] = "rtl";
  select["containerCssClass"] = ':all:';
  select["language"] = {
    noResults: function() {
      return "No hay resultados";        
    },
    searching: function() {
      return "Buscando...";
    }
  };
  select["createTag"] = function(params) {
    return undefined;
  };
  if(disabled)
    $(target).removeAttr("disabled");
  else
    $(target).attr("disabled",true);
  $(target).select2(select);
}
/**
 * Función para el parseo de string a JSON
 */
userDATOS.parseJSON = function(cadena) {
  return eval("(" + cadena + ")");
}
/**
 * 
 */
userDATOS.scroll = function(t) {}
/** */
userDATOS.modal = function(t, html = null, title = null, open = 1) {
  let elemento = $(t);
  let bodyModal = elemento.find("section");
  let headerModal = elemento.find("header");

  if(open) {
    if(title !== null)
      headerModal.find("h2").text(title);
    if(html !== null)
      bodyModal.find("> div").html(html)
    if(elemento.find('[data-toggle="tooltip"]').length)
      elemento.find('[data-toggle="tooltip"]').tooltip();
    elemento.show();
    $("body").css({overflow:"hidden",paddingRight:"15px"});
    $("#modalBackground").show();
  } else {
    bodyModal.find("> div").html("");
    headerModal.find("h2").text("");
    elemento.hide();
    $("body").removeAttr("style");
    $("#modalBackground").hide();
  }
}
/** */
userDATOS.noticiaProcesoClose = function() {
  let m = $("#noticiaProceso");
  m.find("> div").html("");
  m.hide();
  $("body").removeAttr("style");
  $("#section_body").find('[data-toggle="tooltip"]').tooltip();
}
/** */
userDATOS.alerta = function(t) {
  angular.element("*[ng-controller=\"jsonController\"]").scope().direccion("/notificaciones")
}
/**
 * Función para traer proceso de una noticia
 * @param id INT -> id de UNIDAD DE ANÁLISIS o AGENDA NACIONAL
 */
userDATOS.verProceso = function(t,id,idNoticia) {
  let elemento = $(t);
  let contenedor = $("*[data-proceso]");
  let data = {
    "idUnidad": id,
    "idNoticia": idNoticia
  };
  elemento.remove();
  contenedor.html(`<div class="d-flex justify-content-center py-2 text-uppercase text-center">cargando<img class="d-inline-block ml-2" src="http://${servidor}/assets/images/loading_notificacion.gif" style="height: 30px;"></div>`);

  userDATOS.ajax("verProceso",data,true,function(valores) {
    let html = "";
    noticiasCliente = valores.data.noticiasCliente;
    noticiasInstituciones = valores.data.noticiasInstituciones;//VARIOS
    noticiasActor = valores.data.noticiasActor;//VARIOS
    noticiasProceso = valores.data.noticiasProceso;
    // CLIENTE //
      /* TEMAS */
    html += '<div class="row py-3 bg-primary">';
      html += '<div class="col-12">';
        html += '<div class="row">';
          html += '<div class="col-12 col-lg-6">';
            if(Object.keys(noticiasCliente.temas).length == 0) {
              html += '<h3 class="mb-0 text-uppercase text-white">Sin temas relacionados</h3>';
            } else {
              html += '<h3 class="text-uppercase text-white">' + ((Object.keys(noticiasCliente.temas).length == 1) ? "Tema" : "temas") + '</h3>';
              html += '<ul class="list-group">';
              for(var x in noticiasCliente.temas) {
                span = "";
                valor = noticiasCliente.temas[x]["valoracion"];
                if(noticiasCliente.temas[x]["valoracion"]["valor"] != undefined) valor = noticiasCliente.temas[x]["valoracion"]["valor"];
                switch(parseInt(valor)) {
                  case 1:
                    span += "<span class='badge badge-success'>POSITIVO</span>";
                  break;
                  case 0:
                    span += "<span class='badge badge-warning'>NEUTRO</span>";
                  break;
                  case -1:
                    span += "<span class='badge badge-danger'>NEGATIVO</span>";
                  break;
                }
                html += '<li class="list-group-item d-flex justify-content-between align-items-center"><span class="text-truncate">' + noticiasCliente.temas[x]["nombre"] + '</span>' + span + '</li>';
              }
              html += '</ul>';
            }
          html += '</div>';
          html += '<div class="w-100 d-block d-sm-none pb-3 mb-3  border-bottom border-white"></div>';
          html += '<div class="col-12 col-lg-6 d-flex justify-content-center align-items-center">';
            valoracion = 0;
            for(var x in noticiasCliente.valoracion)
              valoracion += parseFloat(noticiasCliente.valoracion[x]["valoracion"]);
            if(valoracion > 0)
              span = "<span class='badge badge-success'>POSITIVO</span>";
            else if(valoracion == 0)
              span = "<span class='badge badge-warning'>NEUTRO</span>";
            else
              span = "<span class='badge badge-danger'>NEGATIVO</span>";
            html += '<h3 class="text-uppercase text-white text-center mb-0">valoración<br/>' + span + '</h3>';
            html += '</ul>';
          html += '</div>';
        html += '</div>';
      html += '</div>';
    html += '</div>';
    html += '<div class="row" style="background-color:#ccc">';
      if(Object.keys(noticiasInstituciones).length != 0) {
        html += '<div class="col-12 col-lg-6 py-3 bg-success">';
          html += '<h3 class="text-uppercase text-white">' + ((Object.keys(noticiasInstituciones).length == 1) ? "institución involucrada" : "instituciones involucradas") + '</h3>';
          html += '<ul class="list-group">';
          for(var x in noticiasInstituciones) {
            span = "";
            emisor = "";
            switch(parseInt(noticiasInstituciones[x]["data"]["valor"])) {
              case 1:
                span += "<span class='badge badge-success'>POSITIVO</span>";
              break;
              case 0:
                span += "<span class='badge badge-warning'>NEUTRO</span>";
              break;
              case -1:
                span += "<span class='badge badge-danger'>NEGATIVO</span>";
              break;
            }
            if(parseInt(noticiasInstituciones[x]["data"]["emisor"])) emisor = "<span class='mr-1 text-uppercase'>[emisor]</span>"
            html += '<li class="list-group-item d-flex justify-content-between align-items-center"><span class="text-truncate">' + emisor + noticiasInstituciones[x]["nombre"] + '</span>' + span + '</li>';
          }
          html += '</ul>';
        html += '</div>';
      }
      if(Object.keys(noticiasActor).length != 0) {
        html += '<div class="col-12 col-lg-6 py-3 bg-warning">';
          html += '<h3 class="text-uppercase">' + ((Object.keys(noticiasActor).length == 1) ? "actor involucrado" : "actores involucrados") + '</h3>';
          html += '<ul class="list-group">';
          for(var x in noticiasActor) {
            span = "";
            emisor = "";
            imagen = "";
            switch(parseInt(noticiasActor[x]["data"]["valor"])) {
              case 1:
                span += "<span class='badge badge-success'>POSITIVO</span>";
              break;
              case 0:
                span += "<span class='badge badge-warning'>NEUTRO</span>";
              break;
              case -1:
                span += "<span class='badge badge-danger'>NEGATIVO</span>";
              break;
            }
            if(parseInt(noticiasActor[x]["data"]["emisor"])) emisor = "<span class='mr-1 text-uppercase'>[emisor]</span>"
            if(parseInt(noticiasActor[x]["data"]["imagen"])) imagen = "<span class='mr-1 text-uppercase'>[imagen]</span>"
            html += '<li class="list-group-item d-flex justify-content-between align-items-center"><span class="text-truncate">' + emisor + imagen + noticiasActor[x]["nombre"] + '</span>' + span + '</li>';
          }
          html += '</ul>';
        html += '</div>';
      }
    html += '</div>';
    contenedor.addClass("mb-4");
    contenedor.html(html);
  });
}
/**
 * Función para validar el formulario con elemento required y visible
 * @param t STRING: elemento donde se busca la info
 */
userDATOS.validar = function(t) {
  let flag = 1;
  $(t).addClass("was-validated");
  $(t).find('*[required="true"]').each(function(){
    if($(this).is(":visible")) {
      if($(this).is(":invalid") || $(this).val() == "") {
        flag = 0;
        // $(this).addClass("has-error");
      }
    }
  });
  return flag;
};
/** */
userDATOS.submit = function(t) {
  let data = null;
  if(userDATOS.validar(t)) {
    data = {};
    aux = $(t).serializeArray();
    $(t).find("*").attr("disabled",true);
    for(var i in aux) data[aux[i]["name"]] = aux[i]["value"];
    _r = userDATOS.renderSubmit(data);
    if(!_r) {
      $(t).removeClass("was-validated");
      $(t).find("*").removeAttr("disabled");
    } else $("#menu section p:first-child() a").click();
  } else userDATOS.notificacion("Faltan datos","error");
}
/**
 * Función para verificar si la session se encunetra activa
 *@param f BOOLEANO: flag
 */
userDATOS.verificar = function(f) {
  console.log("AVISO: Verificando sesión");
  let v = true;
  let x = new Pyrus();
  let OBJ_dato = {};
  x.query("obtener_sesion",null,
    function(e){
      if(f) {
        if(e["session"] === undefined) v = false;
        else if(e["session"]["user_osai_name"] === undefined) v = false//window.location = "index.html";
      } else {
        if(e["session"] === undefined) v = true;
        else if(e["session"]["user_osai_name"] !== undefined) v = false;
      }
    },
  null,
  false);
  return v;
}
/**
 * Función para obtener session
 */
userDATOS.session = function() {
  let x = new Pyrus();
  let OBJ_dato = {};
  x.query("obtener_sesion",null,
    function(e){
      if(e["session"]["user_osai_name"] === undefined) window.location = "index.html";
      OBJ_dato["id"] = e["session"]["user_osai_id"];
      OBJ_dato["user"] = e["session"]["user_osai_name"];
      OBJ_dato["nivel"] = e["session"]["user_osai_lvl"];
    },
  null,
  false);
  userDATOS.busqueda({"entidad":"osai_usuario","value":OBJ_dato["id"]}, function(data) {
    OBJ_dato["id_cliente"] = data.data.id_cliente;
  });
  return OBJ_dato;
}
/**
 * Función para salir del sistema
 */
userDATOS.logout = function() {
  // window.evtSource.close();
  x = new Pyrus();
  // document.getElementById("div").classList.remove("d-none");
  x.query("NS_logout",null,
   function(){ window.location = "index.html"; },
   null);
}
// </BASICO> //

userDATOS.menu = function(tipo) {
  if(tipo) {
    $("body").css({overflow:"hidden",paddingRight:"15px"});
    $("#menuBackground,#menu").show();
    setTimeout(() => {
      $("#menu section p a").addClass('animated shake').one(animationEnd, function() {
        $(this).removeClass("animated shake");
      });
    }, 100);
  } else {
    $("body").removeAttr("style");
    $("#menuBackground,#menu").hide();
  }
}

/**
 * @return -1 if a < b
 * @return 0 if a = b
 * @return 1 if a > b
 */
let dates = {
  string: function(d = new Date(), flagSecond = 1, formato = "ddmmaaaa") {
    day = (d.getDate() < 10 ? "0" + d.getDate() : d.getDate());
    month = d.getMonth() + 1;//los meses [0 - 11]
    month = (month < 10 ? "0" + month : month);
    year = d.getFullYear();
    hour = (d.getHours() < 10 ? "0" + d.getHours() : d.getHours());
    minute = (d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes());
    if(flagSecond) {
      second = (d.getSeconds() < 10 ? "0" + d.getSeconds() : d.getSeconds());
      if(formato == "ddmmaaaa")
        return day + "/" + month + "/" + year + " " + hour + ":" + minute + ":" + second;
      if(formato == "aaaammdd")
        return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
    }
    if(formato == "ddmmaaaa")
      return day + "/" + month + "/" + year + " " + hour + ":" + minute;
    if(formato == "aaaammdd")
      return year + "-" + month + "-" + day + " " + hour + ":" + minute;
  },
  convert:function(d) {
      return (
          d.constructor === Date ? d :
          d.constructor === Array ? new Date(d[0],d[1],d[2]) :
          d.constructor === Number ? new Date(d) :
          d.constructor === String ? new Date(d) :
          typeof d === "object" ? new Date(d.year,d.month,d.date) :
          NaN
      );
  },
  compare:function(a,b) {
      return ((a.getTime() === b.getTime()) ? 0 : ((a.getTime() > b.getTime()) ? 1 : - 1));
  }
}

let animationEnd = (function(el) {
  let animations = {
    animation: 'animationend',
    OAnimation: 'oAnimationEnd',
    MozAnimation: 'mozAnimationEnd',
    WebkitAnimation: 'webkitAnimationEnd',
  };

  for (var t in animations) {
    if (el.style[t] !== undefined) {
      return animations[t];
    }
  }
})(document.createElement('div'));