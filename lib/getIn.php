<?php

// incluyo la configuracion local y redbeans
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/ext/rb.php';
// configuro la db
R::setup("mysql:host=".CONFIG_HOST.";dbname=".CONFIG_BD,CONFIG_USER,CONFIG_PASS);

error_reporting(E_ALL);
ini_set('display_errors', 1);

/************************************************************
  RECIBO LA CARGA EN JSON Y LA DESPEDAZO, LAS PARTES SERIAN

*************************************************************/
if(isset($_POST['carga'])){
  echo ' se ingreso al if';
  try { $carga = json_decode($_POST['carga'],true); }
  catch (Exception $e) { echo 'Carga invalida'; exit(); }
  $i = R::dispense('instancias');
  // cargo la instancia
  $i['instancia'] = $carga['instancia']['_id'];
  $i['fecha'] = $carga['instancia']['fecha'];
  // traigo el id del medio
  $fk_medio = R::findOne('medio','nombre LIKE ?',[$carga['instancia']['medio']]);
  if($fk_medio != null) $i['medio'] = $fk_medio['id'];
  else $i['medio'] = null;
  $id_medio = $i['medio'];
  $id_medioTipo = ($fk_medio ? $fk_medio["id_medio_tipo"] : 0);
  $id_instancia = R::store($i);
  $nodos = $carga['nodos'];
  //var_dump($nodos);
  //$i = 0;
  $fechaINSTANCIA = $i["fecha"];
  foreach($nodos as $v){
    $n = R::dispense('noticias');
    $n['id_unico'] = $v['_id'];
    $n['id_instancia'] = $id_instancia;
    $n['identificador'] = $v['identificador'];
    $n['url'] = $v['url'];
    if(isset($v['data']['titulo'])) $n['titulo'] = $v['data']['titulo'];//TITULO

    // Si la noticia no tiene fecha, saca de la hora de extracción
    // La hora exacta
    if(! isset($v['data']['fecha'])) {
      //$i = R::findOne("instancias","id = ?",[$id_instancia]);
      $fechaBONITA = $fechaINSTANCIA;
      $fechaBONITA = str_replace("T"," ",$fechaBONITA);
      $fechaBONITA = date_create($fechaBONITA);
      $fechaBONITA = date_format($fechaBONITA,"Y/m/d H:i");
    } else {// Si posee hora, lo separa
		// SE HACE CONSULTA DE UN DATO QUE SE SABE, NO EXISTE YA EN LA
		// LINEA 43 AL HACER ISSET DE FECHA
      if(validarFecha($v['data']['fecha'])) { // dice que fecha no existe
        $fecha = $v['data']['fecha']; // dice que fecha no existe
        $fecha = trim($fecha);

        if(strpos($fecha, " ") === false) { // quiere decir que la fecha no contiene espacio
			// pero puede ser un iso8601
			if( strpos($fecha, "/") === false ){
				//list($d,$m,$a) = explode("/",$fecha);
				$a = substr($fecha,0,4);
				$m = substr($fecha,4,2);
				$d = substr($fecha,6,2);

				$date = date_create("{$m}/{$d}/{$a} 10:00");
				$fechaBONITA = date_format($date,"Y/m/d H:i");
			} else {
				// si la fecha tiene barra viene aca
			  list($d,$m,$a) = explode("/",$fecha);

			  $date = date_create("{$m}/{$d}/{$a} 10:00");
			  $fechaBONITA = date_format($date,"Y/m/d H:i");
			}
        } else {
          list($ff,$hh) = explode(" ",$fecha);
          if(strpos($hh, "hs") !== false) $hh = str_replace("hs","",$hh);
          list($d,$m,$a) = explode("/",$ff);
          $date = date_create("{$m}/{$d}/{$a} {$hh}");
          $fechaBONITA = date_format($date,"Y/m/d H:i");
        }
      } else {//Si encuentra una palabra compuesta, pone la fecha de extracción.
        $fechaBONITA = $fechaINSTANCIA;
        $fechaBONITA = str_replace("T"," ",$fechaBONITA);
        $fechaBONITA = date_create($fechaBONITA);
        $fechaBONITA = date_format($fechaBONITA,"Y/m/d H:i");
      }
    }
    $n['fecha'] = $fechaBONITA;

    $categoria = (isset($v['data']['categoria']) ? $v['data']['categoria'] : "");
    $categoria = getIDcategoria($categoria,$id_medio);
    $autor = (isset($v['data']['autor']) ? $v['data']['autor'] : "");
    $titulo = (isset($v['data']['titulo']) ? $v['data']['titulo'] : "");
    $titulo = trim($titulo);
    $autor = trim($autor);
    $categoria = trim($categoria);
    $n['categoria'] = $categoria;
    $n['titulo'] = $titulo;
    if(!empty($v['data']->cuerpo)) $v['data']['cuerpo'] = limpiarCuerpo($v['data']['cuerpo']);

    $n['data'] = json_encode($v['data']);//SE CONSERVA, POR SI LAS DUDAS
    $n['nueva'] = 1;//noticia nueva
    $id_noticias = R::store($n);
    // AGREGO DATOS EN LA TABLA. EN ESTA SE HACEN CONSULTAS LAS CONSULTAS
    $noticia = R::dispense('noticia');
    $noticia['id_noticia'] = $id_noticias;
    $noticia['id_medio'] = $id_medio;
    $noticia['id_medio_tipo'] = $id_medioTipo;
    $noticia['url'] = $v['url'];
    $noticia['titulo'] = $titulo;
    $noticia['cuerpo'] = $v['data']['cuerpo'];
    $noticia['cuerpo_solotexto'] =  preg_replace('!\s+!', ' ', strip_tags($v['data']['cuerpo']) ); // remueve espacios en blanco
    $noticia['fecha'] = $fechaBONITA;
    $noticia['id_seccion'] = $categoria;
    $noticia['nueva'] = 1;
    $noticia['estado'] = 0;
    $noticia['relevado'] = 0;
    $id_noticia = R::store($noticia);
    //
    if(!empty($autor)) {
      $periodista = R::findOne("periodista","nombre LIKE ?",[$autor]);
      if($periodista) {
        $noticiaperiodista = R::dispense('noticiaperiodista');
        $noticiaperiodista['id_noticia'] = $id_noticia;
        $noticiaperiodista['id_periodista'] = $periodista["id"];
        R::store($noticiaperiodista);
      } else {
        $periodista = R::dispense('periodista');
        $periodista['nombre'] = $autor;
        $id_periodista = R::store($periodista);
        //-----------> SI NO SE ENCUENTRA, SE AGREGA A LA TABLA GENERAL Y DESPUÉS EN LA ESPECIFICA
        $noticiaperiodista = R::dispense('noticiaperiodista');
        $noticiaperiodista['id_noticia'] = $id_noticia;
        $noticiaperiodista['id_periodista'] = $id_periodista;
        R::store($noticiaperiodista);
      }
    }
  }
  echo "CANTIDAD DE NODOS INSERTADOS: " . strval(count($nodos));
}

