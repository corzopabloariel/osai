<?php
session_start();
require_once 'config.php';
require_once 'ext/rb.php';

error_reporting(E_ALL);
ini_set('display_errors', 1);

/**
 * id_noticia -> ID de la tabla noticias
 * did_noticia -> ID de la tabla noticia (OJO)
 */
R::setup("mysql:host=".CONFIG_HOST.";dbname=".CONFIG_BD,CONFIG_USER,CONFIG_PASS);

$mysqli = new mysqli(CONFIG_HOST, CONFIG_USER, CONFIG_PASS, CONFIG_BD);
$mysqli->set_charset('utf8');
if(isset($_REQUEST["start"]))
  $params = $_REQUEST;
else {
  $prueba = true;
  $params = Array();
  $params["start"] = 0;
  $params["length"] = 10;
  $params["draw"] = 0;
  $params["medioFilter"] = 1;
}

$flag = true;//Flag que cambia de estado si recibe parámetros para filtro
// **** Esto es importante ****
// Si es true, guarda en una variable de session la cantidad total de registros
// Si es false, muestra lo guardado junto a los registros filtrados (tienen que ser menos)
///////////// DATOS DE OTRAS TABLAS
$seccion = R::findAll("seccion","elim = 0");
$medio = R::findAll("medio","elim = 0");
$medio_tipo = R::findAll("medio_tipo","elim = 0");
$cliente = R::findAll("cliente","elim = 0");
$cliente_final = R::findAll("osai_usuario","elim = 0");
$usuario = R::findAll("usuario","elim = 0");
$tema = R::findAll("attr_temas","elim = 0");
$actor = R::findAll("actor","elim = 0");
/////////////
$relevos = R::findAll("noticiarelevo","elim = 0");
$procesos = R::findAll("proceso","elim = 0");
//////////// VARIABLES
$ARR_relevo = Array();
$ARR_usuario = Array();
$attr = $where_condition = $inner = $group = "";
$sqlVISTA = "";
///////////
$attr .= "n.id,";
$attr .= "n.titulo,";
$attr .= "n.fecha,";
$attr .= "n.estado,";
$attr .= "n.estado AS estado_num,";
$attr .= "n.id_seccion AS seccion,";
$attr .= "n.id_medio AS medio,";
$attr .= "n.id_medio_tipo AS medio_tipo";
////////////
$where_condition .=	"WHERE n.elim = 0 AND n.titulo != '' ";
/* <FILTROS> */

if(isset($params["seccionFilter"]) && !empty($params["seccionFilter"])) {
  $seccionIN = "";
  $secciones = json_decode($params["seccionFilter"]);
  $seccionIN = implode($secciones,",");

  if(!empty($seccionIN)) {
    $where_condition .= "AND n.id_seccion IN ({$seccionIN}) ";
    $flag = false;
  }
}
if(isset($params["medioTipoFilter"]) && !empty($params["medioTipoFilter"])) {//TIPO DE MEDIO
  $where_condition .= "AND n.id_medio_tipo = {$params["medioTipoFilter"]} ";
  $flag = false;
}
if(isset($params["minDateFilter"]) && !empty($params["minDateFilter"])) {//FECHA MIN
  $where_condition .= "AND DATE_FORMAT(n.fecha, '%Y%m%d') >= DATE_FORMAT('{$params["minDateFilter"]}', '%Y%m%d') ";
  $flag = false;
}
if(isset($params["maxDateFilter"]) && !empty($params["maxDateFilter"])) {//FECHA MAX
  $where_condition .= "AND DATE_FORMAT(n.fecha, '%Y%m%d') <= DATE_FORMAT('{$params["maxDateFilter"]}', '%Y%m%d') ";
  $flag = false;
}
if(isset($params["medioFilter"]) && !empty($params["medioFilter"])) {//MEDIO
  $where_condition .=	"AND n.id_medio = {$params["medioFilter"]} ";
  $flag = false;
}
if(isset($params["tituloFilter"]) && !empty($params["tituloFilter"])) {//TITULO
  $where_condition .=	"AND CONCAT(n.titulo,'__',n.cuerpo) LIKE '%{$params["tituloFilter"]}%' ";
  $flag = false;
}
/* </FILTROS> */
/* <VISTA> */
if(isset($params["estado"]) && isset($params["moderado"]))//NOTICIAS a RELEVAR
  $where_condition .= "AND n.estado IN (0,1) AND n.relevado = 0 ";
