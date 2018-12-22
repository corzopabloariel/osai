/**
 *@param e - string: entidad del sistema
 *@param contenido - bool: flag para la carga de contenido estandar
 *@param async_contenido - bool: flag para carga async
 */
Pyrus = function( e = null, contenido = true, async_contenido = false ){
	this.entidad = e; // entidad que se pasa por parametro
	this.objeto = null;
  this.formulario = null;
	this.especificacionOBJ = null;// objeto de atributos con su tipo de dato, ideal para el alta de tablas en la BD
	this.especificacion = null; // especificacion de la entidad
	this.resultado = null; // resultados de un listado generico
	this.columna = null;
	this.columnaDT = null;// Columnas header con formato de DATATABLE
	this.order = null;

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

		this.setData();
		if(contenido) this.getContenidoGenerico(async_contenido);
		//this.getParse();
		this.getColumna();
		this.getOrder();
	};

	this.setData = function() {
		if(window.dataBD === undefined)
			window.dataBD = [];
		if(window.dataBD[this.entidad] === undefined) {
			window.dataBD[this.entidad] = "OK";
			this.query("createData",
					{"entidad" : this.entidad, "objeto" : this.especificacionOBJ},
					function(){ }, null, false);
		}
	};

	this.objetoLimpio = function() {
		let r = {};
		for(var i in this.especificacion) {
			if(i == "elim" || i == "autofecha") continue;
			if(i == "id") r[i] = "nulo";
			else r[i] = null;
		}
		return r;
	}

	this.getEspecificacion = function() {
		if(window.especificacion === undefined) {
			window.especificacion = [];
			window.especificacionOBJ = [];
		}
		if(window.especificacion[this.entidad] === undefined) {
			window.especificacion[this.entidad] = this.objeto['ATRIBUTOS'];
			window.especificacionOBJ[this.entidad] = {};

			for(var i in this.objeto['ATRIBUTOS'])
				window.especificacionOBJ[this.entidad][i] = this.objeto['ATRIBUTOS'][i]['TIPO'];

			this.especificacion = window.especificacion[this.entidad];
			this.especificacionOBJ = window.especificacionOBJ[this.entidad];
		} else {
			this.especificacion = window.especificacion[this.entidad];
			this.especificacionOBJ = window.especificacionOBJ[this.entidad];
		}
	};

	this.getContenidoGenerico = function() {
		if(window.resultado === undefined)
			window.resultado = [];
		if(window.resultado[this.entidad] === undefined) {
			window.resultado[this.entidad] = [];
			if(async_contenido) {
				this.query("listar_generico",
					{"entidad" : this.entidad},
					function(m) {
						window.resultado[this.entidad] = m;
						this.resultado = window.resultado[this.entidad];
					},
					null,async_contenido);
			} else {
				this.query("listar_generico",
					{"entidad" : this.entidad},
					function(m) {
						window.resultado[this.entidad] = m;
					},
					null,async_contenido);
				this.resultado = window.resultado[this.entidad];
			}
    }
  };

	this.reload = function(asy = null) {
		//window.resultado[this.entidad] = undefined;
		//window.parseTO[this.entidad] = undefined;
		if(asy === null) asy = async_contenido;
		if(asy) {
			this.query("listar_generico",
				{"entidad" : this.entidad},
				function(m) {
					window.resultado[this.entidad] = m;
					this.resultado = window.resultado[this.entidad];
				},
				null,asy);
		} else {
			this.query("listar_generico",
				{"entidad" : this.entidad},
				function(m) {
					window.resultado[this.entidad] = m;
				},
				null,asy);
			this.resultado = window.resultado[this.entidad];
		}
		//this.getParse();
	}

	this.getColumna = function() {
		if(window.columna === undefined) {
			window.columna = [];
			window.columnaDT = [];
		}
		if(window.columna[this.entidad] === undefined) {
			window.columna[this.entidad] = [];
			window.columnaDT[this.entidad] = [];

			for(var i in this.objeto['ATRIBUTOS']) {
				let STR_valor = "";
				if(this.objeto['ATRIBUTOS'][i]["VISIBILIDAD"] == "TP_INVISIBLE" || this.objeto['ATRIBUTOS'][i]["VISIBILIDAD"] == "TP_BANDERA" || this.objeto['ATRIBUTOS'][i]["VISIBILIDAD"] == "TP_OCULTO") continue;

				if(this.objeto['ATRIBUTOS'][i]["NOMBRE"] === undefined) STR_valor = (i).toUpperCase();
				else STR_valor = (this.objeto['ATRIBUTOS'][i]["NOMBRE"]).toUpperCase();

				window.columna[this.entidad].push(i)
				window.columnaDT[this.entidad].push({"title": STR_valor, "data": i});
			}

			this.columna = window.columna[this.entidad];
			this.columnaDT = window.columnaDT[this.entidad];
		} else {
			this.columna = window.columna[this.entidad];
			this.columnaDT = window.columnaDT[this.entidad];
		}
	};
	/**
	 * Función para parsear todos los resultados
	 */
	this.parseTO = function(attr,tipo) {
		let map = $.map(this.resultado, function(value, index) { return [value]; });
		switch (tipo) {
			case 'json':
				map.filter(function(x) { x[attr] = JSON.parse(x[attr]); });
				break;
			case 'enum':
				let o = this.especificacion[attr]["ENUM"];
				map.filter(function(x) { x[attr] = o[parseInt(x[attr])]; });
				break;
		}
	}
	this.getParse = function() {
		if(window.parseTO === undefined) window.parseTO = [];
		if(window.parseTO[this.entidad] === undefined) {
			window.parseTO[this.entidad] = "";
			for(var i in this.especificacion) {
				if(this.especificacion[i]["FORMATO"] === undefined) continue;
				this.parseTO(i,this.especificacion[i]["FORMATO"]);
			}
		}
	}

	this.getOrder = function() {
		if(window.order === undefined) window.order = [];

		if(window.order[this.entidad] === undefined) {
			window.order[this.entidad] = [];

			let ARR_order = [];
			let AUX_class = {};
			for(var i in this.columna) {
				if(this.objeto["ATRIBUTOS"][this.columna[i]]["VISIBILIDAD"] == "TP_INVISIBLE") continue;
				if(this.objeto["ATRIBUTOS"][this.columna[i]]["ALIGN"] !== undefined) {
					if(AUX_class[this.objeto["ATRIBUTOS"][this.columna[i]]["ALIGN"]] === undefined) AUX_class[this.objeto["ATRIBUTOS"][this.columna[i]]["ALIGN"]] = [];
					AUX_class[this.objeto["ATRIBUTOS"][this.columna[i]]["ALIGN"]].push(parseInt(i));
				} else {
					if(AUX_class["text-left"] === undefined) AUX_class["text-left"] = [];
					AUX_class["text-left"].push(parseInt(i));
				}
			}
			for(var x in AUX_class) {
				let aux = {};
				aux["className"] = x;
				aux["targets"] = AUX_class[x];
				window.order[this.entidad].push(aux);
			}

			this.order = window.order[this.entidad];
		} else this.order = window.order[this.entidad];
	};

  /* ----------------- */
	this.inputAdecuado = function(OBJ_elemento,ATTR_nombre,TAG_nombre,STR_class,OBJ_funcion) {
    if(OBJ_elemento['NOMBRE'] === undefined) OBJ_elemento['NOMBRE'] = ATTR_nombre;
    OBJ_elemento['NOMBRE'] = (OBJ_elemento['NOMBRE']).toUpperCase();

		//if(OBJ_elemento['VISIBILIDAD'] == 'TP_OCULTO') return "";
		if(OBJ_elemento['VISIBILIDAD'] == 'TP_VISIBLE' || OBJ_elemento['VISIBILIDAD'] == 'TP_OCULTO') {
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
						// if(Object.keys(window.variables[OBJ_elemento['RELACION']['TABLA']].resultado).length > 0)
							return window.variables[OBJ_elemento['RELACION']['TABLA']].select(OBJ_elemento,"frm_" + TAG_nombre,STR_class,OBJ_funcion);
					} else return this.select(OBJ_elemento,"frm_" + TAG_nombre,STR_class,OBJ_funcion);
				break;
				case 'TP_ENUM':
					return this.select(OBJ_elemento,"frm_" + TAG_nombre,STR_class,OBJ_funcion,OBJ_elemento["ENUM"]);
				break;
				case 'TP_FLOAT':
					return this.inputString(OBJ_elemento,"frm_" + TAG_nombre,"number",STR_class,OBJ_funcion);
				break;
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
	this.select = function(OBJ_elemento,STR_nombre,STR_class,OBJ_funcion,OBJ_datos = null,value = null) {
		let STR_funcion = "";
		if(OBJ_elemento["MULTIPLE"] === undefined) OBJ_elemento["MULTIPLE"] = 0;
		if(OBJ_elemento["DISABLED"] === undefined) OBJ_elemento["DISABLED"] = 0;
		if(OBJ_funcion !== null) {
			for(var i in OBJ_funcion) {
				if(STR_funcion != "") STR_funcion += " ";
				STR_funcion += i + "=" + OBJ_funcion[i];
			}
		}
		if(OBJ_datos === null) OBJ_datos = this.selector();
		let return_STR = "<select " + (OBJ_elemento["MULTIPLE"] ? "multiple='true'" : "data-allow-clear='true'") + " " + (OBJ_elemento["DISABLED"] ? "disabled='true'" : "") +
										" " + (OBJ_elemento["NECESARIO"] ? "required='true'" : "") + " " +
										STR_funcion + " style='100%' ng-name='" + STR_nombre + "' name='" +
										STR_nombre + "' id='" + STR_nombre + "' class=\"" + STR_class + " select__2\" data-placeholder='" + OBJ_elemento["NOMBRE"] + "'>";
		return_STR += "<option value=''></option>";
		for(var i in OBJ_datos) {
			if(value !== null)
				return_STR += "<option " + ((value == i) ? "selected='true'" : "") + " value='" + i + "'>" + OBJ_datos[i] + "</option>";
			else
				return_STR += "<option value='" + i + "'>" + OBJ_datos[i] + "</option>";
		}
		return_STR += "</select>";
		return return_STR;
	}
	this.selector = function(ARR_resultado = this.resultado) {
		let ARR_aux = {};
		if(this.objeto['VISIBLE'] === undefined) return ARR_aux;

		let OBJ_attr = this.objeto['ATRIBUTOS'];
		let OBJ_formato = this.objeto['VISIBLE'];
		let STR_form = OBJ_formato['TEXTO'];

		for(var INT_resultado in ARR_resultado) {
			let OBJ_aux = {}
			OBJ_aux[ARR_resultado[INT_resultado]["id"]] = "";
			let STR_form = OBJ_formato['TEXTO'];
			for(var i in OBJ_formato['ATTR']) {
				let STR_attr = OBJ_formato['ATTR'][i];
				if(OBJ_attr[STR_attr]['TIPO'] != 'TP_RELACION') {
					STR_form = STR_form.replace('/' + OBJ_formato['ATTR'][i] + '/', ARR_resultado[INT_resultado][OBJ_formato['ATTR'][i]])
				} else {
					if(this.entidad == OBJ_attr[STR_attr]['relacion']['tabla']) {
						let OBJ_resultado = this.busqueda('id',ARR_resultado[INT_resultado][OBJ_formato['datos'][i]]);
						let STR = this.resultado_1('id',ARR_resultado[INT_resultado][OBJ_formato['datos'][i]]);
						if(STR == "") {
							STR_form = STR_form.replace('/' + OBJ_formato['datos'][i] + '/,', "");
							STR_form = STR_form.trim();
						} else
							STR_form = STR_form.replace('/' + OBJ_formato['datos'][i] + '/', STR);
					} else {
						let NEW_entidad = new Pyrus(ipcRenderer, OBJ_attr[STR_attr]['relacion']['tabla']);
						let OBJ_resultado = NEW_entidad.busqueda('id',ARR_resultado[INT_resultado][OBJ_formato['datos'][i]]);
						let STR = NEW_entidad.resultado_1('id',ARR_resultado[INT_resultado][OBJ_formato['datos'][i]]);
						STR_form = STR_form.replace('/' + OBJ_formato['datos'][i] + '/', STR);
					}
				}
			}
			ARR_aux[ARR_resultado[INT_resultado]["id"]] = STR_form;
			//ARR_aux.push(OBJ_aux);
		}
		return ARR_aux;
	}
	this.formularioDato = function(t,id) {
		let dom = $(t);
		let OBJ_dato = this.busqueda("id",id);// Datos
		
		let OBJ_attr = this.objeto["GUARDADO_ATTR"];
		let OBJ_datos = this.objeto["ATRIBUTOS"];
		let ARR_aux = [];
		if(OBJ_dato === undefined) return;
		for(var x in OBJ_attr) {
			if(OBJ_attr[x]["TIPO"] != "array") {
				if(dom.find("*[name='frm_" + x + "']").length) {
					if(OBJ_datos[x]["FORMATO"] === undefined)
						dom.find("*[name='frm_" + x + "']").val(OBJ_dato[x]).trigger("change");
					else {
						aux = userDATOS.parseJSON(OBJ_dato[x]);
						if(aux !== null)
							dom.find("*[name='frm_" + x + "']").val(aux).trigger("change");
					}
				}
			} else {
				if(window[OBJ_attr[x]["VAR"]] === undefined) window[OBJ_attr[x]["VAR"]] = [];
				let aux = JSON.parse(OBJ_dato[x])
				for(var i in aux) {
					if(window[OBJ_attr[x]["VAR"]][aux[i]] === undefined) window[OBJ_attr[x]["VAR"]][aux[i]] = "";
					dom.find(OBJ_attr[x]["CLASS"]).append("<li class=\"list-group-item\">" + aux[i] + "<i class=\"text-danger fas fa-times-circle btn-click float-right\" onclick=\"userDATOS.removeATTRul(this)\"></i></li>");
				}
			}
		}
	}
	/*
	 * Función para la busqueda de un elemento. Devuelve TRUE o FALSE
	 */
	this.search = function(OBJ_buscar,BOOL_editar) {
		let ARR_busqueda = $.map(this.resultado, function(value, index) { return [value]; });

		let ARR_aux = ARR_busqueda.filter(function(x) {
			return Object.keys(OBJ_buscar).every(function(c) {
      	return x[c] == OBJ_buscar[c]
    	});//x[OBJ_buscar["ATTR"]] == OBJ_buscar["VALUE"] && x["elim"] == 0;
		});
		if(BOOL_editar) return ARR_aux.length <= 1;
		return ARR_aux.length == 0;
	}

	/*
	 *
	 */
	this.remove = function(id) {
		let OBJ_eliminado = this.busqueda("id",id);
		OBJ_eliminado["elim"] = 1;

		this.guardar_1(OBJ_eliminado);
	}
	/**
	 *
	 */
	this.formulario = function(action, t = null , append = false, form = true) {
		let STR_form = "";
		if(form) STR_form = "<form novalidate id=\"frm\" onsubmit=\"event.preventDefault(); userDATOS.submit(this);\" method=\"POST\" action=\"" + action + "\" class=\"p-2\" accept-charset=\"utf-8\">" + this.formulario_OK() + "</form>";
		else STR_form = this.formulario_OK();

		if(t !== null) {
			if(append) $(t).append(STR_form);
			else $(t).html(STR_form);
		}
		else return STR_form;
	}
	/**
	 *
	 */
	this.formulario_OK = function(id = "") {
		if(window.formulario === undefined)
			window.formulario = [];

		if(window.formulario[this.entidad] === undefined) {
			window.formulario[this.entidad] = "";

			let OBJ_funciones = {}
			let ARR_form = this.objeto['FORM'];

			if(this.objeto['FORM_CLASS'] === undefined) this.objeto['FORM_CLASS'] = 'form-control';
			let STR_class = this.objeto['FORM_CLASS'];

			if(this.objeto['FUNCIONES'] !== undefined) OBJ_funciones = this.objeto['FUNCIONES'];

			if(ARR_form !== undefined) {
				for(var i in ARR_form) {
					let STR_input = ""
					for(var e in ARR_form[i]) {
						let AUX_nombre = e + (id != "" ? "_" + id : "");
						let OBJ_funcion = {};
						let STR_aux = ARR_form[i][e];

						if(this.objeto['FUNCIONES'] !== undefined)
		          if(this.objeto['FUNCIONES'][e] !== undefined)
		            OBJ_funcion = this.objeto['FUNCIONES'][e];
						STR_input += STR_aux.replace('/' + e + '/',this.inputAdecuado(this.especificacion[e],e,AUX_nombre,STR_class,OBJ_funcion));
					}
					window.formulario[this.entidad] += '<div class="form-group">' +
									'<div class="row">' + STR_input + '</div>' +
								'</div>';
				}
			}

			return window.formulario[this.entidad];
		} else return window.formulario[this.entidad];
	}
	/**
	 *
	 */
	this.formulario_BTN = function(t,obj) {
		let dom = $(t);
		let STR_boton = '<div class="" style="padding-top: .5em">' +
						obj +
					'</div>';
		dom.append(STR_boton);
	}
	/**
	 *
	 */
	this.mostrar_1 = function(id,attr = "id") {
		if(this.objeto["VISIBLE"] === undefined) return "";
		if(window.mostrar_1 === undefined) window.mostrar_1 = []
		if(window.mostrar_1[this.entidad] === undefined) window.mostrar_1[this.entidad] = [];
		if(window.mostrar_1[this.entidad][id] === undefined) {
			window.mostrar_1[this.entidad][id] = "";
			let aux = this.busqueda(attr,id);
			let STR_aux = this.objeto["VISIBLE"]["TEXTO"];
			let ATTR_aux = this.objeto["VISIBLE"]["ATTR"];
			if(aux === null) return "SIN DATO";
			for(var i in ATTR_aux) {
				if(this.especificacion[ATTR_aux[i]]["TIPO"] == "TP_RELACION") {
					e = this.especificacion[ATTR_aux[i]]["RELACION"]["TABLA"];
					a = this.especificacion[ATTR_aux[i]]["RELACION"]["ATTR"];
					pyrusAux = new Pyrus(e,false);
					STR_aux = STR_aux.replace("/" + ATTR_aux[i] + "/",pyrusAux.mostrar_1(aux[ATTR_aux[i]]));
					//
				} else
					STR_aux = STR_aux.replace("/" + ATTR_aux[i] + "/",aux[ATTR_aux[i]]);
			}
			window.mostrar_1[this.entidad][id] = STR_aux;
		}
		return window.mostrar_1[this.entidad][id];
	}
	/**
	 * Función que completa los datos de una entidad, ideal para mostrar
	 * con todos los campos y sus datos.
	 */
	this.resultado_1 = function(attr,val) {
		let STR_dato = "";
		if(this.objeto['VISIBLE'] === undefined || val == 0) return STR_dato;
		let OBJ_attr = this.especificacion;
		let OBJ_formato = this.objeto['VISIBLE'];
		let STR_formato = OBJ_formato["TEXTO"];
		let OBJ_dato = this.busqueda(attr,val);

		for(var i in OBJ_formato["ATTR"]) {
			let AUX_attr = OBJ_formato["ATTR"][i];
			let aux = OBJ_attr[AUX_attr];
			if(aux["TIPO"] == "TP_RELACION") {
				let NEW_obj = new Pyrus(aux["RELACION"]["TABLA"]);
				if(OBJ_dato === undefined) STR_formato = "SIN DATO";
				else {
					let AUX_OBJ_dato = NEW_obj.busqueda("id", OBJ_dato[AUX_attr]);
					if(AUX_OBJ_dato === undefined) {
						STR_formato = STR_formato.replace('/' + AUX_attr + '/,', '');
						STR_formato = STR_formato.trim();
					} else
						STR_formato = STR_formato.replace('/' + AUX_attr + '/', NEW_obj.resultado_1("id", OBJ_dato[AUX_attr]));
				}
			} else  {
				if(OBJ_dato !== undefined)
					STR_formato = STR_formato.replace('/' + AUX_attr + '/', OBJ_dato[AUX_attr]);
				else STR_formato = "SIN DATO";
			}
		}
		STR_dato = STR_formato;
		return STR_dato;
	}
	/**
	 *
	 */
 	this.vista = function(t = null, id = null) {
 		let STR_vista = "";
 		let OBJ_dato = null;
 		if(id !== null)
 			OBJ_dato = this.busqueda("id",id);
 		else
 			OBJ_dato = this.resultado[0];
 		for(var x in this.objeto["VISTA"]) {
 			for(var attr in this.objeto["VISTA"][x]) {
				let OBJ_asociado = "";
				let STR_aux = this.objeto["VISTA"][x][attr];
				if(this.especificacion[attr]["ASOCIADO"] !== undefined) {
					OBJ_asociado = this.especificacion[attr]["ASOCIADO"];
					let AUX_nombre = e + "_" + x;
					OBJ_asociado = this.inputAdecuado(OBJ_asociado,"",AUX_nombre,"form-control",null);
				}

				STR_aux = STR_aux.replace("/" + attr + "/",OBJ_dato[attr] + OBJ_asociado);
				STR_vista = STR_aux;
 			}
 		}
		if(t === null)
			return STR_vista;
		else
 			$(t).html(STR_vista);
 	}
	this.visible = function(id) {
	 let STR_vista = "";
	 let OBJ_dato = this.busqueda("id",id);
	 let OBJ = this.objeto["VISIBLE"];
	 if(OBJ === undefined) return "";
	 let STR_aux = OBJ["TEXTO"];
	 for(var x in OBJ["ATTR"])
		 STR_aux = STR_aux.replace("/" + OBJ["ATTR"][x] + "/",OBJ_dato[OBJ["ATTR"][x]]);

	 return STR_aux;
	}
	/**
	 * Función para la busqueda de uno o varios datos que coincidan ciertos parámetros.
	 * Devuelve un objeto o ARRAY de objetos de la entidadd
	 */
	this.busqueda = function(attr,val,count = 1){
		let data = null;
		if(count) {
			this.query("get_uno",{"entidad":this.entidad, "column": attr, "value":val},function(e) { data = e; }, null, false);
			return data;
		}
		else {
			this.query("get_uno",{"entidad":this.entidad, "column": attr, "value":val},function(e) { data = e; }, null, false);
			return data;
		}
	}
	/**
	 * Función para guardar la entidad
	 *@param t STRING: contenedor de donde sacar los elementos
	 */
	this.guardar = function(t) {
		let dom = $(t);
		let ATTR_guardado = this.objeto["GUARDADO_ATTR"];
	}
	/**
	 *
	 */
	this.guardar_1 = function(OBJ_dato,return_FLAG = false) {
		let dato_guardar = {};
		let returnE = {};

		returnE["id"] = null;
		returnE["flag"] = true;
		if(this.objeto["UNIQUE"] !== undefined) {
			let aux = {};
			for(var i in this.objeto["UNIQUE"])
				aux[this.objeto["UNIQUE"][i]] = OBJ_dato[this.objeto["UNIQUE"][i]];
			aux["elim"] = 0;
			if(!this.search(aux,(OBJ_dato["id"] == "nulo" ? false : true))) {
				returnE["flag"] = false;
				return returnE;
			}
		}
		dato_guardar["entidad"] = this.entidad;
		for(var i in this.especificacion) {
			if(this.especificacion[i]["FORMATO"] === undefined) continue;
			if(this.especificacion[i]["FORMATO"] != "json") continue;
			if(OBJ_dato[i] === null) continue;
			data = OBJ_dato[i];
			if((typeof data) == 'object') {
				if(Array.isArray(data))
					OBJ_dato[i] = JSON.stringify(data);
				else {
					s = Object.keys(data).map(function(k,i){
						if(Array.isArray(data[k])) {
							a = "";
							for(var i in data[k]) {
								cadena = data[k][i];
								if(a != "") a += ",";
								a += "'" + cadena.replace(/['"]+/g, '\"') + "'";
					    }
							return "'" + k + "':\"[" + a + "]\"";
					  } else return "'" + k + "':'" + data[k] + "'";
					});
					OBJ_dato[i] = "{" + s.join(',') + "}";//PARSEO a string
				}
			}
		}
		dato_guardar["objeto"] = OBJ_dato;
		dato_guardar["attr"] = this.objeto["ATRIBUTOS"];

		this.query("guardar_uno_generico",dato_guardar, function(m) {
			returnE["id"] = m;
		}, null, false);
		return returnE;
	};
	/**
	 * Función que verifica la relación con otra entidad y devuelve
	 * los valores indicados.
	 *
	 * @param string attr El atributo de la entidad que tiene la relación con la otra
	 */
	this.relacion = function(attr) {
		//verifico que el atributo existe en la especifiación
		//y si es el tipo correcto
		if(this.especificacionOBJ[attr] === undefined) return null;
		if(this.especificacionOBJ[attr] != "TP_RELACION") return null;
		let ARR_datos = [];
		let aux = this.especificacion[attr]["RELACION"];
		for(var i in this.resultado) {
			a = null;
			x = this.resultado[i]
			if(window.AUX_relacionTABLA === undefined) window.AUX_relacionTABLA = []
			if(window.AUX_relacionTABLA[aux["TABLA"]] === undefined) {
				window.AUX_relacionTABLA[aux["TABLA"]] = new Pyrus(aux["TABLA"]);
				a = window.AUX_relacionTABLA[aux["TABLA"]];
			} else a = window.AUX_relacionTABLA[aux["TABLA"]];
			x["DATOS"] = a.busqueda(aux["ATTR"],this.resultado[i][attr]);
			ARR_datos.push(x);
		}

		return ARR_datos;
	}
	/**
	 *
	 */
	this.getContenidoCompuesto = function() {
 		let ARR_rows = [];
		for(var x in this.resultado) {
			let ARR_aux = {};
			for(var y in this.resultado[x]) {
				if(this.especificacion[y] === undefined) continue;

				if(this.especificacion[y]["TIPO"] == "TP_RELACION") {
					let NEW_entidad = new Pyrus(this.especificacion[y]["RELACION"]["TABLA"]);
					ARR_aux[y] = NEW_entidad.resultado_1(this.especificacion[y]["RELACION"]["ATTR"],this.resultado[x][y]);
				} else {
					//if(this.especificacion[y]["FORMATO"] === undefined)
						ARR_aux[y] = this.resultado[x][y];

				}
			}
			ARR_rows.push(ARR_aux);
		}
 		return ARR_rows;
 	}
	this.getContenidoDATATABLE = function() {
		let OBJ_attr = this.especificacion;
		let ARR_resultado = null;
		this.query("get_all",{"entidad":this.entidad ,"column": "", "value": ""},function(e) { ARR_resultado = e },null,false)
		let ARR_rows = [];

		for(var x in ARR_resultado) {//
			let ARR_aux = [];
			for(var y in ARR_resultado[x]) {
				if(OBJ_attr[y] === undefined) continue;
				if(OBJ_attr[y]["VISIBILIDAD"] == "TP_BANDERA" || OBJ_attr[y]["VISIBILIDAD"] == "TP_INVISIBLE" || OBJ_attr[y]["VISIBILIDAD"] == "TP_OCULTO") continue;
				if(OBJ_attr[y]["TIPO"] == "TP_RELACION") {
					///////// Modificar para que busque varios elementos
					///////// Solo acepta json
					if(OBJ_attr[y]["FORMATO"] === undefined) {
						pyrusAux = new Pyrus(OBJ_attr[y]["RELACION"]["TABLA"], false);
						ARR_aux.push(pyrusAux.mostrar_1(ARR_resultado[x][y],OBJ_attr[y]["RELACION"]["ATTR"]));
					} else {
						if(OBJ_attr[y]["FORMATO"] == "json") {
							pyrusAux = new Pyrus(OBJ_attr[y]["RELACION"]["TABLA"], false);
							let aux = JSON.parse(ARR_resultado[x][y]);
							let h = "";
							for(var xx in aux)
								h += "<p class='m-0'>" +
									pyrusAux.mostrar_1(aux[xx],OBJ_attr[y]["RELACION"]["ATTR"]) + "</p>";
							ARR_aux.push(h);
						} else ARR_aux.push("");////FORMATO NO JSON
					}
				} else {
					if(OBJ_attr[y]["FORMATO"] === undefined)
						ARR_aux.push(ARR_resultado[x][y])
					else {
						switch(OBJ_attr[y]["FORMATO"]) {
							case "json":
								if(ARR_resultado[x][y] == "" || ARR_resultado[x][y] === null) ARR_aux.push("");
								else {
									let aux = JSON.parse(ARR_resultado[x][y]);
									ARR_aux.push(aux.join(" - "));
								}
								break;
							case "enum":
								ARR_aux.push(OBJ_attr[y]["ENUM"][ARR_resultado[x][y]]);
								break;
							case "mascara":
								ARR_aux.push((OBJ_attr[y]["MASCARA"]).repeat(ARR_resultado[x][y]));
								break;
						}
					}
				}
			}
			ARR_rows.push(ARR_aux);
		}
		return ARR_rows;
	}
	this.getContenidoDATATABLEsimple = function(ARR_resultado) {
		let OBJ_attr = this.especificacion;
		let ARR_row = [];

		for(var y in ARR_resultado) {
			if(OBJ_attr[y] === undefined) continue;
			if(OBJ_attr[y]["VISIBILIDAD"] == "TP_BANDERA" || OBJ_attr[y]["VISIBILIDAD"] == "TP_INVISIBLE" || OBJ_attr[y]["VISIBILIDAD"] == "TP_OCULTO") continue;
			if(OBJ_attr[y]["TIPO"] == "TP_RELACION") {
				if(OBJ_attr[y]["FORMATO"] === undefined)
					ARR_row.push(window.variables[OBJ_attr[y]["RELACION"]["TABLA"]].mostrar_1(ARR_resultado[y],OBJ_attr[y]["RELACION"]["ATTR"]));
				else {
					if(OBJ_attr[y]["FORMATO"] == "json") {
						let aux = JSON.parse(ARR_resultado[y]);
						let h = "";
						for(var xx in aux)
							h += "<p class='m-0'>" +
								window.variables[OBJ_attr[y]["RELACION"]["TABLA"]].mostrar_1(aux[xx],OBJ_attr[y]["RELACION"]["ATTR"]) + "</p>";
						ARR_row.push(h);
					} else ARR_row.push("");////FORMATO NO JSON
				}
			} else {
				if(OBJ_attr[y]["FORMATO"] === undefined)
					ARR_row.push(ARR_resultado[y])
				else {
					switch(OBJ_attr[y]["FORMATO"]) {
						case "json":
							if(ARR_resultado[y] == "" || ARR_resultado[y] === null) ARR_row.push("");
							else {
								let aux = JSON.parse(ARR_resultado[y]);
								console.log(aux);
								ARR_row.push(aux.join(" - "));
							}
							break;
						case "enum":
							ARR_row.push(OBJ_attr[y]["ENUM"][ARR_resultado[y]]);
							break;
						case "mascara":
							ARR_row.push((OBJ_attr[y]["MASCARA"]).repeat(ARR_resultado[y]));
							break;
					}
				}
			}
		}
		return ARR_row;
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
	url_envio = url_query_local;
	let envio = { "accion":accion, "data":data };

    $.ajax({
		context: this,
		type: 'POST',
		// make sure you respect the same origin policy with this url:
		// http://en.wikipedia.org/wiki/Same_origin_policy
		url: url_envio,
		async: async,
		data: envio,
		success: function(msg){
			var devolucion = JSON.parse(msg);
			// uso call para pasarle el contexto this
			callbackOK.call(this,devolucion['data']);
		},
		error: function(msg){
			console.log(msg)
		}
	  });
  };
  /* ----------------- */
	return this.constructor();
}
