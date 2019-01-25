/**
 * Última revisión: 28.12.2018
 */
const translate_spanish = {
  buttons: {
    pageLength: {
        _: "%d filas",
        '-1': "Todo"
      }
    },
    "sLengthMenu":     "_MENU_",
    "lengthMenu":     "_MENU_",

    "sZeroRecords":    "No se encontraron resultados",
    "sEmptyTable":     "Ningún dato disponible en esta tabla",
    "sInfo":           "_START_ de _END_ - _TOTAL_ registros",
    "info":            "_START_ de _END_ - _TOTAL_ registros",
    "sInfoEmpty":      "Sin registros",
    "infoEmpty":       "Sin registros disponibles","infoFiltered":   "(filtrado de _MAX_ registros)",
    "sInfoFiltered":   "(total de _MAX_ registros)",
    "sInfoPostFix":    "",
    "sSearch":         "Buscador: ",
    "sUrl":            "",
    "sInfoThousands":  ",",
    "sLoadingRecords": "Cargando...",
    "oPaginate": {
        "sFirst":    "<<",
        "sLast":     ">>",
        "sNext":     ">",
        "sPrevious": "<"
    },
    "oAria": {
        "sSortAscending":  ": Activar para ordenar la columna de manera ascendente",
        "sSortDescending": ": Activar para ordenar la columna de manera descendente"
    },

    "loadingRecords":   "Cargando...",
    "processing":     "Procesando...",
    "search": "",
    "zeroRecords":    "No se encontraron registros",
    "paginate": {
      "next":     "Siguiente",
      "previous":   "Anterior"
    },
    "select": {
    //"rows": { _: "%d filas seleccionadas", 0: "", 1: "1 fila seleccionada" }
    "rows": { _: "%d filas seleccionadas", 0: "", 1: "" }
  },
};
const cliente_url = "http://93.188.164.27/lib/cliente.php";

let userDATOS = {};

/**
 * Función para concatenar 2 objetos
 */
userDATOS.extend = function(obj, src) {
   for (var key in src) {
      if (src.hasOwnProperty(key)) obj[key] = src[key];
   }
   return obj;
}
/**
 * Función para la info necesaria para los gráficos del sistema
 * @param tipo STRING - tipo de grafico
 * @param data OBJECT - Fechas a buscar
 * @return 
 */
userDATOS.dataBD = function(tipo,data,loader = null) {
  let element = null;
  $.ajax({
    type: 'POST',
    url: cliente_url,
    dataType: 'json',
    async: false,
    data: { "tipo": "query", "accion": "dataDB", "tipoBD": tipo, "data" : data },
    beforeSend: function() {
      if(loader !== null) $(loader).removeClass("d-none");
    },
    success: function(msg) {
      if(loader !== null) $(loader).addClass("d-none");
    }
  }).done(function(msg) {
    element = msg;
  });

  return element;
}
/**
 * Filtrar y mostrar parámetros de búsqueda de las notificaciones
 * Solo aplicable en notificaciones viejas (ANTERIORES)
 * TODAS // VISTO // SIN LEER // RELEVADO // ELIMINADO
 * @param flag INT: 1 muestra modal con opciones / 0: busca los parámetros
 * @param target STRING: lugar donde 
 */
userDATOS.filterNotificacion = function(flag, form = null, target = null) {
  let modal = $("#modalNotificacion");
  $('#dropdown-notificacion').dropdown('toggle');
  if(flag) {
    if(window.filterNotificacion !== undefined) {
      if(window.filterNotificacion.length == 4)
        $("#modalNotificacion").find("input[type='checkbox']").attr("checked",true);
      else {
        $("#modalNotificacion").find("thead input[type='checkbox']").removeAttr("checked");
        $("#modalNotificacion").find("tbody input[type='checkbox']").removeAttr("checked");
        window.filterNotificacion.forEach(function(i) {
          $("#modalNotificacion").find("tbody input[type='checkbox'][name='input-" + i + "']").attr("checked",true);
        });
      }
    }
    modal.modal("show");
  } else {
    let data = $(form).serializeArray();
    if(window["notificacionPAGINADO_" + target] !== undefined)
      window["notificacionPAGINADO_" + target] = undefined
    if(data.length == 4) window.filterNotificacion = undefined;
    else {
      window.filterNotificacion = [];
      for(var i in data) {
        x = data[i]["name"].split("-");
        window.filterNotificacion.push(x[1]);
      }
      $(target).html('');
      userDATOS.verificarNotificacion(target,1, true);
    }
    modal.modal("hide");
  }
}
/**
 * Función que muestra las notificaciones nuevas en tiempo real
 * @param id INT: id de la notificación a traer
 * @param target STRING: lugar dónde pone el html
 */
userDATOS.traerNotificacion = function(id, target) {
  $.ajax({
      type: 'POST',
      url: cliente_url,
      dataType: 'json',
      async: true,
      data: { "tipo": "query", "accion": "traerNotificacion", "id": id },
  }).done(function(msg) {
    if($(target).find(".loading_notificacion").length)
      $(target).find(".loading_notificacion").remove();
    $(target).append(msg.html);
  });
}
/**
 * Función que verifica si hay notificaciones en el sistema y traerlas
 * Trae de a 5
 * @param target STRING: lugar dónde irán las notificaciones
 */
userDATOS.verificarNotificacion = function(target = "#tabla_notificacion_viejas",loading = 0, new_ = true) {
  if(window["notificacionPAGINADO_" + target] === undefined)
    window["notificacionPAGINADO_" + target] = 0;
  if(!new_) window["notificacionPAGINADO_" + target] ++;
  let filterNotificacion = null;
  if(window.filterNotificacion !== undefined) filterNotificacion = window.filterNotificacion;
  $.ajax({
      type: 'POST',
      url: cliente_url,
      dataType: 'json',
      async: true,
      data: { "tipo": "query", "accion": "notificacionHTML", "target": target, "paginado" : window["notificacionPAGINADO_" + target], "filter": filterNotificacion },
      beforeSend: function() {
      if(loading)
        $(target).append('<div class="row py-2 bg-white loading_notificacion"><img src="assets/images/loading_notificacion.gif" style="width:50px; height:50px;" class="d-block mx-auto"></div>')
      },
      success: function(msg) {
        if(msg.total != 0 || window["noticiaRELEVADA"] !== undefined)
        $(target).find(".loading_notificacion").remove();
      }
  }).done(function(msg) {
    if(msg.html == "")
      $(target).html('<div class="col py-2 text-uppercase text-center bg-white">Sin novedades</div>');
    else $(target).append(msg.html);
    $('*[data-notificacion="numero"]').text(msg.total);
    if(window["scroll_notificacion_vieja"] !== undefined)
      window["scroll_notificacion_vieja"] = undefined;
  });
}
/**
 *
 */
userDATOS.verNotificacion = function(t) {
  id = $(t).data("id");//ID tabla -> notificacion
  idNotificacionUsuario = $(t).data("notificacionusuario");//ID tabla -> notificacion_usuario
  try {
    $("#modalNoticia").find(".btn").removeClass("d-none")

    let o = null;
    userDATOS.busquedaAlerta({"id":id}, function(d) {
      o = d;
    });//Retorna NOTICIA/
    let seccion = "SIN SECCIÓN";
    let medio = "";
    if(parseInt(o.id_seccion) > 1) {
      auxSeccion = null;
      userDATOS.busqueda({"value":o.id_seccion,"tabla":"seccion"}, function(d) {
        auxSeccion = d;
      });
      seccion = auxSeccion.nombre;
    }
    auxMedio = null;
    userDATOS.busqueda({"value":o.id_medio,"tabla":"medio"}, function(d) {
      auxMedio = d;
    });
    medio = (auxMedio.medio).toUpperCase();
    window.noticiaNUEVA = o;
    window.notificacionNUEVA = id;
    window.notificacionUsuario = idNotificacionUsuario;
    window.notificacionOBJ = null;
    userDATOS.busqueda({"value":id,"tabla":"notificacion"}, function(d) {
      window.notificacionOBJ = d;
    });
    if(parseInt(window.noticiaNUEVA.relevado) == 1) $("#modalNoticia").find(".btn").addClass("d-none")
    else {
      if(parseInt(window.notificacionOBJ.pasado) == 1) $("#modalNoticia").find(".btn-success,.btn-danger").addClass("d-none");
      else $("#modalNoticia").find(".btn-success,.btn-danger").removeClass("d-none");
    }
    if(parseInt(window.noticiaNUEVA.relevado) == 0) {
      $(t).addClass("bg-white");
      $(t).find("p:nth-child(3)").html("<strong class='mr-1'>Estado:</strong>VISTO");
      userDATOS.change(idNotificacionUsuario,"notificacion_usuario","visto",1);
    }
    html = o.cuerpo;
    
    var SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
    while (SCRIPT_REGEX.test(html))
        html = html.replace(SCRIPT_REGEX, "");
    $("#modalNoticia").find(".modal-notificacion").html("<p class='m-0'>" + window.notificacionOBJ.mensaje + "<span class='badge badge-warning mx-2'>alerta</span><span onclick='userDATOS.mostrarAtributos(this)' class='text-uppercase cursor-pointer'>[ver atributos]</span></p>");
    $("#modalNoticia").find(".modal-title").html(o.titulo + "<br/>[MEDIO: " + medio + "] [SECCIÓN: " + seccion + "] [<a href='" + window.noticiaNUEVA.url + "' target='blank' style='text-decoration:none'>LINK <i class='fas fa-external-link-alt'></i></a>]");
    $("#modalNoticia").find(".modal-body").html(html);
    $("#modalNoticia").modal("show");
  }
  catch (e) {
    userDATOS.notificacion(strings.error.parseoEliminado,"warning",false);
  }
}
/**
 *
 */
userDATOS.mostrarAtributos = function(e) {
  $(e).addClass("d-none");
  let atributos = null;
  userDATOS.busqueda({"value":window.notificacionOBJ.id_cliente,"tabla":"alarma","column":"id_cliente"}, function(d) {
    atributos = d;
  });
  let atributos_negativos = userDATOS.parseJSON(atributos.atributos_negativos);
  let cuerpo = $("#modalNoticia .modal-body");
  for(var i in atributos_negativos) {
    atributos_negativos[i] = userDATOS.parseJSON(atributos_negativos[i]);

    if(atributos_negativos[i].length == 0) {
      if(cuerpo.buscar(i))
        cuerpo.resaltar(i,"resaltarCLASS_nom");
    } else {
      for(var j in atributos_negativos[i]) {
        if(!cuerpo.buscar(atributos_negativos[i][j] + " " + i) || !cuerpo.buscar(i + " " + atributos_negativos[i][j]))
          cuerpo.resaltar(i,"resaltarCLASS_nom");
      }
    }
  }
}
/**
 *
 */
userDATOS.busquedaExtraccion = function() {
  let data = null;
  $.ajax({
    type: 'POST',
    url: cliente_url,
    dataType: 'json',
    async: false,
    data: { "tipo": "query", "accion": "extraccion" }
  }).done(function(msg) {
    data = msg;
  });
  return data;
}
/**
 * Cambio directo en la BD
 */
userDATOS.change = function(id, tabla, column, value, massive = 0, asy = false) {
  $.ajax({
    type: 'POST',
    url: cliente_url,
    async: asy,
    data: { "tipo": "query", "accion": "change", "tabla": tabla, "id": id, "value": value, "column": column, "massive": massive }
  });
}
/**
 * Buqueda de último acceso de un usuario
 */
userDATOS.ultimaHora = function(id) {
  $.ajax({
    type: 'POST',
    url: cliente_url,
    data: { "tipo": "acceso", "id": id }
  });
}
/**
 * Traer clientes finales, relacionado con unidades de análisis
 */
userDATOS.busquedaUsuariosFinales = function(callbackOK, asy = false) {
  let data = {
    "tipo": "query",
    "accion": "usuariosFinales"
  };
  $.ajax({
     type: 'POST',
     url: cliente_url,
     dataType: 'json',
     async: asy,
     data: data
  }).done(function(msg) {
    callbackOK.call(this,msg);
  });
}
/**
 * Busqueda directo en la BD
 * {tabla:X,value:X,column:?,retorno:1,elim:0}
 */
userDATOS.busqueda = function( values, callbackOK, asy = false ) {
  let data = {
    "tipo": "query",
    "accion": values.tabla,
    "value": values.value,
    "column": (values.column !== undefined ? values.column : "id"),//id
    "retorno": (values.retorno !== undefined ? values.retorno : 1),//1
    "elim": (values.elim !== undefined ? values.elim : 0)//0
  };
  $.ajax({
     type: 'POST',
     url: cliente_url,
     dataType: 'json',
     async: asy,
     data: data
  }).done(function(msg) {
    callbackOK.call(this,msg);
  });
}
/**
 * Función para insertar datos directo en la tabla
 * @param tabla STRING - identificador de tabla en la base
 * @param values OBJECT - OJO!!! cada key tiene que ser las columnas de la tabla que se desea agregar un dato
 */
userDATOS.insertDatos = function(tabla,values, callbackOK = null) {
  let data = {
    "tipo": "query",
    "accion": "insert",
    "tabla": tabla,
    "data": values
  };
  console.log(data)
  $.ajax({
    type: 'POST',
    url: cliente_url,
    dataType: 'json',
    async: false,
    data: data
  }).done(function(m) {
    if(callbackOK !== null) {
      callbackOK.call(this,m["id"]);
    }
  });
}
/**
 * Función para la busqueda de tablas
 * @param dates OBJ de fechas a buscar
 */
userDATOS.busquedaTabla = function(tabla, callbackOK, dates = null, asy = false) {
  let data = {
    "tipo": "query",
    "accion": "busqueda",
    "tabla": tabla
  };
  if(dates !== null) {
    if(dates.desde !== undefined) data["desde"] = dates.desde;
    if(dates.hasta !== undefined) data["hasta"] = dates.hasta;
  }
  $.ajax({
     type: 'POST',
     url: cliente_url,
     dataType: 'json',
     async: asy,
     data: data
  }).done(function(msg) {
    callbackOK.call(this,msg);
  });
}
/**
 * Función para la buqueda de una alerta
 * @param values OBJ contiene el id
 */
userDATOS.busquedaAlerta = function(values, callbackOK) {
  let data = {
    "tipo": "query",
    "retorno": (values.retorno !== undefined ? values.retorno : 1),
    "accion": "busquedaAlerta",
    "id": values.id
  }
  $.ajax({
     type: 'POST',
     url: cliente_url,
     dataType: 'json',
     async: false,
     data: data
  }).done(function(msg) {
    callbackOK.call(this,msg)
  });
}
/**
 * Función para traer datos de un periodista que esta relacionado con una noticia
 */
userDATOS.busquedaPeriodista = function(id, callbackOK) {
  let data = {
    "tipo": "query",
    "accion": "busquedaPeriodista",
    "id": id
  }
  $.ajax({
    type: 'POST',
    url: cliente_url,
    dataType: 'json',
    async: false,
    data: data
  }).done(function(msg) {
    callbackOK.call(this,msg);
  });
}
//
userDATOS.noticiasVALOR = function(callbackOK) {
  $.ajax({
     type: 'POST',
     url: cliente_url,
     dataType: 'json',
     async: false,
     data: { "tipo": "noticiasINFORME","id_usuario":userDATOS.user()["id"],"nivel":window.usuario.nivel }
  }).done(function(msg) {
    callbackOK.call(this,msg)
  });
}
userDATOS.noticiasSELECT = function(tipo = "", select = null, callbackOK) {
  let d;
  if(select !== null) {
    if(Array.isArray(select.seccion)) select.seccion = JSON.stringify(select.seccion)
  }
  $.ajax({
    context: this,
    type: 'POST',
    url: cliente_url,
    dataType: 'json',
    async: true,
    data: { "tipo": "noticiasINFORME","vista":tipo,"select":select }
  }).done(function(msg) {
    callbackOK.call(this, msg);
  });
}

userDATOS.log = function(id_usuario, accion, acceso = 1, id_tabla = 0, tabla = null, elim = 0) {
  $.ajax({
     type: 'POST',
     url: cliente_url,
     async: true,
     data: { "tipo": "log", "id_usuario": id_usuario, "accion": accion, "acceso": acceso, "id_tabla": id_tabla, "tabla": tabla, "elim": elim }
  });
}
/**
 * @return cantidad de noticias con estado 0 y moderado 0
 * OBSOLETO?
 */
// userDATOS.noticiasRELEVO = function() {
//   ARR_busqueda = $.map(window.variables.noticias.resultado, function(value, index) { return [value]; });
//   ARR_aux = ARR_busqueda.filter(function(x) {
//     return x.estado == 0 && x.moderado == 0
//   });
//   return ARR_aux.length;
// }
/**
 * Función para verificar si la session se encunetra activa
 *@param f BOOLEANO: flag
 */
userDATOS.verificar = function(f) {
  console.log("AVISO: Verificando sesión");
  let v = true;
  $.ajax({
     type: 'POST',
     url: cliente_url,
     dataType: 'json',
     async: false,
     data: { "tipo": "login" }
  }).done(function(msg) {
    if(f) {
      if(msg["user_id"] === undefined) v = false//window.location = "index.html";
    } else {
      if(msg["user_id"] !== undefined) v = false;
    }
  });
  return v;
}

userDATOS.notificacionLEIDA = function(id) {
  $.ajax({
     type: 'POST',
     url: cliente_url,
     async: true,
     data: { "tipo": "notificacion", "id": id, "id_usuario": window.user_id }
  });
}

/**
 *
 */
userDATOS.mostrarNoticia = function(t,id) {
  let modal = $("#modalNoticia");
  let notificacion = null;
  userDATOS.busqueda({"value":id,"tabla":"notificacion"}, function(d) {
    notificacion = d;
  });
  let o = null;
  userDATOS.busqueda({"value": notificacion.id_noticia,"tabla":"noticias"}, function(d) {
    o = d;
  });
  let data = userDATOS.parseJSON(o.data);
  let html = "";
  let user = userDATOS.user();
  window.noticiaNUEVA = o;

  userDATOS.log(window.user_id,"Notificación vista",0,id,"notificacion");
  userDATOS.notificacionLEIDA(notificacion.id)
  $(t).find("> span").removeClass("badge-success");
  $(t).find("> span").addClass("badge-secondary");
  $(t).find("> span").text("Leido")
  modal.find(".modal-title").html(o.titulo);
  modal.find(".modal-body").html(data.cuerpo);

  modal.modal("show");
}
/**
 * Función para traer alertas del sistema
 */