else if(isset($params["moderado"]) && !isset($params["estado"])) {//NOTICIAS a PROCESAR
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
} else if(!isset($params["moderado"]) && isset($params["estado"])) {//NOTICIAS PROCESADAS
  $where_condition .= "AND n.estado IN (2,6) AND n.relevado = 1 ";
  $attr .= ",GROUP_CONCAT(p.id_cliente) AS cliente";
  $attr .= ",GROUP_CONCAT(na.id_actor) AS actor";
  $attr .= ",GROUP_CONCAT(nt.id_tema) AS tema";
  $attr .= ",u.id AS usuario";
  $attr .= ",p.autofecha AS fecha_proceso";
  $group .= "n.id, p.id_cliente";
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
    $inner .= "INNER JOIN usuario AS u ON (u.elim = 0 AND u.id = p.id_usuario AND p.id_usuario = {$_SESSION["user_id"]}) ";
  }

  if(isset($params["temasFilter"]) && !empty($params["temasFilter"])) {
    $temas = $params["temasFilter"];
    $temasIN = "";
    for($i = 0; $i < count($temas); $i ++) {
      if($temasIN != "") $temasIN .= ",";
      $temasIN .= $temas[$i];
    }
    $inner .= "INNER JOIN noticiastema AS nt ON (nt.id_noticia = n.id AND nt.elim = 0 AND nt.id_tema IN ({$temasIN}))";
  } else
    $inner .= "INNER JOIN noticiastema AS nt ON (nt.id_noticia = n.id AND nt.elim = 0)";
  if(isset($params["actoresFilter"]) && !empty($params["actoresFilter"])) {
    $actores = $params["actoresFilter"];
    $actoresIN = "";
      for($i = 0; $i < count($actores); $i ++) {
        if($actoresIN != "") $actoresIN .= ",";
        $actoresIN .= $actores[$i];
      }
      $inner .= "INNER JOIN noticiasactor AS na ON (na.id_noticia = n.id AND na.elim = 0 AND na.id_actor IN ({$actoresIN})) ";
  } else
    $inner .= "INNER JOIN noticiasactor AS na ON (na.id_noticia = n.id AND na.elim = 0) ";
  
} else if(isset($params["clipping"])) {
  $idAgendaNacional = 12;
  $where_condition .= "AND n.estado IN (3,4,5) ";//ESTADOS DISPONIBLES
  $attr .= ",GROUP_CONCAT(p.id_cliente) AS cliente";
  $attr .= ",GROUP_CONCAT(oc.id_usuario_osai) AS cliente_final";
  $attr .= ",oc.autofecha AS fecha_clipping";
  $group .= "n.id";

  $inner = "INNER JOIN proceso AS p ON (p.elim = 0 AND p.id_noticia = n.id_noticia AND p.id_cliente != {$idAgendaNacional}) ";

  if(isset($params["unidadFilter"]) && !empty($params["unidadFilter"]))
    $inner .= "INNER JOIN osai_cliente AS oc ON (oc.elim = 0 AND oc.id_noticia = n.id AND oc.id_usuario_osai = {$params["unidadFilter"]} AND oc.tipo_aviso = 1)";
  else
    $inner .= "INNER JOIN osai_cliente AS oc ON (oc.elim = 0 AND oc.id_noticia = n.id AND oc.tipo_aviso IN (0,1)) ";

}
/* </VISTA> */
$sqlVISTA .= "SELECT {$attr} FROM noticia AS n ";
$sqlVISTA .= "{$inner} {$where_condition} " . (!empty($group) ? "GROUP BY {$group} " : "");

$total = total($mysqli,$sqlVISTA);// CALCULO DEL TOTAL DE REGISTROS SIN LIMIT
// $total = 10;
$recordsTotal = 0;
$recordsFiltered = 0;
if($flag) {
  $_SESSION["total"] = $total;
  $recordsTotal = $total;
  $recordsFiltered = $total;
} else {
  $recordsFiltered = $total;
  $recordsTotal = $total;
  if(isset($_SESSION["total"]) && $total != $_SESSION["total"])
    $recordsTotal = $_SESSION["total"];
}

$Adatos = separarPOR($mysqli,$sqlVISTA,["medio","medio_tipo","seccion","cliente","usuario","cliente_final","tema","actor"]);

$Adatos["estado"] = Array();
$Adatos["estado"][] = "SIN PROCESAR";//0
$Adatos["estado"][] = "ABIERTO";//1
$Adatos["estado"][] = "PROCESADA";//2
$Adatos["estado"][] = "PUBLICADA";//3
$Adatos["estado"][] = "PUBLICADA";//4
$Adatos["estado"][] = "";//5
$Adatos["estado"][] = "ABIERTO";//6 -> NOTICIA PROCESADA ABIERTA EN EDICIÓN

