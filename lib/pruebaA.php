<?php
session_start();
require_once 'config.php';
require_once 'ext/rb.php';
R::setup("mysql:host=".CONFIG_HOST.";dbname=".CONFIG_BD,CONFIG_USER,CONFIG_PASS);
R::ext('xdispense', function( $type ){ return R::getRedBean()->dispense( $type ); });
error_reporting(E_ALL);
ini_set('display_errors', 1);
$mysqli = new mysqli(CONFIG_HOST, "root", "contrasela%32", CONFIG_BD);
$query = "SELECT id FROM `noticias` LIMIT 50";
if($queryRecords = $mysqli->query($query)) {
  while($noticia = $queryRecords->fetch_assoc()) {
    echo "{$noticia["id"]}, ";
  }
}
$ns = R::findAll("noticia","LIMIT 50");

print_r($ns);
?>