userDATOS.alertas = function() {
  $.ajax({
     type: 'POST',
     url: cliente_url,
     dataType: 'json',
     async: true,
     data: { "tipo": "query", "accion": "notificacionALL" },
     beforeSend: function( ) {
       console.log("NUEVA notificación");
     },
  }).done(function(msg) {
    if(Object.keys(msg).length > 0) {
      $("li[data-vista='notificacion']").find("span[data-notificacion]").text(Object.keys(msg).length);
      if(Object.keys(msg).length > 0) $("li[data-vista='notificacion']").find("span[data-notificacion]").removeClass("badge-secondary").addClass("badge-danger");
      $("li[data-vista='notificacion']").find("> div > div > div").html("");
      for(var i in msg)
        $("*[data-vista='notificacion']").find("> div > div > div").append('<a data-alerta="' + msg[i]["id"] + '" title="' + (msg[i]["mensaje"]).replace(/<[^>]*>?/g,'') + '" onclick="userDATOS.mostrarNoticia(this,' + msg[i]["id"] + ')" class="dropdown-item cursor-pointer text-truncate"><span class="badge badge-success">Nuevo</span> ' + msg[i]["mensaje"] + '</a>')
    }
  });
}
/**
 * Función que devuelve el USER logueado
 */
userDATOS.user = function() {
  let x = new Pyrus();
  let OBJ_dato = {};
  x.query("obtener_sesion",null,
    function(e){
      if(e["session"] === undefined) return false;
      if(e["session"]["user_name"] === undefined) window.location = "index.html";
      OBJ_dato["id"] = e["session"]["user_id"];
      OBJ_dato["user"] = e["session"]["user_name"];
      OBJ_dato["nivel"] = e["session"]["user_lvl"];
      OBJ_dato["last"] = e["session"]["user_last"];
    },
  null,
  false);
  return OBJ_dato;
}
/**
 * Función que busca una palabra o palabras en una noticia
 *@param e ELEMENTO
 */
userDATOS.noticiaATTR = function(e) {//agregar si no encuentra y si no puede remarcar
  let x = $(e).find("input").val();
  if(x == "") return false;
  if(!$(".note-editable").buscar(x)) {
    userDATOS.notificacion(strings.attr.no);
    return false;
  }
  $("#noticiaATTR").append("<span class=\"bg-light border rounded p-2 m-2\">" + x + " <i class=\"fas fa-times-circle text-danger btn-click\" onclick=\"userDATOS.eliminarATTR(this)\"></i></span>");
  $(e).find("input").val("");
  
  if(window.ARR_atributos === undefined) window.ARR_atributos = [];
  if(window.ARR_atributos[x] === undefined) {
    window.ARR_atributos[x] = "";
    $(".note-editable").resaltar(x,"resaltarCLASS");
  }
};
/**
 * Funciones varias
 */
jQuery.fn.extend({
  resaltar: function(busqueda, claseCSSbusqueda) {
    // let regex = new RegExp("(<[^>]*>)|("+ busqueda.replace(/([-.*+?^${}()|[\]\/\\])/g,"\\$1") +')', 'ig');
    // let nuevoHtml = this.html(this.html().replace(regex, function(a, b, c){
    //     return (a.charAt(0) == "<") ? a : "<span class=\""+ claseCSSbusqueda +"\">" + c + "</span>";
    // }));
    let html = this.html();
    let regex = new RegExp("\\b"+ busqueda.replace(/([-.*+?^${}()|[\]\/\\])/g,"\\$1") + "\\b", 'ig');
    this.html(html.replace(regex, function(a, b, c){
      return (a.charAt(0) == "<") ? a : "<span class=\"" + claseCSSbusqueda + "\">" + a + "</span>";
    }));
    // return nuevoHtml;
  },
  resaltarX: function(busqueda, valor) {
    let html = this.html();
    let regex = new RegExp(busqueda.replace(/([-.*+?^${}()|[\]\/\\])/g,"\\$1"), 'ig');
    this.html(html.replace(regex, function(a, b, c){
        return (a == busqueda) ? valor : a;
    }));
    // return nuevoHtml;
  },
  buscar: function(busqueda) {
    let regex = new RegExp(busqueda, 'ig');
    let flag = regex.test(this.html())
    return flag;
  }
});
/**
 * Función para eliminar los atributos seleccionados
 *@param e ELEMENTO
 */
userDATOS.eliminarATTR = function(e) {
  let attr = $(e).closest("span").text();
  attr = attr.trim();
  delete window.ARR_atributos[attr];
  $(e).closest("span").remove();
  let attr_HTML = "<span class=\"resaltarCLASS\">" + attr + "</span>";
  $(".note-editable").resaltarX(attr_HTML,attr)
}
/**
 * Función que devuelve los ATRIBUTOS
 */
userDATOS.attr = function() {
  let ARR = [];
  $("#noticiaATTR").find("span").each(function() {
    ARR.push($(this).text());
  });
  return ARR;
};
/**
 * Función para mostrar modal
 *@param STR_body STRING
 *@param STR_footer STRING
 *@param tipo OBJECT: tipo y nombre
 *@param id INTEGER: id de actor
 */
userDATOS.modalNOTICIA = function(STR_body,STR_footer,tipo, id = null) {
  let modal = $("#modal");

  modal.find("form").data("tipo",tipo["tipo"]);//para el submit del form

  modal.find(".modal-title").html("<span class=\"text-uppercase\">" + tipo["nombre"] + "</span>")
  modal.find(".modal-body").html(STR_body);
  modal.find(".modal-footer").html(STR_footer);

  if(tipo["tipo"] == "actor") {
    if(window.ARR_actor !== undefined) {
      t = $("#modal-table-actor");
      let x = 0;
      for(var i in window.ARR_actor) {
        x ++;
        t.find("tbody tr:nth-child(" + x + ") td:nth-child(2) select").val(i).trigger( "change" );
        if(window.ARR_actor[i]["frm_img"] == "1")
          t.find("tbody tr:nth-child(" + x + ") td:nth-child(3) input").attr("checked",true);
        if(window.ARR_actor[i]["frm_emisor"] == "1")
          t.find("tbody tr:nth-child(" + x + ") td:nth-child(4) input").attr("checked",true);
        t.find("tbody tr:nth-child(" + x + ") td:nth-child(5) input[value='" + window.ARR_actor[i]["frm_valor"] + "']").attr("checked",true);
      }
    }
    if(window.noticiaSELECCIONADA !== undefined) {
      if(window.noticiaSELECCIONADAeditar === undefined) {
        if(parseInt(window.noticiaSELECCIONADA.estado) == 2) {
          if(Object.keys(window.ARR_actor).length == 0) {
            modal.find("#modal-table-actor tbody").html("<tr><td></td></tr>")
            modal.find("#modal-table-actor tbody td").html("<h3 class='text-center text-uppercase'>sin datos para mostrar</h3>")
          } else {
            modal.find("tbody tr td:first-child").remove();
            modal.find("input").attr("disabled",true);
          }
        }
      }
    }
  } else if(tipo["tipo"] == "institucion") {
    if(window.ARR_institucion !== undefined) {
      t = $("#modal-table-institucion");
      let x = 0;
      for(var i in window.ARR_institucion) {
        x ++;
        t.find("tbody tr:nth-child(" + x + ") td:nth-child(2) select").val(i).trigger( "change" );
        if(window.ARR_institucion[i]["frm_emisor"] == "1")
          t.find("tbody tr:nth-child(" + x + ") td:nth-child(3) input").attr("checked",true);
        t.find("tbody tr:nth-child(" + x + ") td:nth-child(4) input[value='" + window.ARR_institucion[i]["frm_valor"] + "']").attr("checked",true);
      }

      if(window.noticiaSELECCIONADA !== undefined) {
        if(window.noticiaSELECCIONADAeditar === undefined) {
          if(parseInt(window.noticiaSELECCIONADA.estado) == 2) {
            if(Object.keys(window.ARR_institucion).length == 0) {
              t.find("tbody").html("<tr><td></td></tr>")
              t.find("tbody td").html("<h3 class='text-center text-uppercase'>sin datos para mostrar</h3>")
            } else {
              t.find("tbody tr td:first-child").remove();
              t.find("input").attr("disabled",true);
            }
          }
        }
      }
    }
  } else if(tipo["tipo"] == "cliente") {//UNIDAD DE ANALISIS
    t = $("#modal-table-unidad")
    if(window.ARR_cliente !== undefined) {
      x = 0;
      for(var i in window.ARR_cliente) {
        x++;
        t.find("tbody tr:nth-child(" + x + ")").find("td:nth-child(2) select").val(i).trigger("change")
        total = 0;
        if(window.ARR_cliente[i]["valoracion"] !== null) {
          for(var s in window.ARR_cliente[i]["valoracion"]) {
            if(window.ARR_cliente[i]["valoracion"][s] === null) {
              total = 99999;
              continue;
            }
            c = null;
            userDATOS.busqueda({"value":s.substring(4,5),"tabla":"calificacion"}, function(d) {
              c = d
            });
            if(parseInt(window.ARR_cliente[i]["valoracion"][s]) == 1)
              total += parseFloat(c.valor);
            else if(parseInt(window.ARR_cliente[i]["valoracion"][s]) == 3)
              total -= parseFloat(c.valor);
          }
          clase = "bg-light";
          texto = "sin acción";
          if(total != 99999) {
            if(total >= 2) {
              clase = "bg-success text-white";
              texto = "positivo"
            } else if( total >= 0 && total < 2) {
              clase = "bg-warning text-dark";
              texto = "neutro"
            } else {
              clase = "bg-danger text-white";
              texto = "negativo"
            }
          }
          t.find("tbody tr:nth-child(" + x + ")").find("td:nth-child(3) div").removeClass("bg-light")
          t.find("tbody tr:nth-child(" + x + ")").find("td:nth-child(3) div").addClass(clase).text(texto)

          t.find("tbody tr:nth-child(" + x + ")").find("td:nth-child(4) div").html((window.ARR_cliente[i]["tema"]["texto"] == "" ? "sin temas" : window.ARR_cliente[i]["tema"]["texto"]))
        }
      }
    }

    // if(window.noticiaSELECCIONADA !== undefined) {
    //   if(window.noticiaSELECCIONADAeditar === undefined) {
    //     if(parseInt(window.noticiaSELECCIONADA.estado) == 2) {
    //       $("#btn_temas").addClass("d-none");
    //       modal.find("tr td:first-child").remove();
    //       modal.find("tr td:last-child").remove();
    //       modal.find("input").attr("disabled",true);
    //     }
    //   } else modal.find("tr td:first-child").remove();
    // }
  }

  if(window.noticiaSELECCIONADA !== undefined) {
    if(window.noticiaSELECCIONADAeditar === undefined) {
      if(parseInt(window.noticiaSELECCIONADA.estado) == 2)
        modal.find("select.select__2").attr("disabled",true);
    } else {
      modal.find(".select__2").removeAttr("disabled")
      if($("#frm_unidad").length)
        $("#frm_unidad").attr("disabled",true);
    }
  }
  if(id == null)
    modal.modal("show");
  else modal.find(".select__2").select2()
};
/**
 * Función para el calculo de valoración del actor
 *@param e ELEMENTO
 *@param valor FLOAT
 *@param tipo STRING
 */
userDATOS.calcularValoracion = function(e,valor,tipo,id) {
  //positivo + 2
  //neutro 0 y 2
  // negativo
  let detalle = "";
  window.valoracion = 0;
  if(window.valoracionARR === undefined) window.valoracionARR = {};
  if(window.valoracionARR[id] === undefined) window.valoracionARR[id] = {}
  //Con este valor, significa que corresponde a IMAGEN/VIDEO
  //Tipo = 0 -> Equivale al tipo de valoración
  //Tipo = 1 -> Equivale al valor
  if(valor == -1) {
    for(var x in window["calificaciones"][tipo]) {
      if(window.ARR_cliente[id]["valoracion"]["frm_" + window["calificaciones"][tipo][x]["id"]] !== undefined) {
        delete window.ARR_cliente[id]["valoracion"]["frm_" + window["calificaciones"][tipo][x]["id"]]
        delete window.valoracionARR[id][window["calificaciones"][tipo][x]["id"]]
      }

      if(window["calificaciones"][tipo][x]["id"] == $("#frm_imagen").val())
        valor = window["calificaciones"][tipo][x]["valor"]
      console.log(valor)
    }
    if($("#frm_valor_imagen").val() == 1) valor *= 1;//a favor
    else if($("#frm_valor_imagen").val() == 3) valor *= -1;//contra
    else valor = 0;
    if(window.ARR_cliente[id]["valoracion"]["frm_" + $("#frm_imagen").val()] === undefined)
      window.ARR_cliente[id]["valoracion"]["frm_" + $("#frm_imagen").val()] = null;
    window.ARR_cliente[id]["valoracion"]["frm_" + $("#frm_imagen").val()] = valor;

    if(window.valoracionARR[id][$("#frm_imagen").val()] === undefined)
      window.valoracionARR[id][$("#frm_imagen").val()] = 0;

    window.valoracionARR[id][$("#frm_imagen").val()] = valor;
  } else {
    if($(e).val() == 1) valor *= 1;//a favor
    else if($(e).val() == 3) valor *= -1;//contra
    else valor = 0;

    if(window.ARR_cliente[id]["valoracion"]["frm_" + tipo] === undefined)
      window.ARR_cliente[id]["valoracion"]["frm_" + tipo] = null;
    window.ARR_cliente[id]["valoracion"]["frm_" + tipo] = valor;


    if(window.valoracionARR[id][tipo] === undefined)
      window.valoracionARR[id][tipo] = 0;

    window.valoracionARR[id][tipo] = valor;
  }

  for(var i in window.valoracionARR[id])
    window.valoracion += window.valoracionARR[id][i];

  if(window.valoracion > 0) detalle = '<div class="bg-success text-white p-2 text-center text-uppercase">positivo</div>';
  else if(window.valoracion == 0) detalle = '<div class="bg-warning text-dark p-2 text-center text-uppercase">neutro</div>'
  else detalle = '<div class="bg-danger p-2 text-center text-white text-uppercase">negativo</div>'

  $("#div_valoracion").html(detalle);
}

userDATOS.valoracionActiva = function(t) {
  let v = $(t);
  if(v.val() == "") {//no hay cliene elegido
    v.closest("form").find(".select-valor").val("").trigger("change");
    v.closest("form").find(".select-valor").attr("disabled",true);
    v.closest("form").find(".select-valor").select2();
    $("#div_valoracion").html('<div class="rounded bg-light p-2 text-center border text-uppercase">sin acción</div>')
  } else {
    v.closest("form").find(".select-valor").removeAttr("disabled");
    v.closest("form").find(".select-valor").select2();
  }
}

/**
 * Valida el formulario con elemento required y visible
 * @param t STRING: elemento donde se busca la info
 */
userDATOS.validar = function(t, marca = true, visible = true) {
  let flag = 1;
  $(t).find('*[required="true"]').each(function(){
    if($(this).is(":visible")) {
      if($(this).is(":invalid") || $(this).val() == "") {
        flag = 0;
        if(marca) $(this).addClass("has-error");
      }
    }
  });
  return flag;
};
/**
 * Función que usa la api Lobibox
 *@param mensaje STRING: texto que aparece en la notificación
 *@param tipo STRING: permite cambiar el color a la notificación
 *@param dlay BOOL: flag para mostrar el indicador de demora
 */
userDATOS.notificacion = function (mensaje,tipo = 'info',dlay = true){
  // Available types 'warning', 'info', 'success', 'error'
  Lobibox.notify(tipo, {
    size: 'mini',
    icon: false,
    delayIndicator: dlay,
    msg: mensaje,
    sound: false
  });
};
/**
 * Función que muestra el modal especifico de usuarios
 */
userDATOS.cambiarClave = function() {
  let u = null;
  userDATOS.busqueda({"value":window.user_id,"tabla":"usuario"}, function(d) {
    u = d;
  });
  $('#dropdown-menu').dropdown('toggle');
  $.MessageBox({
    buttonDone  : strings.btn.cambiar,
    buttonFail  : strings.btn.cancelar,
    message : strings.usuario.contrasela,
    input   : { 
      inputPass     : {
        type         : "password",
        label        : "Contraseña actual (*):",
        title        : "Contraseña actual",
      },
      inputPassNew1  : {
        type         : "password",
        label        : "Contraseña nueva (*):",
        title        : "Contraseña nueva",
      },
      inputPassNew2  : {
        type         : "password",
        label        : "Repita contraseña nueva (*):",
        title        : "Repita contraseña nueva",
      },
    },
    top     : "auto",
    filterDone      : function(data){
      setTimeout(() => {
        $(".messagebox_content_error").hide();
      }, 3000);
      if(data.inputPass == "" || data.inputPassNew1 == "" || data.inputPassNew2 == "")
        return strings.faltan.datos;
      if(md5(data.inputPass) != u.pass)
        return strings.contrasela.erronea
      if(data.inputPassNew1 != data.inputPassNew2)
        return strings.contrasela.noCoinciden
    }
  }).done(function(data){
    auxPyrus = new Pyrus("usuario", false);
    u.cantidad = data.inputPassNew1.length
    u.pass = md5(data.inputPassNew1);
    auxPyrus.guardar_1(u);
    userDATOS.log(window.user_id,"Cambio de contraseña del usuario",0,window.user_id,"usuario");
    userDATOS.notificacion(strings.cambiadoDatos,"success");
  });
}
/**
 *
 */
userDATOS.borrarREGISTROlog = function(id) {
  $.ajax({
     type: 'POST',
     url: cliente_url,
     async: false,
     data: { "tipo": "delete", "tabla": "usuariotimeout", "user_id": id }
  })
}
/**
 * Función para salir del sistema
 */
userDATOS.logout = function() {
  userDATOS.log(window.user_id,"Salida del sistema",1);
  userDATOS.borrarREGISTROlog(window.user_id);
  if(window.evtSource !== undefined) window.evtSource.close();
  /** Si hay una noticia abierta, cambia los flags correspondientes */
  if(window.noticiaSELECCIONADA !== undefined) {
    if(parseInt(window.noticiaSELECCIONADA.estado) == 1) {
      userDATOS.change(window.noticiaSELECCIONADA.id,"noticia","estado",0);
      userDATOS.change(window.noticiaSELECCIONADA.id_noticia,"noticias","estado",0);
    } else if(parseInt(window.noticiaSELECCIONADA.estado) == 6) {
      userDATOS.change(window.noticiaSELECCIONADA.id,"noticia","estado",2);
      userDATOS.change(window.noticiaSELECCIONADA.id_noticia,"noticias","estado",2);
    }
  }
  x = new Pyrus();
  document.getElementById("div").classList.remove("d-none");
  x.query("NS_logout",null,
   function(){ window.location = "index.html"; },
   null);
}
/**
 * Función que construye la tabla DATATABLE de forma genérica en la vista
 *@param target STRING: lugar donde se coloca el elemento
 *@param OBJ_pyrus OBJECT: objeto pyrus
 *@param searching BOOLEANO: flag para buscar o no en DATATABLE
 *@param id INTEGER: el nombre de la variable que contiene a la instancia de DATATABLE se genera con "tabla_" + id
 *@param OBJ_btn OBJECT: variable que contiene un objeto que agrega un boton a DATATABLE
 *@param BTN_default ARRAY: array de botones por default - add, show y delete
 */
