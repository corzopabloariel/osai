<?php
session_start();
require_once 'config.php';
require_once 'ext/rb.php';

$mysqli = new mysqli(CONFIG_HOST, CONFIG_USER, CONFIG_PASS, CONFIG_BD);
R::setup("mysql:host=".CONFIG_HOST.";dbname=".CONFIG_BD,CONFIG_USER,CONFIG_PASS);

error_reporting(E_ALL);
ini_set('display_errors', 1);
$params = Array();//POST
$params["vista"] = "";
$params["select"] = Array();
$params["select"]["seccion"] = "[2,5,10,20,11,12,13,30,31,40]";

$flag = true;//Flag que cambia de estado si recibe parámetros para filtro
// **** Esto es importante ****
// Si es true, guarda en una variable de session la cantidad total de registros
// Si es false, muestra lo guardado junto a los registros filtrados (tienen que ser menos)
/*
$_POST["vista"] -> QUE TIPO DE VISTA SE ESTA USANDO
$_POST["select"] -> FILTROS


if($_POST["vista"] == "relevo") $where .= "AND n.relevado = 0 AND n.estado != 2 ";
if($_POST["vista"] == "procesar") $where .= "AND n.relevado = 1 ";
if($_POST["vista"] == "procesada") $where .= "AND n.estado = 2 AND n.relevado = 1 ";
*/
if(isset($params["unidad"]) && !empty($params["unidad"])) $unidad = $params["unidad"];
$seccion = R::findAll("seccion","elim = 0");
$medio = R::findAll("medio","elim = 0");
$medio_tipo = R::findAll("medio_tipo","elim = 0");
$cliente = R::findAll("cliente","elim = 0");
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
$seccionIN = "";
if(isset($params["select"]["seccion"]) && !empty($params["select"]["seccion"])) {
  $secciones = json_decode($params["select"]["seccion"]);
  for($i = 0; $i < count($secciones); $i ++) {
    if($seccionIN != "") $seccionIN .= ",";
    $seccionIN .= $secciones[$i];
  }

  $where_condition .= "AND n.id_seccion IN ({$seccionIN}) ";
  $flag = false;
}
if(isset($params["mediotipo"]) && !empty($params["mediotipo"])) {//TIPO DE MEDIO
  $where_condition .= "AND n.id_medio_tipo = {$params["mediotipo"]} ";
  $flag = false;
}

if(isset($params["medio"]) && !empty($params["medio"])) {//MEDIO
  $where_condition .=	"AND n.id_medio = {$params["medio"]} ";
  $flag = false;
}
/* / FILTROS */
/* VISTA */
if($params["vista"] == "relevo")//NOTICIAS a RELEVAR
  $where_condition .= "AND n.estado IN (0,1) AND n.relevado = 0 ";
else if($params["vista"] == "procesar") {//NOTICIAS a PROCESAR
  $where_condition .= "AND n.estado != 2 AND n.relevado = 1 ";
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
} else if($params["vista"] == "procesadas") {//NOTICIAS PROCESADAS
  $where_condition .= "AND n.estado = 2 AND n.relevado = 1 ";
  $attr .= ",GROUP_CONCAT(p.id_cliente) AS cliente";
  $attr .= ",u.id AS usuario";
  $group .= "n.id";

  if(isset($params["unidadFilter"]) && !empty($params["unidadFilter"]))
    $inner = "INNER JOIN proceso AS p ON (p.elim = 0 AND p.id_noticia = n.id_noticia AND p.id_cliente = {$params["unidadFilter"]})";
  else
    $inner = "INNER JOIN proceso AS p ON (p.elim = 0 AND p.id_noticia = n.id_noticia)";
  $inner .= "INNER JOIN usuario AS u ON (u.elim = 0 AND u.id = p.id_usuario) ";
}
/* / VISTA */

$sqlVISTA .= "SELECT {$attr} FROM noticia AS n ";
$sqlVISTA .= "{$inner} {$where_condition} " . (!empty($group) ? "GROUP BY {$group} " : "");
$total = totalBASE($mysqli,$sqlVISTA);
echo "{$sqlVISTA}\n";
echo "REGISTROS FILTRADOS: {$total}\n";

$Adatos = separarPOR($mysqli,$sqlVISTA,["medio","medio_tipo","seccion","cliente","usuario"]);
print_r($Adatos);
$Adatos["estado"] = Array();
$Adatos["estado"][] = "SIN PROCESAR";
$Adatos["estado"][] = "ABIERTO";
$Adatos["estado"][] = "PROCESADA";

