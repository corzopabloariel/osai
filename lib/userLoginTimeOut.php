<?php

if(!isset($_GET['user']))
	exit();
else
	$user = $_GET['user'];
require_once __DIR__ . '/init.php';               // init

if(isset($_GET['ping'])){
	// para notificar que el usuario esta activo
	$t = R::findAll('usuariotimeout','user LIKE ?',[$user]);
	foreach($t as $x) R::trash($x);
	$t = R::dispense('usuariotimeout');
	$t['user'] = $user;
	$t['hora'] = date('H');
	$t['minuto'] = date('i');
	R::store($t);
} elseif(isset($_GET['query'])){
	// CONTROLA QUE NO HAYA MAS DE UN MINUTO DE DIFERENCIA
	$t = R::findOne('usuariotimeout','user LIKE ?',[$user]);
	$hora = date('H');
	$minuto = date('i');
	if($t['hora'] == $hora){
		if((intval($t['minuto']) == (intval($minuto))) or (intval($t['minuto']) == (intval($minuto) - 1))){
			echo "NO";
		} else echo "OK";
	} else echo "OK";
} elseif(isset($_GET['logout'])) {
	// elimino todos los registros de este usuario para que se pueda
	// loguear si ingresa al minuto
	$t = R::findAll('usuariotimeout','user LIKE ?',[$user]);
	foreach($t as $x) R::trash($x);
}
