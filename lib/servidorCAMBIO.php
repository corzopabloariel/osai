<?php
sleep(1);
require_once 'config.php';
require_once 'ext/rb.php';
R::setup("mysql:host=".CONFIG_HOST.";dbname=".CONFIG_BD,CONFIG_USER,CONFIG_PASS);
R::ext('xdispense', function( $type ){ return R::getRedBean()->dispense( $type ); });

$tipo = $_GET["tipo"];

switch($tipo) {
  case "noticia"://CAMBIO FLAG DE NOTICIAS PARA QUE NO SIGA BUSCANDO
    $noticias = R::findOne("noticias","id = ?",[$_GET["id_noticia"]]);
    $noticias["nueva"] = 2;
    R::store($noticias);

    // $notificaciones = R::findAll("notificacion","aviso = ? AND id_noticia = ?",[1,$_GET["id_noticia"]]);
    // foreach($notificaciones AS $n) {
    //   $n["aviso"] = 0;
    //   R::store($n);
    // }
  break;
  case "noticiaRELEVADA":
    $noticias = R::findOne("noticia","id = ?",[$_GET["id_noticia"]]);
    $noticias["nueva"] = 2;
    R::store($noticias);
  break;
  case "alarma":
    $notificacion = R::xdispense('notificacion');
    $notificacion["id_noticia"] = $_GET["id_noticia"];
    $notificacion["mensaje"] = $_GET["msg"];
    $notificacion["aviso"] = 1;
    R::store($notificacion);

    $noticias = R::findOne("noticias","id = ?",[$_GET["id_noticia"]]);
    $noticias["nueva"] = 2;
    R::store($noticias);
    echo $_GET["id_noticia"];
  break;
  case "notificacion":
    $notificacion = R::findOne("notificacion","id = ?",[$_GET["id"]]);
    $notificacion["aviso"] = 2;
    R::store($notificacion);
  break;
  case "notificacionR":
    $notificacion = R::findOne("notificacion","id = ?",[$_GET["id"]]);
    $notificacion["procesar"] = 2;
    R::store($notificacion);
  break;
  case "noticiaR":
    $noticias = R::findOne("noticias","id = ?",[$_GET["id"]]);
    $noticias["moderado"] = 1;
    R::store($noticias);
  break;
  case "noticiaE":
    $noticias = R::findOne("noticias","id = ?",[$_GET["id"]]);
    $noticias["elim"] = 1;
    R::store($noticias);
  break;
}
