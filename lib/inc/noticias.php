<?php
//header("Content-Type: text/event-stream\n\n");

R::setup("mysql:host=".CONFIG_HOST.";dbname=".CONFIG_BD,CONFIG_USER,CONFIG_PASS);
//R::ext('xdispense', function( $type ){ return R::getRedBean()->dispense( $type ); });

error_reporting(E_ALL);
ini_set('display_errors', 1);

//$post = file_get_contents("php://input");
//$request = json_decode($post);
//estado :: estado de la noticia
//monitor:: si esta relevado

$A_elementos = Array();
$A_elementos["noticias"] = Array();
$offset = $_POST["paginado"] * 500;
$monitor = $_POST["monitor"];
if($monitor) {
  if($_POST["estado"] == 0) {
    $A_elementos["total"] = R::count("noticias","titulo != '' AND elim = 0 AND estado != 2 AND moderado = {$monitor}");
    $arr = R::findAll("noticias","titulo != '' AND elim = 0 AND estado != 2 AND moderado = {$monitor}");
  } else {
    if($_POST["nivel"] <= 3) {
      $A_elementos["total"] = R::count("noticias","titulo != '' AND elim = 0 AND estado = 2");
      $arr = R::findAll("noticias","titulo != '' AND elim = 0 AND estado = 2");
    } else {
      $A_elementos["total"] = R::count("noticias","titulo != '' AND elim = 0 AND estado = 2");
      $arr = R::getAll("SELECT n.* FROM `noticias` AS n INNER JOIN `noticiasproceso` AS np ON (np.id_noticia = n.id AND np.id_usuario = {$_POST["id_usuario"]})");
    }
  }
} else {
  $medio = $_POST["medio"];
  $instancias = R::findAll("instancias","elim = 0 AND medio = ?",[$medio]);
  $STR_inst = "";
  foreach($instancias AS $ins) {
    if($STR_inst != "") $STR_inst .= ",";
    $STR_inst .= $ins["id"];
  }
  $A_elementos["total"] = R::count("noticias","titulo != '' AND elim = 0");
  //$arr = R::findAll("noticias","titulo != '' AND elim = 0 ORDER BY id DESC LIMIT {$offset},500");
  $arr = R::getAll("SELECT * FROM noticias WHERE titulo != '' AND elim = 0 AND id_instancia IN ({$STR_inst})");
}
/*else {

}*/

foreach ($arr as $key => $value) {
  $A = Array();
  $A["id"] = $value["id"];
  $A["id_unico"] = $value["id_unico"];
  $A["id_instancia"] = $value["id_instancia"];
  $A["id_medio"] = $value["id_medio"];
  $A["identificador"] = $value["identificador"];
  $A["cliente"] = $value["cliente"];//Pre carga de datos - Unidad de Análisis
  $A["url"] = $value["url"];
  $A["titulo"] = $value["titulo"];
  $A["fecha"] = $value["fecha"];
  $A["estado"] = $value["estado"];
  $A["moderado"] = $value["moderado"];
  $A["data"] = $value["data"];
  $A_elementos["noticias"][$value["id"]] = $A;
}

echo json_encode($A_elementos, JSON_FORCE_OBJECT);
?>