userDATOS.listador = function(target,OBJ_pyrus,searching = true, id = 0, OBJ_btn = null, BTN_default = ["add","show","delete"]) {
	let nombre_tabla = "tabla_" + id;
	let column = OBJ_pyrus.columnaDT;
  
  let order = OBJ_pyrus.order;
	let ARR_btn = [];

  ///////
  if(OBJ_pyrus.entidad == "cliente") {
    console.log(column.length)
    if(column.length == 1) {
      column.push({"title":"UNIDAD DE ANÁLISIS", "data":"nombre"});
      column.push({"title":"CLIENTE FINAL", "data":"user"});
      column.push({"title":"ESTADO C. FINAL", "data":"activo"});
      
      order[0]["targets"].push(2);
      order[0]["targets"].push(3);
    }
  }

	if(BTN_default.indexOf("add") >= 0)
		ARR_btn.push({
				text: '<i class="fas fa-plus"></i>',
				className: 'btn-primary',
				action: function ( e, dt, node, config ) {
					window[nombre_tabla].rows('.selected').deselect();
					userDATOS.modal(window[nombre_tabla],OBJ_pyrus);
				}
			});
	if(BTN_default.indexOf("show") >= 0)
		ARR_btn.push({
				extend: 'selected',
				text: '<i class="fas fa-eye"></i>',
				className: 'btn-dark',
				action: function ( e, dt, node, config ) {
					let rows = dt.rows( { selected: true } ).count();
					userDATOS.show__(window[nombre_tabla],OBJ_pyrus);
				}
			});
	if(BTN_default.indexOf("delete") >= 0)
		ARR_btn.push({
				extend: 'selected',
				text: '<i class="fas fa-trash-alt"></i>',
				className: 'btn-danger',
				action: function ( e, dt, node, config ) {
					let rows = dt.rows( { selected: true } ).count();
					userDATOS.delete__(window[nombre_tabla],OBJ_pyrus);
				}
			});
	if(OBJ_btn != null) {
    if(Array.isArray(OBJ_btn)) {
      for(var i in OBJ_btn) ARR_btn.push(OBJ_btn[i]);
    } else ARR_btn.push(OBJ_btn);
  }
  if(OBJ_pyrus.entidad == "cliente") {
    ARR_btn.push({
				extend: 'selected',
				text: '<i class="fas fa-user-tag"></i>',
				className: 'btn-success',
				action: function ( e, dt, node, config ) {
					userDATOS.usuarioOSAI();
				}
			});
  }
  
	window[nombre_tabla] = $(target).DataTable({
    "processing": true,
    "pageLength": 10,
    "serverSide": true,
    "paging": true,
    "lengthChange": true,
    "responsive": true,
    "ajax": {
      "method": "POST",
      "url":"lib/DATATABLE.php",
      "data": {"entidad": OBJ_pyrus.entidad, "especificacion": OBJ_pyrus.especificacion, "entidades": JSON.stringify(ENTIDAD)},
    },
    "columns": column,
    "columnDefs": order,
    "fixedHeader": {
        header: false,
    },
		"select": 'single',
		"destroy": true,
		"order": [[ 0, "desc" ]],
    "searching": searching,
    "dom": 'lBfrtip',
		"scrollX":true,
		"lengthMenu": [[10, 25, 50], [10, 25, 50]],
		"buttons": ARR_btn,
		"language": translate_spanish
	});
	window[nombre_tabla].buttons().container().appendTo( $('.col-sm-6:eq(0)', window[nombre_tabla].table().container() ) );
	// window[nombre_tabla].column( 0 ).visible( false );
  $(".form-control-sm").removeClass("form-control-sm");
  $(".animate-flicker").removeClass("animate-flicker");
	$("div.dt-buttons button").removeClass("btn-default");
}
/**
 * Función para la remoción de ATRIBUTOS
 * Tanto de la vista como el back
 *@param r ELEMENTO
 */
userDATOS.removeATTRul = function(r) {
  let content = $(r);
  let t = content.parent().text();
  delete window.ATTR[t];
  content.closest('li').remove();
}
/**
 * Función que agrega al listado de ATRIBUTOS de un actor/Actor
 * en la vista ACTORES
 * Se agrega a un listado en la vista y un array en el back
 *@param r ELEMENTO
 */
userDATOS.addATTRul = function(r) {
  let content = $(r);
  if(content.val() == "") content.remove();
  else {
    let value = content.val();
    if(window.ATTR == undefined) window.ATTR = [];
    if(window.ATTR[value] == undefined) {
      window.ATTR[value] = "";
      content.parent().find("+ ul").append("<li class=\"list-group-item\">" + value + "<i class=\"text-danger fas fa-times-circle btn-click float-right\" onclick=\"userDATOS.removeATTRul(this)\"></i></li>");
      content.remove();
    } else
      content.focus();
  }
}
/**
 * Función para agregar ETIQUETAS/ATRIBUTOS a un actores
 * Agrega un input al formulario para el ingreso por teclado de la información
 *@param r ELEMENTO
 */
userDATOS.addATTR = function(r) {
  let content = $(r);
  content.find("+ .attr_actor div").html("<input onblur=\"userDATOS.addATTRul(this)\" type=\"text\" class=\"form-control\" />")
  content.find("+ .attr_actor div").find("input").focus();
}
/**
 * Función para mostrar modal de DATATABLE
 *@param tabla INSTANCIA: instancia de DATATABLE al que pertenece
 *@param OBJ_pyrus OBJECT
 */
userDATOS.modal = function(tabla, OBJ_pyrus, tipo = null) {
	let modal = $("#modal");
	let target = "#modal .modal-body";

  $("#modal").removeClass("bd-example-modal-lg");
  $("#modal").find(".modal-dialog").removeClass("modal-lg");

	modal.find(".modal-body").html(OBJ_pyrus.formulario_OK());
  if(OBJ_pyrus.entidad == "actor") {
    window.ATTR = undefined;
    modal.find(".modal-body").append("<div onclick=\"userDATOS.addATTR(this)\" class=\"form-group\"><div class=\"row\"><div class=\"col col-12\"><button type=\"button\" class=\"btn btn-block text-uppercase\">agregar atributo</button></div></div></div>")
    modal.find(".modal-body").append("<div class=\"attr_actor\"><div></div><ul class=\"mt-3 list-group\"></ul></div>")
    //modal.find(".modal-body").find("div.attr_actor div").html("");
  }
	modal.find(".modal-title").html("<strong>" + (ENTIDAD[OBJ_pyrus.entidad]["NOMBRE"]).toUpperCase() + "</strong>");

	if(modal.find("form").length) {
		modal.find("form").attr("action",OBJ_pyrus.entidad);
		modal.find("form").data("tipo",(tipo === null ? OBJ_pyrus.entidad : tipo));
	}

	modal.find(".modal-footer").html("<button type=\"submit\" class=\"btn btn-primary btn-block\">GUARDAR</button>");
	modal.modal("show");
	if($(".modal .select__2").length) $('.select__2').select2();
}
/**
 * Función que muestra el modal específico de usuarios.
 * Crea uno nuevo
 */
userDATOS.addUsuario = function(tabla,OBJ_pyrus) {
  let modal = $("#modal");
  let html = "", footer = "";
  let pyrusObjeto = new Pyrus("usuario_nivel",false)
  let niveles = pyrusObjeto.selector();
  delete niveles[1];
  if(parseInt(window.usuario.nivel) == 3) {
    //solo se deja monitor
    delete niveles[2];//saco administrador
    delete niveles[3];//saco relevo
  }
  modal.find(".modal-title").html("<strong>USUARIO</strong>");
  html += '<input type="hidden" class="form-control" name="frm_id" value="">'
  html += '<div class="form-group">'
    html += '<label for="frm_usuario">Usuario</label>'
    html += '<input required="true" type="text" class="form-control" name="frm_user" id="frm_usuario">'
  html += '</div>'
  html += '<div class="form-group">'
    html += '<label for="frm_nivel">Nivel</label>'
    html += '<select required="true" data-allow-clear="true" data-placeholder="Seleccione" class="form-control select__2" name="frm_nivel" id="frm_nivel">'
      html += '<option></option>'
      for(var i in niveles)
        html += '<option value="' + i + '">' + niveles[i] + '</option>'
    html += '</select>'
  html += '</div>'
  html += '<div class="form-group">'
    html += '<label for="claveNueva">Contraseña de acceso <strong>(12345678)</strong></label>';
    html += '<p class="m-0">Por precaución, no mantenga esta clave.</p>'
    html += '<input disabled="true" required="true" type="hidden" class="form-control" name="claveNueva" id="claveNueva" value="12345678">'
  html += '</div>'

  footer += '<div class="form-group w-100 mb-0">'
    footer += '<button type="submit" class="btn btn-block btn-primary text-uppercase">agregar</button>'
  footer += '</div>'

  modal.find(".modal-body").html(html);
  modal.find(".modal-footer").html(footer);

  modal.modal("show");
}
/**
 *
 */
userDATOS.restaurarClave = function() {
  $.MessageBox({
		buttonDone  : strings.btn.si,
		buttonFail  : strings.btn.no,
		message   : strings.messege.restaurar
	}).done(function(){
		window.usuarioTABLA.cantidad = "8";
    window.usuarioTABLA.pass = md5("12345678");
    pyrusObjeto = new Pyrus("usuario",false);
    pyrusObjeto.guardar_1(window.usuarioTABLA);

    userDATOS.notificacion(strings.restaurado(window.usuarioTABLA.user))
    window.usuarioTABLA = undefined;
	}).fail(function(){});
}
/**
 * Función para mostrar un usuario específico
 */
userDATOS.showUsuario = function(tabla,OBJ_pyrus) {
  let modal = $("#modal");
  let html = "", footer = "";
  let pyrusObjeto = new Pyrus("usuario_nivel",false);
  let niveles = pyrusObjeto.selector();
  let row = tabla_0.rows( { selected: true } ).data()[0];
  let o = null;
  userDATOS.busqueda({"value": row.id,"tabla":"usuario"}, function(d) {
    o = d;
  });
  let un = pyrusObjeto.busqueda("nivel",o.nivel);
  let data_nivel = userDATOS.parseJSON(un.data);
  window.usuarioTABLA = o;
  modal.find(".modal-title").html("<strong>USUARIO</strong>");

  html += '<article>'
    html += '<p><strong>Tipo:</strong> ' + niveles[o.nivel] + '</p>';
    html += '<p class="m-0"><strong>Accesos permitidos:</strong></p>';
    html += '<ul>';
    for(var i in data_nivel.vistasACTIVAS)
      html += '<li>' + i + '</li>';
    html += '</ul>';
    html += '<p><strong>Acciones permitidas:</strong> ' + un.acciones + '</p>';
  html += '</article>'

  if(parseInt(window.usuario.nivel) < 3) {
    footer += '<div class="form-group mb-0 w-100">'
      footer += '<button type="button" onclick="userDATOS.restaurarClave()" class="btn btn-block btn-primary text-uppercase">restaurar clave</button>'
    footer += '</div>'
  }

  modal.find(".modal-body").html(html);
  modal.find(".modal-footer").html(footer);
  //OBJ_pyrus.formularioDato("#modal .modal-body",id);
  modal.modal("show");
}
/**
 * Función para mostrar modal de DATATABLE
 *@param tabla INSTANCIA: instancia de DATATABLE al que pertenece
 *@param OBJ_pyrus OBJECT
 */
userDATOS.show__ = function(tabla,OBJ_pyrus) {
  let modal = $("#modal");
	let adata = tabla.rows( { selected: true } );
	let data = adata.data()[0];
  let id = data[0];
  if(id === undefined) id = data.id;/// ---> OJO, solo seria para la tabla CLIENTE, "no lo maneja pyrus.js" 
	modal.find(".modal-title").html("<strong>" + (ENTIDAD[OBJ_pyrus.entidad]["NOMBRE"]).toUpperCase() + "</strong>");

	modal.find(".modal-body").html(OBJ_pyrus.formulario_OK());
  if(OBJ_pyrus.entidad == "actor") {
    window.ATTR = undefined;
    modal.find(".modal-body").append("<div onclick=\"userDATOS.addATTR(this)\" class=\"form-group\"><div class=\"row\"><div class=\"col col-12\"><button type=\"button\" class=\"btn btn-block text-uppercase\">agregar atributo</button></div></div></div>")
    modal.find(".modal-body").append("<div class=\"attr_actor\"><div></div><ul class=\"mt-3 list-group\"></ul></div>")
    //modal.find(".modal-body").find("div.attr_actor div").html("");
  }
  if(modal.find("form").length) {
		modal.find("form").attr("action",OBJ_pyrus.entidad);
		modal.find("form").data("tipo",OBJ_pyrus.entidad);
	}
	OBJ_pyrus.formularioDato("#modal .modal-body",id);
	modal.find(".modal-footer").html("<button type=\"submit\" class=\"btn btn-primary btn-block\">EDITAR</button>");
	modal.modal("show");
}
/**
 * Función para eliminar registro de la tabla DATATABLE
 *@param tabla INSTANCIA: instancia de DATATABLE al que pertenece
 *@param OBJ_pyrus OBJECT
 */
userDATOS.delete__ = function(tabla,OBJ_pyrus) {
	$.MessageBox({
		buttonDone  : strings.btn.si,
		buttonFail  : strings.btn.no,
		message   : strings.eliminar.comun
	}).done(function(){
		let adata = tabla.rows( { selected: true } );
		let data = adata.data()[0];
		let id = data.id;
    userDATOS.log(window.user_id,"Baja de registro",0,id,OBJ_pyrus.entidad,1);
		OBJ_pyrus.remove(id);
    tabla.row('.selected').remove().draw( false );
    //userDATOS.listador("#t_actores",OBJ_pyrus.entidad,OBJ_pyrus);
		//function(target,entidad,OBJ_pyrus,searching = true, id = 0, OBJ_btn = null)
		//userDATOS.listador("#tabla",STR_entidad,p,BOOL_search,0,OBJ_btn_DOM,BTN);
	}).fail(function(){});
}
/**
 * Función para el parseo de string a JSON
 */
userDATOS.parseJSON = function(cadena) {
  //console.log(cadena)
  return eval("(" + cadena + ")");
}
/**
 * Función para mostrar fecha en formato dd/mm/aaaa
 */
userDATOS.fecha = function(f) {
  return f;
}
userDATOS.dataTableNOTIFICACIONES = function(target) {
  let rows = [];
  let ARR_btn = [];
  let columnDefs = [];
  let columns = null;
  columnDefs.push({"width": "10%", "targets": [0], "className": "text-center",
    'render': function (data, type, full, meta){
        return moment(data).format('YYYY/MM/DD HH:mm');
    }
  });//FECHA
  columnDefs.push({"width": "30%", "targets": [1], "className": "text-left text-uppercase"});//MENSAJE
  columnDefs.push({"width": "30%", "targets": [2], "className": "text-left text-uppercase"});//TITULO
  columnDefs.push({"width": "10%", "targets": [3], "className": "text-left text-uppercase"});//MEDIO
  columnDefs.push({"width": "10%", "targets": [4], "className": "text-left text-uppercase"});//TIPO
  columnDefs.push({"width": "10%", "targets": [5], "className": "text-left"});//USUARIO
  columnDefs.push({"width": "10%", "targets": [6], "className": "text-left"});//ESTADO
  columns = [
    {"data":"fecha"},
    {"data":"mensajes"},
    {"data":"titulo"},
    {"data":"medio"},
    {"data":"medio_tipo"},
    {"data":"usuario"},
    {"data":"estado"}
  ];

  ARR_btn.push({
    extend: 'selected',
    text: '<i class="fas fa-eye"></i>',
    className: 'btn-dark',
    action: function ( e, dt, node, config ) {
      let rows = dt.rows( { selected: true } ).count();
      userDATOS.distribuidorNOTICIA(0)
    }
  });
	tabla_noticia = $(target).DataTable({
    "processing": true,
    "pageLength": 10,
    "serverSide": true,
    "paging": true,
    "ajax": {
      "method": "POST",
      "url":"lib/notificacionesDATATABLE.php",
    },
    "columns": columns,
    "columnDefs": columnDefs,
		"select": 'single',
		"destroy": true,
		"order": [[ 1, "desc" ]],
		"searching": false,
    "ordering": false,
    "responsive": true,
		"sDom": "<'row '"+
					"<'col col-12 col-sm-6 d-flex justify-content-start __lenght_buttons'lB>"+
					"<'col col-12 col-sm-6'f>r>"+
					"<'table-scrollable table-noticia't>"+
				"<'row'"+
					"<'col col-12 col-sm-6 d-flex justify-content-start align-items-center'i>"+
					"<'col col-12 col-sm-6 d-flex justify-content-end align-items-center __paginate'p>>",
		"scrollX":true,
    //"scrollY":false,
		"lengthMenu": [[10, 25, 50], [10, 25, 50]],
    "buttons": ARR_btn,
		"language": translate_spanish
	});
	tabla_noticia.buttons().container().appendTo( $('.col-sm-6:eq(0)', tabla_noticia.table().container() ) );
  $(".form-control-sm").removeClass("form-control-sm");
	$("div.dt-buttons button").removeClass("btn-default");
  $(".animate-flicker").removeClass("animate-flicker");
}
userDATOS.dataTableNOTICIASeliminadas = function(target) {
  let rows = [];
  let ARR_btn = [];
  let columnDefs = [];
  let columns = null;
  columnDefs.push({"width": "10%", "targets": [0,1], "className": "text-center",
    // 'render': function (data, type, full, meta){
    //     return moment(data).format('YYYY/MM/DD HH:mm');
    // }
  });//FECHA
  columnDefs.push({"width": "10%", "targets": [2], "className": "text-left text-uppercase"});//usuario
  columnDefs.push({"width": "10%", "targets": [3], "className": "text-left text-uppercase"});//TIPO
  columnDefs.push({"width": "10%", "targets": [4], "className": "text-left text-uppercase"});//MEDIO
  columnDefs.push({"width": "10%", "targets": [5], "className": "text-left text-uppercase"});//SECCION
  columnDefs.push({"width": "40%", "targets": [6], "className": "text-left"});//TITULO
  columns = [
    {"data":"fecha"},
    {"data":"fecha_baja"},
    {"data":"usuario"},
    {"data":"medio_tipo"},
    {"data":"medio"},
    {"data":"seccion"},
    {"data":"titulo"}
  ];

  ARR_btn.push({
    extend: 'selected',
    text: '<i class="fas fa-eye"></i>',
    className: 'btn-dark',
    action: function ( e, dt, node, config ) {
      let rows = dt.rows( { selected: true } ).count();
      userDATOS.distribuidorNOTICIA(0,1)
    }
  });
	tabla_noticia = $(target).DataTable({
    "processing": true,
    "pageLength": 10,
    "serverSide": true,
    "paging": true,
    "ajax": {
      "method": "POST",
      "url":"lib/noticiasDATATABLEeliminado.php",
    },
    "columns": columns,
    "columnDefs": columnDefs,
		"select": 'single',
		"destroy": true,
		"order": [[ 1, "desc" ]],
		"searching": false,
    "ordering": false,
    "responsive": true,
		"sDom": "<'row '"+
					"<'col col-12 col-sm-6 d-flex justify-content-start __lenght_buttons'lB>"+
					"<'col col-12 col-sm-6'f>r>"+
					"<'table-scrollable table-noticia't>"+
				"<'row'"+
					"<'col col-12 col-sm-6 d-flex justify-content-start align-items-center'i>"+
					"<'col col-12 col-sm-6 d-flex justify-content-end align-items-center __paginate'p>>",
		"scrollX":true,
    //"scrollY":false,
		"lengthMenu": [[10, 25, 50], [10, 25, 50]],
    "buttons": ARR_btn,
		"language": translate_spanish
	});
	tabla_noticia.buttons().container().appendTo( $('.col-sm-6:eq(0)', tabla_noticia.table().container() ) );
  $(".form-control-sm").removeClass("form-control-sm");
	$("div.dt-buttons button").removeClass("btn-default");
  $(".animate-flicker").removeClass("animate-flicker");
}
/**
 * Función que construye la tabla DATATABLE de forma especial en la vista
 *@param target STRING: lugar donde se coloca el elemento
 *@param registros: elementos a mostrar en la tabla
 *@param searching BOOLEANO: flag para buscar o no en DATATABLE
 *@param id INTEGER: el nombre de la variable que contiene a la instancia de DATATABLE se genera con "tabla_" + id
 */
