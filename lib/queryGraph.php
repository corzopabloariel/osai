<?php
// incluyo la configuracion local y redbeans
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/ext/rb.php';
// configuro la db
R::setup("mysql:host=".CONFIG_HOST.";dbname=".CONFIG_BD,CONFIG_USER,CONFIG_PASS);
R::debug(TRUE,1);

error_reporting(E_ALL);
ini_set('display_errors', 1);


function get_string_between($string, $start, $end){
    $string = ' ' . $string;
    $ini = strpos($string, $start);
    if ($ini == 0) return '';
    $ini += strlen($start);
    $len = strpos($string, $end, $ini) - $ini;
    return substr($string, $ini, $len);
}


// tengo que recibir los rangos de fechas y la unidad de analisis

if(! isset($_GET['desde']) ) 	exit();
if(! isset($_GET['hasta']) ) 	exit();
if(! isset($_GET['ua']) )		exit();
if(! isset($_GET['grafico']) )	exit();


$desde = $_GET['desde'];
$hasta = $_GET['hasta'];
$ua = $_GET['ua'];
$grafico = $_GET['grafico'];

function grafico_1( $desde, $hasta, $ua ){
	// obtengo el query mayor
	$query = "select nested.id_cliente, noticiasactor.id_actor, nested.tema from "
	. "( select procesados.* from ( select noticiascliente.* from noticiascliente inner join proceso on noticiascliente.id_noticia = proceso.id_noticia where noticiascliente.id_cliente = " . $ua . " ) procesados "
	. "inner join noticia on noticia.id = procesados.id_noticia where noticia.fecha between '" . $desde . " 00:00:01' and '" . $hasta . " 23:59:59') nested  "
	. "inner join noticiasactor on nested.id_noticia = noticiasactor.id_noticia order by id_actor asc ";
	$main = R::getAll($query);
	// obtengo el nombre de la unidad de analisis
	$ua_nombre = R::findOne("cliente","id LIKE ?",[$ua])['nombre'];
	// obtengo los nombres de todos los actores, para cruzar
	$actores_nombres = R::findOne("actor","id LIKE ?",[4]) ;
	//var_dump($actores_nombres['nombre'] . " " . $actores_nombres['apellido']);

	$tabla = [];
	$temas = [];
	$i = -1;
	// reemplazo actores por nombres y temas
	foreach($main as $k=>$v){
		$actores_nombres = R::findOne("actor","id LIKE ?",[ $v['id_actor'] ]);
		$main[$k]['id_cliente'] = $ua_nombre;
		// $main[$k]['id_actor'] = $actores_nombres['nombre'] . " " . $actores_nombres['apellido'];
		$main[$k]['id_actor'] = $v['id_actor'];
		$main[$k]['nombre'] = $actores_nombres['nombre'] . " " . $actores_nombres['apellido'];
		$id_tema = get_string_between($main[$k]['tema'],"frm_tema_","\"");
		$tema = R::findOne("attr_temas","id LIKE ?",[$id_tema])['nombre'];
		if( is_null( $tema ) ) $tema = 'TEMA NO ASIGNADO';
		$main[$k]['tema'] = $tema;
		
		// if(array_search( [ $main[$k]['id_actor'],$tema], $tabla ) ) echo "repetido";
		// chequeo si ya existe alguno con este actor y tema, si es asi, sumo uno
		// TODO - FIXME : deberia ser mas eficiente, busqueda por dos valores
		$iter = true;
		foreach($tabla as $ka=>$va){
			// if($va['actor'] == $main[$k]['id_actor'] && $va['tema'] == $tema){
			if($va['actor'] == $main[$k]['nombre'] && $va['tema'] == $tema){
				$tabla[$ka]['cantidad'] += 1;
				$iter = false;
				break;
			}
		}
		if($iter){
			$tabla[ ++$i ] = [ 
				'unidad_analisis' => $ua_nombre,
				'actor' => $main[$k]['nombre'],
				'id_actor' => $main[$k]['id_actor'],
				'tema' => $tema,
				'cantidad' => 1
				];
			}
		// agrego los temas que van apareciendo en la tabla temas
		// UTIL para poder hacer el CRC32 por la cantidad de colores
		if(!in_array($tema,$temas)) $temas[] = $tema;
	}
	// la agrupacion de repetidos es por aca, por que repite y cuenta temas de igual id

	// en el grafico, los hijos, son arreglos de objetos, hago una conversion tabla -> objeto
	$objeto = new StdClass(); // objeto vacio
	$objeto->name = 'Actores';
	$objeto->rank = 0;
	$objeto->weight = 1;
	$objeto->id = 1;
	$objeto->children = [];
	foreach($tabla as $k=>$v){
		// me fijo si el actor existe, ineficiente pero por ahora
		$NoExiste = true;
		foreach($objeto->children as $ka=>$va){
			// si existe actor, le inserto el tema
			if($va->name == $v['actor']){
				$in = new StdClass();
				// $in->name = $v['tema'] . " (" . $v['cantidad'] . ") " ; // lo construye JS
				$in->name = "";
				$in->tema = array_search($v['tema'],$temas);
				$in->tema_cantidad = $v['cantidad'];
				$in->rank = intval($v['cantidad']); // el tamaño del objeto 
				$in->weight = 0; // lo asigna JS
				$in->id = $k;
				$in->children = [];
				$objeto->children[$ka]->children[] =  $in;
				$objeto->children[$ka]->cantidad_temas = count($objeto->children[$ka]->children);	
				$objeto->children[$ka]->rank = count($objeto->children[$ka]->children);
				$NoExiste = false;
				break;
			}
		}
		if($NoExiste){
			$in = new StdClass();
			$in->name = $v['actor'];
			$in->rank = 1;
			$in->weight = 0; // lo asigna JS
			$in->id = $k;
			//$in->id = $v['id_actor'];
			$in->id_actor = $v['id_actor'];
				$t_in = new StdClass();
				// $t_in->name = $v['tema'] . " (" . $v['cantidad'] . ") " ; // lo construye JS
				$t_in-> name = "";
				$t_in->tema = array_search($v['tema'],$temas);
				$t_in->tema_cantidad = $v['cantidad'];
				$t_in->rank = intval($v['cantidad']); // el tamaño del objeto 
				$t_in->weight = 0; // lo asigna JS
				$t_in->id = $k;
				$t_in->children = [];
			$in->children = [ $t_in ];
			$objeto->children[] = $in;
		}
	}
	return [
		'tabla' => $tabla,
		'grafico' => $objeto,
		'temas' => $temas
		];
}

