<?php
session_start();
session_write_close();

header("Content-Type: text/event-stream");
header("Cache-Control: no-cache");
header("Access-Control-Allow-Origin: *");

require_once '../../lib/config.php';
require_once '../../lib/ext/rb.php';

R::setup("mysql:host=".CONFIG_HOST.";dbname=".CONFIG_BD,CONFIG_USER,CONFIG_PASS);
R::ext('xdispense', function( $type ){ return R::getRedBean()->dispense( $type ); });
//
$mysqli = new mysqli(CONFIG_HOST, CONFIG_USER, CONFIG_PASS, CONFIG_BD);
$mysqli->set_charset('utf8');
//
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

while(1) {
    $sql = "SELECT * FROM osai_notificacion WHERE estado = 1 AND elim = 0";
    $resultado = $mysqli->query($sql);
    while($row = $resultado->fetch_assoc()) {
        $msj = "";
        if($row["nivel"] == 0) $msj = "Noticia procesada de OSAI";
        if($row["nivel"] == 1) $msj = "Noticia - <strong style='color:#ffc107;'>ALERTA BAJA</strong>";
        if($row["nivel"] == 2) $msj = "Noticia - <strong style='color:#ff8000;'>ALERTA MEDIA</strong>";
        if($row["nivel"] == 3) $msj = "Noticia - <strong style='color:#dc3545;'>ALERTA ALTA</strong>";
        $data = Array();
        $data["mensaje"] = $msj;
        $data["nivel"] = $row["nivel"];
        $data["mensajeBD"] = $row["mensaje"];

        sendMsg($row["id"],json_encode($data),"notificacion");
        $notificacion = R::findOne("osai_notificacion","id = ? AND elim = ?",[$row["id"],0]);
        $notificacion["estado"] = 2;
        R::store($notificacion);
    }
}