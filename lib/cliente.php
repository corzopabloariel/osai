<?php
session_start();
// incluyo la configuracion local y redbeans
require_once 'config.php';
require_once 'ext/rb.php';

$post = $_POST;
$accion = "";
// acciones
if(isset($post["tipo"])) $accion = $post["tipo"];
//if(isset($_GET["servidor"])) $accion = "servidor";

switch ($accion) {
  case 'login'://VERIFICAR que hay una session activa
      echo json_encode($_SESSION, JSON_FORCE_OBJECT);
    break;
  case 'log':
    include_once("inc/log.php");
    break;
  case 'query':// Traer datos de las distintas entidades
    if(!isset($_SESSION["user_id"])) {
      if($post["accion"] != "usuario" && $post["column"] != "user") {
        echo json_encode(["aviso" => "///IMPORTANTE/// -> No puede acceder a esta información sin estar logueado.\nIngrese con su usuario y contraseña"], JSON_FORCE_OBJECT);
        die();
      }
    }
    include_once("inc/query.php");
    break;
  case 'delete':// Borra un registro
    include_once("inc/delete.php");
    break;
  case 'noticias':// Encargado de traer noticias con ciertos parámetros
    include_once("inc/noticias.php");
    break;
  case 'usuarios':// Encargado de traer usuarios con ciertos parámetros
    include_once("inc/usuarios.php");
    break;
  case 'noticiasINFORME':
    include_once("inc/noticiasINFORME.php");
    break;
  case 'noticiasDATATABLE':
    include_once("inc/noticiasDATATABLE.php");
    break;
  case 'acceso':
    include_once("inc/acceso.php");
    break;
}
?>
