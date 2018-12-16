<?php
session_start();
//header("Content-Type: text/event-stream\n\n");
$mysqli = new mysqli(CONFIG_HOST, CONFIG_USER, CONFIG_PASS, CONFIG_BD);
R::setup("mysql:host=".CONFIG_HOST.";dbname=".CONFIG_BD,CONFIG_USER,CONFIG_PASS);
//R::ext('xdispense', function( $type ){ return R::getRedBean()->dispense( $type ); });

error_reporting(E_ALL);
ini_set('display_errors', 1);

if(isset($_POST["vista"])) {
  $params = $_POST;

  if(isset($params["unidad"]) && !empty($params["unidad"])) $unidad = $params["unidad"];
  $seccion = R::findAll("seccion","elim = 0");
  $medio = R::findAll("medio","elim = 0");
  $medio_tipo = R::findAll("medio_tipo","elim = 0");
  $cliente = R::findAll("cliente","elim = 0");
  $cliente_final = R::findAll("osai_usuario","elim = 0");
  $usuario = R::findAll("usuario","elim = 0");
  /////////////
  $relevos = R::findAll("noticiarelevo","elim = 0");
  $procesos = R::findAll("proceso","elim = 0");
  ////////////
  $ARR_relevo = Array();
  $ARR_usuario = Array();

  $attr = $where_condition = $inner = $group = "";
  $sqlVISTA = "";
  ///////////
  $attr .= "n.id,";
  $attr .= "n.titulo,";
  $attr .= "n.fecha,";
  $attr .= "n.estado,";
  $attr .= "n.id_seccion AS seccion,";
  $attr .= "n.id_medio AS medio,";
  $attr .= "n.id_medio_tipo AS medio_tipo";
  ////////////
  $where_condition .=	"WHERE n.elim = 0 AND n.titulo != '' ";
  /* FILTROS */
  if(isset($params["select"]["seccion"]) && !empty($params["select"]["seccion"])) {
    $secciones = json_decode($params["select"]["seccion"]);
    $seccionIN = "";
    for($i = 0; $i < count($secciones); $i ++) {
      if($seccionIN != "") $seccionIN .= ",";
      $seccionIN .= $secciones[$i];
    }
    if(!empty($seccionIN)) {
      $where_condition .= "AND n.id_seccion IN ({$seccionIN}) ";
      $flag = false;
    }
  }
  if(isset($params["select"]["mediotipo"]) && !empty($params["select"]["mediotipo"])) {//TIPO DE MEDIO
    $where_condition .= "AND n.id_medio_tipo = {$params["select"]["mediotipo"]} ";
    $flag = false;
  }

  if(isset($params["select"]["medio"]) && !empty($params["select"]["medio"])) {//MEDIO
    $where_condition .=	"AND n.id_medio = {$params["select"]["medio"]} ";
    $flag = false;
  }
  /* / FILTROS */
  /* VISTA */
  if($params["vista"] == "relevo")//NOTICIAS a RELEVAR
    $where_condition .= "AND n.estado IN (0,1) AND n.relevado = 0 ";
  else if($params["vista"] == "procesar") {//NOTICIAS a PROCESAR
    $where_condition .= "AND n.estado IN (0,1) AND n.relevado = 1 ";
    $attr .= ",GROUP_CONCAT(nr.id_cliente) AS cliente";
    $group .= "n.id";
    if(isset($params["unidadFilter"]) && !empty($params["unidadFilter"]))
      $inner .= "INNER JOIN noticiarelevo AS nr ON (nr.elim = 0 AND nr.id_noticia = n.id_noticia AND nr.id_cliente = {$params["unidadFilter"]})";
    else
      $inner .= "INNER JOIN noticiarelevo AS nr ON (nr.elim = 0 AND nr.id_noticia = n.id_noticia)";

    foreach ($relevos as $relevo) {
      if(!array_key_exists($relevo["did_noticia"],$ARR_relevo)) $ARR_relevo[$relevo["did_noticia"]] = Array();
      $ARR_relevo[$relevo["did_noticia"]][] = $relevo["id_cliente"];
    }
  } else if($params["vista"] == "procesada") {//NOTICIAS PROCESADAS
    $where_condition .= "AND n.estado = 2 AND n.relevado = 1 ";
    $attr .= ",GROUP_CONCAT(p.id_cliente) AS cliente";
    $attr .= ",u.id AS usuario";
    $group .= "n.id";
    if($_SESSION['user_lvl'] <= 2) {
      if(isset($params["unidadFilter"]) && !empty($params["unidadFilter"]))
        $inner = "INNER JOIN proceso AS p ON (p.elim = 0 AND p.id_noticia = n.id_noticia AND p.id_cliente = {$params["unidadFilter"]})";
      else
        $inner = "INNER JOIN proceso AS p ON (p.elim = 0 AND p.id_noticia = n.id_noticia) ";
      $inner .= "INNER JOIN usuario AS u ON (u.elim = 0 AND u.id = p.id_usuario) ";
    } else if($_SESSION['user_lvl'] == 3) {
      if(isset($params["unidadFilter"]) && !empty($params["unidadFilter"]))
        $inner = "INNER JOIN proceso AS p ON (p.elim = 0 AND p.id_noticia = n.id_noticia AND p.id_cliente = {$params["unidadFilter"]})";
      else
        $inner = "LEFT JOIN proceso AS p ON (p.elim = 0 AND p.id_noticia = n.id_noticia) ";
      $inner .= "INNER JOIN usuario AS u ON (u.elim = 0 AND u.id = p.id_usuario AND p.id_usuario = {$_SESSION["user_id"]} OR u.elim = 0 AND u.id = p.id_usuario AND u.nivel = 4) ";
    } else {
      $inner = "INNER JOIN proceso AS p ON (p.elim = 0 AND p.id_noticia = n.id_noticia AND p.id_usuario = {$_SESSION["user_id"]}) ";
    }
  } else if($params["vista"] == "procesadas") {//NOTICIAS PROCESADAS --> BORRAR
    $where_condition .= "AND n.estado >= 2 AND n.relevado = 1 ";
    $attr .= ",GROUP_CONCAT(p.id_cliente) AS cliente";
    $attr .= ",u.id AS usuario";
    $group .= "n.id";
    if($_SESSION['user_lvl'] <= 2) {
      if(isset($params["unidadFilter"]) && !empty($params["unidadFilter"]))
        $inner = "INNER JOIN proceso AS p ON (p.elim = 0 AND p.id_noticia = n.id_noticia AND p.id_cliente = {$params["unidadFilter"]})";
      else
        $inner = "INNER JOIN proceso AS p ON (p.elim = 0 AND p.id_noticia = n.id_noticia) ";
      $inner .= "INNER JOIN usuario AS u ON (u.elim = 0 AND u.id = p.id_usuario) ";
    } else if($_SESSION['user_lvl'] == 3) {
      if(isset($params["unidadFilter"]) && !empty($params["unidadFilter"]))
        $inner = "INNER JOIN proceso AS p ON (p.elim = 0 AND p.id_noticia = n.id_noticia AND p.id_cliente = {$params["unidadFilter"]})";
      else
        $inner = "LEFT JOIN proceso AS p ON (p.elim = 0 AND p.id_noticia = n.id_noticia) ";
      $inner .= "INNER JOIN usuario AS u ON (u.elim = 0 AND u.id = p.id_usuario AND p.id_usuario = {$_SESSION["user_id"]} OR u.elim = 0 AND u.id = p.id_usuario AND u.nivel = 4) ";
    } else {
      $inner = "INNER JOIN proceso AS p ON (p.elim = 0 AND p.id_noticia = n.id_noticia AND p.id_usuario = {$_SESSION["user_id"]}) ";
    }
  } else if($params["vista"] == "clipping") {
    $where_condition .= "AND n.estado IN (3,4,5) ";

    $attr .= ",GROUP_CONCAT(p.id_cliente) AS cliente";
    $attr .= ",GROUP_CONCAT(oc.id_usuario_osai) AS cliente_final";
    $group .= "n.id";
    $inner = "INNER JOIN proceso AS p ON (p.elim = 0 AND p.id_noticia = n.id_noticia) ";

    if(isset($params["unidadFilter"]) && !empty($params["unidadFilter"]))
      $inner .= "INNER JOIN osai_cliente AS oc ON (oc.elim = 0 AND oc.id_noticia = n.id AND oc.id_usuario_osai = {$params["unidadFilter"]} AND oc.tipo_aviso = 1)";
    else
      $inner .= "INNER JOIN osai_cliente AS oc ON (oc.elim = 0 AND oc.id_noticia = n.id AND oc.tipo_aviso = 1) ";
  }
  /* / VISTA */

  $sqlVISTA .= "SELECT {$attr} FROM noticia AS n ";
  $sqlVISTA .= "{$inner} {$where_condition} " . (!empty($group) ? "GROUP BY {$group} " : "");

  $A_elementos = separarPOR($mysqli,$sqlVISTA,["medio","medio_tipo","seccion","cliente","cliente_final"]);
  if(count($A_elementos["cliente"])) $A_elementos["unidad"] = $A_elementos["cliente"];
  if(count($A_elementos["cliente_final"]) > 0) $A_elementos["unidad"] = $A_elementos["cliente_final"];

  asort($A_elementos["medio"]);
  asort($A_elementos["medio_tipo"]);
  asort($A_elementos["seccion"]);
} else {

  $A_elementos = Array();

  $A_elementos["total"] = R::count("noticia","elim = 0 AND titulo != ''");//TOTAL en la BD
  $A_elementos["relevo"] = R::count("noticia","elim = 0 AND titulo != '' AND relevado = 0 AND estado IN (0,1)");//TOTAL en el sistema
  $A_elementos["procesar"] = R::count("noticia","elim = 0 AND titulo != '' AND relevado = 1 AND estado IN (0,1)");//TOTAL relevadas y listas a procesar

  if($_SESSION["user_lvl"] <= 2)
    $total = R::count("noticia","elim = 0 AND titulo != '' AND estado = 2");
  else if($_SESSION["user_lvl"] == 3) {
    $group = "GROUP BY n.id_noticia";
    $where =	"n.elim = 0 ";
    $where .=	"AND n.titulo != '' ";
    $where .=	"AND n.estado = 2 ";
    $inner = "LEFT JOIN proceso AS p ON (p.elim = 0 AND p.id_noticia = n.id_noticia) ";
    $inner .= "INNER JOIN usuario AS u ON (u.elim = 0 AND u.id = p.id_usuario AND u.nivel = 3 AND p.id_usuario = {$_SESSION["user_id"]} OR u.elim = 0 AND u.id = p.id_usuario AND u.nivel = 4) ";
    //$attr .= ",GROUP_CONCAT(p.id_cliente) AS clientes,p.autofecha AS fecha_proceso,u.user AS usuario";
    //$inner .= "INNER JOIN usuario AS u ON (u.elim = 0 AND u.id = p.id_usuario AND u.nivel = 3 AND p.id_usuario = {$_SESSION["user_id"]} OR u.elim = 0 AND u.id = p.id_usuario AND u.nivel = 4) ";

    $count = R::getRow("SELECT COUNT(DISTINCT n.id) AS total FROM noticia AS n {$inner} WHERE {$where}");//AND  AND estado = 2
    $total = $count["total"];
  } else {
    $group = "GROUP BY n.id_noticia";
    $where =	"n.elim = 0 ";
    $where .=	"AND n.titulo != '' ";
    $where .=	"AND n.estado = 2 ";
    $inner = "INNER JOIN proceso AS p ON (p.elim = 0 AND p.id_noticia = n.id_noticia AND p.id_usuario = {$_SESSION["user_id"]}) ";
    // $inner .= "INNER JOIN usuario AS u ON (u.elim = 0 AND u.id = p.id_usuario AND u.nivel >= 3) ";
    $count = R::getRow("SELECT COUNT(*) AS total FROM noticia AS n {$inner} WHERE {$where}");//AND  AND estado = 2
    $total = $count["total"];
  }

  $A_elementos["procesadas"] = $total;
}

