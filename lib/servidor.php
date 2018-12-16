<?php
session_start();
session_write_close();

header("Content-Type: text/event-stream");
header("Cache-Control: no-cache");
header("Access-Control-Allow-Origin: *");

require_once 'config.php';
require_once 'ext/rb.php';

R::setup("mysql:host=".CONFIG_HOST.";dbname=".CONFIG_BD,CONFIG_USER,CONFIG_PASS);
R::ext('xdispense', function( $type ){ return R::getRedBean()->dispense( $type ); });
//
$mysqli = new mysqli(CONFIG_HOST, CONFIG_USER, CONFIG_PASS, CONFIG_BD);
$mysqli->set_charset('utf8');
error_reporting(E_ALL);
ini_set('display_errors', 1);

function sendMsg($id,$json,$event) {
  echo "id: {$id}" . PHP_EOL;
  echo "data: {$json}" . PHP_EOL;
  echo "event: {$event}" . PHP_EOL;
  echo PHP_EOL;
  ob_flush();
  flush();
}
/**
 * Función que verifica si un STRING contiene ciertas palabras contenidas en un ARRAY
 * @param $needle STRING: variable donde se va a buscar
 * @param $haystack ARRAY: Array de string
 * @return booleano
 */
function Array_find($needle, Array $haystack) {
    foreach ($haystack as $value) {
      if (preg_match("/\b{$value}\b/i", $needle))
        return $value;
    }
    return false;
}