function grafico_1_queryUrl( $desde, $hasta, $ua, $id ){
	$query = "select noticiascliente.tema, noticia.*  from noticia
		inner join noticiasactor on noticiasactor.id_noticia = noticia.id
		inner join proceso on proceso.id_noticia = noticiasactor.id_noticia
		inner join noticiascliente on noticiascliente.id_noticia = proceso.id_noticia
		where
			noticia.fecha between '" . $desde . " 00:00:00' and '" . $hasta . " 23:59:59'
			and 
			noticiasactor.id_actor = " . $id . "
			and
			proceso.elim = 0
			and
			noticiascliente.id_cliente = " . $ua . "";
	$main = R::getAll($query);
	
	$columnas = [
		(object) ['title' => 'id' ],
		(object) ['title' => 'tema'],
		(object) ['title' => 'titulo'],
		(object) ['title' => 'medio'],
		(object) ['title' => 'link'] 
	];
	
	$filas = [];
	foreach($main as $k=>$v){
		$medio = R::findOne('medio','id LIKE ?',[ $v['id_medio'] ])['medio'];
		// obtengo el tema
		$id_tema = get_string_between($main[$k]['tema'],"frm_tema_","\"");
		$tema = R::findOne("attr_temas","id LIKE ?",[$id_tema])['nombre'];
		if( is_null( $tema ) ) $tema = 'TEMA NO ASIGNADO';
		// cargo la fila
		$filas[] = [
			$v['id'],
			$tema,
			$v['titulo'],
			$medio,
			$v['url']
		];
	}
	return [
		'columnas' => $columnas,
		'filas' => $filas
		];
	
}

function grafico_1_2( $desde, $hasta, $ua ){
	
	// solo nos quedaremos de este lado con los registros que tengan campo 3 y 4, el resto se desecha
	// aclarar al cliente que debe setear campos bien definidos y NO PERMITIR AMBIGUEDADES
	
	$query = "select actor.nombre, actor.apellido, actor.id_campo, count(noticiasactor.id_actor) as cantidad from noticiascliente "
		. "inner join noticiasactor on noticiascliente.id_noticia = noticiasactor.id_noticia "
		. "inner join noticias on noticiasactor.id_noticia = noticias.id "
		. "inner join actor on noticiasactor.id_actor = actor.id "
		. "where "
			. "noticiascliente.id_cliente = " . $ua . " and "
			. "noticiascliente.elim = 0 and "
			. "noticias.fecha between '" . $desde . " 00:00:01' and '" . $hasta . " 23:59:59' "
			// SOLO QUIENES TIENEN 3 Y 4 COMO CAMPO
			. " and ( actor.id_campo like '%3%' or actor.id_campo like '%4%' ) "
		. "group by noticiasactor.id_actor order by cantidad desc";
	$main = R::getAll($query);
	$ua_nombre = R::findOne("cliente","id LIKE ?",[$ua])['nombre'];

	// var_dump($main);
	$tabla = [];
	// unidad de analisis, campo, actor, cantidad de menciones
	$i = -1;
	foreach($main as $k=>$v){
		// por ahora solo considero los dos posibles campos
		$tabla[ ++$i ] = [
			'ua' => $ua_nombre,
			'campo' => ( strpos( $v['id_campo'], '3' ) !== false ) ? 'oposicion' : 'oficialismo',
			'actor' => $v['apellido'] . ' ' . $v['nombre'],
			'cantidad' => $v['cantidad']
			];
	}
	// var_dump($tabla);
	
	// grafico
	$oficialismo = new StdClass(); // objeto vacio
	$oficialismo->name = 'Oficialismo';
	$oficialismo->rank = 0;
	$oficialismo->weight = 'Yellow';
	$oficialismo->id = 1;
	$oficialismo->children = [];
	
	$oposicion = new StdClass(); // objeto vacio
	$oposicion->name = 'Oposicion';
	$oposicion->rank = 0;
	$oposicion->weight = 'LightBlue';
	$oposicion->id = 1;
	$oposicion->children = [];
	
	$objeto = new StdClass(); // objeto vacio
	$objeto->name = 'Campos';
	$objeto->rank = 0;
	$objeto->weight = 'Gray';
	$objeto->id = 1;
	$objeto->children = [ $oficialismo, $oposicion ];
	
	$i_of = 0;
	$i_op = 0;
	
	foreach($tabla as $v){
		$sub = new StdClass(); // objeto vacio
		$sub->name = $v['actor'] . ' (' . $v['cantidad'] . ')';
		$sub->rank = $v['cantidad'];
		// $sub->weight = 0;
		$sub->cantidad = $v['cantidad'];
		$sub->id = 1;
		$sub->children = [ ];
		if($v['campo'] == 'oposicion'){
			$i_op += 1;
			$sub->weight = 'Blue';
			$oposicion->children[] = $sub;
		}
		else{ 
			$i_of += 1;
			$sub->weight = 'White';
			$oficialismo->children[] = $sub;
		}
	}
	
	$oposicion->rank = $i_op;
	$oficialismo->rank = $i_of;
	
	return [
		'tabla' => $tabla,
		'grafico' => $objeto
		// ,'temas' => $temas
		];
	
}

