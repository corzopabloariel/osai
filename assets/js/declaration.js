/**********************************************
 * VISTA O VISIBILIDAD
 **********************************************/
/**
 * TP_VISIBLE_NUNCA
 * Declara que todos los elementos se agregan a las tablas,
 * pero se ocultan en las vistas; en formularios aparecen como "hidden".
 * Ideal para campos con valores PK
 **
 * TP_VISIBLE
 * Declara que todos los elementos son visibles,
 * tanto en tabla como en formularios con el formato adecuado
 **
 * TP_OCULTO
 * Declara que todos los elementos son ocultos en tablas,
 * en los formularios se muestra como corresponde
 **
 * TP_INVISIBLE
 * Declara que todos los elemetos no son agregados en tabla,
 * en formulario aparecen como "hidden".
 * Ideal para guardar elementos con algun formato particular que se desee guardar.
 **
 * TP_BANDERA y TP_INVISIBLE
 * Declara que todos los elementos son ocultos en formulario,
 * y tablas.
 */
/**********************************************
 * TIPOS
 **********************************************/
/**
 * TP_PK
 * Declara valores enteros, correspondiente a PK
 **
 * TP_STRING
 * Declara valores alfanuméricos, se representa con INPUT
 **
 * TP_RELACION
 * Declara valores enteros, corresponde a FK
 * Relaciones con otras tablas
 **
 * TP_STRING_L
 * Declara valores alfanuméricos, se representa con TEXTAREA
 **
 * TP_PASSWORD
 * Declara valores alfanuméricos para elementos tipo PASSWORD
 **
 * TP_MASCARA
 * Declara una variable que contiene un valor entero
 * que indica la repetición de un valor MASCARA
 **
 * TP_BOLEANO
 * Declara valor entero - 1 o 0
 */

