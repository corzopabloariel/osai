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
		$main[$k]['id_actor'] = $actores_nombres['nombre'] . " " . $actores_nombres['apellido'];
		$id_tema = get_string_between($main[$k]['tema'],"frm_tema_","\"");
		$tema = R::findOne("attr_temas","id LIKE ?",[$id_tema])['nombre'];
		if( is_null( $tema ) ) $tema = 'TEMA NO ASIGNADO';
		$main[$k]['tema'] = $tema;
		
		// if(array_search( [ $main[$k]['id_actor'],$tema], $tabla ) ) echo "repetido";
		// chequeo si ya existe alguno con este actor y tema, si es asi, sumo uno
		// TODO - FIXME : deberia ser mas eficiente, busqueda por dos valores
		$iter = true;
		foreach($tabla as $ka=>$va){
			if($va['actor'] == $main[$k]['id_actor'] && $va['tema'] == $tema){
				$tabla[$ka]['cantidad'] += 1;
				$iter = false;
				break;
			}
		}
		if($iter){
			$tabla[ ++$i ] = [ 
				'unidad_analisis' => $ua_nombre,
				'actor' => $main[$k]['id_actor'],
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


if($grafico == 'grafico_1') echo json_encode( grafico_1( $desde, $hasta, $ua ) );
if($grafico == 'grafico_1_2') echo json_encode( grafico_1_2( $desde, $hasta, $ua ) );
if($grafico == 'grafico_1_3') echo json_encode( grafico_1_3( $desde, $hasta, $ua ) );

/*echo json_encode(
	[
		'tabla' => $tabla,
		'grafico' => $objeto,
		'temas' => $temas //,
		// 'colores_cantidad' => $colores_cantidad // numero a modular por crc32(temas)
	]
);*/
