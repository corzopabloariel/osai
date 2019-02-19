<?php
session_start();
require_once 'config.php';
require_once 'ext/rb.php';
R::setup("mysql:host=".CONFIG_HOST.";dbname=".CONFIG_BD,CONFIG_USER,CONFIG_PASS);
R::ext('xdispense', function( $type ){ return R::getRedBean()->dispense( $type ); });
error_reporting(E_ALL);
ini_set('display_errors', 1);

$ns = R::findAll("noticiascliente","WHERE id > 108");

foreach($ns AS $n) {
  $idNoticia = $n["id_noticia"];
  $idCliente = $n["id_cliente"];
  if(is_null($n["valoracion"])) continue;

  $valoracion = json_decode($n["valoracion"]);
  $valor = "";
  /*if(isset($valoracion->frm_1)) {
    if(!empty($valoracion->frm_1)) {
      $valor = R::findOne('calificacion','id = ?',[1])["valor"];
      if($valoracion->frm_1 == 2) $valor = 0;
      if($valoracion->frm_1 == 3) $valor *= -1;
      $x = R::dispense('noticiasvaloracion');
      $x["id_noticia"] = $idNoticia;
      $x["id_calificacion"] = 1;
      $x["id_cliente"] = $idCliente;
      $x["valor"] = $valor;
      R::store($x);
    }
  }
  if(isset($valoracion->frm_2) && !empty($valoracion->frm_2)) {
    if(!empty($valoracion->frm_2)) {
      $valor = R::findOne('calificacion','id = ?',[2])["valor"];
      if($valoracion->frm_2 == 2) $valor = 0;
      if($valoracion->frm_2 == 3) $valor *= -1;
      $x = R::dispense('noticiasvaloracion');
      $x["id_noticia"] = $idNoticia;
      $x["id_calificacion"] = 2;
      $x["id_cliente"] = $idCliente;
      $x["valor"] = $valor;
      R::store($x);
    }
  }
  if(isset($valoracion->frm_3) && !empty($valoracion->frm_3)) {
    if(!empty($valoracion->frm_3)) {
      $valor = R::findOne('calificacion','id = ?',[3])["valor"];
      if($valoracion->frm_3 == 2) $valor = 0;
      if($valoracion->frm_3 == 3) $valor *= -1;
      $x = R::dispense('noticiasvaloracion');
      $x["id_noticia"] = $idNoticia;
      $x["id_calificacion"] = 3;
      $x["id_cliente"] = $idCliente;
      $x["valor"] = $valor;
      R::store($x);
    }
  }
  if(isset($valoracion->frm_4) && !empty($valoracion->frm_4)) {
    if(!empty($valoracion->frm_4)) {
      $valor = R::findOne('calificacion','id = ?',[4])["valor"];
      if($valoracion->frm_4 == 2) $valor = 0;
      if($valoracion->frm_4 == 3) $valor *= -1;
      $x = R::dispense('noticiasvaloracion');
      $x["id_noticia"] = $idNoticia;
      $x["id_calificacion"] = 4;
      $x["id_cliente"] = $idCliente;
      $x["valor"] = $valor;
      R::store($x);
    }
  }
  if(isset($valoracion->frm_5) && !empty($valoracion->frm_5)) {
    if(!empty($valoracion->frm_5)) {
      $valor = R::findOne('calificacion','id = ?',[5])["valor"];
      if($valoracion->frm_5 == 2) $valor = 0;
      if($valoracion->frm_5 == 3) $valor *= -1;
      $x = R::dispense('noticiasvaloracion');
      $x["id_noticia"] = $idNoticia;
      $x["id_calificacion"] = 5;
      $x["id_cliente"] = $idCliente;
      $x["valor"] = $valor;
      R::store($x);
    }
  }
  if(isset($valoracion->frm_6) && !empty($valoracion->frm_6)) {
    if(!empty($valoracion->frm_6)) {
      $valor = R::findOne('calificacion','id = ?',[6])["valor"];
      if($valoracion->frm_6 == 2) $valor = 0;
      if($valoracion->frm_6 == 3) $valor *= -1;
      $x = R::dispense('noticiasvaloracion');
      $x["id_noticia"] = $idNoticia;
      $x["id_calificacion"] = 6;
      $x["id_cliente"] = $idCliente;
      $x["valor"] = $valor;
      R::store($x);
    }
  }*/

  
  if(isset($valoracion->frm_1)) {
    if(!empty($valoracion->frm_1)) {
      $valor = $valoracion->frm_1;
      $x = R::dispense('noticiasvaloracion');
      $x["id_noticia"] = $idNoticia;
      $x["id_calificacion"] = 1;
      $x["id_cliente"] = $idCliente;
      $x["valor"] = $valor;
      R::store($x);
    }
  }
  if(isset($valoracion->frm_2) && !empty($valoracion->frm_2)) {
    if(!empty($valoracion->frm_2)) {
      $valor = $valoracion->frm_2;
      $x = R::dispense('noticiasvaloracion');
      $x["id_noticia"] = $idNoticia;
      $x["id_calificacion"] = 2;
      $x["id_cliente"] = $idCliente;
      $x["valor"] = $valor;
      R::store($x);
    }
  }
  if(isset($valoracion->frm_3) && !empty($valoracion->frm_3)) {
    if(!empty($valoracion->frm_3)) {
      $valor = $valoracion->frm_3;
      $x = R::dispense('noticiasvaloracion');
      $x["id_noticia"] = $idNoticia;
      $x["id_calificacion"] = 3;
      $x["id_cliente"] = $idCliente;
      $x["valor"] = $valor;
      R::store($x);
    }
  }
  if(isset($valoracion->frm_4) && !empty($valoracion->frm_4)) {
    if(!empty($valoracion->frm_4)) {
      $valor = $valoracion->frm_4;
      $x = R::dispense('noticiasvaloracion');
      $x["id_noticia"] = $idNoticia;
      $x["id_calificacion"] = 4;
      $x["id_cliente"] = $idCliente;
      $x["valor"] = $valor;
      R::store($x);
    }
  }
  if(isset($valoracion->frm_5) && !empty($valoracion->frm_5)) {
    if(!empty($valoracion->frm_5)) {
      $valor = $valoracion->frm_5;
      $x = R::dispense('noticiasvaloracion');
      $x["id_noticia"] = $idNoticia;
      $x["id_calificacion"] = 5;
      $x["id_cliente"] = $idCliente;
      $x["valor"] = $valor;
      R::store($x);
    }
  }
  if(isset($valoracion->frm_6) && !empty($valoracion->frm_6)) {
    if(!empty($valoracion->frm_6)) {
      $valor = $valoracion->frm_6;
      $x = R::dispense('noticiasvaloracion');
      $x["id_noticia"] = $idNoticia;
      $x["id_calificacion"] = 6;
      $x["id_cliente"] = $idCliente;
      $x["valor"] = $valor;
      R::store($x);
    }
  }
}
?>
