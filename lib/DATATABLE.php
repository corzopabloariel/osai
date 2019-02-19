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
$recordsFiltered = $recordsTotal = 0;
if(isset($params["order"]))
    $order = $params["order"][0];

    $entidad = $params["entidad"];//LA ENTIDAD QUE SE NECESITA
    $attr = "";
    $inner = "";
    $sql = "";
    $where = "";
    $A_entidades = Array();
    $A_arrays = Array();
    $A_visibles = Array();
    $A_enum = Array();

    if($entidad == "__informes__") {
        $data = [];
    } else if($entidad == "__graficos__") {
        $ARR = [ "og.titulo", "c.nombre", "og.descripcion" ];

        $sql = "SELECT ";
            $sql .= "og.id,";
            $sql .= "og.image AS imagen,";
            $sql .= "CONCAT(og.titulo, ' (', g.name ,')') AS titulo,";
            $sql .= "og.titulo AS tituloSOLO,";
            $sql .= "og.descripcion,";
            $sql .= "og.url,";
            $sql .= "g.id AS idGrafico,";
            $sql .= "og.id_usuario_osai AS idCliente,";
            $sql .= "ou.user AS usuario,";
            $sql .= "c.nombre AS cliente";
        $sql .= " FROM osai_grafico AS og";
            $sql .= " INNER JOIN osai_usuario AS ou ON (og.id_usuario_osai = ou.id AND ou.elim = 0)";
            $sql .= " INNER JOIN grafico AS g ON (og.grafico = g.id AND g.elim = 0)";
            $sql .= " INNER JOIN cliente AS c ON (ou.id_cliente = c.id AND c.elim = 0)";
        $sql .= " WHERE ";
        // print_r($sql);
        if(!empty($params["search"]["value"])) {
            $search = "";
            for($i = 0; $i < count($ARR); $i++) {
                if(!empty($search)) $search .= " OR ";
                $search .= "{$ARR[$i]} LIKE '%{$params["search"]["value"]}%' AND og.elim = 0";
            }
            $sql .= "{$search}";
        } else $sql .= "og.elim = 0";

        $recordsTotal = total($mysqli,"{$sql}");
        $recordsFiltered = $recordsTotal;
        $sql .= " ORDER BY {$ARR[$params['order'][0]['column']]} {$params['order'][0]['dir']}";
        $sql .= " LIMIT {$params['start']},{$params['length']}";
        $data = [];
        if($queryRecords = $mysqli->query($sql)) {
            while($tabla = $queryRecords->fetch_assoc()) {
              $tabla["cliente"] = "<p class='mb-0'>{$tabla["cliente"]}</p><p class='mb-0'>{$tabla["usuario"]}</p>";
                $data[] = $tabla;
            }
        }

    } else {
        $entidades = json_decode($params["entidades"]);//TODAS LAS ENTIDADES
        $especificacion = $params["especificacion"];

        /**
         * CONSIDERACIÓN IMPORTANTE
         * Se puede agregar un atributo en declaration.js - después de creada la tabla; esto sirve para mostrar
         * otros datos. Se usa solo en tipos TP_ENUM, que contienen un ARRAY de opciones posibles
         */
        if($entidad != "cliente") {
            foreach($especificacion AS $k => $v) {
                if(strpos($k, "__") !== false) continue;
                if(!empty($attr)) $attr .= ", ";
                $attr .= "{$k}";
                if(isset($v["FORMATO"]))
                    $A_arrays[$k] = $v["FORMATO"];
                if($v["VISIBILIDAD"] == "TP_VISIBLE")
                    $A_visibles[] = $k;

                if($v["TIPO"] == "TP_ENUM") {
                    if(isset($v["ENUM"]))
                        $A_enum[$k] = $v["ENUM"];
                }

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
            /////
            if($entidad == "usuario") {
                $where .= " AND nivel >= {$_SESSION["user_lvl"]}";
                $where .= " AND id != {$_SESSION["user_id"]}";
            }
            /////

            $recordsTotal = total($mysqli,"{$sql} WHERE elim = 0{$where}");

            if(!empty($params["search"]["value"])) {
                $search = "";
                for($i = 0; $i < count($A_visibles); $i++) {
                    if(!empty($search)) $search .= " OR ";
                    $search .= "{$A_visibles[$i]} LIKE '%{$params["search"]["value"]}%' AND elim = 0{$where}";
                }
                $sql .= " WHERE {$search}";
                $recordsFiltered = total($mysqli,$sql);
            } else {
                $sql .= " WHERE elim = 0{$where}";
                $recordsFiltered = $recordsTotal;
            }
            if(isset($order))
                $sql .= " ORDER BY {$columns[$order["column"]]["data"]} {$order["dir"]}";

            $sql .= " LIMIT {$params['start']},{$params['length']}";
            $data = [];
            if($queryRecords = $mysqli->query($sql)) {
                while($tabla = $queryRecords->fetch_assoc()) {
                    foreach ($A_enum as $k => $v) {
                        $value = $v[$tabla[$k]];
                        $tabla[$k] = "";
                        $tabla["__{$k}__"] = $value;
                    }

                    if(isset($tabla["color"])) {
                        if(!is_null($tabla["color"]))
                            $tabla["color"] = "<span class='d-block w-100' style='background-color:{$tabla["color"]}; height:14px;'></span>";
                    }
                    if(isset($tabla["image"])) {
                        if(!empty($tabla["image"]))
                            $tabla["image"] = '<i class="fas fa-image"></i>';
                    }

                    foreach($A_arrays AS $k => $v) {
                        $tabla[$k] = json_decode($tabla[$k]);
                    }
                    foreach($A_entidades AS $k => $v) {
                        $aux = $tabla[$k];
                        $tabla[$k] = mostrar_1($tabla[$k],$k,$v);
                        // if($entidad == "medio_destaque")
                        //   echo "{$aux} {$tabla[$k]}";
                    }
                    $data[] = $tabla;
                }
            }
        } else {
            $Arr = [];
            $Arr[] = "BLOQUEADO";
            $Arr[] = "ACTIVO";
            $sql = "SELECT ";
            $sql .= "c.id,";
            $sql .= "c.nombre,";
            $sql .= "ou.user,";
            $sql .= "ou.activo";
            $sql .= " FROM cliente AS c ";
                $sql .= "LEFT JOIN osai_usuario AS ou ON ";
                $sql .= "(ou.id_cliente = c.id AND ou.elim = 0 AND ou.activo = 1) ";
            $sql .= "WHERE c.elim = 0 AND c.todos = 0";
            if(isset($order))
                $sql .= " ORDER BY {$columns[$order["column"]]["data"]} {$order["dir"]}";

            $recordsTotal = total($mysqli,"{$sql}");
            $recordsFiltered = $recordsTotal;
            $sql .= " LIMIT {$params['start']},{$params['length']}";

            if($queryRecords = $mysqli->query($sql)) {
                while($cliente = $queryRecords->fetch_assoc()) {
                if(is_null($cliente["activo"])) $cliente["activo"] = "";
                else $cliente["activo"] = $Arr[$cliente["activo"]];

                if(is_null($cliente["user"])) $cliente["user"] = "";
                $data[] = $cliente;
            }
        }
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
    if(is_array($value)) {
      for($j = 0; $j < count($value); $j++) {
          $texto = $obj["VISIBILIDAD"]->TEXTO;
          $aux = R::findOne($obj["ENTIDAD"],"{$obj['ATRIBUTO']} = ? AND elim = ?",[$value[$j],0]);
          for($i = 0; $i < count($obj["VISIBILIDAD"]->ATTR); $i++)
              $texto = str_replace("/{$obj["VISIBILIDAD"]->ATTR[$i]}/",$aux[$obj["VISIBILIDAD"]->ATTR[$i]],$texto);
          $return .= "<p class='m-0'>{$texto}</p>";
      }
    } else {
      $texto = $obj["VISIBILIDAD"]->TEXTO;
      $aux = R::findOne($obj["ENTIDAD"],"{$obj['ATRIBUTO']} = ? AND elim = ?",[$value,0]);
      for($i = 0; $i < count($obj["VISIBILIDAD"]->ATTR); $i++)
          $texto = str_replace("/{$obj["VISIBILIDAD"]->ATTR[$i]}/",$aux[$obj["VISIBILIDAD"]->ATTR[$i]],$texto);
      $return .= "<p class='m-0'>{$texto}</p>";
    }
    return $return;
}
function total($mysqli,$sql) {
  return mysqli_num_rows($mysqli->query($sql));
}