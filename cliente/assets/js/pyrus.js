/**
 * Version 2.0
 * 11/2018
 */
//----------------------
/**
 * @param e - string: entidad del sistema
 */
Pyrus = function( e = null ){
	this.entidad = e; // entidad que se pasa por parametro
	this.objeto = null; // objeto sacado de ENTIDADES
  this.elemento = null; // objeto de los elementos de una entidad, excepto autofecha y elim
  this.formulario = null;
	this.especificacionOBJ = null;// objeto de atributos con su tipo de dato, ideal para el alta de tablas en la BD
	this.especificacion = null; // especificacion de la entidad
	this.registros = null; // registros totales en la BD
	this.columna = null; // Array de columnas, solo header
	this.columnaDT = null;// Columnas header con formato de DATATABLE
	this.order = null; // Alineación de elementos en DATATABLE

	this.constructor = function(){
		if(this.entidad === null || this.entidad === ""){
			console.log("AVISO: No se ha pasado ninguna entidad. Uso limitado");
			// no hago ninguna operacion de carga
			return false;
		}
    /* ------------------- */
    this.objeto = ENTIDAD[this.entidad];
    /* ------------------- */
		this.getEspecificacion();
    this.objetoLimpio();
		this.setData();
		this.getRegistros();
		this.getColumna();
		this.getOrder();
	};
  /**
   *
   */
	this.setData = function() {
		this.query("createData",
				{"entidad" : this.entidad, "objeto" : this.especificacionOBJ},
				function(){ }, null, false);
	};
  /**
   *
   */
 	this.objetoLimpio = function() {
 		this.elemento = {};
 		for(var i in this.especificacion) {
 			if(i == "autofecha") continue;
			if(this.especificacion[i]["DEFAULT"] === undefined) this.elemento[i] = null;
			else this.elemento[i] = this.especificacion[i]["DEFAULT"];
 		}
 	}
  /**
   *
   */
	this.getRegistros = function() {
		this.registros = 0;
		this.query("registros",
				{"entidad" : this.entidad},
				function(m){
					this.registros = m ;
				},
				null,false);
  };
  /**
   *
   */
	this.getOrder = function() {
		this.order = [];

		let ARR_order = [];
		let AUX_class = {};
		for(var i in this.columna) {
			if(this.especificacion[this.columna[i]]["VISIBILIDAD"] == "TP_INVISIBLE") continue;
			if(this.especificacion[this.columna[i]]["ALIGN"] !== undefined) {
				if(AUX_class[this.especificacion[this.columna[i]]["ALIGN"]] === undefined) AUX_class[this.especificacion[this.columna[i]]["ALIGN"]] = [];
				AUX_class[this.especificacion[this.columna[i]]["ALIGN"]].push(parseInt(i));
			} else {
				if(AUX_class["text-left"] === undefined) AUX_class["text-left"] = [];
				AUX_class["text-left"].push(parseInt(i));
			}
		}
		for(var x in AUX_class) {
			let aux = {};
			aux["className"] = x;
			aux["targets"] = AUX_class[x];
			this.order.push(aux);
		}
	};
  /**
   *
   */
	this.getColumna = function() {
		this.columna = [];
		this.columnaDT = [];

		for(var i in this.especificacion) {
			let STR_valor = "";
			if(this.especificacion[i]["VISIBILIDAD"] == "TP_INVISIBLE" || this.especificacion[i]["VISIBILIDAD"] == "TP_BANDERA" || this.especificacion[i]["VISIBILIDAD"] == "TP_OCULTO") continue;

			if(this.especificacion[i]["NOMBRE"] === undefined) STR_valor = (i).toUpperCase();
			else STR_valor = (this.especificacion[i]["NOMBRE"]).toUpperCase();

			this.columna.push(i)
			this.columnaDT.push({title: STR_valor,data:i});
		}
	};
  /**
   *
   */
	this.getEspecificacion = function() {
		this.especificacionOBJ = {};
    this.especificacion = this.objeto['ATRIBUTOS'];
		for(var i in this.objeto['ATRIBUTOS'])
			this.especificacionOBJ[i] = this.objeto['ATRIBUTOS'][i]['TIPO'];
	};
	/**
	 *
	 */
  this.guardar_1 = function(OBJ_dato, asy = false) {
 		let dato_guardar = {};
 		if(this.objeto["UNIQUE"] !== undefined) {
 			let aux = {};
      aux["entidad"] = this.entidad;
			aux["id"] = OBJ_dato["id"];
 			for(var i in this.objeto["UNIQUE"])
 				aux[this.objeto["UNIQUE"][i]] = OBJ_dato[this.objeto["UNIQUE"][i]];
      let unique = 0;
      this.query("unique",aux, function(m) {
        unique = m;
   		}, null, false);
      if(unique > 0) return 0;
 		}
    dato_guardar["entidad"] = this.entidad;
		dato_guardar["objeto"] = OBJ_dato;
		dato_guardar["attr"] = this.objeto["ATRIBUTOS"];
		id = -1;
		this.query("guardar_uno_generico",dato_guardar, function(m) {
      id = m;
		}, null, asy);
		return id;
 	};
	/**
	 *
	 */
	this.formulario_OK = function(id = "") {
		if(window.formulario === undefined)
			window.formulario = [];

		if(window.formulario[this.entidad] === undefined) {
			window.formulario[this.entidad] = {};

			let OBJ_funciones = {}
			let ARR_form = this.objeto['FORM'];

			if(this.objeto['FORM_CLASS'] === undefined) this.objeto['FORM_CLASS'] = 'form-control';
			let STR_class = this.objeto['FORM_CLASS'];

			if(this.objeto['FUNCIONES'] !== undefined) OBJ_funciones = this.objeto['FUNCIONES'];

			if(ARR_form !== undefined) {
				for(var i in ARR_form) {
					let STR_input = ""
					for(var e in ARR_form[i]) {
            let STR_aux = ARR_form[i][e];
  					let AUX_nombre = e + (id != "" ? "_" + id : "");
            if(e == "id" || this.especificacion[e]["VISIBILIDAD"] == "TP_INVISIBLE") {
              STR_input += STR_aux.replace('/' + e + '/',this.inputAdecuado(this.especificacion[e],e,AUX_nombre,STR_class));
							window.formulario[this.entidad][e] = STR_input;
            } else {
  						let OBJ_funcion = {};

  						if(this.objeto['FUNCIONES'] !== undefined)
  		          if(this.objeto['FUNCIONES'][e] !== undefined)
  		            OBJ_funcion = this.objeto['FUNCIONES'][e];
  						STR_input += STR_aux.replace('/' + e + '/',this.inputAdecuado(this.especificacion[e],e,AUX_nombre,STR_class,OBJ_funcion));
							window.formulario[this.entidad][e] = '<div class="row">' + STR_input + '</div>';
            }
					}
				}
			}

			return window.formulario[this.entidad];
		} else return window.formulario[this.entidad];
	}
  /* ----------------- */
	this.inputAdecuado = function(OBJ_elemento,ATTR_nombre,TAG_nombre,STR_class,OBJ_funcion) {
    if(OBJ_elemento['NOMBRE'] === undefined) OBJ_elemento['NOMBRE'] = ATTR_nombre;
    OBJ_elemento['NOMBRE'] = (OBJ_elemento['NOMBRE']).toUpperCase();

		if(OBJ_elemento['VISIBILIDAD'] == 'TP_OCULTO' || OBJ_elemento['VISIBILIDAD'] == 'TP_VISIBLE') {
			switch(OBJ_elemento['TIPO']) {
				case 'TP_ENTERO':
					return this.inputString(OBJ_elemento,"frm_" + TAG_nombre,"number",STR_class,OBJ_funcion);
				break;
				case 'TP_STRING':
					return this.inputString(OBJ_elemento,"frm_" + TAG_nombre,"text",STR_class,OBJ_funcion);
				break;
				case 'TP_STRING_L':
					return this.inputStringL(OBJ_elemento,"frm_" + TAG_nombre,STR_class,OBJ_funcion);
				break;
				case 'TP_FECHA':
					return this.inputString(OBJ_elemento,"frm_" + TAG_nombre,"date",STR_class,OBJ_funcion);
				break;
				case 'TP_PASSWORD':
					return this.inputString(OBJ_elemento,"frm_" + TAG_nombre,"password",STR_class,OBJ_funcion);
				break;
				case 'TP_RELACION':
					if(OBJ_elemento['RELACION']['TABLA'] != this.entidad) {
						let NEW_aux = new Pyrus(OBJ_elemento['RELACION']['TABLA']);
						return NEW_aux.select(OBJ_elemento,"frm_" + TAG_nombre,STR_class,OBJ_funcion);
					} else return this.select(OBJ_elemento,"frm_" + TAG_nombre,STR_class,OBJ_funcion);
				break;
				case 'TP_ENUM':
					return this.select(OBJ_elemento,"frm_" + TAG_nombre,STR_class,OBJ_funcion,OBJ_elemento["ENUM"]);
				break;
				default:
					return this.inputString(OBJ_elemento,"frm_" + TAG_nombre,"text",STR_class,OBJ_funcion);
			}
		} else return this.inputString(OBJ_elemento,"frm_" + TAG_nombre,"hidden",STR_class);
	}

	this.inputString = function(OBJ_elemento,STR_nombre,STR_type,STR_class,OBJ_funcion = null) {
		let STR_funcion = "";
		let necesario = 0;
		if(OBJ_elemento["NECESARIO"] !== undefined) necesario = OBJ_elemento["NECESARIO"];
    if(OBJ_funcion !== null) {
  		for(var i in OBJ_funcion) {
  			if(STR_funcion != "") STR_funcion += " ";
  			STR_funcion += i + "=" + OBJ_funcion[i];
  		}
    }
    switch (STR_type) {
      case "number":
  			STR_type = "text";
  			STR_class += " texto-numero text-right";
        break;
      case "password":
        STR_class += " texto-password";
        break;
      case "text":
        STR_class += " texto-text";
        break;
      case "date":
        STR_class += " texto-date";
        break;
    }
		return "<input " + (necesario ? "required='true'" : "") + " " + STR_funcion + " ng-name='" + STR_nombre + "' name='" + STR_nombre + "' id='" + STR_nombre + "' class=\"" + STR_class + "\" type='" + STR_type + "' placeholder='" + OBJ_elemento["NOMBRE"] + "' />";
	}
	/**
	 * Función para la creación de formularios en un lugar determinado del dom
	 */
	this.select = function(OBJ_elemento,STR_nombre,STR_class,OBJ_funcion,OBJ_datos = null) {
		let STR_funcion = "";

		if(OBJ_funcion !== null) {
			for(var i in OBJ_funcion) {
				if(STR_funcion != "") STR_funcion += " ";
				STR_funcion += i + "=" + OBJ_funcion[i];
			}
		}
		if(OBJ_datos === null) OBJ_datos = this.selector();
		let return_STR = "<select " + (OBJ_elemento["NECESARIO"] ? "required='true'" : "") + " " + STR_funcion + " style='100%' ng-name='" + STR_nombre + "' name='" + STR_nombre + "' id='" + STR_nombre + "' class=\"" + STR_class + " select__2\" data-allow-clear='true' data-placeholder='" + OBJ_elemento["NOMBRE"] + "'>";
		return_STR += "<option value=''></option>";
		for(var i in OBJ_datos)
			return_STR += "<option value='" + i + "'>" + OBJ_datos[i] + "</option>";

		return_STR += "</select>";
		return return_STR;
	}
	this.selector = function() {
		let ARR_aux = {};
		if(this.objeto['VISIBLE'] === undefined) return ARR_aux;

		let OBJ_formato = this.objeto['VISIBLE'];
		let STR_form = OBJ_formato['TEXTO'];
		let ARR_resultado = this.resultados();
		console.log(ARR_resultado);
		for(var x in ARR_resultado) {
			STR_form = OBJ_formato['TEXTO'];
			for(var i in OBJ_formato['ATTR']) {
				attr = OBJ_formato['ATTR'][i];
				value = ARR_resultado[x][OBJ_formato['ATTR'][i]];
				console.log(attr);
				if(this.especificacion[attr]['TIPO'] != 'TP_RELACION') {
					STR_form = STR_form.replace('/' + OBJ_formato['ATTR'][i] + '/', value);
				} else {
					tabla = this.especificacion[attr]['RELACION']['TABLA'];
					tabla_attr = this.especificacion[attr]['RELACION']['ATTR'];
					STR_form = STR_form.replace('/' + OBJ_formato['ATTR'][i] + '/', this.relacion(tabla,tabla_attr,value));
				}
				ARR_aux[ARR_resultado[x]["id"]] = STR_form;
			}
		}
		return ARR_aux;
	}
	this.relacion = function(table, attr, value) {
		aux = new Pyrus(table);
		visible = aux.objeto['VISIBLE'];
		if(visible === undefined) return "";
		data = aux.search(value, attr);
		if(data === null) return "";
		STR_form = visible['TEXTO'];
		for(var i in visible['ATTR']) {
			if(aux.especificacion[visible['ATTR'][i]]['TIPO'] != 'TP_RELACION') {
				STR_form = STR_form.replace('/' + visible['ATTR'][i] + '/', data[visible['ATTR'][i]]);
			} else {
				tabla = aux.especificacion[visible['ATTR'][i]]['RELACION']['TABLA'];
				tabla_attr = aux.especificacion[visible['ATTR'][i]]['RELACION']['ATTR'];
				STR_form = STR_form.replace('/' + OBJ_formato['ATTR'][i] + '/', aux.relacion(tabla,tabla_attr,value));
			}
		}
		return STR_form;
	}
	this.resultados = function() {
		let data = null
		this.query("resultados",{"entidad":this.entidad},function(m) {
			console.log(m);
			data = m;
		},null,false);
		return data;
	}
  /* ----------------- */
  this.search = function(value, column = 'id') {
    let data = null;
    this.query("search",
				{"entidad" : this.entidad,"column" : column,"value" : value},
				function(m){
					data = m ;
				},
				null,false);
    return data;
  }
	/**
  * Funcion de consulta desde JS, se comunica con el servidor
  * y devuelve una respuesta acorde, uso generico.
  * Las funciones de callback solo conocen la respuesta en
  * data, no el contexto de como fue recibido (ni estado, ni
  * mensaje)
  *
  * @param string accion La accion a llamar
  * @param object data Objeto anonimo inmediato que contiene lo que se enviara
  * @param function callbackOK Funcion a llamar si no hay errores
  * @param function callbackFail Funcion a llamar si hay errores
  */
  this.query = function (accion,data,callbackOK,callbackFail = null,async = true){
     url_envio = url_query_local_2;
     let envio = { "accion":accion, "data":data };
     window.con = $.ajax({
	     context: this,
	     type: 'POST',
	     // make sure you respect the same origin policy with this url:
	     // http://en.wikipedia.org/wiki/Same_origin_policy
	     url: url_envio,
	     async: async,
	     data: envio,
	     success: function(msg){
         window.devolucion = JSON.parse(msg);
         // uso call para pasarle el contexto this
         callbackOK.call(this,window.devolucion['data']);
	     },
	     error: function(msg){
				 console.log(msg)
			 }
	   });
  };
	return this.constructor();
}