const ENTIDAD = {
	'usuario': {
		'ATRIBUTOS':  {
			'id':        {
                    'TIPO': 'TP_PK',
								    'VISIBILIDAD': 'TP_VISIBLE_NUNCA',
								    'NECESARIO': 0
      },
			'autofecha': {
									 'TIPO': 'TP_FECHA_LARGA',
									 'VISIBILIDAD': 'TP_BANDERA',
									 'NECESARIO': 0
			},
 		 'id_cliente':      {
 									 'TIPO': 'TP_RELACION',
 									 'VISIBILIDAD': 'TP_INVISIBLE',
 									 'NECESARIO': 0,
 									 'RELACION': {'TABLA':'cliente','ATTR':'id'}
 		 	},
			'user':      {
                    'TIPO': 'TP_STRING',
								    'VISIBILIDAD': 'TP_VISIBLE',
								    'NOMBRE': 'usuario',
								    'NECESARIO': 1
      },
			'pass':      {
                    'TIPO': 'TP_PASSWORD',
                    'VISIBILIDAD': 'TP_OCULTO',
                    'NOMBRE': 'contraseña',
                    'NECESARIO': 1
      },
			'cantidad':  {
                    'TIPO': 'TP_MASCARA',
                    'VISIBILIDAD': 'TP_OCULTO',
                    'NOMBRE': 'contraseña',
										'FORMATO': 'mascara',
                    'NECESARIO': 1,
                    'MASCARA': '*'
      },
			'nivel':     {//TIPO de usuario
										'TIPO': 'TP_RELACION',
										'VISIBILIDAD': 'TP_VISIBLE',
										'NECESARIO': 1,
										'RELACION': {'TABLA':'usuario_nivel','ATTR':'nivel'}
										//'FORMATO': 'enum',
                    //'ENUM': {1:'Super',2:'Relevo',3:'Monitor'},
      },
			'activo':    {
										'TIPO': 'TP_ENUM',
										'VISIBILIDAD': 'TP_VISIBLE',
										'NOMBRE': 'Estado',
										'FORMATO': 'enum',
										'ENUM': {0:'Bloqueado', 1:'Activo'},
      },
			'elim':     {
                    'TIPO': 'TP_BOLEANO',
                    'VISIBILIDAD': 'TP_BANDERA',
										'DEFAULT': 0
      },
	  },
		/**
		 * Tipo de guardado de la entidad. Usado cuando se llama a GUARDAR del objeto PYRUS
		 * USUARIO: guardado especial
		 */
		'GUARDADO':    {
                    'TIPO':'USUARIO'
    },
		'UNIQUE':	['user'],
		'GUARDADO_ATTR': {'id':{'TIPO':'nulo'},'user':{'TIPO':'normal'},'nivel':{'TIPO':'normal'}/*,'id_actor':{'TIPO':'normal'}*/},
    'FORM':        [
                    {'user': '<div class="col col-12">/user/</div>'},
                		{'pass': '<div class="col col-12">/pass/</div>'}
    ],
    'VISTA':       [
              			{'user': '<div class="col col-4"><strong>{nombre}</strong></div><div class="col col-8"><span class="hover user_datos">/user/ <i onclick="userDATOS.editarUSER(\'user\')" class="fas fa-pen"></i></span></div>'},
              			{'cantidad': '<div class="col col-4"><strong>{nombre}</strong></div><div class="col col-8"><span class="hover user_datos">/cantidad/ <i onclick="userDATOS.editarUSER(\'pass\')" class="fas fa-pen"></i></span></div>'},
              			{'nivel': '<div class="col col-4"><strong>{nombre}</strong></div><div class="col col-8">/nivel/</div>'},
		],
		'VISIBLE':     {
                    'TEXTO': '/user/',
                    'ATTR': ['user']
    },
		'FORM_CLASS':   'form-user',
	},
	'usuario_nivel': {
		'ATRIBUTOS':  {
			'id':        {
                    'TIPO': 'TP_PK',
								    'VISIBILIDAD': 'TP_VISIBLE_NUNCA',
								    'NECESARIO': 0
      },
			'autofecha': {
									 'TIPO': 'TP_FECHA_LARGA',
									 'VISIBILIDAD': 'TP_BANDERA',
									 'NECESARIO': 0
			},
			'nombre':      {
                    'TIPO': 'TP_STRING',
								    'VISIBILIDAD': 'TP_VISIBLE',
								    'NECESARIO': 1
      },
 		  'nivel': {
 									 'TIPO': 'TP_ENTERO',
 									 'VISIBILIDAD': 'TP_VISIBLE',
 									 'NECESARIO': 0
 		 	},
			'data':      {
                    'TIPO': 'TP_STRING',
										'FORMATO': 'json',
								    'VISIBILIDAD': 'TP_VISIBLE',
								    'NECESARIO': 1
      },
			'acciones':	{
                    'TIPO': 'TP_STRING',
								    'VISIBILIDAD': 'TP_VISIBLE',
								    'NECESARIO': 1
			},
			'elim':     {
                    'TIPO': 'TP_BOLEANO',
                    'VISIBILIDAD': 'TP_BANDERA',
										'DEFAULT': 0
      },
	  },
		'VISIBLE': {"TEXTO": "/nombre/","ATTR":["nombre"]},
	},
	'cliente': {
		'ATRIBUTOS':  {
			'id':        {
                    'TIPO': 'TP_PK',
								    'VISIBILIDAD': 'TP_VISIBLE_NUNCA',
								    'NECESARIO': 0
      },
			'autofecha': {
									 'TIPO': 'TP_FECHA_LARGA',
									 'VISIBILIDAD': 'TP_BANDERA',
									 'NECESARIO': 0
			},
			'nombre':      {
                    'TIPO': 'TP_STRING',
								    'VISIBILIDAD': 'TP_VISIBLE',
								    'NECESARIO': 1
      },
			'elim':     {
                    'TIPO': 'TP_BOLEANO',
                    'VISIBILIDAD': 'TP_BANDERA',
										'DEFAULT': 0
      },
	  },
 	  'VISIBLE': {"TEXTO": "/nombre/","ATTR":["nombre"]},
 	  'UNIQUE':	['nombre'],
 	  'GUARDADO_ATTR': {'id':{'TIPO':'nulo'},'nombre':{'TIPO':'normal'}/*,'id_actor':{'TIPO':'normal'}*/},
	  'GUARDADO':		'SIMPLE',
	  'FORM':        [
									 {'id':'/id/','nombre': '<div class="col col-12">/nombre/</div>'},
									 //{'id_actor': '<div class="col col-4">/id_actor/</div>'},
	  ],
	  'NOMBRE':			'Unidad de análisis'
	},
	'medio': {
		'ATRIBUTOS':  {
			'id':        {
                    'TIPO': 'TP_PK',
								    'VISIBILIDAD': 'TP_VISIBLE_NUNCA',
								    'NECESARIO': 0
      },
			'nombre':      {
                    'TIPO': 'TP_STRING',
								    'VISIBILIDAD': 'TP_INVISIBLE',
								    'NECESARIO': 1
      },
			'image':      {
                    'TIPO': 'TP_STRING',
								    'VISIBILIDAD': 'TP_INVISIBLE',
								    'NOMBRE': 'imagen',
								    'NECESARIO': 1
      },
			'medio':      {
                    'TIPO': 'TP_STRING',
								    'VISIBILIDAD': 'TP_VISIBLE',
										'NOMBRE': 'nombre',
								    'NECESARIO': 1
      },
 		 'id_medio_tipo':    {
 									 'TIPO': 'TP_RELACION',
 									 'VISIBILIDAD': 'TP_VISIBLE',
									 'NOMBRE': 'tipo',
 									 'NECESARIO': 0,
 									 'RELACION': {'TABLA':'medio_tipo','ATTR':'id'}
 		 	},
			'elim':     {
                    'TIPO': 'TP_BOLEANO',
                    'VISIBILIDAD': 'TP_BANDERA',
										'DEFAULT': 0
      },
		},
		'VISIBLE': {"TEXTO": "/medio/","ATTR":["medio"]},
		'UNIQUE':	['medio'],
		'GUARDADO_ATTR': {'id':{'TIPO':'nulo'},'medio':{'TIPO':'normal'},'id_medio_tipo':{'TIPO':'normal'}},
		'GUARDADO':		'SIMPLE',
		'FORM':        [
		                {'id':'/id/','medio': '<div class="col col-12">/medio/</div>'},
										{'id_medio_tipo':'<div class="col col-12">/id_medio_tipo/</div>'},
		],
		'NOMBRE':			'Medio'
	},
	'medio_tipo': {//Nacionales / Provinciales / Regionales
		'ATRIBUTOS':  {
			'id':        {
                    'TIPO': 'TP_PK',
								    'VISIBILIDAD': 'TP_VISIBLE_NUNCA',
								    'NECESARIO': 0
      },
			'autofecha': {
									 'TIPO': 'TP_FECHA_LARGA',
									 'VISIBILIDAD': 'TP_BANDERA',
									 'NECESARIO': 0
			},
			'nombre':      {
                    'TIPO': 'TP_STRING',
								    'VISIBILIDAD': 'TP_VISIBLE',
								    'NECESARIO': 1
      },
			'elim':     {
                    'TIPO': 'TP_BOLEANO',
                    'VISIBILIDAD': 'TP_BANDERA',
										'DEFAULT': 0
      },
		},
		'VISIBLE': {"TEXTO": "/nombre/","ATTR":["nombre"]},
	},
	'medio_destaque': {//Ponderacion
		'ATRIBUTOS':  {
			'id':        {
                    'TIPO': 'TP_PK',
								    'VISIBILIDAD': 'TP_VISIBLE_NUNCA',
								    'NECESARIO': 0
      },
			'autofecha': {
									 'TIPO': 'TP_FECHA_LARGA',
									 'VISIBILIDAD': 'TP_BANDERA',
									 'NECESARIO': 0
			},
 		 'id_medio':    {//ACTOR asociado
 									 'TIPO': 'TP_RELACION',
 									 'VISIBILIDAD': 'TP_VISIBLE',
									 'NOMBRE': 'medio',
 									 'NECESARIO': 1,
 									 'RELACION': {'TABLA':'medio','ATTR':'id'}
 		 	},
			'lugar':      {
                    'TIPO': 'TP_STRING',
								    'VISIBILIDAD': 'TP_VISIBLE',
								    'NECESARIO': 1
      },
			'destaque':      {
                    'TIPO': 'TP_STRING',
								    'VISIBILIDAD': 'TP_VISIBLE',
								    'NECESARIO': 0
      },
			'referencia':      {
                    'TIPO': 'TP_ENTERO',
								    'VISIBILIDAD': 'TP_VISIBLE',
								    'NECESARIO': 1,
										'ALIGN': 'text-right'
      },
			'elim':     {
                    'TIPO': 'TP_BOLEANO',
                    'VISIBILIDAD': 'TP_BANDERA',
										'DEFAULT': 0
      },
		},
		'VISIBLE': {"TEXTO": "/id_medio/ - /lugar/: /referencia/","ATTR":["id_medio","lugar","referencia"]},
		'UNIQUE':	['id_medio','lugar','destaque'],
		'GUARDADO_ATTR': {'id':{'TIPO':'nulo'},'id_medio':{'TIPO':'normal'},'lugar':{'TIPO':'normal'},'destaque':{'TIPO':'normal'},'referencia':{'TIPO':'normal'}},
		'GUARDADO':		'SIMPLE',
		'FORM':        [
		                {'id':'/id/','id_medio': '<div class="col col-12">/id_medio/</div>'},
										{'lugar':'<div class="col col-6">/lugar/</div>','destaque': '<div class="col col-6">/destaque/</div>'},
										{'referencia': '<div class="col col-12">/referencia/</div>'},
		],
		'NOMBRE':			'Destaque'
	},
	/*'medio_ponderacion': {//Nacionales / Provinciales / Regionales
		'ATRIBUTOS':  {
			'id':        {
                    'TIPO': 'TP_PK',
								    'VISIBILIDAD': 'TP_VISIBLE_NUNCA',
								    'NECESARIO': 0
      },
			'autofecha': {
									 'TIPO': 'TP_FECHA_LARGA',
									 'VISIBILIDAD': 'TP_BANDERA',
									 'NECESARIO': 0
			},
 		 'id_medio':    {//ACTOR asociado
 									 'TIPO': 'TP_RELACION',
 									 'VISIBILIDAD': 'TP_VISIBLE',
									 'NOMBRE': 'medio',
 									 'NECESARIO': 0,
 									 'RELACION': {'TABLA':'medio','ATTR':'id'}
 		 	},
			'lugar':      {
                    'TIPO': 'TP_STRING',
								    'VISIBILIDAD': 'TP_VISIBLE',
								    'NECESARIO': 1
      },
			'destaque':   {
                    'TIPO': 'TP_STRING',
								    'VISIBILIDAD': 'TP_VISIBLE',
								    'NECESARIO': 1
      },
			'referencia': {
                    'TIPO': 'TP_ENTERO',
								    'VISIBILIDAD': 'TP_VISIBLE',
								    'NECESARIO': 1,
										'NOMBRE': 'referencia manual'
      },
			'elim':     {
                    'TIPO': 'TP_BOLEANO',
                    'VISIBILIDAD': 'TP_BANDERA',
										'DEFAULT': 0
      },
		},
		'VISIBLE': {"TEXTO": "/nombre/","ATTR":["nombre"]},
	},*/
	'actor': {
		'ATRIBUTOS':  {
			'id':        {
                    'TIPO': 'TP_PK',
								    'VISIBILIDAD': 'TP_VISIBLE_NUNCA',
								    'NECESARIO': 0
      },
			'autofecha': {
									 'TIPO': 'TP_FECHA_LARGA',
									 'VISIBILIDAD': 'TP_BANDERA',
									 'NECESARIO': 0
			},
			'nombre':      {
                    'TIPO': 'TP_STRING',
								    'VISIBILIDAD': 'TP_VISIBLE',
								    'NECESARIO': 1
      },
			'apellido':      {
                    'TIPO': 'TP_STRING',
								    'VISIBILIDAD': 'TP_VISIBLE',
								    'NECESARIO': 1
      },
			'atributos':   {
                    'TIPO': 'TP_STRING',
										'FORMATO': 'json',
								    'VISIBILIDAD': 'TP_VISIBLE',
								    'NECESARIO': 1
      },
 		 'id_cliente':   {//para asociar un actor a un cliente
 									 'TIPO': 'TP_RELACION',
 									 'VISIBILIDAD': 'TP_VISIBLE',
									 'NOMBRE': 'cliente',
 									 'NECESARIO': 0,
 									 'RELACION': {'TABLA':'cliente','ATTR':'id'}
 		 	},
			'id_cargo':    {//ACTOR asociado
									 'TIPO': 'TP_RELACION',
									 // 'TIPO': 'TP_STRING',
									 'VISIBILIDAD': 'TP_VISIBLE',
									 'NOMBRE': 'cargo',
									 'FORMATO': 'json',
									 'MULTIPLE': 1,
									 'NECESARIO': 0,
									 'RELACION': {'TABLA':'attr_cargo','ATTR':'id'}
			},
			'id_poder':    {//ACTOR asociado
									 'TIPO': 'TP_RELACION',
									 // 'TIPO': 'TP_STRING',
									 'VISIBILIDAD': 'TP_VISIBLE',
									 'NOMBRE': 'poder',
									 'MULTIPLE': 1,
									 'NECESARIO': 0,
									 'FORMATO': 'json',
									 'RELACION': {'TABLA':'attr_poder','ATTR':'id'}
			},
			'id_nivel':    {//ACTOR asociado
									 'TIPO': 'TP_RELACION',
									 // 'TIPO': 'TP_STRING',
									 'VISIBILIDAD': 'TP_VISIBLE',
									 'NOMBRE': 'nivel',
									 'MULTIPLE': 1,
									 'NECESARIO': 0,
									 'FORMATO': 'json',
									 'RELACION': {'TABLA':'attr_nivel','ATTR':'id'}
			},
			'id_partido':    {//ACTOR asociado
									 'TIPO': 'TP_RELACION',
									 // 'TIPO': 'TP_STRING',
									 'VISIBILIDAD': 'TP_VISIBLE',
									 'NOMBRE': 'partido político',
									 'MULTIPLE': 1,
									 'NECESARIO': 0,
									 'FORMATO': 'json',
									 'RELACION': {'TABLA':'attr_partido','ATTR':'id'}
			},
			'id_alianza':    {//ACTOR asociado
									 'TIPO': 'TP_RELACION',
									 // 'TIPO': 'TP_STRING',
									 'VISIBILIDAD': 'TP_VISIBLE',
									 'NOMBRE': 'alianza electoral',
									 'MULTIPLE': 1,
									 'NECESARIO': 0,
									 'FORMATO': 'json',
									 'RELACION': {'TABLA':'attr_alianza','ATTR':'id'}
			},
			'id_campo':    {//ACTOR asociado
									 'TIPO': 'TP_RELACION',
									 // 'TIPO': 'TP_STRING',
									 'VISIBILIDAD': 'TP_VISIBLE',
									 'NOMBRE': 'campo',
									 'MULTIPLE': 1,
									 'NECESARIO': 0,
									 'FORMATO': 'json',
									 'RELACION': {'TABLA':'attr_campo','ATTR':'id'}
			},
			'elim':     {
                    'TIPO': 'TP_BOLEANO',
                    'VISIBILIDAD': 'TP_BANDERA',
										'DEFAULT': 0
      },
		},
		/**
		 * Para tablas que necesitan datos de otra, pero la que lo requiere no tiene relación visible
		 * TABLA.ATTR son los atributos que se mostraran en tablas
		 */
		'TABLA':		{
									'TIPO':'COMBINADO',
									'COMBINADO':'cliente',
									'ATTR':{
										'id':null,
										'nombre':null,
										'atributos': null,
										'user':'cliente',
										'cantidad':'cliente'}
									},
		'VISIBLE': {"TEXTO": "/nombre/ /apellido/","ATTR":["nombre","apellido"]},
		'GUARDADO':		'COMBINADO',
		'UNIQUE':	['id_cliente'],
		'GUARDADO_ATTR': {
				'id':{'TIPO':'nulo'},
				'nombre':{'TIPO':'normal'},
				'apellido':{'TIPO':'normal'},
				'id_cliente':{'TIPO':'normal'},
				'id_cargo':{'TIPO':'normal'},
				'id_poder':{'TIPO':'normal'},
				'id_nivel':{'TIPO':'normal'},
				'id_partido':{'TIPO':'normal'},
				'id_alianza':{'TIPO':'normal'},
				'id_campo':{'TIPO':'normal'},
				'atributos':{'TIPO':'array','VAR':'ATTR','CLASS':'.attr_actor ul'}
			},
		'GUARDADO_COMBINADO': {'TABLA':'usuario','TABLA_ATTR':'id_cliente'},
    'FORM':  [
              {'id':'/id/','nombre': '<div class="col col-6">/nombre/</div>','apellido': '<div class="col col-6">/apellido/</div>'},
							{'id_cliente': '<div class="col col-12">/id_cliente/</div>'},
							{'id_cargo': '<div class="col col-6">/id_cargo/</div>','id_poder': '<div class="col col-6">/id_poder/</div>'},
							{'id_nivel': '<div class="col col-6">/id_nivel/</div>','id_partido': '<div class="col col-6">/id_partido/</div>'},
							{'id_alianza': '<div class="col col-6">/id_alianza/</div>','id_campo': '<div class="col col-6">/id_campo/</div>'},
    ],
		'NOMBRE':			'Actor'
	},
	/**
	 *
	 */
	'instancias': {
		'ATRIBUTOS':  {
			'id':        {
                    "TIPO": "TP_PK",
								    "VISIBILIDAD": "TP_VISIBLE_NUNCA",
								    "NECESARIO": 0
      },
			'instancia': {
                    'TIPO': 'TP_STRING',
								    'VISIBILIDAD': 'TP_VISIBLE',
								    'NECESARIO': 0
      },
			'fecha': {
                    'TIPO': 'TP_STRING',
								    'VISIBILIDAD': 'TP_VISIBLE',
								    'NECESARIO': 0
      },
			'medio':      {
										'TIPO': 'TP_RELACION',
										'VISIBILIDAD': 'TP_VISIBLE',
										'NECESARIO': 0,
										'RELACION': {'TABLA':'medio','ATTR':'id'}
      }
		},
		'VISIBLE': {"TEXTO": "/medio/","ATTR":["medio"]},
	},
	'noticia': {
	 'ATRIBUTOS':  {
		 'id':        {
									 "TIPO": "TP_PK",
									 "VISIBILIDAD": "TP_VISIBLE_NUNCA",
									 "NECESARIO": 0
		 },
		 'did': {
									 'TIPO': 'TP_ENTERO',
									 'VISIBILIDAD': 'TP_VISIBLE',
									 'NECESARIO': 0,
		 },
		 'autofecha': {
									'TIPO': 'TP_FECHA_LARGA',
									'VISIBILIDAD': 'TP_BANDERA',
									'NECESARIO': 0
		 },
		 'id_noticia': {
									 'TIPO': 'TP_ENTERO',
									 'VISIBILIDAD': 'TP_VISIBLE',
									 'NECESARIO': 0,
		 },
		 'id_medio':      {
									 'TIPO': 'TP_RELACION',
									 'VISIBILIDAD': 'TP_VISIBLE',
									 'NECESARIO': 0,
									 'RELACION': {'TABLA':'medio','ATTR':'id'}
		 },
		 'id_medio_tipo':      {
									 'TIPO': 'TP_RELACION',
									 'VISIBILIDAD': 'TP_VISIBLE',
									 'NECESARIO': 0,
									 'RELACION': {'TABLA':'medio_tipo','ATTR':'id'}
		 },
		 'id_seccion':      {
									 'TIPO': 'TP_RELACION',
									 'VISIBILIDAD': 'TP_VISIBLE',
									 'NECESARIO': 0,
									 'RELACION': {'TABLA':'seccion','ATTR':'id'}
		 },
		 'url': {
									 'TIPO': 'TP_STRING',
									 'VISIBILIDAD': 'TP_VISIBLE',
									 'NECESARIO': 0
		 },
		 'video': {
									 'TIPO': 'TP_STRING',
									 'VISIBILIDAD': 'TP_VISIBLE',
									 'NECESARIO': 0
		 },
		 'titulo': {
									 'TIPO': 'TP_STRING',
									 'VISIBILIDAD': 'TP_VISIBLE',
									 'NOMBRE': 'título',
									 'NECESARIO': 0
		 },
		 'cuerpo': {
									 'TIPO': 'TP_STRING',
									 'VISIBILIDAD': 'TP_VISIBLE',
									 'NECESARIO': 0
		 },
		 'fecha': {
									'TIPO': 'TP_FECHA_LARGA',
									'VISIBILIDAD': 'TP_VISIBLE',
									'NECESARIO': 0
		 },
		 'nueva':     {
									'TIPO': 'TP_BOLEANO',
									'VISIBILIDAD': 'TP_BANDERA',
									'DEFAULT': 0
		 },
		 'estado':     {
									'TIPO': 'TP_BOLEANO',
									'VISIBILIDAD': 'TP_BANDERA',
									'DEFAULT': 0
		 },
		 'relevado':     {
									'TIPO': 'TP_BOLEANO',
									'VISIBILIDAD': 'TP_BANDERA',
									'DEFAULT': 0
		 },
		 'elim':     {
									'TIPO': 'TP_BOLEANO',
									'VISIBILIDAD': 'TP_BANDERA',
									'DEFAULT': 0
		 },
	 },
	 'VISIBLE': {"TEXTO": "/titulo/ (/id_medio/)","ATTR":["titulo","id_medio"]},
	},
	'noticiarelevo': {
	 'ATRIBUTOS':  {
		 'id':        {
									 "TIPO": "TP_PK",
									 "VISIBILIDAD": "TP_VISIBLE_NUNCA",
									 "NECESARIO": 0
		 },
		 'did': {
									 'TIPO': 'TP_ENTERO',
									 'VISIBILIDAD': 'TP_VISIBLE',
									 'NECESARIO': 0,
		 },
		 'autofecha': {
									'TIPO': 'TP_FECHA_LARGA',
									'VISIBILIDAD': 'TP_BANDERA',
									'NECESARIO': 0
		 },
		 'id_noticia': {
									 'TIPO': 'TP_ENTERO',
									 'VISIBILIDAD': 'TP_VISIBLE',
									 'NECESARIO': 0,
		 },
		 'did_noticia': {
									 'TIPO': 'TP_ENTERO',
									 'VISIBILIDAD': 'TP_VISIBLE',
									 'NECESARIO': 0,
		 },
		 'id_usuario': {
									 'TIPO': 'TP_ENTERO',
									 'VISIBILIDAD': 'TP_VISIBLE',
									 'NECESARIO': 0,
		 },
		 'id_cliente': {
									 'TIPO': 'TP_ENTERO',
									 'VISIBILIDAD': 'TP_VISIBLE',
									 'NECESARIO': 0,
		 },
			'elim':     {
									 'TIPO': 'TP_BOLEANO',
									 'VISIBILIDAD': 'TP_BANDERA',
									 'DEFAULT': 0
			},
		}
	},
	'noticiaperiodista': {
	 'ATRIBUTOS':  {
		 'id':        {
									 "TIPO": "TP_PK",
									 "VISIBILIDAD": "TP_VISIBLE_NUNCA",
									 "NECESARIO": 0
		 },
		 'did': {
									 'TIPO': 'TP_ENTERO',
									 'VISIBILIDAD': 'TP_VISIBLE',
									 'NECESARIO': 0,
		 },
		 'id_noticia': {
									 'TIPO': 'TP_ENTERO',
									 'VISIBILIDAD': 'TP_VISIBLE',
									 'NECESARIO': 0,
		 },
		 'id_periodista': {
									 'TIPO': 'TP_ENTERO',
									 'VISIBILIDAD': 'TP_VISIBLE',
									 'NECESARIO': 0,
		 },
			'elim':     {
									 'TIPO': 'TP_BOLEANO',
									 'VISIBILIDAD': 'TP_BANDERA',
									 'DEFAULT': 0
			},
		}
	},
	'proceso': {
	 'ATRIBUTOS':  {
		 'id':        {
									 "TIPO": "TP_PK",
									 "VISIBILIDAD": "TP_VISIBLE_NUNCA",
									 "NECESARIO": 0
		 },
		 'did': {
									 'TIPO': 'TP_ENTERO',
									 'VISIBILIDAD': 'TP_VISIBLE',
									 'NECESARIO': 0,
		 },
		 'id_noticia': {
									 'TIPO': 'TP_ENTERO',
									 'VISIBILIDAD': 'TP_VISIBLE',
									 'NECESARIO': 0,
		 },
		 'did_noticia': {
									 'TIPO': 'TP_ENTERO',
									 'VISIBILIDAD': 'TP_VISIBLE',
									 'NECESARIO': 0,
		 },
		 'id_usuario': {
									 'TIPO': 'TP_ENTERO',
									 'VISIBILIDAD': 'TP_VISIBLE',
									 'NECESARIO': 0,
		 },
		 'id_cliente': {
									 'TIPO': 'TP_ENTERO',
									 'VISIBILIDAD': 'TP_VISIBLE',
									 'NECESARIO': 0,
		 },
		 'cuerpo_noticia': {
									 'TIPO': 'TP_STRING_L',
									 'VISIBILIDAD': 'TP_VISIBLE',
									 'NECESARIO': 0,
		 },
		 'activo': {
									 'TIPO': 'TP_BOLEANO',
									 'VISIBILIDAD': 'TP_VISIBLE',
									 'NECESARIO': 0,
		 },
			'elim':     {
									 'TIPO': 'TP_BOLEANO',
									 'VISIBILIDAD': 'TP_BANDERA',
									 'DEFAULT': 0
			},
		}
	},
	'noticiaseccion': {
	 'ATRIBUTOS':  {
		 'id':        {
									 "TIPO": "TP_PK",
									 "VISIBILIDAD": "TP_VISIBLE_NUNCA",
									 "NECESARIO": 0
		 },
		 'did': {
									 'TIPO': 'TP_ENTERO',
									 'VISIBILIDAD': 'TP_VISIBLE',
									 'NECESARIO': 0,
		 },
		 'id_noticia': {
									 'TIPO': 'TP_ENTERO',
									 'VISIBILIDAD': 'TP_VISIBLE',
									 'NECESARIO': 0,
		 },
		 'id_seccion': {
									 'TIPO': 'TP_ENTERO',
									 'VISIBILIDAD': 'TP_VISIBLE',
									 'NECESARIO': 0,
		 },
			'elim':     {
									 'TIPO': 'TP_BOLEANO',
									 'VISIBILIDAD': 'TP_BANDERA',
									 'DEFAULT': 0
			},
		}
	},
	'noticias': {
	 'ATRIBUTOS':  {
		 'id':        {
									 "TIPO": "TP_PK",
									 "VISIBILIDAD": "TP_VISIBLE_NUNCA",
									 "NECESARIO": 0
		 },
		 'autofecha': {
									'TIPO': 'TP_FECHA_LARGA',
									'VISIBILIDAD': 'TP_BANDERA',
									'NECESARIO': 0
		 },
		 'id_unico': {
									 'TIPO': 'TP_STRING',
									 'VISIBILIDAD': 'TP_VISIBLE',
									 'NECESARIO': 0
		 },
		 'id_instancia':      {
									 'TIPO': 'TP_RELACION',
									 'VISIBILIDAD': 'TP_VISIBLE',
									 'NECESARIO': 0,
									 'RELACION': {'TABLA':'instancias','ATTR':'id'}
		 },
		 'id_medio':      {
									 'TIPO': 'TP_RELACION',
									 'VISIBILIDAD': 'TP_VISIBLE',
									 'NECESARIO': 0,
									 'RELACION': {'TABLA':'medio','ATTR':'id'}
		 },
		 'identificador': {
									 'TIPO': 'TP_ENTERO',
									 'VISIBILIDAD': 'TP_VISIBLE',
									 'NECESARIO': 0
		 },
		 'url': {
									 'TIPO': 'TP_STRING',
									 'VISIBILIDAD': 'TP_VISIBLE',
									 'NECESARIO': 0
		 },
		 'data': {
									 'TIPO': 'TP_STRING',
									 'FORMATO': 'json',
									 'VISIBILIDAD': 'TP_VISIBLE',
									 'NECESARIO': 0
		 },
		 'fecha': {
									'TIPO': 'TP_FECHA_LARGA',
									'VISIBILIDAD': 'TP_VISIBLE',
									'NECESARIO': 0
		 },
		 'cliente':  {
									'TIPO': 'TP_STRING',
									'FORMATO': 'json',
									'VISIBILIDAD': 'TP_VISIBLE',
									'NECESARIO': 0,
		 },
		 'titulo': {
									 'TIPO': 'TP_STRING',
									 'VISIBILIDAD': 'TP_VISIBLE',
									 'NECESARIO': 0
		 },
		 'estado': {
									 'TIPO': 'TP_ENUM',
									 'VISIBILIDAD': 'TP_VISIBLE',
									 'FORMATO': 'enum',
									 'ENUM': {0:'Sin procesar', 1:'Abierto',2:'Procesado'},
									 'NECESARIO': 1
		 },
		 'moderado': {
									 'TIPO': 'TP_BOLEANO',
									 'VISIBILIDAD': 'TP_BANDERA',
									 'NECESARIO': 0
		 },
		 'elim':     {
									'TIPO': 'TP_BOLEANO',
									'VISIBILIDAD': 'TP_BANDERA',
									'DEFAULT': 0
		 },
	 },
	 'VISIBLE': {"TEXTO": "/id/","ATTR":["id"]},
	},
	'noticiasproceso': {
		'ATRIBUTOS':  {
			'id':	{
					'TIPO': 'TP_PK',
					'VISIBILIDAD': 'TP_VISIBLE_NUNCA',
					'NECESARIO': 0
			},
			'did':	{
					'TIPO': 'TP_ENTERO',
					'VISIBILIDAD': 'TP_VISIBLE',
					'NECESARIO': 0,
			},
			'autofecha':	{
							'TIPO': 'TP_FECHA_LARGA',
							'VISIBILIDAD': 'TP_VISIBLE_NUNCA',
							'NECESARIO': 0
			},
			'id_noticia':	{
							'TIPO': 'TP_RELACION',
							'VISIBILIDAD': 'TP_VISIBLE',
							'NECESARIO': 1,
							'NOMBRE': 'noticia',
							'RELACION': {'TABLA':'noticia','ATTR':'id'}
			},
			'id_usuario':	{
							'TIPO': 'TP_RELACION',
							'VISIBILIDAD': 'TP_VISIBLE',
							'NECESARIO': 1,
							'NOMBRE': 'usuario',
							'RELACION': {'TABLA':'usuario','ATTR':'id'}
			},
			'data':	{//ATRIBUTOS asociados a la nota
					'TIPO': 'TP_STRING',
					'FORMATO': 'json',
					'NOMBRE': 'acción',
					'NECESARIO': 1
			},
			'elim':	{
					'TIPO': 'TP_BOLEANO',
					'VISIBILIDAD': 'TP_BANDERA',
					'DEFAULT': 0
			},
		},
		'GUARDADO_ATTR': {'id':{'TIPO':'nulo'},'id_noticia':{'TIPO':'normal'},'data':{'TIPO':'normal'}},
		'GUARDADO':		'SIMPLE',
	},

	'noticiasactor': {
		'ATRIBUTOS':  {
			'id':        {
									 'TIPO': 'TP_PK',
									 'VISIBILIDAD': 'TP_VISIBLE_NUNCA',
									 'NECESARIO': 0
			},
 		 'did': {
 									 'TIPO': 'TP_ENTERO',
 									 'VISIBILIDAD': 'TP_VISIBLE',
 									 'NECESARIO': 0,
 		 },
			'autofecha': {
									 'TIPO': 'TP_FECHA_LARGA',
									 'VISIBILIDAD': 'TP_VISIBLE_NUNCA',
									 'NECESARIO': 0
			},
			'id_noticia':  {
									 'TIPO': 'TP_RELACION',
									 'VISIBILIDAD': 'TP_VISIBLE',
									 'NECESARIO': 1,
									 'NOMBRE': 'noticia',
									 'RELACION': {'TABLA':'noticias','ATTR':'id'}
			},
			'id_actor':  {
									 'TIPO': 'TP_RELACION',
									 'VISIBILIDAD': 'TP_VISIBLE',
									 'NECESARIO': 1,
									 'NOMBRE': 'actor',
									 'RELACION': {'TABLA':'actor','ATTR':'id'}
			},
			'data':    {
									 'TIPO': 'TP_STRING',
									 'FORMATO': 'json',
									 'NOMBRE': 'acción',
									 'NECESARIO': 1
			},
			'elim':     {
									 'TIPO': 'TP_BOLEANO',
									 'VISIBILIDAD': 'TP_BANDERA',
									 'DEFAULT': 0
			},
		},
		'GUARDADO_ATTR': {'id':{'TIPO':'nulo'},'id_noticia':{'TIPO':'normal'},'id_actor':{'TIPO':'normal'},'calificacion':{'TIPO':'normal'}},
		'GUARDADO':		'SIMPLE',
		'VISIBLE':     {'TEXTO': '/id_actor/','ATTR': ['id_actor']},
	},

	'noticiasinstitucion': {
		'ATRIBUTOS':  {
			'id':        {
									 'TIPO': 'TP_PK',
									 'VISIBILIDAD': 'TP_VISIBLE_NUNCA',
									 'NECESARIO': 0
			},
 		 'did': {
 									 'TIPO': 'TP_ENTERO',
 									 'VISIBILIDAD': 'TP_VISIBLE',
 									 'NECESARIO': 0,
 		 },
			'autofecha': {
									 'TIPO': 'TP_FECHA_LARGA',
									 'VISIBILIDAD': 'TP_VISIBLE_NUNCA',
									 'NECESARIO': 0
			},
			'id_noticia':  {
									 'TIPO': 'TP_RELACION',
									 'VISIBILIDAD': 'TP_VISIBLE',
									 'NECESARIO': 1,
									 'NOMBRE': 'noticia',
									 'RELACION': {'TABLA':'noticias','ATTR':'id'}
			},
			'id_institucion':  {
									 'TIPO': 'TP_RELACION',
									 'VISIBILIDAD': 'TP_VISIBLE',
									 'NECESARIO': 1,
									 'NOMBRE': 'Institución',
									 'RELACION': {'TABLA':'attr_institucion','ATTR':'id'}
			},
			'data':    {
									 'TIPO': 'TP_STRING',
									 'FORMATO': 'json',
									 'NOMBRE': 'acción',
									 'NECESARIO': 1
			},
			'elim':     {
									 'TIPO': 'TP_BOLEANO',
									 'VISIBILIDAD': 'TP_BANDERA',
									 'DEFAULT': 0
			},
		},
		'GUARDADO_ATTR': {'id':{'TIPO':'nulo'},'id_noticia':{'TIPO':'normal'},'id_actor':{'TIPO':'normal'},'calificacion':{'TIPO':'normal'}},
		'GUARDADO':		'SIMPLE',
		'VISIBLE':     {'TEXTO': '/id_actor/','ATTR': ['id_actor']},
	},

	'noticiascliente': {
		'ATRIBUTOS':  {
			'id':	{
					'TIPO': 'TP_PK',
					'VISIBILIDAD': 'TP_VISIBLE_NUNCA',
					'NECESARIO': 0
			},
			'did':	{
					'TIPO': 'TP_ENTERO',
					'VISIBILIDAD': 'TP_VISIBLE',
					'NECESARIO': 0,
			},
			'autofecha':	{
							'TIPO': 'TP_FECHA_LARGA',
							'VISIBILIDAD': 'TP_VISIBLE_NUNCA',
							'NECESARIO': 0
			},
			'id_noticia':	{
							'TIPO': 'TP_RELACION',
							'VISIBILIDAD': 'TP_VISIBLE',
							'NECESARIO': 1,
							'NOMBRE': 'noticia',
							'RELACION': {'TABLA':'noticias','ATTR':'id'}
			},
			'id_cliente':  {
							'TIPO': 'TP_RELACION',
							'VISIBILIDAD': 'TP_VISIBLE',
							'NECESARIO': 1,
							'NOMBRE': 'cliente',
							'RELACION': {'TABLA':'cliente','ATTR':'id'}
			},
			'valoracion':    {
							'TIPO': 'TP_STRING',
							'FORMATO': 'json',
							'NOMBRE': 'valoración',
							'NECESARIO': 1
			},
			'tema':    {
							'TIPO': 'TP_STRING',
							'FORMATO': 'json',
							'NECESARIO': 1
			},
			'elim':     {
							'TIPO': 'TP_BOLEANO',
							'VISIBILIDAD': 'TP_BANDERA',
							'DEFAULT': 0
			},
		},
		'GUARDADO_ATTR': {'id':{'TIPO':'nulo'},'id_noticia':{'TIPO':'normal'},'id_cliente':{'TIPO':'normal'},'calificacion':{'TIPO':'normal'}},
		'GUARDADO':		'SIMPLE',
		'VISIBLE':     {'TEXTO': '/id_cliente/','ATTR': ['id_cliente']},
	},

	'noticiaslog': {
		'ATRIBUTOS':  {
			'id':        {
									 'TIPO': 'TP_PK',
									 'VISIBILIDAD': 'TP_VISIBLE_NUNCA',
									 'NECESARIO': 0
			},
			'autofecha': {
									 'TIPO': 'TP_FECHA_LARGA',
									 'VISIBILIDAD': 'TP_VISIBLE_NUNCA',
									 'NECESARIO': 0
			},
			'id_user':  {
									 'TIPO': 'TP_RELACION',
									 'VISIBILIDAD': 'TP_VISIBLE',
									 'NECESARIO': 1,
									 'NOMBRE': 'usuario',
									 'RELACION': {'TABLA':'usuario','ATTR':'id'}
			},
			'id_noticia':  {
									 'TIPO': 'TP_RELACION',
									 'VISIBILIDAD': 'TP_VISIBLE',
									 'NECESARIO': 1,
									 'NOMBRE': 'noticia',
									 'RELACION': {'TABLA':'noticias','ATTR':'id'}
			},
			'tabla': {
		                'TIPO': 'TP_STRING',
								    'VISIBILIDAD': 'TP_VISIBLE',
								    'NECESARIO': 1
		  },
			'data':  {
									 'TIPO': 'TP_STRING',
									 'FORMATO': 'json',
									 'NECESARIO': 1
			},
			'eliminado':     {
									 'TIPO': 'TP_BOLEANO',
									 'VISIBILIDAD': 'TP_BANDERA',
									 'DEFAULT': 0
			},
		},
	},
	/**
	 *
	 */
	'attr_destaque': {
	'ATRIBUTOS':  {
		'id':        {
	                "TIPO": "TP_PK",
							    "VISIBILIDAD": "TP_VISIBLE_NUNCA",
							    "NECESARIO": 0
	  },
		'autofecha': {
								 'TIPO': 'TP_FECHA_LARGA',
								 'VISIBILIDAD': 'TP_BANDERA',
								 'NECESARIO': 0
		},
		'nombre': {
	                'TIPO': 'TP_STRING',
							    'VISIBILIDAD': 'TP_VISIBLE',
							    'NECESARIO': 1
	  },
		'elim':     {
								 'TIPO': 'TP_BOLEANO',
								 'VISIBILIDAD': 'TP_BANDERA',
								 'DEFAULT': 0
		},
	},
	'VISIBLE': {"TEXTO": "/nombre/","ATTR":["nombre"]},
	'UNIQUE':	['nombre'],
	'GUARDADO_ATTR': {'id':{'TIPO':'nulo'},'nombre':{'TIPO':'normal'}},
	'GUARDADO':		'SIMPLE',
	'FORM':        [
	                {'id':'/id/','nombre': '<div class="col col-12">/nombre/</div>'},
	],
	'NOMBRE':			'Destaque'
	},
	'attr_local': {
	 'ATRIBUTOS':  {
		 'id':        {
									 "TIPO": "TP_PK",
									 "VISIBILIDAD": "TP_VISIBLE_NUNCA",
									 "NECESARIO": 0
		 },
		 'autofecha': {
									'TIPO': 'TP_FECHA_LARGA',
									'VISIBILIDAD': 'TP_BANDERA',
									'NECESARIO': 0
		 },
		 'nombre': {
									 'TIPO': 'TP_STRING',
									 'VISIBILIDAD': 'TP_VISIBLE',
									 'NECESARIO': 1
		 },
		 'elim':     {
									'TIPO': 'TP_BOLEANO',
									'VISIBILIDAD': 'TP_BANDERA',
									'DEFAULT': 0
		 },
	 },
	 'VISIBLE': {"TEXTO": "/nombre/","ATTR":["nombre"]},
	 'UNIQUE':	['nombre'],
	 'GUARDADO_ATTR': {'id':{'TIPO':'nulo'},'nombre':{'TIPO':'normal'}},
	 'GUARDADO':		'SIMPLE',
	 'FORM':        [
									 {'id':'/id/','nombre': '<div class="col col-12">/nombre/</div>'},
	 ],
	 'NOMBRE':			'Local / Sede'
	},
	'attr_contexto': {
	 'ATRIBUTOS':  {
		 'id':        {
									 "TIPO": "TP_PK",
									 "VISIBILIDAD": "TP_VISIBLE_NUNCA",
									 "NECESARIO": 0
		 },
		 'autofecha': {
									'TIPO': 'TP_FECHA_LARGA',
									'VISIBILIDAD': 'TP_BANDERA',
									'NECESARIO': 0
		 },
		 'nombre': {
									 'TIPO': 'TP_STRING',
									 'VISIBILIDAD': 'TP_VISIBLE',
									 'NECESARIO': 1
		 },
		 'elim':     {
									'TIPO': 'TP_BOLEANO',
									'VISIBILIDAD': 'TP_BANDERA',
									'DEFAULT': 0
		 },
	 },
	 'VISIBLE': {"TEXTO": "/nombre/","ATTR":["nombre"]},
	 'UNIQUE':	['nombre'],
	 'GUARDADO_ATTR': {'id':{'TIPO':'nulo'},'nombre':{'TIPO':'normal'}},
	 'GUARDADO':		'SIMPLE',
	 'FORM':        [
									 {'id':'/id/','nombre': '<div class="col col-12">/nombre/</div>'},
	 ],
	 'NOMBRE':			'Contexto'
	},
	'attr_sector': {
	 'ATRIBUTOS':  {
		  'id':        {
									 "TIPO": "TP_PK",
									 "VISIBILIDAD": "TP_VISIBLE_NUNCA",
									 "NECESARIO": 0
		  },
		  'autofecha': {
									'TIPO': 'TP_FECHA_LARGA',
									'VISIBILIDAD': 'TP_BANDERA',
									'NECESARIO': 0
		  },
		 	'nombre': {
									 'TIPO': 'TP_STRING',
									 'VISIBILIDAD': 'TP_VISIBLE',
									 'NECESARIO': 1
		 	},
		 	'elim':     {
									'TIPO': 'TP_BOLEANO',
									'VISIBILIDAD': 'TP_BANDERA',
									'DEFAULT': 0
			},
	 	},
		'VISIBLE': {"TEXTO": "/nombre/","ATTR":["nombre"]},
		'UNIQUE':	['nombre'],
		'GUARDADO_ATTR': {'id':{'TIPO':'nulo'},'nombre':{'TIPO':'normal'}},
		'GUARDADO':		'SIMPLE',
		'FORM':        [
										 {'id':'/id/','nombre': '<div class="col col-12">/nombre/</div>'},
		],
		'NOMBRE':			'Sector'
	},
	'seccion': {
	 'ATRIBUTOS':  {
		 'id':        {
									 "TIPO": "TP_PK",
									 "VISIBILIDAD": "TP_VISIBLE_NUNCA",
									 "NECESARIO": 0
		 },
		 'autofecha': {
									'TIPO': 'TP_FECHA_LARGA',
									'VISIBILIDAD': 'TP_BANDERA',
									'NECESARIO': 0
		 },
		 'id_medio':  {
									'TIPO': 'TP_RELACION',
									'VISIBILIDAD': 'TP_VISIBLE',
									'NECESARIO': 1,
									'NOMBRE': 'medio',
									'RELACION': {'TABLA':'medio','ATTR':'id'}
		 },
		 'nombre': {
									 'TIPO': 'TP_STRING',
									 'VISIBILIDAD': 'TP_VISIBLE',
									 'NECESARIO': 1
		 },
		 'elim':     {
									'TIPO': 'TP_BOLEANO',
									'VISIBILIDAD': 'TP_BANDERA',
									'DEFAULT': 0
		 },
	 },
	 'VISIBLE': {"TEXTO": "/nombre/ (/id_medio/)","ATTR":["nombre","id_medio"]},
	 'UNIQUE':	['id_medio','nombre'],
	 'GUARDADO_ATTR': {'id':{'TIPO':'nulo'},'nombre':{'TIPO':'normal'},'id_medio':{'TIPO':'normal'}},
	 'GUARDADO':		'SIMPLE',
	 'FORM':        [
									 {'id':'/id/','id_medio': '<div class="col col-12">/id_medio/</div>'},
									 {'nombre': '<div class="col col-12">/nombre/</div>'},
	 ],
	 'NOMBRE':			'Sección'
	},
	'attr_temas': {
 	 'ATRIBUTOS':  {
 		 'id':        {
 									 "TIPO": "TP_PK",
 									 "VISIBILIDAD": "TP_VISIBLE_NUNCA",
 									 "NECESARIO": 0
 		 },
 		 'autofecha': {
 									'TIPO': 'TP_FECHA_LARGA',
 									'VISIBILIDAD': 'TP_BANDERA',
 									'NECESARIO': 0
 		 },
 		 'nombre': {
 									 'TIPO': 'TP_STRING',
 									 'VISIBILIDAD': 'TP_VISIBLE',
 									 'NECESARIO': 1
 		 },
 		 'elim':     {
 									'TIPO': 'TP_BOLEANO',
 									'VISIBILIDAD': 'TP_BANDERA',
 									'DEFAULT': 0
 		 },
 	 },
	 'VISIBLE': {"TEXTO": "/nombre/","ATTR":["nombre"]},
	 'UNIQUE':	['nombre'],
	 'GUARDADO_ATTR': {'id':{'TIPO':'nulo'},'nombre':{'TIPO':'normal'}},
 	 'GUARDADO':		'SIMPLE',
 	 'FORM':        [
 									 {'id':'/id/','nombre': '<div class="col col-12">/nombre/</div>'},
 	 ],
 	 'NOMBRE':			'Tema'
  },
	'attr_institucion': {
 	 'ATRIBUTOS':  {
 		 'id':        {
 									 "TIPO": "TP_PK",
 									 "VISIBILIDAD": "TP_VISIBLE_NUNCA",
 									 "NECESARIO": 0
 		 },
 		 'autofecha': {
 									'TIPO': 'TP_FECHA_LARGA',
 									'VISIBILIDAD': 'TP_BANDERA',
 									'NECESARIO': 0
 		 },
 		 'nombre': {
 									 'TIPO': 'TP_STRING',
 									 'VISIBILIDAD': 'TP_VISIBLE',
 									 'NECESARIO': 1
 		 },
 		 'elim':     {
 									'TIPO': 'TP_BOLEANO',
 									'VISIBILIDAD': 'TP_BANDERA',
 									'DEFAULT': 0
 		 },
 	 },
	 'VISIBLE': {"TEXTO": "/nombre/","ATTR":["nombre"]},
	 'UNIQUE':	['nombre'],
	 'GUARDADO_ATTR': {'id':{'TIPO':'nulo'},'nombre':{'TIPO':'normal'}},
 	 'GUARDADO':		'SIMPLE',
 	 'FORM':        [
 									 {'id':'/id/','nombre': '<div class="col col-12">/nombre/</div>'},
 	 ],
 	 'NOMBRE':			'Institución'
  },
	//
	/**
	 *
	 */
	'attr_cargo': {
 	 'ATRIBUTOS':  {
 		 'id':        {
 									 "TIPO": "TP_PK",
 									 "VISIBILIDAD": "TP_VISIBLE_NUNCA",
 									 "NECESARIO": 0
 		 },
 		 'autofecha': {
 									'TIPO': 'TP_FECHA_LARGA',
 									'VISIBILIDAD': 'TP_BANDERA',
 									'NECESARIO': 0
 		 },
 		 'nombre': {
 									 'TIPO': 'TP_STRING',
 									 'VISIBILIDAD': 'TP_VISIBLE',
 									 'NECESARIO': 1
 		 },
 		 'elim':     {
 									'TIPO': 'TP_BOLEANO',
 									'VISIBILIDAD': 'TP_BANDERA',
 									'DEFAULT': 0
 		 },
 	 },
	 'VISIBLE': {"TEXTO": "/nombre/","ATTR":["nombre"]},
	 'UNIQUE':	['nombre'],
	 'GUARDADO_ATTR': {'id':{'TIPO':'nulo'},'nombre':{'TIPO':'normal'}},
 	 'GUARDADO':		'SIMPLE',
 	 'FORM':        [
 									 {'id':'/id/','nombre': '<div class="col col-12">/nombre/</div>'},
 	 ],
 	 'NOMBRE':			'Cargo'
  },
	'attr_poder': {
 	 'ATRIBUTOS':  {
 		 'id':        {
 									 "TIPO": "TP_PK",
 									 "VISIBILIDAD": "TP_VISIBLE_NUNCA",
 									 "NECESARIO": 0
 		 },
 		 'autofecha': {
 									'TIPO': 'TP_FECHA_LARGA',
 									'VISIBILIDAD': 'TP_BANDERA',
 									'NECESARIO': 0
 		 },
 		 'nombre': {
 									 'TIPO': 'TP_STRING',
 									 'VISIBILIDAD': 'TP_VISIBLE',
 									 'NECESARIO': 1
 		 },
 		 'elim':     {
 									'TIPO': 'TP_BOLEANO',
 									'VISIBILIDAD': 'TP_BANDERA',
 									'DEFAULT': 0
 		 },
 	 },
	 'VISIBLE': {"TEXTO": "/nombre/","ATTR":["nombre"]},
	 'UNIQUE':	['nombre'],
	 'GUARDADO_ATTR': {'id':{'TIPO':'nulo'},'nombre':{'TIPO':'normal'}},
 	 'GUARDADO':		'SIMPLE',
 	 'FORM':        [
 									 {'id':'/id/','nombre': '<div class="col col-12">/nombre/</div>'},
 	 ],
 	 'NOMBRE':			'Poder'
  },
	'attr_nivel': {
 	 'ATRIBUTOS':  {
 		 'id':        {
 									 "TIPO": "TP_PK",
 									 "VISIBILIDAD": "TP_VISIBLE_NUNCA",
 									 "NECESARIO": 0
 		 },
 		 'autofecha': {
 									'TIPO': 'TP_FECHA_LARGA',
 									'VISIBILIDAD': 'TP_BANDERA',
 									'NECESARIO': 0
 		 },
 		 'nombre': {
 									 'TIPO': 'TP_STRING',
 									 'VISIBILIDAD': 'TP_VISIBLE',
 									 'NECESARIO': 1
 		 },
 		 'elim':     {
 									'TIPO': 'TP_BOLEANO',
 									'VISIBILIDAD': 'TP_BANDERA',
 									'DEFAULT': 0
 		 },
 	 },
	 'VISIBLE': {"TEXTO": "/nombre/","ATTR":["nombre"]},
	 'UNIQUE':	['nombre'],
	 'GUARDADO_ATTR': {'id':{'TIPO':'nulo'},'nombre':{'TIPO':'normal'}},
 	 'GUARDADO':		'SIMPLE',
 	 'FORM':        [
 									 {'id':'/id/','nombre': '<div class="col col-12">/nombre/</div>'},
 	 ],
 	 'NOMBRE':			'Nivel'
  },
	'attr_partido': {
 	 'ATRIBUTOS':  {
 		 'id':        {
 									 "TIPO": "TP_PK",
 									 "VISIBILIDAD": "TP_VISIBLE_NUNCA",
 									 "NECESARIO": 0
 		 },
 		 'autofecha': {
 									'TIPO': 'TP_FECHA_LARGA',
 									'VISIBILIDAD': 'TP_BANDERA',
 									'NECESARIO': 0
 		 },
 		 'nombre': {
 									 'TIPO': 'TP_STRING',
 									 'VISIBILIDAD': 'TP_VISIBLE',
 									 'NECESARIO': 1
 		 },
 		 'elim':     {
 									'TIPO': 'TP_BOLEANO',
 									'VISIBILIDAD': 'TP_BANDERA',
 									'DEFAULT': 0
 		 },
 	 },
	 'VISIBLE': {"TEXTO": "/nombre/","ATTR":["nombre"]},
	 'UNIQUE':	['nombre'],
	 'GUARDADO_ATTR': {'id':{'TIPO':'nulo'},'nombre':{'TIPO':'normal'}},
 	 'GUARDADO':		'SIMPLE',
 	 'FORM':        [
 									 {'id':'/id/','nombre': '<div class="col col-12">/nombre/</div>'},
 	 ],
 	 'NOMBRE':			'Partido político'
  },
	'attr_alianza': {
 	 'ATRIBUTOS':  {
 		 'id':        {
 									 "TIPO": "TP_PK",
 									 "VISIBILIDAD": "TP_VISIBLE_NUNCA",
 									 "NECESARIO": 0
 		 },
 		 'autofecha': {
 									'TIPO': 'TP_FECHA_LARGA',
 									'VISIBILIDAD': 'TP_BANDERA',
 									'NECESARIO': 0
 		 },
 		 'nombre': {
 									 'TIPO': 'TP_STRING',
 									 'VISIBILIDAD': 'TP_VISIBLE',
 									 'NECESARIO': 1
 		 },
 		 'elim':     {
 									'TIPO': 'TP_BOLEANO',
 									'VISIBILIDAD': 'TP_BANDERA',
 									'DEFAULT': 0
 		 },
 	 },
	 'VISIBLE': {"TEXTO": "/nombre/","ATTR":["nombre"]},
	 'UNIQUE':	['nombre'],
	 'GUARDADO_ATTR': {'id':{'TIPO':'nulo'},'nombre':{'TIPO':'normal'}},
 	 'GUARDADO':		'SIMPLE',
 	 'FORM':        [
 									 {'id':'/id/','nombre': '<div class="col col-12">/nombre/</div>'},
 	 ],
 	 'NOMBRE':			'Alianza electoral'
  },
	'attr_campo': {
 	 'ATRIBUTOS':  {
 		 'id':        {
 									 "TIPO": "TP_PK",
 									 "VISIBILIDAD": "TP_VISIBLE_NUNCA",
 									 "NECESARIO": 0
 		 },
 		 'autofecha': {
 									'TIPO': 'TP_FECHA_LARGA',
 									'VISIBILIDAD': 'TP_BANDERA',
 									'NECESARIO': 0
 		 },
 		 'nombre': {
 									 'TIPO': 'TP_STRING',
 									 'VISIBILIDAD': 'TP_VISIBLE',
 									 'NECESARIO': 1
 		 },
 		 'elim':     {
 									'TIPO': 'TP_BOLEANO',
 									'VISIBILIDAD': 'TP_BANDERA',
 									'DEFAULT': 0
 		 },
 	 },
	 'VISIBLE': {"TEXTO": "/nombre/","ATTR":["nombre"]},
	 'UNIQUE':	['nombre'],
	 'GUARDADO_ATTR': {'id':{'TIPO':'nulo'},'nombre':{'TIPO':'normal'}},
 	 'GUARDADO':		'SIMPLE',
 	 'FORM':        [
 									 {'id':'/id/','nombre': '<div class="col col-12">/nombre/</div>'},
 	 ],
 	 'NOMBRE':			'Campo'
  },
	'calificacion': {
 	 'ATRIBUTOS':  {
 		 'id':        {
 									 "TIPO": "TP_PK",
 									 "VISIBILIDAD": "TP_VISIBLE_NUNCA",
 									 "NECESARIO": 0
 		 },
 		 'autofecha': {
 									'TIPO': 'TP_FECHA_LARGA',
 									'VISIBILIDAD': 'TP_BANDERA',
 									'NECESARIO': 0
 		 },
 		 'nombre': {
 									 'TIPO': 'TP_STRING',
 									 'VISIBILIDAD': 'TP_VISIBLE',
 									 'NECESARIO': 1
 		 },
 		 'valor': {
 									 'TIPO': 'TP_FLOAT',
 									 'VISIBILIDAD': 'TP_VISIBLE',
 									 'NECESARIO': 1,
									 'ALIGN': 'text-right'
 		 },
 		 'elim':     {
 									'TIPO': 'TP_BOLEANO',
 									'VISIBILIDAD': 'TP_BANDERA',
 									'DEFAULT': 0
 		 },
 	 },
	 'VISIBLE': {"TEXTO": "/nombre/ (/valor/)","ATTR":["nombre","valor"]},
	 'UNIQUE':	['nombre'],
	 'GUARDADO_ATTR': {'id':{'TIPO':'nulo'},'nombre':{'TIPO':'normal'},'valor':{'TIPO':'normal'}},
 	 'GUARDADO':		'SIMPLE',
 	 'FORM':        [
 									 {'id':'/id/','nombre': '<div class="col col-8">/nombre/</div>','valor': '<div class="col col-4">/valor/</div>'},
 	 ],
 	 'NOMBRE':			'Calificación'
  },
	//
	'periodista': {
		'ATRIBUTOS':  {
			'id':        {
										"TIPO": "TP_PK",
										"VISIBILIDAD": "TP_VISIBLE_NUNCA",
										"NECESARIO": 0
			},
			'autofecha': {
									 'TIPO': 'TP_FECHA_LARGA',
									 'VISIBILIDAD': 'TP_BANDERA',
									 'NECESARIO': 0
			},
			'nombre':		 {
										'TIPO': 'TP_STRING',
										'VISIBILIDAD': 'TP_VISIBLE',
										'NECESARIO': 1
			},
			'elim':     {
									 'TIPO': 'TP_BOLEANO',
									 'VISIBILIDAD': 'TP_BANDERA',
									 'DEFAULT': 0
			},
		},
		'VISIBLE': {"TEXTO": "/nombre/","ATTR":["nombre"]},
		'GUARDADO_ATTR': {'id':{'TIPO':'nulo'},'nombre':{'TIPO':'normal'}},
		'GUARDADO':		'SIMPLE',
		'UNIQUE':	['nombre'],
		'FORM':        [
  									 {'id':'/id/','nombre': '<div class="col col-12">/nombre/</div>'},
  	 ],
		'NOMBRE':			'Periodista'
	},
	//
	'alarma': {
		'ATRIBUTOS':  {
			'id':        {
										"TIPO": "TP_PK",
										"VISIBILIDAD": "TP_VISIBLE_NUNCA",
										"NECESARIO": 0
			},
			'autofecha': {
									 'TIPO': 'TP_FECHA_LARGA',
									 'VISIBILIDAD': 'TP_BANDERA',
									 'NECESARIO': 0
			},
			'atributos':   {
                    'TIPO': 'TP_STRING',
										'FORMATO': 'json',
								    'VISIBILIDAD': 'TP_VISIBLE',
								    'NECESARIO': 1
      },
			'atributos_negativos' : {
                    'TIPO': 'TP_STRING',
										'FORMATO': 'json',
								    'VISIBILIDAD': 'TP_VISIBLE',
								    'NECESARIO': 1
			},
			'nombre':   {
                    'TIPO': 'TP_STRING',
								    'VISIBILIDAD': 'TP_VISIBLE',
								    'NECESARIO': 1
      },
			'id_cliente':  {
									 'TIPO': 'TP_RELACION',
									 'VISIBILIDAD': 'TP_VISIBLE',
									 'NECESARIO': 1,
									 'NOMBRE': 'cliente',
									 'RELACION': {'TABLA':'cliente','ATTR':'id'}
			},
			'estado':    {
										'TIPO': 'TP_ENUM',
										'VISIBILIDAD': 'TP_VISIBLE',
										'NOMBRE': 'Estado',
										'FORMATO': 'enum',
										'ENUM': {0:'Desactivado', 1:'Activo'},
      },
			'elim':     {
									 'TIPO': 'TP_BOLEANO',
									 'VISIBILIDAD': 'TP_BANDERA',
									 'DEFAULT': 0
			},
		},
		'VISIBLE': {"TEXTO": "/accion/ - /id_usuario/","ATTR":["nombre","id_usuario"]},
		'GUARDADO':		'SIMPLE',
		'GUARDADO_ATTR': {'id':{'TIPO':'nulo'},'nombre':{'TIPO':'normal'},'id_cliente':{'TIPO':'valor','VALOR':0},'estado':{'TIPO':'valor','VALOR':1}},
		'UNIQUE':	['id_cliente','nombre'],
		'NOMBRE':			'Alarma'
	},
	'notificacion': {
		'ATRIBUTOS':  {
			'id':        {
										"TIPO": "TP_PK",
										"VISIBILIDAD": "TP_VISIBLE_NUNCA",
										"NECESARIO": 0
			},
			'autofecha': {
									 'TIPO': 'TP_FECHA_LARGA',
									 'VISIBILIDAD': 'TP_BANDERA',
									 'NECESARIO': 0
			},
			'mensaje':   {
                    'TIPO': 'TP_STRING',
								    'VISIBILIDAD': 'TP_VISIBLE',
								    'NECESARIO': 1
      },
			'id_noticia':  {
									 'TIPO': 'TP_RELACION',
									 'VISIBILIDAD': 'TP_VISIBLE',
									 'NECESARIO': 1,
									 'NOMBRE': 'noticia',
									 'RELACION': {'TABLA':'noticias','ATTR':'id'}
			},
			'id_cliente':  {
									 'TIPO': 'TP_RELACION',
									 'VISIBILIDAD': 'TP_VISIBLE',
									 'NECESARIO': 1,
									 'NOMBRE': 'cliente',
									 'RELACION': {'TABLA':'cliente','ATTR':'id'}
			},
			'leido':    {
										'TIPO': 'TP_ENUM',
										'VISIBILIDAD': 'TP_VISIBLE',
										'FORMATO': 'enum',
										'ENUM': {0:'No leido', 1:'Leido'},
      },
			'aviso':    {
										'TIPO': 'TP_ENUM',
										'VISIBILIDAD': 'TP_VISIBLE',
										'FORMATO': 'enum',
										'ENUM': {0:'No leido', 1:'Leido'},
      },
			'id_usuario':  {
									 'TIPO': 'TP_RELACION',
									 'VISIBILIDAD': 'TP_VISIBLE',
									 'NECESARIO': 1,
									 'NOMBRE': 'usuario',
									 'RELACION': {'TABLA':'usuario','ATTR':'id'}
			},
			'fecha_lectura': {
									 'TIPO': 'TP_FECHA_LARGA',
									 'VISIBILIDAD': 'TP_VISIBLE',
									 'NECESARIO': 0
			},
			'elim':     {
									 'TIPO': 'TP_BOLEANO',
									 'VISIBILIDAD': 'TP_BANDERA',
									 'DEFAULT': 0
			},
		},
	},
	'log': {
		'ATRIBUTOS':  {
			'id':        {
										"TIPO": "TP_PK",
										"VISIBILIDAD": "TP_VISIBLE_NUNCA",
										"NECESARIO": 0
			},
			'autofecha': {
									 'TIPO': 'TP_FECHA_LARGA',
									 'VISIBILIDAD': 'TP_BANDERA',
									 'NECESARIO': 0
			},
			'id_usuario':  {
									 'TIPO': 'TP_RELACION',
									 'VISIBILIDAD': 'TP_VISIBLE',
									 'NECESARIO': 1,
									 'NOMBRE': 'usuario',
									 'RELACION': {'TABLA':'usuario','ATTR':'id'}
			},
			'tabla':    {
										'TIPO': 'TP_STRING',
										'VISIBILIDAD': 'TP_VISIBLE',
      },
			'id_tabla':  {
										'TIPO': 'TP_ENTERO',
										'VISIBILIDAD': 'TP_VISIBLE',
										'NOMBRE': 'id'
      },
			'accion': {
									 'TIPO': 'TP_STRING_L',
									 'VISIBILIDAD': 'TP_VISIBLE',
			},
		},
	}
};