while (1) {
  ////
  $query = "SELECT * FROM noticias WHERE nueva = 1 AND titulo != '' AND elim = 0";
  $resultado = $mysqli->query($query);
  while($row = $resultado->fetch_assoc()) {
    //ALARMAS
    $query_ALARMA = "SELECT a.id,a.id_cliente,a.nombre,c.nombre AS nombre_cliente,a.atributos,a.atributos_negativos FROM alarma AS a INNER JOIN cliente AS c ON (a.id_cliente = c.id AND c.elim = 0) WHERE a.estado = 1 AND a.elim = 0 AND a.id_cliente != 0";
    $resultado_ALARMA = $mysqli->query($query_ALARMA);
    $A_in = Array();
    while($row_ALARMA = $resultado_ALARMA->fetch_assoc()) {
      if(array_key_exists($A_in,$row["id"])) {
        if(in_array($row_ALARMA["id_cliente"],$A_in[$row["id"]])) continue;
      }
      $txt = "{$row["titulo"]} {$row["cuerpo"]}";
      if (strpos($txt, '\u') !== false) {
        $txt = str_replace('\u','u',$txt);
        $txt = preg_replace('/u([\da-fA-F]{4})/', '&#x\1;', $txt);
      }
      $search = Array_find($txt,Array($row_ALARMA["nombre_cliente"]));//SE BUSCA NOMBRE EN
      $nombre = strtoupper($row_ALARMA["nombre_cliente"]);
      //Si se ingresa una notificación, el nivel es 2 - usuarios osai
      if($search != false) {
        $aux = R::findOne("notificacion","id_noticia = ? AND id_cliente = ? AND mensaje LIKE ?",[$row["id"],$row_ALARMA["id_cliente"],"Cliente {$nombre} nombrado"]);
        if($aux) continue;
        $notificacion = R::xdispense('notificacion');
        $notificacion["id_noticia"] = $row["id"];
        $notificacion["mensaje"] = "Cliente {$nombre} nombrado";
        $notificacion["id_cliente"] = $row_ALARMA["id_cliente"];
        $notificacion["aviso"] = 1;
        $notificacion["nivel"] = 3;
        $id_notificacion = R::store($notificacion);
        if(!array_key_exists($A_in,$row["id"])) $A_in[$row["id"]] = [];
        $A_in[$row["id"]][] = $row_ALARMA["id_cliente"];
        sendMsg($row["id"],$id_notificacion,"alarmaCliente");
      } else {
        $Adata = json_decode($row_ALARMA["atributos"]);//ATTR a buscar en la noticia
        $Aaux = [];
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

        for($i = 0; $i < count($Adata); $i++) {
          $searchNEG = Array_find($row["data"],$Aaux[$Adata[$i]]);
          if(!$searchNEG) {//ARRAY combinaciones posibles con ATRIBUTOS NEGATIVOS
            $search = Array_find($row["data"],[$Adata[$i]]);
            if($search) {
              $aux = R::findOne("notificacion","id_noticia = ? AND id_cliente = ? AND mensaje LIKE ?",[$row["id"],$row_ALARMA["id_cliente"],"Se detectó un atributo de la UNIDAD DE ANÁLISIS {$nombre}"]);
              if($aux) {
                break;
              }
              $notificacion = R::xdispense('notificacion');
              $notificacion["id_noticia"] = $row["id"];
              $notificacion["mensaje"] = "Se detectó un atributo de la UNIDAD DE ANÁLISIS {$nombre}";
              $notificacion["id_cliente"] = $row_ALARMA["id_cliente"];
              $notificacion["aviso"] = 1;
              $notificacion["nivel"] = 3;
              $id_notificacion = R::store($notificacion);

              if(!array_key_exists($A_in,$row["id"])) $A_in[$row["id"]] = [];
              $A_in[$row["id"]][] = $row_ALARMA["id_cliente"];

              sendMsg($row["id"],$id_notificacion,"alarmaCliente");
            }
          }
        }
      }
    }
    //
    $query_ALARMA = "SELECT a.id,a.nombre,a.atributos,a.atributos_negativos FROM alarma AS a WHERE a.estado = 1 AND a.elim = 0 AND a.id_cliente = 0";
    $resultado_ALARMA = $mysqli->query($query_ALARMA);
    $A_ina = Array();
    while($row_ALARMA = $resultado_ALARMA->fetch_assoc()) {
      if(array_key_exists($A_ina,$row["id"])) {
        if(in_array($row_ALARMA["id"],$A_ina[$row["id"]])) continue;
      }
      $Adata = json_decode($row_ALARMA["atributos"]);//ATTR a buscar en la noticia

      $Aaux = [];
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
      $nombre = strtoupper($row_ALARMA["nombre"]);
      for($i = 0; $i < count($Adata); $i++) {
        $searchNEG = Array_find($row["data"],$Aaux[$Adata[$i]]);
        if(!$searchNEG) {//ARRAY combinaciones posibles con ATRIBUTOS NEGATIVOS
          $search = Array_find($row["data"],[$Adata[$i]]);
          if($search) {
            $aux = R::findOne("notificacion","id_noticia = ? AND mensaje LIKE ?",[$row["id"],"Se detectó un atributo de la alarma {$nombre}"]);
            if($aux) break;
            $notificacion = R::xdispense('notificacion');
            $notificacion["id_noticia"] = $row["id"];
            $notificacion["mensaje"] = "Se detectó el atributo '{$Adata[$i]}' de la alarma {$nombre}";
            $notificacion["aviso"] = 1;
            $notificacion["nivel"] = 3;
            $id_notificacion = R::store($notificacion);

            if(!array_key_exists($A_in,$row["id"])) $A_in[$row["id"]] = [];
            $A_in[$row["id"]][] = $row_ALARMA["id"];

            sendMsg($row["id"],$id_notificacion,"alarmaCliente");
          }
        }
      }
    }
  }
  //CAMBIO FLAG DE NOTICIAS
  $query = "UPDATE noticias SET nueva = 2 WHERE nueva = 1 AND titulo != '' AND elim = 0";
  $mysqli->query($query);
  //NOTICIA RELEVADAS
  $query = "SELECT * FROM noticia WHERE nueva = 1 AND relevado = 1 AND titulo != '' AND elim = 0";
  $resultado_NOTICIA = $mysqli->query($query);
  while($row_NOTICIA = $resultado_NOTICIA->fetch_assoc()) {
    sendMsg($row_NOTICIA["id"],"{titulo: '{$row_NOTICIA["titulo"]}'}","noticiaRELEVADA");
  }
  //CAMBIO FLAG DE NOTIFICACIONES NUEVAS
  /**
   * Es importante, porque cambia los primeros 5 registros
   */
  // $notificaciones = R::findAll("notificacion","aviso = ?",[1]);
  // foreach($notificaciones AS $n) {
  //   $n["aviso"] = 0;
  //   R::store($n);
  // }
  sleep(2);
}