function grafico_1_2_queryUrl( $desde, $hasta, $ua, $id){
	// el id es del campo, traigo todas las urls
	// FUNCIONA PERFECTAMENTE, se elije o 3 (oposicion) o 4 (oficialismo) como ID
	// y coincide con la cantidad de notas
	$query = "select actor.nombre, actor.apellido, actor.id_campo, noticia.id_medio, noticia.titulo, noticia.url, noticia.id from noticiascliente 
		inner join noticiasactor on noticiascliente.id_noticia = noticiasactor.id_noticia 
		inner join noticia on noticiasactor.id_noticia = noticia.id 
		inner join actor on noticiasactor.id_actor = actor.id 
		where 
		noticiascliente.id_cliente = " . $ua . " and 
		noticiascliente.elim = 0 and 
		noticia.fecha between '" . $desde . " 00:00:01' and '" . $hasta . " 23:59:59' 
		and ( actor.id_campo like '%" . $id . "%'  )
		ORDER BY `actor`.`nombre` ASC";
	/*$query = "select actor.nombre, actor.apellido, actor.id_campo, noticia.id_medio, noticia.titulo, noticia.url, noticia.id from noticiascliente  
		inner join noticiasactor on noticiascliente.id_noticia = noticiasactor.id_noticia 
		inner join noticias on noticiasactor.id_noticia = noticias.id 
		inner join actor on noticiasactor.id_actor = actor.id 
		where 
		noticiascliente.id_cliente = " . $ua . " and 
		noticiascliente.elim = 0 and 
		noticias.fecha between '" . $desde . " 00:00:01' and '" . $hasta . " 23:59:59' 
		and ( actor.id_campo like '%" . $id . "%'  )
		ORDER BY `actor`.`nombre` ASC";*/
	
	$main = R::getAll($query);
	
	$columnas = [
		(object) ['title' => 'id' ],
		(object) ['title' => 'actor'],
		(object) ['title' => 'titulo'],
		(object) ['title' => 'medio'],
		(object) ['title' => 'link'] 
	];
	
	$filas = [];
	foreach($main as $k=>$v){
		$medio = R::findOne('medio','id LIKE ?',[ $v['id_medio'] ])['medio'];
		// cargo la fila
		$filas[] = [
			$v['id'],
			$v['nombre'] . ' ' . $v['apellido'],
			$v['titulo'],
			$medio,
			$v['url']
		];
	}
	return [
		'columnas' => $columnas,
		'filas' => $filas
		];
	
}
function grafico_1_3( $desde, $hasta, $ua ){
	
	// solo nos quedaremos de este lado con los registros que tengan campo 3 y 4, el resto se desecha
	// aclarar al cliente que debe setear campos bien definidos y NO PERMITIR AMBIGUEDADES
	
	$query = "select actor.nombre, actor.apellido, actor.id_partido, actor.id_campo, count(noticiasactor.id_actor) as cantidad from noticiascliente "
		. "inner join noticiasactor on noticiascliente.id_noticia = noticiasactor.id_noticia "
		. "inner join noticias on noticiasactor.id_noticia = noticias.id "
		. "inner join actor on noticiasactor.id_actor = actor.id "
		. "where "
			. "noticiascliente.id_cliente = " . $ua . " and "
			. "noticiascliente.elim = 0 and "
			. "noticias.fecha between '" . $desde . " 00:00:01' and '" . $hasta . " 23:59:59' "
			// SOLO QUIENES TIENEN 3 Y 4 COMO CAMPO
			// . " and ( actor.id_campo like '%3%' or actor.id_campo like '%4%' ) "
		. "group by noticiasactor.id_actor order by cantidad desc";
	//echo $query;
	$main = R::getAll($query);
	$ua_nombre = R::findOne("cliente","id LIKE ?",[$ua])['nombre'];

	//var_dump($main);
	$tabla = [];
	// unidad de analisis, actor, partido, cantidad de menciones
	$i = -1;
	$partidos = [];
	
	$children_partidos = [];
	$i_actor = 0;
	foreach($main as $k=>$v){
		// obtengo el/los partidos
		$partidos_array = json_decode( $v['id_partido'], true);
		if( ! is_array($partidos_array) ) continue;
		
		foreach($partidos_array as $p){
			$partido_nombre = R::findOne('attr_partido','id LIKE ?',[$p])['nombre'];
			$tabla[ ++$i ] = [
				'ua' => $ua_nombre,
				'actor' => $v['nombre'] . ' ' . $v['apellido'],
				'partido' => $partido_nombre,
				'cantidad' => $v['cantidad']
				];
				// agrego el partido y el grafico
				if(! in_array($partido_nombre,$partidos)){
					$partidos[] = $partido_nombre;
					$x = new StdClass(); // objeto vacio
					$x->name = $partido_nombre;
					$x->rank = 0;
					$x->weight = count($partidos); //'Yellow'; cargar desde JS
					$x->id = 1;
					$x->children = [];
					$children_partidos[] = $x;
				}
				// obtengo el indice del partido y lo inserto
				$index = array_search($partido_nombre,$partidos);
				$t = new StdClass(); // objeto vacio
				$t->name = $v['nombre'] . ' ' . $v['apellido'] . " (" . $v['cantidad'] . ")";
				$t->rank = $v['cantidad'];
				$t->weight = $i_actor; //'Yellow'; cargar desde JS
				$t->id = 1;
				$t->children = [];
				// lo agrego al padre correspondiente
				$children_partidos[ $index ]->children[] = $t;
				$children_partidos[ $index ]->rank += 1;
			}
			++$i_actor;
	}
	// grafico
	/*$oficialismo = new StdClass(); // objeto vacio
	$oficialismo->name = 'Oficialismo';
	$oficialismo->rank = 0;
	$oficialismo->weight = 'Yellow';
	$oficialismo->id = 1;
	$oficialismo->children = [];*/
	
	// creo los objetos partidos
	
	/*foreach($partidos as $p){
		$x = new StdClass(); // objeto vacio
		$x->name = $p;
		$x->rank = 0;
		$x->weight = 0; //'Yellow'; cargar desde JS
		$x->id = 1;
		$x->children = [];
	}*/
	
	$objeto = new StdClass(); // objeto vacio
	$objeto->name = 'Partidos';
	$objeto->rank = 0;
	$objeto->weight = 'Gray';
	$objeto->id = 1;
	$objeto->children = $children_partidos;
	
	
	/*foreach($tabla as $v){
		$sub = new StdClass(); // objeto vacio
		$sub->name = $v['actor'] . ' (' . $v['cantidad'] . ')';
		$sub->rank = $v['cantidad'];
		// $sub->weight = 0;
		$sub->cantidad = $v['cantidad'];
		$sub->id = 1;
		$sub->children = [ ];
		if($v['campo'] == 'oposicion'){
			$i_op += 1;
			$sub->weight = 'Blue';
			$oposicion->children[] = $sub;
		}
		else{ 
			$i_of += 1;
			$sub->weight = 'White';
			$oficialismo->children[] = $sub;
		}
	}*/
	
	
	return [
		'tabla' => $tabla,
		'grafico' => $objeto
		// ,'temas' => $temas
		];
}

