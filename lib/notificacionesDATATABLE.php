<?php
session_start();
require_once 'config.php';
require_once 'ext/rb.php';
error_reporting(E_ALL);
ini_set('display_errors', 1);

$mysqli = new mysqli(CONFIG_HOST, CONFIG_USER, CONFIG_PASS, CONFIG_BD);
$mysqli->set_charset('utf8');
R::setup("mysql:host=".CONFIG_HOST.";dbname=".CONFIG_BD,CONFIG_USER,CONFIG_PASS);

$requestData = $_REQUEST;

$params = $columns = $data = array();
$totalRecords = $totalFilter = 0;
$params = $_REQUEST;

$attr = $inner = $where_condition = $sqlTot = $sqlRec = $group = "";

$Aestados = Array();
$Aestados[] = "sin procesar";
$Aestados[] = "abierto";
$Aestados[] = "procesada";

$where_condition .=	" WHERE ";
$where_condition .=	"n.elim = 0 ";

$totalRecords = R::count("notificacion","elim = 0");
$ARR_secciones = R::findAll("seccion","elim = 0");
$ARR_tipo_medio = R::findAll("medio_tipo","elim = 0");
$ARR_noticiaseccion = R::findAll("noticiaseccion");
$ARR_usuarios = R::findAll("usuario","elim = 0");

$attr .= "noticia.id,";
$attr .= "n.id AS notificacion,";
$attr .= "n.autofecha AS fecha,";
$attr .= "n.id_noticia,";
$attr .= "noticia.titulo,";
$attr .= "m.medio,";
$attr .= "GROUP_CONCAT(n.id_usuario) AS usuario,";
$attr .= "m.id_medio_tipo AS medio_tipo,";
$attr .= "GROUP_CONCAT(n.mensaje) AS mensajes,";
$attr .= "n.procesar,";
$attr .= "n.procesado,";
$attr .= "n.eliminado";

$inner .= "INNER JOIN noticia ON (noticia.id_noticia = n.id_noticia AND noticia.elim = 0) ";
$inner .= "INNER JOIN medio AS m ON (m.elim = 0 AND m.id = noticia.id_medio) ";


$sqlVISTA = "SELECT {$attr} FROM notificacion AS n {$inner} {$where_condition} GROUP BY n.id_noticia,n.id_cliente ORDER BY n.id_usuario LIMIT {$params['start']},{$params['length']}";
$records = R::getAll("SELECT n.id,GROUP_CONCAT(n.mensaje) FROM notificacion AS n {$inner} {$where_condition} GROUP BY n.id_noticia,n.id_cliente");
$recordsFiltered = count($records);
$totalRecords = count($records);
$ARR_noticia = R::getAll($sqlVISTA);

foreach ($ARR_noticia as $noticia) {
  // $noticia["fecha_baja"] = $ARR_log[$noticia["id"]]["fecha"];
  $noticia["usuario"] = ($noticia["usuario"] == 0 ? "" : $ARR_usuarios[$noticia["usuario"]]["user"]);
  $noticia["medio_tipo"] = $ARR_tipo_medio[$noticia["medio_tipo"]]["nombre"];
  $estado = "";
  if($noticia["procesar"] == 0 && $noticia["procesado"] == 0 && $noticia["eliminado"] == 0) $estado = "SIN ACCIÓN";
  if($noticia["procesar"] == 0 && $noticia["procesado"] == 0 && $noticia["eliminado"] == 1) $estado = "NOTICIA ELIMINADA";
  if($noticia["procesar"] == 0 && $noticia["procesado"] == 1 && $noticia["eliminado"] == 0) $estado = "NOTICIA PROCESADA";
  if($noticia["procesar"] == 1 && $noticia["procesado"] == 0 && $noticia["eliminado"] == 0) $estado = "NOTICIA A PROCESAR";
  $noticia["estado"] = $estado;
	$data[] = $noticia;
}

$json_data = array(
	"draw"            => intval( $params['draw'] ),
	"recordsTotal"    => intval( $totalRecords ),
	"recordsFiltered" => intval( $recordsFiltered ),
	"data"            => $data
);

echo json_encode($json_data);

?>
