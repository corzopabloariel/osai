const strings = {
    btn: {
        si: "Si",
        no: "No",
        pasar: "Pasar",
        cancelar: "Cancelar",
        cambiar: "Cambiar",
        crear: "Crear"
    },
    attr: {
        no: "Atributo no encontrado",
    },
    faltan: {
        datos: "Faltan datos",
        datosBusqueda: "Faltan datos de búsqueda",
        especifico: [
            "Faltan datos. <strong>Fechas</strong> y <strong>Unidad de análisis</strong><br/>no pueden quedar vacio",
            "Faltan datos. Las <strong>Fechas</strong> no pueden quedar vacias"
        ],
        datosMssg: function(d) {
            return "<p class='m-0'><strong>Faltan datos</strong></p><p class='m-0'>" + d + "</p>"
        },
    },
    contrasela: {
        erronea: "Contraseña actual incorrecta",
        noCoinciden: "Las contraseñas nuevas no coinciden",
        cambiada: "Contraseña cambiada"
    },
    noticia: {
        recuperar: "¿Está seguro de recuperar la noticia?",
        sinSeleccion: "No se seleccionó ninguna noticia",
        seleccion: [
            "¿Está seguro de eliminar la <strong>noticia</strong> seleccionada?",
            function(d) {
                return "¿Está seguro de eliminar las <strong>noticias</strong> seleccionadas?<br/>Total: " + d
            }
        ],
        relevo: [
            "¿Está seguro de relevar la <strong>noticia</strong> seleccionada?",
            function(d) {
                return "¿Está seguro de relevar las <strong>noticias</strong> seleccionadas?<br/>Total: " + d
            }
        ],
        procesar: [
            "¿Está seguro de reprocesar la <strong>noticia</strong>?<br/>Se desechará toda la información previa",
            "¿Está seguro de aplicar el proceso a la noticia?",
            function(d) {
                return "<p class='text-center m-0' style='font-size:1.3em'>" + d +"</p>"
            },
        ],
        pasada: "Noticia pasada al cliente",
        desechada: "Noticia desechada",
        publicar: [
            "<p class='text-uppercase m-0 text-center' style='font-size:1.3em'>¿Está seguro de publicar la <strong>noticia</strong> seleccionada?</p>",
            "Noticia lista para publicar en el CLIENTE FINAL.<br/>Para terminar, dirijase a <strong>CLIPPING</strong>",
            "Noticia lista para publicar en los CLIENTES FINALES seleccionados.<br/>Para terminar, dirijase a <strong>CLIPPING</strong>",
        ],
        prePublicar: function(d) {
            mssg = "<p class='text-center' style='font-size:1.3em'>¿Está seguro de publicar la <strong>noticia</strong> seleccionada?</p>";
            if(d != "") mssg += d;
            return mssg;
        },
        eliminar: [
            "¿Está seguro de eliminar la <strong>noticia</strong>?",
            "¿Está seguro de desechar la noticia?<br/><small>Será visible para el relevo</small>",
            "¿Está seguro de eliminar el <strong>proceso de la noticia</strong>?<br/>La noticia volverá al apartado <strong>A procesar</strong>",
            "¿Está seguro de eliminar la <strong>noticia</strong>?<br/>Al confirmar, se eliminará todo proceso relacionado"
        ],
        relevar: "¿Está seguro de pasar a relevar la <strong>noticia</strong>?",
        abierta: [
            "Noticia procesada en edición por otro usuario.",
            "Noticia abierta; no se puede mostrar."
        ],
        abriendo: [
            "Abriendo espacio de trabajo. <strong>Espere</strong>",
            "Abriendo noticia; trayendo datos procesados. <strong>Espere</strong>"
        ],
        editar: [
            "<p class='text-center m-0' style='font-size:1.3em'>¿Está seguro de editar el proceso de la noticia?<small class='d-block text-muted'>El proceso actual se reemplazará por los datos nuevos</small></p>"
        ],
        cerrar: [
            "<p class='text-center m-0' style='font-size:1.3em'>¿Está seguro de cerrar?<br><small>No se guardará la noticia</small></p>",
            "<p class='text-center m-0' style='font-size:1.3em'>¿Está seguro de <strong>cerrar</strong>?<br><small>Perderá avances de lo que haya hecho</small></p>",
            "<p class='text-center m-0' style='font-size:1.3em'>¿Está seguro de cerrar?<br><small>Perderá los avances</small></p>",
        ]
    },
    cambiadoDatos : "Datos cambiados",
    usuario: {
        contrasela: "<p class='text-uppercase m-0 text-center' style='font-size:1.3em'>Configuración de <strong>usuario</strong></p>",
        nuevo: "<h2 class='m-0'>Creación de usuario</h2><p class='m-0'>Usuario para el sector <strong>CLIENTE</strong></p>",
        ocupado: "Usuario en uso",
        creado: "Usuario creado",
        existente: function(user,estado) {
            return "<h3 class='m-0'>Usuario: " + user + "</h3><button onclick='userDATOS.estadoClienteFinal(" + estado + ");' class='btn btn-block my-2 text-uppercase " + (estado ? "btn-danger" : "btn-success") + "'>" + (estado ? "desactivar" : "activar") + "</button><p class='m-0'>Resetear contraseña del <strong>CLIENTE</strong></p>"
        },
        logueado: "El usuario esta actualmente logueado",
        bloqueado: "Usuario bloqueado. Contacte al administrador",
        cambio: function(estado,nombre) {
            return (estado == "1" ? "¿Está seguro de bloquear a <strong>" + nombre + "</strong>?" : "¿Está seguro de desbloquear a <strong>" + nombre + "</strong>?")
        }
    },
	messege: {
        pasar: "<h2 class='m-0'>Pasar noticia</h2><p class='m-0'>Se pasará de forma inmediata al cliente </p>",
        restaurar: "¿Está seguro de restaurar la clave?<br>La contraseña será 12345678"
    },
    restaurado: function(d) {
        return "Clave restaurada del usuario <strong>" + d + "</strong>"
    },
    elementoExistente: "Elemento existente",
    buscando: {
        actores: "Buscando <strong>ACTORES</strong>",
        instituciones: "Buscando <strong>INSTITUCIONES</strong>"
    },
    busquedaSinResultado: {
        actores: "<strong>ACTORES</strong> no detectados",
        instituciones: "<strong>INSTITUCIONES</strong> no detectadas"
    },
    busquedaConResultado: {
        actores: "<strong>ACTORES</strong> encontrados",
        instituciones: "<strong>INSTITUCIONES</strong> encontradas"
    },
    repetidoDatos: "Datos repetidos",
    datosIncorrectos: "Datos incorrectos",
    eliminar: {
        comun: "¿Está seguro de eliminar el registro?",
        alarma: "¿Está seguro de eliminar <strong>alarma</strong>?",
        actor: "¿Está seguro de eliminar al <strong>Actor</strong>?",
        institucion: "¿Está seguro de eliminar la <strong>Institución</strong>?",
        unidad: "¿Está seguro de eliminar la información de la <strong>Unidad o Agenda</strong>?",
        tema: "¿Está seguro de eliminar el tema de la <strong>Unidad o Agenda</strong>?",
        info: "¿Está seguro de eliminar la <strong>información</strong>?"
    },
	noClienteFinal: function(d) {
		return "<p class='m-0'>No hay CLIENTE FINAL asociado a <strong>" + d + "</strong></p><p class='m-0'>Genere usuario en el <i>MÓDULO CLIENTE</i></p>"
	},
    tablaReseteo: "La tabla y filtros se resetearan",
    error: {
        parseo: "Ocurrió un error de parseo. Reintente",
        parseoEliminado: "Ocurrió un error de parseo o el elemento fue eliminado",
        conexion: "Sin conectividad.<br/>Verifique conexión",
        404: "Página no encontrada",
        500: "Error interno del servidor",
        cancelada: "Operación cancelada",
        tiempo: "Se supero el tiempo de espera",
        comun: "Error",
        fechas: "La fecha <strong>DESDE</strong> supera el <strong>HASTA</strong>"
    }
}