// TEMAS POR FAVORABILIDAD
function grafico_2( $desde, $hasta, $ua ){
	// falta filtrar fecha
	/*$query = "select noticiastema.id_tema, noticiastema.valor, count(noticiastema.id_tema) as cantidad "
		. " from noticiastema where noticiastema.id_cliente = " . $ua . " "
		. " group by noticiastema.id_tema, noticiastema.valor order by id_tema DESC"; *** OLD QUERY **/
	$query = "select noticiastema.id_tema, noticiastema.valor, count(noticiastema.id_tema) as cantidad from noticiastema 
		inner join proceso on noticiastema.id_noticia = proceso.id_noticia inner join noticia on noticia.id = proceso.id_noticia 
		where proceso.id_cliente = " . $ua . " and proceso.elim = 0 and noticia.fecha BETWEEN '" . $desde . " 00:00:00' and '" . $hasta . " 23:59:59' 
		group by noticiastema.id_tema, noticiastema.valor order by cantidad desc";
	
	// el grafico de barras es igual a la tabla
	$main = R::getAll($query);
	// como ya viene acomodado, le mando los conjuntos de a tres
	$todo = [];
	$uno = [0,0,0];
	$id_current = -1;
	$matrix = []; // contiene a todos
	$arr_id_aux = []; // contiene los indices, posicional a matrix
	$arr_temas = []; // el combinado para enviar
	$arr_temas_name = []; // es posicional, 
	$arr_temas_id = []; // es posicional, 
	foreach($main as $k=>$v){
		$pos = array_search($v['id_tema'],$arr_id_aux);
		if($pos !== false){
			$matrix[ $pos ]['valoracion'][ intval($v['valor']) + 1 ] = intval( $v['cantidad'] );
			$matrix[ $pos ]['total'] += intval( $v['cantidad'] );
		}
		else{
			$nombre = R::findOne('attr_temas','id LIKE ?',[ $v['id_tema'] ])['nombre'];
			if( is_null($nombre) ) $nombre = 'TEMA SIN NOMBRE';
			$id_tema = $v['id_tema'];
			//creo el array
			$uno = [0,0,0];
			$uno[ intval($v['valor']) + 1 ] = intval( $v['cantidad'] );
			$matrix[] = [
				'nombre' => $nombre,
				'id' => $id_tema,
				'valoracion' => $uno,
				'total' => $v['cantidad']
			];
			$arr_id_aux[] = $id_tema;
		}
	}
	// ordeno la matrix
	usort($matrix, function($a, $b) {
		return $b['total'] - $a['total'];
		});
	// lo parto en 3 para el grafico
	$grafico = [ [], [], [] ];
	$arr_temas = [];
	foreach($matrix as $k=>$v){
		$grafico[0][] = $v['valoracion'][0];
		$grafico[1][] = $v['valoracion'][1];
		$grafico[2][] = $v['valoracion'][2];
		$arr_temas[] = [
			'nombre' => $v['nombre'],
			'id' => $v['id']
			];
	}
	
	return [
		'temas_nombres' => $arr_temas	,
		'grafico' => $grafico,
		'tabla' => $matrix
		];
}

function grafico_2_queryUrl($desde, $hasta, $ua, $id){
	$query = "select noticia.id,  noticiastema.valor, noticia.titulo, noticia.id_medio, noticia.url from noticiastema 
		inner join proceso on noticiastema.id_noticia = proceso.id_noticia inner join noticia on noticia.id = proceso.id_noticia 
		where proceso.id_cliente = " . $ua . " and noticiastema.id_tema = " . $id . " and noticia.fecha BETWEEN '" . $desde . " 00:00:00' and '" . $hasta . " 23:59:59' 
		 order by id_tema";
	$main = R::getAll($query);
	$arr_todo = [];
	$columnas = [
		(object) ['title' =>'id' ],
		(object) ['title' => 'valoracion'],
		(object) ['title' => 'titulo'],
		(object) ['title' => 'medio'],
		(object) ['title' => 'link'] ];
	foreach($main as $k=>$v){
		// obtengo el valor
		$valor = "";
		if( $v['valor'] == -1 ) $valor = "<i class='fas fa-arrow-alt-circle-down text-danger'></i> negativo";
		if( $v['valor'] == 0 ) $valor = "<i class='fas fa-minus-circle text-warning'></i> neutro";
		if( $v['valor'] == 1 ) $valor = "<i class='fas fa-arrow-alt-circle-up text-success'></i> positivo";
		$medio = R::findOne('medio','id LIKE ?',[ $v['id_medio'] ])['medio'];
		$arr_todo[] = [
			$v['id'],
			$valor,
			"<span class='text-truncate d-block' style='width:450px;'>{$v['titulo']}</span>",
			$medio,
			( $v['url'] == null ) ? '<i class="fas fa-unlink text-danger"></i>' : "<a style='text-decoration:none;' class='text-primary' href='{$v['url']}' target='blank'><i class='fas fa-external-link-alt'></i></a>"
		];
	}
	return [
		'columnas' => $columnas,
		'filas' => $arr_todo
		];
}