$sqlVISTA .= "ORDER BY n.fecha DESC LIMIT {$params['start']},{$params['length']}";
$data = [];
if($queryRecords = $mysqli->query($sqlVISTA)) {
  while($noticia = $queryRecords->fetch_assoc()) {
    $noticia["titulo"] = trim($noticia["titulo"]);
    $noticia["seccion"] = $Adatos["seccion"][$noticia["seccion"]];
    $noticia["medio"] = $Adatos["medio"][$noticia["medio"]];
    $noticia["medio_tipo"] = $Adatos["medio_tipo"][$noticia["medio_tipo"]];
    $noticia["estado"] = $Adatos["estado"][$noticia["estado"]];
    if(isset($noticia["cliente"])) {
      if(strpos($noticia["cliente"],",") === false) {
        if($noticia["cliente"] == "") continue;
        $c = $noticia["cliente"];
        $noticia["cliente"] = "<p class='m-0'>{$Adatos["cliente"][$c]}</p>";
      } else {
        $clientes = explode(",",$noticia["cliente"]);
        $noticia["cliente"] = "";
        foreach($clientes AS $a) {
          if(empty($a)) continue;
          if(strpos($noticia["cliente"], "<p class='m-0'>{$Adatos["cliente"][$a]}</p>") === false)
            $noticia["cliente"] .= "<p class='m-0'>{$Adatos["cliente"][$a]}</p>";
        }
      }
    }
    if(isset($noticia["cliente_final"])) {
      if(strpos($noticia["cliente_final"],",") === false) {
        if($noticia["cliente_final"] == "") continue;
        $c = $noticia["cliente_final"];
        $noticia["cliente_final"] = "<p class='m-0'>{$Adatos["cliente_final"][$c]}</p>";
      } else {
        $clientes = explode(",",$noticia["cliente_final"]);
        $noticia["cliente_final"] = "";
        foreach($clientes AS $a) {
          if(empty($a)) continue;
          if(strpos($noticia["cliente_final"], "<p class='m-0'>{$Adatos["cliente_final"][$a]}</p>") === false)
            $noticia["cliente_final"] .= "<p class='m-0'>{$Adatos["cliente_final"][$a]}</p>";
        }
      }
    }
    if(isset($noticia["tema"])) {
      if(strpos($noticia["tema"],",") === false) {
        if($noticia["tema"] == "") continue;
        $c = $noticia["tema"];
        $noticia["tema"] = "<p class='m-0'>{$Adatos["tema"][$c]}</p>";
      } else {
        $temas = explode(",",$noticia["tema"]);
        $noticia["tema"] = "";
        foreach($temas AS $a) {
          if(empty($a)) continue;
          if(strpos($noticia["tema"], "<p class='m-0'>{$Adatos["tema"][$a]}</p>") === false)
            $noticia["tema"] .= "<p class='m-0'>{$Adatos["tema"][$a]}</p>";
        }
      }
    }
    if(isset($noticia["actor"])) {
      if(strpos($noticia["actor"],",") === false) {
        if($noticia["actor"] == "") continue;
        $c = $noticia["actor"];
        $noticia["actor"] = "<p class='m-0'>{$Adatos["actor"][$c]}</p>";
      } else {
        $actores = explode(",",$noticia["actor"]);
        $noticia["actor"] = "";
        foreach($actores AS $a) {
          if(empty($a)) continue;
          if(strpos($noticia["actor"], "<p class='m-0'>{$Adatos["actor"][$a]}</p>") === false)
            $noticia["actor"] .= "<p class='m-0'>{$Adatos["actor"][$a]}</p>";
        }
      }
    }
    if(isset($noticia["usuario"]))
      $noticia["usuario"] = $Adatos["usuario"][$noticia["usuario"]];
    $data[] = $noticia;
  }
  $queryRecords->close();
}
function total($mysqli,$sql) {
  return mysqli_num_rows($mysqli->query($sql));
}
function separarPOR($mysqli,$sql,$Aelementos) {
  global $medio,$seccion,$medio_tipo,$cliente,$cliente_final,$usuario, $tema, $actor;
  $A = Array();
  $A["medio"] = Array();
  $A["seccion"] = Array();
  $A["medio_tipo"] = Array();
  $A["cliente"] = Array();
  $A["cliente_final"] = Array();
  $A["tema"] = Array();
  $A["actor"] = Array();

  $A["actor"]["column"] = "nombre";
  $A["actor"]["no"] = "SIN ACTOR";
  $A["tema"]["column"] = "nombre";
  $A["tema"]["no"] = "SIN TEMA";
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

  $A["usuario"]["column"] = "user";
  $A["usuario"]["no"] = "SIN USUARIO";
  $Adatos = Array();
  foreach($Aelementos AS $e) $Adatos[$e] = Array();
  if($queryRecords = $mysqli->query($sql)) {
    while($noticia = $queryRecords->fetch_assoc()) {
      foreach($Aelementos AS $e) {
        if(!isset($noticia[$e])) continue;
        $aux = $$e;
        if(!isset($Adatos[$e][$noticia[$e]])) {
          if($e == "cliente" || $e == "cliente_final" || $e == "tema" || $e == "actor") {
            $groupConcat = explode(",",$noticia[$e]);
            foreach($groupConcat AS $a) {
              if($a == "") continue;
              if(isset($aux[$a])) {
                if(!isset($Adatos[$e][$a])) {
                  if($e == "actor")
                    $Adatos[$e][$a] = "{$aux[$a][$A[$e]["column"]]} {$aux[$a]["apellido"]}";
                  else
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
  }
  return $Adatos;
}
mysqli_close($mysqli);

$json_data = array(
	"draw"            => intval( $params['draw'] ),
	"recordsTotal"    => intval( $recordsTotal ),//// en Vista
	"recordsFiltered" => intval( $recordsFiltered ),// en Total
	"data"            => $data
);

if(isset($prueba)) {
  echo trim($sqlVISTA);
  echo intval( $recordsTotal );
  echo intval( $recordsFiltered );
  print_r($data);
} else
  echo json_encode($json_data);

?>
