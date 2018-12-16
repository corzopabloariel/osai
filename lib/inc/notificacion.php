<?php

R::setup("mysql:host=".CONFIG_HOST.";dbname=".CONFIG_BD,CONFIG_USER,CONFIG_PASS);
R::ext('xdispense', function( $type ){ return R::getRedBean()->dispense( $type ); });

$n = R::findOne("notificacion","id = ?",[$_POST["id"]]);
$n["id_usuario"] = $_POST["id_usuario"];
$n["fecha_lectura"] = date("Y-m-d H:i:s");
$n["leido"] = "1";
$n["aviso"] = "1";

R::store($n);