// ACTORES POR FAVORABILIDAD
function grafico_2_2( $desde, $hasta, $ua ){
	// traigo todas las noticias en esee rango de fechas
	$query = "select noticiasactor.id_actor, noticiasactor.data from noticiasactor 
		inner join proceso on noticiasactor.id_noticia = proceso.id_noticia 
		inner join noticia on noticia.id = proceso.id_noticia 
		where 
			proceso.id_cliente = " . $ua . " 
			and proceso.elim = 0 
			and noticia.fecha BETWEEN '" . $desde . " 00:00:00' and '" . $hasta . " 23:59:59'";
	
	$main = R::getAll($query);
	$matrix = []; // contiene a todos
	$arr_id_aux = []; // contiene los indices, posicional a matrix
	foreach($main as $k=>$v){
		$pos = array_search($v['id_actor'],$arr_id_aux);
		// obtengo la valoracion
		$data = json_decode( str_replace("'",'"',$v['data']),true);
		// si no tiene clave frm_valor, no lo introduzco
		if(! array_key_exists('frm_valor',$data) )
			continue; // TODO: ACA PONER QUIENES NO TIENEN FRM_VALOR PARA MOSTRAR

		if($pos !== false){
			$matrix[ $pos ]['valoracion'][ intval($data['frm_valor']) + 1 ] += 1; // sumo uno
			$matrix[ $pos ]['total'] += 1; // sumo 1
		}
		else{
			$actor = R::findOne('actor','id LIKE ?',[ $v['id_actor'] ]);
			if( is_null($actor) ) $nombre = 'ACTOR SIN NOMBRE';
			else $nombre = $actor['nombre'] . " " . $actor['apellido'];
			//creo el array
			$uno = [0,0,0];
			$uno[ intval($data['frm_valor']) + 1 ] = 1; // es el primero
			$matrix[] = [
				'nombre' => $nombre,
				'id' => $v['id_actor'],
				'valoracion' => $uno,
				'total' => 1 // es el primero que se hace
			];
			$arr_id_aux[] = $v['id_actor'];
		}
	}
	
	// ordeno la matrix
	usort($matrix, function($a, $b) {
		return $b['total'] - $a['total'];
		});
	// lo parto en 3 para el grafico
	$grafico = [ [], [], [] ];
	$arr_actores = [];
	foreach($matrix as $k=>$v){
		$grafico[0][] = $v['valoracion'][0];
		$grafico[1][] = $v['valoracion'][1];
		$grafico[2][] = $v['valoracion'][2];
		$arr_actores[] = [
			'nombre' => $v['nombre'],
			'id' => $v['id']
			];
	}
	
	return [
		'actores_posicional' => $arr_actores,
		'tabla' => $matrix,
		'grafico' => $grafico
		];
}

function grafico_2_2_queryUrl( $desde, $hasta, $ua, $id){
	$query = "select noticia.id, noticiasactor.data, noticia.titulo, noticia.id_medio, noticia.url from noticiasactor 
		inner join proceso on noticiasactor.id_noticia = proceso.id_noticia 
		inner join noticia on noticia.id = proceso.id_noticia 
		where 
			proceso.id_cliente = " . $ua . " 
			and proceso.elim = 0 
            and noticiasactor.id_actor = " . $id . "
			and noticia.fecha BETWEEN '" . $desde . " 00:00:00' and '" . $hasta . " 23:59:59'";
	
	$main = R::getAll($query);
	$arr_todo = [];
	$columnas = [
		(object) ['title' =>'id' ],
		(object) ['title' => 'valoracion'],
		(object) ['title' => 'titulo'],
		(object) ['title' => 'medio'],
		(object) ['title' => 'link'] ];
	foreach($main as $k=>$v){
		// obtengo el valor
		$data = json_decode( str_replace("'",'"',$v['data']),true);
		// si no existe frm_valor, voy por el siguiente
		if(! array_key_exists('frm_valor',$data) ) continue;
		$valor = "";
		if( $data['frm_valor'] == -1 ) $valor = "<i class='fas fa-arrow-alt-circle-down text-danger'></i> negativo";
		if( $data['frm_valor'] == 0 ) $valor = "<i class='fas fa-minus-circle text-warning'></i> neutro";
		if( $data['frm_valor'] == 1 ) $valor = "<i class='fas fa-arrow-alt-circle-up text-success'></i> positivo";
		$medio = R::findOne('medio','id LIKE ?',[ $v['id_medio'] ])['medio'];
		$arr_todo[] = [
			$v['id'],
			$valor,
			"<span class='text-truncate d-block' style='width:450px;'>{$v['titulo']}</span>",
			$medio,
			( $v['url'] == null ) ? '<i class="fas fa-unlink text-danger"></i>' : "<a style='text-decoration:none;' class='text-primary' href='{$v['url']}' target='blank'><i class='fas fa-external-link-alt'></i></a>"
		];
	}
	return [
		'columnas' => $columnas,
		'filas' => $arr_todo
		];
}

