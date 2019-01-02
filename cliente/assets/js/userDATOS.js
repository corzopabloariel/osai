/** <VARIABLES> */
Lobibox.notify.OPTIONS.error.sound = "error";
Lobibox.notify.OPTIONS.info.sound = "info";
Lobibox.notify.OPTIONS.default.sound = "default";
Lobibox.notify.OPTIONS.success.sound = "success";
Lobibox.notify.OPTIONS.warning.sound = "warning";
/** </VARIABLES> */
const url_cliente = "http://93.188.164.27/cliente/lib/cliente.php";
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
    if(data.paginado !== undefined) {
      if(Object.keys(msg.data).length == 0)
        window[data.paginado_name] --;
    }
    callBackOK.call(this,msg);
  });
}
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
userDATOS.select2 = function(target,data = null,disabled = 1,empty = 0) {
  let select = {};
  if(empty)
    $(target).empty();
  if(data !== null)
    select["data"] = data;
  select["width"] = 'resolve';
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
  //console.log(cadena)
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
/**
 * Función para validar el formulario con elemento required y visible
 * @param t STRING: elemento donde se busca la info
 */
userDATOS.validar = function(t) {
  let flag = 1;
  $(t).find('*[required="true"]').each(function(){
    if($(this).is(":visible")) {
      if($(this).is(":invalid") || $(this).val() == "") {
        flag = 0;
        $(this).addClass("has-error");
      }
    }
  });
  return flag;
};
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
  if(tipo) $("#menuBackground,#menu").show();
  else $("#menuBackground,#menu").hide();
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