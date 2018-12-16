/**********************************************
 * VISTA O VISIBILIDAD
 **********************************************/
/**
 * TP_VISIBLE_NUNCA
 * Declara que todos los elementos se agregan a las tablas,
 * pero se ocultan en las formularios
 **
 * TP_VISIBLE
 * Declara que todos los elementos son visibles,
 * tanto en la vista como en formularios con el formato adecuado
 **
 * TP_OCULTO
 * Declara que todos los elementos son ocultos en tablas,
 * en los formularios son visibles
 **
 * TP_INVISIBLE
 * Declara que todos los elemetos no son agregados en la vista,
 * en formularios aparecen como "hidden".
 **
 * TP_BANDERA
 * Declara que todos los elementos son ocultos en formulario,
 * y tablas. Son para elementos que cambian de estado
 */
/**********************************************
 * TIPOS
 **********************************************/
/**
 * TP_PK
 * Declara valores enteros, correspondiente a PK
 **
 * TP_ENTERO
 * Declara valores numéricos
 **
 * TP_STRING
 * Declara valores alfanuméricos, se representa con INPUT
 **
 * TP_DOUBLE
 **
 * TP_FLOAT
 **
 * TP_TEXT
 * Declara valores alfanuméricos, se representa con TEXTAREA
 **
 * TP_FECHA_LARGA
 * Declara valores de fecha larga
 **
 * TP_RELACION
 * Declara valores enteros, corresponde a FK
 * Relaciones con otras tablas
 **
 * TP_PASSWORD
 * Declara valores alfanuméricos para elementos tipo PASSWORD
 **
 * TP_BOLEANO
 * Declara valor entero - 1 o 0
 */

