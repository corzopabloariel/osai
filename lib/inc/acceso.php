<?php
R::setup("mysql:host=".CONFIG_HOST.";dbname=".CONFIG_BD,CONFIG_USER,CONFIG_PASS);
R::ext('xdispense', function( $type ){ return R::getRedBean()->dispense( $type ); });

$id = $post["id"];
$log = R::findOne("log","id_usuario = ? AND acceso = ? AND accion LIKE '%Acceso%' ORDER BY `id` DESC",[$id,1]);
$did = $log["did"] + 1;
$_SESSION['user_last'] = $log["autofecha"];
$_SESSION['user_did'] = $did;