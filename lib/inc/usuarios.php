<?php

R::setup("mysql:host=".CONFIG_HOST.";dbname=".CONFIG_BD,CONFIG_USER,CONFIG_PASS);
//R::ext('xdispense', function( $type ){ return R::getRedBean()->dispense( $type ); });

error_reporting(E_ALL);
ini_set('display_errors', 1);
$A_elementos = Array();
$usuarios = R::findAll("usuario","elim = 0");
foreach ($usuarios as $usuario) {
  $A = Array();
  $A["id"] = $usuario["id"];
  $A["user"] = $usuario["user"];
  $A["nivel"] = $usuario["nivel"];
  $A["activo"] = $usuario["activo"];
  $A_elementos[$usuario["id"]] = $A;
}

echo json_encode($A_elementos, JSON_FORCE_OBJECT);
?>
