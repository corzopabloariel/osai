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

$desde = $_GET['desde'];
$hasta = $_GET['hasta'];
$ua = $_GET['ua'];

// parametros

$colores_cantidad = 15; // para el JS

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
			$in->name = $v['tema'] . " (" . $v['cantidad'] . ") " ;
			$in->rank = 1;
			$in->weight = crc32($v['tema']) % $colores_cantidad; // obtneog un numero unico para cada string repetido en mi base de colores (15)
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
		$in->weight = crc32($v['actor']) % $colores_cantidad; // obtneog un numero unico para cada string repetido en mi base de colores (15)
		$in->id = $k;
			$t_in = new StdClass();
			$t_in->name = $v['tema'] . " (" . $v['cantidad'] . ") " ;
			$t_in->rank = 1;
			$t_in->weight = crc32($v['tema']) % $colores_cantidad; // obtneog un numero unico para cada string repetido en mi base de colores (15)
			$t_in->id = $k;
			$t_in->children = [];
		$in->children = [ $t_in ];
		$objeto->children[] = $in;
	}
}

echo json_encode(
	[
		'tabla' => $tabla,
		'grafico' => $objeto,
		'temas' => $temas,
		'colores_cantidad' => $colores_cantidad // numero a modular por crc32(temas)
	]
);