const ENTIDAD = {
  'osai_usuario': {
    'ATRIBUTOS': {
      'id': {
        'TIPO': 'TP_PK',
        'VISIBILIDAD': 'TP_INVISIBLE',
        'NECESARIO': 0,
        'DEFAULT': 'nulo'
      },
      'autofecha': {
        'TIPO': 'TP_FECHA_LARGA',
        'VISIBILIDAD': 'TP_BANDERA',
        'NECESARIO': 0
      },
      'user': {
        'TIPO': 'TP_STRING',
        'VISIBILIDAD': 'TP_VISIBLE',
        'NOMBRE': 'usuario',
        'NECESARIO': 1
      },
      'pass': {
        'TIPO': 'TP_PASSWORD',
        'VISIBILIDAD': 'TP_VISIBLE',
        'NOMBRE': 'clave',
        'NECESARIO': 1
      },
      'activo': {
        'TIPO': 'TP_BOLEANO',
        'VISIBILIDAD': 'TP_VISIBLE',
        'NECESARIO': 1,
        'DEFAULT': 1
      },
      'elim': {
        'TIPO': 'TP_BOLEANO',
        'VISIBILIDAD': 'TP_BANDERA',
        'NECESARIO': 0,
        'DEFAULT': 0
      }
    }
  },
  'osai_usuariounidad': {
    'ATRIBUTOS': {
      'id': {
        'TIPO': 'TP_PK',
        'VISIBILIDAD': 'TP_INVISIBLE',
        'NECESARIO': 0,
        'DEFAULT': 'nulo'
      },
      'autofecha': {
        'TIPO': 'TP_FECHA_LARGA',
        'VISIBILIDAD': 'TP_BANDERA',
        'NECESARIO': 0
      },
      'id_usuario_osai': {
        'TIPO': 'TP_RELACION',
        'VISIBILIDAD': 'TP_VISIBLE',
        'NECESARIO': 1,
        'NOMBRE': 'usuario',
        'RELACION': {'TABLA':'osai_usuario','ATTR':'id'}
      },
      'id_cliente_osai': {
        'TIPO': 'TP_RELACION',
        'VISIBILIDAD': 'TP_VISIBLE',
        'NECESARIO': 1,
        'NOMBRE': 'cliente',
        'RELACION': {'TABLA':'cliente','ATTR':'id'}
      },
      'elim': {
        'TIPO': 'TP_BOLEANO',
        'VISIBILIDAD': 'TP_BANDERA',
        'NECESARIO': 0,
        'DEFAULT': 0
      }
    }
  },
  'osai_cliente': {
    'ATRIBUTOS': {
      'id': {
        'TIPO': 'TP_PK',
        'VISIBILIDAD': 'TP_INVISIBLE',
        'NECESARIO': 0,
        'DEFAULT': 'nulo'
      },
      'autofecha': {
        'TIPO': 'TP_FECHA_LARGA',
        'VISIBILIDAD': 'TP_BANDERA',
        'NECESARIO': 0
      },
      'id_usuario': {
        'TIPO': 'TP_RELACION',
        'VISIBILIDAD': 'TP_VISIBLE',
        'NECESARIO': 1,
        'NOMBRE': 'usuario',
        'RELACION': {'TABLA':'usuario','ATTR':'id'}
      },
      'id_noticia': {
        'TIPO': 'TP_RELACION',
        'VISIBILIDAD': 'TP_VISIBLE',
        'NECESARIO': 1,
        'NOMBRE': 'noticia',
        'RELACION': {'TABLA':'noticia','ATTR':'id'}
      },
      'id_usuario_osai': {
        'TIPO': 'TP_RELACION',
        'VISIBILIDAD': 'TP_INVISIBLE',
        'NECESARIO': 1,
        'NOMBRE': 'cliente final',
        'RELACION': {'TABLA':'osai_usuario','ATTR':'id'}
      },
      'estado': {
        'TIPO': 'TP_BOLEANO',
        'VISIBILIDAD': 'TP_BANDERA',
        'NECESARIO': 1,
        'DEFAULT': 0
      },
      'tipo_aviso': {//VER BASE
        'TIPO': 'TP_BOLEANO',
        'VISIBILIDAD': 'TP_BANDERA',
        'NECESARIO': 1,
        'DEFAULT': 0
      },
      'elim': {
        'TIPO': 'TP_BOLEANO',
        'VISIBILIDAD': 'TP_BANDERA',
        'NECESARIO': 0,
        'DEFAULT': 0
      }
    }
  },
  'osai_notificacion': {
    'ATRIBUTOS': {
      'id': {
        'TIPO': 'TP_PK',
        'VISIBILIDAD': 'TP_INVISIBLE',
        'NECESARIO': 0,
        'DEFAULT': 'nulo'
      },
      'autofecha': {
        'TIPO': 'TP_FECHA_LARGA',
        'VISIBILIDAD': 'TP_BANDERA',
        'NECESARIO': 0
      },
      'id_usuario': {
        'TIPO': 'TP_RELACION',
        'VISIBILIDAD': 'TP_VISIBLE',
        'NECESARIO': 1,
        'NOMBRE': 'usuario',
        'RELACION': {'TABLA':'usuario','ATTR':'id'}
      },
      'id_noticia': {
        'TIPO': 'TP_RELACION',
        'VISIBILIDAD': 'TP_VISIBLE',
        'NECESARIO': 1,
        'NOMBRE': 'noticia',
        'RELACION': {'TABLA':'noticia','ATTR':'id'}
      },
      'id_usuario_osai': {
        'TIPO': 'TP_RELACION',
        'VISIBILIDAD': 'TP_INVISIBLE',
        'NECESARIO': 1,
        'NOMBRE': 'cliente final',
        'RELACION': {'TABLA':'osai_usuario','ATTR':'id'}
      },
      'nivel': {
        'TIPO': 'TP_BOLEANO',
        'VISIBILIDAD': 'TP_BANDERA',
        'NECESARIO': 1,
        'DEFAULT': 0
      },
      'mensaje': {
        'TIPO': 'TP_STRING',
        'VISIBILIDAD': 'TP_VISIBLE',
        'NECESARIO': 1,
        'DEFAULT': 0
      },
      'elim': {
        'TIPO': 'TP_BOLEANO',
        'VISIBILIDAD': 'TP_BANDERA',
        'NECESARIO': 0,
        'DEFAULT': 0
      }
    }
  }
};