userDATOS.dataTableNOTICIAS = function(target,datos = {}) {
	let rows = [];
  let ARR_btn = [];
  let columnDefs = [];
  let columns = null;
  columnDefs.push({"width": "0%", "targets": [0]});
  columnDefs.push({"width": "10%", "targets": [1], "className": "text-center",
    'render': function (data, type, full, meta){
        return moment(data).format('YYYY/MM/DD HH:mm');
    }
  });//FECHA
  if(datos["moderado"] !== undefined) {
    columnDefs.push({"width": "24%", "targets": [2], "className": "text-left text-uppercase"});//UNIDAD DE ANALISIS
    columnDefs.push({"width": "7%", "targets": [3], "className": "text-left text-uppercase"});//TIPO
    columnDefs.push({"width": "7%", "targets": [4], "className": "text-left text-uppercase"});//MEDIO
    columnDefs.push({"width": "10%", "targets": [5], "className": "text-left text-uppercase"});//SECCION
    columnDefs.push({"width": "35%", "targets": [6], "className": "text-left"});//TITULO
    columnDefs.push({"width": "7%", "targets": [7], "className": "text-center text-uppercase"});//ESTADO
    columns = [
      {"data":"id",title: "id"},
      {"data":"fecha",title: "FECHA"},
      {"data":"cliente",title: "U. ANÁLISIS"},
      {"data":"medio_tipo",title: "TIPO"},
      {"data":"medio",title: "MEDIO"},
      {"data":"seccion",title: "SECCIÓN"},
      {"data":"titulo",title: "TÍTULO"},
      {"data":"estado",title: "ESTADO"}
    ];
  } else {
    columnDefs.push({"width": "10%", "targets": [2], "className": "text-left text-uppercase"});//TIPO
    columnDefs.push({"width": "10%", "targets": [3], "className": "text-left text-uppercase"});//MEDIO
    columnDefs.push({"width": "20%", "targets": [4], "className": "text-left text-uppercase"});//SECCION
    columnDefs.push({"width": "50%", "targets": [5], "className": "text-left"});//TITULO
    columnDefs.push({"width": "10%", "targets": [6], "className": "text-center text-uppercase"});//ESTADO

    columns = [
      {"data":"id",title: "id"},
      {"data":"fecha",title: "FECHA"},
      {"data":"medio_tipo",title: "TIPO"},
      {"data":"medio",title: "MEDIO"},
      {"data":"seccion",title: "SECCIÓN"},
      {"data":"titulo",title: "TÍTULO"},
      {"data":"estado",title: "ESTADO"}
    ];
  }
  if(datos["moderado"] !== undefined) {
    ARR_btn.push({
      text: '<i class="fas fa-plus"></i>',
      className: 'btn-primary',
      action: function ( e, dt, node, config ) {
        userDATOS.pantalla_ON();
      }
    });
  }
  ARR_btn.push({
    extend: 'selected',
    text: '<i class="fas fa-eye"></i>',
    className: 'btn-dark',
    action: function ( e, dt, node, config ) {
      if(Object.keys(datos).length > 0)
        userDATOS.distribuidorNOTICIA(3);
      else
        userDATOS.distribuidorNOTICIA(1);
    }
  });
	tabla_noticia = $(target).DataTable({
    "processing": true,
    "pageLength": 10,
    "serverSide": true,
    "paging": true,
    "ajax": {
      "method": "POST",
      "url":"lib/noticiasDATATABLE.php",
      "data": datos,
    },
    "columns": columns,
    "columnDefs": columnDefs,
		"select": 'single',
		"destroy": true,
		"order": [[ 1, "desc" ]],
		"searching": false,
    "ordering": false,
    "responsive": true,
		"sDom": "<'row '"+
					"<'col col-12 col-sm-6 d-flex justify-content-start __lenght_buttons'lB>"+
					"<'col col-12 col-sm-6'f>r>"+
					"<'table-scrollable table-noticia't>"+
				"<'row'"+
					"<'col col-12 col-sm-6 d-flex justify-content-start align-items-center'i>"+
					"<'col col-12 col-sm-6 d-flex justify-content-end align-items-center __paginate'p>>",
		"scrollX":true,
    //"scrollY":false,
		"lengthMenu": [[10, 25, 50], [10, 25, 50]],
    "buttons": ARR_btn,
		"language": translate_spanish
	});
	tabla_noticia.buttons().container().appendTo( $('.col-sm-6:eq(0)', tabla_noticia.table().container() ) );
	tabla_noticia.column( 0 ).visible( false );
  $(".form-control-sm").removeClass("form-control-sm");
	$("div.dt-buttons button").removeClass("btn-default");
  $(".animate-flicker").removeClass("animate-flicker");
  $("#date_filter").find("input,select,button").removeAttr("disabled");
  $("#date_filter").find("select").select2();
}
//-----------------------

userDATOS.dataTableNOTICIAS2 = function(target,datos = {}) {
  datos["moderado"] = 0;
  datos["estado"] = 0;
	let rows = [];
  let ARR_btn = [];
  let columnDefs = [];
  columnDefs.push({"width": "3%",'targets': 0,'searchable': false,'orderable': false,'className': 'bg-dark text-center',
     'render': function (data, type, full, meta){
         return '<input type="checkbox" name="id[]" value="' + $('<div/>').text(data).html() + '">';
     }
  });
  columnDefs.push({"width": "7%", "targets": [1], "className": "text-center",
    'render': function (data, type, full, meta){
        return moment(data).format('YYYY/MM/DD HH:mm');
    }
  });//FECHA
  columnDefs.push({"width": "15%", "targets": [2], "className": "text-left text-uppercase"});//TIPO
  columnDefs.push({"width": "13%", "targets": [3], "className": "text-left text-uppercase"});//MEDIO
  columnDefs.push({"width": "15%", "targets": [4], "className": "text-left text-uppercase"});//SECCION
  columnDefs.push({"width": "47%", "targets": [5], "className": "text-left"});//TITULO

  ARR_btn.push({
        text: '<i class="fas fa-check"></i>',
        className: 'btn-success buttons-selected disabled',
        action: function ( e, dt, node, config ) {
          userDATOS.relevarNOTICIA();
        }
      });
  ARR_btn.push({
        text: '<i class="fas fa-trash-alt"></i>',
        className: 'btn-danger buttons-selected disabled',
        action: function ( e, dt, node, config ) {
          userDATOS.eliminarNOTICIA();
        }
      });
  ARR_btn.push({
        extend: 'selected',
        text: '<i class="fas fa-eye"></i>',
        className: 'btn-dark',
        action: function ( e, dt, node, config ) {
          userDATOS.distribuidorNOTICIA(2);
        }
      });
  let dataSrc = [];
	tabla_noticia = $(target).DataTable({
    "processing": true,
    "pageLength": 10,
    "serverSide": true,
    "paging": true,
    "ajax": {
      "method": "POST",
      "url":"lib/noticiasDATATABLE.php",
      "data": datos
    },
    "columns": [
      {"data":"id"},
      {"data":"fecha"},
      {"data":"medio_tipo"},
      {"data":"medio"},
      {"data":"seccion"},
      {"data":"titulo"}
    ],
    "columnDefs": columnDefs,
		"select": {
          style:    'single',
          selector: 'td:not(:first-child)'
        },
		"destroy": true,
		"order": [[ 1, "desc" ]],
		"searching": false,
    "ordering": false,
    "responsive": true,
		"sDom": "<'row '"+
					"<'col col-12 col-sm-6 d-flex justify-content-start __lenght_buttons'lB>"+
					"<'col col-12 col-sm-6'f>r>"+
					"<'table-scrollable table-noticia't>"+
				"<'row'"+
					"<'col col-12 col-sm-6 d-flex justify-content-start align-items-center'i>"+
					"<'col col-12 col-sm-6 d-flex justify-content-end align-items-center __paginate'p>>",
		"scrollX":true,
    //"scrollY":false,
		"lengthMenu": [[10, 25, 50], [10, 25, 50]],
    "buttons": ARR_btn,
		"language": translate_spanish
	});
	tabla_noticia.buttons().container().appendTo( $('.col-sm-6:eq(0)', tabla_noticia.table().container() ) );

  $(".form-control-sm").removeClass("form-control-sm");
	$("div.dt-buttons button").removeClass("btn-default");
  $(".animate-flicker").removeClass("animate-flicker");
  $("#date_filter").find("input,select,button").removeAttr("disabled");
  $("#date_filter").find("select").select2();

  tabla_noticia.on( 'draw', function () {
    let flag = true;
    if(window.noticiasCHECKED !== undefined) {
      if(window.noticiasCHECKED !== null) {
        $('tbody input[type="checkbox"]').each(function(){
          if(window.noticiasCHECKED[$(this).val()] !== undefined) {
            flag = false;
            $(this).prop("checked",true);
          }
        });
      }
    }
    if(flag) $(".dataTables_scrollHead table thead tr th:first-child").html('<input type="checkbox" name="select_all" value="1" id="noticias-select-all">');
    else $(".dataTables_scrollHead table thead tr th:first-child").html('<input checked="true" type="checkbox" name="select_all" value="1" id="noticias-select-all">');
  });
}

userDATOS.dataTableNOTICIAS3 = function(target,datos,searching = true) {
	let rows = [];
  let ARR_btn = [];
  let columnDefs = [];
  let columns = null;
  if(parseInt(window.usuario.nivel) == 4) {
    columnDefs.push({"width": "0%",'targets': 0,'className': 'text-center'});
    columnDefs.push({"width": "7%", "targets": [1,2], "className": "text-center",
      'render': function (data, type, full, meta){
          return moment(data).format('YYYY/MM/DD HH:mm');
      }
    });//FECHA
    columnDefs.push({"width": "15%", "targets": [3], "className": "text-left text-uppercase"});//UNIDAD DE ANALISIS
    columnDefs.push({"width": "15%", "targets": [4], "className": "text-left text-uppercase"});//TEMAS
    columnDefs.push({"width": "15%", "targets": [5], "className": "text-left text-uppercase"});//ACTORES
    columnDefs.push({"width": "12%", "targets": [6], "className": "text-left text-uppercase"});//TIPO
    columnDefs.push({"width": "12%", "targets": [7], "className": "text-left text-uppercase"});//MEDIO
    columnDefs.push({"width": "15%", "targets": [8], "className": "text-left text-uppercase"});//SECCION
    columnDefs.push({"width": "32%", "targets": [9], "className": "text-left"});//TITULO

    columns = [
      {"data":"id","title": "ID"},
      {"data":"fecha","title": "FECHA"},
      {"data":"fecha_proceso","title": "F. PROCESO"},
      {"data":"cliente","title": "U. ANÁLISIS"},
      {"data":"tema","title": "TEMAS"},
      {"data":"actor","title": "ACTORES"},
      {"data":"medio_tipo","title": "TIPO"},
      {"data":"medio","title": "MEDIO"},
      {"data":"seccion","title": "SECCIÓN"},
      {"data":"titulo","title": "TÍTULO"}
    ];
  } else {
    columnDefs.push({"width": "0%",'targets': 0,'className': 'text-center'});
    columnDefs.push({"width": "7%", "targets": [1,2], "className": "text-center",
      'render': function (data, type, full, meta){
          return moment(data).format('YYYY/MM/DD HH:mm');
      }
    });//FECHA
    columnDefs.push({"width": "7%",'targets': [3],'className': 'text-left text-uppercase'});//USUARIO
    columnDefs.push({"width": "15%", "targets": [4], "className": "text-left text-uppercase"});//UNIDAD DE ANALISIS
    columnDefs.push({"width": "15%", "targets": [5], "className": "text-left text-uppercase"});//TEMAS
    columnDefs.push({"width": "15%", "targets": [6], "className": "text-left text-uppercase"});//ACTORES
    columnDefs.push({"width": "10%", "targets": [7], "className": "text-left text-uppercase"});//TIPO
    columnDefs.push({"width": "10%", "targets": [8], "className": "text-left text-uppercase"});//MEDIO
    columnDefs.push({"width": "15%", "targets": [9], "className": "text-left text-uppercase"});//SECCION
    columnDefs.push({"width": "29%", "targets": [10], "className": "text-left"});//TITULO

    columns = [
      {"data":"id","title": "ID"},
      {"data":"fecha","title": "FECHA"},
      {"data":"fecha_proceso","title": "F. PROCESO"},
      {"data":"usuario","title": "USUARIO"},
      {"data":"cliente","title": "U. ANÁLISIS"},
      {"data":"tema","title": "TEMAS"},
      {"data":"actor","title": "ACTORES"},
      {"data":"medio_tipo","title": "TIPO"},
      {"data":"medio","title": "MEDIO"},
      {"data":"seccion","title": "SECCIÓN"},
      {"data":"titulo","title": "TÍTULO"}
    ];
  }
  if(parseInt(window.usuario.nivel) <= 3) {
    //SOLO accedido por relevo, administrador y root
    ARR_btn.push({
        extend: 'selected',
        text: '<i class="fas fa-minus-circle"></i>',
        className: 'btn-warning',
        action: function ( e, dt, node, config ) {
          userDATOS.eliminarNOTICIAprocesada();
        }
      });
    ARR_btn.push({
        extend: 'selected',
        text: '<i class="fas fa-trash-alt"></i>',
        className: 'btn-danger',
        action: function ( e, dt, node, config ) {
          userDATOS.eliminarNOTICIAproceso();
        }
      });
  }
  ARR_btn.push({
        extend: 'selected',
        text: '<i class="fas fa-eye"></i>',
        className: 'btn-dark',
        action: function ( e, dt, node, config ) {
          userDATOS.distribuidorNOTICIA(4);
        }
      });
  ARR_btn.push({
        extend: 'selected',
        text: '<i class="fas fa-paperclip"></i>',
        className: 'btn-success',
        action: function ( e, dt, node, config ) {
          userDATOS.clippingNOTICIA();
        }
      });

	tabla_noticia = $(target).DataTable({
    "processing": true,
    "pageLength": 10,
    "serverSide": true,
    "paging": true,
    "ajax": {
      "method": "POST",
      "url":"lib/noticiasDATATABLE.php",
      "data": datos
    },
    "columns": columns,
    "columnDefs": columnDefs,
		"select": {
          style:    'single',
          selector: 'td'
        },
		"destroy": true,
		"order": [[ 1, "desc" ]],
		"searching": false,
    "ordering": false,
    "responsive": true,
		"sDom": "<'row '"+
					"<'col col-12 col-sm-6 d-flex justify-content-start __lenght_buttons'lB>"+
					"<'col col-12 col-sm-6'f>r>"+
					"<'table-scrollable table-noticia't>"+
				"<'row'"+
					"<'col col-12 col-sm-6 d-flex justify-content-start align-items-center'i>"+
					"<'col col-12 col-sm-6 d-flex justify-content-end align-items-center __paginate'p>>",
		"scrollX":true,
    //"scrollY":false,
		"lengthMenu": [[10, 25, 50], [10, 25, 50]],
    "buttons": ARR_btn,
		"language": translate_spanish
	});
  //new $.fn.dataTable.FixedHeader( tabla_noticia );
  tabla_noticia.column( 0 ).visible( false );
  $(".form-control-sm").removeClass("form-control-sm");
	$("div.dt-buttons button").removeClass("btn-default");
  $(".animate-flicker").removeClass("animate-flicker");
  $("#date_filter").find("input,select,button").removeAttr("disabled");
  $("#date_filter").find("select").select2();
}
/**
 *
 */