$sqlVISTA .= "ORDER BY n.fecha DESC LIMIT 0,20";
echo "EN VISTA: " . totalBASE($mysqli,$sqlVISTA)."\n";
if($queryRecords = $mysqli->query($sqlVISTA)) {
  while($noticia = $queryRecords->fetch_assoc()) {
    $noticia["titulo"] = trim($noticia["titulo"]);
    $noticia["seccion"] = $Adatos["seccion"][$noticia["seccion"]];
    $noticia["medio"] = $Adatos["medio"][$noticia["medio"]];
    $noticia["medio_tipo"] = $Adatos["medio_tipo"][$noticia["medio_tipo"]];
    $noticia["estado"] = $Adatos["estado"][$noticia["estado"]];
    if(isset($noticia["cliente"])) {
      $clientes = explode(",",$noticia["cliente"]);
      $noticia["cliente"] = Array();
      foreach($clientes AS $a) {
        if(empty($a)) continue;
        $noticia["cliente"][] = $Adatos["cliente"][$a];
      }
    }
    if(isset($noticia["usuario"]))
      $noticia["usuario"] = $Adatos["usuario"][$noticia["usuario"]];
    // print_r($noticia);
  }
}
//--------- FUNCIONES
function totalBASE($mysqli,$sql) {
  return mysqli_num_rows($mysqli->query($sql));
}
function separarPOR($mysqli,$sql,$Aelementos) {
  global $medio,$seccion,$medio_tipo,$cliente,$usuario;
  $A = Array();
  $A["medio"] = Array();
  $A["seccion"] = Array();
  $A["medio_tipo"] = Array();
  $A["cliente"] = Array();
  $A["medio"]["column"] = "medio";
  $A["medio"]["no"] = "SIN MEDIO";
  $A["seccion"]["column"] = "nombre";
  $A["seccion"]["no"] = "SIN SECCIÓN";
  $A["medio_tipo"]["column"] = "nombre";
  $A["medio_tipo"]["no"] = "SIN TIPO DE MEDIO";

  $A["cliente"]["column"] = "nombre";
  $A["cliente"]["no"] = "SIN CLIENTE";

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
  }
  return $Adatos;
}

