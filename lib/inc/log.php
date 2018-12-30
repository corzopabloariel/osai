<?php
R::setup("mysql:host=".CONFIG_HOST.";dbname=".CONFIG_BD,CONFIG_USER,CONFIG_PASS);
R::ext('xdispense', function( $type ){ return R::getRedBean()->dispense( $type ); });

$log = R::dispense('log');
$log["id_usuario"] = $_POST["id_usuario"];
$log["did"] = $_SESSION["user_did"];//nuevo acceso
$log["acceso"] = $_POST["acceso"];
$log["accion"] = $_POST["accion"];
$log["id_tabla"] = $_POST["id_tabla"];
$log["tabla"] = (empty($_POST["tabla"]) ? NULL:$_POST["tabla"]);
$log["baja"] = $_POST["elim"];
R::store($log);