// INSTITUCIONES POR FAVORABILIDAD
function grafico_2_3( $desde, $hasta, $ua ){
	// traigo todas las noticias en esee rango de fechas
	$query = "select noticiasinstitucion.id_institucion, noticiasinstitucion.data from noticiasinstitucion
		inner join proceso on noticiasinstitucion.id_noticia = proceso.id_noticia 
		inner join noticia on noticia.id = proceso.id_noticia 
		where 
			proceso.id_cliente = " . $ua . "
			and proceso.elim = 0 
			and noticia.fecha BETWEEN '" . $desde . " 00:00:00' and '" . $hasta . " 23:59:59'";
	
	$main = R::getAll($query);
	$matrix = []; // contiene a todos
	$arr_id_aux = []; // contiene los indices, posicional a matrix
	foreach($main as $k=>$v){
		$pos = array_search($v['id_institucion'],$arr_id_aux);
		// obtengo la valoracion
		$data = json_decode( str_replace("'",'"',$v['data']),true);
		// si no tiene clave frm_valor, no lo introduzco
		if(! array_key_exists('frm_valor',$data) )
			continue; // TODO: ACA PONER QUIENES NO TIENEN FRM_VALOR PARA MOSTRAR

		if($pos !== false){
			$matrix[ $pos ]['valoracion'][ intval($data['frm_valor']) + 1 ] += 1; // sumo uno
			$matrix[ $pos ]['total'] += 1; // sumo 1
		}
		else{
			$institucion = R::findOne('attr_institucion','id LIKE ?',[ $v['id_institucion'] ]);
			if( is_null($institucion) ) $nombre = 'INSTITUCION SIN NOMBRE';
			else $nombre = $institucion['nombre'];
			//creo el array
			$uno = [0,0,0];
			$uno[ intval($data['frm_valor']) + 1 ] = 1; // es el primero
			$matrix[] = [
				'nombre' => $nombre,
				'id' => $v['id_institucion'],
				'valoracion' => $uno,
				'total' => 1 // es el primero que se hace
			];
			$arr_id_aux[] = $v['id_institucion'];
		}
	}
	
	// ordeno la matrix
	usort($matrix, function($a, $b) {
		return $b['total'] - $a['total'];
		});
	// lo parto en 3 para el grafico
	$grafico = [ [], [], [] ];
	$arr_instituciones = [];
	foreach($matrix as $k=>$v){
		$grafico[0][] = $v['valoracion'][0];
		$grafico[1][] = $v['valoracion'][1];
		$grafico[2][] = $v['valoracion'][2];
		$arr_instituciones[] = [
			'nombre' => $v['nombre'],
			'id' => $v['id']
			];
	}
	
	return [
		'instituciones_posicional' => $arr_instituciones,
		'tabla' => $matrix,
		'grafico' => $grafico
		];
}

function grafico_2_3_queryUrl( $desde, $hasta, $ua, $id){
	$query = "select noticia.id, noticiasinstitucion.data, noticia.titulo, noticia.id_medio, noticia.url from noticiasinstitucion 
		inner join proceso on noticiasinstitucion.id_noticia = proceso.id_noticia 
		inner join noticia on noticia.id = proceso.id_noticia 
		where 
			proceso.id_cliente = " . $ua . " 
			and proceso.elim = 0 
            and noticiasinstitucion.id_institucion = " . $id . "
			and noticia.fecha BETWEEN '" . $desde . " 00:00:00' and '" . $hasta . " 23:59:59'";
	
	$main = R::getAll($query);
	$arr_todo = [];
	$columnas = [
		(object) ['title' =>'id' ],
		(object) ['title' => 'valoracion'],
		(object) ['title' => 'titulo'],
		(object) ['title' => 'medio'],
		(object) ['title' => 'link'] ];
	foreach($main as $k=>$v){
		// obtengo el valor
		$data = json_decode( str_replace("'",'"',$v['data']),true);
		// si no existe frm_valor, voy por el siguiente
		if(! array_key_exists('frm_valor',$data) ) continue;
		$valor = "";
		if( $data['frm_valor'] == -1 ) $valor = "<i class='fas fa-arrow-alt-circle-down text-danger'></i> negativo";
		if( $data['frm_valor'] == 0 ) $valor = "<i class='fas fa-minus-circle text-warning'></i> neutro";
		if( $data['frm_valor'] == 1 ) $valor = "<i class='fas fa-arrow-alt-circle-up text-success'></i> positivo";
		$medio = R::findOne('medio','id LIKE ?',[ $v['id_medio'] ])['medio'];
		$arr_todo[] = [
			$v['id'],
			$valor,
			"<span class='text-truncate d-block' style='width:450px;'>{$v['titulo']}</span>",
			$medio,
			( $v['url'] == null ) ? '<i class="fas fa-unlink text-danger"></i>' : "<a style='text-decoration:none;' class='text-primary' href='{$v['url']}' target='blank'><i class='fas fa-external-link-alt'></i></a>"
		];
	}
	return [
		'columnas' => $columnas,
		'filas' => $arr_todo
		];
}

	// MEDIOS POR CANTIDAD
function grafico_3( $desde, $hasta, $ua){
	$query = "select noticia.id_medio, count(*) 
			as cantidad from noticia inner join proceso on 
			noticia.id = proceso.id_noticia 
			where proceso.id_cliente = " . $ua . " and
			proceso.elim = 0 and
			noticia.fecha between '" . $desde . " 00:00:00' and '" . $hasta . " 23:59:59'
			group by id_medio order by cantidad DESC";
	
	$main = R::getAll($query);
	$todo = [];
	foreach($main as $k=>$v){
		$nombre = R::findOne('medio','id LIKE ?',[ $v['id_medio'] ])['medio'];
		if( is_null($nombre) ) $nombre = 'MEDIO SIN NOMBRE';
		$todo[] = [
			'label' => $nombre,
			'value' => intval( $v['cantidad'] ),
			'color' =>  '#' . str_pad(dechex(mt_rand(0, 0xFFFFFF)), 6, '0', STR_PAD_LEFT) // color random
			];
	}
	return [
		'grafico' => $todo
		];
	
}

	// FAVORABILIDAD TOTAL
function grafico_3_2( $desde, $hasta, $ua){
	$query = "SELECT noticiasvaloracion.* FROM `noticiasvaloracion` 
		INNER JOIN noticia ON noticia.id = noticiasvaloracion.id_noticia
		INNER JOIN proceso on proceso.id_noticia = noticia.id
		WHERE
			noticiasvaloracion.id_cliente = " . $ua . " AND
			noticia.elim = 0 AND
			proceso.elim = 0 AND
			noticia.fecha BETWEEN '" . $desde . " 00:00:00' AND '" . $hasta . " 23:59:59'
		ORDER by id_noticia";
	
	$main = R::getAll($query);
	$todo = [];
	$current_sum = 0;
	$current_id = -1;
	foreach($main as $k=>$v){
		if($v['id_noticia'] != $current_id){
			// -1 es negativo, 0 neutro y +1 positivo
			if($current_sum > 0) $current_sum = 1;
			elseif($current_sum < 0) $current_sum = -1;
			$todo[] = [
				'id' => $current_id,
				'sum' => $current_sum
				];
			// el nuevo valor
			$current_id = $v['id_noticia'];
			$current_sum =  intval( $v['valor'] );
		} else
			$current_sum += intval( $v['valor'] );
	}
	unset($todo[0]);
	return [
		'grafico' => $todo
		];
	
}