//
// $ARR_relevo = Array();
// $ARR_usuario = Array();
//
// $attr = $where_condition = $inner = $group = "";
// $sqlVISTA = "";
// ///////////
// $attr .= "n.id,";
// $attr .= "n.titulo,";
// $attr .= "n.fecha,";
// $attr .= "n.estado,";
// $attr .= "n.id_seccion AS seccion,";
// $attr .= "n.id_medio AS medio,";
// $attr .= "n.id_medio_tipo AS medio_tipo";
// ////////////
// $where_condition .=	"WHERE n.elim = 0 AND n.titulo != '' ";
// /* FILTROS */
// $seccionIN = "";
// if(isset($params["seccionFilter"]) && !empty($params["seccionFilter"])) {
//   $secciones = json_decode($params["seccionFilter"]);
//   $seccionIN = implode($secciones,",");
//
//   $where_condition .= "AND n.id_seccion IN ({$seccionIN}) ";
//   $flag = false;
// }
// if(isset($params["medioTipoFilter"]) && !empty($params["medioTipoFilter"])) {//TIPO DE MEDIO
//   $where_condition .= "AND n.id_medio_tipo = {$params["medioTipoFilter"]} ";
//   $flag = false;
// }
// if(isset($params["minDateFilter"]) && !empty($params["minDateFilter"])) {//FECHA MIN
//   $where_condition .= "AND DATE_FORMAT(n.fecha, '%Y%m%d') >= DATE_FORMAT('{$params["minDateFilter"]}', '%Y%m%d') ";
//   $flag = false;
// }
// if(isset($params["maxDateFilter"]) && !empty($params["maxDateFilter"])) {//FECHA MAX
//   $where_condition .= "AND DATE_FORMAT(n.fecha, '%Y%m%d') <= DATE_FORMAT('{$params["maxDateFilter"]}', '%Y%m%d') ";
//   $flag = false;
// }
// if(isset($params["medioFilter"]) && !empty($params["medioFilter"])) {//MEDIO
//   $where_condition .=	"AND n.id_medio = {$params["medioFilter"]} ";
//   $flag = false;
// }
// if(isset($params["tituloFilter"]) && !empty($params["tituloFilter"])) {//TITULO
//   $where_condition .=	"AND CONCAT(n.titulo,'__',n.cuerpo) LIKE '%{$params["tituloFilter"]}%' ";
//   $flag = false;
// }
// /* / FILTROS */
// /* VISTA */
// if(isset($params["estado"]) && isset($params["moderado"]))//NOTICIAS a RELEVAR
//   $where_condition .= "AND n.estado IN (0,1) AND n.relevado = 0 ";
// else if(isset($params["moderado"]) && !isset($params["estado"])) {//NOTICIAS a PROCESAR
//   $where_condition .= "AND n.estado != 2 AND n.relevado = 1 ";
//   $attr .= ",GROUP_CONCAT(nr.id_cliente) AS cliente";
//   $group .= "n.id";
//   if(isset($params["unidadFilter"]) && !empty($params["unidadFilter"]))
//     $inner .= "INNER JOIN noticiarelevo AS nr ON (nr.elim = 0 AND nr.id_noticia = n.id_noticia AND nr.id_cliente = {$params["unidadFilter"]})";
//   else
//     $inner .= "INNER JOIN noticiarelevo AS nr ON (nr.elim = 0 AND nr.id_noticia = n.id_noticia)";
//
//   foreach ($relevos as $relevo) {
//     if(!array_key_exists($relevo["did_noticia"],$ARR_relevo)) $ARR_relevo[$relevo["did_noticia"]] = Array();
//     $ARR_relevo[$relevo["did_noticia"]][] = $relevo["id_cliente"];
//   }
// } else if(!isset($params["moderado"]) && isset($params["estado"])) {//NOTICIAS PROCESADAS
//   $where_condition .= "AND n.estado = 2 AND n.relevado = 1 ";
//   $attr .= ",GROUP_CONCAT(p.id_cliente) AS cliente";
//   $attr .= ",u.id AS usuario";
//   $group .= "n.id";
//
//   if(isset($params["unidadFilter"]) && !empty($params["unidadFilter"]))
//     $inner = "INNER JOIN proceso AS p ON (p.elim = 0 AND p.id_noticia = n.id_noticia AND p.id_cliente = {$params["unidadFilter"]})";
//   else
//     $inner = "INNER JOIN proceso AS p ON (p.elim = 0 AND p.id_noticia = n.id_noticia)";
//   $inner .= "INNER JOIN usuario AS u ON (u.elim = 0 AND u.id = p.id_usuario) ";
// }
// /* / VISTA */
//
// $sqlVISTA .= "SELECT {$attr} FROM noticia AS n ";
// $sqlVISTA .= "{$inner} {$where_condition} " . (!empty($group) ? "GROUP BY {$group} " : "");
// $total = totalBASE($mysqli,$sqlVISTA);
// echo "{$sqlVISTA}\n";
//
//
// if($flag) {
//   $_SESSION["total"] = totalBASE($mysqli,$sqlVISTA);
//   echo "REGISTROS TOTALES: {$total}\n";
// } else {
//   echo "REGISTROS TOTALES: {$_SESSION["total"]}\n";
//   if($total != $_SESSION["total"])
//     echo "REGISTROS FILTRADOS: {$total}\n";
// }
// $Adatos = separarPOR($mysqli,$sqlVISTA,["medio","medio_tipo","seccion","cliente","usuario"]);
//
// $Adatos["estado"] = Array();
// $Adatos["estado"][] = "SIN PROCESAR";
// $Adatos["estado"][] = "ABIERTO";
// $Adatos["estado"][] = "PROCESADA";
//
// $sqlVISTA .= "ORDER BY n.fecha DESC LIMIT 0,20";
// echo "EN VISTA: " . totalBASE($mysqli,$sqlVISTA)."\n";
// if($queryRecords = $mysqli->query($sqlVISTA)) {
//   while($noticia = $queryRecords->fetch_assoc()) {
//     $noticia["titulo"] = trim($noticia["titulo"]);
//     $noticia["seccion"] = $Adatos["seccion"][$noticia["seccion"]];
//     $noticia["medio"] = $Adatos["medio"][$noticia["medio"]];
//     $noticia["medio_tipo"] = $Adatos["medio_tipo"][$noticia["medio_tipo"]];
//     $noticia["estado"] = $Adatos["estado"][$noticia["estado"]];
//     if(isset($noticia["cliente"])) {
//       $clientes = explode(",",$noticia["cliente"]);
//       $noticia["cliente"] = Array();
//       foreach($clientes AS $a) {
//         if(empty($a)) continue;
//         $noticia["cliente"][] = $Adatos["cliente"][$a];
//       }
//     }
//     if(isset($noticia["usuario"]))
//       $noticia["usuario"] = $Adatos["usuario"][$noticia["usuario"]];
//     print_r($noticia);
//   }
// }