// $A_noticias = [];
// $A_notificaciones = [];
// $str = "";
// while (1) {
//   $noticias = R::findAll("noticias","nueva = 1 AND elim = 0");//NOTICIAS recien ingresadas
//   if($noticias) {//HAY alarmas activas
//     $clientes = R::getAll("SELECT c.id,c.nombre,a.atributos FROM `alarma` a INNER JOIN cliente c ON (a.id_cliente = c.id AND c.elim = 0) WHERE a.estado = 1 AND a.elim = 0");
//     if($clientes) {
//     	foreach($noticias as $noticia) {
//         if($noticia["titulo"] == "") continue;
//         if(!in_array($noticia["id"],$A_noticias)) {
//           $STR_noticias = "";
//           $ids = "";
//           $A_noticias[] = $noticia["id"];//AGREGO noticia
//           /**
//            * Si se vuelve a recargar y aun no se lee la noticia/notificacion
//            */
//           $aux = R::findOne("notificacion","id_noticia = ? AND leido = ?",[$noticia["id"],0]);
//           if(!$aux) {
//             $A_noticia = json_decode($noticia["data"]);//Parseo noticia
//             foreach ($clientes as $cliente) {
//               $STR_noticias = "";
//               $Adata = json_decode($cliente["atributos"]);//ATTR a buscar en la noticia
//               $Anombre = explode(" ",$cliente["nombre"]);
//               $flag = false;
//               $titulo = $noticia["titulo"];
//               // Por nombre completo
//               if (strpos($noticia["data"], $cliente["nombre"]) !== false ||
//                     strpos($noticia["data"], json_encode($cliente["nombre"])) !== false) {
//                 $flag = true;
//                 $STR_noticias = "Se nombró a <strong>{$cliente["nombre"]}</strong> en <i>{$titulo}</i>";
//               }
//               if(!$flag) {
//                 for($i = 0; $i < count($Adata); $i++) {
//                   if (strpos($noticia["data"], $Adata[$i]) !== false ||
//                       strpos($noticia["data"], json_encode($Adata[$i])) !== false) {
//                     $flag = true;
//                     if($STR_noticias != "") $STR_noticias .= " / ";
//                     $STR_noticias .= $Adata[$i];
//                   }
//                 }
//                 if($flag) $STR_noticias = "Atributo relacionado a <strong>{$cliente["nombre"]}</strong> ({$STR_noticias}) en <i>{$titulo}</i>";
//               }
//
//               if($flag) {
//                 $notificacion = R::dispense('notificacion');
//                 $notificacion["leido"] = "0";//
//                 $notificacion["id_cliente"] = $cliente["id"];//
//                 $notificacion["id_noticia"] = $noticia["id"];//
//                 $notificacion["mensaje"] = $STR_noticias;
//                 R::store($notificacion);
//               }
//             }
//           }
//           // CAMBIO flag de nuevo
//           $noticia["nueva"] = 0;
//           // R::store($noticia);
//         }
//     	}
//   }
//
//   $notificacion = R::findOne("notificacion","leido = 1 AND aviso = 1 AND elim = 0");//Notificación recien leida
//   $STR_notificacion = "";
//   if($notificacion) {
//     $STR_notificacion = "";
//     if(!in_array($notificacion["id"],$A_notificaciones)) {
//       $A_notificaciones[] = $notificacion["id"];
//       $notificacion["aviso"] = "2";
//       //$notificacion["leido"] = "2";
//       R::store($notificacion);
//       $count = R::count("notificacion","leido = 0 AND elim = 0");
//
//       $STR_notificacion = "notificacion_{$notificacion["id"]}-{$count}\n\n";
//     }
//   }
//
//   if($STR_notificacion != "") $str .= $STR_notificacion;
//
//   if($str != "") echo "data: {$str}\n\n";
//   ob_flush();
//   flush();
//   sleep(2);
// }

?>
