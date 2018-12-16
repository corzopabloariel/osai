const url_cliente = "http://93.188.164.27/cliente/lib/cliente.php";
let userDATOS = {};

// <BASICO> //
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
 * Función que usa la api Messagebox
 * @param msg STRING: texto que aparece en el cuadro
 * @param done FUNCTION: función que ejecuta si respuesta es afirmativa
 * @param fail FUNCTION: función que ejecuta si respuesta es negativa
 */
userDATOS.messagebox = function(msg, done, fail) {
  $.MessageBox({
		buttonDone  : "Si",
		buttonFail  : "No",
		message   : msg
	}).done(done).fail(fail);
}
/**
 * Función para la búsqueda directo en la BD
 * @param value: valor a buscar
 * @param tabla STRING: tabla donde buscar
 * @param asy BOOL: Sincrónico / Asincrónico
 * @param colum STRING: columna específica - default ID
 * @param retorno INT: cantidad a retornar - != 1 :: TODO
 */
userDATOS.busqueda = function(value, entidad, asy = false, column = "id", retorno = 1) {
  let data = null;
  $.ajax({
     type: 'POST',
     url: url_query_local_2,
     dataType: 'json',
     async: asy,
     data: { "accion": "search", "data": { "entidad": entidad, "value": value, "column": column, "retorno": retorno } }
  }).done(function(msg) {
    data = msg;
    if(asy) return data;
  });
  if(!asy) return data;
}
/**
 *
 */
userDATOS.busqueda_paginado = function(values, entidad, asy = false, name = "i") {
  if(window["name_" + name] === undefined) window["name_" + name] = 0;
  else window["name_" + name] ++;
  let data = null;
  $.ajax({
     type: 'POST',
     url: url_query_local_2,
     dataType: 'json',
     async: asy,
     data: { "accion": "search_paginado", "data": { "entidad": entidad, "values": values, "paginado": window["name_" + name] } }
  }).done(function(msg) {
    data = msg;
    if(asy) return data;
  });
  if(!asy) return data;
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
  console.log(flag);
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