function grafico_3_2_queryUrl( $array_id ){
	$columnas = [
		(object) ['title' =>'id' ],
		(object) ['title' => 'titulo'],
		(object) ['title' => 'medio'],
		(object) ['title' => 'link'] 
	];
	
	$query = "select id, titulo, id_medio, url from noticia where id IN (" . implode(",",$array_id) . ")";
	$ret = R::getAll($query);
	$filas = [];
	foreach($ret as $k=>$v){
		$medio = R::findOne('medio','id LIKE ?',[ $v['id_medio'] ])['medio'];
		$filas[] = [
			$v['id'],
			$v['titulo'],
			$medio,
			( $v['url'] == null ) ? '<i class="fas fa-unlink text-danger"></i>' : "<a style='text-decoration:none;' class='text-primary' href='{$v['url']}' target='blank'><i class='fas fa-external-link-alt'></i></a>"
		];
	}
	return [
		'columnas' => $columnas,
		'filas' => $filas
		];
}


function grafico_4( $desde, $hasta, $ua) {
	$query = "SELECT n.id, n.id_medio AS medio, np.data, nt.id_tema AS tema, nt.valor FROM `noticia` AS n
		INNER JOIN proceso AS p ON (p.id_cliente = {$ua} AND p.id_noticia = n.id AND p.elim = 0)
		INNER JOIN noticiasproceso AS np ON (np.id_noticia = n.id AND np.elim = 0)
		INNER JOIN noticiastema AS nt ON (nt.id_noticia = n.id AND nt.elim = 0)
		WHERE n.fecha BETWEEN '{$desde} 00:00:00' AND '{$hasta} 23:59:59' AND n.elim = 0";

	$main = R::getAll($query);
  	$A_elementos = [];
	  //medio-destaque-temas-valoracion,X
	$color = ["#ffc107","#28a745","#dc3545","#DEDEDE"];//COLORES BÁSICOS
	$color["medio"] = [];
	$color["tema"] = [];
	$color["destaque"] = [];
	
	foreach($main as $k => $v) {
		$data = str_replace("'",'"',$v['data']);
		$data = json_decode($data);
		$valoracion = "Neutro//#ffc107";
		if($v["valor"] == 1) $valoracion = "Positivo//#28a745";
		if($v["valor"] == -1) $valoracion = "Negativo//#dc3545";
		if(empty($data->select_destaque)) $destaqueNombre = "Sin destaque//#DEDEDE";
		else {
			$destaque = R::findOne('medio_destaque','id = ? AND elim = ?',[ $data->select_destaque,0 ]);
			$destaqueNombre = "{$destaque["lugar"]}";
			if (!empty($destaque["destaque"])) $destaqueNombre .= ", {$destaque["destaque"]}";
			if (!is_null($destaque["color"])) {
				if( !isset($color["destaque"][$destaque["id"]]) ) {
					if(!in_array($destaque["color"],$color))
						$color[] = $destaque["color"];
					$color["destaque"][$destaque["id"]] = $destaque["color"];
				}
			} else {
				do {
					$aux = bgColor();
				} while(in_array($aux,$color));
				if( !isset($color["destaque"][$destaque["id"]]) ) {
					$color[] = $aux;
					$color["destaque"][$destaque["id"]] = $aux;
				}
			} 
			$destaqueNombre .= "//{$color["destaque"][$destaque["id"]]}";
		}

		$medioR = R::findOne('medio','id LIKE ? AND elim = ?',[ $v['medio'],0 ]);
		$medio = $medioR["medio"];
		if( is_null($medio) ) $medio = 'Sin medio//#DEDEDE';
		else {
			if(!is_null($medioR["color"])) {
				if( !isset($color["medio"][$medioR["id"]]) ) {
					if(!in_array($medioR["color"],$color))
						$color[] = $medioR["color"];
					$color["medio"][$medioR["id"]] = $medioR["color"];
				}
			} else {
				do {
					$aux = bgColor();
				} while(in_array($aux,$color));
				if( !isset($color["medio"][$medioR["id"]]) ) {
					$color[] = $aux;
					$color["medio"][$medioR["id"]] = $aux;
				}
			}
			$medio .= "//{$color["medio"][$medioR["id"]]}";
		}
		$temaR = R::findOne('attr_temas','id = ? AND elim = ?',[ $v['tema'],0 ]);
		$tema = $temaR['nombre'];
		if( is_null($tema) ) $tema = 'Sin tema//#DEDEDE';
		else {
			if(!is_null($temaR["color"])) {
				if( !isset($color["tema"][$temaR["id"]]) ) {
					if(!in_array($temaR["color"],$color))
						$color[] = $temaR["color"];
					$color["tema"][$temaR["id"]] = $temaR["color"];
				}
			} else {
				do {
					$aux = bgColor();
				} while(in_array($aux,$color));
				if( !isset($color["tema"][$temaR["id"]]) ) {
					$color[] = $aux;
					$color["tema"][$temaR["id"]] = $aux;
				}
			}
			$tema .= "//{$color["tema"][$temaR["id"]]}";
		}
    	$A_elementos[] = "{$medio}__:__{$destaqueNombre}__:__{$tema}__:__{$valoracion}";
	}
	$data = [];
	$aux = array_count_values($A_elementos);
	foreach ($aux as $key => $value) {
		$data[] = "{$key},{$value}";
	}
	return [
		'grafico' => $data
	];

}