userDATOS.dataTableNOTICIAS4 = function(target) {
  let rows = [];
  let ARR_btn = [];
  let columnDefs = [];
  let columns = null;
  columnDefs.push({"width": "7%", "targets": [0,1], "className": "text-center",
    'render': function (data, type, full, meta){
        return moment(data).format('YYYY/MM/DD HH:mm');
    }
  });//FECHA
  columnDefs.push({"width": "15%", "targets": [2], "className": "text-left text-uppercase"});//CLIENTE FINAL
  columnDefs.push({"width": "15%", "targets": [3], "className": "text-left text-uppercase"});//UNIDAD DE ANALISIS
  columnDefs.push({"width": "12%", "targets": [4], "className": "text-left text-uppercase"});//TIPO
  columnDefs.push({"width": "12%", "targets": [5], "className": "text-left text-uppercase"});//MEDIO
  columnDefs.push({"width": "32%", "targets": [6], "className": "text-left"});//TITULO

  columns = [
    {"data":"fecha","title": "FECHA"},
    {"data":"fecha_clipping","title": "FECHA PUBLICADA"},
    {"data":"cliente_final","title": "CLIENTE"},
    {"data":"cliente","title": "U. ANÁLISIS"},
    {"data":"medio","title": "MEDIO"},
    {"data":"estado","title": "ESTADO"},
    {"data":"titulo","title": "TÍTULO"}
  ];

  ARR_btn.push({
      extend: 'selected',
      text: '<i class="fas fa-paperclip"></i>',
      className: 'btn-success',
      action: function ( e, dt, node, config ) {
        userDATOS.clippingNOTICIA();
      }
    });

	tabla_noticia = $(target).DataTable({
    "processing": true,
    "pageLength": 10,
    "serverSide": true,
    "paging": true,
    "ajax": {
      "method": "POST",
      "url":"lib/noticiasDATATABLE.php",
      "data": {"clipping":1}
    },
    "columns": columns,
    "columnDefs": columnDefs,
		"select": {
          style:    'single',
          selector: 'td'
        },
		"destroy": true,
		"order": [[ 1, "desc" ]],
		"searching": false,
    "ordering": false,
    "responsive": true,
		"sDom": "<'row '"+
					"<'col col-12 col-sm-6 d-flex justify-content-start __lenght_buttons'lB>"+
					"<'col col-12 col-sm-6'f>r>"+
					"<'table-scrollable table-noticia't>"+
				"<'row'"+
					"<'col col-12 col-sm-6 d-flex justify-content-start align-items-center'i>"+
					"<'col col-12 col-sm-6 d-flex justify-content-end align-items-center __paginate'p>>",
		"scrollX":true,
    //"scrollY":false,
		"lengthMenu": [[10, 25, 50], [10, 25, 50]],
    "buttons": ARR_btn,
		"language": translate_spanish
	});
  $(".form-control-sm").removeClass("form-control-sm");
	$("div.dt-buttons button").removeClass("btn-default");
  $(".animate-flicker").removeClass("animate-flicker");
  $("#date_filter").find("input,select,button").removeAttr("disabled");
  $("#date_filter").find("select").select2();
}
/**
 * Distribuidor de noticias.
 * @param lugar INT - Indica de dónde se llama la función
 * 1 -> TODAS
 * 2 -> RELEVO
 * 3 -> A PROCESAR
 * 4 -> PROCESADAS
 * 5 -> CLIPPING
 */
userDATOS.distribuidorNOTICIA = function(lugar = 0,elim = 0) {
  let adata = tabla_noticia.rows( { selected: true } );
  let data = adata.data()[0];
  window.noticiaSELECCIONADA = null;
  userDATOS.busqueda({"value": data.id,"tabla":"noticia","column":"id","retorno":1,"elim":elim},function(d) {
    window.noticiaSELECCIONADA = d;
  });
  window.noticiaTABLA = null;
  userDATOS.busqueda({"value": window.noticiaSELECCIONADA.id_noticia,"tabla":"noticias","column":"id","retorno":1,"elim":elim}, function(d) {
    window.noticiaTABLA = d;
  });
  try {
    window.noticiaTABLA.data = userDATOS.parseJSON(window.noticiaTABLA.data);
  } catch {
    userDATOS.notificacion("<p class='p-0 m-0'>Ocurrió un error de conversión de datos.</p><p class='p-0 m-0'>Es posible que no se muestren algunas cosas. [<a href='" + window.noticiaSELECCIONADA.url + "' class='text-dark' target='_blank'>LINK</a>]</p>","warning",false);
  }
  userDATOS.noticiaBasica($("#pantalla"), window.noticiaSELECCIONADA, window.noticiaTABLA);
  if(lugar <= 2) {
    window.showNOTICIA = true;
    setTimeout(function() {
      $("#pantalla").removeClass("d-none");
      $("#div_img").addClass("d-none").removeClass("d-flex");
      $(".body").addClass("hidden-overflow");
    },100);
    return false;
  }
  window.showNOTICIA = false;//cierra el modal de forma simple, sin ningun cambio
  if(parseInt(window.noticiaSELECCIONADA.estado) == 1) {
    $("#pantalla").addClass("d-none");
    $("#div_img").addClass("d-none").removeClass("d-flex");
    userDATOS.notificacion(strings.noticia.abierta[1],"warning",false);
    return false;
  }
  if(lugar == 3)
    userDATOS.notificacion(strings.noticia.abriendo[0],"info",false);
  else
    userDATOS.notificacion(strings.noticia.abriendo[1],"info",false);

  $("#div_img").addClass("d-flex").removeClass("d-none");
  setTimeout(function() {
    userDATOS.distribuidorNOTICIA_behavior(lugar,elim);
  },100)
}
/**
 * Función para agregar elementos básicos de una noticia
 */
userDATOS.noticiaBasica = function(target, noticia, noticiaDATA) {
  let body = noticia.cuerpo;
  let medio = null;
  userDATOS.busqueda({"value":window.noticiaSELECCIONADA.id_medio,"tabla":"medio"}, function(d) {
    medio = d;
  });
  var SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
  while (SCRIPT_REGEX.test(body)) body = body.replace(SCRIPT_REGEX, "");
  target.find("*[data-tipo=\"cuerpo\"]").html(body);

  $('#tipo_cuerpo').summernote({
    toolbar: false,
    airMode: false,
    dialogsInBody: false,
    popover: { image: [], link: [], air: [] }
  });
  $('#tipo_cuerpo').summernote('disable');
  
  target.find("*[data-tipo=\"titulo\"]").html("<div class='form-noticia'>" + noticia.titulo + "</div>");
  if(noticiaDATA.bajada !== undefined) {
    target.find("*[data-tipo=\"subtitulo\"]").parent().removeClass("d-none");
    target.find("*[data-tipo=\"subtitulo\"]").html("<div class='form-noticia'>" + noticiaDATA.bajada + "</div>");
  } else target.find("*[data-tipo=\"subtitulo\"]").parent().addClass("d-none");
  if(noticiaDATA.data.imagen !== undefined) {
    target.find("*[data-tipo=\"imagen\"]").parent().removeClass("d-none");
    target.find("*[data-tipo=\"imagen\"]").attr("src",noticiaDATA.data.imagen);
  } else target.find("*[data-tipo=\"imagen\"]").parent().addClass("d-none");

  $("#noticia-detalle").removeClass("d-none");
  datoNoticia = "";
  datoNoticia += "<p class='m-0 text-center'>";
    datoNoticia += "<span class='border-right pr-3 mr-3'>" + medio.medio + "</span>";
    if(window.noticiaSELECCIONADA.url !== null)
      datoNoticia += "<a target='_blank' class='text-truncate w-50' href='" + window.noticiaSELECCIONADA.url + "'>" + window.noticiaSELECCIONADA.url + "<i class=\"fas ml-2 fa-external-link-alt\"></i></a>";
    else datoNoticia += "-";
    datoNoticia += "<span class='border-left pl-3 ml-3'>" + window.noticiaSELECCIONADA.fecha + "</span>";
  datoNoticia += "</p>"
  $("#noticia-detalle").find("> div div").html(datoNoticia);
}
userDATOS.distribuidorNOTICIA_behavior = function(lugar,elim) {
  let html = $("#pantalla");
  let noticiaData = null;
  let medio = null;
  userDATOS.busqueda({"value":window.noticiaSELECCIONADA.id_medio,"tabla":"medio"}, function(d) {
    medio = d;
  });

  let body_span = $(".body");
  if(parseInt(window.noticiaSELECCIONADA.elim)) {
    html.append("<button id='btn_restaurar' style='top:0; left:0;' onclick='userDATOS.restaurarNoticia(this)' class='btn rounded-0 btn-warning position-fixed text-uppercase'>restaurar</button>")
  }
  
  let periodista = null;
  userDATOS.busquedaPeriodista(window.noticiaSELECCIONADA.id_noticia,function(d) {
    periodista = d;
  });
  switch(lugar) {
    case 3://normal
      console.log("PROCESANDO NOTICIA");
      userDATOS.busqueda({"value":window.noticiaSELECCIONADA.id,"tabla":"noticiarelevo","column":"did_noticia","retorno":0,"elim":elim}, function(relevo) {
        for(var i in relevo) {
          if(parseInt(relevo[i]["id_cliente"]) == 0) continue
          if(window.ARR_cliente === undefined) window.ARR_cliente = {}
          if(window.ARR_cliente[relevo[i]["id_cliente"]] === undefined) window.ARR_cliente[relevo[i]["id_cliente"]] = {}

          window.ARR_cliente[relevo[i]["id_cliente"]]["valoracion"] = null
          window.ARR_cliente[relevo[i]["id_cliente"]]["tema"] = null
        }
      },true);
      
      userDATOS.showNOTICIA(window.noticiaSELECCIONADA);
      $('periodista_noticia').removeClass('d-none');
      $("#url_noticia").find(".text-truncate").html("<a href='" + window.noticiaSELECCIONADA.url + "' target='blank'>" + window.noticiaSELECCIONADA.url + "</a>");

      if(periodista === null) autor = "SIN IDENTIFICAR";
      else autor = periodista.nombre;
      $("#periodista_noticia").find(".text-truncate").html("<p class='m-0 text-uppercase'>" + autor + "</p>");

      $("#select_periodista").closest(".input-group").addClass("d-none");
      $("#select_periodista").closest(".input-group").removeClass("d-flex");

      if(periodista !== null) {
        $("#select_periodista").val(periodista.id).trigger("change");
      }

      if(window.noticiaSELECCIONADA.video !== null) {
        $("#video_noticia").removeClass("d-none");
        $("#video_noticia").find("div").html("<a href='" + window.noticiaSELECCIONADA.video + "' target='blank'>" + window.noticiaSELECCIONADA.video + "</a>")
      } else {
        $("#video_noticia").addClass("d-none");
        $("#video_noticia").find("div").html("")
      }

      $("#select_medio").val(medio.id).trigger("change");
      $("#select_medio").attr("disabled",true);

      html.find(".select__2").select2({width: 'resolve'});
      $('#tipo_cuerpo').summernote('disable');
      window.showNOTICIA = true;
      //VERIFICAR si detecto periodista
      $("#periodista_noticia").addClass("d-none");
      $("#select_periodista").closest(".input-group").removeClass("d-none").addClass("d-flex")

      if(window.noticiaSELECCIONADA.id_seccion == 0) {
        $("#select_seccion").val(0).trigger("change");
        $("#select_seccion").closest(".input-group").removeClass("d-none").addClass("d-flex")
      }

      if(window.noticiaSELECCIONADA.video === null) {
        $("#video_noticia").removeClass("d-none");
        $("#video_noticia").find("div").html("<input placeholder='Link de video' name='frm_video' type='text' class='form-control' />");
      }
      if(window.ARR_cliente !== undefined) {
        userDATOS.notificacion("Agregando <strong class='text-uppercase'>" + (Object.keys(window.ARR_cliente).length == 1 ? "unidad de análisis" : "unidades de análisis") + "</strong>","info",false);
      }
      $("#fecha_noticia").addClass("d-none");
    break;
    case 4://procesada
      console.log("NOTICIA PROCESADA");
      
      $("#select_medio").val(window.noticiaSELECCIONADA.id_medio).trigger("change");
      userDATOS.busqueda({"value":window.noticiaSELECCIONADA.id_noticia,"tabla":"noticiasproceso","column":"id_noticia","retorno":1,"elim":elim}, function(proceso) {
        let procesoDATA = userDATOS.parseJSON(proceso.data);
        setTimeout(function() {
          for(var i in procesoDATA) {
            if($("select#" + i).length) {
              $("#" + i).val(procesoDATA[i]).trigger("change");
              $("#" + i).attr("disabled",true)
            }
          }
        },500);
        ////
        ARR_attr = userDATOS.parseJSON(procesoDATA.noticiaATTR);
        for(var i in ARR_attr) {
          $("#noticiaATTR").append("<span class=\"bg-light border rounded p-2 m-2\">" + ARR_attr[i] + " <i class=\"attr_noticias d-none fas fa-times-circle text-danger btn-click\" onclick=\"userDATOS.eliminarATTR(this)\"></i></span>");
          if(window.ARR_atributos === undefined) window.ARR_atributos = [];
          if(window.ARR_atributos[ARR_attr[i]] === undefined) window.ARR_atributos[ARR_attr[i]] = "";
        }
      },true);
      let actores = null;
      userDATOS.busqueda({"value":window.noticiaSELECCIONADA.id_noticia,"tabla":"noticiasactor","column":"id_noticia","retorno":0,"elim":elim}, function(actores) {
        window.ARR_actor = {};
        for(var i in actores) window.ARR_actor[actores[i]["id_actor"]] = userDATOS.parseJSON(actores[i]["data"]);
      });
      let clientes = null;
      userDATOS.busqueda({"value":window.noticiaSELECCIONADA.id_noticia,"tabla":"noticiascliente","column":"id_noticia","retorno":0,"elim":elim}, function(clientes) {
        window.ARR_cliente = {};
        for(var i in clientes) {
          if(window.ARR_cliente[clientes[i]["id_cliente"]] === undefined) window.ARR_cliente[clientes[i]["id_cliente"]] = {}
          if(window.ARR_cliente[clientes[i]["id_cliente"]]["valoracion"] === undefined) window.ARR_cliente[clientes[i]["id_cliente"]]["valoracion"]
          if(window.ARR_cliente[clientes[i]["id_cliente"]]["tema"] === undefined) window.ARR_cliente[clientes[i]["id_cliente"]]["tema"]
          window.ARR_cliente[clientes[i]["id_cliente"]]["valoracion"] = userDATOS.parseJSON(clientes[i]["valoracion"]);
          window.ARR_cliente[clientes[i]["id_cliente"]]["tema"] = userDATOS.parseJSON(clientes[i]["tema"]);
        }
      }, true);
      userDATOS.busqueda({"value":window.noticiaSELECCIONADA.id_noticia,"tabla":"noticiasinstitucion","column":"id_noticia","retorno":0,"elim":elim}, function(instituciones) {
        window.ARR_institucion = {};
        for(var i in instituciones) window.ARR_institucion[instituciones[i]["id_institucion"]] = userDATOS.parseJSON(instituciones[i]["data"]);
      }, true);
      
      window.showNOTICIA = false;
      //-------------
      if(parseInt(window.usuario.nivel) <= 3)//si es administrador y relevo, permito editar
        $(".etiquetas h2").append('<button onclick="userDATOS.permitirEditar(this)" class="btn btn-sm btn-success position-absolute" style="left: 15px;top: 20px;"><i class="fas fa-edit"></i></button>');
      else {//Si es monitor, verificar que él haya hecho el proceso
        u = userDATOS.busqueda(window.noticiaSELECCIONADA.id_noticia,"noticiasproceso",false,"id_noticia",1,elim)
        if(u !== null) {
          if(u.id_usuario == window.window.user_id)
            $(".etiquetas h2").append('<button onclick="userDATOS.permitirEditar(this)" class="btn btn-sm btn-primary position-absolute" style="left: 15px;top: 20px;"><i class="fas fa-edit"></i></button>');
        }
      }
      
      userDATOS.showNOTICIA(window.noticiaSELECCIONADA);

      userDATOS.busqueda({"value":window.noticiaSELECCIONADA.id_noticia,"tabla":"proceso","column":"id_noticia","elim":elim}, function(proceso) {
        if(proceso !== null) {
          body = proceso.cuerpo_noticia;
          var SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
          while (SCRIPT_REGEX.test(body)) body = body.replace(SCRIPT_REGEX, "");
          $('#tipo_cuerpo').summernote('destroy');
          html.find("*[data-tipo=\"cuerpo\"]").html(body);
          $('#tipo_cuerpo').summernote({
            toolbar: false,
            airMode: false,
            dialogsInBody: false,
            popover: { image: [], link: [], air: [] }
          });
          $('#tipo_cuerpo').summernote('disable');
        }
      },true);

      $('periodista_noticia').removeClass('d-none');
      if(window.noticiaSELECCIONADA.url === null)
        $("#url_noticia").find(".text-truncate").html("SIN IDENTIFICAR");
      else
        $("#url_noticia").find(".text-truncate").html("<a href='" + window.noticiaSELECCIONADA.url + "' target='blank'>" + window.noticiaSELECCIONADA.url + "</a>");

      if(periodista === null) autor = "SIN IDENTIFICAR";
      else autor = periodista.nombre;
      $("#periodista_noticia").find(".text-truncate").html("<p class='m-0 text-uppercase'>" + autor + "</p>");

      $("#select_periodista").closest(".input-group").addClass("d-none");
      $("#select_periodista").closest(".input-group").removeClass("d-flex");

      if(periodista !== null) {
        $("#select_periodista").val(periodista.id).trigger("change");
      }

      if(window.noticiaSELECCIONADA.video !== null) {
        $("#video_noticia").removeClass("d-none");
        $("#video_noticia").find("div").html("<a href='" + window.noticiaSELECCIONADA.video + "' target='blank'>" + window.noticiaSELECCIONADA.video + "</a>")
      } else {
        $("#video_noticia").addClass("d-none");
        $("#video_noticia").find("div").html("")
      }

      $("#select_medio").val(medio.id).trigger("change");
      $("#select_medio").attr("disabled",true);

      html.find(".select__2").select2({width: 'resolve'});
      $('#tipo_cuerpo').summernote('disable');
      html.find(".select__2").select2();
    break;
  }
}
/**
 * Función para mostrar modal personalizado
 *@param data ELEMENTO: selección de row de DATATABLE
 */
userDATOS.showNOTICIA = function(noticia) {
	//let adata = tabla.rows( { selected: true } );
	//let data = adata.data()[0];
  // $("html").scrollTop(0)
  let autor = "";
  let body_span = $(".body");
  let html = $("#pantalla");
  switch(parseInt(noticia.estado)) {
    case 0:
      
    break;
    case 2:
      window.showNOTICIA = false;//aca
      $("#select_seccion").closest(".input-group").removeClass("d-flex");
      $("#select_seccion").closest(".input-group").addClass("d-none");

      $('#btn_eliminar,#btn_guardar,#btn_procesar,#form_ATTR,#fecha_noticia').addClass('d-none');
      $('#btn_institucion,#btn_actor').removeClass('d-none');
      break;
  }
  setTimeout(function() {
    $("#div_img").addClass("d-none").removeClass("d-flex")
    html.removeClass("d-none");
    body_span.addClass("hidden-overflow");
  },1000)
}

