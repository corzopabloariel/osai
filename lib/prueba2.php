<?php
require_once 'config.php';
require_once 'ext/rb.php';
R::setup("mysql:host=".CONFIG_HOST.";dbname=".CONFIG_BD,CONFIG_USER,CONFIG_PASS);
R::ext('xdispense', function( $type ){ return R::getRedBean()->dispense( $type ); });
error_reporting(E_ALL);
ini_set('display_errors', 1);

if(!isset($_GET['id_mensaje']))
	exit();
else
  $id = $_GET['id_mensaje'];
$_echo = "NO";

$t = R::findOne('mensajes','id = ?',[$id]);
if($t) {
  $t["status"] = 3;
  $_echo = R::store($t);
}
echo $_echo;
