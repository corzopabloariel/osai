<?php
session_start();
// incluyo la configuracion local y redbeans
require_once 'config.php';
require_once 'ext/rb.php';

$accion = "";
// acciones
if(isset($_POST["tipo"])) $accion = $_POST["tipo"];
//if(isset($_GET["servidor"])) $accion = "servidor";

switch ($accion) {
  case 'login'://VERIFICAR que hay una session activa
      echo json_encode($_SESSION, JSON_FORCE_OBJECT);
    break;
  case 'log':
    include_once("inc/log.php");
    break;
  case 'query':// Traer datos de las distintas entidades
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
}
?>