/*userDATOS.showNOTICIAsimple = function(noticia,medio) {
	//let adata = tabla.rows( { selected: true } );
	//let data = adata.data()[0];
}*/

userDATOS.permite = function(e,letras) {
	let key = e.which,
		keye = e.keyCode,
		tecla = String.fromCharCode(key).toLowerCase();

	if (keye != 13) {
		if (letras.indexOf(tecla) == -1 && keye != 9 && (key == 37 || keye != 37) && (keye != 39 || key == 39) && keye != 8 && (keye != 46 || key == 46) || key == 161)
			e.preventDefault();
	}
}

userDATOS.procesar_noticia = function(callback) {
  setTimeout(function() {
    let CUERPO_noticia = $(".note-editable");
    let OBJ = {};
    let actores = null;
    userDATOS.busquedaTabla("actor",function(d) {
      actores = d;
    });
    let instituciones = null;
    userDATOS.busquedaTabla("attr_institucion",function(d) {
      instituciones = d;
    });
    OBJ["actores"] = undefined;
    OBJ["instituciones"] = undefined;
    if(!CUERPO_noticia.find("iframe").length) {
      for(var i in actores) {
        flag = false;
        nombre = actores[i]["nombre"];
        if(CUERPO_noticia.buscar(nombre)) {//BUSQUEDA de nombre completo
          console.log("NOMBRE completo: " + nombre);
          flag = true;
          CUERPO_noticia.resaltar(nombre,"resaltarCLASS_nom");
        }
        if(!flag) {//busqueda de nombre separado
          nombreARR = nombre.split(" ");
          for(var x in nombreARR) {
            if(nombreARR[x].length <= 2) continue;
            console.log("NOMBRE parte: " + nombreARR[x]);
            if(CUERPO_noticia.buscar(nombreARR[x])) {
              flag = true;
              CUERPO_noticia.resaltar(nombreARR[x],"resaltarCLASS_nom");
            }
          }
        }
        let attr = eval("(" + actores[i]["atributos"] + ")");//PARSEO atributos del actor
        for(var i_attr in attr) {
          if(CUERPO_noticia.buscar(attr[i_attr])) {
            flag = true;
            if(window.ARR_atributos === undefined) window.ARR_atributos = [];
            if(window.ARR_atributos[attr[i_attr]] === undefined) {
              window.ARR_atributos[attr[i_attr]] = "";
              $("#noticiaATTR").append("<span class=\"bg-light border rounded p-2 m-2\">" + attr[i_attr] + " <i class=\"fas fa-times-circle text-danger btn-click\" onclick=\"userDATOS.eliminarATTR(this)\"></i></span>");
            }
            CUERPO_noticia.resaltar(attr[i_attr],"resaltarCLASS");
          }
        }
        if(flag) {
          if(window.ARR_actor === undefined) window.ARR_actor = {};
          if(window.ARR_actor[actores[i]["id"]] === undefined)
            window.ARR_actor[actores[i]["id"]] = {"frm_img": "0", "frm_emisor": "0", "frm_descripcion": ""};
        }
      }
      for(var i in instituciones) {
        if(CUERPO_noticia.buscar(instituciones[i]["nombre"])) {
          CUERPO_noticia.resaltar(instituciones[i]["nombre"],"resaltarCLASS_ins");

          if(window.ARR_institucion === undefined) window.ARR_institucion = {};
          if(window.ARR_institucion[instituciones[i]["id"]] === undefined)
            window.ARR_institucion[instituciones[i]["id"]] = {"frm_emisor": "0", "frm_descripcion": ""};
        }
      }
    }
    OBJ["actores"] = window.ARR_actor;
    OBJ["instituciones"] = window.ARR_institucion;
    callback(OBJ);
  }, 0 | Math.random() * 100);
  document.getElementById("div").classList.add("d-none");
}
/**
 * Función para cerrar el modal personalizado
 * Las variables de WINDOW son inicializadas
 */
userDATOS.pantalla_cerrarSIMPLE = function() {
  if(parseInt(window.noticiaSELECCIONADA.elim)) {
    if($("#btn_restaurar").length) $("#btn_restaurar").remove();
  }
  window.noticiaSELECCIONADA = undefined;
  $('#pantalla').addClass('d-none');
  tabla_noticia.rows('.selected').deselect();
  $('#tipo_cuerpo').summernote('destroy');
  $('#tipo_cuerpo').html("");
  $('.body').removeClass('hidden-overflow');
  $("#pantalla").find("*[data-tipo=\"subtitulo\"]").parent().addClass("d-none");
  $("#pantalla").find("*[data-tipo=\"imagen\"]").parent().addClass("d-none");
  $("#pantalla").find("*[data-tipo=\"imagen\"]").attr("src","");
  $("#pantalla").find("*[data-tipo=\"fecha\"]").parent().addClass("d-none");
  $("#pantalla").find("*[data-tipo=\"fecha\"]").html("");
  $("#pantalla").find("*[data-tipo=\"url\"]").parent().addClass("d-none");
  $("#pantalla").find("*[data-tipo=\"url\"]").html("");
}
userDATOS.pantalla_cerrar = function() {
  if(window.showNOTICIA || window.noticiaSELECCIONADAeditar !== undefined) {
    if(window.noticiaSELECCIONADA === undefined) {
      $.MessageBox({
    		buttonDone  : strings.btn.si,
    		buttonFail  : strings.btn.no,
    		message   : strings.noticia.cerrar[0]
    	}).done(function(){
        userDATOS.pantalla_OFF();
    	}).fail(function(){});
    } else {
      $.MessageBox({
    		buttonDone  : strings.btn.si,
    		buttonFail  : strings.btn.no,
    		message   : strings.noticia.cerrar[1]
    	}).done(function(){
        if(window.noticiaSELECCIONADAeditar === undefined)
          userDATOS.change(noticiaSELECCIONADA.id,"noticia","estado",0, true);//CAMBIO estado
        else
          userDATOS.change(noticiaSELECCIONADA.id,"noticia","estado",2, true);//CAMBIO estado para noticias procesadas
        userDATOS.pantalla_OFF();
    	}).fail(function(){});
    }
  } else {
    if(window.noticiaSELECCIONADA !== undefined)
      userDATOS.pantalla_OFF();
    else {
      let flag_variables = true;
      if($("#frm_titulo").text() != "" || $("*[name='frm_fecha']").val() != "" ||
          $("*[name='frm_autor']").val() != "" || $("#select_medio").val() != "" ||
          $("#select_destaque").val() != "" || $(".note-editable").text() != "" ||
          window.ARR_cliente !== undefined)
        flag_variables = false;
      if(flag_variables) userDATOS.pantalla_OFF();
      else {
        $.MessageBox({
      		buttonDone  : strings.btn.si,
      		buttonFail  : strings.btn.no,
      		message   : strings.noticia.cerrar[2]
      	}).done(function(){
          userDATOS.pantalla_OFF();
        });
      }
    }
  }
}
userDATOS.pantalla_OFF = function(reload = 0) {
  if($(".etiquetas h2").find("button").length) {
    if(window.noticiaSELECCIONADAeditar !== undefined) window.noticiaSELECCIONADAeditar = undefined;
    $(".etiquetas h2 button").remove();
  }
  if(window.noticiaSELECCIONADA !== undefined) window.noticiaSELECCIONADA = undefined
  if(window.ARR_actor !== undefined) window.ARR_actor = undefined;
  if(window.ARR_tema !== undefined) window.ARR_tema = undefined;
  if(window.ARR_cliente !== undefined) window.ARR_cliente = undefined;
  if(window.ARR_institucion !== undefined) window.ARR_institucion = undefined;
  if(window.ARR_atributos !== undefined) window.ARR_atributos = undefined;
  if(window.ATTR !== undefined) window.ATTR = undefined;

  tabla_noticia.rows('.selected').deselect();
  $(".has-error").removeClass("has-error");
  $(".note-editable").html("");
  $('#tipo_cuerpo').summernote('destroy');
  $('#tipo_cuerpo').html("");

  $("#select_periodista").closest(".input-group").addClass("d-none");
  $("#select_periodista").closest(".input-group").removeClass("d-flex");
  $("#select_seccion").closest(".input-group").addClass("d-flex");
  $("#select_seccion").closest(".input-group").removeClass("d-none");
  $("*[name='frm_fecha']").val("")
  $("#pantalla").find("*[data-tipo=\"subtitulo\"],*[data-tipo=\"imagen\"],*[data-tipo=\"fecha\"],*[data-tipo=\"url\"]").parent().addClass("d-none");
  $("#pantalla").find("*[data-tipo=\"imagen\"]").attr("src","");
  $("#pantalla").find("*[data-tipo=\"fecha\"],*[data-tipo=\"url\"]").html("");
  $('#noticiaATTR').html("");
  $('#pantalla,#url_noticia,#fecha_noticia').addClass('d-none');
  $("#video_noticia").addClass("d-none");
  $("#video_noticia").find("div").html("")
  $('#btn_eliminar,#btn_procesar,#btn_guardar,#btn_actor,#btn_cliente,#form_ATTR').removeClass('d-none');
  $('.body').removeClass('hidden-overflow');

  $("#noticia-detalle").addClass("d-none");
  $("#noticia-detalle").find("> div div").html("")

  $('#select_medio,#select_medioAlcance').attr("disabled",true);
  $("#periodista_noticia,#url_noticia").find("div").html("");

  $("#pantalla").find("select.select__2").val("").trigger("change");
  $("#pantalla").find("select.select__2").removeAttr("disabled")
  $("#pantalla").find("select.select__2").select2();
}

userDATOS.pantalla_ON = function() {
  let html = $("#pantalla");
  let body_span = $(".body");
  tabla_noticia.rows('.selected').deselect();
  //document.getElementById('btn_procesar').classList.add('d-none');
  $("#btn_eliminar").addClass('d-none');
  $("#select_periodista").closest(".input-group").removeClass("d-none");
  $("#select_periodista").closest(".input-group").addClass("d-flex");
  $("#select_seccion").closest(".input-group").addClass("d-flex");
  $("#select_seccion").closest(".input-group").removeClass("d-none");

  $("#fecha_noticia,#periodista_noticia,#url_noticia").removeClass("d-none");
  $("#video_noticia").removeClass("d-none");
  $("#video_noticia").find("div").html("<input placeholder='Link de video' name='frm_video' type='text' class='form-control' />");

  html.find("*[data-tipo=\"imagen\"]").parent().addClass("d-none");
  html.find("*[data-tipo=\"subtitulo\"],*[data-tipo=\"fecha\"]").parent().removeClass("d-none");

  $('#select_medio').removeAttr("disabled");
  html.find(".select__2").select2({width: 'resolve'})

  html.find("*[data-tipo=\"titulo\"]").html("<div id='frm_titulo' class='form-noticia' contenteditable='true'></div>");
  html.find("*[data-tipo=\"subtitulo\"]").html("<div id='frm_subtitulo' class='form-noticia' contenteditable='true'></div>");
  $("#periodista_noticia").addClass("d-none");
  html.find("*[data-tipo=\"fecha\"]").html("<input placeholder='Fecha' required='true' name='frm_fecha' type='datetime-local' class='form-noticia' />");
  $("#url_noticia").find("div").html("<input placeholder='URL' name='frm_url' type='text' class='form-control' />");
  html.find("*[data-tipo=\"cuerpo\"]").html("");
  $('#tipo_cuerpo').summernote({
    toolbar: false,
    airMode: false,
    dialogsInBody: false,
    placeholder: 'Texto de noticia',
    popover: {
      image: [],
      link: [],
      air: []
    },
    height: 350,
  });

  html.removeClass("d-none");
  body_span.addClass("hidden-overflow");
}

//--- USUARIO
userDATOS.bloquearUsuario = function(tabla,OBJ_pyrus) {
	let row = tabla_0.rows( { selected: true } ).data()[0];
  let o = null;
  userDATOS.busqueda({"value": row.id,"tabla":"usuario"},function(d) {
    o = d;
  });
  $.MessageBox({
    buttonDone  : strings.btn.si,
    buttonFail  : strings.btn.no,
    message   : strings.usuario.cambio(o.activo,row.user),
  }).done(function(){
    userDATOS.log(window.user_id,"Cambio de Estado de Usuario: " + o.user,0,o.id,"usuario");
    o.activo = (o.activo == "1" ? "0" : "1");
    OBJ_pyrus.guardar_1(o);
    
    tabla.draw();
  });
}
// ---------------> VISTA PROCESAR Y PROCESADAS

/**
 * Función para cancelar apertura de noticias. reestablece valores
 * REVISAR ESTO
 */
userDATOS.cancelarApertura = function() {
  if(window.noticiaSELECCIONADA !== undefined) {
    if(parseInt(window.noticiaSELECCIONADA.estado) == 0) userDATOS.change(window.noticiaSELECCIONADA.id,"noticia","estado",0);
    $("#div_img").removeClass("d-flex").addClass("d-none");
    window.noticiaSELECCIONADA = undefined;
  }
}
/** ---> REVISAR */
/**
 * Función para verificar que actor sea único
 * Actualizado
 * @param e objeto select
 * @param i indice unico
 */
userDATOS.actorUnico = function(e,i) {
  let table = $("#modal-table-actor");
  let select = $(e);
  let tr = select.closest("tr");
  let value = select.val();
  if(window.ARR_actor === undefined) window.ARR_actor = {};
  if(select.val() != "") {
    if(window.ARR_actor[select.val()] === undefined) {
      if(table.find(".actorActive").length) table.find(".actorActive").removeClass("actorActive");
      select.addClass("actorActive");
      table.find("td:nth-child(2) select:not(.actorActive) option[value='" + value + "']").attr("disabled",true);

      window.ARR_actor[value] = {}
      window.ARR_actor[value]["frm_emisor"] = null;
      window.ARR_actor[value]["frm_img"] = null;
      window.ARR_actor[value]["frm_valor"] = null;

      for(var i in window.ARR_actor) {
        if(!table.find("td:nth-child(2) select option:selected[value='" + i + "']").length) {
          table.find("td:nth-child(2) select option:disabled[value='" + i + "']").removeAttr("disabled");
          delete window.ARR_actor[i];
        }
      }
      
      table.find("td:nth-child(2) select").select2();
    }
    tr.find("td:last-child() input").removeAttr("disabled");
    tr.find("td:last-child() .btn-group label").removeClass("bg-light disabled");
    tr.find("td:last-child() .btn-group label:first-child()").addClass("bg-success");
    tr.find("td:last-child() .btn-group label:nth-child(2)").addClass("bg-warning");
    tr.find("td:last-child() .btn-group label:last-child()").addClass("bg-danger");
  } else {
    tr.find("td:last-child() input").attr("disabled",true);
    tr.find("td:last-child() .btn-group label").addClass("bg-light disabled");
    tr.find("td:last-child() .btn-group label:first-child()").removeClass("bg-success");
    tr.find("td:last-child() .btn-group label:nth-child(2)").removeClass("bg-warning");
    tr.find("td:last-child() .btn-group label:last-child()").removeClass("bg-danger");
    for(var i in window.ARR_actor) {
      if(!table.find("td:nth-child(2) select option:selected[value='" + i + "']").length) {
        table.find("td:nth-child(2) select option:disabled[value='" + i + "']").removeAttr("disabled");
        table.find("td:nth-child(2) select option:disabled[value='" + i + "']").parent().select2();
        delete window.ARR_actor[i];
      }
    }
  }
}
/**
 * Función para verificar que una institución sea única
 * Actualizado
 */
userDATOS.institucionUnico = function(e) {
  let table = $("#modal-table-institucion");
  let select = $(e);
  let value = select.val();
  let tr = select.closest("tr");

  if(window.ARR_institucion === undefined) window.ARR_institucion = {};
  if(value != "") {
    if(window.ARR_institucion[value] === undefined) {
      if(table.find(".institucionActive").length) table.find(".institucionActive").removeClass("institucionActive");
      select.addClass("institucionActive");
      table.find("td:nth-child(2) select:not(.institucionActive) option[value='" + value + "']").attr("disabled",true);

      window.ARR_institucion[value] = {}
      window.ARR_institucion[value]["frm_emisor"] = null;
      window.ARR_institucion[value]["frm_valor"] = null;
      // SACO opción de los selects
      table.find("td:nth-child(2) select").select2();
      
      for(var i in window.ARR_institucion) {
        if(!table.find("td:nth-child(2) select option:selected[value='" + i + "']").length) {
          table.find("td:nth-child(2) select option:disabled[value='" + i + "']").removeAttr("disabled");
          table.find("td:nth-child(2) select option:disabled[value='" + i + "']").parent().select2();
          console.log(window.ARR_institucion[i])
          delete window.ARR_institucion[i];
        }
      }
    }
    tr.find("td:last-child() input").removeAttr("disabled");
    tr.find("td:last-child() .btn-group label").removeClass("bg-light disabled");
    tr.find("td:last-child() .btn-group label:first-child()").addClass("bg-success");
    tr.find("td:last-child() .btn-group label:nth-child(2)").addClass("bg-warning");
    tr.find("td:last-child() .btn-group label:last-child()").addClass("bg-danger");
  } else {
    tr.find("td:last-child() input").attr("disabled",true);
    tr.find("td:last-child() .btn-group label").addClass("bg-light disabled");
    tr.find("td:last-child() .btn-group label:first-child()").removeClass("bg-success");
    tr.find("td:last-child() .btn-group label:nth-child(2)").removeClass("bg-warning");
    tr.find("td:last-child() .btn-group label:last-child()").removeClass("bg-danger");
    for(var i in window.ARR_institucion) {
      if(!table.find("td:nth-child(2) select option:selected[value='" + i + "']").length) {
        table.find("td:nth-child(2) select option:disabled[value='" + i + "']").removeAttr("disabled");
        table.find("td:nth-child(2) select option:disabled[value='" + i + "']").parent().select2();
        delete window.ARR_institucion[i];
      }
    }
  }
}
/**
  * Función para agregar temas a una unidad / agenda
  * Actualizado
  * @param e objeto select
  * @param id del cliente
  */