function limpiarCuerpo($cuerpoBASE) {
  $dom = new DOMDocument;
  libxml_use_internal_errors(true);
  $dom->loadHTML(mb_convert_encoding($cuerpoBASE, 'HTML-ENTITIES', 'UTF-8'));
  libxml_clear_errors();
  $xpath = new DOMXPath($dom);
  $nodes = $xpath->query('//*[@style]');
  foreach ($nodes as $node) $node->removeAttribute('style');
  $nodes = $xpath->query('//*[@class]');
  foreach ($nodes as $node) $node->removeAttribute('class');
  $nodes = $xpath->query('//*[@onclick]');
  foreach ($nodes as $node) $node->removeAttribute('onclick');

  $cuerpo = $dom->saveHTML();
  return $cuerpo;
}
function validarFecha($f) {
  $vocales = 0;
  foreach (count_chars($f, 1) as $i => $val) {
  	if (preg_match('/[aeiouáéíóúü]/i',chr($i)))
      $vocales ++;
  }

  return ($vocales == 0);//no encuentra ninguna vocal
}
function getIDcategoria($c,$id_medio) {
  $id = 1;
  try {
    $categoria = mb_strtoupper(trim($c));
    $aux = R::findOne("seccion","id_medio = ? AND nombre LIKE ?",[$id_medio,$categoria]);
    if(!$aux) {
      $seccion = R::dispense('seccion');
      $seccion["id_medio"] = $noticia["id_medio"];
      $seccion["nombre"] = $categoria;
      $id = R::store($seccion);
    } else $id = $aux["id"];
  }
  catch(Exception $e) {
  }
  return $id;
}
