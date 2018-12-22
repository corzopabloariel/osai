<?php
session_start();
require_once 'config.php';
require_once 'ext/rb.php';

error_reporting(E_ALL);
ini_set('display_errors', 1);

R::setup("mysql:host=".CONFIG_HOST.";dbname=".CONFIG_BD,CONFIG_USER,CONFIG_PASS);

$mysqli = new mysqli(CONFIG_HOST, CONFIG_USER, CONFIG_PASS, CONFIG_BD);
$mysqli->set_charset('utf8');

$params = $_REQUEST;
$columns = $params["columns"];
if(isset($params["order"]))
    $order = $params["order"][0];

$entidad = $params["entidad"];//LA ENTIDAD QUE SE NECESITA
$entidades = json_decode($params["entidades"]);//TODAS LAS ENTIDADES
$especificacion = $params["especificacion"];
$attr = "";
$inner = "";
$sql = "";
$A_entidades = Array();
$A_arrays = Array();
$A_visibles = Array();

foreach($especificacion AS $k => $v) {
    if(!empty($attr)) $attr .= ", ";
    $attr .= "{$k}";
    if(isset($v["FORMATO"]))
        $A_arrays[$k] = $v["FORMATO"];
    if($v["VISIBILIDAD"] == "TP_VISIBLE")
        $A_visibles[] = $k;

    if($v["TIPO"] != "TP_RELACION") {
        continue;
    }
    $entidadAux = $v["RELACION"]["TABLA"];
    $attrAux = $v["RELACION"]["ATTR"];
    $visibleAux = $entidades->$entidadAux->VISIBLE;
    $A_entidades[$k] = Array();
    $A_entidades[$k]["ENTIDAD"] = $entidadAux;
    $A_entidades[$k]["ATRIBUTO"] = $attrAux;
    $A_entidades[$k]["VISIBILIDAD"] = $visibleAux;
}

$sql = "SELECT {$attr} FROM {$entidad}";
$recordsTotal = total($mysqli,"{$sql} WHERE elim = 0");

if(!empty($params["search"]["value"])) {
    $search = "";
    for($i = 0; $i < count($A_visibles); $i++) {
        if(!empty($search)) $search .= " OR ";
        $search .= "{$A_visibles[$i]} LIKE '%{$params["search"]["value"]}%' AND elim = 0";
    }
    $sql .= " WHERE {$search}";
    $recordsFiltered = total($mysqli,$sql);
} else $recordsFiltered = $recordsTotal;

if(isset($order))
    $sql .= " ORDER BY {$columns[$order["column"]]["data"]} {$order["dir"]}";

$sql .= " LIMIT {$params['start']},{$params['length']}";
$data = [];
if($queryRecords = $mysqli->query($sql)) {
    while($tabla = $queryRecords->fetch_assoc()) {
        foreach($A_arrays AS $k => $v) {
            $tabla[$k] = json_decode($tabla[$k]);
        }
        if($entidad == "actor") {
            // $tabla["atributos"] = implode(", ", $tabla["atributos"]);
        }
        foreach($A_entidades AS $k => $v)
            $tabla[$k] = mostrar_1($tabla[$k],$k,$v);
        
        $data[] = $tabla;
    }
}

mysqli_close($mysqli);

$json_data = array(
	"draw"            => intval( $params['draw'] ),
	"recordsTotal"    => intval( $recordsTotal ),//// en Vista
	"recordsFiltered" => intval( $recordsFiltered ),// en Total
	"data"            => $data
);

echo json_encode($json_data);

/**
 * @param $value ARRAY
 */
function mostrar_1($value, $attr, $obj) {
    $return = "";
    if(empty($value)) return "";
    for($j = 0; $j < count($value); $j++) {
        $texto = $obj["VISIBILIDAD"]->TEXTO;
        $aux = R::findOne($obj["ENTIDAD"],"{$obj['ATRIBUTO']} LIKE ? AND elim = ?",[$value[$j],0]);
        for($i = 0; $i < count($obj["VISIBILIDAD"]->ATTR); $i++)
            $texto = str_replace("/{$obj["VISIBILIDAD"]->ATTR[$i]}/",$aux[$obj["VISIBILIDAD"]->ATTR[$i]],$texto);
        $return .= "<p class='m-0'>{$texto}</p>";
    }
    return $return;
}
function total($mysqli,$sql) {
  return mysqli_num_rows($mysqli->query($sql));
}