userDATOS.temaUnico = function(e,id) {
  let table = $("#modal-table-temas");
  let select = $(e);
  let tr = select.closest("tr");
  let value = select.val();
  if(value != "") {
    tr.find("td:last-child() input").removeAttr("disabled");
    tr.find("td:last-child() label").removeClass("bg-light disabled");
    tr.find("td:last-child() label:first-child()").addClass("bg-success");
    tr.find("td:last-child() label:nth-child(2)").addClass("bg-warning");
    tr.find("td:last-child() label:last-child()").addClass("bg-danger");
    
    if(table.find(".temaActive").length) table.find(".temaActive").removeClass("temaActive");
    select.addClass("temaActive");
    if(window.ARR_cliente[id]["tema"]["frm_tema_" + value] === undefined) {
      window.ARR_cliente[id]["tema"]["frm_tema_" + value] = null;
      table.find("td:nth-child(2) select:not(.temaActive)").find("option[value='" + value + "']").attr("disabled",true);
      
      for(var i in window.ARR_cliente[id]["tema"]) {
        if(i == "texto") continue;
        id_tema = i.substring(9);
        if(!table.find("td:nth-child(2) select option:selected[value='" + id_tema + "']").length) {
          table.find("td:nth-child(2) select option:disabled[value='" + id_tema + "']").removeAttr("disabled");
          delete window.ARR_cliente[id]["tema"][i];
        }
      }

      table.find("td:nth-child(2) select").select2();
    }
  } else {
    tr.find("td:last-child() input").attr("disabled",true);
    tr.find("td:last-child() label").addClass("bg-light disabled");
    tr.find("td:last-child() label:first-child()").removeClass("bg-success");
    tr.find("td:last-child() label:nth-child(2)").removeClass("bg-warning");
    tr.find("td:last-child() label:last-child()").removeClass("bg-danger");
    select.removeClass("temaActive");

    for(var i in window.ARR_cliente[id]["tema"]) {
      if(i == "texto") continue;
      id_tema = i.substring(9);
      if(!table.find("td:nth-child(2) select option:selected[value='" + id_tema + "']").length) {
        table.find("td:nth-child(2) select option:disabled[value='" + id_tema + "']").removeAttr("disabled");
        table.find("td:nth-child(2) select option:disabled[value='" + id_tema + "']").parent().select2();
        delete window.ARR_cliente[id]["tema"][i];
      }
    }
  }
}
/**
 * Función para agregar unidad / agenda
 * Actualizado
 */
userDATOS.unidadUnico = function(e) {
  let table = $("#modal-table-unidad");
  let select = $(e);
  let value = select.val();
  if(window.ARR_cliente === undefined) window.ARR_cliente = {};
  if(value != "") {
    if(table.find(".unidadActive").length) table.find(".unidadActive").removeClass("unidadActive");
    select.addClass("unidadActive");
    select.closest("tr").find("td:last-child() button").removeAttr("disabled");
    if(window.ARR_cliente[value] === undefined) {
      window.ARR_cliente[value] = {}
      window.ARR_cliente[value]["valoracion"] = null;
      window.ARR_cliente[value]["tema"] = {};
      window.ARR_cliente[value]["tema"]["texto"] = ""

      for(var i in window.ARR_cliente) {
        if(!table.find("td:nth-child(2) select option:selected[value='" + i + "']").length) {
          table.find("td:nth-child(2) select option:disabled[value='" + i + "']").removeAttr("disabled");
          delete window.ARR_cliente[i];
        }
      }

      table.find("td:nth-child(2) select:not(.unidadActive)")
        .find("option[value='" + value + "']").attr("disabled",true);
      
      // SACO opción de los selects
      table.find("td:nth-child(2) select").select2();
    }
  } else {
    select.removeClass("unidadActive");
    select.closest("tr").find("td:last-child() button").attr("disabled",true);
    for(var i in window.ARR_cliente) {
      if(!table.find("td:nth-child(2) select option:selected[value='" + i + "']").length) {
        table.find("td:nth-child(2) select option:disabled[value='" + i + "']").removeAttr("disabled");
        table.find("td:nth-child(2) select option:disabled[value='" + i + "']").parent().select2();
        delete window.ARR_cliente[i];
      }
    }
  }
}
/**
 * Función para agregar Actor
 * Actualizado
 */
userDATOS.addActor = function() {
  let t = $("#modal-table-actor");
  if(window.index_actor === undefined) window.index_actor = 1;
  window.index_actor ++;
  $( "#modal-table-actor tbody tr:first-child" ).find("select").select2("destroy")
  tr = $( "#modal-table-actor tbody tr:first-child" ).clone();
  $( "#modal-table-actor tbody tr:first-child" ).find("select").select2();

  tr[0].children[1].children[0].name = "frm_actor-" + window.index_actor;
  //<checkbox>
  tr[0].children[2].children[0].children[0].children[0].children[0].name = "frm_img-" + window.index_actor;
  tr[0].children[2].children[0].children[0].children[1].children[0].name = "frm_emisor-" + window.index_actor;
  //</checkbox>
  tr[0].children[2].children[0].children[1].children[1].children[0].name = "frm_valor-" + window.index_actor;
  tr[0].children[2].children[0].children[1].children[1].children[0].name = "frm_valor-" + window.index_actor;
  tr[0].children[2].children[0].children[1].children[2].children[0].name = "frm_valor-" + window.index_actor;

  tr[0].classList.remove("d-none");//SACO clase

  $( "#modal-table-actor tbody" ).append(tr);
  $( "#modal-table-actor tbody tr:last-child" ).find("select").select2();

  for(var i in window.ARR_actor) {
    $( "#modal-table-actor tbody tr:last-child td:nth-child(2) select option[value='" + i + "']").attr("disabled",true);
  }
}
/**
 * Función para agregar una institución en la noticia
 * Actualizado
 */
userDATOS.addInstitucion = function() {
  let table = $("#modal-table-institucion");
  if(window.index_institucion === undefined) window.index_institucion = 1;
  window.index_institucion ++;

  $( "#modal-table-institucion tbody tr:first-child" ).find("select").select2("destroy")
  tr = $( "#modal-table-institucion tbody tr:first-child" ).clone();
  $( "#modal-table-institucion tbody tr:first-child" ).find("select").select2();
  
  tr[0].children[1].children[0].name = "frm_institucion-" + window.index_institucion;
  //<checkbox>
  tr[0].children[2].children[0].children[0].children[0].children[0].name = "frm_emisor-" + window.index_institucion;
  //</checkbox>
  tr[0].children[2].children[0].children[1].children[1].children[0].name = "frm_valor-" + window.index_institucion;
  tr[0].children[2].children[0].children[1].children[1].children[0].name = "frm_valor-" + window.index_institucion;
  tr[0].children[2].children[0].children[1].children[2].children[0].name = "frm_valor-" + window.index_institucion;

  tr[0].classList.remove("d-none");//SACO clase

  $( "#modal-table-institucion tbody" ).append(tr);
  $( "#modal-table-institucion tbody tr:last-child" ).find("select").select2();

  for(var i in window.ARR_institucion) {
    $( "#modal-table-institucion tbody tr:last-child td:nth-child(2) select option[value='" + i + "']").attr("disabled",true);
  }
}
/**
 * Función para agregar temas a una unidad / agenda
 * @param id del cliente
 * Actualizado
 */
userDATOS.addTema = function(id) {
  if(window.index_tema === undefined) window.index_tema = {};
  if(window.index_tema[id] === undefined) window.index_tema[id] = 1;
  window.index_tema[id] ++;
  $( "#modal-table-temas tbody tr:first-child" ).find("select").select2("destroy")
  tr = $( "#modal-table-temas tbody tr:first-child" ).clone();
  $( "#modal-table-temas tbody tr:first-child" ).find("select").select2();

  tr[0].children[1].children[0].name = "frm_tema-" + window.index_tema[id];

  tr[0].children[2].children[0].children[0].children[0].name = "frm_valor-" + window.index_tema[id];
  tr[0].children[2].children[0].children[1].children[0].name = "frm_valor-" + window.index_tema[id];
  tr[0].children[2].children[0].children[2].children[0].name = "frm_valor-" + window.index_tema[id];

  tr[0].classList.remove("d-none");//SACO clase

  $( "#modal-table-temas tbody" ).append(tr);
  $( "#modal-table-temas tbody tr:last-child" ).find("select").select2();

  for(var i in window.ARR_cliente[id]["tema"]) {
    if(i == "texto") continue;
    id_tema = i.substring(9);
    $( "#modal-table-temas tbody tr:last-child td:nth-child(2) select option[value='" + id_tema + "']").attr("disabled",true);
  }
}
/**
 * Función para agregar unidad / agenda
 * Actualizado
 */
userDATOS.addUnidad = function() {
  if(window.index_cliente === undefined) window.index_cliente = 1;
  window.index_cliente ++;
  $( "#modal-table-unidad tbody tr:first-child" ).find("select").select2("destroy")
  data = $( "#modal-table-unidad tbody tr:first-child" ).clone();
  $( "#modal-table-unidad tbody tr:first-child" ).find("select").select2();

  data[0].children[1].children[0].name = "frm_cliente-" + window.index_cliente;
  data[0].children[1].children[0].id = "frm_cliente-" + window.index_cliente;
  data[0].classList.remove("d-none");//SACO clase

  $( "#modal-table-unidad tbody" ).append(data);
  for(var i in window.ARR_cliente) {
    $( "#modal-table-unidad tbody tr:last-child td:nth-child(2) select option[value='" + i + "']").attr("disabled",true);
  }
  $( "#modal-table-unidad tbody tr:last-child" ).find("select").select2();
}
/**
 * Función para eliminar actores
 * Actualizado
 */
userDATOS.removeActor = function(e) {
  let table = $("#modal-table-actor");
  let button = $(e);
  let tr = button.closest("tr");
  let value = tr.find("select").val();
  if(value == "") {
    tr.remove();
    return false;
  }
  $.MessageBox({
    buttonDone  : strings.btn.si,
    buttonFail  : strings.btn.no,
    message   : strings.eliminar.actor
  }).done(function(){
    if(value != "") {
      delete window.ARR_actor[value];
      table.find("td:nth-child(2) select option[value='" + value + "']").removeAttr("disabled");
      table.find("td:nth-child(2) select").select2();
    }
    if(table.find("tr").length == 1)
      userDATOS.addActor();
    tr.remove();
  });
}
/**
 * Función para eliminar instituciones
 * Actualizado
 */
userDATOS.removeInstitucion = function(e) {
  let table = $("#modal-table-institucion");
  let button = $(e);
  let tr = button.closest("tr");
  let value = tr.find("select").val();

  if(value == "") {
    tr.remove();
    return false;
  }
  $.MessageBox({
    buttonDone  : strings.btn.si,
    buttonFail  : strings.btn.no,
    message   : strings.eliminar.institucion
  }).done(function(){
    if(value != "") {
      delete window.ARR_institucion[value];
      table.find("td:nth-child(2) select option[value='" + value + "']").removeAttr("disabled");
      table.find("td:nth-child(2) select").select2();
    }
    if(table.find("tr").length == 1)
      userDATOS.addInstitucion();
    tr.remove();
  });
}

/**
 * Función para eliminar Unidad / Agenda
 * Actualizado
 */
userDATOS.removeUnidad = function(e) {
  let table = $("#modal-table-unidad");
  let button = $(e);
  let tr = button.closest("tr");
  let value = tr.find("td:nth-child(2) select").val();
  if(value == "") {
    if(table.find("tr").length == 1)
    userDATOS.addUnidad();
    tr.remove();
    return false;
  }
  $.MessageBox({
    buttonDone  : strings.btn.si,
    buttonFail  : strings.btn.no,
    message   : strings.eliminar.unidad
  }).done(function(){
    if(value != "") {
      delete window.ARR_cliente[value];
      table.find("td:nth-child(2) select option[value='" + value + "']").removeAttr("disabled");
      table.find("td:nth-child(2) select").select2();
    }
    if(table.find("tr").length == 1)
      userDATOS.addUnidad();
    tr.remove();
  });
}
/**
 * Función para eliminar temas
 * Actualizado
 */
userDATOS.removeTemas = function(e,id) {
  let table = $("#modal-table-temas tbody");
  let button = $(e);
  let tr = button.closest("tr");
  let value = tr.find("td:nth-child(2) select").val();
  if(value == "") {
    delete window.ARR_cliente[id]["tema"]["frm_tema_" + value]
    table.find("td:nth-child(2) select option[value='" + value + "']").removeAttr("disabled");
    table.find("td:nth-child(2) select").select2();
    if(table.find("tr").length == 1)
      userDATOS.addTema(id);
    tr.remove();
    return false;
  }
  $.MessageBox({
    buttonDone  : strings.btn.si,
    buttonFail  : strings.btn.no,
    message   : strings.eliminar.tema
  }).done(function(){
    delete window.ARR_cliente[id]["tema"]["frm_tema_" + value]
    table.find("td:nth-child(2) select option[value='" + value + "']").removeAttr("disabled");
    table.find("td:nth-child(2) select").select2();
    if(table.find("tr").length == 1)
      userDATOS.addTema(id);
    tr.remove();
  });
}
/**
 * Función para limpiar lateral
 * Actualizado
 */
userDATOS.closeUnidad = function(e) {
  let html = "<div class='align-self-center text-center text-uppercase w-100'>Seleccione unidad<i class='ml-2 fas fa-edit'></i></div>";
  let table = $("#modal-table-unidad");
  let button = $(e);
  let id = button.closest("tr").find("select:disabled").val()
  let boolTemas = true;
  let bool = true;
  $("#headingOne").click();
  setTimeout(function() {
    if(Object.keys(window.ARR_cliente[id]["tema"]).length > 1) {
      for(var i in window.ARR_cliente[id]["tema"]) {
        if(i == "texto") continue;
        if(window.ARR_cliente[id]["tema"][i] === null) {
          boolTemas = false;
          break;
        }
      }
    }
    if(window.limpiarUnidad == undefined) {
      if(userDATOS.validar("#accordionExample",false,false) == 1 && boolTemas) bool = true;
      else bool = false;
    }
    if(window.vista == "procesadas") {
      if(window.noticiaSELECCIONADAeditar === undefined)
        bool = true
    }
    if( bool ) {
      if(window.vista == "procesar" || (window.vista == "procesadas" && (window.noticiaSELECCIONADAeditar !== undefined)))
        button.closest("tr").find("td:nth-child(2) select").removeAttr("disabled");
      button.closest("tr").find("td:nth-child(2) select").select2();
      let id = button.closest("tr").find("td:nth-child(2) select").val();

      button.closest(".modal-container").find("> .row > div:last-child()").html(html);
      button.removeClass("bg-warning text-black").addClass("bg-success").find("i").removeClass("fa-angle-left").addClass("fa-angle-right");
      button.attr("onclick","userDATOS.updateUnidad(this);");
    } else userDATOS.notificacion("Complete los datos necesarios [VALORACIONES y TEMAS]","error",false);
  },500);
}
/**
 * Función para los diferentes tipos de datos en actor
 * @param tipo INT: 0 -> imagen/emisor // 1 -> valoración
 */
userDATOS.optionActor = function(e,tipo) {
  let table = $("#modal-table-actor");
  let input = $(e);
  let tr = input.closest("tr");
  let value = tr.find("select").val();

  imagenTR = tr.find("td:last-child() > div > div:first-child label:first-child()")[0];
  imagen = (imagenTR.children[0].checked ? 1 : 0);

  emisorTR = tr.find("td:last-child() > div > div:first-child label:last-child()")[0];
  emisor = (emisorTR.children[0].checked ? 1 : 0);

  valoracionTR = tr.find("td:last-child() > div > div:last-child");
  valoracion = $(valoracionTR).find("input:checked").val();

  window.ARR_actor[value]["frm_emisor"] = emisor;
  window.ARR_actor[value]["frm_img"] = imagen;
  window.ARR_actor[value]["frm_valor"] = valoracion;
}
/**
 * Función para los diferentes tipos de datos en institución
 * @param tipo INT: 0 -> imagen/emisor // 1 -> valoración
 */
userDATOS.optionInstitucion = function(e,tipo) {
  let table = $("#modal-table-institucion");
  let input = $(e);
  let tr = input.closest("tr");
  let value = tr.find("select").val();

  emisorTR = tr.find("td:last-child() > div > div:first-child label")[0];
  emisor = (emisorTR.children[0].checked ? 1 : 0);
  console.log(emisor)

  valoracionTR = tr.find("td:last-child() > div > div:last-child");
  valoracion = $(valoracionTR).find("input:checked").val();

  window.ARR_institucion[value]["frm_emisor"] = emisor;
  window.ARR_institucion[value]["frm_valor"] = valoracion;
}
/**
 * Función para modificar datos de la Unidad / Agenda
 * Contiene las 2 partes: Valoración y temas
 * Actualizado
 */
