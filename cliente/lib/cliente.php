<?php
session_start();
// incluyo la configuracion local y redbeans
require_once '../../lib/config.php';
require_once '../../lib/ext/rb.php';

$params = $_POST;
// acciones
if(isset($_POST["tipo"])) $accion = $_POST["tipo"];
//if(isset($_GET["servidor"])) $accion = "servidor";

switch ($params["tipo"]) {
  case 'login'://VERIFICAR que hay una session activa
      echo json_encode($_SESSION, JSON_FORCE_OBJECT);
    break;
}
