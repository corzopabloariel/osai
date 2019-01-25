<?php
session_start();
require_once 'config.php';
require_once 'ext/rb.php';
R::setup("mysql:host=".CONFIG_HOST.";dbname=".CONFIG_BD,CONFIG_USER,CONFIG_PASS);
R::ext('xdispense', function( $type ){ return R::getRedBean()->dispense( $type ); });
error_reporting(E_ALL);
ini_set('display_errors', 1);

$ns = R::findAll("noticiascliente");

foreach($ns AS $n) {
  $id_noticia = $n["id_noticia"];
  $id_cliente = $n["id_cliente"];
  $ed = json_decode($n["tema"]);
  foreach($ed AS $k => $v) {
    if($k == "texto") continue;
    echo $id_noticia . "<br/>";

    $id_tema = substr($k,9);
    $valor = 0;
    if(isset($v->valor))
      $valor = $v->valor;

    $i = R::xdispense('noticiastema');
    $i["id_noticia"] = $id_noticia;
    $i["id_cliente"] = $id_cliente;
    $i["id_tema"] = $id_tema;
    $i["valor"] = $valor;

    R::store($i);
  }
}
?>