userDATOS.updateUnidad = function(e) {
  let table = $("#modal-table-unidad");
  let button = $(e);
  let id = button.closest("tr").find("td:nth-child(2) select").val();
  let OBJ_p = new Pyrus();
  let optionDatos = "";
  let valoracion = null;

  window.limpiarUnidad = undefined;
  if(window.vista == "procesar" || (window.vista == "procesada" && window.noticiaSELECCIONADAeditar !== undefined)) {
    if(table.find("select:disabled").length) {
      table.find("select:disabled").closest("tr").addClass("bg-warning");
      userDATOS.notificacion("Cierre primero la unidad / agenda o limpie el elemento");
      setTimeout(function() {
        table.find("select:disabled").closest("tr").removeClass("bg-warning");
      },1500)
      return false;
    }
  }

  button.closest("tr").find("td:nth-child(2) select").attr("disabled",true);
  button.closest("tr").find("td:nth-child(2) select").select2();

  html = "";btn = "";
  if(window.ARR_cliente[id]["tema"] === null) window.ARR_cliente[id]["tema"] = {}
  if(window.ARR_cliente[id]["valoracion"] === null) window.ARR_cliente[id]["valoracion"] = {}
  let calificacionesBD = null;
  userDATOS.busquedaTabla("calificacion",function(d) {
    calificacionesBD = d;
  });
  calificaciones = {}
  for(var i in calificacionesBD) {
  	c = calificacionesBD[i];
  	if(calificaciones[c.co] === undefined) calificaciones[c.co] = [];
    calificaciones[c.co].push({id:c.id,nombre:c.nombre,valor:c.valor})
  }
  
  for(var i in window.ARR_cliente[id]["valoracion"]) {
    if(valoracion === null) valoracion = 0;
    valoracion += window.ARR_cliente[id]["valoracion"][i]
    if(window.ARR_cliente[id]["valoracion"][i] === null)
      valoracion = null
  }
  html += '<div class="w-100">';
    html += '<div class="accordion" id="accordionExample">';
      html += '<div class="card">';
        html += '<div class="card-header px-2 py-1 cursor-pointer" id="headingOne" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">';
          html += '<h5 class="mb-0 text-uppercase">Valoración</h5>';
        html += '</div>';

        html += '<div id="collapseOne" class="collapse show" aria-labelledby="headingOne" data-parent="#accordionExample">';
          html += '<div class="card-body p-0">';
            html += '<div class="w-100">';
              html += '<div class="row">';
                html += '<div class="col-12" id="div_valoracion">';
                  if(valoracion === null)
                    html += '<div class="bg-dark text-white p-2 text-center text-uppercase">sin acción</div>';
                  else if(valoracion > 0)
                    html += '<div class="bg-success text-white p-2 text-center text-uppercase">positivo</div>';
                  else if(valoracion == 0)
                    html += '<div class="bg-warning text-dark p-2 text-center text-uppercase">neutro</div>'
                  else  
                    html += '<div class="bg-danger p-2 text-center text-white text-uppercase">negativo</div>'
                html += '</div>';
              html += '</div>';
              html += '<div class="scrolling-wrapper-flexbox bg-info">';
                for(var i in calificaciones[0]) {
                  optionDatos = "<option value=''></option>";
                  optionDatos += "<option value='1'>Favor</option>";
                  optionDatos += "<option value='2'>Neutro</option>";
                  optionDatos += "<option value='3'>Contra</option>";
                  if(window.ARR_cliente[id]["valoracion"]["frm_" + calificaciones[0][i]["id"]] === undefined) {
                    window.ARR_cliente[id]["valoracion"]["frm_" + calificaciones[0][i]["id"]] = null;
                    html += '<div class="card bg-white rounded-0 w-50" >';
                      html += '<div class="card-body">';
                        html += '<h5 class="card-title">' + calificaciones[0][i]["nombre"] + '</h5>';
                        html += '<div class="d-flex" title="' + calificaciones[0][i]["nombre"] + ' (' + calificaciones[0][i]["valor"] + ')' + '">';
                          html += "<select data-placeholder='" + calificaciones[0][i]["nombre"] + ' (' + calificaciones[0][i]["valor"] + ')' + "' required='true' name='frm_"  + calificaciones[0][i]["id"] + "' class='form-control select__2 select-valor w-100' onchange='userDATOS.calcularValoracion(this," + calificaciones[0][i]["valor"] + ",\"" + calificaciones[0][i]["id"] + "\",\"" + id + "\")'>";
                            html += optionDatos;
                          html += "</select>";
                        html += '</div>';
                      html += '</div>';
                    html += '</div>';
                  } else {
                    optionDatos = "<option value=''></option>";
                    optionDatos += "<option value='1' " + (window.ARR_cliente[id]["valoracion"]["frm_" + calificaciones[0][i]["id"]] > 0 ? "selected='true'" : "") + ">Favor</option>";
                    optionDatos += "<option value='2' " + (window.ARR_cliente[id]["valoracion"]["frm_" + calificaciones[0][i]["id"]] == 0 ? "selected='true'" : "") + ">Neutro</option>";
                    optionDatos += "<option value='3' " + (window.ARR_cliente[id]["valoracion"]["frm_" + calificaciones[0][i]["id"]] < 0 ? "selected='true'" : "") + ">Contra</option>";
                    html += '<div class="card bg-white rounded-0 w-50" >';
                      html += '<div class="card-body">';
                        html += '<h5 class="card-title">' + calificaciones[0][i]["nombre"] + '</h5>';
                        html += '<div class="d-flex" title="' + calificaciones[0][i]["nombre"] + ' (' + calificaciones[0][i]["valor"] + ')' + '">';
                          html += "<select data-placeholder='" + calificaciones[0][i]["nombre"] + ' (' + calificaciones[0][i]["valor"] + ')' + "' required='true' name='frm_"  + calificaciones[0][i]["id"] + "' class='form-control select__2 select-valor w-100' onchange='userDATOS.calcularValoracion(this," + calificaciones[0][i]["valor"] + ",\"" + calificaciones[0][i]["id"] + "\",\"" + id + "\")'>";
                            html += optionDatos;
                          html += "</select>";
                        html += '</div>';
                      html += '</div>';
                    html += '</div>';
                  }
                }
                window["calificaciones"] = calificaciones;
                imgVid = null;
                optionDatos = "<option value=''></option>";
                optionDatos += "<option value='1'>Favor</option>";
                optionDatos += "<option value='2'>Neutro</option>";
                optionDatos += "<option value='3'>Contra</option>";
                html += '<div class="card bg-white rounded-0 w-100">';
                  html += '<div class="card-body">';
                    html += '<h5 class="card-title">';
                      html += '<select onchange="userDATOS.calcularValoracion(this,-1,1,' + id + ')" id="frm_imagen" class="form-control select__2 w-100" required="true">';
                        for(var x in calificaciones[1]) {
                          if(window.ARR_cliente[id]["valoracion"]["frm_" + calificaciones[1][x]["id"]] !== undefined) {
                            imgVid = calificaciones[1][x]["id"];
                            html += '<option selected value="' + calificaciones[1][x]["id"] + '">' + calificaciones[1][x]["nombre"] + ' (' + calificaciones[1][x]["valor"] + ')</option>';
                          } else
                            html += '<option value="' + calificaciones[1][x]["id"] + '">' + calificaciones[1][x]["nombre"] + ' (' + calificaciones[1][x]["valor"] + ')</option>';
                        }
                      html += '</select>';
                    html += '</h5>';
                    if(window.ARR_cliente[id]["valoracion"]["frm_" + imgVid] !== undefined) {
                      optionDatos = "<option value=''></option>";
                      optionDatos += "<option value='1' " + (window.ARR_cliente[id]["valoracion"]["frm_" + imgVid] > 0 ? "selected='true'" : "") + ">Favor</option>";
                      optionDatos += "<option value='2' " + (window.ARR_cliente[id]["valoracion"]["frm_" + imgVid] == 0 ? "selected='true'" : "") + ">Neutro</option>";
                      optionDatos += "<option value='3' " + (window.ARR_cliente[id]["valoracion"]["frm_" + imgVid] < 0 ? "selected='true'" : "") + ">Contra</option>";
                    }
                    html += "<select data-placeholder='Seleccione' required='true' id='frm_valor_imagen' class='form-control select__2 select-valor w-100' onchange='userDATOS.calcularValoracion(this,-1,1," + id + ")'>";
                      html += optionDatos;
                    html += "</select>";
                  html += '</div>';
                html += '</div>';
                
              html += '</div>';
            html += '</div>';
          html += '</div>';
        html += '</div>';
      html += '</div>';
      /** ELEMENTOS DE TEMAS */
      selectTemas = "";
      selectTemas += "<option value=''></option>";
      let temas = null;
      userDATOS.busquedaTabla("attr_temas",function(d) {
        temas = d;
      });
      for(var i in temas)
        selectTemas += "<option value='" + i + "'>" + temas[i]["nombre"] + "</option>";
      selectTemas += "</select>";
      option = '<div class="btn-group" role="group" aria-label="Basic example">'
        option += '<label class="mb-0 btn bg-light disabled"><input disabled="true" onchange="userDATOS.optionTema(this);" type="radio" name="frm_valor-1" value="1" /></label>';
        option += '<label class="mb-0 btn bg-light disabled"><input disabled="true" onchange="userDATOS.optionTema(this);" type="radio" name="frm_valor-1" value="0" /></label>';
        option += '<label class="mb-0 btn bg-light disabled"><input disabled="true" onchange="userDATOS.optionTema(this);" type="radio" name="frm_valor-1" value="-1" /></label>';
      option += '</div>';

      html += '<div class="card">';
        html += '<div class="card-header px-2 py-1 cursor-pointer" id="headingTwo" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo">';
          html += '<h5 class="mb-0 text-uppercase">Temas</h5>';
        html += '</div>';

        html += '<div id="collapseTwo" class="collapse" aria-labelledby="headingTwo" data-parent="#accordionExample">';
          html += '<div class="card-body p-0">';
            if(window.vista == "procesar" || (window.vista == "procesadas" && window.noticiaSELECCIONADAeditar !== undefined))
              html += "<button type='button' class='btn d-block mx-auto my-2 btn-primary text-uppercase' onclick='userDATOS.addTema(" + id + ")'>nuevo tema</button>";
            html += "<table class='table m-0' id='modal-table-temas'>";
              html += "<tbody>";
                html += "<tr class='d-none'>" +
                    '<td ' + ((window.vista == "procesadas" && window.noticiaSELECCIONADAeditar === undefined) ? "class='d-none'" : "") + '><button type="button" class="btn bg-danger rounded-0 text-white" onclick="userDATOS.removeTemas(this,' + id + ');"><i class="fas fa-times"></i></button></td>' +
                    '<td class="' + (window.vista == "procesar" ? "px-0" : ((window.vista == "procesadas" && window.noticiaSELECCIONADAeditar === undefined) ? "pr-0" : "px-0")) + ' w-75">' + "<select class='select__2 w-100' data-allow-clear='true' data-placeholder='SELECCIONE TEMA' required='true' onchange='userDATOS.temaUnico(this," + id + ");' name='frm_tema-0'>" + selectTemas + '</td>' +
                    '<td>';
                    html += '<div class="btn-group" role="group" aria-label="Basic example">'
                      html += '<label class="mb-0 btn bg-light disabled"><input disabled="true" onchange="userDATOS.optionTema(this);" type="radio" name="frm_valor-0" value="1" /></label>';
                      html += '<label class="mb-0 btn bg-light disabled"><input disabled="true" onchange="userDATOS.optionTema(this);" type="radio" name="frm_valor-0" value="0" /></label>';
                      html += '<label class="mb-0 btn bg-light disabled"><input disabled="true" onchange="userDATOS.optionTema(this);" type="radio" name="frm_valor-0" value="-1" /></label>';
                    html += '</div>';
                html += '</td>';
                html += "</tr>";
                html += "<tr>" +
                    '<td ' + ((window.vista == "procesadas" && window.noticiaSELECCIONADAeditar === undefined) ? "class='d-none'" : "") + '><button type="button" class="btn bg-danger rounded-0 text-white" onclick="userDATOS.removeTemas(this,' + id + ');"><i class="fas fa-times"></i></button></td>' +
                    '<td class="' + (window.vista == "procesar" ? "px-0" : ((window.vista == "procesadas" && window.noticiaSELECCIONADAeditar === undefined) ? "pr-0" : "px-0")) + ' w-75">' + "<select class='select__2 w-100' data-allow-clear='true' data-placeholder='SELECCIONE TEMA' required='true' onchange='userDATOS.temaUnico(this," + id + ");' name='frm_tema-1'>" + selectTemas + '</td>' +
                    '<td>' + option + '</td>';
                html += "</tr>";
              
              html += "</tbody>";
            html += "</table>";
          html += '</div>';
        html += '</div>';
      html += '</div>';
    html += '</div>';

    if(window.vista == "procesar" || (window.vista == "procesadas" && window.noticiaSELECCIONADAeditar !== undefined)) {
      html += '<div class="row mt-2 justify-content-center">';
        html += '<div class="col-12">';
          html += '<button type="button" onclick="userDATOS.limpiarUnidad(' + id + ');" class="btn btn-block btn-dark text-uppercase">limpiar elemento <i title="Reinicia VALORACIÓN y TEMAS de la UNIDAD DE ANÁLISIS" class="ml-2 fas fa-question-circle"></i></button>';
        html += '</div>';
      html += '</div>';
    }
  html += '</div>';
  button.closest(".modal-container").find("> .row > div:last-child()").html(html);
  if(window.vista == "procesadas" && window.noticiaSELECCIONADAeditar === undefined)
    button.closest(".modal-container").find("> .row > div:last-child()").find("input,select").attr("disabled",true);
  button.closest(".modal-container").find("> .row > div:last-child()").find("select").select2();
  button.removeClass("bg-success").addClass("bg-warning text-black").find("i").removeClass("fa-angle-right").addClass("fa-angle-left");
  button.attr("onclick","userDATOS.closeUnidad(this);");

  ////
  if(Object.keys(window.ARR_cliente[id]["tema"]).length > 1) {
    for(var i in window.ARR_cliente[id]["tema"]) {
      if(i == "texto") continue;
      id_tema = i.substring(9);
      $("#modal-table-temas tr:last-child() td:nth-child(2)").find("select option[value='" + id_tema + "']").removeAttr("disabled");
      $("#modal-table-temas tr:last-child() td:nth-child(2)").find("select").val(id_tema).trigger("change");
      $("#modal-table-temas tr:last-child() td:nth-child(3)").find("input[value='" + window.ARR_cliente[id]["tema"][i] + "']").attr("checked",true);
      $("#collapseTwo > div > button").click();
    }
    $("#modal-table-temas tr td:nth-child(2)").find("select").select2();
  } else {
    if(window.vista == "procesadas" && window.noticiaSELECCIONADAeditar === undefined) {
      $("#modal-table-temas tr:last-child").remove();
      $("#modal-table-temas").append("<tr><td><p class='m-0 text-center text-uppercase'>SIN temas asociados</p></td></tr>")
    }
  }
  ////
}
/**
 * Función para agregar la valoración de un tema
 * Actualizado
 */
userDATOS.optionTema = function(e) {
  let radio = $(e);
  let tr = radio.closest("tr");
  let tema = tr.find("select").val();
  let value = radio.parent().find("input:checked").val();
  let id = $("#modal-table-unidad").find("select:disabled").val();
  
  window.ARR_cliente[id]["tema"]["frm_tema_" + tema] = value;
}
/**
 * Función para eliminar datos de una unidad / agenda
 * Retorna sus datos al inicio
 * Actualizado
 */
userDATOS.limpiarUnidad = function(id) {
  $.MessageBox({
    buttonDone  : strings.btn.si,
    buttonFail  : strings.btn.no,
    message   : strings.eliminar.info
  }).done(function(){
    window.ARR_cliente[id]["tema"] = {};
    window.ARR_cliente[id]["tema"]["texto"] = "";
    window.ARR_cliente[id]["valoracion"] = null;
    window.limpiarUnidad = "";
    $("#modal-table-unidad").find("select:disabled").closest("tr").find("td:last-child() button").click();
  });
}
/** */
userDATOS.restaurarNoticia = function(e) {
  $.MessageBox({
    buttonDone  : strings.btn.si,
    buttonFail  : strings.btn.no,
    message   : strings.noticia.recuparar,
  }).done(function(){
    let ARR_noticiaproceso = null;
    userDATOS.busqueda({"value":window.noticiaSELECCIONADA.id_noticia,"tabla":"noticiasproceso","column":"id_noticia","retorno":0,"elim":1}, function(d) {
      ARR_noticiaproceso = d;
    });
    let ARR_proceso = null;
    userDATOS.busqueda({"value":window.noticiaSELECCIONADA.id_noticia,"tabla":"proceso","column":"id_noticia","retorno":0,"elim":1}, function(d) {
      ARR_proceso = d;
    });
    let ARR_actores = null;
    userDATOS.busqueda({"value":window.noticiaSELECCIONADA.id_noticia,"tabla":"noticiasactor","column":"id_noticia","retorno":0,"elim":1}, function(d) {
      ARR_actores = d;
    });
    let ARR_clientes = null;
    userDATOS.busqueda({"value":window.noticiaSELECCIONADA.id_noticia,"tabla":"noticiascliente","column":"id_noticia","retorno":0,"elim":1}, function(d) {
      ARR_clientes = d;
    });
    let ARR_instituciones = null;
    userDATOS.busqueda({"value":window.noticiaSELECCIONADA.id_noticia,"tabla":"noticiasinstitucion","column":"id_noticia","retorno":0,"elim":1}, function(d) {
      ARR_instituciones = d;
    });
    let ARR_periodista = null;
    userDATOS.busqueda({"value":window.noticiaSELECCIONADA.id_noticia,"tabla":"noticiaperiodista","column":"id_noticia","retorno":0,"elim":1}, function(d) {
      ARR_periodista = d;
    });

    userDATOS.change(window.noticiaSELECCIONADA.id,"noticia","elim",0);
    userDATOS.change(window.noticiaSELECCIONADA.id_noticia,"noticias","elim",0);

    userDATOS.log(window.user_id,"Registro recuperado",0,window.noticiaSELECCIONADA.id,"noticia");
    userDATOS.log(window.user_id,"Registro recuperado",0,window.noticiaSELECCIONADA.id_noticia,"noticias");
    tabla_noticia.row(".selected").remove().draw();

    if(Object.keys(ARR_periodista).length != 0) {
      for(var i in ARR_periodista) {
        periodista = ARR_periodista[i];
        if(periodista.did != window.noticiaSELECCIONADA.did) continue;
        userDATOS.change(periodista.id,"noticiaperiodista","elim",0)
      }
    }

    if(Object.keys(ARR_noticiaproceso).length != 0) {
      for(var i in ARR_noticiaproceso) {
        noticiaproceso = ARR_noticiaproceso[i];
        if(noticiaproceso.did != window.noticiaSELECCIONADA.did) continue;
        userDATOS.change(noticiaproceso.id,"noticiasproceso","elim",0);
      }
    }
    if(Object.keys(ARR_proceso).length != 0) {
      for(var i in ARR_proceso) {
        proceso = ARR_proceso[i];
        if(proceso.did != window.noticiaSELECCIONADA.did) continue;
        userDATOS.change(proceso.id,"proceso","elim",0);
      }
    }
    if(Object.keys(ARR_actores).length != 0) {
      for(var i in ARR_actores) {
        actor = ARR_actores[i];
        if(actor.did != window.noticiaSELECCIONADA.did) continue;
        userDATOS.change(actor.id,"noticiasactor","elim",0);
      }
    }
    if(Object.keys(ARR_clientes).length != 0) {
      for(var i in ARR_clientes) {
        cliente = ARR_clientes[i];
        if(cliente.did != window.noticiaSELECCIONADA.did) continue;
        userDATOS.change(cliente.id,"noticiascliente","elim",0);
      }
    }
    if(Object.keys(ARR_instituciones).length != 0) {
      for(var i in ARR_instituciones) {
        institucion = ARR_instituciones[i];
        if(institucion.did != window.noticiaSELECCIONADA.did) continue;
        userDATOS.change(institucion.id,"noticiasinstitucion","elim",0);
      }
    }
    userDATOS.notificacion("Noticia recuperada","info",false);
    userDATOS.pantalla_cerrarSIMPLE()
  });
}
/**
 * Función asincrónica para carga de elementos en la vista
 * Carga los select de la noticia
 * @param data OBJECT -> {id:entidad, ...}
 */
userDATOS.selectOption = function(id,entidad,column = "nombre") {
  $.ajax({
    type: 'POST',
    url: cliente_url,
    dataType: 'json',
    async: true,
    data: { "tipo": "query","accion": "selectOption","entidad":entidad,"column":column }
  }).done(function(msg) {
    $("#" + id).html(msg.html);
    $("#" + id).select2();
  });
}
/** */
userDATOS.volverUnidad = function() {
  angular.element($("#btn_cliente")).scope().unidadAnalisis(0)//paso atrás
}

/** */
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