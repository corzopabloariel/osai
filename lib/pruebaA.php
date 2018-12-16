<?php
session_start();
require_once 'config.php';
require_once 'ext/rb.php';
R::setup("mysql:host=".CONFIG_HOST.";dbname=".CONFIG_BD,CONFIG_USER,CONFIG_PASS);
R::ext('xdispense', function( $type ){ return R::getRedBean()->dispense( $type ); });
error_reporting(E_ALL);
ini_set('display_errors', 1);
$mysqli = new mysqli(CONFIG_HOST, CONFIG_USER, CONFIG_PASS, CONFIG_BD);
// $query = "SELECT id FROM `noticias` where moderado = 1";
// if($queryRecords = $mysqli->query($query)) {
//   while($noticia = $queryRecords->fetch_assoc()) {
//     echo "{$noticia["id"]}, ";
//   }
// }
// $n = R::getAll("SELECT n.id,n.id_noticia FROM `noticia` AS n left join noticiaseccion AS ns ON (n.id_noticia = ns.id_noticia) where ns.id is null");
// foreach ($n as $noticias) {
//   $noticia = R::findOne("noticiaseccion","id_noticia = ?",[$noticias["id_noticia"]]);
//
//   if(!$noticia) {
//     $ns = R::xdispense("noticiaseccion");
//     $ns["id_seccion"] = 0;
//     $ns["id_noticia"] = $noticias["id_noticia"];
//
//     R::store($ns);
//   }
// }
// $jsondata = Array();
// $jsondata["D"] = 2;
// echo json_encode($jsondata, JSON_FORCE_OBJECT);
// $Aelementos = Array();
// $Aelementos["secciones"] = Array();
// $Aelementos["medio_tipo"] = Array();
// $Aelementos["medio"] = Array();
//
// $ARR_medios = R::findAll("medio","elim = 0");
// $ARR_mediotipos = R::findAll("medio_tipo","elim = 0");
// $ARR_secciones = R::findAll("seccion","elim = 0");
//
// $inner = $where = $attr = "";
// $attr .= "GROUP_CONCAT(n.id_medio) AS medios";
// $attr .= ",GROUP_CONCAT(m.id_medio_tipo) AS mediotipos";
// $attr .= ",ns.id_seccion AS seccion";
// $where .= "ns.elim = 0";
// $where_condition .= "AND n.estado IN (0,1) AND n.relevado = 0 ";
// $where_condition .= "AND n.estado != 2 AND n.relevado = 1 ";
// $where_condition .= "AND n.estado = 2 AND n.relevado = 1 ";
// $vista = "AND n.relevado = 0 AND n.estado != 2";
// $inner .= "INNER JOIN noticia AS n ON (n.id_noticia = ns.id_noticia AND n.elim = 0 {$vista}) ";
// $inner .= "INNER JOIN medio AS m ON (m.id = n.id_medio AND m.id_medio_tipo = 2) ";
// $inner .= "INNER JOIN seccion AS s ON (s.id = ns.id_seccion) ";
//
// $ARR_noticiaseccion = R::getAll("SELECT {$attr} FROM noticiaseccion AS ns {$inner} WHERE {$where} GROUP BY ns.id_seccion");
//
// $Arr = Array();
// foreach($ARR_noticiaseccion AS $seccion) {
//   $ARR_aux = explode(",",$seccion["mediotipos"]);
//   $ARR_m = array_unique($ARR_aux);
//   foreach ($ARR_m as $m) {
//     if($m != "") {
//       if(!array_key_exists($m,$Aelementos["medio_tipo"]))
//         $Aelementos["medio_tipo"][$m] = $ARR_mediotipos[$m]["nombre"];
//     }
//   }
//
//   if(!array_key_exists($seccion["seccion"],$Aelementos["secciones"]))
//     $Aelementos["secciones"][$seccion["seccion"]] = trim($ARR_secciones[$seccion["seccion"]]["nombre"]);
//   $ARR_aux = explode(",",$seccion["medios"]);
//   $ARR_m = array_unique($ARR_aux);
//   foreach($ARR_m AS $m) {
//     if($m != "") {
//       if(!array_key_exists($m,$Aelementos["medio"]))
//         $Aelementos["medio"][$m] = "{$ARR_medios[$m]["medio"]} - {$ARR_medios[$m]["id_medio_tipo"]}";
//     }
//   }
// }
// asort($Aelementos["medio"]);
// asort($Aelementos["medio_tipo"]);
// asort($Aelementos["secciones"]);
// print_r($Aelementos);
$a = R::findAll("alarma");
$Aaux = [];
foreach($a AS $row_ALARMA) {
  // echo $x["atributos_negativos"];
  if(is_null($row_ALARMA["atributos"])) continue;
  if(is_null($row_ALARMA["atributos_negativos"])) continue;
  $Adata = json_decode($row_ALARMA["atributos"]);//ATTR a buscar en la noticia
  $AatributosNegativos = json_decode($row_ALARMA["atributos_negativos"]);
  for($i = 0; $i < count($Adata); $i++) {
    $Aaux[$Adata[$i]] = [];
    $AatributosNegativos->$Adata[$i] = str_replace("'",'"',$AatributosNegativos->$Adata[$i]);
    $AatributosNegativos->$Adata[$i] = json_decode($AatributosNegativos->$Adata[$i]);
    foreach($AatributosNegativos->$Adata[$i] AS $j) {
      $Aaux[$Adata[$i]][] = "{$Adata[$i]} {$j}";
      $Aaux[$Adata[$i]][] = "{$j} {$Adata[$i]}";
    }
  }

  // for($i = 0; $i < count($Adata); $i++) {
  //   print_r($Aaux[$Adata[$i]]);
  // }
}
print_r($Aaux);
?>
