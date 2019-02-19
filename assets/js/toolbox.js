const url_query_local = "http://93.188.164.27/lib/query.php";
const servidor = "93.188.164.27";
/**
 * Funcion de consulta desde JS, se comunica con el servidor
 * y devuelve una respuesta acorde, uso generico.
 * Las funciones de callback solo conocen la respuesta en
 * data, no el contexto de como fue recibido (ni estado, ni
 * mensaje)
 *
 * @return {undefined}
 */
query = function(accion,data,callbackOK,callbackFail = null){
  url_envio = url_query_local;
  envio = { "accion":accion, "data":data };
  window.con = $.ajax({
    type: 'POST',
    // make sure you respect the same origin policy with this url:
    // http://en.wikipedia.org/wiki/Same_origin_policy
    url: url_envio,
    async: true,
    data: envio,
    success: function(msg){
      window.devolucion = JSON.parse(msg);
      callbackOK(window.devolucion['data']);
      },
    error: function(msg){
      window.error = msg;
      console.error(msg);
      if(!callbackFail)
        callbackFail(msg);
    }
  });
}