echo json_encode($A_elementos, JSON_FORCE_OBJECT);

//--------- FUNCIONES
function separarPOR($mysqli,$sql,$Aelementos) {
  global $medio,$seccion,$medio_tipo,$cliente,$cliente_final,$usuario;
  $A = Array();
  $A["medio"] = Array();
  $A["seccion"] = Array();
  $A["medio_tipo"] = Array();
  $A["cliente"] = Array();
  $A["cliente_final"] = Array();
  $A["medio"]["column"] = "medio";
  $A["medio"]["no"] = "SIN MEDIO";
  $A["seccion"]["column"] = "nombre";
  $A["seccion"]["no"] = "SIN SECCIÓN";
  $A["medio_tipo"]["column"] = "nombre";
  $A["medio_tipo"]["no"] = "SIN TIPO DE MEDIO";

  $A["cliente"]["column"] = "nombre";
  $A["cliente"]["no"] = "SIN CLIENTE";
  $A["cliente_final"]["column"] = "user";
  $A["cliente_final"]["no"] = "SIN CLIENTE";
  $Adatos = Array();
  foreach($Aelementos AS $e) $Adatos[$e] = Array();
  if($queryRecords = $mysqli->query($sql)) {
    while($noticia = $queryRecords->fetch_assoc()) {
      foreach($Aelementos AS $e) {
        if(!isset($noticia[$e])) continue;
        $aux = $$e;
        if(!isset($Adatos[$e][$noticia[$e]])) {
          if($e == "cliente") {
            $clientes = explode(",",$noticia[$e]);
            foreach($clientes AS $a) {
              if(empty($a)) continue;
              if(isset($aux[$a])) {
                if(!isset($Adatos[$e][$a])) {
                  $Adatos[$e][$a] = $aux[$a][$A[$e]["column"]];
                }
              } else $Adatos[$e][$a] = $A[$e]["no"];
            }
          } else {
            if(isset($aux[$noticia[$e]])) {
              if(!isset($Adatos[$e][$noticia[$e]]))
                $Adatos[$e][$noticia[$e]] = $aux[$noticia[$e]][$A[$e]["column"]];
            } else $Adatos[$e][$noticia[$e]] = $A[$e]["no"];
          }
        }
      }

    }
    $queryRecords->close();
  }
  return $Adatos;
}
?>
