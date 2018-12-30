Pyrus_dato = new Pyrus();
if(userDATOS.verificar(0)) {
  userDATOS.submit = function(t) {
    let OBJ_data = {};
    let aux = $( t ).serializeArray();

    for(var i in aux)
      OBJ_data[aux[i]["name"]] = aux[i]["value"];

    if(userDATOS.validar("#" + t.id)) {
      let NEW_busqueda = null;
      userDATOS.busqueda({"value":t.frm_user.value,"tabla":"usuario","column":"user"},function(d) {
        NEW_busqueda = d;
      },false);
      if(NEW_busqueda === undefined || NEW_busqueda === null) userDATOS.notificacion(strings.datosIncorrectos,"error");
      else {
        //DOBLE validación
        if(NEW_busqueda.user != t.frm_user.value)
          userDATOS.notificacion(strings.datosIncorrectos,"error");
        else {
        // controlo que el usuario no este logueado en este momento
          window.continuar = true;
          $.ajax({
            type: 'GET',
            url: "/lib/userLoginTimeOut.php?user=" + NEW_busqueda['id'] + "&query",
            async: false
          }).done(function(m) {
            if(m == "NO"){
              userDATOS.notificacion(strings.usuario.logueado,"error");
              window.continuar = false;
              return false;
            }
          });
          // intento detener la ejecucion
          if(!window.continuar) return 0;
          if(parseInt(NEW_busqueda["activo"])) {
            if(NEW_busqueda["pass"] == md5(t.frm_pass.value)) {
              console.log(NEW_busqueda)
              userDATOS.ultimaHora(NEW_busqueda.id);
              
              userDATOS.log(NEW_busqueda.id,"Acceso al sistema :: usuario: " + NEW_busqueda.user);
              
              Pyrus_dato.query( 'NS_login',
                  {'dato':NEW_busqueda,'access':true },
                  function(m){ $("#div").removeClass("d-none"); window.location = 'principal.html'; },
                  function(m){ console.log(m) });
              
            } else {
              userDATOS.log(NEW_busqueda.id,"Error de datos :: usuario: " + NEW_busqueda.user);
              userDATOS.notificacion(strings.datosIncorrectos,"error");
            }
          } else userDATOS.notificacion(strings.usuario.bloqueado,"warning");
        }
      }
    } else userDATOS.notificacion(strings.faltan.datos,"error");
  };
} else window.location = "principal.html";

$(document).ready(function() {
  $("#div").addClass("d-none");
});
