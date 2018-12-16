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

$recordsTotal = 0;
$recordsFiltered = 0;

$where_condition .=	" WHERE ";
$where_condition .=	"n.elim = 1 ";

$ARR_secciones = R::findAll("seccion","elim = 0");
$ARR_medio = R::findAll("medio","elim = 0");
$ARR_tipo_medio = R::findAll("medio_tipo","elim = 0");
$ARR_usuarios = R::findAll("usuario","elim = 0");

$attr .= "n.id,";
$attr .= "l.autofecha AS fecha_baja,";
$attr .= "l.id_usuario AS usuario,";
$attr .= "n.titulo,";
$attr .= "n.fecha,";
$attr .= "n.estado,";
$attr .= "n.estado AS estado_num,";
$attr .= "n.id_seccion AS seccion,";
$attr .= "n.id_medio AS medio,";
$attr .= "n.id_medio_tipo AS medio_tipo";

$inner .= "INNER JOIN log AS l ON (l.id_tabla = n.id AND l.tabla = 'noticia' AND l.baja = 1) ";

$sqlVISTA = "SELECT {$attr} FROM noticia AS n {$inner} {$where_condition} ";

$totalRecords = $recordsFiltered = total($mysqli,$sqlVISTA);
$sqlVISTA .= "ORDER BY l.autofecha DESC LIMIT {$params['start']},{$params['length']}";

if($queryRecords = $mysqli->query($sqlVISTA)) {
  while($noticia = $queryRecords->fetch_assoc()) {
    $noticia["estado"] = $Aestados[$noticia["estado"]];
    if(isset($ARR_medio[$noticia["medio"]])) $noticia["medio"] = $ARR_medio[$noticia["medio"]]["medio"];
    // $noticia["fecha_baja"] = $ARR_log[$noticia["id"]]["fecha"];
    $noticia["usuario"] = $ARR_usuarios[$noticia["usuario"]]["user"];
    $noticia["medio_tipo"] = $ARR_tipo_medio[$noticia["medio_tipo"]]["nombre"];
    if(isset($ARR_secciones[$noticia["seccion"]]))
      $noticia["seccion"] = $ARR_secciones[$noticia["seccion"]]["nombre"];
    else $noticia["seccion"] = "SIN SECCIÓN";
  	$data[] = $noticia;
  }
}

$json_data = array(
	"draw"            => intval( $params['draw'] ),
	"recordsTotal"    => intval( $totalRecords ),
	"recordsFiltered" => intval( $recordsFiltered ),
	"data"            => $data
);

echo json_encode($json_data);


function total($mysqli,$sql) {
  return mysqli_num_rows($mysqli->query($sql));
}
?>