//TABLA Círculos
function grafico_4_queryUrl( $desde, $hasta, $ua, $data ) {
	$elemento = json_decode($data);//a buscar
	$idmedio = R::findOne("medio","medio LIKE ? AND elim = ?",[ $elemento[0], 0 ]);

	$query = "SELECT n.id, n.titulo, n.url, np.data, nt.id_tema AS tema, nt.valor FROM `noticia` AS n
		INNER JOIN proceso AS p ON (p.id_cliente = {$ua} AND p.id_noticia = n.id AND p.elim = 0)
		INNER JOIN noticiasproceso AS np ON (np.id_noticia = n.id AND np.elim = 0)
		INNER JOIN noticiastema AS nt ON (nt.id_noticia = n.id AND nt.elim = 0)
		WHERE n.fecha BETWEEN '{$desde} 00:00:00' AND '{$hasta} 23:59:59' AND n.id_medio = {$idmedio["id"]} AND n.elim = 0";

	$main = R::getAll($query);
	$arr_todo = [];
	$columnas = [
		(object) ['title' =>'id' ],
		(object) ['title' => 'valoracion'],
		(object) ['title' => 'titulo'],
		(object) ['title' => 'medio'],
		(object) ['title' => 'destaque'],
		(object) ['title' => 'link'] ];
	foreach($main as $k=>$v){
		// obtengo el valor
		$valor = "";
		$data = str_replace("'",'"',$v['data']);
		$temaR = R::findOne('attr_temas','id = ? AND elim = ?',[ $v['tema'],0 ]);
		$data = json_decode($data);
		$valor = "<i class='fas fa-minus-circle text-warning'></i> neutro";
		if($v["valor"] == 1) $valor = "<i class='fas fa-arrow-alt-circle-up text-success'></i> positivo";
		if($v["valor"] == -1) $valor = "<i class='fas fa-arrow-alt-circle-down text-danger'></i> negativo";
		if(empty($data->select_destaque)) $destaqueNombre = "Sin destaque";
		else {
			$destaque = R::findOne('medio_destaque','id = ? AND elim = ?',[ $data->select_destaque,0 ]);
			$destaqueNombre = "{$destaque["lugar"]}";
			if (!empty($destaque["destaque"])) $destaqueNombre .= ", {$destaque["destaque"]}";
		}
		if(count($elemento) >= 2)
			if($destaqueNombre != $elemento[1]) continue;
			
		if(count($elemento) >= 3)
			if($temaR["nombre"] != $elemento[2]) continue;
		
		if(count($elemento) == 4) {
			$aux = 0;
			if($elemento[3] == "Positivo")
				$aux = 1;
			if($elemento[3] == "Negativo")
				$aux = -1;
			if($v["valor"] != $aux) continue;
		}
		
		$arr_todo[] = [
			$v['id'],
			$valor,
			"<span class='text-truncate d-block' style='width:450px;'>{$v['titulo']}</span>",
			$idmedio["medio"],
			$destaqueNombre,
			( $v['url'] == null ) ? '<i class="fas fa-unlink text-danger"></i>' : "<a style='text-decoration:none;' class='text-primary' href='{$v['url']}' target='blank'><i class='fas fa-external-link-alt'></i></a>"
		];
	}
	return [
		'columnas' => $columnas,
		'filas' => $arr_todo
		];
}


if($grafico == 'grafico_1') echo json_encode( grafico_1( $desde, $hasta, $ua ) );
if($grafico == 'grafico_1_2') echo json_encode( grafico_1_2( $desde, $hasta, $ua ) );
if($grafico == 'grafico_1_3') echo json_encode( grafico_1_3( $desde, $hasta, $ua ) );
if($grafico == 'grafico_2') echo json_encode( grafico_2( $desde, $hasta, $ua ) );
if($grafico == 'grafico_2_2') echo json_encode( grafico_2_2( $desde, $hasta, $ua ) );
if($grafico == 'grafico_2_3') echo json_encode( grafico_2_3( $desde, $hasta, $ua ) );
if($grafico == 'grafico_3') echo json_encode( grafico_3( $desde, $hasta, $ua ) );
if($grafico == 'grafico_3_2') echo json_encode( grafico_3_2( $desde, $hasta, $ua ) );
if($grafico == 'grafico_4') echo json_encode( grafico_4( $desde, $hasta, $ua ) );
// subquerys
if( isset( $_GET['id'] ) ){
	if($grafico == 'grafico_1_url') echo json_encode( grafico_1_queryUrl( $desde, $hasta, $ua, $_GET['id'] ) );
	if($grafico == 'grafico_1_2_url') echo json_encode( grafico_1_2_queryUrl( $desde, $hasta, $ua, $_GET['id'] ) ); 
	if($grafico == 'grafico_2_url') echo json_encode( grafico_2_queryUrl( $desde, $hasta, $ua, $_GET['id'] ) );
	if($grafico == 'grafico_2_2_url') echo json_encode( grafico_2_2_queryUrl( $desde, $hasta, $ua, $_GET['id']) );
	if($grafico == 'grafico_2_3_url') echo json_encode( grafico_2_3_queryUrl( $desde, $hasta, $ua, $_GET['id']) );
}
// realmente no importa si envian cualquier cosa en otro dato, aqui solo importa los ids
if( isset($_POST['ids']) && $grafico == 'grafico_3_2_url' ) echo json_encode( grafico_3_2_queryUrl( $_POST['ids'] ) );

if( isset( $_GET['data'] ) ) {
	if($grafico == 'grafico_4_url') echo json_encode( grafico_4_queryUrl( $desde, $hasta, $ua, $_GET['data'] ) );
}

/*echo json_encode(
	[
		'tabla' => $tabla,
		'grafico' => $objeto,
		'temas' => $temas //,
		// 'colores_cantidad' => $colores_cantidad // numero a modular por crc32(temas)
	]
);*/

function bgColor() {
	$color = dechex(rand(0x000000, 0xDDDDDD));
	return "#{$color}";
}
